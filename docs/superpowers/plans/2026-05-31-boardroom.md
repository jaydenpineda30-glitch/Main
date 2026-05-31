# Boardroom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Boardroom" AI coaching feature to Jayden's personal dashboard — two distinct coach personas (Alex & Chris) that respond together in one conversation, know his real situation from Firestore, run structured session modes (onboarding / morning commit / evening report / drift), remember key moments across sessions, and nudge him in the evening.

**Architecture:** A new `boardroom-service.js` exposes `window.BoardroomService` and talks to the Groq API (Llama 3.3 70B), mirroring how `gemini-service.js`/`ollama-service.js` are loaded as global script tags. The dashboard builds a live context string from `dashData` (reusing the `doCheckin()` pattern at `dashboard.html:1480`) plus a compact "key moments" memory, and makes two parallel Groq calls per user turn — one per persona. All Boardroom state lives under `dashData.boardroom` and persists through the existing `window.DASH_DOC` auto-save. A floating 🧠 button (mirroring the ⚡ Capture FAB at `dashboard.html:2714`) opens the panel and glows based on non-negotiable/check-in status. An optional GitHub Actions cron writes an evening nudge flag.

**Tech Stack:** React 18 (CDN/UMD) + Babel Standalone, Firebase Firestore (compat SDK), Groq API (`llama-3.3-70b-versatile`, OpenAI-compatible endpoint), existing Gemini 2.5 Flash untouched. No build step, no test framework — verification is in-browser against `dashboard.html` opened locally or on the live GitHub Pages site.

**Conventions in this codebase (follow them):**
- Single-file app: almost everything is in `dashboard.html`. Service helpers are separate `*.js` files loaded via `<script>` in `<head>` and attached to `window`.
- ES5-style function expressions (`function(){}`), `var` in service files; the React component tree in `dashboard.html` uses `const`/arrow-free `function` handlers and `useState`. Match the surrounding style of whatever block you edit.
- State changes go through `setData(function(p){ return {...p, ...} })`; persistence is automatic via the effect at `dashboard.html:1385`.
- API keys: stored in `localStorage` AND in the Firestore `settings` doc, trimmed on every read.
- Commits auto-push (post-commit hook) → live in ~60s. Commit per task.

**Open questions (resolve before the phase that needs them):**
- **Evening nudge delivery (Phase 9):** GitHub Actions can run a cron, but it has no way to push a browser/phone notification directly. Decide the channel — (a) write a `boardroom.nudgePending=true` flag into Firestore via the Admin SDK so the dashboard shows the urgent glow next visit (cheapest, no new infra), or (b) email/push via a third-party. This plan implements (a). Confirm before building Phase 9.
- **"Both respond simultaneously":** implemented as two parallel Groq calls (one system prompt each) rendered as two bubbles. Confirmed by the planning note ("Both respond to every message").

---

## File Structure

| File | Create/Modify | Responsibility |
|------|---------------|----------------|
| `boardroom-service.js` | **Create** | `window.BoardroomService`: Groq chat call, persona prompt builders, context builder, key-moment summarizer. Pure logic, no React. |
| `dashboard.html` | **Modify** | Script tag for the new service; `groqKey` state; Boardroom UI state; 🧠 FAB + panel; session-mode detection; glow logic; persistence of `dashData.boardroom`. |
| `monitoring-dashboard.js` | **Modify** | Add a "Groq API Key" field to the Settings panel (`MonitoringPanel`), mirroring the Gemini key field. |
| `.github/workflows/evening-nudge.yml` | **Create** (Phase 9) | Cron at 08:00–08:30pm AEST that runs a node script to set the nudge flag. |
| `boardroom-nudge.js` | **Create** (Phase 9) | Admin-SDK script that reads today's non-negotiable/check-in state and sets `dashData.boardroom.nudgePending`. |
| `HANDOFF.md` | **Modify** (final) | Document the Boardroom feature for the next session. |

`dashData.boardroom` shape (the single source of truth for the feature):

```js
boardroom: {
  onboarded: false,            // has the one-time consultation been completed
  northStar: "",               // North Star Statement produced by onboarding
  messages: [],                // current session transcript: [{role, persona, text, ts}]
  sessionStartedAt: null,      // ISO timestamp of current session start
  keyMoments: [],              // [{date, summary, commitments:[], mode}] — compressed memory
  lastCommit: null,            // {date, items:[...]} from a morning session
  nudgePending: false          // set by the evening cron, cleared when panel opens
}
```

---

## Phase 0: Get a Groq API key (manual, no code)

- [ ] **Step 1: Create the key**

Go to `https://console.groq.com`, sign in, → **API Keys** → **Create API Key**. Copy it (starts with `gsk_`). Groq's free tier covers `llama-3.3-70b-versatile` at generous rate limits for personal use.

- [ ] **Step 2: Confirm the model is available**

In a terminal:

```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer gsk_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"say hi in 3 words"}]}'
```

Expected: a JSON response with `choices[0].message.content`. If you get a model error, run `curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer gsk_YOUR_KEY"` and pick the current 70B Llama model id, then use that everywhere `llama-3.3-70b-versatile` appears below.

---

## Phase 1: Groq service + key plumbing

**Files:**
- Create: `boardroom-service.js`
- Modify: `dashboard.html:18-19` (script tags), `dashboard.html:1168` (key state), `dashboard.html:1403` (settings persist), `dashboard.html:1977-1987` (settings panel props)
- Modify: `monitoring-dashboard.js` (Groq key field)

- [ ] **Step 1: Create `boardroom-service.js` with the Groq call**

```js
/**
 * boardroom-service.js
 * Boardroom AI coaching via Groq (Llama 3.3 70B).
 * Two personas (Alex, Chris) respond to every user turn.
 * Exposes global: window.BoardroomService
 */
(function () {
  'use strict';

  var GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
  var MODEL    = 'llama-3.3-70b-versatile';

  function getKey() {
    try { return (localStorage.getItem('__groq_key__') || '').trim(); } catch (_) { return ''; }
  }

  /**
   * Low-level chat call.
   * @param {string} systemPrompt
   * @param {Array<{role,content}>} history  prior turns (role: 'user'|'assistant')
   * @param {string} userText  the new user message
   * @returns {Promise<string>}
   */
  function chat(systemPrompt, history, userText) {
    var key = getKey();
    if (!key) return Promise.reject(new Error('No Groq API key set — add it in Settings'));
    var messages = [{ role: 'system', content: systemPrompt }]
      .concat(history || [])
      .concat([{ role: 'user', content: userText }]);
    return fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: MODEL, messages: messages, temperature: 0.8, max_tokens: 500 })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (e) {
        throw new Error('Groq ' + r.status + ': ' + ((e.error && e.error.message) || r.statusText));
      });
      return r.json();
    }).then(function (json) {
      if (!json.choices || !json.choices[0]) throw new Error('Empty Groq response');
      return json.choices[0].message.content.trim();
    });
  }

  window.BoardroomService = { chat: chat, _model: MODEL };
}());
```

- [ ] **Step 2: Load the service in `dashboard.html`**

After the existing `<script src="gemini-service.js"></script>` (line 19), add:

```html
<script src="boardroom-service.js"></script>
```

- [ ] **Step 3: Add `groqKey` state in `App()`**

Right after the `geminiKey` state (`dashboard.html:1168`), add:

```js
  const [groqKey,setGroqKey]=useState(function(){try{return localStorage.getItem('__groq_key__')||"";}catch(_){return "";}});
```

- [ ] **Step 4: Restore `groqKey` from Firestore settings on load**

In the settings-restore block (near `dashboard.html:1291`, where `settings.geminiKey` is restored), add a parallel block:

```js
          if(settings.groqKey&&!localStorage.getItem('__groq_key__')){
            var restoredGroq=settings.groqKey.trim();
            setGroqKey(restoredGroq);
            try{localStorage.setItem('__groq_key__',restoredGroq);}catch(_){}
          }
```

- [ ] **Step 5: Persist `groqKey` in the settings doc**

At `dashboard.html:1403`, extend the settings write to include `groqKey`, and add `groqKey` to the effect deps at line 1404:

```js
    window.DASH_DOC.set({settings:{geminiKey:geminiKey,groqKey:groqKey,gcalSelected:gcalSelectedIds,gcalExcluded:gcalExcludedIds}},{merge:true}).catch(function(){});
  },[geminiKey,groqKey,gcalSelectedIds,gcalExcludedIds]);
```

- [ ] **Step 6: Pass `groqKey` to the Settings panel**

At `dashboard.html:1977`, add `groqKey` to the `settings` prop, and handle it in `onSaveSettings` (after the `geminiKey` branch):

```js
        settings={{geminiKey:geminiKey,groqKey:groqKey,githubPAT:(data.settings&&data.settings.githubPAT)||""}}
```
```js
          if(s.groqKey!==undefined){
            var gk=s.groqKey.trim();
            setGroqKey(gk);
            try{localStorage.setItem('__groq_key__',gk);}catch(_){}
          }
```

- [ ] **Step 7: Add the Groq key field in `monitoring-dashboard.js`**

Find the Gemini API key input in `MonitoringPanel` (search for `geminiKey`). Duplicate that input block for `groqKey`: a labelled password-style field bound to `settings.groqKey`, calling `onSaveSettings({groqKey: value})` on change/blur. Match the existing markup and styling exactly.

- [ ] **Step 8: Verify in browser**

Open the dashboard, go to **Logs → Settings**, paste the Groq key, reload the page. In the browser console:

```js
localStorage.getItem('__groq_key__')   // should print your key
BoardroomService.chat('You are a test bot. Reply in 3 words.', [], 'hello')
  .then(console.log).catch(console.error)
```

Expected: console prints a 3-word reply from Llama. If `401`, the key is wrong; if model error, fix the model id per Phase 0 Step 2.

- [ ] **Step 9: Commit**

```bash
git add boardroom-service.js dashboard.html monitoring-dashboard.js
git commit -m "feat(boardroom): add Groq service and API key plumbing"
```

---

## Phase 2: Live context builder

**Files:**
- Modify: `boardroom-service.js` (add `buildContext`)

Reuse the exact data shape that `doCheckin()` reads (`dashboard.html:1495-1549`) so the Boardroom knows the same things the check-in does.

- [ ] **Step 1: Add `buildContext(data, cachedEvs)` to `boardroom-service.js`**

Add inside the IIFE, before the `window.BoardroomService` assignment. This returns a plain string. Port the logic from `doCheckin` (tasks, overdue, upcoming assessments within 7 days, gym streak, body-weight-this-week, last reflection pattern, today's calendar, GoTab shifts). Keep it dependency-free by accepting already-computed values:

```js
  /**
   * Build the live situational context string from dashData.
   * @param {object} d        dashData
   * @param {object} helpers  { todayStr, dStr, daysBetween, isGoTabEvent, thisWeek, cachedEvs }
   */
  function buildContext(d, helpers) {
    var td = helpers.todayStr();
    var ev = helpers.cachedEvs || [];
    var yday = new Date(); yday.setDate(yday.getDate() - 1); var ydayStr = helpers.dStr(yday);
    var todayEvs = ev.filter(function (e) { return e.date === td && !e.allDay; });
    var workingToday = todayEvs.some(helpers.isGoTabEvent);
    var workedYesterday = ev.some(function (e) { return e.date === ydayStr && helpers.isGoTabEvent(e); });

    var tasks = (d.personal && d.personal.tasks) || [];
    var overdue = tasks.filter(function (t) { return !t.done && t.due && t.due < td; });
    var in7 = new Date(); in7.setDate(in7.getDate() + 7); var in7Str = helpers.dStr(in7);
    var upcomingA = ((d.uni && d.uni.assessments) || [])
      .filter(function (a) { return !a.done && a.date >= td && a.date <= in7Str; })
      .sort(function (a, b) { return a.date.localeCompare(b.date); });

    var gymRot = (d.gym && d.gym.rotation) || [];
    var nextGym = gymRot.length ? gymRot[((d.gym && d.gym.rotIdx) || 0) % gymRot.length] : null;
    var workouts = (d.gym && d.gym.workouts) || [];
    var lastWkt = workouts.length ? workouts[workouts.length - 1] : null;
    var daysSinceGym = lastWkt ? Math.abs(helpers.daysBetween(lastWkt.date)) : null;
    var bwThisWeek = !!(d.gym && d.gym.lastBWWeek === helpers.thisWeek);

    var recentRefls = (d.reflections || []).slice(-2).reverse();
    var lastRefl = recentRefls[0] || null;
    var an = (lastRefl && lastRefl.analysis) || {};

    var c = 'WHO: Jayden — TAFE Melbourne accounting student.\n';
    if (workedYesterday) c += 'WORK: GoTab shift yesterday — energy may be lower today.\n';
    if (workingToday)    c += 'WORK: GoTab shift today.\n';
    c += 'CALENDAR TODAY: ' + (todayEvs.length ? todayEvs.map(function (e) { return e.title + (e.time ? ' @ ' + e.time : ''); }).join('; ') : 'nothing scheduled') + '\n';
    if (upcomingA.length) c += 'ASSESSMENTS DUE SOON: ' + upcomingA.map(function (a) { return a.subject + ' ' + a.name + ' in ' + helpers.daysBetween(a.date) + 'd'; }).join('; ') + '\n';
    if (overdue.length)   c += 'OVERDUE TASKS: ' + overdue.map(function (t) { return t.name; }).join(', ') + '\n';
    if (nextGym)          c += 'GYM: next ' + nextGym.name + (daysSinceGym != null ? ' (' + daysSinceGym + 'd since last)' : '') + '\n';
    if (!bwThisWeek)      c += 'GYM: body weight not logged this week.\n';
    if (lastRefl && an.dominantPattern) {
      c += 'LAST REFLECTION PATTERN: ' + an.dominantPattern + (an.recommendation ? ' — rec: ' + an.recommendation : '') + '\n';
    }
    return c;
  }
```

Add `buildContext: buildContext` to the `window.BoardroomService` export.

- [ ] **Step 2: Verify in browser console**

```js
// `data` isn't global; grab it via React devtools, or temporarily expose window.__data = data in App for testing
BoardroomService.buildContext(window.__data, {
  todayStr: ()=>new Date().toISOString().slice(0,10),
  dStr: d=>d.toISOString().slice(0,10),
  daysBetween: ()=>3, isGoTabEvent: ()=>false, thisWeek: 0, cachedEvs: []
})
```

Expected: a multi-line string mentioning Jayden, assessments, gym, etc. Remove any temporary `window.__data` exposure after testing.

- [ ] **Step 3: Commit**

```bash
git add boardroom-service.js
git commit -m "feat(boardroom): add live context builder from dashData"
```

---

## Phase 3: Alex & Chris persona prompts

**Files:**
- Modify: `boardroom-service.js` (persona prompt builders)

- [ ] **Step 1: Add persona prompt builders**

Per the planning note: Alex = Hormozi-inspired (direct, logic, no fluff, short punchy sentences, names data, never "that's okay", redirects excuses to action). Chris = Williamson-inspired (thoughtful, psychologically deep, root-cause first, warm not soft, ONE deep question per response, connects patterns over time). Add:

```js
  function alexPrompt(ctx, northStar, keyMoments, mode) {
    return 'You are Alex, one of two coaches in Jayden\'s Boardroom. Style: Alex Hormozi — direct, logic-based, zero fluff. Short punchy sentences. Name the actual data. Never say "that\'s okay". Redirect excuses to action immediately. You and Chris (a thoughtful, psychological coach) both reply to every message; stay in your lane — push for action and clarity, don\'t do Chris\'s deep emotional digging.\n\n'
      + 'JAYDEN\'S SITUATION:\n' + ctx
      + (northStar ? '\nNORTH STAR: ' + northStar + '\n' : '')
      + (keyMoments && keyMoments.length ? '\nWHAT YOU REMEMBER:\n' + keyMoments.map(function (m) { return '- ' + m.date + ': ' + m.summary; }).join('\n') + '\n' : '')
      + '\nSESSION MODE: ' + mode + '\n'
      + '\nReply in under 70 words. No preamble, no "as Alex". Talk straight to Jayden.';
  }

  function chrisPrompt(ctx, northStar, keyMoments, mode) {
    return 'You are Chris, one of two coaches in Jayden\'s Boardroom. Style: Chris Williamson — thoughtful, psychologically deep, seek the root cause before solutions. Warm but not soft. Ask exactly ONE deep question per response. Connect patterns across time when you can. You and Alex (a direct, action-focused coach) both reply to every message; stay in your lane — understanding and insight, not Alex\'s drill-sergeant push.\n\n'
      + 'JAYDEN\'S SITUATION:\n' + ctx
      + (northStar ? '\nNORTH STAR: ' + northStar + '\n' : '')
      + (keyMoments && keyMoments.length ? '\nWHAT YOU REMEMBER:\n' + keyMoments.map(function (m) { return '- ' + m.date + ': ' + m.summary; }).join('\n') + '\n' : '')
      + '\nSESSION MODE: ' + mode + '\n'
      + '\nReply in under 70 words. No preamble, no "as Chris". End with one genuine question.';
  }
```

Export both: add `alexPrompt: alexPrompt, chrisPrompt: chrisPrompt` to `window.BoardroomService`.

- [ ] **Step 2: Verify both personas sound different**

```js
var ctx='WHO: Jayden. ASSESSMENTS DUE SOON: Law AT2 in 2d. OVERDUE TASKS: meal prep.';
Promise.all([
  BoardroomService.chat(BoardroomService.alexPrompt(ctx,'',[],'evening'),[], 'I didn\'t get much done today'),
  BoardroomService.chat(BoardroomService.chrisPrompt(ctx,'',[],'evening'),[], 'I didn\'t get much done today')
]).then(function(r){console.log('ALEX:',r[0]);console.log('CHRIS:',r[1]);})
```

Expected: Alex is blunt/action-oriented and names the Law assessment/meal prep; Chris is reflective and ends with one question. If they sound too similar, tighten the style lines.

- [ ] **Step 3: Commit**

```bash
git add boardroom-service.js
git commit -m "feat(boardroom): add Alex and Chris persona prompts"
```

---

## Phase 4: Floating 🧠 button + chat panel UI

**Files:**
- Modify: `dashboard.html` — Boardroom UI state in `App()`; FAB near the ⚡ button (line 2714); panel modal; send handler.

- [ ] **Step 1: Add Boardroom UI state in `App()`**

Near the capture state (`dashboard.html:1109-1113`), add:

```js
  const [showBoardroom,setShowBoardroom]=useState(false);
  const [brMessages,setBrMessages]=useState(function(){try{return (data&&data.boardroom&&data.boardroom.messages)||[];}catch(_){return [];}});
  const [brInput,setBrInput]=useState("");
  const [brLoading,setBrLoading]=useState(false);
```

(Note: `data` may not be ready at first render; also seed `brMessages` from `data.boardroom.messages` inside the load effect once `data` is set.)

- [ ] **Step 2: Add the session-mode helper**

Add this function inside `App()` (used by the send handler and the glow logic). Drift detection per the note: "detected by time of day" — treat afternoon with no check-in as drift.

```js
  function brSessionMode(){
    var h=new Date().getHours();
    if(!(data.boardroom&&data.boardroom.onboarded)) return "onboarding";
    if(h<11) return "morning";
    if(h>=17) return "evening";
    return "drift";
  }
```

- [ ] **Step 3: Add the send handler**

This makes two parallel Groq calls and appends a user turn plus two persona turns. History sent to Groq is the prior transcript flattened to `{role, content}` (persona replies become `assistant` turns prefixed with the name so each model sees the other's last reply).

```js
  function brSend(){
    var text=brInput.trim();
    if(!text||brLoading) return;
    if(!groqKey.trim()){showToast("Add your Groq API key in Settings first","warn");return;}
    setBrLoading(true);
    var mode=brSessionMode();
    var cachedEvs=[];try{var ce=localStorage.getItem('__gcal_events__');if(ce)cachedEvs=JSON.parse(ce);}catch(_){}
    var ctx=BoardroomService.buildContext(data,{todayStr:todayStr,dStr:dStr,daysBetween:daysBetween,isGoTabEvent:isGoTabEvent,thisWeek:thisWeek,cachedEvs:cachedEvs});
    var ns=(data.boardroom&&data.boardroom.northStar)||"";
    var km=(data.boardroom&&data.boardroom.keyMoments)||[];
    // flatten transcript to OpenAI history
    var hist=brMessages.map(function(m){return m.role==="user"?{role:"user",content:m.text}:{role:"assistant",content:m.persona+": "+m.text};});
    var userMsg={role:"user",persona:null,text:text,ts:Date.now()};
    setBrMessages(function(p){return p.concat([userMsg]);});
    setBrInput("");
    Promise.all([
      BoardroomService.chat(BoardroomService.alexPrompt(ctx,ns,km,mode),hist,text),
      BoardroomService.chat(BoardroomService.chrisPrompt(ctx,ns,km,mode),hist,text)
    ]).then(function(r){
      var alexMsg={role:"assistant",persona:"Alex",text:r[0],ts:Date.now()};
      var chrisMsg={role:"assistant",persona:"Chris",text:r[1],ts:Date.now()+1};
      setBrMessages(function(p){return p.concat([alexMsg,chrisMsg]);});
      setBrLoading(false);
    }).catch(function(e){showToast("Boardroom: "+(e&&e.message||"error"),"error");setBrLoading(false);});
  }
```

- [ ] **Step 4: Add the 🧠 FAB**

Directly after the ⚡ Capture button (`dashboard.html:2714-2716`), add a sibling button. Position it above the Capture FAB so they don't overlap (`bottom: mob?122:140`). Glow classes come in Phase 8 — for now a static style mirroring the Capture FAB gradient:

```jsx
      <button onClick={function(){trk("boardroom.open");setShowBoardroom(true);if(data.boardroom&&data.boardroom.nudgePending){setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),nudgePending:false}};});}}} style={{position:"fixed",bottom:mob?122:140,right:20,zIndex:150,background:"linear-gradient(135deg,#2f6bff,#7b2fff)",border:"none",borderRadius:99,padding:"11px 18px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(99,102,241,0.45)",display:"flex",alignItems:"center",gap:7,letterSpacing:0.2}}>
        <span style={{fontSize:15}}>🧠</span>Boardroom
      </button>
```

- [ ] **Step 5: Add the panel modal**

Mirror the Capture modal (`dashboard.html:2719`). Full-screen on mobile, large panel on desktop. Render `brMessages`: user turns right-aligned; Alex turns with a 🔵 label, Chris turns with a 🟣 label. Input box + Send button calls `brSend()`; Enter sends. Show a "thinking…" indicator when `brLoading`. Use existing theme vars (`T.accent`, `T.text3`, etc.).

```jsx
      {showBoardroom&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.92)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",display:"flex",alignItems:mob?"stretch":"center",justifyContent:"center",zIndex:200,padding:mob?"0":"16px"}} onClick={function(){setShowBoardroom(false);}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:"rgba(10,12,32,0.98)",border:"1px solid rgba(99,102,241,0.4)",borderRadius:mob?0:16,width:mob?"100%":680,maxWidth:"100%",height:mob?"100%":"80vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>🧠 Boardroom</span>
            <button onClick={function(){setShowBoardroom(false);}} style={{background:"none",border:"none",color:T.text3,fontSize:20,cursor:"pointer"}}>×</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
            {brMessages.length===0&&<div style={{color:T.text3,fontSize:13,textAlign:"center",marginTop:24}}>Alex and Chris are here. Tell them how your day's going.</div>}
            {brMessages.map(function(m,i){
              if(m.role==="user")return <div key={i} style={{alignSelf:"flex-end",maxWidth:"80%",background:"linear-gradient(135deg,#7b2fff,#c77dff)",color:"#fff",padding:"9px 13px",borderRadius:14,fontSize:13}}>{m.text}</div>;
              var isAlex=m.persona==="Alex";
              return <div key={i} style={{alignSelf:"flex-start",maxWidth:"85%"}}><div style={{fontSize:11,fontWeight:700,color:isAlex?"#5b9bff":"#c77dff",marginBottom:3}}>{isAlex?"🔵 Alex":"🟣 Chris"}</div><div style={{background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.1)",color:"#e8e9f3",padding:"9px 13px",borderRadius:14,fontSize:13,whiteSpace:"pre-wrap"}}>{m.text}</div></div>;
            })}
            {brLoading&&<div style={{color:T.text3,fontSize:12,fontStyle:"italic"}}>Alex & Chris are thinking…</div>}
          </div>
          <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:8}}>
            <input value={brInput} onChange={function(e){setBrInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")brSend();}} placeholder="Talk to the Boardroom…" style={{flex:1,background:"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none"}}/>
            <button onClick={brSend} disabled={brLoading} style={{background:"linear-gradient(135deg,#2f6bff,#7b2fff)",border:"none",borderRadius:10,padding:"0 16px",color:"#fff",fontWeight:700,fontSize:13,cursor:brLoading?"default":"pointer",opacity:brLoading?0.6:1}}>Send</button>
          </div>
        </div>
      </div>}
```

- [ ] **Step 6: Verify in browser**

Reload, tap 🧠 Boardroom, send "I feel like I'm drifting". Expected: a user bubble, then an Alex bubble (blunt) and a Chris bubble (reflective, ends with a question). Test on mobile view (📱 button) — panel should be full-screen.

- [ ] **Step 7: Commit**

```bash
git add dashboard.html
git commit -m "feat(boardroom): floating button and two-persona chat panel"
```

---

## Phase 5: Persist the conversation + key-moment capture

**Files:**
- Modify: `boardroom-service.js` (summarizer), `dashboard.html` (persistence, end-session)

- [ ] **Step 1: Persist `brMessages` into `dashData.boardroom.messages`**

In `brSend`'s success branch, after appending the two persona messages, also write them into `data` so the existing auto-save persists them:

```js
      setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),messages:(brMessages||[]).concat([userMsg,alexMsg,chrisMsg]),sessionStartedAt:(p.boardroom&&p.boardroom.sessionStartedAt)||new Date().toISOString()}};});
```

(The auto-save effect at `dashboard.html:1385` then writes it to Firestore — no extra write needed.)

- [ ] **Step 2: Add a key-moment summarizer to `boardroom-service.js`**

After a session, compress the transcript into one key moment (Gemini could do this, but keep it on Groq for consistency). Add:

```js
  function summarizeSession(transcript, mode) {
    var convo = transcript.map(function (m) { return (m.persona || 'Jayden') + ': ' + m.text; }).join('\n');
    var prompt = 'Summarize this coaching session in ONE sentence (max 25 words) capturing the key realization or commitment. Then list any concrete commitments Jayden made as a JSON array of short strings. Respond ONLY as JSON: {"summary":"...","commitments":["..."]}\n\nSESSION (' + mode + '):\n' + convo;
    return chat('You compress coaching sessions into durable memory. Be precise, no fluff.', [], prompt)
      .then(function (text) {
        var m = text.match(/\{[\s\S]*\}/);
        return m ? JSON.parse(m[0]) : { summary: text.slice(0, 120), commitments: [] };
      });
  }
```

Export `summarizeSession`.

- [ ] **Step 3: Add an "End session" action**

In the panel header, add a small "End session" button. On click: if there are ≥2 messages, call `summarizeSession(brMessages, brSessionMode())`, push the result into `dashData.boardroom.keyMoments`, clear `messages`, and close the panel:

```js
  function brEndSession(){
    if(brMessages.length<2){setShowBoardroom(false);return;}
    var mode=brSessionMode();
    BoardroomService.summarizeSession(brMessages,mode).then(function(km){
      setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),keyMoments:((p.boardroom&&p.boardroom.keyMoments)||[]).concat([{date:todayStr(),summary:km.summary,commitments:km.commitments||[],mode:mode}]),messages:[],sessionStartedAt:null,lastCommit:(mode==="morning"&&km.commitments&&km.commitments.length)?{date:todayStr(),items:km.commitments}:(p.boardroom&&p.boardroom.lastCommit)||null}};});
      setBrMessages([]);
      setShowBoardroom(false);
      showToast("Session saved to memory","success");
    }).catch(function(){setShowBoardroom(false);});
  }
```

- [ ] **Step 4: Cap key moments to keep tokens manageable**

Per the note ("amalgamated after ~15 sessions"): when `keyMoments.length > 15`, before adding the new one, collapse the oldest 10 into a single amalgamated moment via `summarizeSession`-style call, OR simplest first pass — keep only the most recent 15 (`.slice(-15)`). Implement the `.slice(-15)` version now; leave a `// TODO amalgamate` note. Apply `.slice(-15)` in the Step 3 `keyMoments` concat.

- [ ] **Step 5: Verify persistence**

Have a short conversation, click **End session**, reload the page, open the Boardroom. Expected: transcript is cleared (new session) but in the browser console `window.__data.boardroom.keyMoments` (temporarily exposed) shows the saved summary. Send a new message — the persona "WHAT YOU REMEMBER" context now includes it (visible if you log the prompt).

- [ ] **Step 6: Commit**

```bash
git add boardroom-service.js dashboard.html
git commit -m "feat(boardroom): persist sessions and capture key moments to memory"
```

---

## Phase 6: Onboarding consultation flow

**Files:**
- Modify: `boardroom-service.js` (onboarding prompts + North Star extractor), `dashboard.html` (first-run flow)

Per the note: one-time consultation. Chris handles personal development, Alex handles goals. Output is a North Star Statement.

- [ ] **Step 1: Add an onboarding system-prompt variant**

When `mode === 'onboarding'`, the personas should run a consultation rather than a check-in. Extend `alexPrompt`/`chrisPrompt`: when `mode==='onboarding'`, append an instruction block — Alex probes concrete goals (career, body comp, money, skills) and timelines; Chris probes values, what "better" means, what's been holding him back. Keep the same 70-word limit. Add a guard in each prompt builder:

```js
    + (mode === 'onboarding'
        ? '\nThis is the FIRST consultation. ' + (/* Alex: */ 'Dig into his concrete goals and timelines — career, body, money, skills. One sharp question at a time.')
        : '')
```

(Use the Alex-flavored text in `alexPrompt`, a Chris-flavored values/identity version in `chrisPrompt`.)

- [ ] **Step 2: Add a North Star extractor**

After enough onboarding turns, synthesize the statement:

```js
  function buildNorthStar(transcript) {
    var convo = transcript.map(function (m) { return (m.persona || 'Jayden') + ': ' + m.text; }).join('\n');
    return chat('You synthesize a single North Star Statement: one paragraph (max 60 words) capturing who Jayden is becoming and why it matters. Second person ("You are..."). No lists.', [], 'CONSULTATION:\n' + convo);
  }
```

Export `buildNorthStar`.

- [ ] **Step 3: First-run trigger**

When the Boardroom opens and `!data.boardroom.onboarded`, seed `brMessages` with an opening line from each persona (a welcome + first question) instead of the empty-state text. Add a "Finish setup" button (replaces "End session" while onboarding) that calls `buildNorthStar(brMessages)`, then:

```js
  function brFinishOnboarding(){
    BoardroomService.buildNorthStar(brMessages).then(function(ns){
      setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),onboarded:true,northStar:ns.trim(),messages:[],sessionStartedAt:null}};});
      setBrMessages([]);
      showToast("North Star set. The Boardroom knows your direction now.","success");
    });
  }
```

- [ ] **Step 4: Verify**

In console, temporarily set `window.__data.boardroom.onboarded=false` and reopen. Expected: personas open with consultation questions; after a few exchanges, **Finish setup** produces a North Star stored in `data.boardroom.northStar` and subsequent sessions inject it.

- [ ] **Step 5: Commit**

```bash
git add boardroom-service.js dashboard.html
git commit -m "feat(boardroom): onboarding consultation and North Star statement"
```

---

## Phase 7: Memory architecture polish (amalgamation)

**Files:**
- Modify: `boardroom-service.js`

Replace the Phase 5 `.slice(-15)` stopgap with real amalgamation.

- [ ] **Step 1: Add `amalgamate(oldMoments)`**

```js
  function amalgamate(oldMoments) {
    var text = oldMoments.map(function (m) { return m.date + ': ' + m.summary + (m.commitments && m.commitments.length ? ' [' + m.commitments.join('; ') + ']' : ''); }).join('\n');
    return chat('You compress multiple coaching memories into 2-3 durable pattern statements (max 30 words each). Focus on recurring themes, not events. Respond as a JSON array of strings.', [], text)
      .then(function (t) { var m = t.match(/\[[\s\S]*\]/); return m ? JSON.parse(m[0]) : [oldMoments.map(function(x){return x.summary;}).join(' ')]; });
  }
```

Export it.

- [ ] **Step 2: Use it in `brEndSession`**

Before saving a new key moment, if `keyMoments.length >= 15`, call `amalgamate(keyMoments.slice(0,10))`, prepend the resulting pattern strings (as `{date:'pattern', summary, commitments:[]}` entries) and keep `keyMoments.slice(10)`. Chain it before `setData` so the write includes the compacted array. Replace the `.slice(-15)` from Phase 5 Step 4.

- [ ] **Step 3: Verify**

In console, seed `window.__data.boardroom.keyMoments` with 16 fake moments, run an end-session, confirm the array shrinks and the oldest are replaced by 2-3 pattern strings.

- [ ] **Step 4: Commit**

```bash
git add boardroom-service.js dashboard.html
git commit -m "feat(boardroom): amalgamate old key moments into patterns"
```

---

## Phase 8: Glowing 🧠 button logic

**Files:**
- Modify: `dashboard.html` (glow state + button class), `dashboard.css` (keyframes)

Per the note: **soft glow** = a non-negotiable missed today; **urgent glow** = no check-in by midday (or `nudgePending`).

- [ ] **Step 1: Compute glow level in `App()`**

Non-negotiables (meal prep weekly, 6 meals daily, sleep, one productive task) aren't all tracked yet — use what exists: "one productive task completed today" maps to any task with `done && completedAt===today` (or simplest: any `done` task today). Define:

```js
  function brGlow(){
    var b=data.boardroom||{};
    if(b.nudgePending) return "urgent";
    var h=new Date().getHours();
    var didCheckin=(checkinBlocks&&checkinBlocks.length>0);
    if(h>=12&&!didCheckin) return "urgent";
    var tasks=(data.personal&&data.personal.tasks)||[];
    var doneToday=tasks.some(function(t){return t.done;});
    if(!doneToday) return "soft";
    return "none";
  }
```

(Refine the non-negotiable check when those fields exist; this is the first-pass mapping.)

- [ ] **Step 2: Apply glow class to the FAB**

Compute `var glow=brGlow();` in render and add a className to the 🧠 button from Step 4 of Phase 4:

```jsx
className={glow==="urgent"?"br-glow-urgent":glow==="soft"?"br-glow-soft":""}
```

- [ ] **Step 3: Add keyframes to `dashboard.css`**

```css
@keyframes brSoft { 0%,100%{box-shadow:0 4px 20px rgba(99,102,241,0.45);} 50%{box-shadow:0 4px 28px rgba(255,209,102,0.6);} }
@keyframes brUrgent { 0%,100%{box-shadow:0 4px 20px rgba(255,107,107,0.5);} 50%{box-shadow:0 4px 32px rgba(255,107,107,0.95);} }
.br-glow-soft { animation: brSoft 2.4s ease-in-out infinite; }
.br-glow-urgent { animation: brUrgent 1.4s ease-in-out infinite; }
```

- [ ] **Step 4: Verify**

Force each state in console (`window.__data.boardroom.nudgePending=true`, or set system clock past midday with no check-in) and confirm the button pulses amber (soft) / red (urgent), and opening it clears `nudgePending`.

- [ ] **Step 5: Commit**

```bash
git add dashboard.html dashboard.css
git commit -m "feat(boardroom): glowing button for missed non-negotiables and check-ins"
```

---

## Phase 9: Evening nudge (GitHub Actions) — confirm delivery channel first

**Files:**
- Create: `boardroom-nudge.js`, `.github/workflows/evening-nudge.yml`

> **Blocked on the open question above.** This implements option (a): the cron sets `dashData.boardroom.nudgePending=true` so the button glows urgent on Jayden's next visit. Confirm before building.

- [ ] **Step 1: Create `boardroom-nudge.js` (Admin SDK)**

Mirror `export-to-obsidian.js`'s Admin SDK setup (same service-account JSON). Read `users/{uid}`, check whether a check-in happened today / non-negotiables were hit; if not, set `dashData.boardroom.nudgePending=true`:

```js
const admin = require('firebase-admin');
const sa = require('./personal-dashboard-53b0d-firebase-adminsdk-fbsvc-1d6afe66d0.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const UID = 'hG4uA1WxQJdQ6yyZtvrrh8WyV2v2';
(async () => {
  const ref = admin.firestore().collection('users').doc(UID);
  const snap = await ref.get();
  const d = snap.data() || {};
  // (light heuristic — set pending; the glow logic decides specifics client-side)
  await ref.set({ dashData: { boardroom: { nudgePending: true } } }, { merge: true });
  console.log('nudge set');
  process.exit(0);
})();
```

(Confirm the deep-merge behaves; `export-to-obsidian.js` shows how this project reads the same doc.)

- [ ] **Step 2: Create the workflow**

```yaml
name: Boardroom evening nudge
on:
  schedule:
    - cron: '0 10 * * *'   # ~8pm AEST (UTC+10). Adjust for DST/AEDT if needed.
  workflow_dispatch:
jobs:
  nudge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install firebase-admin
      - run: echo "$SA_JSON" > personal-dashboard-53b0d-firebase-adminsdk-fbsvc-1d6afe66d0.json
        env: { SA_JSON: ${{ secrets.FIREBASE_SA_JSON }} }
      - run: node boardroom-nudge.js
```

Add the service-account JSON as repo secret `FIREBASE_SA_JSON` (never commit the file — it's already gitignored).

- [ ] **Step 3: Verify**

Trigger the workflow manually (`workflow_dispatch`), confirm it succeeds and that `dashData.boardroom.nudgePending` flips to `true` in Firestore, and the dashboard shows the urgent glow on next load.

- [ ] **Step 4: Commit**

```bash
git add boardroom-nudge.js .github/workflows/evening-nudge.yml
git commit -m "feat(boardroom): evening nudge via GitHub Actions cron"
```

---

## Phase 10: Session-mode wiring + morning/evening loop + docs

**Files:**
- Modify: `dashboard.html` (mode-aware openers, commit/report linkage), `HANDOFF.md`

- [ ] **Step 1: Mode-aware session openers**

When the panel opens (and `messages` is empty), seed an opening line appropriate to `brSessionMode()`:
- **morning** → personas suggest 1–3 commitments from context; Jayden confirms (their first messages propose, his reply confirms, `brEndSession` records `lastCommit`).
- **evening** → if `data.boardroom.lastCommit.date===todayStr()`, open with "This morning you committed to X — how'd it go?"; else "Walk me through your day."
- **drift** → Chris leads: "You opened this mid-afternoon. What's going on?"

Implement as a `brOpener(mode)` returning seed messages, called in the 🧠 button onClick when `brMessages.length===0`.

- [ ] **Step 2: Connect today to direction**

Add a line to both persona prompts (the "most important insight" from the note): "Always connect what he did today to where he's going (his North Star) — not just whether he did the thing." Append to the base prompt after the North Star block.

- [ ] **Step 3: Update `HANDOFF.md`**

Add a "Boardroom" section documenting: the `dashData.boardroom` shape, `boardroom-service.js` API, the two personas, session modes, the Groq key in Settings, and the nudge workflow. Mirror the existing handoff style.

- [ ] **Step 4: Verify end-to-end**

Walk all four modes by changing the system clock / `onboarded` flag: onboarding → morning commit → evening report (references the commit) → drift. Confirm memory carries across, North Star is referenced, glow reflects state.

- [ ] **Step 5: Commit**

```bash
git add dashboard.html HANDOFF.md
git commit -m "feat(boardroom): session modes, morning/evening loop, docs"
```

---

## Self-Review Notes (coverage against the planning note)

- Two personalities (Alex/Chris) → Phase 3 ✓
- Groq + Llama 3.3 70B, Gemini untouched → Phases 0–1 ✓
- Memory: live context + key moments, ~15-session amalgamation → Phases 2, 5, 7 ✓
- Session modes (onboarding/morning/evening/drift) → Phases 6, 10 ✓
- Floating 🧠 button, mobile full-screen → Phase 4 ✓
- Soft/urgent glow → Phase 8 ✓
- Evening nudge via GitHub Actions → Phase 9 (pending channel confirmation) ✓
- North Star + progressive refinement → Phases 6, 10 ✓
- "Connect today to direction" insight → Phase 10 Step 2 ✓

**Deferred / first-pass simplifications to revisit:** non-negotiable tracking fields don't exist in `dashData` yet (Phase 8 uses a proxy — "any task done today"); if you want true meal-prep/6-meals/sleep tracking, that's a separate data-model change worth its own mini-plan.
