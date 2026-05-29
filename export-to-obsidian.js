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
const BACKUPS_DIR     = path.join(VAULT, 'Dashboard', 'Backups');

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

// ── Vault note scanner ─────────────────────────────────────────────────────────

function scanVaultNotes(vault) {
  var notes = [];
  var excludeDirs = [
    path.join(vault, 'Dashboard'),
    path.join(vault, '.obsidian')
  ];

  function walk(dir) {
    var entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    entries.forEach(function(entry) {
      var full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!excludeDirs.some(function(ex) { return full.startsWith(ex); })) walk(full);
      } else if (entry.name.endsWith('.md')) {
        notes.push(entry.name.slice(0, -3));
      }
    });
  }

  walk(vault);
  return notes;
}

// ── Gemini enhancement ─────────────────────────────────────────────────────────

async function enhanceCapture(capture, allCaptures, vaultNotes, geminiKey) {
  if (!geminiKey) return {};

  var otherTitles = allCaptures
    .filter(function(c) {
      return (c.title || c.rawInput) !== (capture.title || capture.rawInput);
    })
    .map(function(c) { return c.title || c.rawInput; })
    .filter(Boolean)
    .slice(0, 30);

  // Combine vault notes + other capture titles for cross-referencing
  var allNoteNames = vaultNotes.concat(otherTitles).filter(Boolean);

  var situationTags = [
    'to-review', 'insight', 'formula', 'goal', 'study-note', 'reference', 'workflow'
  ];

  var prompt = [
    'Analyze this Obsidian note for a personal second brain. Return JSON only — no markdown, no explanation.',
    '',
    'Note:',
    'Title: ' + (capture.title || capture.rawInput || 'Untitled'),
    'Type: ' + (capture.type || 'thought'),
    'Subject: ' + (capture.subject || ''),
    'Content: ' + (capture.content || capture.rawInput || '').slice(0, 1000),
    '',
    'Existing vault notes (use these EXACT names for wikilinks and related — do not invent new names):',
    allNoteNames.slice(0, 80).join(' | ') || 'none yet',
    '',
    'Valid topics: ' + TOPICS.join(', '),
    'Valid situation tags: ' + situationTags.join(', '),
    '',
    'Return exactly this JSON shape:',
    '{',
    '  "maturity": "seedling" | "growing" | "evergreen",',
    '  "topic": "<one topic from the valid list>",',
    '  "situationTags": ["tag1", "tag2"],',
    '  "wikilinks": ["[[vault-note-name]]", "[[another-note-name]]"],',
    '  "related": ["exact-vault-note-name"],',
    '  "suggestedConcept": "ConceptName" | null',
    '}',
    '',
    'Rules:',
    '- maturity: seedling = brief thought, growing = partially explained, evergreen = fully explained with examples',
    '- topic: pick the single best match from the valid list only',
    '- situationTags: 1-2 tags from the valid situation tags list that describe WHY you would open this note (not what it is about). to-review = needs revisiting, insight = key realization, formula = equation/method, goal = something to work toward, study-note = concept to memorise, reference = look-up table, workflow = process or procedure',
    '- wikilinks: ALWAYS return 2-4 key concepts from this note worth their own node. Prefer names from the vault notes list when one fits (broad concept nodes first, then granular); if none fit, propose a concise new concept name (1-3 words, Title Case). Never return an empty list — every note gets wikilinks.',
    '- related: 0-3 note names from the vault notes list that genuinely connect to this note; prefer concept nodes first (broad then granular), then specific notes. Exact filename, no .md',
    '- suggestedConcept: if this note belongs to a concept that does NOT exist in the vault notes list, return the concept name it SHOULD link to (one or two words, title case, e.g. "Photography", "Travel", "Sleep"). Otherwise return null'
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

// Strip a leading "YYYY-MM-DD " date prefix so dated and undated filenames for the
// same capture collapse to one key. Makes dedup robust to date-prefix drift (the
// exact bug that produced the dated/undated duplicate notes).
function stripDate(filename) {
  return filename.replace(/^\d{4}-\d{2}-\d{2} /, '');
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
  var baseTags = (c.tags || [])
    .concat(['capture', c.type || 'thought'])
    .concat(enh.situationTags || [])
    .filter(Boolean);
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

  // Wikilinks (key concepts inline)
  if (enh.wikilinks && enh.wikilinks.length > 0) {
    lines.push('');
    lines.push('**Key concepts:** ' + enh.wikilinks.join(' · '));
  }

  // Related notes — vault-style Related section
  if (enh.related && enh.related.length > 0) {
    lines.push('');
    lines.push('## Related');
    lines.push(enh.related.map(function(r) {
      // Strip any [[]] brackets the model may have included
      var name = r.replace(/^\[\[|\]\]$/g, '');
      return '[[' + name + ']]';
    }).join(' · '));
  }

  if (c.rawInput && c.rawInput !== title) {
    lines.push('');
    lines.push('---');
    lines.push('*Original input: ' + c.rawInput + '*');
  }

  return { filename: safeFilename(title) + '.md', content: lines.join('\n') };
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

  return { filename: 'Weekly Reflection ' + date + '.md', content: lines.join('\n') };
}

// ── Full-data backup ───────────────────────────────────────────────────────────
// Writes a complete snapshot of dashData + the captures subcollection to a single
// JSON file per day under Dashboard/Backups/. All days are retained (never pruned)
// so that any past state is restorable via restore-from-backup.js. This exists
// because the 2026-05-29 incident wiped tasks/gym/uni/finance/docs from Firestore
// and there was no recovery source — captures+reflections were the only fields
// the markdown export ever covered.

function captureToJsonSafe(doc) {
  // Convert Firestore Timestamps to ISO strings so the JSON survives a round trip.
  var data = doc.data();
  var out  = { id: doc.id };
  Object.keys(data).forEach(function(k) {
    var v = data[k];
    if (v && typeof v.toDate === 'function')      out[k] = v.toDate().toISOString();
    else if (v && typeof v._seconds === 'number') out[k] = new Date(v._seconds * 1000).toISOString();
    else                                          out[k] = v;
  });
  return out;
}

function writeFullBackup(userData, capSnap, usageSnap) {
  ensureDir(BACKUPS_DIR);
  var today = new Date().toISOString().slice(0, 10);
  var dest  = path.join(BACKUPS_DIR, 'dashboard-' + today + '.json');
  var captures = [];
  capSnap.forEach(function(d) { captures.push(captureToJsonSafe(d)); });
  var usage = [];
  if (usageSnap) usageSnap.forEach(function(d) { usage.push(captureToJsonSafe(d)); });
  var payload = {
    backupVersion:    2,
    exportedAt:       new Date().toISOString(),
    uid:              UID,
    dashData:         (userData && userData.dashData) || null,
    settings:         (userData && userData.settings) || null,
    capturesSubcollection: captures,
    usageSubcollection:    usage
  };
  fs.writeFileSync(dest, JSON.stringify(payload, null, 2), 'utf8');
  var sizeKb = Math.round(fs.statSync(dest).size / 1024);
  console.log('  + Backup: ' + path.basename(dest) + ' (' + sizeKb + ' KB, ' + captures.length + ' captures, ' + usage.length + ' usage devices)');
}

// ── Main ───────────────────────────────────────────────────────────────────────

ensureDir(CAPTURES_DIR);
ensureDir(REFLECTIONS_DIR);

Promise.all([
  db.collection('users').doc(UID).collection('captures').get(),
  db.collection('users').doc(UID).get(),
  db.collection('users').doc(UID).collection('usage').get()
]).then(async function(results) {
  var capSnap   = results[0];
  var userSnap  = results[1];
  var usageSnap = results[2];

  // Get Gemini key: env var → Firestore settings
  var userData   = userSnap.data() || {};

  // Write the daily full-data backup FIRST, before any other work. This way the snapshot
  // is captured even if downstream Gemini calls fail or the script crashes mid-export.
  try { writeFullBackup(userData, capSnap, usageSnap); }
  catch (e) { console.error('  ! Backup write failed:', e.message); }
  var geminiKey  = (process.env.GEMINI_API_KEY || (userData.settings && userData.settings.geminiKey) || '').trim();
  if (!geminiKey) console.log('  No Gemini key found — skipping enhancement');

  // Build full captures list for cross-referencing
  var allCaptures = [];
  capSnap.forEach(function(doc) { allCaptures.push(doc.data()); });

  // Scan vault for existing note filenames to ground Gemini wikilinks
  var vaultNotes = scanVaultNotes(VAULT);
  console.log('  Vault notes indexed: ' + vaultNotes.length);

  var capWritten = 0, capSkipped = 0, reflWritten = 0, reflSkipped = 0;

  // Write captures
  for (var i = 0; i < allCaptures.length; i++) {
    var c      = allCaptures[i];
    var title  = c.title || c.rawInput || 'Capture';
    var LINK_RE       = /\*\*Key concepts:|## Related|\*\*Related/;
    var canonicalName = safeFilename(title) + '.md';                 // single undated name we converge on
    var canonicalPath = path.join(CAPTURES_DIR, canonicalName);
    // All existing files for this capture, regardless of date prefix (date-agnostic dedup).
    var variants = fs.readdirSync(CAPTURES_DIR).filter(function (f) {
      return f.endsWith('.md') && stripDate(f) === canonicalName;
    });
    function readCap(f) { try { return fs.readFileSync(path.join(CAPTURES_DIR, f), 'utf8'); } catch (_) { return ''; } }
    function cleanStrays() {
      variants.forEach(function (f) {
        if (f !== canonicalName) {
          try { fs.unlinkSync(path.join(CAPTURES_DIR, f)); console.log('  - Removed duplicate: ' + f); } catch (_) {}
        }
      });
    }
    var canonicalExists   = variants.indexOf(canonicalName) !== -1;
    var canonicalHasLinks = canonicalExists && LINK_RE.test(readCap(canonicalName));
    var canonicalMtime    = canonicalExists ? fs.statSync(canonicalPath).mtimeMs : 0;
    var updatedAt = c.updatedAt ? (c.updatedAt.toDate ? c.updatedAt.toDate().getTime() : c.updatedAt._seconds * 1000) : 0;

    // Canonical note already has wikilinks and the capture wasn't edited since →
    // just drop any stray dated duplicates (no Gemini call needed). A note MISSING
    // wikilinks is always re-enhanced (backfill) so a past keyless run can't leave
    // it link-less forever.
    if (canonicalHasLinks && (!updatedAt || updatedAt <= canonicalMtime)) {
      cleanStrays();
      capSkipped++;
      continue;
    }
    if (variants.length) console.log('  ~ Re-exporting (' + (canonicalHasLinks ? 'edited' : 'missing wikilinks') + '): ' + title);

    var enhancement = await enhanceCapture(c, allCaptures, vaultNotes, geminiKey);

    // Auto-create a concept stub if Gemini flagged a missing concept — only when the
    // FULL vault is present (local runs). In the GitHub Action the repo holds just
    // Dashboard/, so skip stub creation there to avoid polluting the export repo.
    if (enhancement.suggestedConcept && vaultNotes.length > 20) {
      var conceptName = enhancement.suggestedConcept.trim();
      var conceptFile = safeFilename(conceptName) + '.md';
      var conceptPath = path.join(VAULT, 'Concepts', 'Personal', conceptFile);
      if (!fs.existsSync(conceptPath)) {
        ensureDir(path.join(VAULT, 'Concepts', 'Personal'));
        fs.writeFileSync(conceptPath,
          '---\ntype: concept\ntags: [concept]\n---\n\n# ' + conceptName + '\n\n',
          'utf8'
        );
        vaultNotes.push(conceptName);
        console.log('  + New concept node: ' + conceptName);
      }
    }

    var result      = captureToMd(c, enhancement);
    var newHasLinks = LINK_RE.test(result.content);

    // NEVER DOWNGRADE: if this run produced no wikilinks but an existing variant already
    // has them, keep that linked content (a keyless/failed Gemini call must not strip links).
    if (!newHasLinks) {
      var linkedVariant = variants.filter(function (f) { return LINK_RE.test(readCap(f)); })[0];
      if (linkedVariant) {
        fs.writeFileSync(canonicalPath, readCap(linkedVariant), 'utf8');
        cleanStrays();
        console.log('  = Kept existing wikilinks (enhancement returned none): ' + title);
        capWritten++;
        continue;
      }
    }

    fs.writeFileSync(canonicalPath, result.content, 'utf8');
    cleanStrays(); // converge: only the canonical undated file remains
    console.log('  + Capture: ' + canonicalName);
    capWritten++;
  }

  // Write reflections
  var reflections = (userData.dashData && userData.dashData.reflections) || [];
  reflections.forEach(function(r) {
    var result      = reflectionToMd(r);
    var date        = datePrefix(r.date);
    var dest        = path.join(REFLECTIONS_DIR, result.filename);
    // Pre-2026-05-17 export naming. Skip if either form exists.
    var legacyDest  = path.join(REFLECTIONS_DIR, date + ' Weekly Reflection.md');
    if (fs.existsSync(dest) || fs.existsSync(legacyDest)) { reflSkipped++; return; }
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
