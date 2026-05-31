/**
 * boardroom-nudge.js
 * Run by GitHub Actions each evening. Sets dashData.boardroom.nudgePending = true
 * so the dashboard's Boardroom button glows urgent — UNLESS a Boardroom session
 * already happened today (a keyMoment dated today exists).
 */

const fs    = require('fs');
const path  = require('path');
const admin = require('firebase-admin');

// ── Service account: env var (Actions) or local JSON file ──────────────────────

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  var files = fs.readdirSync(__dirname).filter(function(f) {
    return f.endsWith('.json') && f !== 'package.json' && f !== 'package-lock.json';
  });
  if (files.length === 0) throw new Error('No service account JSON found in ' + __dirname);
  var sa = files.find(function(f) { return f.includes('firebase') || f.includes('service'); }) || files[0];
  return require(path.join(__dirname, sa));
}

admin.initializeApp({ credential: admin.credential.cert(getServiceAccount()) });
var db = admin.firestore();

// ──────────────────────────────────────────────────────────────────────────────

const UID = 'hG4uA1WxQJdQ6yyZtvrrh8WyV2v2';

(async () => {
  try {
    const ref = db.collection('users').doc(UID);
    const snap = await ref.get();
    const dd = (snap.data() || {}).dashData || {};
    const br = dd.boardroom || {};
    const today = new Date().toISOString().slice(0, 10);
    const sessionToday = (br.keyMoments || []).some(function (m) { return m.date === today; });
    if (sessionToday) {
      console.log('Boardroom session already happened today — no nudge needed.');
      process.exit(0);
    }
    await ref.set({ dashData: { boardroom: { nudgePending: true } } }, { merge: true });
    console.log('Evening nudge set: boardroom.nudgePending = true');
    process.exit(0);
  } catch (e) {
    console.error('Nudge failed:', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
