/**
 * gcal-sync.js
 * Multi-account Google Calendar sync via GIS + GAPI.
 * Supports connecting multiple Google accounts simultaneously.
 * Exposes global: window.GCalSync
 */
(function () {
  'use strict';

  var CLIENT_ID = '134399742010-ls72tfl37fgre7ip3oohrmq65ln1ilrf.apps.googleusercontent.com';
  var SCOPE     = 'https://www.googleapis.com/auth/calendar.readonly';
  var CACHE_KEY = '__gcal_events__';
  var SEL_KEY   = '__gcal_selected__';
  var ACC_KEY   = '__gcal_accounts__';

  // _accounts: [{ email, token, calendars: [{id, summary, backgroundColor}] }]
  var _accounts      = [];
  var _selectedIds   = [];
  var _tokenClient   = null;
  var _gapiReady     = false;
  var _refreshTimers = {};

  try { _selectedIds = JSON.parse(localStorage.getItem(SEL_KEY) || '[]'); } catch (_) {}

  // ── Callbacks into React ───────────────────────────────────────────────────

  function push() {
    // Build merged calendar list across all accounts
    var allCals = [];
    _accounts.forEach(function (acc) {
      (acc.calendars || []).forEach(function (cal) {
        allCals.push(Object.assign({}, cal, { _email: acc.email }));
      });
    });
    if (window.__dashSetGcalCalendars) window.__dashSetGcalCalendars(allCals);
    if (window.__dashSetGcalConnected) window.__dashSetGcalConnected(_accounts.length > 0);
    if (window.__dashSetGcalSelectedIds) window.__dashSetGcalSelectedIds(_selectedIds.slice());
  }

  function pushEvents(evs) {
    if (window.__dashSetGcalEvents) window.__dashSetGcalEvents(evs || []);
  }

  // ── Event parsing ──────────────────────────────────────────────────────────

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function parseEvent(ev, calId, calColor, calName, accountEmail) {
    var start = ev.start, end = ev.end;
    var date, time, allDay = false;
    if (start.date) {
      date = start.date; time = 'All day'; allDay = true;
    } else {
      var sd = new Date(start.dateTime);
      var ed = new Date(end ? end.dateTime : start.dateTime);
      date = sd.toISOString().slice(0, 10);
      time = pad(sd.getHours()) + ':' + pad(sd.getMinutes()) +
             '–' + pad(ed.getHours()) + ':' + pad(ed.getMinutes());
    }
    return {
      id: 'gcal_' + ev.id,
      date: date, time: time,
      title: ev.summary || '(no title)',
      location: ev.location || null,
      description: ev.description || null,
      gcal: true, allDay: allDay,
      calId: calId, calColor: calColor || '#4285F4', calName: calName || 'Google',
      _email: accountEmail || null
    };
  }

  // ── Fetch events for all accounts ─────────────────────────────────────────

  function fetchAll() {
    if (!_gapiReady || _accounts.length === 0) return;

    var now  = new Date();
    var tMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    var tMax = new Date(now.getFullYear(), now.getMonth() + 3, 31, 23, 59).toISOString();

    var allPromises = [];

    _accounts.forEach(function (acc) {
      if (!acc.token) return;
      // Temporarily set this account's token
      gapi.client.setToken({ access_token: acc.token });

      var activeCals = (acc.calendars || []).filter(function (c) {
        return _selectedIds.length === 0 || _selectedIds.indexOf(c.id) !== -1;
      });
      if (activeCals.length === 0) activeCals = acc.calendars || [];

      activeCals.forEach(function (cal) {
        allPromises.push(
          gapi.client.calendar.events.list({
            calendarId:   cal.id,
            timeMin:      tMin,
            timeMax:      tMax,
            maxResults:   500,
            singleEvents: true,
            orderBy:      'startTime'
          }).then(function (res) {
            return (res.result.items || []).map(function (ev) {
              return parseEvent(ev, cal.id, cal.backgroundColor, cal.summary, acc.email);
            });
          }).catch(function () { return []; })
        );
      });
    });

    Promise.all(allPromises).then(function (results) {
      var all = [].concat.apply([], results);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(all)); } catch (_) {}
      pushEvents(all);
    });
  }

  // ── Load calendar list for a single account ────────────────────────────────

  function loadCalendarsForAccount(acc, callback) {
    gapi.client.setToken({ access_token: acc.token });
    gapi.client.calendar.calendarList.list({ minAccessRole: 'reader' })
      .then(function (res) {
        acc.calendars = res.result.items || [];
        // Default: select all
        acc.calendars.forEach(function (cal) {
          if (_selectedIds.indexOf(cal.id) === -1) _selectedIds.push(cal.id);
        });
        try { localStorage.setItem(SEL_KEY, JSON.stringify(_selectedIds)); } catch (_) {}
        push();
        if (callback) callback();
      }).catch(function (err) {
        console.warn('[GCalSync] calendarList failed for', acc.email, err);
        if (callback) callback();
      });
  }

  // ── Token receipt ──────────────────────────────────────────────────────────

  function onToken(response) {
    if (!response || !response.access_token) return;
    var token = response.access_token;

    // Decode the id_token hint to get email (if present), else use a placeholder
    var email = response.email || null;

    // Try to read email from the Google token info endpoint
    fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token)
      .then(function (r) { return r.json(); })
      .then(function (info) {
        email = info.email || email || ('account' + (_accounts.length + 1));
        finishConnect(email, token);
      })
      .catch(function () {
        email = email || ('account' + (_accounts.length + 1));
        finishConnect(email, token);
      });
  }

  function finishConnect(email, token) {
    // Update existing account or add new one
    var existing = null;
    _accounts.forEach(function (a) { if (a.email === email) existing = a; });
    if (existing) {
      existing.token = token;
    } else {
      existing = { email: email, token: token, calendars: [] };
      _accounts.push(existing);
    }

    // Persist account list (email only, not token — tokens are in-memory)
    persistAccounts();

    // Schedule token refresh (55 min)
    if (_refreshTimers[email]) clearTimeout(_refreshTimers[email]);
    _refreshTimers[email] = setTimeout(function () {
      if (_tokenClient) _tokenClient.requestAccessToken({ prompt: '', login_hint: email });
    }, 55 * 60 * 1000);

    loadCalendarsForAccount(existing, fetchAll);
  }

  function persistAccounts() {
    try {
      localStorage.setItem(ACC_KEY, JSON.stringify(
        _accounts.map(function (a) { return { email: a.email }; })
      ));
    } catch (_) {}
  }

  // ── GAPI + GIS init ────────────────────────────────────────────────────────

  function initGapi() {
    gapi.load('client', function () {
      gapi.client.init({}).then(function () {
        return gapi.client.load(
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
        );
      }).then(function () {
        _gapiReady = true;

        _tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope:     SCOPE,
          callback:  onToken
        });

        // Surface cached events immediately
        try {
          var cached = localStorage.getItem(CACHE_KEY);
          if (cached) pushEvents(JSON.parse(cached));
        } catch (_) {}

        if (window.__dashSetGcalReady) window.__dashSetGcalReady(true);
      }).catch(function (err) {
        console.warn('[GCalSync] GAPI init failed:', err);
      });
    });
  }

  function waitForLibs() {
    if (window.gapi && window.google && window.google.accounts && window.google.accounts.oauth2) {
      initGapi();
    } else {
      setTimeout(waitForLibs, 150);
    }
  }

  document.addEventListener('DOMContentLoaded', waitForLibs);

  // ── Public API ─────────────────────────────────────────────────────────────

  window.GCalSync = {

    /** Add another Google account (opens the account-picker popup). */
    connect: function (loginHint) {
      if (!_tokenClient) return;
      _tokenClient.requestAccessToken({
        prompt:     'select_account',
        login_hint: loginHint || undefined
      });
    },

    /** Disconnect a specific account by email, or all if no email given. */
    disconnect: function (email) {
      if (email) {
        _accounts = _accounts.filter(function (a) {
          if (a.email === email) {
            if (a.token) try { google.accounts.oauth2.revoke(a.token, function(){}); } catch(_){}
            if (_refreshTimers[email]) clearTimeout(_refreshTimers[email]);
            return false;
          }
          return true;
        });
        // Remove this account's calendars from selected
        // (we keep other accounts' selections)
      } else {
        _accounts.forEach(function (a) {
          if (a.token) try { google.accounts.oauth2.revoke(a.token, function(){}); } catch(_){}
          if (_refreshTimers[a.email]) clearTimeout(_refreshTimers[a.email]);
        });
        _accounts = [];
        _selectedIds = [];
        try { localStorage.removeItem(CACHE_KEY); localStorage.removeItem(SEL_KEY); } catch (_) {}
        pushEvents([]);
      }
      persistAccounts();
      push();
      if (_accounts.length > 0) fetchAll();
    },

    /** All connected account emails. */
    getAccounts: function () {
      return _accounts.map(function (a) { return a.email; });
    },

    /** All calendars across all connected accounts. */
    getCalendars: function () {
      var all = [];
      _accounts.forEach(function (acc) {
        (acc.calendars || []).forEach(function (cal) {
          all.push(Object.assign({}, cal, { _email: acc.email }));
        });
      });
      return all;
    },

    getSelectedIds: function () { return _selectedIds.slice(); },

    setSelectedIds: function (ids) {
      _selectedIds = ids;
      try { localStorage.setItem(SEL_KEY, JSON.stringify(ids)); } catch (_) {}
      if (window.__dashSetGcalSelectedIds) window.__dashSetGcalSelectedIds(ids.slice());
      fetchAll();
    },

    refresh: function () { fetchAll(); },

    /**
     * setSingleAccountMode(email) — mute every calendar that does NOT belong
     * to the given account. Pass null to reset and show all accounts.
     */
    setSingleAccountMode: function (email) {
      if (!email) {
        // Reset: re-select every calendar across all accounts
        _selectedIds = [];
        _accounts.forEach(function (acc) {
          (acc.calendars || []).forEach(function (cal) {
            if (_selectedIds.indexOf(cal.id) === -1) _selectedIds.push(cal.id);
          });
        });
      } else {
        // Keep only calendars belonging to the target account
        _selectedIds = [];
        _accounts.forEach(function (acc) {
          if (acc.email === email) {
            (acc.calendars || []).forEach(function (cal) {
              _selectedIds.push(cal.id);
            });
          }
        });
      }
      try { localStorage.setItem(SEL_KEY, JSON.stringify(_selectedIds)); } catch (_) {}
      if (window.__dashSetGcalSelectedIds) window.__dashSetGcalSelectedIds(_selectedIds.slice());
      fetchAll();
    }
  };

})();
