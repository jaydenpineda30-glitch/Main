# Usage Tracker — Cloud Backup + Cross-Device Sync

**Date:** 2026-05-29
**Status:** Approved, implementing
**Author:** Jayden + Claude

## Problem

The Usage Tracker (shipped earlier 2026-05-29) stores interaction counts in
`localStorage["dash_usage_v1"]` only. That data is per-browser, not backed up,
and lost if browser storage is cleared. Jayden wants it backed up to the cloud
and visible across devices.

## Why it was localStorage-only originally

Risk-aversion in the immediate aftermath of the 2026-05-29 data-loss incident
(empty seed-state overwrote the `dashData` document). The blanket "no Firestore
for usage" rule was broader than the actual risk. The real danger was *where* we
wrote (a full-document `.set()` of `dashData`), not *that* we wrote. Usage data
in its **own separate document** does not share that failure mode.

## Decisions (settled with Jayden)

- **Cross-device model:** per-device breakdown (not a combined total).
- **Device labels:** auto-detected from `navigator.userAgent`, no renaming.
- **Time granularity:** lifetime running totals only (no weekly buckets).
- **Storage:** one Firestore document per device (Approach A).
- **Daily backup:** include the usage subcollection in the daily JSON backup.

## Data model

Firestore subcollection `users/{uid}/usage/{deviceId}`, one doc per device:

```
label:     "Chrome on Windows"        // auto-detected
counts:    { "tab.Gym": 47, ... }
firstSeen: { "tab.Gym": "<iso>", ... }
lastSeen:  { "tab.Gym": "<iso>", ... }
startDate: "<iso>"
updatedAt: "<iso>"
```

- `deviceId` = random id stored in `localStorage["dash_device_id"]`, generated
  once per device. Lost only if browser storage is cleared (then a new id +
  device row is created; the old row remains in cloud, viewable, just orphaned).
- `localStorage["dash_usage_v1"]` stays as the fast local source of truth for the
  current device.

## Components (all in `monitoring-dashboard.js`)

### `window.UsageTracker` (extended)
- `_deviceId()` — get/create the persisted random device id.
- `_deviceLabel()` — parse `navigator.userAgent` → "Chrome on Windows" etc.
- `_pushToCloud()` — write this device's blob to `DASH_DOC.collection('usage')
  .doc(deviceId)`. No-op if `window.DASH_DOC` is null (not signed in). Wrapped,
  never throws.
- `_scheduleSync()` — debounced (~3s) `_pushToCloud`, so rapid events batch into
  one write. Called from `track()`.
- `reset()` — clears this device's local counts and pushes the cleared state to
  its own cloud doc (immediately). Other devices untouched.
- `fetchDevices()` — Promise → array of `{deviceId, label, counts, firstSeen,
  lastSeen, startDate, isCurrent}`. Reads the whole `usage` subcollection; the
  current device entry uses **live local** state (not the last cloud snapshot).
  Falls back to `[currentDeviceFromLocal]` if not signed in or the read fails.
- `getDeviceId()` — expose current device id for the view.

### `UsageView` (extended)
- Device `<select>` at the top: "This device (label)" + each other device label.
- Selected device's counts drive the rows. Current device = live local; others =
  last-synced cloud (read-only).
- Refresh button re-fetches the device list.
- Reset button only shown when viewing the current device (can't wipe others).
- Footer note updated to reflect per-device cloud sync.

## Data flow

- **Up:** `track()` → localStorage (instant) → debounced `_pushToCloud()` to this
  device's doc only. Offline/logged-out → keeps accumulating locally, syncs later.
- **Down:** `UsageView` opens → `fetchDevices()` reads all device docs → dropdown
  + per-device display.

## Daily backup (`export-to-obsidian.js`)

- Add `users/{uid}/usage` to the `Promise.all` reads.
- Add `usageSubcollection` (array, via existing `captureToJsonSafe`) to the
  `writeFullBackup` payload. Bump `backupVersion` to 2.

## Security rules (`firebase-rules.txt`)

No redeploy required — the existing catch-all
`match /{collection}/{docId} { allow read, write: if isOwner(uid); }` already
permits `users/{uid}/usage/{deviceId}` (owner-only). Add a documentation note +
explicit `usage` match block for clarity.

## Safety

- Usage lives in its **own document**, never a field on the dashData doc, so the
  `dashData` full-document `.set()` cannot touch it, and the seed-state guard /
  real data are never involved.
- All cloud writes are wrapped and no-throw, like the existing settings write.
- `track()` remains no-throw.

## Error handling

- `_pushToCloud` swallows errors (offline, permission, etc.).
- `fetchDevices` falls back to the local-only device on any read failure.
- If `window.DASH_DOC` is null (pre-auth), usage works fully locally and syncs
  once signed in.

## Out of scope (YAGNI)

- Weekly/daily buckets and trend charts.
- Device renaming.
- Removing/merging orphaned device rows.
- Combined cross-device total view.

## Testing

- Node `--check` on `monitoring-dashboard.js` and `export-to-obsidian.js`.
- Babel react-preset compile of the dashboard.html JSX block (unchanged here,
  but re-checked).
- Module-logic test with a DOM/localStorage shim: device-id generation, label
  parse, `_pushToCloud` builds the correct payload and no-throws when DASH_DOC is
  absent, `fetchDevices` falls back correctly.
- Manual: open in two browser profiles → two device rows appear.

## Migration

On first run with the new code, the current device's existing local counts get
pushed up as its own cloud doc — nothing lost.
