# Jayden's Dashboard

A personal dashboard for tracking study, gym, tasks, finances, and weekly reflections — a React app served as static files on GitHub Pages.

- **Live site:** https://jaydenpineda30-glitch.github.io/Main/dashboard.html
- **Local files:** Windows `C:\Users\Jayde\my-project` · Mac `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` (being relocated out of OneDrive)

## Stack

- React 18 (UMD/CDN). **JSX is precompiled** to `app.js` by `build.js` — the browser no longer runs Babel. See [Build & deploy](#build--deploy).
- Firebase Auth (Google Sign-In) + Firestore
- Google Calendar API (read-only)
- Gemini 2.5 Flash — Quick Capture, daily check-in, reflection analysis
- Groq `gpt-oss-120b` — Boardroom AI coaches (Alex + Chris)

## File map

| File | Purpose |
|------|---------|
| `app.jsx` | **Source of truth** — the whole app (UI, state, Firebase logic). Edit this. |
| `app.js` | **Generated** bundle compiled from `app.jsx`. Committed + deployed. Never hand-edit. |
| `build.js` | Compiles `app.jsx` → `app.js` (`@babel/standalone`, pinned). Run before pushing. |
| `dashboard.html` | Thin shell — loads CDN scripts, CSS, and `app.js`. Mount point. |
| `dashboard.css` | Shared styles (glass cards, FAB, animations) |
| `data.js` | Static constants (subjects, categories, weather codes) |
| `gemini-service.js` | Quick Capture classification (Gemini) |
| `ollama-service.js` | Daily check-in + reflection analysis (routes to Gemini; name is legacy) |
| `boardroom-service.js` | Two-persona AI coaching via Groq |
| `gcal-sync.js` | Google Calendar read-only sync |
| `error-handler.js`, `error-boundary.js`, `health-monitor.js`, `network-monitor.js`, `data-validator.js`, `monitoring-dashboard.js` | Reliability + monitoring layer |
| `export-to-obsidian.js` | Node — daily export of captures/reflections to the Obsidian vault (GitHub Actions) |
| `boardroom-nudge.js` | Node — sets the evening nudge flag (GitHub Actions cron) |
| `restore-from-backup.js` | Node — restore a backup JSON into Firestore |
| `log-to-vault.js` | Node — log a single ticket to the Obsidian vault |
| `firebase-rules.txt` | Firestore security rules (owner-only). Paste into Firebase Console to deploy. |

## Build & deploy

The app is authored as JSX in `app.jsx` and compiled to `app.js`:

```bash
npm install        # first time only — installs the build tool (@babel/standalone)
node build.js      # or: npm run build  → regenerates app.js from app.jsx
```

A **git pre-commit hook** auto-runs `build.js` when `app.jsx` is staged, so `app.js`
can't go stale — but the hooks live in the tracked `.githooks/` directory, and Git only
consults it after a **one-time setup on each machine**:

```bash
git config core.hooksPath .githooks
```

Skip it and nothing rebuilds, silently. A **CI "Build check"** workflow also fails any
push where `app.js` doesn't match `app.jsx`, which is the backstop for exactly that case.

Deploy = push to `main`. GitHub Pages serves the updated files within ~60s; hard-refresh
(Cmd/Ctrl+Shift+R) to pick them up. (There is no auto-push hook — push deliberately.)

```bash
# typical change
# 1. edit app.jsx
node build.js                      # rebuild (or rely on the pre-commit hook)
git add app.jsx app.js
git commit -m "..."
git push                           # goes live in ~60s
```

## Node scripts

```bash
npm install                          # firebase-admin + build tool
node export-to-obsidian.js           # manual Obsidian export
node restore-from-backup.js <file>   # dry-run restore (add --write to apply)
```

Node scripts that touch Firestore require the Firebase service-account key
(gitignored) present locally.

## More

Data model, Firebase setup, and Boardroom internals: see [`HANDOFF.md`](HANDOFF.md).
