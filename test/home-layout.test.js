const test = require('node:test');
const assert = require('node:assert');
const HL = require('../home-layout.js');

test('defaultLayout excludes pinned cards', () => {
  const ids = HL.defaultLayout().map(e => e.id);
  assert.ok(!ids.includes('calendar'), 'calendar is pinned and must not be in the layout');
  assert.ok(!ids.includes('jarvis'), 'jarvis is pinned and must not be in the layout');
  assert.ok(!ids.includes('checkin'), 'the Daily Check-in card was retired, replaced by Jarvis');
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

test('a saved layout from before Jarvis loses the check-in card and keeps the rest', () => {
  // The real upgrade path: layouts already in Firestore list 'checkin'. The card
  // is gone, so it must drop out without disturbing the arrangement around it.
  const out = HL.normalizeLayout([
    { id: 'tasks', span: 2 },
    { id: 'checkin', span: 1 },
    { id: 'goals', span: 1 },
  ]);
  assert.ok(!out.some(e => e.id === 'checkin'), 'retired card must not survive');
  assert.strictEqual(out[0].id, 'tasks', 'order before the retired card is preserved');
  assert.strictEqual(out[0].span, 2, 'spans are preserved');
  assert.strictEqual(out[1].id, 'goals', 'the card after it closes the gap');
  assert.strictEqual(out.length, HL.movableCards().length, 'still a complete layout');
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

test('normalizeLayout clamps out-of-range spans from saved data', () => {
  const out = HL.normalizeLayout([
    { id: 'tasks', span: 99 },
    { id: 'weather', span: 0 },
    { id: 'goals', span: -4 },
    { id: 'shopping', span: 'nonsense' },
  ]);
  const spanOf = (id) => out.find(e => e.id === id).span;
  assert.strictEqual(spanOf('tasks'), 3);
  assert.strictEqual(spanOf('weather'), 1);
  assert.strictEqual(spanOf('goals'), 1);
  assert.strictEqual(spanOf('shopping'), 1);
  out.forEach(e => {
    assert.ok(e.span >= 1 && e.span <= 3, e.id + ' span out of range: ' + e.span);
  });
});

test('normalizeLayout does not mutate its input', () => {
  const saved = [{ id: 'tasks', span: 99 }, { id: 'weather', span: 2 }];
  const frozen = JSON.stringify(saved);
  HL.normalizeLayout(saved);
  assert.strictEqual(JSON.stringify(saved), frozen,
    'normalizeLayout must not modify the array or the objects inside it');
});
