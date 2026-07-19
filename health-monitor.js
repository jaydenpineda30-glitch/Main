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
      var r = { ok: true, detail: 'not configured' };
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

  // ── Groq key check (cached, max once per 5 min) ───────────────────────────

  var _groqCache = null;

  function checkGroq() {
    var now = Date.now();
    if (_groqCache && now - _groqCache.ts < 300000) {
      return Promise.resolve(_groqCache.result);
    }
    var key = (localStorage.getItem('__groq_key__') || '').trim();
    if (!key) {
      var r = { ok: null, detail: 'no key set' };
      _groqCache = { result: r, ts: now };
      return Promise.resolve(r);
    }
    return fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [{ role: 'user', content: 'ok' }],
          max_tokens: 1
        })
      }
    ).then(function (res) {
      var r = res.ok
        ? { ok: true,  detail: 'key valid' }
        : { ok: false, detail: 'key expired or invalid' };
      _groqCache = { result: r, ts: now };
      return r;
    }).catch(function () {
      var r = { ok: false, detail: 'could not reach Groq' };
      _groqCache = { result: r, ts: now };
      return r;
    });
  }

  // ── Market data key check: Finnhub (primary) + TwelveData (fallback) ──────
  // Cached, max once per 5 min. Finnhub returns real 401/403 on a bad key;
  // TwelveData returns HTTP 200 with { status: 'error' } instead, so its body
  // has to be inspected rather than trusting res.ok.

  var _marketCache = null;

  function _pingFinnhub(key) {
    if (!key) return Promise.resolve({ ok: null, detail: 'no key set' });
    return fetch('https://finnhub.io/api/v1/quote?symbol=AAPL&token=' + key)
      .then(function (res) {
        return res.ok
          ? { ok: true,  detail: 'key valid' }
          : { ok: false, detail: 'key expired or invalid' };
      })
      .catch(function () { return { ok: false, detail: 'could not reach Finnhub' }; });
  }

  function _pingTwelveData(key) {
    if (!key) return Promise.resolve({ ok: null, detail: 'no key set' });
    return fetch('https://api.twelvedata.com/quote?symbol=AAPL&apikey=' + key)
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          var bad = body && body.status === 'error';
          return bad
            ? { ok: false, detail: 'key expired or invalid' }
            : { ok: true,  detail: 'key valid' };
        });
      })
      .catch(function () { return { ok: false, detail: 'could not reach TwelveData' }; });
  }

  function checkMarketData() {
    var now = Date.now();
    if (_marketCache && now - _marketCache.ts < 300000) {
      return Promise.resolve(_marketCache.result);
    }
    var fhKey = (localStorage.getItem('__finnhub_key__') || '').trim();
    var tdKey = (localStorage.getItem('__twelvedata_key__') || '').trim();

    return Promise.all([_pingFinnhub(fhKey), _pingTwelveData(tdKey)]).then(function (results) {
      var fh = results[0];
      var td = results[1];
      var r;
      if (fh.ok === true) {
        r = { ok: true, detail: 'Finnhub OK (primary)' };
      } else if (fh.ok === null && td.ok === null) {
        r = { ok: null, detail: 'no keys set' };
      } else if (td.ok === true) {
        r = { ok: null, detail: 'Finnhub ' + fh.detail + ' · using TwelveData fallback' };
      } else {
        r = { ok: false, detail: 'Finnhub ' + fh.detail + ' · TwelveData ' + td.detail };
      }
      _marketCache = { result: r, ts: now };
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
      return Promise.all([checkFirebase(), checkGemini(), checkGroq(), checkMarketData()]).then(function (results) {
        var fb   = results[0];
        var gem  = results[1];
        var groq = results[2];
        var mkt  = results[3];
        var ls   = checkLocalStorage();
        var net  = checkNetwork();

        var allOk    = ls.ok && net.ok && fb.ok && gem.ok && groq.ok !== false && mkt.ok !== false;
        var snapshot = {
          timestamp: new Date().toISOString(),
          healthy:   allOk,
          degraded:  !allOk && net.ok,
          offline:   !net.ok,
          checks: {
            localStorage: ls,
            network:      net,
            firebase:     fb,
            geminiKey:    gem,
            groqKey:      groq,
            marketData:   mkt
          }
        };

        _latestStatus = snapshot;

        if (window.ErrorHandler) {
          if (!ls.ok) ErrorHandler.error('localStorage check failed: ' + ls.detail, 'health-monitor');
          if (!fb.ok) ErrorHandler.warn ('Firebase check failed: '     + fb.detail, 'health-monitor');
          if (groq.ok === false) ErrorHandler.warn('Groq check failed: '       + groq.detail, 'health-monitor');
          if (mkt.ok  === false) ErrorHandler.warn('Market data check failed: ' + mkt.detail,  'health-monitor');
        }

        _listeners.forEach(function (cb) { try { cb(snapshot); } catch (_) {} });
        return snapshot;
      });
    },

    /** Start periodic checks. First run is deferred ~3s so its Firebase ping
     *  doesn't compete with the critical initial Firestore data load on mount. */
    start: function (intervalMs) {
      if (_intervalId) return;
      var run = this.runChecks.bind(this);
      setTimeout(run, 3000);
      _intervalId = setInterval(run, intervalMs || CHECK_INTERVAL_MS);
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
