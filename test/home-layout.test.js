const test = require('node:test');
const assert = require('node:assert');
const HL = require('../home-layout.js');

test('defaultLayout excludes pinned cards', () => {
  const ids = HL.defaultLayout().map(e => e.id);
  assert.ok(!ids.includes('calendar'), 'calendar is pinned and must not be in the layout');
  assert.ok(ids.includes('tasks'));
});

test('normalizeLayout with no saved data returns the default layout', () => {
  assert.deepStrictEqual(HL.normalizeLayout(null), HL.defaultLayout());
  assert.deepStrictEqual(HL.normalizeLayout(undefined), HL.defaultLayout());
  assert.deepStrictEqual(HL.normalizeLayout('garbage'), HL.defaultLayout());
});

test('normalizeLayout preserves saved order and appends unseen cards at the end', () => {
  const out = HL.normalizeLayout([{ id: 'tasks', span: 2 }, { id: 'weather', span: 1 }]);
  assert.strictEqual(out[0].id, 'tasks');
  assert.strictEqual(out[0].span, 2);
  assert.strictEqual(out[1].id, 'weather');
  const rest = out.slice(2).map(e => e.id);
  assert.ok(rest.includes('necessities'), 'a card absent from saved data must be appended');
  assert.strictEqual(out.length, HL.movableCards().length);
});

test('normalizeLayout drops unknown ids and duplicates', () => {
  const out = HL.normalizeLayout([
    { id: 'tasks', span: 1 },
    { id: 'tasks', span: 3 },
    { id: 'no-such-card', span: 1 },
    { id: 'calendar', span: 3 },
  ]);
  assert.strictEqual(out.filter(e => e.id === 'tasks').length, 1, 'duplicate dropped, first wins');
  assert.strictEqual(out[0].span, 1);
  assert.ok(!out.some(e => e.id === 'no-such-card'));
  assert.ok(!out.some(e => e.id === 'calendar'), 'pinned cards never enter the layout');
});

test('clampSpan keeps spans between 1 and 3', () => {
  assert.strictEqual(HL.clampSpan(0), 1);
  assert.strictEqual(HL.clampSpan(-5), 1);
  assert.strictEqual(HL.clampSpan(9), 3);
  assert.strictEqual(HL.clampSpan(2), 2);
  assert.strictEqual(HL.clampSpan('nonsense'), 1);
  assert.strictEqual(HL.clampSpan(null), 1);
});

test('moveCard reorders without mutating the input', () => {
  const before = [{ id: 'a', span: 1 }, { id: 'b', span: 1 }, { id: 'c', span: 1 }];
  const frozen = JSON.stringify(before);
  const after = HL.moveCard(before, 0, 2);
  assert.deepStrictEqual(after.map(e => e.id), ['b', 'c', 'a']);
  assert.strictEqual(JSON.stringify(before), frozen, 'input must not be mutated');
});

test('moveCard clamps out-of-range targets instead of losing the card', () => {
  const l = [{ id: 'a', span: 1 }, { id: 'b', span: 1 }];
  assert.deepStrictEqual(HL.moveCard(l, 0, 99).map(e => e.id), ['b', 'a']);
  assert.deepStrictEqual(HL.moveCard(l, 0, -5).map(e => e.id), ['a', 'b']);
  assert.deepStrictEqual(HL.moveCard(l, 7, 0).map(e => e.id), ['a', 'b'], 'bad source is a no-op');
});

test('setSpan changes one card and clamps the value', () => {
  const l = [{ id: 'a', span: 1 }, { id: 'b', span: 1 }];
  assert.deepStrictEqual(HL.setSpan(l, 'a', 2), [{ id: 'a', span: 2 }, { id: 'b', span: 1 }]);
  assert.strictEqual(HL.setSpan(l, 'a', 99)[0].span, 3);
});
