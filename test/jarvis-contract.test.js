// The seam between the two halves of Jarvis.
//
// `jarvis-signals.js` decides WHAT matters and tags each candidate with the view
// that would illustrate it. `jarvis-view.js` is the trust boundary that decides
// what a model is allowed to put on screen. They have to speak the same
// vocabulary, and until this file existed nothing checked that they did — each
// module was tested alone, and they had already drifted:
//
//   signals emitted:  money, uni, tasks, gym, week, none
//   view whitelisted: next-step, task-list, money, week
//
// Only two names overlapped. A model asked to show the uni view would have had
// its answer silently dropped, and `next-step` / `task-list` named nothing that
// existed. This file fails the moment they disagree again.

const test = require('node:test');
const assert = require('node:assert');
const JS = require('../jarvis-signals.js');
const JV = require('../jarvis-view.js');

const TODAY = '2026-08-07';

// Contexts chosen to make every source in jarvis-signals.js fire at least once
// across the set, so the sweep below sees every view name the module can emit.
const CONTEXTS = [
  { label: 'empty dashboard', ctx: { data: {}, gcalEvents: [], today: TODAY } },
  {
    label: 'overdue uni, overdue tasks, shortfall, pile-up, idle gym',
    ctx: {
      data: {
        uni: { assessments: [
          { id: 'o', subject: 'Spreadsheets', name: 'AT1', date: '2026-07-20', done: false },
          { id: 'n', subject: 'FinStmts', name: 'A1', date: '2026-08-08', done: false },
          { id: 'c1', subject: 'Tax', name: 'A1', date: '2026-08-16', done: false },
          { id: 'c2', subject: 'WIA', name: 'A1', date: '2026-08-16', done: false },
          { id: 'c3', subject: 'AIS', name: 'A1', date: '2026-08-17', done: false }
        ] },
        personal: { tasks: [
          { id: 1, name: 'overdue thing', due: '2026-08-01', done: false, addedAt: TODAY, editedAt: TODAY },
          { id: 2, name: 'undated thing', due: null, done: false, addedAt: TODAY, editedAt: TODAY }
        ] },
        gym: { workouts: [{ date: '2026-06-01' }], rotation: [{ name: 'Legs' }], rotIdx: 0 }
      },
      gcalEvents: [{ id: 'e', title: 'Shift', date: TODAY, time: '16:00', allDay: false }],
      today: TODAY,
      money: { income: 1251, bills: 227, oneOffs: 0, savings: 1226, disposable: -202 }
    }
  },
  {
    label: 'calm day, healthy money',
    ctx: {
      data: {
        uni: { assessments: [{ id: 'f', subject: 'Ethics', name: 'A2', date: '2026-12-01', done: false }] },
        personal: { tasks: [{ id: 3, name: 'undated', due: null, done: false, addedAt: TODAY, editedAt: TODAY }] },
        gym: { workouts: [{ date: '2026-08-06' }] }
      },
      gcalEvents: [], today: TODAY,
      money: { income: 2000, bills: 200, oneOffs: 0, savings: 100, disposable: 1700 }
    }
  }
];

function sweep() {
  const seen = [];
  CONTEXTS.forEach((c) => {
    JS.rank(c.ctx).forEach((cand) => seen.push({ label: c.label, cand: cand }));
  });
  return seen;
}

test('every view a candidate asks for is one the view layer allows', () => {
  const offenders = sweep()
    .filter((s) => s.cand.view != null && JV.VIEWS.indexOf(s.cand.view) === -1)
    .map((s) => s.cand.id + ' wants view "' + s.cand.view + '" (' + s.label + ')');
  assert.deepStrictEqual(offenders, [],
    'views emitted but not whitelisted:\n  ' + offenders.join('\n  ') +
    '\nwhitelist is: ' + JV.VIEWS.join(', '));
});

test('every page a candidate links to is one the view layer allows', () => {
  const offenders = sweep()
    .filter((s) => s.cand.cta && JV.PAGES.indexOf(s.cand.cta.page) === -1)
    .map((s) => s.cand.id + ' links to page "' + s.cand.cta.page + '" (' + s.label + ')');
  assert.deepStrictEqual(offenders, [], 'pages linked but not whitelisted:\n  ' + offenders.join('\n  '));
});

test('the whitelist contains no view no candidate can ever ask for', () => {
  // A whitelisted name nothing emits is a name that means nothing — it was how
  // `next-step` and `task-list` survived. Dead vocabulary invites a model to use
  // it, and then the click does nothing.
  const emitted = {};
  sweep().forEach((s) => { if (s.cand.view != null) emitted[s.cand.view] = true; });
  const orphans = JV.VIEWS.filter((v) => !emitted[v]);
  assert.deepStrictEqual(orphans, [],
    'whitelisted but unreachable: ' + orphans.join(', '));
});

test('a view spec naming a real candidate view survives the trust boundary', () => {
  // The end-to-end shape: the ranker picks a view, a model echoes it back, and
  // the boundary must let it through rather than silently dropping it.
  JV.VIEWS.forEach((view) => {
    const out = JV.parseViewSpec(JSON.stringify({
      say: 'Here is the thing.', show: { view: view, ids: [] }
    }));
    assert.ok(out, 'parseViewSpec returned null for view ' + view);
    assert.ok(out.show, 'view "' + view + '" was dropped by the boundary');
    assert.strictEqual(out.show.view, view);
  });
});
