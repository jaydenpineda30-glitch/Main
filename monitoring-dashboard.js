/**
 * monitoring-dashboard.js
 * React UI components for the monitoring system.
 * Written with React.createElement (no JSX) — works as a plain <script> tag.
 *
 * Depends on: React (global), error-handler.js, health-monitor.js, network-monitor.js
 * Exposes globals:
 *   window.StatusBar          — compact always-visible status strip
 *   window.MonitoringPanel    — full monitoring panel (logs, analytics, health, settings)
 *
 * Usage inside JSX (Babel compiled):
 *   <StatusBar onOpenPanel={function(){ setShowMonitor(true); }} />
 *   {showMonitor && <MonitoringPanel
 *     onClose={function(){ setShowMonitor(false); }}
 *     settings={{ geminiKey, githubPAT }}
 *     onSaveSettings={function(s){ ... }}
 *   />}
 */
(function () {
  'use strict';

  if (typeof React === 'undefined') {
    console.error('[MonitoringDashboard] React not found');
    return;
  }

  var useState      = React.useState;
  var useEffect     = React.useEffect;
  var useRef        = React.useRef;
  var createElement = React.createElement;

  // ── Theme (matches existing dashboard palette) ─────────────────────────────

  var C = {
    bg:       'rgba(14,16,40,0.97)',
    bg2:      'rgba(255,255,255,0.05)',
    bg3:      'rgba(255,255,255,0.03)',
    border:   'rgba(255,255,255,0.08)',
    accent:   '#c77dff',
    accentBg: 'rgba(199,125,255,0.1)',
    success:  '#69f0ae',
    warn:     '#ffd166',
    danger:   '#ff6b6b',
    text:     'rgba(255,255,255,0.9)',
    text2:    'rgba(255,255,255,0.55)',
    text3:    'rgba(255,255,255,0.3)',
  };

  // ── Usage tracker ──────────────────────────────────────────────────────────
  // Local-only counter for every meaningful interaction in the dashboard.
  // Stored in localStorage["dash_usage_v1"] — never written to Firestore so it
  // cannot affect dashData under any circumstance. Purpose: spot which tabs and
  // features are actually used vs ignored, so the UI can be trimmed accordingly.

  var USAGE_EVENTS = {
    // Top-level tabs
    'tab.Dashboard':              { cat: 'Tab',         label: 'Dashboard tab' },
    'tab.Uni':                    { cat: 'Tab',         label: 'Uni tab' },
    'tab.Work':                   { cat: 'Tab',         label: 'Work tab' },
    'tab.Gym':                    { cat: 'Tab',         label: 'Gym tab' },
    'tab.Personal':               { cat: 'Tab',         label: 'Personal tab' },
    'tab.Finance':                { cat: 'Tab',         label: 'Finance tab' },
    'tab.Journal':                { cat: 'Tab',         label: 'Journal tab' },
    'subtab.Journal.Captures':    { cat: 'Sub-tab',     label: 'Journal → Captures' },
    'subtab.Journal.Reflection':  { cat: 'Sub-tab',     label: 'Journal → Reflection' },

    // Tasks
    'task.add':                   { cat: 'Tasks',       label: 'Add new task' },
    'task.complete':              { cat: 'Tasks',       label: 'Mark task done' },
    'task.uncomplete':            { cat: 'Tasks',       label: 'Un-complete a task' },
    'task.schedule':              { cat: 'Tasks',       label: 'Schedule task to calendar' },
    'task.archive':               { cat: 'Tasks',       label: 'Archive done tasks' },
    'task.restore':               { cat: 'Tasks',       label: 'Restore archived task' },
    'task.edit':                  { cat: 'Tasks',       label: 'Edit task' },
    'task.delete':                { cat: 'Tasks',       label: 'Delete task' },

    // Quick Capture + captures list
    'capture.quick_open':         { cat: 'Captures',    label: 'Open Quick Capture' },
    'capture.save':               { cat: 'Captures',    label: 'Save a capture' },
    'capture.edit':               { cat: 'Captures',    label: 'Edit a capture' },
    'capture.expand':             { cat: 'Captures',    label: 'Expand a capture card' },
    'capture.search':             { cat: 'Captures',    label: 'Search captures' },
    'capture.filter':             { cat: 'Captures',    label: 'Change captures filter' },
    'capture.refresh':            { cat: 'Captures',    label: 'Manual refresh of captures' },

    // Reflections
    'reflection.start':           { cat: 'Reflection',  label: 'Start weekly reflection' },
    'reflection.submit':          { cat: 'Reflection',  label: 'Submit reflection' },
    'reflection.expand_past':     { cat: 'Reflection',  label: 'Expand past reflection' },

    // Gym
    'gym.workout_save':           { cat: 'Gym',         label: 'Save a workout session' },
    'gym.set_log':                { cat: 'Gym',         label: 'Log a set' },
    'gym.bodyweight_log':         { cat: 'Gym',         label: 'Log body weight' },
    'gym.exercise_add':           { cat: 'Gym',         label: 'Add a new exercise' },
    'gym.exercise_picker':        { cat: 'Gym',         label: 'Pick exercise from history' },
    'gym.rotation_edit':          { cat: 'Gym',         label: 'Edit rotation template' },
    'gym.rotation_advance':       { cat: 'Gym',         label: 'Advance rotation index' },

    // Finance
    'finance.expense_add':        { cat: 'Finance',     label: 'Add expense' },
    'finance.expense_edit':       { cat: 'Finance',     label: 'Edit expense' },
    'finance.income_edit':        { cat: 'Finance',     label: 'Edit income source' },
    'finance.budget_edit':        { cat: 'Finance',     label: 'Edit budget category' },

    // Uni
    'uni.assessment_complete':    { cat: 'Uni',         label: 'Mark assessment done' },
    'uni.gcal_event_toggle':      { cat: 'Uni',         label: 'Toggle calendar event done' },
    'uni.subject_add':            { cat: 'Uni',         label: 'Add a subject' },

    // Knowledge base (Dashboard tab docs)
    'kb.doc_add':                 { cat: 'Knowledge',   label: 'Add a knowledge doc' },
    'kb.doc_delete':              { cat: 'Knowledge',   label: 'Delete a knowledge doc' },

    // Modals — opens
    'modal.add_task':             { cat: 'Modal',       label: 'Open Add task modal' },
    'modal.add_exercise':         { cat: 'Modal',       label: 'Open Add exercise modal' },
    'modal.add_subject':          { cat: 'Modal',       label: 'Open Add subject modal' },
    'modal.log_weight':           { cat: 'Modal',       label: 'Open Log weight modal' },
    'modal.edit_rotation':        { cat: 'Modal',       label: 'Open Edit rotation modal' },
    'modal.monitoring':           { cat: 'Modal',       label: 'Open Monitoring panel' },

    // AI / external
    'checkin.generate':           { cat: 'AI',          label: 'Generate daily check-in (Gemini)' },
    'weather.refresh':            { cat: 'Misc',        label: 'Refresh weather' },
    'version.click':              { cat: 'Misc',        label: 'Click version badge' },

    // Export + settings
    'export.manual':              { cat: 'Export',      label: 'Trigger manual Obsidian export' },
    'settings.open':              { cat: 'Settings',    label: 'Open Settings tab' },
    'settings.gemini_set':        { cat: 'Settings',    label: 'Set Gemini API key' },
    'settings.gcal_change':       { cat: 'Settings',    label: 'Change Google Calendar selection' }
  };

  var USAGE_KEY = 'dash_usage_v1';
  function _loadUsage() {
    try {
      var s = localStorage.getItem(USAGE_KEY);
      if (s) {
        var p = JSON.parse(s);
        return {
          counts:    p.counts    || {},
          firstSeen: p.firstSeen || {},
          lastSeen:  p.lastSeen  || {},
          startDate: p.startDate || new Date().toISOString()
        };
      }
    } catch (_) {}
    return { counts: {}, firstSeen: {}, lastSeen: {}, startDate: new Date().toISOString() };
  }
  function _persistUsage(state) {
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }
  var _usageState = _loadUsage();
  var _usageListeners = [];

  // ── Per-device cloud sync ───────────────────────────────────────────────────
  // Each device writes ONLY its own doc at users/{uid}/usage/{deviceId}. Because
  // no two devices ever touch the same doc there is no merge/race/double-count.
  // This is a separate document — never a field on the dashData doc — so the
  // dashData full-document set() and the seed-state guard can never affect it.
  var DEVICE_KEY = 'dash_device_id';
  function _deviceId() {
    var id;
    try { id = localStorage.getItem(DEVICE_KEY); } catch (_) {}
    if (!id) {
      id = 'dev_' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
      try { localStorage.setItem(DEVICE_KEY, id); } catch (_) {}
    }
    return id;
  }
  function _deviceLabel() {
    var ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    var os = /Windows/.test(ua)             ? 'Windows'
           : /iPhone|iPad|iPod/.test(ua)    ? 'iOS'
           : /Android/.test(ua)             ? 'Android'
           : /Mac OS X|Macintosh/.test(ua)  ? 'macOS'
           : /Linux/.test(ua)               ? 'Linux'
           : 'device';
    var browser = /Edg\//.test(ua)            ? 'Edge'
                : /OPR\/|Opera/.test(ua)      ? 'Opera'
                : /Chrome\//.test(ua)         ? 'Chrome'
                : /Firefox\//.test(ua)        ? 'Firefox'
                : /Safari\//.test(ua)         ? 'Safari'
                : 'Browser';
    return browser + ' on ' + os;
  }
  function _usageDocRef() {
    var doc = window.DASH_DOC;
    if (!doc || typeof doc.collection !== 'function') return null; // not signed in yet
    try { return doc.collection('usage').doc(_deviceId()); } catch (_) { return null; }
  }
  function _pushToCloud() {
    var ref = _usageDocRef();
    if (!ref) return;
    try {
      ref.set({
        label:     _deviceLabel(),
        counts:    _usageState.counts,
        firstSeen: _usageState.firstSeen,
        lastSeen:  _usageState.lastSeen,
        startDate: _usageState.startDate,
        updatedAt: new Date().toISOString()
      }).catch(function () {}); // no-throw: offline/permission/etc. just retries on next event
    } catch (_) {}
  }
  var _syncTimer = null;
  function _scheduleSync() {
    if (_syncTimer) clearTimeout(_syncTimer);
    _syncTimer = setTimeout(_pushToCloud, 3000); // debounce: batch rapid events into one write
  }

  window.UsageTracker = {
    track: function (eventName) {
      if (!USAGE_EVENTS[eventName]) { console.warn('[UsageTracker] Unknown event:', eventName); return; }
      var now = new Date().toISOString();
      _usageState.counts[eventName] = (_usageState.counts[eventName] || 0) + 1;
      if (!_usageState.firstSeen[eventName]) _usageState.firstSeen[eventName] = now;
      _usageState.lastSeen[eventName] = now;
      _persistUsage(_usageState);
      _scheduleSync();
      _usageListeners.forEach(function (fn) { try { fn(); } catch (_) {} });
    },
    reset: function () {
      _usageState = { counts: {}, firstSeen: {}, lastSeen: {}, startDate: new Date().toISOString() };
      _persistUsage(_usageState);
      _pushToCloud(); // reflect the cleared state in this device's cloud doc immediately
      _usageListeners.forEach(function (fn) { try { fn(); } catch (_) {} });
    },
    getState:  function () { return JSON.parse(JSON.stringify(_usageState)); },
    getEvents: function () { return USAGE_EVENTS; },
    getDeviceId: function () { return _deviceId(); },
    // Resolve all devices' usage. Current device uses LIVE local state; others use
    // their last-synced cloud snapshot. Falls back to local-only if signed out or
    // the read fails — never throws.
    fetchDevices: function () {
      var live = {
        deviceId: _deviceId(), label: _deviceLabel(),
        counts: _usageState.counts, firstSeen: _usageState.firstSeen,
        lastSeen: _usageState.lastSeen, startDate: _usageState.startDate,
        isCurrent: true
      };
      var doc = window.DASH_DOC;
      if (!doc || typeof doc.collection !== 'function') return Promise.resolve([live]);
      try {
        return doc.collection('usage').get().then(function (snap) {
          var devices = []; var sawLocal = false;
          snap.forEach(function (d) {
            if (d.id === live.deviceId) { sawLocal = true; devices.push(live); return; }
            var data = d.data() || {};
            devices.push({
              deviceId: d.id, label: data.label || 'Unknown device',
              counts: data.counts || {}, firstSeen: data.firstSeen || {},
              lastSeen: data.lastSeen || {}, startDate: data.startDate || null,
              updatedAt: data.updatedAt || null, isCurrent: false
            });
          });
          if (!sawLocal) devices.unshift(live);
          return devices;
        }).catch(function () { return [live]; });
      } catch (_) { return Promise.resolve([live]); }
    },
    subscribe: function (fn) { _usageListeners.push(fn); return function () { _usageListeners = _usageListeners.filter(function (x) { return x !== fn; }); }; }
  };

  // ── Helper: severity → colour ──────────────────────────────────────────────

  function sevColor(sev) {
    return sev === 'critical' ? C.danger
         : sev === 'error'    ? '#ff8a65'
         : sev === 'warn'     ? C.warn
         : sev === 'info'     ? C.accent
         : C.text3;
  }

  function sevDot(sev) {
    return createElement('span', {
      style: {
        display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
        background: sevColor(sev), flexShrink: 0, marginTop: 1
      }
    });
  }

  // ── useHealthStatus hook ──────────────────────────────────────────────────

  function useHealthStatus() {
    var init = (window.HealthMonitor && window.HealthMonitor.status) || null;
    var pair = useState(init);
    var status = pair[0]; var setStatus = pair[1];

    useEffect(function () {
      if (!window.HealthMonitor) return;
      var unsub = HealthMonitor.onChange(setStatus);
      return unsub;
    }, []);

    return status;
  }

  // ── useNetworkStatus hook ─────────────────────────────────────────────────

  function useNetworkStatus() {
    var pair = useState({
      online:    navigator.onLine,
      queueSize: window.NetworkMonitor ? NetworkMonitor.queueSize : 0
    });
    var net = pair[0]; var setNet = pair[1];

    useEffect(function () {
      if (!window.NetworkMonitor) return;
      var unsub = NetworkMonitor.onChange(function (isOnline) {
        setNet({ online: isOnline, queueSize: NetworkMonitor.queueSize });
      });
      return unsub;
    }, []);

    return net;
  }

  // ── useErrorFeed hook ─────────────────────────────────────────────────────

  function useErrorFeed() {
    var pair = useState(
      window.ErrorHandler ? ErrorHandler.getRecent(20) : []
    );
    var logs = pair[0]; var setLogs = pair[1];

    useEffect(function () {
      if (!window.ErrorHandler) return;
      var unsub = ErrorHandler.onError(function () {
        setLogs(ErrorHandler.getRecent(20));
      });
      return unsub;
    }, []);

    return logs;
  }

  // ── Shared UI primitives ───────────────────────────────────────────────────

  function card(children, extraStyle) {
    return createElement('div', {
      style: Object.assign({
        background: C.bg2, border: '0.5px solid ' + C.border,
        borderRadius: 12, padding: '14px 16px', marginBottom: 10
      }, extraStyle || {})
    }, children);
  }

  function sectionTitle(text) {
    return createElement('div', {
      style: { fontSize: 10, fontWeight: 700, color: C.text3,
               textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }
    }, text);
  }

  function btn(label, onClick, style) {
    return createElement('button', {
      onClick: onClick,
      style: Object.assign({
        padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
        border: '0.5px solid ' + C.border, background: C.bg2, color: C.text2
      }, style || {})
    }, label);
  }

  function inp(value, onChange, placeholder, type) {
    return createElement('input', {
      type: type || 'text',
      value: value,
      onChange: onChange,
      placeholder: placeholder || '',
      style: {
        width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 12,
        border: '0.5px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.05)', color: C.text,
        fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box'
      }
    });
  }

  // ── StatusBar component ───────────────────────────────────────────────────

  /**
   * Compact strip shown at the top of the dashboard.
   * Props: { onOpenPanel }
   */
  function StatusBar(props) {
    var health = useHealthStatus();
    var net    = useNetworkStatus();

    var allOk   = health ? health.healthy  : true;
    var offline = !net.online;
    var queued  = net.queueSize;

    var label  = offline      ? '⚠ Offline'
               : !allOk      ? '⚠ System issue'
               : queued > 0  ? '↻ Syncing (' + queued + ')'
               : '✓ All systems healthy';

    var labelColor = offline || !allOk ? C.danger
                   : queued > 0        ? C.warn
                   : C.success;

    return createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px', background: 'rgba(0,0,0,0.25)',
        borderBottom: '0.5px solid ' + C.border, fontSize: 11
      }
    },
      createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: 6, color: labelColor }
      },
        createElement('span', {
          style: {
            width: 7, height: 7, borderRadius: '50%', background: labelColor,
            display: 'inline-block',
            boxShadow: '0 0 6px ' + labelColor
          }
        }),
        label,
        offline && queued > 0 && createElement('span', { style: { color: C.text3 } },
          ' · ' + queued + ' pending'
        )
      ),
      createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
        health && createElement('span', { style: { color: C.text3 } },
          'checked ' + (health.timestamp
            ? new Date(health.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
            : '—')
        ),
        createElement('button', {
          onClick: props.onOpenPanel,
          style: {
            padding: '3px 10px', borderRadius: 6, fontSize: 10, cursor: 'pointer',
            border: '0.5px solid ' + C.border, background: 'transparent', color: C.text3
          }
        }, 'Logs →')
      )
    );
  }

  // ── HealthChecks sub-component ────────────────────────────────────────────

  function HealthChecks(props) {
    var health = props.health;
    if (!health) {
      return createElement('div', { style: { fontSize: 12, color: C.text3 } }, 'Running first check…');
    }
    var checks = health.checks || {};
    var rows = Object.keys(checks).map(function (key) {
      var c = checks[key];
      return createElement('div', {
        key: key,
        style: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '7px 0', borderBottom: '0.5px solid ' + C.border
        }
      },
        createElement('span', { style: { fontSize: 12, color: C.text2 } }, key),
        createElement('span', { style: { fontSize: 11, color: c.ok ? C.success : C.danger } },
          (c.ok ? '✓ ' : '✗ ') + c.detail
        )
      );
    });
    return createElement('div', null, rows);
  }

  // ── LogEntry sub-component ────────────────────────────────────────────────

  function LogEntry(props) {
    var l = props.log;
    var pair = useState(false);
    var expanded = pair[0]; var setExpanded = pair[1];

    return createElement('div', {
      style: {
        padding: '8px 0', borderBottom: '0.5px solid ' + C.border,
        cursor: l.stack ? 'pointer' : 'default'
      },
      onClick: l.stack ? function () { setExpanded(function (v) { return !v; }); } : null
    },
      createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 8 } },
        sevDot(l.severity),
        createElement('div', { style: { flex: 1, minWidth: 0 } },
          createElement('div', { style: { fontSize: 11, color: C.text, lineHeight: 1.5 } }, l.message),
          createElement('div', { style: { fontSize: 9, color: C.text3, marginTop: 2 } },
            l.source + ' · ' + new Date(l.timestamp).toLocaleTimeString('en-AU')
          )
        ),
        createElement('span', {
          style: {
            fontSize: 9, padding: '2px 6px', borderRadius: 99,
            background: sevColor(l.severity) + '20', color: sevColor(l.severity),
            flexShrink: 0
          }
        }, l.severity)
      ),
      expanded && l.stack && createElement('pre', {
        style: {
          fontSize: 9, color: C.text3, marginTop: 6, padding: '6px 8px',
          background: 'rgba(0,0,0,0.3)', borderRadius: 6,
          whiteSpace: 'pre-wrap', maxHeight: 120, overflowY: 'auto'
        }
      }, l.stack)
    );
  }

  // ── Analytics sub-component ───────────────────────────────────────────────

  function Analytics() {
    var pair = useState(null);
    var analytics = pair[0]; var setAnalytics = pair[1];

    useEffect(function () {
      if (window.ErrorHandler) setAnalytics(ErrorHandler.getAnalytics());
    }, []);

    if (!analytics) return createElement('div', { style: { fontSize: 12, color: C.text3 } }, 'Loading…');

    var rows = (analytics.topErrors || []).map(function (e, i) {
      return createElement('div', {
        key: i,
        style: {
          display: 'flex', justifyContent: 'space-between',
          padding: '6px 0', borderBottom: '0.5px solid ' + C.border
        }
      },
        createElement('span', {
          style: { fontSize: 11, color: C.text2, flex: 1, marginRight: 8,
                   overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
        }, e.message),
        createElement('span', { style: { fontSize: 11, color: C.warn, flexShrink: 0 } }, e.count + '×')
      );
    });

    return createElement('div', null,
      createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 } },
        [
          { label: 'Total logs', value: analytics.total },
          { label: 'This week', value: analytics.thisWeek },
          { label: 'Errors', value: (analytics.bySeverity.error || 0) + (analytics.bySeverity.critical || 0) }
        ].map(function (s) {
          return createElement('div', {
            key: s.label,
            style: { background: C.bg3, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }
          },
            createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C.text } }, s.value),
            createElement('div', { style: { fontSize: 9, color: C.text3, marginTop: 3 } }, s.label)
          );
        })
      ),
      analytics.topErrors.length > 0 && createElement('div', null,
        sectionTitle('Top errors'),
        rows
      )
    );
  }

  // ── Settings sub-component ─────────────────────────────────────────────────

  function SettingsTab(props) {
    var savedSettings = props.settings || {};
    var formPair = useState({
      geminiKey: savedSettings.geminiKey || '',
      githubPAT: savedSettings.githubPAT || ''
    });
    var form = formPair[0]; var setForm = formPair[1];
    var savedPair = useState(false);
    var justSaved = savedPair[0]; var setJustSaved = savedPair[1];

    // Sync in when the panel first mounts with settings from parent
    useEffect(function () {
      setForm({
        geminiKey: savedSettings.geminiKey || '',
        githubPAT: savedSettings.githubPAT || ''
      });
    }, [savedSettings.geminiKey, savedSettings.githubPAT]);

    function save() {
      if (window.UsageTracker) window.UsageTracker.track('settings.gemini_set');
      if (props.onSaveSettings) props.onSaveSettings(form);
      setJustSaved(true);
      setTimeout(function () { setJustSaved(false); }, 2000);
    }

    function field(label, hint, key, placeholder, type) {
      return createElement('div', { style: { marginBottom: 16 } },
        createElement('div', { style: { fontSize: 11, color: C.text2, marginBottom: 5, fontWeight: 500 } }, label),
        hint && createElement('div', { style: { fontSize: 10, color: C.text3, marginBottom: 6, lineHeight: 1.5 } }, hint),
        inp(
          form[key],
          function (ev) { setForm(function (f) { var u = {}; u[key] = ev.target.value; return Object.assign({}, f, u); }); },
          placeholder,
          type || 'password'
        )
      );
    }

    return createElement('div', null,
      card(
        createElement('div', null,
          sectionTitle('AI'),
          field(
            'Gemini API key',
            'Used for Quick Capture classification, check-ins, and reflections. Stored locally + synced to your account.',
            'geminiKey',
            'AIzaSy…'
          ),
          createElement('div', { style: { fontSize: 10, color: C.text3, marginTop: -8, marginBottom: 4 } },
            'Get a free key at ',
            createElement('a', {
              href: 'https://aistudio.google.com/app/apikey',
              target: '_blank',
              rel: 'noreferrer',
              style: { color: C.accent, textDecoration: 'none' }
            }, 'aistudio.google.com ↗')
          )
        )
      ),
      card(
        createElement('div', null,
          sectionTitle('Integrations'),
          field(
            'GitHub PAT',
            'Personal Access Token used by the ⬆ Obsidian button to trigger your export workflow. Needs Actions (write) scope on the obsidian-notes repo.',
            'githubPAT',
            'ghp_…'
          ),
          createElement('div', { style: { fontSize: 10, color: C.text3, marginTop: -8, marginBottom: 4 } },
            'Create one at ',
            createElement('a', {
              href: 'https://github.com/settings/personal-access-tokens/new',
              target: '_blank',
              rel: 'noreferrer',
              style: { color: C.accent, textDecoration: 'none' }
            }, 'github.com/settings/tokens ↗')
          )
        )
      ),
      createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 } },
        createElement('button', {
          onClick: save,
          style: {
            padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(199,125,255,0.45)',
            background: 'rgba(199,125,255,0.15)', color: C.accent, cursor: 'pointer',
            fontSize: 12, fontWeight: 600, boxShadow: '0 0 10px rgba(199,125,255,0.2)'
          }
        }, 'Save settings'),
        justSaved && createElement('span', { style: { fontSize: 11, color: C.success } }, '✓ Saved')
      )
    );
  }

  // ── MonitoringPanel (full modal) ──────────────────────────────────────────

  /**
   * Usage view — renders every tracked event with its count, grouped by category.
   * Zero-count events are shown deliberately so unused features stand out.
   */
  function UsageView() {
    var tick = useState(0); var bump = tick[1];
    useEffect(function () {
      return window.UsageTracker.subscribe(function () { bump(function (n) { return n + 1; }); });
    }, []);
    var sortPair = useState('count_desc'); var sort = sortPair[0]; var setSort = sortPair[1];
    var devPair = useState(null); var devices = devPair[0]; var setDevices = devPair[1];
    var selPair = useState(null); var selId = selPair[0]; var setSelId = selPair[1];
    var curId = window.UsageTracker.getDeviceId();

    function loadDevices() {
      window.UsageTracker.fetchDevices().then(function (list) { setDevices(list); });
    }
    useEffect(function () { loadDevices(); }, []);

    function labelFor(d) {
      if (d.deviceId === curId) return (d.label && d.label !== 'This device') ? 'This device (' + d.label + ')' : 'This device';
      return d.label || 'Unknown device';
    }

    var events = window.UsageTracker.getEvents();
    var live   = window.UsageTracker.getState();
    // Active device's data. Default (no selection) = current device, shown live.
    var activeId = selId || curId;
    var viewingCurrent = activeId === curId;
    var active;
    if (viewingCurrent) {
      active = { counts: live.counts || {}, lastSeen: live.lastSeen || {}, startDate: live.startDate };
    } else {
      var match = (devices || []).filter(function (d) { return d.deviceId === activeId; })[0];
      active = match
        ? { counts: match.counts || {}, lastSeen: match.lastSeen || {}, startDate: match.startDate }
        : { counts: {}, lastSeen: {}, startDate: null };
    }
    var state    = { startDate: active.startDate };
    var counts   = active.counts;
    var lastSeen = active.lastSeen;

    // Build rows: [key, label, cat, count, lastSeenISO]
    var rows = Object.keys(events).map(function (k) {
      return {
        key: k,
        label: events[k].label,
        cat: events[k].cat,
        count: counts[k] || 0,
        last: lastSeen[k] || null
      };
    });

    var totalEvents = rows.reduce(function (a, r) { return a + r.count; }, 0);
    var usedEvents  = rows.filter(function (r) { return r.count > 0; }).length;
    var unusedEvents = rows.length - usedEvents;

    // Sort
    if (sort === 'count_desc')      rows.sort(function (a, b) { return b.count - a.count || a.label.localeCompare(b.label); });
    else if (sort === 'count_asc')  rows.sort(function (a, b) { return a.count - b.count || a.label.localeCompare(b.label); });
    else if (sort === 'category')   rows.sort(function (a, b) { return a.cat.localeCompare(b.cat) || b.count - a.count; });
    else if (sort === 'recent')     rows.sort(function (a, b) {
      if (!a.last && !b.last) return 0;
      if (!a.last) return 1;
      if (!b.last) return -1;
      return b.last.localeCompare(a.last);
    });

    var maxCount = Math.max.apply(null, rows.map(function (r) { return r.count; }).concat([1]));

    function fmtLast(iso) {
      if (!iso) return '—';
      var d = new Date(iso);
      var now = new Date();
      var diff = Math.floor((now - d) / 1000);
      if (diff < 60) return diff + 's ago';
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
      return Math.floor(diff / 86400) + 'd ago';
    }

    return createElement('div', null,
      // Device selector
      createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 } },
        createElement('span', { style: { fontSize: 10, color: C.text3 } }, 'Device'),
        createElement('select', {
          value: activeId,
          onChange: function (e) { setSelId(e.target.value); },
          style: {
            flex: 1, padding: '5px 8px', borderRadius: 8, fontSize: 11,
            border: '0.5px solid ' + C.border, background: C.bg3, color: C.text
          }
        },
          (devices || [{ deviceId: curId, label: 'This device' }]).map(function (d) {
            return createElement('option', { key: d.deviceId, value: d.deviceId }, labelFor(d));
          })
        ),
        createElement('button', {
          onClick: loadDevices, title: 'Refresh device list',
          style: {
            padding: '5px 10px', borderRadius: 8, fontSize: 10, cursor: 'pointer',
            border: '0.5px solid ' + C.border, background: 'transparent', color: C.text3
          }
        }, '↻')
      ),
      // Summary header
      createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12 } },
        [
          { label: 'Total events',  value: totalEvents },
          { label: 'Features used', value: usedEvents },
          { label: 'Unused',        value: unusedEvents, color: unusedEvents > 0 ? C.warn : C.success },
          { label: 'Since',         value: state.startDate ? new Date(state.startDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '—' }
        ].map(function (s) {
          return createElement('div', {
            key: s.label,
            style: { background: C.bg3, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }
          },
            createElement('div', { style: { fontSize: 16, fontWeight: 700, color: s.color || C.text } }, s.value),
            createElement('div', { style: { fontSize: 9, color: C.text3, marginTop: 3 } }, s.label)
          );
        })
      ),
      // Sort controls
      createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' } },
        [
          { k: 'count_desc', l: 'Most used' },
          { k: 'count_asc',  l: 'Least used' },
          { k: 'recent',     l: 'Recent' },
          { k: 'category',   l: 'By category' }
        ].map(function (s) {
          var active = sort === s.k;
          return createElement('button', {
            key: s.k, onClick: function () { setSort(s.k); },
            style: {
              padding: '4px 10px', borderRadius: 99, fontSize: 10, cursor: 'pointer',
              border: '0.5px solid ' + (active ? C.accent : C.border),
              background: active ? C.accentBg : 'transparent',
              color: active ? C.accent : C.text3
            }
          }, s.l);
        }),
        createElement('div', { style: { flex: 1 } }),
        viewingCurrent && createElement('button', {
          onClick: function () { if (confirm('Reset usage counts for THIS device? This cannot be undone.')) window.UsageTracker.reset(); },
          style: {
            padding: '4px 10px', borderRadius: 99, fontSize: 10, cursor: 'pointer',
            border: '0.5px solid ' + C.border, background: 'transparent', color: C.text3
          }
        }, '↻ Reset this device')
      ),
      // Rows — every event, with bar
      createElement('div', null,
        rows.map(function (r) {
          var pct = r.count === 0 ? 0 : Math.max(2, Math.round((r.count / maxCount) * 100));
          var unused = r.count === 0;
          return createElement('div', {
            key: r.key,
            style: {
              display: 'grid',
              gridTemplateColumns: '70px 1fr 60px 60px',
              gap: 8, alignItems: 'center',
              padding: '6px 8px',
              borderBottom: '0.5px solid ' + C.border,
              opacity: unused ? 0.55 : 1
            }
          },
            createElement('span', {
              style: {
                fontSize: 9, padding: '2px 6px', borderRadius: 99,
                background: C.bg3, color: C.text3, textAlign: 'center'
              }
            }, r.cat),
            createElement('div', { style: { position: 'relative', height: 18 } },
              createElement('div', {
                style: {
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: pct + '%',
                  background: unused ? 'transparent' : C.accentBg,
                  borderLeft: unused ? '1px dashed ' + C.border : '2px solid ' + C.accent,
                  borderRadius: 2
                }
              }),
              createElement('div', {
                style: {
                  position: 'relative', fontSize: 11,
                  color: unused ? C.text3 : C.text,
                  padding: '2px 6px', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis'
                }
              }, r.label)
            ),
            createElement('div', {
              style: {
                fontSize: 12, fontWeight: 700, textAlign: 'right',
                color: unused ? C.text3 : C.accent
              }
            }, r.count),
            createElement('div', {
              style: { fontSize: 9, color: C.text3, textAlign: 'right' }
            }, fmtLast(r.last))
          );
        })
      ),
      // Footer note
      createElement('div', {
        style: { fontSize: 9, color: C.text3, marginTop: 12, lineHeight: 1.5 }
      }, viewingCurrent
        ? 'This device — tracked locally and synced to your account so it shows on your other devices. Dim rows = never used. Reset affects this device only.'
        : 'Another device (read-only, last synced when it was online). Dim rows = never used.')
    );
  }

  /**
   * Full monitoring panel — show as a modal overlay.
   * Props: { onClose, settings, onSaveSettings }
   */
  function MonitoringPanel(props) {
    var health     = useHealthStatus();
    var net        = useNetworkStatus();
    var logs       = useErrorFeed();
    var tabPair    = useState('logs');
    var tab        = tabPair[0]; var setTab = tabPair[1];
    var filterPair = useState('all');
    var filter     = filterPair[0]; var setFilter = filterPair[1];

    useEffect(function () {
      if (window.UsageTracker) window.UsageTracker.track('modal.monitoring');
    }, []);

    var TABS = ['logs', 'health', 'analytics', 'usage', 'settings'];

    var filteredLogs = filter === 'all'
      ? logs
      : logs.filter(function (l) { return l.severity === filter; });

    return createElement('div', {
      style: {
        position: 'fixed', inset: 0, background: 'rgba(5,7,26,0.85)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16
      },
      onClick: props.onClose
    },
      createElement('div', {
        style: {
          background: C.bg, border: '0.5px solid rgba(199,125,255,0.25)',
          borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)'
        },
        onClick: function (e) { e.stopPropagation(); }
      },

        // Header
        createElement('div', {
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px', borderBottom: '0.5px solid ' + C.border
          }
        },
          createElement('div', null,
            createElement('div', { style: { fontSize: 14, fontWeight: 700, color: C.text } }, '📊 System Monitor'),
            createElement('div', { style: { fontSize: 10, color: C.text3, marginTop: 2 } },
              (net.online ? 'Online' : 'Offline') +
              (net.queueSize > 0 ? ' · ' + net.queueSize + ' pending' : ' · All synced')
            )
          ),
          btn('✕', props.onClose)
        ),

        // Tabs
        createElement('div', {
          style: {
            display: 'flex', gap: 0,
            borderBottom: '0.5px solid ' + C.border,
            padding: '0 18px', overflowX: 'auto'
          }
        },
          TABS.map(function (t) {
            var active = t === tab;
            return createElement('button', {
              key: t, onClick: function () { if (t === 'settings' && window.UsageTracker) window.UsageTracker.track('settings.open'); setTab(t); },
              style: {
                padding: '10px 14px', border: 'none', background: 'none',
                fontSize: 12, cursor: 'pointer', fontWeight: active ? 700 : 400,
                color: active ? C.accent : C.text3,
                borderBottom: active ? '2px solid ' + C.accent : '2px solid transparent',
                marginBottom: -1, textTransform: 'capitalize', whiteSpace: 'nowrap',
                flexShrink: 0
              }
            }, t);
          })
        ),

        // Tab content
        createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '14px 18px' } },

          // ── LOGS tab ──
          tab === 'logs' && createElement('div', null,
            createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' } },
              ['all', 'critical', 'error', 'warn', 'info'].map(function (f) {
                return createElement('button', {
                  key: f, onClick: function () { setFilter(f); },
                  style: {
                    padding: '4px 10px', borderRadius: 99, fontSize: 10, cursor: 'pointer',
                    border: '0.5px solid ' + (filter === f ? sevColor(f === 'all' ? 'info' : f) : C.border),
                    background: filter === f ? sevColor(f === 'all' ? 'info' : f) + '20' : 'transparent',
                    color: filter === f ? sevColor(f === 'all' ? 'info' : f) : C.text3,
                    textTransform: 'capitalize'
                  }
                }, f);
              })
            ),
            filteredLogs.length === 0
              ? createElement('div', { style: { fontSize: 12, color: C.text3, textAlign: 'center', padding: '24px 0' } }, 'No logs yet ✓')
              : filteredLogs.slice().reverse().map(function (l) {
                  return createElement(LogEntry, { key: l.id, log: l });
                }),
            filteredLogs.length > 0 && createElement('div', {
              style: { display: 'flex', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '0.5px solid ' + C.border }
            },
              btn('⬇ Export JSON', function () { ErrorHandler && ErrorHandler.exportLogs(); },
                { color: C.accent, borderColor: 'rgba(199,125,255,0.3)' }),
              btn('🗑 Clear logs', function () { ErrorHandler && ErrorHandler.clearLogs(); })
            )
          ),

          // ── HEALTH tab ──
          tab === 'health' && createElement('div', null,
            card(
              createElement('div', null,
                sectionTitle('System checks'),
                createElement('div', { style: { fontSize: 10, color: C.text3, marginBottom: 10 } }, 'Auto-refreshes every 30 seconds'),
                createElement(HealthChecks, { health: health })
              )
            ),
            card(
              createElement('div', null,
                sectionTitle('Network queue'),
                net.queueSize === 0
                  ? createElement('div', { style: { fontSize: 12, color: C.success } }, '✓ No pending operations')
                  : createElement('div', null,
                      createElement('div', { style: { fontSize: 12, color: C.warn, marginBottom: 8 } },
                        net.queueSize + ' operation(s) waiting to sync'
                      ),
                      btn('↻ Retry now', function () {
                        if (window.NetworkMonitor) NetworkMonitor.replayQueue();
                      }, { color: C.accent, borderColor: 'rgba(199,125,255,0.3)' })
                    )
              )
            )
          ),

          // ── ANALYTICS tab ──
          tab === 'analytics' && createElement('div', null,
            card(createElement(Analytics, null))
          ),

          // ── USAGE tab ──
          tab === 'usage' && createElement('div', null,
            card(createElement(UsageView, null))
          ),

          // ── SETTINGS tab ──
          tab === 'settings' && createElement(SettingsTab, {
            settings: props.settings || {},
            onSaveSettings: props.onSaveSettings
          })
        )
      )
    );
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  window.StatusBar       = StatusBar;
  window.MonitoringPanel = MonitoringPanel;

})();
