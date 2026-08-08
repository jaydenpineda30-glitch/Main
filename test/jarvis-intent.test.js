// Stage 3's safety gate, built before the thing that needs it.
//
// Stage 3 is where Jarvis stops describing and starts changing Jayden's data,
// and Athena has no undo. The spec's rules are not negotiable: Jarvis PROPOSES,
// the write happens only after he confirms, every intent is checked against a
// whitelist, and an unrecognised intent is dropped rather than dispatched.
//
// So this module parses and validates. It never writes anything, and it has no
// access to anything that could. Same shape as jarvis-view.js: untrusted input
// in, a known-safe structure or nothing out.

const test = require('node:test');
const assert = require('node:assert');
const JI = require('../jarvis-intent.js');

// The real list from data.js, passed in rather than duplicated — data.js is
// browser globals with no exports, so the browser picks it up from the global
// and tests hand it over explicitly.
const CATS = ['Finances', 'Errands', 'Admin', 'Health', 'Social', 'Study', 'Meal Prep',
  'Car & Transport', 'Home', 'Family', 'Work', 'Self-care', 'Shopping', 'Other'];
const opts = { categories: CATS, today: '2026-08-08' };

const parse = (obj, o) => JI.parseIntent(typeof obj === 'string' ? obj : JSON.stringify(obj), o || opts);

// ── The whitelist ────────────────────────────────────────────────────────────

test('an unrecognised intent is dropped, never passed on', () => {
  ['task.delete', 'data.wipe', 'settings.update', 'eval', '__proto__', 'task.Add', ''].forEach((name) => {
    assert.strictEqual(parse({ intent: name, args: {} }), null, 'let through: ' + name);
  });
});

test('the whitelist is exactly the five intents the spec allows', () => {
  assert.deepStrictEqual(JI.INTENTS.slice().sort(),
    ['project.create', 'task.add', 'task.complete', 'task.reschedule', 'task.setState']);
});

test('nothing usable returns null so the caller falls back to doing nothing', () => {
  ['', '   ', null, '{}', 'I would suggest adding a task', '{"intent":', '{{{'].forEach((raw) => {
    assert.strictEqual(JI.parseIntent(raw, opts), null, 'expected null for ' + JSON.stringify(raw));
  });
});

test('a proposal never carries anything that could execute itself', () => {
  const out = parse({ intent: 'task.add', args: { name: 'Do the thing' } });
  Object.keys(out).forEach((k) => {
    assert.notStrictEqual(typeof out[k], 'function', k + ' is callable');
  });
  assert.ok(!('exec' in out) && !('run' in out) && !('apply' in out),
    'a proposal must not look like something you can run');
});

test('the module exposes no way to write anything', () => {
  Object.keys(JI).forEach((k) => {
    assert.ok(!/write|save|apply|exec|dispatch|commit|set/i.test(k),
      'jarvis-intent must not expose ' + k);
  });
});

// ── Every proposal has to be explainable before it is confirmed ──────────────

test('every valid intent produces a plain-language summary of what will change', () => {
  const cases = [
    { intent: 'task.add', args: { name: 'Email the teachers' } },
    { intent: 'task.complete', args: { ids: [1722308451234] } },
    { intent: 'task.reschedule', args: { ids: [1722308451234], due: '2026-08-15' } },
    { intent: 'task.setState', args: { ids: [1722308451234], state: 'doing' } },
    { intent: 'project.create', args: { title: 'Tax assignment', stages: [{ title: 'Read', steps: [{ title: 'Brief' }] }] } }
  ];
  cases.forEach((c) => {
    const out = parse(c);
    assert.ok(out, c.intent + ' was rejected');
    assert.ok(typeof out.summary === 'string' && out.summary.length > 0, c.intent + ' has no summary');
    assert.ok(!/[<>{}]/.test(out.summary), c.intent + ' summary carries markup: ' + out.summary);
  });
});

// ── task.add ─────────────────────────────────────────────────────────────────

test('a new task is built in the shape brAcceptTask already uses', () => {
  const out = parse({ intent: 'task.add', args: { name: 'Email the teachers', cat: 'Study', priority: 'urgent', due: '2026-08-20' } });
  assert.strictEqual(out.intent, 'task.add');
  assert.strictEqual(out.args.name, 'Email the teachers');
  assert.strictEqual(out.args.cat, 'Study');
  assert.strictEqual(out.args.priority, 'urgent');
  assert.strictEqual(out.args.due, '2026-08-20');
});

test('a task with no name is not a task', () => {
  [{ name: '' }, { name: '   ' }, { name: null }, {}].forEach((args) => {
    assert.strictEqual(parse({ intent: 'task.add', args: args }), null, JSON.stringify(args));
  });
});

test('an unknown category becomes Other rather than being rejected', () => {
  // A wrong category is cosmetic — it picks a colour and a grouping. Rejecting
  // the whole task over it would lose real work for no safety gain.
  const out = parse({ intent: 'task.add', args: { name: 'x', cat: 'Astrology' } });
  assert.strictEqual(out.args.cat, 'Other');
});

test('an unknown priority becomes normal, never something invented', () => {
  const out = parse({ intent: 'task.add', args: { name: 'x', priority: 'CRITICAL' } });
  assert.strictEqual(out.args.priority, 'normal');
});

// ── Dates ────────────────────────────────────────────────────────────────────

test('a due date that is not a real calendar date is refused', () => {
  ['2026-02-31', '2026-13-01', 'next tuesday', '15/08/2026', '2026-8-5', '', 'null'].forEach((due) => {
    const out = parse({ intent: 'task.reschedule', args: { ids: [1], due: due } });
    assert.strictEqual(out, null, 'accepted bad date: ' + JSON.stringify(due));
  });
});

test('a real date survives', () => {
  const out = parse({ intent: 'task.reschedule', args: { ids: [1], due: '2026-08-15' } });
  assert.ok(out);
  assert.strictEqual(out.args.due, '2026-08-15');
});

test('leap years are handled honestly in both directions', () => {
  // Written first with 2026-02-29 as the "valid" case, which the validator
  // rejected — correctly, because 2026 is not a leap year. new Date() would have
  // rolled it silently to 1 March and moved a task to a day nobody picked.
  assert.strictEqual(parse({ intent: 'task.reschedule', args: { ids: [1], due: '2026-02-29' } }), null,
    '2026 is not a leap year');
  assert.ok(parse({ intent: 'task.reschedule', args: { ids: [1], due: '2028-02-29' } }),
    '2028 is a leap year');
});

test('clearing a due date is allowed, because null is a real answer', () => {
  const out = parse({ intent: 'task.reschedule', args: { ids: [1], due: null } });
  assert.ok(out);
  assert.strictEqual(out.args.due, null);
});

// ── task.setState ────────────────────────────────────────────────────────────

test('only the three real task states are accepted', () => {
  ['todo', 'doing', 'waiting'].forEach((state) => {
    assert.ok(parse({ intent: 'task.setState', args: { ids: [1], state: state } }), state + ' rejected');
  });
  ['done', 'DOING', 'blocked', '', null].forEach((state) => {
    assert.strictEqual(parse({ intent: 'task.setState', args: { ids: [1], state: state } }), null,
      'accepted invalid state: ' + JSON.stringify(state));
  });
});

// ── Ids and bulk ─────────────────────────────────────────────────────────────

test('ids must be real task ids, and junk entries are dropped', () => {
  const out = parse({ intent: 'task.complete', args: { ids: [1722308451234, '1722308451235', null, {}, NaN, 'abc'] } });
  assert.deepStrictEqual(out.args.ids, [1722308451234, 1722308451235]);
});

test('an intent with no surviving ids is dropped', () => {
  [{ ids: [] }, { ids: ['abc'] }, { ids: 'everything' }, {}].forEach((args) => {
    assert.strictEqual(parse({ intent: 'task.complete', args: args }), null, JSON.stringify(args));
  });
});

test('a bulk operation is capped, and says so when it caps', () => {
  const many = [];
  for (let i = 0; i < 200; i++) many.push(1722308450000 + i);
  const out = parse({ intent: 'task.complete', args: { ids: many } });
  assert.ok(out.args.ids.length <= JI.BULK_CAP, 'got ' + out.args.ids.length);
  assert.ok(out.truncated === true, 'a capped proposal must admit it was capped');
});

test('the summary states the real count, so a confirm is informed', () => {
  const out = parse({ intent: 'task.reschedule', args: { ids: [1, 2, 3], due: '2026-08-15' } });
  assert.ok(/3/.test(out.summary), 'got: ' + out.summary);
});

// ── project.create ───────────────────────────────────────────────────────────

test('a project keeps its stages and steps', () => {
  const out = parse({ intent: 'project.create', args: {
    title: 'Tax assignment',
    stages: [
      { title: 'Read the brief', steps: [{ title: 'Skim' }, { title: 'Note the marking guide' }] },
      { title: 'Draft', steps: [{ title: 'Outline' }] }
    ]
  } });
  assert.strictEqual(out.args.title, 'Tax assignment');
  assert.strictEqual(out.args.stages.length, 2);
  assert.strictEqual(out.args.stages[0].steps.length, 2);
  assert.strictEqual(out.args.stages[0].steps[0].title, 'Skim');
  assert.strictEqual(out.args.stages[0].steps[0].done, false, 'a new step is never already done');
});

test('a project with no title or no stages is dropped', () => {
  assert.strictEqual(parse({ intent: 'project.create', args: { stages: [{ title: 'x', steps: [] }] } }), null);
  assert.strictEqual(parse({ intent: 'project.create', args: { title: 'x', stages: [] } }), null);
  assert.strictEqual(parse({ intent: 'project.create', args: { title: 'x' } }), null);
});

test('a runaway project is capped rather than rejected', () => {
  const stages = [];
  for (let i = 0; i < 60; i++) {
    const steps = [];
    for (let j = 0; j < 60; j++) steps.push({ title: 'step ' + j });
    stages.push({ title: 'stage ' + i, steps: steps });
  }
  const out = parse({ intent: 'project.create', args: { title: 'Huge', stages: stages } });
  assert.ok(out.args.stages.length <= JI.BULK_CAP);
  assert.ok(out.args.stages[0].steps.length <= JI.BULK_CAP);
  assert.strictEqual(out.truncated, true);
});

// ── Untrusted input hygiene, matching jarvis-view.js ─────────────────────────

test('JSON wrapped in prose and code fences is still read', () => {
  const out = JI.parseIntent(
    'Sure — here you go:\n```json\n{"intent":"task.add","args":{"name":"Email the teachers"}}\n```\nWant me to do it?',
    opts);
  assert.ok(out);
  assert.strictEqual(out.args.name, 'Email the teachers');
});

test('markup in any text field is neutralised', () => {
  const out = parse({ intent: 'task.add', args: { name: 'Careful <script>alert(1)</script> now' } });
  assert.ok(!/[<>]/.test(out.args.name), 'got: ' + out.args.name);
});

test('prototype-polluting keys never reach the proposal', () => {
  const raw = '{"intent":"task.add","args":{"name":"x","__proto__":{"admin":true},"constructor":{"bad":1}}}';
  const out = JI.parseIntent(raw, opts);
  assert.ok(out);
  assert.strictEqual({}.admin, undefined, 'Object.prototype was polluted');
  assert.ok(!Object.prototype.hasOwnProperty.call(out.args, '__proto__'));
});

test('absurdly long text is cut rather than carried', () => {
  const out = parse({ intent: 'task.add', args: { name: 'x'.repeat(5000) } });
  assert.ok(out.args.name.length <= 200, 'got ' + out.args.name.length);
});

test('an id that could never be a real task is not counted in the summary', () => {
  // Found by probing rather than by the tests above. Task ids are Date.now()
  // values — positive integers. A negative or fractional id matches nothing, so
  // the mutator would change nothing while the confirm dialog said "Mark 1 task
  // done". A summary that promises a change that cannot happen is worse than a
  // refusal: he clicks confirm and quietly gets nothing.
  [-1, 1.5, 0, -1722308451234].forEach((bad) => {
    assert.strictEqual(parse({ intent: 'task.complete', args: { ids: [bad] } }), null,
      'accepted impossible id ' + bad);
  });
  const mixed = parse({ intent: 'task.complete', args: { ids: [1722308451234, -1, 1.5] } });
  assert.deepStrictEqual(mixed.args.ids, [1722308451234]);
  assert.ok(/1 task/.test(mixed.summary), 'summary must count only what survives: ' + mixed.summary);
});

// ── Reconciling a proposal against what actually exists ──────────────────────
// parseIntent checks shape. It cannot know which tasks are real, so on its own
// it would let a confirm dialog say "Move 3 tasks" when only one of the three
// ids exists — the same class of bug as the negative-id case above. The spec is
// explicit: bulk operations show exactly what will change, before it changes.
// So the dialog describes reality, not the model's claim.

const DATA = {
  personal: { tasks: [
    { id: 1722308451234, name: 'Chapter review questions', due: '2026-08-05', done: false },
    { id: 1722308451235, name: 'Email the teachers', due: null, done: false },
    { id: 1722308451236, name: 'Already finished', due: null, done: true }
  ] }
};

test('a proposal is resolved to the real tasks it will touch', () => {
  const p = parse({ intent: 'task.reschedule', args: { ids: [1722308451234, 1722308451235], due: '2026-08-15' } });
  const r = JI.resolve(p, DATA);
  assert.deepStrictEqual(r.targets.map((t) => t.name), ['Chapter review questions', 'Email the teachers']);
  assert.deepStrictEqual(r.missing, []);
});

test('ids that match no task are dropped and reported', () => {
  const p = parse({ intent: 'task.complete', args: { ids: [1722308451234, 9999999999999] } });
  const r = JI.resolve(p, DATA);
  assert.strictEqual(r.targets.length, 1);
  assert.deepStrictEqual(r.missing, [9999999999999]);
});

test('the resolved summary counts what will really change, not what was asked', () => {
  const p = parse({ intent: 'task.reschedule', args: { ids: [1722308451234, 9999999999999, 8888888888888], due: '2026-08-15' } });
  assert.ok(/3 tasks/.test(p.summary), 'setup: the unresolved summary claims three');
  const r = JI.resolve(p, DATA);
  assert.ok(!/3 tasks/.test(r.summary), 'the model\'s count must not survive: ' + r.summary);
  assert.ok(/Chapter review questions/.test(r.summary), 'name what really changes: ' + r.summary);
  assert.ok(/2 were not found/.test(r.summary), 'and account for what does not: ' + r.summary);
});

test('the resolved summary names the tasks when there are few enough to name', () => {
  const p = parse({ intent: 'task.complete', args: { ids: [1722308451234] } });
  const r = JI.resolve(p, DATA);
  assert.ok(/Chapter review questions/.test(r.summary), 'got: ' + r.summary);
});

test('a proposal that resolves to nothing is refused outright', () => {
  const p = parse({ intent: 'task.complete', args: { ids: [9999999999999] } });
  const r = JI.resolve(p, DATA);
  assert.strictEqual(r.ok, false, 'nothing to change must not be confirmable');
  assert.ok(/nothing|no longer|could not find/i.test(r.summary), 'got: ' + r.summary);
});

test('completing an already-done task is not counted as a change', () => {
  const p = parse({ intent: 'task.complete', args: { ids: [1722308451236] } });
  const r = JI.resolve(p, DATA);
  assert.strictEqual(r.ok, false, 'it is already done; there is nothing to do');
});

test('setting a task to the state it is already in is not a change', () => {
  const data = { personal: { tasks: [{ id: 1, name: 'x', state: 'doing', done: false }] } };
  const p = parse({ intent: 'task.setState', args: { ids: [1], state: 'doing' } });
  assert.strictEqual(JI.resolve(p, data).ok, false);
});

test('task.add needs no reconciling and stays confirmable', () => {
  const p = parse({ intent: 'task.add', args: { name: 'Save the June 20 shift note' } });
  const r = JI.resolve(p, DATA);
  assert.strictEqual(r.ok, true);
  assert.ok(/Save the June 20 shift note/.test(r.summary));
});

test('project.create needs no reconciling and stays confirmable', () => {
  const p = parse({ intent: 'project.create', args: { title: 'Tax assignment', stages: [{ title: 'Read', steps: [{ title: 'Brief' }] }] } });
  assert.strictEqual(JI.resolve(p, DATA).ok, true);
});

test('resolve tolerates a dashboard with no tasks at all', () => {
  const p = parse({ intent: 'task.complete', args: { ids: [1] } });
  [{}, { personal: {} }, { personal: { tasks: null } }, null].forEach((data) => {
    const r = JI.resolve(p, data);
    assert.strictEqual(r.ok, false, 'expected refusal for ' + JSON.stringify(data));
  });
});

test('resolve never mutates the data it is given', () => {
  const before = JSON.stringify(DATA);
  JI.resolve(parse({ intent: 'task.complete', args: { ids: [1722308451234] } }), DATA);
  assert.strictEqual(JSON.stringify(DATA), before, 'resolve touched the dashboard');
});

test('resolving a null proposal is safe', () => {
  const r = JI.resolve(null, DATA);
  assert.strictEqual(r.ok, false);
});
