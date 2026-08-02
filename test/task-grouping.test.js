const test = require('node:test');
const assert = require('node:assert');
const TG = require('../task-grouping.js');

const TODAY = '2026-08-02';
const t = (over) => Object.assign(
  { id: 1, name: 'x', cat: 'Study', done: false, addedAt: TODAY, editedAt: TODAY, due: null },
  over);

test('done wins over everything', () => {
  assert.strictEqual(TG.groupOf(t({ done: true, due: '2026-01-01' }), TODAY), 'done');
  assert.strictEqual(TG.groupOf(t({ done: true, state: 'waiting' }), TODAY), 'done');
});

test('waiting is matched before overdue so parked work stops nagging', () => {
  assert.strictEqual(TG.groupOf(t({ state: 'waiting', due: '2026-07-01' }), TODAY), 'waiting');
});

test('due date drives overdue and due soon', () => {
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-01' }), TODAY), 'overdue');
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-02' }), TODAY), 'dueSoon', 'due today');
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-04' }), TODAY), 'dueSoon', 'two days out');
  assert.strictEqual(TG.groupOf(t({ due: '2026-08-05' }), TODAY), 'later', 'three days out');
});

test('an overdue in-progress task is grouped as overdue', () => {
  assert.strictEqual(TG.groupOf(t({ state: 'doing', due: '2026-07-30' }), TODAY), 'overdue');
});

test('in progress applies only when no due date pulls it earlier', () => {
  assert.strictEqual(TG.groupOf(t({ state: 'doing', due: null }), TODAY), 'doing');
});

test('untouched needs more than 7 days since the last touch', () => {
  assert.strictEqual(TG.groupOf(t({ due: null, editedAt: '2026-07-25' }), TODAY), 'untouched');
  assert.strictEqual(TG.groupOf(t({ due: null, editedAt: '2026-07-27' }), TODAY), 'later',
    'exactly 7 days is not yet untouched');
});

test('editedAt takes precedence over addedAt', () => {
  assert.strictEqual(
    TG.groupOf(t({ due: null, addedAt: '2026-01-01', editedAt: TODAY }), TODAY), 'later',
    'writing an update must clear the untouched badge');
});

test('groupTasks buckets every task and sorts each bucket by due date', () => {
  const out = TG.groupTasks([
    t({ id: 1, due: '2026-08-01' }),
    t({ id: 2, due: '2026-07-20' }),
    t({ id: 3, done: true }),
  ], TODAY);
  assert.deepStrictEqual(out.overdue.map(x => x.id), [2, 1]);
  assert.deepStrictEqual(out.done.map(x => x.id), [3]);
  assert.deepStrictEqual(out.later, []);
  TG.DISPLAY_ORDER.forEach(g => assert.ok(Array.isArray(out[g]), g + ' bucket must exist'));
});

test('groupTasks tolerates null and undefined input', () => {
  assert.deepStrictEqual(TG.groupTasks(null, TODAY).overdue, []);
  assert.deepStrictEqual(TG.groupTasks(undefined, TODAY).later, []);
});

test('categoryCounts counts open tasks only, biggest first', () => {
  const out = TG.categoryCounts([
    t({ cat: 'Study' }), t({ cat: 'Study' }), t({ cat: 'Admin' }),
    t({ cat: 'Study', done: true }),
    t({ cat: undefined }),
  ]);
  assert.deepStrictEqual(out[0], { cat: 'Study', count: 2 });
  assert.ok(out.some(c => c.cat === 'Other'), 'a missing category falls back to Other');
  assert.ok(!out.some(c => c.count === 0));
});

test('DISPLAY_ORDER puts waiting near the bottom and overdue at the top', () => {
  assert.strictEqual(TG.DISPLAY_ORDER[0], 'overdue');
  assert.ok(TG.DISPLAY_ORDER.indexOf('waiting') > TG.DISPLAY_ORDER.indexOf('later'));
  assert.strictEqual(TG.DISPLAY_ORDER[TG.DISPLAY_ORDER.length - 1], 'done');
});

test('every task category has a colour', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const vm = require('node:vm');
  const src = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8');
  const sandbox = {};
  vm.runInNewContext(src, sandbox);

  assert.ok(Array.isArray(sandbox.TASK_CATS), 'data.js must define TASK_CATS');
  assert.ok(sandbox.TASK_CAT_COLORS, 'data.js must define TASK_CAT_COLORS');
  assert.match(sandbox.TASK_CAT_FALLBACK, /^#[0-9a-fA-F]{6}$/);

  sandbox.TASK_CATS.forEach(c => {
    assert.ok(sandbox.TASK_CAT_COLORS[c], 'missing colour for category: ' + c);
    assert.match(sandbox.TASK_CAT_COLORS[c], /^#[0-9a-fA-F]{6}$/, 'bad colour for ' + c);
  });

  const extra = Object.keys(sandbox.TASK_CAT_COLORS)
    .filter(k => !sandbox.TASK_CATS.includes(k));
  assert.deepStrictEqual(extra, [], 'colours defined for categories that do not exist');
});
