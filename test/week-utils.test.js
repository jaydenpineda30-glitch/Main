const test = require('node:test');
const assert = require('node:assert');
const W = require('../week-utils.js');

// 2026-08-02 is a Sunday; its week began Monday 2026-07-27.
test('weekStartStr returns the Monday of that week', () => {
  assert.strictEqual(W.weekStartStr('2026-08-02'), '2026-07-27', 'Sunday belongs to the week before');
  assert.strictEqual(W.weekStartStr('2026-07-27'), '2026-07-27', 'Monday is its own week start');
  assert.strictEqual(W.weekStartStr('2026-07-31'), '2026-07-27', 'Friday');
  assert.strictEqual(W.weekStartStr('2026-08-03'), '2026-08-03', 'the next Monday starts a new week');
});

test('weekStartStr handles month and year boundaries', () => {
  assert.strictEqual(W.weekStartStr('2026-01-01'), '2025-12-29');
  assert.strictEqual(W.weekStartStr('2026-03-01'), '2026-02-23');
});

test('isDoneThisWeek is true only within the same Monday-based week', () => {
  assert.strictEqual(W.isDoneThisWeek('2026-07-30', '2026-08-02'), true, 'same week');
  assert.strictEqual(W.isDoneThisWeek('2026-07-27', '2026-08-02'), true, 'the Monday itself');
  assert.strictEqual(W.isDoneThisWeek('2026-07-26', '2026-08-02'), false, 'previous week');
  assert.strictEqual(W.isDoneThisWeek('2026-08-02', '2026-08-03'), false,
    'a Sunday tick does not carry into Monday — this is the auto-reset');
});

test('isDoneThisWeek treats missing ticks as not done', () => {
  assert.strictEqual(W.isDoneThisWeek(null, '2026-08-02'), false);
  assert.strictEqual(W.isDoneThisWeek(undefined, '2026-08-02'), false);
  assert.strictEqual(W.isDoneThisWeek('', '2026-08-02'), false);
});

test('a tick survives a fortnight of not opening the app, then resets', () => {
  assert.strictEqual(W.isDoneThisWeek('2026-07-30', '2026-08-01'), true);
  assert.strictEqual(W.isDoneThisWeek('2026-07-30', '2026-08-14'), false,
    'no background job needed — staleness is derived, not stored');
});

test('weekElapsedFraction runs from 1/7 on Monday to 1 on Sunday', () => {
  assert.ok(Math.abs(W.weekElapsedFraction('2026-07-27') - 1 / 7) < 1e-9);
  assert.ok(Math.abs(W.weekElapsedFraction('2026-08-02') - 1) < 1e-9);
});

test('localDateStr never shifts a day via UTC', () => {
  assert.strictEqual(W.localDateStr(new Date(2026, 7, 2, 23, 30)), '2026-08-02');
  assert.strictEqual(W.localDateStr(new Date(2026, 0, 1, 0, 15)), '2026-01-01');
});
