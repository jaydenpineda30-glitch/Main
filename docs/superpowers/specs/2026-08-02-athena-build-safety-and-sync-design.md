# Athena — Build Safety & Cross-Device Sync

**Date:** 2026-08-02
**Repo:** `jaydenpineda30-glitch/Main` (the Athena personal dashboard)
**Status:** Approved, not yet implemented

---

## Why this exists

Two problems surfaced at the start of the 2026-08-02 session.

**1. The Windows clone was 43 commits behind `origin/main`** and nobody noticed. Months of
Mac-side work (Invest tab, Projects + Shopping tabs, dynamic uni subjects, the `.nojekyll`
deploy fix) existed only on the remote. Any edit made on Windows would have been written
against a June snapshot of the app.

**2. The two machines disagree about how commits behave.** Git never copies `.git/hooks`
when a repo is cloned — hooks are per-machine, not part of the project. The result:

| | Mac | Windows |
|---|---|---|
| `pre-commit` (rebuild `app.js` from `app.jsx`) | present | **absent** |
| `post-commit` (`git push origin main`) | absent | **present** |

So on Windows, a commit touching `app.jsx` would ship an unrebuilt `app.js` straight to the
live site with no review step. `HANDOFF.md` and `Obsidian Vault/Claude/SESSION STARTUP.md`
both describe the Mac's behaviour as if it were universal, which is what made this invisible.

---

## What already works (and stays)

`.github/workflows/build-check.yml`, added 2026-07-19, rebuilds `app.js` on GitHub and fails
the run if the committed bundle doesn't match `app.jsx`. It is a genuine safety net and is
kept as-is.

Its limit: GitHub Pages publishes from `main` in a **separate** job that does not wait on this
check. A stale bundle therefore still reaches the live site; the check reports the problem
after the fact rather than preventing it.

---

## Part 1 — Build safety

Three layers, each covering the previous one's failure mode.

### Layer 1 — Hooks committed to the repo

Create a `.githooks/` directory tracked in git, containing a `pre-commit` hook that runs
`node build.js` and stages the regenerated `app.js`. Each machine runs one setup command once:

```bash
git config core.hooksPath .githooks
```

Because the hooks are now ordinary tracked files, both machines run identical logic and any
future change to a hook propagates on the next `git pull`.

`app.js` is a generated artifact, so staging it automatically cannot destroy hand-written work.

### Layer 2 — Remove auto-push

Delete the local `post-commit` hook (`git push origin main`) from the Windows clone.

Committing becomes a purely local act; publishing becomes a deliberate `git push`. This
matches the Mac and restores the review gap between "saved" and "live".

### Layer 3 — CI backstop

`build-check.yml`, unchanged. Catches anything that reaches `main` on a machine where
`core.hooksPath` was never configured.

### Explicitly rejected: gating Pages behind the build check

Republishing the site through a GitHub Actions Pages workflow (rather than deploy-from-branch)
would make shipping a stale bundle *impossible* rather than merely unlikely. It was considered
and rejected: it rewires a working production deploy, and a mistake takes the live dashboard
down. With layers 1–3, shipping a stale bundle requires the hook to be unconfigured **and** a
CI failure email to be ignored. Revisit only if that combination actually occurs.

### Known residual risk

Layer 1 depends on `git config core.hooksPath .githooks` having been run on that machine. It
is one command, it is not automatic, and a fresh clone will not have it. Mitigation is
documentation in `HANDOFF.md`, `README.md`, and `SESSION STARTUP.md` — plus Layer 3 catching
the case where it was forgotten.

---

## Part 2 — Cross-device sync

### The `sync-check` skill

Generalise the existing `dashboard-sync-check` skill (currently hardcoded to Maya's Dashboard)
into `sync-check`, which takes a project name: "sync check Athena", "sync check Maya".

Internally it holds one table row per project:

| Field | Athena | Maya |
|---|---|---|
| Repo | `jaydenpineda30-glitch/Main` | `jaydenpineda30-glitch/Mayas-Dashboard` |
| Windows clone | `C:\Users\Jayde\my-project` | `C:\Users\Jayde\Documents\maya-dashboard` |
| Mac clone | `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` | located at runtime — search, then flag it if the path sits inside a cloud-synced folder |
| Handoff note | `Obsidian Vault/Claude/Cross-Device Handoff.md` | `Obsidian Vault/Maya Dashboard/Cross-Device Handoff.md` |

Adding a future project is one new row.

**Behaviour is read-only.** It runs `git remote get-url origin`, `git status`, `git fetch`,
`git status` again, `git log --oneline -5`, `git branch -vv`, then reports: current branch,
uncommitted changes, ahead/behind counts, unpushed commits by name, local-only branches. It
never pulls, pushes, merges, resets, or edits code — it reports and waits for direction.

Maya's project-specific knowledge is preserved, scoped to the Maya row rather than applied
globally:

- the cloud-sync warning (a clone inside OneDrive/iCloud/Dropbox is a defect, not a second
  legitimate clone — this caused the July 2026 divergence)
- the two recovered-but-unmerged branches, `feat/nebula-backdrop` and
  `feat/customisable-subjects-types-income`

Athena adds its own row-specific check: **confirm `core.hooksPath` is set to `.githooks`**, and
say so plainly if it isn't.

**Athena's Mac clone must move out of OneDrive.** It currently sits at
`~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` — the same arrangement that
caused the Maya divergence. Athena has not been bitten yet, most likely because only one
machine has been active at a time. The Windows clone (`C:\Users\Jayde\my-project`) is correctly
outside OneDrive.

The move can only be performed on the Mac, so it is issued as a Mac-side instruction (note 4
below) rather than executed here. Nothing is at risk in the move: every commit already lives on
`origin`, so the relocated clone is verified simply by confirming it is not behind `origin/main`
and has no unpushed commits. The old OneDrive copy is deleted only after that check passes.

Root cause worth recording, since it was a reasonable misunderstanding: OneDrive was installed
deliberately, in the belief that it kept the two machines' projects up to date. It does sync
files — but a git repo is not merely files. `.git` is a live database with an index and lock
files describing what *that* machine is doing at that moment; mirroring it mid-operation is what
produces two machines holding contradictory beliefs about what was committed. `git push` /
`git pull` is the correct sync mechanism, and is already in place.

### Athena's cross-device handoff note

Create `Obsidian Vault/Claude/Cross-Device Handoff.md`, mirroring the structure Maya's already
uses: a "Latest state" block at the top, a dated log beneath it. The skill reads it *before*
running git commands; whichever machine did work updates it at the end of the session,
including for unmerged or work-in-progress branches.

**Precedence rule (must be stated in the skill):** the vault syncs via OneDrive, and OneDrive
lag is precisely what caused the Maya divergence. A note written moments before switching
machines may not have arrived. The handoff note supplies *context*; a live `git fetch` supplies
*truth*. Where they disagree, git wins.

### Documentation corrections

Both orientation documents currently assert the Mac's setup as universal fact and must be
corrected:

- `HANDOFF.md` — states there is a pre-commit rebuild hook and no auto-push. Untrue on Windows
  as of this session. Lists only the Mac path under "Local files".
- `Obsidian Vault/Claude/SESSION STARTUP.md` — same pre-commit claim; "Local project path"
  lists only `/Users/jashleypineda/...`.

Each gains: both machines' clone paths, the `core.hooksPath` setup command, and the fact that
neither machine auto-pushes.

### Notes to leave for the Mac session

Recorded in the new handoff note, because the Mac has no other way to learn them:

1. Run `git config core.hooksPath .githooks` once — otherwise its commits silently stop
   rebuilding `app.js`, since the old `.git/hooks/pre-commit` is no longer the active path.
2. Windows no longer auto-pushes. Both machines now push deliberately.
3. `SESSION STARTUP.md` now documents both machines; don't re-narrow it to the Mac.
4. **Move the Mac clone out of OneDrive.** Clone fresh to a plain path (e.g.
   `~/Projects/my-project`), run `git config core.hooksPath .githooks` there, confirm
   `git status` shows no unpushed commits and no drift from `origin/main`, and only then delete
   the old `~/Library/CloudStorage/OneDrive-Personal/Documents/my-project/` copy. Update the
   handoff note and `SESSION STARTUP.md` with the new path once done.

---

## Verification

Implementation is complete when all of the following have been observed to hold:

1. `git config --get core.hooksPath` returns `.githooks` on Windows.
2. `.git/hooks/post-commit` no longer exists.
3. Editing `app.jsx` and committing **without** running a build produces a commit whose
   `app.js` matches a fresh `node build.js` — confirmed by `git diff --quiet -- app.js`
   returning clean after a rebuild.
4. That commit does **not** appear on `origin` until `git push` is run explicitly.
5. `sync-check` reports correctly for both Athena and Maya, and reports Athena as in sync
   with `origin/main`.
6. `Obsidian Vault/Claude/Cross-Device Handoff.md` exists and carries the three Mac notes.
7. `HANDOFF.md` and `SESSION STARTUP.md` no longer claim behaviour that is false on Windows.

Item 8 completes on the Mac, not here, and stays open until that session reports back:

8. The Mac clone sits outside OneDrive, has `core.hooksPath` set, and is not behind `origin`.

## Out of scope

- The `jarvis` branch (unmerged since 2026-07-04) — a future project, deliberately untouched.
- Any change to GitHub Pages deployment configuration (see "Explicitly rejected" above).
- Any change to application code.
- Maya's Dashboard clones — `sync-check` learns about Maya, but nothing about that project is
  moved or modified by this work.
