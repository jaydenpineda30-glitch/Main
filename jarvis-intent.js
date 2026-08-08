/**
 * jarvis-intent.js
 * The gate between what a model asks for and what Athena is willing to change.
 *
 * Stage 3 is where Jarvis stops describing Jayden's data and starts changing it,
 * and Athena has no undo. So the spec's rules are not negotiable:
 *
 *   1. Jarvis PROPOSES. The write happens after Jayden confirms, never straight
 *      off a model response.
 *   2. Every intent is checked against a whitelist. An unrecognised one is
 *      dropped and logged, never dispatched.
 *   3. A bulk operation must say exactly what it will change, before it changes.
 *
 * This module does the parsing and the checking. It writes nothing, and it is
 * given nothing that could write — no `setData`, no document handle, no
 * callbacks. What comes out is inert data describing a proposal. Executing it is
 * the caller's job, through the existing mutators, after a confirm.
 *
 * Built before the model path exists, deliberately: the dangerous half should be
 * proven before anything can reach it. Same shape as jarvis-view.js — untrusted
 * text in, a known-safe structure or nothing out.
 *
 * Pure: no DOM, no network, no React. Browser global or require().
 */
(function (root) {
  'use strict';

  // Exactly the five in the design spec's stage 3 table, each mapping to a
  // mutator that already exists in app.jsx. Adding a name here without a mutator
  // behind it produces a confirm dialog that does nothing, so this list and the
  // dispatcher move together.
  var INTENTS = ['task.add', 'task.complete', 'task.reschedule', 'task.setState', 'project.create'];

  // Task states, matching task-grouping.js:42/48 and the picker at app.jsx:5131.
  var STATES = ['todo', 'doing', 'waiting'];
  var PRIORITIES = ['normal', 'urgent'];

  // How much one proposal may touch. A model that decides to reschedule
  // everything should hit a wall, and Jayden should be told it hit one.
  var BULK_CAP = 20;
  var NAME_MAX = 200;

  function str(v) { return typeof v === 'string' ? v : ''; }

  // Angle brackets stripped and whitespace collapsed, for the same reason
  // jarvis-view.js does it: this is rendered as text in a confirm dialog, and a
  // task called "<script>" should read as itself.
  function clean(v, max) {
    return str(v).replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max || NAME_MAX);
  }

  // A real calendar date in the app's format, not merely a plausible string.
  // "2026-02-31" parses in JavaScript and silently becomes 3 March, which would
  // move one of Jayden's tasks to a day he never picked.
  function isDateStr(v) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str(v))) return false;
    var p = v.split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return d.getFullYear() === Number(p[0]) &&
      d.getMonth() === Number(p[1]) - 1 &&
      d.getDate() === Number(p[2]);
  }

  // Task ids are Date.now() numbers (app.jsx:3619) — positive integers. A model
  // quoting one back as a string is fine.
  //
  // Negative and fractional values are refused rather than passed through, and
  // that is about honesty rather than safety: the mutator matches on `t.id===id`
  // and would simply change nothing, while the confirm dialog said "Mark 1 task
  // done". A summary promising a change that cannot happen is worse than a
  // refusal — he clicks confirm and quietly gets nothing.
  function toId(v) {
    var n = null;
    if (typeof v === 'number') n = v;
    else if (typeof v === 'string' && /^\d+$/.test(v.trim())) n = Number(v.trim());
    if (n === null || !isFinite(n) || Math.floor(n) !== n || n <= 0) return null;
    return n;
  }

  function idList(v) {
    if (!Array.isArray(v)) return { ids: [], truncated: false };
    var out = [];
    for (var i = 0; i < v.length && out.length < BULK_CAP; i++) {
      var id = toId(v[i]);
      if (id !== null && out.indexOf(id) === -1) out.push(id);
    }
    // Truncated only if capping is what stopped us, not junk being dropped.
    return { ids: out, truncated: out.length >= BULK_CAP && v.length > BULK_CAP };
  }

  function oneOf(v, allowed, fallback) {
    return allowed.indexOf(str(v)) !== -1 ? str(v) : fallback;
  }

  // Copies only own, safe keys. JSON.parse happily produces a "__proto__" own
  // property, and spreading that into a real object is how prototypes get
  // polluted — so nothing is ever spread; fields are read one at a time.
  function get(obj, key) {
    if (!obj || typeof obj !== 'object') return undefined;
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') return undefined;
    return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
  }

  // Same tolerance as jarvis-view.js: models wrap JSON in prose and code fences
  // whatever the response format asks for.
  function extractJson(raw) {
    var text = str(raw).trim();
    if (!text) return null;
    try { return JSON.parse(text); } catch (e) { /* fall through */ }
    var first = text.indexOf('{');
    var last = text.lastIndexOf('}');
    if (first === -1 || last <= first) return null;
    try { return JSON.parse(text.slice(first, last + 1)); } catch (e2) { return null; }
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  // ── Per-intent validation ──────────────────────────────────────────────────
  // Each returns { args, truncated, summary } or null. Returning null is always
  // safe: the caller does nothing, which is the correct outcome for input that
  // could not be understood.

  function buildTaskAdd(a, opts) {
    var name = clean(get(a, 'name'));
    if (!name) return null;                    // a task with no name is not a task
    var due = get(a, 'due');
    if (due != null && !isDateStr(due)) return null;
    // An unknown category is cosmetic — it picks a colour and a grouping — so it
    // falls back rather than losing the task. An unknown state or date does not,
    // which is why those are refused outright.
    var cats = opts.categories;
    var cat = str(get(a, 'cat'));
    if (!cat || (cats && cats.indexOf(cat) === -1)) cat = 'Other';
    var priority = oneOf(get(a, 'priority'), PRIORITIES, 'normal');
    return {
      args: { name: name, cat: cat, priority: priority, due: due == null ? null : due },
      truncated: false,
      summary: 'Add "' + name + '" to your tasks' +
        (due ? ', due ' + due : '') + (priority === 'urgent' ? ', flagged urgent' : '') + '.'
    };
  }

  function buildTaskComplete(a) {
    var r = idList(get(a, 'ids'));
    if (!r.ids.length) return null;
    return {
      args: { ids: r.ids }, truncated: r.truncated,
      summary: 'Mark ' + r.ids.length + ' ' + plural(r.ids.length, 'task', 'tasks') + ' done.'
    };
  }

  function buildTaskReschedule(a) {
    var r = idList(get(a, 'ids'));
    if (!r.ids.length) return null;
    var due = get(a, 'due');
    // null clears the due date, which is a real thing to want. Anything else has
    // to be a real date — a task quietly moved to a day nobody picked is worse
    // than a proposal that was refused.
    if (due != null && !isDateStr(due)) return null;
    return {
      args: { ids: r.ids, due: due == null ? null : due }, truncated: r.truncated,
      summary: due
        ? 'Move ' + r.ids.length + ' ' + plural(r.ids.length, 'task', 'tasks') + ' to ' + due + '.'
        : 'Clear the due date on ' + r.ids.length + ' ' + plural(r.ids.length, 'task', 'tasks') + '.'
    };
  }

  function buildTaskSetState(a) {
    var r = idList(get(a, 'ids'));
    if (!r.ids.length) return null;
    var state = str(get(a, 'state'));
    if (STATES.indexOf(state) === -1) return null;   // no fallback: it is a real change
    return {
      args: { ids: r.ids, state: state }, truncated: r.truncated,
      summary: 'Set ' + r.ids.length + ' ' + plural(r.ids.length, 'task', 'tasks') + ' to "' + state + '".'
    };
  }

  function buildProjectCreate(a) {
    var title = clean(get(a, 'title'));
    var rawStages = get(a, 'stages');
    if (!title || !Array.isArray(rawStages) || !rawStages.length) return null;
    var truncated = rawStages.length > BULK_CAP;
    var stages = [];
    rawStages.slice(0, BULK_CAP).forEach(function (s) {
      var sTitle = clean(get(s, 'title'), 120);
      if (!sTitle) return;
      var rawSteps = get(s, 'steps');
      var steps = [];
      if (Array.isArray(rawSteps)) {
        if (rawSteps.length > BULK_CAP) truncated = true;
        rawSteps.slice(0, BULK_CAP).forEach(function (p) {
          var pTitle = clean(get(p, 'title'), 200);
          // `done: false` always. A model does not get to declare Jayden's work
          // already finished.
          if (pTitle) steps.push({ title: pTitle, desc: clean(get(p, 'desc'), 300), done: false });
        });
      }
      stages.push({ title: sTitle, subtitle: clean(get(s, 'subtitle'), 120), steps: steps });
    });
    if (!stages.length) return null;
    var stepCount = stages.reduce(function (n, s) { return n + s.steps.length; }, 0);
    return {
      args: { title: title, stages: stages }, truncated: truncated,
      summary: 'Create the project "' + title + '" with ' + stages.length + ' ' +
        plural(stages.length, 'stage', 'stages') + ' and ' + stepCount + ' ' +
        plural(stepCount, 'step', 'steps') + '.'
    };
  }

  var BUILDERS = {
    'task.add': buildTaskAdd,
    'task.complete': buildTaskComplete,
    'task.reschedule': buildTaskReschedule,
    'task.setState': buildTaskSetState,
    'project.create': buildProjectCreate
  };

  /**
   * Turn raw model output into a proposal, or into nothing.
   *
   * @param {string} raw          model output, possibly wrapped in prose
   * @param {object} [opts]       { categories: string[] } — the real TASK_CATS
   * @returns {{intent:string, args:object, summary:string, truncated:boolean}|null}
   *
   * The result is inert. It cannot be executed by holding it; a caller has to
   * read `intent`, look up its own mutator, and act after Jayden confirms.
   */
  function parseIntent(raw, opts) {
    var o = opts || {};
    if (!o.categories && root && root.TASK_CATS) o.categories = root.TASK_CATS;
    var obj = extractJson(raw);
    if (!obj || typeof obj !== 'object') return null;

    // Two shapes, because models produce both and neither is wrong:
    //   {"intent":"task.add","args":{...}}            — flat
    //   {"intent":{"name":"task.add","args":{...}}}   — nested, alongside `say`
    // The nested form is what the response schema asks for; the flat form is
    // what a model falls back to when it is not following one.
    var rawIntent = get(obj, 'intent');
    var nested = rawIntent && typeof rawIntent === 'object' && !Array.isArray(rawIntent);
    var name = str(nested ? get(rawIntent, 'name') : rawIntent);
    // hasOwnProperty rather than a bare lookup: 'constructor' and 'toString' are
    // on every object, and neither is an intent.
    if (INTENTS.indexOf(name) === -1 || !Object.prototype.hasOwnProperty.call(BUILDERS, name)) {
      return null;
    }

    var args = nested ? get(rawIntent, 'args') : get(obj, 'args');
    if (!args || typeof args !== 'object') args = {};
    var built = BUILDERS[name](args, o);
    if (!built) return null;

    return {
      intent: name,
      args: built.args,
      summary: built.summary,
      truncated: !!built.truncated
    };
  }

  // ── Reconciling against what actually exists ───────────────────────────────
  // `parseIntent` checks shape. It cannot know which tasks are real, so on its
  // own it would let a confirm dialog say "Move 3 tasks" when one of the three
  // ids does not exist — and Jayden would click yes and get one. Same class of
  // bug as an id no task could ever have: the dialog promises a change that
  // cannot happen.
  //
  // The spec is explicit that bulk operations show exactly what will change
  // before it changes, so the dialog is built from the dashboard, not from what
  // the model claimed. Read-only: it never touches `data`.

  var NAME_LIST_MAX = 3;   // beyond this, a count reads better than a list

  function taskList(data) {
    return (data && data.personal && Array.isArray(data.personal.tasks)) ? data.personal.tasks : [];
  }

  function nameThem(targets) {
    var names = targets.map(function (t) { return '"' + t.name + '"'; });
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  }

  function describe(verb, targets, tail) {
    var n = targets.length;
    var who = n <= NAME_LIST_MAX ? nameThem(targets)
      : n + ' ' + plural(n, 'task', 'tasks');
    return verb + ' ' + who + (tail || '') + '.';
  }

  /**
   * Check a proposal against the real dashboard.
   *
   * @param {object|null} proposal  output of parseIntent
   * @param {object} data           the dashboard document (never modified)
   * @returns {{ok:boolean, intent:string|null, args:object|null, targets:Array,
   *            missing:Array, truncated:boolean, summary:string}}
   *
   * `ok: false` means there is nothing left to confirm. The caller must not
   * offer a confirm button in that case — a button that changes nothing is a
   * worse outcome than no button.
   */
  function resolve(proposal, data) {
    var no = function (summary) {
      return { ok: false, intent: proposal ? proposal.intent : null, args: null,
        targets: [], missing: [], truncated: false, summary: summary };
    };
    if (!proposal || !proposal.intent) return no('Nothing to do.');

    // These create something new, so there is nothing to reconcile them against.
    if (proposal.intent === 'task.add' || proposal.intent === 'project.create') {
      return {
        ok: true, intent: proposal.intent, args: proposal.args, targets: [],
        missing: [], truncated: !!proposal.truncated, summary: proposal.summary
      };
    }

    var ids = (proposal.args && proposal.args.ids) || [];
    var tasks = taskList(data);
    var targets = [];
    var missing = [];

    ids.forEach(function (id) {
      var found = null;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i] && tasks[i].id === id) { found = tasks[i]; break; }
      }
      if (!found) { missing.push(id); return; }

      // Already in the requested state is not a change. Counting it would
      // inflate the number in the dialog and promise work that will not happen.
      if (proposal.intent === 'task.complete' && found.done) return;
      if (proposal.intent === 'task.setState' &&
          (found.state || 'todo') === proposal.args.state) return;

      targets.push({ id: id, name: clean(found.name, 50) || 'a task' });
    });

    if (!targets.length) {
      return no(missing.length
        ? 'Could not find those tasks any more — nothing to change.'
        : 'Nothing to change; that is already how they are.');
    }

    var summary;
    if (proposal.intent === 'task.complete') {
      summary = describe('Mark', targets, ' done');
    } else if (proposal.intent === 'task.reschedule') {
      summary = proposal.args.due
        ? describe('Move', targets, ' to ' + proposal.args.due)
        : describe('Clear the due date on', targets);
    } else {
      summary = describe('Set', targets, ' to "' + proposal.args.state + '"');
    }
    if (missing.length) {
      summary += ' (' + missing.length + ' ' + plural(missing.length, 'was', 'were') +
        ' not found and will be skipped.)';
    }

    return {
      ok: true, intent: proposal.intent,
      // Only the ids that survived. The executor must never see the rest.
      args: Object.assign({}, proposal.args, { ids: targets.map(function (t) { return t.id; }) }),
      targets: targets, missing: missing,
      truncated: !!proposal.truncated, summary: summary
    };
  }

  var api = {
    INTENTS: INTENTS,
    resolve: resolve,
    STATES: STATES,
    PRIORITIES: PRIORITIES,
    BULK_CAP: BULK_CAP,
    parseIntent: parseIntent
  };

  root.JarvisIntent = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
