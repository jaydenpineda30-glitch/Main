# Jarvis — design and build plan

**Status:** design agreed 2026-08-07, not yet built
**Branch:** to be created from `main` (do **not** merge `origin/jarvis` — see Prior art)

---

## Context

In July 2026 a `jarvis` branch was built over two days and parked on 2026-07-04. Its
intent was never written down — no spec, no session note, nothing captured in memory.
Five weeks later nobody could say what it was for. The code had to be read to guess at
the product, and the guess was wrong.

**This document exists so that cannot happen again.** It is the source of truth for what
Jarvis is. If the build drifts from it, change this file deliberately rather than letting
the reasoning evaporate a second time.

---

## What Jarvis is

> **Jarvis answers "what should I do next?" across everything — money, uni, tasks, gym —
> and lets you act on the answer by talking to him.**

It is named after Iron Man's JARVIS on purpose. The qualities that matter, and which of
them we are actually building:

| JARVIS quality | Building it? |
|---|---|
| Always on, conversational — no menu to navigate | Yes |
| Volunteers what matters before being asked | Yes |
| Answers with conclusions, not charts | Yes |
| Holds full context, so vague questions work | Yes |
| Has an opinion — recommends, occasionally pushes back | Yes |
| **Acts** — you say it, it happens | Yes (stage 3) |
| Voice | No — own project |
| Anything outside the dashboard (pay a bill, message someone) | No |

**Athena's other tabs are each a view of one area. Jarvis is the only thing that compares
across areas and picks.** `main` can already tell you which *task* is next
(`task-grouping.js`, tested). It cannot tell you that the task doesn't matter today
because an assessment is due Tuesday and bills are $200 short. That gap is the product.

### Three consequences that define the build

1. **It always answers.** Even on a calm day. If nothing is urgent, "next" becomes
   *"nothing pressing — good day to get ahead on the assignment due next week."*
   Silence is a failure state.
2. **It ranks by what's worth doing, not by what's alarming.** A gym nudge scoring 70
   means "genuinely a good use of today", not "moderately alarming".
3. **It explains itself.** If it says do the assignment, you can see why that beat the
   other options — otherwise you won't trust it and will go back to reading cards.

## What Jarvis is not

- **Not a chat log.** Responses render as real dashboard components (see below).
- **Not silent-when-fine.** That was the July build and it is the opposite of this.
- **Not read-only.** An advisor you then have to go and obey is not JARVIS.
- **Not a new card in the grid.** Long-term it becomes the front door (stage 4).

---

## Decisions taken 2026-08-07

**Jarvis replaces Boardroom.** Boardroom requires sitting down and deliberately using it,
which means it doesn't get used. Jarvis is ambient — it speaks first. Once stage 2 ships,
Boardroom is deprecated; `boardroom-service.js` and the Boardroom tab are removed in
stage 4. Its genuinely good part — `buildContext` — is lifted, not rewritten (below).

**Jarvis replaces the Daily Check-in.** The check-in prompt (`app.jsx:3436`) asks the model
to *"acknowledge his specific day, one concrete suggestion tied to his context, a question"* —
that is Jarvis's job, done worse: it only fires when you press the button, it can't act on
anything it suggests, and its output is thrown away on reload. Removed in stage 1.

Two things must be **lifted before deleting**, not lost:

- `isAssessmentEvent` / `isWeeklyClass` / `DEFINITE_ASSESS_MARKERS` / `ASSESS_KEYWORDS`
  (`app.jsx:341–405`) — calendar parsing that tells a real assessment apart from a weekly
  lecture. Jarvis's uni signal needs exactly this. Move to `jarvis-signals.js`.
- `generateCheckinFallback` (`app.jsx:406`) — a rule-based "what matters today" that is
  effectively a first draft of the signal model. Read it before writing the sources.

What goes: `doCheckin`, `generateCheckinFallback`, `renderCheckinCard`, the `checkin` entry
in `HOME_CARDS`, and the `checkinBlocks` / `checkinOpen` / `checkinLoading` state.

**Nothing persisted is lost** — the check-in wrote only to React state, never to `data`.
**Weekly reflections are untouched.** They are a separate feature
(`OllamaService.analyzeReflection`, `app.jsx:4055`) that writes real analysis into
`data.reflections`; `ollama-service.js` stays for it, and `isLikelySeedState` still counts
reflections as user content.

**Jarvis absorbs the Projects "baby steps" flow.** `app.jsx:2646` currently instructs:
*"Ask Claude to break a goal into baby-steps, then tap '+ New project' and paste it here."*
That manual copy-paste is the same friction that killed Boardroom. Jarvis generates the
project structure directly (stage 3), and can propose the next baby step as a "what's next"
candidate.

**Ranking is plain rules; the model only writes it up.** Scores live in a pure, testable
module. This keeps Jarvis working with no API key, keeps the ranking auditable, and matches
how every other AI feature in Athena already degrades (`ollama-service.js`:
Gemini → Ollama → templated fallback). The model is *not* trusted to decide priority.

---

## The core idea: Jarvis returns interface, not prose

When you ask Jarvis something, he does not type a paragraph. He decides **what to put on
your screen**. He replies with a small structured instruction — a *view spec* — and Athena
renders its own real components.

```jsonc
{
  "say": "The COMP2000 assignment is the one that matters today.",
  "show": { "view": "task", "ids": [1722308451234] },
  "cta":  { "label": "Open Uni", "page": "Uni" }
}
```

Athena reads that and mounts the real task card — real tick button, real navigation. Not a
description of one.

**Why this shape:**

- The buttons actually work, because they are the components that already exist.
- It stays fast — no HTML from the model, no `dangerouslySetInnerHTML`, no injection surface.
- It degrades cleanly: malformed JSON falls back to `say` as plain text, and no key at all
  falls back to a templated sentence from the rules.

**This mechanism is already proven in production here.** `gemini-service.js` calls Gemini
with `responseMimeType: 'application/json'` and has a robust `extractJson()` with a regex
fallback. Same pattern, new schema.

**The vocabulary grows one component at a time.** Jarvis cannot show what nobody has wired
up. Stage 2 ships four views; more get added on demand.

---

## What already exists — reuse map

Athena is much further along than it looks. Most of the machinery is built.

| Need | Already exists | Where |
|---|---|---|
| Digest whole dashboard into LLM context | `BoardroomService.buildContext(d, helpers)` — tasks, overdue, assessments, gym, shifts, calendar, reflections | `boardroom-service.js:107` |
| Structured JSON from an LLM | `extractJson()` + `responseMimeType: 'application/json'` | `gemini-service.js:26` |
| Provider fallback chain | Gemini → Ollama → `null`, caller uses templated fallback | `ollama-service.js` |
| Pinned card above the reorderable grid | `HOME_CARDS` registry, `pinned: true` (calendar) | `home-layout.js:24` |
| Adding a card without resetting saved layouts | `normalizeLayout()` — unknown ids go to the bottom | `home-layout.js:58` |
| Task ordering within tasks | `DISPLAY_ORDER`, `groupTasks()` — 39 tests | `task-grouping.js:20` |
| Data mutation + save | `setData(prev => next)`, localStorage immediate + Firestore debounced 2s | `app.jsx:3243` |
| Force an immediate save | `requestImmediateSave()` | `app.jsx:4039` |
| AI output → real task (precedent) | `brAcceptTask()` | `app.jsx:3629` |
| Task mutators | `completeTask`, `toggleTask`, `setTaskState` | `app.jsx:3801` |
| Wipe-protection on cloud writes | `isLikelySeedState()` | `app.jsx:232` |
| Animation vocabulary | 9 keyframes + `--ease-out` + `prefers-reduced-motion` guard | `dashboard.css` |
| Testable browser-global module pattern | `home-layout.js` / `task-grouping.js` / `week-utils.js` | root, `*.test.js` |

**From the July branch, lift these as files (they are new files — no merge conflict):**
`jarvis-service.js` provider routing and its `route(opts)` JSON mode.

### Prior art — do not merge `origin/jarvis`

It is 38 commits behind and conflicts in `app.jsx` and `dashboard.css`, because the
3 August home-grid rewrite touched the same region. More importantly its **design is
inverted** — every signal source bails out when things are fine
(`if(!overdue.length&&!dueSoon.length&&!urgent.length)return[]`) and the strip renders
nothing when no source fires. Start fresh from `main`; copy `jarvis-service.js` across as
a file; re-implement the rest.

---

## Model choice

Boardroom runs `openai/gpt-oss-120b` via Groq (`boardroom-service.js:11`). That is an
open-weights model, and it is the concrete cause of the "horrible to use" complaint —
it is not in the same class as a frontier model for nuanced judgment about someone's life.

**Use Claude Opus 5 — `claude-opus-5`.** $5 / $25 per million tokens in/out, 1M context.
Slot it in front of the existing providers, exactly as the July file was designed for
(`providers.unshift`), keeping Gemini and the templated fallback beneath it.

Request shape (raw `fetch`, matching how every other service in this app calls out —
Athena has no bundler for npm packages, it loads React from CDN via `<script>`):

```js
POST https://api.anthropic.com/v1/messages
headers:
  x-api-key: <key from localStorage>
  anthropic-version: 2023-06-01
  anthropic-dangerous-direct-browser-access: true
  content-type: application/json
body:
  model: "claude-opus-5"
  max_tokens: 4096
  output_config: { effort: "low", format: { type: "json_schema", schema: VIEW_SPEC_SCHEMA } }
  system: <persona + view vocabulary>
  messages: [...]
```

Three things that will bite if missed:

- **No `temperature` / `top_p` / `top_k`.** They return a 400 on Opus 5. `gemini-service.js`
  currently sets `temperature: 0.4` — do not copy that across.
- **Thinking is on by default** on Opus 5 and counts against `max_tokens`. Leave it on and
  use `effort: "low"` for latency — do **not** set `thinking: {type: "disabled"}`, which has
  documented failure modes (tool calls leaking into visible text, `<thinking>` tags leaking
  into output).
- **Structured outputs** use `output_config.format`, not the deprecated `output_format`.

**Key handling — accept the same risk we already accept, and no more.** The key lives in
localStorage and the call goes direct from the browser, identical to the existing Gemini
key. That means anyone with access to the browser profile, or any XSS, gets a billable key.
Athena is single-user and behind Google sign-in, so this is a considered trade, not an
oversight. If it ever needs hardening, the fix is a Firebase Cloud Function proxy — out of
scope here, noted so the decision is on the record.

---

## The ranking model

A new pure module, `jarvis-signals.js` — browser global **and** `require()`-able, same
pattern as `task-grouping.js`, so it is unit-testable with `node --test`.

Every source returns zero or more **candidates**:

```js
{ id, domain, headline, why, score, view, cta, facts, fingerprint }
```

Score bands — "what is the cost of not doing this today?":

| Band | Meaning | Examples |
|---|---|---|
| 90–100 | Failing right now | Bills not covered this cycle; 3+ tasks overdue |
| 70–89 | Hard deadline close | Assessment ≤3 days; task due today |
| 50–69 | Deadline approaching | Assessment ≤7 days; tasks due this week |
| 30–49 | Decaying if ignored | Gym idle 7+ days; task untouched 7+ days |
| 10–29 | Get ahead | Next assessment >7 days out; next baby step on a project |

**Floor rule — the one that makes it different from July.** `rank()` must never return an
empty list. If no candidate scores above 30, a `getAhead` source emits candidates from
what is merely *upcoming*. If even that is empty, emit a single `allClear` candidate.
This is a tested invariant, not a convention:

```js
test('rank never returns empty, even with a completely empty dashboard', ...)
test('a calm day still produces a get-ahead suggestion', ...)
```

---

## Stages

Each stage is worth shipping alone. Stop after any of them if it is not landing.

### Stage 1 — He speaks

A pinned Jarvis card at the top of the home page. Rules only; no LLM required for
correctness.

- `jarvis-signals.js` + `jarvis-signals.test.js` — sources, scoring, floor rule
- Register in `HOME_CARDS` with `pinned: true` (`home-layout.js`) so it renders outside the
  reorderable grid and existing saved layouts are untouched
- `<script src="jarvis-signals.js">` in `dashboard.html` before `app.js`
- `JarvisCard` in `app.jsx` — leads with one answer, "also considered" expandable
- Entrance animation reusing `--ease-out` and the staggered `--i` pattern; honour
  `prefers-reduced-motion`
- **Remove the Daily Check-in** (see Decisions) — lift the assessment-detection helpers
  into `jarvis-signals.js` first, then delete `doCheckin`, `generateCheckinFallback`,
  `renderCheckinCard`, the `checkin` registry entry and its three state variables

**Done when:** it always says something sensible, tests pass, no API key needed, and the
check-in card is gone with its assessment detection preserved and under test.

### Stage 2 — You ask

- `jarvis-service.js` — lifted from the July branch, Claude provider added on top
- `buildJarvisContext()` — wraps `BoardroomService.buildContext` rather than duplicating it
- View spec schema + `renderView()` dispatcher
- First four views: `next-step`, `task-list`, `money`, `week`
- Chat input under the card; history in `data.jarvis.messages` (cap 40), with
  `mergeWithDefaults` and `isLikelySeedState` updated for the new field

**Done when:** *"can I afford this?"* returns the money view with real figures, and a
missing key falls back to the stage-1 card with no error.

### Stage 3 — He acts

The stage that makes him JARVIS. Jarvis returns an **intent**; Athena executes it against
existing mutators.

| Intent | Executes via |
|---|---|
| `task.add` | pattern of `brAcceptTask` (`app.jsx:3629`) |
| `task.complete` | `completeTask` |
| `task.reschedule` | `setData` updater on `personal.tasks` |
| `task.setState` | `setTaskState` |
| `project.create` | Projects `{stages:[{steps:[]}]}` shape — replaces the manual paste |

**Safety rules — non-negotiable, because Athena has no undo:**

- Jarvis **proposes**; the write happens only after you confirm. Nothing is written
  straight off a model response.
- Every intent is validated against a whitelist before execution. An unrecognised intent
  is dropped and logged, never dispatched.
- Writes go through the existing `setData` updater path so Firestore sync, debouncing and
  `isLikelySeedState` protection all apply unchanged.
- Bulk operations show exactly what will change before it changes.

**Done when:** *"push those three to next week"* animates three task rows moving, after a
confirm, and survives a reload.

### Stage 4 — Front door

- Jarvis leads the home page; cards become the detail underneath
- Boardroom tab and `boardroom-service.js` removed
- `docs/` and `HANDOFF.md` updated

---

## Verification

**Automated** (`npm test`, Node's built-in runner, no new dependencies):

- `jarvis-signals.test.js` — every band, the floor rule, empty dashboard, DST boundaries
- View spec validation — malformed JSON falls back to `say`; unknown view names are dropped
- Intent whitelist — an unknown intent is never dispatched
- Extend `persistence-roundtrip.test.js` for `data.jarvis`
- Build reproducibility: `node build.js` then `git diff --ignore-cr-at-eol app.js` is empty

**Manual — required, and it is Jayden's job.** The dashboard sits behind Google sign-in, so
no agent can see it rendered. Per stage: calm-day behaviour (the floor rule is the thing
most likely to be wrong), animation quality, and **mobile** — the July notes flag task rows
already being crowded on touch, and Jarvis adds a card above everything.

---

## Open decisions

Not blocking stage 1; decide before stage 2.

1. **How bossy?** One firm answer, top 3 ranked, or one-plus-expandable. Current plan
   assumes one-plus-expandable, which satisfies "explain itself".
2. **Tone.** JARVIS is dry and a little sardonic. How far to go — this is prompt-writing,
   cheap to change, worth deciding deliberately.
3. **Which views come after the first four.**

---

## Related

- `docs/superpowers/specs/2026-08-02-athena-home-layout-and-tasks-design.md` — the grid
  Jarvis sits above
- `docs/superpowers/specs/2026-08-02-athena-build-safety-and-sync-design.md` — hooks and
  build safety
- `origin/jarvis` — July prototype. Read for reference; do not merge.
