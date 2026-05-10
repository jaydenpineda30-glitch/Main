/**
 * error-boundary.js
 * React Error Boundary that catches component crashes, logs them, and shows
 * a recovery UI instead of a blank screen.
 *
 * Written with React.createElement (no JSX) so it can be loaded as a plain
 * <script> tag before the Babel bundle — no compilation needed.
 *
 * Depends on: React (global), error-handler.js (window.ErrorHandler)
 * Exposes globals: window.ErrorBoundary, window.withErrorBoundary
 *
 * Usage in JSX (dashboard.html):
 *   <ErrorBoundary name="Finance">
 *     <FinanceSection ... />
 *   </ErrorBoundary>
 */
(function () {
  'use strict';

  if (typeof React === 'undefined') {
    console.error('[ErrorBoundary] React not found — load React before error-boundary.js');
    return;
  }

  // ── Styles (inline, matches dashboard dark theme) ──────────────────────────

  var S = {
    wrap: {
      background:   'rgba(255,80,80,0.06)',
      border:       '0.5px solid rgba(255,80,80,0.3)',
      borderRadius: 12,
      padding:      '18px 20px',
      margin:       '8px 0',
      fontFamily:   'system-ui, sans-serif'
    },
    icon:   { fontSize: 22, marginBottom: 8 },
    title:  { fontSize: 14, fontWeight: 700, color: '#ff6b6b', marginBottom: 6 },
    msg:    { fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 14 },
    detail: {
      fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace',
      background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '8px 10px',
      marginBottom: 14, whiteSpace: 'pre-wrap', maxHeight: 120, overflowY: 'auto'
    },
    row:    { display: 'flex', gap: 8 },
    btnRetry: {
      padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(199,125,255,0.4)',
      background: 'rgba(199,125,255,0.12)', color: '#c77dff',
      cursor: 'pointer', fontSize: 12, fontWeight: 600
    },
    btnReport: {
      padding: '7px 14px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
      cursor: 'pointer', fontSize: 12
    }
  };

  // ── ErrorBoundary class component ──────────────────────────────────────────

  var ErrorBoundary = (function (_super) {
    // Minimal class inheritance without ES6 class syntax
    function ErrorBoundary(props) {
      _super.call(this, props);
      this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
      this._handleRetry  = this._handleRetry.bind(this);
      this._handleReport = this._handleReport.bind(this);
    }

    // Set up prototype chain
    ErrorBoundary.prototype = Object.create(_super.prototype);
    ErrorBoundary.prototype.constructor = ErrorBoundary;

    // Static: React calls this to update state on error
    ErrorBoundary.getDerivedStateFromError = function (error) {
      return { hasError: true, error: error };
    };

    // Called after render with error details
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
      this.setState({ errorInfo: info });

      var name = this.props.name || 'unknown';
      if (window.ErrorHandler) {
        ErrorHandler.critical(
          'Component crash in "' + name + '": ' + (error.message || error),
          'error-boundary',
          {
            error: error,
            userAction: 'viewing ' + name,
            data: {
              componentStack: info && info.componentStack,
              boundaryName: name,
              retryCount: this.state.retryCount
            }
          }
        );
      }
    };

    ErrorBoundary.prototype._handleRetry = function () {
      this.setState(function (prev) {
        return { hasError: false, error: null, errorInfo: null, retryCount: prev.retryCount + 1 };
      });
    };

    ErrorBoundary.prototype._handleReport = function () {
      if (window.ErrorHandler) {
        ErrorHandler.exportLogs();
      } else {
        alert('ErrorHandler not available — check console for details.');
      }
    };

    ErrorBoundary.prototype.render = function () {
      var _this = this;

      if (!this.state.hasError) {
        return this.props.children;
      }

      var name      = this.props.name  || 'this section';
      var errorMsg  = (this.state.error && (this.state.error.message || String(this.state.error))) || 'Unknown error';
      var stack     = this.state.error && this.state.error.stack;
      var compStack = this.state.errorInfo && this.state.errorInfo.componentStack;

      return React.createElement('div', { style: S.wrap },
        React.createElement('div', { style: S.icon }, '⚠️'),
        React.createElement('div', { style: S.title }, 'Something went wrong in ' + name),
        React.createElement('div', { style: S.msg },
          'An error was caught and logged automatically. Your data is safe. ',
          _this.state.retryCount > 0
            ? 'Retry attempt ' + _this.state.retryCount + '.'
            : 'Press Retry to reload this section.'
        ),
        (stack || compStack) && React.createElement('pre', { style: S.detail },
          errorMsg + (compStack ? '\n\nComponent tree:' + compStack : '')
        ),
        React.createElement('div', { style: S.row },
          React.createElement('button', { style: S.btnRetry,  onClick: _this._handleRetry  }, '↻ Retry'),
          React.createElement('button', { style: S.btnReport, onClick: _this._handleReport }, '⬇ Export logs')
        )
      );
    };

    return ErrorBoundary;
  }(React.Component));

  // ── Higher-order component helper ─────────────────────────────────────────

  /**
   * Wrap any component in an ErrorBoundary without changing JSX.
   * Usage (in Babel/JSX context):
   *   var SafeGym = withErrorBoundary(GymSection, 'Gym');
   *   <SafeGym ... />
   */
  function withErrorBoundary(Component, name) {
    return function WrappedWithBoundary(props) {
      return React.createElement(
        ErrorBoundary, { name: name || Component.displayName || Component.name },
        React.createElement(Component, props)
      );
    };
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  window.ErrorBoundary    = ErrorBoundary;
  window.withErrorBoundary = withErrorBoundary;

})();
