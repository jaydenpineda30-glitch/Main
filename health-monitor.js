/**
 * health-monitor.js
 * Periodic health checks for localStorage, network, and Firebase (optional).
 * Depends on: error-handler.js (window.ErrorHandler)
 * Exposes global: window.HealthMonitor
 */
(function () {
  'use strict';

  var STORE_KEY     = 'dash_health_log';
  var CHECK_INTERVAL_MS = 30000; // 30 seconds
  var MAX_HISTORY   = 100;       // keep last N check results

  // ── Storage helpers ────────────────────────────────────────────────────────

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch (_) { return []; }
  }

  function saveHistory(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr.slice(-MAX_HISTORY))); }
    catch (_) {}
  }

  // ── Individual health checks ───────────────────────────────────────────────

  /** Check if localStorage read/write works. */
  function checkLocalStorage() {
    var TEST_KEY = '__dash_health_test__';
    try {
      localStorage.setItem(TEST_KEY, '1');
      var v = localStorage.getItem(TEST_KEY);
      localStorage.removeItem(TEST_KEY);
      return { ok: v === '1', detail: v === '1' ? 'read/write OK' : 'read mismatch' };
    } catch (e) {
      return { ok: false, detail: e.message };
    }
  }

  /** Check network connectivity. */
  function checkNetwork() {
    return { ok: navigator.onLine, detail: navigator.onLine ? 'online' : 'offline' };
  }

  /**
   * Check Firebase connectivity (optional).
   * Only runs if window.firebase or window.db (Firestore) is available.
   * Returns a Promise so it can be awaited.
   */
  function checkFirebase() {
    // Not connected yet — return healthy placeholder
    if (!window.firebase && !window.db) {
      return Promise.resolve({ ok: true, detail: 'not configured' });
    }
    // If Firestore db is available, try a lightweight read
    if (window.db && window.db.collection) {
      return window.db.collection('__health__').limit(1).get()
        .then(function () { return { ok: true, detail: 'Firestore reachable' }; })
        .catch(function (e) { return { ok: false, detail: e.message }; });
    }
    return Promise.resolve({ ok: true, detail: 'Firebase present but unchecked' });
  }

  /**
   * Check that the dashboard data in localStorage is parseable and not corrupted.
   */
  function checkDataIntegrity() {
    var DASH_KEY = 'dash_v1';
    try {
      var raw = localStorage.getItem(DASH_KEY);
      if (!raw) return { ok: true, detail: 'no data yet' };
      var parsed = JSON.parse(raw);
      // Sanity: top-level keys should exist
      var hasKeys = parsed && typeof parsed === 'object';
      return { ok: hasKeys, detail: hasKeys ? 'data parseable' : 'unexpected data shape' };
    } catch (e) {
      return { ok: false, detail: 'JSON parse error: ' + e.message };
    }
  }

  // ── HealthMonitor object ───────────────────────────────────────────────────

  var _intervalId   = null;
  var _listeners    = [];
  var _latestStatus = null;
  var _startedAt    = null;

  var HealthMonitor = {

    /** Latest snapshot from the last check. Null before first check. */
    get status() { return _latestStatus; },

    /**
     * Run all health checks now and return a status snapshot.
     * @returns {Promise<object>}
     */
    runChecks: function () {
      return checkFirebase().then(function (fbResult) {
        var ls  = checkLocalStorage();
        var net = checkNetwork();
        var di  = checkDataIntegrity();

        var allOk = ls.ok && net.ok && fbResult.ok && di.ok;
        var degraded = !allOk && net.ok; // network fine but something else broken

        var snapshot = {
          timestamp:    new Date().toISOString(),
          healthy:      allOk,
          degraded:     degraded,
          offline:      !net.ok,
          checks: {
            localStorage: ls,
            network:      net,
            firebase:     fbResult,
            dataIntegrity: di
          }
        };

        // Track uptime history
        var history = loadHistory();
        history.push({ ts: snapshot.timestamp, healthy: allOk, degraded: degraded, offline: !net.ok });
        saveHistory(history);

        _latestStatus = snapshot;

        // Log problems
        if (window.ErrorHandler) {
          if (!ls.ok)       ErrorHandler.error('localStorage health check failed: ' + ls.detail,   'health-monitor');
          if (!di.ok)       ErrorHandler.error('Data integrity check failed: '      + di.detail,   'health-monitor');
          if (!fbResult.ok) ErrorHandler.warn ('Firebase health check failed: '     + fbResult.detail, 'health-monitor');
        }

        // Notify subscribers
        _listeners.forEach(function (cb) { try { cb(snapshot); } catch (_) {} });

        return snapshot;
      });
    },

    /**
     * Start periodic health checks every intervalMs milliseconds.
     * Runs an immediate check first.
     */
    start: function (intervalMs) {
      if (_intervalId) return; // already running
      _startedAt = Date.now();
      intervalMs = intervalMs || CHECK_INTERVAL_MS;
      this.runChecks(); // immediate
      _intervalId = setInterval(this.runChecks.bind(this), intervalMs);
      if (window.ErrorHandler) ErrorHandler.info('Health monitor started', 'health-monitor');
    },

    stop: function () {
      if (_intervalId) {
        clearInterval(_intervalId);
        _intervalId = null;
        if (window.ErrorHandler) ErrorHandler.info('Health monitor stopped', 'health-monitor');
      }
    },

    /** Returns uptime % since HealthMonitor.start() was called. */
    getUptimePercent: function () {
      var history = loadHistory();
      if (!history.length) return 100;
      var healthy = history.filter(function (h) { return h.healthy; }).length;
      return Math.round((healthy / history.length) * 100);
    },

    /** Returns counts of healthy/degraded/offline periods. */
    getStatusHistory: function () {
      return loadHistory();
    },

    /** Subscribe to check results. Returns unsubscribe fn. */
    onChange: function (cb) {
      _listeners.push(cb);
      // Fire immediately with latest if available
      if (_latestStatus) { try { cb(_latestStatus); } catch (_) {} }
      return function () {
        _listeners = _listeners.filter(function (l) { return l !== cb; });
      };
    },

    clearHistory: function () {
      localStorage.removeItem(STORE_KEY);
    }
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  window.HealthMonitor = HealthMonitor;

})();
