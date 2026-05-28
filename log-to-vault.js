/**
 * log-to-vault.js
 * Writes a ticket directly to the Obsidian vault as a markdown file.
 * No Firestore, no dashboard — vault-only.
 *
 * Usage:
 *   node log-to-vault.js \
 *     --title "Printer Offline" \
 *     --venue "98 Lygon St" \
 *     --operator "Luke Christensen" \
 *     --status "resolved" \
 *     --category "hardware" \
 *     --content "..." \
 *     --tags "printer,hardware" \
 *     [--date "2026-05-28"]
 *
 * Writes to: <VAULT>/Dashboard/Tickets/YYYY-MM-DD Title.md
 * Defaults date to today (Australia/Melbourne).
 */

const fs   = require('fs');
const path = require('path');

const VAULT = process.env.VAULT_PATH
  || 'C:\\Users\\Jayde\\OneDrive\\Documents\\Obsidian Vault';
const TICKETS_DIR = path.join(VAULT, 'Dashboard', 'Tickets');

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
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
}

function safeFilename(s) {
  return (s || 'Untitled').replace(/[\\/:*?"<>|]/g, '-').slice(0, 80).trim();
}

// ── Main ───────────────────────────────────────────────────────────────────────

var args = parseArgs(process.argv);

if (!args.title) {
  console.error('Error: --title is required');
  process.exit(1);
}

var date = args.date && /^\d{4}-\d{2}-\d{2}/.test(args.date) ? args.date.slice(0, 10) : todayMelbourne();

var tags = [];
if (args.tags) {
  tags = String(args.tags).split(',').map(function(s) { return s.trim(); }).filter(Boolean);
}
if (args.category) tags.push(args.category);
if (args.status)   tags.push(args.status);
tags.push('ticket');

// Dedupe + normalize
var seen = {};
tags = tags
  .filter(function(x) { return !!x; })
  .map(function(t) { return String(t).trim().toLowerCase().replace(/\s+/g, '-'); })
  .filter(function(t) { if (seen[t]) return false; seen[t] = true; return true; });

var title = args.title;
var lines = [];
lines.push('---');
lines.push('type: ticket');
lines.push('title: ' + title.replace(/"/g, "'"));
lines.push('date: ' + date);
if (args.venue)    lines.push('venue: ' + String(args.venue).replace(/"/g, "'"));
if (args.operator) lines.push('operator: ' + String(args.operator).replace(/"/g, "'"));
if (args.status)   lines.push('status: ' + args.status);
if (args.category) lines.push('category: ' + args.category);
lines.push('tags: [' + tags.join(', ') + ']');
lines.push('source: log-skill');
lines.push('---');
lines.push('');
lines.push('# ' + title);
lines.push('');
if (args.content) lines.push(args.content);

if (!fs.existsSync(TICKETS_DIR)) fs.mkdirSync(TICKETS_DIR, { recursive: true });

var filename = date + ' ' + safeFilename(title) + '.md';
var dest     = path.join(TICKETS_DIR, filename);

if (fs.existsSync(dest) && !args.overwrite) {
  console.error('Refusing to overwrite existing file (pass --overwrite to force):');
  console.error('  ' + dest);
  process.exit(2);
}

fs.writeFileSync(dest, lines.join('\n'), 'utf8');
console.log('+ Wrote: ' + dest);
console.log('  title:    ' + title);
console.log('  date:     ' + date);
console.log('  venue:    ' + (args.venue || '(none)'));
console.log('  operator: ' + (args.operator || '(none)'));
console.log('  status:   ' + (args.status || '(none)'));
console.log('  category: ' + (args.category || '(none)'));
console.log('  tags:     [' + tags.join(', ') + ']');
