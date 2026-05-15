# Dashboard Handoff — May 16 2026

## What This Project Is

Jayden's personal dashboard — a single HTML file using React 18 (CDN/UMD), Babel Standalone, Firebase Auth + Firestore, Google Calendar API (read-only), and Gemini 2.5 Flash. 

- **Live site:** `https://jaydenpineda30-glitch.github.io/Main/dashboard.html`
- **GitHub repo:** `git@github.com:jaydenpineda30-glitch/Main.git`
- **Local files:** `C:\Users\Jayde\my-project\`

Auto-push is active: every `git commit` triggers `git push` via `.git/hooks/post-commit`. Live site updates ~60s after any commit.

---

## Key Files

| File | Purpose |
|------|---------|
| `dashboard.html` | Entire app — React, UI, Firebase logic |
| `gemini-service.js` | Quick Capture classification via Gemini 2.5 Flash |
| `ollama-service.js` | AI routing for check-ins + reflection analysis (Gemini 2.5 Flash, no Ollama fallback needed) |
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

- **Model:** `gemini-2.5-flash` via `v1beta` endpoint
- **API key:** Stored in `localStorage.__gemini_key__` + Firestore `settings.geminiKey`
- **Project:** New Google Cloud project with billing enabled (billing required for quota to activate — free tier applies)
- **Key location in dashboard:** Settings → paste into Gemini API Key field
- **Key is trimmed** on all read paths to prevent whitespace issues

> Note: `gemini-1.5-flash` is deprecated on both v1 and v1beta. `gemini-2.0-flash` and `gemini-2.0-flash-lite` return limit:0 for new accounts. `gemini-2.5-flash` is the correct current model.

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

## How to Pick Up Next Session

1. Live site: `https://jaydenpineda30-glitch.github.io/Main/dashboard.html`
2. Make changes to `dashboard.html` (and service files if needed)
3. `git add dashboard.html && git commit -m "..."` — auto-push handles the rest
4. Hard refresh the browser (Ctrl+Shift+R) to pick up changes — GitHub Pages takes ~60s to deploy

**To run Obsidian export manually:**
```powershell
node "C:\Users\Jayde\my-project\export-to-obsidian.js"
```

---

## How Jayden Likes to Work

- Explain trade-offs before making big changes — he likes to understand the why
- Plain English, not technical jargon
- Mobile UX matters — he uses his phone at the gym
- Short responses, no padding
- When using the browser via Claude in Chrome: the dashboard is at `https://jaydenpineda30-glitch.github.io/Main/dashboard.html`
