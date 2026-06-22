/**
 * health-monitor.js
 * Three periodic health checks: localStorage, network, Firebase.
 * Depends on: error-handler.js (window.ErrorHandler)
 * Exposes global: window.HealthMonitor
 */
(function () {
  'use strict';

  var CHECK_INTERVAL_MS = 30000; // 30 seconds

  // ── The three checks ───────────────────────────────────────────────────────

  /** 1. Can we read and write localStorage? */
  function checkLocalStorage() {
    var KEY = '__dash_health__';
    try {
      localStorage.setItem(KEY, '1');
      var v = localStorage.getItem(KEY);
      localStorage.removeItem(KEY);
      return { ok: v === '1', detail: v === '1' ? 'read/write OK' : 'read mismatch' };
    } catch (e) {
      return { ok: false, detail: e.message };
    }
  }

  /** 2. Is the network up? */
  function checkNetwork() {
    return { ok: navigator.onLine, detail: navigator.onLine ? 'online' : 'offline' };
  }

  /**
   * 3. Is Firebase responding?
   * Skips gracefully if Firebase is not configured yet.
   */
  function checkFirebase() {
    var db   = window._db || window.db;
    var user = window._currentUser;
    if (!db)   return Promise.resolve({ ok: true, detail: 'not configured' });
    if (!user) return Promise.resolve({ ok: true, detail: 'not signed in yet' });
    // Read the user's own doc — always allowed by security rules
    return db.collection('users').doc(user.uid).get()
      .then(function ()  { return { ok: true,  detail: 'Firestore reachable' }; })
      .catch(function (e){ return { ok: false, detail: e.message }; });
  }

  // ── Gemini key check (cached, max once per 5 min) ─────────────────────────

  var _geminiCache = null;

  function checkGemini() {
    var now = Date.now();
    if (_geminiCache && now - _geminiCache.ts < 300000) {
      return Promise.resolve(_geminiCache.result);
    }
    var key = (localStorage.getItem('__gemini_key__') || '').trim();
    if (!key) {
      var r = { ok: false, detail: 'no key saved' };
      _geminiCache = { result: r, ts: now };
      return Promise.resolve(r);
    }
    return fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ok' }] }], generationConfig: { maxOutputTokens: 1 } })
      }
    ).then(function (res) {
      var r = res.ok
        ? { ok: true,  detail: 'key valid' }
        : { ok: false, detail: 'key expired or invalid' };
      _geminiCache = { result: r, ts: now };
      return r;
    }).catch(function () {
      var r = { ok: false, detail: 'could not reach Gemini' };
      _geminiCache = { result: r, ts: now };
      return r;
    });
  }

  // ── HealthMonitor ──────────────────────────────────────────────────────────

  var _intervalId   = null;
  var _listeners    = [];
  var _latestStatus = null;

  var HealthMonitor = {

    /** Most recent check snapshot. Null before first check. */
    get status() { return _latestStatus; },

    /** Run all checks now. Returns a Promise<snapshot>. */
    runChecks: function () {
      return Promise.all([checkFirebase(), checkGemini()]).then(function (results) {
        var fb  = results[0];
        var gem = results[1];
        var ls  = checkLocalStorage();
        var net = checkNetwork();

        var allOk    = ls.ok && net.ok && fb.ok && gem.ok;
        var snapshot = {
          timestamp: new Date().toISOString(),
          healthy:   allOk,
          degraded:  !allOk && net.ok,
          offline:   !net.ok,
          checks: {
            localStorage: ls,
            network:      net,
            firebase:     fb,
            geminiKey:    gem
          }
        };

        _latestStatus = snapshot;

        if (window.ErrorHandler) {
          if (!ls.ok) ErrorHandler.error('localStorage check failed: ' + ls.detail, 'health-monitor');
          if (!fb.ok) ErrorHandler.warn ('Firebase check failed: '     + fb.detail, 'health-monitor');
        }

        _listeners.forEach(function (cb) { try { cb(snapshot); } catch (_) {} });
        return snapshot;
      });
    },

    /** Start periodic checks. Runs one immediately. */
    start: function (intervalMs) {
      if (_intervalId) return;
      this.runChecks();
      _intervalId = setInterval(this.runChecks.bind(this), intervalMs || CHECK_INTERVAL_MS);
    },

    stop: function () {
      if (_intervalId) { clearInterval(_intervalId); _intervalId = null; }
    },

    /** Subscribe to check results. Returns unsubscribe fn. */
    onChange: function (cb) {
      _listeners.push(cb);
      if (_latestStatus) { try { cb(_latestStatus); } catch (_) {} }
      return function () {
        _listeners = _listeners.filter(function (l) { return l !== cb; });
      };
    }
  };

  window.HealthMonitor = HealthMonitor;

})();
