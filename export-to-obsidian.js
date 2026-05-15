/**
 * export-to-obsidian.js
 * Reads captures and reflections directly from Firestore and writes .md files
 * into the Obsidian vault. Runs fully automated — no browser, no JSON download.
 *
 * Usage:    node export-to-obsidian.js
 * Schedule: Windows Task Scheduler — see README or run setup-scheduler.ps1
 *
 * Requires: service account JSON in the same folder as this script.
 *           Set SERVICE_ACCOUNT_PATH below if the filename differs.
 */

const fs    = require('fs');
const path  = require('path');
const admin = require('firebase-admin');

// ── Config ────────────────────────────────────────────────────────────────────

const UID   = 'hG4uA1WxQJdQ6yyZtvrrh8WyV2v2';   // Jayden's Firebase UID
const VAULT = 'C:\\Users\\Jayde\\OneDrive\\Documents\\Obsidian Vault';
const CAPTURES_DIR    = path.join(VAULT, 'Dashboard', 'Captures');
const REFLECTIONS_DIR = path.join(VAULT, 'Dashboard', 'Reflections');

// Auto-find the service account JSON in the same folder
function findServiceAccount() {
  var files = fs.readdirSync(__dirname).filter(function(f) {
    return f.endsWith('.json') && f !== 'package.json' && f !== 'package-lock.json';
  });
  if (files.length === 0) throw new Error('No service account JSON found in ' + __dirname);
  if (files.length > 1) {
    var sa = files.find(function(f) { return f.includes('firebase') || f.includes('service'); });
    if (sa) return path.join(__dirname, sa);
  }
  return path.join(__dirname, files[0]);
}

// ── Init Firebase ─────────────────────────────────────────────────────────────

var serviceAccountPath = findServiceAccount();
console.log('Using service account: ' + path.basename(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});

var db = admin.firestore();

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeFilename(str) {
  return (str || 'Untitled').replace(/[\\/:*?"<>|]/g, '-').slice(0, 80).trim();
}

function fmtDate(ts) {
  if (!ts) return 'Unknown date';
  var d = ts.toDate ? ts.toDate() : (ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts));
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function datePrefix(ts) {
  if (!ts) return '0000-00-00';
  var d = ts.toDate ? ts.toDate() : (ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts));
  if (isNaN(d.getTime())) return '0000-00-00';
  var y   = d.getFullYear();
  var m   = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Capture → markdown ────────────────────────────────────────────────────────

function captureToMd(c) {
  var date  = datePrefix(c.date);
  var title = c.title || c.rawInput || 'Capture';
  var tags  = (c.tags || []).concat(['capture', c.type || 'thought']).filter(Boolean);
  var lines = [];

  lines.push('---');
  lines.push('type: ' + (c.type || 'thought'));
  if (c.subject) lines.push('subject: ' + c.subject);
  lines.push('tags: [' + tags.map(function(t){ return t.replace(/\s+/g,'-').toLowerCase(); }).join(', ') + ']');
  lines.push('date: ' + date);
  lines.push('source: dashboard');
  lines.push('---');
  lines.push('');
  lines.push('# ' + title);
  lines.push('');

  if (c.content)  lines.push(c.content);
  if (c.formula)  { lines.push(''); lines.push('> **Formula:** ' + c.formula); }
  if (c.example)  { lines.push(''); lines.push('**Example:** ' + c.example); }
  if (c.rawInput && c.rawInput !== title) { lines.push(''); lines.push('---'); lines.push('*Original input: ' + c.rawInput + '*'); }

  return { filename: date + ' ' + safeFilename(title) + '.md', content: lines.join('\n') };
}

// ── Reflection → markdown ─────────────────────────────────────────────────────

var AREA_LABELS = ['Academic load', 'Work situation', 'Physical health', 'Work-life balance', 'Personal growth'];

function reflectionToMd(r) {
  var date       = datePrefix(r.date);
  var prettyDate = fmtDate(r.date);
  var an         = r.analysis || {};
  var lines      = [];

  lines.push('---');
  lines.push('type: reflection');
  lines.push('date: ' + date);
  if (an.dominantPattern) lines.push('pattern: "' + an.dominantPattern.replace(/"/g,"'") + '"');
  lines.push('tags: [reflection, weekly-reflection]');
  lines.push('---');
  lines.push('');
  lines.push('# Weekly Reflection — ' + prettyDate);
  lines.push('');

  var answers = r.answers || [];
  if (answers.length > 0) {
    lines.push('## Answers');
    answers.forEach(function(a, i) {
      var label = a.area || AREA_LABELS[i] || ('Question ' + (i + 1));
      lines.push('');
      lines.push('**' + label + '**');
      lines.push(a.answer || a.a || '');
    });
    lines.push('');
  }

  if (an.dominantPattern || an.insight || an.recommendation) {
    lines.push('## Gemini Analysis');
    if (an.dominantPattern) { lines.push(''); lines.push('**Pattern:** ' + an.dominantPattern); }
    if (an.rootIssue)       { lines.push(''); lines.push('**Root issue:** ' + an.rootIssue); }
    if (an.insight)         { lines.push(''); lines.push('**Insight:** ' + an.insight); }
    if (an.recommendation)  { lines.push(''); lines.push('**Recommendation:** ' + an.recommendation); }
    if (an.patternHistory)  { lines.push(''); lines.push('**Trend:** ' + an.patternHistory); }
  }

  return { filename: date + ' Weekly Reflection.md', content: lines.join('\n') };
}

// ── Main ──────────────────────────────────────────────────────────────────────

ensureDir(CAPTURES_DIR);
ensureDir(REFLECTIONS_DIR);

var capWritten = 0, capSkipped = 0, reflWritten = 0, reflSkipped = 0;

Promise.all([
  db.collection('users').doc(UID).collection('captures').get(),
  db.collection('users').doc(UID).get()
]).then(function(results) {
  var capSnap  = results[0];
  var userSnap = results[1];

  // Write captures
  capSnap.forEach(function(doc) {
    var result = captureToMd(doc.data());
    var dest   = path.join(CAPTURES_DIR, result.filename);
    if (fs.existsSync(dest)) { capSkipped++; return; }
    fs.writeFileSync(dest, result.content, 'utf8');
    capWritten++;
  });

  // Write reflections from dashData
  var dashData    = (userSnap.data() || {}).dashData || {};
  var reflections = dashData.reflections || [];
  reflections.forEach(function(r) {
    var result = reflectionToMd(r);
    var dest   = path.join(REFLECTIONS_DIR, result.filename);
    if (fs.existsSync(dest)) { reflSkipped++; return; }
    fs.writeFileSync(dest, result.content, 'utf8');
    reflWritten++;
  });

  console.log('');
  console.log('Done!  ' + new Date().toLocaleString('en-AU'));
  console.log('  Captures:    ' + capWritten + ' written, ' + capSkipped + ' already existed');
  console.log('  Reflections: ' + reflWritten + ' written, ' + reflSkipped + ' already existed');
  console.log('  Vault: ' + VAULT);
  console.log('');

}).catch(function(e) {
  console.error('Export failed:', e.message);
  process.exit(1);
}).finally(function() {
  admin.app().delete();
});
