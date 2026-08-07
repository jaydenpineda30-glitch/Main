# Handover — Jarvis stage 1

**Written:** 2026-08-07, end of session
**Branch:** `worktree-jarvis-signals`, commit `eb21ca3`
**Worktree:** `C:\Users\Jayde\my-project\.claude\worktrees\jarvis-signals`
**State:** stage 1 built and committed. **2 tests deliberately failing** — they
specify the next job. Read "Pick up here" before anything else.

---

## Read these first, in order

1. `docs/superpowers/specs/2026-08-07-jarvis-design.md` — what Jarvis is and why.
   This is the source of truth. It exists because the July 2026 `jarvis` branch
   was built with its intent recorded nowhere, and five weeks later nobody could
   say what it was for.
2. This file — where the build actually got to.

---

## Where the work lives

Athena's normal folder was deliberately left untouched. Jayden asked for the work
to be isolated, and it is:

| | |
|---|---|
| Athena, Jayden's copy | `C:\Users\Jayde\my-project` — on `main`, level with GitHub, **no changes** |
| This work | `C:\Users\Jayde\my-project\.claude\worktrees\jarvis-signals` |

It is a git **worktree**, not a copy: same repository, its own folder and branch.
It merges back through normal git when it is ready. `.claude/` is gitignored, so
nothing here can leak into the repo by accident, and Pages only deploys from
`main`, so nothing here can reach the live site.

To work on it: `cd C:\Users\Jayde\my-project\.claude\worktrees\jarvis-signals`.
`npm install` has already been run there.

---

## Pick up here — the two failing tests

```
npm test        # 68 tests, 66 pass, 2 fail
```

Both failures are in `test/jarvis-signals.test.js`:

- `the same get-ahead suggestions appear when nothing is happening`
- `no candidate claims nothing is wrong while something is`

**They are correct and the code is wrong.** Do not weaken them.

### The bug

Found by running the ranker over a real dashboard backup rather than trusting
synthetic tests — worth repeating as a habit. On a day with two failing-band
items, Jarvis still produced:

```
>> LEAD [90 failing] 2 tasks are overdue
   [40 decaying] 353 days since your last session
        ... Nothing is on fire, so this is a genuinely good use of the afternoon.
   [15 getAhead] Nothing is due — good time for "Message Andrew about the camera"
```

"Nothing is on fire" and "Nothing is due" are simply false with two failing
items above them. Those strings were written assuming the candidate is the lead.

### The fix the tests expect

1. **Add a `floorOnly: true` flag** to candidates that only make sense when
   nothing real is happening:
   - `getAhead.task` in `getAheadSource`
   - the `> 14 days` branch of `uniSource` ("Good day to get ahead on X")
   - the "Bills covered with $X spare" branch of `financeSource`
2. **In `rank()`**, after sorting: if any non-`floorOnly` candidate scores
   `>= BANDS.decaying` (30), drop every `floorOnly` candidate. Otherwise keep
   them. The all-clear fallback still applies if the list ends up empty.
3. **Make `gymSource`'s `why` context-free** — delete "Nothing is on fire, so
   this is a genuinely good use of the afternoon". State only its own facts
   (days idle, which session is next). Gym sits in the decaying band and
   survives on busy days, so its wording must never assert calm.

The general rule, worth applying to any new source: **a candidate's text may
only describe its own facts.** It cannot claim anything about the rest of the
list, because it does not know where it will rank.

After fixing, re-run the real-data check (below) before trusting it.

---

## What was built

### New — `jarvis-signals.js` (pure, browser global + `require()`-able)

Ranks candidates across domains. Mirrors the `task-grouping.js` / `week-utils.js`
pattern exactly: no DOM, no React, no window, unit-tested under `npm test`.

Score bands — "what does it cost me not to do this today", **not** "how alarming":

| Band | Floor | Meaning |
|---|---|---|
| `failing` | 90 | going wrong right now |
| `deadline` | 70 | a hard date is close |
| `approaching` | 50 | a hard date is visible |
| `decaying` | 30 | gets worse the longer it is left |
| `getAhead` | 10 | nothing wrong; best use of a free day |
| `allClear` | 0 | genuinely nothing to report |

Sources: `financeSource`, `uniSource`, `tasksSource`, `gymSource`,
`calendarSource`, `getAheadSource`. Each returns candidates; one throwing is
caught and skipped, because a Jarvis missing one signal beats a silent one.

`tasksSource` calls `TaskGrouping.groupTasks` rather than reimplementing
"overdue", so Jarvis and the Tasks card cannot drift apart. Keep it that way.

### Changed

| File | Change |
|---|---|
| `home-layout.js` | `jarvis` added as a **pinned** card; `checkin` entry removed |
| `dashboard.html` | `jarvis-signals.js` script tag, **after** `task-grouping.js` (it reads `TaskGrouping`) |
| `dashboard.css` | `jarvis-in` keyframes, `.jarvis-lead` / `.jarvis-alt` stagger, `prefers-reduced-motion` guard |
| `app.jsx` | `JarvisCard` component; `jarvisCandidates` memo; rendered above the calendar; Daily Check-in removed |
| `test/home-layout.test.js` | pinned-card assertions + a test for the real upgrade path (saved layouts containing `checkin`) |

### Removed — the Daily Check-in

`doCheckin`, `generateCheckinFallback`, `renderCheckinCard`, its three state
variables, and its `HOME_CARDS` entry. Roughly 160 lines; `app.js` went 713 KB →
703 KB.

- **Nothing persisted was lost.** It only ever wrote to React state.
- **Weekly reflections are untouched** — a separate feature
  (`OllamaService.analyzeReflection`), still writing to `data.reflections`.
- **Assessment detection was rescued, not deleted.** `isAssessmentEvent` /
  `isWeeklyClass` moved into `jarvis-signals.js` and are now tested;
  `app.jsx` keeps thin delegates because `UpcomingClassesCard` still uses them.
- Saved layouts in Firestore still list `checkin`; `normalizeLayout` drops
  unknown ids, so they upgrade silently. There is a test for exactly this.

---

## Not done in stage 1

**The money signal is not wired.** `financeSource` is written and tested, but
`app.jsx` passes no `money` into `rank()`, so it stays quiet. The blocker:
`getPeriodRange` lives inside `WorkSection` (`app.jsx`, search for
`function getPeriodRange`) and the signal needs it at module level.

The July branch did exactly this lift — "lifted from WorkSection to top-level
`getPayPeriodRange` (verbatim; Work tab delegates — verified identical figures)".
Do the same: lift verbatim, have `WorkSection` delegate, then **check the Work
tab's figures are unchanged before trusting it**. It is real money maths.

Then pass in from `app.jsx`:

```js
money: { billsTotal, projected, shifts }
```

`financeSource` treats absent `money` as "not configured" and stays silent, which
is why stage 1 works without it.

---

## Verifying

```bash
cd C:\Users\Jayde\my-project\.claude\worktrees\jarvis-signals
npm test                                    # 68 tests
node build.js                               # app.jsx → app.js
git diff --ignore-cr-at-eol --stat app.js   # empty = build reproduces the commit
```

**Real-data check — do this after any ranking change.** It is what caught the
bug above, and synthetic tests did not:

```bash
node -e "
const fs=require('fs'), JS=require('./jarvis-signals.js');
const raw=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
const data=raw.dashData||raw.data||raw;
JS.rank({data,gcalEvents:[],today:process.argv[2]}).forEach((c,i)=>
  console.log((i?'   ':'>> ')+'['+c.score+' '+c.band+'] '+c.headline+'\n        '+c.why));
" "C:/Users/Jayde/OneDrive/Documents/Obsidian Vault/Dashboard/Backups/dashboard-2026-08-06.json" 2026-08-06
```

Try several dates — a busy one, a calm one, one far in the future — and read the
output as if it were talking to you. Ranking that passes tests can still say
things that are wrong in context; that is precisely the bug above.

**Nobody has seen this render.** The dashboard is behind Google sign-in, so no
agent can load it. Jayden has to check it himself, and the honest risks are:

- **Mobile.** Jarvis adds a card above everything, and the August notes already
  flag task rows as crowded on touch.
- **The calm-day path.** The floor rule is the thing most likely to read wrong.
- **Animation.** It fires on every page load; it should feel considered, not busy.

---

## Decisions already taken — do not silently reopen

- **Ranking is rules; the model only phrases.** Keeps it working with no API key,
  testable, and auditable. No model decides priority.
- **Do not merge `origin/jarvis`.** 38 commits behind, conflicts in the two files
  that matter, and its design is inverted — it goes *silent* when things are
  fine. Read it for reference only. Its `jarvis-service.js` is worth lifting as a
  file in stage 2 (new file, no conflict).
- **Jarvis replaces Boardroom, the Daily Check-in, and the Projects paste-from-
  Claude flow.** All three failed the same way: they made Jayden come to them.
- **Claude Opus 5 (`claude-opus-5`) for stage 2**, above Gemini in the existing
  fallback chain. Boardroom's `openai/gpt-oss-120b` via Groq is the concrete
  cause of the "horrible to use" complaint. Note Opus 5 **rejects `temperature`**
  (400) — `gemini-service.js` sets it; do not copy that across.

## Open questions for Jayden — decide before stage 2

1. **How bossy?** One firm answer, top 3 ranked, or one-plus-expandable. Built as
   one-plus-expandable so far.
2. **Tone.** JARVIS is dry and a little sardonic. How far to go?
3. **Which views after the first four** (`next-step`, `task-list`, `money`, `week`).
