/**
 * week-utils.js
 * Monday-based week boundaries.
 *
 * The weekly necessities card resets by DERIVATION, not by a scheduled job:
 * a tick counts only if it falls inside the current week. Nothing has to run
 * on Monday morning, so the reset is correct even if the dashboard is not
 * opened for a fortnight, and it cannot disagree between two devices.
 *
 * No DOM, no React. Loaded as a browser global before app.js and require()-able.
 */
(function (root) {
  'use strict';

  // Local calendar date. Never toISOString() — that shifts to UTC and moves
  // the day boundary, which in Sydney is wrong for most of the evening.
  function localDateStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function weekStartStr(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    var dow = d.getDay();                 // 0 = Sunday
    var off = dow === 0 ? -6 : 1 - dow;   // back to Monday
    d.setDate(d.getDate() + off);
    return localDateStr(d);
  }

  function isDoneThisWeek(tickDateStr, todayStr) {
    if (!tickDateStr) return false;
    return weekStartStr(tickDateStr) === weekStartStr(todayStr);
  }

  // 1/7 on Monday through 1 on Sunday — how much of the week is spent.
  function weekElapsedFraction(todayStr) {
    var d = new Date(todayStr + 'T00:00:00');
    var dow = d.getDay();
    var idx = dow === 0 ? 6 : dow - 1;    // Monday = 0 … Sunday = 6
    return (idx + 1) / 7;
  }

  var api = {
    localDateStr: localDateStr,
    weekStartStr: weekStartStr,
    isDoneThisWeek: isDoneThisWeek,
    weekElapsedFraction: weekElapsedFraction
  };

  root.WeekUtils = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
