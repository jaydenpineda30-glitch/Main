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
  // Whole dollars with thousands separators, matching how the Finance tab
  // renders them — "$1,024", not "$1024".
  function money(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function candidate(o) {
    o.band = bandOf(o.score);
    if (!o.facts) o.facts = {};
    return o;
  }

  // ── Items ──────────────────────────────────────────────────────────────────
  // A headline counts things; `items` names them. "3 assessments due in the same
  // 2-day stretch" is the right sentence and a dead end without this — he has to
  // go and work out which three.
  //
  // Plain data only: {id, label, sub}. The card renders it, nothing here composes
  // markup, so there is no injection surface even once a model is in the loop.
  // Candidates about a single thing carry no list; a one-item list is noise.

  var ITEM_CAP = 5;   // one bad semester must not push the rest of the card away

  // Angle brackets stripped for the same reason jarvis-view.js strips them: this
  // is rendered as text, and a task named "<b>x</b>" should read as itself.
  function label(s, n) {
    return trim(String(s == null ? '' : s).replace(/[<>]/g, ' ').replace(/\s+/g, ' '), n || 60);
  }

  function items(list, fn) {
    return arr(list).slice(0, ITEM_CAP).map(fn).filter(function (i) { return i && i.label; });
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

  // Money. app.jsx computes every figure here and hands it in already worked
  // out; this module never recomputes it. That is deliberate — the Finance tab
  // and Jarvis must never be able to disagree about Jayden's money, and the one
  // way to guarantee that is for there to be a single calculation.
  //
  // The question is DISPOSABLE, not bills coverage. In August 2026 his income
  // was $1,251 against $227 of bills — a $1,024 surplus that a bills-coverage
  // signal would have called comfortable, while his actual disposable was minus
  // $202 once one-offs and his savings goal were counted. Congratulating him in
  // that situation is exactly the failure the floor rule exists to prevent.
  function financeSource(ctx) {
    var m = ctx.money;
    if (!m) return [];
    var income = Math.round(Number(m.income) || 0);
    if (income <= 0) return [];       // finance tab not set up → stay quiet
    var bills = Math.round(Number(m.bills) || 0);
    var oneOffs = Math.round(Number(m.oneOffs) || 0);
    var savings = Math.round(Number(m.savings) || 0);
    var disposable = Math.round(Number(m.disposable) || 0);
    var facts = {
      income: income, bills: bills, oneOffs: oneOffs,
      savings: savings, disposable: disposable
    };
    // Names only what is actually there, so the sentence never cites a $0 item.
    var parts = [];
    if (bills > 0) parts.push('$' + money(bills) + ' of bills');
    if (oneOffs > 0) parts.push('$' + money(oneOffs) + ' of one-offs');
    if (savings > 0) parts.push('$' + money(savings) + ' set aside for savings');
    var breakdown = parts.length ? parts.join(', ') : 'your committed spending';

    if (disposable < 0) {
      return [candidate({
        id: 'finance.disposable', domain: 'finance', score: 92,
        headline: '$' + money(Math.abs(disposable)) + ' short this month',
        // Scores 92, which sits under uni.overdue's 95 — so it can be a runner-up
        // and must not tell the lead to wait.
        why: '$' + money(income) + ' coming in against ' + breakdown +
             '. Money that does not add up does not wait to be dealt with.',
        cta: { label: 'Finance', page: 'Finance' }, view: 'money', facts: facts
      })];
    }
    if (disposable < income * 0.1) {
      return [candidate({
        id: 'finance.disposable', domain: 'finance', score: 55,
        headline: 'Only $' + money(disposable) + ' left over this month',
        why: 'After ' + breakdown + ' there is almost no room. One unexpected ' +
             'expense puts you under.',
        cta: { label: 'Finance', page: 'Finance' }, view: 'money', facts: facts
      })];
    }
    return [candidate({
      id: 'finance.disposable', domain: 'finance', score: 22, floorOnly: true,
      headline: '$' + money(disposable) + ' spare this month',
      why: 'After ' + breakdown + '. Worth knowing before you plan the rest.',
      cta: { label: 'Finance', page: 'Finance' }, view: 'money', facts: facts
    })];
  }

  // Uni. Three separate questions, because they have three separate answers:
  // what has already been missed, what is coming next, and where the semester
  // bunches up.
  //
  // These used to be one candidate — the assessment nearest to today, sorted by
  // day distance. Sorting that way puts the MOST overdue item first, so from the
  // first missed hand-in onwards Jarvis locked onto it and never moved. Reading
  // the real semester back showed it still leading with a 103-day-old assessment
  // in November while thirty-three others, one of them due the next day, went
  // unmentioned. An old miss is not allowed to hide a live deadline.

  var CLUSTER_SPAN = 3;    // days: assessments this close together are one pile-up
  var CLUSTER_MIN = 3;     // how many it takes before it is worth a warning
  var CLUSTER_HORIZON = 35; // how far ahead to look for one

  var uniCta = { label: 'Uni', page: 'Uni' };
  function assessName(a) {
    return trim((a.subject ? a.subject + ' ' : '') + (a.name || 'assessment'));
  }

  // Everything falling within CLUSTER_SPAN days of future[i], described.
  function runFrom(future, i) {
    var run = [];
    for (var j = i; j < future.length; j++) {
      if (future[j].inDays - future[i].inDays > CLUSTER_SPAN) break;
      run.push(future[j]);
    }
    var subjects = {};
    run.forEach(function (x) { subjects[x.a.subject || x.a.name || '?'] = true; });
    return {
      items: run,
      count: run.length,
      subjects: Object.keys(subjects).length,
      inDays: run[0].inDays,
      span: run[run.length - 1].inDays - run[0].inDays + 1
    };
  }

  // The first run of CLUSTER_MIN or more assessments close enough together to be
  // worth a card of its own.
  //
  // Nearest wins, not biggest. His real semester has three colliding 9 days out
  // and five colliding 30 days out; warning about the five first is no use,
  // because the three have to be survived to reach them — and by then the far
  // pile-up is the near one and gets its own warning.
  //
  // CLUSTER_HORIZON limits THIS card only — it is what stops the pile-up crying
  // wolf about something two months away. It does not stop `uni.next` naming the
  // company its own assessment keeps, at any distance; see below.
  function findCluster(future) {
    for (var i = 0; i < future.length; i++) {
      if (future[i].inDays > CLUSTER_HORIZON) return null;
      var run = runFrom(future, i);
      if (run.count >= CLUSTER_MIN) return run;
    }
    return null;
  }

  function clusterSentence(c) {
    return c.count + ' assessments across ' + c.subjects + ' ' +
      plural(c.subjects, 'subject', 'subjects') + ' land within ' +
      c.span + ' ' + plural(c.span, 'day', 'days');
  }

  function uniSource(ctx) {
    var all = arr(ctx.data.uni && ctx.data.uni.assessments)
      .filter(function (a) { return a && !a.done && a.date; })
      .map(function (a) { return { a: a, inDays: daysApart(a.date, ctx.today) }; })
      .sort(function (x, y) { return x.inDays - y.inDays; });
    if (!all.length) return [];

    var overdue = all.filter(function (x) { return x.inDays < 0; });
    var future = all.filter(function (x) { return x.inDays >= 0; });
    var out = [];

    // What has already been missed. One candidate for the whole backlog: naming
    // them individually would crowd out everything else on a bad semester.
    if (overdue.length) {
      var worstDays = Math.abs(overdue[0].inDays);
      var worstName = assessName(overdue[0].a);
      out.push(candidate({
        id: 'uni.overdue', domain: 'uni', score: 95,
        headline: overdue.length === 1
          ? worstName + ' was due ' + worstDays + ' ' + plural(worstDays, 'day', 'days') + ' ago'
          : overdue.length + ' assessments are overdue, the oldest by ' + worstDays + ' days',
        // 95 is the highest score any source produces, so this is almost always
        // the lead — but "almost always" is not a fact it is allowed to state.
        why: (overdue.length === 1 ? '' : 'Longest outstanding is ' + worstName + '. ') +
             'Overdue assessments do not get cheaper. Whatever can still be ' +
             'salvaged is worth salvaging today.',
        cta: uniCta, view: 'uni',
        facts: { overdue: overdue.length, worstOverdueDays: worstDays, name: worstName, date: overdue[0].a.date },
        items: items(overdue, function (x) {
          return {
            id: x.a.id, label: label(assessName(x.a)),
            sub: Math.abs(x.inDays) + ' ' + plural(Math.abs(x.inDays), 'day', 'days') + ' ago'
          };
        })
      }));
    }

    // The pile-up. Worth its own candidate only when it is not simply the next
    // thing due — otherwise it is the same news twice, so uni.next carries it.
    // Two different questions. `nextRun` is what the NEXT assessment is landing
    // alongside — its own fact, true at any distance. `cluster` is whether a
    // pile-up deserves a card of its own, which is horizon-limited.
    var nextRun = future.length ? runFrom(future, 0) : null;
    var cluster = findCluster(future);
    var clusterIsNext = !!(cluster && future.length && cluster.items[0] === future[0]);
    if (cluster && !clusterIsNext) {
      out.push(candidate({
        id: 'uni.crunch', domain: 'uni',
        // An early warning, never an emergency. Below `approaching`, so it can
        // never read as a deadline of its own — but above the gym ceiling of 40,
        // because on real data it ranked under "42 days since your last session"
        // and four colliding hand-ins are not a missed workout.
        score: cluster.inDays <= 14 ? 48 : 42,
        headline: cluster.count + ' assessments due in the same ' + cluster.span + '-day stretch',
        why: cluster.subjects + ' different ' + plural(cluster.subjects, 'subject', 'subjects') +
             ', starting in ' + cluster.inDays + ' ' + plural(cluster.inDays, 'day', 'days') +
             '. That week cannot absorb them all, so the room has to come from this one.',
        cta: uniCta, view: 'uni',
        facts: {
          count: cluster.count, subjects: cluster.subjects,
          inDays: cluster.inDays, span: cluster.span, date: cluster.items[0].a.date
        },
        items: items(cluster.items, function (x) {
          return { id: x.a.id, label: label(assessName(x.a)), sub: niceDate(x.a.date) };
        })
      }));
    }

    // What is coming next. Measures only future work, so it can never be
    // describing something already missed.
    if (future.length) {
      var d = future[0].inDays;
      var name = assessName(future[0].a);
      // Named whenever this assessment has company, near or far — it describes
      // only itself, so it is true wherever the candidate ends up ranking.
      var crowded = nextRun.count >= CLUSTER_MIN;
      var company = crowded ? ' ' + clusterSentence(nextRun) + ', this one first.' : '';
      var base = {
        id: 'uni.next', domain: 'uni', cta: uniCta, view: 'uni',
        facts: {
          inDays: d, name: name, date: future[0].a.date, total: future.length,
          clusterCount: nextRun.count
        }
      };
      if (d === 0) {
        out.push(candidate(Object.assign({}, base, {
          score: 88, headline: name + ' is due today',
          why: 'Today is the last day for it. There is no version of this that waits until tomorrow.' + company
        })));
      } else if (d <= 3) {
        out.push(candidate(Object.assign({}, base, {
          score: 85, headline: name + ' is due in ' + d + ' ' + plural(d, 'day', 'days'),
          why: 'Close enough that starting today leaves room for it to go wrong.' + company
        })));
      } else if (d <= 7) {
        out.push(candidate(Object.assign({}, base, {
          score: 60, headline: name + ' is due in ' + d + ' days',
          why: 'Inside the week. A first pass now means the deadline is not a scramble.' + company
        })));
      } else if (d <= 14) {
        out.push(candidate(Object.assign({}, base, {
          score: 40, headline: name + ' is ' + d + ' days out',
          why: 'Far enough not to panic, close enough that it is the obvious thing to chip at.' + company
        })));
      } else {
        out.push(candidate(Object.assign({}, base, {
          score: 20, floorOnly: true,
          headline: 'Good day to get ahead on ' + name,
          // The company matters most here, not least. A calm day is exactly when
          // a distant pile-up is worth knowing about, because it is the only
          // time there is room to do anything about it.
          why: 'It is ' + d + ' days out and nothing is pressing, so this is the best use of the time.' + company
        })));
      }
    }

    return out;
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
    // Each branch describes a different set, so each lists its own — the urgent
    // branch must not show the untouched pile and call it urgent.
    var taskItems = function (list) {
      return items(list, function (t) {
        var d = t && t.due ? daysApart(ctx.today, t.due) : null;
        return {
          id: t && t.id, label: label(t && t.name, 50),
          sub: d == null ? 'no due date'
            : d > 0 ? d + ' ' + plural(d, 'day', 'days') + ' overdue'
            : d === 0 ? 'due today'
            : 'due in ' + Math.abs(d) + ' ' + plural(Math.abs(d), 'day', 'days')
        };
      });
    };

    if (overdue.length >= 3 || worst > 3) {
      return [candidate(Object.assign({}, base, {
        score: 90,
        headline: overdue.length + ' ' + plural(overdue.length, 'task is', 'tasks are') + ' overdue',
        why: 'Oldest is ' + worst + ' ' + plural(worst, 'day', 'days') + ' past due — "' + name(overdue[0]) +
             '". This has stopped being a list and started being a backlog.',
        items: taskItems(overdue)
      }))];
    }
    if (overdue.length) {
      return [candidate(Object.assign({}, base, {
        score: 72,
        headline: '"' + name(overdue[0]) + '" is ' + worst + ' ' + plural(worst, 'day', 'days') + ' overdue',
        // Describes only this task's own trajectory. It cannot say "the paragraph
        // above", because as a runner-up there is no such paragraph.
        why: 'Still small at ' + worst + ' ' + plural(worst, 'day', 'days') +
             '. Clearing it today is the difference between one late task and a backlog.',
        items: taskItems(overdue)
      }))];
    }
    if (dueSoon.length) {
      return [candidate(Object.assign({}, base, {
        score: 70,
        headline: dueSoon.length + ' ' + plural(dueSoon.length, 'task', 'tasks') + ' due within two days',
        why: 'Next up is "' + name(dueSoon[0]) + '".',
        items: taskItems(dueSoon)
      }))];
    }
    if (urgent.length) {
      return [candidate(Object.assign({}, base, {
        score: 55, headline: 'Urgent task open: "' + name(urgent[0]) + '"',
        why: 'Flagged urgent with no due date, so nothing will chase it but you.',
        items: taskItems(urgent)
      }))];
    }
    if (untouched.length) {
      return [candidate(Object.assign({}, base, {
        score: 35,
        headline: untouched.length + ' ' + plural(untouched.length, 'task has', 'tasks have') + " not moved in a week",
        why: 'Starting with "' + name(untouched[0]) + '". Either do it, park it, or drop it.',
        items: taskItems(untouched)
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
      // Gym is not floorOnly — it survives a busy day — so this text may only
      // state its own facts. It cannot assert that the rest of the list is calm.
      why: (nextName ? nextName + ' is up next. ' : '') +
           'The gap gets harder to close the longer it runs.',
      cta: { label: 'Gym', page: 'Gym' }, view: 'gym', facts: { idleDays: idle, next: nextName || null }
    })];
  }

  // Work diary. 22 written shift notes that nothing in Athena reads — the biggest
  // piece of dead data in the app. The honest signal inside it is narrower than
  // "review your diary": some shifts have text in `draftNotes` and nothing in
  // `notes`, which means he typed a write-up, navigated away, and the Work tab's
  // autosave (app.jsx:2134) parked it as a draft rather than a saved note.
  //
  // Two entries further down his real log read "dont remember". That is what the
  // gap costs, and it is why this is worth a nudge at all.
  //
  // Deliberately says NOTHING about hours or pay. Whether an unsaved shift counts
  // toward them runs through `isWorkEventCounted` and `progressiveSince`
  // (2026-06-27 in his data), so of his four drafts two count and two do not. A
  // claim about his money that holds half the time is precisely what the money
  // signal was rebuilt to stop doing. If that claim is ever wanted, app.jsx must
  // work it out and hand it in, the same way `money` is.
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // "2026-06-20" -> "20 June". Reads like a date he would say out loud, and the
  // Work tab is where he goes to find it.
  function niceDate(iso) {
    var p = String(iso || '').split('-');
    if (p.length !== 3) return String(iso || '');
    var m = MONTHS[Number(p[1]) - 1];
    return m ? Number(p[2]) + ' ' + m : String(iso);
  }

  function workSource(ctx) {
    var logs = ctx.data.work && ctx.data.work.shiftLogs;
    // An object keyed by gcal event id or date — not an array. Real documents
    // contain nulls and half-written entries, so everything is checked.
    if (!logs || typeof logs !== 'object' || Array.isArray(logs)) return [];
    var drafts = Object.keys(logs)
      .map(function (k) { return logs[k]; })
      .filter(function (e) {
        return e && typeof e === 'object' &&
          String(e.draftNotes == null ? '' : e.draftNotes).trim() &&
          !String(e.notes == null ? '' : e.notes).trim();
      })
      .sort(function (a, b) { return String(a.date || '').localeCompare(String(b.date || '')); });
    if (!drafts.length) return [];

    var n = drafts.length;
    var oldest = drafts[0].date || null;
    return [candidate({
      id: 'work.unsavedNotes', domain: 'work',
      // Decaying: the text does not disappear, but what he remembers about the
      // shift does. Low, because nothing breaks if today is not the day.
      score: 33,
      headline: n + ' shift ' + plural(n, 'note', 'notes') + ' never got saved',
      why: 'Typed into the shift diary and left as ' + plural(n, 'a draft', 'drafts') +
           ' when the row closed' + (oldest ? ', the oldest on ' + niceDate(oldest) : '') +
           '. The text comes back when you reopen the shift.',
      cta: { label: 'Work', page: 'Work' }, view: 'work',
      facts: { drafts: n, oldest: oldest },
      // The glimpse of his own words is the point: "Configured the whole
      // onboarding process" is what makes it worth going back for.
      items: items(drafts, function (e) {
        return {
          id: e.date || null,
          label: niceDate(e.date) + (e.time ? ' · ' + label(e.time, 16) : ''),
          sub: label(e.draftNotes, 70)
        };
      })
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
        id: 'getAhead.task', domain: 'tasks', score: 15, floorOnly: true,
        headline: 'Nothing is due — good time for "' + trim(pending[0].name, 40) + '"',
        why: 'It has no deadline, which is exactly why it never gets picked. ' +
             pending.length + ' undated ' + plural(pending.length, 'task', 'tasks') + ' waiting.',
        cta: { label: 'Tasks', page: 'Personal' }, view: 'tasks', facts: { pending: pending.length }
      }));
    }
    return out;
  }

  var SOURCES = [financeSource, uniSource, tasksSource, gymSource, workSource,
    calendarSource, getAheadSource];

  function allClear(ctx) {
    return candidate({
      id: 'allClear', domain: 'allClear', score: 5,
      headline: 'Nothing pressing today',
      // This fires when NO source produced anything — including when the Finance
      // tab is empty — so it cannot claim bills are covered. It only knows that
      // nothing raised its hand. Same rule as the floor candidates: a candidate's
      // text may only describe its own facts.
      why: 'Nothing overdue, no deadline close, nothing asking for attention. ' +
           'Genuinely a free day — spend it on whatever you actually feel like.',
      // null, not 'none' — there is genuinely nothing to show, and that is the
      // same statement `cta: null` makes. A magic string would have to be
      // whitelisted, and then a model could ask to display it.
      cta: null, view: null, facts: { today: ctx.today }
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

    // The floor rule. A floorOnly candidate ("nothing is due — good time for X")
    // is only true when nothing real is happening; as a runner-up it is a lie.
    // If anything genuine is in play, drop them all rather than let them mislead.
    var somethingReal = out.some(function (c) {
      return !c.floorOnly && c.score >= BANDS.decaying;
    });
    if (somethingReal) {
      out = out.filter(function (c) { return !c.floorOnly; });
    }

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
