/**
 * restore-from-backup.js
 *
 * Restores a Dashboard/Backups/dashboard-YYYY-MM-DD.json snapshot back into Firestore.
 * Writes dashData (replaces the entire field) and re-creates captures subcollection
 * docs that are missing (does NOT delete existing captures that aren't in the backup).
 *
 * Usage:
 *   node restore-from-backup.js <path-to-backup.json>            # dry run, prints diff
 *   node restore-from-backup.js <path-to-backup.json> --write    # actually writes
 *
 * Example:
 *   node restore-from-backup.js "C:/Users/Jayde/OneDrive/Documents/Obsidian Vault/Dashboard/Backups/dashboard-2026-05-28.json"
 *   node restore-from-backup.js "..." --write
 */

const fs    = require('fs');
const path  = require('path');
const admin = require('firebase-admin');

const UID = 'hG4uA1WxQJdQ6yyZtvrrh8WyV2v2';

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  var files = fs.readdirSync(__dirname).filter(function(f) {
    return f.endsWith('.json') && f !== 'package.json' && f !== 'package-lock.json' && f !== 'version.json';
  });
  var sa = files.find(function(f) { return f.includes('firebase') || f.includes('service'); });
  if (!sa) throw new Error('No service account JSON found in ' + __dirname);
  return require(path.join(__dirname, sa));
}

function counts(d) {
  if (!d) return null;
  return {
    reflections:    (d.reflections || []).length,
    tasks:          (d.personal && d.personal.tasks || []).length,
    archived:       (d.personal && d.personal.archived || []).length,
    exercises:      (d.gym && d.gym.exercises || []).length,
    workouts:       (d.gym && d.gym.workouts || []).length,
    bodyWeight:     (d.gym && d.gym.bodyWeight || []).length,
    rotation:       (d.gym && d.gym.rotation || []).length,
    expenses:       (d.finance && d.finance.expenses || []).length,
    subjects:       (d.uni && d.uni.subjects || []).length,
    assessments:    (d.uni && d.uni.assessments || []).length,
    completedEvents:(d.uni && d.uni.completedEvents || []).length,
    docs:           (d.docs || []).length,
  };
}

(async function () {
  var file = process.argv[2];
  var doWrite = process.argv.indexOf('--write') !== -1;
  if (!file) {
    console.error('Usage: node restore-from-backup.js <backup.json> [--write]');
    process.exit(2);
  }
  if (!fs.existsSync(file)) {
    console.error('File not found: ' + file);
    process.exit(2);
  }

  var raw     = fs.readFileSync(file, 'utf8');
  var backup  = JSON.parse(raw);
  if (!backup.dashData || backup.backupVersion !== 1) {
    console.error('Not a valid backup file (missing dashData or backupVersion).');
    process.exit(2);
  }

  admin.initializeApp({ credential: admin.credential.cert(getServiceAccount()) });
  var db      = admin.firestore();
  var docRef  = db.collection('users').doc(UID);
  var capColl = docRef.collection('captures');

  var snap        = await docRef.get();
  var currentData = snap.data() || {};
  var currentFs   = currentData.dashData || null;

  console.log('Backup file:   ' + path.basename(file));
  console.log('Exported at:   ' + backup.exportedAt);
  console.log('');
  console.log('Counts in backup:'); console.log(counts(backup.dashData));
  console.log('Counts in Firestore now:'); console.log(counts(currentFs));
  console.log('');
  console.log('Captures in backup:    ' + (backup.capturesSubcollection || []).length);
  var capSnap = await capColl.get();
  console.log('Captures in Firestore: ' + capSnap.size);
  console.log('');

  if (!doWrite) {
    console.log('[DRY RUN] No write performed. Pass --write to actually restore.');
    process.exit(0);
  }

  // dashData: replace whole field with backup's
  await docRef.set({ dashData: backup.dashData }, { merge: true });
  console.log('✓ Wrote dashData');

  // captures: re-create only the ones missing in Firestore (don't delete extras)
  var existingIds = new Set();
  capSnap.forEach(function (d) { existingIds.add(d.id); });
  var restored = 0;
  for (var i = 0; i < (backup.capturesSubcollection || []).length; i++) {
    var c = backup.capturesSubcollection[i];
    if (!c.id || existingIds.has(c.id)) continue;
    var id = c.id;
    var data = Object.assign({}, c);
    delete data.id;
    // Convert ISO-string timestamps back to Firestore Timestamps where applicable
    Object.keys(data).forEach(function (k) {
      if (typeof data[k] === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(data[k])) {
        var d = new Date(data[k]);
        if (!isNaN(d.getTime())) data[k] = admin.firestore.Timestamp.fromDate(d);
      }
    });
    await capColl.doc(id).set(data);
    restored++;
  }
  console.log('✓ Restored ' + restored + ' missing captures (' + (capSnap.size + restored) + ' total now)');

  console.log('');
  console.log('Done. Reload the dashboard to see restored data.');
  process.exit(0);
})().catch(function (e) {
  console.error(e);
  process.exit(1);
});
