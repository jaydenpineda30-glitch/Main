/**
 * home-layout.js
 * Pure layout logic for the dashboard home grid — the card registry plus the
 * array operations that reorder and resize cards.
 *
 * No DOM, no React, no window. Loaded as a browser global before app.js and
 * also require()-able so it can be unit-tested under `npm test`.
 *
 * The registry is the single source of truth for which cards exist on the home
 * page. Adding a card here makes it appear at the bottom of every existing
 * saved layout without resetting anyone's arrangement — see normalizeLayout.
 */
(function (root) {
  'use strict';

  var MIN_SPAN = 1;
  var MAX_SPAN = 3;

  // Order here is the default order. `pinned` cards render outside the
  // reorderable grid and never appear in a saved layout.
  var HOME_CARDS = [
    { id: 'calendar',    title: 'Calendar',             defaultSpan: 3, pinned: true },
    { id: 'shopping',    title: 'Shopping',             defaultSpan: 1, pinned: false },
    { id: 'weather',     title: 'Weather',              defaultSpan: 1, pinned: false },
    { id: 'checkin',     title: 'Daily Check-in',       defaultSpan: 1, pinned: false },
    { id: 'goals',       title: 'Goals',                defaultSpan: 1, pinned: false },
    { id: 'assessments', title: 'Upcoming assessments', defaultSpan: 1, pinned: false },
    { id: 'gym-next',    title: 'Next gym session',     defaultSpan: 1, pinned: false },
    { id: 'bodyweight',  title: 'Weekly body weight',   defaultSpan: 1, pinned: false },
    { id: 'tasks',       title: 'Tasks',                defaultSpan: 1, pinned: false },
    { id: 'classes',     title: 'Upcoming Classes',     defaultSpan: 1, pinned: false },
    { id: 'necessities', title: 'Weekly necessities',   defaultSpan: 1, pinned: false }
  ];

  function movableCards() {
    return HOME_CARDS.filter(function (c) { return !c.pinned; });
  }

  function defaultLayout() {
    return movableCards().map(function (c) {
      return { id: c.id, span: c.defaultSpan };
    });
  }

  function clampSpan(n) {
    var v = Math.round(Number(n));
    if (!isFinite(v)) return MIN_SPAN;
    return Math.max(MIN_SPAN, Math.min(MAX_SPAN, v));
  }

  /**
   * Reconcile a saved layout against the registry. Always returns a complete,
   * valid layout — one entry per movable card, no duplicates, spans in range.
   * Never mutates the input.
   */
  function normalizeLayout(saved) {
    var known = {};
    movableCards().forEach(function (c) { known[c.id] = c; });

    var out = [];
    var seen = {};

    (Array.isArray(saved) ? saved : []).forEach(function (e) {
      if (!e || typeof e.id !== 'string') return;
      if (!known[e.id] || seen[e.id]) return;   // unknown, pinned, or duplicate
      seen[e.id] = true;
      var span = (e.span === null || e.span === undefined) ? known[e.id].defaultSpan : e.span;
      out.push({ id: e.id, span: clampSpan(span) });
    });

    // Cards the saved layout has never seen go to the bottom, in registry order.
    movableCards().forEach(function (c) {
      if (!seen[c.id]) out.push({ id: c.id, span: c.defaultSpan });
    });

    return out;
  }

  function moveCard(layout, fromIdx, toIdx) {
    var out = layout.slice();
    if (fromIdx < 0 || fromIdx >= out.length) return out;
    var to = Math.max(0, Math.min(out.length - 1, toIdx));
    var moved = out.splice(fromIdx, 1)[0];
    out.splice(to, 0, moved);
    return out;
  }

  function setSpan(layout, id, span) {
    return layout.map(function (e) {
      return e.id === id ? { id: e.id, span: clampSpan(span) } : e;
    });
  }

  var api = {
    HOME_CARDS: HOME_CARDS,
    MIN_SPAN: MIN_SPAN,
    MAX_SPAN: MAX_SPAN,
    movableCards: movableCards,
    defaultLayout: defaultLayout,
    normalizeLayout: normalizeLayout,
    moveCard: moveCard,
    setSpan: setSpan,
    clampSpan: clampSpan
  };

  root.HomeLayout = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
