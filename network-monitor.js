/**
 * network-monitor.js
 * Detects online/offline transitions, queues failed operations, and
 * auto-retries them when the connection returns.
 *
 * Depends on: error-handler.js (window.ErrorHandler)
 * Exposes global: window.NetworkMonitor
 *
 * Usage:
 *   // Queue an operation that may fail when offline
 *   NetworkMonitor.queue('saveReflection', function() {
 *     return fetch('/api/reflection', { method:'POST', body: JSON.stringify(data) });
 *   });
 *
 *   // Listen for online/offline changes
 *   NetworkMonitor.onChange(function(isOnline) {
 *     console.log(isOnline ? 'Back online!' : 'Gone offline');
 *   });
 */
(function () {
  'use strict';

  var QUEUE_KEY  = 'dash_op_queue';
  var MAX_QUEUE  = 50;

  // ── Persistent operation queue (survives page refresh) ────────────────────

  function loadQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); }
    catch (_) { return []; }
  }

  function saveQueue(q) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE))); }
    catch (_) {}
  }

  // ── In-memory function registry ───────────────────────────────────────────
  // We can't serialise functions to localStorage, so we store a name + args,
  // then look up the live function in a registry when we replay.

  var _registry = {};

  /**
   * Register a named operation factory.
   * @param {string}   name   Unique key for this operation type.
   * @param {function} factory  Called with (args) — must return a Promise.
   */
  function registerOp(name, factory) {
    _registry[name] = factory;
  }

  // ── NetworkMonitor object ─────────────────────────────────────────────────

  var _listeners  = [];
  var _isOnline   = navigator.onLine;
  var _isReplaying = false;

  function notifyListeners(isOnline) {
    _listeners.forEach(function (cb) { try { cb(isOnline); } catch (_) {} });
  }

  function log(msg, sev, extra) {
    if (window.ErrorHandler) ErrorHandler.log(msg, sev || 'info', 'network-monitor', extra);
    else console.log('[network-monitor]', msg, extra || '');
  }

  var NetworkMonitor = {

    get isOnline()  { return _isOnline; },
    get queueSize() { return loadQueue().length; },

    /** Subscribe to online/offline changes. Returns unsubscribe fn. */
    onChange: function (cb) {
      _listeners.push(cb);
      return function () {
        _listeners = _listeners.filter(function (l) { return l !== cb; });
      };
    },

    /**
     * Register a named operation type so queued items can be replayed.
     * Call this once at startup for each operation you want to make queue-able.
     *
     * Example:
     *   NetworkMonitor.register('saveToFirebase', function(args) {
     *     return firebase.firestore().doc(args.path).set(args.data);
     *   });
     */
    register: registerOp,

    /**
     * Queue an operation to be executed now (if online) or when back online.
     * @param {string}   name  Registered operation name.
     * @param {object}   args  Serialisable arguments passed to the factory.
     * @param {object}   [opts]
     * @param {number}   [opts.maxRetries=3]
     * @param {boolean}  [opts.runNow=true]  Try immediately if online.
     */
    queue: function (name, args, opts) {
      opts = Object.assign({ maxRetries: 3, runNow: true }, opts || {});

      var entry = {
        id:         Date.now().toString(36),
        name:       name,
        args:       args || {},
        queuedAt:   new Date().toISOString(),
        retries:    0,
        maxRetries: opts.maxRetries
      };

      if (_isOnline && opts.runNow && _registry[name]) {
        return this._execute(entry);
      }

      var q = loadQueue();
      q.push(entry);
      saveQueue(q);

      log('Queued operation "' + name + '" (' + loadQueue().length + ' pending)', 'info');
      notifyListeners(_isOnline);
      return Promise.resolve({ queued: true });
    },

    /**
     * Replay all queued operations (called automatically when going online).
     * Can also be triggered manually (e.g. a "Sync now" button).
     */
    replayQueue: function () {
      if (_isReplaying) return Promise.resolve();
      var q = loadQueue();
      if (!q.length) return Promise.resolve();

      _isReplaying = true;
      log('Replaying ' + q.length + ' queued operations', 'info');

      var self = this;
      var remaining = q.slice();

      function next() {
        if (!remaining.length) {
          _isReplaying = false;
          notifyListeners(_isOnline);
          return Promise.resolve();
        }
        var entry = remaining.shift();
        return self._execute(entry).then(next).catch(function () {
          // _execute already re-queues failures — keep going
          return next();
        });
      }

      return next();
    },

    /** Execute a single queued entry. Removes from queue on success, re-queues on failure. */
    _execute: function (entry) {
      var factory = _registry[entry.name];
      if (!factory) {
        log('No factory registered for "' + entry.name + '" — dropping', 'warn');
        this._removeFromQueue(entry.id);
        return Promise.resolve({ dropped: true });
      }

      var self = this;
      return Promise.resolve()
        .then(function () { return factory(entry.args); })
        .then(function (result) {
          self._removeFromQueue(entry.id);
          log('Operation "' + entry.name + '" succeeded', 'info');
          notifyListeners(_isOnline);
          return result;
        })
        .catch(function (err) {
          entry.retries = (entry.retries || 0) + 1;
          if (entry.retries >= entry.maxRetries) {
            log('Operation "' + entry.name + '" failed after ' + entry.retries + ' retries — dropping', 'error', { error: err });
            self._removeFromQueue(entry.id);
          } else {
            // Update retry count in queue
            var q = loadQueue().map(function (item) {
              return item.id === entry.id ? entry : item;
            });
            saveQueue(q);
            log('Operation "' + entry.name + '" failed (attempt ' + entry.retries + '), will retry', 'warn');
          }
          throw err;
        });
    },

    _removeFromQueue: function (id) {
      saveQueue(loadQueue().filter(function (item) { return item.id !== id; }));
    },

    getQueue: function () {
      return loadQueue();
    },

    clearQueue: function () {
      localStorage.removeItem(QUEUE_KEY);
      notifyListeners(_isOnline);
    }
  };

  // ── Online / offline event listeners ──────────────────────────────────────

  window.addEventListener('online', function () {
    _isOnline = true;
    log('Network online — replaying queue', 'info');
    notifyListeners(true);
    NetworkMonitor.replayQueue();
  });

  window.addEventListener('offline', function () {
    _isOnline = false;
    log('Network offline — operations will be queued', 'warn');
    notifyListeners(false);
  });

  // ── Export ─────────────────────────────────────────────────────────────────
  window.NetworkMonitor = NetworkMonitor;

})();
