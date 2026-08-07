const test = require('node:test');
const assert = require('node:assert');
const JV = require('../jarvis-view.js');

// ── The trust boundary ───────────────────────────────────────────────────────
// Everything here is model output, which means it is untrusted input that
// happens to be fluent. The rule is that Athena renders its own components and
// never anything the model composed, so this module's only job is to reduce
// arbitrary text to a known shape or to nothing at all.
//
// Degrading is not failure. A missing key, a refusal, a truncated stream and a
// hallucinated view name must all end somewhere sensible, because Jarvis going
// blank is the one outcome the whole design exists to avoid.

test('a clean reply survives intact', () => {
  const out = JV.parseViewSpec(JSON.stringify({
    say: 'The SPREADSHEETS assessment is the one that matters today.',
    show: { view: 'task-list', ids: [1722308451234] },
    cta: { label: 'Open Uni', page: 'Uni' }
  }));
  assert.strictEqual(out.say, 'The SPREADSHEETS assessment is the one that matters today.');
  assert.strictEqual(out.show.view, 'task-list');
  assert.deepStrictEqual(out.show.ids, [1722308451234]);
  assert.deepStrictEqual(out.cta, { label: 'Open Uni', page: 'Uni' });
});

test('JSON wrapped in prose and code fences is still read', () => {
  // Every model does this eventually, whatever the response format asks for.
  const out = JV.parseViewSpec(
    'Sure! Here is the view:\n```json\n{"say":"Two are overdue.","show":{"view":"task-list"}}\n```\nHope that helps.'
  );
  assert.strictEqual(out.say, 'Two are overdue.');
  assert.strictEqual(out.show.view, 'task-list');
});

test('an unknown view is dropped but the sentence is kept', () => {
  const out = JV.parseViewSpec('{"say":"Here is your budget.","show":{"view":"pie-chart"}}');
  assert.strictEqual(out.say, 'Here is your budget.');
  assert.strictEqual(out.show, null, 'Athena cannot render what nobody wired up');
});

test('a cta pointing at a page that does not exist is dropped', () => {
  const out = JV.parseViewSpec('{"say":"Done.","cta":{"label":"Go","page":"Astrology"}}');
  assert.strictEqual(out.say, 'Done.');
  assert.strictEqual(out.cta, null);
});

test('plain prose with no JSON at all degrades to the sentence', () => {
  const out = JV.parseViewSpec("I'm sorry, I can't help with that request.");
  assert.strictEqual(out.say, "I'm sorry, I can't help with that request.");
  assert.strictEqual(out.show, null);
  assert.strictEqual(out.cta, null);
});

test('a truncated stream recovers the sentence without leaking JSON at Jayden', () => {
  // Caught by reading the output rather than the assertion: the first version
  // passed a length check while putting `{"say":"Your bills are` on screen.
  const out = JV.parseViewSpec('{"say":"Your bills are covered","show":{"view":"mon');
  assert.ok(out, 'a cut-off stream must not produce null when a sentence survives');
  assert.strictEqual(out.say, 'Your bills are covered');
  assert.strictEqual(out.show, null, 'the truncated view name is not a real view');
});

test('a truncated stream with no recoverable sentence returns null, not fragments', () => {
  ['{"say', '{"show":{"view":"mon', '{"say":"'].forEach((fragment) => {
    const out = JV.parseViewSpec(fragment);
    assert.strictEqual(out, null, 'expected null for fragment ' + JSON.stringify(fragment));
  });
});

test('no reply can put raw JSON syntax in front of Jayden', () => {
  const junk = [
    '{"say":"half a sen',
    '{"say":"a","show":{"view":',
    '{{{',
    '{"say":}'
  ];
  junk.forEach((raw) => {
    const out = JV.parseViewSpec(raw);
    if (out) {
      assert.ok(!/[{}]|"say"/.test(out.say),
        'JSON leaked into the visible sentence for ' + JSON.stringify(raw) + ': ' + out.say);
    }
  });
});

test('nothing usable returns null so the caller can fall back to the rules', () => {
  assert.strictEqual(JV.parseViewSpec(''), null);
  assert.strictEqual(JV.parseViewSpec('   '), null);
  assert.strictEqual(JV.parseViewSpec(null), null);
  assert.strictEqual(JV.parseViewSpec('{}'), null);
  assert.strictEqual(JV.parseViewSpec('{"show":{"view":"money"}}'), null,
    'a view with nothing said is not worth rendering');
});

test('ids are coerced to a clean list and junk entries are dropped', () => {
  const out = JV.parseViewSpec(JSON.stringify({
    say: 'These three.',
    show: { view: 'task-list', ids: [1, '2', null, {}, 'abc', 4] }
  }));
  assert.deepStrictEqual(out.show.ids, [1, '2', 'abc', 4]);
});

test('a non-array ids field does not crash the view', () => {
  const out = JV.parseViewSpec('{"say":"Here.","show":{"view":"money","ids":"everything"}}');
  assert.strictEqual(out.show.view, 'money');
  assert.deepStrictEqual(out.show.ids, []);
});

test('say is capped so a runaway response cannot flood the card', () => {
  const long = 'x'.repeat(2000);
  const out = JV.parseViewSpec(JSON.stringify({ say: long }));
  assert.ok(out.say.length <= 400, 'got ' + out.say.length + ' characters');
});

test('markup in say is neutralised, because it is rendered as text', () => {
  const out = JV.parseViewSpec(JSON.stringify({ say: 'Careful <script>alert(1)</script> now' }));
  assert.ok(!/[<>]/.test(out.say), 'angle brackets should not survive: ' + out.say);
});

test('the known views are exactly the four stage 2 ships', () => {
  assert.deepStrictEqual(JV.VIEWS.slice().sort(),
    ['money', 'next-step', 'task-list', 'week']);
});
