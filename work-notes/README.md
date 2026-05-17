# Work Notes — Obsidian Setup

Persistent memory system for the Claude work project. Notes log automatically into the same Obsidian vault as the dashboard.

## Vault Structure

```
Obsidian Vault/
  Dashboard/
    Captures/
    Reflections/
  Work/
    GoTab/
    Business/
    Sales/
    Tickets/
    Support/
```

## Setup (one-time)

### 1. Claude Project Instructions
- Open Claude.ai desktop app → your work project → **Project Instructions**
- Paste the full contents of `project-instructions.md`

### 2. Copy scripts to your machine
Copy both scripts to `C:\Users\Jayde\my-project\`:
- `clipboard-watcher.ps1` — runs in background, auto-saves on copy
- `save-work-note.ps1` — manual fallback if needed

### 3. Start the clipboard watcher at login (Task Scheduler)

Open **Task Scheduler** → Create Basic Task:

| Field | Value |
|-------|-------|
| Name | Obsidian Clipboard Watcher |
| Trigger | When I log on |
| Action | Start a program |
| Program | `powershell.exe` |
| Arguments | `-WindowStyle Hidden -ExecutionPolicy Bypass -File "C:\Users\Jayde\my-project\clipboard-watcher.ps1"` |

Tick **"Run whether user is logged on or not"** → OK.

The watcher starts silently at login with a tray notification confirming it's active.

---

## Daily Workflow (fully automated)

1. Finish a Claude work session
2. Ask Claude: **"log notes"** or **"save notes"**
3. Claude outputs structured notes — `Ctrl+A` → `Ctrl+C`
4. Done — notes appear in Obsidian within 2 seconds, Windows notification confirms

No scripts to run. No manual steps.

---

## How It Works

- `clipboard-watcher.ps1` checks your clipboard every 1.5 seconds
- It only acts when it detects content with `type: work-note` in the frontmatter
- Multiple notes separated by `---NOTE---` are each saved to their correct folder
- Duplicate content is skipped silently
- A Windows tray notification confirms each save

---

## Feeding Notes Back as Memory

To give Claude access to past notes in future sessions:
- Open your Claude work project → **Project Knowledge**
- Upload relevant `.md` files from the vault
- Claude will reference them automatically in future conversations

Re-upload every few sessions to keep knowledge current.
