# Handover — Jarvis stage 1

**Written:** 2026-08-07, end of session
**Branch:** `worktree-jarvis-signals`, commit `eb21ca3`
**Worktree:** `C:\Users\Jayde\my-project\.claude\worktrees\jarvis-signals`
**State:** stage 1 built, committed and pushed. **102 tests, all passing.**
Stage 2 has its foundation (`jarvis-view.js`) only — nothing user-visible yet.
Read "The uni source, rebuilt" for the most recent changes.

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

## The floor rule, as built

```
npm test        # 102 tests, all passing
```

### The bug this fixed

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

Two tests in `test/jarvis-signals.test.js` pin this down, and both now pass:

- `the same get-ahead suggestions appear when nothing is happening`
- `no candidate claims nothing is wrong while something is`

### How it works now

1. **`floorOnly: true`** marks candidates that only make sense when nothing real
   is happening:
   - `getAhead.task` in `getAheadSource`
   - the `> 14 days` branch of `uni.next` ("Good day to get ahead on X")
   - the healthy-disposable branch of `financeSource` ("$X spare this month")
2. **`rank()`**, after sorting, drops every `floorOnly` candidate if any
   non-`floorOnly` candidate scores `>= BANDS.decaying` (30). Otherwise it keeps
   them, so a calm day still gets a suggestion instead of silence. The all-clear
   fallback still applies if the list ends up empty.
3. **`gymSource`'s `why` is context-free.** Gym sits in the decaying band and
   survives on busy days, so it was the one non-`floorOnly` candidate asserting
   calm. It now states only its own facts — days idle, which session is next.

The general rule, worth applying to any new source: **a candidate's text may
only describe its own facts.** It cannot claim anything about the rest of the
list, because it does not know where it will rank. If a candidate's wording
needs the rest of the list to be quiet, it is `floorOnly`; if it does not, its
wording must survive a busy day.

Verified against the real backup in both directions — busy days no longer carry
a false get-ahead line, and a simulated calm day still produces one. Re-run that
check (below) after any ranking change.

---

## The uni source, rebuilt — 2026-08-08

Found the same way as the floor-rule bug: by running the ranker over the real
backup at future dates and reading the sentences.

**One old miss silenced the whole subject.** `uniSource` sorted assessments by
distance from today and took the first — which, once anything is overdue, is the
*most overdue* item, forever. Replayed forward on his real semester it was still
leading with a 103-day-old SPREADSHEETS hand-in in November, while 33 others,
one of them due the next day, were never mentioned. It answered "what is nearest
in time" when the question is "what should I do".

Now three candidates instead of one, because they are three different questions:

| id | Question | Score |
|---|---|---|
| `uni.overdue` | What has already been missed? One card for the whole backlog — naming them individually would crowd out everything else on a bad semester. | 95 |
| `uni.next` | What is next? Measures **future items only**, so it can never be describing something already missed. | 88 → 20 by proximity |
| `uni.crunch` | Where does the semester bunch up? | 48 / 42 |

**The pile-up.** 34 open assessments over 8 subjects, and seven of them land on
25–26 October. Jarvis showed the nearest one and nothing else, so a collision was
invisible until it arrived — the single most useful thing his data holds, unread.
`findCluster` looks for ≥3 assessments within 3 days of each other, up to 35 days
out.

Two things it took a second reading to get right:

- **Nearest wins, not biggest.** First version picked the largest run, so it
  warned about five colliding in 30 days while ignoring three colliding in 9.
  Useless — the near one has to be survived to reach the far one, and by then the
  far one is near and gets its own warning.
- **It scored 42–48, deliberately.** Below `approaching` (50) so it never reads
  as a deadline of its own; above the gym ceiling (40) because at 38 it ranked
  *under* "42 days since your last session", and four colliding hand-ins are not
  a missed workout.

When the pile-up *is* the next thing due, `uni.crunch` is suppressed and
`uni.next` carries it in its `why` instead — otherwise it is the same news twice.

**The horizon limits the card, not the sentence.** Second reading of the calm-day
path caught this: with everything before 20 October cleared, the nearest thing due
is one of the seven landing on 25–26 October, and Jarvis said only "78 days out
and nothing is pressing" — omitting the one fact that makes starting it worthwhile.
`runFrom()` describes whatever lands alongside a given assessment at *any*
distance and feeds `uni.next`; `findCluster()` stays horizon-limited and feeds
`uni.crunch`. A candidate describing its own facts is always allowed; only the
extra *card* risks crying wolf. The calm day now reads:

> Good day to get ahead on FinStmts NRE Assessment 3
> It is 78 days out and nothing is pressing, so this is the best use of the time.
> **8 assessments across 8 subjects land within 2 days, this one first.**

**The all-clear stopped claiming "bills covered".** It fires when *no* source
produced anything, including when the Finance tab is empty, so it never had
grounds for that. Same rule as the floor candidates, applied to the one card that
had been exempt from it.

102 tests (was 88). No app.jsx change needed — the card reads candidates
generically, so new signals appear on their own.

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

## The money signal — DONE 2026-08-07

> **Status: wired and verified.** `app.jsx:3367` passes `money: jarvisMoney(data,
> dedupedEvents)` into `rank()`. Verified on screen against the Finance tab:
> $1,251 income, −$227 expenses, +$1,024 net, −$202 disposable, all unchanged
> after the lift. The blocker write-ups below are kept because they explain *why*
> the money maths is shaped the way it is — read them before touching it, but
> nothing here is outstanding work.

Both blockers are resolved, and the second turned out to be the real one — an
earlier draft of this note listed only the first and made the job look like
twenty minutes.

**Blocker 1 — RESOLVED. The `getPeriodRange` lift. Small.** It sat inside `WorkSection`
at `app.jsx:2082–2092`, with one call site at 2093. It closes over exactly one
value, `payCycleDay` (line 2081), and that is not component state:

```js
const payCycleDay = Number(data.payCycleDay || 1);
```

It is derived from `data`, which is already in scope at the `jarvisCandidates`
memo (line 3333). So: move the function to module level, take `payCycleDay` as a
parameter, have `WorkSection` pass its existing local. `dStr` (line 260) is
already module-level. Still check the Work tab's figures are unchanged — it is
real money maths — but the lift itself is mechanical.

**Blocker 2 — RESOLVED 2026-08-07, but not the way this note first proposed.**

The first attempt added `JarvisSignals.billsTotal(data)`, recomputing bills from
`recurringTemplates`. That was wrong twice over and has been removed:

1. It ignored `monthlyRecurringOverrides`, so it would have disagreed with the
   Finance tab in any month Jayden skipped or adjusted a bill.
2. **Bills coverage is the wrong question.** His August 2026: $1,251 income
   against $227 of bills — a $1,024 surplus a bills-coverage signal would call
   comfortable. His actual disposable was **minus $202**, because a
   $1,225/month savings commitment consumes it. Congratulating him there is the
   same failure as the floor-rule bug: true in isolation, false in context.

What exists now: `financeSummary(data, work, gcalEvents, month)` at module level
in `app.jsx` — the Finance tab's own maths, lifted verbatim, with the tab
destructuring from it. `jarvisMoney(dash, gcalEvents)` feeds `rank()`.
`financeSource` ranks on **disposable** and names only the components that are
non-zero.

**There is exactly one copy of the money maths. Keep it that way.** Never
recompute money inside `jarvis-signals.js`.

**Blocker 3 — gross vs net. Effectively settled by consistency, worth revisiting.**
`totalIncome` folds in `calcGoTabIncome`, which is hours × rate — **gross**. So
Jarvis is gross because the Finance tab is gross, and the two agree, which was
the higher priority. If Jayden later wants net, change it in `financeSummary`
and both move together. `estimateTax` already exists inside `WorkSection`.

**The `money` contract, as actually built.** `app.jsx` computes every figure and
hands it in; `jarvis-signals.js` never recomputes any of it. `jarvisMoney()`
(app.jsx:1076) reads straight off `financeSummary` and passes:

```js
money: { income, bills, oneOffs, savings, disposable }
```

`financeSource` treats absent `money` — or `income <= 0` — as "not configured"
and stays silent, which is why stage 1 works before the Finance tab is set up.

> ⚠️ Earlier drafts of this handover described a `billsTotal` field and told the
> next session to build one. **It was built, then deleted the same session.** It
> recomputed bills a second time and ignored `monthlyRecurringOverrides`, so it
> would have drifted from the Finance tab in any month a bill was skipped or
> adjusted — and bills coverage turned out to be the wrong question anyway. If
> you find `billsTotal` referenced anywhere, it is stale documentation, not a
> missing feature.

---

## Verifying

```bash
cd C:\Users\Jayde\my-project\.claude\worktrees\jarvis-signals
node --test test/jarvis-signals.test.js     # 28 tests — while iterating
npm test                                    # all 68 — before committing
```

The whole suite runs in ~200 ms, so the single-file loop saves almost nothing.
Just run `npm test`.

**You usually do not need to run `build.js` yourself.** `core.hooksPath` points
at `C:\Users\Jayde\my-project\.githooks`, whose `pre-commit` hook rebuilds
`app.js` and stages it — but **only if `app.jsx` is in the commit**. It exits
straight away otherwise, and it does **not** run the tests. So a change confined
to `jarvis-signals.js` needs no build at all, and nothing will stop you
committing a red suite. Run `npm test` yourself.

`build.js` is plain Babel (`@babel/standalone`, presets `react` + `env`),
reading only `app.jsx` and writing only `app.js`. It embeds no timestamp, hash
or version, so its output is deterministic: after a rebuild with no source
change, `git diff --ignore-cr-at-eol --stat app.js` is genuinely empty.

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

## Answered by Jayden, 2026-08-07

1. **How bossy? — top three, ranked.** Not one firm answer. Stage 1 currently
   renders one lead plus "also considered"; stage 2 should show three.
2. **Tone — a bit sardonic.** Dry, in the JARVIS register. It still may not
   assert anything it does not know (see the floor rule); dryness is a matter of
   wording, never of claiming more than the facts support.
3. **Views — still open**, but grounded in what his data actually holds:

| Candidate view | Why | Data |
|---|---|---|
| **Work diary** | 22 written shift notes, read by nothing. His record of his own competence, currently invisible. Biggest piece of dead data in Athena. | `work.shiftLogs` |
| **Semester shape** | 34 open assessments over 8 subjects; Jarvis sees only the nearest. Shows where subjects collide, so work moves *before* it is overdue. | `uni.assessments` |
| **What he drops** | 49 archived vs 10 open. Pattern he cannot see from inside, and the natural home for the sardonic register. | `personal.archived` |
| **Alignment** | A North Star exists and appears nowhere. Holds today's three against it. | `boardroom.northStar` |

Rejected: a body-weight view. 12 entries over four months is too sparse to say
anything honest with.

## Task assistance — two jobs, not one

Jayden asked for Jarvis to "help through" a task and do research. These are
different in kind and must not be shipped as one feature:

- **Breakdown** — turn a task into `stages → steps`, the shape Projects already
  uses. Safe, and it is stage 3's confirm-before-write path. Build this first.
- **Research** — ⚠️ the dashboard has **no retrieval**. A model with no search
  cannot look up his unit's assessment brief; it will produce fluent, unsourced,
  plausible text. For an accounting assessment that is actively harmful. Do not
  ship "research" until a real search tool is wired in, and do not let the
  breakdown feature quietly grow into it.
