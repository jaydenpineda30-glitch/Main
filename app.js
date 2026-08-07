"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
// ───────────────────────────────────────────────────────────────────────────
// app.jsx — SOURCE OF TRUTH for the dashboard app (JSX).
// Edit THIS file, not app.js. Before pushing run:  node build.js  (or: npm run build)
// build.js compiles this -> app.js using the pinned in-browser Babel (identical output).
// (A git pre-commit hook auto-rebuilds app.js when this file is staged.)
// ───────────────────────────────────────────────────────────────────────────
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef;
// Usage tracking helper — safe wrapper around window.UsageTracker.track. No-op if module not loaded.
function trk(name) {
  try {
    if (window.UsageTracker) window.UsageTracker.track(name);
  } catch (_) {}
}
// Use the enhanced ErrorBoundary from error-boundary.js if it loaded, otherwise inline fallback
var ErrorBoundary = window.ErrorBoundary || /*#__PURE__*/function (_React$Component) {
  _inherits(_class, _React$Component);
  var _super = _createSuper(_class);
  function _class(props) {
    var _this;
    _classCallCheck(this, _class);
    _this = _super.call(this, props);
    _this.state = {
      err: null
    };
    return _this;
  }
  _createClass(_class, [{
    key: "componentDidCatch",
    value: function componentDidCatch(err, info) {
      if (window.ErrorHandler) ErrorHandler.critical(err && err.message || 'Component crash', 'error-boundary', {
        error: err,
        data: {
          componentStack: info && info.componentStack
        }
      });
      var el = document.getElementById('app-error');
      if (el) {
        el.style.display = 'block';
        el.innerHTML = '<h2 style="color:#ff6b6b;margin-bottom:16px">Render Error</h2>' + '<pre style="background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;font-size:12px;white-space:pre-wrap;color:#ffd166">' + (err ? err.message : 'Unknown') + '</pre>';
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.err) return null;
      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(err) {
      return {
        err: err
      };
    }
  }]);
  return _class;
}(React.Component);
var T = {
  bg: "#0a0a0a",
  bg2: "rgba(225,234,255,0.07)",
  bg3: "rgba(225,234,255,0.04)",
  border: "rgba(255,255,255,0.10)",
  border2: "rgba(255,255,255,0.16)",
  text: "#e6ecf5",
  text2: "#9aa2b2",
  text3: "rgba(255,255,255,0.30)",
  accent: "#5b8cff",
  accentBg: "rgba(91,140,255,0.15)",
  danger: "#ff6b6b",
  dangerBg: "rgba(255,107,107,0.15)",
  success: "#69f0ae",
  successBg: "rgba(105,240,174,0.15)",
  warn: "#ffd166",
  warnBg: "rgba(255,209,102,0.15)",
  orange: "#ff9a3c",
  orangeBg: "rgba(255,154,60,0.15)"
};
// DAYS, TASK_CATS, SUBJECT_PALETTE, SYLLABUS_ASSESSMENTS, REFL_QS, REFL_LABELS, WX_MAP, WX_DAYS → data.js
// Uni subjects live in data.uni.subjects (array of {id,name,color}), not in data.js — fully dynamic.
function subjectColor(subjects, name) {
  var s = (subjects || []).find(function (x) {
    return x.name === name;
  });
  return s ? s.color : null;
}
function nextSubjectColor(subjects) {
  return SUBJECT_PALETTE[(subjects || []).length % SUBJECT_PALETTE.length];
}

// ── Navigation glyphs — consistent stroke-based line icons (replaces emoji) ──
var NAV_PAGES = ["Dashboard", "Uni", "Work", "Gym", "Personal", "Finance", "Invest", "Journal", "Boardroom", "Projects", "Shopping"];
function NavGlyph(props) {
  var n = props.name;
  var s = props.size || 18;
  var a = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: props.sw || 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  var g = {
    Dashboard: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    })),
    Uni: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M22 10 12 5 2 10l10 5 10-5Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"
    })),
    Work: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "2.5",
      y: "7",
      width: "19",
      height: "13",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2.5 12.5h19"
    })),
    Gym: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M6.5 6.5v11M17.5 6.5v11M4 9v6M20 9v6M6.5 12h11"
    })),
    Personal: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"
    })),
    Finance: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14.5 9.2c-.5-1-1.5-1.5-2.7-1.5-1.6 0-2.8.9-2.8 2.2 0 1.4 1.2 1.9 2.8 2.3 1.6.4 2.8.9 2.8 2.3 0 1.3-1.2 2.2-2.8 2.2-1.3 0-2.3-.6-2.8-1.6M12 6v1.7M12 16.3V18"
    })),
    Invest: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M3 17l5-5 3 3 7-7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 8h5v5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 21h18"
    })),
    Journal: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M5 4h11a2 2 0 0 1 2 2v14l-4-2.2L10 20l-4-2.2V6a2 2 0 0 1 2-2Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 8h6M9 11.5h6"
    })),
    Boardroom: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m15.5 8.5-2 5.5-5.5 2 2-5.5 5.5-2Z"
    })),
    Projects: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M4 5h13a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 4.5v3M8 12l1.6 1.6L12.5 10M8 17h6"
    })),
    Shopping: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M4 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h7.3a1.5 1.5 0 0 0 1.5-1.2L21 8H7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "10",
      cy: "20",
      r: "1.2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "20",
      r: "1.2"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", a, g[n] || null);
}

// ── Utility glyphs — stroke-based line icons that replace functional emoji ──
function UIcon(props) {
  var n = props.name;
  var s = props.size || 16;
  var a = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: props.sw || 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  var g = {
    bolt: /*#__PURE__*/React.createElement("path", {
      d: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
    }),
    pencil: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M12 20h9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
    })),
    calendar: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "4.5",
      width: "18",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 9h18M8 2.5v4M16 2.5v4"
    })),
    gear: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3.2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"
    })),
    phone: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "6.5",
      y: "2.5",
      width: "11",
      height: "19",
      rx: "2.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11 18.5h2"
    })),
    desktop: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "2.5",
      y: "4",
      width: "19",
      height: "12",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 20h6M12 16v4"
    })),
    moon: /*#__PURE__*/React.createElement("path", {
      d: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
    }),
    flag: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M5 21V4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 4h11l-2 3 2 3H5"
    })),
    clock: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 7.5V12l3 2"
    })),
    drag: /*#__PURE__*/React.createElement("g", {
      fill: "currentColor",
      stroke: "none"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "6",
      r: "1.4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "15",
      cy: "6",
      r: "1.4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "12",
      r: "1.4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "15",
      cy: "12",
      r: "1.4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "18",
      r: "1.4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "15",
      cy: "18",
      r: "1.4"
    })),
    restore: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M3 12a9 9 0 1 0 3-6.7L3 8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 3v5h5"
    })),
    upload: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M12 16V4M7 9l5-5 5 5M5 20h14"
    })),
    sparkle: /*#__PURE__*/React.createElement("path", {
      d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z"
    }),
    target: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "8.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3.5"
    })),
    droplet: /*#__PURE__*/React.createElement("path", {
      d: "M12 3.5s6 6.3 6 10.2a6 6 0 0 1-12 0C6 9.8 12 3.5 12 3.5Z"
    }),
    wind: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M3 8h11a2.5 2.5 0 1 0-2.5-2.5M3 16h15a2.5 2.5 0 1 1-2.5 2.5M3 12h7"
    })),
    thermometer: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9v6.5"
    })),
    cloudrain: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M7 16h9.5a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1A3.6 3.6 0 0 0 7 16Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 19l-1 2.5M13 19l-1 2.5M17 19l-1 2.5"
    })),
    sync: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M21 12a9 9 0 0 1-15.3 6.4L3 16M3 12a9 9 0 0 1 15.3-6.4L21 8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 4v4h-4M3 20v-4h4"
    })),
    pin: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "2.5"
    })),
    bulb: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M9.2 17.5a6 6 0 1 1 5.6 0"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9.5 18.5h5M10.2 21h3.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9.2 17.5h5.6"
    })),
    chart: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M4 20V4M4 20h16"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "7",
      y: "11",
      width: "3",
      height: "6"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "12",
      y: "7",
      width: "3",
      height: "10"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "17",
      y: "13",
      width: "3",
      height: "4"
    })),
    trend: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M3 17l6-6 4 4 8-8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 7h6v6"
    })),
    eye: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })),
    warn: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3.5 22 20H2L12 3.5Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 10v4.5M12 17.2v.1"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", a, g[n] || null);
}

// ── Weather glyphs — line icons keyed to Open-Meteo weather codes ──
function wxGlyph(code, size) {
  var s = size || 30;
  var a = {
    width: s,
    height: s,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  function kind(c) {
    if (c === 0) return "clear";
    if (c === 1 || c === 2) return "partly";
    if (c === 3) return "cloud";
    if (c === 45 || c === 48) return "fog";
    if (c >= 51 && c <= 55) return "drizzle";
    if (c >= 61 && c <= 65 || c === 80 || c === 81) return "rain";
    if (c === 82) return "heavy";
    if (c >= 71 && c <= 75) return "snow";
    if (c >= 95) return "storm";
    return "cloud";
  }
  var cloud = /*#__PURE__*/React.createElement("path", {
    d: "M9.5 23.5h13a4.8 4.8 0 0 0 .4-9.6 6.6 6.6 0 0 0-12.7-1.3 4.9 4.9 0 0 0-.7 10.9Z"
  });
  var k = kind(code);
  if (k === "clear") return /*#__PURE__*/React.createElement("svg", a, /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "16",
    r: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2.1 2.1M22.4 22.4l2.1 2.1M24.5 7.5l-2.1 2.1M9.6 22.4l-2.1 2.1"
  }));
  if (k === "partly") return /*#__PURE__*/React.createElement("svg", a, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 4v2M4 11h2M6 6l1.4 1.4M16 6l-1.4 1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 26h11a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.8-1.1A4.2 4.2 0 0 0 12 26Z"
  }));
  if (k === "cloud") return /*#__PURE__*/React.createElement("svg", a, cloud);
  if (k === "fog") return /*#__PURE__*/React.createElement("svg", a, cloud, /*#__PURE__*/React.createElement("path", {
    d: "M8 27h16M10 30h13"
  }));
  if (k === "drizzle") return /*#__PURE__*/React.createElement("svg", a, cloud, /*#__PURE__*/React.createElement("path", {
    d: "M12 26l-.8 2M16 26l-.8 2M20 26l-.8 2"
  }));
  if (k === "rain") return /*#__PURE__*/React.createElement("svg", a, cloud, /*#__PURE__*/React.createElement("path", {
    d: "M12 26l-1.4 3.2M16.5 26l-1.4 3.2M21 26l-1.4 3.2"
  }));
  if (k === "heavy") return /*#__PURE__*/React.createElement("svg", a, cloud, /*#__PURE__*/React.createElement("path", {
    d: "M11 25.5l-1.8 4M16 25.5l-1.8 4M21 25.5l-1.8 4"
  }));
  if (k === "snow") return /*#__PURE__*/React.createElement("svg", a, cloud, /*#__PURE__*/React.createElement("g", {
    fill: "currentColor",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11.5",
    cy: "27.5",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "27.5",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20.5",
    cy: "27.5",
    r: "1"
  })));
  if (k === "storm") return /*#__PURE__*/React.createElement("svg", a, cloud, /*#__PURE__*/React.createElement("path", {
    d: "M16.5 25l-3 4.5h3.2l-2.4 3.5"
  }));
  return /*#__PURE__*/React.createElement("svg", a, cloud);
}

// ── Shared button textures (white glass — matches the mock pill, no blue) ──
var whitePill = {
  appearance: "none",
  border: "1px solid rgba(255,255,255,0.30)",
  cursor: "pointer",
  background: "linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))",
  backdropFilter: "blur(14px) saturate(1.3)",
  WebkitBackdropFilter: "blur(14px) saturate(1.3)",
  color: "#f3f7fd",
  fontWeight: 600,
  fontSize: 13,
  padding: "11px 18px",
  borderRadius: 999,
  boxShadow: "0 6px 22px rgba(0,0,0,0.40),inset 0 1px 0 rgba(255,255,255,0.28),inset 0 -1px 0 rgba(255,255,255,0.05)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  letterSpacing: 0.2
};
var editPill = {
  appearance: "none",
  border: "1px solid rgba(255,255,255,0.22)",
  cursor: "pointer",
  background: "linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))",
  color: "#dce4f0",
  fontWeight: 600,
  fontSize: 11,
  padding: "4px 12px",
  borderRadius: 999,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20)",
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  lineHeight: 1.5,
  whiteSpace: "nowrap"
};
// ── Canonical button textures (white frosted glass) — secondary + primary ──
var btnGlass = {
  appearance: "none",
  padding: "6px 13px",
  borderRadius: 999,
  border: "1px solid rgba(91,140,255,0.35)",
  background: "rgba(91,140,255,0.14)",
  color: "rgba(180,210,255,0.92)",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 500,
  boxShadow: "inset 0 1px 0 rgba(91,140,255,0.18)",
  whiteSpace: "nowrap"
};
var btnGlassP = {
  appearance: "none",
  padding: "6px 14px",
  borderRadius: 999,
  border: "1px solid rgba(91,140,255,0.55)",
  background: "linear-gradient(135deg,rgba(91,140,255,0.88),rgba(50,85,204,0.92))",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  boxShadow: "0 2px 12px rgba(50,90,200,0.40),inset 0 1px 0 rgba(255,255,255,0.22)",
  whiteSpace: "nowrap"
};
// ── Card surface: soft white "aurora" bloom from the TOP-RIGHT corner + elevated shadow so cards pop ──
var cardBg = "radial-gradient(ellipse 108% 72px at 0% 0%,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.06) 40%,transparent 65%),radial-gradient(ellipse 108% 60px at 100% 100%,rgba(255,255,255,0.09) 0%,rgba(255,255,255,0.02) 40%,transparent 65%),rgba(18,22,42,0.82)";
var cardShadow = "0 18px 46px rgba(0,0,0,0.52),0 6px 16px rgba(0,0,0,0.34),inset 0 1px 0 rgba(255,255,255,0.22)";
var cardShadowSoft = "0 10px 26px rgba(0,0,0,0.44),inset 0 1px 0 rgba(255,255,255,0.18)";
var INIT = {
  uni: {
    subjects: [],
    completedEvents: [],
    assessments: SYLLABUS_ASSESSMENTS.map(function (a) {
      return _objectSpread({}, a);
    })
  },
  gym: {
    exercises: [],
    bodyWeight: [],
    lastBWWeek: null,
    rotation: [{
      id: 1,
      name: "Push Day",
      focus: "Chest, shoulders, triceps"
    }, {
      id: 2,
      name: "Pull Day",
      focus: "Back, biceps"
    }, {
      id: 3,
      name: "Legs · Hamstring Focus",
      focus: "Hamstrings, glutes, calves"
    }, {
      id: 4,
      name: "Upper Day",
      focus: "Full upper body"
    }, {
      id: 5,
      name: "Legs · Quad Focus",
      focus: "Quads, glutes, calves"
    }],
    rotIdx: 0,
    workouts: []
  },
  personal: {
    tasks: [],
    archived: []
  },
  docs: [],
  reflections: [],
  finance: {
    financeVersion: 2,
    sources: [{
      id: 1,
      name: "GoTab (Rippling)",
      amount: 0
    }, {
      id: 2,
      name: "Jobseeker",
      amount: 0
    }, {
      id: 3,
      name: "",
      amount: 0
    }],
    monthlyBudget: 0,
    monthlyIncome: {},
    recurringTemplates: [],
    monthlyRecurringOverrides: {},
    expenses: [],
    hourlyRate: 0
  },
  invest: {
    watchlist: [{
      symbol: "AAPL"
    }, {
      symbol: "MSFT"
    }, {
      symbol: "NVDA"
    }],
    holdings: []
  },
  work: {
    hourlyRate: 0,
    payCycleDay: 1,
    goals: [{
      id: "g2",
      label: "Pay target",
      target: 800,
      unit: "$"
    }, {
      id: "g3",
      label: "Tasks logged",
      target: 20,
      unit: " tasks"
    }],
    shiftLogs: {},
    progressiveSince: "",
    attendanceMigrated: false,
    taskLog: [],
    focusGoals: []
  },
  projects: [],
  shopping: []
};

// Recursively remove undefined values — Firestore rejects any undefined in the document
function stripUndefined(v) {
  if (Array.isArray(v)) return v.map(stripUndefined);
  if (v && _typeof(v) === "object") {
    var o = {};
    Object.keys(v).forEach(function (k) {
      if (v[k] !== undefined) o[k] = stripUndefined(v[k]);
    });
    return o;
  }
  return v;
}
// Reconcile saved assessments with the latest SYLLABUS_ASSESSMENTS defaults.
// Always uses the canonical date from defaults; preserves done status and custom entries.
function reconcileAssessments(saved, defaults) {
  var defMap = {};
  defaults.forEach(function (a) {
    defMap[a.id] = a;
  });
  var result = defaults.map(function (a) {
    var s = saved.filter(function (x) {
      return x.id === a.id;
    })[0];
    return s ? _objectSpread(_objectSpread({}, a), {}, {
      done: !!s.done
    }) : _objectSpread({}, a);
  });
  saved.forEach(function (s) {
    if (!defMap[s.id]) result.push(s);
  });
  return result;
}

// Merge cloud/localStorage data with INIT defaults so no field is ever undefined
function mergeWithDefaults(cloud) {
  if (!cloud || _typeof(cloud) !== "object") return _objectSpread(_objectSpread({}, INIT), {}, {
    reflections: SEED_REFL
  });
  var g = cloud.gym || {};
  var p = cloud.personal || {};
  var u = cloud.uni || {};
  return _objectSpread(_objectSpread(_objectSpread({}, INIT), cloud), {}, {
    personal: _objectSpread(_objectSpread(_objectSpread({}, INIT.personal), p), {}, {
      tasks: Array.isArray(p.tasks) ? p.tasks : INIT.personal.tasks || [],
      archived: Array.isArray(p.archived) ? p.archived : []
    }),
    gym: _objectSpread(_objectSpread(_objectSpread({}, INIT.gym), g), {}, {
      exercises: Array.isArray(g.exercises) ? g.exercises : INIT.gym.exercises,
      bodyWeight: Array.isArray(g.bodyWeight) ? g.bodyWeight : [],
      workouts: Array.isArray(g.workouts) ? g.workouts : [],
      rotation: Array.isArray(g.rotation) ? g.rotation : INIT.gym.rotation,
      rotIdx: typeof g.rotIdx === "number" ? g.rotIdx : 0
    }),
    uni: _objectSpread(_objectSpread(_objectSpread({}, INIT.uni), u), {}, {
      subjects: Array.isArray(u.subjects) ? u.subjects : INIT.uni.subjects,
      completedEvents: Array.isArray(u.completedEvents) ? u.completedEvents : [],
      assessments: Array.isArray(u.assessments) && u.assessments.length > 0 ? reconcileAssessments(u.assessments, SYLLABUS_ASSESSMENTS) : SYLLABUS_ASSESSMENTS.map(function (a) {
        return _objectSpread({}, a);
      })
    }),
    work: function () {
      var w = cloud.work || {};
      return _objectSpread(_objectSpread(_objectSpread({}, INIT.work), w), {}, {
        hourlyRate: Number(w.hourlyRate || cloud.finance && cloud.finance.hourlyRate || 0),
        payCycleDay: Number(w.payCycleDay || cloud.payCycleDay || 1),
        goals: Array.isArray(w.goals) ? w.goals : INIT.work.goals,
        shiftLogs: w.shiftLogs && _typeof(w.shiftLogs) === "object" ? w.shiftLogs : {},
        progressiveSince: w.progressiveSince || "",
        attendanceMigrated: !!w.attendanceMigrated,
        taskLog: Array.isArray(w.taskLog) ? w.taskLog : [],
        focusGoals: Array.isArray(w.focusGoals) ? w.focusGoals : []
      });
    }(),
    reflections: Array.isArray(cloud.reflections) && cloud.reflections.length > 0 ? cloud.reflections : SEED_REFL,
    projects: Array.isArray(cloud.projects) ? cloud.projects : [],
    shopping: Array.isArray(cloud.shopping) ? cloud.shopping : []
  });
}
// Returns true if `d` looks like a freshly-seeded state with no user-generated content.
// Used as a safety net to refuse Firestore writes that would wipe real cloud data.
// Add fields here if you introduce new user-generated arrays elsewhere in INIT.
function isLikelySeedState(d) {
  if (!d || _typeof(d) !== "object") return true;
  var n = function n(arr) {
    return Array.isArray(arr) ? arr.length : 0;
  };
  return n(d.reflections) === 0 && n(d.personal && d.personal.tasks) === 0 && n(d.personal && d.personal.archived) === 0 && n(d.gym && d.gym.exercises) === 0 && n(d.gym && d.gym.workouts) === 0 && n(d.gym && d.gym.bodyWeight) === 0 && n(d.finance && d.finance.expenses) === 0 && n(d.uni && d.uni.completedEvents) === 0 && n(d.projects) === 0 && n(d.shopping) === 0 && n(d.docs) === 0;
}
function localDateStr(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function todayStr() {
  return localDateStr(new Date());
}
function futureDateStr(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  return localDateStr(d);
}
function pastDateStr(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  return localDateStr(d);
}
function fmtTime12(t) {
  if (!t) return "";
  var parts = t.split(":");
  var h = parseInt(parts[0], 10);
  var ap = h >= 12 ? "pm" : "am";
  var h12 = h % 12 || 12;
  return h12 + ":" + parts[1] + ap;
}
function weekMonday() {
  var n = new Date();
  var d = n.getDay();
  var off = d === 0 ? -6 : 1 - d;
  var m = new Date(n);
  m.setDate(n.getDate() + off);
  return localDateStr(m);
}
function daysBetween(s) {
  var d = new Date(s + 'T00:00:00');
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d - today) / 864e5);
}
function fmtDate(s) {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short"
  });
}
function toMins(s) {
  var parts = (s || "0:00").split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
}
function parseTimes(t) {
  if (!t) return {
    start: 480,
    end: 540
  };
  var norm = t.replace(/[–-]/g, "|");
  var parts = norm.split("|");
  return {
    start: toMins(parts[0].trim()),
    end: toMins(parts[1].trim())
  };
}
function getWeekDates(ref) {
  var now = ref || new Date();
  var dow = now.getDay();
  var off = dow === 0 ? -6 : 1 - dow;
  return DAYS.map(function (_, i) {
    var d = new Date(now);
    d.setDate(now.getDate() + off + i);
    return d;
  });
}
function dStr(d) {
  return localDateStr(d);
}
function shiftPay(timeStr) {
  if (!timeStr) return null;
  var t = parseTimes(timeStr);
  var CUT = 19 * 60;
  var norm = 0,
    pen = 0;
  for (var m = t.start; m < t.end; m++) {
    m < CUT ? norm++ : pen++;
  }
  return {
    normalHrs: +(norm / 60).toFixed(2),
    penaltyHrs: +(pen / 60).toFixed(2),
    totalEquiv: +(norm / 60 + pen / 60 * 1.5).toFixed(2)
  };
}
function taskUrg(t) {
  if (t.done) return "done";
  var od = t.due ? daysBetween(t.due) * -1 : 0;
  var ref = t.editedAt || t.addedAt || todayStr();
  var age = Math.floor((new Date() - new Date(ref)) / 864e5);
  if (od > 7) return "red";
  if (od > 3) return "yellow";
  if (od > 0) return "orange";
  if (age > 7) return "yellow";
  return t.priority === "urgent" ? "urgent" : "normal";
}
var TUC = {
  red: T.danger,
  yellow: T.warn,
  orange: T.orange,
  urgent: T.danger,
  normal: T.text2,
  done: T.success
};
function taskLabel(t) {
  if (t.done) return "done";
  var od = t.due ? daysBetween(t.due) * -1 : 0;
  var ref = t.editedAt || t.addedAt || todayStr();
  var age = Math.floor((new Date() - new Date(ref)) / 864e5);
  if (od > 0) return od + "d overdue";
  if (age > 7) return "untouched " + age + "d";
  if (t.due) return "due " + fmtDate(t.due);
  return "";
}
var SEED_REFL = [];
function analyzeReflectionFallback(answers, history) {
  var allText = answers.map(function (a) {
    return a.a;
  }).join(" ").toLowerCase();
  var NEG = ["overwhelm", "stressed", "stress", "anxious", "anxiety", "tired", "exhaust", "frustrat", "struggl", "difficult", "hard", "fail", "behind", "worr", "drain", "burnout", "burnt out", "can't", "couldn't", "unable", "avoid", "procrastinat", "miss", "forgot", "lonely", "isolat", "depress", "hopeless", "unmotivated", "no motivation", "falling behind"];
  var POS = ["great", "well", "good", "happy", "proud", "confident", "motivat", "focused", "achiev", "succeed", "managed", "improv", "progress", "excited", "grateful", "calm", "balanced", "productive", "consistent", "win", "celebrat", "better", "strong", "growth", "learn", "breakthrough", "clarity", "clear"];
  var PERF = ["perfect", "not good enough", "should have", "could have", "disappoint", "let myself down", "not where", "behind schedule", "should be", "wasn't enough", "fell short", "not enough", "never enough"];
  var BURNOUT = ["exhaust", "burnt out", "burnout", "drain", "can't keep", "too much", "overwhelming", "no energy", "so tired", "no motivation", "running on empty", "barely"];
  var GROWTH = ["learn", "improv", "trying", "working on", "getting better", "progress", "develop", "growing", "want to improve", "next week", "work on", "focus on"];
  var AON = ["always", "never", "everything", "nothing", "complete failure", "totally", "all the time", "every time", "impossible", "worst"];
  function countHits(text, kws) {
    return kws.filter(function (k) {
      return text.indexOf(k) !== -1;
    }).length;
  }
  var neg = countHits(allText, NEG);
  var pos = countHits(allText, POS);
  var perf = countHits(allText, PERF);
  var burn = countHits(allText, BURNOUT);
  var growth = countHits(allText, GROWTH);
  var aon = countHits(allText, AON);
  var sentScore = Math.max(-1, Math.min(1, (pos - neg) / 6));
  var emotionalState;
  if (sentScore >= 0.5) emotionalState = "Positive, feeling capable and progressing";else if (sentScore >= 0.1) emotionalState = "Cautiously optimistic, mixed but moving forward";else if (sentScore >= -0.1) emotionalState = "Neutral, steady but not thriving";else if (sentScore >= -0.4) emotionalState = "Stressed, carrying notable tension this week";else emotionalState = "Depleted, significant strain detected";
  var patterns = [];
  if (burn >= 2) patterns.push("burnout_risk");
  if (perf >= 2) patterns.push("perfectionism");
  if (aon >= 2) patterns.push("all_or_nothing");
  if (growth >= 2) patterns.push("growth_mindset");
  if (neg > pos * 1.5) patterns.push("high_stress");
  if (pos > neg * 2) patterns.push("resilient_week");
  var qScores = answers.map(function (a) {
    var t = a.a.toLowerCase();
    return countHits(t, POS) - countHits(t, NEG);
  });
  var worstIdx = qScores.indexOf(Math.min.apply(null, qScores));
  var bestIdx = qScores.indexOf(Math.max.apply(null, qScores));
  var areas = ["your academic load", "your work situation", "your physical health habits", "your work-life balance", "your personal growth direction"];
  var dominantPattern;
  if (patterns.indexOf("burnout_risk") !== -1) dominantPattern = "Burnout risk, energy reserves running low";else if (patterns.indexOf("perfectionism") !== -1) dominantPattern = "Perfectionist pressure, very high internal standards";else if (patterns.indexOf("high_stress") !== -1) dominantPattern = "High stress load, multiple areas feeling stretched";else if (patterns.indexOf("all_or_nothing") !== -1) dominantPattern = "All-or-nothing thinking, seeing things in extremes";else if (patterns.indexOf("growth_mindset") !== -1) dominantPattern = "Growth orientation, approaching challenges with curiosity";else if (patterns.indexOf("resilient_week") !== -1) dominantPattern = "Resilient week, navigating challenges effectively";else dominantPattern = "Steady week, maintaining baseline without major spikes";
  var rootIssue;
  if (worstIdx >= 0 && qScores[worstIdx] < 0) {
    rootIssue = "Strongest friction in " + areas[worstIdx];
    if (patterns.indexOf("perfectionism") !== -1) rootIssue += ", possibly amplified by perfectionist expectations";else if (patterns.indexOf("all_or_nothing") !== -1) rootIssue += ", all-or-nothing framing may be intensifying this";
  } else {
    rootIssue = bestIdx >= 0 ? "Strongest momentum in " + areas[bestIdx] : "No single dominant friction point this week";
  }
  var insight;
  if (patterns.indexOf("burnout_risk") !== -1) insight = "Your language this week signals depletion across multiple areas. Burnout doesn't arrive suddenly, it builds through sustained output without adequate recovery. The fact that you're recognising it is the first and most important step. Your nervous system is asking for genuine rest, not just less work.";else if (patterns.indexOf("perfectionism") !== -1) insight = "There's a pattern of measuring your efforts against an ideal rather than a realistic baseline. Perfectionism often masquerades as high standards but functions as a stress amplifier, raising the bar each time you clear it. Progress over perfection is a skill worth practising deliberately this week.";else if (patterns.indexOf("all_or_nothing") !== -1) insight = "Your language this week leans toward absolutes (always/never/everything/nothing). This thinking pattern amplifies difficulty: one missed session becomes 'failing at fitness,' one hard day becomes 'a terrible week.' The reality almost always sits in the grey zone.";else if (patterns.indexOf("high_stress") !== -1) insight = "Multiple domains felt strained simultaneously this week. When stress shows up across academic, physical, and relational areas at once, it usually signals that recovery mechanisms need attention: sleep quality, micro-breaks, and brief transitions between tasks often matter more than you'd expect.";else if (patterns.indexOf("growth_mindset") !== -1) insight = "You approached challenges this week with curiosity rather than rigidity, looking at what to improve rather than cataloguing what went wrong. That orientation is a genuine psychological strength. It's the difference between feedback as information and feedback as verdict.";else if (sentScore >= 0.3) insight = "This was a strong week. Take a moment to notice what conditions made that possible — specific habits, environments, or mindsets. Understanding what works is as valuable as diagnosing what doesn't, and most people skip this step.";else insight = "A stable week — not dramatic in either direction. These plateau periods are where consistent habits quietly build the foundations for future momentum. The absence of visible progress doesn't mean nothing is moving.";
  var recommendation;
  if (patterns.indexOf("burnout_risk") !== -1) recommendation = "Prioritise one genuinely restorative activity this week, not productive rest, actual rest. Protect one block of time with no output requirement. Even 90 minutes of complete disconnection can meaningfully reset your baseline.";else if (patterns.indexOf("perfectionism") !== -1) recommendation = "Before your next major task, decide in advance what 'good enough' looks like and aim for that deliberately. Notice the difference in energy expenditure versus your usual standard.";else if (patterns.indexOf("all_or_nothing") !== -1) recommendation = "When you notice absolute language in your own thinking, pause and find one counter-example. One exception breaks the rule and restructures the framing entirely.";else if (patterns.indexOf("high_stress") !== -1) recommendation = "Identify the single highest-leverage action that would reduce your stress load most, not the most urgent task, but the one whose completion creates the most breathing room, and do that one first this week.";else if (patterns.indexOf("growth_mindset") !== -1) recommendation = "Channel this week's momentum into one specific commitment: pick the area with the most untapped potential from your reflection and schedule a deliberate block of time for it.";else recommendation = "Note down what made this week manageable: two or three specific conditions that were present. Keep these as a reference point when harder weeks arrive.";
  var patternHistory = "First reflection. Patterns will emerge as you keep logging each week.";
  if (history && history.length >= 2) {
    var prev = history.slice(-5);
    var prevTexts = prev.map(function (r) {
      return (r.answers || []).map(function (a) {
        return a.a || a.answer || "";
      }).join(" ").toLowerCase();
    });
    var stressWeeks = prevTexts.filter(function (t) {
      return countHits(t, NEG) > countHits(t, POS);
    }).length;
    var prevPats = [].concat.apply([], history.slice(-4).filter(function (r) {
      return r.analysis && r.analysis.detectedPatterns;
    }).map(function (r) {
      return r.analysis.detectedPatterns;
    }));
    var burnCount = prevPats.filter(function (p) {
      return p === "burnout_risk";
    }).length;
    var perfCount = prevPats.filter(function (p) {
      return p === "perfectionism";
    }).length;
    var stressCount = prevPats.filter(function (p) {
      return p === "high_stress";
    }).length;
    var total = prev.length;
    if (burnCount >= 2) patternHistory = "Burnout risk has appeared in " + burnCount + " of your last " + Math.min(4, history.length) + " reflections. This is a recurring pattern that warrants real attention, not just a harder push.";else if (perfCount >= 2) patternHistory = "Perfectionism has surfaced in " + perfCount + " of your last " + Math.min(4, history.length) + " reflections, a consistent internal pressure source rather than a one-off response.";else if (stressCount >= 2) patternHistory = "High stress has been flagged in " + stressCount + " recent reflections. Worth asking: is this situational (exam period, busy work stretch) or a longer pattern?";else if (stressWeeks >= Math.ceil(total * 0.7)) patternHistory = "Stress has dominated " + stressWeeks + " of your last " + total + " reflections. Worth asking: is this environment, workload, or an internal pattern?";else if (stressWeeks === 0) patternHistory = "Consistently positive tone across your last " + total + " reflections. You're tracking a meaningful stretch of stability and growth.";else patternHistory = "Mixed weeks across your last " + total + " reflections (" + stressWeeks + " higher-stress, " + (total - stressWeeks) + " more positive). No single dominant pattern yet. Keep logging for clearer trends.";
  } else if (history && history.length === 1) {
    patternHistory = "Second reflection logged. One more week of data needed before cross-week patterns can be identified.";
  }
  return {
    emotionalState: emotionalState,
    dominantPattern: dominantPattern,
    rootIssue: rootIssue,
    insight: insight,
    recommendation: recommendation,
    patternHistory: patternHistory,
    sentimentScore: sentScore,
    detectedPatterns: patterns,
    sentColor: sentScore >= 0.1 ? "#69f0ae" : sentScore <= -0.1 ? "#ff6b6b" : "#ffd166",
    sentBg: sentScore >= 0.1 ? "rgba(105,240,174,0.06)" : sentScore <= -0.1 ? "rgba(255,107,107,0.06)" : "rgba(255,209,102,0.06)",
    sentBorder: sentScore >= 0.1 ? "rgba(105,240,174,0.25)" : sentScore <= -0.1 ? "rgba(255,107,107,0.25)" : "rgba(255,209,102,0.25)"
  };
}

// ── Assessment detection ──────────────────────────────────────────────────────
// The implementation moved to jarvis-signals.js (loaded before app.js) when the
// Daily Check-in was retired, so it is unit-tested and Jarvis's uni signal can
// never disagree with what the Classes card treats as a class. Thin delegates —
// do not reimplement here.
function isWeeklyClass(title) {
  return window.JarvisSignals.isWeeklyClass(title);
}
function isAssessmentEvent(ev) {
  return window.JarvisSignals.isAssessmentEvent(ev);
}
var CLOSE_ONLY_MODALS = ["task_detail", "edit_necessities", "day_done"];
var UNI_KEYS = ["uni", "tafe", "rmit", "university", "curtin", "monash", "deakin", "uts", "usyd", "uq", "uwa", "anu", "unsw", "federation"];
function isUniCalEv(ev) {
  return ev.calName && UNI_KEYS.some(function (k) {
    return ev.calName.toLowerCase().includes(k);
  });
}
function isGoTabEvent(ev) {
  return !ev.allDay && ev.time && ev.time !== "All day" && (ev.calName && (ev.calName.toLowerCase().includes("gotab") || ev.calName.toLowerCase().includes("jayden.pineda")) || ev._email && ev._email.toLowerCase().includes("gotab") || ev.title && (ev.title.toLowerCase().includes("gotab") || ev.title.toLowerCase().includes("shift")));
}
// Stable per-shift key so two shifts on the SAME day don't collide in shiftLogs/expanded state.
function shiftKey(ev) {
  return ev && ev.id != null ? String(ev.id) : (ev && ev.date || "") + "|" + (ev && ev.time || "");
}
// Classify a work-calendar event: payable shift, paid meeting (highlighted differently), or ignored.
// Rules by day+time (Australia local): Sat 7–8am = ignore (never attended/unpaid);
// Tue 2:00pm & Fri 11:00am = recurring paid meeting; everything else = shift.
function classifyWorkEvent(ev) {
  if (!ev || !ev.date || !ev.time) return "shift";
  var dow = new Date(ev.date + "T12:00:00").getDay();
  var t = parseTimes(ev.time);
  function near(v, target) {
    return Math.abs(v - target) <= 10;
  }
  if (dow === 6 && near(t.start, 7 * 60)) return "ignore"; // Saturday 7am event
  if (dow === 2 && near(t.start, 14 * 60)) return "meeting"; // Tuesday 2:00pm
  if (dow === 5 && near(t.start, 11 * 60)) return "meeting"; // Friday 11:00am
  return "shift";
}
// Shared attendance predicate (used by Work + Finance). A shift/meeting counts toward REAL pay
// only when actually worked/attended: shifts when marked worked or (legacy) before the cutoff;
// meetings only when explicitly marked attended.
function workEntryFor(ev, shiftLogs) {
  return shiftLogs && (shiftLogs[shiftKey(ev)] || shiftLogs[ev.date]) || {};
}
function isWorkEventCounted(ev, shiftLogs, progressiveSince) {
  var kind = classifyWorkEvent(ev);
  if (kind === "ignore") return false;
  var e = workEntryFor(ev, shiftLogs);
  if (kind === "meeting") return e.attended === true;
  if (e.attended === true) return true;
  if (e.attended === false) return false;
  return progressiveSince ? ev.date < progressiveSince : true;
}
function dedupeEvents(evs) {
  var seen = new Map();
  var sorted = evs.slice().sort(function (a, b) {
    var aP = (a._email || "").includes("jaydenpineda30") ? 0 : 1;
    var bP = (b._email || "").includes("jaydenpineda30") ? 0 : 1;
    return aP - bP;
  });
  for (var i = 0; i < sorted.length; i++) {
    var ev = sorted[i];
    var key = (ev.title || "") + "||" + (ev.date || "") + "||" + (ev.time || "");
    if (!seen.has(key)) seen.set(key, ev);
  }
  return Array.from(seen.values());
}
// AI functions are provided by OllamaService (ollama-service.js)
// which tries Gemini first, then falls back to local rule-based logic.

function renderMd(text) {
  if (!text) return null;
  var lines = text.split('\n');
  var elements = [];
  var listItems = [];
  function flushList() {
    if (listItems.length > 0) {
      elements.push( /*#__PURE__*/React.createElement("ul", {
        key: 'ul' + elements.length,
        style: {
          margin: '4px 0 4px 4px',
          paddingLeft: 14
        }
      }, listItems));
      listItems = [];
    }
  }
  lines.forEach(function (line, i) {
    var trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }
    var isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
    var content = isBullet ? trimmed.slice(2) : trimmed;
    var boldParts = content.split(/\*\*(.*?)\*\*/);
    var inline = [];
    boldParts.forEach(function (p, j) {
      if (j % 2 === 1) {
        inline.push( /*#__PURE__*/React.createElement("strong", {
          key: 'b' + i + '_' + j
        }, p));
        return;
      }
      var wlParts = p.split(/\[\[([^\]]+)\]\]/);
      wlParts.forEach(function (wp, k) {
        if (k % 2 === 1) {
          inline.push( /*#__PURE__*/React.createElement("span", {
            key: 'w' + i + '_' + j + '_' + k,
            style: {
              color: '#5b8cff',
              background: 'rgba(91,140,255,0.10)',
              padding: '1px 6px',
              borderRadius: 4,
              fontWeight: 500,
              fontSize: '0.96em'
            }
          }, wp));
        } else if (wp) {
          inline.push(wp);
        }
      });
    });
    if (isBullet) {
      listItems.push( /*#__PURE__*/React.createElement("li", {
        key: i,
        style: {
          marginBottom: 1
        }
      }, inline));
    } else {
      flushList();
      elements.push( /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          marginBottom: 2
        }
      }, inline));
    }
  });
  flushList();
  return elements;
}
function Sparkline(props) {
  var data = props.data || [];
  var color = props.color || T.accent;
  var w = props.width || 220;
  var h = props.height || 48;
  if (data.length < 2) return React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      padding: "8px 0"
    }
  }, "Log more entries to see trend");
  var vals = data.map(function (d) {
    return d.weight;
  });
  var mn = Math.min.apply(null, vals) - 1;
  var mx = Math.max.apply(null, vals) + 1;
  var range = mx - mn;
  var pts = vals.map(function (v, i) {
    return i / (vals.length - 1) * w + "," + (h - (v - mn) / range * h);
  }).join(" ");
  return React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: 4
    }
  }, React.createElement("svg", {
    width: w,
    height: h,
    style: {
      overflow: "visible",
      display: "block"
    }
  }, React.createElement("polyline", {
    points: pts,
    fill: "none",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }), vals.map(function (v, i) {
    var x = i / (vals.length - 1) * w;
    var y = h - (v - mn) / range * h;
    return React.createElement("circle", {
      key: i,
      cx: x,
      cy: y,
      r: "2.5",
      fill: color
    });
  })), React.createElement("div", {
    style: {
      position: "absolute",
      right: 0,
      top: 0,
      fontSize: 11,
      fontWeight: 700,
      color: color
    }
  }, vals[vals.length - 1] + "kg"));
}
function useIsMob() {
  var _useState = useState(typeof window !== "undefined" && window.innerWidth < 768),
    _useState2 = _slicedToArray(_useState, 2),
    m = _useState2[0],
    setM = _useState2[1];
  useEffect(function () {
    function h() {
      setM(window.innerWidth < 768);
    }
    window.addEventListener("resize", h);
    return function () {
      window.removeEventListener("resize", h);
    };
  }, []);
  return m;
}

// ── Weather widget ────────────────────────────────────────────────────────────
// WX_MAP, WX_DAYS → data.js
var WX_STALE = 30 * 60 * 1000;
var WX_URL = "https://api.open-meteo.com/v1/forecast?latitude=-37.8136&longitude=144.9631&current=temperature_2m,apparent_temperature,weather_code,precipitation_probability,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Australia/Melbourne&forecast_days=8";
function wxOpenDB() {
  return new Promise(function (res, rej) {
    var r = indexedDB.open("dash_weather", 1);
    r.onupgradeneeded = function (e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains("c")) db.createObjectStore("c", {
        keyPath: "k"
      });
    };
    r.onsuccess = function (e) {
      res(e.target.result);
    };
    r.onerror = function () {
      rej(r.error);
    };
  });
}
function wxGet(db) {
  return new Promise(function (res) {
    var r = db.transaction("c", "readonly").objectStore("c").get("wx");
    r.onsuccess = function () {
      res(r.result || null);
    };
    r.onerror = function () {
      res(null);
    };
  });
}
function wxPut(db, payload) {
  return new Promise(function (res) {
    var tx = db.transaction("c", "readwrite");
    tx.objectStore("c").put(_objectSpread({
      k: "wx"
    }, payload));
    tx.oncomplete = res;
    tx.onerror = res;
  });
}
function WeatherWidget(props) {
  var mob = props.mob || false;
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    wx = _useState4[0],
    setWx = _useState4[1];
  var _useState5 = useState("loading"),
    _useState6 = _slicedToArray(_useState5, 2),
    status = _useState6[0],
    setStatus = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    open = _useState8[0],
    setOpen = _useState8[1];
  var _useState9 = useState(null),
    _useState10 = _slicedToArray(_useState9, 2),
    selDay = _useState10[0],
    setSelDay = _useState10[1];
  function load() {
    return _load.apply(this, arguments);
  }
  function _load() {
    _load = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var db, cached, stale, resp, json, c, pad, now, curKey, hStart, hourly, daily, fresh;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return wxOpenDB();
          case 3:
            db = _context.sent;
            _context.next = 6;
            return wxGet(db);
          case 6:
            cached = _context.sent;
            stale = !cached || !cached.current || Date.now() - cached.fetchedAt > WX_STALE;
            if (cached && cached.current) setWx(cached);
            if (navigator.onLine) {
              _context.next = 12;
              break;
            }
            setStatus(cached && cached.current ? "offline" : "error");
            return _context.abrupt("return");
          case 12:
            if (!stale) {
              _context.next = 43;
              break;
            }
            _context.prev = 13;
            _context.next = 16;
            return fetch(WX_URL);
          case 16:
            resp = _context.sent;
            if (resp.ok) {
              _context.next = 19;
              break;
            }
            throw new Error("HTTP " + resp.status);
          case 19:
            _context.next = 21;
            return resp.json();
          case 21:
            json = _context.sent;
            c = json.current;
            pad = function pad(n) {
              return String(n).padStart(2, "0");
            };
            now = new Date();
            curKey = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + "T" + pad(now.getHours()) + ":00";
            hStart = json.hourly.time.indexOf(curKey);
            if (hStart < 0) hStart = 0;
            hourly = json.hourly.time.slice(hStart, hStart + 25).map(function (t, i) {
              return {
                time: t,
                temp: Math.round(json.hourly.temperature_2m[hStart + i]),
                code: json.hourly.weather_code[hStart + i] || 0,
                rain: json.hourly.precipitation_probability[hStart + i] || 0
              };
            });
            daily = json.daily.time.map(function (date, i) {
              return {
                date: date,
                high: Math.round(json.daily.temperature_2m_max[i]),
                low: Math.round(json.daily.temperature_2m_min[i]),
                code: json.daily.weather_code[i] || 0,
                rain: json.daily.precipitation_probability_max[i] || 0
              };
            });
            fresh = {
              current: {
                temp: Math.round(c.temperature_2m),
                feelsLike: Math.round(c.apparent_temperature),
                code: c.weather_code,
                rain: c.precipitation_probability || 0,
                humidity: c.relative_humidity_2m,
                wind: Math.round(c.wind_speed_10m)
              },
              hourly: hourly,
              daily: daily,
              fetchedAt: Date.now()
            };
            _context.next = 33;
            return wxPut(db, fresh);
          case 33:
            setWx(fresh);
            setStatus("ok");
            _context.next = 41;
            break;
          case 37:
            _context.prev = 37;
            _context.t0 = _context["catch"](13);
            if (window.ErrorHandler) ErrorHandler.log("Weather fetch failed: " + _context.t0.message, "error", "weather");
            setStatus(cached && cached.current ? "offline" : "error");
          case 41:
            _context.next = 44;
            break;
          case 43:
            setStatus("ok");
          case 44:
            _context.next = 50;
            break;
          case 46:
            _context.prev = 46;
            _context.t1 = _context["catch"](0);
            if (window.ErrorHandler) ErrorHandler.log("WeatherWidget error: " + _context.t1.message, "error", "weather");
            setStatus("error");
          case 50:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 46], [13, 37]]);
    }));
    return _load.apply(this, arguments);
  }
  useEffect(function () {
    load();
    var timer = setInterval(load, WX_STALE);
    window.addEventListener("online", load);
    return function () {
      clearInterval(timer);
      window.removeEventListener("online", load);
    };
  }, []);
  var cur = wx && wx.current;
  var desc = cur ? WX_MAP[cur.code] || "Unknown" : "--";
  var ageMin = wx ? Math.floor((Date.now() - wx.fetchedAt) / 60000) : null;
  var ageStr = ageMin === null ? null : ageMin < 2 ? "just now" : ageMin < 60 ? ageMin + "m ago" : Math.floor(ageMin / 60) + "h ago";
  function fmtHour(t) {
    var h = parseInt((t || "T0").split("T")[1]);
    return h === 0 ? "12am" : h < 12 ? h + "am" : h === 12 ? "12pm" : h - 12 + "pm";
  }
  function fmtDayLabel(dateStr, i) {
    if (i === 0) return "Today";
    if (i === 1) return "Tomorrow";
    var d = new Date(dateStr + "T00:00");
    return WX_DAYS[d.getDay()];
  }
  function fmtFullDate(dateStr) {
    var d = new Date(dateStr + "T00:00");
    return WX_DAYS[d.getDay()] + " " + d.getDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "glow-item",
    style: {
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 16,
      padding: "14px 16px",
      boxShadow: cardShadow
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3
    }
  }, "Melbourne"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, status === "offline" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      padding: "1px 6px",
      borderRadius: 99,
      background: T.warnBg,
      color: T.warn
    }
  }, "cached"), status === "loading" && !wx && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3
    }
  }, "loading..."), /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: function onClick() {
      trk("weather.refresh");
      setOpen(true);
    }
  }, "Forecast \u2192"))), status === "error" && !cur ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      padding: "8px 0"
    }
  }, "Weather unavailable") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#aebfe0",
      display: "flex",
      alignItems: "center"
    }
  }, cur ? wxGlyph(cur.code, 40) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      color: T.text3
    }
  }, "--")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      color: T.text,
      lineHeight: 1
    }
  }, cur ? cur.temp + "°" : "--"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginTop: 3
    }
  }, desc))), cur && cur.rain > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.warn,
      marginTop: 6
    }
  }, cur.rain, "% rain"), ageStr && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      marginTop: 6
    }
  }, "Updated ", ageStr))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.9)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      zIndex: 300,
      overflowY: "auto",
      padding: mob ? "0" : "20px"
    },
    onClick: function onClick() {
      setOpen(false);
      setSelDay(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 700,
      margin: mob ? "56px auto 0" : "24px auto",
      background: "rgba(11,14,40,0.99)",
      borderRadius: mob ? "16px 16px 0 0" : "20px",
      border: "0.5px solid rgba(91,140,255,0.3)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.85)",
      overflow: "hidden",
      minHeight: mob ? "calc(100vh - 56px)" : "auto"
    },
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: T.text
    }
  }, "Melbourne"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginTop: 1
    }
  }, "Victoria, Australia", ageStr ? " · Updated " + ageStr : "")), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "rgba(255,255,255,0.07)",
      border: "0.5px solid " + T.border,
      borderRadius: 8,
      color: T.text2,
      cursor: "pointer",
      fontSize: 15,
      padding: "5px 11px",
      lineHeight: 1
    },
    onClick: function onClick() {
      setOpen(false);
      setSelDay(null);
    }
  }, "\u2715")), cur && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px 20px",
      borderBottom: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 18,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#aebfe0",
      display: "flex",
      alignItems: "flex-end"
    }
  }, cur && wxGlyph(cur.code, 72)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 60,
      fontWeight: 800,
      color: T.text,
      lineHeight: 1,
      letterSpacing: "-2px"
    }
  }, cur.temp, "\xB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      color: T.text2,
      marginTop: 6
    }
  }, desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      marginTop: 3
    }
  }, "Feels like ", cur.feelsLike, "\xB0C"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 10
    }
  }, [["droplet", "Humidity", cur.humidity + "%"], ["wind", "Wind", cur.wind + " km/h"], ["cloudrain", "Rain chance", cur.rain + "%"]].map(function (row) {
    return /*#__PURE__*/React.createElement("div", {
      key: row[1],
      style: {
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        padding: "12px 14px",
        border: "0.5px solid " + T.border,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#aebfe0",
        display: "flex",
        justifyContent: "center",
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: row[0],
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginBottom: 3
      }
    }, row[1]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 700,
        color: T.text
      }
    }, row[2]));
  }))), wx && wx.hourly && wx.hourly.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px 20px",
      borderBottom: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: T.text2,
      marginBottom: 12,
      letterSpacing: 0.3
    }
  }, "24-hour forecast"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 4
    }
  }, wx.hourly.map(function (h, i) {
    var isNow = i === 0;
    return /*#__PURE__*/React.createElement("div", {
      key: h.time,
      style: {
        flexShrink: 0,
        textAlign: "center",
        padding: "12px 8px",
        borderRadius: 12,
        background: isNow ? "rgba(91,140,255,0.18)" : "rgba(255,255,255,0.03)",
        border: "0.5px solid " + (isNow ? T.accent + "" : T.border),
        minWidth: 64,
        position: "relative"
      }
    }, isNow && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 24,
        height: 2,
        borderRadius: 1,
        background: T.accent
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: isNow ? T.accent : T.text3,
        fontWeight: isNow ? 700 : 400,
        marginBottom: 6
      }
    }, isNow ? "Now" : fmtHour(h.time)), /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#aebfe0",
        display: "flex",
        justifyContent: "center",
        marginBottom: 6
      }
    }, wxGlyph(h.code, 24)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: T.text
      }
    }, h.temp, "\xB0"), h.rain > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.warn,
        marginTop: 4,
        fontWeight: 600
      }
    }, h.rain, "%"));
  }))), wx && wx.daily && wx.daily.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: T.text2,
      marginBottom: 12,
      letterSpacing: 0.3
    }
  }, "7-day forecast"), wx.daily.slice(0, 7).map(function (d, i) {
    var dDesc = WX_MAP[d.code] || "Unknown";
    var isSel = selDay === i;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: d.date
    }, /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        setSelDay(isSel ? null : i);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 12,
        background: isSel ? "rgba(91,140,255,0.1)" : "rgba(255,255,255,0.02)",
        border: "0.5px solid " + (isSel ? T.accent : T.border),
        cursor: "pointer",
        marginBottom: 6,
        transition: "background 0.12s,border 0.12s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 80,
        fontSize: 13,
        fontWeight: i === 0 ? 700 : 400,
        color: i === 0 ? T.accent : T.text
      }
    }, fmtDayLabel(d.date, i)), /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#aebfe0",
        display: "flex",
        flexShrink: 0
      }
    }, wxGlyph(d.code, 24)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12,
        color: T.text2
      }
    }, dDesc), d.rain > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.warn,
        fontWeight: 600,
        minWidth: 34,
        textAlign: "right"
      }
    }, d.rain, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        minWidth: 70,
        justifyContent: "flex-end"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: T.text
      }
    }, d.high, "\xB0"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: T.text3
      }
    }, d.low, "\xB0")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text3,
        marginLeft: 2
      }
    }, isSel ? "▴" : "▾")), isSel && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 16px",
        marginBottom: 6,
        borderRadius: 10,
        background: "rgba(91,140,255,0.06)",
        border: "0.5px solid rgba(91,140,255,0.2)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: T.text,
        marginBottom: 10
      }
    }, fmtFullDate(d.date)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 8
      }
    }, [["thermometer", "High", d.high + "°C"], ["thermometer", "Low", d.low + "°C"], ["cloudrain", "Rain", d.rain + "%"]].map(function (row) {
      return /*#__PURE__*/React.createElement("div", {
        key: row[1],
        style: {
          background: "rgba(255,255,255,0.04)",
          borderRadius: 8,
          padding: "10px 12px",
          border: "0.5px solid " + T.border,
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          color: "#aebfe0",
          display: "flex",
          justifyContent: "center",
          marginBottom: 4
        }
      }, /*#__PURE__*/React.createElement(UIcon, {
        name: row[0],
        size: 18
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: T.text3,
          marginBottom: 2
        }
      }, row[1]), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: T.text
        }
      }, row[2]));
    }))));
  })))));
}
function GymSection(props) {
  var gymData = props.gymData;
  var onAddEx = props.onAddEx;
  var onLogW = props.onLogW;
  var onSave = props.onSave;
  var onUpdateRot = props.onUpdateRot;
  var onDeleteBW = props.onDeleteBW;
  var onAddBW = props.onAddBW;
  var mob = props.mob || false;
  var _useState11 = useState({
      name: "",
      date: todayStr(),
      sets: []
    }),
    _useState12 = _slicedToArray(_useState11, 2),
    wkt = _useState12[0],
    setWkt = _useState12[1];
  var _useState13 = useState({
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    row = _useState14[0],
    setRow = _useState14[1];
  var _useState15 = useState(""),
    _useState16 = _slicedToArray(_useState15, 2),
    rName = _useState16[0],
    setRName = _useState16[1];
  var _useState17 = useState(""),
    _useState18 = _slicedToArray(_useState17, 2),
    rFocus = _useState18[0],
    setRFocus = _useState18[1];
  var _useState19 = useState(null),
    _useState20 = _slicedToArray(_useState19, 2),
    dragIdx = _useState20[0],
    setDragIdx = _useState20[1];
  var _useState21 = useState(null),
    _useState22 = _slicedToArray(_useState21, 2),
    dragOver = _useState22[0],
    setDragOver = _useState22[1];
  var _useState23 = useState(null),
    _useState24 = _slicedToArray(_useState23, 2),
    editRotIdx = _useState24[0],
    setEditRotIdx = _useState24[1];
  var _useState25 = useState({
      rName: "",
      rFocus: "",
      exercises: []
    }),
    _useState26 = _slicedToArray(_useState25, 2),
    editRotForm = _useState26[0],
    setEditRotForm = _useState26[1];
  var _useState27 = useState(false),
    _useState28 = _slicedToArray(_useState27, 2),
    showArchive = _useState28[0],
    setShowArchive = _useState28[1];
  var _useState29 = useState(true),
    _useState30 = _slicedToArray(_useState29, 2),
    showProgress = _useState30[0],
    setShowProgress = _useState30[1];
  var _useState31 = useState(null),
    _useState32 = _slicedToArray(_useState31, 2),
    expandedWktId = _useState32[0],
    setExpandedWktId = _useState32[1];
  var _useState33 = useState(false),
    _useState34 = _slicedToArray(_useState33, 2),
    showLegacyEx = _useState34[0],
    setShowLegacyEx = _useState34[1];
  var _useState35 = useState(false),
    _useState36 = _slicedToArray(_useState35, 2),
    bulkMode = _useState36[0],
    setBulkMode = _useState36[1];
  var _useState37 = useState(""),
    _useState38 = _slicedToArray(_useState37, 2),
    bulkText = _useState38[0],
    setBulkText = _useState38[1];
  var _useState39 = useState(""),
    _useState40 = _slicedToArray(_useState39, 2),
    bwInput = _useState40[0],
    setBwInput = _useState40[1];
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    editWktName = _useState42[0],
    setEditWktName = _useState42[1];
  var rotation = gymData.rotation || [];
  var rotLen = rotation.length > 0 ? rotation.length : 1;
  var rotIdx = (gymData.rotIdx || 0) % rotLen;
  var nextSess = rotation.length > 0 ? rotation[rotIdx] : null;
  useEffect(function () {
    try {
      var draft = JSON.parse(localStorage.getItem('gym_tab_draft') || 'null');
      if (draft && nextSess && draft.rotId === nextSess.id && draft.sets && draft.sets.some(function (r) {
        return r.exercise;
      })) {
        setWkt(function (w) {
          return w.sets.length > 0 && w.sets.some(function (r) {
            return r.exercise;
          }) ? w : _objectSpread(_objectSpread({}, w), {}, {
            sets: draft.sets
          });
        });
        return;
      }
    } catch (_) {}
    if (!nextSess || !nextSess.exercises || nextSess.exercises.length === 0) return;
    setWkt(function (w) {
      if (w.sets.length > 0 && w.sets.some(function (r) {
        return r.exercise;
      })) return w;
      return _objectSpread(_objectSpread({}, w), {}, {
        sets: nextSess.exercises.map(function (ex, i) {
          return {
            id: ex.id || i + 1,
            exercise: ex.exercise || "",
            sets: ex.sets || "",
            reps: ex.reps || "",
            weight: ex.weight || ""
          };
        })
      });
    });
  }, [nextSess ? nextSess.id : null]);
  useEffect(function () {
    if (!nextSess || wkt.sets.length === 0) return;
    try {
      localStorage.setItem('gym_tab_draft', JSON.stringify({
        rotId: nextSess ? nextSess.id : null,
        sets: wkt.sets,
        savedAt: Date.now()
      }));
    } catch (_) {}
  }, [wkt.sets]);
  var gs = {
    card: {
      position: "relative",
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      padding: "18px 20px",
      marginBottom: 12,
      boxShadow: cardShadow
    },
    btn: _objectSpread(_objectSpread({}, btnGlass), {}, {
      padding: "5px 12px"
    }),
    btnP: _objectSpread({}, btnGlassP),
    inp: {
      width: "100%",
      padding: "7px 10px",
      borderRadius: 8,
      border: "0.5px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.05)",
      color: T.text,
      fontSize: 12,
      boxSizing: "border-box"
    },
    acc: {
      background: T.bg3,
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 8,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "0.5px solid " + T.border,
      userSelect: "none"
    }
  };
  function gCellEdge(g) {
    return {
      borderBottom: "1.5px solid rgba(" + g + ",0.45)",
      boxShadow: "inset 0 -10px 22px rgba(" + g + ",0.16)"
    };
  }
  function fmtSetLine(ws) {
    var s = ws.sets === "" || ws.sets == null ? "—" : ws.sets;
    var r = ws.reps === "" || ws.reps == null ? "—" : ws.reps;
    var w = ws.weight === "" || ws.weight == null ? "—" : ws.weight + "kg";
    return s + "×" + r + " @ " + w;
  }
  function getExPrev(name) {
    var ex = (gymData.exercises || []).find(function (e) {
      return e.name && e.name.toLowerCase() === name.toLowerCase();
    });
    if (!ex || !ex.logs || !ex.logs.length) return null;
    return ex.logs[ex.logs.length - 1].weight;
  }
  var currentMonth = todayStr().slice(0, 7);
  var sessThisMonth = (gymData.workouts || []).filter(function (w) {
    return w.date && w.date.startsWith(currentMonth);
  }).length;
  function calcStreak() {
    var dates = new Set((gymData.workouts || []).map(function (w) {
      return w.date;
    }));
    var msDay = 86400000;
    var now = new Date();
    var dow = now.getDay() || 7;
    var ws = new Date(now.getTime() - (dow - 1) * msDay);
    var s = 0;
    while (s < 52) {
      var we = new Date(ws.getTime() + 6 * msDay);
      var hit = false;
      for (var d = new Date(ws); d <= we; d = new Date(d.getTime() + msDay)) {
        if (dates.has(localDateStr(d))) {
          hit = true;
          break;
        }
      }
      if (!hit) break;
      s++;
      ws = new Date(ws.getTime() - 7 * msDay);
    }
    return s;
  }
  var streak = calcStreak();
  var bwArr = gymData.bodyWeight || [];
  var lastBW = bwArr.length > 0 ? bwArr[bwArr.length - 1] : null;
  var prevBW = bwArr.length > 1 ? bwArr[bwArr.length - 2] : null;
  var bwDiff = lastBW && prevBW ? lastBW.weight - prevBW.weight : null;
  var bwTrend = bwDiff === null ? null : bwDiff > 0 ? "↑" : bwDiff < 0 ? "↓" : "=";
  var topLiftName = nextSess && nextSess.exercises && nextSess.exercises.length > 0 ? nextSess.exercises[0].exercise : null;
  var topLiftPrev = topLiftName ? getExPrev(topLiftName) : null;
  function addRow() {
    if (!row.exercise) return;
    trk("gym.set_log");
    setWkt(function (w) {
      return _objectSpread(_objectSpread({}, w), {}, {
        sets: [].concat(_toConsumableArray(w.sets), [_objectSpread(_objectSpread({}, row), {}, {
          id: Date.now()
        })])
      });
    });
    setRow({
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    });
  }
  function removeRow(i) {
    setWkt(function (w) {
      return _objectSpread(_objectSpread({}, w), {}, {
        sets: w.sets.filter(function (_, j) {
          return j !== i;
        })
      });
    });
  }
  function saveWkt() {
    if (window.DataValidator) {
      var _name = wkt.name || (nextSess ? nextSess.name : "Workout");
      var r = DataValidator.validate("gymWorkout", {
        name: _name,
        date: wkt.date || todayStr(),
        sets: wkt.sets
      });
      if (!r.valid) {
        if (window.showToast) window.showToast(r.firstError);
        return;
      }
    } else if (wkt.sets.length === 0) return;
    var name = wkt.name || (nextSess ? nextSess.name : "Workout");
    var rotId = nextSess ? nextSess.id : null;
    if (onSave) {
      trk("gym.workout_save");
      onSave(_objectSpread(_objectSpread({}, wkt), {}, {
        name: name,
        id: Date.now(),
        rotId: rotId
      }));
    }
    try {
      localStorage.removeItem('gym_tab_draft');
    } catch (_) {}
    setWkt({
      name: "",
      date: todayStr(),
      sets: []
    });
    setEditWktName(false);
    if (window.showToast) window.showToast("Workout saved!", "success");
  }
  function addRotItem() {
    if (!rName) return;
    var nr = rotation.concat([{
      id: Date.now(),
      name: rName,
      focus: rFocus,
      exercises: []
    }]);
    if (onUpdateRot) onUpdateRot(nr, rotIdx);
    setRName("");
    setRFocus("");
  }
  function removeRotItem(id) {
    var nr = rotation.filter(function (r) {
      return r.id !== id;
    });
    if (onUpdateRot) onUpdateRot(nr, Math.min(rotIdx, Math.max(0, nr.length - 1)));
  }
  function handleDragStart(i) {
    setDragIdx(i);
  }
  function handleDragOver(e, i) {
    e.preventDefault();
    setDragOver(i);
  }
  function handleDrop(i) {
    if (dragIdx === null || dragIdx === i) {
      setDragIdx(null);
      setDragOver(null);
      return;
    }
    var nr = rotation.slice();
    var moved = nr.splice(dragIdx, 1)[0];
    nr.splice(i, 0, moved);
    var ni = rotIdx;
    if (rotIdx === dragIdx) ni = i;else if (dragIdx < rotIdx && i >= rotIdx) ni = rotIdx - 1;else if (dragIdx > rotIdx && i <= rotIdx) ni = rotIdx + 1;
    if (onUpdateRot) onUpdateRot(nr, ni);
    setDragIdx(null);
    setDragOver(null);
  }
  function logBWInline() {
    if (!bwInput) return;
    var w = Number(bwInput);
    if (isNaN(w) || w < 30 || w > 300) {
      if (window.showToast) window.showToast("Enter a valid weight (30 to 300 kg)");
      return;
    }
    if (onAddBW) onAddBW({
      date: todayStr(),
      weight: w
    });
    setBwInput("");
  }
  var archiveCount = (gymData.workouts || []).length;
  var exCount = (gymData.exercises || []).length;
  var exNames = function () {
    var seen = {};
    var names = [];
    (gymData.exercises || []).forEach(function (ex) {
      var n = (ex.name || "").trim();
      if (n && !seen[n.toLowerCase()]) {
        seen[n.toLowerCase()] = true;
        names.push(n);
      }
    });
    (gymData.rotation || []).forEach(function (r) {
      (r.exercises || []).forEach(function (ex) {
        var n = (ex.exercise || "").trim();
        if (n && !seen[n.toLowerCase()]) {
          seen[n.toLowerCase()] = true;
          names.push(n);
        }
      });
    });
    return names;
  }();
  // Exercises that appear anywhere in the current rotation = "current program". Anything
  // logged before but no longer in any rotation day is "legacy" (e.g. a swapped-out program) —
  // split so old data doesn't read as mixed in with what you're doing now.
  var currentExNameSet = function () {
    var s = {};
    rotation.forEach(function (r) {
      (r.exercises || []).forEach(function (ex) {
        var n = (ex.exercise || "").trim().toLowerCase();
        if (n) s[n] = true;
      });
    });
    return s;
  }();
  var activeExList = (gymData.exercises || []).filter(function (ex) {
    return currentExNameSet[(ex.name || "").trim().toLowerCase()];
  });
  var legacyExList = (gymData.exercises || []).filter(function (ex) {
    return !currentExNameSet[(ex.name || "").trim().toLowerCase()];
  });
  function parseBulkExercises(text) {
    return text.split("\n").map(function (line) {
      return line.trim();
    }).filter(Boolean).map(function (line, i) {
      var parts = line.split("|").map(function (p) {
        return p.trim();
      });
      return {
        id: Date.now() + i,
        exercise: parts[0] || "",
        sets: parts[1] || "",
        reps: parts[2] || "",
        weight: parts[3] || ""
      };
    });
  }
  function drawBWSpark() {
    if (bwArr.length < 2) return null;
    var vals = bwArr.map(function (d) {
      return d.weight;
    });
    var mn = Math.min.apply(null, vals);
    var mx = Math.max.apply(null, vals);
    var range = mx - mn || 1;
    var W = 400;
    var H = 54;
    var pad = 5;
    function px(i) {
      return i / (vals.length - 1) * W;
    }
    function py(v) {
      return H - pad - (v - mn) / range * (H - pad * 2);
    }
    var linePts = vals.map(function (v, i) {
      return px(i) + "," + py(v);
    }).join(" ");
    var areaD = "M " + vals.map(function (v, i) {
      return px(i) + " " + py(v);
    }).join(" L ") + " L " + W + " " + H + " L 0 " + H + " Z";
    var lx = px(vals.length - 1);
    var ly = py(vals[vals.length - 1]);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      height: "54",
      viewBox: "0 0 400 54",
      preserveAspectRatio: "none",
      style: {
        display: "block",
        overflow: "visible"
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "gymBwG",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0%",
      stopColor: "#5b8cff",
      stopOpacity: "0.20"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "100%",
      stopColor: "#5b8cff",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("path", {
      d: areaD,
      fill: "url(#gymBwG)"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: linePts,
      fill: "none",
      stroke: "#5b8cff",
      strokeWidth: "2",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: lx,
      cy: ly,
      r: "3.5",
      fill: "#5b8cff"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: T.text3
      }
    }, fmtDate(bwArr[0].date)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: T.text3
      }
    }, fmtDate(bwArr[bwArr.length - 1].date))));
  }
  function drawMiniSpark(logs) {
    if (!logs || logs.length < 2) return null;
    var vals = logs.map(function (l) {
      return l.weight;
    });
    var mn = Math.min.apply(null, vals);
    var mx = Math.max.apply(null, vals);
    var range = mx - mn || 1;
    var W = 72;
    var H = 22;
    var pts = vals.map(function (v, i) {
      return i / (vals.length - 1) * W + "," + (H - 2 - (v - mn) / range * (H - 4));
    }).join(" ");
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: {
        display: "block",
        overflow: "visible",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("polyline", {
      points: pts,
      fill: "none",
      stroke: T.accent,
      strokeWidth: "1.5",
      strokeLinejoin: "round",
      strokeLinecap: "round",
      opacity: "0.8"
    }));
  }
  var wktsByMonth = function () {
    var groups = {};
    (gymData.workouts || []).forEach(function (wk) {
      var m = wk.date ? wk.date.slice(0, 7) : "unknown";
      if (!groups[m]) groups[m] = [];
      groups[m].push(wk);
    });
    return Object.keys(groups).sort(function (a, b) {
      return b.localeCompare(a);
    }).map(function (m) {
      return {
        month: m,
        workouts: groups[m].slice().reverse()
      };
    });
  }();
  function fmtMonth(ym) {
    var parts = ym.split("-");
    var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (names[parseInt(parts[1]) - 1] || parts[1]) + " " + parts[0];
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800
    }
  }, /*#__PURE__*/React.createElement("datalist", {
    id: "gymExSuggestions"
  }, exNames.map(function (n) {
    return React.createElement("option", {
      key: n,
      value: n
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: gs.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.accent,
      letterSpacing: 0.8
    }
  }, "Today's session"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, rotation.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: T.text3,
      background: T.bg3,
      borderRadius: 99,
      padding: "2px 8px",
      flexShrink: 0
    }
  }, rotIdx + 1, " of ", rotation.length), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, gs.inp), {}, {
      width: 130,
      padding: "4px 8px",
      fontSize: 11
    }),
    type: "date",
    value: wkt.date,
    onChange: function onChange(ev) {
      setWkt(function (w) {
        return _objectSpread(_objectSpread({}, w), {}, {
          date: ev.target.value
        });
      });
    }
  }))), nextSess ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 2
    }
  }, editWktName ? /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, gs.inp), {}, {
      fontSize: 15,
      fontWeight: 700,
      padding: "3px 8px",
      flex: 1
    }),
    value: wkt.name || nextSess.name,
    onChange: function onChange(ev) {
      setWkt(function (w) {
        return _objectSpread(_objectSpread({}, w), {}, {
          name: ev.target.value
        });
      });
    },
    onBlur: function onBlur() {
      setEditWktName(false);
    },
    autoFocus: true
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: T.text
    }
  }, wkt.name || nextSess.name), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: T.text3,
      padding: 0,
      lineHeight: 1
    },
    onClick: function onClick() {
      setEditWktName(true);
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "pencil",
    size: 11
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      marginTop: 2
    }
  }, nextSess.focus), rotation.length > 1 && function () {
    var cyclesCompleted = Math.floor((gymData.rotIdx || 0) / rotation.length);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        flexWrap: "wrap",
        marginBottom: 6
      }
    }, rotation.map(function (r, i) {
      var done = i < rotIdx;
      var cur = i === rotIdx;
      return /*#__PURE__*/React.createElement("div", {
        key: r.id,
        style: {
          fontSize: 10,
          padding: "3px 10px",
          borderRadius: 99,
          fontWeight: cur ? 600 : 400,
          color: cur ? T.accent : done ? T.text2 : T.text3,
          background: cur ? T.accentBg : done ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: "0.5px solid " + (cur ? T.accent + "80" : done ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"),
          transition: "background 0.15s,border 0.15s,color 0.15s"
        }
      }, r.name);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3
      }
    }, "Cycle ", cyclesCompleted + 1, cyclesCompleted > 0 ? " · " + cyclesCompleted + " complete" : "", " \xB7 ", rotation.length - rotIdx - 1, " session", rotation.length - rotIdx - 1 !== 1 ? "s" : "", " until repeat"));
  }()) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.text2
    }
  }, "No rotation set. Add one below \u2193")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, [{
    label: "BODY WT",
    val: lastBW ? lastBW.weight + "kg" + (bwTrend ? " " + bwTrend : "") : "—",
    g: bwTrend === "↑" ? "34,197,94" : bwTrend === "↓" ? "239,68,68" : "148,163,184"
  }, {
    label: "TOP LIFT",
    val: topLiftPrev != null ? topLiftPrev + "kg" + (topLiftName ? " · " + topLiftName.split(" ")[0] : "") : "—",
    g: "91,140,255"
  }, {
    label: "THIS MONTH",
    val: sessThisMonth + " sess",
    g: "91,140,255"
  }, {
    label: "STREAK",
    val: streak > 0 ? streak + " wk" : "—",
    g: streak > 0 ? "34,197,94" : "148,163,184"
  }].map(function (c, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: _objectSpread({
        flex: 1,
        minWidth: mob ? 130 : 110,
        background: cardBg,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: "10px 14px",
        boxShadow: cardShadowSoft
      }, gCellEdge(c.g))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: "#8f97a6",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 4
      }
    }, c.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: T.text,
        fontVariantNumeric: "tabular-nums"
      }
    }, c.val));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: gs.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: T.text,
      marginBottom: 12
    }
  }, "Log Workout"), !mob && wkt.sets.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 52px 44px 44px 62px 36px",
      gap: 6,
      marginBottom: 4,
      paddingLeft: 2
    }
  }, ["Exercise", "Prev", "Sets", "Reps", "kg", ""].map(function (h, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 9,
        color: T.text3,
        fontWeight: 600
      }
    }, h);
  })), wkt.sets.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, wkt.sets.map(function (ws, wi) {
    var prev = getExPrev(ws.exercise);
    return mob ? /*#__PURE__*/React.createElement("div", {
      key: ws.id || wi,
      style: {
        padding: "8px 10px",
        background: T.bg3,
        borderRadius: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        color: T.text
      }
    }, ws.exercise), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, prev != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: T.text3
      }
    }, "prev ", prev, "kg"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        removeRow(wi);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 14,
        padding: 0
      }
    }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2
      }
    }, fmtSetLine(ws))) : /*#__PURE__*/React.createElement("div", {
      key: ws.id || wi,
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 52px 44px 44px 62px 36px",
        gap: 6,
        alignItems: "center",
        padding: "5px 8px",
        background: T.bg3,
        borderRadius: 8,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: T.text,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, ws.exercise), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: T.text3,
        textAlign: "center"
      }
    }, prev != null ? prev + "kg" : "—"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: T.text2,
        textAlign: "center"
      }
    }, ws.sets), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: T.text2,
        textAlign: "center"
      }
    }, ws.reps), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: T.text,
        textAlign: "center"
      }
    }, ws.weight, "kg"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        removeRow(wi);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 14,
        padding: 0
      }
    }, "\xD7"));
  })), mob ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, gs.inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    list: "gymExSuggestions",
    placeholder: "Exercise (e.g. Squat)",
    value: row.exercise,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          exercise: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, gs.inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    type: "number",
    placeholder: "Sets",
    value: row.sets,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          sets: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, gs.inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    type: "number",
    placeholder: "Reps",
    value: row.reps,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          reps: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, gs.inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    type: "number",
    placeholder: "kg",
    value: row.weight,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          weight: ev.target.value
        });
      });
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, gs.btnP), {}, {
      padding: "10px",
      fontSize: 14,
      borderRadius: 10
    }),
    onClick: addRow
  }, "+ Add set")) : /*#__PURE__*/React.createElement("div", null, !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 52px 44px 44px 62px 36px",
      gap: 6,
      marginBottom: 4,
      paddingLeft: 2
    }
  }, wkt.sets.length === 0 && ["Exercise", "", "Sets", "Reps", "kg", ""].map(function (h, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 9,
        color: T.text3
      }
    }, h);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 52px 44px 44px 62px 36px",
      gap: 6,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: gs.inp,
    list: "gymExSuggestions",
    placeholder: "e.g. Squat",
    value: row.exercise,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          exercise: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.bg3,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: T.text3
    }
  }, "prev")), /*#__PURE__*/React.createElement("input", {
    style: gs.inp,
    type: "number",
    placeholder: "4",
    value: row.sets,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          sets: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: gs.inp,
    type: "number",
    placeholder: "8",
    value: row.reps,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          reps: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: gs.inp,
    type: "number",
    placeholder: "80",
    value: row.weight,
    onChange: function onChange(ev) {
      setRow(function (r) {
        return _objectSpread(_objectSpread({}, r), {}, {
          weight: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: gs.btnP,
    onClick: addRow
  }, "+"))), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, gs.btnP), {}, {
      width: "100%"
    }),
    onClick: saveWkt
  }, "Save & advance rotation \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: gs.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: T.text2,
      letterSpacing: "0.03em",
      marginBottom: 10
    }
  }, "Body Weight"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      flexDirection: mob ? "column" : "row"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 2,
      minWidth: 0
    }
  }, bwArr.length > 1 ? drawBWSpark() : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      padding: "14px 0"
    }
  }, "Log a few entries to see your trend")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 116
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, gs.inp), {}, {
      padding: "6px 8px",
      textAlign: "center",
      flex: 1
    }),
    type: "number",
    step: "0.1",
    placeholder: "82.0",
    value: bwInput,
    onChange: function onChange(ev) {
      setBwInput(ev.target.value);
    },
    onKeyDown: function onKeyDown(ev) {
      if (ev.key === "Enter") logBWInline();
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3,
      flexShrink: 0
    }
  }, "kg"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, gs.btnP), {}, {
      flexShrink: 0,
      padding: "5px 10px",
      fontSize: 11
    }),
    onClick: logBWInline
  }, "Log")), bwArr.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, bwArr.slice(-4).reverse().map(function (l, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.text2
      }
    }, fmtDate(l.date), ": ", l.weight, "kg"), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: T.text3,
        fontSize: 11,
        opacity: 0.45,
        lineHeight: 1,
        padding: "0 2px"
      },
      onClick: function onClick() {
        onDeleteBW && onDeleteBW(l.date);
      }
    }, "\xD7"));
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: gs.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: exCount > 0 && showProgress ? 10 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: T.text
    }
  }, "Exercise History", exCount > 0 ? " (" + exCount + ")" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, gs.btn), {}, {
      fontSize: 10,
      padding: "2px 8px"
    }),
    onClick: function onClick() {
      onAddEx && onAddEx();
    }
  }, "+ Exercise"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: T.text3,
      fontSize: 13,
      lineHeight: 1,
      padding: "2px 4px"
    },
    onClick: function onClick() {
      setShowProgress(function (v) {
        return !v;
      });
    }
  }, showProgress ? "▾" : "▸"))), showProgress && (exCount === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      paddingTop: 8
    }
  }, "No exercises tracked yet.") : /*#__PURE__*/React.createElement(React.Fragment, null, activeExList.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      paddingTop: 8
    }
  }, "No current-program exercises logged yet."), activeExList.map(function (ex, ei) {
    var logs = ex.logs || [];
    var last = logs.length > 0 ? logs[logs.length - 1] : null;
    var prev2 = logs.length > 1 ? logs[logs.length - 2] : null;
    var diff = last && prev2 ? last.weight - prev2.weight : null;
    var trend = diff === null ? null : diff > 0 ? "↑" : diff < 0 ? "↓" : "=";
    var tCol = trend === "↑" ? T.success : trend === "↓" ? T.danger : T.text3;
    return /*#__PURE__*/React.createElement("div", {
      key: ex.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderTop: "0.5px solid " + T.border
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: T.text,
        marginBottom: 1
      }
    }, ex.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, last ? /*#__PURE__*/React.createElement("span", null, last.weight, "kg") : /*#__PURE__*/React.createElement("span", null, "no data"), trend && /*#__PURE__*/React.createElement("span", {
      style: {
        color: tCol,
        fontSize: 11
      }
    }, trend))), /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0
      }
    }, drawMiniSpark(logs)), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, gs.btn), {}, {
        fontSize: 10,
        padding: "2px 7px",
        flexShrink: 0
      }),
      onClick: function onClick() {
        if (onLogW) onLogW(ex);
      }
    }, "Log"));
  }), legacyExList.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      paddingTop: 8,
      borderTop: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer"
    },
    onClick: function onClick() {
      setShowLegacyEx(function (v) {
        return !v;
      });
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "Older exercises (", legacyExList.length, ") \xB7 not in your current program"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontSize: 11
    }
  }, showLegacyEx ? "▾" : "▸")), showLegacyEx && legacyExList.map(function (ex) {
    var logs = ex.logs || [];
    var last = logs.length > 0 ? logs[logs.length - 1] : null;
    return /*#__PURE__*/React.createElement("div", {
      key: ex.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderTop: "0.5px solid " + T.border,
        opacity: 0.6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: T.text,
        marginBottom: 1
      }
    }, ex.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3
      }
    }, last ? last.weight + "kg" : "no data")), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, gs.btn), {}, {
        fontSize: 10,
        padding: "2px 7px",
        flexShrink: 0
      }),
      onClick: function onClick() {
        if (onLogW) onLogW(ex);
      }
    }, "Log"));
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: gs.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: T.text
    }
  }, "Manage Rotation"), rotation.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: T.text3
    }
  }, "drag to reorder")), rotation.map(function (r, i) {
    var isCur = i === rotIdx;
    var isDragTarget = dragOver === i && dragIdx !== null && dragIdx !== i;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: r.id
    }, /*#__PURE__*/React.createElement("div", {
      draggable: true,
      onDragStart: function onDragStart() {
        handleDragStart(i);
      },
      onDragOver: function onDragOver(e) {
        handleDragOver(e, i);
      },
      onDrop: function onDrop() {
        handleDrop(i);
      },
      onDragEnd: function onDragEnd() {
        setDragIdx(null);
        setDragOver(null);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: editRotIdx === i ? 4 : 8,
        padding: "10px 12px",
        borderRadius: 8,
        background: isDragTarget ? "rgba(91,140,255,0.12)" : isCur ? T.accentBg : T.bg3,
        border: "0.5px solid " + (isDragTarget ? T.accent : isCur ? T.accent + "60" : T.border),
        opacity: dragIdx === i ? 0.5 : 1,
        cursor: "grab",
        transition: "background 0.15s,border 0.15s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        color: T.text3,
        cursor: "grab",
        userSelect: "none",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "drag",
      size: 14
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: isCur ? T.accent : "rgba(255,255,255,0.06)",
        border: "1px solid " + (isCur ? T.accent : T.border2),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 700,
        color: isCur ? "#fff" : T.text3,
        flexShrink: 0
      }
    }, i + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: isCur ? 600 : 400,
        color: T.text
      }
    }, r.name, isCur && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: T.accent,
        marginLeft: 8
      }
    }, "\u2190 next")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text2
      }
    }, r.focus, r.exercises && r.exercises.length > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        color: T.text3
      }
    }, r.exercises.length, " ex"))), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        trk("gym.rotation_advance");
        if (onUpdateRot) onUpdateRot(rotation, i);
      },
      style: _objectSpread(_objectSpread({}, gs.btn), {}, {
        fontSize: 10,
        padding: "2px 7px"
      })
    }, "Set current"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        var exs = r.exercises && r.exercises.length > 0 ? r.exercises.map(function (ex) {
          return _objectSpread({}, ex);
        }) : Array(3).fill(null).map(function (_, j) {
          return {
            id: j + 1,
            exercise: "",
            sets: "",
            reps: "",
            weight: ""
          };
        });
        setEditRotIdx(editRotIdx === i ? null : i);
        setEditRotForm({
          rName: r.name,
          rFocus: r.focus || "",
          exercises: exs
        });
        setBulkMode(false);
        setBulkText("");
      },
      style: editRotIdx === i ? _objectSpread(_objectSpread({}, editPill), {}, {
        color: T.accent,
        border: "1px solid rgba(91,140,255,0.5)",
        background: "rgba(91,140,255,0.14)"
      }) : editPill
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "pencil",
      size: 11
    }), "Edit"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        removeRotItem(r.id);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 14
      }
    }, "\xD7")), editRotIdx === i && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px",
        borderRadius: 8,
        background: "rgba(91,140,255,0.06)",
        border: "0.5px solid rgba(91,140,255,0.2)",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text2,
        marginBottom: 3
      }
    }, "Session name"), /*#__PURE__*/React.createElement("input", {
      style: gs.inp,
      value: editRotForm.rName,
      onChange: function onChange(ev) {
        var v = ev.target.value;
        setEditRotForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            rName: v
          });
        });
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text2,
        marginBottom: 3
      }
    }, "Focus muscles"), /*#__PURE__*/React.createElement("input", {
      style: gs.inp,
      placeholder: "e.g. Chest, Triceps",
      value: editRotForm.rFocus,
      onChange: function onChange(ev) {
        var v = ev.target.value;
        setEditRotForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            rFocus: v
          });
        });
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text2
      }
    }, "Exercises"), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "none",
        border: "none",
        color: T.accent,
        cursor: "pointer",
        fontSize: 10,
        padding: 0
      },
      onClick: function onClick() {
        setBulkMode(function (v) {
          return !v;
        });
      }
    }, bulkMode ? "Row editor instead" : "New program? Paste a list")), bulkMode ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      style: _objectSpread(_objectSpread({}, gs.inp), {}, {
        resize: "vertical",
        fontFamily: "monospace",
        fontSize: 11,
        lineHeight: 1.5
      }),
      rows: 5,
      placeholder: "One exercise per line, replaces the list below:\nIncline dumbbell press\nCable fly | 4 | 10 | 12\nOverhead press",
      value: bulkText,
      onChange: function onChange(ev) {
        setBulkText(ev.target.value);
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        margin: "4px 0 6px"
      }
    }, "Optional: \"Exercise | sets | reps | kg\" per line."), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, gs.btnP), {}, {
        fontSize: 10,
        padding: "3px 10px"
      }),
      onClick: function onClick() {
        var parsed = parseBulkExercises(bulkText);
        if (!parsed.length) return;
        setEditRotForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            exercises: parsed
          });
        });
        setBulkMode(false);
        setBulkText("");
      }
    }, "Replace exercises with this list")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 44px 44px 52px 24px",
        gap: 4,
        marginBottom: 3
      }
    }, ["Exercise", "Sets", "Reps", "kg", ""].map(function (h, hi) {
      return /*#__PURE__*/React.createElement("div", {
        key: hi,
        style: {
          fontSize: 9,
          color: T.text3
        }
      }, h);
    })), (editRotForm.exercises || []).map(function (ex, ei) {
      return /*#__PURE__*/React.createElement("div", {
        key: ex.id || ei,
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 44px 44px 52px 24px",
          gap: 4,
          marginBottom: 4
        }
      }, /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, gs.inp), {}, {
          padding: "4px 6px",
          fontSize: 11
        }),
        list: "gymExSuggestions",
        placeholder: "Exercise",
        value: ex.exercise || "",
        onChange: function onChange(ev) {
          var v = ev.target.value;
          setEditRotForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              exercises: f.exercises.map(function (e, j) {
                return j === ei ? _objectSpread(_objectSpread({}, e), {}, {
                  exercise: v
                }) : e;
              })
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, gs.inp), {}, {
          padding: "4px 3px",
          fontSize: 11
        }),
        type: "number",
        placeholder: "4",
        value: ex.sets || "",
        onChange: function onChange(ev) {
          var v = ev.target.value;
          setEditRotForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              exercises: f.exercises.map(function (e, j) {
                return j === ei ? _objectSpread(_objectSpread({}, e), {}, {
                  sets: v
                }) : e;
              })
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, gs.inp), {}, {
          padding: "4px 3px",
          fontSize: 11
        }),
        type: "number",
        placeholder: "8",
        value: ex.reps || "",
        onChange: function onChange(ev) {
          var v = ev.target.value;
          setEditRotForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              exercises: f.exercises.map(function (e, j) {
                return j === ei ? _objectSpread(_objectSpread({}, e), {}, {
                  reps: v
                }) : e;
              })
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, gs.inp), {}, {
          padding: "4px 3px",
          fontSize: 11
        }),
        type: "number",
        placeholder: "80",
        value: ex.weight || "",
        onChange: function onChange(ev) {
          var v = ev.target.value;
          setEditRotForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              exercises: f.exercises.map(function (e, j) {
                return j === ei ? _objectSpread(_objectSpread({}, e), {}, {
                  weight: v
                }) : e;
              })
            });
          });
        }
      }), /*#__PURE__*/React.createElement("button", {
        style: {
          background: "none",
          border: "none",
          color: T.text3,
          cursor: "pointer",
          fontSize: 13,
          padding: 0
        },
        onClick: function onClick() {
          setEditRotForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              exercises: f.exercises.filter(function (_, j) {
                return j !== ei;
              })
            });
          });
        }
      }, "\xD7"));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginTop: 6
      }
    }, !bulkMode && /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, gs.btn), {}, {
        fontSize: 10,
        padding: "2px 8px"
      }),
      onClick: function onClick() {
        setEditRotForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            exercises: (f.exercises || []).concat([{
              id: Date.now(),
              exercise: "",
              sets: "",
              reps: "",
              weight: ""
            }])
          });
        });
      }
    }, "+ Row"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, gs.btnP), {}, {
        fontSize: 10,
        padding: "3px 10px"
      }),
      onClick: function onClick() {
        trk("gym.rotation_edit");
        var nr = rotation.map(function (rt, ri) {
          return ri === i ? _objectSpread(_objectSpread({}, rt), {}, {
            name: editRotForm.rName || rt.name,
            focus: editRotForm.rFocus,
            exercises: (editRotForm.exercises || []).filter(function (ex) {
              return ex.exercise && ex.exercise.trim();
            })
          }) : rt;
        });
        if (onUpdateRot) onUpdateRot(nr, rotIdx);
        setEditRotIdx(null);
        setBulkMode(false);
        if (window.showToast) window.showToast("Template saved!", "success");
      }
    }, "Save template"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, gs.btn), {}, {
        fontSize: 10,
        padding: "2px 8px"
      }),
      onClick: function onClick() {
        setEditRotIdx(null);
        setBulkMode(false);
      }
    }, "Cancel"))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 12,
      borderTop: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 8
    }
  }, "Add to rotation"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: mob ? _objectSpread(_objectSpread({}, gs.inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }) : gs.inp,
    placeholder: "Session name",
    value: rName,
    onChange: function onChange(ev) {
      setRName(ev.target.value);
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: mob ? _objectSpread(_objectSpread({}, gs.inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }) : gs.inp,
    placeholder: "Focus muscles",
    value: rFocus,
    onChange: function onChange(ev) {
      setRFocus(ev.target.value);
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: gs.btnP,
    onClick: addRotItem
  }, "Add session"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: gs.acc,
    onClick: function onClick() {
      setShowArchive(function (v) {
        return !v;
      });
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: T.text
    }
  }, "Past workouts", archiveCount > 0 ? " (" + archiveCount + ")" : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontSize: 12
    }
  }, showArchive ? "▾" : "▸")), showArchive && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 4
    }
  }, archiveCount === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      padding: "8px 0"
    }
  }, "No workouts yet.") : wktsByMonth.map(function (grp) {
    return /*#__PURE__*/React.createElement("div", {
      key: grp.month,
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: T.text3,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 6,
        paddingLeft: 2
      }
    }, fmtMonth(grp.month), " \xB7 ", grp.workouts.length), /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: _objectSpread(_objectSpread({}, gs.card), {}, {
        padding: "0",
        marginBottom: 0,
        overflow: "hidden"
      })
    }, grp.workouts.map(function (wk, wi) {
      var rotMatch = rotation.filter(function (r) {
        return r.id === wk.rotId;
      });
      var rotFocus = rotMatch.length > 0 ? rotMatch[0].focus : null;
      var isExp = expandedWktId === wk.id;
      return /*#__PURE__*/React.createElement("div", {
        key: wk.id,
        style: {
          borderBottom: wi < grp.workouts.length - 1 ? "0.5px solid " + T.border : "none"
        }
      }, /*#__PURE__*/React.createElement("div", {
        onClick: function onClick() {
          setExpandedWktId(isExp ? null : wk.id);
        },
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          cursor: "pointer"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 500,
          color: T.text
        }
      }, wk.name), rotFocus && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: T.text3,
          marginLeft: 8
        }
      }, rotFocus)), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: T.text3,
          flexShrink: 0
        }
      }, fmtDate(wk.date)), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: T.text3,
          flexShrink: 0,
          minWidth: 36,
          textAlign: "right"
        }
      }, (wk.sets || []).length, " sets"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: T.text3,
          marginLeft: 2
        }
      }, isExp ? "▾" : "▸")), isExp && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "2px 16px 10px",
          borderTop: "0.5px solid " + T.border
        }
      }, (wk.sets || []).map(function (ws, si) {
        return /*#__PURE__*/React.createElement("div", {
          key: si,
          style: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            padding: "3px 0",
            borderBottom: si < (wk.sets || []).length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none"
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            color: T.text2
          }
        }, ws.exercise), /*#__PURE__*/React.createElement("span", {
          style: {
            color: T.text3
          }
        }, fmtSetLine(ws)));
      })));
    })));
  }))));
}

// Every figure the Finance tab shows, in one place. Lifted verbatim out of
// FinanceSection so Jarvis can ask the same question the tab answers without a
// second copy of the maths — the two must never be able to disagree about
// Jayden's money. `data` is the finance slice; `month` is "YYYY-MM".
function financeSummary(data, work, gcalEvents, month) {
  data = data || {};
  var sources = data.sources || [{
    id: 1,
    name: "GoTab (Rippling)",
    amount: 0
  }, {
    id: 2,
    name: "Jobseeker",
    amount: 802.40
  }, {
    id: 3,
    name: "",
    amount: 0
  }];
  var monthlyIncome = data.monthlyIncome || {};
  var allExpenses = data.expenses || [];
  var recurringTemplates = data.recurringTemplates || [];
  var monthlyRecurringOverrides = data.monthlyRecurringOverrides || {};
  var monthOverrides = monthlyRecurringOverrides[month] || {};
  var recurringThisMonth = recurringTemplates.filter(function (t) {
    return !(monthOverrides[t.id] && monthOverrides[t.id].excluded);
  }).map(function (t) {
    var ov = monthOverrides[t.id];
    return _objectSpread(_objectSpread({}, t), {}, {
      amount: ov && ov.amount !== undefined ? ov.amount : t.amount,
      isRecurring: true
    });
  });
  var skippedThisMonth = recurringTemplates.filter(function (t) {
    return monthOverrides[t.id] && monthOverrides[t.id].excluded;
  });
  var oneOffThisMonth = allExpenses.filter(function (e) {
    return e.month === month;
  });
  var allThisMonth = recurringThisMonth.concat(oneOffThisMonth);
  var srcAmounts = monthlyIncome[month] || {};
  var hourlyRate = Number(data.hourlyRate || 0);
  var _workLogs = work && work.shiftLogs || {};
  var _workSince = work && work.progressiveSince || "";
  // Match the Work tab: count only shifts worked + meetings attended (real pay), not all scheduled.
  var monthShifts = (gcalEvents || []).filter(function (ev) {
    return ev.date && ev.date.startsWith(month) && isGoTabEvent(ev) && isWorkEventCounted(ev, _workLogs, _workSince);
  });
  var calcGoTabIncome = hourlyRate > 0 ? monthShifts.reduce(function (a, ev) {
    var pay = shiftPay(ev.time);
    return a + (pay ? pay.totalEquiv * hourlyRate : 0);
  }, 0) : 0;
  var totalIncome = sources.reduce(function (a, s) {
    var amt = srcAmounts[s.id] !== undefined ? Number(srcAmounts[s.id]) : Number(s.amount) || 0;
    if (s.id === 1 && calcGoTabIncome > 0) amt = calcGoTabIncome;
    return a + amt;
  }, 0);
  var totalExpenses = allThisMonth.reduce(function (a, e) {
    return a + Number(e.amount);
  }, 0);
  var net = totalIncome - totalExpenses;
  var billsRecurring = recurringThisMonth.filter(function (e) {
    return e.cat === "Bills";
  });
  var billsMonthlyTotal = billsRecurring.reduce(function (a, e) {
    return a + Number(e.amount);
  }, 0);
  var weeklyBills = billsMonthlyTotal * 12 / 52;
  var oneOffTotal = oneOffThisMonth.reduce(function (a, e) {
    return a + Number(e.amount);
  }, 0);
  var disposableBudget = totalIncome - billsMonthlyTotal;
  var _sgCommit = function () {
    var _sg = data.savingsGoal || {};
    var _t = Number(_sg.target) || 0;
    var _c = Number(_sg.current) || 0;
    var _r = Math.max(0, _t - _c);
    var _dl = _sg.deadline || "";
    if (!_dl || !_t) return 0;
    var fp = month.split("-").map(Number);
    var tp = _dl.split("-").map(Number);
    var ml = Math.max(0, (tp[0] - fp[0]) * 12 + (tp[1] - fp[1]));
    return ml > 0 ? _r / ml : 0;
  }();
  var disposableLeft = disposableBudget - oneOffTotal - _sgCommit;
  var weeklyDisposable = disposableLeft / 4.33;
  return {
    sources: sources,
    monthlyIncome: monthlyIncome,
    allExpenses: allExpenses,
    recurringTemplates: recurringTemplates,
    monthlyRecurringOverrides: monthlyRecurringOverrides,
    monthOverrides: monthOverrides,
    recurringThisMonth: recurringThisMonth,
    skippedThisMonth: skippedThisMonth,
    oneOffThisMonth: oneOffThisMonth,
    allThisMonth: allThisMonth,
    srcAmounts: srcAmounts,
    hourlyRate: hourlyRate,
    monthShifts: monthShifts,
    calcGoTabIncome: calcGoTabIncome,
    totalIncome: totalIncome,
    totalExpenses: totalExpenses,
    net: net,
    billsRecurring: billsRecurring,
    billsMonthlyTotal: billsMonthlyTotal,
    weeklyBills: weeklyBills,
    oneOffTotal: oneOffTotal,
    disposableBudget: disposableBudget,
    _sgCommit: _sgCommit,
    disposableLeft: disposableLeft,
    weeklyDisposable: weeklyDisposable
  };
}

// What Jarvis is handed. Disposable is the honest question — a big surplus over
// bills means nothing if a savings commitment eats it, which is exactly the
// situation on 2026-08-07: $1,024 over bills, $202 short in reality.
function jarvisMoney(dash, gcalEvents) {
  var s = financeSummary(dash && dash.finance || {}, dash && dash.work || {}, gcalEvents, todayStr().slice(0, 7));
  return {
    income: s.totalIncome,
    bills: s.billsMonthlyTotal,
    oneOffs: s.oneOffTotal,
    savings: s._sgCommit,
    disposable: s.disposableLeft
  };
}
function FinanceSection(_ref) {
  var data = _ref.data,
    onUpdate = _ref.onUpdate,
    mob = _ref.mob,
    gcalEvents = _ref.gcalEvents,
    work = _ref.work;
  mob = mob || false;
  var _useState43 = useState(todayStr().slice(0, 7)),
    _useState44 = _slicedToArray(_useState43, 2),
    month = _useState44[0],
    setMonth = _useState44[1];
  var _useState45 = useState({
      name: "",
      amount: "",
      cat: "Other"
    }),
    _useState46 = _slicedToArray(_useState45, 2),
    expForm = _useState46[0],
    setExpForm = _useState46[1];
  var _useState47 = useState(null),
    _useState48 = _slicedToArray(_useState47, 2),
    editExpId = _useState48[0],
    setEditExpId = _useState48[1];
  var _useState49 = useState({
      name: "",
      amount: "",
      cat: "Other"
    }),
    _useState50 = _slicedToArray(_useState49, 2),
    editExpForm = _useState50[0],
    setEditExpForm = _useState50[1];
  var _useState51 = useState(false),
    _useState52 = _slicedToArray(_useState51, 2),
    editSrc = _useState52[0],
    setEditSrc = _useState52[1];
  var _useState53 = useState(false),
    _useState54 = _slicedToArray(_useState53, 2),
    showRecMgr = _useState54[0],
    setShowRecMgr = _useState54[1];
  var _useState55 = useState(null),
    _useState56 = _slicedToArray(_useState55, 2),
    editRecId = _useState56[0],
    setEditRecId = _useState56[1];
  var _useState57 = useState({
      name: "",
      amount: "",
      cat: "Bills",
      dueDay: ""
    }),
    _useState58 = _slicedToArray(_useState57, 2),
    editRecForm = _useState58[0],
    setEditRecForm = _useState58[1];
  var _useState59 = useState({
      name: "",
      amount: "",
      cat: "Bills",
      dueDay: ""
    }),
    _useState60 = _slicedToArray(_useState59, 2),
    recForm = _useState60[0],
    setRecForm = _useState60[1];
  var fBtnP = _objectSpread({}, btnGlassP);
  var fInp = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: T.text,
    fontSize: 12,
    boxSizing: "border-box"
  };
  function fCard(ex) {
    return _objectSpread({
      position: "relative",
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      padding: "18px 20px",
      marginBottom: 12,
      boxShadow: cardShadow
    }, ex || {});
  }
  var fGlassMini = {
    background: cardBg,
    backdropFilter: "blur(24px) saturate(1.4)",
    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    boxShadow: cardShadowSoft
  };
  var fStatLabel = {
    fontSize: 10,
    fontWeight: 600,
    color: "#8f97a6",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };
  var fST = {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 0,
    color: "#cdd5e2",
    letterSpacing: "-0.01em"
  };
  function fmtNum(n) {
    return n.toLocaleString("en-AU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  function fmtRound(n) {
    return Math.round(n).toLocaleString("en-AU");
  }
  var CATS = ["Bills", "Addiction", "Other"];
  var CAT_COL = {
    Bills: T.accent,
    Addiction: T.danger,
    Other: T.warn
  };
  // Every figure below comes from financeSummary (module level) so that this tab
  // and the Jarvis card cannot drift apart. Do not recompute any of them here.
  var _fin = financeSummary(data, work, gcalEvents, month);
  var sources = _fin.sources,
    monthlyIncome = _fin.monthlyIncome,
    allExpenses = _fin.allExpenses,
    recurringTemplates = _fin.recurringTemplates,
    monthlyRecurringOverrides = _fin.monthlyRecurringOverrides,
    monthOverrides = _fin.monthOverrides,
    recurringThisMonth = _fin.recurringThisMonth,
    skippedThisMonth = _fin.skippedThisMonth,
    oneOffThisMonth = _fin.oneOffThisMonth,
    allThisMonth = _fin.allThisMonth,
    srcAmounts = _fin.srcAmounts,
    hourlyRate = _fin.hourlyRate,
    monthShifts = _fin.monthShifts,
    calcGoTabIncome = _fin.calcGoTabIncome,
    totalIncome = _fin.totalIncome,
    totalExpenses = _fin.totalExpenses,
    net = _fin.net,
    billsRecurring = _fin.billsRecurring,
    billsMonthlyTotal = _fin.billsMonthlyTotal,
    weeklyBills = _fin.weeklyBills,
    oneOffTotal = _fin.oneOffTotal,
    disposableBudget = _fin.disposableBudget,
    _sgCommit = _fin._sgCommit,
    disposableLeft = _fin.disposableLeft,
    weeklyDisposable = _fin.weeklyDisposable;
  function updateHourlyRate(val) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      hourlyRate: Number(val)
    }));
  }
  function shiftMonth(n) {
    var d = new Date(month + "-15");
    d.setMonth(d.getMonth() + n);
    return d.toISOString().slice(0, 7);
  }
  function fmtM(m) {
    return new Date(m + "-15").toLocaleDateString("en-AU", {
      month: "long",
      year: "numeric"
    });
  }
  function totalForMonth(m) {
    var mo = monthlyRecurringOverrides[m] || {};
    var rec = recurringTemplates.filter(function (t) {
      return !(mo[t.id] && mo[t.id].excluded);
    }).reduce(function (a, t) {
      return a + Number(mo[t.id] && mo[t.id].amount !== undefined ? mo[t.id].amount : t.amount);
    }, 0);
    var oo = allExpenses.filter(function (e) {
      return e.month === m;
    }).reduce(function (a, e) {
      return a + Number(e.amount);
    }, 0);
    return rec + oo;
  }
  function avgExp() {
    var past = [-3, -2, -1].map(function (o) {
      return totalForMonth(shiftMonth(o));
    });
    var nz = past.filter(function (v) {
      return v > 0;
    });
    return nz.length > 0 ? nz.reduce(function (a, b) {
      return a + b;
    }, 0) / nz.length : totalExpenses;
  }
  var avgE = avgExp();
  var forecast = [1, 2, 3, 4, 5, 6].map(function (i) {
    var m = shiftMonth(i);
    return {
      month: m,
      income: totalIncome,
      expenses: avgE,
      net: totalIncome - avgE
    };
  });
  var curDate = new Date(month + "-15");
  var futureMonthsInYear = 11 - curDate.getMonth();
  function addExpense() {
    if (window.DataValidator) {
      var r = DataValidator.validate("financeEntry", {
        amount: Number(expForm.amount),
        category: expForm.cat || "Other",
        date: month + "-01"
      });
      if (!r.valid) {
        if (window.showToast) showToast(r.firstError);
        return;
      }
    } else if (!expForm.name || !expForm.amount) return;
    trk("finance.expense_add");
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      expenses: allExpenses.concat([{
        id: Date.now(),
        name: expForm.name,
        amount: Number(expForm.amount),
        cat: expForm.cat,
        month: month
      }])
    }));
    setExpForm({
      name: "",
      amount: "",
      cat: "Other"
    });
    if (window.showToast) showToast("Expense added!", "success");
  }
  function removeOneOff(id) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      expenses: allExpenses.filter(function (e) {
        return e.id !== id;
      })
    }));
  }
  function saveEditExp() {
    if (!editExpForm.name || !editExpForm.amount) return;
    trk("finance.expense_edit");
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      expenses: allExpenses.map(function (e) {
        return e.id === editExpId ? _objectSpread(_objectSpread({}, e), {}, {
          name: editExpForm.name,
          amount: Number(editExpForm.amount),
          cat: editExpForm.cat
        }) : e;
      })
    }));
    setEditExpId(null);
  }
  function skipRecurring(tId) {
    var mo = _objectSpread(_objectSpread({}, monthOverrides), {}, _defineProperty({}, tId, _objectSpread(_objectSpread({}, monthOverrides[tId] || {}), {}, {
      excluded: true
    })));
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      monthlyRecurringOverrides: _objectSpread(_objectSpread({}, monthlyRecurringOverrides), {}, _defineProperty({}, month, mo))
    }));
  }
  function restoreRecurring(tId) {
    var mo = _objectSpread({}, monthOverrides);
    if (mo[tId]) {
      var n = _objectSpread({}, mo[tId]);
      delete n.excluded;
      mo[tId] = n;
    }
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      monthlyRecurringOverrides: _objectSpread(_objectSpread({}, monthlyRecurringOverrides), {}, _defineProperty({}, month, mo))
    }));
  }
  function deleteTemplate(tId) {
    if (editRecId === tId) setEditRecId(null);
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      recurringTemplates: recurringTemplates.filter(function (t) {
        return t.id !== tId;
      })
    }));
  }
  function saveEditRec() {
    if (!editRecForm.name || !editRecForm.amount) return;
    trk("finance.recurring_edit");
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      recurringTemplates: recurringTemplates.map(function (t) {
        return t.id === editRecId ? _objectSpread(_objectSpread({}, t), {}, {
          name: editRecForm.name,
          amount: Number(editRecForm.amount),
          cat: editRecForm.cat,
          dueDay: Number(editRecForm.dueDay) || null
        }) : t;
      })
    }));
    setEditRecId(null);
  }
  function addRecurring() {
    if (window.DataValidator) {
      var r = DataValidator.validate("financeEntry", {
        amount: Number(recForm.amount),
        category: recForm.cat || "Bills",
        date: month + "-01"
      });
      if (!r.valid) {
        if (window.showToast) showToast(r.firstError);
        return;
      }
    } else if (!recForm.name || !recForm.amount) return;
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      recurringTemplates: recurringTemplates.concat([{
        id: "r" + Date.now(),
        name: recForm.name,
        amount: Number(recForm.amount),
        cat: recForm.cat,
        dueDay: Number(recForm.dueDay) || null
      }])
    }));
    setRecForm({
      name: "",
      amount: "",
      cat: "Bills",
      dueDay: ""
    });
    if (window.showToast) showToast("Recurring entry added!", "success");
  }
  function updateSourceIncome(srcId, val) {
    var mi = _objectSpread(_objectSpread({}, monthlyIncome), {}, _defineProperty({}, month, _objectSpread(_objectSpread({}, monthlyIncome[month] || {}), {}, _defineProperty({}, srcId, Number(val)))));
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      monthlyIncome: mi
    }));
  }
  function updateSourceName(id, val) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      sources: sources.map(function (s) {
        return s.id === id ? _objectSpread(_objectSpread({}, s), {}, {
          name: val
        }) : s;
      })
    }));
  }
  function updateBudget(val) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      monthlyBudget: Number(val)
    }));
  }
  function updateDueDay(tId, val) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      recurringTemplates: recurringTemplates.map(function (t) {
        return t.id === tId ? _objectSpread(_objectSpread({}, t), {}, {
          dueDay: Number(val) || null
        }) : t;
      })
    }));
  }
  function daysUntilDue(dueDay, monthStr) {
    if (!dueDay) return null;
    var td = new Date();
    var d = Number(dueDay);
    var parts = monthStr.split("-");
    var lastDay = new Date(Number(parts[0]), Number(parts[1]), 0).getDate();
    var clamped = Math.min(d, lastDay);
    var pad = clamped < 10 ? "0" + clamped : String(clamped);
    var due = new Date(monthStr + "-" + pad + "T12:00:00");
    return Math.round((due - td) / 864e5);
  }
  function updateSavingsGoal(patch) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      savingsGoal: _objectSpread(_objectSpread({}, data.savingsGoal || {}), patch)
    }));
  }
  var todayStr_ = todayStr();
  var isCurrentMonth = month === todayStr_.slice(0, 7);
  var daysInMonth = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  var daysElapsed = Math.max(1, isCurrentMonth ? Number(todayStr_.slice(8, 10)) : daysInMonth);
  var dailyRate = totalExpenses / daysElapsed;
  var projectedMonthly = dailyRate * daysInMonth;
  var burnDiff = projectedMonthly - totalIncome;
  var sg = data.savingsGoal || {};
  var sgTarget = Number(sg.target) || 0;
  var sgCurrent = Number(sg.current) || 0;
  var sgDeadline = sg.deadline || "";
  var sgRemaining = Math.max(0, sgTarget - sgCurrent);
  function monthsDiff(from, to) {
    if (!to) return 0;
    var fp = from.split("-").map(Number);
    var tp = to.split("-").map(Number);
    return Math.max(0, (tp[0] - fp[0]) * 12 + (tp[1] - fp[1]));
  }
  var sgMonthsLeft = monthsDiff(month, sgDeadline);
  var sgPerMonth = sgMonthsLeft > 0 ? sgRemaining / sgMonthsLeft : null;
  var sgShiftsNeeded = sgPerMonth && hourlyRate > 0 ? Math.ceil(sgPerMonth / (hourlyRate * 6)) : null;
  var sgProgress = sgTarget > 0 ? Math.min(100, Math.round(sgCurrent / sgTarget * 100)) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 700
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: function onClick() {
      setEditRecId(null);
      setMonth(shiftMonth(-1));
    }
  }, "\u2190 prev"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      fontSize: 15,
      fontWeight: 700,
      color: T.text
    }
  }, fmtM(month)), /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: function onClick() {
      setEditRecId(null);
      setMonth(shiftMonth(1));
    }
  }, "next \u2192")), function () {
    function cellEdge(g) {
      if (!g) return {};
      var rgb = g === "rgba(105,240,174,1)" ? "105,240,174" : g === "rgba(255,209,102,1)" ? "255,209,102" : "255,107,107";
      return {
        borderBottom: "1.5px solid rgba(" + rgb + ",0.45)",
        boxShadow: "inset 0 -10px 22px rgba(" + rgb + ",0.16)"
      };
    }
    var dispRatio = totalIncome > 0 ? disposableLeft / totalIncome : 0;
    var chips = [{
      label: "Income",
      value: "$" + fmtRound(totalIncome),
      sub: calcGoTabIncome > 0 ? "GoTab · " + monthShifts.length + " shifts" : "manual entry",
      col: T.text,
      glow: "rgba(105,240,174,1)"
    }, {
      label: "Expenses",
      value: "−$" + fmtRound(totalExpenses),
      sub: recurringThisMonth.length + " fixed · " + oneOffThisMonth.length + " variable",
      col: T.text,
      glow: "rgba(255,107,107,1)"
    }, {
      label: "Net",
      value: (net >= 0 ? "+$" : "−$") + fmtRound(Math.abs(net)),
      sub: net >= 0 ? "surplus" : "shortfall",
      col: T.text,
      glow: net >= 0 ? "rgba(105,240,174,1)" : "rgba(255,107,107,1)"
    }, {
      label: "Disposable",
      value: (disposableLeft >= 0 ? "$" : "−$") + fmtRound(Math.abs(disposableLeft)),
      sub: _sgCommit > 0 ? "after bills, one-offs & savings" : "after bills & one-offs",
      col: T.text,
      glow: disposableLeft <= 0 ? "rgba(255,107,107,1)" : dispRatio < 0.15 ? "rgba(255,209,102,1)" : "rgba(105,240,174,1)"
    }];
    var stripBase = {
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 14,
      boxShadow: cardShadow
    };
    var cell = {
      padding: mob ? "11px 14px" : "13px 20px"
    };
    var divV = {
      width: 1,
      flexShrink: 0,
      alignSelf: "stretch",
      background: "rgba(255,255,255,0.07)"
    };
    if (mob) {
      return /*#__PURE__*/React.createElement("div", {
        style: _objectSpread(_objectSpread({}, stripBase), {}, {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          backgroundColor: "rgba(255,255,255,0.07)"
        })
      }, chips.map(function (s, i) {
        return /*#__PURE__*/React.createElement("div", {
          key: s.label,
          style: _objectSpread(_objectSpread({}, cell), cellEdge(s.glow))
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 9,
            fontWeight: 600,
            color: T.text3,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4
          }
        }, s.label), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: s.col,
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums"
          }
        }, s.value), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 9,
            color: T.text3,
            marginTop: 3
          }
        }, s.sub));
      }));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, stripBase), {}, {
        display: "flex"
      })
    }, chips.map(function (s, i) {
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: s.label
      }, i > 0 && /*#__PURE__*/React.createElement("div", {
        style: divV
      }), /*#__PURE__*/React.createElement("div", {
        style: _objectSpread(_objectSpread({}, cell), {}, {
          flex: 1
        }, cellEdge(s.glow))
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          fontWeight: 600,
          color: T.text3,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 5
        }
      }, s.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: s.col,
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums"
        }
      }, s.value), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: T.text3,
          marginTop: 4
        }
      }, s.sub)));
    }));
  }(), isCurrentMonth && totalExpenses > 0 && function () {
    var over = burnDiff > 0;
    var edgeRgb = over ? "255,107,107" : "105,240,174";
    var edgeSt = {
      borderBottom: "1.5px solid rgba(" + edgeRgb + ",0.45)",
      boxShadow: "inset 0 -10px 22px rgba(" + edgeRgb + ",0.13)," + cardShadow
    };
    var divV = {
      width: 1,
      flexShrink: 0,
      alignSelf: "stretch",
      background: "rgba(255,255,255,0.07)"
    };
    var seg = {
      padding: mob ? "10px 12px" : "11px 18px"
    };
    var lbl = {
      fontSize: 9,
      fontWeight: 600,
      color: T.text3,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginBottom: 4
    };
    return /*#__PURE__*/React.createElement("div", {
      style: _objectSpread({
        display: "flex",
        background: cardBg,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 12
      }, edgeSt)
    }, /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, seg), {}, {
        flex: 1
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: lbl
    }, "Daily avg"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: mob ? 13 : 15,
        fontWeight: 500,
        color: T.text,
        letterSpacing: "-0.01em"
      }
    }, "$", fmtRound(dailyRate), "/day")), /*#__PURE__*/React.createElement("div", {
      style: divV
    }), /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, seg), {}, {
        flex: 2
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: lbl
    }, "Projected spend"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: mob ? 13 : 15,
        fontWeight: 500,
        color: T.text,
        letterSpacing: "-0.01em"
      }
    }, "$", fmtRound(projectedMonthly), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 400,
        color: T.text3
      }
    }, "of $", fmtRound(totalIncome)))), /*#__PURE__*/React.createElement("div", {
      style: divV
    }), /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, seg), {}, {
        flexShrink: 0
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: lbl
    }, "Month end"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: mob ? 13 : 15,
        fontWeight: 500,
        color: over ? T.danger : T.success,
        letterSpacing: "-0.01em"
      }
    }, over ? "▲ $" + fmtRound(burnDiff) + " over" : "✓ $" + fmtRound(Math.abs(burnDiff)) + " to spare")));
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: fCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: fST
  }, "Income Sources"), /*#__PURE__*/React.createElement("button", {
    style: editSrc ? _objectSpread(_objectSpread({}, editPill), {}, {
      color: T.accent,
      border: "1px solid rgba(91,140,255,0.5)",
      background: "rgba(91,140,255,0.14)"
    }) : editPill,
    onClick: function onClick() {
      setEditSrc(function (s) {
        return !s;
      });
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "pencil",
    size: 11
  }), editSrc ? "Done" : "Edit")), sources.map(function (s) {
    var val = srcAmounts[s.id] !== undefined ? srcAmounts[s.id] : s.amount || "";
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        position: "relative",
        padding: "9px 12px",
        paddingLeft: 14,
        borderRadius: 8,
        background: T.bg3,
        border: "0.5px solid " + T.border,
        marginBottom: 6,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 6,
        bottom: 6,
        width: 2,
        borderRadius: 1,
        background: T.success,
        opacity: 0.55
      }
    }), editSrc && /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, fInp), {}, {
        marginBottom: 5,
        fontSize: 11
      }),
      placeholder: "Source " + s.id,
      value: s.name,
      onChange: function onChange(ev) {
        updateSourceName(s.id, ev.target.value);
      }
    }), !editSrc && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginBottom: 4
      }
    }, s.name || "Source " + s.id), /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, fInp), {}, {
        padding: "4px 8px",
        fontSize: 13,
        fontWeight: 600
      }),
      type: "number",
      step: "0.01",
      placeholder: "0.00",
      value: val,
      onBlur: function onBlur() {
        trk("finance.income_edit");
      },
      onChange: function onChange(ev) {
        updateSourceIncome(s.id, ev.target.value);
      }
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "9px 12px",
      paddingLeft: 14,
      borderRadius: 8,
      background: T.bg3,
      border: "0.5px solid " + T.border,
      marginBottom: 6,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 6,
      bottom: 6,
      width: 2,
      borderRadius: 1,
      background: T.text3,
      opacity: 0.35
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 4
    }
  }, "Hourly rate ($/hr)"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, fInp), {}, {
      padding: "4px 8px",
      fontSize: 12
    }),
    type: "number",
    step: "0.01",
    placeholder: "e.g. 41.58",
    value: hourlyRate || "",
    onChange: function onChange(ev) {
      updateHourlyRate(ev.target.value);
    }
  })), hourlyRate > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "9px 12px",
      paddingLeft: 14,
      borderRadius: 8,
      background: T.bg3,
      border: "0.5px solid " + T.border,
      marginBottom: 10,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 6,
      bottom: 6,
      width: 2,
      borderRadius: 1,
      background: T.accent,
      opacity: 0.7
    }
  }), calcGoTabIncome > 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginBottom: 2
    }
  }, "GoTab auto-calculated"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: T.accent
    }
  }, "$", fmtNum(calcGoTabIncome)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      marginTop: 2
    }
  }, monthShifts.length, " shift", monthShifts.length !== 1 ? "s" : "", " \xB7 ", monthShifts.reduce(function (a, ev) {
    var p = shiftPay(ev.time);
    return a + (p ? p.totalEquiv : 0);
  }, 0).toFixed(1), "h equiv @ $", hourlyRate, "/hr")) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "No GoTab shifts found for ", fmtM(month))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      borderTop: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text2
    }
  }, "Total income"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text
    }
  }, "$", fmtNum(totalIncome))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      paddingLeft: 14,
      borderRadius: 8,
      background: T.bg3,
      border: "0.5px solid " + T.border,
      marginTop: 10,
      overflow: "hidden",
      boxShadow: weeklyDisposable < 0 ? "0 0 10px rgba(255,107,107,0.2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      borderRadius: "3px 0 0 3px",
      background: weeklyDisposable >= 0 ? T.success : T.danger
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2
    }
  }, "Weekly disposable"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      marginTop: 2
    }
  }, _sgCommit > 0 ? "after bills, one-offs & savings ÷ 4.3 wks" : "after bills & one-offs ÷ 4.3 wks")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text
    }
  }, weeklyDisposable >= 0 ? "$" : "−$", fmtNum(Math.abs(weeklyDisposable))))), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: fCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: fST
  }, "Upcoming Bills"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3
    }
  }, "set due day \u2192")), billsRecurring.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3
    }
  }, "No recurring bills set. Add one via Manage below."), billsRecurring.slice().sort(function (a, b) {
    return (a.dueDay || 99) - (b.dueDay || 99);
  }).map(function (b) {
    var dd = daysUntilDue(b.dueDay, month);
    var glow = dd === null ? "none" : dd < 0 ? "0 0 12px rgba(255,107,107,0.35)" : dd <= 5 ? "0 0 8px rgba(255,209,102,0.28)" : "none";
    var dueLbl = dd === null ? null : dd === 0 ? "due today" : dd < 0 ? Math.abs(dd) + "d ago" : "in " + dd + "d";
    var dueCol = dd === null ? T.text3 : dd < 0 ? T.danger : dd <= 5 ? T.warn : T.text3;
    return /*#__PURE__*/React.createElement("div", {
      key: b.id,
      style: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 12px",
        paddingLeft: 14,
        borderRadius: 8,
        background: T.bg3,
        border: "0.5px solid " + T.border,
        boxShadow: glow,
        marginBottom: 6,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 6,
        bottom: 6,
        width: 2,
        borderRadius: 1,
        background: dd !== null && dd < 0 ? T.danger : T.accent,
        opacity: dd !== null && dd <= 5 ? 1 : 0.5
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: T.text,
        marginBottom: 4
      }
    }, b.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: 1,
      max: 31,
      placeholder: "day",
      style: _objectSpread(_objectSpread({}, fInp), {}, {
        width: 40,
        padding: "2px 5px",
        fontSize: 10,
        textAlign: "center"
      }),
      value: b.dueDay || "",
      onChange: function onChange(ev) {
        updateDueDay(b.id, ev.target.value);
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: T.text3
      }
    }, "th"), dueLbl && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: dueCol,
        marginLeft: 2
      }
    }, dueLbl))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: T.text
      }
    }, "$", fmtNum(Number(b.amount))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3
      }
    }, "/mo \xB7 $", fmtNum(Number(b.amount) * 12 / 52), "/wk")));
  }), billsRecurring.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      borderTop: "0.5px solid " + T.border,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text2
    }
  }, "Total bills"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: T.text
    }
  }, "$", fmtNum(billsMonthlyTotal), "/mo"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginLeft: 8
    }
  }, "$", fmtNum(weeklyBills), "/wk"))))), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: fCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fST
  }, "Expenses \xB7 ", fmtM(month)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 3
    }
  }, "recurring auto-apply \xB7 one-off you log manually")), /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: function onClick() {
      setShowRecMgr(function (s) {
        if (s) setEditRecId(null);
        return !s;
      });
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "gear",
    size: 11
  }), showRecMgr ? "Done" : "Manage")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 8,
      background: T.bg3,
      border: "0.5px solid " + T.border,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 8
    })
  }, "Add one-off"), mob ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, fInp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    placeholder: "e.g. KFC Brimbank",
    value: expForm.name,
    onChange: function onChange(ev) {
      setExpForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          name: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, fInp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    type: "number",
    step: "0.01",
    placeholder: "Amount $",
    value: expForm.amount,
    onChange: function onChange(ev) {
      setExpForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          amount: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("select", {
    style: _objectSpread(_objectSpread({}, fInp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: expForm.cat,
    onChange: function onChange(ev) {
      setExpForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          cat: ev.target.value
        });
      });
    }
  }, CATS.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c
    }, c);
  }))), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, fBtnP), {}, {
      padding: "11px",
      fontSize: 14,
      borderRadius: 10
    }),
    onClick: addExpense
  }, "+ Add")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 90px 105px 44px",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: fInp,
    placeholder: "e.g. KFC Brimbank",
    value: expForm.name,
    onChange: function onChange(ev) {
      setExpForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          name: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: fInp,
    type: "number",
    step: "0.01",
    placeholder: "Amount",
    value: expForm.amount,
    onChange: function onChange(ev) {
      setExpForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          amount: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("select", {
    style: fInp,
    value: expForm.cat,
    onChange: function onChange(ev) {
      setExpForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          cat: ev.target.value
        });
      });
    }
  }, CATS.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c
    }, c);
  })), /*#__PURE__*/React.createElement("button", {
    style: fBtnP,
    onClick: addExpense
  }, "+"))), skippedThisMonth.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10,
      padding: "6px 10px",
      borderRadius: 8,
      background: T.bg3,
      border: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      marginBottom: 6
    }
  }, "SKIPPED THIS MONTH \xB7 tap to restore"), skippedThisMonth.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        restoreRecurring(t.id);
      },
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        marginRight: 4,
        marginBottom: 4,
        fontSize: 10,
        textDecoration: "line-through",
        color: T.text3
      })
    }, t.name);
  })), (recurringThisMonth.length > 0 || showRecMgr) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 6
    })
  }, "Recurring"), recurringThisMonth.map(function (e) {
    if (showRecMgr && editRecId === e.id) {
      return /*#__PURE__*/React.createElement("div", {
        key: e.id || e.name,
        style: mob ? {
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 8,
          padding: "10px 12px",
          borderRadius: 8,
          background: T.bg3,
          border: "0.5px solid " + T.border
        } : {
          display: "grid",
          gridTemplateColumns: "1fr 90px 100px 50px 36px 36px",
          gap: 5,
          marginBottom: 6,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement("input", {
        style: fInp,
        placeholder: "Name",
        value: editRecForm.name,
        onChange: function onChange(ev) {
          setEditRecForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              name: ev.target.value
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: fInp,
        type: "number",
        step: "0.01",
        placeholder: "$/mo",
        value: editRecForm.amount,
        onChange: function onChange(ev) {
          setEditRecForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              amount: ev.target.value
            });
          });
        }
      }), /*#__PURE__*/React.createElement("select", {
        style: fInp,
        value: editRecForm.cat,
        onChange: function onChange(ev) {
          setEditRecForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              cat: ev.target.value
            });
          });
        }
      }, CATS.map(function (c) {
        return /*#__PURE__*/React.createElement("option", {
          key: c
        }, c);
      })), /*#__PURE__*/React.createElement("input", {
        style: fInp,
        type: "number",
        min: 1,
        max: 31,
        placeholder: "due day",
        value: editRecForm.dueDay || "",
        onChange: function onChange(ev) {
          setEditRecForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              dueDay: ev.target.value
            });
          });
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: mob ? {
          display: "flex",
          gap: 6
        } : {
          display: "contents"
        }
      }, /*#__PURE__*/React.createElement("button", {
        style: mob ? _objectSpread(_objectSpread({}, fBtnP), {}, {
          flex: 1
        }) : fBtnP,
        onClick: saveEditRec
      }, mob ? "Save ✓" : "✓"), /*#__PURE__*/React.createElement("button", {
        style: mob ? _objectSpread(_objectSpread({}, editPill), {}, {
          flex: 1,
          textAlign: "center"
        }) : editPill,
        onClick: function onClick() {
          setEditRecId(null);
        }
      }, mob ? "Cancel" : "✕")));
    }
    return /*#__PURE__*/React.createElement("div", {
      key: e.id || e.name,
      style: {
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "9px 12px",
        paddingLeft: 14,
        borderRadius: 8,
        background: T.bg3,
        border: "0.5px solid " + T.border,
        marginBottom: 6,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 6,
        bottom: 6,
        width: 2,
        borderRadius: 1,
        background: T.accent,
        opacity: 0.6
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text
      }
    }, e.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: CAT_COL[e.cat]
      }
    }, e.cat, e.dueDay ? " · due " + e.dueDay + "th" : ""))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: T.text
      }
    }, "\u2212$", fmtNum(Number(e.amount))), showRecMgr && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        var base = recurringTemplates.find(function (t) {
          return t.id === e.id;
        }) || e;
        setEditRecId(e.id);
        setEditRecForm({
          name: base.name,
          amount: base.amount,
          cat: base.cat,
          dueDay: base.dueDay || ""
        });
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: 2
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "pencil",
      size: 13
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        skipRecurring(e.id);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 10
      }
    }, "skip"), showRecMgr && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        deleteTemplate(e.id);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 16,
        lineHeight: 1
      }
    }, "\xD7")));
  }), recurringThisMonth.length === 0 && showRecMgr && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      padding: "4px 0 8px"
    }
  }, "No recurring entries yet. Add one below."), showRecMgr && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      paddingTop: 10,
      borderTop: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 8
    })
  }, "Add recurring"), /*#__PURE__*/React.createElement("div", {
    style: mob ? {
      display: "flex",
      flexDirection: "column",
      gap: 6
    } : {
      display: "grid",
      gridTemplateColumns: "1fr 80px 100px 50px 44px",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: fInp,
    placeholder: "Name",
    value: recForm.name,
    onChange: function onChange(ev) {
      setRecForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          name: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: fInp,
    type: "number",
    step: "0.01",
    placeholder: "$/mo",
    value: recForm.amount,
    onChange: function onChange(ev) {
      setRecForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          amount: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("select", {
    style: fInp,
    value: recForm.cat,
    onChange: function onChange(ev) {
      setRecForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          cat: ev.target.value
        });
      });
    }
  }, CATS.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c
    }, c);
  })), /*#__PURE__*/React.createElement("input", {
    style: fInp,
    type: "number",
    min: 1,
    max: 31,
    placeholder: mob ? "due day of month" : "day",
    title: "Due day of month",
    value: recForm.dueDay || "",
    onChange: function onChange(ev) {
      setRecForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          dueDay: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: mob ? _objectSpread(_objectSpread({}, fBtnP), {}, {
      padding: "10px",
      justifyContent: "center"
    }) : fBtnP,
    onClick: addRecurring
  }, mob ? "+ Add recurring" : "+")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 6
    })
  }, "One-off"), oneOffThisMonth.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      padding: "6px 0"
    }
  }, "Nothing added yet. Use the form above"), oneOffThisMonth.map(function (e) {
    if (editExpId === e.id) {
      return mob ? /*#__PURE__*/React.createElement("div", {
        key: e.id,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 8,
          padding: "10px 12px",
          borderRadius: 8,
          background: T.bg3,
          border: "0.5px solid " + T.border
        }
      }, /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, fInp), {}, {
          padding: "10px 12px",
          fontSize: 14
        }),
        value: editExpForm.name,
        onChange: function onChange(ev) {
          setEditExpForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              name: ev.target.value
            });
          });
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, fInp), {}, {
          padding: "10px 12px",
          fontSize: 14
        }),
        type: "number",
        step: "0.01",
        value: editExpForm.amount,
        onChange: function onChange(ev) {
          setEditExpForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              amount: ev.target.value
            });
          });
        }
      }), /*#__PURE__*/React.createElement("select", {
        style: _objectSpread(_objectSpread({}, fInp), {}, {
          padding: "10px 12px",
          fontSize: 14
        }),
        value: editExpForm.cat,
        onChange: function onChange(ev) {
          setEditExpForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              cat: ev.target.value
            });
          });
        }
      }, CATS.map(function (c) {
        return /*#__PURE__*/React.createElement("option", {
          key: c
        }, c);
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("button", {
        style: _objectSpread(_objectSpread({}, fBtnP), {}, {
          padding: "10px",
          fontSize: 14,
          borderRadius: 10
        }),
        onClick: saveEditExp
      }, "Save \u2713"), /*#__PURE__*/React.createElement("button", {
        style: _objectSpread(_objectSpread({}, editPill), {}, {
          padding: "10px",
          fontSize: 14,
          borderRadius: 10,
          textAlign: "center"
        }),
        onClick: function onClick() {
          setEditExpId(null);
        }
      }, "Cancel"))) : /*#__PURE__*/React.createElement("div", {
        key: e.id,
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 90px 105px 44px 36px",
          gap: 5,
          marginBottom: 6,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement("input", {
        style: fInp,
        value: editExpForm.name,
        onChange: function onChange(ev) {
          setEditExpForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              name: ev.target.value
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: fInp,
        type: "number",
        step: "0.01",
        value: editExpForm.amount,
        onChange: function onChange(ev) {
          setEditExpForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              amount: ev.target.value
            });
          });
        }
      }), /*#__PURE__*/React.createElement("select", {
        style: fInp,
        value: editExpForm.cat,
        onChange: function onChange(ev) {
          setEditExpForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              cat: ev.target.value
            });
          });
        }
      }, CATS.map(function (c) {
        return /*#__PURE__*/React.createElement("option", {
          key: c
        }, c);
      })), /*#__PURE__*/React.createElement("button", {
        style: fBtnP,
        onClick: saveEditExp
      }, "\u2713"), /*#__PURE__*/React.createElement("button", {
        style: editPill,
        onClick: function onClick() {
          setEditExpId(null);
        }
      }, "\u2715"));
    }
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      style: {
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "9px 12px",
        paddingLeft: 14,
        borderRadius: 8,
        background: T.bg3,
        border: "0.5px solid " + T.border,
        marginBottom: 6,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 6,
        bottom: 6,
        width: 2,
        borderRadius: 1,
        background: T.warn,
        opacity: 0.6
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text
      }
    }, e.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: CAT_COL[e.cat]
      }
    }, e.cat)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: T.text
      }
    }, "\u2212$", fmtNum(Number(e.amount))), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setEditExpId(e.id);
        setEditExpForm({
          name: e.name,
          amount: e.amount,
          cat: e.cat
        });
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: 2
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "pencil",
      size: 13
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        removeOneOff(e.id);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 16,
        lineHeight: 1
      }
    }, "\xD7")));
  })), allThisMonth.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      marginTop: 8,
      borderTop: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: T.text
    }
  }, "Total expenses"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text
    }
  }, "\u2212$", fmtNum(totalExpenses)))), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: fCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fST
  }, sg.name || "Savings Goal"), sg.name && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 2
    }
  }, "savings goal")), sgTarget > 0 && /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: function onClick() {
      updateSavingsGoal({
        target: 0,
        deadline: "",
        current: 0,
        target_draft: "",
        name: ""
      });
    }
  }, "Clear")), sgTarget === 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 12
    }
  }, "Name your goal and set a target, and we'll show how much to put away each month and how many shifts that takes."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 4
    })
  }, "Goal name"), /*#__PURE__*/React.createElement("input", {
    style: fInp,
    placeholder: "e.g. Europe trip, Car, Emergency fund",
    value: sg.name || "",
    onChange: function onChange(ev) {
      updateSavingsGoal({
        name: ev.target.value
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 4
    })
  }, "Target $"), /*#__PURE__*/React.createElement("input", {
    style: fInp,
    type: "number",
    step: "50",
    placeholder: "e.g. 5000",
    value: sg.target_draft || "",
    onChange: function onChange(ev) {
      updateSavingsGoal({
        target_draft: ev.target.value
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 4
    })
  }, "By month"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, fInp), {}, {
      colorScheme: "dark"
    }),
    type: "month",
    value: sgDeadline,
    onChange: function onChange(ev) {
      updateSavingsGoal({
        deadline: ev.target.value
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 4
    })
  }, "Have now $"), /*#__PURE__*/React.createElement("input", {
    style: fInp,
    type: "number",
    step: "50",
    placeholder: "0",
    value: sg.current || "",
    onChange: function onChange(ev) {
      updateSavingsGoal({
        current: Number(ev.target.value) || 0
      });
    }
  }))), sg.target_draft && sgDeadline && /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, fBtnP), {}, {
      marginTop: 10,
      width: "100%",
      justifyContent: "center"
    }),
    onClick: function onClick() {
      updateSavingsGoal({
        target: Number(sg.target_draft) || 0,
        target_draft: ""
      });
    }
  }, "Set goal \u2192")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3,1fr)",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fGlassMini), {}, {
      padding: "14px 16px",
      borderBottom: "1.5px solid rgba(91,140,255,0.45)",
      boxShadow: "inset 0 -10px 22px rgba(91,140,255,0.14)," + cardShadowSoft
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 4
    })
  }, "Remaining"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 18 : 22,
      fontWeight: 500,
      letterSpacing: "-0.02em",
      color: T.text,
      lineHeight: 1.05,
      fontVariantNumeric: "tabular-nums"
    }
  }, "$", fmtRound(sgRemaining)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 4
    }
  }, "$", fmtRound(sgCurrent), " of $", fmtRound(sgTarget), " saved")), /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fGlassMini), {}, {
      padding: "14px 16px",
      borderBottom: "1.5px solid rgba(255,209,102,0.45)",
      boxShadow: "inset 0 -10px 22px rgba(255,209,102,0.14)," + cardShadowSoft
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 4
    })
  }, "Per month"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 18 : 22,
      fontWeight: 500,
      letterSpacing: "-0.02em",
      color: T.text,
      lineHeight: 1.05,
      fontVariantNumeric: "tabular-nums"
    }
  }, sgPerMonth != null ? "$" + fmtRound(sgPerMonth) : "—"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 4
    }
  }, sgMonthsLeft > 0 ? sgMonthsLeft + " months left" : "set a deadline")), /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fGlassMini), {}, {
      padding: "14px 16px"
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, fStatLabel), {}, {
      marginBottom: 4
    })
  }, "Shifts/mo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 18 : 22,
      fontWeight: 500,
      letterSpacing: "-0.02em",
      color: sgShiftsNeeded != null ? T.text : T.text3,
      lineHeight: 1.05,
      fontVariantNumeric: "tabular-nums"
    }
  }, sgShiftsNeeded != null ? sgShiftsNeeded : "—"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 4
    }
  }, hourlyRate > 0 ? "@ $" + hourlyRate + "/hr · 6h avg" : "set hourly rate ↑"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: T.text3
    }
  }, "Progress toward $", fmtRound(sgTarget)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.accent
    }
  }, sgProgress, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.06)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar-reveal",
    style: {
      width: sgProgress + "%",
      height: "100%",
      borderRadius: 2,
      background: T.accent,
      transition: "width 0.4s cubic-bezier(0.23,1,0.32,1)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "Have $"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, fInp), {}, {
      width: 90,
      padding: "3px 8px",
      fontSize: 11
    }),
    type: "number",
    step: "50",
    placeholder: "0",
    value: sgCurrent || "",
    onChange: function onChange(ev) {
      updateSavingsGoal({
        current: Number(ev.target.value) || 0
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "By"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, fInp), {}, {
      width: 120,
      padding: "3px 8px",
      fontSize: 11,
      colorScheme: "dark"
    }),
    type: "month",
    value: sgDeadline,
    onChange: function onChange(ev) {
      updateSavingsGoal({
        deadline: ev.target.value
      });
    }
  }))))));
}

// ══════════════════════════════════════════════════════════════════════════
// Invest tab — personal "mini-Bloomberg": watchlist, cost-basis lots, portfolio
// P&L in a base currency (AUD), allocation, valuation, analyst ratings,
// benchmark overlay, and AI portfolio review. Market data via
// window.MarketService (Finnhub quotes/metrics + Twelve Data EOD charts + ECB
// FX), with a deterministic DEMO MODE so the tab always renders with no keys.
// Not financial advice — informational only.
// ══════════════════════════════════════════════════════════════════════════
function invFmt(n, dp) {
  if (n === undefined || n === null || n === "" || isNaN(n)) return "—";
  dp = dp === undefined ? 2 : dp;
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  });
}
function invPct(n) {
  if (n === undefined || n === null || isNaN(n)) return "—";
  return (n >= 0 ? "+" : "") + Number(n).toFixed(2) + "%";
}
function invUniq(a) {
  var seen = {},
    out = [];
  a.forEach(function (x) {
    var k = (x || "").toUpperCase();
    if (x && !seen[k]) {
      seen[k] = 1;
      out.push(k);
    }
  });
  return out;
}
function invMoney(n, base) {
  if (n === undefined || n === null || isNaN(n)) return "—";
  return (base === "AUD" ? "A$" : "$") + invFmt(n);
}
function invCompact(n, base) {
  if (n === undefined || n === null || isNaN(n)) return "—";
  var p = base === "AUD" ? "A$" : "$";
  var a = Math.abs(n);
  if (a >= 1e9) return p + (n / 1e9).toFixed(2) + "B";
  if (a >= 1e6) return p + (n / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return p + (n / 1e3).toFixed(1) + "k";
  return p + invFmt(n);
}
// Coerce whatever getCandles returns into a flat array of closing prices.
function invCloses(c) {
  if (!c) return [];
  if (Array.isArray(c)) {
    if (c.length === 0) return [];
    if (typeof c[0] === "number") return c.filter(function (x) {
      return typeof x === "number" && !isNaN(x);
    });
    return c.map(function (p) {
      return p && (p.close !== undefined ? p.close : p.c !== undefined ? p.c : null);
    }).filter(function (x) {
      return typeof x === "number" && !isNaN(x);
    });
  }
  if (c.candles) return invCloses(c.candles);
  if (Array.isArray(c.c)) return c.c.filter(function (x) {
    return typeof x === "number" && !isNaN(x);
  });
  return [];
}
// Defensive readers so the UI is decoupled from the provider's exact field names.
function invQPrice(q) {
  if (!q) return null;
  return q.price !== undefined ? q.price : q.c !== undefined ? q.c : null;
}
// A usable price for P&L math: null when missing, NaN, or <=0 (e.g. an ASX ticker
// the free data source couldn't resolve). Keeps a dead holding from skewing totals.
function invValidPx(q) {
  var px = invQPrice(q);
  return px === null || isNaN(px) || px <= 0 ? null : px;
}
function invQChg(q) {
  if (!q) return null;
  return q.change !== undefined ? q.change : q.d !== undefined ? q.d : null;
}
function invQPct(q) {
  if (!q) return null;
  return q.changePercent !== undefined ? q.changePercent : q.changePct !== undefined ? q.changePct : q.dp !== undefined ? q.dp : null;
}
function invNorm(closes) {
  if (!closes || closes.length < 2) return [];
  var base = closes[0] || 1;
  return closes.map(function (v) {
    return (v / base - 1) * 100;
  });
}
var INV_PALETTE = ["#5b8cff", "#69f0ae", "#ffd166", "#ff9a3c", "#c58cff", "#4dd0e1", "#ff6b6b", "#9ccc65", "#f06292", "#7986cb"];

// Dependency-free SVG chart. Pass `closes` for a single price line (with area
// fill), or `series:[{closes,color,label}]` for a normalized %-return overlay.
function InvChart(props) {
  var h = props.h || 190;
  var W = 1000;
  var mob = props.mob;
  var lines;
  if (props.series && props.series.length) {
    lines = props.series.map(function (s) {
      return {
        vals: invNorm(s.closes),
        color: s.color,
        label: s.label,
        pct: true
      };
    }).filter(function (l) {
      return l.vals.length > 1;
    });
  } else if (props.closes && props.closes.length > 1) {
    var up = props.closes[props.closes.length - 1] >= props.closes[0];
    lines = [{
      vals: props.closes,
      color: props.accent || (up ? "#69f0ae" : "#ff6b6b"),
      area: true
    }];
  } else {
    lines = [];
  }
  if (!lines.length) return /*#__PURE__*/React.createElement("div", {
    style: {
      height: h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: T.text3,
      fontSize: 12
    }
  }, "No chart data available");
  var allV = [];
  lines.forEach(function (l) {
    allV = allV.concat(l.vals);
  });
  var min = Math.min.apply(null, allV),
    max = Math.max.apply(null, allV);
  var pad = (max - min) * 0.10 || Math.abs(max) * 0.02 || 1;
  min -= pad;
  max += pad;
  var span = max - min || 1;
  function Y(v) {
    return h - (v - min) / span * h;
  }
  function pathFor(vals) {
    var nn = vals.length;
    return vals.map(function (v, i) {
      return (i / (nn - 1 || 1) * W).toFixed(1) + "," + Y(v).toFixed(1);
    });
  }
  var zeroY = props.series && min < 0 && max > 0 ? Y(0) : null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 " + W + " " + h,
    preserveAspectRatio: "none",
    style: {
      width: "100%",
      height: h,
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, lines.map(function (l, i) {
    return l.area ? /*#__PURE__*/React.createElement("linearGradient", {
      key: i,
      id: "invg" + i + "_" + Math.round(l.vals[0] || 0),
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0%",
      stopColor: l.color,
      stopOpacity: "0.28"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "100%",
      stopColor: l.color,
      stopOpacity: "0"
    })) : null;
  })), zeroY !== null && /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: zeroY,
    x2: W,
    y2: zeroY,
    stroke: "rgba(255,255,255,0.14)",
    strokeWidth: "1",
    strokeDasharray: "4 5",
    vectorEffect: "non-scaling-stroke"
  }), lines.map(function (l, i) {
    var pts = pathFor(l.vals);
    var line = "M" + pts.join(" L");
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, l.area && /*#__PURE__*/React.createElement("path", {
      d: line + " L" + W.toFixed(1) + "," + h + " L0," + h + " Z",
      fill: "url(#invg" + i + "_" + Math.round(l.vals[0] || 0) + ")"
    }), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: l.color,
      strokeWidth: l.pct ? 1.8 : 2,
      strokeLinejoin: "round",
      strokeOpacity: l.label === "benchmark" ? 0.65 : 1,
      strokeDasharray: l.label === "benchmark" ? "5 4" : undefined,
      vectorEffect: "non-scaling-stroke"
    }));
  })), props.series && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 6,
      flexWrap: "wrap"
    }
  }, props.series.map(function (s, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        fontSize: 10,
        color: T.text3,
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 2,
        background: s.color,
        display: "inline-block",
        borderRadius: 2
      }
    }), s.name, " ", invNorm(s.closes).length > 1 ? invPct(invNorm(s.closes).slice(-1)[0]) : "");
  })));
}

// Compact inline sparkline for table rows.
function InvSpark(props) {
  var closes = props.closes || [];
  var w = props.w || 88,
    h = props.h || 26;
  if (closes.length < 2) return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  });
  var min = Math.min.apply(null, closes),
    max = Math.max.apply(null, closes);
  var span = max - min || 1;
  var up = closes[closes.length - 1] >= closes[0];
  var col = up ? "#69f0ae" : "#ff6b6b";
  var pts = closes.map(function (v, i) {
    return (i / (closes.length - 1) * w).toFixed(1) + "," + (h - (v - min) / span * (h - 3) - 1.5).toFixed(1);
  });
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M" + pts.join(" L"),
    fill: "none",
    stroke: col,
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }));
}

// SVG donut from slices [{label,value,color}].
function InvDonut(props) {
  var slices = (props.slices || []).filter(function (s) {
    return s.value > 0;
  });
  var size = props.size || 150;
  var total = slices.reduce(function (a, s) {
    return a + s.value;
  }, 0);
  var r = size / 2 - 14,
    cx = size / 2,
    cy = size / 2,
    C = 2 * Math.PI * r;
  var off = 0;
  if (!total) return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: T.text3,
      fontSize: 11
    }
  }, "No data");
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 " + size + " " + size
  }, /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r,
    fill: "none",
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: "14"
  }), slices.map(function (s, i) {
    var frac = s.value / total;
    var dash = frac * C;
    var el = /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: cx,
      cy: cy,
      r: r,
      fill: "none",
      stroke: s.color,
      strokeWidth: "14",
      strokeDasharray: dash.toFixed(2) + " " + (C - dash).toFixed(2),
      strokeDashoffset: (-off).toFixed(2),
      transform: "rotate(-90 " + cx + " " + cy + ")",
      strokeLinecap: "butt"
    });
    off += dash;
    return el;
  }));
}

// Analyst recommendation stacked bar.
function InvRatingBar(props) {
  var r = props.rec || {};
  var segs = [["strongBuy", "#2e9e5b"], ["buy", "#69f0ae"], ["hold", "#ffd166"], ["sell", "#ff9a3c"], ["strongSell", "#ff6b6b"]];
  var total = segs.reduce(function (a, s) {
    return a + (Number(r[s[0]]) || 0);
  }, 0);
  if (!total) return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "No analyst data");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: 10,
      borderRadius: 6,
      overflow: "hidden",
      background: "rgba(255,255,255,0.05)"
    }
  }, segs.map(function (s, i) {
    var v = Number(r[s[0]]) || 0;
    if (!v) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      title: s[0] + ": " + v,
      style: {
        width: v / total * 100 + "%",
        background: s[1]
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 6,
      flexWrap: "wrap",
      fontSize: 10,
      color: T.text3
    }
  }, segs.map(function (s, i) {
    var v = Number(r[s[0]]) || 0;
    if (!v) return null;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: s[1]
      }
    }), s[0].replace(/([A-Z])/g, " $1").replace(/^./, function (c) {
      return c.toUpperCase();
    }), " ", v);
  })));
}
function InvestSection(_ref2) {
  var data = _ref2.data,
    onUpdate = _ref2.onUpdate,
    mob = _ref2.mob;
  mob = mob || false;
  var MS = window.MarketService || null;
  var watchlist = Array.isArray(data.watchlist) ? data.watchlist : [];
  var holdings = Array.isArray(data.holdings) ? data.holdings : []; // each entry = a buy lot
  var sales = Array.isArray(data.sales) ? data.sales : [];
  var notes = data.notes || {};
  var manualPx = data.manualPx || {}; // symbol -> price in the holding's native ccy (for assets the free APIs can't reach, e.g. ASX)
  var baseCcy = data.baseCurrency || "AUD";
  var _useState61 = useState({}),
    _useState62 = _slicedToArray(_useState61, 2),
    quotes = _useState62[0],
    setQuotes = _useState62[1];
  var _useState63 = useState({}),
    _useState64 = _slicedToArray(_useState63, 2),
    profiles = _useState64[0],
    setProfiles = _useState64[1];
  var _useState65 = useState({}),
    _useState66 = _slicedToArray(_useState65, 2),
    candleMap = _useState66[0],
    setCandleMap = _useState66[1]; // symbol -> closes[]
  var _useState67 = useState({}),
    _useState68 = _slicedToArray(_useState67, 2),
    fxRates = _useState68[0],
    setFxRates = _useState68[1]; // ccy -> rate to base
  var _useState69 = useState({}),
    _useState70 = _slicedToArray(_useState69, 2),
    metrics = _useState70[0],
    setMetrics = _useState70[1];
  var _useState71 = useState({}),
    _useState72 = _slicedToArray(_useState71, 2),
    rec = _useState72[0],
    setRec = _useState72[1];
  var _useState73 = useState({}),
    _useState74 = _slicedToArray(_useState73, 2),
    ptarget = _useState74[0],
    setPtarget = _useState74[1];
  var _useState75 = useState({}),
    _useState76 = _slicedToArray(_useState75, 2),
    earnings = _useState76[0],
    setEarnings = _useState76[1];
  var _useState77 = useState(null),
    _useState78 = _slicedToArray(_useState77, 2),
    benchCloses = _useState78[0],
    setBenchCloses = _useState78[1];
  var _useState79 = useState(false),
    _useState80 = _slicedToArray(_useState79, 2),
    loading = _useState80[0],
    setLoading = _useState80[1];
  var _useState81 = useState(watchlist[0] ? watchlist[0].symbol : holdings[0] ? holdings[0].symbol : null),
    _useState82 = _slicedToArray(_useState81, 2),
    selected = _useState82[0],
    setSelected = _useState82[1];
  var _useState83 = useState([]),
    _useState84 = _slicedToArray(_useState83, 2),
    news = _useState84[0],
    setNews = _useState84[1];
  var _useState85 = useState({
      loading: false,
      text: "",
      err: "",
      title: ""
    }),
    _useState86 = _slicedToArray(_useState85, 2),
    ai = _useState86[0],
    setAi = _useState86[1];
  var _useState87 = useState(""),
    _useState88 = _slicedToArray(_useState87, 2),
    addSym = _useState88[0],
    setAddSym = _useState88[1];
  var _useState89 = useState([]),
    _useState90 = _slicedToArray(_useState89, 2),
    searchRes = _useState90[0],
    setSearchRes = _useState90[1];
  var _useState91 = useState(false),
    _useState92 = _slicedToArray(_useState91, 2),
    searching = _useState92[0],
    setSearching = _useState92[1];
  var _useState93 = useState({
      symbol: "",
      shares: "",
      cost: "",
      ccy: "USD",
      date: ""
    }),
    _useState94 = _slicedToArray(_useState93, 2),
    lotForm = _useState94[0],
    setLotForm = _useState94[1];
  var _useState95 = useState(null),
    _useState96 = _slicedToArray(_useState95, 2),
    sellFor = _useState96[0],
    setSellFor = _useState96[1];
  var _useState97 = useState({
      shares: "",
      price: ""
    }),
    _useState98 = _slicedToArray(_useState97, 2),
    sellForm = _useState98[0],
    setSellForm = _useState98[1];
  var _useState99 = useState(null),
    _useState100 = _slicedToArray(_useState99, 2),
    expanded = _useState100[0],
    setExpanded = _useState100[1];
  var _useState101 = useState(false),
    _useState102 = _slicedToArray(_useState101, 2),
    showKey = _useState102[0],
    setShowKey = _useState102[1];
  var _useState103 = useState(""),
    _useState104 = _slicedToArray(_useState103, 2),
    finnKey = _useState104[0],
    setFinnKey = _useState104[1];
  var _useState105 = useState(""),
    _useState106 = _slicedToArray(_useState105, 2),
    tdKey = _useState106[0],
    setTdKey = _useState106[1];
  var _useState107 = useState(MS ? MS.isDemo() : true),
    _useState108 = _slicedToArray(_useState107, 2),
    demo = _useState108[0],
    setDemo = _useState108[1];
  var _useState109 = useState(null),
    _useState110 = _slicedToArray(_useState109, 2),
    keyIssue = _useState110[0],
    setKeyIssue = _useState110[1];
  var searchTimerRef = useRef(null);
  var _useState111 = useState(90),
    _useState112 = _slicedToArray(_useState111, 2),
    range = _useState112[0],
    setRange = _useState112[1];
  var _useState113 = useState("position"),
    _useState114 = _slicedToArray(_useState113, 2),
    allocMode = _useState114[0],
    setAllocMode = _useState114[1];
  var _useState115 = useState("SPY"),
    _useState116 = _slicedToArray(_useState115, 2),
    bench = _useState116[0],
    setBench = _useState116[1];
  var _useState117 = useState(null),
    _useState118 = _slicedToArray(_useState117, 2),
    noteDraft = _useState118[0],
    setNoteDraft = _useState118[1];
  var _useState119 = useState({}),
    _useState120 = _slicedToArray(_useState119, 2),
    mDraft = _useState120[0],
    setMDraft = _useState120[1];
  var _useState121 = useState(null),
    _useState122 = _slicedToArray(_useState121, 2),
    refreshedAt = _useState122[0],
    setRefreshedAt = _useState122[1];
  var allSymbols = invUniq([].concat(watchlist.map(function (w) {
    return w.symbol;
  }), holdings.map(function (h) {
    return h.symbol;
  })));
  var symbolsKey = allSymbols.join(",");

  // ── styles ──
  var iCard = function iCard(ex) {
    return _objectSpread({
      position: "relative",
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      padding: "18px 20px",
      marginBottom: 14,
      boxShadow: cardShadow
    }, ex || {});
  };
  var iStatLabel = {
    fontSize: 10,
    fontWeight: 600,
    color: "#8f97a6",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };
  var iInp = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: T.text,
    fontSize: 12,
    boxSizing: "border-box"
  };
  var iBtn = _objectSpread({}, btnGlassP);
  var iGhost = {
    appearance: "none",
    padding: "6px 12px",
    borderRadius: 999,
    border: "0.5px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.05)",
    color: T.text2,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap"
  };
  var segWrap = {
    display: "inline-flex",
    gap: 2,
    padding: 2,
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.10)"
  };
  var segBtn = function segBtn(on) {
    return {
      appearance: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      background: on ? "rgba(91,140,255,0.22)" : "transparent",
      color: on ? T.text : T.text2
    };
  };
  function toast(m, t) {
    if (window.showToast) window.showToast(m, t);
  }
  function fx(ccy) {
    return fxRates[ccy || "USD"] !== undefined ? fxRates[ccy || "USD"] : ccy === baseCcy ? 1 : 1;
  }
  // Effective price for a symbol: live quote if valid, else the user's manual price.
  function effPx(sym) {
    var lp = invValidPx(quotes[sym]);
    if (lp !== null) return lp;
    var m = Number(manualPx[sym]);
    return m > 0 ? m : null;
  }
  function isManual(sym) {
    return invValidPx(quotes[sym]) === null && Number(manualPx[sym]) > 0;
  }

  // ── positions: aggregate lots by symbol (average-cost basis) ──
  function buildPositions() {
    var map = {};
    holdings.forEach(function (l) {
      var s = l.symbol;
      if (!map[s]) map[s] = {
        symbol: s,
        ccy: l.ccy || "USD",
        buyShares: 0,
        buyCost: 0,
        lots: []
      };
      map[s].buyShares += Number(l.shares) || 0;
      map[s].buyCost += (Number(l.shares) || 0) * (Number(l.cost) || 0);
      map[s].lots.push(l);
      if (l.ccy) map[s].ccy = l.ccy;
    });
    var soldMap = {};
    sales.forEach(function (s) {
      soldMap[s.symbol] = (soldMap[s.symbol] || 0) + (Number(s.shares) || 0);
    });
    return Object.keys(map).map(function (s) {
      var p = map[s];
      var avg = p.buyShares > 0 ? p.buyCost / p.buyShares : 0;
      var sold = soldMap[s] || 0;
      var net = p.buyShares - sold;
      return {
        symbol: s,
        ccy: p.ccy,
        lots: p.lots,
        avgCost: avg,
        netShares: net,
        buyShares: p.buyShares,
        sold: sold
      };
    });
  }
  var positions = buildPositions();
  var openPositions = positions.filter(function (p) {
    return p.netShares > 0.0001;
  });

  // realized P&L (in base ccy) — uses the cost basis captured on the sale record at
  // sale time; falls back to today's live average-cost for legacy sales saved before
  // costBasis was recorded (so a lot deleted afterward can't rewrite past P&L).
  var realized = 0;
  sales.forEach(function (s) {
    var pos = positions.filter(function (p) {
      return p.symbol === s.symbol;
    })[0];
    var avg = s.costBasis != null ? s.costBasis : pos ? pos.avgCost : 0;
    realized += ((Number(s.price) || 0) - avg) * (Number(s.shares) || 0) * fx(s.ccy || pos && pos.ccy || "USD");
  });

  // portfolio totals (base ccy)
  var portValue = 0,
    portCost = 0,
    todayChange = 0,
    priced = 0;
  openPositions.forEach(function (p) {
    var q = quotes[p.symbol];
    var px = effPx(p.symbol);
    var r = fx(p.ccy);
    // Only priced positions (live OR manual) count toward value AND cost, so an
    // unpriced holding can't drag the totals or % down.
    if (px !== null) {
      portValue += px * p.netShares * r;
      portCost += p.avgCost * p.netShares * r;
      priced++;
      var ch = invQChg(q);
      if (ch !== null) todayChange += ch * p.netShares * r;
    }
  });
  var unrealized = portValue - portCost;
  var unrealizedPct = portCost > 0 ? unrealized / portCost * 100 : 0;
  var todayPct = portValue - todayChange > 0 ? todayChange / (portValue - todayChange) * 100 : 0;

  // ── data loading ──
  function loadQuotes() {
    if (!MS || allSymbols.length === 0) {
      setRefreshedAt(new Date());
      return;
    }
    setLoading(true);
    Promise.all(allSymbols.map(function (sym) {
      return MS.getQuote(sym).then(function (q) {
        return [sym, q, null];
      })["catch"](function (e) {
        return [sym, null, e && e.message ? e.message : String(e)];
      });
    })).then(function (triples) {
      setQuotes(function (prev) {
        var nq = _objectSpread({}, prev);
        triples.forEach(function (pr) {
          if (pr[1]) nq[pr[0]] = pr[1];
        });
        return nq;
      });
      var keyErr = triples.map(function (t) {
        return t[2];
      }).filter(Boolean).find(function (m) {
        return /denied|invalid|expired/i.test(m);
      });
      setKeyIssue(keyErr || null);
      if (keyErr) toast(keyErr, "warn");
    }).then(function () {
      setRefreshedAt(new Date());
    })["catch"](function () {}).then(function () {
      setLoading(false);
    });
    // sparkline/portfolio-series candles + profiles (best effort, cached)
    allSymbols.forEach(function (sym) {
      if (candleMap[sym] === undefined) {
        MS.getCandles(sym, "D", Math.floor(Date.now() / 1000) - 86400 * 400, Math.floor(Date.now() / 1000)).then(function (c) {
          var cl = invCloses(c);
          setCandleMap(function (prev) {
            var n = _objectSpread({}, prev);
            n[sym] = cl;
            return n;
          });
        })["catch"](function () {
          setCandleMap(function (prev) {
            var n = _objectSpread({}, prev);
            n[sym] = [];
            return n;
          });
        });
      }
      if (profiles[sym] === undefined) {
        MS.getProfile(sym).then(function (p) {
          setProfiles(function (prev) {
            var n = _objectSpread({}, prev);
            n[sym] = p;
            return n;
          });
        })["catch"](function () {});
      }
    });
  }
  useEffect(function () {
    loadQuotes();
  }, [symbolsKey]);

  // FX: fetch rate for each distinct currency -> base
  useEffect(function () {
    if (!MS) return;
    var ccys = invUniq(holdings.map(function (h) {
      return h.ccy || "USD";
    }).concat(["USD"]));
    ccys.forEach(function (c) {
      MS.getFxRate(c, baseCcy).then(function (rate) {
        setFxRates(function (prev) {
          var n = _objectSpread({}, prev);
          n[c] = rate;
          return n;
        });
      })["catch"](function () {});
    });
  }, [symbolsKey, baseCcy]);

  // detail: profile/candles/news/metrics/ratings/target/earnings + benchmark
  useEffect(function () {
    if (!MS || !selected) return;
    var alive = true;
    setNews([]);
    setBenchCloses(null);
    MS.getProfile(selected).then(function (p) {
      if (alive) setProfiles(function (prev) {
        var n = _objectSpread({}, prev);
        n[selected] = p;
        return n;
      });
    })["catch"](function () {});
    MS.getNews(selected).then(function (nw) {
      if (alive) setNews(Array.isArray(nw) ? nw.slice(0, 5) : []);
    })["catch"](function () {
      if (alive) setNews([]);
    });
    MS.getMetrics(selected).then(function (m) {
      if (alive) setMetrics(function (prev) {
        var n = _objectSpread({}, prev);
        n[selected] = m;
        return n;
      });
    })["catch"](function () {});
    MS.getRecommendation(selected).then(function (r) {
      if (alive) setRec(function (prev) {
        var n = _objectSpread({}, prev);
        n[selected] = r;
        return n;
      });
    })["catch"](function () {});
    MS.getPriceTarget(selected).then(function (t) {
      if (alive) setPtarget(function (prev) {
        var n = _objectSpread({}, prev);
        n[selected] = t;
        return n;
      });
    })["catch"](function () {});
    MS.getEarnings(selected).then(function (e) {
      if (alive) setEarnings(function (prev) {
        var n = _objectSpread({}, prev);
        n[selected] = e;
        return n;
      });
    })["catch"](function () {});
    return function () {
      alive = false;
    };
  }, [selected]);

  // benchmark candles for the overlay
  useEffect(function () {
    if (!MS || !selected || !bench) return;
    var alive = true;
    MS.getCandles(bench, "D", Math.floor(Date.now() / 1000) - 86400 * 400, Math.floor(Date.now() / 1000)).then(function (c) {
      if (alive) setBenchCloses(invCloses(c));
    })["catch"](function () {
      if (alive) setBenchCloses(null);
    });
    return function () {
      alive = false;
    };
  }, [selected, bench]);

  // ── mutations ──
  function addToWatchlist(sym) {
    sym = (sym || "").trim().toUpperCase();
    if (!sym) return;
    if (watchlist.some(function (w) {
      return w.symbol === sym;
    })) {
      toast(sym + " already in watchlist");
      return;
    }
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      watchlist: watchlist.concat([{
        symbol: sym
      }])
    }));
    setAddSym("");
    setSearchRes([]);
    setSelected(sym);
    toast(sym + " added", "success");
  }
  function removeFromWatchlist(sym) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      watchlist: watchlist.filter(function (w) {
        return w.symbol !== sym;
      })
    }));
    if (selected === sym) setSelected(null);
  }
  function runSearch(q) {
    setAddSym(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!MS || !q || q.trim().length < 1) {
      setSearchRes([]);
      return;
    }
    searchTimerRef.current = setTimeout(function () {
      setSearching(true);
      MS.searchSymbols(q.trim()).then(function (r) {
        setSearchRes((r || []).slice(0, 6));
      })["catch"](function () {
        setSearchRes([]);
      }).then(function () {
        setSearching(false);
      });
    }, 300);
  }
  function addLot() {
    var sym = (lotForm.symbol || "").trim().toUpperCase();
    var sh = Number(lotForm.shares),
      cost = Number(lotForm.cost);
    if (!sym) {
      toast("Enter a ticker");
      return;
    }
    if (isNaN(sh) || sh <= 0) {
      toast("Enter share count");
      return;
    }
    if (isNaN(cost) || cost < 0) {
      toast("Enter cost/share");
      return;
    }
    var lot = {
      id: "l" + Date.now(),
      symbol: sym,
      shares: sh,
      cost: cost,
      ccy: lotForm.ccy || "USD",
      date: lotForm.date || todayStr()
    };
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      holdings: holdings.concat([lot])
    }));
    setLotForm({
      symbol: "",
      shares: "",
      cost: "",
      ccy: lotForm.ccy || "USD",
      date: ""
    });
    if (!quotes[sym]) setSelected(sym);
    toast(sym + " lot added", "success");
  }
  function removeLot(id) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      holdings: holdings.filter(function (l) {
        return l.id !== id;
      })
    }));
  }
  function recordSale(symbol) {
    var sh = Number(sellForm.shares),
      px = Number(sellForm.price);
    if (isNaN(sh) || sh <= 0) {
      toast("Enter shares sold");
      return;
    }
    if (isNaN(px) || px < 0) {
      toast("Enter sale price");
      return;
    }
    var pos = positions.filter(function (p) {
      return p.symbol === symbol;
    })[0];
    var sale = {
      id: "s" + Date.now(),
      symbol: symbol,
      shares: sh,
      price: px,
      ccy: pos && pos.ccy || "USD",
      date: todayStr(),
      costBasis: pos ? pos.avgCost : 0
    };
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      sales: sales.concat([sale])
    }));
    setSellFor(null);
    setSellForm({
      shares: "",
      price: ""
    });
    toast("Sale recorded", "success");
  }
  function setBase(c) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      baseCurrency: c
    }));
  }
  function saveNote(sym, text) {
    var n = _objectSpread({}, notes);
    if (text && text.trim()) n[sym] = text.trim();else delete n[sym];
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      notes: n
    }));
    setNoteDraft(null);
    toast("Thesis saved", "success");
  }
  function setManual(sym, val) {
    var m = _objectSpread({}, manualPx);
    var n = Number(val);
    if (n > 0) m[sym] = n;else delete m[sym];
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      manualPx: m
    }));
    toast(n > 0 ? "Manual price set" : "Manual price cleared", "success");
  }

  // ── keys ──
  function saveKeys() {
    var f = (finnKey || "").trim(),
      t = (tdKey || "").trim();
    if (f) {
      if (MS && MS.setKey) MS.setKey(f);else {
        try {
          localStorage.setItem("__finnhub_key__", f);
        } catch (_) {}
      }
    }
    if (t) {
      if (MS && MS.setTdKey) MS.setTdKey(t);else {
        try {
          localStorage.setItem("__twelvedata_key__", t);
        } catch (_) {}
      }
    }
    setDemo(MS ? MS.isDemo() : false);
    setShowKey(false);
    setFinnKey("");
    setTdKey("");
    if (MS && MS.clearCache) MS.clearCache();
    setCandleMap({});
    setQuotes({});
    toast("Keys saved · loading live data", "success");
    setTimeout(loadQuotes, 80);
  }
  function clearKeys() {
    if (MS) {
      if (MS.setKey) MS.setKey("");
      if (MS.setTdKey) MS.setTdKey("");
      if (MS.clearCache) MS.clearCache();
    }
    setDemo(true);
    setCandleMap({});
    setQuotes({});
    toast("Reverted to demo mode");
    setTimeout(loadQuotes, 80);
  }

  // ── AI (reuses the app's Gemini key) ──
  function askGemini(title, prompt) {
    var gkey = "";
    try {
      gkey = (localStorage.getItem("__gemini_key__") || "").trim();
    } catch (_) {}
    if (!gkey) {
      setAi({
        loading: false,
        text: "",
        err: "No Gemini API key set. Add it in Logs → Settings to enable AI.",
        title: title
      });
      return;
    }
    setAi({
      loading: true,
      text: "",
      err: "",
      title: title
    });
    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(gkey), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    }).then(function (r) {
      if (!r.ok) throw new Error("Gemini " + r.status);
      return r.json();
    }).then(function (j) {
      var t = (((j.candidates || [])[0] || {}).content || {}).parts || [];
      var out = t.map(function (p) {
        return p.text || "";
      }).join("").trim();
      setAi({
        loading: false,
        text: out || "(no response)",
        err: "",
        title: title
      });
    })["catch"](function (e) {
      setAi({
        loading: false,
        text: "",
        err: "AI error: " + (e.message || e),
        title: title
      });
    });
  }
  function aiPortfolioReview() {
    if (!openPositions.length) {
      toast("Add holdings first");
      return;
    }
    var rows = openPositions.map(function (p) {
      var q = quotes[p.symbol];
      var px = invQPrice(q);
      var val = px !== null ? px * p.netShares * fx(p.ccy) : 0;
      var w = portValue > 0 ? val / portValue * 100 : 0;
      var prof = profiles[p.symbol] || {};
      return "- " + p.symbol + " (" + (prof.industry || "?") + "): " + w.toFixed(1) + "% of portfolio, " + (px !== null ? invPct((px - p.avgCost) / p.avgCost * 100) : "?") + " unrealized";
    }).join("\n");
    var prompt = "You are a level-headed portfolio reviewer for a personal dashboard. Base currency " + baseCcy + ". Portfolio value " + invMoney(portValue, baseCcy) + ", unrealized " + invPct(unrealizedPct) + ". Holdings:\n" + rows + "\n\nIn 4-6 short bullets: assess concentration and sector/diversification risk, flag the biggest risks, and note 1-2 things to watch. Plain English. End with: 'Not financial advice.'";
    askGemini("Portfolio health-check", prompt);
  }
  function aiThesisCheck() {
    if (!selected) return;
    var q = quotes[selected] || {};
    var m = metrics[selected] || {};
    var note = notes[selected] || "";
    var heads = (news || []).slice(0, 4).map(function (x) {
      return "- " + (x.headline || "");
    }).join("\n");
    var prompt = "You are a skeptical devil's-advocate analyst. The user's investment thesis for " + selected + " is:\n\"" + (note || "(none written)") + "\"\n\nCurrent: price " + invFmt(invQPrice(q)) + " (" + invPct(invQPct(q)) + " today), P/E " + (m.peTTM != null ? m.peTTM : "?") + ", rev growth " + (m.revenueGrowth != null ? m.revenueGrowth + "%" : "?") + ".\nRecent headlines:\n" + heads + "\n\nIn 4-6 bullets: does the thesis still hold? What would challenge it? What's the strongest bear case? Plain English. End with: 'Not financial advice.'";
    askGemini("Thesis check · " + selected, prompt);
  }
  function aiDailyDigest() {
    var movers = allSymbols.map(function (s) {
      var q = quotes[s];
      var pct = invQPct(q);
      return pct === null ? null : {
        s: s,
        pct: pct
      };
    }).filter(Boolean).sort(function (a, b) {
      return Math.abs(b.pct) - Math.abs(a.pct);
    }).slice(0, 6);
    if (!movers.length) {
      toast("No data yet");
      return;
    }
    var body = movers.map(function (m) {
      return "- " + m.s + ": " + invPct(m.pct) + " today";
    }).join("\n");
    var earn = allSymbols.map(function (s) {
      var e = earnings[s];
      return e && e.next ? "- " + s + " earnings " + e.next.date : null;
    }).filter(Boolean).join("\n");
    var prompt = "You are a calm morning-briefing writer for a personal investing dashboard. Summarize today's watchlist & holdings in 3-5 short bullets: what moved and any notable context. Keep it low-anxiety, factual.\n\nMovers:\n" + body + (earn ? "\n\nUpcoming earnings:\n" + earn : "") + "\n\nEnd with: 'Not financial advice.'";
    askGemini("Daily digest", prompt);
  }

  // ── derived views ──
  var selCloses = candleMap[selected] || [];
  var rangedSel = range && selCloses.length > range ? selCloses.slice(-range) : selCloses;
  var rangedBench = benchCloses && range && benchCloses.length > range ? benchCloses.slice(-range) : benchCloses;
  var selQuote = selected ? quotes[selected] : null;
  var selProf = selected ? profiles[selected] : null;
  var selM = selected ? metrics[selected] : null;

  // portfolio value series for hero sparkline
  function portfolioSeries(nPts) {
    var lens = openPositions.map(function (p) {
      return (candleMap[p.symbol] || []).length;
    }).filter(function (l) {
      return l > 1;
    });
    if (!lens.length) return [];
    var n = Math.min.apply(null, lens);
    if (nPts) n = Math.min(n, nPts);
    var out = [];
    for (var i = 0; i < n; i++) {
      var sum = 0,
        any = false;
      openPositions.forEach(function (p) {
        var a = candleMap[p.symbol] || [];
        if (a.length < 2) return;
        var v = a[a.length - n + i];
        if (v == null || isNaN(v)) return;
        sum += v * p.netShares * fx(p.ccy);
        any = true;
      });
      if (any) out.push(sum);
    }
    return out;
  }
  var heroSeries = portfolioSeries(range || 90);
  var heroDeltaPct = heroSeries.length > 1 ? (heroSeries[heroSeries.length - 1] / heroSeries[0] - 1) * 100 : null;

  // allocation slices
  function allocSlices() {
    var agg = {};
    openPositions.forEach(function (p) {
      var px = effPx(p.symbol);
      if (px === null) return;
      var val = px * p.netShares * fx(p.ccy);
      var key = allocMode === "sector" ? profiles[p.symbol] && profiles[p.symbol].industry || "Other" : p.symbol;
      agg[key] = (agg[key] || 0) + val;
    });
    var PAL = ["#5b8cff", "#69f0ae", "#ffd166", "#ff9a3c", "#c58cff", "#4dd0e1", "#ff6b6b", "#9ccc65", "#f06292", "#7986cb"];
    return Object.keys(agg).map(function (k, i) {
      return {
        label: k,
        value: agg[k],
        color: PAL[i % PAL.length]
      };
    }).sort(function (a, b) {
      return b.value - a.value;
    });
  }
  var slices = allocSlices();
  var sliceTotal = slices.reduce(function (a, s) {
    return a + s.value;
  }, 0);
  var RANGES = [["1M", 22], ["3M", 66], ["6M", 132], ["1Y", 252], ["ALL", 0]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontVariantNumeric: "tabular-nums",
      fontFeatureSettings: '"tnum"'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: T.text,
      margin: 0,
      letterSpacing: "-0.02em"
    }
  }, "Invest"), /*#__PURE__*/React.createElement("span", {
    title: demo ? "No keys · demo data" : keyIssue ? keyIssue : "Live data",
    style: {
      fontSize: 9.5,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      padding: "3px 8px",
      borderRadius: 999,
      border: "0.5px solid " + (demo ? "rgba(255,209,102,0.4)" : keyIssue ? "rgba(255,107,107,0.4)" : "rgba(105,240,174,0.4)"),
      background: demo ? "rgba(255,209,102,0.12)" : keyIssue ? "rgba(255,107,107,0.12)" : "rgba(105,240,174,0.12)",
      color: demo ? T.warn : keyIssue ? T.danger : T.success
    }
  }, demo ? "Demo data" : keyIssue ? "Key rejected" : "Live · delayed")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: segWrap
  }, /*#__PURE__*/React.createElement("button", {
    style: segBtn(baseCcy === "AUD"),
    onClick: function onClick() {
      setBase("AUD");
    }
  }, "AUD"), /*#__PURE__*/React.createElement("button", {
    style: segBtn(baseCcy === "USD"),
    onClick: function onClick() {
      setBase("USD");
    }
  }, "USD")), /*#__PURE__*/React.createElement("button", {
    style: iGhost,
    onClick: loadQuotes,
    disabled: loading
  }, loading ? "…" : "↻"), /*#__PURE__*/React.createElement("button", {
    style: iGhost,
    onClick: function onClick() {
      setShowKey(!showKey);
    }
  }, demo ? "Add keys" : "Keys"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 14,
      lineHeight: 1.5
    }
  }, "Personal decision-support, not financial advice. Prices delayed 15+ min.", refreshedAt && " · Updated " + refreshedAt.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit"
  })), showKey && /*#__PURE__*/React.createElement("div", {
    style: iCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: T.text,
      marginBottom: 8
    }
  }, "API keys (stored only in this browser)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 6
    }
  }, "Finnhub \xB7 quotes, fundamentals, ratings, news (finnhub.io, free 60/min)"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      marginBottom: 10
    }),
    type: "password",
    placeholder: "Finnhub key\u2026",
    value: finnKey,
    onChange: function onChange(e) {
      setFinnKey(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 6
    }
  }, "Twelve Data \xB7 price charts & benchmarks (twelvedata.com, free 800/day). Finnhub's chart endpoint is premium, so charts use this."), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      marginBottom: 10
    }),
    type: "password",
    placeholder: "Twelve Data key\u2026",
    value: tdKey,
    onChange: function onChange(e) {
      setTdKey(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") saveKeys();
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: iBtn,
    onClick: saveKeys
  }, "Save"), !demo && /*#__PURE__*/React.createElement("button", {
    style: iGhost,
    onClick: clearKeys
  }, "Use demo"))), /*#__PURE__*/React.createElement("div", {
    style: iCard({
      paddingBottom: heroSeries.length > 1 ? 8 : 18
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: iStatLabel
  }, "Portfolio value \xB7 ", baseCcy), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 30 : 38,
      fontWeight: 700,
      color: T.text,
      letterSpacing: "-0.03em",
      lineHeight: 1.05,
      transition: "color .3s"
    }
  }, invMoney(portValue, baseCcy)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      padding: "3px 9px",
      borderRadius: 999,
      background: todayChange >= 0 ? "rgba(105,240,174,0.14)" : "rgba(255,107,107,0.14)",
      color: todayChange >= 0 ? T.success : T.danger
    }
  }, todayChange >= 0 ? "▲" : "▼", " ", invMoney(Math.abs(todayChange), baseCcy), " (", invPct(todayPct), ") today"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      padding: "3px 9px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.05)",
      color: unrealized >= 0 ? T.success : T.danger
    }
  }, unrealized >= 0 ? "+" : "", invMoney(unrealized, baseCcy), " (", invPct(unrealizedPct), ") unreal."), realized !== 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      padding: "3px 9px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.05)",
      color: realized >= 0 ? T.success : T.danger
    }
  }, realized >= 0 ? "+" : "", invMoney(realized, baseCcy), " realized"))), /*#__PURE__*/React.createElement("div", {
    style: segWrap
  }, RANGES.map(function (r) {
    return /*#__PURE__*/React.createElement("button", {
      key: r[0],
      style: segBtn(range === r[1]),
      onClick: function onClick() {
        setRange(r[1]);
      }
    }, r[0]);
  }))), heroSeries.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      marginLeft: -4,
      marginRight: -4
    }
  }, /*#__PURE__*/React.createElement(InvChart, {
    closes: heroSeries,
    h: mob ? 70 : 96,
    accent: heroDeltaPct >= 0 ? "#69f0ae" : "#ff6b6b"
  })), !heroSeries.length && openPositions.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 8
    }
  }, keyIssue ? "Twelve Data key rejected · check Settings." : "Add a Twelve Data key for a live portfolio trend chart.")), openPositions.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: iCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#cdd5e2"
    }
  }, "Allocation"), /*#__PURE__*/React.createElement("div", {
    style: segWrap
  }, /*#__PURE__*/React.createElement("button", {
    style: segBtn(allocMode === "position"),
    onClick: function onClick() {
      setAllocMode("position");
    }
  }, "Position"), /*#__PURE__*/React.createElement("button", {
    style: segBtn(allocMode === "sector"),
    onClick: function onClick() {
      setAllocMode("sector");
    }
  }, "Sector"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 20,
      alignItems: "center",
      flexWrap: mob ? "wrap" : "nowrap"
    }
  }, /*#__PURE__*/React.createElement(InvDonut, {
    slices: slices,
    size: mob ? 130 : 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 180
    }
  }, slices.slice(0, 8).map(function (s, i) {
    var pctv = sliceTotal > 0 ? s.value / sliceTotal * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 2,
        background: s.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: T.text,
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, s.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: T.text2,
        fontWeight: 600
      }
    }, pctv.toFixed(1), "%"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: T.text3,
        minWidth: 64,
        textAlign: "right"
      }
    }, invCompact(s.value, baseCcy)));
  })))), /*#__PURE__*/React.createElement("div", {
    style: iCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#cdd5e2"
    }
  }, "Holdings"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3
    }
  }, openPositions.length, " open", priced < openPositions.length ? " · " + (openPositions.length - priced) + " unpriced" : "")), openPositions.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      padding: "4px 2px 10px"
    }
  }, "No holdings yet. Add a lot below, entering each buy separately to track cost basis."), openPositions.map(function (p) {
    var q = quotes[p.symbol];
    var px = effPx(p.symbol);
    var r = fx(p.ccy);
    var man = isManual(p.symbol);
    var val = px !== null ? px * p.netShares * r : null;
    var g = px !== null ? (px - p.avgCost) * p.netShares * r : null;
    var gp = p.avgCost > 0 && px !== null ? (px - p.avgCost) / p.avgCost * 100 : null;
    var open = expanded === p.symbol;
    var spark = candleMap[p.symbol] || [];
    return /*#__PURE__*/React.createElement("div", {
      key: p.symbol,
      style: {
        borderRadius: 12,
        marginBottom: 8,
        background: selected === p.symbol ? "rgba(91,140,255,0.08)" : "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.07)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "glow-item",
      onClick: function onClick() {
        setSelected(p.symbol);
        setExpanded(open ? null : p.symbol);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 12px",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 64
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: T.text
      }
    }, p.symbol), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3
      }
    }, invFmt(p.netShares, p.netShares % 1 ? 4 : 0), " @ ", invMoney(p.avgCost, p.ccy === "USD" ? "USD" : p.ccy), " ", p.ccy)), !mob && /*#__PURE__*/React.createElement(InvSpark, {
      closes: spark.slice(-40)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: val !== null ? T.text : T.text3
      }
    }, val !== null ? invMoney(val, baseCcy) : "unpriced", man && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: 600,
        color: T.text3,
        marginLeft: 5
      }
    }, "\xB7 manual")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: g === null ? T.text3 : g >= 0 ? T.success : T.danger
      }
    }, g === null ? loading ? "…" : "tap to set price" : (g >= 0 ? "▲ " : "▼ ") + invMoney(Math.abs(g), baseCcy) + " " + (gp !== null ? invPct(gp) : ""))), /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.text3,
        fontSize: 12,
        transform: open ? "rotate(90deg)" : "none",
        transition: "transform .2s"
      }
    }, "\u203A")), open && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 12px 12px",
        borderTop: "0.5px solid rgba(255,255,255,0.06)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        margin: "10px 0 6px",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }
    }, "Lots"), p.lots.map(function (l) {
      return /*#__PURE__*/React.createElement("div", {
        key: l.id,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          color: T.text2,
          padding: "4px 0"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, invFmt(l.shares, l.shares % 1 ? 4 : 0), " @ ", invMoney(l.cost, l.ccy), " ", l.ccy, " \xB7 ", l.date), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          e.stopPropagation();
          removeLot(l.id);
        },
        style: {
          background: "none",
          border: "none",
          color: T.text3,
          cursor: "pointer",
          fontSize: 14
        }
      }, "\xD7"));
    }), p.sold > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 4
      }
    }, invFmt(p.sold, 0), " shares sold (realized tracked above)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        margin: "12px 0 6px",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }
    }, "Manual price ", man ? "(in use)" : invValidPx(quotes[p.symbol]) !== null ? "(override)" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, iInp), {}, {
        flex: "0 1 120px"
      }),
      type: "number",
      step: "any",
      placeholder: "Price (" + p.ccy + ")",
      value: mDraft[p.symbol] !== undefined ? mDraft[p.symbol] : manualPx[p.symbol] || "",
      onChange: function onChange(e) {
        var d = _objectSpread({}, mDraft);
        d[p.symbol] = e.target.value;
        setMDraft(d);
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Enter") setManual(p.symbol, e.target.value);
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: iGhost,
      onClick: function onClick() {
        setManual(p.symbol, mDraft[p.symbol] !== undefined ? mDraft[p.symbol] : manualPx[p.symbol] || "");
      }
    }, "Set"), Number(manualPx[p.symbol]) > 0 && /*#__PURE__*/React.createElement("button", {
      style: iGhost,
      onClick: function onClick() {
        var d = _objectSpread({}, mDraft);
        d[p.symbol] = "";
        setMDraft(d);
        setManual(p.symbol, "");
      }
    }, "Clear")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 5
      }
    }, "For ASX / unlisted / crypto the free APIs can't fetch. Flows into value, P&L & allocation."), sellFor === p.symbol ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginTop: 8,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, iInp), {}, {
        flex: "1 1 80px"
      }),
      type: "number",
      step: "any",
      placeholder: "Shares",
      value: sellForm.shares,
      onChange: function onChange(e) {
        setSellForm(_objectSpread(_objectSpread({}, sellForm), {}, {
          shares: e.target.value
        }));
      }
    }), /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, iInp), {}, {
        flex: "1 1 90px"
      }),
      type: "number",
      step: "any",
      placeholder: "Price (" + p.ccy + ")",
      value: sellForm.price,
      onChange: function onChange(e) {
        setSellForm(_objectSpread(_objectSpread({}, sellForm), {}, {
          price: e.target.value
        }));
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: iBtn,
      onClick: function onClick() {
        recordSale(p.symbol);
      }
    }, "Record sale"), /*#__PURE__*/React.createElement("button", {
      style: iGhost,
      onClick: function onClick() {
        setSellFor(null);
      }
    }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, iGhost), {}, {
        marginTop: 8
      }),
      onClick: function onClick() {
        setSellFor(p.symbol);
        setSellForm({
          shares: "",
          price: invFmt(px, 2)
        });
      }
    }, "Record a sale")));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginTop: openPositions.length ? 12 : 4,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      flex: mob ? "1 1 100%" : "1 1 80px",
      textTransform: "uppercase"
    }),
    placeholder: "Ticker",
    value: lotForm.symbol,
    onChange: function onChange(e) {
      setLotForm(_objectSpread(_objectSpread({}, lotForm), {}, {
        symbol: e.target.value
      }));
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      flex: "1 1 70px"
    }),
    type: "number",
    step: "any",
    placeholder: "Shares",
    value: lotForm.shares,
    onChange: function onChange(e) {
      setLotForm(_objectSpread(_objectSpread({}, lotForm), {}, {
        shares: e.target.value
      }));
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      flex: "1 1 80px"
    }),
    type: "number",
    step: "any",
    placeholder: "Cost/sh",
    value: lotForm.cost,
    onChange: function onChange(e) {
      setLotForm(_objectSpread(_objectSpread({}, lotForm), {}, {
        cost: e.target.value
      }));
    }
  }), /*#__PURE__*/React.createElement("select", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      flex: "1 1 70px"
    }),
    value: lotForm.ccy,
    onChange: function onChange(e) {
      setLotForm(_objectSpread(_objectSpread({}, lotForm), {}, {
        ccy: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", null, "USD"), /*#__PURE__*/React.createElement("option", null, "AUD"), /*#__PURE__*/React.createElement("option", null, "EUR"), /*#__PURE__*/React.createElement("option", null, "GBP")), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      flex: "1 1 110px"
    }),
    type: "date",
    value: lotForm.date,
    onChange: function onChange(e) {
      setLotForm(_objectSpread(_objectSpread({}, lotForm), {}, {
        date: e.target.value
      }));
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: iBtn,
    onClick: addLot
  }, "Add lot")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 8
    }
  }, "Non-US? Add the exchange suffix, e.g. ", /*#__PURE__*/React.createElement("b", null, "CBA.AX"), " for ASX (also .L London, .TO Toronto, .HK Hong Kong). Needs a Twelve Data key.")), /*#__PURE__*/React.createElement("div", {
    style: iCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#cdd5e2",
      marginBottom: 12
    }
  }, "Watchlist"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: watchlist.length ? 14 : 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      flex: 1,
      textTransform: "uppercase"
    }),
    placeholder: "Add ticker or search\u2026",
    value: addSym,
    onChange: function onChange(e) {
      runSearch(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") {
        addToWatchlist(addSym);
      }
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: iBtn,
    onClick: function onClick() {
      addToWatchlist(addSym);
    }
  }, "Add")), searchRes.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      zIndex: 20,
      marginTop: 4,
      background: "rgba(18,22,42,0.98)",
      border: "0.5px solid rgba(255,255,255,0.14)",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: cardShadow
    }
  }, searchRes.map(function (rr) {
    return /*#__PURE__*/React.createElement("div", {
      key: rr.symbol,
      onClick: function onClick() {
        addToWatchlist(rr.symbol);
      },
      style: {
        padding: "9px 12px",
        cursor: "pointer",
        display: "flex",
        gap: 8
      },
      onMouseOver: function onMouseOver(e) {
        e.currentTarget.style.background = "rgba(91,140,255,0.10)";
      },
      onMouseOut: function onMouseOut(e) {
        e.currentTarget.style.background = "transparent";
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: T.text,
        minWidth: 54
      }
    }, rr.symbol), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: T.text3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, rr.description || ""));
  })), searching && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 4
    }
  }, "Searching\u2026")), watchlist.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      padding: "6px 2px"
    }
  }, "No tickers yet. Add one above to start tracking."), watchlist.map(function (w) {
    var q = quotes[w.symbol];
    var px = invQPrice(q);
    var pct = invQPct(q);
    var spark = candleMap[w.symbol] || [];
    return /*#__PURE__*/React.createElement("div", {
      key: w.symbol,
      onClick: function onClick() {
        setSelected(w.symbol);
      },
      className: "glow-item",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 12px",
        borderRadius: 12,
        marginBottom: 7,
        cursor: "pointer",
        background: selected === w.symbol ? "rgba(91,140,255,0.10)" : "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.07)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 58
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: T.text
      }
    }, w.symbol), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        maxWidth: mob ? 90 : 150,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, profiles[w.symbol] && profiles[w.symbol].name || "")), !mob && /*#__PURE__*/React.createElement(InvSpark, {
      closes: spark.slice(-40)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: T.text
      }
    }, px !== null ? "$" + invFmt(px) : loading ? "…" : "—"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: pct === null ? T.text3 : pct >= 0 ? T.success : T.danger
      }
    }, pct !== null ? (pct >= 0 ? "▲ " : "▼ ") + invPct(pct).replace("+", "") : "—")), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        removeFromWatchlist(w.symbol);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 16,
        padding: "0 4px"
      }
    }, "\xD7"));
  })), selected && /*#__PURE__*/React.createElement("div", {
    style: iCard()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: T.text
    }
  }, selected), selProf && selProf.name && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: T.text3
    }
  }, selProf.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: T.text,
      letterSpacing: "-0.02em"
    }
  }, invQPrice(selQuote) !== null ? "$" + invFmt(invQPrice(selQuote)) : "—"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: invQPct(selQuote) === null ? T.text3 : invQPct(selQuote) >= 0 ? T.success : T.danger
    }
  }, invQChg(selQuote) !== null ? (invQChg(selQuote) >= 0 ? "+" : "") + invFmt(invQChg(selQuote)) : "", " ", invPct(invQPct(selQuote))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, iGhost), {}, {
      display: "flex",
      alignItems: "center",
      gap: 5
    }),
    onClick: aiThesisCheck,
    disabled: ai.loading
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "sparkle",
    size: 12
  }), "Thesis check"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, iBtn), {}, {
      display: "flex",
      alignItems: "center",
      gap: 6
    }),
    onClick: function onClick() {
      askGemini("Explain · " + selected, "Explain " + selected + " (" + (selProf && selProf.name || selected) + ") to a long-term retail investor in 4-6 short bullets: what it does, what the price move & headlines suggest, and what to watch. End with 'Not financial advice.'");
    },
    disabled: ai.loading
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: ai.loading ? "clock" : "sparkle",
    size: 13
  }), ai.loading ? "…" : "Explain"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: segWrap
  }, RANGES.map(function (r) {
    return /*#__PURE__*/React.createElement("button", {
      key: r[0],
      style: segBtn(range === r[1]),
      onClick: function onClick() {
        setRange(r[1]);
      }
    }, r[0]);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: T.text3
    }
  }, "vs"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      width: 78,
      padding: "5px 8px",
      textTransform: "uppercase"
    }),
    value: bench,
    onChange: function onChange(e) {
      setBench(e.target.value.toUpperCase());
    }
  })), rangedSel.length > 1 ? /*#__PURE__*/React.createElement(InvChart, {
    series: [{
      closes: rangedSel,
      color: "#5b8cff",
      name: selected,
      label: "primary"
    }, {
      closes: rangedBench && rangedBench.length > 1 ? rangedBench : null,
      color: "#8f97a6",
      name: bench,
      label: "benchmark"
    }].filter(function (s) {
      return s.closes;
    }),
    h: mob ? 160 : 210,
    mob: mob
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      height: mob ? 160 : 210,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: T.text3,
      fontSize: 12,
      textAlign: "center"
    }
  }, "No chart data. ", demo ? "" : keyIssue ? "Twelve Data key rejected · check Settings." : "Add a Twelve Data key for live charts."), selM && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#cdd5e2",
      marginBottom: 8
    }
  }, "Valuation"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "1fr 1fr 1fr" : "repeat(4,1fr)",
      gap: 10
    }
  }, [["P/E", selM.peTTM], ["P/S", selM.ps], ["Net margin", selM.netMargin != null ? selM.netMargin + "%" : null], ["ROE", selM.roe != null ? selM.roe + "%" : null], ["Beta", selM.beta], ["Rev growth", selM.revenueGrowth != null ? selM.revenueGrowth + "%" : null], ["Div yield", selM.dividendYield != null ? selM.dividendYield + "%" : null], ["EPS", selM.eps]].map(function (kv, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: iStatLabel
    }, kv[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: T.text
      }
    }, kv[1] == null || kv[1] === "" ? "—" : typeof kv[1] === "number" ? invFmt(kv[1]) : kv[1]));
  })), selM.week52Low != null && selM.week52High != null && invQPrice(selQuote) !== null && function () {
    var lo = selM.week52Low,
      hi = selM.week52High,
      cur = invQPrice(selQuote);
    var pos = Math.max(0, Math.min(100, (cur - lo) / (hi - lo || 1) * 100));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        color: T.text3,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", null, "52wk low $", invFmt(lo)), /*#__PURE__*/React.createElement("span", null, "52wk high $", invFmt(hi))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        height: 6,
        borderRadius: 3,
        background: "rgba(255,255,255,0.08)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: pos + "%",
        top: -3,
        width: 3,
        height: 12,
        borderRadius: 2,
        background: T.accent,
        transform: "translateX(-50%)"
      }
    })));
  }()), (rec[selected] || ptarget[selected]) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
      gap: 16
    }
  }, rec[selected] && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#cdd5e2",
      marginBottom: 8
    }
  }, "Analyst ratings"), /*#__PURE__*/React.createElement(InvRatingBar, {
    rec: rec[selected]
  })), ptarget[selected] && ptarget[selected].targetMean != null && function () {
    var t = ptarget[selected];
    var cur = invQPrice(selQuote);
    var up = cur !== null && t.targetMean ? (t.targetMean - cur) / cur * 100 : null;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: "#cdd5e2",
        marginBottom: 8
      }
    }, "Price target"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 700,
        color: T.text
      }
    }, "$", invFmt(t.targetMean), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: up == null ? T.text3 : up >= 0 ? T.success : T.danger
      }
    }, up != null ? "(" + invPct(up) + ")" : "")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 2
      }
    }, "Range $", invFmt(t.targetLow), " to $", invFmt(t.targetHigh)));
  }()), earnings[selected] && (earnings[selected].next || earnings[selected].recent && earnings[selected].recent.length) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#cdd5e2",
      marginBottom: 8
    }
  }, "Earnings", earnings[selected].next ? " · next " + earnings[selected].next.date : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, (earnings[selected].recent || []).map(function (e, i) {
    var beat = e.surprisePercent != null && e.surprisePercent >= 0;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        fontSize: 10,
        padding: "4px 8px",
        borderRadius: 8,
        background: e.surprisePercent == null ? "rgba(255,255,255,0.05)" : beat ? "rgba(105,240,174,0.12)" : "rgba(255,107,107,0.12)",
        color: e.surprisePercent == null ? T.text3 : beat ? T.success : T.danger
      }
    }, e.period || "Q", " ", e.surprisePercent != null ? (e.surprisePercent >= 0 ? "+" : "") + e.surprisePercent + "%" : "");
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#cdd5e2",
      marginBottom: 8
    }
  }, "My thesis"), noteDraft !== null ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    style: _objectSpread(_objectSpread({}, iInp), {}, {
      minHeight: 60,
      resize: "vertical",
      fontFamily: "inherit"
    }),
    value: noteDraft,
    onChange: function onChange(e) {
      setNoteDraft(e.target.value);
    },
    placeholder: "Why do you own / watch this? What would change your mind?"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: iBtn,
    onClick: function onClick() {
      saveNote(selected, noteDraft);
    }
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    style: iGhost,
    onClick: function onClick() {
      setNoteDraft(null);
    }
  }, "Cancel"))) : /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      setNoteDraft(notes[selected] || "");
    },
    style: {
      fontSize: 12,
      color: notes[selected] ? T.text2 : T.text3,
      lineHeight: 1.5,
      cursor: "pointer",
      padding: "8px 10px",
      borderRadius: 8,
      background: "rgba(255,255,255,0.03)",
      border: "0.5px dashed rgba(255,255,255,0.12)"
    }
  }, notes[selected] || "Add your investment thesis…")), (ai.text || ai.err) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "14px 16px",
      borderRadius: 14,
      background: "rgba(91,140,255,0.06)",
      border: "0.5px solid rgba(91,140,255,0.20)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: T.accent,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "sparkle",
    size: 12
  }), ai.title || "AI"), ai.err ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.warn
    }
  }, ai.err) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: T.text2,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap"
    }
  }, ai.text)), news.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#cdd5e2",
      marginBottom: 8
    }
  }, "Recent news"), news.map(function (a, i) {
    return /*#__PURE__*/React.createElement("a", {
      key: i,
      href: a.url || "#",
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: "block",
        padding: "9px 0",
        borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none",
        textDecoration: "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text,
        lineHeight: 1.4
      }
    }, a.headline || "(untitled)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 2
      }
    }, a.source || ""));
  }))), /*#__PURE__*/React.createElement("div", {
    style: iCard({
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      alignItems: "center"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#cdd5e2",
      marginRight: 4
    }
  }, "AI"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, iGhost), {}, {
      display: "flex",
      alignItems: "center",
      gap: 5
    }),
    onClick: aiPortfolioReview,
    disabled: ai.loading
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "sparkle",
    size: 12
  }), "Portfolio health-check"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, iGhost), {}, {
      display: "flex",
      alignItems: "center",
      gap: 5
    }),
    onClick: aiDailyDigest,
    disabled: ai.loading
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "sparkle",
    size: 12
  }), "Daily digest"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: T.text3
    }
  }, "Uses your Gemini key \xB7 grounded in your data")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      textAlign: "center",
      padding: "6px 0 20px",
      lineHeight: 1.5
    }
  }, "Data ", demo ? "is simulated (demo mode)" : "via Finnhub + Twelve Data, delayed ≥15 min", ". Realized P&L uses average-cost basis. Personal, informational use only, not investment advice."));
}
function WorkSection(_ref3) {
  var data = _ref3.data,
    mob = _ref3.mob,
    onUpdate = _ref3.onUpdate,
    onFlush = _ref3.onFlush,
    gcalEvents = _ref3.gcalEvents;
  mob = mob || false;
  var _useState123 = useState(null),
    _useState124 = _slicedToArray(_useState123, 2),
    expandedShift = _useState124[0],
    setExpandedShift = _useState124[1];
  var _useState125 = useState({
      notes: ""
    }),
    _useState126 = _slicedToArray(_useState125, 2),
    logDraft = _useState126[0],
    setLogDraft = _useState126[1];
  // Live refs so the draft-autosave (which fires on close/unmount) reads current
  // values instead of stale closure values captured when the shift was opened.
  var _draftRef = useRef(logDraft);
  _draftRef.current = logDraft;
  var _useState127 = useState(""),
    _useState128 = _slicedToArray(_useState127, 2),
    goalInput = _useState128[0],
    setGoalInput = _useState128[1];
  var _useState129 = useState(false),
    _useState130 = _slicedToArray(_useState129, 2),
    showSettings = _useState130[0],
    setShowSettings = _useState130[1];
  var _useState131 = useState(0),
    _useState132 = _slicedToArray(_useState131, 2),
    cycleOffset = _useState132[0],
    setCycleOffset = _useState132[1];
  var _useState133 = useState(""),
    _useState134 = _slicedToArray(_useState133, 2),
    taskInput = _useState134[0],
    setTaskInput = _useState134[1];
  var _useState135 = useState(null),
    _useState136 = _slicedToArray(_useState135, 2),
    taskTag = _useState136[0],
    setTaskTag = _useState136[1];
  var _useState137 = useState(todayStr()),
    _useState138 = _slicedToArray(_useState137, 2),
    taskShiftDate = _useState138[0],
    setTaskShiftDate = _useState138[1];
  useEffect(function () {
    var first = (gcalEvents || []).filter(isGoTabEvent).sort(function (a, b) {
      return b.date.localeCompare(a.date);
    })[0];
    if (first) setTaskShiftDate(first.date);
  }, []);
  // One-time migration: set the progressive cutoff to today (past shifts auto-count as worked,
  // since Jayden's never missed one) and mark this month's Friday 11–12 meetings (~1/week) attended.
  useEffect(function () {
    if (data.attendanceMigrated || !(gcalEvents && gcalEvents.length)) return;
    var today = todayStr();
    var month = today.slice(0, 7);
    var updates = _objectSpread({}, data.shiftLogs || {});
    gcalEvents.filter(isGoTabEvent).forEach(function (ev) {
      if (classifyWorkEvent(ev) !== "meeting" || !ev.date.startsWith(month) || ev.date > today) return;
      if (new Date(ev.date + "T12:00:00").getDay() !== 5) return; // Friday → ~1 meeting/week
      var k = shiftKey(ev);
      if (updates[k] && updates[k].attended != null) return;
      updates[k] = _objectSpread(_objectSpread({}, updates[k] || {}), {}, {
        attended: true,
        date: ev.date,
        time: ev.time
      });
    });
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      shiftLogs: updates,
      progressiveSince: today,
      attendanceMigrated: true
    }));
  }, [gcalEvents]);
  var wBtn = _objectSpread(_objectSpread({}, btnGlass), {}, {
    padding: "5px 12px"
  });
  var wBtnP = _objectSpread({}, btnGlassP);
  var wInp = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: T.text,
    fontSize: 12,
    boxSizing: "border-box"
  };
  function wCard(ex) {
    return _objectSpread({
      position: "relative",
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      padding: "18px 20px",
      marginBottom: 12,
      boxShadow: cardShadow
    }, ex || {});
  }
  var wGlassMini = {
    background: cardBg,
    backdropFilter: "blur(24px) saturate(1.4)",
    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    boxShadow: cardShadowSoft
  };
  var wStatLabel = {
    fontSize: 10,
    fontWeight: 600,
    color: "#8f97a6",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };
  var wST = {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 0,
    color: "#cdd5e2",
    letterSpacing: "-0.01em"
  };
  function cellEdge(hex) {
    return {
      borderBottom: "1.5px solid " + hex + "80",
      boxShadow: "inset 0 -5px 12px " + hex + "15"
    };
  }
  var TAGS = [{
    label: "Issue resolved",
    col: "#69f0ae"
  }, {
    label: "Escalated",
    col: "#ff6b6b"
  }, {
    label: "Venue call",
    col: "#5b8cff"
  }, {
    label: "Other",
    col: "#8f97a6"
  }];
  var focusGoals = data.focusGoals || [];
  var shiftLogs = data.shiftLogs || {};
  var taskLog = data.taskLog || [];
  var hrRate = Number(data.hourlyRate || 0);
  var payCycleDay = Number(data.payCycleDay || 1);
  function getPeriodRange(offset) {
    // Pay-cycle MONTH: from payCycleDay of one month through the day before the next month's payCycleDay.
    // Clamp the anchor to each month's length so cycles tile with no gap/overlap (handles payCycleDay 29–31, Feb).
    var today = new Date();
    var yr = today.getFullYear();
    var mo = today.getMonth();
    if (today.getDate() < payCycleDay) mo -= 1; // before this month's pay day → cycle began last month
    function dim(y, m) {
      return new Date(y, m + 1, 0).getDate();
    }
    function anchor(y, m) {
      return new Date(y, m, Math.min(payCycleDay, dim(y, m)));
    }
    var start = anchor(yr, mo + offset);
    var end = new Date(anchor(yr, mo + offset + 1).getTime() - 864e5); // day before next anchor
    return {
      start: dStr(start),
      end: dStr(end)
    };
  }
  var _getPeriodRange = getPeriodRange(cycleOffset),
    periodStart = _getPeriodRange.start,
    periodEnd = _getPeriodRange.end;
  var progressiveSince = data.progressiveSince || "";
  function entryFor(ev) {
    return workEntryFor(ev, shiftLogs);
  }
  function isCounted(ev) {
    return isWorkEventCounted(ev, shiftLogs, progressiveSince);
  }
  var isMeetingEv = function isMeetingEv(ev) {
    return classifyWorkEvent(ev) === "meeting";
  };
  var periodScheduled = (gcalEvents || []).filter(isGoTabEvent).filter(function (ev) {
    return classifyWorkEvent(ev) !== "ignore";
  }).filter(function (ev) {
    return ev.date >= periodStart && ev.date <= periodEnd;
  }).sort(function (a, b) {
    return a.date.localeCompare(b.date);
  });
  var periodShifts = periodScheduled; // the list still renders every scheduled event, with worked state
  // Keep live refs for the draft-autosave cleanup (runs on close/unmount with stale closures otherwise).
  var _shiftLogsRef = useRef(shiftLogs);
  _shiftLogsRef.current = shiftLogs;
  var _dataRef = useRef(data);
  _dataRef.current = data;
  var _periodShiftsRef = useRef(periodShifts);
  _periodShiftsRef.current = periodShifts;
  // Autosave the shift-diary draft when the row closes, switches, or the page unmounts —
  // so typed text is never lost if you navigate away without clicking "Save & mark worked".
  // Stored under draftNotes (NOT notes) so it does NOT mark the shift worked until you save.
  useEffect(function () {
    var key = expandedShift;
    if (!key) return undefined;
    return function persistDraftOnClose() {
      var txt = (_draftRef.current && _draftRef.current.notes || "").trim();
      if (!txt) return;
      var sl = _shiftLogsRef.current || {};
      var prev = sl[key] || {};
      // Nothing new to keep: already committed as a real note, or draft unchanged.
      if ((prev.notes || "") === txt || (prev.draftNotes || "") === txt) return;
      var ev = (_periodShiftsRef.current || []).find(function (e) {
        return shiftKey(e) === key;
      });
      onUpdate(_objectSpread(_objectSpread({}, _dataRef.current), {}, {
        shiftLogs: _objectSpread(_objectSpread({}, sl), {}, _defineProperty({}, key, _objectSpread(_objectSpread({}, prev), {}, {
          draftNotes: txt,
          date: prev.date || ev && ev.date,
          time: prev.time || ev && ev.time
        })))
      }));
    };
  }, [expandedShift]);
  var periodWorked = periodScheduled.filter(isCounted);
  var scheduledMeetingCount = periodScheduled.filter(isMeetingEv).length;
  var scheduledShiftCount = periodScheduled.length - scheduledMeetingCount;
  var attendedMeetingCount = periodWorked.filter(isMeetingEv).length;
  var workedShiftCount = periodWorked.length - attendedMeetingCount;
  var periodNorm = periodWorked.reduce(function (a, ev) {
    var p = shiftPay(ev.time);
    return a + (p ? p.normalHrs : 0);
  }, 0);
  var periodPen = periodWorked.reduce(function (a, ev) {
    var p = shiftPay(ev.time);
    return a + (p ? p.penaltyHrs : 0);
  }, 0);
  var periodEquiv = periodWorked.reduce(function (a, ev) {
    var p = shiftPay(ev.time);
    return a + (p ? p.totalEquiv : 0);
  }, 0);
  var estimatedPay = hrRate > 0 ? periodEquiv * hrRate : null;
  var projectedEquiv = periodScheduled.reduce(function (a, ev) {
    var p = shiftPay(ev.time);
    return a + (p ? p.totalEquiv : 0);
  }, 0);
  var projectedPay = hrRate > 0 ? projectedEquiv * hrRate : null;
  function estimateTax(gross) {
    var incomeTax = gross <= 18200 ? 0 : gross <= 45000 ? (gross - 18200) * 0.16 : gross <= 135000 ? 4288 + (gross - 45000) * 0.30 : gross <= 190000 ? 31288 + (gross - 135000) * 0.37 : 51638 + (gross - 190000) * 0.45;
    var levy = gross <= 27222 ? 0 : gross <= 34027 ? (gross - 27222) * 0.10 : gross * 0.02;
    return incomeTax + levy;
  }
  var periodDays = Math.max(1, Math.round((new Date(periodEnd) - new Date(periodStart)) / 864e5) + 1);
  var annualGross = estimatedPay != null ? estimatedPay / periodDays * 365 : 0;
  var periodTax = estimatedPay != null ? estimateTax(annualGross) / 365 * periodDays : null;
  var periodNet = estimatedPay != null && periodTax != null ? estimatedPay - periodTax : null;
  var periodTaskCount = taskLog.filter(function (t) {
    return t.shiftDate >= periodStart && t.shiftDate <= periodEnd;
  }).length;
  var recentShiftDates = (gcalEvents || []).filter(isGoTabEvent).filter(function (ev) {
    return classifyWorkEvent(ev) !== "ignore";
  }).sort(function (a, b) {
    return b.date.localeCompare(a.date);
  }).slice(0, 14).map(function (ev) {
    return ev.date;
  });
  function fmt$(n) {
    return n != null ? "$" + n.toFixed(2) : "—";
  }
  function fmtPeriod() {
    var s = new Date(periodStart + "T12:00:00");
    var e = new Date(periodEnd + "T12:00:00");
    return s.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short"
    }) + " · " + e.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  function openShift(ev) {
    var k = shiftKey(ev);
    if (expandedShift === k) {
      setExpandedShift(null);
      return;
    }
    setExpandedShift(k);
    var e = shiftLogs[k] || shiftLogs[ev.date] || {};
    setLogDraft({
      notes: e.notes || e.draftNotes || ""
    }); // fall back to an autosaved draft
  }

  function saveShiftLog(ev) {
    // Saving a shift diary = marking the shift WORKED. Force a journal note.
    if (!logDraft.notes || !logDraft.notes.trim()) {
      if (window.showToast) window.showToast("Add a note to mark this shift worked", "warn");
      return;
    }
    var k = ev ? shiftKey(ev) : expandedShift;
    var prev = shiftLogs[k] || (ev ? shiftLogs[ev.date] : null) || {};
    // Commit notes + attended; drop draftNotes now that it's a real saved note.
    var next = _objectSpread(_objectSpread({}, shiftLogs), {}, _defineProperty({}, k, _objectSpread(_objectSpread({}, prev), {}, {
      notes: logDraft.notes,
      date: ev ? ev.date : prev.date,
      time: ev ? ev.time : prev.time,
      attended: true,
      draftNotes: undefined
    })));
    if (ev && k !== ev.date && next[ev.date]) delete next[ev.date]; // migrate legacy date-keyed entry onto the per-shift key
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      shiftLogs: next
    }));
    if (onFlush) onFlush(); // push to the cloud now, not after the 2s debounce — survives an immediate refresh
    setExpandedShift(null);
    if (window.showToast) window.showToast("Shift marked worked", "success");
  }
  // Set worked/attended on a shift or meeting. For meetings (no journal) and for un-marking a shift.
  function setAttendance(ev, val) {
    var k = shiftKey(ev);
    var prev = shiftLogs[k] || shiftLogs[ev.date] || {};
    var next = _objectSpread(_objectSpread({}, shiftLogs), {}, _defineProperty({}, k, _objectSpread(_objectSpread({}, prev), {}, {
      date: ev.date,
      time: ev.time,
      attended: val
    })));
    if (k !== ev.date && next[ev.date]) delete next[ev.date];
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      shiftLogs: next
    }));
    if (onFlush) onFlush(); // immediate cloud write
  }

  function addTask() {
    if (!taskInput.trim() && !taskTag) return;
    var entry = {
      id: Date.now(),
      shiftDate: taskShiftDate,
      text: taskInput.trim(),
      tag: taskTag,
      addedAt: todayStr()
    };
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      taskLog: [].concat(_toConsumableArray(taskLog), [entry])
    }));
    setTaskInput("");
    setTaskTag(null);
    if (window.showToast) window.showToast("Task logged", "success");
  }
  function removeTask(id) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      taskLog: taskLog.filter(function (t) {
        return t.id !== id;
      })
    }));
  }
  var tasksByDate = function () {
    var map = {};
    taskLog.forEach(function (t) {
      if (!map[t.shiftDate]) map[t.shiftDate] = [];
      map[t.shiftDate].push(t);
    });
    return Object.keys(map).sort(function (a, b) {
      return b.localeCompare(a);
    }).map(function (d) {
      return {
        date: d,
        tasks: map[d]
      };
    });
  }();
  function addFocusGoal() {
    if (!goalInput.trim()) return;
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      focusGoals: [].concat(_toConsumableArray(focusGoals), [{
        id: Date.now(),
        text: goalInput.trim(),
        status: "active",
        addedAt: todayStr()
      }])
    }));
    setGoalInput("");
  }
  function toggleGoal(id) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      focusGoals: focusGoals.map(function (g) {
        return g.id === id ? _objectSpread(_objectSpread({}, g), {}, {
          status: g.status === "done" ? "active" : "done"
        }) : g;
      })
    }));
  }
  function removeGoal(id) {
    onUpdate(_objectSpread(_objectSpread({}, data), {}, {
      focusGoals: focusGoals.filter(function (g) {
        return g.id !== id;
      })
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: mob ? undefined : 900
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: wCard({
      marginBottom: 16
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
      paddingBottom: 14,
      borderBottom: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: wBtn,
    onClick: function onClick() {
      setCycleOffset(function (o) {
        return o - 1;
      });
    }
  }, "\u2190 prev"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      fontSize: 13,
      fontWeight: 700,
      color: T.text
    }
  }, fmtPeriod()), /*#__PURE__*/React.createElement("button", {
    style: wBtn,
    onClick: function onClick() {
      setCycleOffset(function (o) {
        return o + 1;
      });
    }
  }, "next \u2192"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, editPill), {}, {
      marginLeft: 4
    }),
    onClick: function onClick() {
      setShowSettings(function (v) {
        return !v;
      });
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "gear",
    size: 12
  }), " settings")), showSettings && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      alignItems: "center",
      marginBottom: 14,
      paddingBottom: 14,
      borderBottom: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "Rate $"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: 0,
    step: 0.01,
    style: _objectSpread(_objectSpread({}, wInp), {}, {
      width: 66,
      padding: "3px 6px",
      fontSize: 11
    }),
    placeholder: "0.00",
    value: hrRate || "",
    onChange: function onChange(ev) {
      onUpdate(_objectSpread(_objectSpread({}, data), {}, {
        hourlyRate: Number(ev.target.value) || 0
      }));
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "/hr")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "Pay cycle"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: 1,
    max: 28,
    style: _objectSpread(_objectSpread({}, wInp), {}, {
      width: 44,
      textAlign: "center",
      padding: "3px 6px",
      fontSize: 11
    }),
    value: payCycleDay,
    onChange: function onChange(ev) {
      onUpdate(_objectSpread(_objectSpread({}, data), {}, {
        payCycleDay: Math.max(1, Math.min(28, Number(ev.target.value) || 1))
      }));
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, "th of month"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)",
      gap: 10,
      marginBottom: 10
    }
  }, [{
    label: "Gross pay",
    value: fmt$(estimatedPay),
    sub: periodEquiv.toFixed(1) + "h · " + workedShiftCount + "/" + scheduledShiftCount + " shifts worked" + (projectedPay != null && projectedEquiv > periodEquiv + 0.01 ? " · proj " + fmt$(projectedPay) : ""),
    edge: "#5b8cff"
  }, {
    label: "Est. tax",
    value: periodTax != null ? "−$" + periodTax.toFixed(2) : "—",
    sub: hrRate > 0 ? "ATO 2025-26 · annualised" : "set rate in settings",
    edge: "#ff6b6b"
  }, {
    label: "Take-home",
    value: fmt$(periodNet),
    sub: "after est. tax",
    edge: "#69f0ae"
  }].map(function (c) {
    return /*#__PURE__*/React.createElement("div", {
      key: c.label,
      style: _objectSpread(_objectSpread({}, wGlassMini), {}, {
        padding: "16px 18px"
      }, cellEdge(c.edge))
    }, /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, wStatLabel), {}, {
        marginBottom: 4
      })
    }, c.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: mob ? 18 : 20,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: T.text,
        lineHeight: 1.1,
        fontVariantNumeric: "tabular-nums"
      }
    }, c.value), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 5
      }
    }, c.sub));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(4,1fr)",
      gap: 10
    }
  }, [{
    label: "Standard hrs",
    value: periodNorm.toFixed(1) + "h",
    sub: "before 7pm · 1×",
    edge: "#ffffff"
  }, {
    label: "Penalty hrs",
    value: periodPen.toFixed(1) + "h",
    sub: "after 7pm · 1.5×",
    edge: "#ffd166"
  }, {
    label: "Shifts",
    value: workedShiftCount + "/" + scheduledShiftCount,
    sub: scheduledMeetingCount > 0 ? attendedMeetingCount + "/" + scheduledMeetingCount + " meeting" + (scheduledMeetingCount !== 1 ? "s" : "") + " attended" : "worked / scheduled",
    edge: "#ffffff"
  }, {
    label: "Tasks",
    value: String(periodTaskCount),
    sub: "logged this period",
    edge: "#c77dff"
  }].map(function (c) {
    return /*#__PURE__*/React.createElement("div", {
      key: c.label,
      style: _objectSpread({
        background: "rgba(225,234,255,0.07)",
        border: "0.5px solid rgba(255,255,255,0.10)",
        borderRadius: 12,
        padding: "12px 14px"
      }, cellEdge(c.edge))
    }, /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, wStatLabel), {}, {
        marginBottom: 4
      })
    }, c.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: mob ? 14 : 16,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: T.text,
        lineHeight: 1.1,
        fontVariantNumeric: "tabular-nums"
      }
    }, c.value), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 4
      }
    }, c.sub));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      marginTop: 10
    }
  }, "Tax estimate only. Actual PAYG may differ")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : "2fr 1fr",
      gap: 12,
      alignItems: "start",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: wCard({
      marginBottom: 0
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wST
  }, "Shifts"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3
    }
  }, "tap a shift \u2192 journal to mark worked")), periodShifts.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      padding: "20px 0",
      textAlign: "center"
    }
  }, gcalEvents && gcalEvents.length > 0 ? "No GoTab shifts this period. Use prev to look back" : "Connect Google Calendar to see shifts") : /*#__PURE__*/React.createElement("div", null, periodShifts.map(function (ev) {
    var past = daysBetween(ev.date) < 0;
    var pay = shiftPay(ev.time);
    var rowPay = hrRate > 0 && pay ? fmt$(pay.totalEquiv * hrRate) : "—";
    var d = new Date(ev.date + "T12:00:00");
    var sk = shiftKey(ev);
    var diary = (shiftLogs[sk] || shiftLogs[ev.date] || {}).notes || "";
    var shiftTaskCount = taskLog.filter(function (t) {
      return t.shiftDate === ev.date;
    }).length;
    var isExp = expandedShift === sk;
    var kind = classifyWorkEvent(ev);
    var isMeeting = kind === "meeting";
    var MEET = "#ffa94d";
    var counted = isCounted(ev);
    var future = daysBetween(ev.date) > 0;
    var markedMissed = entryFor(ev).attended === false;
    var dotCol = isMeeting ? MEET : !past ? "#5b8cff" : diary ? "#69f0ae" : T.text3;
    var dotGlow = isMeeting ? "0 0 6px " + MEET : !past ? "0 0 7px #5b8cff" : diary ? "0 0 7px #69f0ae" : "none";
    return /*#__PURE__*/React.createElement("div", {
      key: sk,
      style: {
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        if (!isMeeting) openShift(ev);
      },
      style: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        paddingLeft: 14,
        borderRadius: isExp ? "10px 10px 0 0" : 8,
        background: isExp ? "rgba(91,140,255,0.08)" : isMeeting ? "rgba(255,169,77,0.05)" : T.bg3,
        border: "0.5px solid " + (isExp ? T.accent : isMeeting ? "rgba(255,169,77,0.35)" : T.border),
        borderBottom: isExp ? "none" : "0.5px solid " + (isMeeting ? "rgba(255,169,77,0.35)" : T.border),
        cursor: isMeeting ? "default" : "pointer",
        opacity: (past || markedMissed) && !isExp ? 0.6 : 1,
        overflow: "hidden",
        transition: "background 0.12s,border 0.12s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 5,
        bottom: 5,
        width: isMeeting ? 2 : 3,
        borderRadius: 1,
        background: isMeeting ? MEET : T.accent,
        opacity: past ? 0.45 : 0.85
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: T.text,
        marginBottom: 2
      }
    }, d.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text2
      }
    }, ev.time)), pay && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        fontSize: 10,
        flexShrink: 0,
        color: T.text2
      }
    }, /*#__PURE__*/React.createElement("span", null, pay.normalHrs, "h std"), pay.penaltyHrs > 0 && /*#__PURE__*/React.createElement("span", null, pay.penaltyHrs, "h pen")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: counted ? T.text : T.text3,
        flexShrink: 0,
        minWidth: 52,
        textAlign: "right",
        textDecoration: markedMissed ? "line-through" : "none"
      }
    }, rowPay), isMeeting && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: MEET,
        background: "rgba(255,169,77,0.12)",
        border: "0.5px solid rgba(255,169,77,0.3)",
        borderRadius: 4,
        padding: "1px 5px",
        flexShrink: 0,
        fontWeight: 600
      }
    }, "Meeting"), shiftTaskCount > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: "#c77dff",
        background: "rgba(199,125,255,0.12)",
        border: "0.5px solid rgba(199,125,255,0.25)",
        borderRadius: 4,
        padding: "1px 5px",
        flexShrink: 0
      }
    }, shiftTaskCount, " task", shiftTaskCount !== 1 ? "s" : ""), isMeeting ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        flexShrink: 0
      },
      onClick: function onClick(e) {
        e.stopPropagation();
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setAttendance(ev, true);
      },
      style: {
        fontSize: 9,
        padding: "2px 7px",
        borderRadius: 5,
        border: "0.5px solid " + (counted ? "#69f0ae" : "rgba(255,255,255,0.18)"),
        background: counted ? "rgba(105,240,174,0.15)" : "transparent",
        color: counted ? "#69f0ae" : T.text3,
        cursor: "pointer",
        fontWeight: 600
      }
    }, "Went"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setAttendance(ev, false);
      },
      style: {
        fontSize: 9,
        padding: "2px 7px",
        borderRadius: 5,
        border: "0.5px solid " + (markedMissed ? "#ff6b6b" : "rgba(255,255,255,0.18)"),
        background: markedMissed ? "rgba(255,107,107,0.12)" : "transparent",
        color: markedMissed ? "#ff6b6b" : T.text3,
        cursor: "pointer",
        fontWeight: 600
      }
    }, "Skip")) : counted ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: "#69f0ae",
        background: "rgba(105,240,174,0.12)",
        border: "0.5px solid rgba(105,240,174,0.3)",
        borderRadius: 4,
        padding: "1px 6px",
        flexShrink: 0,
        fontWeight: 600
      }
    }, "\u2713 worked") : future ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: T.text3,
        flexShrink: 0
      }
    }, "scheduled") : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: "#5b8cff",
        background: "rgba(91,140,255,0.12)",
        border: "0.5px solid rgba(91,140,255,0.3)",
        borderRadius: 4,
        padding: "1px 6px",
        flexShrink: 0,
        fontWeight: 600
      }
    }, "mark worked")), isExp && /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(91,140,255,0.05)",
        border: "0.5px solid " + T.accent,
        borderTop: "none",
        borderRadius: "0 0 10px 10px",
        padding: "12px 14px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginBottom: 6,
        letterSpacing: "0.02em"
      }
    }, "Shift diary \xB7 a note marks this shift as worked & counts its pay"), /*#__PURE__*/React.createElement("textarea", {
      rows: 4,
      placeholder: "What did you do this shift? Incidents, wins, patterns worth remembering.",
      value: logDraft.notes,
      onChange: function onChange(e) {
        setLogDraft({
          notes: e.target.value
        });
      },
      style: _objectSpread(_objectSpread({}, wInp), {}, {
        resize: "none",
        fontSize: 11,
        lineHeight: 1.6
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, counted && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setAttendance(ev, false);
        setExpandedShift(null);
      },
      style: _objectSpread(_objectSpread({}, wBtn), {}, {
        color: T.danger
      })
    }, "Didn't work")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setExpandedShift(null);
      },
      style: wBtn
    }, "Close"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        saveShiftLog(ev);
      },
      style: wBtnP
    }, "Save & mark worked")))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      borderTop: "0.5px solid " + T.border,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.text
    }
  }, "Total"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      fontSize: 10,
      flexWrap: "wrap",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text2,
      fontWeight: 600
    }
  }, periodNorm.toFixed(1), "h std"), periodPen > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.warn,
      fontWeight: 600
    }
  }, periodPen.toFixed(1), "h pen"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.accent,
      fontWeight: 700
    }
  }, periodEquiv.toFixed(1), "h equiv"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text,
      fontWeight: 700
    }
  }, fmt$(estimatedPay)))), projectedPay != null && projectedEquiv > periodEquiv + 0.01 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      fontSize: 9,
      color: T.text3,
      padding: "0 12px 4px"
    }
  }, "Projected if all scheduled worked: ", projectedEquiv.toFixed(1), "h equiv \xB7 ", fmt$(projectedPay)))), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: wCard({
      marginBottom: 0
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wST
  }, "Focus Goals")), focusGoals.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      textAlign: "center",
      padding: "18px 0 14px"
    }
  }, "No goals yet. Add something you are working towards") : /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, focusGoals.map(function (g) {
    var done = g.status === "done";
    var dot = done ? "#69f0ae" : "#5b8cff";
    var dotGlow = done ? "0 0 6px #69f0ae" : "0 0 6px #5b8cff";
    return /*#__PURE__*/React.createElement("div", {
      key: g.id,
      onClick: function onClick() {
        toggleGoal(g.id);
      },
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "background 0.1s",
        marginBottom: 4,
        background: "rgba(255,255,255,0.015)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: dot,
        boxShadow: dotGlow,
        flexShrink: 0,
        marginTop: 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12,
        color: done ? T.text3 : T.text,
        textDecoration: done ? "line-through" : "none",
        lineHeight: 1.5,
        transition: "color 0.15s"
      }
    }, g.text), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        removeGoal(g.id);
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        fontSize: 14,
        lineHeight: 1,
        cursor: "pointer",
        padding: "0 2px",
        flexShrink: 0
      }
    }, "\xD7"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      borderTop: "0.5px solid " + T.border,
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "what are you going for?",
    value: goalInput,
    onChange: function onChange(e) {
      setGoalInput(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addFocusGoal();
      }
    },
    style: _objectSpread(_objectSpread({}, wInp), {}, {
      flex: 1,
      fontSize: 11
    })
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addFocusGoal,
    style: wBtnP
  }, "Add")))), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: wCard({
      marginBottom: 0
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wST
  }, "Work Log"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3
    }
  }, "individual tasks & actions")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      paddingBottom: 14,
      borderBottom: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 10
    }
  }, TAGS.map(function (tag) {
    var active = taskTag === tag.label;
    return /*#__PURE__*/React.createElement("button", {
      key: tag.label,
      onClick: function onClick() {
        setTaskTag(active ? null : tag.label);
      },
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        border: "0.5px solid " + (active ? tag.col + "90" : "rgba(255,255,255,0.14)"),
        background: active ? tag.col + "1a" : "rgba(255,255,255,0.04)",
        color: active ? tag.col : T.text2,
        transition: "all 0.12s",
        display: "flex",
        alignItems: "center",
        gap: 5
      })
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: tag.col,
        display: "inline-block",
        flexShrink: 0
      }
    }), tag.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: mob ? "wrap" : "nowrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: taskTag ? "Describe what happened…" : "Pick a tag or just type what you did",
    value: taskInput,
    onChange: function onChange(e) {
      setTaskInput(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addTask();
      }
    },
    style: _objectSpread(_objectSpread({}, wInp), {}, {
      flex: 1
    })
  }), /*#__PURE__*/React.createElement("select", {
    value: taskShiftDate,
    onChange: function onChange(e) {
      setTaskShiftDate(e.target.value);
    },
    style: {
      background: "rgba(255,255,255,0.05)",
      border: "0.5px solid rgba(255,255,255,0.14)",
      color: T.text,
      fontSize: 11,
      borderRadius: 8,
      padding: "7px 10px",
      cursor: "pointer",
      flexShrink: 0
    }
  }, recentShiftDates.map(function (sd) {
    var dd = new Date(sd + "T12:00:00");
    return /*#__PURE__*/React.createElement("option", {
      key: sd,
      value: sd
    }, dd.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short"
    }));
  }), recentShiftDates.indexOf(taskShiftDate) === -1 && /*#__PURE__*/React.createElement("option", {
    value: taskShiftDate
  }, new Date(taskShiftDate + "T12:00:00").toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: addTask,
    style: _objectSpread(_objectSpread({}, wBtnP), {}, {
      flexShrink: 0
    })
  }, "Log it"))), tasksByDate.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      textAlign: "center",
      padding: "28px 0"
    }
  }, "No tasks logged yet. Pick a tag above and describe what you did") : /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: "1px solid rgba(255,255,255,0.07)",
      paddingLeft: 16
    }
  }, tasksByDate.map(function (group) {
    var shiftMatch = (gcalEvents || []).filter(isGoTabEvent).find(function (ev) {
      return ev.date === group.date;
    });
    var dd = new Date(group.date + "T12:00:00");
    var dateLabel = dd.toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "short"
    });
    return /*#__PURE__*/React.createElement("div", {
      key: group.date,
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
        marginLeft: -19
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: T.accent,
        boxShadow: "0 0 6px " + T.accent,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: T.text
      }
    }, dateLabel), shiftMatch && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3
      }
    }, "\xB7 ", shiftMatch.time), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        fontSize: 9,
        color: T.text3
      }
    }, group.tasks.length, " task", group.tasks.length !== 1 ? "s" : "")), group.tasks.map(function (task) {
      var tagObj = TAGS.find(function (t) {
        return t.label === task.tag;
      });
      var tagCol = tagObj ? tagObj.col : "#8f97a6";
      return /*#__PURE__*/React.createElement("div", {
        key: task.id,
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          padding: "7px 10px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.02)",
          border: "0.5px solid rgba(255,255,255,0.06)",
          marginBottom: 5
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: tagCol,
          flexShrink: 0,
          marginTop: 5
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, task.tag && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: tagCol,
          fontWeight: 600,
          marginBottom: 2,
          textTransform: "uppercase",
          letterSpacing: "0.04em"
        }
      }, task.tag), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: task.text ? T.text : T.text3,
          lineHeight: 1.5,
          fontStyle: task.text ? "normal" : "italic"
        }
      }, task.text || task.tag)), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          removeTask(task.id);
        },
        style: _objectSpread(_objectSpread({}, wBtn), {}, {
          padding: "1px 7px",
          fontSize: 12,
          color: T.text3,
          flexShrink: 0,
          lineHeight: 1
        })
      }, "\xD7"));
    }));
  }))));
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects (baby-steps goal breakdowns) + Shopping list
// ─────────────────────────────────────────────────────────────────────────────
function nid(pref) {
  return (pref || "i") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
var PCARD = {
  position: "relative",
  background: cardBg,
  backdropFilter: "blur(24px) saturate(1.4)",
  WebkitBackdropFilter: "blur(24px) saturate(1.4)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 20,
  padding: "18px 20px",
  marginBottom: 12,
  boxShadow: cardShadow
};
var PINP = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "0.5px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.05)",
  color: T.text,
  fontSize: 13,
  boxSizing: "border-box",
  outline: "none"
};
// Module-level copy of App()'s sT (app.jsx ~4066), identical value — needed by
// module-level components (e.g. UpcomingClassesCard) that render outside App().
var sTGlobal = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 12,
  color: "#cdd5e2",
  letterSpacing: "-0.01em"
};
var MONO = "ui-monospace,Menlo,Consolas,monospace";

// Pull a leading emoji off a title string ("🔑 Anime Keychain" -> {emoji,title}).
// Detect astral emoji (surrogate pairs) or common BMP symbol/dingbat ranges via \u escapes.
function leadEmoji(t) {
  t = (t || "").trim();
  var sp = t.indexOf(" ");
  if (sp < 1) return {
    emoji: "",
    title: t
  };
  var head = t.slice(0, sp);
  var isEmo = /[\uD800-\uDBFF]/.test(head) || /[←-⯿☀-➿️⃣⬀-⯿]/.test(head);
  if (!/[A-Za-z0-9]/.test(head) && isEmo) return {
    emoji: head,
    title: t.slice(sp + 1).trim()
  };
  return {
    emoji: "",
    title: t
  };
}

// Parse the paste-in block into a project object. Returns null if there's no title or no steps.
// Format: "# Title" · "## Stage — subtitle" · "- step | where: .. | search: .. | price: .. | skip"
function parseProjectImport(text) {
  var lines = (text || "").split(/\r?\n/);
  var title = "",
    emoji = "",
    stages = [],
    stage = null;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    if (/^##\s+/.test(line)) {
      var body = line.replace(/^##\s+/, "");
      var sp2 = body.split(/\s+[—–-]\s+/);
      stage = {
        id: nid("st"),
        title: sp2[0].trim(),
        subtitle: sp2.slice(1).join(" · ").trim(),
        steps: []
      };
      stages.push(stage);
      continue;
    }
    if (/^#\s+/.test(line)) {
      var le = leadEmoji(line.replace(/^#\s+/, ""));
      emoji = le.emoji;
      title = le.title;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!stage) {
        stage = {
          id: nid("st"),
          title: "",
          subtitle: "",
          steps: []
        };
        stages.push(stage);
      }
      var seg = line.replace(/^[-*]\s+/, "").split("|").map(function (x) {
        return x.trim();
      });
      var t0 = seg[0];
      var meta = {};
      var skip = false;
      if (/^skip:/i.test(t0)) {
        skip = true;
        t0 = t0.replace(/^skip:\s*/i, "");
      }
      for (var j = 1; j < seg.length; j++) {
        var kv = seg[j];
        if (!kv) continue;
        if (/^skip$/i.test(kv)) {
          skip = true;
          continue;
        }
        var mi = kv.indexOf(":");
        if (mi > 0) {
          var k = kv.slice(0, mi).trim().toLowerCase();
          var v = kv.slice(mi + 1).trim();
          if (k === "where" || k === "search" || k === "price") meta[k] = v;else if (k === "desc" || k === "note") meta.desc = v;
        } else {
          meta.desc = (meta.desc ? meta.desc + " " : "") + kv;
        }
      }
      stage.steps.push({
        id: nid("sp"),
        title: t0,
        desc: meta.desc || "",
        done: false,
        meta: {
          where: meta.where || "",
          search: meta.search || "",
          price: meta.price || "",
          skip: !!skip
        }
      });
    }
  }
  var hasSteps = stages.some(function (s) {
    return s.steps.length > 0;
  });
  if (!title || !hasSteps) return null;
  return {
    id: nid("prj"),
    title: title,
    emoji: emoji || "📋",
    createdAt: todayStr(),
    archived: false,
    stages: stages
  };
}
function projStats(p) {
  var total = 0,
    done = 0,
    current = null;
  (p.stages || []).forEach(function (st) {
    (st.steps || []).forEach(function (s) {
      total++;
      if (s.done) done++;else if (!current) current = s;
    });
  });
  return {
    total: total,
    done: done,
    pct: total ? Math.round(done / total * 100) : 0,
    current: current
  };
}
function ProgressBar(props) {
  var pct = props.pct || 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: props.h || 8,
      borderRadius: 20,
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: pct + "%",
      borderRadius: 20,
      background: "linear-gradient(90deg,#5b8cff,#8fb0ff)",
      boxShadow: pct > 0 ? "0 0 10px rgba(91,140,255,0.5)" : "none",
      transition: "width .45s cubic-bezier(.22,1,.36,1)"
    }
  }));
}

// The one tick control for the whole app. `inert` renders it as a non-interactive
// indicator for rows that already carry their own click handler — it still looks
// identical, so a list never mixes two styles of tick.
function TickCircle(props) {
  var done = props.done;
  var size = props.size || 26;
  var ring = done ? T.success : props.accent || "rgba(255,255,255,0.28)";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: props.inert ? undefined : props.onClick,
    "aria-label": done ? "Mark not done" : "Mark done",
    className: "tick-circle" + (done ? " is-done" : ""),
    tabIndex: props.inert ? -1 : 0,
    style: {
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: "50%",
      border: "2px solid " + ring,
      background: done ? T.success : "rgba(255,255,255,0.03)",
      cursor: props.inert ? "inherit" : "pointer",
      display: "grid",
      placeItems: "center",
      padding: 0,
      pointerEvents: props.inert ? "none" : "auto",
      boxShadow: done ? "0 0 10px " + T.success + "70" : "none",
      transition: "background .18s,border-color .18s,box-shadow .18s,transform .12s"
    }
  }, done && /*#__PURE__*/React.createElement("svg", {
    width: size * 0.5,
    height: size * 0.5,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#0a0a0a",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5l5 5L20 6.5"
  })));
}
function ProjectsSection(_ref4) {
  var data = _ref4.data,
    onUpdate = _ref4.onUpdate,
    onAddShopping = _ref4.onAddShopping,
    mob = _ref4.mob;
  var projects = Array.isArray(data) ? data : [];
  var _useState139 = useState(null),
    _useState140 = _slicedToArray(_useState139, 2),
    openId = _useState140[0],
    setOpenId = _useState140[1];
  var _useState141 = useState(false),
    _useState142 = _slicedToArray(_useState141, 2),
    showImport = _useState142[0],
    setShowImport = _useState142[1];
  var _useState143 = useState(""),
    _useState144 = _slicedToArray(_useState143, 2),
    txt = _useState144[0],
    setTxt = _useState144[1];
  var _useState145 = useState(false),
    _useState146 = _slicedToArray(_useState145, 2),
    confirmDel = _useState146[0],
    setConfirmDel = _useState146[1];
  function toast(m, t) {
    if (window.showToast) window.showToast(m, t);
  }
  function doImport() {
    var p = parseProjectImport(txt);
    if (!p) {
      toast("Couldn't read that. Needs a '# Title' line and at least one '- step'.", "error");
      return;
    }
    onUpdate(projects.concat([p]));
    setTxt("");
    setShowImport(false);
    setOpenId(p.id);
    toast("Project added: " + p.title, "success");
  }
  function toggleStep(pid, sid) {
    onUpdate(projects.map(function (p) {
      return p.id !== pid ? p : _objectSpread(_objectSpread({}, p), {}, {
        stages: p.stages.map(function (st) {
          return _objectSpread(_objectSpread({}, st), {}, {
            steps: st.steps.map(function (s) {
              return s.id !== sid ? s : _objectSpread(_objectSpread({}, s), {}, {
                done: !s.done
              });
            })
          });
        })
      });
    }));
  }
  function removeProject(pid) {
    onUpdate(projects.filter(function (p) {
      return p.id !== pid;
    }));
    setOpenId(null);
    toast("Project removed", "success");
  }
  function addStepToShopping(p, s) {
    if (!onAddShopping) return;
    var name = s.meta && s.meta.search ? s.meta.search : s.title.replace(/^\s*buy\s+(the\s+|a\s+|an\s+)?/i, "");
    var det = [s.meta && s.meta.where, s.meta && s.meta.price].filter(Boolean).join(" · ");
    onAddShopping({
      id: nid("shp"),
      key: "proj:" + p.id + ":" + s.id,
      text: name,
      detail: det,
      source: p.title,
      done: false,
      addedAt: todayStr()
    });
    toast("Added to shopping", "success");
  }
  var open = openId ? projects.filter(function (p) {
    return p.id === openId;
  })[0] : null;
  if (open) {
    var stt = projStats(open);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setOpenId(null);
      },
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        marginBottom: 14
      })
    }, "\u2190 All projects"), /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: PCARD
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 26,
        lineHeight: 1
      }
    }, open.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 17,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "#eef3fb"
      }
    }, open.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text3,
        marginTop: 2
      }
    }, stt.done, " of ", stt.total, " steps done", stt.total ? " · " + stt.pct + "%" : ""))), /*#__PURE__*/React.createElement(ProgressBar, {
      pct: stt.pct
    }), stt.current && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: T.accent,
        background: T.accentBg,
        border: "0.5px solid rgba(91,140,255,0.35)",
        padding: "8px 11px",
        borderRadius: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: T.accent,
        flexShrink: 0,
        animation: "pulse 1.6s ease-in-out infinite"
      }
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      style: {
        fontWeight: 700
      }
    }, "Do next:"), " ", stt.current.title)), !stt.current && stt.total > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        fontSize: 12.5,
        color: T.success,
        fontWeight: 600
      }
    }, "\uD83C\uDF89 Every step done. Nice work.")), open.stages.map(function (st, si) {
      return /*#__PURE__*/React.createElement("div", {
        key: st.id,
        className: "card-rim",
        style: PCARD
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          fontWeight: 700,
          color: T.text3,
          textTransform: "uppercase",
          letterSpacing: 0.6
        }
      }, "Stage ", si + 1), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: T.text,
          marginTop: 2
        }
      }, st.title), st.subtitle && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          color: T.text2,
          marginTop: 2
        }
      }, st.subtitle)), st.steps.map(function (s) {
        var isCur = stt.current && stt.current.id === s.id;
        var sk = s.meta && s.meta.skip;
        return /*#__PURE__*/React.createElement("div", {
          key: s.id,
          style: {
            display: "flex",
            gap: 11,
            alignItems: "flex-start",
            padding: "11px 12px",
            marginBottom: 8,
            borderRadius: 12,
            background: sk ? "rgba(105,240,174,0.06)" : isCur ? T.accentBg : "rgba(225,234,255,0.04)",
            border: "1px solid " + (isCur ? "rgba(91,140,255,0.5)" : sk ? "rgba(105,240,174,0.25)" : "rgba(255,255,255,0.07)"),
            boxShadow: isCur ? "0 0 0 3px rgba(91,140,255,0.12)" : "none"
          }
        }, /*#__PURE__*/React.createElement(TickCircle, {
          done: s.done,
          onClick: function onClick() {
            toggleStep(open.id, s.id);
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 600,
            color: s.done ? T.text3 : T.text,
            textDecoration: s.done ? "line-through" : "none",
            lineHeight: 1.35
          }
        }, s.title), s.desc && /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: T.text2,
            marginTop: 3,
            lineHeight: 1.5,
            opacity: s.done ? 0.5 : 1
          }
        }, s.desc), s.meta && (s.meta.where || s.meta.search || s.meta.price) && /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 7,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center"
          }
        }, s.meta.where && /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10.5,
            color: T.text2
          }
        }, "\uD83D\uDED2 ", s.meta.where), s.meta.search && /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10,
            fontFamily: MONO,
            background: "rgba(255,255,255,0.06)",
            padding: "1px 7px",
            borderRadius: 5,
            color: T.text
          }
        }, s.meta.search), s.meta.price && /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10.5,
            fontWeight: 600,
            color: T.accent
          }
        }, s.meta.price), !s.done && !sk && onAddShopping && /*#__PURE__*/React.createElement("button", {
          onClick: function onClick() {
            addStepToShopping(open, s);
          },
          style: _objectSpread(_objectSpread({}, editPill), {}, {
            fontSize: 10,
            padding: "2px 9px"
          })
        }, "+ Shopping")), sk && /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 5,
            fontSize: 10,
            color: T.success,
            fontWeight: 600
          }
        }, "Skip this, just tick to acknowledge")));
      }));
    }), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        if (!confirmDel) {
          setConfirmDel(true);
          setTimeout(function () {
            setConfirmDel(false);
          }, 3000);
          return;
        }
        removeProject(open.id);
        setConfirmDel(false);
      },
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        color: T.danger,
        borderColor: "rgba(255,107,107,0.4)",
        marginTop: 4
      })
    }, confirmDel ? "Tap again to confirm delete" : "Delete project"));
  }
  var active = projects.filter(function (p) {
    return !p.archived;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 20 : 23,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#eef3fb"
    }
  }, "Projects"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      marginTop: 2
    }
  }, "Big goals, broken into tiny steps.")), /*#__PURE__*/React.createElement("button", {
    style: btnGlassP,
    onClick: function onClick() {
      setShowImport(function (v) {
        return !v;
      });
    }
  }, showImport ? "Close" : "+ New project")), showImport && /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: PCARD
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      marginBottom: 8,
      lineHeight: 1.5
    }
  }, "Paste the breakdown block (Claude hands you one). Format: ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: MONO,
      fontSize: 11
    }
  }, "# Title"), " \xB7 ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: MONO,
      fontSize: 11
    }
  }, "## Stage"), " \xB7 ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: MONO,
      fontSize: 11
    }
  }, "- step"), "."), /*#__PURE__*/React.createElement("textarea", {
    value: txt,
    onChange: function onChange(e) {
      setTxt(e.target.value);
    },
    rows: mob ? 7 : 9,
    placeholder: "# 🔑 Anime Keychain\n## Stage 1 - Buy 4 things\n- Buy the main board | where: Amazon.com.au | price: ~$40",
    style: _objectSpread(_objectSpread({}, PINP), {}, {
      resize: "vertical",
      fontFamily: MONO,
      fontSize: 12,
      lineHeight: 1.5
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: function onClick() {
      setTxt("");
      setShowImport(false);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    style: btnGlassP,
    onClick: doImport
  }, "Import project"))), active.length === 0 && !showImport && /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: _objectSpread(_objectSpread({}, PCARD), {}, {
      textAlign: "center",
      padding: "34px 20px"
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      marginBottom: 8
    }
  }, "\uD83D\uDDC2\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text,
      marginBottom: 4
    }
  }, "No projects yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      marginBottom: 16,
      maxWidth: 340,
      marginLeft: "auto",
      marginRight: "auto",
      lineHeight: 1.6
    }
  }, "Ask Claude to break a goal into baby-steps, then tap \"+ New project\" and paste it here."), /*#__PURE__*/React.createElement("button", {
    style: btnGlassP,
    onClick: function onClick() {
      setShowImport(true);
    }
  }, "+ New project")), active.map(function (p) {
    var s = projStats(p);
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "card-rim",
      onClick: function onClick() {
        setOpenId(p.id);
      },
      style: _objectSpread(_objectSpread({}, PCARD), {}, {
        cursor: "pointer"
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        lineHeight: 1
      }
    }, p.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: "#eef3fb",
        letterSpacing: "-0.01em"
      }
    }, p.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text3,
        marginTop: 1
      }
    }, s.done, "/", s.total, " done \xB7 ", s.pct, "%")), /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        pointerEvents: "none"
      })
    }, "Open \u2192")), /*#__PURE__*/React.createElement(ProgressBar, {
      pct: s.pct
    }), s.current && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        fontSize: 12,
        color: T.text2,
        display: "flex",
        alignItems: "center",
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: T.accent,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, "Next: ", s.current.title)), !s.current && s.total > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        fontSize: 12,
        color: T.success,
        fontWeight: 600
      }
    }, "\u2713 All done"));
  }));
}
function ShopRow(props) {
  var x = props.item;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 11,
      alignItems: "center",
      padding: "9px 2px"
    }
  }, /*#__PURE__*/React.createElement(TickCircle, {
    done: x.done,
    size: 22,
    onClick: props.onToggle
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: x.done ? T.text3 : T.text,
      textDecoration: x.done ? "line-through" : "none"
    }
  }, x.text), (x.detail || x.source) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: T.text3,
      marginTop: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, x.detail, x.detail && x.source ? " · " : "", x.source ? "from " + x.source : "")), /*#__PURE__*/React.createElement("button", {
    onClick: props.onRemove,
    "aria-label": "Remove",
    style: {
      background: "none",
      border: "none",
      color: T.text3,
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1,
      padding: "0 4px",
      flexShrink: 0
    }
  }, "\xD7"));
}
function ShoppingSection(_ref5) {
  var data = _ref5.data,
    onUpdate = _ref5.onUpdate,
    mob = _ref5.mob;
  var items = Array.isArray(data) ? data : [];
  var _useState147 = useState(""),
    _useState148 = _slicedToArray(_useState147, 2),
    inp = _useState148[0],
    setInp = _useState148[1];
  var _useState149 = useState(false),
    _useState150 = _slicedToArray(_useState149, 2),
    confirmClear = _useState150[0],
    setConfirmClear = _useState150[1];
  function toast(m, t) {
    if (window.showToast) window.showToast(m, t);
  }
  function add() {
    var v = inp.trim();
    if (!v) return;
    if (items.some(function (x) {
      return !x.done && x.text.trim().toLowerCase() === v.toLowerCase();
    })) {
      toast(v + " is already on the list", "warn");
      setInp("");
      return;
    }
    onUpdate(items.concat([{
      id: nid("shp"),
      key: null,
      text: v,
      detail: "",
      source: "",
      done: false,
      addedAt: todayStr()
    }]));
    setInp("");
  }
  function toggle(id) {
    onUpdate(items.map(function (x) {
      return x.id !== id ? x : _objectSpread(_objectSpread({}, x), {}, {
        done: !x.done
      });
    }));
  }
  function remove(id) {
    onUpdate(items.filter(function (x) {
      return x.id !== id;
    }));
  }
  function clearBought() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(function () {
        setConfirmClear(false);
      }, 3000);
      return;
    }
    onUpdate(items.filter(function (x) {
      return !x.done;
    }));
    setConfirmClear(false);
    toast("Cleared bought items", "success");
  }
  var todo = items.filter(function (x) {
    return !x.done;
  });
  var bought = items.filter(function (x) {
    return x.done;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 20 : 23,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#eef3fb"
    }
  }, "Shopping"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      marginTop: 2
    }
  }, todo.length, " to buy", bought.length ? " · " + bought.length + " in cart" : "")), bought.length > 0 && /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: clearBought
  }, confirmClear ? "Tap again to confirm" : "Clear bought")), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: PCARD
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: todo.length || bought.length ? 14 : 0
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: inp,
    onChange: function onChange(e) {
      setInp(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") add();
    },
    placeholder: "Add an item\u2026",
    style: PINP
  }), /*#__PURE__*/React.createElement("button", {
    style: btnGlassP,
    onClick: add
  }, "Add")), todo.length === 0 && bought.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      paddingTop: 2
    }
  }, "Nothing on the list yet."), todo.map(function (x) {
    return /*#__PURE__*/React.createElement(ShopRow, {
      key: x.id,
      item: x,
      onToggle: function onToggle() {
        toggle(x.id);
      },
      onRemove: function onRemove() {
        remove(x.id);
      }
    });
  }), bought.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 12,
      borderTop: "0.5px solid " + T.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      color: T.text3,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 8
    }
  }, "In cart"), bought.map(function (x) {
    return /*#__PURE__*/React.createElement(ShopRow, {
      key: x.id,
      item: x,
      onToggle: function onToggle() {
        toggle(x.id);
      },
      onRemove: function onRemove() {
        remove(x.id);
      }
    });
  }))));
}
function ShoppingHomeCard(_ref6) {
  var items = _ref6.items,
    onUpdate = _ref6.onUpdate,
    onOpen = _ref6.onOpen,
    cardStyle = _ref6.cardStyle,
    mob = _ref6.mob;
  var list = Array.isArray(items) ? items : [];
  var _useState151 = useState(""),
    _useState152 = _slicedToArray(_useState151, 2),
    inp = _useState152[0],
    setInp = _useState152[1];
  var todo = list.filter(function (x) {
    return !x.done;
  });
  function add() {
    var v = inp.trim();
    if (!v) return;
    if (list.some(function (x) {
      return !x.done && x.text.trim().toLowerCase() === v.toLowerCase();
    })) {
      if (window.showToast) window.showToast(v + " is already on the list", "warn");
      setInp("");
      return;
    }
    onUpdate(list.concat([{
      id: nid("shp"),
      key: null,
      text: v,
      detail: "",
      source: "",
      done: false,
      addedAt: todayStr()
    }]));
    setInp("");
  }
  function toggle(id) {
    onUpdate(list.map(function (x) {
      return x.id !== id ? x : _objectSpread(_objectSpread({}, x), {}, {
        done: !x.done
      });
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: _objectSpread({}, cardStyle || PCARD)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.accent,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(NavGlyph, {
    name: "Shopping",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#eef3fb",
      letterSpacing: 0.2
    }
  }, "Shopping"), todo.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.accent,
      background: T.accentBg,
      borderRadius: 99,
      padding: "1px 8px"
    }
  }, todo.length)), /*#__PURE__*/React.createElement("button", {
    style: editPill,
    onClick: onOpen
  }, "Open \u2192")), todo.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: T.text2,
      marginBottom: 10
    }
  }, "Nothing to buy right now."), todo.slice(0, 5).map(function (x) {
    return /*#__PURE__*/React.createElement("div", {
      key: x.id,
      style: {
        display: "flex",
        gap: 9,
        alignItems: "center",
        padding: "6px 0"
      }
    }, /*#__PURE__*/React.createElement(TickCircle, {
      done: false,
      size: 20,
      onClick: function onClick() {
        toggle(x.id);
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 12.5,
        color: T.text,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, x.text, x.detail ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.text3,
        fontSize: 10.5
      }
    }, " \xB7 ", x.detail) : null));
  }), todo.length > 5 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: T.text3,
      margin: "4px 0 8px",
      paddingLeft: 29
    }
  }, "+", todo.length - 5, " more"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: inp,
    onChange: function onChange(e) {
      setInp(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") add();
    },
    placeholder: "Quick add\u2026",
    style: _objectSpread(_objectSpread({}, PINP), {}, {
      padding: "7px 10px",
      fontSize: 12
    })
  }), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btnGlassP), {}, {
      padding: "6px 12px"
    }),
    onClick: add
  }, "Add")));
}

// Masonry-on-CSS-Grid: a card's rendered height is measured and converted into a
// row span against a fine grid-auto-rows unit, so cards pack tightly upward while
// keeping an explicit column position. This is what CSS multi-column could not do.
// Row unit is 1px and the ROW gap is 0, so a card can reserve its exact measured
// height plus one gap. An 8px unit with an 18px row gap quantised every card to a
// 26px step, leaving up to 25px of slack below it — visibly uneven gutters, which
// is the bug this grid existed to fix. The column gap is still a real gap.
var GRID_ROW_UNIT = 1; // px per implicit row
var GRID_GAP = 18; // px between cards, both axes

function HomeGridCard(_ref7) {
  var span = _ref7.span,
    editing = _ref7.editing,
    title = _ref7.title,
    onSpan = _ref7.onSpan,
    onDragStart = _ref7.onDragStart,
    onDragOver = _ref7.onDragOver,
    isDragging = _ref7.isDragging,
    isDropTarget = _ref7.isDropTarget,
    children = _ref7.children;
  var ref = React.useRef(null);
  var _React$useState = React.useState(20),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    rows = _React$useState2[0],
    setRows = _React$useState2[1];
  React.useLayoutEffect(function () {
    var el = ref.current;
    if (!el) return;
    function measure() {
      var h = el.getBoundingClientRect().height;
      setRows(Math.max(1, Math.ceil(h) + GRID_GAP));
    }
    measure();
    if (typeof ResizeObserver === "undefined") return;
    var ro = new ResizeObserver(measure);
    ro.observe(el);
    return function () {
      ro.disconnect();
    };
  }, []); // see Task 2 — [] is deliberate; ResizeObserver catches height changes itself
  return /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "span " + span,
      gridRow: "span " + rows,
      opacity: isDragging ? 0.35 : 1,
      outline: isDropTarget ? "2px dashed " + T.accent : "none",
      outlineOffset: 4,
      borderRadius: 22,
      transition: "opacity 0.12s"
    },
    onPointerEnter: editing ? onDragOver : undefined
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "home-grid-cell",
    style: {
      display: "flow-root"
    }
  }, editing && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      padding: "6px 10px",
      marginBottom: 6,
      borderRadius: 10,
      background: "rgba(91,140,255,0.10)",
      border: "1px solid rgba(91,140,255,0.35)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    onPointerDown: onDragStart,
    style: {
      cursor: "grab",
      fontSize: 14,
      color: T.accent,
      userSelect: "none",
      touchAction: "none"
    },
    title: "Drag to move"
  }, "\u283F"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: T.text2,
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 3
    }
  }, [1, 2, 3].map(function (n) {
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: function onClick() {
        onSpan(n);
      },
      style: _objectSpread(_objectSpread({}, btnGlass), {}, {
        padding: "1px 7px",
        fontSize: 10,
        color: span === n ? T.accent : T.text3,
        borderColor: span === n ? "rgba(91,140,255,0.5)" : "rgba(255,255,255,0.12)"
      }),
      title: n === 1 ? "One column" : n === 2 ? "Two columns wide" : "Full width"
    }, n);
  }))), /*#__PURE__*/React.createElement("div", {
    style: editing ? {
      pointerEvents: "none",
      userSelect: "none"
    } : undefined
  }, children)));
}

// Shared by the home page (7 days) and the Uni tab (28 days) so the two
// cannot drift apart. `events` is the deduped Google Calendar event list.
// evColor/evLabel are passed in because they live inside App() — evLabel
// closes over data.uni.subjects and cannot be hoisted.
// ── Jarvis ────────────────────────────────────────────────────────────────────
// Leads the home page with one answer to "what should I do next", ranked across
// every part of the dashboard by jarvis-signals.js. The runners-up fold away
// behind "also considered" — the point is to be told what to do, but a
// recommendation you cannot interrogate is one you stop trusting.
//
// Ranking is pure rules (see jarvis-signals.js). No API key is involved here.
var JARVIS_BAND_COLOUR = {
  failing: T.danger,
  deadline: T.warn,
  approaching: T.warn,
  decaying: T.accent,
  getAhead: T.accent,
  allClear: T.success
};
function JarvisCard(_ref8) {
  var candidates = _ref8.candidates,
    onOpen = _ref8.onOpen,
    cardStyle = _ref8.cardStyle,
    mob = _ref8.mob;
  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    open = _React$useState4[0],
    setOpen = _React$useState4[1];
  var list = candidates || [];
  // rank() guarantees at least one candidate, so this is belt-and-braces for a
  // caller that hands us nothing at all rather than an expected state.
  if (!list.length) return null;
  var lead = list[0];
  var rest = window.JarvisSignals.top(list.slice(1), mob ? 2 : 3);
  var accent = JARVIS_BAND_COLOUR[lead.band] || T.accent;
  return /*#__PURE__*/React.createElement("div", {
    className: "card-rim jarvis-card",
    style: _objectSpread(_objectSpread({}, cardStyle), {}, {
      "--jarvis-accent": accent
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "jarvis-lead"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: accent,
      boxShadow: "0 0 8px " + accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: accent
    }
  }, "Jarvis")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 15 : 17,
      fontWeight: 700,
      letterSpacing: "-0.01em",
      color: "#eef3fb",
      lineHeight: 1.3
    }
  }, lead.headline), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.text2,
      lineHeight: 1.5,
      marginTop: 6
    }
  }, lead.why), lead.cta && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      onOpen && onOpen(lead.cta.page);
    },
    style: _objectSpread(_objectSpread({}, btnGlass), {}, {
      marginTop: 12,
      padding: "6px 14px",
      fontSize: 12
    })
  }, lead.cta.label)), rest.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      borderTop: "0.5px solid rgba(255,255,255,0.08)",
      paddingTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "jarvis-toggle",
    onClick: function onClick() {
      setOpen(function (v) {
        return !v;
      });
    },
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontSize: 11,
      color: T.text3,
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", null, open ? "▾" : "▸"), "also considered (", rest.length, ")"), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, rest.map(function (c, i) {
    var col = JARVIS_BAND_COLOUR[c.band] || T.accent;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      className: "jarvis-alt",
      style: {
        "--i": i,
        display: "flex",
        alignItems: "flex-start",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: col,
        flexShrink: 0,
        marginTop: 6
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: T.text,
        lineHeight: 1.4
      }
    }, c.headline), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text3,
        lineHeight: 1.4,
        marginTop: 2
      }
    }, c.why)), c.cta && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        onOpen && onOpen(c.cta.page);
      },
      style: _objectSpread(_objectSpread({}, btnGlass), {}, {
        padding: "2px 9px",
        fontSize: 10,
        flexShrink: 0
      })
    }, c.cta.label));
  }))));
}
function UpcomingClassesCard(_ref9) {
  var events = _ref9.events,
    days = _ref9.days,
    gcalConnected = _ref9.gcalConnected,
    evColor = _ref9.evColor,
    evLabel = _ref9.evLabel,
    cardStyle = _ref9.cardStyle;
  var today = todayStr();
  var end = function () {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return dStr(d);
  }();
  var classes = (events || []).filter(function (ev) {
    return isUniCalEv(ev) && !isAssessmentEvent(ev) && !ev.allDay && ev.date >= today && ev.date <= end;
  }).sort(function (a, b) {
    return a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || "");
  });
  var lastDate = "";
  return /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: cardStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sTGlobal
  }, "Upcoming Classes"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3
    }
  }, "next ", days, " days")), classes.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2
    }
  }, gcalConnected ? "No upcoming classes in the next " + days + " days." : "Connect Google Calendar to see your schedule.") : classes.map(function (ev) {
    var showDate = ev.date !== lastDate;
    lastDate = ev.date;
    var col = evColor(ev);
    var isToday = ev.date === today;
    return /*#__PURE__*/React.createElement("div", {
      key: ev.id
    }, showDate && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        color: isToday ? T.accent : T.text2,
        marginTop: 10,
        marginBottom: 6,
        paddingTop: 8,
        borderTop: "0.5px solid " + T.border
      }
    }, isToday ? "Today · " : "", new Date(ev.date + "T12:00:00").toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "short"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginBottom: 10,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 2,
        borderRadius: 2,
        background: col,
        alignSelf: "stretch",
        minHeight: 28,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: T.text2,
        marginBottom: 1
      }
    }, evLabel(ev)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text,
        lineHeight: 1.5
      }
    }, ev.title), ev.description && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 2,
        lineHeight: 1.4
      }
    }, ev.description.slice(0, 120), ev.description.length > 120 ? "…" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 2
      }
    }, ev.time))));
  }));
}
function App() {
  var _useState153 = useState("Dashboard"),
    _useState154 = _slicedToArray(_useState153, 2),
    page = _useState154[0],
    setPage = _useState154[1];
  var _useState155 = useState(function () {
      try {
        var s = localStorage.getItem("dash_v1");
        if (!s) return mergeWithDefaults(_objectSpread(_objectSpread({}, INIT), {}, {
          reflections: SEED_REFL
        }));
        var saved = JSON.parse(s);
        var fin = saved.finance || {};
        var out = saved;
        if (!fin.financeVersion || fin.financeVersion < 2) {
          out = _objectSpread(_objectSpread({}, out), {}, {
            finance: INIT.finance
          });
        }
        return mergeWithDefaults(out);
      } catch (_) {
        return mergeWithDefaults(_objectSpread(_objectSpread({}, INIT), {}, {
          reflections: SEED_REFL
        }));
      }
    }),
    _useState156 = _slicedToArray(_useState155, 2),
    data = _useState156[0],
    setData = _useState156[1];
  var _useState157 = useState(0),
    _useState158 = _slicedToArray(_useState157, 2),
    wkOff = _useState158[0],
    setWkOff = _useState158[1];
  var _useState159 = useState(todayStr()),
    _useState160 = _slicedToArray(_useState159, 2),
    activeDay = _useState160[0],
    setActiveDay = _useState160[1];
  var _useState161 = useState([{
      id: 1,
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    }, {
      id: 2,
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    }, {
      id: 3,
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    }]),
    _useState162 = _slicedToArray(_useState161, 2),
    nxtRows = _useState162[0],
    setNxtRows = _useState162[1];
  // Pre-fill nxtRows — check for a saved draft first, then fall back to rotation template
  useEffect(function () {
    var gr = data.gym.rotation || [];
    var gl = gr.length > 0 ? gr.length : 1;
    var gi = (data.gym.rotIdx || 0) % gl;
    var nr = gr.length > 0 ? gr[gi] : null;
    try {
      var draft = JSON.parse(localStorage.getItem('gym_draft') || 'null');
      if (draft && nr && draft.rotId === nr.id && draft.rows && draft.rows.some(function (r) {
        return r.exercise;
      })) {
        setNxtRows(draft.rows);
        setGymDraftBanner(true);
        return;
      }
    } catch (_) {}
    setGymDraftBanner(false);
    if (nr && nr.exercises && nr.exercises.length > 0) {
      setNxtRows(nr.exercises.map(function (ex, i) {
        return {
          id: ex.id || i + 1,
          exercise: ex.exercise || "",
          sets: ex.sets || "",
          reps: ex.reps || "",
          weight: ex.weight || ""
        };
      }).concat(nr.exercises.length < 3 ? [{
        id: Date.now() + 1,
        exercise: "",
        sets: "",
        reps: "",
        weight: ""
      }].slice(0, 3 - nr.exercises.length) : []).slice(0, Math.max(nr.exercises.length, 3)));
    }
  }, [data.gym.rotIdx, data.gym.rotation]);
  // Auto-save gym session draft whenever rows change
  useEffect(function () {
    if (!nxtRows.some(function (r) {
      return r.exercise || r.weight;
    })) return;
    var gr = data.gym.rotation || [];
    var gl = gr.length > 0 ? gr.length : 1;
    var gi = (data.gym.rotIdx || 0) % gl;
    var nr = gr.length > 0 ? gr[gi] : null;
    try {
      localStorage.setItem('gym_draft', JSON.stringify({
        rotId: nr ? nr.id : null,
        rows: nxtRows,
        savedAt: Date.now()
      }));
    } catch (_) {}
  }, [nxtRows]);
  var _useState163 = useState(""),
    _useState164 = _slicedToArray(_useState163, 2),
    bwIn = _useState164[0],
    setBwIn = _useState164[1];
  var _useState165 = useState(todayStr()),
    _useState166 = _slicedToArray(_useState165, 2),
    bwDate = _useState166[0],
    setBwDate = _useState166[1];
  var _useState167 = useState(false),
    _useState168 = _slicedToArray(_useState167, 2),
    bwEditing = _useState168[0],
    setBwEditing = _useState168[1];
  var _useState169 = useState(false),
    _useState170 = _slicedToArray(_useState169, 2),
    showCapture = _useState170[0],
    setShowCapture = _useState170[1];
  var _useState171 = useState(""),
    _useState172 = _slicedToArray(_useState171, 2),
    captureText = _useState172[0],
    setCaptureText = _useState172[1];
  var _useState173 = useState(false),
    _useState174 = _slicedToArray(_useState173, 2),
    captureLoading = _useState174[0],
    setCaptureLoading = _useState174[1];
  var _useState175 = useState(null),
    _useState176 = _slicedToArray(_useState175, 2),
    captureResult = _useState176[0],
    setCaptureResult = _useState176[1];
  var _useState177 = useState(false),
    _useState178 = _slicedToArray(_useState177, 2),
    showBoardroom = _useState178[0],
    setShowBoardroom = _useState178[1];
  var _useState179 = useState([]),
    _useState180 = _slicedToArray(_useState179, 2),
    brMessages = _useState180[0],
    setBrMessages = _useState180[1];
  var _useState181 = useState(""),
    _useState182 = _slicedToArray(_useState181, 2),
    brInput = _useState182[0],
    setBrInput = _useState182[1];
  var _useState183 = useState(false),
    _useState184 = _slicedToArray(_useState183, 2),
    brLoading = _useState184[0],
    setBrLoading = _useState184[1];
  var _useState185 = useState(null),
    _useState186 = _slicedToArray(_useState185, 2),
    brLastSpeaker = _useState186[0],
    setBrLastSpeaker = _useState186[1]; // kept for Firestore compat only
  var _useState187 = useState([]),
    _useState188 = _slicedToArray(_useState187, 2),
    brGoalProposals = _useState188[0],
    setBrGoalProposals = _useState188[1];
  var _useState189 = useState([]),
    _useState190 = _slicedToArray(_useState189, 2),
    brTaskProposals = _useState190[0],
    setBrTaskProposals = _useState190[1]; // commitments from the last session, addable as real tasks
  var _useState191 = useState(false),
    _useState192 = _slicedToArray(_useState191, 2),
    brClosing = _useState192[0],
    setBrClosing = _useState192[1];
  var _useState193 = useState(null),
    _useState194 = _slicedToArray(_useState193, 2),
    brIntentMode = _useState194[0],
    setBrIntentMode = _useState194[1]; // 'howto' | 'direction' — for header badge / loading copy
  var _useState195 = useState(null),
    _useState196 = _slicedToArray(_useState195, 2),
    brPendingIntent = _useState196[0],
    setBrPendingIntent = _useState196[1]; // {text, reconfirmed} awaiting a one-tap mode choice
  var _useState197 = useState(false),
    _useState198 = _slicedToArray(_useState197, 2),
    brShowProjCtx = _useState198[0],
    setBrShowProjCtx = _useState198[1]; // project-context panel open/closed
  var brMigrationRef = React.useRef(false);
  var _useState199 = useState([]),
    _useState200 = _slicedToArray(_useState199, 2),
    capturesData = _useState200[0],
    setCapturesData = _useState200[1];
  var _useState201 = useState(false),
    _useState202 = _slicedToArray(_useState201, 2),
    capturesLoading = _useState202[0],
    setCapturesLoading = _useState202[1];
  var _useState203 = useState("all"),
    _useState204 = _slicedToArray(_useState203, 2),
    capturesFilter = _useState204[0],
    setCapturesFilter = _useState204[1];
  var _useState205 = useState("captures"),
    _useState206 = _slicedToArray(_useState205, 2),
    journalTab = _useState206[0],
    setJournalTab = _useState206[1];
  var _useState207 = useState(""),
    _useState208 = _slicedToArray(_useState207, 2),
    capturesSearch = _useState208[0],
    setCapturesSearch = _useState208[1];
  var _useState209 = useState(null),
    _useState210 = _slicedToArray(_useState209, 2),
    expandedCapture = _useState210[0],
    setExpandedCapture = _useState210[1];
  var _useState211 = useState(null),
    _useState212 = _slicedToArray(_useState211, 2),
    expandedRefl = _useState212[0],
    setExpandedRefl = _useState212[1];
  var _useState213 = useState(null),
    _useState214 = _slicedToArray(_useState213, 2),
    editCaptureData = _useState214[0],
    setEditCaptureData = _useState214[1];
  var _useState215 = useState(""),
    _useState216 = _slicedToArray(_useState215, 2),
    editCaptureTagStr = _useState216[0],
    setEditCaptureTagStr = _useState216[1];
  var _useState217 = useState(null),
    _useState218 = _slicedToArray(_useState217, 2),
    appVersion = _useState218[0],
    setAppVersion = _useState218[1];
  var _useState219 = useState(null),
    _useState220 = _slicedToArray(_useState219, 2),
    editTaskId = _useState220[0],
    setEditTaskId = _useState220[1];
  var _useState221 = useState({}),
    _useState222 = _slicedToArray(_useState221, 2),
    editTaskForm = _useState222[0],
    setEditTaskForm = _useState222[1];
  var _useState223 = useState(false),
    _useState224 = _slicedToArray(_useState223, 2),
    gymDraftBanner = _useState224[0],
    setGymDraftBanner = _useState224[1];
  var _useState225 = useState(null),
    _useState226 = _slicedToArray(_useState225, 2),
    scheduleTaskId = _useState226[0],
    setScheduleTaskId = _useState226[1];
  var _useState227 = useState(null),
    _useState228 = _slicedToArray(_useState227, 2),
    catFilter = _useState228[0],
    setCatFilter = _useState228[1];
  var _useState229 = useState(null),
    _useState230 = _slicedToArray(_useState229, 2),
    scheduleForDay = _useState230[0],
    setScheduleForDay = _useState230[1];
  var _useState231 = useState("09:00"),
    _useState232 = _slicedToArray(_useState231, 2),
    scheduleTime = _useState232[0],
    setScheduleTime = _useState232[1];
  var _useState233 = useState(60),
    _useState234 = _slicedToArray(_useState233, 2),
    scheduleDuration = _useState234[0],
    setScheduleDuration = _useState234[1];
  var _useState235 = useState(false),
    _useState236 = _slicedToArray(_useState235, 2),
    showTimePicker = _useState236[0],
    setShowTimePicker = _useState236[1];
  var _useState237 = useState(false),
    _useState238 = _slicedToArray(_useState237, 2),
    showArch = _useState238[0],
    setShowArch = _useState238[1];
  var _useState239 = useState(0),
    _useState240 = _slicedToArray(_useState239, 2),
    reflStep = _useState240[0],
    setReflStep = _useState240[1];
  var _useState241 = useState([]),
    _useState242 = _slicedToArray(_useState241, 2),
    reflAns = _useState242[0],
    setReflAns = _useState242[1];
  var _useState243 = useState(""),
    _useState244 = _slicedToArray(_useState243, 2),
    reflIn = _useState244[0],
    setReflIn = _useState244[1];
  var _useState245 = useState(null),
    _useState246 = _slicedToArray(_useState245, 2),
    reflAnalysis = _useState246[0],
    setReflAnalysis = _useState246[1];
  var _useState247 = useState(null),
    _useState248 = _slicedToArray(_useState247, 2),
    modal = _useState248[0],
    setModal = _useState248[1];
  // Modals that own their whole body: they render their own heading and their own
  // Close, and get neither the generic title bar nor the generic Save/Cancel. Save
  // would fall through to saveModal()'s default branch and toast "Saved!" over a no-op.
  var closeOnlyModal = CLOSE_ONLY_MODALS.indexOf(modal) >= 0;
  var _useState249 = useState({}),
    _useState250 = _slicedToArray(_useState249, 2),
    mForm = _useState250[0],
    setMForm = _useState250[1];
  var _useState251 = useState("loading"),
    _useState252 = _slicedToArray(_useState251, 2),
    syncStatus = _useState252[0],
    setSyncStatus = _useState252[1];
  var _useState253 = useState("idle"),
    _useState254 = _slicedToArray(_useState253, 2),
    obsExportStatus = _useState254[0],
    setObsExportStatus = _useState254[1]; // idle | running | done | error
  var _useState255 = useState(null),
    _useState256 = _slicedToArray(_useState255, 2),
    authUser = _useState256[0],
    setAuthUser = _useState256[1];
  var _useState257 = useState(true),
    _useState258 = _slicedToArray(_useState257, 2),
    authLoading = _useState258[0],
    setAuthLoading = _useState258[1];
  var _fbReady = useRef(false);
  var _dataLoaded = useRef(false); // only true after we've confirmed Firebase state
  var _saveTimer = useRef(null);
  var _flushNow = useRef(false); // set to skip the 2s debounce for discrete saves (e.g. shift logs)
  var _useState259 = useState({
      title: "",
      tags: "",
      content: ""
    }),
    _useState260 = _slicedToArray(_useState259, 2),
    docIn = _useState260[0],
    setDocIn = _useState260[1];
  var _useState261 = useState(false),
    _useState262 = _slicedToArray(_useState261, 2),
    forceMob = _useState262[0],
    setForceMob = _useState262[1];
  var _useState263 = useState(function () {
      try {
        return localStorage.getItem("nav_collapsed") === "1";
      } catch (_) {
        return false;
      }
    }),
    _useState264 = _slicedToArray(_useState263, 2),
    navCollapsed = _useState264[0],
    setNavCollapsed = _useState264[1];
  function toggleNav() {
    setNavCollapsed(function (c) {
      var nv = !c;
      try {
        localStorage.setItem("nav_collapsed", nv ? "1" : "0");
      } catch (_) {}
      return nv;
    });
  }
  var rawMob = useIsMob();
  var mob = forceMob || rawMob;
  var _useState265 = useState(false),
    _useState266 = _slicedToArray(_useState265, 2),
    reflAnalysisLoading = _useState266[0],
    setReflAnalysisLoading = _useState266[1];
  var _useState267 = useState(false),
    _useState268 = _slicedToArray(_useState267, 2),
    showMonitor = _useState268[0],
    setShowMonitor = _useState268[1];
  var _useState269 = useState(null),
    _useState270 = _slicedToArray(_useState269, 2),
    toast = _useState270[0],
    setToast = _useState270[1]; // {msg,type:'error'|'success'|'warn'}
  var _useState271 = useState([]),
    _useState272 = _slicedToArray(_useState271, 2),
    errLog = _useState272[0],
    setErrLog = _useState272[1];
  var _useState273 = useState(false),
    _useState274 = _slicedToArray(_useState273, 2),
    showErrPanel = _useState274[0],
    setShowErrPanel = _useState274[1];
  // Google Calendar sync state
  var _useState275 = useState(function () {
      try {
        var c = localStorage.getItem('__gcal_events__');
        return c ? JSON.parse(c) : [];
      } catch (_) {
        return [];
      }
    }),
    _useState276 = _slicedToArray(_useState275, 2),
    gcalEvents = _useState276[0],
    setGcalEvents = _useState276[1];
  var _useState277 = useState(false),
    _useState278 = _slicedToArray(_useState277, 2),
    gcalConnected = _useState278[0],
    setGcalConnected = _useState278[1];
  var _useState279 = useState([]),
    _useState280 = _slicedToArray(_useState279, 2),
    gcalCalendars = _useState280[0],
    setGcalCalendars = _useState280[1];
  var _useState281 = useState(function () {
      try {
        var s = localStorage.getItem('__gcal_selected__');
        return s ? JSON.parse(s) : [];
      } catch (_) {
        return [];
      }
    }),
    _useState282 = _slicedToArray(_useState281, 2),
    gcalSelectedIds = _useState282[0],
    setGcalSelectedIds = _useState282[1];
  var _useState283 = useState(false),
    _useState284 = _slicedToArray(_useState283, 2),
    gcalReady = _useState284[0],
    setGcalReady = _useState284[1];
  var _useState285 = useState(false),
    _useState286 = _slicedToArray(_useState285, 2),
    showCalPicker = _useState286[0],
    setShowCalPicker = _useState286[1];
  // Syllabus / assessment hub state
  var _useState287 = useState(false),
    _useState288 = _slicedToArray(_useState287, 2),
    showSyllabusImport = _useState288[0],
    setShowSyllabusImport = _useState288[1];
  var _useState289 = useState(""),
    _useState290 = _slicedToArray(_useState289, 2),
    syllabusText = _useState290[0],
    setSyllabusText = _useState290[1];
  var _useState291 = useState(""),
    _useState292 = _slicedToArray(_useState291, 2),
    syllabusStart = _useState292[0],
    setSyllabusStart = _useState292[1];
  var _useState293 = useState(function () {
      try {
        return localStorage.getItem('__gemini_key__') || "";
      } catch (_) {
        return "";
      }
    }),
    _useState294 = _slicedToArray(_useState293, 2),
    geminiKey = _useState294[0],
    setGeminiKey = _useState294[1];
  var _useState295 = useState(function () {
      try {
        return localStorage.getItem('__groq_key__') || "";
      } catch (_) {
        return "";
      }
    }),
    _useState296 = _slicedToArray(_useState295, 2),
    groqKey = _useState296[0],
    setGroqKey = _useState296[1];
  var _useState297 = useState(false),
    _useState298 = _slicedToArray(_useState297, 2),
    geminiLoading = _useState298[0],
    setGeminiLoading = _useState298[1];
  var _useState299 = useState(null),
    _useState300 = _slicedToArray(_useState299, 2),
    geminiPreview = _useState300[0],
    setGeminiPreview = _useState300[1];
  var _useState301 = useState(false),
    _useState302 = _slicedToArray(_useState301, 2),
    showAddAssess = _useState302[0],
    setShowAddAssess = _useState302[1];
  var _useState303 = useState({
      subject: data.uni.subjects && data.uni.subjects[0] && data.uni.subjects[0].name || "",
      name: "",
      type: "SUBMISSION",
      date: todayStr()
    }),
    _useState304 = _slicedToArray(_useState303, 2),
    addAssessForm = _useState304[0],
    setAddAssessForm = _useState304[1];
  var _useState305 = useState(function () {
      try {
        var x = localStorage.getItem('__gcal_excluded__');
        return x ? JSON.parse(x) : [];
      } catch (_) {
        return [];
      }
    }),
    _useState306 = _slicedToArray(_useState305, 2),
    gcalExcludedIds = _useState306[0],
    setGcalExcludedIds = _useState306[1];

  // Call this anywhere in App to show a brief auto-dismissing notification.
  // Child components can call window.showToast() which is wired up below.
  function showToast(msg, type) {
    setToast({
      msg: msg,
      type: type || "error"
    });
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () {
      setToast(null);
    }, 3500);
  }
  // Expose globally so FinanceSection and GymSection can reach it without prop drilling
  useEffect(function () {
    window.showToast = showToast;
    return function () {
      window.showToast = null;
    };
  }, []);
  // ESC key cancels active task-scheduling mode
  useEffect(function () {
    function onKey(e) {
      if (e.key === "Escape" && scheduleTaskId) {
        setScheduleTaskId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return function () {
      window.removeEventListener("keydown", onKey);
    };
  }, [scheduleTaskId]);
  // Usage tracking — auto-instrument tab/sub-tab/modal switches (see monitoring-dashboard.js).
  useEffect(function () {
    trk("tab." + page);
  }, [page]);
  useEffect(function () {
    if (page !== "Boardroom") return;
    if (brMigrationRef.current) return;
    var b = data.boardroom || {};
    if (!b.onboarded || !b.northStar) return;
    var goals = b.goals || [];
    if (goals.length > 0) return; // already migrated / has goals — nothing to do
    var km = b.keyMoments || [];
    var onboardingMoment = km.find(function (m) {
      return m.mode === "onboarding";
    });
    brMigrationRef.current = true;
    // Goal-extraction source: the onboarding session summary if one exists, otherwise the
    // North Star — the only surviving artifact when an early consult cleared its transcript.
    var sourceText;
    if (onboardingMoment) {
      sourceText = onboardingMoment.summary + " " + (onboardingMoment.commitments || []).map(function (c) {
        return typeof c === "string" ? c : c.text;
      }).join(", ");
    } else {
      sourceText = b.northStar;
      // Backfill a first-consultation entry so the original consult appears in the Session Log.
      setData(function (p) {
        var pb = p.boardroom || {};
        var pkm = pb.keyMoments || [];
        if (pkm.some(function (m) {
          return m.mode === "onboarding";
        })) return p; // guard double-write
        var seedMoment = {
          date: todayStr(),
          summary: pb.northStar,
          commitments: [],
          mode: "onboarding"
        };
        return _objectSpread(_objectSpread({}, p), {}, {
          boardroom: _objectSpread(_objectSpread({}, pb), {}, {
            keyMoments: [seedMoment].concat(pkm)
          })
        });
      });
    }
    var fakeTranscript = [{
      role: "assistant",
      persona: "Alex",
      text: sourceText
    }];
    BoardroomService.extractGoals(fakeTranscript, []).then(function (proposed) {
      if (proposed && proposed.length) setBrGoalProposals(proposed);
    });
  }, [page]);
  useEffect(function () {
    if (page === "Journal") trk("subtab.Journal." + (journalTab === "reflection" ? "Reflection" : "Captures"));
  }, [page, journalTab]);
  useEffect(function () {
    if (modal) trk("modal." + modal);
  }, [modal]);
  useEffect(function () {
    var targets = new Map();
    var currents = new Map();
    var raf = null;
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    function tick() {
      var anyActive = false;
      targets.forEach(function (t, el) {
        if (!el.isConnected) {
          targets["delete"](el);
          currents["delete"](el);
          return;
        }
        var c = currents.get(el) || {
          cx: t.tx,
          cy: t.ty
        };
        c.cx = lerp(c.cx, t.tx, 0.10);
        c.cy = lerp(c.cy, t.ty, 0.10);
        el.style.setProperty('--mouse-x', c.cx.toFixed(2) + '%');
        el.style.setProperty('--mouse-y', c.cy.toFixed(2) + '%');
        currents.set(el, c);
        if (Math.abs(c.cx - t.tx) > 0.05 || Math.abs(c.cy - t.ty) > 0.05) anyActive = true;
      });
      raf = anyActive ? requestAnimationFrame(tick) : null;
    }
    function onMove(e) {
      var el = e.target.closest('.card-rim,.glow-item');
      if (!el) return;
      var r = el.getBoundingClientRect();
      targets.set(el, {
        tx: (e.clientX - r.left) / r.width * 100,
        ty: (e.clientY - r.top) / r.height * 100
      });
      if (!raf) raf = requestAnimationFrame(tick);
    }
    document.addEventListener('mousemove', onMove);
    return function () {
      document.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Wire GCalSync callbacks so gcal-sync.js can push into React state
  useEffect(function () {
    window.__dashSetGcalEvents = function (evs) {
      setGcalEvents(evs || []);
    };
    window.__dashSetGcalConnected = function (v) {
      setGcalConnected(!!v);
    };
    window.__dashSetGcalCalendars = function (cs) {
      setGcalCalendars(cs || []);
    };
    window.__dashSetGcalSelectedIds = function (ids) {
      setGcalSelectedIds(ids || []);
    };
    window.__dashSetGcalReady = function () {
      setGcalReady(true);
    };
    return function () {
      window.__dashSetGcalEvents = null;
      window.__dashSetGcalConnected = null;
      window.__dashSetGcalCalendars = null;
      window.__dashSetGcalSelectedIds = null;
      window.__dashSetGcalReady = null;
    };
  }, []);

  // Capture an error: log to console, add to errLog, show toast
  function captureError(err, fnName) {
    var entry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      fn: fnName || "unknown",
      msg: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack.split("\n").slice(0, 6).join("\n") : ""
    };
    console.error("[Dashboard] Error in " + entry.fn + ": " + entry.msg);
    if (err && err.stack) console.error(err.stack);
    setErrLog(function (prev) {
      return [entry].concat(prev).slice(0, 20);
    });
    setShowErrPanel(true);
    showToast("Error in " + entry.fn + ": " + entry.msg.slice(0, 80), "error");
  }
  // Wire the global pre-React onerror/unhandledrejection to our errLog state
  useEffect(function () {
    window.__dashAddError = function (entry) {
      setErrLog(function (p) {
        return [entry].concat(p).slice(0, 20);
      });
      setShowErrPanel(true);
      showToast("Error in " + entry.fn + ": " + entry.msg.slice(0, 80), "error");
    };
    // Flush any errors that fired before React mounted
    var q = window.__dashErrQueue || [];
    q.forEach(function (e) {
      window.__dashAddError(e);
    });
    window.__dashErrQueue = [];
    return function () {
      window.__dashAddError = null;
    };
  }, []);

  // Listen for auth state — sets DASH_DOC to users/{uid} once signed in
  useEffect(function () {
    // Persist the session locally (helps iOS Safari stay signed in) and complete any
    // redirect-based sign-in started on mobile (where popups are unreliable / blocked).
    // setPersistence returns a promise — chain (don't try/catch) so a rejected persistence write
    // (e.g. iOS Safari Private mode blocking storage) degrades gracefully instead of becoming an
    // unhandled rejection, then complete any redirect sign-in.
    _auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)["catch"](function () {
      return _auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    })["catch"](function () {
      return _auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
    })["catch"](function () {}).then(function () {
      return _auth.getRedirectResult();
    })["catch"](function (e) {
      if (e && e.code !== "auth/no-auth-event" && window.ErrorHandler) ErrorHandler.warn("Sign-in failed: " + e.message, "auth");
    });
    var unsub = _auth.onAuthStateChanged(function (user) {
      window._currentUser = user;
      if (user) {
        window.DASH_DOC = _db.collection('users').doc(user.uid);
        setAuthUser(user);
      } else {
        window.DASH_DOC = null;
        setAuthUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);
  // Re-read the evening-nudge flag from Firestore when the tab regains focus,
  // so the cron's nudgePending survives the dashboard's full-document auto-save.
  useEffect(function () {
    function checkNudge() {
      if (document.hidden || !window.DASH_DOC) return;
      window.DASH_DOC.get().then(function (doc) {
        var sd = doc && doc.exists ? doc.data() : null;
        var pending = sd && sd.dashData && sd.dashData.boardroom && sd.dashData.boardroom.nudgePending;
        if (pending) {
          setData(function (p) {
            if (p.boardroom && p.boardroom.nudgePending) return p;
            return _objectSpread(_objectSpread({}, p), {}, {
              boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
                nudgePending: true
              })
            });
          });
        }
      })["catch"](function () {});
    }
    document.addEventListener("visibilitychange", checkNudge);
    window.addEventListener("focus", checkNudge);
    checkNudge();
    return function () {
      document.removeEventListener("visibilitychange", checkNudge);
      window.removeEventListener("focus", checkNudge);
    };
  }, []);
  // Load from Firestore once auth user is known — runs migration first if needed
  useEffect(function () {
    if (!authUser || !window.DASH_DOC) {
      if (!authLoading) setSyncStatus("offline");
      return;
    }
    _fbReady.current = false;
    var MIGRATED_KEY = 'dash_migrated_' + authUser.uid;
    var alreadyMigrated = localStorage.getItem(MIGRATED_KEY) === '1';
    var rawLocal = localStorage.getItem('dash_v1');
    function loadFromFirestore() {
      window.DASH_DOC.get().then(function (doc) {
        var safeToEnableSaves = true;
        if (doc.exists) {
          var cloud = doc.data().dashData;
          if (cloud) {
            var fin = cloud.finance || {};
            if (!fin.financeVersion || fin.financeVersion < 2) cloud = _objectSpread(_objectSpread({}, cloud), {}, {
              finance: INIT.finance
            });
            // Write a rolling daily backup to localStorage the moment we load from Firestore.
            // This ensures recovery is always possible even if a future session corrupts Firestore.
            try {
              var bk = 'dash_backup_' + new Date().toISOString().slice(0, 10);
              localStorage.setItem(bk, JSON.stringify(cloud));
              var bks = Object.keys(localStorage).filter(function (k) {
                return k.startsWith('dash_backup_');
              }).sort();
              while (bks.length > 3) {
                try {
                  localStorage.removeItem(bks.shift());
                } catch (_) {}
              }
            } catch (_) {}
            setData(mergeWithDefaults(cloud));
          } else {
            // Doc exists but dashData field is missing/falsy. This is the wipe edge case:
            // enabling saves here would let the next state change overwrite Firestore with
            // React seed defaults. Refuse to enable saves and surface the failure mode loudly.
            console.error("[Firestore] Doc exists but dashData is missing — refusing to enable saves to prevent overwrite. Investigate the doc manually.");
            safeToEnableSaves = false;
          }
          // Restore cross-device settings if not already set locally
          var settings = doc.data().settings || {};
          if (settings.geminiKey && !localStorage.getItem('__gemini_key__')) {
            var restoredKey = settings.geminiKey.trim();
            setGeminiKey(restoredKey);
            try {
              localStorage.setItem('__gemini_key__', restoredKey);
            } catch (_) {}
          }
          if (settings.groqKey && !localStorage.getItem('__groq_key__')) {
            var restoredGroq = settings.groqKey.trim();
            setGroqKey(restoredGroq);
            try {
              localStorage.setItem('__groq_key__', restoredGroq);
            } catch (_) {}
          }
          if (settings.gcalSelected && !localStorage.getItem('__gcal_selected__')) {
            setGcalSelectedIds(settings.gcalSelected);
            try {
              localStorage.setItem('__gcal_selected__', JSON.stringify(settings.gcalSelected));
            } catch (_) {}
            if (window.GCalSync) window.GCalSync.setSelectedIds(settings.gcalSelected);
          }
          if (settings.gcalExcluded && !localStorage.getItem('__gcal_excluded__')) {
            setGcalExcludedIds(settings.gcalExcluded);
            try {
              localStorage.setItem('__gcal_excluded__', JSON.stringify(settings.gcalExcluded));
            } catch (_) {}
          }
        }
        if (safeToEnableSaves) {
          _dataLoaded.current = true;
          _fbReady.current = true;
          setSyncStatus("synced");
        } else {
          setSyncStatus("offline");
          try {
            showToast("Cloud data field missing. Saves disabled. Contact dev to investigate.", "error");
          } catch (_) {}
        }
      })["catch"](function (err) {
        console.error("[Firestore] Load failed:", err);
        // IMPORTANT: do NOT set _fbReady or _dataLoaded on error.
        // If we did, the empty initial state would get saved over real Firestore data
        // on the next user interaction. Stay in offline mode instead.
        setSyncStatus("offline");
      });
    }

    // Run migration only if: not already migrated AND local data exists
    if (!alreadyMigrated && rawLocal) {
      var parsed;
      try {
        parsed = JSON.parse(rawLocal);
      } catch (e) {
        console.warn("[Migration] Failed to parse localStorage data:", e);
        localStorage.setItem(MIGRATED_KEY, '1');
        loadFromFirestore();
        return;
      }

      // SAFETY: refuse to migrate seed-shaped local data. dash_v1 is written from React
      // state by the save effect — including the initial seed state — so on a fresh browser
      // it contains defaults, not real user data. Uploading that to Firestore would wipe
      // whatever the user actually has in the cloud.
      if (isLikelySeedState(mergeWithDefaults(parsed))) {
        console.warn("[Migration] localStorage data looks seed-shaped — skipping upload to prevent Firestore overwrite. Loading from Firestore instead.");
        localStorage.setItem(MIGRATED_KEY, '1');
        loadFromFirestore();
        return;
      }
      showToast("Migrating your saved data to the cloud…", "warn");
      window.DASH_DOC.set({
        dashData: stripUndefined(mergeWithDefaults(parsed))
      }).then(function () {
        localStorage.setItem(MIGRATED_KEY, '1');
        localStorage.removeItem('dash_v1');
        showToast("Migration complete! Your data is now synced.", "success");
        _dataLoaded.current = true;
        _fbReady.current = true;
        setSyncStatus("synced");
        setData(mergeWithDefaults(parsed));
      })["catch"](function (err) {
        console.error("[Migration] Upload failed:", err);
        showToast("Migration failed. Your data is still saved locally.", "error");
        // Do NOT set _fbReady on migration failure — local data is still in dash_v1
        // and we don't want to risk overwriting Firestore with anything
        setSyncStatus("offline");
      });
    } else {
      loadFromFirestore();
    }
  }, [authUser]);
  // Save to localStorage immediately + Firestore (debounced 2s)
  useEffect(function () {
    try {
      localStorage.setItem("dash_v1", JSON.stringify(data));
    } catch (_) {}
    // Require BOTH flags: _fbReady (connected) AND _dataLoaded (confirmed Firebase state).
    // This prevents the race condition where empty initial state saves over real Firestore data
    // when opening the dashboard on a new device before Firebase finishes loading.
    if (!_fbReady.current || !_dataLoaded.current || !window.DASH_DOC) return;
    // SAFETY: never save seed-shaped state. If ALL user-generated arrays are empty, this is
    // almost certainly React initial state and saving would wipe real cloud data. The 2026-05-29
    // wipe happened here. Refuse the write and surface it loudly.
    if (isLikelySeedState(data)) {
      console.error("[SAFETY] Refused to save seed-shaped state to Firestore — would have wiped real data. State:", data);
      try {
        showToast("Refused to save empty state. Possible bug, data not synced.", "error");
      } catch (_) {}
      setSyncStatus("offline");
      return;
    }
    setSyncStatus("syncing");
    if (_saveTimer.current) clearTimeout(_saveTimer.current);
    // Discrete actions (saving a shift diary, marking attended) request an immediate flush so a
    // quick refresh can't lose them; ordinary typing keeps the 2s debounce.
    var delay = _flushNow.current ? 0 : 2000;
    _flushNow.current = false;
    _saveTimer.current = setTimeout(function () {
      window.DASH_DOC.set({
        dashData: stripUndefined(data)
      }).then(function () {
        setSyncStatus("synced");
      })["catch"](function (e) {
        console.error("[Firestore] Write failed:", e.message);
        setSyncStatus("offline");
      });
    }, delay);
  }, [data]);
  useEffect(function () {
    if (!_fbReady.current || !_dataLoaded.current || !window.DASH_DOC) return;
    window.DASH_DOC.set({
      settings: {
        geminiKey: geminiKey,
        groqKey: groqKey,
        gcalSelected: gcalSelectedIds,
        gcalExcluded: gcalExcludedIds
      }
    }, {
      merge: true
    })["catch"](function () {});
  }, [geminiKey, groqKey, gcalSelectedIds, gcalExcludedIds]);
  // Start health monitor (runs checks every 30s)
  useEffect(function () {
    if (window.HealthMonitor) {
      HealthMonitor.start();
    }
    return function () {
      if (window.HealthMonitor) HealthMonitor.stop();
    };
  }, []);
  // Fetch version badge from version.json written by release workflow
  useEffect(function () {
    fetch("version.json?_=" + Date.now()).then(function (r) {
      return r.ok ? r.json() : null;
    }).then(function (d) {
      if (d && d.version) setAppVersion(d);
    })["catch"](function () {});
  }, []);
  useEffect(function () {
    if (page !== "Journal" || journalTab !== "captures" || !window._currentUser || !window._db) return;
    setCapturesLoading(true);
    _db.collection('users').doc(window._currentUser.uid).collection('captures').get().then(function (snap) {
      var items = [];
      snap.forEach(function (doc) {
        items.push(_objectSpread({
          id: doc.id
        }, doc.data()));
      });
      items.sort(function (a, b) {
        var ta = a.date && a.date.toDate ? a.date.toDate().getTime() : 0;
        var tb = b.date && b.date.toDate ? b.date.toDate().getTime() : 0;
        return tb - ta;
      });
      setCapturesData(items);
      setCapturesLoading(false);
    })["catch"](function () {
      setCapturesLoading(false);
    });
  }, [page, journalTab]);
  var baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + wkOff * 7);
  var weekDates = getWeekDates(baseDate);
  var thisWeek = weekMonday();
  var bwLogged = data.gym.lastBWWeek === thisWeek;
  var dow = new Date().getDay();
  var dLeft = dow === 0 ? 0 : 7 - dow;
  var bwUrg = bwLogged ? "done" : dLeft >= 4 ? "blue" : dLeft >= 2 ? "yellow" : "red";
  var bwColMap = {
    blue: T.accent,
    yellow: T.warn,
    red: T.danger,
    done: T.success
  };
  var gymRot = data.gym.rotation || [];
  var gymRotLen = gymRot.length > 0 ? gymRot.length : 1;
  var gymRotIdx = (data.gym.rotIdx || 0) % gymRotLen;
  var nextRot = gymRot.length > 0 ? gymRot[gymRotIdx] : null;
  var dedupedEvents = dedupeEvents(gcalEvents);
  var visibleGcalEvents = dedupedEvents.filter(function (ev) {
    if (gcalExcludedIds.indexOf(ev.calId) !== -1) return false;
    if (gcalSelectedIds.length === 0) return true;
    return gcalSelectedIds.indexOf(ev.calId) !== -1;
  });
  function toggleExclude(calId) {
    setGcalExcludedIds(function (prev) {
      var next = prev.indexOf(calId) !== -1 ? prev.filter(function (x) {
        return x !== calId;
      }) : prev.concat([calId]);
      try {
        localStorage.setItem('__gcal_excluded__', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }
  // Assessment helpers
  function typeBadge(type) {
    if (type === "IN-CLASS") return {
      label: "IN-CLASS",
      bg: "rgba(255,154,60,0.12)",
      color: "#ffb06a",
      border: "rgba(255,154,60,0.28)"
    };
    if (type === "EXAM") return {
      label: "EXAM",
      bg: "rgba(255,107,107,0.12)",
      color: "#ff9090",
      border: "rgba(255,107,107,0.28)"
    };
    if (type === "SUBMISSION") return {
      label: "SUBMISSION",
      bg: "rgba(91,140,255,0.12)",
      color: "#8eb4ff",
      border: "rgba(91,140,255,0.28)"
    };
    return {
      label: "ASSESSMENT",
      bg: "rgba(255,209,102,0.12)",
      color: "#ffd166",
      border: "rgba(255,209,102,0.28)"
    };
  }
  // Upcoming pulls from structured assessments — no GCal keyword matching needed
  var allAssessments = data.uni.assessments || SYLLABUS_ASSESSMENTS;
  var upcoming = allAssessments.filter(function (a) {
    return !a.done && a.date >= todayStr();
  }).sort(function (a, b) {
    return a.date.localeCompare(b.date);
  }).slice(0, 8).map(function (a) {
    return {
      id: a.id,
      title: a.name,
      date: a.date,
      subject: a.subject,
      badge: typeBadge(a.type)
    };
  });
  var doneTasks = data.personal.tasks.filter(function (t) {
    return t.done;
  });
  var todayEvs = visibleGcalEvents.filter(function (ev) {
    return ev.date === todayStr() && !ev.allDay;
  }).sort(function (a, b) {
    return (a.time || "").localeCompare(b.time || "");
  });
  var shifts = visibleGcalEvents.filter(isGoTabEvent);
  var homeLayout = React.useMemo(function () {
    return window.HomeLayout.normalizeLayout(data.homeLayout);
  }, [data.homeLayout]);

  // What Jarvis is going to say. Derived state only — never written to `data`,
  // so ranking causes no Firestore traffic and no backup churn.
  // `money` is not wired yet: the pay-cycle maths lives inside WorkSection, and
  // lifting it is its own change. jarvis-signals.js treats absent money as
  // "not configured" and stays quiet about it rather than guessing.
  var jarvisCandidates = React.useMemo(function () {
    return window.JarvisSignals.rank({
      data: data,
      gcalEvents: dedupedEvents,
      today: todayStr(),
      // Computed by the same function the Finance tab renders from, never
      // recomputed inside the signals module.
      money: jarvisMoney(data, dedupedEvents)
    });
  }, [data, dedupedEvents]);
  var _useState307 = useState(false),
    _useState308 = _slicedToArray(_useState307, 2),
    layoutEditing = _useState308[0],
    setLayoutEditing = _useState308[1];
  var _useState309 = useState(null),
    _useState310 = _slicedToArray(_useState309, 2),
    dragId = _useState310[0],
    setDragId = _useState310[1];
  var _useState311 = useState(null),
    _useState312 = _slicedToArray(_useState311, 2),
    dropIdx = _useState312[0],
    setDropIdx = _useState312[1];
  function saveLayout(next) {
    trk("home.layout_save");
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        homeLayout: next
      });
    });
  }
  React.useEffect(function () {
    if (!dragId) return;
    function clear() {
      setDragId(null);
      setDropIdx(null);
    }
    function commit() {
      var from = homeLayout.findIndex(function (x) {
        return x.id === dragId;
      });
      if (from >= 0 && dropIdx !== null && dropIdx !== from) {
        saveLayout(window.HomeLayout.moveCard(homeLayout, from, dropIdx));
      }
      clear();
    }
    function disarmIfReleased(ev) {
      if (ev.buttons === 0) clear();
    }
    window.addEventListener("pointerup", commit);
    window.addEventListener("pointercancel", clear);
    window.addEventListener("pointermove", disarmIfReleased);
    window.addEventListener("blur", clear);
    return function () {
      window.removeEventListener("pointerup", commit);
      window.removeEventListener("pointercancel", clear);
      window.removeEventListener("pointermove", disarmIfReleased);
      window.removeEventListener("blur", clear);
    };
  }, [dragId, dropIdx, homeLayout]);
  function toggleCalEv(id) {
    trk("uni.gcal_event_toggle");
    setData(function (p) {
      var ce = p.uni.completedEvents || [];
      var next = ce.indexOf(id) !== -1 ? ce.filter(function (x) {
        return x !== id;
      }) : ce.concat([id]);
      return _objectSpread(_objectSpread({}, p), {}, {
        uni: _objectSpread(_objectSpread({}, p.uni), {}, {
          completedEvents: next
        })
      });
    });
  }
  function brOpener(mode) {
    if (mode === "evening") {
      return [{
        role: "assistant",
        persona: "Chris",
        text: "Walk me through your day. What actually happened, not the highlight reel?",
        ts: Date.now()
      }];
    }
    if (mode === "drift") {
      return [{
        role: "assistant",
        persona: "Chris",
        text: "You opened this in the middle of the day. That usually means something's off. What's going on right now?",
        ts: Date.now()
      }];
    }
    return [];
  }
  function brOpen() {
    trk("boardroom.open");
    setShowBoardroom(true);
    var b = data.boardroom || {};
    if (b.nudgePending) {
      setData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
            nudgePending: false
          })
        });
      });
    }
    if (brMessages && brMessages.length) return;
    if (b.messages && b.messages.length) {
      setBrMessages(b.messages);
      if (b.lastSpeaker) setBrLastSpeaker(b.lastSpeaker);
      return;
    }
    if (!b.onboarded) {
      setBrMessages([{
        role: "assistant",
        persona: "Chris",
        text: "Before we get into tasks, I want to understand you, not just your to-do list. What does \"better\" actually look like for you right now?",
        ts: Date.now()
      }]);
      setBrLastSpeaker("Chris");
    } else {
      var seed = brOpener(brSessionMode());
      if (seed.length) {
        setBrMessages(seed);
        setBrLastSpeaker(seed[seed.length - 1].persona);
      }
    }
  }
  function brSessionMode() {
    var h = new Date().getHours();
    if (!(data.boardroom && data.boardroom.onboarded)) return "onboarding";
    if (h >= 17) return "evening";
    return "drift";
  }
  function brSend() {
    var text = brInput.trim();
    if (!text || brLoading) return;
    if (!groqKey.trim()) {
      showToast("Add your Groq API key in Settings first", "warn");
      return;
    }
    var hist = brMessages.map(function (m) {
      return m.role === "user" ? {
        role: "user",
        content: m.text
      } : {
        role: "assistant",
        content: m.persona + ": " + m.text
      };
    }); // history BEFORE this message
    var userMsg = {
      role: "user",
      persona: null,
      text: text,
      ts: Date.now()
    };
    setBrMessages(function (p) {
      return p.concat([userMsg]);
    });
    setBrInput("");
    var intent = BoardroomService.detectMode(text);
    var wasPending = brPendingIntent;
    if (intent === "ambiguous") {
      if (wasPending && wasPending.reconfirmed) {
        brRun(text, "direction", hist, userMsg);
        return;
      } // asked twice — stop guessing, default to direction
      setBrPendingIntent({
        text: text,
        hist: hist,
        userMsg: userMsg,
        reconfirmed: !!wasPending
      }); // UI shows the one-tap confirm; no model call
      return;
    }
    setBrPendingIntent(null);
    brRun(text, intent, hist, userMsg);
  }
  // Tap-to-confirm when intent was ambiguous: route the original message to the chosen mode.
  function brConfirmIntent(intent) {
    if (!brPendingIntent) return;
    var pi = brPendingIntent;
    setBrPendingIntent(null);
    brRun(pi.text, intent, pi.hist, pi.userMsg);
  }
  // Shared runner: 'direction' → deliberation loop, 'howto' → step-by-step. userMsg is already rendered; hist is the history before it.
  function brRun(text, intent, hist, userMsg) {
    setBrLoading(true);
    setBrIntentMode(intent);
    var mode = brSessionMode();
    var cachedEvs = [];
    try {
      var ce = localStorage.getItem('__gcal_events__');
      if (ce) cachedEvs = JSON.parse(ce);
    } catch (_) {}
    var ctx = BoardroomService.buildContext(data, {
      todayStr: todayStr,
      dStr: dStr,
      daysBetween: daysBetween,
      isGoTabEvent: isGoTabEvent,
      thisWeek: thisWeek,
      cachedEvs: cachedEvs
    });
    var ns = data.boardroom && data.boardroom.northStar || "";
    var km = data.boardroom && data.boardroom.keyMoments || [];
    var goals = data.boardroom && data.boardroom.goals || [];
    var projectContext = data.boardroom && data.boardroom.projectContext || "";
    var coachMsgs = [];
    var onTurn = function onTurn(turn) {
      var m = {
        role: "assistant",
        persona: turn.persona,
        text: turn.text,
        ts: Date.now()
      };
      coachMsgs.push(m);
      setBrMessages(function (p) {
        return p.concat([m]);
      });
    };
    var run = intent === "howto" ? BoardroomService.howTo(ctx, ns, goals, projectContext, mode, hist, text, onTurn) : BoardroomService.deliberate(ctx, ns, km, goals, mode, hist, text, onTurn);
    run.then(function (replies) {
      var last = replies && replies.length ? replies[replies.length - 1].persona : "Chris";
      setBrLastSpeaker(last);
      setData(function (p) {
        var msgs = p.boardroom && p.boardroom.messages || [];
        return _objectSpread(_objectSpread({}, p), {}, {
          boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
            messages: msgs.concat([userMsg].concat(coachMsgs)),
            sessionStartedAt: p.boardroom && p.boardroom.sessionStartedAt || new Date().toISOString(),
            lastSpeaker: last
          })
        });
      });
      setBrLoading(false);
    })["catch"](function (e) {
      // Preserve any turns that already streamed before the error (e.g. a 429 mid-deliberation).
      if (coachMsgs.length) {
        setBrLastSpeaker(coachMsgs[coachMsgs.length - 1].persona);
        setData(function (p) {
          var msgs = p.boardroom && p.boardroom.messages || [];
          return _objectSpread(_objectSpread({}, p), {}, {
            boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
              messages: msgs.concat([userMsg].concat(coachMsgs)),
              sessionStartedAt: p.boardroom && p.boardroom.sessionStartedAt || new Date().toISOString()
            })
          });
        });
      }
      if (e && e.rateLimited) showToast("Boardroom paused. Groq's free limit was hit. Wait ~30s, then continue.", "warn");else showToast("Boardroom: " + (e && e.message || "error"), "error");
      setBrLoading(false);
    });
  }
  function brEndSession() {
    if (brMessages.filter(function (m) {
      return m.role === "user";
    }).length < 1) {
      setShowBoardroom(false);
      return;
    }
    if (!groqKey.trim()) {
      showToast("Groq API key missing or invalid · session couldn't be saved. Add it in Settings, then end the session again.", "warn");
      return;
    }
    setBrLoading(true);
    setBrClosing(true);
    var mode = brSessionMode();
    var fullTranscript = brMessages.slice();
    var existingNS = data.boardroom && data.boardroom.northStar || "";
    BoardroomService.closingRound(fullTranscript, existingNS).then(function (closingMsgs) {
      var allMsgs = fullTranscript.concat(closingMsgs.map(function (m) {
        return {
          role: "assistant",
          persona: m.persona,
          text: m.text,
          ts: Date.now()
        };
      }));
      setBrMessages(function (p) {
        return p.concat(closingMsgs.map(function (m) {
          return {
            role: "assistant",
            persona: m.persona,
            text: m.text,
            ts: Date.now()
          };
        }));
      });
      return BoardroomService.summarizeSession(allMsgs, mode).then(function (km) {
        var newMoment = {
          date: todayStr(),
          summary: km.summary,
          commitments: (km.commitments || []).map(function (c) {
            return {
              text: c,
              done: false
            };
          }),
          mode: mode,
          transcript: allMsgs.map(function (m) {
            return {
              role: m.role,
              persona: m.persona || null,
              text: m.text
            };
          })
        };
        // Surface the session's commitments as addable to-do tasks so a concluded session
        // always leaves Jayden with something actionable (even if no long-term goal surfaced).
        setBrTaskProposals((km.commitments || []).map(function (c) {
          return typeof c === "string" ? c : c && c.text || "";
        }).filter(Boolean));
        var prev = data.boardroom && data.boardroom.keyMoments || [];
        var existingGoals = data.boardroom && data.boardroom.goals || [];
        function finishSave(moments, nsVal) {
          setData(function (p) {
            return _objectSpread(_objectSpread({}, p), {}, {
              boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
                northStar: nsVal || p.boardroom && p.boardroom.northStar || "",
                keyMoments: moments,
                messages: [],
                sessionStartedAt: null,
                lastSpeaker: null
              })
            });
          });
          setBrMessages([]);
          setBrLastSpeaker(null);
          setBrClosing(false);
          setBrLoading(false);
          setShowBoardroom(false);
          showToast(nsVal && !existingNS ? "Session saved · North Star set" : "Session saved", "success");
          setPage("Boardroom");
        }
        function saveWithGoals(moments, nsVal) {
          BoardroomService.extractGoals(allMsgs, existingGoals).then(function (proposed) {
            setBrGoalProposals(proposed || []);
            if (prev.length >= 15) {
              BoardroomService.amalgamate(prev.slice(0, 10)).then(function (patterns) {
                var compacted = patterns.map(function (s) {
                  return {
                    date: "pattern",
                    summary: s,
                    commitments: [],
                    mode: "amalgamated"
                  };
                });
                finishSave(compacted.concat(prev.slice(10)).concat([moments]), nsVal);
              })["catch"](function () {
                finishSave(prev.concat([moments]).slice(-15), nsVal);
              });
            } else {
              finishSave(prev.concat([moments]), nsVal);
            }
          })["catch"](function () {
            finishSave(prev.concat([moments]).slice(-15), nsVal);
          });
        }
        // Ensure a North Star is defined — synthesise one from this session if none exists yet,
        // so the conclusion always anchors short-term steps to a long-term direction.
        if (existingNS) {
          saveWithGoals(newMoment, existingNS);
        } else {
          BoardroomService.buildNorthStar(allMsgs).then(function (ns) {
            saveWithGoals(newMoment, (ns || "").trim());
          })["catch"](function () {
            saveWithGoals(newMoment, "");
          });
        }
      });
    })["catch"](function (e) {
      setBrClosing(false);
      setBrLoading(false);
      showToast("Couldn't save the session: " + (e && e.message || "unknown error") + ". Try ending it again.", "error");
    });
  }
  function brAcceptGoal(proposed) {
    var newGoal = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      title: proposed.title,
      area: proposed.area,
      status: "active",
      createdAt: todayStr(),
      targetDate: null,
      achievedAt: null,
      milestones: []
    };
    setData(function (p) {
      var goals = p.boardroom && p.boardroom.goals || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
          goals: goals.concat([newGoal])
        })
      });
    });
    setBrGoalProposals(function (p) {
      return p.filter(function (g) {
        return g.title !== proposed.title;
      });
    });
  }
  function brSkipGoal(proposed) {
    setBrGoalProposals(function (p) {
      return p.filter(function (g) {
        return g.title !== proposed.title;
      });
    });
  }
  function brAcceptTask(text) {
    setData(function (p) {
      var ts = p.personal && p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.concat([{
            id: Date.now(),
            name: text,
            cat: "Errands",
            priority: "normal",
            due: null,
            done: false,
            addedAt: todayStr(),
            editedAt: null,
            state: "todo",
            updates: []
          }])
        })
      });
    });
    setBrTaskProposals(function (p) {
      return p.filter(function (t) {
        return t !== text;
      });
    });
    showToast("Task added", "success");
  }
  function brSkipTask(text) {
    setBrTaskProposals(function (p) {
      return p.filter(function (t) {
        return t !== text;
      });
    });
  }
  function brMarkGoalAchieved(goalId) {
    setData(function (p) {
      var goals = p.boardroom && p.boardroom.goals || [];
      var updated = goals.map(function (g) {
        return g.id === goalId ? _objectSpread(_objectSpread({}, g), {}, {
          status: "achieved",
          achievedAt: todayStr()
        }) : g;
      });
      return _objectSpread(_objectSpread({}, p), {}, {
        boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
          goals: updated
        })
      });
    });
  }
  function brToggleCommitment(momentIdx, commitIdx) {
    setData(function (p) {
      var km = p.boardroom && p.boardroom.keyMoments || [];
      var updated = km.map(function (m, mi) {
        if (mi !== momentIdx) return m;
        var commits = m.commitments || [];
        var newCommits = commits.map(function (c, ci) {
          if (ci !== commitIdx) return c;
          if (typeof c === 'string') return c;
          return _objectSpread(_objectSpread({}, c), {}, {
            done: !c.done
          });
        });
        return _objectSpread(_objectSpread({}, m), {}, {
          commitments: newCommits
        });
      });
      return _objectSpread(_objectSpread({}, p), {}, {
        boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
          keyMoments: updated
        })
      });
    });
  }
  function brFinishOnboarding() {
    if (brMessages.filter(function (m) {
      return m.role === "user";
    }).length < 1) {
      showToast("Chat a bit first so we can set your North Star", "warn");
      return;
    }
    setBrLoading(true);
    var transcript = brMessages.slice();
    var existingGoals = data.boardroom && data.boardroom.goals || [];
    BoardroomService.buildNorthStar(transcript).then(function (ns) {
      return BoardroomService.summarizeSession(transcript, "onboarding").then(function (km) {
        var moment = {
          date: todayStr(),
          summary: km.summary,
          commitments: (km.commitments || []).map(function (c) {
            return {
              text: c,
              done: false
            };
          }),
          mode: "onboarding",
          transcript: transcript.map(function (m) {
            return {
              role: m.role,
              persona: m.persona || null,
              text: m.text
            };
          })
        };
        setData(function (p) {
          var pb = p.boardroom || {};
          var pkm = pb.keyMoments || [];
          return _objectSpread(_objectSpread({}, p), {}, {
            boardroom: _objectSpread(_objectSpread({}, pb), {}, {
              onboarded: true,
              northStar: (ns || "").trim(),
              keyMoments: pkm.concat([moment]),
              messages: [],
              sessionStartedAt: null,
              lastSpeaker: null
            })
          });
        });
        BoardroomService.extractGoals(transcript, existingGoals).then(function (proposed) {
          setBrGoalProposals(proposed || []);
        })["catch"](function () {});
        setBrTaskProposals((km.commitments || []).map(function (c) {
          return typeof c === "string" ? c : c && c.text || "";
        }).filter(Boolean));
        setBrMessages([]);
        setBrLastSpeaker(null);
        setBrLoading(false);
        setShowBoardroom(false);
        showToast("North Star set. The Boardroom knows your direction now.", "success");
        setPage("Boardroom");
      });
    })["catch"](function (e) {
      setBrLoading(false);
      showToast("Couldn't finish setup: " + (e && e.message || "error"), "error");
    });
  }
  function brRedoConsultation() {
    if (!window.confirm("Start a fresh consultation? It sets a new North Star. Your current one is kept in the Session Log below, and your goals and history stay untouched.")) return;
    trk("boardroom.redo");
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
          onboarded: false,
          messages: [],
          sessionStartedAt: null,
          lastSpeaker: null
        })
      });
    });
    setBrMessages([{
      role: "assistant",
      persona: "Chris",
      text: "Let's reset and go deep again. What does \"better\" actually look like for you right now, today, not in theory?",
      ts: Date.now()
    }]);
    setBrLastSpeaker("Chris");
    setShowBoardroom(true);
  }
  // ── Backup & restore helpers ───────────────────────────────────────────────
  function getLatestBackup() {
    try {
      var bks = Object.keys(localStorage).filter(function (k) {
        return k.startsWith('dash_backup_');
      }).sort();
      if (bks.length === 0) return null;
      var raw = localStorage.getItem(bks[bks.length - 1]);
      if (!raw) return null;
      return {
        key: bks[bks.length - 1],
        data: JSON.parse(raw)
      };
    } catch (_) {
      return null;
    }
  }
  function exportData() {
    try {
      var blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "dashboard-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
    } catch (e) {
      showToast("Export failed: " + e.message, "error");
    }
  }
  function downloadObsidianExport() {
    if (!window._currentUser) {
      showToast("Sign in first", "error");
      return;
    }
    if (capturesData.length === 0) {
      showToast("Visit the Journal → Captures tab first so they load, then try again", "warn");
      return;
    }
    var payload = {
      exportedAt: new Date().toISOString(),
      captures: capturesData,
      reflections: data.reflections || []
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "obsidian-export.json";
    a.click();
    showToast("Downloaded. Move to my-project folder then run: node export-to-obsidian.js", "success");
  }
  function restoreFromBackup() {
    var bk = getLatestBackup();
    if (!bk) {
      showToast("No local backup found", "error");
      return;
    }
    var merged = mergeWithDefaults(bk.data);
    setData(merged);
    // Also push to Firestore immediately if connected
    if (_fbReady.current && _dataLoaded.current && window.DASH_DOC) {
      window.DASH_DOC.set({
        dashData: stripUndefined(merged)
      }).then(function () {
        showToast("Restored from backup (" + bk.key.replace("dash_backup_", "") + ") and saved to cloud", "success");
        setSyncStatus("synced");
      })["catch"](function () {
        showToast("Restored locally, cloud sync failed", "warn");
      });
    } else {
      showToast("Restored from backup (" + bk.key.replace("dash_backup_", "") + "). Reconnect to sync to cloud.", "success");
    }
  }
  function toggleAssessmentDone(id) {
    trk("uni.assessment_complete");
    setData(function (p) {
      var as = p.uni.assessments || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        uni: _objectSpread(_objectSpread({}, p.uni), {}, {
          assessments: as.map(function (a) {
            return a.id === id ? _objectSpread(_objectSpread({}, a), {}, {
              done: !a.done
            }) : a;
          })
        })
      });
    });
  }
  function removeAssessment(id) {
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        uni: _objectSpread(_objectSpread({}, p.uni), {}, {
          assessments: (p.uni.assessments || []).filter(function (a) {
            return a.id !== id;
          })
        })
      });
    });
  }
  function removeSubject(id) {
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        uni: _objectSpread(_objectSpread({}, p.uni), {}, {
          subjects: (p.uni.subjects || []).filter(function (s) {
            return s.id !== id;
          })
        })
      });
    });
  }
  function addAssessment() {
    if (!addAssessForm.name || !addAssessForm.date) return;
    var na = {
      id: "custom-" + Date.now(),
      subject: addAssessForm.subject,
      name: addAssessForm.name,
      type: addAssessForm.type,
      date: addAssessForm.date,
      done: false
    };
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        uni: _objectSpread(_objectSpread({}, p.uni), {}, {
          assessments: (p.uni.assessments || []).concat([na])
        })
      });
    });
    setAddAssessForm({
      subject: addAssessForm.subject,
      name: "",
      type: "SUBMISSION",
      date: todayStr()
    });
    setShowAddAssess(false);
  }
  function parseWithGemini() {
    return _parseWithGemini.apply(this, arguments);
  }
  function _parseWithGemini() {
    _parseWithGemini = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var key, existingSubjects, subjectInstruction, prompt, resp, json, text, match, parsed;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (syllabusText.trim()) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return");
          case 2:
            key = geminiKey.trim();
            if (key) {
              _context2.next = 6;
              break;
            }
            showToast("Paste your Gemini API key first", "error");
            return _context2.abrupt("return");
          case 6:
            if (syllabusStart) {
              _context2.next = 9;
              break;
            }
            showToast("Set the semester start date first", "error");
            return _context2.abrupt("return");
          case 9:
            try {
              localStorage.setItem('__gemini_key__', key);
            } catch (_) {}
            setGeminiLoading(true);
            setGeminiPreview(null);
            _context2.prev = 12;
            existingSubjects = (data.uni.subjects || []).map(function (s) {
              return s.name;
            });
            subjectInstruction = existingSubjects.length > 0 ? "Subjects (use exact names, reuse these if they match): " + existingSubjects.join(", ") + ". If a unit in the syllabus isn't in this list, invent a short, clear subject code for it from the unit's own name." : "No subjects are set up yet. Invent a short, clear subject code for each unit from its own name or unit code in the syllabus (e.g. an abbreviated unit title).";
            prompt = "Parse this university syllabus. Extract ONLY formal graded assessments (NOT quizzes, NOT self-testing exercises, NOT review questions, NOT resubmissions).\n\nSemester starts: " + syllabusStart + "\nWeek 1 = week of " + syllabusStart + "\nToday: " + todayStr() + "\n\n" + subjectInstruction + "\n\nFor each assessment:\n- subject: a short subject code per the instruction above (keep the SAME subject string consistent across all assessments for that unit)\n- name: short descriptive name\n- type: IN-CLASS (supervised/in-class) | SUBMISSION (online submission/assignment) | EXAM\n- date: YYYY-MM-DD calculated from week number and semester start\n- done: false\n- id: short unique slug like 'unit-at1'\n\nReturn ONLY a raw JSON array. No markdown, no explanation.\n\nSyllabus:\n" + syllabusText;
            _context2.next = 18;
            return fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: prompt
                  }]
                }],
                generationConfig: {
                  temperature: 0.1
                }
              })
            });
          case 18:
            resp = _context2.sent;
            if (resp.ok) {
              _context2.next = 21;
              break;
            }
            throw new Error("Gemini API error " + resp.status);
          case 21:
            _context2.next = 23;
            return resp.json();
          case 23:
            json = _context2.sent;
            text = json.candidates[0].content.parts[0].text;
            match = text.match(/\[[\s\S]*\]/);
            if (match) {
              _context2.next = 28;
              break;
            }
            throw new Error("No JSON array in response");
          case 28:
            parsed = JSON.parse(match[0]);
            setGeminiPreview(parsed);
            _context2.next = 35;
            break;
          case 32:
            _context2.prev = 32;
            _context2.t0 = _context2["catch"](12);
            showToast("Gemini error: " + _context2.t0.message, "error");
          case 35:
            setGeminiLoading(false);
          case 36:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[12, 32]]);
    }));
    return _parseWithGemini.apply(this, arguments);
  }
  function saveGeminiPreview() {
    if (!geminiPreview || geminiPreview.length === 0) return;
    setData(function (p) {
      var subs = (p.uni.subjects || []).slice();
      geminiPreview.forEach(function (a) {
        var name = (a.subject || "").trim();
        if (name && !subs.some(function (s) {
          return s.name.toLowerCase() === name.toLowerCase();
        })) {
          subs.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: name,
            color: nextSubjectColor(subs)
          });
        }
      });
      var existingAssess = p.uni.assessments || [];
      var existingIds = {};
      existingAssess.forEach(function (a) {
        existingIds[a.id] = true;
      });
      var newOnes = geminiPreview.map(function (a) {
        var id = a.id;
        while (existingIds[id]) {
          id = id + "-2";
        }
        existingIds[id] = true;
        return _objectSpread(_objectSpread({}, a), {}, {
          id: id,
          done: a.done || false
        });
      });
      return _objectSpread(_objectSpread({}, p), {}, {
        uni: _objectSpread(_objectSpread({}, p.uni), {}, {
          subjects: subs,
          assessments: existingAssess.concat(newOnes)
        })
      });
    });
    setGeminiPreview(null);
    setSyllabusText("");
    setShowSyllabusImport(false);
    showToast(geminiPreview.length + " assessment" + (geminiPreview.length !== 1 ? "s" : "") + " added", "success");
  }
  // Plain checkbox click = instant complete, dated today (fast path). The clock icon
  // next to each task opens the same modal for backdating instead, when that matters.
  function toggleTask(id) {
    var cur = (data.personal.tasks || []).find(function (t) {
      return t.id === id;
    });
    if (cur && !cur.done) {
      completeTask(id, todayStr(), "");
      return;
    }
    trk("task.uncomplete");
    setData(function (p) {
      var ts = p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.map(function (t) {
            return t.id === id ? _objectSpread(_objectSpread({}, t), {}, {
              done: false,
              completedAt: null,
              completedTime: null
            }) : t;
          })
        })
      });
    });
  }
  function completeTask(id, dateStr, timeStr) {
    trk("task.complete");
    setData(function (p) {
      var ts = p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.map(function (t) {
            return t.id === id ? _objectSpread(_objectSpread({}, t), {}, {
              done: true,
              completedAt: dateStr || todayStr(),
              completedTime: timeStr || null
            }) : t;
          })
        })
      });
    });
  }
  function openBackdateModal(id) {
    setModal("complete_task");
    setMForm({
      taskId: id,
      date: todayStr(),
      time: ""
    });
  }
  function setTaskState(id, state) {
    trk("task.state");
    setData(function (p) {
      var ts = p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.map(function (t) {
            if (t.id !== id) return t;
            // Re-picking the state you are already on is not a touch. Without this,
            // opening a task and clicking its current state clears an "untouched 12d"
            // badge without any work having happened, and the badge stops meaning anything.
            if ((t.state || "todo") === state) return t;
            return _objectSpread(_objectSpread({}, t), {}, {
              state: state,
              editedAt: todayStr()
            });
          })
        })
      });
    });
  }
  // Writing an update is a real interaction with the task, so it refreshes
  // editedAt — that is what clears the "untouched Nd" badge.
  function addTaskUpdate(id, text) {
    var clean = (text || "").trim();
    if (!clean) return;
    trk("task.update_add");
    setData(function (p) {
      var ts = p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.map(function (t) {
            if (t.id !== id) return t;
            // Random suffix, not a bare timestamp: this doc is written from three devices
            // and deleteTaskUpdate filters by id, so a collision would delete two entries.
            var uid = Date.now() + "-" + Math.random().toString(36).slice(2, 6);
            var ups = (t.updates || []).concat([{
              id: uid,
              at: todayStr(),
              text: clean
            }]);
            return _objectSpread(_objectSpread({}, t), {}, {
              updates: ups,
              editedAt: todayStr()
            });
          })
        })
      });
    });
  }
  function deleteTaskUpdate(id, updateId) {
    trk("task.update_delete");
    setData(function (p) {
      var ts = p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.map(function (t) {
            return t.id === id ? _objectSpread(_objectSpread({}, t), {}, {
              updates: (t.updates || []).filter(function (u) {
                return u.id !== updateId;
              })
            }) : t;
          })
        })
      });
    });
  }
  function openTaskDetail(id) {
    setModal("task_detail");
    setMForm({
      taskId: id,
      updateText: ""
    });
  }
  function archiveDone() {
    trk("task.archive");
    setData(function (p) {
      var ts = p.personal.tasks || [];
      var done = ts.filter(function (t) {
        return t.done;
      }).map(function (t) {
        return _objectSpread(_objectSpread({}, t), {}, {
          archivedAt: todayStr()
        });
      });
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.filter(function (t) {
            return !t.done;
          }),
          archived: (p.personal.archived || []).concat(done)
        })
      });
    });
  }
  function restoreTask(id) {
    trk("task.restore");
    setData(function (p) {
      var arch = p.personal.archived || [];
      var match = arch.filter(function (t) {
        return t.id === id;
      });
      if (match.length === 0) return p;
      var ts = p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.concat([_objectSpread(_objectSpread({}, match[0]), {}, {
            done: false,
            archivedAt: undefined,
            completedAt: null,
            completedTime: null
          })]),
          archived: arch.filter(function (x) {
            return x.id !== id;
          })
        })
      });
    });
  }
  function saveEditTask() {
    if (window.DataValidator) {
      var r = DataValidator.validate("task", {
        name: editTaskForm.name,
        priority: editTaskForm.priority || "normal",
        due: editTaskForm.due || null,
        cat: editTaskForm.cat
      });
      if (!r.valid) {
        showToast(r.firstError);
        return;
      }
    }
    setData(function (p) {
      var ts = p.personal.tasks || [];
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: ts.map(function (t) {
            return t.id === editTaskId ? _objectSpread(_objectSpread(_objectSpread({}, t), editTaskForm), {}, {
              editedAt: todayStr()
            }) : t;
          })
        })
      });
    });
    trk("task.edit");
    setEditTaskId(null);
    setEditTaskForm({});
    showToast("Task updated!", "success");
  }
  function logBW() {
    if (!bwIn) return;
    if (window.DataValidator) {
      var r = DataValidator.validate("bodyWeight", {
        weight: Number(bwIn),
        date: bwDate || todayStr()
      });
      if (!r.valid) {
        showToast(r.firstError);
        return;
      }
    }
    trk("gym.bodyweight_log");
    var entryDate = bwDate || todayStr();
    setData(function (p) {
      var existing = (p.gym.bodyWeight || []).filter(function (e) {
        return e.date !== entryDate;
      });
      var updated = existing.concat([{
        date: entryDate,
        weight: Number(bwIn)
      }]).sort(function (a, b) {
        return a.date.localeCompare(b.date);
      });
      return _objectSpread(_objectSpread({}, p), {}, {
        gym: _objectSpread(_objectSpread({}, p.gym), {}, {
          bodyWeight: updated,
          lastBWWeek: entryDate >= thisWeek ? thisWeek : p.gym.lastBWWeek
        })
      });
    });
    setBwIn("");
    setBwDate(todayStr());
    setBwEditing(false);
    showToast("Body weight logged!", "success");
  }
  function deleteBWEntry(dateStr) {
    setData(function (p) {
      var newBW = (p.gym.bodyWeight || []).filter(function (e) {
        return e.date !== dateStr;
      });
      return _objectSpread(_objectSpread({}, p), {}, {
        gym: _objectSpread(_objectSpread({}, p.gym), {}, {
          bodyWeight: newBW,
          lastBWWeek: dateStr >= thisWeek ? null : p.gym.lastBWWeek
        })
      });
    });
    showToast("Entry removed", "success");
  }
  function submitCapture() {
    trk("capture.save");
    if (!captureText.trim()) return;
    if (!window.GeminiService) {
      showToast("Gemini service not loaded.", "error");
      return;
    }
    setCaptureLoading(true);
    setCaptureResult(null);
    window.GeminiService.classify(captureText).then(function (result) {
      setCaptureResult(result);
      setCaptureLoading(false);
      if (window._currentUser && window._db) {
        _db.collection('users').doc(window._currentUser.uid).collection('captures').add({
          uid: window._currentUser.uid,
          type: result.type || "thought",
          title: result.title || "",
          content: result.content || "",
          formula: result.formula || "",
          example: result.example || "",
          subject: result.subject || "",
          tags: result.tags || [],
          rawInput: captureText,
          date: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
          setCaptureText("");
        })["catch"](function (e) {
          showToast("Save failed: " + (e.message || "check connection."), "error");
        });
      }
    })["catch"](function (e) {
      setCaptureLoading(false);
      showToast("Capture failed: " + (e.message || "Check your Gemini API key in settings."), "error");
    });
  }
  function openEditCapture(c, ev) {
    if (ev) ev.stopPropagation();
    setEditCaptureData(_objectSpread({}, c));
    setEditCaptureTagStr((c.tags || []).join(", "));
  }
  function saveEditCapture() {
    trk("capture.edit");
    if (!editCaptureData || !window._currentUser || !window._db) return;
    var tagsArr = editCaptureTagStr.split(",").map(function (t) {
      return t.trim().toLowerCase();
    }).filter(Boolean);
    _db.collection('users').doc(window._currentUser.uid).collection('captures').doc(editCaptureData.id).update({
      title: editCaptureData.title || "",
      content: editCaptureData.content || "",
      formula: editCaptureData.formula || "",
      example: editCaptureData.example || "",
      tags: tagsArr,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
      setCapturesData(function (prev) {
        return prev.map(function (c) {
          if (c.id !== editCaptureData.id) return c;
          return _objectSpread(_objectSpread({}, c), {}, {
            title: editCaptureData.title,
            content: editCaptureData.content,
            formula: editCaptureData.formula,
            example: editCaptureData.example,
            tags: tagsArr
          });
        });
      });
      showToast("Capture updated, will re-export on next sync", "success");
      setEditCaptureData(null);
    })["catch"](function (e) {
      showToast("Save failed: " + e.message, "error");
    });
  }
  function nearestHalfHour() {
    var d = new Date();
    var m = d.getHours() * 60 + d.getMinutes();
    var rounded = Math.ceil(m / 30) * 30;
    var h = Math.floor(rounded / 60) % 24;
    var min = rounded % 60;
    return String(h).padStart(2, "0") + ":" + String(min).padStart(2, "0");
  }
  function openSchedulePicker(taskId, ds, existingTime, existingDuration) {
    if (!taskId) return;
    setScheduleTaskId(taskId);
    setScheduleForDay(ds);
    setScheduleTime(existingTime || nearestHalfHour());
    setScheduleDuration(existingDuration || 60);
    setShowTimePicker(true);
  }
  function confirmSchedule(justDate) {
    if (!scheduleTaskId || !scheduleForDay) return;
    if (justDate) {
      setData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          personal: _objectSpread(_objectSpread({}, p.personal), {}, {
            tasks: p.personal.tasks.map(function (t) {
              return t.id === scheduleTaskId ? _objectSpread(_objectSpread({}, t), {}, {
                due: scheduleForDay,
                editedAt: todayStr()
              }) : t;
            })
          })
        });
      });
      showToast("Due date set to " + fmtDate(scheduleForDay), "success");
    } else {
      setData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          personal: _objectSpread(_objectSpread({}, p.personal), {}, {
            tasks: p.personal.tasks.map(function (t) {
              return t.id === scheduleTaskId ? _objectSpread(_objectSpread({}, t), {}, {
                due: scheduleForDay,
                scheduledDate: scheduleForDay,
                scheduledTime: scheduleTime,
                scheduledDuration: scheduleDuration,
                editedAt: todayStr()
              }) : t;
            })
          })
        });
      });
      showToast("Scheduled for " + fmtDate(scheduleForDay) + " at " + scheduleTime, "success");
    }
    setShowTimePicker(false);
    setScheduleTaskId(null);
    setScheduleForDay(null);
  }
  function unscheduleTask() {
    if (!scheduleTaskId) return;
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        personal: _objectSpread(_objectSpread({}, p.personal), {}, {
          tasks: p.personal.tasks.map(function (t) {
            return t.id !== scheduleTaskId ? t : _objectSpread(_objectSpread({}, t), {}, {
              scheduledDate: null,
              scheduledTime: null,
              scheduledDuration: null,
              editedAt: todayStr()
            });
          })
        })
      });
    });
    showToast("Removed from calendar", "success");
    setShowTimePicker(false);
    setScheduleTaskId(null);
  }
  function saveNextSess() {
    var rows = nxtRows.filter(function (r) {
      return r.exercise && r.weight;
    });
    if (rows.length === 0) {
      showToast("Add at least one exercise with a weight.");
      return;
    }
    if (window.DataValidator) {
      var r = DataValidator.validate("gymWorkout", {
        name: nextRot ? nextRot.name : "Next Session",
        date: todayStr(),
        sets: rows
      });
      if (!r.valid) {
        showToast(r.firstError);
        return;
      }
    }
    var name = nextRot ? nextRot.name : "Next Session";
    var rotId = nextRot ? nextRot.id : null;
    var today = todayStr();
    var wk = {
      id: Date.now(),
      name: name,
      date: today,
      rotId: rotId,
      sets: rows.map(function (r, i) {
        return _objectSpread(_objectSpread({}, r), {}, {
          id: i + 1
        });
      })
    };
    setData(function (p) {
      var rl = p.gym.rotation ? p.gym.rotation.length : 1;
      // Write exercises+weights back to rotation template so next session pre-fills
      var newRot = (p.gym.rotation || []).map(function (rt) {
        if (rt.id !== rotId) return rt;
        return _objectSpread(_objectSpread({}, rt), {}, {
          exercises: rows.map(function (r) {
            return {
              id: r.id || Date.now(),
              exercise: r.exercise,
              sets: r.sets,
              reps: r.reps,
              weight: r.weight
            };
          })
        });
      });
      // Log each exercise weight for progression tracking
      var newExercises = _toConsumableArray(p.gym.exercises || []);
      rows.forEach(function (r) {
        var idx = newExercises.findIndex(function (e) {
          return e.name && e.name.toLowerCase() === r.exercise.toLowerCase();
        });
        var logEntry = {
          date: today,
          weight: Number(r.weight) || 0
        };
        if (idx >= 0) {
          newExercises[idx] = _objectSpread(_objectSpread({}, newExercises[idx]), {}, {
            logs: [].concat(_toConsumableArray(newExercises[idx].logs || []), [logEntry])
          });
        } else {
          newExercises.push({
            id: 'ex_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            name: r.exercise,
            logs: [logEntry]
          });
        }
      });
      return _objectSpread(_objectSpread({}, p), {}, {
        gym: _objectSpread(_objectSpread({}, p.gym), {}, {
          workouts: (p.gym.workouts || []).concat([wk]),
          rotIdx: ((p.gym.rotIdx || 0) + 1) % Math.max(rl, 1),
          rotation: newRot,
          exercises: newExercises
        })
      });
    });
    try {
      localStorage.removeItem('gym_draft');
    } catch (_) {}
    setGymDraftBanner(false);
    setNxtRows([{
      id: 1,
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    }, {
      id: 2,
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    }, {
      id: 3,
      exercise: "",
      sets: "",
      reps: "",
      weight: ""
    }]);
    showToast("Session saved!", "success");
  }
  function saveModal() {
    try {
      // Validate before saving — validator returns user-friendly messages
      if (window.DataValidator) {
        if (modal === "add_task") {
          var r = DataValidator.validate("task", {
            name: mForm.name,
            priority: mForm.priority || "normal",
            due: mForm.due || null,
            cat: mForm.cat || "Errands"
          });
          if (!r.valid) {
            showToast(r.firstError);
            return;
          }
        }
        if (modal === "add_subject" || modal === "edit_subject") {
          if (!mForm.name || !mForm.name.trim()) {
            showToast("Subject name can't be empty.");
            return;
          }
        }
        if (modal === "add_exercise") {
          if (!mForm.name || !mForm.name.trim()) {
            showToast("Exercise name can't be empty.");
            return;
          }
        }
        if (modal === "log_weight") {
          var _r2 = DataValidator.validate("exerciseLog", {
            weight: Number(mForm.weight),
            date: todayStr()
          });
          if (!_r2.valid) {
            showToast(_r2.firstError);
            return;
          }
        }
      }
      if (modal === "add_subject") {
        trk("uni.subject_add");
        setData(function (p) {
          var subs = p.uni.subjects || [];
          if (subs.some(function (s) {
            return s.name.toLowerCase() === mForm.name.trim().toLowerCase();
          })) return p;
          return _objectSpread(_objectSpread({}, p), {}, {
            uni: _objectSpread(_objectSpread({}, p.uni), {}, {
              subjects: subs.concat([{
                id: Date.now(),
                name: mForm.name.trim(),
                color: mForm.color || nextSubjectColor(subs)
              }])
            })
          });
        });
      } else if (modal === "edit_subject") {
        trk("uni.subject_edit");
        setData(function (p) {
          var subs = p.uni.subjects || [];
          return _objectSpread(_objectSpread({}, p), {}, {
            uni: _objectSpread(_objectSpread({}, p.uni), {}, {
              subjects: subs.map(function (s) {
                return s.id === mForm.editId ? _objectSpread(_objectSpread({}, s), {}, {
                  name: mForm.name.trim(),
                  color: mForm.color || s.color
                }) : s;
              })
            })
          });
        });
      } else if (modal === "add_exercise") {
        trk("gym.exercise_add");
        setData(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, {
            gym: _objectSpread(_objectSpread({}, p.gym), {}, {
              exercises: p.gym.exercises.concat([{
                id: Date.now(),
                name: mForm.name,
                logs: []
              }])
            })
          });
        });
      } else if (modal === "log_weight") setData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          gym: _objectSpread(_objectSpread({}, p.gym), {}, {
            exercises: p.gym.exercises.map(function (ex) {
              return ex.id === mForm.exId ? _objectSpread(_objectSpread({}, ex), {}, {
                logs: ex.logs.concat([{
                  date: todayStr(),
                  weight: Number(mForm.weight)
                }])
              }) : ex;
            })
          })
        });
      });else if (modal === "add_task") {
        trk("task.add");
        setData(function (p) {
          var ts = p.personal.tasks || [];
          return _objectSpread(_objectSpread({}, p), {}, {
            personal: _objectSpread(_objectSpread({}, p.personal), {}, {
              tasks: ts.concat([{
                id: Date.now(),
                name: mForm.name,
                cat: mForm.cat || "Errands",
                priority: mForm.priority || "normal",
                due: mForm.due || null,
                done: false,
                addedAt: todayStr(),
                editedAt: null,
                state: "todo",
                updates: []
              }])
            })
          });
        });
      } else if (modal === "edit_rotation") {
        var ri = mForm.rotIdx;
        setData(function (p) {
          var rot = (p.gym.rotation || []).map(function (r, i) {
            return i === ri ? _objectSpread(_objectSpread({}, r), {}, {
              name: mForm.rName || r.name,
              focus: mForm.rFocus,
              exercises: (mForm.exercises || []).filter(function (ex) {
                return ex.exercise && ex.exercise.trim();
              })
            }) : r;
          });
          return _objectSpread(_objectSpread({}, p), {}, {
            gym: _objectSpread(_objectSpread({}, p.gym), {}, {
              rotation: rot
            })
          });
        });
        setModal(null);
        setMForm({});
        showToast("Template updated!", "success");
        return;
      } else if (modal === "complete_task") {
        completeTask(mForm.taskId, mForm.date, mForm.time);
        setModal(null);
        setMForm({});
        showToast("Task completed!", "success");
        return;
      }
      setModal(null);
      setMForm({});
      showToast("Saved!", "success");
    } catch (err) {
      captureError(err, "saveModal");
    }
  }
  function updateFinance(fin) {
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        finance: fin
      });
    });
  }
  function updateInvest(inv) {
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        invest: inv
      });
    });
  }
  function updateWork(w) {
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        work: w
      });
    });
  }
  function updateProjects(pr) {
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        projects: pr
      });
    });
  }
  function updateShopping(sh) {
    setData(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        shopping: sh
      });
    });
  }
  // Append one item to the shopping list (used by the "+ Add to shopping" button on project buy-steps).
  function addToShopping(item) {
    setData(function (p) {
      var cur = Array.isArray(p.shopping) ? p.shopping : [];
      if (item.key && cur.some(function (x) {
        return x.key === item.key;
      })) return p;
      return _objectSpread(_objectSpread({}, p), {}, {
        shopping: cur.concat([item])
      });
    });
  }
  function requestImmediateSave() {
    _flushNow.current = true;
  } // bypass the 2s debounce on the next data save
  function submitRefl() {
    if (!reflIn.trim()) {
      showToast("Write something before continuing.");
      return;
    }
    var na = reflAns.concat([{
      q: REFL_QS[reflStep - 1],
      a: reflIn
    }]);
    setReflAns(na);
    setReflIn("");
    if (reflStep < REFL_QS.length) {
      setReflStep(reflStep + 1);
    } else {
      // Final step — validate the full answer set before analysing
      if (window.DataValidator) {
        var r = DataValidator.validate("reflection", {
          answers: na
        });
        if (!r.valid) {
          showToast(r.firstError);
          return;
        }
      }
      trk("reflection.submit");
      setReflStep(REFL_QS.length + 1);
      setReflAnalysisLoading(true);
      OllamaService.analyzeReflection(na, data.reflections).then(function (an) {
        var analysis = an || analyzeReflectionFallback(na, data.reflections);
        setReflAnalysis(analysis);
        setReflAnalysisLoading(false);
        setData(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, {
            reflections: p.reflections.concat([{
              id: Date.now(),
              date: new Date().toISOString(),
              answers: na.map(function (qa, i) {
                return {
                  question: qa.q,
                  answer: qa.a,
                  area: REFL_LABELS[i]
                };
              }),
              analysis: analysis
            }])
          });
        });
      })["catch"](function () {
        setReflAnalysisLoading(false);
        showToast("Analysis failed. Reflection was still saved.", "warn");
      });
    }
  }
  function evColor(ev) {
    return ev.calColor || "#4285F4";
  }
  function evLabel(ev) {
    var keys = (data.uni.subjects || []).map(function (s) {
      return s.name;
    });
    var match = keys.find(function (k) {
      return ev.title && k && ev.title.toUpperCase().includes(k.toUpperCase());
    });
    return match || ev.calName || "Google";
  }

  // What actually got done, by day. Reads `archived` as well as `tasks` on purpose:
  // archiveDone() moves completed tasks out of the live list, and without this the
  // calendar's history would empty itself every time the task list is tidied.
  // Local only — nothing here touches Google Calendar.
  var completionsByDay = React.useMemo(function () {
    var map = {};
    var all = (data.personal && data.personal.tasks || []).concat(data.personal && data.personal.archived || []);
    all.forEach(function (t) {
      if (!t.done || !t.completedAt) return;
      (map[t.completedAt] = map[t.completedAt] || []).push(t);
    });
    return map;
  }, [data.personal]);
  function renderWeek() {
    if (mob) {
      var dayEvs = visibleGcalEvents.filter(function (ev) {
        return ev.date === activeDay;
      }).sort(function (a, b) {
        return (a.time || "").localeCompare(b.time || "");
      });
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 4,
          overflowX: "auto",
          paddingBottom: 6,
          marginBottom: 12
        }
      }, weekDates.map(function (d, di) {
        var ds = dStr(d);
        var isTdy = ds === todayStr();
        var isActive = ds === activeDay;
        var hasEv = visibleGcalEvents.some(function (ev) {
          return ev.date === ds;
        });
        return /*#__PURE__*/React.createElement("button", {
          key: di,
          onClick: function onClick() {
            setActiveDay(ds);
          },
          style: {
            flex: "0 0 auto",
            minWidth: 44,
            padding: "8px 6px",
            borderRadius: 12,
            border: isActive ? "1px solid " + T.accent : "0.5px solid rgba(255,255,255,0.08)",
            background: isActive ? T.accentBg : isTdy ? "rgba(91,140,255,0.06)" : "rgba(255,255,255,0.02)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            boxShadow: isActive ? "0 0 12px rgba(91,140,255,0.2)" : "none",
            transition: "background 0.12s,border 0.12s,box-shadow 0.12s"
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 9,
            color: isTdy ? T.accent : T.text3,
            fontWeight: 700,
            letterSpacing: "0.04em"
          }
        }, DAYS[di]), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 16,
            fontWeight: 700,
            color: isTdy ? T.accent : isActive ? T.text : T.text2,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: isTdy && !isActive ? "rgba(91,140,255,0.15)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isTdy ? "0 0 8px rgba(91,140,255,0.25)" : "none"
          }
        }, d.getDate()), hasEv && /*#__PURE__*/React.createElement("div", {
          style: {
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: isActive ? T.accent : "rgba(91,140,255,0.45)"
          }
        }));
      })), dayEvs.length === 0 ? /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: T.text3,
          padding: "16px 0",
          textAlign: "center"
        }
      }, gcalConnected ? "No events today" : "Connect Google Calendar to see events") : dayEvs.map(function (ev) {
        var col = evColor(ev);
        return /*#__PURE__*/React.createElement("div", {
          key: ev.id,
          style: {
            display: "flex",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            marginBottom: 8,
            alignItems: "flex-start"
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 3,
            background: col,
            borderRadius: 2,
            alignSelf: "stretch",
            minHeight: 28,
            flexShrink: 0,
            marginTop: 2,
            boxShadow: "0 0 6px " + col + "80"
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 10,
            fontWeight: 700,
            color: col,
            letterSpacing: "0.02em"
          }
        }, evLabel(ev)), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 10,
            color: T.text3
          }
        }, ev.time)), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            color: T.text,
            lineHeight: 1.4
          }
        }, ev.title), ev.location && /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 10,
            color: T.text3,
            marginTop: 3,
            display: "flex",
            alignItems: "center",
            gap: 3
          }
        }, /*#__PURE__*/React.createElement(UIcon, {
          name: "pin",
          size: 9
        }), ev.location)));
      }), (completionsByDay[activeDay] || []).length > 0 && /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 14,
          paddingTop: 10,
          borderTop: "0.5px solid " + T.border
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.text3,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 0.5
        }
      }, "Finished ", activeDay === todayStr() ? "today" : "that day"), (completionsByDay[activeDay] || []).map(function (t) {
        var col = catColor(t.cat || "Other");
        return /*#__PURE__*/React.createElement("div", {
          key: t.id,
          style: {
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 6
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: col,
            flexShrink: 0
          }
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 12,
            color: T.text2,
            flex: 1
          }
        }, t.name));
      })));
    }
    var PPM = 0.26;
    var allEvs = [];
    weekDates.forEach(function (d) {
      var ds = dStr(d);
      visibleGcalEvents.filter(function (ev) {
        return ev.date === ds && !ev.allDay;
      }).forEach(function (ev) {
        allEvs.push(ev);
      });
    });
    var allT = allEvs.length > 0 ? allEvs.map(function (ev) {
      return parseTimes(ev.time);
    }) : [];
    var minH = allT.length > 0 ? Math.max(6, Math.floor(Math.min.apply(null, allT.map(function (t) {
      return t.start;
    })) / 60)) : 7;
    var maxH = allT.length > 0 ? Math.min(24, Math.ceil(Math.max.apply(null, allT.map(function (t) {
      return t.end;
    })) / 60) + 1) : 22;
    var hours = [];
    for (var h = minH; h <= maxH; h++) hours.push(h);
    var totalH = (maxH - minH) * 60 * PPM;
    var now = new Date();
    var nowMins = now.getHours() * 60 + now.getMinutes();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        flexShrink: 0,
        position: "relative",
        height: totalH,
        marginTop: 26
      }
    }, hours.map(function (h) {
      return /*#__PURE__*/React.createElement("div", {
        key: h,
        style: {
          position: "absolute",
          top: (h - minH) * 60 * PPM - 6,
          fontSize: 8,
          color: T.text3,
          textAlign: "right",
          width: 24,
          opacity: 0.6
        }
      }, h === 12 ? "12p" : h < 12 ? h + "a" : h - 12 + "p");
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: 1
      }
    }, weekDates.map(function (d, di) {
      var ds = dStr(d);
      var isTdy = ds === todayStr();
      var isPast = new Date(ds) < new Date(todayStr());
      var timedEvs = visibleGcalEvents.filter(function (ev) {
        return ev.date === ds && !ev.allDay;
      });
      var allDayEvs = visibleGcalEvents.filter(function (ev) {
        return ev.date === ds && ev.allDay;
      });
      var isSchedTarget = !!scheduleTaskId;
      return /*#__PURE__*/React.createElement("div", {
        key: di,
        style: {
          display: "flex",
          flexDirection: "column",
          cursor: isSchedTarget ? "crosshair" : "pointer",
          borderRadius: 6,
          background: isTdy ? "rgba(91,140,255,0.05)" : isSchedTarget ? "rgba(91,140,255,0.04)" : "transparent",
          outline: isSchedTarget ? "1.5px dashed " + T.accent : "none",
          transition: "background 0.1s"
        },
        onClick: function onClick() {
          if (isSchedTarget) {
            openSchedulePicker(scheduleTaskId, ds);
          } else {
            setActiveDay(ds);
          }
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "center",
          marginBottom: 2,
          padding: "3px 0",
          borderRadius: 6,
          background: activeDay === ds && !isTdy ? T.accentBg : "transparent"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 8,
          color: isTdy ? T.accent : T.text3,
          fontWeight: isTdy ? 700 : 400,
          letterSpacing: "0.04em"
        }
      }, DAYS[di]), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          fontWeight: 700,
          color: isTdy ? "#fff" : isPast ? T.text3 : T.text,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: isTdy ? "#5b8cff" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "2px auto",
          boxShadow: isTdy ? "0 0 8px rgba(91,140,255,0.55)" : "none"
        }
      }, d.getDate()), allDayEvs.map(function (ev) {
        return /*#__PURE__*/React.createElement("div", {
          key: ev.id,
          style: {
            fontSize: 6,
            background: ev.calColor + "20",
            borderLeft: "2px solid " + ev.calColor,
            borderRadius: 2,
            padding: "0 2px",
            color: ev.calColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 1
          }
        }, ev.title.slice(0, 10));
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          height: totalH,
          borderLeft: "0.5px solid rgba(255,255,255,0.06)",
          opacity: isPast ? 0.45 : 1
        }
      }, hours.map(function (h) {
        return /*#__PURE__*/React.createElement("div", {
          key: h,
          style: {
            position: "absolute",
            top: (h - minH) * 60 * PPM,
            left: 0,
            right: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.05)"
          }
        });
      }), isTdy && nowMins >= minH * 60 && nowMins <= maxH * 60 && /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          top: (nowMins - minH * 60) * PPM,
          left: 0,
          right: 0,
          borderTop: "1.5px solid " + T.danger,
          zIndex: 10,
          boxShadow: "0 0 4px rgba(255,107,107,0.5)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          left: -3,
          top: -3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: T.danger,
          boxShadow: "0 0 6px " + T.danger
        }
      })), timedEvs.map(function (ev) {
        var col = evColor(ev);
        var tp = parseTimes(ev.time);
        return /*#__PURE__*/React.createElement("div", {
          key: ev.id,
          style: {
            position: "absolute",
            top: (tp.start - minH * 60) * PPM,
            left: 1,
            right: 1,
            height: Math.max((tp.end - tp.start) * PPM, 10),
            borderRadius: 3,
            background: col + "18",
            borderLeft: "2px solid " + col,
            padding: "1px 3px",
            overflow: "hidden",
            boxSizing: "border-box",
            zIndex: 5
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 6.5,
            fontWeight: 700,
            color: col,
            whiteSpace: "nowrap",
            overflow: "hidden"
          }
        }, evLabel(ev)));
      }), data.personal.tasks.filter(function (t) {
        return t.scheduledDate === ds && t.scheduledTime;
      }).map(function (t) {
        var sm = toMins(t.scheduledTime);
        var em = sm + (t.scheduledDuration || 60);
        var isDone = !!t.done;
        return /*#__PURE__*/React.createElement("div", {
          key: "sched_" + t.id,
          title: (isDone ? "✓ Done · " : "") + t.name + " · " + t.scheduledTime + " (" + (t.scheduledDuration || 60) + "min)",
          style: {
            position: "absolute",
            top: Math.max((sm - minH * 60) * PPM, 0),
            left: 1,
            right: 1,
            height: Math.max((em - sm) * PPM, 10),
            borderRadius: 3,
            background: isDone ? "rgba(105,240,174,0.14)" : "rgba(91,140,255,0.18)",
            border: isDone ? "1px solid rgba(105,240,174,0.55)" : "1px dashed rgba(91,140,255,0.65)",
            padding: "1px 3px",
            overflow: "hidden",
            boxSizing: "border-box",
            zIndex: 6,
            cursor: "pointer",
            opacity: isDone ? 0.7 : 1
          },
          onClick: function onClick(e) {
            e.stopPropagation();
            openSchedulePicker(t.id, t.scheduledDate, t.scheduledTime, t.scheduledDuration);
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 6.5,
            fontWeight: 700,
            color: isDone ? T.success : T.accent,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textDecoration: isDone ? "line-through" : "none"
          }
        }, isDone ? "✓ " : "", t.name));
      })), (completionsByDay[ds] || []).length > 0 && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "6px 4px 0",
          marginTop: 6,
          borderTop: "0.5px solid " + T.border
        }
      }, (completionsByDay[ds] || []).slice(0, 3).map(function (t) {
        var col = catColor(t.cat || "Other");
        return /*#__PURE__*/React.createElement("div", {
          key: t.id,
          style: {
            display: "flex",
            gap: 5,
            alignItems: "center",
            marginBottom: 3
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: col,
            flexShrink: 0,
            boxShadow: "0 0 5px " + col + "90"
          }
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 9,
            color: T.text2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          },
          title: t.name
        }, t.name));
      }), (completionsByDay[ds] || []).length > 3 && /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          e.stopPropagation();
          setModal("day_done");
          setMForm({
            date: ds
          });
        },
        style: {
          background: "none",
          border: "none",
          color: T.text3,
          cursor: "pointer",
          fontSize: 9,
          padding: 0
        }
      }, "+", (completionsByDay[ds] || []).length - 3, " more")));
    })));
  }
  function card(ex) {
    return _objectSpread({
      position: "relative",
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      padding: "18px 20px",
      marginBottom: 12,
      boxShadow: cardShadow
    }, ex || {});
  }
  var sT = sTGlobal; // one definition, so App-local cards and module-level cards cannot drift
  var btn = _objectSpread(_objectSpread({}, btnGlass), {}, {
    padding: "5px 12px"
  });
  var btnP = _objectSpread({}, btnGlassP);
  var inp = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: T.text,
    fontSize: 12,
    boxSizing: "border-box"
  };
  // ── Mock design-language helpers (Sapphire glass) ──
  var eyebrow = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: T.accent
  };
  var sectLabel = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.42)",
    marginBottom: 14
  };
  var pill = {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 9px",
    borderRadius: 999,
    background: "rgba(91,140,255,0.16)",
    color: "#8fb0ff",
    border: "1px solid rgba(120,150,255,0.4)"
  };
  var glassMini = {
    background: cardBg,
    backdropFilter: "blur(24px) saturate(1.4)",
    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12,
    boxShadow: cardShadowSoft
  };
  var tagStyle = {
    academic: {
      background: "rgba(55,138,221,0.18)",
      color: "#7eb3e8"
    },
    health: {
      background: "rgba(59,109,17,0.22)",
      color: "#8ac571"
    },
    finance: {
      background: "rgba(186,117,23,0.22)",
      color: "#e8b970"
    },
    career: {
      background: "rgba(127,119,221,0.22)",
      color: "#b3acff"
    },
    personal: {
      background: "rgba(136,135,128,0.22)",
      color: "#b4b3ac"
    }
  };
  function getTagStyle(area) {
    return tagStyle[(area || "personal").toLowerCase()] || tagStyle.personal;
  }

  // Auth loading — minimal loading screen
  if (authLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "startup-screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "startup-loader"
    }), /*#__PURE__*/React.createElement("div", {
      className: "startup-label"
    }, "Loading"));
  }

  // Login screen — shown until Google sign-in completes
  if (!authUser) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse 70% 55% at 82% 8%,rgba(40,90,210,0.30) 0%,transparent 60%),radial-gradient(ellipse 65% 60% at 12% 92%,rgba(20,40,120,0.34) 0%,transparent 62%),#0a0a0a",
        fontFamily: "'Geist',system-ui,sans-serif"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "0.5px solid rgba(255,255,255,0.16)",
        borderRadius: 20,
        padding: "40px 36px",
        textAlign: "center",
        maxWidth: 340,
        width: "90%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        color: T.accent,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "sparkle",
      size: 30
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 700,
        color: T.text,
        marginBottom: 6
      }
    }, "Jayden's Dashboard"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: T.text2,
        marginBottom: 28,
        lineHeight: 1.6
      }
    }, "Sign in with Google to access your dashboard and sync your data across devices."), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        var isMobileUA = /iphone|ipad|ipod|android/i.test(navigator.userAgent || "") || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        if (isMobileUA) {
          _auth.signInWithRedirect(_googleProvider)["catch"](function (e) {
            if (window.ErrorHandler) ErrorHandler.warn("Sign-in failed: " + e.message, "auth");
          });
          return;
        }
        _auth.signInWithPopup(_googleProvider)["catch"](function (e) {
          if (e && (e.code === "auth/popup-blocked" || e.code === "auth/cancelled-popup-request" || e.code === "auth/operation-not-supported-in-this-environment")) {
            _auth.signInWithRedirect(_googleProvider)["catch"](function (e2) {
              if (window.ErrorHandler) ErrorHandler.warn("Sign-in failed: " + e2.message, "auth");
            });
            return;
          }
          if (window.ErrorHandler) ErrorHandler.warn("Sign-in failed: " + e.message, "auth");
        });
      },
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: "100%",
        padding: "13px 20px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.1)",
        color: T.text,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.2s"
      },
      onMouseOver: function onMouseOver(e) {
        e.currentTarget.style.background = "rgba(255,255,255,0.18)";
      },
      onMouseOut: function onMouseOut(e) {
        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 48 48"
    }, /*#__PURE__*/React.createElement("path", {
      fill: "#EA4335",
      d: "M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.8 0 6.9 5.4 3 13.3l7.8 6C12.7 13 18 9.5 24 9.5z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#4285F4",
      d: "M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#FBBC05",
      d: "M10.8 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.3-6.1z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#34A853",
      d: "M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.3-7.7 2.3-6 0-11.1-4-12.9-9.4l-8.3 6.1C6.9 42.6 14.8 48 24 48z"
    })), "Sign in with Google")));
  }
  function renderCalendarCard() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: T.text,
        letterSpacing: "-0.01em"
      }
    }, new Date(dStr(weekDates[0])).toLocaleDateString("en-AU", {
      month: "long",
      year: "numeric"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 1
      }
    }, fmtDate(dStr(weekDates[0])), " \xB7 ", fmtDate(dStr(weekDates[6])))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        alignItems: "center"
      }
    }, gcalReady && !gcalConnected && /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10,
        color: "#4285F4",
        border: "0.5px solid rgba(66,133,244,0.35)",
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }),
      onClick: function onClick() {
        window.GCalSync && window.GCalSync.connect();
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "calendar",
      size: 10
    }), "Connect"), gcalConnected && /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10,
        color: T.text2,
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }),
      onClick: function onClick() {
        setShowCalPicker(true);
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "calendar",
      size: 10
    }), gcalEvents.length), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        padding: "4px 10px",
        fontSize: 13
      }),
      onClick: function onClick() {
        setWkOff(function (o) {
          return o - 1;
        });
      }
    }, "\u2190"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        padding: "4px 10px",
        color: wkOff === 0 ? T.accent : T.text2,
        border: wkOff === 0 ? "0.5px solid rgba(91,140,255,0.4)" : "0.5px solid rgba(255,255,255,0.12)"
      }),
      onClick: function onClick() {
        setWkOff(0);
        setActiveDay(todayStr());
      }
    }, "Today"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        padding: "4px 10px",
        fontSize: 13
      }),
      onClick: function onClick() {
        setWkOff(function (o) {
          return o + 1;
        });
      }
    }, "\u2192"))), renderWeek(), gcalCalendars.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginTop: 10,
        paddingTop: 8,
        borderTop: "0.5px solid " + T.border
      }
    }, gcalCalendars.slice(0, 6).map(function (cal) {
      return /*#__PURE__*/React.createElement("div", {
        key: cal.id,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 4
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 6,
          height: 6,
          borderRadius: 2,
          background: cal.backgroundColor || "#4285F4"
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 9,
          color: T.text3
        }
      }, cal.summary));
    })));
  }
  function renderGoalsCard() {
    var b = data.boardroom || {};
    if (!b.onboarded) return null;
    var ag = (b.goals || []).filter(function (g) {
      return g.status === "active";
    });
    var ns = b.northStar || "";
    if (!ag.length && !ns) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: _objectSpread(_objectSpread({}, card()), {}, {
        borderLeft: "3px solid rgba(91,140,255,0.6)"
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: ns ? 10 : 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: sT
    }, "Goals"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setPage("Boardroom");
      },
      style: _objectSpread(_objectSpread({}, btnGlass), {}, {
        fontSize: 11,
        padding: "3px 10px"
      })
    }, "Boardroom \u2192")), ns && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "rgba(255,255,255,0.42)",
        fontStyle: "italic",
        lineHeight: 1.65,
        marginBottom: ag.length ? 14 : 4,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }
    }, "\"", ns, "\""), ag.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text3,
        marginTop: 4
      }
    }, "Start a session to set your first goal."), ag.map(function (g, i) {
      var ts = getTagStyle(g.area);
      return /*#__PURE__*/React.createElement("div", {
        key: g.id,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "7px 0",
          borderBottom: i < ag.length - 1 ? "0.5px solid rgba(255,255,255,0.06)" : "none"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 6,
          height: 6,
          borderRadius: "50%",
          flexShrink: 0,
          background: ts.color,
          boxShadow: "0 0 6px " + ts.color
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: _objectSpread(_objectSpread({
          fontSize: 10,
          padding: "2px 6px",
          borderRadius: 4
        }, ts), {}, {
          flexShrink: 0
        })
      }, g.area), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: "rgba(255,255,255,0.82)",
          lineHeight: 1.4
        }
      }, g.title));
    }));
  }
  function renderAssessmentsCard() {
    return /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: card()
    }, /*#__PURE__*/React.createElement("div", {
      style: sT
    }, "Upcoming assessments"), upcoming.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text2
      }
    }, "All clear \u2713") : upcoming.map(function (a) {
      var days = daysBetween(a.date);
      var col = subjectColor(data.uni.subjects, a.subject) || T.accent;
      var dayLabel = days === 0 ? "Today" : days === 1 ? "Tomorrow" : days <= 13 ? WX_DAYS[new Date(a.date + "T00:00").getDay()] + " · " + days + " days" : fmtDate(a.date);
      return /*#__PURE__*/React.createElement("div", {
        key: a.id,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 10px",
          borderRadius: 8,
          background: T.bg3,
          border: "0.5px solid " + T.border,
          marginBottom: 6,
          cursor: "pointer"
        },
        onClick: function onClick() {
          setPage("Uni");
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: col,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          fontSize: 12,
          color: T.text,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: col,
          fontWeight: 700
        }
      }, a.subject), " · ", a.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: days <= 3 ? T.danger : T.text2,
          fontWeight: 600,
          flexShrink: 0,
          whiteSpace: "nowrap"
        }
      }, dayLabel));
    }));
  }
  function renderGymNextCard() {
    return /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: card()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: nextRot ? 4 : 0
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: sT
    }, "Next session \xB7 pre-fill weights"), nextRot && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginTop: 2
      }
    }, nextRot.name, nextRot.focus ? " · " + nextRot.focus : "")), /*#__PURE__*/React.createElement("button", {
      style: editPill,
      onClick: function onClick() {
        setPage("Gym");
      }
    }, "Open \u2192")), !nextRot && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginBottom: 8
      }
    }, "Set up your rotation in the Gym tab."), gymDraftBanner && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "10px 13px",
        borderRadius: 12,
        background: "rgba(225,234,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 20px rgba(255,209,102,0.3),inset 0 1px 0 rgba(255,255,255,0.05)",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: T.warn
      }
    }, "Unfinished session restored \xB7 keep logging or discard"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        try {
          localStorage.removeItem('gym_draft');
        } catch (_) {}
        setGymDraftBanner(false);
        setNxtRows(nextRot && nextRot.exercises && nextRot.exercises.length > 0 ? nextRot.exercises.map(function (ex, i) {
          return {
            id: ex.id || i + 1,
            exercise: ex.exercise || "",
            sets: ex.sets || "",
            reps: ex.reps || "",
            weight: ex.weight || ""
          };
        }) : [{
          id: 1,
          exercise: "",
          sets: "",
          reps: "",
          weight: ""
        }, {
          id: 2,
          exercise: "",
          sets: "",
          reps: "",
          weight: ""
        }, {
          id: 3,
          exercise: "",
          sets: "",
          reps: "",
          weight: ""
        }]);
      },
      style: _objectSpread(_objectSpread({}, btnGlass), {}, {
        fontSize: 10,
        padding: "3px 10px"
      })
    }, "Discard")), /*#__PURE__*/React.createElement("datalist", {
      id: "homeExSuggestions"
    }, function () {
      var seen = {};
      var names = [];
      ((data.gym || {}).exercises || []).forEach(function (ex) {
        var n = (ex.name || "").trim();
        if (n && !seen[n.toLowerCase()]) {
          seen[n.toLowerCase()] = true;
          names.push(n);
        }
      });
      ((data.gym || {}).rotation || []).forEach(function (r) {
        (r.exercises || []).forEach(function (ex) {
          var n = (ex.exercise || "").trim();
          if (n && !seen[n.toLowerCase()]) {
            seen[n.toLowerCase()] = true;
            names.push(n);
          }
        });
      });
      return names;
    }().map(function (n) {
      return React.createElement("option", {
        key: n,
        value: n
      });
    })), mob ? nxtRows.map(function (row, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: row.id,
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 52px 52px 64px",
          gap: 5,
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, inp), {}, {
          padding: "8px 8px",
          fontSize: 12
        }),
        list: "homeExSuggestions",
        placeholder: ["Bench Press", "Squat", "OHP"][i] || "Exercise",
        value: row.exercise,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                exercise: ev.target.value
              }) : x;
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, inp), {}, {
          padding: "8px 4px",
          fontSize: 12
        }),
        type: "number",
        placeholder: "Sets",
        value: row.sets,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                sets: ev.target.value
              }) : x;
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, inp), {}, {
          padding: "8px 4px",
          fontSize: 12
        }),
        type: "number",
        placeholder: "Reps",
        value: row.reps,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                reps: ev.target.value
              }) : x;
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: _objectSpread(_objectSpread({}, inp), {}, {
          padding: "8px 4px",
          fontSize: 12
        }),
        type: "number",
        placeholder: "kg",
        value: row.weight,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                weight: ev.target.value
              }) : x;
            });
          });
        }
      }));
    }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 50px 50px 60px",
        gap: 6,
        marginBottom: 4
      }
    }, ["Exercise", "Sets", "Reps", "kg"].map(function (h) {
      return /*#__PURE__*/React.createElement("div", {
        key: h,
        style: {
          fontSize: 9,
          color: T.text3
        }
      }, h);
    })), nxtRows.map(function (row, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: row.id,
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 50px 50px 60px",
          gap: 6,
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("input", {
        style: inp,
        list: "homeExSuggestions",
        placeholder: ["Bench Press", "Squat", "Overhead Press"][i] || "Exercise",
        value: row.exercise,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                exercise: ev.target.value
              }) : x;
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: inp,
        type: "number",
        placeholder: "4",
        value: row.sets,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                sets: ev.target.value
              }) : x;
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: inp,
        type: "number",
        placeholder: "8",
        value: row.reps,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                reps: ev.target.value
              }) : x;
            });
          });
        }
      }), /*#__PURE__*/React.createElement("input", {
        style: inp,
        type: "number",
        placeholder: "80",
        value: row.weight,
        onChange: function onChange(ev) {
          setNxtRows(function (r) {
            return r.map(function (x, j) {
              return j === i ? _objectSpread(_objectSpread({}, x), {}, {
                weight: ev.target.value
              }) : x;
            });
          });
        }
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: btn,
      onClick: function onClick() {
        setNxtRows(function (r) {
          return r.concat([{
            id: Date.now(),
            exercise: "",
            sets: "",
            reps: "",
            weight: ""
          }]);
        });
      }
    }, "+ Row"), /*#__PURE__*/React.createElement("button", {
      style: btnP,
      onClick: saveNextSess
    }, "Save to Gym \u2192")));
  }
  function renderBodyweightCard() {
    return /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: card(!bwLogged && dLeft <= 3 ? {
        boxShadow: "0 0 26px " + bwColMap[bwUrg] + "55," + cardShadow
      } : {})
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: "#f3f7fd"
      }
    }, "Weekly body weight"), !bwLogged && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: bwColMap[bwUrg],
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 99,
        background: bwColMap[bwUrg] + "18"
      }
    }, dLeft, "d left")), bwLogged && !bwEditing ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "4px 0 8px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 32,
        color: T.success,
        lineHeight: 1,
        fontWeight: 700
      }
    }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 700,
        color: T.success,
        lineHeight: 1.1
      }
    }, function () {
      var e = (data.gym.bodyWeight || []).find(function (e) {
        return e.date >= thisWeek;
      });
      return e ? e.weight + " kg" : "Logged";
    }()), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: T.text3,
        fontSize: 16,
        opacity: 0.45,
        lineHeight: 1,
        padding: "0 2px"
      },
      title: "Delete this entry",
      onClick: function onClick() {
        var e = (data.gym.bodyWeight || []).find(function (en) {
          return en.date >= thisWeek;
        });
        if (e) deleteBWEntry(e.date);
      }
    }, "\xD7")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.success,
        opacity: 0.75,
        marginTop: 2
      }
    }, "Logged this week"))), (data.gym.bodyWeight || []).length >= 2 && /*#__PURE__*/React.createElement(Sparkline, {
      data: data.gym.bodyWeight,
      color: T.success,
      width: 180,
      height: 40
    }), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10,
        padding: "4px 10px",
        marginTop: 8
      }),
      onClick: function onClick() {
        var e = (data.gym.bodyWeight || []).find(function (e) {
          return e.date >= thisWeek;
        });
        if (e) {
          setBwIn(String(e.weight));
          setBwDate(e.date);
        } else {
          setBwIn("");
          setBwDate(todayStr());
        }
        setBwEditing(true);
      }
    }, "Edit / add past entry")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginBottom: 8
      }
    }, bwEditing ? "Update your entry or add a past entry below" : dLeft <= 1 ? "Last chance, ends tomorrow!" : dLeft <= 3 ? "Log before the week ends" : "Log once this week"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, inp), {}, {
        flex: 1
      }),
      type: "number",
      step: "0.1",
      placeholder: "e.g. 81.2 kg",
      value: bwIn,
      onChange: function onChange(ev) {
        setBwIn(ev.target.value);
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: btnP,
      onClick: logBW
    }, "Log")), /*#__PURE__*/React.createElement("input", {
      type: "date",
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "6px 10px",
        fontSize: 11,
        color: T.text3
      }),
      value: bwDate,
      onChange: function onChange(ev) {
        setBwDate(ev.target.value);
      }
    }), bwLogged && bwEditing && /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10,
        padding: "4px 10px",
        marginTop: 6,
        opacity: 0.6
      }),
      onClick: function onClick() {
        setBwEditing(false);
        setBwIn("");
        setBwDate(todayStr());
      }
    }, "Cancel")));
  }
  function catColor(c) {
    return (window.TASK_CAT_COLORS || {})[c] || window.TASK_CAT_FALLBACK || "#8f97a6";
  }
  function renderTaskRow(t, group) {
    var cat = t.cat || "Other";
    var col = catColor(cat);
    var isActive = scheduleTaskId === t.id;
    var latest = t.updates && t.updates.length ? t.updates[t.updates.length - 1] : null;
    // Only worth printing when the row is NOT already under its own heading — a doing
    // task pulled into Overdue by the match order still needs to say so.
    var stateBadge = group !== t.state && (t.state === "doing" ? "▶ In progress" : t.state === "waiting" ? "⏸ Waiting" : null);
    // Done rows say when, not "done" — the clock button exists to set that date, so it
    // has to be visible. Waiting keeps its overdue text but in the dimmest tone.
    var meta = group === "done" ? t.completedAt ? fmtDate(t.completedAt) + (t.completedTime ? " · " + fmtTime12(t.completedTime) : "") : "" : taskLabel(t);
    var metaColor = group === "waiting" ? T.text3 : group === "overdue" ? T.danger : T.text3;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: "glow-item task-row",
      style: {
        display: "flex",
        gap: 9,
        marginBottom: 7,
        alignItems: "flex-start",
        padding: "10px 12px",
        borderRadius: 12,
        opacity: group === "done" ? 0.5 : 1,
        background: isActive ? "rgba(91,140,255,0.12)" : "rgba(225,234,255,0.04)",
        border: "1px solid " + (isActive ? "rgba(91,140,255,0.5)" : "rgba(255,255,255,0.07)"),
        borderLeft: "3px solid " + col,
        transition: "background 0.15s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: 1,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(TickCircle, {
      done: !!t.done,
      size: 18,
      onClick: function onClick() {
        toggleTask(t.id);
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 500,
        color: T.text,
        textDecoration: t.done ? "line-through" : "none"
      }
    }, t.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: T.text2
      }
    }, cat), stateBadge && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: T.accent
      }
    }, stateBadge), !t.done && t.priority === "urgent" && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: T.danger,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.4
      }
    }, "urgent"), meta && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: metaColor
      }
    }, meta)), latest && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        marginTop: 3,
        fontStyle: "italic",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, "\"", latest.text, "\" \u2014 ", fmtDate(latest.at))), /*#__PURE__*/React.createElement("span", {
      className: "row-actions" + (isActive ? " is-armed" : ""),
      style: {
        display: "flex",
        flexShrink: 0,
        marginTop: 1
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        background: "none",
        border: "none",
        padding: "2px 4px",
        cursor: "pointer",
        color: T.text3,
        flexShrink: 0,
        opacity: 0.45,
        display: "flex"
      },
      title: "Open task",
      onClick: function onClick(e) {
        e.stopPropagation();
        openTaskDetail(t.id);
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "pencil",
      size: 12
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "none",
        border: "none",
        padding: "2px 4px",
        cursor: "pointer",
        color: T.text3,
        flexShrink: 0,
        opacity: 0.45,
        display: "flex"
      },
      title: "Mark done on a different day",
      onClick: function onClick(e) {
        e.stopPropagation();
        openBackdateModal(t.id);
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "clock",
      size: 12
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "none",
        border: "none",
        padding: "2px 4px",
        cursor: "pointer",
        color: isActive ? T.accent : T.text3,
        fontSize: 14,
        flexShrink: 0,
        lineHeight: 1,
        opacity: isActive ? 1 : 0.45,
        transition: "opacity 0.15s,color 0.15s"
      },
      title: "Schedule",
      onClick: function onClick(e) {
        e.stopPropagation();
        if (scheduleTaskId === t.id) {
          setScheduleTaskId(null);
        } else {
          trk("task.schedule");
          setScheduleTaskId(t.id);
          showToast("Tap a calendar day to schedule (or ESC)", "warn");
        }
      }
    }, "\u283F")));
  }
  function renderTasksCard() {
    var TG = window.TaskGrouping;
    var all = data.personal.tasks || [];
    var counts = TG.categoryCounts(all);
    var shown = catFilter ? all.filter(function (t) {
      return (t.cat || "Other") === catFilter;
    }) : all;
    var groups = TG.groupTasks(shown, todayStr());
    var empty = TG.DISPLAY_ORDER.every(function (g) {
      return groups[g].length === 0;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: card()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: sT
    }, "Tasks"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        fontSize: 14,
        padding: "2px 12px"
      }),
      onClick: function onClick() {
        setModal("add_task");
        setMForm({
          priority: "normal",
          cat: "Errands",
          state: "todo"
        });
      }
    }, "+")), scheduleTaskId && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.accent,
        marginBottom: 6,
        padding: "3px 8px",
        borderRadius: 6,
        background: T.accentBg,
        border: "0.5px solid rgba(91,140,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", null, "Tap a calendar day to schedule (or ESC)"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setScheduleTaskId(null);
      },
      title: "Cancel scheduling",
      style: {
        background: "none",
        border: "none",
        color: T.accent,
        cursor: "pointer",
        fontSize: 14,
        padding: "0 4px",
        lineHeight: 1,
        fontWeight: 700
      }
    }, "\xD7")), (counts.length > 0 || catFilter) && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 12,
        paddingBottom: 10,
        borderBottom: "0.5px solid " + T.border
      }
    }, counts.map(function (c) {
      var on = catFilter === c.cat;
      return /*#__PURE__*/React.createElement("button", {
        key: c.cat,
        onClick: function onClick() {
          setCatFilter(on ? null : c.cat);
        },
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 9px",
          borderRadius: 999,
          cursor: "pointer",
          fontSize: 10,
          background: on ? catColor(c.cat) + "28" : "rgba(255,255,255,0.04)",
          border: "1px solid " + (on ? catColor(c.cat) + "90" : "rgba(255,255,255,0.10)"),
          color: on ? T.text : T.text2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: catColor(c.cat),
          boxShadow: "0 0 6px " + catColor(c.cat) + "90",
          flexShrink: 0
        }
      }), c.cat, /*#__PURE__*/React.createElement("span", {
        style: {
          color: T.text,
          fontWeight: 700
        }
      }, c.count));
    }), catFilter && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setCatFilter(null);
      },
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10,
        padding: "3px 9px"
      })
    }, "Clear")), empty && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text2
      }
    }, catFilter ? "Nothing in " + catFilter : "All clear ✓"), TG.DISPLAY_ORDER.map(function (g) {
      if (groups[g].length === 0) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: g
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          fontWeight: 700,
          marginBottom: 6,
          marginTop: 8,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: g === "overdue" ? T.danger : T.text3,
          display: "flex",
          gap: 6,
          alignItems: "center"
        }
      }, TG.GROUP_LABEL[g], /*#__PURE__*/React.createElement("span", {
        style: {
          color: T.text3,
          fontWeight: 600
        }
      }, groups[g].length)), groups[g].map(function (t) {
        return renderTaskRow(t, g);
      }));
    }));
  }
  function renderNecessitiesCard() {
    var W = window.WeekUtils;
    var nec = data.personal && data.personal.necessities || {
      items: [],
      ticks: {}
    };
    var items = nec.items || [];
    var today = todayStr();
    var isDone = function isDone(id) {
      return W.isDoneThisWeek((nec.ticks || {})[id], today);
    };
    var doneCount = items.filter(function (i) {
      return isDone(i.id);
    }).length;
    var elapsed = W.weekElapsedFraction(today);
    var progress = items.length ? doneCount / items.length : 0;
    // With no items there is nothing to be behind on — otherwise the card nags from
    // Tuesday onward about an empty list.
    var behind = items.length > 0 && progress < elapsed - 0.15;
    var daysLeft = Math.round((1 - elapsed) * 7);
    function toggle(id) {
      setData(function (p) {
        var cur = p.personal && p.personal.necessities || {
          items: [],
          ticks: {}
        };
        var ticks = _objectSpread({}, cur.ticks || {});
        if (W.isDoneThisWeek(ticks[id], todayStr())) delete ticks[id];else ticks[id] = todayStr();
        return _objectSpread(_objectSpread({}, p), {}, {
          personal: _objectSpread(_objectSpread({}, p.personal), {}, {
            necessities: _objectSpread(_objectSpread({}, cur), {}, {
              items: cur.items || [],
              ticks: ticks
            })
          })
        });
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: card()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: sT
    }, "Weekly necessities"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: T.text3
      }
    }, doneCount, "/", items.length), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10,
        padding: "2px 9px"
      }),
      onClick: function onClick() {
        setModal("edit_necessities");
        setMForm({
          newItem: ""
        });
      }
    }, "Edit"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5,
        borderRadius: 3,
        background: "rgba(255,255,255,0.06)",
        overflow: "hidden",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: progress * 100 + "%",
        height: "100%",
        borderRadius: 3,
        background: behind ? T.warn : T.success,
        transition: "width 0.25s"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        marginBottom: 10
      }
    }, daysLeft === 0 ? "Last day · resets Monday" : daysLeft + " day" + (daysLeft === 1 ? "" : "s") + " left · resets Monday"), items.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text2
      }
    }, "No necessities yet \u2014 hit Edit to add the things you do every week."), items.map(function (i) {
      var done = isDone(i.id);
      var urgent = !done && daysLeft <= 2; // Friday onward — matches the spec
      return /*#__PURE__*/React.createElement("div", {
        key: i.id,
        onClick: function onClick() {
          toggle(i.id);
        },
        style: {
          display: "flex",
          gap: 9,
          alignItems: "center",
          padding: "8px 10px",
          marginBottom: 5,
          borderRadius: 10,
          cursor: "pointer",
          opacity: done ? 0.5 : 1,
          background: "rgba(225,234,255,0.04)",
          border: "1px solid " + (urgent ? T.warn + "55" : "rgba(255,255,255,0.07)")
        }
      }, /*#__PURE__*/React.createElement(TickCircle, {
        done: done,
        size: 18,
        inert: true
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: T.text,
          flex: 1,
          minWidth: 0,
          textDecoration: done ? "line-through" : "none"
        }
      }, i.name), urgent && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 9,
          color: T.warn,
          flexShrink: 0
        }
      }, daysLeft === 0 ? "today" : daysLeft + " day" + (daysLeft === 1 ? "" : "s") + " left"));
    }));
  }
  function renderHomeCard(id) {
    switch (id) {
      case "shopping":
        return /*#__PURE__*/React.createElement(ErrorBoundary, {
          name: "ShoppingHome"
        }, /*#__PURE__*/React.createElement(ShoppingHomeCard, {
          items: data.shopping || [],
          onUpdate: updateShopping,
          onOpen: function onOpen() {
            setPage("Shopping");
          },
          cardStyle: card(),
          mob: mob
        }));
      case "weather":
        return /*#__PURE__*/React.createElement(WeatherWidget, {
          mob: mob
        });
      case "goals":
        return renderGoalsCard();
      // returns null when not onboarded
      case "assessments":
        return renderAssessmentsCard();
      case "gym-next":
        return renderGymNextCard();
      case "bodyweight":
        return renderBodyweightCard();
      case "tasks":
        return renderTasksCard();
      case "classes":
        return /*#__PURE__*/React.createElement(UpcomingClassesCard, {
          events: dedupedEvents,
          days: 7,
          gcalConnected: gcalConnected,
          evColor: evColor,
          evLabel: evLabel,
          cardStyle: card()
        });
      case "necessities":
        return renderNecessitiesCard();
      default:
        return null;
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "dashboard-reveal",
    style: {
      fontFamily: "'Geist',system-ui,sans-serif",
      minHeight: "100vh",
      background: "transparent",
      color: T.text,
      position: "relative",
      boxSizing: "border-box",
      paddingLeft: mob ? 0 : navCollapsed ? 80 : 230,
      transition: "padding-left 0.22s cubic-bezier(0.23,1,0.32,1)"
    }
  }, showMonitor && window.MonitoringPanel && /*#__PURE__*/React.createElement(MonitoringPanel, {
    onClose: function onClose() {
      setShowMonitor(false);
    },
    settings: {
      geminiKey: geminiKey,
      groqKey: groqKey,
      githubPAT: data.settings && data.settings.githubPAT || ""
    },
    onSaveSettings: function onSaveSettings(s) {
      if (s.geminiKey !== undefined) {
        var k = s.geminiKey.trim();
        setGeminiKey(k);
        try {
          localStorage.setItem('__gemini_key__', k);
        } catch (_) {}
      }
      if (s.groqKey !== undefined) {
        var gk = s.groqKey.trim();
        setGroqKey(gk);
        try {
          localStorage.setItem('__groq_key__', gk);
        } catch (_) {}
      }
      if (s.githubPAT !== undefined) {
        setData(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, {
            settings: _objectSpread(_objectSpread({}, p.settings || {}), {}, {
              githubPAT: s.githubPAT.trim()
            })
          });
        });
      }
    }
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "toast-popup",
    style: {
      position: "fixed",
      bottom: mob ? 90 : 28,
      left: "50%",
      transform: "translateX(-50%)",
      background: toast.type === "success" ? "rgba(105,240,174,0.97)" : toast.type === "warn" ? "rgba(255,209,102,0.97)" : "rgba(255,107,107,0.97)",
      color: "#05071a",
      padding: "10px 20px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      zIndex: 500,
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      maxWidth: 320,
      textAlign: "center",
      pointerEvents: "none",
      whiteSpace: "pre-line"
    }
  }, toast.msg), errLog.length > 0 && !showErrPanel && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setShowErrPanel(true);
    },
    style: {
      position: "fixed",
      bottom: mob ? 160 : 80,
      right: 16,
      zIndex: 498,
      background: "rgba(255,107,107,0.92)",
      border: "none",
      borderRadius: 8,
      padding: "5px 10px",
      cursor: "pointer",
      fontSize: 11,
      fontWeight: 700,
      color: "#fff",
      boxShadow: "0 4px 16px rgba(255,107,107,0.5)",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "warn",
    size: 12
  }), errLog.length, " error", errLog.length !== 1 ? "s" : ""), showErrPanel && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: mob ? 170 : 80,
      right: 16,
      zIndex: 499,
      width: Math.min(400, window.innerWidth - 32),
      maxHeight: "60vh",
      overflowY: "auto",
      background: "rgba(10,5,5,0.98)",
      border: "1px solid rgba(255,107,107,0.5)",
      borderRadius: 12,
      padding: "12px 14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#ff6b6b",
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "warn",
    size: 12
  }), "Error log (", errLog.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      padding: "1px 7px",
      borderRadius: 5,
      border: "0.5px solid rgba(255,107,107,0.4)",
      background: "transparent",
      color: "#ff6b6b",
      cursor: "pointer",
      fontSize: 10
    },
    onClick: function onClick() {
      setErrLog([]);
      setShowErrPanel(false);
    }
  }, "Clear all"), /*#__PURE__*/React.createElement("button", {
    style: {
      padding: "1px 7px",
      borderRadius: 5,
      border: "0.5px solid rgba(255,255,255,0.12)",
      background: "transparent",
      color: "#aaa",
      cursor: "pointer",
      fontSize: 10
    },
    onClick: function onClick() {
      setShowErrPanel(false);
    }
  }, "Hide"))), errLog.map(function (e) {
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      style: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottom: "0.5px solid rgba(255,107,107,0.12)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        color: "#ff6b6b",
        marginBottom: 2
      }
    }, e.time, " \xB7 in ", /*#__PURE__*/React.createElement("code", {
      style: {
        background: "rgba(255,107,107,0.15)",
        padding: "0 4px",
        borderRadius: 3
      }
    }, e.fn)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#ffcdd2",
        marginBottom: e.stack ? 4 : 0,
        wordBreak: "break-word"
      }
    }, e.msg), e.stack && /*#__PURE__*/React.createElement("pre", {
      style: {
        fontSize: 9,
        color: "rgba(255,255,255,0.3)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        margin: 0,
        lineHeight: 1.4
      }
    }, e.stack));
  })), !mob && /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      width: navCollapsed ? 68 : 218,
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      padding: navCollapsed ? "18px 10px" : "18px 14px",
      gap: 3,
      background: cardBg,
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      borderRight: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "8px 0 32px rgba(0,0,0,0.40),inset 0 1px 0 rgba(255,255,255,0.22)",
      transition: "width 0.22s cubic-bezier(0.23,1,0.32,1)",
      overflowY: "auto",
      overflowX: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: navCollapsed ? "0 0 16px" : "2px 4px 16px",
      borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      marginBottom: 10,
      justifyContent: navCollapsed ? "center" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      flexShrink: 0,
      overflow: "hidden",
      background: "linear-gradient(135deg,#5b8cff,#3a5fcc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      fontWeight: 700,
      color: "#fff"
    }
  }, authUser && authUser.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: authUser.photoURL,
    alt: "",
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%"
    }
  }) : "J"), !navCollapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: T.text,
      letterSpacing: -0.2,
      whiteSpace: "nowrap"
    }
  }, "Ashley"), /*#__PURE__*/React.createElement("div", {
    title: syncStatus === "synced" ? "Synced to cloud" : syncStatus === "syncing" ? "Saving..." : syncStatus === "loading" ? "Connecting..." : "Offline — saved locally",
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      flexShrink: 0,
      background: syncStatus === "synced" ? T.success : syncStatus === "syncing" ? T.warn : syncStatus === "loading" ? T.text3 : T.danger,
      boxShadow: syncStatus === "synced" ? "0 0 6px " + T.success : syncStatus === "syncing" ? "0 0 6px " + T.warn : "none",
      transition: "background 0.4s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginTop: 1
    }
  }, "Personal Dashboard"))), syncStatus === "offline" && getLatestBackup() && /*#__PURE__*/React.createElement("button", {
    onClick: restoreFromBackup,
    title: "Restore backup",
    style: {
      fontSize: 10,
      padding: navCollapsed ? "7px 0" : "5px 10px",
      marginBottom: 8,
      borderRadius: 8,
      border: "0.5px solid rgba(255,209,102,0.5)",
      background: "rgba(255,209,102,0.1)",
      color: T.warn,
      cursor: "pointer",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: navCollapsed ? "center" : "flex-start",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "restore",
    size: 13
  })), !navCollapsed && "Restore backup"), NAV_PAGES.map(function (s) {
    var active = page === s;
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      title: navCollapsed ? s : undefined,
      onClick: function onClick() {
        setPage(s);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        width: "100%",
        padding: navCollapsed ? "11px 0" : "10px 12px",
        justifyContent: navCollapsed ? "center" : "flex-start",
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: active ? "rgba(91,140,255,0.14)" : "transparent",
        color: active ? T.text : T.text2,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        position: "relative",
        textAlign: "left",
        transition: "background 0.15s,color 0.15s"
      },
      onMouseOver: function onMouseOver(e) {
        if (!active) e.currentTarget.style.background = "rgba(225,234,255,0.06)";
      },
      onMouseOut: function onMouseOut(e) {
        if (!active) e.currentTarget.style.background = "transparent";
      }
    }, active && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        top: "22%",
        bottom: "22%",
        width: 3,
        borderRadius: "0 3px 3px 0",
        background: T.accent
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: active ? T.accent : T.text2
      }
    }, /*#__PURE__*/React.createElement(NavGlyph, {
      name: s
    })), !navCollapsed && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        whiteSpace: "nowrap"
      }
    }, s));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      paddingTop: 10,
      borderTop: "0.5px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: exportData,
    title: "Download all your data as JSON backup",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      width: "100%",
      padding: navCollapsed ? "10px 0" : "9px 12px",
      justifyContent: navCollapsed ? "center" : "flex-start",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "transparent",
      color: T.text2,
      fontSize: 12.5,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v12M7 11l5 4 5-4M5 21h14"
  }))), !navCollapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "nowrap"
    }
  }, "Export data")), /*#__PURE__*/React.createElement("button", {
    disabled: obsExportStatus === "running",
    title: "Trigger Obsidian export now via GitHub Actions",
    onClick: function onClick() {
      var pat = (data.settings && data.settings.githubPAT || "").trim();
      if (!pat) {
        showToast("GitHub PAT not set. Add it in Settings.", "error");
        return;
      }
      trk("export.manual");
      setObsExportStatus("running");
      fetch("https://api.github.com/repos/jaydenpineda30-glitch/obsidian-notes/actions/workflows/export.yml/dispatches", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + pat,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github+json"
        },
        body: JSON.stringify({
          ref: "main"
        })
      }).then(function (r) {
        if (r.status === 204) {
          setObsExportStatus("done");
          showToast("Export triggered, notes will appear in Obsidian in ~30s", "success");
          setTimeout(function () {
            setObsExportStatus("idle");
          }, 4000);
        } else {
          setObsExportStatus("error");
          showToast("Export trigger failed (status " + r.status + ")", "error");
          setTimeout(function () {
            setObsExportStatus("idle");
          }, 3000);
        }
      })["catch"](function () {
        setObsExportStatus("error");
        showToast("Export trigger failed, check connection", "error");
        setTimeout(function () {
          setObsExportStatus("idle");
        }, 3000);
      });
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      width: "100%",
      padding: navCollapsed ? "10px 0" : "9px 12px",
      justifyContent: navCollapsed ? "center" : "flex-start",
      borderRadius: 12,
      border: "none",
      cursor: obsExportStatus === "running" ? "default" : "pointer",
      background: "transparent",
      color: obsExportStatus === "running" ? T.text3 : obsExportStatus === "done" ? T.success : T.text2,
      fontSize: 12.5,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v12M7 8l5-5 5 5M5 21h14"
  }))), !navCollapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "nowrap"
    }
  }, obsExportStatus === "running" ? "Exporting…" : obsExportStatus === "done" ? "Exported ✓" : "Obsidian sync")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setShowMonitor(true);
    },
    title: "System logs & health",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      width: "100%",
      padding: navCollapsed ? "10px 0" : "9px 12px",
      justifyContent: navCollapsed ? "center" : "flex-start",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "transparent",
      color: T.text2,
      fontSize: 12.5,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6h16M4 12h16M4 18h10"
  }))), !navCollapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "nowrap"
    }
  }, "Logs")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      _auth.signOut();
    },
    title: "Sign out",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      width: "100%",
      padding: navCollapsed ? "10px 0" : "9px 12px",
      justifyContent: navCollapsed ? "center" : "flex-start",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "transparent",
      color: T.text2,
      fontSize: 12.5,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
  }))), !navCollapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "nowrap"
    }
  }, "Sign out")), /*#__PURE__*/React.createElement("button", {
    onClick: toggleNav,
    title: navCollapsed ? "Expand sidebar" : "Collapse sidebar",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      width: "100%",
      padding: navCollapsed ? "10px 0" : "9px 12px",
      justifyContent: navCollapsed ? "center" : "flex-start",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "transparent",
      color: T.text3,
      fontSize: 12.5,
      fontWeight: 500,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexShrink: 0,
      transform: navCollapsed ? "rotate(180deg)" : "none",
      transition: "transform 0.22s cubic-bezier(0.23,1,0.32,1)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), !navCollapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "nowrap"
    }
  }, "Collapse")), !navCollapsed && appVersion && /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      trk("version.click");
    },
    title: "Released " + appVersion.date,
    style: {
      fontSize: 9,
      color: T.text3,
      opacity: 0.6,
      padding: "6px 12px 0",
      letterSpacing: 0.3,
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, appVersion.version))), !mob && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setForceMob(true);
    },
    style: {
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 200,
      padding: "10px 16px",
      borderRadius: 99,
      border: "1px solid rgba(91,140,255,0.5)",
      background: "rgba(14,16,40,0.95)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: T.accent,
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "phone",
    size: 14
  })), "Mobile view"), mob && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 16px",
      background: "rgba(5,7,26,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "0.5px solid rgba(91,140,255,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 2px 20px rgba(0,0,0,0.4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: T.accent,
      textShadow: "0 0 12px rgba(91,140,255,0.6)"
    }
  }, page), !rawMob && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setForceMob(false);
    },
    style: _objectSpread(_objectSpread({}, btn), {}, {
      padding: "5px 10px",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      gap: 5
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "desktop",
    size: 13
  })), "Desktop view")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: mob ? "10px 12px" : "24px 28px",
      maxWidth: mob ? 430 : 1180,
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
      paddingBottom: mob ? 80 : 40
    }
  }, page === "Dashboard" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mob ? 20 : 24,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#eef3fb"
    }
  }, function () {
    var h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }(), ", Ashley"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#7a85a0",
      marginTop: 4
    }
  }, new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }))), !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, layoutEditing && /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      color: T.danger,
      borderColor: T.danger + "50"
    }),
    onClick: function onClick() {
      if (window.confirm("Reset the home page to its default layout?")) {
        saveLayout(window.HomeLayout.defaultLayout());
      }
    }
  }, "Reset layout"), /*#__PURE__*/React.createElement("button", {
    style: layoutEditing ? btnP : btn,
    onClick: function onClick() {
      setLayoutEditing(function (v) {
        return !v;
      });
    }
  }, layoutEditing ? "Done" : "Edit layout"))), /*#__PURE__*/React.createElement(ErrorBoundary, {
    name: "Jarvis"
  }, /*#__PURE__*/React.createElement(JarvisCard, {
    candidates: jarvisCandidates,
    mob: mob,
    onOpen: function onOpen(p) {
      setPage(p);
    },
    cardStyle: card({
      padding: "16px 20px",
      marginBottom: mob ? 12 : GRID_GAP
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: card({
      padding: "16px 20px",
      marginBottom: mob ? 12 : GRID_GAP
    })
  }, renderCalendarCard()), mob ? /*#__PURE__*/React.createElement("div", null, homeLayout.map(function (e) {
    var body = renderHomeCard(e.id);
    return body ? /*#__PURE__*/React.createElement("div", {
      key: e.id,
      style: {
        marginBottom: 12
      }
    }, body) : null;
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gridAutoRows: GRID_ROW_UNIT + "px",
      gridAutoFlow: "row dense",
      columnGap: GRID_GAP,
      rowGap: 0,
      alignItems: "start"
    }
  }, homeLayout.map(function (e, idx) {
    var body = renderHomeCard(e.id);
    if (!body) return null;
    var meta = window.HomeLayout.HOME_CARDS.filter(function (c) {
      return c.id === e.id;
    })[0] || {};
    return /*#__PURE__*/React.createElement(HomeGridCard, {
      key: e.id,
      span: e.span,
      editing: layoutEditing,
      title: meta.title || e.id,
      isDragging: dragId === e.id,
      isDropTarget: layoutEditing && dropIdx === idx && dragId !== null && dragId !== e.id,
      onSpan: function onSpan(n) {
        saveLayout(window.HomeLayout.setSpan(homeLayout, e.id, n));
      },
      onDragStart: function onDragStart(ev) {
        if (ev.button !== 0 || !ev.isPrimary) return;
        ev.preventDefault();
        setDragId(e.id);
        setDropIdx(idx);
      },
      onDragOver: function onDragOver() {
        if (dragId) setDropIdx(idx);
      }
    }, body);
  })), appVersion && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "10px 0 2px",
      fontSize: 10,
      color: T.text3,
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: function onClick() {
      trk("version.click");
    },
    title: "Released " + appVersion.date,
    style: {
      cursor: "pointer"
    }
  }, appVersion.version), " · ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/jaydenpineda30-glitch/Main/releases",
    target: "_blank",
    rel: "noreferrer",
    style: {
      color: T.text3,
      textDecoration: "none"
    }
  }, "patch notes \u2197"))), page === "Uni" && /*#__PURE__*/React.createElement("div", null, function () {
    var assessments = data.uni.assessments || SYLLABUS_ASSESSMENTS;
    var totalA = assessments.length;
    var doneA = assessments.filter(function (a) {
      return a.done;
    }).length;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: card()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: totalA > 0 ? 10 : 0
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: sT
    }, "Assessments"), totalA > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 2
      }
    }, doneA, " of ", totalA, " complete")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10
      }),
      onClick: function onClick() {
        setShowAddAssess(true);
      }
    }, "+ Add"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        borderColor: "rgba(91,140,255,0.4)"
      }),
      onClick: function onClick() {
        setShowSyllabusImport(true);
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "upload",
      size: 11
    }), "Import"))), totalA > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        height: 2,
        borderRadius: 1,
        background: "rgba(255,255,255,0.06)",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "bar-reveal",
      style: {
        height: "100%",
        borderRadius: 1,
        background: doneA === totalA ? "#69f0ae" : "#5b8cff",
        width: Math.round(doneA / totalA * 100) + "%",
        transition: "width 0.4s cubic-bezier(0.23,1,0.32,1)"
      }
    })), assessments.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "36px 0 24px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text2,
        marginBottom: 14
      }
    }, "No assessments this semester"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, editPill), {}, {
        borderColor: "rgba(91,140,255,0.4)",
        padding: "6px 16px"
      }),
      onClick: function onClick() {
        setShowSyllabusImport(true);
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "upload",
      size: 11
    }), " Import syllabus")) : function () {
      var upcoming2 = assessments.filter(function (a) {
        return !a.done && daysBetween(a.date) >= 0;
      }).sort(function (a, b) {
        return a.date.localeCompare(b.date);
      });
      var overdue = assessments.filter(function (a) {
        return !a.done && daysBetween(a.date) < 0;
      }).sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
      var done2 = assessments.filter(function (a) {
        return a.done;
      }).sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
      return upcoming2.concat(overdue).concat(done2).map(function (a) {
        var days = daysBetween(a.date);
        var badge = typeBadge(a.type);
        var isUrg = !a.done && days >= 0 && days <= 3;
        var isPast = !a.done && days < 0;
        var dayLabel = days === 0 ? "Today" : days === 1 ? "Tomorrow" : days <= 13 ? WX_DAYS[new Date(a.date + "T00:00").getDay()] + " · " + days + "d" : fmtDate(a.date);
        var dotCol = a.done ? "#69f0ae" : isPast ? "#ff6b6b" : isUrg ? "#ffd166" : "#5b8cff";
        var dotGlow = a.done ? "0 0 6px #69f0ae" : isPast ? "0 0 6px #ff6b6b" : isUrg ? "0 0 5px #ffd166" : "0 0 6px #5b8cff";
        var barCol = isPast ? T.danger : a.done ? "#69f0ae" : "#5b8cff";
        return /*#__PURE__*/React.createElement("div", {
          key: a.id,
          style: {
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            paddingLeft: 14,
            borderRadius: 8,
            background: T.bg3,
            border: "0.5px solid " + (isPast && !a.done ? "rgba(255,107,107,0.2)" : T.border),
            marginBottom: 5,
            opacity: a.done ? 0.5 : 1,
            overflow: "hidden",
            transition: "all 0.15s"
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            position: "absolute",
            left: 0,
            top: 5,
            bottom: 5,
            width: 2,
            borderRadius: 1,
            background: barCol,
            opacity: a.done ? 0.35 : isPast ? 1 : 0.7
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            width: 18,
            height: 18,
            borderRadius: 5,
            border: "1.5px solid " + (a.done ? "#69f0ae" : T.border2),
            background: a.done ? "#69f0ae" : "transparent",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          onClick: function onClick() {
            toggleAssessmentDone(a.id);
          }
        }, a.done && /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10,
            color: "#05071a",
            fontWeight: 700
          }
        }, "\u2713")), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: subjectColor(data.uni.subjects, a.subject) || T.text3,
            marginRight: 6
          }
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 9,
            fontWeight: 700,
            color: T.text3,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginRight: 6
          }
        }, a.subject), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 12,
            color: a.done ? T.text3 : T.text,
            textDecoration: a.done ? "line-through" : "none"
          }
        }, a.name)), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 9,
            fontWeight: 600,
            color: T.text3,
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.10)",
            padding: "2px 7px",
            borderRadius: 999,
            flexShrink: 0,
            whiteSpace: "nowrap"
          }
        }, badge.label), /*#__PURE__*/React.createElement("div", {
          style: {
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: dotCol,
            boxShadow: dotGlow,
            flexShrink: 0
          }
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10,
            color: T.text3,
            flexShrink: 0,
            whiteSpace: "nowrap",
            minWidth: 56,
            textAlign: "right"
          }
        }, a.done ? fmtDate(a.date) : isPast ? Math.abs(days) + "d overdue" : dayLabel), /*#__PURE__*/React.createElement("button", {
          style: {
            background: "none",
            border: "none",
            color: T.text3,
            cursor: "pointer",
            fontSize: 13,
            padding: "0 2px",
            flexShrink: 0,
            opacity: 0.4,
            lineHeight: 1
          },
          onClick: function onClick() {
            removeAssessment(a.id);
          }
        }, "\xD7"));
      });
    }()), /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: card()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: (data.uni.subjects || []).length > 0 ? 10 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: sT
    }, "Subjects"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10
      }),
      onClick: function onClick() {
        setModal("add_subject");
        setMForm({
          color: nextSubjectColor(data.uni.subjects || [])
        });
      }
    }, "+ Subject")), (data.uni.subjects || []).length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text2
      }
    }, "No subjects yet. Add one, or import a syllabus below and they'll be created for you.") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8
      }
    }, data.uni.subjects.map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        key: s.id,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 10px",
          borderRadius: 999,
          background: T.bg3,
          border: "0.5px solid " + T.border
        }
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick() {
          setModal("edit_subject");
          setMForm({
            editId: s.id,
            name: s.name,
            color: s.color || nextSubjectColor(data.uni.subjects || [])
          });
        },
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: s.color || T.text3,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: T.text
        }
      }, s.name)), /*#__PURE__*/React.createElement("button", {
        style: {
          background: "none",
          border: "none",
          color: T.text3,
          cursor: "pointer",
          fontSize: 12,
          padding: 0,
          opacity: 0.5,
          lineHeight: 1
        },
        onClick: function onClick() {
          removeSubject(s.id);
        }
      }, "\xD7"));
    }))), /*#__PURE__*/React.createElement(UpcomingClassesCard, {
      events: dedupedEvents,
      days: 28,
      gcalConnected: gcalConnected,
      evColor: evColor,
      evLabel: evLabel,
      cardStyle: card()
    }));
  }()), page === "Work" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: mob ? undefined : 900
    }
  }, /*#__PURE__*/React.createElement(ErrorBoundary, {
    name: "Work"
  }, /*#__PURE__*/React.createElement(WorkSection, {
    mob: mob,
    data: data.work || {},
    onUpdate: updateWork,
    onFlush: requestImmediateSave,
    gcalEvents: dedupedEvents
  }))), page === "Gym" && /*#__PURE__*/React.createElement(ErrorBoundary, {
    name: "Gym"
  }, /*#__PURE__*/React.createElement(GymSection, {
    mob: mob,
    gymData: data.gym,
    onAddEx: function onAddEx() {
      setModal("add_exercise");
      setMForm({});
    },
    onLogW: function onLogW(ex) {
      setModal("log_weight");
      setMForm({
        exId: ex.id,
        exName: ex.name
      });
    },
    onSave: function onSave(wk) {
      setData(function (p) {
        var rl = p.gym.rotation ? p.gym.rotation.length : 1;
        var today = wk.date || todayStr();
        // Write sets back to rotation template so next session pre-fills with updated weights
        var newRot = (p.gym.rotation || []).map(function (rt) {
          if (!wk.rotId || rt.id !== wk.rotId) return rt;
          return _objectSpread(_objectSpread({}, rt), {}, {
            exercises: (wk.sets || []).map(function (r) {
              return {
                id: r.id || Date.now(),
                exercise: r.exercise,
                sets: r.sets,
                reps: r.reps,
                weight: r.weight
              };
            })
          });
        });
        // Log each exercise weight for progressive overload tracking
        var newExercises = _toConsumableArray(p.gym.exercises || []);
        (wk.sets || []).forEach(function (r) {
          if (!r.exercise) return;
          var idx = newExercises.findIndex(function (e) {
            return e.name && e.name.toLowerCase() === r.exercise.toLowerCase();
          });
          var logEntry = {
            date: today,
            weight: Number(r.weight) || 0
          };
          if (idx >= 0) {
            newExercises[idx] = _objectSpread(_objectSpread({}, newExercises[idx]), {}, {
              logs: [].concat(_toConsumableArray(newExercises[idx].logs || []), [logEntry])
            });
          } else {
            newExercises.push({
              id: 'ex_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
              name: r.exercise,
              logs: [logEntry]
            });
          }
        });
        return _objectSpread(_objectSpread({}, p), {}, {
          gym: _objectSpread(_objectSpread({}, p.gym), {}, {
            workouts: (p.gym.workouts || []).concat([wk]),
            rotIdx: ((p.gym.rotIdx || 0) + 1) % Math.max(rl, 1),
            rotation: newRot,
            exercises: newExercises
          })
        });
      });
    },
    onUpdateRot: function onUpdateRot(rot, idx) {
      setData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          gym: _objectSpread(_objectSpread({}, p.gym), {}, {
            rotation: rot,
            rotIdx: idx
          })
        });
      });
    },
    onDeleteBW: deleteBWEntry,
    onAddBW: function onAddBW(entry) {
      trk("gym.bodyweight_log");
      setData(function (p) {
        var existing = (p.gym.bodyWeight || []).filter(function (e) {
          return e.date !== entry.date;
        });
        var updated = existing.concat([{
          date: entry.date,
          weight: Number(entry.weight)
        }]).sort(function (a, b) {
          return a.date.localeCompare(b.date);
        });
        return _objectSpread(_objectSpread({}, p), {}, {
          gym: _objectSpread(_objectSpread({}, p.gym), {}, {
            bodyWeight: updated,
            lastBWWeek: entry.date >= thisWeek ? thisWeek : p.gym.lastBWWeek
          })
        });
      });
      showToast("Body weight logged!", "success");
    }
  })), page === "Personal" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: card()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sT
  }, "Tasks"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, doneTasks.length > 0 && /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      color: T.success,
      borderColor: T.success + "50"
    }),
    onClick: archiveDone
  }, "Archive done"), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setModal("add_task");
      setMForm({
        priority: "normal",
        cat: "Errands"
      });
    }
  }, "+ Task"))), editTaskId && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: "10px 12px",
      background: T.bg3,
      borderRadius: 8,
      border: "0.5px solid " + T.accent + "40"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.accent,
      marginBottom: 8,
      fontWeight: 500
    }
  }, "Editing task"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: inp,
    value: editTaskForm.name || "",
    onChange: function onChange(ev) {
      setEditTaskForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          name: ev.target.value
        });
      });
    },
    placeholder: "Task name"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("select", {
    style: inp,
    value: editTaskForm.cat || "Errands",
    onChange: function onChange(ev) {
      setEditTaskForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          cat: ev.target.value
        });
      });
    }
  }, TASK_CATS.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c
    }, c);
  })), /*#__PURE__*/React.createElement("select", {
    style: inp,
    value: editTaskForm.priority || "normal",
    onChange: function onChange(ev) {
      setEditTaskForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          priority: ev.target.value
        });
      });
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "normal"
  }, "Normal"), /*#__PURE__*/React.createElement("option", {
    value: "urgent"
  }, "Urgent")), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: inp,
    value: editTaskForm.due || "",
    onChange: function onChange(ev) {
      setEditTaskForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          due: ev.target.value
        });
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setEditTaskId(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    style: btnP,
    onClick: saveEditTask
  }, "Save")))), data.personal.tasks.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2
    }
  }, "No tasks yet."), ["urgent", "normal"].map(function (pri) {
    var tasks = data.personal.tasks.filter(function (t) {
      return t.priority === pri && !t.done;
    }).sort(function (a, b) {
      return new Date(a.due || "9999") - new Date(b.due || "9999");
    });
    if (tasks.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: pri,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: pri === "urgent" ? T.danger : T.text3,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5
      }
    }, pri), tasks.map(function (t) {
      var urg = taskUrg(t);
      var col = TUC[urg];
      return /*#__PURE__*/React.createElement("div", {
        key: t.id,
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: 9,
          marginBottom: 8,
          padding: "11px 13px",
          borderRadius: 12,
          background: "rgba(225,234,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "inset 10px 0 9px -8px " + col
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          marginTop: 1,
          display: "flex"
        }
      }, /*#__PURE__*/React.createElement(TickCircle, {
        done: !!t.done,
        size: 18,
        onClick: function onClick() {
          toggleTask(t.id);
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 500,
          color: T.text,
          textDecoration: t.done ? "line-through" : "none"
        }
      }, t.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: col,
          marginTop: 1
        }
      }, t.cat, " \xB7 ", taskLabel(t))), /*#__PURE__*/React.createElement("button", {
        style: {
          background: "none",
          border: "none",
          padding: "2px 4px",
          cursor: "pointer",
          color: T.text3,
          flexShrink: 0,
          opacity: 0.5,
          display: "flex"
        },
        title: "Mark done on a different day",
        onClick: function onClick() {
          openBackdateModal(t.id);
        }
      }, /*#__PURE__*/React.createElement(UIcon, {
        name: "clock",
        size: 13
      })), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          setEditTaskId(t.id);
          setEditTaskForm({
            name: t.name,
            cat: t.cat,
            priority: t.priority,
            due: t.due
          });
        },
        style: _objectSpread(_objectSpread({}, btn), {}, {
          fontSize: 10,
          padding: "2px 7px"
        })
      }, "Edit"));
    }));
  }), function () {
    var doneP = data.personal.tasks.filter(function (t) {
      return t.done;
    });
    if (doneP.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: T.text3,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5
      }
    }, "Done"), doneP.map(function (t) {
      return /*#__PURE__*/React.createElement("div", {
        key: t.id,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 6,
          padding: "9px 13px",
          borderRadius: 12,
          background: "rgba(225,234,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          opacity: 0.55
        }
      }, /*#__PURE__*/React.createElement(TickCircle, {
        done: true,
        size: 18,
        onClick: function onClick() {
          toggleTask(t.id);
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          fontSize: 12,
          color: T.text3,
          textDecoration: "line-through"
        }
      }, t.name), t.completedAt && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.text3,
          flexShrink: 0
        }
      }, fmtDate(t.completedAt), t.completedTime ? " · " + fmtTime12(t.completedTime) : ""));
    }));
  }()), (data.personal.archived || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: card()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: T.text3
    }
  }, "Archived (", (data.personal.archived || []).length, ")"), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setShowArch(function (a) {
        return !a;
      });
    }
  }, showArch ? "Hide" : "Show")), showArch && (data.personal.archived || []).slice().reverse().map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
        padding: "6px 0",
        borderBottom: "0.5px solid " + T.border
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.text3,
        textDecoration: "line-through"
      }
    }, t.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginLeft: 8
      }
    }, fmtDate(t.archivedAt))), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        restoreTask(t.id);
      },
      style: _objectSpread(_objectSpread({}, btn), {}, {
        fontSize: 10,
        padding: "2px 8px",
        color: T.accent,
        borderColor: T.accent + "50"
      })
    }, "Restore"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: card()
  }, /*#__PURE__*/React.createElement("div", {
    style: sT
  }, "Knowledge base"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 10
    }
  }, "Notes here feed your daily check-in context."), (data.docs || []).map(function (d) {
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        marginBottom: 8,
        padding: "8px 10px",
        background: T.bg3,
        borderRadius: 6,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: T.text
      }
    }, d.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 2
      }
    }, d.content.slice(0, 80), "..."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        display: "flex",
        gap: 4
      }
    }, (d.tags || []).map(function (tag) {
      return /*#__PURE__*/React.createElement("span", {
        key: tag,
        style: {
          fontSize: 9,
          padding: "1px 6px",
          borderRadius: 99,
          background: T.accentBg,
          color: T.accent
        }
      }, tag);
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        trk("kb.doc_delete");
        setData(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, {
            docs: (p.docs || []).filter(function (x) {
              return x.id !== d.id;
            })
          });
        });
      },
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 16,
        marginLeft: 8
      }
    }, "\xD7"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: inp,
    placeholder: "Title",
    value: docIn.title,
    onChange: function onChange(ev) {
      setDocIn(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          title: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("input", {
    style: inp,
    placeholder: "Tags (comma separated)",
    value: docIn.tags,
    onChange: function onChange(ev) {
      setDocIn(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          tags: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      resize: "vertical"
    }),
    rows: 3,
    placeholder: "Content...",
    value: docIn.content,
    onChange: function onChange(ev) {
      setDocIn(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          content: ev.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: btnP,
    onClick: function onClick() {
      if (!docIn.title || !docIn.content) return;
      trk("kb.doc_add");
      setData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          docs: (p.docs || []).concat([{
            id: "doc" + Date.now(),
            title: docIn.title,
            tags: docIn.tags.split(",").map(function (t) {
              return t.trim();
            }),
            content: docIn.content
          }])
        });
      });
      setDocIn({
        title: "",
        tags: "",
        content: ""
      });
    }
  }, "Add document")))), page === "Finance" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: mob ? undefined : 900
    }
  }, /*#__PURE__*/React.createElement(ErrorBoundary, {
    name: "Finance"
  }, /*#__PURE__*/React.createElement(FinanceSection, {
    mob: mob,
    data: data.finance || {},
    onUpdate: updateFinance,
    gcalEvents: visibleGcalEvents,
    work: data.work || {}
  }))), page === "Invest" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: mob ? undefined : 900
    }
  }, /*#__PURE__*/React.createElement(ErrorBoundary, {
    name: "Invest"
  }, /*#__PURE__*/React.createElement(InvestSection, {
    mob: mob,
    data: data.invest || {},
    onUpdate: updateInvest
  }))), page === "Projects" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: mob ? undefined : 760
    }
  }, /*#__PURE__*/React.createElement(ErrorBoundary, {
    name: "Projects"
  }, /*#__PURE__*/React.createElement(ProjectsSection, {
    mob: mob,
    data: data.projects || [],
    onUpdate: updateProjects,
    onAddShopping: addToShopping
  }))), page === "Shopping" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: mob ? undefined : 640
    }
  }, /*#__PURE__*/React.createElement(ErrorBoundary, {
    name: "Shopping"
  }, /*#__PURE__*/React.createElement(ShoppingSection, {
    mob: mob,
    data: data.shopping || [],
    onUpdate: updateShopping
  }))), page === "Journal" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 14
    }
  }, [{
    key: "captures",
    label: "Captures",
    icon: "bolt"
  }, {
    key: "reflection",
    label: "Reflection",
    icon: "target"
  }].map(function (t) {
    var active = journalTab === t.key;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: function onClick() {
        setJournalTab(t.key);
      },
      style: {
        padding: "6px 14px",
        borderRadius: 99,
        fontSize: 12,
        cursor: "pointer",
        border: active ? "1px solid " + T.accent : "0.5px solid " + T.border,
        background: active ? T.accentBg : "transparent",
        color: active ? T.accent : T.text2,
        fontWeight: active ? 600 : 400,
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: t.icon,
      size: 13
    })), t.label);
  })), page === "Journal" && journalTab === "reflection" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 600
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: card()
  }, /*#__PURE__*/React.createElement("div", {
    style: sT
  }, "Weekly Reflection"), reflStep === 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      marginBottom: 14,
      lineHeight: 1.6
    }
  }, "5 focused questions. ~5 minutes. Honest answers only.", data.reflections.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      color: T.text3
    }
  }, "Last: ", new Date(data.reflections[data.reflections.length - 1].date).toLocaleDateString("en-AU"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      marginBottom: 14
    }
  }, REFL_LABELS.map(function (l, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 10,
        padding: "3px 10px",
        borderRadius: 99,
        background: T.accentBg,
        border: "0.5px solid rgba(91,140,255,0.25)",
        color: T.accent
      }
    }, l);
  })), /*#__PURE__*/React.createElement("button", {
    style: btnP,
    onClick: function onClick() {
      trk("reflection.start");
      setReflStep(1);
      setReflAns([]);
      setReflAnalysis(null);
    }
  }, "Start this week's reflection \u2192"), data.reflections.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.text3,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 10
    }
  }, "Previous Reflections"), data.reflections.slice().reverse().map(function (r, i) {
    var a = r.analysis;
    var sc = a ? a.sentimentScore : null;
    var isExp = expandedRefl === i;
    var sentCol = sc >= 0.1 ? T.success : sc <= -0.1 ? T.danger : T.warn;
    var sentLabel = sc >= 0.1 ? "↑ Positive" : sc <= -0.1 ? "↓ Stressed" : "→ Neutral";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 8,
        borderRadius: 10,
        border: "0.5px solid " + (isExp ? T.accent : T.border),
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        background: isExp ? T.accentBg : T.bg3,
        cursor: "pointer"
      },
      onClick: function onClick() {
        if (!isExp) trk("reflection.expand_past");
        setExpandedRefl(isExp ? null : i);
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: T.text
      }
    }, new Date(r.date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })), a && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.accent
      }
    }, a.dominantPattern)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, sc !== null && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: sentCol
      }
    }, sentLabel), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: T.text3
      }
    }, isExp ? "▲" : "▼"))), isExp && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 14px",
        background: "rgba(14,16,40,0.6)"
      }
    }, a && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 10px",
        borderRadius: 8,
        background: a.sentBg || T.bg3,
        border: "0.5px solid " + (a.sentBorder || T.border)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 3
      }
    }, "Emotional State"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: a.sentColor || T.text,
        fontWeight: 600,
        lineHeight: 1.4
      }
    }, a.emotionalState)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 10px",
        borderRadius: 8,
        background: T.accentBg,
        border: "0.5px solid rgba(91,140,255,0.18)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 3
      }
    }, "Dominant Pattern"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.accent,
        fontWeight: 600,
        lineHeight: 1.4
      }
    }, a.dominantPattern))), a.rootIssue && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 10px",
        borderRadius: 8,
        background: T.bg3,
        border: "0.5px solid " + T.border,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 3
      }
    }, "Root Issue"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text,
        lineHeight: 1.5
      }
    }, a.rootIssue)), a.insight && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 12px",
        borderRadius: 8,
        background: "rgba(91,140,255,0.06)",
        border: "0.5px solid rgba(91,140,255,0.18)",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.accent,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4
      }
    }, "Analysis"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        lineHeight: 1.8
      }
    }, a.insight)), a.recommendation && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 12px",
        borderRadius: 8,
        background: "rgba(105,240,174,0.06)",
        border: "0.5px solid rgba(105,240,174,0.2)",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.success,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(UIcon, {
      name: "bulb",
      size: 11
    }), "Recommendation"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        lineHeight: 1.8
      }
    }, a.recommendation))), r.answers && r.answers.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: "0.5px solid " + T.border
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8
      }
    }, "Your Answers"), r.answers.map(function (qa, qi) {
      return /*#__PURE__*/React.createElement("div", {
        key: qi,
        style: {
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.accent,
          fontWeight: 600,
          marginBottom: 2
        }
      }, qa.area || "Q" + (qi + 1)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: T.text2,
          lineHeight: 1.6,
          padding: "6px 10px",
          background: T.bg3,
          borderRadius: 6
        }
      }, qa.answer || qa.a));
    }))));
  }))), reflStep > 0 && reflStep <= REFL_QS.length && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      marginBottom: 14
    }
  }, REFL_QS.map(function (_, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        height: 3,
        borderRadius: 2,
        background: i < reflStep ? T.accent : "rgba(255,255,255,0.08)",
        transition: "background 0.3s"
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: T.accent,
      background: T.accentBg,
      padding: "3px 10px",
      borderRadius: 99,
      display: "inline-block",
      marginBottom: 10
    }
  }, REFL_LABELS[reflStep - 1], " \xB7 ", reflStep, " of ", REFL_QS.length), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      marginBottom: 16,
      lineHeight: 1.6,
      color: T.text
    }
  }, REFL_QS[reflStep - 1]), reflAns.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, reflAns.map(function (qa, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 4,
        fontSize: 11,
        color: T.text3,
        padding: "5px 8px",
        background: T.bg3,
        borderRadius: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.text2,
        fontWeight: 500
      }
    }, REFL_LABELS[i], ": "), qa.a.slice(0, 60), qa.a.length > 60 ? "..." : "");
  })), /*#__PURE__*/React.createElement("textarea", {
    value: reflIn,
    onChange: function onChange(ev) {
      setReflIn(ev.target.value);
    },
    rows: 5,
    style: _objectSpread(_objectSpread({}, inp), {}, {
      resize: "vertical",
      marginBottom: 12,
      fontSize: 13,
      lineHeight: 1.6
    }),
    placeholder: "Be honest, this is only visible to you..."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, reflStep > 1 && /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      var prev = reflAns[reflStep - 2] ? reflAns[reflStep - 2].a : "";
      setReflAns(reflAns.slice(0, reflStep - 2));
      setReflIn(prev);
      setReflStep(reflStep - 1);
    }
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("button", {
    style: btnP,
    onClick: submitRefl
  }, reflStep < REFL_QS.length ? "Next →" : "Finish & Analyse"))), reflStep > REFL_QS.length && /*#__PURE__*/React.createElement("div", null, reflAnalysisLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      padding: "30px 0",
      color: T.text2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: "2px solid " + T.accent,
      borderTopColor: "transparent",
      animation: "spin 0.9s linear infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12
    }
  }, "AI is analysing your reflection...")), reflAnalysis && !reflAnalysisLoading && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 14,
      padding: "10px 12px",
      borderRadius: 10,
      background: "rgba(91,140,255,0.06)",
      border: "0.5px solid rgba(91,140,255,0.2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      color: T.accent
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "chart",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: T.text
    }
  }, "Weekly Psychological Insight"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3
    }
  }, "Based on your answers and reflection history"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 10,
      background: reflAnalysis.sentBg,
      border: "0.5px solid " + reflAnalysis.sentBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4
    }
  }, "Emotional State"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: reflAnalysis.sentColor,
      fontWeight: 600,
      lineHeight: 1.4
    }
  }, reflAnalysis.emotionalState)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 10,
      background: "rgba(91,140,255,0.06)",
      border: "0.5px solid rgba(91,140,255,0.18)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4
    }
  }, "Dominant Pattern"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.accent,
      fontWeight: 600,
      lineHeight: 1.4
    }
  }, reflAnalysis.dominantPattern))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 8,
      background: T.bg3,
      border: "0.5px solid " + T.border,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4
    }
  }, "Root Issue Identified"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text,
      lineHeight: 1.5
    }
  }, reflAnalysis.rootIssue)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      borderRadius: 10,
      background: "rgba(91,140,255,0.06)",
      border: "0.5px solid rgba(91,140,255,0.18)",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.accent,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8
    }
  }, "Psychological Analysis"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      lineHeight: 1.8
    }
  }, reflAnalysis.insight)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      borderRadius: 10,
      background: "rgba(105,240,174,0.06)",
      border: "0.5px solid rgba(105,240,174,0.2)",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      color: T.success
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "bulb",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.success,
      textTransform: "uppercase",
      letterSpacing: 0.5
    }
  }, "Recommendation")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      lineHeight: 1.8
    }
  }, reflAnalysis.recommendation)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      borderRadius: 10,
      background: T.bg3,
      border: "0.5px solid " + T.border,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      color: T.text2
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "trend",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: T.text2,
      textTransform: "uppercase",
      letterSpacing: 0.5
    }
  }, "Pattern History")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      lineHeight: 1.7
    }
  }, reflAnalysis.patternHistory)), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setReflStep(0);
      setReflAnalysis(null);
    }
  }, "Done")), !reflAnalysis && !reflAnalysisLoading && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.success,
      marginBottom: 10
    }
  }, "\u2713 Reflection saved"), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setReflStep(0);
    }
  }, "Done"))))), page === "Journal" && journalTab === "captures" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: card()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sT
  }, "Captures"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btnP), {}, {
      fontSize: 11,
      padding: "5px 12px"
    }),
    onClick: function onClick() {
      trk("capture.refresh");
      if (window._currentUser && window._db) {
        setCapturesLoading(true);
        _db.collection('users').doc(window._currentUser.uid).collection('captures').get().then(function (snap) {
          var items = [];
          snap.forEach(function (doc) {
            items.push(_objectSpread({
              id: doc.id
            }, doc.data()));
          });
          items.sort(function (a, b) {
            var ta = a.date && a.date.toDate ? a.date.toDate().getTime() : 0;
            var tb = b.date && b.date.toDate ? b.date.toDate().getTime() : 0;
            return tb - ta;
          });
          setCapturesData(items);
          setCapturesLoading(false);
        })["catch"](function () {
          setCapturesLoading(false);
        });
      }
    }
  }, "Refresh")), /*#__PURE__*/React.createElement("input", {
    value: capturesSearch,
    onBlur: function onBlur() {
      if (capturesSearch.trim()) trk("capture.search");
    },
    onChange: function onChange(ev) {
      setCapturesSearch(ev.target.value);
    },
    placeholder: "Search captures...",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 12px",
      marginBottom: 12,
      width: "100%"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 14
    }
  }, ["all", "learning", "thought", "reflection"].map(function (f) {
    return /*#__PURE__*/React.createElement("button", {
      key: f,
      onClick: function onClick() {
        trk("capture.filter");
        setCapturesFilter(f);
      },
      style: {
        padding: "4px 12px",
        borderRadius: 99,
        fontSize: 11,
        cursor: "pointer",
        border: capturesFilter === f ? "1px solid " + T.accent : "0.5px solid " + T.border,
        background: capturesFilter === f ? T.accentBg : "transparent",
        color: capturesFilter === f ? T.accent : T.text2,
        fontWeight: capturesFilter === f ? 600 : 400
      }
    }, f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s");
  })), capturesLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      padding: "20px 0",
      textAlign: "center"
    }
  }, "Loading..."), !capturesLoading && capturesData.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      padding: "20px 0",
      textAlign: "center"
    }
  }, "No captures yet. Hit Capture to add your first one."), !capturesLoading && function () {
    var filtered = capturesData.filter(function (c) {
      if (capturesFilter !== "all" && c.type !== capturesFilter) return false;
      if (capturesSearch.trim()) {
        var q = capturesSearch.toLowerCase();
        return (c.title || "").toLowerCase().includes(q) || (c.content || "").toLowerCase().includes(q) || (c.rawInput || "").toLowerCase().includes(q) || (c.tags || []).some(function (t) {
          return t.toLowerCase().includes(q);
        });
      }
      return true;
    });
    if (filtered.length === 0) return /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text3,
        padding: "16px 0",
        textAlign: "center"
      }
    }, "No results.");
    return filtered.map(function (c) {
      var isExp = expandedCapture === c.id;
      var ts = c.date && c.date.toDate ? c.date.toDate() : null;
      var dateLabel = ts ? ts.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + " · " + ts.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit"
      }) : "";
      var typeColor = c.type === "learning" ? T.accent : c.type === "reflection" ? T.warn : T.text3;
      var typeBg = c.type === "learning" ? T.accentBg : c.type === "reflection" ? "rgba(255,209,102,0.12)" : T.bg3;
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        style: {
          marginBottom: 10,
          padding: "12px 14px",
          borderRadius: 10,
          background: T.bg2,
          border: "0.5px solid " + (isExp ? T.accent : T.border),
          cursor: "pointer",
          transition: "border 0.15s"
        },
        onClick: function onClick() {
          if (!isExp) trk("capture.expand");
          setExpandedCapture(isExp ? null : c.id);
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: isExp ? 10 : 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 99,
          background: typeBg,
          color: typeColor
        }
      }, c.type || "thought"), c.subject && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: T.text3
        }
      }, c.subject), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: T.text3,
          marginLeft: "auto"
        }
      }, dateLabel), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: T.text3
        }
      }, isExp ? "▲" : "▼")), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: isExp ? 700 : 500,
          color: T.text,
          marginBottom: isExp ? 8 : 0
        }
      }, c.title || c.rawInput || ""), isExp && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: T.text2,
          lineHeight: 1.8,
          marginBottom: c.formula ? 10 : 0
        }
      }, renderMd(c.content)), c.formula && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "8px 12px",
          borderRadius: 8,
          background: T.bg3,
          border: "0.5px solid " + T.border,
          fontSize: 11,
          color: T.accent,
          fontFamily: "monospace",
          marginBottom: 8
        }
      }, c.formula), c.example && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "8px 12px",
          borderRadius: 8,
          background: "rgba(105,240,174,0.06)",
          border: "0.5px solid rgba(105,240,174,0.2)",
          fontSize: 11,
          color: T.text2,
          lineHeight: 1.6,
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          color: T.success
        }
      }, "Example: "), c.example), c.tags && c.tags.length > 0 && /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 5,
          flexWrap: "wrap",
          marginTop: 6
        }
      }, c.tags.map(function (tag) {
        return /*#__PURE__*/React.createElement("span", {
          key: tag,
          style: {
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 99,
            background: T.bg3,
            color: T.text3
          }
        }, "#", tag);
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 12,
          paddingTop: 10,
          borderTop: "0.5px solid " + T.border
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(ev) {
          openEditCapture(c, ev);
        },
        style: _objectSpread(_objectSpread({}, btn), {}, {
          padding: "5px 14px",
          borderRadius: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 5
        })
      }, /*#__PURE__*/React.createElement(UIcon, {
        name: "pencil",
        size: 11
      }), "Edit"))));
    });
  }()))), modal && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.82)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: mob ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 200,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(14,16,40,0.97)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: mob ? "20px 20px 0 0" : "16px",
      padding: mob ? "24px 20px 32px" : "22px",
      width: mob ? "100%" : modal === "edit_rotation" ? "480px" : modal === "task_detail" ? "380px" : "340px",
      maxWidth: "100%",
      border: "0.5px solid rgba(91,140,255,0.25)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.1)"
    },
    onClick: function onClick(ev) {
      ev.stopPropagation();
    }
  }, mob && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.2)",
      margin: "0 auto 20px"
    }
  }), !closeOnlyModal && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 16,
      color: T.text
    }
  }, modal === "add_subject" && "Add subject", modal === "add_exercise" && "Add exercise", modal === "log_weight" && "Log weight · " + (mForm.exName || ""), modal === "add_task" && "Add task", modal === "edit_rotation" && "Edit rotation template", modal === "complete_task" && "Mark task done", modal === "edit_subject" && "Edit subject"), modal === "edit_necessities" && function () {
    var nec = data.personal && data.personal.necessities || {
      items: [],
      ticks: {}
    };
    function setItems(next, dropTickId) {
      setData(function (p) {
        var cur = p.personal && p.personal.necessities || {
          items: [],
          ticks: {}
        };
        // Ticks are the only durable truth here, so a removed item must take its
        // tick with it — otherwise every deletion leaves a dead key in the doc
        // that syncs to three devices and never goes away.
        var ticks = _objectSpread({}, cur.ticks || {});
        if (dropTickId !== undefined) delete ticks[dropTickId];
        return _objectSpread(_objectSpread({}, p), {}, {
          personal: _objectSpread(_objectSpread({}, p.personal), {}, {
            necessities: _objectSpread(_objectSpread({}, cur), {}, {
              items: next,
              ticks: ticks
            })
          })
        });
      });
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: T.text,
        marginBottom: 12
      }
    }, "Weekly necessities"), (nec.items || []).map(function (i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i.id,
        style: {
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: T.text,
          flex: 1
        }
      }, i.name), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          setItems((nec.items || []).filter(function (x) {
            return x.id !== i.id;
          }), i.id);
        },
        style: {
          background: "none",
          border: "none",
          color: T.danger,
          cursor: "pointer",
          fontSize: 15,
          lineHeight: 1,
          padding: "0 4px"
        },
        title: "Remove"
      }, "\xD7"));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, PINP), {}, {
        flex: 1
      }),
      placeholder: "Add a weekly necessity\u2026",
      value: mForm.newItem || "",
      onChange: function onChange(e) {
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            newItem: e.target.value
          });
        });
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          var v = (mForm.newItem || "").trim();
          if (!v) return;
          setItems((nec.items || []).concat([{
            id: Date.now(),
            name: v
          }]));
          setMForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              newItem: ""
            });
          });
        }
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: btnP,
      onClick: function onClick() {
        var v = (mForm.newItem || "").trim();
        if (!v) return;
        setItems((nec.items || []).concat([{
          id: Date.now(),
          name: v
        }]));
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            newItem: ""
          });
        });
      }
    }, "Add")));
  }(), modal === "add_exercise" && function () {
    var names = [];
    var seen = {};
    (data.gym.exercises || []).forEach(function (ex) {
      var n = (ex.name || "").trim();
      if (n && !seen[n.toLowerCase()]) {
        seen[n.toLowerCase()] = true;
        names.push(n);
      }
    });
    (data.gym.rotation || []).forEach(function (r) {
      (r.exercises || []).forEach(function (ex) {
        var n = (ex.exercise || "").trim();
        if (n && !seen[n.toLowerCase()]) {
          seen[n.toLowerCase()] = true;
          names.push(n);
        }
      });
    });
    names.sort(function (a, b) {
      return a.localeCompare(b);
    });
    if (names.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginBottom: 6
      }
    }, "Pick from history"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        flexWrap: "wrap",
        maxHeight: 140,
        overflowY: "auto",
        paddingRight: 4
      }
    }, names.map(function (n) {
      var active = (mForm.name || "").toLowerCase() === n.toLowerCase();
      return /*#__PURE__*/React.createElement("button", {
        key: n,
        type: "button",
        onClick: function onClick() {
          trk("gym.exercise_picker");
          setMForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              name: n
            });
          });
        },
        style: {
          padding: "4px 10px",
          borderRadius: 99,
          border: active ? "1px solid " + T.accent : "0.5px solid " + T.border,
          background: active ? T.accentBg : "transparent",
          color: active ? T.accent : T.text2,
          fontSize: 11,
          cursor: "pointer",
          fontWeight: active ? 600 : 400,
          whiteSpace: "nowrap"
        }
      }, n);
    })));
  }(), (modal === "add_subject" || modal === "add_exercise" || modal === "add_task" || modal === "edit_subject") && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, modal === "add_exercise" ? "Or type a new one" : "Name"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: mForm.name || "",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          name: ev.target.value
        });
      });
    },
    placeholder: "Enter name..."
  })), (modal === "add_subject" || modal === "edit_subject") && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Color"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      flexWrap: "wrap"
    }
  }, SUBJECT_PALETTE.map(function (c) {
    var active = mForm.color === c;
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      type: "button",
      onClick: function onClick() {
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            color: c
          });
        });
      },
      style: {
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: c,
        border: active ? "2px solid #fff" : "2px solid transparent",
        boxShadow: active ? "0 0 0 2px " + c + ", 0 0 8px " + c : "none",
        cursor: "pointer",
        padding: 0
      }
    });
  }))), modal === "edit_subject" && /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      color: T.danger,
      cursor: "pointer",
      fontSize: 11,
      padding: 0,
      marginBottom: 4
    },
    onClick: function onClick() {
      removeSubject(mForm.editId);
      setModal(null);
      setMForm({});
    }
  }, "Delete subject"), modal === "log_weight" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Weight (kg)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.5",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: mForm.weight || "",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          weight: ev.target.value
        });
      });
    },
    placeholder: "e.g. 85"
  })), modal === "add_task" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Category"), /*#__PURE__*/React.createElement("select", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: mForm.cat || "Errands",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          cat: ev.target.value
        });
      });
    }
  }, TASK_CATS.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c
    }, c);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Priority"), /*#__PURE__*/React.createElement("select", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: mForm.priority || "normal",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          priority: ev.target.value
        });
      });
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "normal"
  }, "Normal"), /*#__PURE__*/React.createElement("option", {
    value: "urgent"
  }, "Urgent"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Due date"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      marginBottom: 8
    }
  }, [["Today", 0], ["3 days", 3], ["7 days", 7], ["14 days", 14]].map(function (item) {
    var label = item[0];
    var n = item[1];
    var val = futureDateStr(n);
    var active = mForm.due === val;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      type: "button",
      onClick: function onClick() {
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            due: val
          });
        });
      },
      style: {
        padding: "5px 10px",
        borderRadius: 99,
        border: active ? "1px solid " + T.accent : "0.5px solid " + T.border,
        background: active ? T.accentBg : "transparent",
        color: active ? T.accent : T.text2,
        fontSize: 11,
        cursor: "pointer",
        fontWeight: active ? 600 : 400
      }
    }, label);
  })), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: mForm.due || "",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          due: ev.target.value
        });
      });
    }
  }))), modal === "complete_task" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Completed"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      marginBottom: 8
    }
  }, [["Today", 0], ["Yesterday", 1], ["2 days ago", 2], ["3 days ago", 3]].map(function (item) {
    var label = item[0];
    var n = item[1];
    var val = pastDateStr(n);
    var active = mForm.date === val;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      type: "button",
      onClick: function onClick() {
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            date: val
          });
        });
      },
      style: {
        padding: "5px 10px",
        borderRadius: 99,
        border: active ? "1px solid " + T.accent : "0.5px solid " + T.border,
        background: active ? T.accentBg : "transparent",
        color: active ? T.accent : T.text2,
        fontSize: 11,
        cursor: "pointer",
        fontWeight: active ? 600 : 400
      }
    }, label);
  })), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: mForm.date || todayStr(),
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          date: ev.target.value
        });
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Time ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontWeight: 400
    }
  }, "(optional)")), /*#__PURE__*/React.createElement("input", {
    type: "time",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "10px 12px",
      fontSize: 14
    }),
    value: mForm.time || "",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          time: ev.target.value
        });
      });
    }
  }))), modal === "edit_rotation" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 4
    }
  }, "Session name"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "8px 10px",
      fontSize: 13
    }),
    value: mForm.rName || "",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          rName: ev.target.value
        });
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 4
    }
  }, "Focus muscles"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "8px 10px",
      fontSize: 13
    }),
    placeholder: "e.g. Chest, Triceps",
    value: mForm.rFocus || "",
    onChange: function onChange(ev) {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          rFocus: ev.target.value
        });
      });
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 6
    }
  }, "Exercise template ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontWeight: 400
    }
  }, "(saved as defaults for this rotation)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 46px 46px 56px 28px",
      gap: 5,
      marginBottom: 4
    }
  }, ["Exercise", "Sets", "Reps", "kg", ""].map(function (h, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 9,
        color: T.text3
      }
    }, h);
  })), (mForm.exercises || []).map(function (ex, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: ex.id || i,
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 46px 46px 56px 28px",
        gap: 5,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "6px 8px",
        fontSize: 12
      }),
      placeholder: "Exercise",
      value: ex.exercise || "",
      onChange: function onChange(ev) {
        var v = ev.target.value;
        setMForm(function (f) {
          var exs = f.exercises.map(function (e, j) {
            return j === i ? _objectSpread(_objectSpread({}, e), {}, {
              exercise: v
            }) : e;
          });
          return _objectSpread(_objectSpread({}, f), {}, {
            exercises: exs
          });
        });
      }
    }), /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "6px 4px",
        fontSize: 12
      }),
      type: "number",
      placeholder: "4",
      value: ex.sets || "",
      onChange: function onChange(ev) {
        var v = ev.target.value;
        setMForm(function (f) {
          var exs = f.exercises.map(function (e, j) {
            return j === i ? _objectSpread(_objectSpread({}, e), {}, {
              sets: v
            }) : e;
          });
          return _objectSpread(_objectSpread({}, f), {}, {
            exercises: exs
          });
        });
      }
    }), /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "6px 4px",
        fontSize: 12
      }),
      type: "number",
      placeholder: "8",
      value: ex.reps || "",
      onChange: function onChange(ev) {
        var v = ev.target.value;
        setMForm(function (f) {
          var exs = f.exercises.map(function (e, j) {
            return j === i ? _objectSpread(_objectSpread({}, e), {}, {
              reps: v
            }) : e;
          });
          return _objectSpread(_objectSpread({}, f), {}, {
            exercises: exs
          });
        });
      }
    }), /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "6px 4px",
        fontSize: 12
      }),
      type: "number",
      placeholder: "80",
      value: ex.weight || "",
      onChange: function onChange(ev) {
        var v = ev.target.value;
        setMForm(function (f) {
          var exs = f.exercises.map(function (e, j) {
            return j === i ? _objectSpread(_objectSpread({}, e), {}, {
              weight: v
            }) : e;
          });
          return _objectSpread(_objectSpread({}, f), {}, {
            exercises: exs
          });
        });
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "none",
        border: "none",
        color: T.text3,
        cursor: "pointer",
        fontSize: 14,
        padding: 0
      },
      onClick: function onClick() {
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            exercises: f.exercises.filter(function (_, j) {
              return j !== i;
            })
          });
        });
      }
    }, "\xD7"));
  }), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      marginTop: 4,
      fontSize: 11
    }),
    onClick: function onClick() {
      setMForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          exercises: (f.exercises || []).concat([{
            id: Date.now(),
            exercise: "",
            sets: "",
            reps: "",
            weight: ""
          }])
        });
      });
    }
  }, "+ Exercise")), modal === "task_detail" && function () {
    var t = (data.personal.tasks || []).filter(function (x) {
      return x.id === mForm.taskId;
    })[0];
    // Archived or deleted from another device while this was open — say so
    // rather than leaving a blank box with a lone Close button.
    if (!t) return /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text3
      }
    }, "This task is no longer available.");
    var ups = (t.updates || []).slice().reverse();
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: T.text,
        marginBottom: 4
      }
    }, t.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: catColor(t.cat || "Other"),
        marginBottom: 14
      }
    }, t.cat || "Other"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.5
      }
    }, "State"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginBottom: 16
      }
    }, [{
      v: "todo",
      l: "Not started"
    }, {
      v: "doing",
      l: "In progress"
    }, {
      v: "waiting",
      l: "Waiting"
    }].map(function (o) {
      var on = (t.state || "todo") === o.v;
      return /*#__PURE__*/React.createElement("button", {
        key: o.v,
        onClick: function onClick() {
          setTaskState(t.id, o.v);
        },
        style: _objectSpread(_objectSpread({}, btn), {}, {
          fontSize: 11,
          color: on ? T.accent : T.text2,
          borderColor: on ? "rgba(91,140,255,0.5)" : "rgba(255,255,255,0.12)",
          background: on ? T.accentBg : "transparent"
        })
      }, o.l);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.5
      }
    }, "Updates"), ups.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text3,
        marginBottom: 10
      }
    }, "No updates yet."), ups.map(function (u) {
      return /*#__PURE__*/React.createElement("div", {
        key: u.id,
        style: {
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          marginBottom: 8,
          paddingBottom: 8,
          borderBottom: "0.5px solid " + T.border
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.text3,
          flexShrink: 0,
          width: 52
        }
      }, fmtDate(u.at)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: T.text,
          flex: 1,
          lineHeight: 1.5
        }
      }, u.text), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          deleteTaskUpdate(t.id, u.id);
        },
        style: {
          background: "none",
          border: "none",
          color: T.text3,
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
          padding: "0 2px",
          flexShrink: 0
        },
        title: "Delete update"
      }, "\xD7"));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      style: _objectSpread(_objectSpread({}, PINP), {}, {
        flex: 1
      }),
      placeholder: "Write an update\u2026",
      value: mForm.updateText || "",
      onChange: function onChange(e) {
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            updateText: e.target.value
          });
        });
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          addTaskUpdate(t.id, mForm.updateText);
          setMForm(function (f) {
            return _objectSpread(_objectSpread({}, f), {}, {
              updateText: ""
            });
          });
        }
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: btnP,
      onClick: function onClick() {
        addTaskUpdate(t.id, mForm.updateText);
        setMForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            updateText: ""
          });
        });
      }
    }, "Add")));
  }(), modal === "day_done" && function () {
    var done = completionsByDay[mForm.date] || [];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: T.text,
        marginBottom: 12
      }
    }, "Finished ", new Date(mForm.date + "T12:00:00").toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long"
    })), done.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text3
      }
    }, "Nothing recorded for this day."), done.map(function (t) {
      var col = catColor(t.cat || "Other");
      return /*#__PURE__*/React.createElement("div", {
        key: t.id,
        style: {
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: col,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: T.text,
          flex: 1
        }
      }, t.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: T.text3
        }
      }, t.completedTime ? fmtTime12(t.completedTime) : ""));
    }));
  }(), !closeOnlyModal && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 16,
      flexDirection: mob ? "column" : "row",
      justifyContent: "flex-end"
    }
  }, mob ? /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btnP), {}, {
      padding: "13px",
      fontSize: 14,
      width: "100%",
      borderRadius: 10
    }),
    onClick: saveModal
  }, "Save") : /*#__PURE__*/React.createElement("button", {
    style: btnP,
    onClick: saveModal
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread({}, mob ? _objectSpread(_objectSpread({}, btn), {}, {
      padding: "11px",
      fontSize: 13,
      width: "100%",
      borderRadius: 10,
      textAlign: "center"
    }) : btn),
    onClick: function onClick() {
      setModal(null);
    }
  }, "Cancel")), closeOnlyModal && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 16,
      flexDirection: mob ? "column" : "row",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: mob ? _objectSpread(_objectSpread({}, btnP), {}, {
      padding: "13px",
      fontSize: 14,
      width: "100%",
      borderRadius: 10
    }) : btnP,
    onClick: function onClick() {
      setModal(null);
    }
  }, "Close")))), showTimePicker && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.82)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: mob ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 250,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      setShowTimePicker(false);
      setScheduleTaskId(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(14,16,40,0.97)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: mob ? "20px 20px 0 0" : "16px",
      padding: mob ? "24px 20px 32px" : "22px",
      width: mob ? "100%" : "320px",
      maxWidth: "100%",
      border: "0.5px solid rgba(91,140,255,0.25)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.08)"
    },
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, mob && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.2)",
      margin: "0 auto 20px"
    }
  }), function () {
    var editingBlock = !!(data.personal.tasks.find(function (tt) {
      return tt.id === scheduleTaskId;
    }) || {}).scheduledDate;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: T.text,
        marginBottom: 14
      }
    }, editingBlock ? "Edit time block" : "Schedule task"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginBottom: 6
      }
    }, "Date"), /*#__PURE__*/React.createElement("input", {
      type: "date",
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "10px 12px",
        fontSize: 14
      }),
      value: scheduleForDay || "",
      onChange: function onChange(ev) {
        setScheduleForDay(ev.target.value);
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginBottom: 6
      }
    }, "Start time"), /*#__PURE__*/React.createElement("input", {
      type: "time",
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "10px 12px",
        fontSize: 14
      }),
      value: scheduleTime,
      onChange: function onChange(ev) {
        setScheduleTime(ev.target.value);
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginBottom: 6
      }
    }, "Duration"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, [30, 60, 90, 120].map(function (d) {
      var active = scheduleDuration === d;
      return /*#__PURE__*/React.createElement("button", {
        key: d,
        style: {
          flex: 1,
          padding: "8px 0",
          borderRadius: 8,
          border: active ? "1px solid " + T.accent : "0.5px solid " + T.border,
          background: active ? T.accentBg : "rgba(255,255,255,0.04)",
          color: active ? T.accent : T.text2,
          cursor: "pointer",
          fontSize: 12,
          fontWeight: active ? 600 : 400
        },
        onClick: function onClick() {
          setScheduleDuration(d);
        }
      }, d < 60 ? d + "m" : d === 60 ? "1h" : d === 90 ? "1.5h" : "2h");
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btnP), {}, {
        padding: "12px",
        fontSize: 14,
        width: "100%",
        borderRadius: 10
      }),
      onClick: function onClick() {
        confirmSchedule(false);
      }
    }, editingBlock ? "Update block →" : "Schedule block →"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        padding: "10px",
        fontSize: 12,
        width: "100%",
        borderRadius: 10,
        textAlign: "center"
      }),
      onClick: function onClick() {
        confirmSchedule(true);
      }
    }, "Just set due date"), /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        padding: "10px",
        fontSize: 12,
        width: "100%",
        borderRadius: 10,
        textAlign: "center",
        opacity: 0.6
      }),
      onClick: function onClick() {
        setShowTimePicker(false);
        setScheduleTaskId(null);
      }
    }, "Cancel"), editingBlock && /*#__PURE__*/React.createElement("button", {
      style: _objectSpread(_objectSpread({}, btn), {}, {
        padding: "10px",
        fontSize: 12,
        width: "100%",
        borderRadius: 10,
        textAlign: "center",
        color: T.danger,
        borderColor: T.danger + "40",
        marginTop: 4
      }),
      onClick: unscheduleTask
    }, "Remove from calendar")));
  }())), showCalPicker && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.82)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: mob ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 200,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      setShowCalPicker(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(14,16,40,0.97)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: mob ? "20px 20px 0 0" : "16px",
      padding: mob ? "24px 20px 32px" : "22px",
      width: mob ? "100%" : "380px",
      maxWidth: "100%",
      border: "0.5px solid rgba(91,140,255,0.25)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
    },
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: T.text
    }
  }, "Google Calendars"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      fontSize: 10,
      color: "#4285F4",
      border: "0.5px solid #4285F440"
    }),
    onClick: function onClick() {
      if (window.GCalSync) window.GCalSync.connect();
    }
  }, "+ Add account")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 4,
      flexWrap: "wrap"
    }
  }, "Tap a calendar to toggle. ", /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "eye",
    size: 12
  })), " to hide from all views."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: T.text3,
      marginBottom: 12,
      padding: "5px 8px",
      borderRadius: 6,
      background: "rgba(91,140,255,0.06)",
      border: "0.5px solid rgba(91,140,255,0.15)"
    }
  }, "Duplicate events (same title, date, time) are merged automatically. Events from jaydenpineda30@gmail.com are preferred when duplicates are detected."), gcalCalendars.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      marginBottom: 16
    }
  }, "No calendars found. Connect a Google account above.") : function () {
    var byAccount = {};
    gcalCalendars.forEach(function (cal) {
      var e = cal._email || "Google";
      (byAccount[e] = byAccount[e] || []).push(cal);
    });
    var accountEmails = Object.keys(byAccount);
    var multiAccount = accountEmails.length > 1;
    return accountEmails.map(function (email) {
      var accountCalIds = byAccount[email].map(function (c) {
        return c.id;
      });
      var allSelected = gcalSelectedIds.length === 0 || accountCalIds.every(function (id) {
        return gcalSelectedIds.indexOf(id) !== -1;
      });
      var isSolo = multiAccount && gcalSelectedIds.length > 0 && accountCalIds.every(function (id) {
        return gcalSelectedIds.indexOf(id) !== -1;
      }) && accountEmails.filter(function (e) {
        return e !== email;
      }).every(function (e) {
        return byAccount[e].every(function (c) {
          return gcalSelectedIds.indexOf(c.id) === -1;
        });
      });
      return /*#__PURE__*/React.createElement("div", {
        key: email,
        style: {
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.text3,
          fontWeight: 600
        }
      }, email), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 6,
          alignItems: "center"
        }
      }, multiAccount && /*#__PURE__*/React.createElement("button", {
        style: {
          fontSize: 9,
          color: isSolo ? T.accent : T.text3,
          background: isSolo ? "rgba(91,140,255,0.1)" : "none",
          border: isSolo ? "0.5px solid rgba(91,140,255,0.3)" : "none",
          cursor: "pointer",
          padding: "2px 7px",
          borderRadius: 5,
          fontWeight: isSolo ? 700 : 400
        },
        onClick: function onClick() {
          if (window.GCalSync) window.GCalSync.setSingleAccountMode(isSolo ? null : email);
        }
      }, "Solo"), /*#__PURE__*/React.createElement("button", {
        style: {
          fontSize: 9,
          color: allSelected ? T.warn : T.success,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px 6px"
        },
        onClick: function onClick() {
          trk("settings.gcal_change");
          var next = allSelected ? gcalSelectedIds.filter(function (id) {
            return accountCalIds.indexOf(id) === -1;
          }) : [].concat(gcalSelectedIds, accountCalIds.filter(function (id) {
            return gcalSelectedIds.indexOf(id) === -1;
          }));
          if (window.GCalSync) window.GCalSync.setSelectedIds(next);
        }
      }, allSelected ? "Mute all" : "Enable all"), /*#__PURE__*/React.createElement("button", {
        style: {
          fontSize: 9,
          color: T.danger,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px 6px"
        },
        onClick: function onClick() {
          if (window.GCalSync) window.GCalSync.disconnect(email);
        }
      }, "Remove"))), byAccount[email].map(function (cal) {
        var sel = gcalSelectedIds.indexOf(cal.id) !== -1;
        var excl = gcalExcludedIds.indexOf(cal.id) !== -1;
        return /*#__PURE__*/React.createElement("div", {
          key: cal.id,
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 8,
            background: excl ? "rgba(247,111,111,0.04)" : sel ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
            marginBottom: 4,
            border: "0.5px solid " + (excl ? "rgba(247,111,111,0.2)" : sel ? "rgba(255,255,255,0.1)" : "transparent"),
            transition: "all 0.15s"
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 12,
            height: 12,
            borderRadius: 3,
            background: cal.backgroundColor || "#4285F4",
            flexShrink: 0,
            opacity: excl ? 0.2 : sel ? 1 : 0.35,
            cursor: "pointer"
          },
          onClick: function onClick() {
            trk("settings.gcal_change");
            var next = sel ? gcalSelectedIds.filter(function (id) {
              return id !== cal.id;
            }) : [].concat(gcalSelectedIds, [cal.id]);
            if (window.GCalSync) window.GCalSync.setSelectedIds(next);
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            fontSize: 13,
            color: excl ? T.text3 : sel ? T.text : T.text2,
            textDecoration: excl ? "line-through" : "none",
            cursor: "pointer"
          },
          onClick: function onClick() {
            trk("settings.gcal_change");
            var next = sel ? gcalSelectedIds.filter(function (id) {
              return id !== cal.id;
            }) : [].concat(gcalSelectedIds, [cal.id]);
            if (window.GCalSync) window.GCalSync.setSelectedIds(next);
          }
        }, cal.summary), /*#__PURE__*/React.createElement("button", {
          style: {
            display: "flex",
            alignItems: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: excl ? T.danger : T.text3,
            padding: "2px 4px",
            opacity: excl ? 1 : 0.5,
            flexShrink: 0
          },
          title: excl ? "Show calendar" : "Hide calendar",
          onClick: function onClick(e) {
            e.stopPropagation();
            toggleExclude(cal.id);
          }
        }, /*#__PURE__*/React.createElement(UIcon, {
          name: "eye",
          size: 13
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "1.5px solid " + (sel && !excl ? "#34A853" : "rgba(255,255,255,0.2)"),
            background: sel && !excl ? "#34A853" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: "pointer"
          },
          onClick: function onClick() {
            trk("settings.gcal_change");
            var next = sel ? gcalSelectedIds.filter(function (id) {
              return id !== cal.id;
            }) : [].concat(gcalSelectedIds, [cal.id]);
            if (window.GCalSync) window.GCalSync.setSelectedIds(next);
          }
        }, sel && !excl && /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 9,
            color: "#fff",
            fontWeight: 700
          }
        }, "\u2713")));
      }));
    });
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14,
      paddingTop: 12,
      borderTop: "0.5px solid " + T.border,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      flex: 1
    }),
    onClick: function onClick() {
      if (window.GCalSync) window.GCalSync.refresh();
      setShowCalPicker(false);
    }
  }, "Sync & close"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      padding: "6px 11px",
      borderRadius: 8
    }),
    onClick: function onClick() {
      try {
        localStorage.removeItem('__gcal_selected__');
        localStorage.removeItem('__gcal_excluded__');
      } catch (_) {}
      setGcalExcludedIds([]);
      if (window.GCalSync) {
        window.GCalSync.setSelectedIds([]);
        window.GCalSync.refresh();
      }
      setShowCalPicker(false);
    }
  }, "\u21BA Reset to all"), /*#__PURE__*/React.createElement("button", {
    style: {
      padding: "6px 13px",
      borderRadius: 8,
      border: "1px solid rgba(247,111,111,0.4)",
      background: "rgba(247,111,111,0.1)",
      color: T.danger,
      cursor: "pointer",
      fontSize: 12
    },
    onClick: function onClick() {
      if (window.GCalSync) window.GCalSync.disconnect();
      setShowCalPicker(false);
    }
  }, "Disconnect all")))), showAddAssess && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.82)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: mob ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 210,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      setShowAddAssess(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(14,16,40,0.97)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: mob ? "20px 20px 0 0" : "16px",
      padding: mob ? "24px 20px 32px" : "22px",
      width: mob ? "100%" : "360px",
      maxWidth: "100%",
      border: "0.5px solid rgba(91,140,255,0.25)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
    },
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, mob && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.2)",
      margin: "0 auto 20px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 16,
      color: T.text
    }
  }, "Add Assessment"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Subject"), /*#__PURE__*/React.createElement("select", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 11px"
    }),
    value: addAssessForm.subject,
    onChange: function onChange(ev) {
      setAddAssessForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          subject: ev.target.value
        });
      });
    }
  }, (data.uni.subjects || []).length === 0 && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Add a subject first \u2193"), (data.uni.subjects || []).map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.name
    }, s.name);
  }), /*#__PURE__*/React.createElement("option", {
    value: "Other"
  }, "Other"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Assessment name"), /*#__PURE__*/React.createElement("input", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 11px"
    }),
    placeholder: "e.g. Assignment 1",
    value: addAssessForm.name,
    onChange: function onChange(ev) {
      setAddAssessForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          name: ev.target.value
        });
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Type"), /*#__PURE__*/React.createElement("select", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 11px"
    }),
    value: addAssessForm.type,
    onChange: function onChange(ev) {
      setAddAssessForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          type: ev.target.value
        });
      });
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "SUBMISSION"
  }, "Submission"), /*#__PURE__*/React.createElement("option", {
    value: "IN-CLASS"
  }, "In-Class / Supervised"), /*#__PURE__*/React.createElement("option", {
    value: "EXAM"
  }, "Exam"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Due date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 11px"
    }),
    value: addAssessForm.date,
    onChange: function onChange(ev) {
      setAddAssessForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          date: ev.target.value
        });
      });
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 18,
      flexDirection: mob ? "column" : "row",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: btnP,
    onClick: addAssessment,
    disabled: !addAssessForm.name || !addAssessForm.date
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setShowAddAssess(false);
    }
  }, "Cancel")))), showSyllabusImport && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.82)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: mob ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 210,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      setShowSyllabusImport(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(14,16,40,0.97)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: mob ? "20px 20px 0 0" : "16px",
      padding: mob ? "24px 20px 32px" : "22px",
      width: mob ? "100%" : "520px",
      maxWidth: "100%",
      maxHeight: mob ? "90vh" : "85vh",
      overflowY: "auto",
      border: "0.5px solid rgba(91,140,255,0.25)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
    },
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, mob && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.2)",
      margin: "0 auto 20px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: T.text,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "upload",
    size: 16
  }), "Import Syllabus via Gemini AI")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 16,
      lineHeight: 1.5
    }
  }, "Paste your unit outline or assessment schedule below. Gemini AI will extract all assessment due dates and add them to your hub."), !geminiKey.trim() && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: "9px 12px",
      borderRadius: 8,
      background: "rgba(255,209,102,0.08)",
      border: "0.5px solid rgba(255,209,102,0.25)",
      fontSize: 11,
      color: T.warn,
      display: "flex",
      alignItems: "center",
      gap: 5,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "warn",
    size: 12
  }), "No Gemini API key set. Add it in ", /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setShowSyllabusImport(false);
      setShowMonitor(true);
    },
    style: {
      background: "none",
      border: "none",
      color: T.accent,
      cursor: "pointer",
      fontSize: 11,
      padding: 0,
      fontWeight: 600
    }
  }, "Logs \u2192 Settings")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Semester start date ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontWeight: 400
    }
  }, "(used to calculate week dates)")), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 11px"
    }),
    value: syllabusStart,
    onChange: function onChange(ev) {
      setSyllabusStart(ev.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Syllabus / unit outline text"), /*#__PURE__*/React.createElement("textarea", {
    style: _objectSpread(_objectSpread({}, inp), {}, {
      resize: "vertical",
      fontFamily: "monospace",
      fontSize: 11,
      lineHeight: 1.5
    }),
    rows: 8,
    placeholder: "Paste your subject outline here...\nE.g.:\nWeek 5: Assessment 1 due\nWeek 7: Supervised exam (AT2)\n...",
    value: syllabusText,
    onChange: function onChange(ev) {
      setSyllabusText(ev.target.value);
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btnP), {}, {
      width: "100%",
      padding: "11px",
      marginBottom: 12,
      opacity: geminiLoading ? 0.6 : 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }),
    onClick: parseWithGemini,
    disabled: geminiLoading || !syllabusText.trim()
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: geminiLoading ? "clock" : "sparkle",
    size: 14
  }), geminiLoading ? "Parsing with Gemini AI..." : "Parse with Gemini AI"), geminiPreview && geminiPreview.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: T.success,
      marginBottom: 8
    }
  }, "\u2713 ", geminiPreview.length, " assessments found. Review before saving:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      maxHeight: 240,
      overflowY: "auto",
      paddingRight: 2
    }
  }, geminiPreview.map(function (a, i) {
    var badge = typeBadge(a.type || "SUBMISSION");
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 7,
        background: T.bg3,
        border: "0.5px solid " + T.border
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text,
        fontWeight: 500
      }
    }, a.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        marginTop: 1
      }
    }, a.subject, " \xB7 ", fmtDate(a.date))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 7,
        fontWeight: 700,
        color: "#fff",
        background: badge.color,
        padding: "2px 5px",
        borderRadius: 3,
        flexShrink: 0
      }
    }, badge.label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btnP), {}, {
      flex: 1
    }),
    onClick: saveGeminiPreview
  }, "Save all to Assessment Hub"), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setGeminiPreview(null);
    }
  }, "Discard"))), !geminiPreview && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setShowSyllabusImport(false);
      setSyllabusText("");
      setGeminiPreview(null);
    }
  }, "Close")))), page === "Boardroom" && function () {
    var b = data.boardroom || {};
    var northStar = b.northStar || "";
    var goals = (b.goals || []).filter(function (g) {
      return g.status === "active";
    });
    var achieved = (b.goals || []).filter(function (g) {
      return g.status === "achieved";
    });
    var keyMoments = (b.keyMoments || []).slice().reverse();
    function modeBadgeStyle(mode) {
      if (mode === "evening") return {
        background: "rgba(127,119,221,0.2)",
        color: "#b3acff"
      };
      if (mode === "onboarding") return {
        background: "rgba(29,158,117,0.2)",
        color: "#6ed8b8"
      };
      return {
        background: "rgba(186,117,23,0.2)",
        color: "#e8b970"
      };
    }
    function modeLabel(mode) {
      return mode === "drift" ? "Check-in" : mode === "onboarding" ? "Onboarding" : mode === "evening" ? "Evening" : "Session";
    }
    function modeIcon(mode) {
      var nm = mode === "evening" ? "moon" : mode === "onboarding" ? "flag" : "clock";
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: "flex",
          color: "#8fb0ff"
        }
      }, /*#__PURE__*/React.createElement(UIcon, {
        name: nm,
        size: 14
      }));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: mob ? undefined : 860,
        padding: mob ? "12px 12px 120px" : "20px 20px 40px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "#eef3fb"
      }
    }, "Boardroom"), /*#__PURE__*/React.createElement("button", {
      onClick: brRedoConsultation,
      style: _objectSpread(_objectSpread({}, btnGlassP), {}, {
        padding: "7px 16px",
        flexShrink: 0
      })
    }, "New consultation")), northStar && /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: _objectSpread(_objectSpread({}, card({
        marginBottom: 20
      })), {}, {
        padding: "18px 22px",
        borderLeft: "3px solid #5b8cff"
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, eyebrow), {}, {
        marginBottom: 8
      })
    }, "North Star"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: "rgba(255,255,255,0.85)",
        lineHeight: 1.65,
        fontStyle: "italic"
      }
    }, northStar)), /*#__PURE__*/React.createElement("button", {
      onClick: brOpen,
      style: _objectSpread(_objectSpread({}, btnGlassP), {}, {
        width: "100%",
        padding: "13px 0",
        fontSize: 14,
        fontWeight: 700,
        borderRadius: 14,
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
      })
    }, /*#__PURE__*/React.createElement(NavGlyph, {
      name: "Boardroom",
      size: 15
    }), "Start Session"), brGoalProposals.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: {
        background: cardBg,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: "1px solid rgba(91,140,255,0.28)",
        borderRadius: 14,
        padding: "14px 18px",
        marginBottom: 20,
        boxShadow: cardShadow
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: "rgba(91,140,255,0.8)",
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em"
      }
    }, "Goals surfaced from your last session"), brGoalProposals.map(function (p, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: i < brGoalProposals.length - 1 ? "0.5px solid rgba(255,255,255,0.06)" : "none"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: _objectSpread({
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 4
        }, getTagStyle(p.area))
      }, p.area), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: "rgba(255,255,255,0.85)"
        }
      }, p.title)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          brAcceptGoal(p);
        },
        style: _objectSpread(_objectSpread({}, btnGlassP), {}, {
          fontSize: 11,
          padding: "4px 12px"
        })
      }, "Add"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          brSkipGoal(p);
        },
        style: _objectSpread(_objectSpread({}, btnGlass), {}, {
          fontSize: 11,
          padding: "4px 12px"
        })
      }, "Skip")));
    })), brTaskProposals.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card-rim",
      style: {
        background: cardBg,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: "1px solid rgba(199,125,255,0.28)",
        borderRadius: 14,
        padding: "14px 18px",
        marginBottom: 20,
        boxShadow: cardShadow
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: "rgba(199,125,255,0.85)",
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em"
      }
    }, "To-dos from your last session"), brTaskProposals.map(function (t, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "8px 0",
          borderBottom: i < brTaskProposals.length - 1 ? "0.5px solid rgba(255,255,255,0.06)" : "none"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: "rgba(255,255,255,0.85)",
          lineHeight: 1.45
        }
      }, t), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 6,
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          brAcceptTask(t);
        },
        style: _objectSpread(_objectSpread({}, btnGlassP), {}, {
          fontSize: 11,
          padding: "4px 12px"
        })
      }, "Add task"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          brSkipTask(t);
        },
        style: _objectSpread(_objectSpread({}, btnGlass), {}, {
          fontSize: 11,
          padding: "4px 12px"
        })
      }, "Skip")));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, sectLabel), {}, {
        marginBottom: 12
      })
    }, "Active Goals"), goals.length === 0 && brGoalProposals.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.3)",
        padding: "20px 0"
      }
    }, "Open a session to surface your first goal."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : "repeat(auto-fill,minmax(180px,1fr))",
        gap: 10
      }
    }, goals.map(function (g) {
      return /*#__PURE__*/React.createElement("div", {
        key: g.id,
        className: "card-rim",
        style: _objectSpread(_objectSpread({}, glassMini), {}, {
          padding: "12px 14px"
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: _objectSpread({
          fontSize: 10,
          padding: "2px 7px",
          borderRadius: 4
        }, getTagStyle(g.area))
      }, g.area), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          brMarkGoalAchieved(g.id);
        },
        style: _objectSpread(_objectSpread({}, btnGlass), {}, {
          fontSize: 10,
          padding: "3px 9px"
        })
      }, "Done \u2713")), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          lineHeight: 1.4
        }
      }, g.title));
    }))), achieved.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        marginBottom: 8
      }
    }, "Achieved (", achieved.length, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : "repeat(auto-fill,minmax(180px,1fr))",
        gap: 8,
        marginTop: 8
      }
    }, achieved.map(function (g) {
      return /*#__PURE__*/React.createElement("div", {
        key: g.id,
        style: {
          background: "rgba(10,12,32,0.4)",
          border: "0.5px solid rgba(255,255,255,0.07)",
          borderRadius: 10,
          padding: "10px 12px",
          opacity: 0.6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: _objectSpread({
          fontSize: 10,
          padding: "2px 7px",
          borderRadius: 4
        }, getTagStyle(g.area))
      }, g.area), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          marginTop: 6,
          textDecoration: "line-through"
        }
      }, g.title));
    })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, sectLabel), {}, {
        marginBottom: 16
      })
    }, "Session Log"), keyMoments.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.3)"
      }
    }, "No sessions recorded yet."), /*#__PURE__*/React.createElement("div", {
      className: "br-tl-wrap"
    }, keyMoments.filter(function (m) {
      return m.mode !== "amalgamated";
    }).map(function (m, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "br-tl-item"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 30,
          height: 30,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          background: "rgba(10,12,32,0.9)",
          border: "2px solid rgba(91,140,255,0.35)",
          zIndex: 1,
          position: "relative"
        }
      }, modeIcon(m.mode)), /*#__PURE__*/React.createElement("div", {
        className: "card-rim",
        style: _objectSpread(_objectSpread({}, glassMini), {}, {
          flex: 1,
          padding: "12px 14px",
          marginBottom: 0
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)"
        }
      }, m.date), /*#__PURE__*/React.createElement("span", {
        style: _objectSpread({
          fontSize: 10,
          padding: "2px 7px",
          borderRadius: 4
        }, modeBadgeStyle(m.mode))
      }, modeLabel(m.mode))), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.55,
          borderLeft: "2px solid rgba(91,140,255,0.3)",
          paddingLeft: 10,
          marginBottom: m.commitments && m.commitments.length ? 10 : 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          fontWeight: 500,
          color: "rgba(91,140,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 3
        }
      }, "Alex & Chris concluded"), m.summary), m.commitments && m.commitments.length > 0 && /*#__PURE__*/React.createElement("div", null, m.commitments.map(function (c, ci) {
        var isDone = _typeof(c) === "object" ? c.done : false;
        var text = typeof c === "string" ? c : c.text;
        return /*#__PURE__*/React.createElement("label", {
          key: ci,
          style: {
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            padding: "4px 0",
            cursor: _typeof(c) === "object" ? "pointer" : "default"
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            marginTop: 1,
            display: "flex"
          }
        }, /*#__PURE__*/React.createElement(TickCircle, {
          done: isDone,
          size: 17,
          inert: typeof c === "string",
          onClick: _typeof(c) === "object" ? function () {
            brToggleCommitment((b.keyMoments || []).length - 1 - i, ci);
          } : undefined
        })), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 12,
            color: isDone ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)",
            textDecoration: isDone ? "line-through" : "none"
          }
        }, text));
      })), m.transcript && m.transcript.length > 0 && /*#__PURE__*/React.createElement("details", {
        style: {
          marginTop: 10
        }
      }, /*#__PURE__*/React.createElement("summary", {
        style: {
          fontSize: 11,
          color: "rgba(91,140,255,0.6)",
          cursor: "pointer",
          userSelect: "none"
        }
      }, "View full conversation (", m.transcript.length, ")"), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: 320,
          overflowY: "auto",
          paddingRight: 4
        }
      }, m.transcript.map(function (t, ti) {
        var isUser = t.role === "user";
        var who = isUser ? "You" : t.persona || "Coach";
        return /*#__PURE__*/React.createElement("div", {
          key: ti,
          style: {
            fontSize: 11,
            lineHeight: 1.55
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: 700,
            color: isUser ? "#5b8cff" : t.persona === "Alex" ? "#5b9bff" : "#9a8cff"
          }
        }, who, ": "), /*#__PURE__*/React.createElement("span", {
          style: {
            color: "rgba(255,255,255,0.6)",
            whiteSpace: "pre-wrap"
          }
        }, t.text));
      })))));
    }))));
  }(), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      trk("task.quick_open");
      setMForm({
        priority: "normal",
        cat: "Errands"
      });
      setModal("add_task");
    },
    style: _objectSpread(_objectSpread({}, whitePill), {}, {
      position: "fixed",
      bottom: mob ? 108 : 122,
      right: 20,
      zIndex: 150,
      padding: "7px 14px",
      fontSize: 12,
      background: "linear-gradient(135deg,rgba(199,125,255,0.92),rgba(150,80,220,0.94))",
      border: "1px solid rgba(199,125,255,0.55)",
      color: "#fff",
      boxShadow: "0 4px 18px rgba(150,80,220,0.45),inset 0 1px 0 rgba(255,255,255,0.20)"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      fontSize: 15,
      lineHeight: 1,
      fontWeight: 800
    }
  }, "+"), "Task"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      trk("capture.quick_open");
      setShowCapture(true);
      setCaptureResult(null);
    },
    style: _objectSpread(_objectSpread({}, whitePill), {}, {
      position: "fixed",
      bottom: mob ? 70 : 80,
      right: 20,
      zIndex: 150,
      padding: "7px 14px",
      fontSize: 12,
      background: "linear-gradient(135deg,rgba(91,140,255,0.92),rgba(50,85,204,0.94))",
      border: "1px solid rgba(91,140,255,0.55)",
      color: "#fff",
      boxShadow: "0 4px 18px rgba(50,90,200,0.45),inset 0 1px 0 rgba(255,255,255,0.20)"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "bolt",
    size: 14
  })), "Capture"), showCapture && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.70)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: mob ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 200,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      if (!captureLoading) {
        setShowCapture(false);
        setCaptureResult(null);
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-rim",
    style: {
      background: "rgba(12,16,38,0.82)",
      backdropFilter: "blur(28px) saturate(1.5)",
      WebkitBackdropFilter: "blur(28px) saturate(1.5)",
      borderRadius: mob ? "20px 20px 0 0" : "20px",
      padding: mob ? "24px 20px 32px" : "28px 28px 24px",
      width: mob ? "100%" : "480px",
      maxWidth: "100%",
      border: "1px solid rgba(91,140,255,0.18)",
      boxShadow: "inset 0 0 0 0.5px rgba(120,160,255,0.08),0 24px 60px rgba(0,0,0,0.65),0 0 80px rgba(40,70,200,0.14)",
      animation: "panel-in 280ms cubic-bezier(0.23,1,0.32,1) both"
    },
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, mob && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.18)",
      margin: "0 auto 20px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "rgba(91,140,255,0.10)",
      border: "0.5px solid rgba(91,140,255,0.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: T.accent,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "bolt",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text,
      letterSpacing: "-0.01em"
    }
  }, "Quick Capture"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginLeft: "auto",
      letterSpacing: "0.01em"
    }
  }, "Ctrl+Enter \xB7 Esc"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      color: T.text3,
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1,
      padding: "2px 6px",
      marginLeft: 4
    },
    onClick: function onClick() {
      if (!captureLoading) {
        setShowCapture(false);
        setCaptureResult(null);
      }
    },
    title: "Close"
  }, "\xD7")), !captureResult && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    autoFocus: true,
    rows: 4,
    value: captureText,
    onChange: function onChange(ev) {
      setCaptureText(ev.target.value);
    },
    onKeyDown: function onKeyDown(ev) {
      if (ev.key === "Escape") {
        setShowCapture(false);
        setCaptureResult(null);
      }
      if (ev.key === "Enter" && ev.ctrlKey) {
        ev.preventDefault();
        submitCapture();
      }
    },
    onFocus: function onFocus(ev) {
      ev.target.style.borderColor = "rgba(91,140,255,0.50)";
      ev.target.style.boxShadow = "0 0 0 3px rgba(91,140,255,0.10)";
    },
    onBlur: function onBlur(ev) {
      ev.target.style.borderColor = "rgba(91,140,255,0.18)";
      ev.target.style.boxShadow = "none";
    },
    placeholder: "What's on your mind, or something you just learned...",
    style: {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(91,140,255,0.18)",
      borderRadius: 12,
      padding: "13px 15px",
      color: T.text,
      fontSize: 13,
      lineHeight: 1.7,
      resize: "none",
      fontFamily: "inherit",
      outline: "none",
      marginBottom: 14,
      transition: "border-color 0.2s,box-shadow 0.2s",
      colorScheme: "dark"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      padding: "8px 16px",
      borderRadius: 10
    }),
    onClick: function onClick() {
      setShowCapture(false);
      setCaptureResult(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: submitCapture,
    disabled: captureLoading || !captureText.trim(),
    style: _objectSpread(_objectSpread({}, btnP), {}, {
      padding: "9px 22px",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      gap: 6,
      opacity: captureLoading || !captureText.trim() ? 0.45 : 1,
      cursor: captureLoading || !captureText.trim() ? "default" : "pointer"
    })
  }, captureLoading && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 10,
      height: 10,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff",
      animation: "spin 0.8s linear infinite"
    }
  }), captureLoading ? "Thinking..." : "Save"))), captureResult && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16,
      padding: "10px 14px",
      borderRadius: 12,
      background: "rgba(105,240,174,0.06)",
      border: "0.5px solid rgba(105,240,174,0.22)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#69f0ae",
      boxShadow: "0 0 7px rgba(105,240,174,0.8)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: T.success
    }
  }, "Captured & saved"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      padding: "2px 8px",
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.04em",
      background: captureResult.type === "learning" ? T.accentBg : captureResult.type === "reflection" ? "rgba(255,209,102,0.12)" : "rgba(255,255,255,0.07)",
      color: captureResult.type === "learning" ? T.accent : captureResult.type === "reflection" ? T.warn : T.text3,
      border: "0.5px solid " + (captureResult.type === "learning" ? "rgba(91,140,255,0.28)" : captureResult.type === "reflection" ? "rgba(255,209,102,0.25)" : "rgba(255,255,255,0.10)")
    }
  }, captureResult.type)), captureResult.title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: T.text,
      marginBottom: 8,
      letterSpacing: "-0.01em",
      lineHeight: 1.3
    }
  }, captureResult.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text2,
      lineHeight: 1.75,
      marginBottom: captureResult.formula ? 12 : 0
    }
  }, (captureResult.content || "").slice(0, 200), (captureResult.content || "").length > 200 ? "..." : ""), captureResult.formula && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderRadius: 10,
      background: "rgba(91,140,255,0.06)",
      border: "0.5px solid rgba(91,140,255,0.18)",
      fontSize: 11,
      color: T.accent,
      fontFamily: "monospace",
      marginBottom: 10,
      lineHeight: 1.6
    }
  }, captureResult.formula), captureResult.tags && captureResult.tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      marginTop: 10
    }
  }, captureResult.tags.map(function (tag) {
    return /*#__PURE__*/React.createElement("span", {
      key: tag,
      style: {
        fontSize: 10,
        padding: "3px 9px",
        borderRadius: 99,
        background: "rgba(91,140,255,0.08)",
        border: "0.5px solid rgba(91,140,255,0.18)",
        color: T.text3
      }
    }, "#" + tag);
  })), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btnP), {}, {
      marginTop: 16,
      padding: "9px 22px",
      borderRadius: 10
    }),
    onClick: function onClick() {
      setShowCapture(false);
      setCaptureResult(null);
    }
  }, "Done")))), showBoardroom && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.92)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      alignItems: mob ? "stretch" : "center",
      justifyContent: "center",
      zIndex: 200,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      setShowBoardroom(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick(e) {
      e.stopPropagation();
    },
    style: {
      background: "rgba(10,12,32,0.98)",
      border: "1px solid rgba(91,140,255,0.4)",
      borderRadius: mob ? 0 : 16,
      width: mob ? "100%" : 680,
      maxWidth: "100%",
      height: mob ? "100%" : "80vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(NavGlyph, {
    name: "Boardroom",
    size: 17
  }), "Boardroom"), brIntentMode && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 20,
      background: brIntentMode === "howto" ? "rgba(105,240,174,0.15)" : "rgba(91,140,255,0.15)",
      color: brIntentMode === "howto" ? "#69f0ae" : "#8fb4ff",
      border: "0.5px solid " + (brIntentMode === "howto" ? "rgba(105,240,174,0.4)" : "rgba(91,140,255,0.4)")
    }
  }, brIntentMode === "howto" ? "How-to" : "Direction")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setBrShowProjCtx(function (v) {
        return !v;
      });
    },
    style: {
      background: brShowProjCtx ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.06)",
      border: "0.5px solid rgba(255,255,255,0.15)",
      borderRadius: 8,
      padding: "5px 10px",
      color: T.text3,
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, data.boardroom && data.boardroom.projectContext ? "Context ✓" : "Project context"), data.boardroom && data.boardroom.onboarded ? /*#__PURE__*/React.createElement("button", {
    onClick: brEndSession,
    style: _objectSpread(_objectSpread({}, btn), {}, {
      borderRadius: 8,
      padding: "5px 10px",
      fontSize: 11
    })
  }, "End session") : /*#__PURE__*/React.createElement("button", {
    onClick: brFinishOnboarding,
    style: {
      background: "rgba(105,240,174,0.12)",
      border: "0.5px solid rgba(105,240,174,0.4)",
      borderRadius: 8,
      padding: "5px 10px",
      color: "#69f0ae",
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Finish setup"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setShowBoardroom(false);
    },
    style: {
      background: "none",
      border: "none",
      color: T.text3,
      fontSize: 20,
      cursor: "pointer"
    }
  }, "\xD7"))), brShowProjCtx && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 18px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(99,102,241,0.05)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: "rgba(199,125,255,0.8)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginBottom: 6
    }
  }, "Project context"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 6
    }
  }, "Paste what you're working on (e.g. a build handoff). The coaches use this for situation-specific step-by-step help."), /*#__PURE__*/React.createElement("textarea", {
    value: data.boardroom && data.boardroom.projectContext || "",
    onChange: function onChange(e) {
      var v = e.target.value;
      setData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          boardroom: _objectSpread(_objectSpread({}, p.boardroom || {}), {}, {
            projectContext: v
          })
        });
      });
    },
    placeholder: "e.g. Building a LilyGO T-Display-S3 AMOLED keychain. Step 3 = solder battery wires to BAT pads. Battery is a 400mAh LiPo with a JST-PH plug\u2026",
    style: {
      width: "100%",
      minHeight: 80,
      background: "rgba(255,255,255,0.06)",
      border: "0.5px solid rgba(255,255,255,0.15)",
      borderRadius: 10,
      padding: "8px 10px",
      color: "#fff",
      fontSize: 12,
      outline: "none",
      resize: "vertical",
      fontFamily: "inherit"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, brMessages.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.text3,
      fontSize: 13,
      textAlign: "center",
      marginTop: 24
    }
  }, "Alex and Chris are here. Tell them how your day's going."), brMessages.map(function (m, i) {
    if (m.role === "user") return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: "flex-end",
        maxWidth: "80%",
        background: "linear-gradient(135deg,#5b8cff,#3a5fcc)",
        color: "#fff",
        padding: "9px 13px",
        borderRadius: 14,
        fontSize: 13
      }
    }, m.text);
    var isAlex = m.persona === "Alex";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: "flex-start",
        maxWidth: "85%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: isAlex ? "#5b9bff" : "#9a8cff",
        marginBottom: 3,
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: isAlex ? "#5b9bff" : "#9a8cff",
        boxShadow: "0 0 8px " + (isAlex ? "#5b9bff" : "#9a8cff")
      }
    }), isAlex ? "Alex" : "Chris"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        color: "#e8e9f3",
        padding: "9px 13px",
        borderRadius: 14,
        fontSize: 13,
        whiteSpace: "pre-wrap"
      }
    }, m.text));
  }), brPendingIntent && /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-start",
      maxWidth: "90%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#c77dff",
      marginBottom: 3
    }
  }, "\uD83D\uDD35\uD83D\uDFE3 Boardroom"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.05)",
      border: "0.5px solid rgba(255,255,255,0.1)",
      color: "#e8e9f3",
      padding: "10px 13px",
      borderRadius: 14,
      fontSize: 13
    }
  }, "Quick check: want us to talk this through, or walk you through the actual steps?", /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      brConfirmIntent("direction");
    },
    style: {
      flex: 1,
      background: "rgba(91,140,255,0.15)",
      border: "0.5px solid rgba(91,140,255,0.4)",
      borderRadius: 8,
      padding: "7px 10px",
      color: "#8fb4ff",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Talk it through"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      brConfirmIntent("howto");
    },
    style: {
      flex: 1,
      background: "rgba(105,240,174,0.12)",
      border: "0.5px solid rgba(105,240,174,0.4)",
      borderRadius: 8,
      padding: "7px 10px",
      color: "#69f0ae",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Show me the steps")))), brLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.text3,
      fontSize: 12,
      fontStyle: "italic"
    }
  }, brClosing ? "Alex & Chris are wrapping up the session…" : brIntentMode === "howto" ? "Alex & Chris are working out the steps…" : "Alex & Chris are talking it through…")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: brInput,
    onChange: function onChange(e) {
      setBrInput(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") brSend();
    },
    placeholder: "Talk to the Boardroom\u2026",
    style: {
      flex: 1,
      background: "rgba(255,255,255,0.06)",
      border: "0.5px solid rgba(255,255,255,0.15)",
      borderRadius: 10,
      padding: "10px 12px",
      color: "#fff",
      fontSize: 13,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: brSend,
    disabled: brLoading,
    style: _objectSpread(_objectSpread({}, btnGlassP), {}, {
      borderRadius: 10,
      padding: "0 18px",
      fontSize: 13,
      cursor: brLoading ? "default" : "pointer",
      opacity: brLoading ? 0.6 : 1
    })
  }, "Send")))), editCaptureData && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,7,26,0.85)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      alignItems: mob ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 220,
      padding: mob ? "0" : "16px"
    },
    onClick: function onClick() {
      setEditCaptureData(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(14,16,40,0.98)",
      borderRadius: mob ? "20px 20px 0 0" : "16px",
      padding: mob ? "24px 20px 36px" : "24px",
      width: mob ? "100%" : "520px",
      maxWidth: "100%",
      border: "0.5px solid rgba(91,140,255,0.3)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
      maxHeight: mob ? "90vh" : "80vh",
      overflowY: "auto"
    },
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, mob && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.2)",
      margin: "0 auto 20px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      color: T.accent
    }
  }, /*#__PURE__*/React.createElement(UIcon, {
    name: "pencil",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: T.text
    }
  }, "Edit capture"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      padding: "2px 8px",
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 700,
      background: editCaptureData.type === "learning" ? T.accentBg : editCaptureData.type === "reflection" ? "rgba(255,209,102,0.15)" : T.bg3,
      color: editCaptureData.type === "learning" ? T.accent : editCaptureData.type === "reflection" ? T.warn : T.text2
    }
  }, editCaptureData.type || "thought")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Title"), /*#__PURE__*/React.createElement("input", {
    value: editCaptureData.title || "",
    onChange: function onChange(ev) {
      setEditCaptureData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          title: ev.target.value
        });
      });
    },
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 12px",
      fontSize: 13,
      width: "100%"
    }),
    placeholder: "Title..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Content"), /*#__PURE__*/React.createElement("textarea", {
    rows: 5,
    value: editCaptureData.content || "",
    onChange: function onChange(ev) {
      setEditCaptureData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          content: ev.target.value
        });
      });
    },
    style: {
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      border: "0.5px solid rgba(91,140,255,0.2)",
      borderRadius: 8,
      padding: "9px 12px",
      color: T.text,
      fontSize: 13,
      lineHeight: 1.7,
      resize: "vertical",
      fontFamily: "inherit",
      outline: "none"
    },
    placeholder: "Content..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Formula ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontWeight: 400
    }
  }, "(optional)")), /*#__PURE__*/React.createElement("input", {
    value: editCaptureData.formula || "",
    onChange: function onChange(ev) {
      setEditCaptureData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          formula: ev.target.value
        });
      });
    },
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 12px",
      fontSize: 12,
      fontFamily: "monospace",
      width: "100%"
    }),
    placeholder: "e.g. Revenue - Expenses = Profit"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Example ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontWeight: 400
    }
  }, "(optional)")), /*#__PURE__*/React.createElement("input", {
    value: editCaptureData.example || "",
    onChange: function onChange(ev) {
      setEditCaptureData(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          example: ev.target.value
        });
      });
    },
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 12px",
      fontSize: 13,
      width: "100%"
    }),
    placeholder: "A real-world example..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text2,
      marginBottom: 5
    }
  }, "Tags ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.text3,
      fontWeight: 400
    }
  }, "(comma separated)")), /*#__PURE__*/React.createElement("input", {
    value: editCaptureTagStr,
    onChange: function onChange(ev) {
      setEditCaptureTagStr(ev.target.value);
    },
    style: _objectSpread(_objectSpread({}, inp), {}, {
      padding: "9px 12px",
      fontSize: 13,
      width: "100%"
    }),
    placeholder: "e.g. accounting, tax, gst"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexDirection: mob ? "column" : "row",
      justifyContent: "flex-end"
    }
  }, mob ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btnP), {}, {
      padding: "13px",
      fontSize: 14,
      width: "100%",
      borderRadius: 10
    }),
    onClick: saveEditCapture
  }, "Save changes"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      padding: "11px",
      fontSize: 13,
      width: "100%",
      borderRadius: 10,
      textAlign: "center"
    }),
    onClick: function onClick() {
      setEditCaptureData(null);
    }
  }, "Cancel")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: btnP,
    onClick: saveEditCapture
  }, "Save changes"), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: function onClick() {
      setEditCaptureData(null);
    }
  }, "Cancel"))))), mob && /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: "rgba(5,7,26,0.97)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: "0.5px solid rgba(91,140,255,0.18)",
      alignItems: "stretch",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch"
    }
  }, NAV_PAGES.map(function (name) {
    var active = page === name;
    return /*#__PURE__*/React.createElement("button", {
      key: name,
      onClick: function onClick() {
        setPage(name);
      },
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: "8px 10px",
        color: active ? T.accent : T.text3,
        flex: "0 0 auto",
        minWidth: 60,
        minHeight: 54,
        position: "relative"
      }
    }, active && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 24,
        height: 2,
        borderRadius: 1,
        background: T.accent
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1
      }
    }, /*#__PURE__*/React.createElement(NavGlyph, {
      name: name,
      size: 18
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: active ? 700 : 400,
        letterSpacing: 0.2,
        whiteSpace: "nowrap"
      }
    }, name));
  })));
}
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));