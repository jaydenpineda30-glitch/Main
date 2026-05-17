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

### 2. Save Script
- Copy `save-work-note.ps1` to somewhere easy: `C:\Users\Jayde\my-project\save-work-note.ps1`
- Right-click → **Run with PowerShell** (or pin to taskbar)

### 3. Optional — Desktop Shortcut
Right-click desktop → New Shortcut → Target:
```
powershell.exe -ExecutionPolicy Bypass -File "C:\Users\Jayde\my-project\save-work-note.ps1"
```

## Daily Workflow

1. Finish a Claude work session
2. Ask Claude: **"log notes"** or **"save notes"**
3. Claude outputs one structured note per topic
4. Select all → Copy
5. Run `save-work-note.ps1`
6. Done — notes appear in Obsidian instantly

## Feeding Notes Back as Memory

To give Claude access to past notes in future sessions:
- Open your Claude work project → **Project Knowledge**
- Upload relevant `.md` files from the vault
- Claude will reference them automatically in future conversations

Tip: re-upload after every few sessions to keep knowledge current.
