# Dashboard Handoff — May 16 2026 (operational facts updated 2026-08-09)

> **Current state, 2026-08-09.** Jarvis (stages 1–4) is built, tested and
> verified against real data on `worktree-jarvis-signals` — **not merged, not
> live.** See the Jarvis section below. Merging is a fast-forward with no
> conflicts, and GitHub Pages publishes straight from `main`, so **merging is
> what makes it live** — there is no separate deploy gate.
>
> **Known and unactioned:** `settings.githubPAT` is copied in plain text into
> every exported backup in the OneDrive-synced vault. Deferred by Jayden until
> Jarvis is finished. Rotating the token matters more than moving it, because old
> exports cannot be un-copied — and any AI key added later lands in the same
> `settings` object, so fix the storage before adding keys.

> **Current state (2026-06-24):** the redesign is merged to `main`, and the app is
> now **precompiled** — JSX lives in `app.jsx`, compiled to `app.js` by `build.js`.
> Edit `app.jsx`, run `node build.js` (a pre-commit hook does this too), then push.
> See `README.md` and the Obsidian note "Build Workflow — Precompiled App". The
> session log below is historical (May 16) — architecture is still accurate, but
> file/workflow details have moved on; this top block is the source of truth.

## What This Project Is

Jayden's personal dashboard — a React 18 (CDN/UMD) app, Firebase Auth + Firestore,
Google Calendar API (read-only), Gemini 2.5 Flash, and Groq for the Boardroom.
JSX is precompiled to `app.js` (no in-browser Babel).

- **Live site:** `https://jaydenpineda30-glitch.github.io/Main/dashboard.html`
- **GitHub repo:** `git@github.com:jaydenpineda30-glitch/Main.git`
- **Local files:** Windows `C:\Users\Jayde\my-project` · Mac `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` (being relocated out of OneDrive)

**Neither machine auto-pushes.** A commit is local until you `git push`, and pushing to `main`
deploys the live site (~60s via GitHub Pages).

Hooks live in the tracked `.githooks/` directory, not `.git/hooks` — Git never clones the latter,
which is why the two machines silently disagreed until 2026-08-02. **One-time setup per machine:**

```bash
git config core.hooksPath .githooks
npm install                              # build.js needs @babel/standalone
```

Without it, nothing rebuilds `app.js` on commit and the live site goes stale. `build-check.yml`
catches this in CI, but only after the fact.

---

## Key Files

| File | Purpose |
|------|---------|
| `app.jsx` | **The app** — React, UI, Firebase logic (edit this; compiled to `app.js`) |
| `app.js` | Generated bundle (do not hand-edit); `dashboard.html` is now just the shell that loads it |
| `build.js` | Compiles `app.jsx` → `app.js` |
| `jarvis-signals.js` | **Jarvis's ranking rules** — decides what matters next across uni, tasks, money, gym and work. Pure, tested, no network. Works with no API key. |
| `jarvis-view.js` | Trust boundary: what a model is allowed to put **on screen** |
| `jarvis-intent.js` | Trust boundary: what a model is allowed to **change**, plus reconciling a proposal against real data before you confirm |
| `jarvis-service.js` | The only Jarvis file that touches the network (Gemini 3.5 Flash) |
| `gemini-service.js` | Quick Capture classification. ⚠️ On the request shape Google retired 8 June 2026 — see Gemini Setup |
| `ollama-service.js` | Reflection analysis. ⚠️ Same stale request shape. The check-in half is dead code — the Daily Check-in was removed |
| `gcal-sync.js` | Google Calendar read-only sync |
| `export-to-obsidian.js` | Automated Obsidian export via Firebase Admin SDK |
| `firebase-rules.txt` | Firestore security rules — paste into Firebase Console if rules need updating |
| `personal-dashboard-53b0d-firebase-adminsdk-fbsvc-1d6afe66d0.json` | Firebase service account key — **never commit this** (in .gitignore) |

---

## Firebase / Data Structure

- **Auth:** Google Sign-In
- **Jayden's UID:** `hG4uA1WxQJdQ6yyZtvrrh8WyV2v2`
- **Project ID:** `personal-dashboard-53b0d`
- **Main data:** `users/{uid}` → `dashData` field (auto-saved on every change)
- **Captures:** `users/{uid}/captures/{docId}` — root-level collection was moved here to fix permissions
- **Reflections:** stored inside `dashData.reflections[]` array (not a subcollection)

---

## Gemini Setup

- **API key:** Stored in `localStorage.__gemini_key__` + Firestore `settings.geminiKey`
- **Key location in dashboard:** Logs → Settings → Gemini API Key field
- **Key is trimmed** on all read paths to prevent whitespace issues

### Two different call shapes now live in this repo

| | Model | Request shape | Auth |
|---|---|---|---|
| `jarvis-service.js` | `gemini-3.5-flash` | `/v1beta/interactions`, `response_format` + schema | `x-goog-api-key` header |
| `gemini-service.js`, `ollama-service.js`, `boardroom-service.js` | `gemini-2.5-flash` | `:generateContent`, `generationConfig.responseMimeType` | key in the query string |

> ⚠️ **The second row is stale.** Google restructured this API in May 2026 —
> `steps` replaced `outputs`, `response_mime_type` was folded into a polymorphic
> `response_format`, and **the legacy schema was removed on 8 June 2026**. Those
> three services were deliberately not migrated: the Daily Check-in is gone,
> Boardroom is being retired, and captures are moving to Obsidian. If Quick
> Capture or reflection analysis is ever wanted again, they need the shape in
> row one, not a key.
>
> Checked against the live API on 2026-08-08, not assumed. `gemini-3.5-flash`
> works; the key belongs in a header, not the URL, because URLs reach browser
> history, referrers and server logs.

### Latency, measured

A real grounded question takes **~8 seconds**; even a one-word reply takes 3–5s,
because this model thinks before answering. The timeout is 25s. Thinking does
not appear to be controllable — `thinking_level`, `thinking_config`, `thinking`
and `reasoning_effort` are all rejected as unknown parameters.

---

## What We Built This Session (May 16 2026)

### 1. Replaced Ollama with Gemini for daily check-in
`doCheckin()` now calls Gemini 2.5 Flash with full personalized context:
- GoTab shifts from Google Calendar (detected via `isGoTabEvent()`)
- Upcoming assessments from `data.uni.assessments`
- Gym streak and next session
- Last reflection's dominant pattern
- Pending tasks + overdue count

Check-in output is 3 blocks: Your Day Ahead / Suggestion / Check-in question.

### 2. Removed drag-and-drop from task scheduling
All drag state (`dragTaskId`, `dragOverDay`, `dropTaskOnDay`) and handlers removed entirely. Scheduling is now click-only: click the ⠿ button on a task → tap a calendar day → time picker opens.

### 3. Fixed mobile calendar scheduling
Long-press (600ms touch timer) was preventing scheduling on mobile. Replaced with single `onClick` — works on both desktop and phone.

### 4. Changed scheduling emoji to ⠿
The 📅 emoji was replaced with a subtle dot-grid character (⠿) on the task scheduling button.

### 5. Body weight entry deletion
Added `deleteBWEntry(dateStr)` function. × buttons appear on each BW entry in the Gym card and Progress tab. Deleting this week's entry resets `lastBWWeek` to null so the "Log weight" prompt reappears.

### 6. Cursor-tracking spotlight + background glow on cards
- CSS `--mouse-x` / `--mouse-y` custom properties updated via global mousemove useEffect
- `.card-rim` class: rim border + cursor spotlight (`::before`) + background illumination on hover (`box-shadow`)
- `.glow-item` class: applied to task rows, weather widget, check-in box
- Applied to: all section cards, task rows, daily check-in, weather widget

### 7. Obsidian export — fully automated
Previously required: visit Captures tab → click ⬇ Obsidian → move JSON → run script manually.

Now: **Windows Task Scheduler runs at 6am daily** — no browser, no manual steps.

- `export-to-obsidian.js` uses Firebase Admin SDK with service account
- Reads `users/{uid}/captures` directly from Firestore
- Reads `dashData.reflections` from the user document
- Writes `.md` files to `C:\Users\Jayde\OneDrive\Documents\Obsidian Vault\Dashboard\`
- Idempotent — skips files that already exist

Vault structure:
```
Obsidian Vault/
  Dashboard/
    Captures/   YYYY-MM-DD Title.md
    Reflections/ YYYY-MM-DD Weekly Reflection.md
```

The ⬇ Obsidian button in the dashboard nav still exists but is now optional (manual fallback only).

### 8. Captures Firestore path fix
Moved from root-level `captures` collection to `users/{uid}/captures` subcollection. Root collection was blocked by security rules catch-all. The existing subcollection catch-all rule in `firebase-rules.txt` covers it automatically.

Three places updated in `dashboard.html`:
- `useEffect` that loads captures when navigating to Captures tab
- `submitCapture()` that saves new captures
- Refresh button onClick on the Captures page

---

## Jarvis (added 2026-08-07 to 2026-08-09)

The card at the top of the home page that answers "what should I do next". It is
the only thing in Athena that compares **across** areas — money against uni
against tasks — and picks. That comparison is the whole product.

**The rule everything rests on: ranking is plain rules; the model only phrases.**
Jarvis is fully correct with no API key. Nothing about priority is decided by an
LLM, so it can be read, argued with and unit-tested.

| Stage | What it does | State |
|---|---|---|
| 1 — He speaks | Ranked card, always says something | ✅ |
| 2 — You ask | "Ask Jarvis…" box, grounded answers | ✅ needs a Gemini key |
| 3 — He acts | Proposes a change, you confirm, then it writes | ✅ |
| 4 — Front door | Clicking a card takes you to the exact row | ✅ Boardroom removal **deferred** |

### The rules that keep it honest

These were each learned by a bug, and breaking them reintroduces one:

1. **A candidate's text may only describe its own facts.** It cannot say "the
   paragraph above" or "everything else can wait" — it does not know where it
   will rank. `floorOnly` marks candidates that only make sense on a calm day.
2. **Never recompute Jayden's money.** `app.jsx` works it out and hands it in.
   One calculation means the Finance tab and Jarvis cannot disagree.
3. **A confirm dialog describes reality, not the model's claim.**
   `JarvisIntent.resolve()` checks ids against real tasks first, so it can never
   say "Move 3 tasks" and move one.
4. **Silence is a failure state.** `rank()` never returns an empty list.
5. **Say what you cannot do.** Jarvis cannot delete anything. It must say so
   rather than claiming the item does not exist.

### Verifying it

```bash
npm test          # 191 tests
```

Tests are necessary and not sufficient. **Every real bug this project found came
from running the ranker over a real backup and reading the sentences**, or from
using it in the browser — not from the suite. Do both:

```bash
node -e "
const fs=require('fs'), JS=require('./jarvis-signals.js');
const raw=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
const data=raw.dashData||raw.data||raw;
JS.rank({data,gcalEvents:[],today:process.argv[2]}).forEach((c,i)=>
  console.log((i?'   ':'>> ')+'['+c.score+' '+c.band+'] '+c.headline+'\n        '+c.why));
" "<a backup from Dashboard/Backups>" 2026-08-09
```

Try a busy day, a calm one, and a date months ahead. A far-future date replays
the semester forward and is how the worst bug was found.

### What is deliberately NOT built

- **Deleting anything.** Athena has no undo, so `task.delete` is off the
  whitelist on purpose. Do not add it casually.
- **Research.** Jarvis has no retrieval. Asked to research an assessment it
  would produce fluent, unsourced, plausible text about real accounting work.
  Task breakdown is safe; research is not, until a real search tool exists.
- **Boardroom removal.** Deferred by Jayden on 2026-08-09.

---

## How to Pick Up Next Session

1. Live site: `https://jaydenpineda30-glitch.github.io/Main/dashboard.html`
2. Make changes to `app.jsx` (and service files if needed)
3. `node build.js` (or rely on the pre-commit hook) to regenerate `app.js`
4. `git add app.jsx app.js && git commit -m "..." && git push`
5. Hard refresh the browser (Cmd/Ctrl+Shift+R) — GitHub Pages takes ~60s to deploy

**To run Obsidian export manually:**
```bash
node export-to-obsidian.js
```

---

## How Jayden Likes to Work

- Explain trade-offs before making big changes — he likes to understand the why
- Plain English, not technical jargon
- Mobile UX matters — he uses his phone at the gym
- Short responses, no padding
- When using the browser via Claude in Chrome: the dashboard is at `https://jaydenpineda30-glitch.github.io/Main/dashboard.html`

---

## Boardroom (added 2026-05-31)

Two AI coaches that both reply to every message, available via a 🧠 floating action button on the dashboard.

- **Alex** — Hormozi-style: direct, logic-based, zero fluff, pushes for action and concrete numbers.
- **Chris** — Williamson-style: psychologically deep, seeks root cause, ends every reply with one genuine question.

Both run via **Groq** (model: `gpt-oss-120b`). As of 2026-06-24 the Boardroom uses a
deliberation loop, intent detection (direction vs how-to), and a Project Context panel;
the persona/API list below predates that — see `boardroom-service.js` for the current API.

> ⚠️ **Boardroom does not currently work** (checked 2026-08-09). It calls Groq with
> `localStorage.__groq_key__`, and there is no such key in Jayden's settings — the
> only key stored there is `githubPAT`. So every use fails. Its Gemini fallback path
> is on the request shape retired 8 June 2026 as well.
>
> The Jarvis spec had it removed at stage 4; **Jayden deferred that on 2026-08-09**,
> so it stays. Keeping the tab is not the same as it working. Reviving it means
> either a Groq key or porting it onto `jarvis-service.js`'s call shape — separate
> work from Jarvis either way.

### Files

| File | Purpose |
|------|---------|
| `boardroom-service.js` | `window.BoardroomService` API: `chat`, `_model`, `buildContext`, `alexPrompt`, `chrisPrompt`, `summarizeSession`, `buildNorthStar`, `amalgamate` |
| `boardroom-nudge.js` | Node script — sets `boardroom.nudgePending = true` in Firestore |
| `.github/workflows/evening-nudge.yml` | GitHub Actions cron (~8pm AEST) that runs `boardroom-nudge.js` |
| `dashboard.html` | All UI state + logic (see below) |
| `monitoring-dashboard.js` | Groq key field in Settings |
| `dashboard.css` | Glow CSS for the 🧠 FAB |

**`dashboard.html` internals:** state — `showBoardroom`, `brMessages`, `brInput`, `brLoading`; functions — `brOpen`, `brOpener`, `brSessionMode`, `brSend`, `brEndSession`, `brFinishOnboarding`, `brGlow`; the 🧠 FAB + slide-in panel.

### Groq API Key

Stored in `localStorage.__groq_key__` and synced to Firestore `settings.groqKey`. Set via Settings panel in the dashboard.

### Data Model

`dashData.boardroom`:

```js
{
  onboarded:       boolean,          // false until North Star is set
  northStar:       string,           // one-paragraph direction statement
  messages:        [{role, persona, text, ts}],  // current session (cleared on end)
  sessionStartedAt: ISO string | null,
  keyMoments:      [{date, summary, commitments[], mode}],  // compressed session memory
  lastCommit:      {date: "YYYY-MM-DD", items: string[]} | null,  // morning commitments
  nudgePending:    boolean           // cleared when Boardroom is opened
}
```

### Session Modes

Determined by `brSessionMode()` — time-of-day + onboarded state:

| Mode | Condition | Opener persona |
|------|-----------|----------------|
| `onboarding` | `!boardroom.onboarded` | Chris + Alex (goals/values) |
| `morning` | onboarded + hour < 11 | Alex (commit to 1-3 things) |
| `evening` | onboarded + hour ≥ 17 | Alex (review last commit) or Chris (walk through day) |
| `drift` | onboarded + 11 ≤ hour < 17 | Chris (something's off?) |

Mode is passed to both persona prompts and shapes their coaching angle. Both prompts also carry a "connect today to North Star" instruction added in Phase 10.

### Memory

Each turn, `buildContext()` injects live `dashData` (calendar, tasks, gym, assessments, last reflection). At session end, `summarizeSession()` compresses the conversation into a `keyMoment` (one sentence + commitments array). When `keyMoments.length >= 15`, the oldest 10 are `amalgamate()`-d into 2-3 durable pattern strings.

### Glow States (🧠 FAB)

| Glow | Trigger |
|------|---------|
| `urgent` | `nudgePending` is true, OR past midday with no check-in |
| `soft` | No task marked done today |
| `none` | Otherwise |

Opening the Boardroom clears `nudgePending`.

### Evening Nudge — Manual Setup Required

The GitHub Actions workflow (`evening-nudge.yml`) needs one repo secret to run:

1. Go to repo Settings → Secrets → Actions
2. Add secret `FIREBASE_SA_JSON` — paste the full contents of the service-account JSON file
3. Merge the workflow file to the default branch (GitHub only schedules cron jobs on the default branch)

Once set up, it runs automatically ~8pm AEST daily and sets `nudgePending = true` in Firestore.
