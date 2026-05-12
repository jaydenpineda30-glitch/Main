/**
 * gcal-sync.js
 * Google Calendar OAuth + event fetch via GIS + GAPI.
 * Exposes global: window.GCalSync
 *
 * Requires in <head> (before this file):
 *   <script src="https://accounts.google.com/gsi/client" async defer></script>
 *   <script src="https://apis.google.com/js/api.js" async defer></script>
 *
 * Notifies the React app via window callbacks:
 *   window.__dashSetGcalEvents(events[])
 *   window.__dashSetGcalConnected(bool)
 *   window.__dashSetGcalCalendars(calendars[])
 *   window.__dashSetGcalReady(bool)
 */
(function () {
  'use strict';

  var CLIENT_ID = '134399742010-ls72tfl37fgre7ip3oohrmq65ln1ilrf.apps.googleusercontent.com';
  var SCOPE     = 'https://www.googleapis.com/auth/calendar.readonly';
  var CACHE_KEY = '__gcal_events__';
  var CAL_KEY   = '__gcal_selected__';

  var _tokenClient  = null;
  var _accessToken  = null;
  var _refreshTimer = null;
  var _calendars    = [];
  var _selectedIds  = [];

  try {
    var _stored = localStorage.getItem(CAL_KEY);
    _selectedIds = _stored ? JSON.parse(_stored) : [];
  } catch (_) { _selectedIds = []; }

  // ── Callbacks into React ───────────────────────────────────────────────────

  function notifyEvents(evs)   { if (window.__dashSetGcalEvents)     window.__dashSetGcalEvents(evs); }
  function notifyConn(v)       { if (window.__dashSetGcalConnected)  window.__dashSetGcalConnected(v); }
  function notifyCalendars(cs) { if (window.__dashSetGcalCalendars)  window.__dashSetGcalCalendars(cs); }
  function notifyReady()       { if (window.__dashSetGcalReady)      window.__dashSetGcalReady(true); }

  // ── Event parsing ──────────────────────────────────────────────────────────

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function parseEvent(ev, calId, calColor, calName) {
    var start = ev.start, end = ev.end;
    var date, time, allDay = false;
    if (start.date) {
      date   = start.date;
      time   = 'All day';
      allDay = true;
    } else {
      var sd = new Date(start.dateTime);
      var ed = new Date(end   ? end.dateTime : start.dateTime);
      date   = sd.toISOString().slice(0, 10);
      time   = pad(sd.getHours()) + ':' + pad(sd.getMinutes()) +
               '–' + pad(ed.getHours()) + ':' + pad(ed.getMinutes());
    }
    return {
      id:       'gcal_' + ev.id,
      date:     date,
      time:     time,
      title:    ev.summary || '(no title)',
      location: ev.location || null,
      gcal:     true,
      allDay:   allDay,
      calId:    calId,
      calColor: calColor || '#4285F4',
      calName:  calName  || 'Google'
    };
  }

  // ── Fetch events from selected calendars ───────────────────────────────────

  function fetchEvents() {
    if (!_accessToken) return;
    var active = _calendars.filter(function (c) {
      return _selectedIds.indexOf(c.id) !== -1;
    });
    if (active.length === 0 && _calendars.length > 0) {
      // Default: sync all calendars if nothing selected yet
      active = _calendars;
      _selectedIds = _calendars.map(function (c) { return c.id; });
      try { localStorage.setItem(CAL_KEY, JSON.stringify(_selectedIds)); } catch (_) {}
    }
    if (active.length === 0) return;

    var now  = new Date();
    var tMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    var tMax = new Date(now.getFullYear(), now.getMonth() + 3, 31, 23, 59).toISOString();

    var promises = active.map(function (cal) {
      return gapi.client.calendar.events.list({
        calendarId:   cal.id,
        timeMin:      tMin,
        timeMax:      tMax,
        maxResults:   500,
        singleEvents: true,
        orderBy:      'startTime'
      }).then(function (res) {
        return (res.result.items || []).map(function (ev) {
          return parseEvent(ev, cal.id, cal.backgroundColor, cal.summary);
        });
      }).catch(function () { return []; });
    });

    Promise.all(promises).then(function (results) {
      var all = [].concat.apply([], results);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(all)); } catch (_) {}
      notifyEvents(all);
      notifyConn(true);
    });
  }

  // ── Fetch calendar list ────────────────────────────────────────────────────

  function loadCalendars() {
    return gapi.client.calendar.calendarList.list({ minAccessRole: 'reader' })
      .then(function (res) {
        _calendars = res.result.items || [];
        notifyCalendars(_calendars);
        // Restore previously saved selection, or default to all
        if (_selectedIds.length === 0) {
          _selectedIds = _calendars.map(function (c) { return c.id; });
          try { localStorage.setItem(CAL_KEY, JSON.stringify(_selectedIds)); } catch (_) {}
        }
        return _calendars;
      });
  }

  // ── GAPI + GIS init ────────────────────────────────────────────────────────

  function onTokenReceived(response) {
    if (!response || !response.access_token) return;
    _accessToken = response.access_token;
    gapi.client.setToken({ access_token: _accessToken });
    loadCalendars().then(fetchEvents);
    // Re-request token silently before it expires (tokens last 1 h)
    if (_refreshTimer) clearTimeout(_refreshTimer);
    _refreshTimer = setTimeout(function () {
      _tokenClient.requestAccessToken({ prompt: '' });
    }, 55 * 60 * 1000);
  }

  function initGapi() {
    gapi.load('client', function () {
      gapi.client.init({}).then(function () {
        return gapi.client.load(
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
        );
      }).then(function () {
        _tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope:     SCOPE,
          callback:  onTokenReceived
        });

        // Surface any cached events immediately while we wait for the user to connect
        try {
          var cached = localStorage.getItem(CACHE_KEY);
          if (cached) notifyEvents(JSON.parse(cached));
        } catch (_) {}

        notifyReady();
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

    /** Trigger OAuth consent / token flow (opens a Google popup). */
    connect: function () {
      if (_tokenClient) _tokenClient.requestAccessToken({ prompt: 'select_account' });
    },

    /** Revoke token and clear cached events. */
    disconnect: function () {
      if (_accessToken) {
        google.accounts.oauth2.revoke(_accessToken, function () {});
        _accessToken = null;
        gapi.client.setToken(null);
      }
      if (_refreshTimer) { clearTimeout(_refreshTimer); _refreshTimer = null; }
      _calendars   = [];
      _selectedIds = [];
      try { localStorage.removeItem(CACHE_KEY); localStorage.removeItem(CAL_KEY); } catch (_) {}
      notifyEvents([]);
      notifyCalendars([]);
      notifyConn(false);
    },

    /** Return the list of calendars (populated after connect). */
    getCalendars: function () { return _calendars; },

    /** IDs of calendars currently being synced. */
    getSelectedIds: function () { return _selectedIds.slice(); },

    /** Update which calendars are synced and re-fetch. */
    setSelectedIds: function (ids) {
      _selectedIds = ids;
      try { localStorage.setItem(CAL_KEY, JSON.stringify(ids)); } catch (_) {}
      fetchEvents();
    },

    /** Force an immediate re-fetch. */
    refresh: function () { fetchEvents(); }
  };

})();
