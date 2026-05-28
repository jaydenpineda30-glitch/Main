/**
 * log-to-firebase.js
 * Writes a ticket/session doc to users/{uid}/tickets/{docId} in Firestore.
 *
 * Usage:
 *   node log-to-firebase.js \
 *     --title "Printer Offline" \
 *     --venue "98 Lygon St" \
 *     --operator "Luke Christensen" \
 *     --status "resolved" \
 *     --category "hardware" \
 *     --content "..." \
 *     --tags "printer,hardware" \
 *     [--date "2026-05-28"]
 *
 * Date defaults to today (Australia/Melbourne). Tags is comma-separated.
 * Prints the new docId on success.
 */

const fs    = require('fs');
const path  = require('path');
const admin = require('firebase-admin');

const UID = 'hG4uA1WxQJdQ6yyZtvrrh8WyV2v2';

// ── Service account: env var (Actions) or local JSON file ──────────────────────

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  var files = fs.readdirSync(__dirname).filter(function(f) {
    return f.endsWith('.json') && f !== 'package.json' && f !== 'package-lock.json' && f !== 'version.json';
  });
  if (files.length === 0) throw new Error('No service account JSON found in ' + __dirname);
  var sa = files.find(function(f) { return f.includes('firebase') || f.includes('service'); }) || files[0];
  return require(path.join(__dirname, sa));
}

// ── Arg parsing ────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  var out = {};
  for (var i = 2; i < argv.length; i++) {
    var a = argv[i];
    if (a.indexOf('--') === 0) {
      var key = a.slice(2);
      var val = argv[i + 1];
      if (val === undefined || val.indexOf('--') === 0) {
        out[key] = true;
      } else {
        out[key] = val;
        i++;
      }
    }
  }
  return out;
}

function todayMelbourne() {
  // en-CA gives YYYY-MM-DD
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
}

// ── Main ───────────────────────────────────────────────────────────────────────

var args = parseArgs(process.argv);

if (!args.title) {
  console.error('Error: --title is required');
  console.error('Example: node log-to-firebase.js --title "Printer Offline" --venue "98 Lygon St" --status "resolved" --content "..." --tags "printer,hardware"');
  process.exit(1);
}

var date = args.date && /^\d{4}-\d{2}-\d{2}/.test(args.date) ? args.date.slice(0, 10) : todayMelbourne();

var tags = [];
if (args.tags) {
  tags = String(args.tags).split(',').map(function(s) { return s.trim(); }).filter(Boolean);
}

var ticket = {
  title:    args.title,
  date:     date,
  venue:    args.venue || '',
  operator: args.operator || '',
  status:   args.status || 'open',
  category: args.category || 'general',
  content:  args.content || '',
  tags:     tags,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

admin.initializeApp({ credential: admin.credential.cert(getServiceAccount()) });
var db = admin.firestore();

db.collection('users').doc(UID).collection('tickets').add(ticket)
  .then(function(ref) {
    console.log('+ Ticket written: ' + ref.id);
    console.log('  title:    ' + ticket.title);
    console.log('  date:     ' + ticket.date);
    console.log('  venue:    ' + (ticket.venue || '(none)'));
    console.log('  operator: ' + (ticket.operator || '(none)'));
    console.log('  status:   ' + ticket.status);
    console.log('  category: ' + ticket.category);
    console.log('  tags:     [' + tags.join(', ') + ']');
  })
  .catch(function(e) {
    console.error('Write failed:', e.message);
    process.exit(1);
  })
  .finally(function() {
    admin.app().delete();
  });
