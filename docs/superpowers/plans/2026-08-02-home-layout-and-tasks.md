# Home Layout & Task Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gap-prone CSS multi-column home page with a draggable, resizable 3-column grid, make task categories and urgency legible, and add task progress updates, an Upcoming Classes card, a weekly necessities card, and a record of completed tasks on the calendar.

**Architecture:** Pure logic moves into three small browser-global modules (`home-layout.js`, `task-grouping.js`, `week-utils.js`) that are also `require()`-able, so they can be unit-tested under Node's built-in test runner with zero new dependencies. `app.jsx` consumes them and keeps only rendering. The home grid is CSS Grid with a measured row-span masonry technique — no drag-and-drop library.

**Tech Stack:** React 18 (UMD via CDN), Babel standalone compile via `node build.js`, Firebase Firestore for persistence, Node 24 built-in `node:test` for unit tests. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-08-02-athena-home-layout-and-tasks-design.md`

## Global Constraints

- **No new runtime dependencies.** No CDN script tags beyond those already in `dashboard.html`. Tests use Node's built-in `node:test` and `node:assert` only.
- **Every new `.js` logic module must be dual-target:** assigned to the browser global object AND exported via `module.exports` when present. It must not reference `window`, `document`, React, or any DOM API.
- **New modules load via `<script>` in `dashboard.html` before `app.js`,** inserted after `<script src="data.js"></script>` (line 90). `index.html` is a 10-line redirect and needs no changes.
- **`node build.js` must be run and `app.js` committed alongside any `app.jsx` change.** The `.githooks/pre-commit` hook does this automatically; never bypass it with `--no-verify`.
- **LF line endings.** `.gitattributes` enforces this. Do not introduce CRLF.
- **Mobile (`mob === true`) layout is unchanged** — single column, registry order, no edit affordances. Every UI task must confirm this.
- **Never push to `main`.** Pushing to `main` deploys the live site. All work stays on `feat/home-layout-and-tasks` until Jayden explicitly approves a merge.
- **Nothing writes to Google Calendar.** The completed-task feature is local-only, derived from `completedAt`.
- **Existing tasks must keep working without migration.** All new task fields (`state`, `updates`) are optional with defaults applied at read time.
- Date strings are `YYYY-MM-DD` local, produced by `localDateStr` (`app.jsx:249`). Never use `toISOString()` — it shifts to UTC and breaks day boundaries in Melbourne.

## File Structure

**Created:**
- `home-layout.js` — card registry and layout array operations (normalize, move, resize). No DOM.
- `task-grouping.js` — task group assignment, group ordering, category counts. No DOM.
- `week-utils.js` — Monday-based week boundary maths shared by necessities and the calendar strip. No DOM.
- `test/home-layout.test.js`, `test/task-grouping.test.js`, `test/week-utils.test.js` — Node test-runner suites.

**Modified:**
- `dashboard.html:90` — three new script tags.
- `data.js:10` — add `TASK_CAT_COLORS` beside `TASK_CATS`.
- `package.json` — add `"test": "node --test test/"`.
- `app.jsx` — home page render (`4103`–`4255`), `renderWeek` (`3875`), task mutators (`3637`–`3646`), modal save (`3799`), Uni tab classes card (`4341`).

---

### Task 1: Test harness and layout logic module

**Files:**
- Create: `home-layout.js`
- Create: `test/home-layout.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: global `HomeLayout` with `HOME_CARDS` (array of `{id:string, title:string, defaultSpan:number, pinned:boolean}`), `movableCards() -> Card[]`, `defaultLayout() -> {id,span}[]`, `normalizeLayout(saved:any) -> {id,span}[]`, `moveCard(layout, fromIdx:number, toIdx:number) -> {id,span}[]`, `setSpan(layout, id:string, span:number) -> {id,span}[]`, `clampSpan(n:any) -> number`.

- [ ] **Step 1: Add the test script to `package.json`**

Replace the `scripts` block:

```json
  "scripts": {
    "build": "node build.js",
    "test": "node --test"
  },
```

Use bare `node --test` — it auto-discovers `test/`. Do **not** write `node --test test/`:
on Windows the trailing path is resolved as a module and the run dies with
`Cannot find module 'C:\Users\Jayde\my-project\test'` while still reporting a
failing "test", which looks like a real test failure and is not.

- [ ] **Step 2: Write the failing test**

Create `test/home-layout.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const HL = require('../home-layout.js');

test('defaultLayout excludes pinned cards', () => {
  const ids = HL.defaultLayout().map(e => e.id);
  assert.ok(!ids.includes('calendar'), 'calendar is pinned and must not be in the layout');
  assert.ok(ids.includes('tasks'));
});

test('normalizeLayout with no saved data returns the default layout', () => {
  assert.deepStrictEqual(HL.normalizeLayout(null), HL.defaultLayout());
  assert.deepStrictEqual(HL.normalizeLayout(undefined), HL.defaultLayout());
  assert.deepStrictEqual(HL.normalizeLayout('garbage'), HL.defaultLayout());
});

test('normalizeLayout preserves saved order and appends unseen cards at the end', () => {
  const out = HL.normalizeLayout([{ id: 'tasks', span: 2 }, { id: 'weather', span: 1 }]);
  assert.strictEqual(out[0].id, 'tasks');
  assert.strictEqual(out[0].span, 2);
  assert.strictEqual(out[1].id, 'weather');
  const rest = out.slice(2).map(e => e.id);
  assert.ok(rest.includes('necessities'), 'a card absent from saved data must be appended');
  assert.strictEqual(out.length, HL.movableCards().length);
});

test('normalizeLayout drops unknown ids and duplicates', () => {
  const out = HL.normalizeLayout([
    { id: 'tasks', span: 1 },
    { id: 'tasks', span: 3 },
    { id: 'no-such-card', span: 1 },
    { id: 'calendar', span: 3 },
  ]);
  assert.strictEqual(out.filter(e => e.id === 'tasks').length, 1, 'duplicate dropped, first wins');
  assert.strictEqual(out[0].span, 1);
  assert.ok(!out.some(e => e.id === 'no-such-card'));
  assert.ok(!out.some(e => e.id === 'calendar'), 'pinned cards never enter the layout');
});

test('clampSpan keeps spans between 1 and 3', () => {
  assert.strictEqual(HL.clampSpan(0), 1);
  assert.strictEqual(HL.clampSpan(-5), 1);
  assert.strictEqual(HL.clampSpan(9), 3);
  assert.strictEqual(HL.clampSpan(2), 2);
  assert.strictEqual(HL.clampSpan('nonsense'), 1);
  assert.strictEqual(HL.clampSpan(null), 1);
});

test('moveCard reorders without mutating the input', () => {
  const before = [{ id: 'a', span: 1 }, { id: 'b', span: 1 }, { id: 'c', span: 1 }];
  const frozen = JSON.stringify(before);
  const after = HL.moveCard(before, 0, 2);
  assert.deepStrictEqual(after.map(e => e.id), ['b', 'c', 'a']);
  assert.strictEqual(JSON.stringify(before), frozen, 'input must not be mutated');
});

test('moveCard clamps out-of-range targets instead of losing the card', () => {
  const l = [{ id: 'a', span: 1 }, { id: 'b', span: 1 }];
  assert.deepStrictEqual(HL.moveCard(l, 0, 99).map(e => e.id), ['b', 'a']);
  assert.deepStrictEqual(HL.moveCard(l, 0, -5).map(e => e.id), ['a', 'b']);
  assert.deepStrictEqual(HL.moveCard(l, 7, 0).map(e => e.id), ['a', 'b'], 'bad source is a no-op');
});

test('setSpan changes one card and clamps the value', () => {
  const l = [{ id: 'a', span: 1 }, { id: 'b', span: 1 }];
  assert.deepStrictEqual(HL.setSpan(l, 'a', 2), [{ id: 'a', span: 2 }, { id: 'b', span: 1 }]);
  assert.strictEqual(HL.setSpan(l, 'a', 99)[0].span, 3);
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../home-layout.js'`

- [ ] **Step 4: Write the implementation**

Create `home-layout.js`:

```js
/**
 * home-layout.js
 * Pure layout logic for the dashboard home grid — the card registry plus the
 * array operations that reorder and resize cards.
 *
 * No DOM, no React, no window. Loaded as a browser global before app.js and
 * also require()-able so it can be unit-tested under `npm test`.
 *
 * The registry is the single source of truth for which cards exist on the home
 * page. Adding a card here makes it appear at the bottom of every existing
 * saved layout without resetting anyone's arrangement — see normalizeLayout.
 */
(function (root) {
  'use strict';

  var MIN_SPAN = 1;
  var MAX_SPAN = 3;

  // Order here is the default order. `pinned` cards render outside the
  // reorderable grid and never appear in a saved layout.
  // Default order reproduces the order the cards ship in TODAY, so nothing moves
  // for the user until they deliberately rearrange it (Task 3). The two new cards
  // are appended last, which is also where normalizeLayout puts any future card.
  var HOME_CARDS = [
    { id: 'calendar',    title: 'Calendar',             defaultSpan: 3, pinned: true },
    { id: 'shopping',    title: 'Shopping',             defaultSpan: 1, pinned: false },
    { id: 'weather',     title: 'Weather',              defaultSpan: 1, pinned: false },
    { id: 'checkin',     title: 'Daily Check-in',       defaultSpan: 1, pinned: false },
    { id: 'goals',       title: 'Goals',                defaultSpan: 1, pinned: false },
    { id: 'assessments', title: 'Upcoming assessments', defaultSpan: 1, pinned: false },
    { id: 'gym-next',    title: 'Next gym session',     defaultSpan: 1, pinned: false },
    { id: 'bodyweight',  title: 'Weekly body weight',   defaultSpan: 1, pinned: false },
    { id: 'tasks',       title: 'Tasks',                defaultSpan: 1, pinned: false },
    { id: 'classes',     title: 'Upcoming Classes',     defaultSpan: 1, pinned: false },
    { id: 'necessities', title: 'Weekly necessities',   defaultSpan: 1, pinned: false }
  ];

  function movableCards() {
    return HOME_CARDS.filter(function (c) { return !c.pinned; });
  }

  function defaultLayout() {
    return movableCards().map(function (c) {
      return { id: c.id, span: c.defaultSpan };
    });
  }

  function clampSpan(n) {
    var v = Math.round(Number(n));
    if (!isFinite(v)) return MIN_SPAN;
    return Math.max(MIN_SPAN, Math.min(MAX_SPAN, v));
  }

  /**
   * Reconcile a saved layout against the registry. Always returns a complete,
   * valid layout — one entry per movable card, no duplicates, spans in range.
   * Never mutates the input.
   */
  function normalizeLayout(saved) {
    var known = {};
    movableCards().forEach(function (c) { known[c.id] = c; });

    var out = [];
    var seen = {};

    (Array.isArray(saved) ? saved : []).forEach(function (e) {
      if (!e || typeof e.id !== 'string') return;
      if (!known[e.id] || seen[e.id]) return;   // unknown, pinned, or duplicate
      seen[e.id] = true;
      var span = (e.span === null || e.span === undefined) ? known[e.id].defaultSpan : e.span;
      out.push({ id: e.id, span: clampSpan(span) });
    });

    // Cards the saved layout has never seen go to the bottom, in registry order.
    movableCards().forEach(function (c) {
      if (!seen[c.id]) out.push({ id: c.id, span: c.defaultSpan });
    });

    return out;
  }

  function moveCard(layout, fromIdx, toIdx) {
    var out = layout.slice();
    if (fromIdx < 0 || fromIdx >= out.length) return out;
    var to = Math.max(0, Math.min(out.length - 1, toIdx));
    var moved = out.splice(fromIdx, 1)[0];
    out.splice(to, 0, moved);
    return out;
  }

  function setSpan(layout, id, span) {
    return layout.map(function (e) {
      return e.id === id ? { id: e.id, span: clampSpan(span) } : e;
    });
  }

  var api = {
    HOME_CARDS: HOME_CARDS,
    MIN_SPAN: MIN_SPAN,
    MAX_SPAN: MAX_SPAN,
    movableCards: movableCards,
    defaultLayout: defaultLayout,
    normalizeLayout: normalizeLayout,
    moveCard: moveCard,
    setSpan: setSpan,
    clampSpan: clampSpan
  };

  root.HomeLayout = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 8 tests, 0 failures.

- [ ] **Step 6: Commit**

```bash
git add package.json home-layout.js test/home-layout.test.js
git commit -m "Add home layout registry and layout logic with tests"
```

---

### Task 2: Render the home page on a CSS Grid (gaps fixed, no editing yet)

This task alone removes the dead gaps. It is deliberately shippable on its own.

**Files:**
- Modify: `dashboard.html:90`
- Modify: `app.jsx:4109-4255` (the `columnCount` container and the cards inside it)

**Interfaces:**
- Consumes: `HomeLayout.normalizeLayout`, `HomeLayout.defaultLayout`, `HomeLayout.HOME_CARDS`.
- Produces: inside `App()` — `renderHomeCard(id) -> ReactNode|null` returning a card's JSX by registry id, and a `HomeGridCard` component wrapping each card with masonry measurement.

- [ ] **Step 1: Add the script tag**

In `dashboard.html`, immediately after line 90 (`<script src="data.js"></script>`):

```html
<script src="home-layout.js"></script>
```

- [ ] **Step 2: Add the masonry wrapper component**

Add near the other small components in `app.jsx` (before `function App()` at line 2725):

```jsx
// Masonry-on-CSS-Grid: a card's rendered height is measured and converted into a
// row span against a fine grid-auto-rows unit, so cards pack tightly upward while
// keeping an explicit column position. This is what CSS multi-column could not do.
const GRID_ROW_UNIT=8;   // px per implicit row
const GRID_GAP=18;       // px between cards, both axes

function HomeGridCard({span,children}){
  const ref=React.useRef(null);
  const [rows,setRows]=React.useState(20);
  React.useLayoutEffect(function(){
    const el=ref.current;
    if(!el)return;
    function measure(){
      const h=el.getBoundingClientRect().height;
      setRows(Math.max(1,Math.ceil((h+GRID_GAP)/(GRID_ROW_UNIT+GRID_GAP))));
    }
    measure();                                     // measure once even without ResizeObserver
    if(typeof ResizeObserver==="undefined")return; // otherwise the span stays at its seed value
    const ro=new ResizeObserver(measure);
    ro.observe(el);
    return function(){ro.disconnect();};
  },[]);
  return(
    <div style={{gridColumn:"span "+span,gridRow:"span "+rows}}>
      {/* flow-root contains the card's own bottom margin so it is INSIDE the
          measured box. Without it, card()'s marginBottom:12 collapses out of
          getBoundingClientRect() and every card reserves 12px too few. */}
      <div ref={ref} style={{display:"flow-root",marginBottom:0}}>{children}</div>
    </div>
  );
}
```

Three details that are easy to get wrong and each cause a real defect:

- **`display:"flow-root"` is load-bearing.** `card()` (`app.jsx:3974`) hardcodes `marginBottom:12`. A plain block wrapper lets that margin collapse through and out of its border box, so the measured height is 12px short of the space the card actually occupies, and inter-card gaps come out uneven — the very problem this task exists to remove. `flow-root` contains it.
- **The dependency array is `[]`, not `[children]`.** `children` is a new element object on every render, so `[children]` never compares equal: the observer is torn down and rebuilt and every card is force-reflowed on every keystroke anywhere in the app. `ref.current` is stable, so the observer never needs rebinding, and it already catches content-driven height changes by itself.
- **`measure()` runs before the `ResizeObserver` guard**, so a browser without `ResizeObserver` still gets one correct measurement instead of being stuck at the seed value forever.

- [ ] **Step 3: Extract each existing card behind a registry id**

Inside `App()`, add a function that returns the JSX for a card id. Move the existing card JSX from `app.jsx:4130-4254` into the matching branch **unchanged except** for removing `breakInside:"avoid"` and `marginBottom:12` from their `card(...)` calls — the grid handles spacing now.

```jsx
function renderHomeCard(id){
  switch(id){
    case "shopping":    return <ErrorBoundary name="ShoppingHome"><ShoppingHomeCard items={data.shopping||[]} onUpdate={updateShopping} onOpen={function(){setPage("Shopping");}} cardStyle={card()} mob={mob}/></ErrorBoundary>;
    case "weather":     return <WeatherWidget mob={mob}/>;
    case "checkin":     return renderCheckinCard();
    case "goals":       return renderGoalsCard();       // returns null when not onboarded
    case "assessments": return renderAssessmentsCard();
    case "gym-next":    return renderGymNextCard();
    case "bodyweight":  return renderBodyweightCard();
    case "tasks":       return renderTasksCard();
    case "classes":     return null;                    // Task 7
    case "necessities": return null;                    // Task 8
    default:            return null;
  }
}
```

Each `renderXCard()` is the existing JSX lifted verbatim into a named function. A card that returns `null` (for example Goals before onboarding) must render nothing at all — not an empty grid cell.

- [ ] **Step 4: Replace the multi-column container**

Replace `app.jsx:4110` (`<div style={{columnCount:mob?1:3,columnGap:18}}>`) and its closing tag with the pinned calendar followed by the grid:

```jsx
{/* Pinned: calendar always spans the full width above the grid */}
{/* mob keeps card()'s own 12px so mobile spacing is untouched; desktop uses the grid gap */}
<div className="card-rim" style={card({padding:"16px 20px",marginBottom:mob?12:GRID_GAP})}>
  {renderCalendarCard()}
</div>

{mob
  ?<div>{homeLayout.map(function(e){
      const body=renderHomeCard(e.id);
      return body?<div key={e.id} style={{marginBottom:12}}>{body}</div>:null;
    })}</div>
  :<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gridAutoRows:GRID_ROW_UNIT+"px",gridAutoFlow:"row dense",gap:GRID_GAP,alignItems:"start"}}>
    {homeLayout.map(function(e){
      const body=renderHomeCard(e.id);
      return body?<HomeGridCard key={e.id} span={e.span}>{body}</HomeGridCard>:null;
    })}
  </div>}
```

- [ ] **Step 5: Derive the layout from saved data**

Inside `App()`, near the other derived values around `app.jsx:3200`:

```jsx
const homeLayout=React.useMemo(function(){
  return window.HomeLayout.normalizeLayout(data.homeLayout);
},[data.homeLayout]);
```

- [ ] **Step 6: Build and verify by hand**

```bash
node build.js
```
Expected: `✓ app.jsx → app.js` with no error.

Then serve and open the dashboard:

```bash
npx --yes http-server -p 8080 -c-1
```

Check, at a desktop window width, and record the result of each:
1. Home page renders every card that was there before — Shopping, Weather, Daily Check-in, Goals, Upcoming assessments, Next gym session, Weekly body weight, Tasks.
2. **No dead vertical gaps** between cards in a column. This is the whole point of the task.
3. Calendar spans the full width at the top.
4. Narrow the window and widen it again — cards re-pack without overlapping or clipping.
5. Expand a card that changes height (open Daily Check-in) — the cards below it re-pack, no overlap.
6. Switch to mobile view — single column, same order, unchanged from before.

- [ ] **Step 7: Commit**

```bash
node build.js
git add dashboard.html app.jsx app.js
git commit -m "Replace home multi-column layout with a masonry CSS grid"
```

---

### Task 3: Edit-layout mode — drag, resize, persist, reset

**Files:**
- Modify: `app.jsx` (home page render, `App()` state)

**Interfaces:**
- Consumes: `HomeLayout.moveCard`, `HomeLayout.setSpan`, `HomeLayout.defaultLayout`, `HomeGridCard` from Task 2.
- Produces: `App()` state `layoutEditing:boolean`; `saveLayout(next:{id,span}[]) -> void` persisting to `data.homeLayout`.

- [ ] **Step 1: Add state and the persist helper**

Inside `App()`, beside the other `useState` calls near `app.jsx:2797`:

```jsx
const [layoutEditing,setLayoutEditing]=useState(false);
const [dragId,setDragId]=useState(null);
const [dropIdx,setDropIdx]=useState(null);

function saveLayout(next){
  trk("home.layout_save");
  setData(function(p){return{...p,homeLayout:next};});
}
```

- [ ] **Step 2: Add the Edit layout / Done control**

In the home page header block at `app.jsx:4105`, add to the right of the greeting (desktop only — `!mob`):

```jsx
{!mob&&<div style={{display:"flex",gap:8,alignItems:"center"}}>
  {layoutEditing&&<button style={{...btn,color:T.danger,borderColor:T.danger+"50"}} onClick={function(){
    if(window.confirm("Reset the home page to its default layout?")){
      saveLayout(window.HomeLayout.defaultLayout());
    }
  }}>Reset layout</button>}
  <button style={layoutEditing?btnP:btn} onClick={function(){setLayoutEditing(function(v){return !v;});}}>
    {layoutEditing?"Done":"Edit layout"}
  </button>
</div>}
```

- [ ] **Step 3: Add the edit chrome to `HomeGridCard`**

`HomeGridCard` is module-level, so it can only use module-level style objects:
`btnGlass` (`app.jsx:125`), `btnGlassP`, `editPill` (`app.jsx:123`), `PCARD`, `PINP`.
It must **not** reference `btn`, `btnP`, `card`, `sT` or `T`-derived locals — those are
declared inside `App()` (`btn` is at `app.jsx:4019`) and referencing one throws a
`ReferenceError` the moment the component renders. The build and the test suite both
pass regardless, so this class of mistake only surfaces in the browser.

Extend `HomeGridCard` with the editing props. The card body becomes inert while editing so a drag cannot tick a checkbox:

```jsx
function HomeGridCard({span,editing,title,onSpan,onDragStart,onDragOver,isDragging,isDropTarget,children}){
  const ref=React.useRef(null);
  const [rows,setRows]=React.useState(20);
  React.useLayoutEffect(function(){
    const el=ref.current;
    if(!el)return;
    function measure(){
      const h=el.getBoundingClientRect().height;
      setRows(Math.max(1,Math.ceil((h+GRID_GAP)/(GRID_ROW_UNIT+GRID_GAP))));
    }
    measure();
    if(typeof ResizeObserver==="undefined")return;
    const ro=new ResizeObserver(measure);
    ro.observe(el);
    return function(){ro.disconnect();};
  },[]);   // see Task 2 — [] is deliberate; ResizeObserver catches height changes itself
  return(
    <div style={{gridColumn:"span "+span,gridRow:"span "+rows,opacity:isDragging?0.35:1,
                 outline:isDropTarget?"2px dashed "+T.accent:"none",outlineOffset:4,borderRadius:22,
                 transition:"opacity 0.12s"}}
         onPointerEnter={editing?onDragOver:undefined}>
      <div ref={ref} style={{display:"flow-root"}}>
        {editing&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                               gap:8,padding:"6px 10px",marginBottom:6,borderRadius:10,
                               background:"rgba(91,140,255,0.10)",border:"1px solid rgba(91,140,255,0.35)"}}>
          <span onPointerDown={onDragStart}
                style={{cursor:"grab",fontSize:14,color:T.accent,userSelect:"none",touchAction:"none"}}
                title="Drag to move">⠿</span>
          <span style={{fontSize:10,color:T.text2,flex:1,minWidth:0,overflow:"hidden",
                        textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</span>
          <span style={{display:"flex",gap:3}}>
            {[1,2,3].map(function(n){return(
              <button key={n} onClick={function(){onSpan(n);}}
                style={{...btnGlass,padding:"1px 7px",fontSize:10,
                        color:span===n?T.accent:T.text3,
                        borderColor:span===n?"rgba(91,140,255,0.5)":"rgba(255,255,255,0.12)"}}
                title={n===1?"One column":n===2?"Two columns wide":"Full width"}>{n}</button>);})}
          </span>
        </div>}
        <div style={editing?{pointerEvents:"none",userSelect:"none"}:undefined}>{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire drag handling into the grid**

Replace the desktop grid map from Task 2:

```jsx
{homeLayout.map(function(e,idx){
  const body=renderHomeCard(e.id);
  if(!body)return null;
  const meta=window.HomeLayout.HOME_CARDS.filter(function(c){return c.id===e.id;})[0]||{};
  return(
    <HomeGridCard key={e.id} span={e.span} editing={layoutEditing} title={meta.title||e.id}
      isDragging={dragId===e.id} isDropTarget={layoutEditing&&dropIdx===idx&&dragId!==null&&dragId!==e.id}
      onSpan={function(n){saveLayout(window.HomeLayout.setSpan(homeLayout,e.id,n));}}
      onDragStart={function(ev){
        if(ev.button!==0||!ev.isPrimary)return;   // ignore right/middle click and secondary pointers
        ev.preventDefault();setDragId(e.id);setDropIdx(idx);}}
      onDragOver={function(){if(dragId)setDropIdx(idx);}}>
      {body}
    </HomeGridCard>
  );
})}
```

And commit the drop on pointer release, anywhere on the page:

```jsx
React.useEffect(function(){
  if(!dragId)return;
  function clear(){setDragId(null);setDropIdx(null);}
  function commit(){
    const from=homeLayout.findIndex(function(x){return x.id===dragId;});
    if(from>=0&&dropIdx!==null&&dropIdx!==from){
      saveLayout(window.HomeLayout.moveCard(homeLayout,from,dropIdx));
    }
    clear();
  }
  // A pointer released OUTSIDE the browser window dispatches no pointerup to the
  // page, so the drag would stay armed: the next click anywhere — including on
  // "Done" — would commit a reorder the user never asked for. The first pointer
  // movement back over the page with no button held disarms it instead.
  function disarmIfReleased(ev){if(ev.buttons===0)clear();}
  window.addEventListener("pointerup",commit);
  window.addEventListener("pointercancel",clear);
  window.addEventListener("pointermove",disarmIfReleased);
  window.addEventListener("blur",clear);
  return function(){
    window.removeEventListener("pointerup",commit);
    window.removeEventListener("pointercancel",clear);
    window.removeEventListener("pointermove",disarmIfReleased);
    window.removeEventListener("blur",clear);
  };
},[dragId,dropIdx,homeLayout]);
```

**Do NOT use `setPointerCapture` here.** It is the textbook answer to a lost
`pointerup`, and it would break this drag: capture routes every subsequent pointer
event to the capturing element, so the `onPointerEnter` handlers on the other cards
would stop firing and `dropIdx` would never update. The four listeners above close
the same hole without touching the hover-tracking mechanism.

- [ ] **Step 5: Build and verify by hand**

```bash
node build.js && npx --yes http-server -p 8080 -c-1
```

Check each, and record the result:
1. Outside edit mode there is **no** drag handle, no width buttons, and checkboxes/buttons inside cards work exactly as before.
2. Click **Edit layout** — every card except the calendar grows a handle and 1/2/3 buttons.
3. Drag a card by its handle onto another card's position; release. It moves.
4. **Reload the page.** The card is still where you put it. This is the requirement that matters most.
5. Set a card to span 2, then 3. It widens; neighbours re-pack with no dead air.
6. While editing, clicking inside a card body does nothing (body is inert).
7. **Reset layout** asks for confirmation, then restores defaults.
8. Click **Done** — chrome disappears, cards interactive again.
9. Mobile view: no Edit layout button, single column, unchanged.

- [ ] **Step 6: Commit**

```bash
node build.js
git add app.jsx app.js
git commit -m "Add edit-layout mode: drag to reorder, 1-3 column spans, persisted"
```

---

### Task 4: Task grouping logic and category colours

**Files:**
- Create: `task-grouping.js`
- Create: `test/task-grouping.test.js`
- Modify: `data.js:10`
- Modify: `dashboard.html`

**Interfaces:**
- Consumes: nothing.
- Produces: global `TaskGrouping` with `DISPLAY_ORDER:string[]`, `GROUP_LABEL:{[key]:string}`, `groupOf(task, todayStr) -> string`, `groupTasks(tasks, todayStr) -> {[group]: task[]}`, `categoryCounts(tasks) -> {cat:string,count:number}[]`.
- Produces: global `TASK_CAT_COLORS` in `data.js` — `{[cat:string]: string}` covering every entry in `TASK_CATS`.

- [ ] **Step 1: Validate the category palette with the `dataviz` skill`**

Invoke the `dataviz` skill and check the starting palette in Step 5 against it. Acceptance criteria:

- Legible on the dark glass background (`#0a0a0a` under `blur(24px) saturate(1.4)`).
- The four categories Jayden uses most — Study, Admin, Work, Health — must be unmistakable from each other at a 3px-wide bar and a 7px dot.
- Hue is never the sole signal; the category name is always rendered beside the colour. Fourteen categories exceeds what anyone can distinguish by hue alone, and that is accepted.
- Every value is a 6-digit hex string.

Adjust the Step 5 values where the skill says to, and note in the `data.js` comment that the palette was validated this way.

- [ ] **Step 2: Write the failing test**

Create `test/task-grouping.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const TG = require('../task-grouping.js');

const TODAY = '2026-08-02';
const t = (over) => Object.assign(
  { id: 1, name: 'x', cat: 'Study', done: false, addedAt: TODAY, editedAt: TODAY, due: null },
  over);

test('done wins over everything', () => {
  assert.strictEqual(TG.groupOf(t({ done: true, due: '2026-01-01' }), TODAY), 'done');
  assert.strictEqual(TG.groupOf(t({ done: true, state: 'waiting' }), TODAY), 'done');
});

test('waiting is matched before overdue so parked work stops nagging', () => {
  assert.strictEqual(TG.groupOf(t({ state: 'waiting', due: '2026-07-01' }), TODAY), 'waiting');
});

test('due date drives overdue and due soon', () => {
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-01' }), TODAY), 'overdue');
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-02' }), TODAY), 'dueSoon', 'due today');
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-04' }), TODAY), 'dueSoon', 'two days out');
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-05' }), TODAY), 'later', 'three days out');
});

test('an overdue in-progress task is grouped as overdue', () => {
  assert.strictEqual(TG.groupOf(t({ state: 'doing', due: '2026-07-30' }), TODAY), 'overdue');
});

test('in progress applies only when no due date pulls it earlier', () => {
  assert.strictEqual(TG.groupOf(t({ state: 'doing', due: null }), TODAY), 'doing');
});

test('untouched needs more than 7 days since the last touch', () => {
  assert.strictEqual(TG.groupOf(t({ due: null, editedAt: '2026-07-25' }), TODAY), 'untouched');
  assert.strictEqual(TG.groupOf(t({ due: null, editedAt: '2026-07-27' }), TODAY), 'later',
    'exactly 7 days is not yet untouched');
});

test('editedAt takes precedence over addedAt', () => {
  assert.strictEqual(
    TG.groupOf(t({ due: null, addedAt: '2026-01-01', editedAt: TODAY }), TODAY), 'later',
    'writing an update must clear the untouched badge');
});

test('groupTasks buckets every task and sorts each bucket by due date', () => {
  const out = TG.groupTasks([
    t({ id: 1, due: '2026-08-01' }),
    t({ id: 2, due: '2026-07-20' }),
    t({ id: 3, done: true }),
  ], TODAY);
  assert.deepStrictEqual(out.overdue.map(x => x.id), [2, 1]);
  assert.deepStrictEqual(out.done.map(x => x.id), [3]);
  assert.deepStrictEqual(out.later, []);
  TG.DISPLAY_ORDER.forEach(g => assert.ok(Array.isArray(out[g]), g + ' bucket must exist'));
});

test('groupTasks tolerates null and undefined input', () => {
  assert.deepStrictEqual(TG.groupTasks(null, TODAY).overdue, []);
  assert.deepStrictEqual(TG.groupTasks(undefined, TODAY).later, []);
});

test('categoryCounts counts open tasks only, biggest first', () => {
  const out = TG.categoryCounts([
    t({ cat: 'Study' }), t({ cat: 'Study' }), t({ cat: 'Admin' }),
    t({ cat: 'Study', done: true }),
    t({ cat: undefined }),
  ]);
  assert.deepStrictEqual(out[0], { cat: 'Study', count: 2 });
  assert.ok(out.some(c => c.cat === 'Other'), 'a missing category falls back to Other');
  assert.ok(!out.some(c => c.count === 0));
});

test('DISPLAY_ORDER puts waiting near the bottom and overdue at the top', () => {
  assert.strictEqual(TG.DISPLAY_ORDER[0], 'overdue');
  assert.ok(TG.DISPLAY_ORDER.indexOf('waiting') > TG.DISPLAY_ORDER.indexOf('later'));
  assert.strictEqual(TG.DISPLAY_ORDER[TG.DISPLAY_ORDER.length - 1], 'done');
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../task-grouping.js'`

- [ ] **Step 4: Write the implementation**

Create `task-grouping.js`:

```js
/**
 * task-grouping.js
 * Decides which group a task belongs to, and in what order the groups display.
 *
 * There are two distinct orders here and they are NOT the same list:
 *   - match order  (groupOf, top to bottom of the if-chain) decides membership
 *   - DISPLAY_ORDER decides where each group appears on screen
 * Waiting is matched early so parked work never shows as overdue, but displays
 * near the bottom because it is not asking anything of you right now.
 *
 * No DOM, no React. Loaded as a browser global before app.js and require()-able
 * so it can be unit-tested under `npm test`.
 */
(function (root) {
  'use strict';

  var DUE_SOON_DAYS = 2;
  var UNTOUCHED_DAYS = 7;

  var DISPLAY_ORDER = ['overdue', 'dueSoon', 'doing', 'untouched', 'later', 'waiting', 'done'];

  var GROUP_LABEL = {
    overdue: 'Overdue',
    dueSoon: 'Due soon',
    doing: 'In progress',
    untouched: 'Untouched',
    later: 'Later',
    waiting: 'Waiting',
    done: 'Done'
  };

  // Whole days from bStr to aStr. Both are local YYYY-MM-DD.
  function daysApart(aStr, bStr) {
    var a = new Date(aStr + 'T00:00:00');
    var b = new Date(bStr + 'T00:00:00');
    return Math.round((a - b) / 864e5);
  }

  function groupOf(task, todayStr) {
    if (!task) return 'later';
    if (task.done) return 'done';
    if (task.state === 'waiting') return 'waiting';
    if (task.due) {
      var d = daysApart(task.due, todayStr);
      if (d < 0) return 'overdue';
      if (d <= DUE_SOON_DAYS) return 'dueSoon';
    }
    if (task.state === 'doing') return 'doing';
    var ref = task.editedAt || task.addedAt;
    if (ref && daysApart(todayStr, ref) > UNTOUCHED_DAYS) return 'untouched';
    return 'later';
  }

  function groupTasks(tasks, todayStr) {
    var out = {};
    DISPLAY_ORDER.forEach(function (g) { out[g] = []; });
    (Array.isArray(tasks) ? tasks : []).forEach(function (t) {
      out[groupOf(t, todayStr)].push(t);
    });
    // Soonest due first; undated tasks sink to the bottom of their group.
    DISPLAY_ORDER.forEach(function (g) {
      out[g].sort(function (a, b) {
        return String(a.due || '9999-12-31').localeCompare(String(b.due || '9999-12-31'));
      });
    });
    return out;
  }

  function categoryCounts(tasks) {
    var m = {};
    (Array.isArray(tasks) ? tasks : []).forEach(function (t) {
      if (!t || t.done) return;
      var c = t.cat || 'Other';
      m[c] = (m[c] || 0) + 1;
    });
    return Object.keys(m)
      .map(function (c) { return { cat: c, count: m[c] }; })
      .sort(function (a, b) { return b.count - a.count || a.cat.localeCompare(b.cat); });
  }

  var api = {
    DISPLAY_ORDER: DISPLAY_ORDER,
    GROUP_LABEL: GROUP_LABEL,
    DUE_SOON_DAYS: DUE_SOON_DAYS,
    UNTOUCHED_DAYS: UNTOUCHED_DAYS,
    groupOf: groupOf,
    groupTasks: groupTasks,
    categoryCounts: categoryCounts
  };

  root.TaskGrouping = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

- [ ] **Step 5: Add the colour map to `data.js`**

Append after `TASK_CATS` at `data.js:10`, using the palette chosen in Step 1:

```js
// One fixed colour per task category, so a category always looks the same
// wherever it appears. Validated against the dataviz skill for the dark glass
// background; the category name is always rendered beside the colour, so hue is
// never the only signal. Any category missing here falls back to
// TASK_CAT_FALLBACK. Keys must exactly match TASK_CATS above.
var TASK_CAT_COLORS = {
  "Study":           "#5B8CFF",
  "Admin":           "#C77DFF",
  "Work":            "#4DD0E1",
  "Health":          "#1D9E75",
  "Finances":        "#E0B33A",
  "Errands":         "#FF8A5B",
  "Social":          "#F06292",
  "Meal Prep":       "#8BC34A",
  "Car & Transport": "#7F77DD",
  "Home":            "#D4874A",
  "Family":          "#FF6B6B",
  "Self-care":       "#4DB6AC",
  "Shopping":        "#A1887F",
  "Other":           "#8F97A6"
};
var TASK_CAT_FALLBACK = "#8F97A6";
```

All 14 keys above correspond one-to-one with `TASK_CATS` (`data.js:10`). The test in Step 7 fails if any category is missing or malformed, so a future category added to `TASK_CATS` without a colour is caught immediately.

- [ ] **Step 6: Add the script tag**

In `dashboard.html`, after the `home-layout.js` tag:

```html
<script src="task-grouping.js"></script>
```

- [ ] **Step 7: Run the tests and assert the colour map is complete**

Add to `test/task-grouping.test.js`:

`data.js` declares bare `var`s for the browser and has no exports, so it is loaded
here in a `vm` sandbox rather than `require`d.

```js
test('every task category has a colour', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const vm = require('node:vm');
  const src = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8');
  const sandbox = {};
  vm.runInNewContext(src, sandbox);

  assert.ok(Array.isArray(sandbox.TASK_CATS), 'data.js must define TASK_CATS');
  assert.ok(sandbox.TASK_CAT_COLORS, 'data.js must define TASK_CAT_COLORS');
  assert.match(sandbox.TASK_CAT_FALLBACK, /^#[0-9a-fA-F]{6}$/);

  sandbox.TASK_CATS.forEach(c => {
    assert.ok(sandbox.TASK_CAT_COLORS[c], 'missing colour for category: ' + c);
    assert.match(sandbox.TASK_CAT_COLORS[c], /^#[0-9a-fA-F]{6}$/, 'bad colour for ' + c);
  });

  const extra = Object.keys(sandbox.TASK_CAT_COLORS)
    .filter(k => !sandbox.TASK_CATS.includes(k));
  assert.deepStrictEqual(extra, [], 'colours defined for categories that do not exist');
});
```

Run: `npm test`
Expected: PASS — all `home-layout` and `task-grouping` tests green.

- [ ] **Step 8: Commit**

```bash
git add task-grouping.js test/task-grouping.test.js data.js dashboard.html
git commit -m "Add task grouping logic and per-category colours with tests"
```

---

### Task 5: Rebuild the Tasks card

**Files:**
- Modify: `app.jsx` — `renderTasksCard()` created in Task 2

**Interfaces:**
- Consumes: `TaskGrouping.groupTasks`, `TaskGrouping.categoryCounts`, `TaskGrouping.DISPLAY_ORDER`, `TaskGrouping.GROUP_LABEL`, `TASK_CAT_COLORS`, `TASK_CAT_FALLBACK`, existing `taskLabel()` (`app.jsx:264`).
- Produces: `catFilter` state in `App()`; `renderTasksCard()` rewritten.

- [ ] **Step 1: Add filter state**

```jsx
const [catFilter,setCatFilter]=useState(null);
function catColor(c){return (window.TASK_CAT_COLORS||{})[c]||window.TASK_CAT_FALLBACK||"#8f97a6";}
```

- [ ] **Step 2: Replace the card body**

Rewrite `renderTasksCard()`. The old `urgTasks`/`normTasks`/`doneTasks` split and the `TUC` inset glow both go:

```jsx
function renderTasksCard(){
  const TG=window.TaskGrouping;
  const all=(data.personal.tasks)||[];
  const counts=TG.categoryCounts(all);
  const shown=catFilter?all.filter(function(t){return (t.cat||"Other")===catFilter;}):all;
  const groups=TG.groupTasks(shown,todayStr());
  const empty=TG.DISPLAY_ORDER.every(function(g){return groups[g].length===0;});
  return(
    <div className="card-rim" style={card()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={sT}>Tasks</div>
        <button style={{...editPill,fontSize:14,padding:"2px 12px"}}
          onClick={function(){setModal("add_task");setMForm({priority:"normal",cat:"Errands",state:"todo"});}}>+</button>
      </div>

      {/* Load bar — where the work is piling up. Click to filter. */}
      {counts.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12,
                                     paddingBottom:10,borderBottom:"0.5px solid "+T.border}}>
        {counts.map(function(c){
          const on=catFilter===c.cat;
          return(
            <button key={c.cat} onClick={function(){setCatFilter(on?null:c.cat);}}
              style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:999,
                      cursor:"pointer",fontSize:10,
                      background:on?catColor(c.cat)+"28":"rgba(255,255,255,0.04)",
                      border:"1px solid "+(on?catColor(c.cat)+"90":"rgba(255,255,255,0.10)"),
                      color:on?T.text:T.text2}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:catColor(c.cat),
                            boxShadow:"0 0 6px "+catColor(c.cat)+"90",flexShrink:0}}/>
              {c.cat}<span style={{color:T.text3,fontWeight:600}}>{c.count}</span>
            </button>);})}
        {catFilter&&<button onClick={function(){setCatFilter(null);}}
          style={{...btn,fontSize:10,padding:"3px 9px"}}>Clear</button>}
      </div>}

      {empty&&<div style={{fontSize:12,color:T.text2}}>All clear ✓</div>}

      {TG.DISPLAY_ORDER.map(function(g){
        if(groups[g].length===0)return null;
        return(
          <div key={g}>
            <div style={{fontSize:9,fontWeight:700,marginBottom:6,marginTop:8,textTransform:"uppercase",
                         letterSpacing:0.5,color:g==="overdue"?T.danger:T.text3,
                         display:"flex",gap:6,alignItems:"center"}}>
              {TG.GROUP_LABEL[g]}<span style={{color:T.text3,fontWeight:600}}>{groups[g].length}</span>
            </div>
            {groups[g].map(function(t){return renderTaskRow(t,g);})}
          </div>);})}
    </div>);
}
```

- [ ] **Step 3: Write the row renderer**

Colour bar = category. Badge = urgency. No strikethrough colour glow:

```jsx
function renderTaskRow(t,group){
  const cat=t.cat||"Other";
  const col=catColor(cat);
  const isActive=scheduleTaskId===t.id;
  const latest=(t.updates&&t.updates.length)?t.updates[t.updates.length-1]:null;
  const stateBadge=t.state==="doing"?"▶ In progress":t.state==="waiting"?"⏸ Waiting":null;
  const muted=group==="done"||group==="waiting";
  return(
    <div key={t.id} className="glow-item"
      style={{display:"flex",gap:9,marginBottom:7,alignItems:"flex-start",padding:"10px 12px",
              borderRadius:12,opacity:group==="done"?0.5:1,
              background:isActive?"rgba(91,140,255,0.12)":"rgba(225,234,255,0.04)",
              border:"1px solid "+(isActive?"rgba(91,140,255,0.5)":"rgba(255,255,255,0.07)"),
              borderLeft:"3px solid "+col,transition:"background 0.15s"}}>
      <input type="checkbox" checked={!!t.done} onChange={function(){toggleTask(t.id);}}
        style={{accentColor:T.accent,marginTop:2,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,fontWeight:500,color:T.text,
                     textDecoration:t.done?"line-through":"none"}}>{t.name}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginTop:2}}>
          <span style={{fontSize:9,color:col}}>{cat}</span>
          {stateBadge&&<span style={{fontSize:9,color:T.accent}}>{stateBadge}</span>}
          <span style={{fontSize:9,color:muted?T.text3:group==="overdue"?T.danger:T.text3}}>
            {taskLabel(t)}</span>
        </div>
        {latest&&<div style={{fontSize:9,color:T.text3,marginTop:3,fontStyle:"italic",
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          “{latest.text}” — {fmtDate(latest.at)}</div>}
      </div>
      <button style={{background:"none",border:"none",padding:"2px 4px",cursor:"pointer",
                      color:T.text3,flexShrink:0,opacity:0.45,display:"flex"}}
        title="Open task" onClick={function(e){e.stopPropagation();openTaskDetail(t.id);}}>
        <UIcon name="pencil" size={12}/></button>
      <button style={{background:"none",border:"none",padding:"2px 4px",cursor:"pointer",
                      color:T.text3,flexShrink:0,opacity:0.45,display:"flex"}}
        title="Mark done on a different day"
        onClick={function(e){e.stopPropagation();openBackdateModal(t.id);}}>
        <UIcon name="clock" size={12}/></button>
    </div>);
}
```

`openTaskDetail` is added in Task 6; for this task stub it as `function openTaskDetail(id){openBackdateModal(id);}` and replace it there.

- [ ] **Step 4: Remove the dead urgency styling**

Delete the `TUC` lookup usage in the home Tasks card. Leave `TUC` (`app.jsx:263`) and `taskUrg` (`app.jsx:262`) in place — the Uni/Personal task list at `app.jsx:4377` still uses them and is out of scope.

- [ ] **Step 5: Build and verify by hand**

```bash
node build.js && npx --yes http-server -p 8080 -c-1
```

Check:
1. No yellow/orange glow remains on any task row.
2. Each row has a coloured left bar and its category name, and the same category is the same colour everywhere.
3. The load bar lists categories with counts, biggest first, open tasks only.
4. Clicking a category filters the list; clicking again or **Clear** restores it.
5. Groups appear in order: Overdue, Due soon, In progress, Untouched, Later, Waiting, Done. Empty groups render nothing.
6. Cross-check against the tests: an overdue task appears under Overdue, not Waiting; a `waiting` task appears under Waiting even if its due date has passed.
7. Ticking a task still completes it.

- [ ] **Step 6: Commit**

```bash
node build.js
git add app.jsx app.js
git commit -m "Rebuild Tasks card: category colour, load bar filter, status groups"
```

---

### Task 6: Task state and dated update log

**Files:**
- Modify: `app.jsx` — task mutators (`3637`–`3646`), `saveModal` (`3799`), modal render, `renderTaskRow` stub from Task 5

**Interfaces:**
- Consumes: `renderTaskRow` from Task 5.
- Produces: `setTaskState(id, state) -> void`, `addTaskUpdate(id, text) -> void`, `deleteTaskUpdate(id, updateId) -> void`, `openTaskDetail(id) -> void`; modal type `"task_detail"`.

- [ ] **Step 1: Add the mutators**

Beside `completeTask` at `app.jsx:3643`:

```jsx
function setTaskState(id,state){
  trk("task.state");
  setData(function(p){const ts=p.personal.tasks||[];
    return{...p,personal:{...p.personal,tasks:ts.map(function(t){
      return t.id===id?{...t,state:state,editedAt:todayStr()}:t;});}};});
}

// Writing an update is a real interaction with the task, so it refreshes
// editedAt — that is what clears the "untouched Nd" badge.
function addTaskUpdate(id,text){
  const clean=(text||"").trim();
  if(!clean)return;
  trk("task.update_add");
  setData(function(p){const ts=p.personal.tasks||[];
    return{...p,personal:{...p.personal,tasks:ts.map(function(t){
      if(t.id!==id)return t;
      const ups=(t.updates||[]).concat([{id:Date.now(),at:todayStr(),text:clean}]);
      return{...t,updates:ups,editedAt:todayStr()};});}};});
}

function deleteTaskUpdate(id,updateId){
  setData(function(p){const ts=p.personal.tasks||[];
    return{...p,personal:{...p.personal,tasks:ts.map(function(t){
      return t.id===id?{...t,updates:(t.updates||[]).filter(function(u){return u.id!==updateId;})}:t;});}};});
}

function openTaskDetail(id){setModal("task_detail");setMForm({taskId:id,updateText:""});}
```

Replace the Task 5 stub `openTaskDetail` with this one.

- [ ] **Step 2: Add the detail modal**

In the modal render block, add a `task_detail` case showing the three states as a radio group, the update history newest-first, and an add box:

```jsx
{modal==="task_detail"&&(function(){
  const t=(data.personal.tasks||[]).filter(function(x){return x.id===mForm.taskId;})[0];
  if(!t)return null;
  const ups=(t.updates||[]).slice().reverse();
  return(<div>
    <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:4}}>{t.name}</div>
    <div style={{fontSize:10,color:catColor(t.cat||"Other"),marginBottom:14}}>{t.cat||"Other"}</div>

    <div style={{fontSize:10,color:T.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>State</div>
    <div style={{display:"flex",gap:6,marginBottom:16}}>
      {[{v:"todo",l:"Not started"},{v:"doing",l:"In progress"},{v:"waiting",l:"Waiting"}].map(function(o){
        const on=(t.state||"todo")===o.v;
        return<button key={o.v} onClick={function(){setTaskState(t.id,o.v);}}
          style={{...btn,fontSize:11,color:on?T.accent:T.text2,
                  borderColor:on?"rgba(91,140,255,0.5)":"rgba(255,255,255,0.12)",
                  background:on?T.accentBg:"transparent"}}>{o.l}</button>;})}
    </div>

    <div style={{fontSize:10,color:T.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Updates</div>
    {ups.length===0&&<div style={{fontSize:12,color:T.text3,marginBottom:10}}>No updates yet.</div>}
    {ups.map(function(u){return(
      <div key={u.id} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,
                              paddingBottom:8,borderBottom:"0.5px solid "+T.border}}>
        <div style={{fontSize:10,color:T.text3,flexShrink:0,width:52}}>{fmtDate(u.at)}</div>
        <div style={{fontSize:12,color:T.text,flex:1,lineHeight:1.5}}>{u.text}</div>
        <button onClick={function(){deleteTaskUpdate(t.id,u.id);}}
          style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:14,
                  lineHeight:1,padding:"0 2px",flexShrink:0}} title="Delete update">×</button>
      </div>);})}

    <div style={{display:"flex",gap:6,marginTop:12}}>
      <input style={{...PINP,flex:1}} placeholder="Write an update…" value={mForm.updateText||""}
        onChange={function(e){setMForm(function(f){return{...f,updateText:e.target.value};});}}
        onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();
          addTaskUpdate(t.id,mForm.updateText);
          setMForm(function(f){return{...f,updateText:""};});}}}/>
      <button style={btnP} onClick={function(){
        addTaskUpdate(t.id,mForm.updateText);
        setMForm(function(f){return{...f,updateText:""};});}}>Add</button>
    </div>
  </div>);
})()}
```

- [ ] **Step 3: Default the state on task creation**

At `app.jsx:3822` and `app.jsx:3472`, add `state:"todo",updates:[]` to the new-task object literal. Existing tasks without these fields must keep working — `TaskGrouping.groupOf` already treats a missing `state` as `todo`, and `renderTaskRow` already guards `t.updates`.

- [ ] **Step 4: Build and verify by hand**

```bash
node build.js && npx --yes http-server -p 8080 -c-1
```

Check:
1. Clicking the pencil on a task row opens the detail modal.
2. Setting **In progress** shows a `▶ In progress` badge on the row and (with no due date) moves it into the In progress group.
3. Setting **Waiting** moves it to the Waiting group at the bottom, even with a past due date.
4. Adding an update shows it in the history and as the newest-update line on the card row.
5. **Take a task showing `untouched Nd`, add an update, confirm the badge clears.** This is the core of the feature.
6. Deleting an update removes it.
7. A task created before this change (no `state`, no `updates`) opens and behaves normally.

- [ ] **Step 5: Commit**

```bash
node build.js
git add app.jsx app.js
git commit -m "Add task states and a dated update log"
```

---

### Task 7: Upcoming Classes as a shared card

**Files:**
- Modify: `app.jsx:4269` (the `upcomingClasses` filter), `app.jsx:4341-4348` (the Uni tab card), `renderHomeCard` from Task 2

**Interfaces:**
- Consumes: existing module-level `isAssessmentEvent` (`app.jsx:345`), `todayStr`, `dStr`, `fmtDate`; plus `dedupedEvents` and `gcalConnected` from `App()`.
- Produces: module-level `UNI_KEYS` and `isUniCalEv(ev) -> boolean` (hoisted); component `UpcomingClassesCard({events, days, gcalConnected, evColor, evLabel, cardStyle, mob})`.

**Scope warning — read before writing code.** `evColor` (`app.jsx:3872`) and `evLabel` (`3873`) are declared *inside* `App()`, and `isUniCalEv` (`4267`) is nested deeper still, inside the Uni tab's IIFE. A module-level component cannot reach any of them. `evLabel` additionally closes over `data.uni.subjects`, so it cannot simply be hoisted. Resolution:

- `isUniCalEv` and its `UNI_KEYS` array depend only on their argument — **hoist both to module level**, beside `isAssessmentEvent` at `app.jsx:345`, and delete the nested copies at `4266-4267`.
- `evColor` and `evLabel` stay inside `App()` and are **passed in as props**.

- [ ] **Step 1: Hoist the uni-calendar predicate**

Move from `app.jsx:4266-4267` to module level, just after `isAssessmentEvent` (`app.jsx:345`):

```jsx
const UNI_KEYS=["uni","tafe","rmit","university","curtin","monash","deakin","uts","usyd","uq","uwa","anu","unsw","federation"];
function isUniCalEv(ev){return ev.calName&&UNI_KEYS.some(function(k){return ev.calName.toLowerCase().includes(k);});}
```

Delete the originals inside the Uni block. Verify no other code inside that IIFE relied on a differently-scoped `UNI_KEYS`.

- [ ] **Step 2: Extract the component**

Add before `function App()` (`app.jsx:2725`). Move the filter from `app.jsx:4269` inside it, and the markup from `app.jsx:4348` verbatim:

```jsx
// Shared by the home page (7 days) and the Uni tab (28 days) so the two
// cannot drift apart. `events` is the deduped Google Calendar event list.
// evColor/evLabel are passed in because they live inside App() — evLabel
// closes over data.uni.subjects and cannot be hoisted.
function UpcomingClassesCard({events,days,gcalConnected,evColor,evLabel,cardStyle,mob}){
  const today=todayStr();
  const end=(function(){const d=new Date();d.setDate(d.getDate()+days);return dStr(d);})();
  const classes=(events||[])
    .filter(function(ev){return isUniCalEv(ev)&&!isAssessmentEvent(ev)&&!ev.allDay
                                &&ev.date>=today&&ev.date<=end;})
    .sort(function(a,b){return a.date.localeCompare(b.date)||(a.time||"").localeCompare(b.time||"");});
  let lastDate="";
  return(
    <div className="card-rim" style={cardStyle}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={sTGlobal}>Upcoming Classes</div>
        <div style={{fontSize:9,color:T.text3}}>next {days} days</div>
      </div>
      {classes.length===0
        ?<div style={{fontSize:12,color:T.text2}}>
          {gcalConnected?"No upcoming classes in the next "+days+" days.":"Connect Google Calendar to see your schedule."}</div>
        :classes.map(function(ev){
          const showDate=ev.date!==lastDate;lastDate=ev.date;
          const col=evColor(ev);const isToday=ev.date===today;
          return(<div key={ev.id}>
            {showDate&&<div style={{fontSize:10,fontWeight:600,color:isToday?T.accent:T.text2,
                                    marginTop:10,marginBottom:6,paddingTop:8,
                                    borderTop:"0.5px solid "+T.border}}>
              {isToday?"Today · ":""}
              {new Date(ev.date+"T12:00:00").toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"short"})}
            </div>}
            <div style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
              <div style={{width:2,borderRadius:2,background:col,alignSelf:"stretch",minHeight:28,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text2,marginBottom:1}}>{evLabel(ev)}</div>
                <div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{ev.title}</div>
                {ev.description&&<div style={{fontSize:10,color:T.text3,marginTop:2,lineHeight:1.4}}>
                  {ev.description.slice(0,120)}{ev.description.length>120?"…":""}</div>}
                <div style={{fontSize:10,color:T.text3,marginTop:2}}>{ev.time}</div>
              </div>
            </div>
          </div>);})}
    </div>);
}
```

`sT` is defined inside `App()` (`app.jsx:3944`). Hoist a module-level copy named `sTGlobal` beside `PCARD` (`app.jsx:2468`) with the identical value, and use it here.

- [ ] **Step 3: Use it in the Uni tab**

Replace `app.jsx:4342-4349` with:

```jsx
<UpcomingClassesCard events={dedupedEvents} days={28} gcalConnected={gcalConnected}
  evColor={evColor} evLabel={evLabel} cardStyle={card()} mob={mob}/>
```

Delete the now-unused `upcomingClasses` and `ucEnd` locals at `app.jsx:4269`.

- [ ] **Step 4: Use it on the home page**

In `renderHomeCard`, replace the `classes` stub:

```jsx
case "classes": return <UpcomingClassesCard events={dedupedEvents} days={7}
  gcalConnected={gcalConnected} evColor={evColor} evLabel={evLabel} cardStyle={card()} mob={mob}/>;
```

- [ ] **Step 5: Build and verify by hand**

```bash
node build.js && npx --yes http-server -p 8080 -c-1
```

Check:
1. Uni tab card is unchanged in appearance and still says "next 28 days".
2. Home page has an Upcoming Classes card saying "next 7 days", listing only classes within a week.
3. Both group by day with the same styling; today is highlighted.
4. With Google Calendar disconnected, both show the connect prompt.
5. The home card can be dragged and resized in edit mode like any other.

- [ ] **Step 6: Commit**

```bash
node build.js
git add app.jsx app.js
git commit -m "Extract Upcoming Classes into a shared card, add it to the home page"
```

---

### Task 8: Weekly necessities

**Files:**
- Create: `week-utils.js`
- Create: `test/week-utils.test.js`
- Modify: `dashboard.html`, `app.jsx` (`renderHomeCard`)

**Interfaces:**
- Consumes: nothing for the logic module.
- Produces: global `WeekUtils` with `localDateStr(d:Date) -> string`, `weekStartStr(dateStr) -> string` (Monday), `isDoneThisWeek(tickDateStr|null, todayStr) -> boolean`, `weekElapsedFraction(todayStr) -> number` (Monday = 1/7, Sunday = 1).
- Produces: `data.personal.necessities = {items:[{id,name}], ticks:{[itemId]:dateStr}}`.

- [ ] **Step 1: Write the failing test**

Create `test/week-utils.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const W = require('../week-utils.js');

// 2026-08-02 is a Sunday; its week began Monday 2026-07-27.
test('weekStartStr returns the Monday of that week', () => {
  assert.strictEqual(W.weekStartStr('2026-08-02'), '2026-07-27', 'Sunday belongs to the week before');
  assert.strictEqual(W.weekStartStr('2026-07-27'), '2026-07-27', 'Monday is its own week start');
  assert.strictEqual(W.weekStartStr('2026-07-31'), '2026-07-27', 'Friday');
  assert.strictEqual(W.weekStartStr('2026-08-03'), '2026-08-03', 'the next Monday starts a new week');
});

test('weekStartStr handles month and year boundaries', () => {
  assert.strictEqual(W.weekStartStr('2026-01-01'), '2025-12-29');
  assert.strictEqual(W.weekStartStr('2026-03-01'), '2026-02-23');
});

test('isDoneThisWeek is true only within the same Monday-based week', () => {
  assert.strictEqual(W.isDoneThisWeek('2026-07-30', '2026-08-02'), true, 'same week');
  assert.strictEqual(W.isDoneThisWeek('2026-07-27', '2026-08-02'), true, 'the Monday itself');
  assert.strictEqual(W.isDoneThisWeek('2026-07-26', '2026-08-02'), false, 'previous week');
  assert.strictEqual(W.isDoneThisWeek('2026-08-02', '2026-08-03'), false,
    'a Sunday tick does not carry into Monday — this is the auto-reset');
});

test('isDoneThisWeek treats missing ticks as not done', () => {
  assert.strictEqual(W.isDoneThisWeek(null, '2026-08-02'), false);
  assert.strictEqual(W.isDoneThisWeek(undefined, '2026-08-02'), false);
  assert.strictEqual(W.isDoneThisWeek('', '2026-08-02'), false);
});

test('a tick survives a fortnight of not opening the app, then resets', () => {
  assert.strictEqual(W.isDoneThisWeek('2026-07-30', '2026-08-01'), true);
  assert.strictEqual(W.isDoneThisWeek('2026-07-30', '2026-08-14'), false,
    'no background job needed — staleness is derived, not stored');
});

test('weekElapsedFraction runs from 1/7 on Monday to 1 on Sunday', () => {
  assert.ok(Math.abs(W.weekElapsedFraction('2026-07-27') - 1 / 7) < 1e-9);
  assert.ok(Math.abs(W.weekElapsedFraction('2026-08-02') - 1) < 1e-9);
});

test('localDateStr never shifts a day via UTC', () => {
  assert.strictEqual(W.localDateStr(new Date(2026, 7, 2, 23, 30)), '2026-08-02');
  assert.strictEqual(W.localDateStr(new Date(2026, 0, 1, 0, 15)), '2026-01-01');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../week-utils.js'`

- [ ] **Step 3: Write the implementation**

Create `week-utils.js`:

```js
/**
 * week-utils.js
 * Monday-based week boundaries.
 *
 * The weekly necessities card resets by DERIVATION, not by a scheduled job:
 * a tick counts only if it falls inside the current week. Nothing has to run
 * on Monday morning, so the reset is correct even if the dashboard is not
 * opened for a fortnight, and it cannot disagree between two devices.
 *
 * No DOM, no React. Loaded as a browser global before app.js and require()-able.
 */
(function (root) {
  'use strict';

  // Local calendar date. Never toISOString() — that shifts to UTC and moves
  // the day boundary, which in Melbourne is wrong for most of the evening.
  function localDateStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function weekStartStr(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    var dow = d.getDay();                 // 0 = Sunday
    var off = dow === 0 ? -6 : 1 - dow;   // back to Monday
    d.setDate(d.getDate() + off);
    return localDateStr(d);
  }

  function isDoneThisWeek(tickDateStr, todayStr) {
    if (!tickDateStr) return false;
    return weekStartStr(tickDateStr) === weekStartStr(todayStr);
  }

  // 1/7 on Monday through 1 on Sunday — how much of the week is spent.
  function weekElapsedFraction(todayStr) {
    var d = new Date(todayStr + 'T00:00:00');
    var dow = d.getDay();
    var idx = dow === 0 ? 6 : dow - 1;    // Monday = 0 … Sunday = 6
    return (idx + 1) / 7;
  }

  var api = {
    localDateStr: localDateStr,
    weekStartStr: weekStartStr,
    isDoneThisWeek: isDoneThisWeek,
    weekElapsedFraction: weekElapsedFraction
  };

  root.WeekUtils = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — all three suites green.

- [ ] **Step 5: Add the script tag**

In `dashboard.html`, after the `task-grouping.js` tag:

```html
<script src="week-utils.js"></script>
```

- [ ] **Step 6: Build the card**

Add `renderNecessitiesCard()` inside `App()` and wire it into `renderHomeCard`'s `necessities` case:

```jsx
function renderNecessitiesCard(){
  const W=window.WeekUtils;
  const nec=(data.personal&&data.personal.necessities)||{items:[],ticks:{}};
  const items=nec.items||[];
  const today=todayStr();
  const isDone=function(id){return W.isDoneThisWeek((nec.ticks||{})[id],today);};
  const doneCount=items.filter(function(i){return isDone(i.id);}).length;
  const elapsed=W.weekElapsedFraction(today);
  const progress=items.length?doneCount/items.length:0;
  const behind=progress<elapsed-0.15;
  const daysLeft=Math.round((1-elapsed)*7);

  function toggle(id){
    setData(function(p){
      const cur=(p.personal&&p.personal.necessities)||{items:[],ticks:{}};
      const ticks={...(cur.ticks||{})};
      if(W.isDoneThisWeek(ticks[id],todayStr())) delete ticks[id];
      else ticks[id]=todayStr();
      return{...p,personal:{...p.personal,necessities:{...cur,items:cur.items||[],ticks:ticks}}};
    });
  }

  return(
    <div className="card-rim" style={card()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={sT}>Weekly necessities</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:10,color:T.text3}}>{doneCount}/{items.length}</span>
          <button style={{...btn,fontSize:10,padding:"2px 9px"}}
            onClick={function(){setModal("edit_necessities");setMForm({newItem:""});}}>Edit</button>
        </div>
      </div>

      <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:4}}>
        <div style={{width:(progress*100)+"%",height:"100%",borderRadius:3,
                     background:behind?T.warn:T.success,transition:"width 0.25s"}}/>
      </div>
      <div style={{fontSize:9,color:T.text3,marginBottom:10}}>
        {daysLeft===0?"Last day · resets Monday":daysLeft+" day"+(daysLeft===1?"":"s")+" left · resets Monday"}
      </div>

      {items.length===0&&<div style={{fontSize:12,color:T.text2}}>
        No necessities yet — hit Edit to add the things you do every week.</div>}

      {items.map(function(i){
        const done=isDone(i.id);
        const urgent=!done&&daysLeft<=2;   // Friday onward — matches the spec
        return(
          <div key={i.id} onClick={function(){toggle(i.id);}}
            style={{display:"flex",gap:9,alignItems:"center",padding:"8px 10px",marginBottom:5,
                    borderRadius:10,cursor:"pointer",opacity:done?0.5:1,
                    background:"rgba(225,234,255,0.04)",
                    border:"1px solid "+(urgent?T.warn+"55":"rgba(255,255,255,0.07)")}}>
            <input type="checkbox" readOnly checked={done}
              style={{accentColor:T.accent,flexShrink:0,pointerEvents:"none"}}/>
            <span style={{fontSize:12,color:T.text,flex:1,minWidth:0,
                          textDecoration:done?"line-through":"none"}}>{i.name}</span>
            {urgent&&<span style={{fontSize:9,color:T.warn,flexShrink:0}}>
              {daysLeft===0?"today":daysLeft+" day"+(daysLeft===1?"":"s")+" left"}</span>}
          </div>);})}
    </div>);
}
```

- [ ] **Step 7: Add the edit modal**

A `edit_necessities` modal case listing items with a remove button and an add input. Adding pushes `{id:Date.now(),name}` into `data.personal.necessities.items`; removing filters it out and deletes its tick.

```jsx
{modal==="edit_necessities"&&(function(){
  const nec=(data.personal&&data.personal.necessities)||{items:[],ticks:{}};
  function setItems(next){
    setData(function(p){
      const cur=(p.personal&&p.personal.necessities)||{items:[],ticks:{}};
      return{...p,personal:{...p.personal,necessities:{...cur,items:next}}};
    });
  }
  return(<div>
    <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:12}}>Weekly necessities</div>
    {(nec.items||[]).map(function(i){return(
      <div key={i.id} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:12,color:T.text,flex:1}}>{i.name}</span>
        <button onClick={function(){setItems((nec.items||[]).filter(function(x){return x.id!==i.id;}));}}
          style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:15,
                  lineHeight:1,padding:"0 4px"}} title="Remove">×</button>
      </div>);})}
    <div style={{display:"flex",gap:6,marginTop:12}}>
      <input style={{...PINP,flex:1}} placeholder="Add a weekly necessity…" value={mForm.newItem||""}
        onChange={function(e){setMForm(function(f){return{...f,newItem:e.target.value};});}}
        onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();
          const v=(mForm.newItem||"").trim();if(!v)return;
          setItems((nec.items||[]).concat([{id:Date.now(),name:v}]));
          setMForm(function(f){return{...f,newItem:""};});}}}/>
      <button style={btnP} onClick={function(){
        const v=(mForm.newItem||"").trim();if(!v)return;
        setItems((nec.items||[]).concat([{id:Date.now(),name:v}]));
        setMForm(function(f){return{...f,newItem:""};});}}>Add</button>
    </div>
  </div>);
})()}
```

- [ ] **Step 8: Build and verify by hand**

```bash
node build.js && npx --yes http-server -p 8080 -c-1
```

Check:
1. Card appears on the home page; Edit adds and removes items.
2. Ticking an item marks it done and updates the count and bar.
3. **The reset:** tick an item, then change your machine's clock forward past the next Monday and reload without opening the app in between. The item is unticked and the count is back to zero. Set the clock back afterwards.
4. Falling behind the week turns the progress bar amber.
5. From Friday onward, unticked items show the amber "2 days left" / "1 day left" / "today" marker.
6. The card drags and resizes like any other.

- [ ] **Step 9: Commit**

```bash
node build.js
git add week-utils.js test/week-utils.test.js dashboard.html app.jsx app.js
git commit -m "Add weekly necessities card with derived Monday reset"
```

---

### Task 9: Completed tasks on the calendar

**Files:**
- Modify: `app.jsx:3875` (`renderWeek`, both the desktop grid and the mobile day view)

**Interfaces:**
- Consumes: `WeekUtils`, `catColor` from Task 5, `data.personal.tasks`, `data.personal.archived`.
- Produces: `completionsByDay(dateStr) -> task[]` inside `App()`.

- [ ] **Step 1: Add the lookup**

Reading `archived` as well as `tasks` is the point — `archiveDone` (`app.jsx:3645`) moves completed tasks out of the list, and without this the calendar history would empty itself every time the task list is tidied.

```jsx
const completionsByDay=React.useMemo(function(){
  const map={};
  const all=((data.personal&&data.personal.tasks)||[])
    .concat((data.personal&&data.personal.archived)||[]);
  all.forEach(function(t){
    if(!t.done||!t.completedAt)return;
    (map[t.completedAt]=map[t.completedAt]||[]).push(t);
  });
  return map;
},[data.personal]);
```

- [ ] **Step 2: Add the desktop strip**

At the end of `renderWeek()`'s desktop branch, below the time grid, add a 7-column band aligned to the day columns:

```jsx
<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginTop:10,
             paddingTop:10,borderTop:"0.5px solid "+T.border}}>
  {weekDates.map(function(d,di){
    const ds=dStr(d);
    const done=completionsByDay[ds]||[];
    return(
      <div key={di} style={{padding:"0 4px",minHeight:34}}>
        {done.slice(0,3).map(function(t){
          const col=catColor(t.cat||"Other");
          return(
            <div key={t.id} style={{display:"flex",gap:5,alignItems:"center",marginBottom:3}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:col,flexShrink:0,
                            boxShadow:"0 0 5px "+col+"90"}}/>
              <span style={{fontSize:9,color:T.text2,overflow:"hidden",textOverflow:"ellipsis",
                            whiteSpace:"nowrap"}} title={t.name}>{t.name}</span>
            </div>);})}
        {done.length>3&&<button onClick={function(){setModal("day_done");setMForm({date:ds});}}
          style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:9,
                  padding:0}}>+{done.length-3} more</button>}
      </div>);})}
</div>
```

No strikethrough: these are a record of what was done, not something cancelled.

- [ ] **Step 3: Add the `day_done` modal**

```jsx
{modal==="day_done"&&(function(){
  const done=completionsByDay[mForm.date]||[];
  return(<div>
    <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:12}}>
      Finished {new Date(mForm.date+"T12:00:00").toLocaleDateString("en-AU",
        {weekday:"long",day:"numeric",month:"long"})}</div>
    {done.map(function(t){
      const col=catColor(t.cat||"Other");
      return(
        <div key={t.id} style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:col,flexShrink:0}}/>
          <span style={{fontSize:12,color:T.text,flex:1}}>{t.name}</span>
          <span style={{fontSize:10,color:T.text3}}>
            {t.completedTime?fmtTime12(t.completedTime):""}</span>
        </div>);})}
  </div>);
})()}
```

- [ ] **Step 4: Add the mobile section**

In `renderWeek()`'s mobile branch, after the events list (`app.jsx:3903`):

```jsx
{(completionsByDay[activeDay]||[]).length>0&&<div style={{marginTop:14,paddingTop:10,
    borderTop:"0.5px solid "+T.border}}>
  <div style={{fontSize:10,color:T.text3,marginBottom:8,textTransform:"uppercase",
               letterSpacing:0.5}}>Finished today</div>
  {(completionsByDay[activeDay]||[]).map(function(t){
    const col=catColor(t.cat||"Other");
    return(
      <div key={t.id} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
        <span style={{width:6,height:6,borderRadius:"50%",background:col,flexShrink:0}}/>
        <span style={{fontSize:12,color:T.text2,flex:1}}>{t.name}</span>
      </div>);})}
</div>}
```

`catColor` is defined inside `App()` in Task 5, and `renderWeek` is also inside `App()`, so it is in scope.

- [ ] **Step 5: Build and verify by hand**

```bash
node build.js && npx --yes http-server -p 8080 -c-1
```

Check:
1. Complete a task today. It appears under today's calendar column, colour-dotted by category, **no strikethrough**.
2. Use the clock icon to backdate a completion to another day this week — it lands on that day.
3. Complete four tasks on one day — three show plus a `+1 more` that opens the day list.
4. **Hit "Archive done" on the Personal tasks list, then look at the calendar. The entries are still there.** This is the regression this task exists to prevent.
5. Nothing appears in Google Calendar; open Google Calendar and confirm.
6. Mobile day view shows a "Finished today" section.

- [ ] **Step 6: Commit**

```bash
node build.js
git add app.jsx app.js
git commit -m "Show completed tasks on the calendar, sourced locally"
```

---

### Task 10: Full pass, build verification, handoff note

**Files:**
- Modify: `OneDrive/Documents/Obsidian Vault/Claude/Cross-Device Handoff.md`

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — `home-layout`, `task-grouping`, `week-utils`, no failures.

- [ ] **Step 2: Verify the build is reproducible**

```bash
node build.js
git status --short
```
Expected: no modification to `app.js` — the committed bundle already matches `app.jsx`. Any diff here means a commit shipped a stale bundle; rebuild and amend.

- [ ] **Step 3: End-to-end walkthrough**

With the dashboard served locally, confirm every spec requirement in one sitting:

1. No dead gaps on the home page at desktop width.
2. Drag a card, resize it to 2 columns, reload — both stuck.
3. Reset layout restores defaults.
4. Task categories are coloured and counted; the filter works.
5. Task groups are in the right order; a waiting task is not shouted at as overdue.
6. Adding an update clears an `untouched` badge.
7. Upcoming Classes on home (7 days) and Uni (28 days).
8. Necessities tick, and reset across a simulated Monday.
9. Completed tasks show on the calendar and survive Archive done.
10. Mobile view is unchanged throughout.

Record anything that fails and fix it before proceeding.

- [ ] **Step 4: Update the handoff note**

Rewrite the **Latest state** section of `Obsidian Vault/Claude/Cross-Device Handoff.md` and add a dated log entry recording: the branch `feat/home-layout-and-tasks`, that it is unmerged and unpushed, the three new logic modules, the new `npm test` command, and that `data.homeLayout` plus `data.personal.necessities` are new shapes in Firestore the Mac will also read.

- [ ] **Step 5: Report to Jayden and stop**

Summarise what landed and what to look at. **Do not push, do not merge to `main`** — pushing to `main` deploys the live site, and that is Jayden's call.

---

## Notes for the implementer

- `app.jsx` is a single 5097-line file and `App()` spans roughly 2400 of them. The `renderXCard()` extraction in Task 2 exists to stop this work making that worse. Keep new components at module level, outside `App()`, wherever they do not need its state.
- `T` (theme), `card()`, `sT`, `btn`, `btnP`, `editPill` and `PINP` are existing style objects — reuse them rather than inventing new ones. `T.danger`, `T.warn`, `T.success`, `T.accent`, `T.text`, `T.text2`, `T.text3` are the colour roles.
- `trk(...)` is the existing analytics call. Follow the naming already in the file (`task.add`, `finance.expense_edit`).
- If a step's code does not compile, `node build.js` fails loudly with the Babel error and writes nothing. Trust that as your syntax check.
