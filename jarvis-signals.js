/**
 * jarvis-signals.js
 * Decides what is worth doing next, across every part of the dashboard.
 *
 * Every other card in Athena is a view of one area. This is the only thing that
 * compares across areas — money against uni against tasks — and picks. That
 * comparison is the entire product.
 *
 * Two rules matter more than the scores themselves:
 *
 *   1. `rank` NEVER returns an empty list. On a calm day it suggests getting
 *      ahead; with a genuinely empty dashboard it says so. The July prototype
 *      rendered nothing whenever nothing was wrong, which made it an alarm
 *      rather than an assistant. Silence is a failure state here.
 *
 *   2. Scores mean "what does it cost me not to do this today", NOT "how
 *      alarming is this". A gym nudge at 40 means a genuinely good use of an
 *      afternoon, not a moderate emergency.
 *
 * Ranking is plain rules on purpose. It stays correct with no API key, it can
 * be read and argued with, and it is testable. The model's job is to phrase the
 * result, never to decide it.
 *
 * No DOM, no React, no window. Loaded as a browser global before app.js and
 * require()-able so it can be unit-tested under `npm test`.
 */
(function (root) {
  'use strict';

  // task-grouping.js owns what "overdue" means. Reusing it means Jarvis and the
  // Tasks card can never drift into disagreeing about the same task.
  var TG = (typeof module !== 'undefined' && module.exports && typeof require === 'function')
    ? require('./task-grouping.js')
    : root.TaskGrouping;

  // Score floors. A band is "what kind of thing is this", not "how loud".
  var BANDS = {
    failing: 90,      // going wrong right now
    deadline: 70,     // a hard date is close
    approaching: 50,  // a hard date is visible
    decaying: 30,     // gets worse the longer it is left
    getAhead: 10,     // nothing is wrong; this is the best use of a free day
    allClear: 0       // there is genuinely nothing to report
  };
  var BAND_ORDER = ['failing', 'deadline', 'approaching', 'decaying', 'getAhead', 'allClear'];

  function bandOf(score) {
    for (var i = 0; i < BAND_ORDER.length; i++) {
      if (score >= BANDS[BAND_ORDER[i]]) return BAND_ORDER[i];
    }
    return 'allClear';
  }

  // Whole days from bStr to aStr. Both local YYYY-MM-DD. Anchored at midday-safe
  // midnight and rounded, so a daylight-saving transition between the two dates
  // cannot add or drop a day — the bug week-utils.js exists because of.
  function daysApart(aStr, bStr) {
    var a = new Date(aStr + 'T00:00:00');
    var b = new Date(bStr + 'T00:00:00');
    return Math.round((a - b) / 864e5);
  }

  function arr(v) { return Array.isArray(v) ? v : []; }
  function plural(n, one, many) { return n === 1 ? one : many; }
  function trim(s, n) { return String(s || '').trim().slice(0, n || 48); }

  function candidate(o) {
    o.band = bandOf(o.score);
    if (!o.facts) o.facts = {};
    return o;
  }

  // ── Assessment detection ───────────────────────────────────────────────────
  // Lifted from the retired Daily Check-in (app.jsx:341–405). Tells a real
  // assessment apart from a weekly lecture in the Google Calendar feed, which
  // is not something you want to rewrite from scratch.

  var DEFINITE_ASSESS_MARKERS = ['🔴', '🔵', 'SUPERVISED ASSESSMENT', 'assessment due',
    'submission due', 'submit by', 'due date', 'AT1 due', 'AT2 due', 'AT3 due', 'AT4 due', 'AT5 due'];
  var ASSESS_KEYWORDS = ['AT1', 'AT2', 'AT3', 'AT4', 'AT5', 'exam', 'final exam', 'quiz',
    'mid-sem', 'midsem', 'submission', 'assignment', 'due', 'assessment', 'supervised',
    'test', 'prac exam', 'lab exam'];

  function isWeeklyClass(title) {
    return /^Wk\s*\d/i.test(title) || /^Week\s*\d/i.test(title) || /^Lecture/i.test(title) ||
      /^Tutorial/i.test(title) || /^Lab\s/i.test(title) || /^Seminar/i.test(title) ||
      /^Workshop/i.test(title);
  }

  function isAssessmentEvent(ev) {
    if (!ev) return false;
    var title = ev.title || '';
    // The class title wins: a lecture *about* the exam is still a lecture.
    if (isWeeklyClass(title)) return false;
    var combined = title + ' ' + (ev.description || '');
    var lower = combined.toLowerCase();
    // Markers are checked case-sensitively so the emoji survive.
    if (DEFINITE_ASSESS_MARKERS.some(function (m) { return combined.indexOf(m) !== -1; })) return true;
    return ASSESS_KEYWORDS.some(function (k) { return lower.indexOf(k.toLowerCase()) !== -1; });
  }

  // ── Sources ────────────────────────────────────────────────────────────────
  // Each takes the context and returns zero or more candidates. Adding a rule
  // here is all it takes — ranking, the card and the phrasing pick it up.

  // Money. app.jsx owns the pay-cycle maths (getPayPeriodRange / shiftPay /
  // isWorkEventCounted) and hands the result in already computed, so this module
  // stays pure and the two can never disagree about what a shift pays.
  function financeSource(ctx) {
    var m = ctx.money;
    if (!m || !(Number(m.billsTotal) > 0)) return [];   // not configured → stay quiet
    var bills = Math.round(Number(m.billsTotal));
    var projected = Math.round(Number(m.projected) || 0);
    var buffer = projected - bills;
    var shifts = Number(m.shifts) || 0;
    var facts = { billsTotal: bills, projected: projected, buffer: buffer, shifts: shifts };

    if (buffer < 0) {
      return [candidate({
        id: 'finance.billsCoverage', domain: 'finance', score: 92,
        headline: 'Bills are $' + Math.abs(buffer) + ' short this cycle',
        why: '$' + projected + ' projected from ' + shifts + ' ' + plural(shifts, 'shift', 'shifts') +
             ' against $' + bills + ' of bills. Everything else can wait behind this.',
        cta: { label: 'Work', page: 'Work' }, view: 'money', facts: facts
      })];
    }
    if (buffer < bills * 0.3) {
      return [candidate({
        id: 'finance.billsCoverage', domain: 'finance', score: 60,
        headline: 'Bills are covered, but only just',
        why: '$' + buffer + ' spare after $' + bills + ' of bills. Worth picking up a shift ' +
             'before something unexpected lands.',
        cta: { label: 'Work', page: 'Work' }, view: 'money', facts: facts
      })];
    }
    return [candidate({
      id: 'finance.billsCoverage', domain: 'finance', score: 22,
      headline: 'Bills covered with $' + buffer + ' spare',
      why: 'Nothing to do here — worth knowing before you plan the rest.',
      cta: { label: 'Finance', page: 'Finance' }, view: 'money', facts: facts
    })];
  }

  // Uni. The nearest unfinished assessment, however far away it is — a far-off
  // one becomes the get-ahead suggestion on an otherwise empty day.
  function uniSource(ctx) {
    var upcoming = arr(ctx.data.uni && ctx.data.uni.assessments)
      .filter(function (a) { return a && !a.done && a.date; })
      .map(function (a) { return { a: a, inDays: daysApart(a.date, ctx.today) }; })
      .sort(function (x, y) { return x.inDays - y.inDays; });
    if (!upcoming.length) return [];

    var next = upcoming[0];
    var d = next.inDays;
    var name = trim((next.a.subject ? next.a.subject + ' ' : '') + (next.a.name || 'assessment'));
    var facts = { inDays: d, name: name, date: next.a.date, total: upcoming.length };
    var base = { id: 'uni.assessments', domain: 'uni', cta: { label: 'Uni', page: 'Uni' }, view: 'uni', facts: facts };

    if (d < 0) {
      return [candidate(Object.assign({}, base, {
        score: 95,
        headline: name + ' was due ' + Math.abs(d) + ' ' + plural(Math.abs(d), 'day', 'days') + ' ago',
        why: 'Overdue assessments do not get cheaper. Deal with this before anything else on the list.'
      }))];
    }
    if (d === 0) {
      return [candidate(Object.assign({}, base, {
        score: 88, headline: name + ' is due today',
        why: 'Today is the last day for it, so it outranks everything else you had planned.'
      }))];
    }
    if (d <= 3) {
      return [candidate(Object.assign({}, base, {
        score: 85, headline: name + ' is due in ' + d + ' ' + plural(d, 'day', 'days'),
        why: 'Close enough that starting today leaves room for it to go wrong.'
      }))];
    }
    if (d <= 7) {
      return [candidate(Object.assign({}, base, {
        score: 60, headline: name + ' is due in ' + d + ' days',
        why: 'Inside the week. A first pass now means the deadline is not a scramble.'
      }))];
    }
    if (d <= 14) {
      return [candidate(Object.assign({}, base, {
        score: 40, headline: name + ' is ' + d + ' days out',
        why: 'Far enough not to panic, close enough that it is the obvious thing to chip at.'
      }))];
    }
    return [candidate(Object.assign({}, base, {
      score: 20, headline: 'Good day to get ahead on ' + name,
      why: 'It is ' + d + ' days out and nothing is pressing, so this is the best use of the time.'
    }))];
  }

  // Tasks. Severity comes from task-grouping.js, so this agrees with the Tasks
  // card by construction. One candidate, describing the worst thing going on.
  function tasksSource(ctx) {
    var tasks = arr(ctx.data.personal && ctx.data.personal.tasks);
    if (!tasks.length || !TG) return [];
    var g = TG.groupTasks(tasks, ctx.today);
    var overdue = g.overdue, dueSoon = g.dueSoon, untouched = g.untouched;
    var urgent = tasks.filter(function (t) { return t && !t.done && t.priority === 'urgent'; });
    var worst = overdue.length ? Math.abs(daysApart(overdue[0].due, ctx.today)) : 0;
    var facts = {
      overdue: overdue.length, dueSoon: dueSoon.length,
      untouched: untouched.length, urgent: urgent.length, worstOverdueDays: worst
    };
    var base = { id: 'tasks.attention', domain: 'tasks', cta: { label: 'Tasks', page: 'Personal' }, view: 'tasks', facts: facts };
    var name = function (t) { return trim(t && t.name, 40); };

    if (overdue.length >= 3 || worst > 3) {
      return [candidate(Object.assign({}, base, {
        score: 90,
        headline: overdue.length + ' ' + plural(overdue.length, 'task is', 'tasks are') + ' overdue',
        why: 'Oldest is ' + worst + ' ' + plural(worst, 'day', 'days') + ' past due — "' + name(overdue[0]) +
             '". This has stopped being a list and started being a backlog.'
      }))];
    }
    if (overdue.length) {
      return [candidate(Object.assign({}, base, {
        score: 72,
        headline: '"' + name(overdue[0]) + '" is ' + worst + ' ' + plural(worst, 'day', 'days') + ' overdue',
        why: 'Still small. Clearing it today stops it turning into the paragraph above.'
      }))];
    }
    if (dueSoon.length) {
      return [candidate(Object.assign({}, base, {
        score: 70,
        headline: dueSoon.length + ' ' + plural(dueSoon.length, 'task', 'tasks') + ' due within two days',
        why: 'Next up is "' + name(dueSoon[0]) + '".'
      }))];
    }
    if (urgent.length) {
      return [candidate(Object.assign({}, base, {
        score: 55, headline: 'Urgent task open: "' + name(urgent[0]) + '"',
        why: 'Flagged urgent with no due date, so nothing will chase it but you.'
      }))];
    }
    if (untouched.length) {
      return [candidate(Object.assign({}, base, {
        score: 35,
        headline: untouched.length + ' ' + plural(untouched.length, 'task has', 'tasks have') + " not moved in a week",
        why: 'Starting with "' + name(untouched[0]) + '". Either do it, park it, or drop it.'
      }))];
    }
    return [];
  }

  // Gym. Decays with neglect — never an emergency, and must never outrank a
  // real deadline, however long the gap gets.
  function gymSource(ctx) {
    var workouts = arr(ctx.data.gym && ctx.data.gym.workouts)
      .filter(function (w) { return w && w.date; })
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    if (!workouts.length) return [];
    var idle = daysApart(ctx.today, workouts[0].date);
    if (idle < 4) return [];

    var rotation = arr(ctx.data.gym && ctx.data.gym.rotation);
    var next = rotation.length ? rotation[(Number(ctx.data.gym.rotIdx) || 0) % rotation.length] : null;
    var nextName = next && (next.name || next.focus);
    return [candidate({
      id: 'gym.idle', domain: 'gym', score: idle >= 7 ? 40 : 32,
      headline: idle + ' days since your last session',
      why: (nextName ? nextName + ' is up next. ' : '') +
           'Nothing is on fire, so this is a genuinely good use of the afternoon.',
      cta: { label: 'Gym', page: 'Gym' }, view: 'gym', facts: { idleDays: idle, next: nextName || null }
    })];
  }

  // What today already contains. Context rather than an instruction, so it sits
  // low and mostly serves to explain why there is less room than you think.
  function calendarSource(ctx) {
    var todays = arr(ctx.gcalEvents).filter(function (e) {
      return e && e.date === ctx.today && !e.allDay;
    });
    if (!todays.length) return [];
    var titles = todays.slice(0, 3).map(function (e) { return trim(e.title, 30); }).join(', ');
    return [candidate({
      id: 'calendar.today', domain: 'calendar', score: 25,
      headline: todays.length + ' ' + plural(todays.length, 'thing', 'things') + ' already on today',
      why: titles + '. Worth knowing before you commit the day to something else.',
      cta: null, view: 'week', facts: { count: todays.length }
    })];
  }

  // The floor. Everything above answers "what is wrong"; this answers "there is
  // nothing wrong, so what is the best use of today". Without it a calm day
  // produces silence, which is the exact failure this module exists to avoid.
  function getAheadSource(ctx) {
    var out = [];
    var pending = arr(ctx.data.personal && ctx.data.personal.tasks)
      .filter(function (t) { return t && !t.done && !t.due; });
    if (pending.length) {
      out.push(candidate({
        id: 'getAhead.task', domain: 'tasks', score: 15,
        headline: 'Nothing is due — good time for "' + trim(pending[0].name, 40) + '"',
        why: 'It has no deadline, which is exactly why it never gets picked. ' +
             pending.length + ' undated ' + plural(pending.length, 'task', 'tasks') + ' waiting.',
        cta: { label: 'Tasks', page: 'Personal' }, view: 'tasks', facts: { pending: pending.length }
      }));
    }
    return out;
  }

  var SOURCES = [financeSource, uniSource, tasksSource, gymSource, calendarSource, getAheadSource];

  function allClear(ctx) {
    return candidate({
      id: 'allClear', domain: 'allClear', score: 5,
      headline: 'Nothing pressing today',
      why: 'No deadlines close, nothing overdue, bills covered. Genuinely a free day — ' +
           'spend it on whatever you actually feel like.',
      cta: null, view: 'none', facts: { today: ctx.today }
    });
  }

  /**
   * Rank every candidate, highest first. Never returns an empty list.
   * `sources` is injectable so tests can add a deliberately broken rule.
   */
  function rank(context, sources) {
    var ctx = context || {};
    if (!ctx.data || typeof ctx.data !== 'object') ctx.data = {};
    if (!ctx.today) ctx.today = todayStr();
    if (!Array.isArray(ctx.gcalEvents)) ctx.gcalEvents = [];

    var out = [];
    (sources || SOURCES).forEach(function (src) {
      try {
        out = out.concat(arr(src(ctx)));
      } catch (e) {
        // One broken rule must never empty the strip. A silent Jarvis is worse
        // than a Jarvis missing one signal.
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('[Jarvis] signal source failed:', e && e.message);
        }
      }
    });

    out.sort(function (a, b) { return b.score - a.score; });
    return out.length ? out : [allClear(ctx)];
  }

  function top(candidates, n) {
    return arr(candidates).slice(0, Math.max(0, n == null ? 3 : n));
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  var api = {
    BANDS: BANDS,
    BAND_ORDER: BAND_ORDER,
    SOURCES: SOURCES,
    bandOf: bandOf,
    daysApart: daysApart,
    isWeeklyClass: isWeeklyClass,
    isAssessmentEvent: isAssessmentEvent,
    rank: rank,
    top: top
  };

  root.JarvisSignals = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
