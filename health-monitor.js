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
    if (!window.db) {
      return Promise.resolve({ ok: true, detail: 'not configured' });
    }
    return window.db.collection('__health__').limit(1).get()
      .then(function ()  { return { ok: true,  detail: 'Firestore reachable' }; })
      .catch(function (e){ return { ok: false, detail: e.message }; });
  }

  // ── HealthMonitor ──────────────────────────────────────────────────────────

  var _intervalId   = null;
  var _listeners    = [];
  var _latestStatus = null;

  var HealthMonitor = {

    /** Most recent check snapshot. Null before first check. */
    get status() { return _latestStatus; },

    /** Run all three checks now. Returns a Promise<snapshot>. */
    runChecks: function () {
      return checkFirebase().then(function (fb) {
        var ls  = checkLocalStorage();
        var net = checkNetwork();

        var allOk    = ls.ok && net.ok && fb.ok;
        var snapshot = {
          timestamp: new Date().toISOString(),
          healthy:   allOk,
          degraded:  !allOk && net.ok,
          offline:   !net.ok,
          checks: {
            localStorage: ls,
            network:      net,
            firebase:     fb
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
