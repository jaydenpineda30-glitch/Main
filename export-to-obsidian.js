/**
 * export-to-obsidian.js
 * Reads captures + reflections from Firestore, enhances each capture via Gemini
 * (maturity, topic cluster, wikilinks, related notes), then writes .md files.
 *
 * Local usage:  node export-to-obsidian.js
 * GitHub Actions: set FIREBASE_SERVICE_ACCOUNT, GEMINI_API_KEY, VAULT_PATH env vars
 */

const fs    = require('fs');
const path  = require('path');
const admin = require('firebase-admin');

// ── Config ─────────────────────────────────────────────────────────────────────

const UID  = 'hG4uA1WxQJdQ6yyZtvrrh8WyV2v2';
const VAULT = process.env.VAULT_PATH
  || 'C:\\Users\\Jayde\\OneDrive\\Documents\\Obsidian Vault';

const CAPTURES_DIR    = path.join(VAULT, 'Dashboard', 'Captures');
const REFLECTIONS_DIR = path.join(VAULT, 'Dashboard', 'Reflections');

const TOPICS = [
  'Accounting', 'Tax', 'Finance', 'Fitness',
  'University', 'Work', 'Personal', 'Technology'
];

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

// ── Gemini enhancement ─────────────────────────────────────────────────────────

async function enhanceCapture(capture, allCaptures, geminiKey) {
  if (!geminiKey) return {};

  var otherTitles = allCaptures
    .filter(function(c) {
      return (c.title || c.rawInput) !== (capture.title || capture.rawInput);
    })
    .map(function(c) { return c.title || c.rawInput; })
    .filter(Boolean)
    .slice(0, 30);

  var prompt = [
    'Analyze this Obsidian note for a personal second brain. Return JSON only — no markdown, no explanation.',
    '',
    'Note:',
    'Title: ' + (capture.title || capture.rawInput || 'Untitled'),
    'Type: ' + (capture.type || 'thought'),
    'Subject: ' + (capture.subject || ''),
    'Content: ' + (capture.content || capture.rawInput || '').slice(0, 1000),
    '',
    'Other notes already in vault: ' + (otherTitles.length ? otherTitles.join(' | ') : 'none yet'),
    '',
    'Valid topics: ' + TOPICS.join(', '),
    '',
    'Return exactly this JSON shape:',
    '{',
    '  "maturity": "seedling" | "growing" | "evergreen",',
    '  "topic": "<one topic from the valid list>",',
    '  "wikilinks": ["[[ConceptA]]", "[[ConceptB]]"],',
    '  "related": ["Exact title of related note"]',
    '}',
    '',
    'Rules:',
    '- maturity: seedling = brief thought, growing = partially explained, evergreen = fully explained with examples',
    '- topic: pick the single best match from the valid list only',
    '- wikilinks: 2-4 key concepts inside the content worth their own note (not the title itself)',
    '- related: 0-3 titles from "Other notes in vault" that genuinely connect to this note'
  ].join('\n');

  try {
    var res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );
    var data = await res.json();
    var text = (data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) || '{}';
    return JSON.parse(text);
  } catch (e) {
    console.warn('  Gemini enhancement skipped for "' + (capture.title || capture.rawInput) + '": ' + e.message);
    return {};
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// ── Capture → markdown ─────────────────────────────────────────────────────────

function captureToMd(c, enhancement) {
  var enh   = enhancement || {};
  var date  = datePrefix(c.date);
  var title = c.title || c.rawInput || 'Capture';
  var baseTags = (c.tags || []).concat(['capture', c.type || 'thought']).filter(Boolean);
  var lines = [];

  lines.push('---');
  lines.push('type: ' + (c.type || 'thought'));
  if (c.subject)      lines.push('subject: ' + c.subject);
  if (enh.topic)      lines.push('topic: ' + enh.topic);
  if (enh.maturity)   lines.push('maturity: ' + enh.maturity);
  lines.push('tags: [' + baseTags.map(function(t) {
    return t.replace(/\s+/g, '-').toLowerCase();
  }).join(', ') + ']');
  lines.push('date: ' + date);
  lines.push('source: dashboard');
  lines.push('---');
  lines.push('');
  lines.push('# ' + title);
  lines.push('');

  if (c.content)  lines.push(c.content);
  if (c.formula)  { lines.push(''); lines.push('> **Formula:** ' + c.formula); }
  if (c.example)  { lines.push(''); lines.push('**Example:** ' + c.example); }

  // Wikilinks
  if (enh.wikilinks && enh.wikilinks.length > 0) {
    lines.push('');
    lines.push('**Key concepts:** ' + enh.wikilinks.join('  '));
  }

  // Related notes
  if (enh.related && enh.related.length > 0) {
    lines.push('');
    lines.push('**Related:**');
    enh.related.forEach(function(r) {
      lines.push('- [[' + r + ']]');
    });
  }

  if (c.rawInput && c.rawInput !== title) {
    lines.push('');
    lines.push('---');
    lines.push('*Original input: ' + c.rawInput + '*');
  }

  return { filename: date + ' ' + safeFilename(title) + '.md', content: lines.join('\n') };
}

// ── Reflection → markdown ──────────────────────────────────────────────────────

var AREA_LABELS = ['Academic load', 'Work situation', 'Physical health', 'Work-life balance', 'Personal growth'];

function reflectionToMd(r) {
  var date       = datePrefix(r.date);
  var prettyDate = fmtDate(r.date);
  var an         = r.analysis || {};
  var lines      = [];

  lines.push('---');
  lines.push('type: reflection');
  lines.push('date: ' + date);
  if (an.dominantPattern) lines.push('pattern: "' + an.dominantPattern.replace(/"/g, "'") + '"');
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

// ── Main ───────────────────────────────────────────────────────────────────────

ensureDir(CAPTURES_DIR);
ensureDir(REFLECTIONS_DIR);

Promise.all([
  db.collection('users').doc(UID).collection('captures').get(),
  db.collection('users').doc(UID).get()
]).then(async function(results) {
  var capSnap  = results[0];
  var userSnap = results[1];

  // Get Gemini key: env var → Firestore settings
  var userData   = userSnap.data() || {};
  var geminiKey  = (process.env.GEMINI_API_KEY || (userData.settings && userData.settings.geminiKey) || '').trim();
  if (!geminiKey) console.log('  No Gemini key found — skipping enhancement');

  // Build full captures list for cross-referencing
  var allCaptures = [];
  capSnap.forEach(function(doc) { allCaptures.push(doc.data()); });

  var capWritten = 0, capSkipped = 0, reflWritten = 0, reflSkipped = 0;

  // Write captures
  for (var i = 0; i < allCaptures.length; i++) {
    var c      = allCaptures[i];
    var title  = c.title || c.rawInput || 'Capture';
    var dest   = path.join(CAPTURES_DIR, datePrefix(c.date) + ' ' + safeFilename(title) + '.md');

    // Skip if file exists AND hasn't been edited since last export
    if (fs.existsSync(dest)) {
      var fileMtime  = fs.statSync(dest).mtimeMs;
      var updatedAt  = c.updatedAt ? (c.updatedAt.toDate ? c.updatedAt.toDate().getTime() : c.updatedAt._seconds * 1000) : 0;
      if (!updatedAt || updatedAt <= fileMtime) { capSkipped++; continue; }
      console.log('  ~ Updated capture (re-exporting): ' + title);
    }

    var enhancement = await enhanceCapture(c, allCaptures, geminiKey);
    var result      = captureToMd(c, enhancement);
    fs.writeFileSync(path.join(CAPTURES_DIR, result.filename), result.content, 'utf8');
    console.log('  + Capture: ' + result.filename);
    capWritten++;
  }

  // Write reflections
  var reflections = (userData.dashData && userData.dashData.reflections) || [];
  reflections.forEach(function(r) {
    var result = reflectionToMd(r);
    var dest   = path.join(REFLECTIONS_DIR, result.filename);
    if (fs.existsSync(dest)) { reflSkipped++; return; }
    fs.writeFileSync(dest, result.content, 'utf8');
    console.log('  + Reflection: ' + result.filename);
    reflWritten++;
  });

  console.log('');
  console.log('Done!  ' + new Date().toLocaleString('en-AU'));
  console.log('  Captures:    ' + capWritten + ' written, ' + capSkipped + ' skipped');
  console.log('  Reflections: ' + reflWritten + ' written, ' + reflSkipped + ' skipped');
  console.log('  Vault: ' + VAULT);

}).catch(function(e) {
  console.error('Export failed:', e.message);
  process.exit(1);
}).finally(function() {
  admin.app().delete();
});
