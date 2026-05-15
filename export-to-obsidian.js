/**
 * export-to-obsidian.js
 * Reads obsidian-export.json (from dashboard) and writes .md files into Obsidian vault.
 * Usage: node export-to-obsidian.js
 * No npm packages required.
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const VAULT = 'C:\\Users\\Jayde\\OneDrive\\Documents\\Obsidian Vault';
const CAPTURES_DIR   = path.join(VAULT, 'Dashboard', 'Captures');
const REFLECTIONS_DIR = path.join(VAULT, 'Dashboard', 'Reflections');

// ── Find the export file ──────────────────────────────────────────────────────

function findExportFile() {
  var candidates = [
    path.join(__dirname, 'obsidian-export.json'),
    path.join(os.homedir(), 'Downloads', 'obsidian-export.json'),
    path.join(os.homedir(), 'Desktop', 'obsidian-export.json'),
  ];
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(candidates[i])) return candidates[i];
  }
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeFilename(str) {
  return (str || 'Untitled').replace(/[\\/:*?"<>|]/g, '-').slice(0, 80).trim();
}

function fmtDate(iso) {
  if (!iso) return 'Unknown date';
  var d = new Date(iso);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function datePrefix(iso) {
  if (!iso) return '0000-00-00';
  var d = new Date(iso);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Capture → markdown ────────────────────────────────────────────────────────

function captureToMd(c) {
  var rawDate = c.date ? (c.date.toDate ? c.date.toDate().toISOString() : (c.date.seconds ? new Date(c.date.seconds * 1000).toISOString() : c.date)) : null;
  var date = datePrefix(rawDate);
  var title = c.title || c.rawInput || 'Capture';
  var tags = (c.tags || []).concat(['capture', c.type || 'thought']).filter(Boolean);
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

var AREA_LABELS = [
  'Academic load',
  'Work situation',
  'Physical health',
  'Work-life balance',
  'Personal growth'
];

function reflectionToMd(r) {
  var date = datePrefix(r.date);
  var prettyDate = fmtDate(r.date);
  var an = r.analysis || {};
  var lines = [];

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
    if (an.dominantPattern)  { lines.push(''); lines.push('**Pattern:** ' + an.dominantPattern); }
    if (an.rootIssue)        { lines.push(''); lines.push('**Root issue:** ' + an.rootIssue); }
    if (an.insight)          { lines.push(''); lines.push('**Insight:** ' + an.insight); }
    if (an.recommendation)   { lines.push(''); lines.push('**Recommendation:** ' + an.recommendation); }
    if (an.patternHistory)   { lines.push(''); lines.push('**Trend:** ' + an.patternHistory); }
  }

  return { filename: date + ' Weekly Reflection.md', content: lines.join('\n') };
}

// ── Main ──────────────────────────────────────────────────────────────────────

var exportFile = findExportFile();
if (!exportFile) {
  console.error('Could not find obsidian-export.json.');
  console.error('Click "⬇ Obsidian" in the dashboard, then move the file to:');
  console.error('  ' + __dirname);
  process.exit(1);
}

console.log('Reading ' + exportFile);
var payload = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
var captures    = payload.captures    || [];
var reflections = payload.reflections || [];

ensureDir(CAPTURES_DIR);
ensureDir(REFLECTIONS_DIR);

var capWritten = 0, capSkipped = 0;
captures.forEach(function(c) {
  var result = captureToMd(c);
  var dest = path.join(CAPTURES_DIR, result.filename);
  if (fs.existsSync(dest)) { capSkipped++; return; }
  fs.writeFileSync(dest, result.content, 'utf8');
  capWritten++;
});

var reflWritten = 0, reflSkipped = 0;
reflections.forEach(function(r) {
  var result = reflectionToMd(r);
  var dest = path.join(REFLECTIONS_DIR, result.filename);
  if (fs.existsSync(dest)) { reflSkipped++; return; }
  fs.writeFileSync(dest, result.content, 'utf8');
  reflWritten++;
});

console.log('');
console.log('Done!');
console.log('  Captures:    ' + capWritten + ' written, ' + capSkipped + ' already existed');
console.log('  Reflections: ' + reflWritten + ' written, ' + reflSkipped + ' already existed');
console.log('');
console.log('Vault: ' + VAULT);
