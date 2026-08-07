const test = require('node:test');
const assert = require('node:assert');
const JS = require('../jarvis-signals.js');

const TODAY = '2026-08-07';               // a Friday

// A dashboard with nothing in it at all. Every test builds up from here so that
// "absent" is the default and any field a source reads has to be tolerated missing.
const EMPTY = {};

function ctx(over) {
  return Object.assign({ data: EMPTY, gcalEvents: [], today: TODAY }, over);
}

// Shorthand builders
const task = (over) => Object.assign(
  { id: 1, name: 'a task', cat: 'Study', done: false, addedAt: TODAY, editedAt: TODAY, due: null },
  over);
const assess = (over) => Object.assign(
  { id: 'a1', name: 'AT2', subject: 'Payroll', done: false, date: TODAY }, over);
const ev = (over) => Object.assign(
  { id: 'e1', title: 'Something', date: TODAY, time: '09:00', allDay: false }, over);

const ids = (cands) => cands.map((c) => c.id);
const byId = (cands, id) => cands.filter((c) => c.id === id)[0];

// ── The floor rule ───────────────────────────────────────────────────────────
// This is the invariant that separates Jarvis from the July prototype, which
// rendered nothing whenever everything was fine. Silence is a failure state.

test('rank never returns an empty list, even with a completely empty dashboard', () => {
  const out = JS.rank(ctx());
  assert.ok(out.length > 0, 'expected at least one candidate from an empty dashboard');
});

test('an empty dashboard produces the all-clear candidate, not a fabricated problem', () => {
  const out = JS.rank(ctx());
  assert.strictEqual(out[0].domain, 'allClear');
  assert.ok(out[0].score < JS.BANDS.decaying, 'all-clear must not score as if it were work');
});

test('a calm day still produces a get-ahead suggestion rather than silence', () => {
  // Nothing overdue, nothing due soon, one assessment comfortably far off.
  const out = JS.rank(ctx({
    data: { uni: { assessments: [assess({ date: '2026-09-30' })] } }
  }));
  assert.ok(out.length > 0);
  assert.strictEqual(out[0].domain, 'uni');
  assert.strictEqual(out[0].band, 'getAhead');
  assert.ok(/get ahead|ahead of/i.test(out[0].headline + ' ' + out[0].why),
    'a calm-day suggestion should read as getting ahead, got: ' + out[0].headline);
});

test('the all-clear only appears when nothing else has anything to say', () => {
  const out = JS.rank(ctx({
    data: { personal: { tasks: [task({ due: '2026-08-01' })] } }
  }));
  assert.ok(!ids(out).some((id) => id.startsWith('allClear')),
    'all-clear should be suppressed when a real candidate exists');
});

// ── Get-ahead suggestions are floor-only ─────────────────────────────────────
// Caught by running the ranker over a real dashboard backup: on a day with two
// failing-band items, Jarvis still offered "Nothing is due — good time for X".
// A suggestion that assumes it is the lead is simply false as a runner-up.

test('get-ahead suggestions vanish once something real is happening', () => {
  const busy = {
    personal: { tasks: [
      task({ id: 1, due: '2026-07-01' }),          // badly overdue
      task({ id: 2, due: null, name: 'undated' })  // would be a get-ahead pick
    ] },
    uni: { assessments: [assess({ date: '2027-06-01' })] }   // far off
  };
  const out = JS.rank(ctx({ data: busy }));
  assert.ok(!out.some((c) => c.floorOnly),
    'floor-only candidates surfaced alongside real work: ' +
    out.filter((c) => c.floorOnly).map((c) => c.headline).join(' / '));
  assert.strictEqual(out[0].id, 'tasks.attention');
});

test('the same get-ahead suggestions appear when nothing is happening', () => {
  const calm = {
    personal: { tasks: [task({ due: null, name: 'undated' })] },
    uni: { assessments: [assess({ date: '2027-06-01' })] }
  };
  const out = JS.rank(ctx({ data: calm }));
  assert.ok(out.some((c) => c.floorOnly), 'a calm day must still offer something');
});

test('no candidate claims nothing is wrong while something is', () => {
  // Any text asserting calm has to be suppressed when a real signal outranks it.
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ due: '2026-07-01' })] },
      gym: { workouts: [{ date: '2026-06-01' }] }
    }
  }));
  const claimsCalm = /nothing is on fire|nothing is due|nothing pressing|free day/i;
  out.slice(1).forEach((c) => {
    assert.ok(!claimsCalm.test(c.headline + ' ' + c.why),
      c.id + ' claims all-clear while "' + out[0].headline + '" outranks it: ' + c.why);
  });
});

// ── Ranking across domains ───────────────────────────────────────────────────
// The whole point of Jarvis: comparing money vs uni vs tasks, which no single
// card in Athena can do.

test('an assessment due in two days outranks a task due in five', () => {
  const out = JS.rank(ctx({
    data: {
      uni: { assessments: [assess({ date: '2026-08-09' })] },
      personal: { tasks: [task({ due: '2026-08-12' })] }
    }
  }));
  assert.strictEqual(out[0].domain, 'uni');
});

test('not being able to cover bills outranks everything else', () => {
  const out = JS.rank(ctx({
    data: {
      uni: { assessments: [assess({ date: '2026-08-08' })] },   // due tomorrow
      personal: { tasks: [task({ due: '2026-07-01' })] }        // long overdue
    },
    money: { income: 700, bills: 900, oneOffs: 0, savings: 0, disposable: -200 }
  }));
  assert.strictEqual(out[0].domain, 'finance');
  assert.strictEqual(out[0].band, 'failing');
});

// ── Money: disposable, not bills coverage ────────────────────────────────────
// Jayden's real August 2026: $1,251 income, $227 bills — a $1,024 surplus, and
// a disposable of MINUS $202 once one-offs and his savings goal are counted.
// A signal built on bills coverage would have congratulated him while he was
// $202 short. Disposable is the number the Finance tab already shows him, so
// Jarvis and that tab cannot disagree.
//
// app.jsx computes all of this and hands it in. This module never recomputes
// money — that is how the two are kept from drifting.

// Read off his Finance tab, 2026-08-07. Expenses showed "4 fixed · 0 variable",
// so one-offs are genuinely nil and the savings commitment is what consumes the
// $1,024 surplus: 1251 − 227 − 0 − 1226 = −202.
const AUGUST = { income: 1251, bills: 227, oneOffs: 0, savings: 1226, disposable: -202 };

test('a negative disposable outranks everything else', () => {
  const out = JS.rank(ctx({
    data: {
      uni: { assessments: [assess({ date: '2026-08-08' })] },   // due tomorrow
      personal: { tasks: [task({ due: '2026-07-01' })] }        // long overdue
    },
    money: AUGUST
  }));
  assert.strictEqual(out[0].domain, 'finance');
  assert.strictEqual(out[0].band, 'failing');
  assert.ok(/202/.test(out[0].headline), 'the shortfall should name the amount: ' + out[0].headline);
});

test('a surplus on paper does not count as covered when disposable is negative', () => {
  // The exact trap: income far exceeds bills, so "bills covered" reads as fine.
  const out = JS.rank(ctx({ money: AUGUST }));
  assert.strictEqual(out[0].band, 'failing');
  assert.ok(!/covered|spare/i.test(out[0].headline + ' ' + out[0].why),
    'must not describe a negative disposable as covered: ' + out[0].headline);
});

test('a thin disposable warns without claiming a shortfall', () => {
  const out = JS.rank(ctx({
    money: { income: 1251, bills: 227, oneOffs: 900, savings: 100, disposable: 24 }
  }));
  assert.strictEqual(out[0].domain, 'finance');
  assert.strictEqual(out[0].band, 'approaching');
  assert.ok(!/short/i.test(out[0].headline), 'nothing is short yet: ' + out[0].headline);
});

test('a healthy disposable is floor-only, so it never crowds real work', () => {
  const healthy = { income: 1251, bills: 227, oneOffs: 100, savings: 0, disposable: 924 };
  const alone = JS.rank(ctx({ money: healthy }));
  assert.strictEqual(alone[0].domain, 'finance');
  assert.ok(alone[0].floorOnly, 'a comfortable month is a floor-only observation');

  const busy = JS.rank(ctx({
    data: { personal: { tasks: [task({ due: '2026-07-01' })] } },
    money: healthy
  }));
  assert.ok(!busy.some((c) => c.domain === 'finance'),
    'a comfortable month should not appear beside overdue work');
});

test('finance stays silent when the dashboard has no income configured', () => {
  const out = JS.rank(ctx({ money: { income: 0, bills: 0, oneOffs: 0, savings: 0, disposable: 0 } }));
  assert.ok(!out.some((c) => c.domain === 'finance'),
    'an unconfigured finance tab must not produce a money signal');
});

test('the shortfall says what is eating the surplus, not just that it is gone', () => {
  const out = JS.rank(ctx({ money: AUGUST }));
  const text = out[0].why;
  assert.ok(/227/.test(text), 'should name the bills figure: ' + text);
  assert.ok(/1,?226/.test(text), 'should name the savings commitment: ' + text);
  assert.ok(!/one-off/.test(text),
    'must not cite a $0 one-offs figure — only name what is actually there: ' + text);
});

test('results are sorted by score, highest first', () => {
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ due: '2026-07-25' }), task({ id: 2, due: '2026-08-20' })] },
      uni: { assessments: [assess({ date: '2026-08-25' })] },
      gym: { workouts: [{ date: '2026-07-20' }] }
    }
  }));
  for (let i = 1; i < out.length; i++) {
    assert.ok(out[i - 1].score >= out[i].score,
      'candidate ' + i + ' (' + out[i].score + ') outscored its predecessor (' + out[i - 1].score + ')');
  }
});

// ── Score bands ──────────────────────────────────────────────────────────────

test('three or more overdue tasks is a failing-band signal', () => {
  const out = JS.rank(ctx({
    data: { personal: { tasks: [
      task({ id: 1, due: '2026-08-05' }),
      task({ id: 2, due: '2026-08-04' }),
      task({ id: 3, due: '2026-08-03' })
    ] } }
  }));
  const t = byId(out, 'tasks.attention');
  assert.strictEqual(t.band, 'failing');
  assert.ok(t.score >= JS.BANDS.failing);
});

test('a single task overdue by one day is not treated as a crisis', () => {
  const out = JS.rank(ctx({
    data: { personal: { tasks: [task({ due: '2026-08-06' })] } }
  }));
  const t = byId(out, 'tasks.attention');
  assert.notStrictEqual(t.band, 'failing');
  assert.strictEqual(t.band, 'deadline');
});

test('gym idleness is a decaying signal, never an emergency', () => {
  const out = JS.rank(ctx({
    data: { gym: { workouts: [{ date: '2026-07-01' }] } }   // 37 days ago
  }));
  const g = byId(out, 'gym.idle');
  assert.strictEqual(g.band, 'decaying');
  assert.ok(g.score < JS.BANDS.approaching,
    'a long gym gap must not outrank real deadlines');
});

test('an assessment already overdue scores above one merely due soon', () => {
  const late = JS.rank(ctx({ data: { uni: { assessments: [assess({ date: '2026-08-01' })] } } }));
  const soon = JS.rank(ctx({ data: { uni: { assessments: [assess({ date: '2026-08-09' })] } } }));
  assert.ok(byId(late, 'uni.assessments').score > byId(soon, 'uni.assessments').score);
});

// ── Absent-tolerance ─────────────────────────────────────────────────────────
// Every one of these shapes is reachable from a real Firestore document.

test('missing sub-objects never throw', () => {
  assert.doesNotThrow(() => JS.rank(ctx({ data: { personal: {} } })));
  assert.doesNotThrow(() => JS.rank(ctx({ data: { uni: {} } })));
  assert.doesNotThrow(() => JS.rank(ctx({ data: { gym: {} } })));
  assert.doesNotThrow(() => JS.rank(ctx({ data: { personal: { tasks: null } } })));
  assert.doesNotThrow(() => JS.rank(ctx({ data: null })));
  assert.doesNotThrow(() => JS.rank(ctx({ gcalEvents: null })));
  assert.doesNotThrow(() => JS.rank({}));
});

test('a task with no due date never counts as overdue', () => {
  const out = JS.rank(ctx({
    data: { personal: { tasks: [task({ due: null })] } }
  }));
  const t = byId(out, 'tasks.attention');
  assert.ok(!t || t.band !== 'failing');
});

test('done tasks and done assessments are ignored', () => {
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ due: '2026-01-01', done: true })] },
      uni: { assessments: [assess({ date: '2026-01-01', done: true })] }
    }
  }));
  assert.strictEqual(out[0].domain, 'allClear', 'finished work should leave nothing to report');
});

// ── One bad source must never take down the strip ────────────────────────────

test('a throwing source is skipped and the rest still rank', () => {
  const exploding = function () { throw new Error('boom'); };
  const out = JS.rank(ctx({
    data: { personal: { tasks: [task({ due: '2026-07-01' })] } }
  }), [exploding].concat(JS.SOURCES));
  assert.ok(out.length > 0, 'a broken rule must not empty the strip');
  assert.ok(byId(out, 'tasks.attention'), 'surviving sources still produce candidates');
});

// ── Assessment detection (lifted from the retired Daily Check-in) ────────────

test('a weekly class is not an assessment', () => {
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'Wk 3 Payroll Lecture' })), false);
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'Week 10 Tutorial' })), false);
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'Lab 2 - BAS' })), false);
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'Workshop: Business Law' })), false);
});

test('a weekly class is not an assessment even if it mentions one', () => {
  // The class title wins — a lecture *about* the exam is still a lecture.
  assert.strictEqual(
    JS.isAssessmentEvent(ev({ title: 'Wk 8 Lecture', description: 'AT2 exam briefing' })),
    false);
});

test('definite markers are detected, including emoji', () => {
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: '🔴 Payroll AT2' })), true);
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'SUPERVISED ASSESSMENT' })), true);
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'Payroll', description: 'submission due' })), true);
});

test('assessment keywords are matched case-insensitively in title or description', () => {
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'at1 hand-in' })), true);
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'Payroll', description: 'Final Exam' })), true);
  assert.strictEqual(JS.isAssessmentEvent(ev({ title: 'Coffee with Maya' })), false);
});

// ── Date handling ────────────────────────────────────────────────────────────

test('day counts are stable across a daylight-saving transition', () => {
  // Australia/Sydney switches on 2026-10-04. A naive hour-based diff drops or
  // gains a day here; week-utils.js exists because of exactly this bug.
  const out = JS.rank(ctx({
    today: '2026-10-02',
    data: { uni: { assessments: [assess({ date: '2026-10-06' })] } }
  }));
  const u = byId(out, 'uni.assessments');
  assert.strictEqual(u.facts.inDays, 4, 'expected exactly 4 days across the DST boundary');
});

test('an assessment due today reads as due today, not overdue', () => {
  const out = JS.rank(ctx({ data: { uni: { assessments: [assess({ date: TODAY })] } } }));
  const u = byId(out, 'uni.assessments');
  assert.strictEqual(u.facts.inDays, 0);
  assert.ok(/today/i.test(u.headline), 'got: ' + u.headline);
});

// ── Candidate shape — the contract the card and the view specs rely on ───────

test('every candidate carries the fields the UI renders', () => {
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ due: '2026-07-01' })] },
      uni: { assessments: [assess({ date: '2026-08-09' })] },
      gym: { workouts: [{ date: '2026-07-01' }] }
    },
    money: { income: 700, bills: 900, oneOffs: 0, savings: 0, disposable: -200 }
  }));
  assert.ok(out.length >= 4, 'expected candidates from several domains');
  out.forEach((c) => {
    assert.ok(typeof c.id === 'string' && c.id, 'id: ' + JSON.stringify(c));
    assert.ok(typeof c.domain === 'string' && c.domain, 'domain on ' + c.id);
    assert.ok(typeof c.headline === 'string' && c.headline, 'headline on ' + c.id);
    assert.ok(typeof c.why === 'string' && c.why, 'why on ' + c.id);
    assert.ok(typeof c.score === 'number' && isFinite(c.score), 'score on ' + c.id);
    assert.ok(JS.BAND_ORDER.indexOf(c.band) !== -1, 'band on ' + c.id + ': ' + c.band);
    assert.ok(c.facts && typeof c.facts === 'object', 'facts on ' + c.id);
  });
});

test('candidate ids are unique so React keys are stable', () => {
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ due: '2026-07-01' })] },
      uni: { assessments: [assess({ date: '2026-08-09' }), assess({ id: 'a2', date: '2026-08-11' })] },
      gym: { workouts: [{ date: '2026-07-01' }] }
    }
  }));
  const seen = ids(out);
  assert.strictEqual(new Set(seen).size, seen.length, 'duplicate ids: ' + seen.join(', '));
});

test('a cta, when present, names a real dashboard page', () => {
  const pages = ['Dashboard', 'Uni', 'Work', 'Gym', 'Personal', 'Finance',
    'Invest', 'Journal', 'Boardroom', 'Projects', 'Shopping'];
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ due: '2026-07-01' })] },
      uni: { assessments: [assess({ date: '2026-08-09' })] },
      gym: { workouts: [{ date: '2026-07-01' }] }
    },
    money: { income: 700, bills: 900, oneOffs: 0, savings: 0, disposable: -200 }
  }));
  out.forEach((c) => {
    if (c.cta) {
      assert.ok(pages.indexOf(c.cta.page) !== -1, c.id + ' points at unknown page ' + c.cta.page);
      assert.ok(c.cta.label, c.id + ' cta has no label');
    }
  });
});

// ── top() ────────────────────────────────────────────────────────────────────

test('top returns the leader plus the runners-up, capped', () => {
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ due: '2026-07-01' })] },
      uni: { assessments: [assess({ date: '2026-08-09' })] },
      gym: { workouts: [{ date: '2026-07-01' }] }
    }
  }));
  assert.strictEqual(JS.top(out, 2).length, 2);
  assert.strictEqual(JS.top(out, 99).length, out.length);
  assert.strictEqual(JS.top([], 3).length, 0);
});
