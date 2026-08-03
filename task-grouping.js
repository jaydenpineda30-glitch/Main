/**
 * task-grouping.js
 * Decides which group a task belongs to, and in what order the groups display.
 *
 * There are two distinct orders here and they are NOT the same list:
 *   - match order  (groupOf, top to bottom of the if-chain) decides membership
 *   - DISPLAY_ORDER decides where each group appears on screen
 * Waiting is matched early so parked work never shows as overdue, but displays
 * near the bottom because it is not asking anything of you right now.
 *
 * No DOM, no React. Loaded as a browser global before app.js and require()-able
 * so it can be unit-tested under `npm test`.
 */
(function (root) {
  'use strict';

  var DUE_SOON_DAYS = 2;
  var UNTOUCHED_DAYS = 7;

  var DISPLAY_ORDER = ['overdue', 'dueSoon', 'doing', 'untouched', 'later', 'waiting', 'done'];

  var GROUP_LABEL = {
    overdue: 'Overdue',
    dueSoon: 'Due soon',
    doing: 'In progress',
    untouched: 'Untouched',
    later: 'Later',
    waiting: 'Waiting',
    done: 'Done'
  };

  // Whole days from bStr to aStr. Both are local YYYY-MM-DD.
  function daysApart(aStr, bStr) {
    var a = new Date(aStr + 'T00:00:00');
    var b = new Date(bStr + 'T00:00:00');
    return Math.round((a - b) / 864e5);
  }

  function groupOf(task, todayStr) {
    if (!task) return 'later';
    if (task.done) return 'done';
    if (task.state === 'waiting') return 'waiting';
    if (task.due) {
      var d = daysApart(task.due, todayStr);
      if (d < 0) return 'overdue';
      if (d <= DUE_SOON_DAYS) return 'dueSoon';
    }
    if (task.state === 'doing') return 'doing';
    var ref = task.editedAt || task.addedAt;
    if (ref && daysApart(todayStr, ref) > UNTOUCHED_DAYS) return 'untouched';
    return 'later';
  }

  function groupTasks(tasks, todayStr) {
    var out = {};
    DISPLAY_ORDER.forEach(function (g) { out[g] = []; });
    (Array.isArray(tasks) ? tasks : []).forEach(function (t) {
      out[groupOf(t, todayStr)].push(t);
    });
    // Soonest due first; undated tasks sink to the bottom of their group. Done is the
    // exception: it is a record of what happened, so it reads most-recent first by the
    // date it was finished. Sorting finished work by a due date that has since passed
    // puts it in an order that means nothing.
    DISPLAY_ORDER.forEach(function (g) {
      out[g].sort(g === 'done'
        ? function (a, b) {
            return String(b.completedAt || '').localeCompare(String(a.completedAt || ''));
          }
        : function (a, b) {
            return String(a.due || '9999-12-31').localeCompare(String(b.due || '9999-12-31'));
          });
    });
    return out;
  }

  function categoryCounts(tasks) {
    var m = {};
    (Array.isArray(tasks) ? tasks : []).forEach(function (t) {
      if (!t || t.done) return;
      var c = t.cat || 'Other';
      m[c] = (m[c] || 0) + 1;
    });
    return Object.keys(m)
      .map(function (c) { return { cat: c, count: m[c] }; })
      .sort(function (a, b) { return b.count - a.count || a.cat.localeCompare(b.cat); });
  }

  var api = {
    DISPLAY_ORDER: DISPLAY_ORDER,
    GROUP_LABEL: GROUP_LABEL,
    DUE_SOON_DAYS: DUE_SOON_DAYS,
    UNTOUCHED_DAYS: UNTOUCHED_DAYS,
    groupOf: groupOf,
    groupTasks: groupTasks,
    categoryCounts: categoryCounts
  };

  root.TaskGrouping = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
