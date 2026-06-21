# Session Handoff — Dashboard Redesign (Sapphire Liquid Glass)

> **Start here for a new session.** Written 2026-06-18. This is the authoritative, current handoff.
> Background context (older): `REDESIGN-HANDOFF.md` and `SESSION-2026-06-16-emoji-consistency.md`.

---

## ⚠️ Critical state — READ FIRST

- **Project dir:** `/Users/jashleypineda/Library/CloudStorage/OneDrive-Personal/Documents/my-project` (OneDrive-synced). Work in this folder — **do NOT re-clone** (a clone won't have the uncommitted work).
- **Branch:** `frontend-redesign`. **`main` is untouched and still the live site** — nothing is deployed.
- **ALL redesign work is UNCOMMITTED** in the working tree. Modified: `dashboard.html` (bulk), `data.js`, `dashboard.css`, `monitoring-dashboard.js`. Untracked: `.claude/`, the `*HANDOFF*.md` / `SESSION-*.md` docs, `sidenav-mock.html`.
- **Nothing has been committed or pushed.** Do not commit/push/merge without the user explicitly asking. When asked, commit on `frontend-redesign`, then open a PR; merge → `main` only on approval.
- **Structural health (last checked):** `dashboard.html` parens 4525/4525, braces 5031/5031 balanced. App is React 18 + Babel-Standalone compiled **in-browser**, so any JSX/JS error white-screens the whole app — always verify it still renders after edits.

---

## The app (how it's built)

- Single-file React app: `dashboard.html` (~3300 lines) holds one big `<script type="text/babel">`. Sibling files loaded by it: `data.js` (constants incl. `WX_MAP`, `SUBJECTS`, syllabus), `dashboard.css` (body background + a few classes), `monitoring-dashboard.js` (`StatusBar`/`MonitoringPanel`), plus `*-service.js` / `error-*.js` / `gcal-sync.js` etc.
- **No Node on this Mac** — can't run Babel/npm locally. Verify by (a) structural greps (parens/braces net 0; balanced tags) and (b) the browser preview recipe below.
- Auth is **Firebase Google sign-in**; without it you only see the login screen.

### Design system "Sapphire Liquid Glass" (locked)
- Accent sapphire `#5b8cff` (`T.accent`). Base bg matte `#0a0a0a` + two static blue radial glows + carbon-weave texture + faint noise (set on `body` in `dashboard.css`). **Static only** — no animated/aurora background (removed as "AI slop").
- **Matte, not neon.** Glows are used only as deliberate state cues.
- Theme tokens live in `const T={...}` near the top of the script. `T.bg2 = rgba(225,234,255,0.07)` is the canonical glass fill.

---

## How to preview (the OneDrive gotcha — important)

The in-app **preview server is sandboxed and CANNOT read the OneDrive CloudStorage path** (`Operation not permitted`), and `python3 -m http.server` dies there on `os.getcwd()`. Two ways to view:

1. **User, in a plain terminal:** `cd` into the project and `python3 -m http.server 8766`, open `http://localhost:8766/dashboard.html` (real Google sign-in → real data).
2. **Agent, via preview tools:** serve a **/tmp copy** (sandbox can read /tmp):
   ```bash
   rsync -a --exclude=.git --exclude=node_modules --exclude=docs \
     "/Users/jashleypineda/Library/CloudStorage/OneDrive-Personal/Documents/my-project/" /tmp/dash-preview/
   ```
   - Server script `/tmp/serve_dash.py` uses `functools.partial(SimpleHTTPRequestHandler, directory="/tmp/dash-preview")` (avoids `getcwd`). The session-root launch config `~/Library/.../Documents/Claude/.claude/launch.json` (name `dash`, port 8779) points at it — start with the `preview_start` tool, name `dash`.
   - **Auth gate:** to see the dashboard (not just login) in the snapshot, patch the /tmp copy: seed `authUser` + short-circuit the `onAuthStateChanged` effect with `if(true){return;}`, and (optionally) seed `INIT.boardroom` / `personal.tasks` so those cards render. **The real source is never stubbed.** Re-run the rsync + patch after each source edit.
   - Verify with `preview_console_logs` (level error) + `preview_eval` (computed styles) + `preview_screenshot`. Resize to ≥1100px wide to get the desktop side-rail (below ~760px it switches to the mobile bottom-nav).

---

## What's DONE this session (all browser-verified, no console errors)

1. **Emoji → SVG line-icons, app-wide.** Added module-level helpers after `NavGlyph`:
   - `UIcon({name,size})` — 25 glyphs: `bolt pencil calendar gear phone desktop moon flag clock drag restore upload sparkle target droplet wind thermometer cloudrain sync pin bulb chart trend eye warn`.
   - `wxGlyph(code,size)` — weather icons by Open-Meteo code (replaced emoji; `data.js` `WX_MAP` is now plain description strings).
   - Converted every UI emoji (FABs, modify buttons, nav/utility, weather, reflection/finance/capture/journal/gym, check-in headers, warnings). **Only 2 emoji remain and are CORRECT to keep** — `🔴`/`🔵` in `DEFINITE_ASSESS_MARKERS` (line ~401) and `t.includes("🔴")` (line ~1600): these parse syllabus *text*, not UI.
   - Left as typographic glyphs by choice (ask before converting): `✓ ✕ × ← → ↗ ↺`.

2. **White frosted-pill button texture, app-wide.** Module-level `btnGlass` (secondary) + `btnGlassP` (primary, brighter). Redefined shared tokens `btn`, `btnP`, `gs.btn/btnP`, `fBtn/fBtnP`, `navBtn` to use them → all buttons cascade. Inline one-offs also converted (Discard, Boardroom New consultation / Add / Skip / Done / Send, Capture + Boardroom FABs use `whitePill`). Top-right card "Edit"/"+" use `editPill`.
   - **Intentional color tints left on top of the white glass** (confirm if user wants them whitened): calendar **today** (accent when active), **+ Google Cal** (Google blue), **synced** (green).

3. **Boardroom transparency fixed.** `glassMini` was missing `backdrop-filter` → added `blur(24px) saturate(1.4)`. All Boardroom cards (North Star, goals, session log) + the "Goals surfaced" panel now frosted.

4. **Weather card frost.** It was missing `backdrop-filter` (texture bled through); now uses the full glass recipe.

5. **Card glow — LEFT SIDE ONLY** (this went through several iterations per user feedback; final state below).
   - Module-level `cardBg = "radial-gradient(80% 125% at 0% 50%, rgba(255,255,255,0.14) 0% , 0.05 30%, transparent 60%), rgba(225,234,255,0.07)"` — a soft white bloom from the **left side**, over the glass fill (frost preserved).
   - `cardShadow` deepened (`0 18px 46px rgba(0,0,0,0.52) …`) so cards **pop**. `cardShadowSoft` for `glassMini`.
   - Applied to `card()`, `fCard()`, `gs.card`, `glassMini`, weather widget.
   - **History so the next session doesn't re-litigate:** first attempt was a crisp left-edge *rim line* (rejected); then top-right corner aurora (liked); then both top corners evenly (asked); then user said **left side only** → current. Colored urgency glows (body-weight deadline, gym-draft) are a soft all-around colored glow.

6. **Misc from earlier:** collapsible left side rail, removed black StatusBar frame, bento masonry dashboard home, de-slopped Boardroom, removed redundant "Next up:" line in pre-fill card, greeting "Good {time}, Ashley".

---

## ⏳ IN PROGRESS / next step (resume here)

- **Task-row glow → left side only.** User said the task rows were glowing on **top, left, and bottom** and wanted **left only**. The edit is DONE in source: the three task-row box-shadows (Dashboard urgent+normal ~lines 2545–2546, Personal page ~line 2699) changed from `inset 7px 0 16px -7px <color>,inset 0 1px 0 …` to **`inset 10px 0 9px -8px <color>`** (dropped the top-white highlight, tightened blur so it hugs the left edge). 
  - **NOT yet visually confirmed:** in the /tmp preview the seeded test-tasks weren't rendering (localStorage from earlier preview runs overrode `INIT` — needs `localStorage.clear()` then reload, or seed tasks AND clear cache). The user has real tasks in their own browser, so they can eyeball it there. **Action for next session:** confirm the left-only task glow looks right (no top/bottom bleed); nudge `inset 10px 0 9px -8px` blur/offset if it still bleeds.

---

## Other open items (from prior handoffs, not yet done)

- **Name mismatch:** greeting says "Ashley", side-rail header says "Jayden". Decide one and standardize. (UNRESOLVED — user hasn't answered.)
- Bento "Pre-fill weights" card looked fine at ⅓ width (not cramped) — left as-is.
- Gym tab "Up next in rotation" label still uppercase (homepage was de-capped) — match if wanted.
- Optional: remove `.card-rim:hover` cursor-spotlight in `dashboard.css` for fully matte feel.
- Bloom intensity is `0.14` (one-number tweak in `cardBg`) if user wants it stronger/softer.
- **When approved:** commit `frontend-redesign` → PR → merge to `main` to deploy.

---

## Working style (fits the user)
Terse plain verdicts. Investigate before changing. Surgical edits. **Never touch `main`.** Confirm before anything outward-facing (no commits/pushes/merges without asking). Verify visually in the preview and report with screenshots — don't ask the user to check manually. The user iterates on visuals via screenshots, so expect "that's not quite it" loops — show the result each time.
