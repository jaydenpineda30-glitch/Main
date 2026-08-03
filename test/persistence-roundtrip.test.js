// Does everything this branch added actually survive a save and a reload?
//
// The app writes the WHOLE dashData document on every change (app.jsx: DASH_DOC.set),
// and rebuilds state on load with mergeWithDefaults(). So the real risk is not the
// write — it is mergeWithDefaults quietly dropping a key it does not know about, which
// would look exactly like "I ticked it and it came back untouched".
//
// This test loads the real INIT/stripUndefined/mergeWithDefaults out of app.jsx (no
// copies — the source is read at test time) and round-trips a document.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const ctx = vm.createContext({ console, Date, Math, JSON });

// data.js supplies the seed constants app.jsx's INIT refers to.
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'), ctx);

// Pull just the persistence helpers out of app.jsx. Anchored on the real declarations,
// so if any of them is renamed or moved this test fails loudly instead of silently
// testing nothing.
const src = fs.readFileSync(path.join(ROOT, 'app.jsx'), 'utf8');
function slice(startMarker, endMarker) {
  const a = src.indexOf(startMarker);
  const b = src.indexOf(endMarker, a);
  assert.ok(a >= 0, 'could not find ' + startMarker + ' in app.jsx');
  assert.ok(b > a, 'could not find ' + endMarker + ' in app.jsx');
  return src.slice(a, b);
}
vm.runInContext(slice('const INIT={', 'function stripUndefined'), ctx);
vm.runInContext(slice('function stripUndefined', 'function isLikelySeedState'), ctx);
// mergeWithDefaults reaches for this one constant, declared further down app.jsx.
vm.runInContext(slice('const SEED_REFL=', '\n'), ctx);

function roundTrip(doc) {
  ctx.__doc = doc;
  return vm.runInContext('mergeWithDefaults(JSON.parse(JSON.stringify(stripUndefined(__doc))))', ctx);
}

test('a saved home layout comes back intact', () => {
  const out = roundTrip({ homeLayout: [{ id: 'tasks', span: 2 }, { id: 'weather', span: 1 }] });
  assert.deepStrictEqual(out.homeLayout, [{ id: 'tasks', span: 2 }, { id: 'weather', span: 1 }]);
});

test('weekly necessities and their ticks come back intact', () => {
  const out = roundTrip({
    personal: { necessities: { items: [{ id: 1, name: 'Laundry' }], ticks: { 1: '2026-08-03' } } }
  });
  assert.deepStrictEqual(out.personal.necessities.items, [{ id: 1, name: 'Laundry' }]);
  assert.strictEqual(out.personal.necessities.ticks['1'], '2026-08-03',
    'a tick is the only record that a necessity was done this week');
});

test("a task's state and update log come back intact", () => {
  const out = roundTrip({
    personal: {
      tasks: [{
        id: 't1', name: 'Assignment', cat: 'Study', state: 'waiting',
        updates: [{ id: 'u1', at: '2026-08-03', text: 'waiting on marks' }]
      }]
    }
  });
  const t = out.personal.tasks[0];
  assert.strictEqual(t.state, 'waiting');
  assert.deepStrictEqual(t.updates, [{ id: 'u1', at: '2026-08-03', text: 'waiting on marks' }]);
});

test('a completed task keeps the date the calendar draws it on', () => {
  const out = roundTrip({
    personal: {
      tasks: [{ id: 't1', name: 'Gym', done: true, completedAt: '2026-08-03', completedTime: '18:30' }]
    }
  });
  assert.strictEqual(out.personal.tasks[0].completedAt, '2026-08-03');
  assert.strictEqual(out.personal.tasks[0].completedTime, '18:30');
});

test('archived completions survive, so the calendar keeps its history', () => {
  const out = roundTrip({
    personal: {
      tasks: [],
      archived: [{ id: 'a1', name: 'Old task', done: true, completedAt: '2026-07-20', cat: 'Admin' }]
    }
  });
  assert.strictEqual(out.personal.archived.length, 1,
    'Archive done moves tasks here — if this drops, calendar history empties itself');
  assert.strictEqual(out.personal.archived[0].completedAt, '2026-07-20');
});

test('everything survives together, and nothing overwrites anything else', () => {
  const out = roundTrip({
    homeLayout: [{ id: 'tasks', span: 3 }],
    personal: {
      necessities: { items: [{ id: 9, name: 'Meal prep' }], ticks: { 9: '2026-08-03' } },
      tasks: [{ id: 't1', name: 'Essay', state: 'doing', updates: [{ id: 'u1', at: '2026-08-03', text: 'half done' }] }],
      archived: [{ id: 'a1', done: true, completedAt: '2026-07-20' }]
    }
  });
  assert.strictEqual(out.homeLayout[0].span, 3);
  assert.strictEqual(out.personal.necessities.ticks['9'], '2026-08-03');
  assert.strictEqual(out.personal.tasks[0].state, 'doing');
  assert.strictEqual(out.personal.tasks[0].updates.length, 1);
  assert.strictEqual(out.personal.archived[0].completedAt, '2026-07-20');
});

test('an old document with none of these fields still loads', () => {
  const out = roundTrip({ personal: { tasks: [{ id: 't1', name: 'Plain old task' }] } });
  assert.strictEqual(out.personal.tasks[0].name, 'Plain old task');
  assert.strictEqual(out.personal.tasks[0].state, undefined, 'absent state is fine — it defaults to todo at read time');
  assert.ok(Array.isArray(out.personal.archived), 'archived is always an array');
});
