# Athena — Home layout, task clarity, and two new cards

**Date:** 2026-08-02
**Status:** Approved design, ready for implementation planning
**Scope:** Desktop home page (`page==="Dashboard"`) and the Tasks data model. Mobile layout unchanged.

## Problem

The home page packs cards with CSS multi-column (`app.jsx:4110`, `columnCount:3`). Multi-column
decides break points by height, not by intent: no card has a position, so adding or growing one
card reflows everything after it and leaves dead gaps. Every fix so far has meant editing layout
code by hand, and the next content change undoes it.

Three further problems share the same root — information the app already holds but never shows:

- Tasks store a category (`cat`, one of `TASK_CATS` in `data.js:10`) that the home card never
  renders. Colour on the home card currently encodes urgency (`TUC` at `app.jsx:263`, the
  yellow/orange inset glow), so the user cannot see which area of life is accumulating work.
- Completed tasks store `completedAt` and `completedTime` (`app.jsx:3643`) and nothing reads them
  except a small date on the struck-through row. The calendar shows no record of what got done.
- `Upcoming Classes` (`app.jsx:4341`) is useful on the home page but is defined inline inside the
  Uni tab.

And two capabilities are missing outright: recording progress on a task that cannot be finished
today, and tracking the weekly routine chores that set up the following week.

## Constraints

- No bundler. `dashboard.html` loads plain `<script>` tags; `app.jsx` is compiled in one pass by
  `build.js` using `@babel/standalone`. A new runtime dependency means another CDN tag.
- `app.jsx` is a single 5097-line file. `App()` alone spans `2725` to the end. New work should
  extract components rather than grow `App()`.
- Pushing to `main` deploys the live site via GitHub Pages. The `.githooks/pre-commit` hook
  rebuilds `app.js` on commit; it must not be bypassed.
- No test framework exists. Verification is build reproducibility plus manual checks.

## Decisions

### Layout engine: build in-house on CSS Grid

Rejected `react-grid-layout` — 40KB via CDN, its own stylesheet, absolutely-positioned children
that conflict with the existing glass/glow card treatment, and free-form X/Y placement nobody
asked for. Rejected reorder-only — loses the column-span requirement.

Three columns. Each card stores an order index and a span of 1–3 columns. To keep masonry-tight
packing without multi-column's gaps, each card's rendered height is measured and converted into a
row-span against a small `grid-auto-rows` unit, so cards pack vertically while holding an explicit
position.

`grid-auto-flow: dense` backfills the hole left when a 2-wide card cannot fit the remainder of a
row. Consequence, accepted deliberately: a later 1-wide card may visually precede an earlier
2-wide card. Packing without dead air is worth more than strict ordering.

### Colour means area, badge means urgency

The single most important change in the Tasks card. Colour is currently spent on urgency, which
is also stated in words; category is invisible. Swapping the two makes both legible at once.

## Design

### 1. Home layout

**Card registry.** A module-level array declares every home card: `{id, title, defaultSpan,
pinned}`. Rendering iterates the user's saved layout, resolving each id against the registry. Ids
in the registry but absent from the saved layout append to the end; ids in the saved layout but
absent from the registry are dropped. This makes future cards additive — adding one never resets a
user's arrangement.

Registry contents (11 cards): `calendar` (pinned), `shopping`, `weather`, `checkin`, `goals`,
`assessments`, `gym-next`, `bodyweight`, `tasks`, `classes` (new), `necessities` (new).

**Pinned card.** `calendar` renders above the grid at full width and is not draggable, not
resizable, and not present in the reorderable order.

**Edit mode.** A single `Edit layout` button at the top right of the home page toggles
`layoutEditing` state. While editing, every unpinned card shows a grab handle and a width control
(1 / 2 / 3 columns); the card body is inert so a drag cannot tick a checkbox. `Done` exits.
`Reset layout` in edit mode restores registry defaults after a confirm.

Outside edit mode there is no drag affordance and no drag behaviour — cards behave exactly as they
do today.

**Drag mechanics.** Pointer events on the handle, not HTML5 drag-and-drop (which cannot be styled
and behaves inconsistently). Dragging reorders the array; a placeholder shows the drop target.

**Persistence.** `data.homeLayout = [{id, span}, ...]`, saved through the existing `setData` path
to Firestore. Absent or malformed layout falls back to registry defaults.

**Mobile.** `mob` renders a single column in registry order with no edit affordances, as today.

### 2. Tasks card

**Data.** Existing task shape (`app.jsx:3822`) is unchanged; the new fields below are additive and
optional, so existing tasks need no migration.

**Category colour.** A new `TASK_CAT_COLORS` map in `data.js` assigns each of the 14 `TASK_CATS` a
fixed colour, so a category always looks the same. Rendered as a coloured left bar on each task
row, replacing the urgency-derived `boxShadow` inset glow. The `dataviz` skill governs the palette
at implementation time — it must hold up on the dark glass background and must not rely on hue
alone (the category name is always written next to the bar).

**Load bar.** A row above the list showing each category that has at least one open task, with its
colour dot and count, ordered by count descending. Clicking a category filters the list to it;
clicking again clears. Filter state is view-only and not persisted.

**Grouping.** Two separate orders — a task is assigned to a group by the match order, and the
groups are then displayed in the display order. These are not the same list.

Match order — each task falls into the first group whose rule it satisfies:

| # | Group | Rule |
|---|---|---|
| 1 | Done | `done === true` |
| 2 | Waiting | `state === "waiting"` — matched early, so parked work never lands in Overdue |
| 3 | Overdue | has `due`, `due < today` |
| 4 | Due soon | has `due`, `due` is 0–2 days away |
| 5 | In progress | `state === "doing"` |
| 6 | Untouched | `editedAt \|\| addedAt` older than 7 days |
| 7 | Later | everything else |

Display order, top to bottom: **Overdue, Due soon, In progress, Untouched, Later, Waiting, Done.**

So an overdue task that is also in progress displays under Overdue, carrying an "In progress"
badge. A waiting task displays near the bottom regardless of its due date; its rows still show
their overdue text, in a muted tone.

**Row.** Category colour bar, task name, then a line carrying: category name, state badge if not
`todo`, and the urgency badge from the existing `taskLabel()` (`app.jsx:264`). Newest update text,
if any, on the line below. Existing schedule and backdate buttons are retained.

### 3. Task state and updates

Two new optional fields:

- `state`: `"todo" | "doing" | "waiting"`, defaulting to `"todo"` when absent.
- `updates`: `[{id, at: "YYYY-MM-DD", text}]`, newest last, defaulting to `[]`.

Adding an update sets `editedAt` to today. This is the point of the feature: recording that you
are blocked is a real interaction with the task, so it should clear the `untouched` badge rather
than leave the task nagging.

A task detail modal shows the three states as radio options, the full update history newest-first,
and an input to add one. The home card shows only the most recent update, truncated to one line.
Updates are append-only from the card; editing and deleting live in the detail modal.

### 4. Upcoming Classes card

Extract the inline markup at `app.jsx:4341` into a component `UpcomingClassesCard({events, days,
gcalConnected, mob})`. The event filter currently computed at `app.jsx:4269` moves inside it.

- Home page: `days={7}`.
- Uni tab: `days={28}`, preserving current behaviour.

One implementation, so the two cannot diverge. When Google Calendar is not connected the card
keeps its existing prompt.

### 5. Weekly necessities card

**Data.** `data.personal.necessities = { items: [{id, name}], ticks: {itemId: "YYYY-MM-DD"} }`.

**Reset by derivation, not by job.** An item counts as done this week if `ticks[id]` falls on or
after the Monday of the current week. Nothing needs to run on Monday; correctness does not depend
on the dashboard being open. This survives arbitrary gaps in usage and works identically across
devices.

**Rendering.** Header with `done/total`. A progress bar showing completion against elapsed week, so
falling behind is visible. Unticked items gain emphasis as the week closes (from Friday). An `Edit`
control manages the item list — add, rename, remove, reorder.

Necessities are deliberately separate from `personal.tasks`: they are recurring routine, and
mixing them in would distort the task load bar and the overdue counts.

### 6. Completed tasks on the calendar

A band below the desktop week grid in `renderWeek()` (`app.jsx:3875`), one cell per weekday.

**Source.** Tasks where `completedAt` equals that day, drawn from **both** `personal.tasks` and
`personal.archived`. Reading archived tasks matters: `archiveDone` currently moves completed tasks
out of the list, and without this the calendar history would empty itself whenever the user tidies
up.

**Rendering.** Category colour dot plus task name, no strikethrough — the entry is a record of
something done, not something cancelled. Maximum three per day, then `+N more`, which opens a day
detail listing all of them.

**Mobile.** The existing day view gains a `Finished today` section below the events list.

**Google Calendar is not involved.** Nothing is written to, synced with, or read from Google for
this feature. It is local-first and derived entirely from data the app already stores.

## Out of scope

- Free-form pixel positioning or arbitrary card sizes.
- Any change to the mobile home layout.
- Any change to task creation, the Google Calendar connection, or `gcal-sync.js`.
- Writing completions to Google Calendar — explicitly rejected; a previous attempt at this is why
  the local-only approach was chosen.

## Verification

No test framework exists, so verification is manual and must be demonstrated before any push:

1. `node build.js` reproduces `app.js` cleanly; `git status` shows no unexpected drift.
2. Home page renders with no dead gaps at desktop width, and at a narrowed window.
3. Drag a card, reload, confirm position persisted. Stretch a card to 2 and 3 columns.
4. Reset layout restores defaults. Adding a card to the registry appends without disturbing a
   saved layout.
5. Tasks card: categories coloured and counted correctly; filter works; a task in each of the
   seven groups lands in the right one.
6. Add an update to a stale task and confirm the `untouched` badge clears.
7. Tick a necessity, set the clock forward past Monday, confirm reset without opening the app in
   between.
8. Complete a task, confirm it appears on the correct calendar day; archive it, confirm it
   remains.
9. Mobile view unchanged.

`main` is not pushed without explicit approval, since pushing to `main` deploys the live site.
