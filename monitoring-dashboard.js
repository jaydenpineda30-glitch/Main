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

    var TABS = ['logs', 'health', 'analytics', 'settings'];

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
              key: t, onClick: function () { setTab(t); },
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
