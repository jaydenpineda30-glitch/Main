/**
 * error-handler.js
 * Core error logging, retry logic, and analytics.
 * No external dependencies — uses localStorage for persistence.
 * Exposes global: window.ErrorHandler
 */
(function () {
  'use strict';

  var STORE_KEY   = 'dash_error_log';
  var MAX_ENTRIES = 500; // keep last N log entries

  var SEV = { DEBUG: 'debug', INFO: 'info', WARN: 'warn', ERROR: 'error', CRITICAL: 'critical' };

  // ── Storage helpers ────────────────────────────────────────────────────────

  function loadLogs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch (_) { return []; }
  }

  function saveLogs(logs) {
    var trimmed = logs.slice(-MAX_ENTRIES);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(trimmed));
    } catch (_) {
      // Storage full — keep only the 50 most recent critical/error entries
      var rescue = trimmed.filter(function (l) {
        return l.severity === SEV.ERROR || l.severity === SEV.CRITICAL;
      }).slice(-50);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(rescue)); } catch (_2) {}
    }
  }

  // ── Device snapshot ────────────────────────────────────────────────────────

  function deviceInfo() {
    return {
      userAgent:  navigator.userAgent,
      online:     navigator.onLine,
      language:   navigator.language,
      screen:     window.screen.width + 'x' + window.screen.height,
      url:        window.location.href,
      ts:         new Date().toISOString()
    };
  }

  // ── ErrorHandler object ────────────────────────────────────────────────────

  var ErrorHandler = {
    SEVERITY: SEV,
    _listeners: [], // callbacks registered via onError()

    /**
     * Core log method.
     * @param {string}  message   Human-readable description.
     * @param {string}  severity  One of ErrorHandler.SEVERITY.*
     * @param {string}  source    Feature/module name ("firebase", "gym", etc.)
     * @param {object}  extra     Optional: { error, userAction, data, … }
     */
    log: function (message, severity, source, extra) {
      severity = severity || SEV.ERROR;
      source   = source   || 'app';
      extra    = extra    || {};

      var entry = {
        id:        Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        timestamp: new Date().toISOString(),
        severity:  severity,
        message:   message,
        source:    source,
        device:    deviceInfo(),
        stack:     (extra.error && extra.error.stack) || null,
        errorName: (extra.error && extra.error.name)  || null,
        userAction: extra.userAction || null,
        data:       extra.data       || null
      };

      var logs = loadLogs();
      logs.push(entry);
      saveLogs(logs);

      // Mirror to console with appropriate level
      var fn = (severity === SEV.CRITICAL || severity === SEV.ERROR)
        ? console.error
        : severity === SEV.WARN
          ? console.warn
          : console.log;
      fn('[' + severity.toUpperCase() + '][' + source + ']', message, extra.error || '');

      // Notify listeners (e.g. monitoring dashboard)
      this._listeners.forEach(function (cb) { try { cb(entry); } catch (_) {} });

      return entry;
    },

    // Convenience shortcuts
    debug:    function (msg, src, extra) { return this.log(msg, SEV.DEBUG,    src, extra); },
    info:     function (msg, src, extra) { return this.log(msg, SEV.INFO,     src, extra); },
    warn:     function (msg, src, extra) { return this.log(msg, SEV.WARN,     src, extra); },
    error:    function (msg, src, extra) { return this.log(msg, SEV.ERROR,    src, extra); },
    critical: function (msg, src, extra) { return this.log(msg, SEV.CRITICAL, src, extra); },

    // ── Query & export ───────────────────────────────────────────────────────

    getLogs: function (filter) {
      var logs = loadLogs();
      if (!filter) return logs;
      return logs.filter(function (l) {
        if (filter.severity && l.severity !== filter.severity) return false;
        if (filter.source   && l.source   !== filter.source)   return false;
        if (filter.since    && l.timestamp < filter.since)      return false;
        return true;
      });
    },

    getRecent: function (n) {
      return loadLogs().slice(-(n || 20));
    },

    clearLogs: function () {
      localStorage.removeItem(STORE_KEY);
      this.info('Logs cleared by user', 'error-handler');
    },

    exportLogs: function () {
      var logs = loadLogs();
      var blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href     = url;
      a.download = 'dashboard-errors-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.info('Logs exported', 'error-handler', { data: { count: logs.length } });
    },

    // ── Analytics ────────────────────────────────────────────────────────────

    getAnalytics: function () {
      var logs      = loadLogs();
      var bySource  = {};
      var bySev     = {};
      var byHour    = {};
      var msgCount  = {};
      var now       = Date.now();
      var weekAgo   = new Date(now - 7 * 864e5).toISOString();

      logs.forEach(function (l) {
        bySource[l.source]   = (bySource[l.source]   || 0) + 1;
        bySev[l.severity]    = (bySev[l.severity]    || 0) + 1;
        msgCount[l.message]  = (msgCount[l.message]  || 0) + 1;
        var h = new Date(l.timestamp).getHours();
        byHour[h] = (byHour[h] || 0) + 1;
      });

      var topErrors = Object.keys(msgCount)
        .map(function (k) { return { message: k, count: msgCount[k] }; })
        .sort(function (a, b) { return b.count - a.count; })
        .slice(0, 5);

      var thisWeek = logs.filter(function (l) { return l.timestamp >= weekAgo; });

      return {
        total:      logs.length,
        thisWeek:   thisWeek.length,
        bySource:   bySource,
        bySeverity: bySev,
        byHour:     byHour,
        topErrors:  topErrors
      };
    },

    // ── Subscriptions ────────────────────────────────────────────────────────

    /** Subscribe to new log entries. Returns an unsubscribe function. */
    onError: function (cb) {
      this._listeners.push(cb);
      return function () {
        this._listeners = this._listeners.filter(function (l) { return l !== cb; });
      }.bind(this);
    },

    // ── Utility wrappers ─────────────────────────────────────────────────────

    /** Wrap a sync function so uncaught errors are auto-logged. */
    wrap: function (fn, source) {
      var self = this;
      return function () {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          self.error(e.message || String(e), source || 'wrapped', { error: e });
          throw e;
        }
      };
    },

    /**
     * Retry an async operation with exponential backoff.
     *
     * Usage:
     *   await ErrorHandler.withRetry(
     *     function(attempt) { return saveToFirebase(data); },
     *     { maxRetries: 3, baseDelay: 1000, source: 'firebase' }
     *   );
     */
    withRetry: function (fn, options) {
      var opts = Object.assign(
        { maxRetries: 3, baseDelay: 1000, source: 'retry' },
        options || {}
      );
      var self    = this;
      var attempt = 0;

      function attempt_() {
        attempt++;
        return Promise.resolve()
          .then(function () { return fn(attempt); })
          .catch(function (err) {
            var isFinal = attempt >= opts.maxRetries;
            self.log(
              'Attempt ' + attempt + '/' + opts.maxRetries + ' failed: ' + (err.message || err),
              isFinal ? SEV.ERROR : SEV.WARN,
              opts.source,
              { error: err, data: { attempt: attempt } }
            );
            if (isFinal) throw err;
            var delay = opts.baseDelay * Math.pow(2, attempt - 1);
            return new Promise(function (res) { setTimeout(res, delay); }).then(attempt_);
          });
      }

      return attempt_();
    }
  };

  // ── Global error capture ───────────────────────────────────────────────────

  window.addEventListener('error', function (ev) {
    ErrorHandler.error(ev.message || 'Uncaught error', 'window', {
      error: ev.error,
      data: { filename: ev.filename, line: ev.lineno, col: ev.colno }
    });
  });

  window.addEventListener('unhandledrejection', function (ev) {
    var msg = ev.reason
      ? (ev.reason.message || String(ev.reason))
      : 'Unhandled promise rejection';
    ErrorHandler.error(msg, 'promise', { error: ev.reason instanceof Error ? ev.reason : null });
  });

  // ── Export ─────────────────────────────────────────────────────────────────
  window.ErrorHandler = ErrorHandler;

})();
