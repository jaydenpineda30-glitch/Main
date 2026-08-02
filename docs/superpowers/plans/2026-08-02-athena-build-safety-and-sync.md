# Athena Build Safety & Cross-Device Sync — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make it impossible to accidentally ship a stale `app.js` from either machine, and give Athena a repeatable start-of-session sync check.

**Architecture:** Move git hooks out of per-machine `.git/hooks` into a tracked `.githooks/` directory selected by `core.hooksPath`, so both machines run identical logic. Delete the Windows-only auto-push hook so commits stop being deploys. Keep the existing `build-check.yml` CI job as the backstop. Separately, generalise the Maya-specific `dashboard-sync-check` skill into a project-agnostic `sync-check`, and give Athena a cross-device handoff note in the shared Obsidian folder.

**Tech Stack:** Git hooks (POSIX `sh`, run by Git for Windows), Node 24 + `@babel/standalone@7.23.2` (`build.js`), GitHub Actions, Claude Code skills (Markdown), Obsidian vault notes.

## Global Constraints

- Repo is `jaydenpineda30-glitch/Main`; Windows clone is `C:\Users\Jayde\my-project`. Never confuse it with `Mayas-Dashboard`.
- **No application code changes.** `app.jsx`, `app.js`, `dashboard.html`, `dashboard.css` and all service `.js` files are out of scope.
- `app.js` is generated. Never hand-edit it; it is only ever written by `node build.js`.
- **Do not `git push` at any point in this plan.** Pushing to `main` deploys the live site. Jayde pushes himself.
- Do not commit without asking Jayde first — his standing preference (`SESSION STARTUP.md`) is that he commits and pushes himself. Each task's commit step is written out for him to approve or run.
- `core.autocrlf=true` on Windows and the repo stores LF. Do not add a `.gitattributes` or change this — it is already correct, verified 2026-08-02 (0 CR bytes in the `app.js` blob).
- Hook scripts must be POSIX `sh`, not bash-only and not PowerShell — Git for Windows runs them under `sh`.
- The Mac cannot be reached from this session. Anything it must do is written into the handoff note as an instruction, never assumed done.

## Prerequisite already completed (2026-08-02)

`npm install` was run on Windows; `@babel/standalone` was missing and is now present. `node build.js` was verified to reproduce the committed `app.js` byte-for-byte (`git diff --quiet -- app.js` clean). No pre-existing drift exists. Do not redo this.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `.githooks/pre-commit` | Create | Rebuild `app.js` from `app.jsx` and stage it, when `app.jsx` is part of the commit |
| `.git/hooks/post-commit` | Delete | The auto-push hook being removed (untracked, local only) |
| `.gitignore` | Modify | Ignore `.claude/` and `obsidian-vault-repo/`, currently untracked noise |
| `HANDOFF.md` | Modify | Correct the hook/path claims; document both machines |
| `README.md` | Modify | Add the one-time `core.hooksPath` setup command |
| `~/.claude/skills/sync-check/SKILL.md` | Create | Project-agnostic read-only git reconciliation check |
| `~/.claude/skills/dashboard-sync-check/` | Delete | Superseded by `sync-check` |
| `Obsidian Vault/Claude/Cross-Device Handoff.md` | Create | Athena's cross-device state + instructions for the Mac |
| `Obsidian Vault/Claude/SESSION STARTUP.md` | Modify | Correct the hook/path claims; document both machines |

Vault root: `C:\Users\Jayde\OneDrive\Documents\Obsidian Vault\`
Skills root: `C:\Users\Jayde\.claude\skills\`

**Note on "tests":** this repo has no test framework — it is a static React app built by a single script. Verification is therefore done with real commands whose output is checked, not with unit tests. Every task below still follows the same discipline: prove the failure first, make the change, prove the fix.

---

### Task 1: Repo-tracked pre-commit hook + kill auto-push

**Files:**
- Create: `C:\Users\Jayde\my-project\.githooks\pre-commit`
- Delete: `C:\Users\Jayde\my-project\.git\hooks\post-commit`
- Modify: `C:\Users\Jayde\my-project\.gitignore`
- Config: `core.hooksPath`

**Interfaces:**
- Consumes: `build.js` (existing, unchanged) — reads `app.jsx`, writes `app.js`, exits non-zero on a compile error.
- Produces: the guarantee that any commit containing `app.jsx` also contains a matching `app.js`. Task 3's documentation describes this behaviour; Task 2's skill checks that `core.hooksPath` is set.

- [ ] **Step 1: Prove the hole exists**

Run, from `C:\Users\Jayde\my-project`:

```bash
ls .git/hooks/pre-commit 2>/dev/null || echo "NO pre-commit hook — stale app.js can be committed"
cat .git/hooks/post-commit 2>/dev/null || echo "no post-commit"
git config --get core.hooksPath || echo "core.hooksPath unset"
```

Expected: `NO pre-commit hook — stale app.js can be committed`, then `git push origin main`, then `core.hooksPath unset`. This is the bug, confirmed before changing anything.

- [ ] **Step 2: Create the hook**

Create `.githooks/pre-commit` with exactly this content:

```sh
#!/bin/sh
# Rebuild app.js from app.jsx whenever app.jsx is part of this commit.
#
# Athena deploys to GitHub Pages straight from main, and the browser loads
# app.js — not app.jsx. A commit with a stale bundle is a stale live site.
# This hook exists so remembering to rebuild is not a human responsibility.
#
# Enabled per-machine with:  git config core.hooksPath .githooks

# Nothing to do unless app.jsx is actually staged.
git diff --cached --name-only | grep -q '^app\.jsx$' || exit 0

if [ ! -d node_modules/@babel/standalone ]; then
	echo "pre-commit: @babel/standalone is not installed." >&2
	echo "  Run 'npm install', then commit again." >&2
	echo "  Refusing the commit — app.js would have shipped stale." >&2
	exit 1
fi

if ! node build.js; then
	echo "pre-commit: build failed, commit aborted. Fix the error above." >&2
	exit 1
fi

git add app.js
```

- [ ] **Step 3: Point Git at it and remove auto-push**

```bash
git config core.hooksPath .githooks
rm .git/hooks/post-commit
```

- [ ] **Step 4: Verify the config took and auto-push is gone**

```bash
git config --get core.hooksPath          # expect: .githooks
ls .git/hooks/post-commit 2>/dev/null && echo "STILL THERE - FAIL" || echo "post-commit removed OK"
```

Expected: `.githooks`, then `post-commit removed OK`.

- [ ] **Step 5: Prove the hook actually fires and repairs a stale bundle**

This is the real test. It deliberately creates the exact failure the hook exists to prevent, using a comment-only edit that cannot change app behaviour.

```bash
# 1. Make a harmless source edit, and deliberately do NOT rebuild.
printf '\n// hook verification %s\n' "$(date +%s)" >> app.jsx

# 2. Stage only app.jsx — app.js is now stale on purpose.
git add app.jsx
git diff --cached --name-only        # expect: app.jsx  (app.js absent = stale)

# 3. Commit. The hook should rebuild and pull app.js in.
git commit -m "test: verify pre-commit rebuild hook"

# 4. app.js must now be part of that commit.
git show --stat --name-only HEAD     # expect BOTH app.jsx and app.js listed
```

Expected: step 2 lists `app.jsx` only; step 3 prints `✓ app.jsx → app.js`; step 4 lists **both** files. If `app.js` is missing from the commit, the hook did not fire — stop and diagnose before continuing.

- [ ] **Step 6: Confirm the commit did NOT deploy**

```bash
git status -sb                       # expect: ## main...origin/main [ahead 1]
```

Expected: `ahead 1`. Auto-push is gone — the commit is local only. If it says anything other than ahead, the old hook pushed and Step 3 failed.

- [ ] **Step 7: Undo the test commit**

The verification edit was scratch, not real work. Remove it:

```bash
git reset --hard HEAD~1
git status -sb                       # expect: ## main...origin/main  (no ahead/behind)
git diff --quiet -- app.js && echo "app.js clean" || echo "app.js DIRTY - investigate"
```

Expected: back level with `origin/main`, `app.js clean`. This `reset --hard` is safe **only** because the discarded commit is the throwaway one created in Step 5 — confirm `git log --oneline -1` reads `test: verify pre-commit rebuild hook` before running it.

- [ ] **Step 8: Ignore the untracked clutter**

Append to `.gitignore`, under the existing `# Editor` block:

```
# Claude Code local session state
.claude/

# Local-only clone of the obsidian-notes repo
obsidian-vault-repo/
```

Verify:

```bash
git status --short                   # expect: only  M .gitignore  and ?? .githooks/
```

- [ ] **Step 9: Commit (ask Jayde first)**

```bash
git add .gitignore .githooks/pre-commit
git commit -m "Add repo-tracked pre-commit build hook; drop auto-push

Git never clones .git/hooks, so the Mac had a rebuild hook and Windows had
an auto-push hook instead — meaning a Windows commit could deploy a stale
app.js with no review step. Hooks now live in .githooks/ (tracked), enabled
per machine with: git config core.hooksPath .githooks"
```

---

### Task 2: Generalise the sync-check skill

**Files:**
- Create: `C:\Users\Jayde\.claude\skills\sync-check\SKILL.md`
- Delete: `C:\Users\Jayde\.claude\skills\dashboard-sync-check\` (only after Step 4 passes)

**Interfaces:**
- Consumes: the `core.hooksPath` guarantee from Task 1 — the Athena row checks for it.
- Produces: a skill triggered by "sync check Athena" / "sync check Maya", which reads that project's handoff note (Task 3 creates Athena's) and reports git state read-only.

- [ ] **Step 1: Prove the current skill is Maya-only**

```bash
grep -c "Mayas-Dashboard\|maya-dashboard" "C:/Users/Jayde/.claude/skills/dashboard-sync-check/SKILL.md"
```

Expected: a non-zero count, and the file's `description:` names only Maya's Dashboard. Asking it about Athena today would either fail to trigger or point at the wrong repo — that is what this task fixes.

- [ ] **Step 2: Write the new skill**

Create `C:\Users\Jayde\.claude\skills\sync-check\SKILL.md`:

````markdown
---
name: sync-check
description: Read-only git reconciliation check at the start of a session, for any of Jayden's multi-device projects. Trigger on "sync check", "sync check Athena", "sync check Maya", "check dashboard sync", or when opening a session about Athena / the personal dashboard / the Main repo / Maya's Dashboard. Reports state only — never pushes, pulls, merges, or edits code.
---

# Sync check

Run this at the **start** of any session touching one of the projects below, before writing or
editing anything. It exists because these projects are worked on from two machines (a Windows PC
and a Mac), and work has silently stranded on one machine more than once.

**If the project is ambiguous, ask which one before running anything.** Never assume "main" means
a particular repo — two of these projects have a `main` branch and they are unrelated.

## Projects

### Athena — the personal dashboard

| | |
|---|---|
| Repo | `jaydenpineda30-glitch/Main` |
| Windows clone | `C:\Users\Jayde\my-project` |
| Mac clone | `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` — **being moved out of OneDrive**; if it is still there, flag it (see Cloud-sync warning) |
| Handoff note | `Obsidian Vault/Claude/Cross-Device Handoff.md` |
| Orientation | `Obsidian Vault/Claude/SESSION STARTUP.md` |
| Live site | https://jaydenpineda30-glitch.github.io/Main/dashboard.html — deployed by GitHub Pages from `main`, so **pushing to main is deploying** |

Athena-specific extra check:

```
git config --get core.hooksPath        # must print: .githooks
```

If it is unset or different, say so plainly: this machine will not rebuild `app.js` on commit, so
a commit touching `app.jsx` would ship a stale bundle to the live site. The fix is one command,
`git config core.hooksPath .githooks`, but report it and let Jayden decide rather than running it
silently.

Also confirm the build can actually run: if `node_modules/@babel/standalone` is missing, `npm
install` is needed before any commit.

### Maya's Dashboard

| | |
|---|---|
| Repo | `jaydenpineda30-glitch/Mayas-Dashboard` |
| Windows clone | `C:\Users\Jayde\Documents\maya-dashboard` |
| Mac clone | Locate at runtime. If it is under a OneDrive/iCloud/Dropbox path, flag it (see Cloud-sync warning) |
| Handoff note | `Obsidian Vault/Maya Dashboard/Cross-Device Handoff.md` |

Maya-specific: two branches were recovered from the July 2026 divergence and pushed to `origin` on
2026-07-30 — `feat/nebula-backdrop` (Windows, unverified/mid-iteration) and
`feat/customisable-subjects-types-income` (Mac, needs a regression pass before merging). Neither is
merged into `main`. Check both specifically if they still exist unmerged.

## Steps

0. **Read the handoff note first.** Its "Latest state" section was written by whichever device last
   touched the repo, so you know what to expect before running any git command.

   **The note is context; git is truth.** The vault syncs over OneDrive, and OneDrive lag is exactly
   what caused the July 2026 divergence — a note written moments before switching machines may not
   have arrived. **Where the note and `git fetch` disagree, git wins.** Say so out loud when they do.

1. **Find the clone(s) on this machine**, using the table above. If more than one clone of the same
   repo exists on one machine, check each — that is itself worth reporting.

2. **For each clone, run in order** (read-only — no `git push`, `git pull`, `git merge`, `git reset`,
   `git checkout --`, and no code edits):

   ```
   git remote get-url origin        # confirm the repo before reporting anything
   git status
   git fetch origin
   git status                       # again, post-fetch, for true ahead/behind
   git log --oneline -5
   git branch -vv
   ```

   Then any project-specific checks listed above.

3. **Report, don't fix:**
   - Current branch, and whether it is `main` or a feature branch
   - Any uncommitted changes
   - Ahead/behind counts vs the branch's upstream
   - Any local commits not on `origin` (unpushed work) — name them
   - Any local branches absent from `origin`
   - Whether the clone sits inside a cloud-synced folder
   - Any project-specific check that failed

## Cloud-sync warning

A clone found inside `OneDrive`, `iCloud`, `Dropbox` or similar is **a defect to flag, not a second
legitimate clone.**

A git repo is not just files — `.git` is a live database with an index and lock files describing what
*that machine* is doing right now. Mirroring it mid-operation leaves two machines holding
contradictory beliefs about what was committed. That is precisely what happened to Maya's Dashboard
in July 2026: nebula-backdrop work stranded on the PC as an unpushed `main` commit, subjects/income
work stranded on the Mac as an unpushed branch, visible only because OneDrive had silently mirrored
the raw `.git` folder.

Recommend relocating the clone out of the synced folder. `git push` / `git pull` is the sync
mechanism for these repos — file sync is not, and never was.

## After reporting

Wait for Jayden's direction before any git action (committing, pushing, merging, branching). The
entire job of this skill is to stop either machine from starting work blind. Nothing more.

**At the end of the session**, if any work happened (commits, pushes, branch changes), update that
project's handoff note: rewrite "Latest state" and add a dated entry to the log. This is a vault-note
edit, not a code change — do it even in an otherwise read-only session, since it is the whole point of
the note. Don't skip it because nothing got merged: unmerged and work-in-progress branches are exactly
what the other machine needs to know about.

## Related
- `Obsidian Vault/Maya Dashboard/Sessions/Session 2026-07-30 Cross-Device Git Reconciliation.md` — the incident writeup
- `my-project/docs/superpowers/specs/2026-08-02-athena-build-safety-and-sync-design.md` — why Athena's hooks and this skill are set up as they are
````

- [ ] **Step 3: Check nothing was lost from the old skill**

Every Maya-specific fact in the old file must survive. Confirm each of these appears in the new file:

```bash
NEW="C:/Users/Jayde/.claude/skills/sync-check/SKILL.md"
for s in "Mayas-Dashboard" "maya-dashboard" "nebula-backdrop" "customisable-subjects-types-income" "Cross-Device Handoff" "2026-07-30" "read-only"; do
  grep -q "$s" "$NEW" && echo "OK   $s" || echo "MISSING   $s"
done
```

Expected: every line reads `OK`. Any `MISSING` means content was dropped — fix before deleting anything.

- [ ] **Step 4: Verify the new skill loads and covers both projects**

Ask Jayde to run `/sync-check` (or say "sync check Athena") in a **new** session — skills are loaded at session start, so the current session will not see it. Expected: it triggers, asks or infers the project, reports Athena as level with `origin/main`, and reports `core.hooksPath` as `.githooks`.

- [ ] **Step 5: Remove the superseded skill (only after Step 4 passes)**

```bash
rm -rf "C:/Users/Jayde/.claude/skills/dashboard-sync-check"
ls "C:/Users/Jayde/.claude/skills/" | grep -i sync    # expect only: sync-check
```

Do not run this until Step 4 has actually succeeded. If `sync-check` did not trigger, keeping the old skill is the safer state.

---

### Task 3: Handoff note + correct the documentation

**Files:**
- Create: `C:\Users\Jayde\OneDrive\Documents\Obsidian Vault\Claude\Cross-Device Handoff.md`
- Modify: `C:\Users\Jayde\OneDrive\Documents\Obsidian Vault\Claude\SESSION STARTUP.md`
- Modify: `C:\Users\Jayde\my-project\HANDOFF.md`
- Modify: `C:\Users\Jayde\my-project\README.md`

**Interfaces:**
- Consumes: the `.githooks` setup from Task 1 (documented here), and the `sync-check` skill from Task 2 (referenced here).
- Produces: the Mac's only channel for learning about all of the above.

- [ ] **Step 1: Prove the docs are currently wrong**

```bash
grep -n "pre-commit\|Local files\|Local project path" "C:/Users/Jayde/my-project/HANDOFF.md" "C:/Users/Jayde/OneDrive/Documents/Obsidian Vault/Claude/SESSION STARTUP.md"
```

Expected: both files claim a pre-commit hook exists (false on Windows as of this session, and false everywhere until Task 1 lands), and both give a Mac-only local path. This is the drift being corrected.

- [ ] **Step 2: Create Athena's handoff note**

Create `Obsidian Vault\Claude\Cross-Device Handoff.md`:

```markdown
---
type: cross-device-handoff
project: Athena (jaydenpineda30-glitch/Main)
updated: 2026-08-02
tags: [athena, git, cross-device, handoff]
---

# Athena — Cross-Device Handoff

The standing note between the Windows PC and the Mac for the Athena dashboard.
Read it at the start of a session, update it at the end of one.

**This note is context, not truth.** It syncs over OneDrive, which lags. A live
`git fetch` is authoritative — where they disagree, git wins.

## Latest state — 2026-08-02 (Windows PC)

- `main` is level with `origin/main` at `b7e8582` (`v2026.07.19-edb44f3`).
- The Windows clone was **43 commits behind** at the start of this session and has
  been fast-forwarded. No work was lost; nothing was stranded here.
- `npm install` had never been run on Windows — `@babel/standalone` was missing, so
  `node build.js` could not run at all on this machine. Now installed and verified
  to reproduce the committed `app.js` exactly.
- Git hooks now live in the tracked `.githooks/` directory instead of `.git/hooks`.
- The Windows auto-push `post-commit` hook has been **deleted**. Neither machine
  auto-pushes any more.
- `jarvis` (last touched 2026-07-04) is still unmerged. Deliberately untouched —
  Jayde has parked it as a future project.

## Open items for the Mac

1. **Run `git config core.hooksPath .githooks` in the Athena clone, once.**
   Without it the Mac stops rebuilding `app.js` on commit — the old
   `.git/hooks/pre-commit` is no longer the path Git consults. Everything looks
   normal right up until the live site goes stale.

2. **Auto-push is gone from Windows too.** Both machines now push deliberately.
   A commit is local until you push, and pushing to `main` deploys the live site.

3. **`SESSION STARTUP.md` now documents both machines.** It previously listed only
   the Mac path as "the" project path, which is how this drift went unnoticed.
   Please don't re-narrow it.

4. **Move the Athena clone out of OneDrive.** It is currently at
   `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/`. That is the
   same arrangement that stranded work on both machines for Maya's Dashboard in
   July — OneDrive mirrors the raw `.git` folder mid-operation. Suggested fix:

   ```bash
   git -C ~/Library/CloudStorage/OneDrive-Personal/Documents/my-project status   # confirm nothing unpushed
   git clone git@github.com:jaydenpineda30-glitch/Main.git ~/Projects/my-project
   cd ~/Projects/my-project && git config core.hooksPath .githooks && npm install
   git status                                                                    # confirm level with origin/main
   ```

   Delete the OneDrive copy **only after** that last check passes. Then update this
   note and `SESSION STARTUP.md` with the new path.

## Log

### 2026-08-02 — Windows PC
Pulled 43 commits. Installed missing build dependency. Moved hooks to `.githooks/`,
removed auto-push, added `.gitignore` entries for `.claude/` and `obsidian-vault-repo/`.
Replaced the `dashboard-sync-check` skill with a project-agnostic `sync-check` covering
both Athena and Maya. No application code changed.
Design: `my-project/docs/superpowers/specs/2026-08-02-athena-build-safety-and-sync-design.md`
```

- [ ] **Step 3: Correct `SESSION STARTUP.md`**

Two edits, leaving everything else intact.

Replace the pre-commit sentence in the rebuild block (currently: `**After editing `app.jsx` → rebuild (a git pre-commit hook also does this automatically):**`) with:

```markdown
**After editing `app.jsx` → rebuild:**

A tracked pre-commit hook does this automatically, **but only on a machine where you have run
`git config core.hooksPath .githooks` once.** On a fresh clone, or a machine where that was never
run, nothing rebuilds and the live site silently goes stale. Run the build yourself if unsure:
```

Replace the `**Local project path:**` line with:

```markdown
**Local project paths — this project lives on two machines:**

| Machine | Path |
|---------|------|
| Windows PC | `C:\Users\Jayde\my-project` |
| Mac | `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` — ⚠️ inside OneDrive, being relocated; see [[Cross-Device Handoff]] |

**Neither machine auto-pushes.** A commit is local until you push, and pushing to `main` deploys
the live site. One-time setup on any machine: `git config core.hooksPath .githooks`

See [[Cross-Device Handoff]] before starting work, or say "sync check Athena".
```

Also update the frontmatter `updated:` field to `2026-08-02`.

- [ ] **Step 4: Correct `HANDOFF.md`**

Replace the "There is **no auto-push hook**..." paragraph with:

```markdown
**Neither machine auto-pushes.** A commit is local until you `git push`, and pushing to `main`
deploys the live site (~60s via GitHub Pages).

Hooks live in the tracked `.githooks/` directory, not `.git/hooks` — Git never clones the latter,
which is why the two machines silently disagreed until 2026-08-02. **One-time setup per machine:**

```bash
git config core.hooksPath .githooks
npm install                              # build.js needs @babel/standalone
```

Without it, nothing rebuilds `app.js` on commit and the live site goes stale. `build-check.yml`
catches this in CI, but only after the fact.
```

Replace the Mac-only `- **Local files:**` line with both paths:

```markdown
- **Local files:** Windows `C:\Users\Jayde\my-project` · Mac `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` (being relocated out of OneDrive)
```

- [ ] **Step 5: Correct `README.md`**

Two edits. `README.md` is UTF-8 with CRLF line endings — leave the line endings alone.

Replace line 6 (`- **Local files:** /Users/jashleypineda/...`) with:

```markdown
- **Local files:** Windows `C:\Users\Jayde\my-project` · Mac `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` (being relocated out of OneDrive)
```

Replace the paragraph at lines 46–48 (`A **git pre-commit hook** auto-runs...`) with:

```markdown
A **git pre-commit hook** auto-runs `build.js` when `app.jsx` is staged, so `app.js`
can't go stale — but the hooks live in the tracked `.githooks/` directory, and Git only
consults it after a **one-time setup on each machine**:

```bash
git config core.hooksPath .githooks
```

Skip it and nothing rebuilds, silently. A **CI "Build check"** workflow also fails any
push where `app.js` doesn't match `app.jsx`, which is the backstop for exactly that case.
```

Leave line 51's `(There is no auto-push hook — push deliberately.)` as-is — it is now true on both machines.

- [ ] **Step 6: Verify the docs no longer lie**

```bash
grep -n "core.hooksPath" "C:/Users/Jayde/my-project/HANDOFF.md" "C:/Users/Jayde/my-project/README.md" "C:/Users/Jayde/OneDrive/Documents/Obsidian Vault/Claude/SESSION STARTUP.md"
grep -n "C:.Users.Jayde.my-project" "C:/Users/Jayde/my-project/HANDOFF.md" "C:/Users/Jayde/OneDrive/Documents/Obsidian Vault/Claude/SESSION STARTUP.md"
```

Expected: `core.hooksPath` appears in all three files; the Windows path appears in both orientation docs. Then confirm no file still claims the hook works unconditionally:

```bash
grep -n "hook also does this automatically\|no auto-push hook" "C:/Users/Jayde/my-project/HANDOFF.md" "C:/Users/Jayde/OneDrive/Documents/Obsidian Vault/Claude/SESSION STARTUP.md" || echo "no stale claims remain"
```

Expected: `no stale claims remain`.

- [ ] **Step 7: Commit the repo-side doc changes (ask Jayde first)**

Vault notes are not in this repo — they sync via OneDrive and need no commit.

```bash
git add HANDOFF.md README.md docs/superpowers/specs/2026-08-02-athena-build-safety-and-sync-design.md docs/superpowers/plans/2026-08-02-athena-build-safety-and-sync.md
git commit -m "Document the two-machine setup and .githooks requirement

HANDOFF.md and SESSION STARTUP.md both described the Mac's hook setup as
universal fact and listed only the Mac's path, which is how the machines
drifted apart unnoticed."
```

---

## Final verification

Run all of these together once every task is done. Each maps to a numbered item in the spec's Verification section.

```bash
cd /c/Users/Jayde/my-project

echo "1. hooksPath:"; git config --get core.hooksPath            # .githooks
echo "2. auto-push gone:"; ls .git/hooks/post-commit 2>/dev/null && echo FAIL || echo OK
echo "3. build reproduces committed bundle:"; node build.js >/dev/null && (git diff --quiet -- app.js && echo OK || echo "FAIL - drift")
echo "4. nothing pushed:"; git status -sb                        # no [ahead N] unless Jayde chose to commit
echo "5. skill:"; ls ~/.claude/skills/sync-check/SKILL.md
echo "6. handoff note:"; ls "/c/Users/Jayde/OneDrive/Documents/Obsidian Vault/Claude/Cross-Device Handoff.md"
echo "7. docs corrected:"; grep -lc "core.hooksPath" HANDOFF.md README.md
```

Item 8 (the Mac clone out of OneDrive, with `core.hooksPath` set) **cannot be verified from this machine** and stays open until the Mac session reports back in the handoff note. Do not mark this work complete without saying that item is outstanding.

## Notes

- Task 1 must land before Task 3, since Task 3 documents Task 1's behaviour. Task 2 is independent and can run in either order.
- If any verification step fails, stop and report it rather than working around it — the entire point of this change is that silent failure is what caused the problem.
