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
  assert.ok(byId(late, 'uni.overdue').score > byId(soon, 'uni.next').score);
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
  const u = byId(out, 'uni.next');
  assert.strictEqual(u.facts.inDays, 4, 'expected exactly 4 days across the DST boundary');
});

test('an assessment due today reads as due today, not overdue', () => {
  const out = JS.rank(ctx({ data: { uni: { assessments: [assess({ date: TODAY })] } } }));
  const u = byId(out, 'uni.next');
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

// ── Uni: an old miss must not mask a live deadline ───────────────────────────
// Found by reading real output. `uniSource` sorted by "days from today" and took
// the first, which is the MOST overdue item — so from the first missed hand-in
// onwards Jarvis locked onto it permanently. On his real semester data it was
// still leading with a 103-day-old assessment in November while 33 others,
// including one due the next day, went unmentioned.

test('an overdue assessment and the next upcoming one are separate candidates', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'old', name: 'AT1', date: '2026-07-01' }),   // 37 days overdue
      assess({ id: 'soon', name: 'AT2', date: '2026-08-08' })   // due tomorrow
    ] } }
  }));
  assert.ok(byId(out, 'uni.overdue'), 'expected an overdue-assessment candidate');
  assert.ok(byId(out, 'uni.next'), 'expected the next upcoming assessment to survive alongside it');
});

test('the upcoming-assessment candidate never describes an overdue one', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'old', name: 'AT1', date: '2026-07-01' }),
      assess({ id: 'soon', name: 'AT2', date: '2026-08-08' })
    ] } }
  }));
  const next = byId(out, 'uni.next');
  assert.strictEqual(next.facts.inDays, 1, 'uni.next must measure the future item, not the old miss');
  assert.ok(!/ago/.test(next.headline), 'uni.next said: ' + next.headline);
});

test('the overdue candidate counts every missed assessment, not just the worst', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'a', name: 'AT1', date: '2026-07-01' }),
      assess({ id: 'b', name: 'AT2', date: '2026-07-20' }),
      assess({ id: 'c', name: 'AT3', date: '2026-09-01' })
    ] } }
  }));
  assert.strictEqual(byId(out, 'uni.overdue').facts.overdue, 2);
});

// ── Uni: the semester pile-up ────────────────────────────────────────────────
// His real data has seven assessments across six subjects landing on 25–26 Oct.
// Jarvis showed the nearest one only, so the collision was invisible until it
// arrived. This is the one thing his data holds that no other card can see.

test('a cluster of assessments in a few days is surfaced before it arrives', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'n', subject: 'Ethics', date: '2026-08-12' }),   // the nearest
      assess({ id: 'c1', subject: 'Tax', date: '2026-09-05' }),
      assess({ id: 'c2', subject: 'Budget', date: '2026-09-05' }),
      assess({ id: 'c3', subject: 'AIS', date: '2026-09-06' })
    ] } }
  }));
  const crunch = byId(out, 'uni.crunch');
  assert.ok(crunch, 'expected a pile-up candidate; got ' + ids(out).join(', '));
  assert.strictEqual(crunch.facts.count, 3);
  assert.strictEqual(crunch.facts.subjects, 3);
});

test('the pile-up warning never outranks a live deadline', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'n', subject: 'Ethics', date: '2026-08-08' }),
      assess({ id: 'c1', subject: 'Tax', date: '2026-09-05' }),
      assess({ id: 'c2', subject: 'Budget', date: '2026-09-05' }),
      assess({ id: 'c3', subject: 'AIS', date: '2026-09-06' })
    ] } }
  }));
  assert.ok(byId(out, 'uni.crunch').score < byId(out, 'uni.next').score,
    'a pile-up three weeks out must not outrank something due tomorrow');
});

test('three assessments spread across a fortnight are not a pile-up', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'c1', subject: 'Tax', date: '2026-09-01' }),
      assess({ id: 'c2', subject: 'Budget', date: '2026-09-08' }),
      assess({ id: 'c3', subject: 'AIS', date: '2026-09-15' })
    ] } }
  }));
  assert.strictEqual(byId(out, 'uni.crunch'), undefined);
});

test('the pile-up is not repeated when it is already the nearest thing', () => {
  // Nothing between now and the cluster: uni.next is one of the clustered items,
  // so a separate warning about it would be the same news twice.
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'c1', subject: 'Tax', date: '2026-08-10' }),
      assess({ id: 'c2', subject: 'Budget', date: '2026-08-10' }),
      assess({ id: 'c3', subject: 'AIS', date: '2026-08-11' })
    ] } }
  }));
  assert.strictEqual(byId(out, 'uni.crunch'), undefined,
    'the nearest assessment already carries this; the why should mention it instead');
  assert.ok(/3 /.test(byId(out, 'uni.next').why), 'uni.next should name the company it keeps');
});

// ── The all-clear must not claim things it never checked ─────────────────────

test('the all-clear does not assert anything about money', () => {
  // It fires when no source produced a candidate — including when the Finance
  // tab is empty — so it cannot know whether bills are covered.
  const out = JS.rank(ctx());
  assert.ok(!/bill/i.test(out[0].why), 'all-clear said: ' + out[0].why);
});

test('the nearest pile-up wins, not the biggest one further out', () => {
  // Real data has three assessments 8 days out and five 29 days out. Warning
  // about the far one first is useless: the near one has to be survived to
  // reach it, and by then the far one is the near one.
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'lead', subject: 'Spreadsheets', date: '2026-08-08' }),
      assess({ id: 'n1', subject: 'Tax', date: '2026-08-16' }),
      assess({ id: 'n2', subject: 'WIA', date: '2026-08-16' }),
      assess({ id: 'n3', subject: 'FinStmts', date: '2026-08-17' }),
      assess({ id: 'f1', subject: 'AIS', date: '2026-09-06' }),
      assess({ id: 'f2', subject: 'Budget', date: '2026-09-06' }),
      assess({ id: 'f3', subject: 'Ethics', date: '2026-09-06' }),
      assess({ id: 'f4', subject: 'FinMgmt', date: '2026-09-07' })
    ] } }
  }));
  const crunch = byId(out, 'uni.crunch');
  assert.strictEqual(crunch.facts.inDays, 9, 'expected the pile-up 9 days out, not the one 30 days out');
  assert.strictEqual(crunch.facts.count, 3);
});

test('a pile-up of assessments outranks a gym nudge', () => {
  // It ranked below "42 days since your last session" on real data. Missing a
  // workout and colliding four hand-ins are not the same order of problem.
  const out = JS.rank(ctx({
    data: {
      uni: { assessments: [
        assess({ id: 'lead', subject: 'Spreadsheets', date: '2026-08-08' }),
        assess({ id: 'c1', subject: 'Tax', date: '2026-09-01' }),
        assess({ id: 'c2', subject: 'WIA', date: '2026-09-01' }),
        assess({ id: 'c3', subject: 'AIS', date: '2026-09-02' })
      ] },
      gym: { workouts: [{ date: '2026-06-26' }] }
    }
  }));
  assert.ok(byId(out, 'uni.crunch').score > byId(out, 'gym.idle').score);
});

test('a pile-up still never reads as a deadline of its own', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'lead', subject: 'Spreadsheets', date: '2026-08-08' }),
      assess({ id: 'c1', subject: 'Tax', date: '2026-08-18' }),
      assess({ id: 'c2', subject: 'WIA', date: '2026-08-18' }),
      assess({ id: 'c3', subject: 'AIS', date: '2026-08-19' })
    ] } }
  }));
  assert.ok(byId(out, 'uni.crunch').score < JS.BANDS.approaching,
    'a pile-up is an early warning, not a date');
});

// ── A far-off assessment still says what it is walking into ──────────────────
// Seven of his assessments land on 25-26 October. On a calm day in August the
// nearest thing due IS one of those seven, and Jarvis said only "78 days out,
// nothing is pressing" — hiding the single most useful fact about it. The 35-day
// horizon exists to stop the pile-up card crying wolf; it should not stop the
// assessment itself describing the company it keeps.

test('a get-ahead assessment names the pile-up it belongs to, however far off', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'a', subject: 'FinStmts', date: '2026-10-25' }),
      assess({ id: 'b', subject: 'MGMT', date: '2026-10-25' }),
      assess({ id: 'c', subject: 'WIA', date: '2026-10-25' }),
      assess({ id: 'd', subject: 'AIS', date: '2026-10-26' })
    ] } }
  }));
  const next = byId(out, 'uni.next');
  assert.strictEqual(next.band, 'getAhead', 'still a calm-day suggestion');
  assert.ok(/4 /.test(next.why), 'should name the four landing together, got: ' + next.why);
  assert.strictEqual(next.facts.clusterCount, 4);
});

test('a lone far-off assessment does not invent company', () => {
  const out = JS.rank(ctx({
    data: { uni: { assessments: [assess({ id: 'a', date: '2026-10-25' })] } }
  }));
  const next = byId(out, 'uni.next');
  assert.strictEqual(next.facts.clusterCount, 1);
  assert.ok(!/land|assessments across/.test(next.why), 'got: ' + next.why);
});

test('a distant pile-up still gets no card of its own', () => {
  // Naming it inside uni.next is enough. A separate warning 78 days out is the
  // crying-wolf case the horizon exists to prevent.
  const out = JS.rank(ctx({
    data: { uni: { assessments: [
      assess({ id: 'a', subject: 'FinStmts', date: '2026-10-25' }),
      assess({ id: 'b', subject: 'MGMT', date: '2026-10-25' }),
      assess({ id: 'c', subject: 'AIS', date: '2026-10-26' })
    ] } }
  }));
  assert.strictEqual(byId(out, 'uni.crunch'), undefined);
});

// ── No candidate may describe its position in the list ───────────────────────
// Caught on the live page, 2026-08-08. The single-overdue-task candidate read
// "Clearing it today stops it turning into the paragraph above" while sitting as
// a runner-up under an assessment — there was no paragraph above it. Same family
// as the floor-rule bug: text written assuming the candidate would be the lead.
//
// The floor rule handles candidates that need the list to be QUIET. This handles
// candidates that need something specific to be ABOVE or BELOW them, which no
// candidate can know. `floorOnly` cannot express it, so it must not be said.

const POSITIONAL = /paragraph above|on this list|anything else|everything else|outranks|above it|below it/i;

test('no candidate refers to its position in the list', () => {
  // Deliberately busy: overdue assessments, overdue tasks, a shortfall, a
  // pile-up and a gym gap, so every source that can fire does.
  const out = JS.rank(ctx({
    data: {
      uni: { assessments: [
        assess({ id: 'o1', subject: 'Spreadsheets', date: '2026-07-20' }),
        assess({ id: 'n1', subject: 'FinStmts', date: '2026-08-07' }),
        assess({ id: 'c1', subject: 'Tax', date: '2026-08-16' }),
        assess({ id: 'c2', subject: 'WIA', date: '2026-08-16' }),
        assess({ id: 'c3', subject: 'AIS', date: '2026-08-17' })
      ] },
      personal: { tasks: [task({ id: 1, due: '2026-08-04', name: 'Chapter review questions' })] },
      gym: { workouts: [{ date: '2026-06-26' }] }
    },
    money: AUGUST
  }));
  assert.ok(out.length >= 4, 'expected a crowded list, got ' + out.length);
  out.forEach((c) => {
    const text = c.headline + ' ' + c.why;
    const hit = text.match(POSITIONAL);
    assert.ok(!hit, c.id + ' claims a position (" ' + hit + ' ") in: ' + text);
  });
});

test('a single overdue task describes only itself', () => {
  // The exact case from the live page: one overdue task, ranked below a uni item.
  const out = JS.rank(ctx({
    data: {
      personal: { tasks: [task({ id: 1, due: '2026-08-04', name: 'Chapter review questions' })] },
      uni: { assessments: [assess({ id: 'n', subject: 'SPREADSHEETS', date: '2026-08-08' })] }
    }
  }));
  const t = byId(out, 'tasks.attention');
  assert.ok(out[0].domain === 'uni', 'setup: the task should be a runner-up here');
  assert.ok(!POSITIONAL.test(t.why), 'got: ' + t.why);
});
