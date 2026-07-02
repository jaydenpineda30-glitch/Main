/* =============================================================================
 * market-service.js  —  window.MarketService
 * -----------------------------------------------------------------------------
 * A plain-browser (no bundler, no ES modules) market-data service for the
 * dashboard. Loaded via <script src="market-service.js"></script>, it attaches
 * a single global `window.MarketService`, mirroring the app's GeminiService
 * pattern.
 *
 * Data provider: Finnhub (https://finnhub.io) — free tier.
 *
 * -----------------------------------------------------------------------------
 * FINNHUB FREE-TIER CAVEATS (verified July 2026 against finnhub.io docs +
 * the public Finnhub-API GitHub issue tracker):
 *
 *  1. RATE LIMIT: 60 API calls / minute on the free tier. This service caches
 *     aggressively and de-dupes concurrent identical requests to stay well
 *     under that ceiling.
 *
 *  2. DELAYED DATA: Free US quotes are effectively real-time-ish but Finnhub
 *     documents up to ~15 minutes of delay for some feeds. Treat quote data as
 *     "possibly delayed", never as tick-accurate trading data.
 *
 *  3. STOCK CANDLES ARE PREMIUM (IMPORTANT):
 *     `GET /stock/candle` was moved behind Finnhub's premium plans. On a free
 *     API key it returns HTTP 403 with body:
 *         { "error": "You don't have access to this resource." }
 *     (Confirmed via Finnhub-API issues #405, #527, #534, #553.)
 *     Therefore `getCandles()` here:
 *       - still hits `/stock/candle` (so a paid key "just works"),
 *       - degrades GRACEFULLY: on 403/no-data/error it resolves to `null`
 *         (it never rejects for the "no access" case), so the caller can fall
 *         back to demo/synthetic candles,
 *       - always returns a GENERIC normalized OHLC array shape, so an alternate
 *         source (Alpha Vantage, Polygon, Stooq, Yahoo, etc.) can be swapped in
 *         later without touching the UI.
 *
 *  4. FREE ENDPOINTS USED HERE (all confirmed free-tier accessible):
 *       - GET /quote            ?symbol=AAPL
 *       - GET /stock/profile2   ?symbol=AAPL
 *       - GET /company-news     ?symbol=AAPL&from=YYYY-MM-DD&to=YYYY-MM-DD
 *       - GET /search           ?q=apple
 *     ( /stock/candle is premium — see #3 )
 *
 * -----------------------------------------------------------------------------
 * NORMALIZED RETURN SHAPES (the UI depends on THESE, never on raw Finnhub JSON):
 *
 *   Quote (getQuote):
 *     { symbol, price, change, changePercent, high, low, open, previousClose,
 *       timestamp(ms), delayed(bool), demo(bool) }
 *   Profile (getProfile):
 *     { symbol, name, ticker, logo, industry, marketCap(millions USD), currency,
 *       exchange, country, website, ipo, demo }
 *   Candles (getCandles): null  OR
 *     { symbol, resolution, candles:[{time(ms),open,high,low,close,volume}], demo }
 *   News item (getNews) -> array of:
 *     { id, headline, summary, url, source, image, datetime(ms), demo }
 *   Search result (searchSymbols) -> array of:
 *     { symbol, description, type, demo }
 *
 * PUBLIC API: setKey(k), hasKey(), isDemo(), clearCache(), getQuote(sym),
 *   getProfile(sym), getCandles(sym,res,from,to), getNews(sym), searchSymbols(q)
 * All methods return Promises and NEVER throw synchronously.
 * ===========================================================================*/

(function () {
  'use strict';

  var BASE = 'https://finnhub.io/api/v1';
  var KEY_STORAGE = '__finnhub_key__';

  // Cache TTLs (milliseconds) — tuned for the 60 calls/min free limit.
  var TTL = {
    quote:   15 * 1000,
    profile: 24 * 60 * 60 * 1000,
    candles:  5 * 60 * 1000,
    news:    30 * 60 * 1000,
    search:   5 * 60 * 1000
  };

  function getKey() {
    try {
      var k = window.localStorage.getItem(KEY_STORAGE);
      return k ? String(k).trim() : '';
    } catch (e) {
      return '';
    }
  }

  function setKey(k) {
    try {
      if (k == null || String(k).trim() === '') {
        window.localStorage.removeItem(KEY_STORAGE);
      } else {
        window.localStorage.setItem(KEY_STORAGE, String(k).trim());
      }
    } catch (e) { /* storage may be unavailable; fail silently */ }
  }

  function hasKey() { return getKey().length > 0; }
  function isDemo() { return !hasKey(); }

  // Twelve Data key (free EOD historical candles — used because Finnhub's candle
  // endpoint is premium). Separate free key from finnhub.io / twelvedata.com.
  var TD_KEY_STORAGE = '__twelvedata_key__';
  function getTdKey() {
    try { var k = window.localStorage.getItem(TD_KEY_STORAGE); return k ? String(k).trim() : ''; }
    catch (e) { return ''; }
  }
  function setTdKey(k) {
    try {
      if (k == null || String(k).trim() === '') window.localStorage.removeItem(TD_KEY_STORAGE);
      else window.localStorage.setItem(TD_KEY_STORAGE, String(k).trim());
    } catch (e) {}
  }
  function hasTdKey() { return getTdKey().length > 0; }

  // ---- Cache + in-flight de-dupe ----
  var cache = new Map();
  var inflight = new Map();

  function clearCache() { cache.clear(); inflight.clear(); }

  function cacheGet(url) {
    var entry = cache.get(url);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) { cache.delete(url); return undefined; }
    return entry.value;
  }
  function cacheSet(url, value, ttl) { cache.set(url, { expires: Date.now() + ttl, value: value }); }

  // ---- Rate-limit throttle: per-provider token bucket + silent 429 retry ----
  // Requests queue and drain at a safe rate so free-tier caps are never tripped.
  // Twelve Data free = 8/min → we run 7/min with a burst of 8; Finnhub 60/min → 55.
  function makeBucket(capacity, perMin) {
    var tokens = capacity, last = Date.now(), q = [];
    var ratePerMs = perMin / 60000;
    function refill() { var now = Date.now(); tokens = Math.min(capacity, tokens + (now - last) * ratePerMs); last = now; }
    function pump() {
      refill();
      while (q.length && tokens >= 1) { tokens -= 1; (q.shift())(); }
      if (q.length) { var waitMs = Math.max(60, (1 - tokens) / ratePerMs); setTimeout(pump, waitMs); }
    }
    return function (job) { return new Promise(function (res, rej) { q.push(function () { Promise.resolve().then(job).then(res, rej); }); pump(); }); };
  }
  var BUCKETS = {
    'twelvedata.com': makeBucket(8, 7),
    'finnhub.io': makeBucket(30, 55),
    'frankfurter.dev': makeBucket(10, 60)
  };
  function bucketFor(url) { for (var host in BUCKETS) { if (url.indexOf(host) !== -1) return BUCKETS[host]; } return null; }
  // Fetch through the provider's bucket; on a 429 that slips through, wait and
  // retry once so the rate limit is transparent to the UI.
  function fetch429(url, opts, tries) {
    return fetch(url, opts).then(function (r) {
      if (r.status === 429 && tries > 0) {
        return new Promise(function (res) { setTimeout(res, 7000); }).then(function () { return fetch429(url, opts, tries - 1); });
      }
      return r;
    });
  }
  function throttledFetch(url, opts) {
    var b = bucketFor(url);
    var job = function () { return fetch429(url, opts, 1); };
    return b ? b(job) : job();
  }

  function fetchJson(url, ttl) {
    var cached = cacheGet(url);
    if (cached !== undefined) return Promise.resolve(cached);
    if (inflight.has(url)) return inflight.get(url);

    var p = throttledFetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then(function (res) {
        if (res.status === 429) {
          throw new Error('Finnhub rate limit reached (HTTP 429). Free tier allows 60 calls/minute — slow down or add a paid key.');
        }
        if (res.status === 401 || res.status === 403) {
          var err = new Error('Finnhub access denied (HTTP ' + res.status + '). The API key is missing/invalid or this endpoint is premium-only.');
          err.status = res.status;
          throw err;
        }
        if (!res.ok) throw new Error('Finnhub request failed (HTTP ' + res.status + ').');
        return res.json();
      })
      .then(function (json) {
        if (json && typeof json === 'object' && json.error) {
          throw new Error('Finnhub error: ' + json.error);
        }
        cacheSet(url, json, ttl);
        return json;
      })
      .finally(function () { inflight.delete(url); });

    inflight.set(url, p);
    return p;
  }

  function buildUrl(path, params) {
    var qs = [];
    params = params || {};
    params.token = getKey();
    Object.keys(params).forEach(function (k) {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
      }
    });
    return BASE + path + '?' + qs.join('&');
  }

  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }

  // ---- Deterministic pseudo-random helpers (NO Math.random — stable per symbol) ----
  function hashString(str) {
    var h = 2166136261;
    str = String(str || '');
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function seededRng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- DEMO MODE mock generators (deterministic, seeded from symbol) ----
  function demoBasePrice(symbol) {
    var h = hashString(symbol);
    return 12 + (h % 52800) / 100;
  }
  function round2(n) { return Math.round(n * 100) / 100; }

  function demoQuote(symbol) {
    var rng = seededRng(hashString(symbol + '|quote'));
    var base = demoBasePrice(symbol);
    var prevClose = round2(base);
    var pct = (rng() - 0.5) * 7;
    var change = round2(prevClose * (pct / 100));
    var price = round2(prevClose + change);
    var open = round2(prevClose * (1 + (rng() - 0.5) * 0.01));
    var high = round2(Math.max(price, open, prevClose) * (1 + rng() * 0.012));
    var low = round2(Math.min(price, open, prevClose) * (1 - rng() * 0.012));
    return {
      symbol: symbol, price: price, change: change,
      changePercent: round2(prevClose ? (change / prevClose) * 100 : 0),
      high: high, low: low, open: open, previousClose: prevClose,
      timestamp: Date.now(), delayed: true, demo: true
    };
  }

  var DEMO_INDUSTRIES = ['Technology', 'Consumer Electronics', 'Software', 'Semiconductors', 'Retail', 'Financial Services', 'Healthcare', 'Automotive', 'Media', 'Energy'];
  var DEMO_EXCHANGES = ['NASDAQ NMS - GLOBAL MARKET', 'NEW YORK STOCK EXCHANGE, INC.'];

  function demoProfile(symbol) {
    var rng = seededRng(hashString(symbol + '|profile'));
    var industry = DEMO_INDUSTRIES[Math.floor(rng() * DEMO_INDUSTRIES.length)];
    var exchange = DEMO_EXCHANGES[Math.floor(rng() * DEMO_EXCHANGES.length)];
    var cap = Math.round((5000 + rng() * 2500000));
    var year = 1980 + Math.floor(rng() * 40);
    var month = 1 + Math.floor(rng() * 12);
    var day = 1 + Math.floor(rng() * 28);
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return {
      symbol: symbol, name: symbol + ' Industries Inc.', ticker: symbol, logo: '',
      industry: industry, marketCap: cap, currency: 'USD', exchange: exchange,
      country: 'US', website: 'https://example.com/' + symbol.toLowerCase(),
      ipo: year + '-' + pad(month) + '-' + pad(day), demo: true
    };
  }

  function demoCandles(symbol, resolution, from, to) {
    var days = 90;
    if (isFinite(from) && isFinite(to) && to > from) {
      var span = Math.round((to - from) / 86400);
      if (span > 1 && span < 800) days = span;
    }
    var seed = hashString(symbol + '|candles');
    var rng = seededRng(seed);
    var price = demoBasePrice(symbol);
    var drift = (rng() - 0.45) * 0.0015;
    var candles = [];
    var end = isFinite(to) && to > 0 ? to * 1000 : Date.now();
    var dayMs = 86400 * 1000;
    for (var i = 0; i < days; i++) {
      var r = seededRng((seed ^ (i * 2654435761)) >>> 0);
      var dailyVol = (r() - 0.5) * 0.03;
      var open = round2(price);
      price = price * (1 + drift + dailyVol);
      if (price < 1) price = 1;
      var close = round2(price);
      var hi = round2(Math.max(open, close) * (1 + r() * 0.012));
      var lo = round2(Math.min(open, close) * (1 - r() * 0.012));
      var vol = Math.round(500000 + r() * 9500000);
      var time = end - (days - 1 - i) * dayMs;
      candles.push({ time: time, open: open, high: hi, low: lo, close: close, volume: vol });
    }
    return { symbol: symbol, resolution: resolution || 'D', candles: candles, demo: true };
  }

  var DEMO_HEADLINES = [
    { h: '{S} beats quarterly earnings expectations', s: '{S} reported stronger-than-expected results, driven by robust demand and improving margins across its core segments.' },
    { h: 'Analysts raise price target on {S}', s: 'Several analysts lifted their price targets on {S}, citing an improved outlook and disciplined cost management.' },
    { h: '{S} announces new product lineup', s: 'The company unveiled a refreshed product portfolio expected to strengthen its competitive position heading into the next fiscal year.' },
    { h: '{S} expands into new markets', s: 'Management outlined an international expansion strategy aimed at diversifying revenue and capturing new growth.' }
  ];

  function demoNews(symbol) {
    var rng = seededRng(hashString(symbol + '|news'));
    var n = 3 + Math.floor(rng() * 2);
    var out = [];
    var now = Date.now();
    for (var i = 0; i < n; i++) {
      var tpl = DEMO_HEADLINES[i % DEMO_HEADLINES.length];
      out.push({
        id: symbol + '-demo-' + i,
        headline: tpl.h.replace(/\{S\}/g, symbol),
        summary: tpl.s.replace(/\{S\}/g, symbol),
        url: 'https://example.com/news/' + symbol.toLowerCase() + '/' + i,
        source: ['MarketWire', 'Bloomberg', 'Reuters', 'CNBC'][Math.floor(rng() * 4)],
        image: '', datetime: now - (i + 1) * 6 * 3600 * 1000, demo: true
      });
    }
    return out;
  }

  function demoSearch(query) {
    var q = String(query || '').trim().toUpperCase();
    if (!q) return [];
    var base = q.replace(/[^A-Z]/g, '').slice(0, 4) || 'DEMO';
    var suffixes = ['', 'X', '.L', 'Y', 'Z'];
    var out = [];
    for (var i = 0; i < 5; i++) {
      var sym = (base + suffixes[i]).slice(0, 6);
      out.push({ symbol: sym, description: q + ' RELATED COMPANY ' + (i + 1), type: 'Common Stock', demo: true });
    }
    return out;
  }

  // ---- Normalizers (raw Finnhub JSON -> normalized shapes) ----
  function normalizeQuote(symbol, raw) {
    raw = raw || {};
    return {
      symbol: symbol, price: num(raw.c), change: num(raw.d), changePercent: num(raw.dp),
      high: num(raw.h), low: num(raw.l), open: num(raw.o), previousClose: num(raw.pc),
      timestamp: raw.t ? num(raw.t) * 1000 : Date.now(), delayed: true, demo: false
    };
  }

  function normalizeProfile(symbol, raw) {
    raw = raw || {};
    return {
      symbol: symbol, name: raw.name || '', ticker: raw.ticker || symbol, logo: raw.logo || '',
      industry: raw.finnhubIndustry || '', marketCap: num(raw.marketCapitalization),
      currency: raw.currency || '', exchange: raw.exchange || '', country: raw.country || '',
      website: raw.weburl || '', ipo: raw.ipo || '', demo: false
    };
  }

  function normalizeCandles(symbol, resolution, raw) {
    if (!raw || raw.s !== 'ok' || !Array.isArray(raw.t) || raw.t.length === 0) return null;
    var candles = [];
    for (var i = 0; i < raw.t.length; i++) {
      candles.push({
        time: num(raw.t[i]) * 1000, open: num(raw.o[i]), high: num(raw.h[i]),
        low: num(raw.l[i]), close: num(raw.c[i]), volume: num(raw.v[i])
      });
    }
    return { symbol: symbol, resolution: resolution, candles: candles, demo: false };
  }

  function normalizeNews(rawArr) {
    if (!Array.isArray(rawArr)) return [];
    return rawArr.map(function (n, idx) {
      return {
        id: String(n.id != null ? n.id : idx), headline: n.headline || '', summary: n.summary || '',
        url: n.url || '', source: n.source || '', image: n.image || '',
        datetime: n.datetime ? num(n.datetime) * 1000 : 0, demo: false
      };
    });
  }

  function normalizeSearch(raw) {
    var arr = (raw && Array.isArray(raw.result)) ? raw.result : [];
    return arr.map(function (r) {
      return { symbol: r.symbol || '', description: r.description || '', type: r.type || '', demo: false };
    });
  }

  function ymd(d) {
    return d.getUTCFullYear() + '-' +
      String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(d.getUTCDate()).padStart(2, '0');
  }

  // ---- Public methods — each wrapped so it NEVER throws synchronously ----
  function getQuote(symbol) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getQuote: symbol is required.'));
      if (isDemo()) return Promise.resolve(demoQuote(symbol));
      var ps = parseSym(symbol);
      // Non-US (e.g. ASX) → Twelve Data quote; Finnhub free is US-only.
      if (ps.td) {
        if (!hasTdKey()) return Promise.reject(new Error('Non-US quote needs a Twelve Data key.'));
        return getQuoteTwelveData(ps.api, ps.exchange).then(function (q) { q.symbol = symbol; return q; });
      }
      return fetchJson(buildUrl('/quote', { symbol: ps.api }), TTL.quote).then(function (raw) {
        return normalizeQuote(symbol, raw);
      });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  function getProfile(symbol) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getProfile: symbol is required.'));
      if (isDemo()) return Promise.resolve(demoProfile(symbol));
      return fetchJson(buildUrl('/stock/profile2', { symbol: symbol }), TTL.profile).then(function (raw) {
        return normalizeProfile(symbol, raw);
      });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  // Parse a symbol into { api, exchange, td }. Non-US exchanges (e.g. ASX) are
  // written "CBA.AX" or "CBA:ASX" and routed to Twelve Data for BOTH quote and
  // candles, since Finnhub's free tier is US-only.
  var EXCH_SUFFIX = { AX: 'ASX', AS: 'AMS', L: 'LSE', TO: 'TSX', NZ: 'NZX', HK: 'HKEX' };
  function parseSym(sym) {
    sym = String(sym || '').trim().toUpperCase();
    var m = sym.match(/^(.+):([A-Z]+)$/);
    if (m) return { api: m[1], exchange: m[2], td: true };
    m = sym.match(/^(.+)\.([A-Z]{1,3})$/);
    if (m && EXCH_SUFFIX[m[2]]) return { api: m[1], exchange: EXCH_SUFFIX[m[2]], td: true };
    return { api: sym, exchange: null, td: false };
  }

  // Twelve Data real-time-ish quote (free). Used for non-US (e.g. ASX) symbols.
  function getQuoteTwelveData(apiSym, exchange) {
    var url = 'https://api.twelvedata.com/quote?symbol=' + encodeURIComponent(apiSym) +
      (exchange ? ('&exchange=' + encodeURIComponent(exchange)) : '') + '&apikey=' + encodeURIComponent(getTdKey());
    var cached = cacheGet(url);
    if (cached !== undefined) return Promise.resolve(cached);
    if (inflight.has(url)) return inflight.get(url);
    var p = throttledFetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('Twelve Data HTTP ' + r.status); return r.json(); })
      .then(function (j) {
        if (!j || j.status === 'error' || j.code) throw new Error('Twelve Data: ' + ((j && j.message) || 'no data'));
        var res = {
          symbol: apiSym, price: num(j.close), change: num(j.change), changePercent: num(j.percent_change),
          high: num(j.high), low: num(j.low), open: num(j.open), previousClose: num(j.previous_close),
          timestamp: Date.now(), delayed: true, demo: false, currency: j.currency || null, name: j.name || null
        };
        cacheSet(url, res, TTL.quote);
        return res;
      })
      .finally(function () { inflight.delete(url); });
    inflight.set(url, p);
    return p;
  }

  // Twelve Data EOD history (free tier, CORS-friendly). Returns the normalized
  // candle shape or throws. Newest-first from the API, reversed to ascending.
  function getCandlesTwelveData(symbol, exchange, from, to) {
    var days = 180;
    if (isFinite(from) && isFinite(to) && to > from) {
      var span = Math.round((to - from) / 86400);
      if (span > 1 && span < 5000) days = span;
    }
    var out = Math.min(Math.max(days, 30), 5000);
    var url = 'https://api.twelvedata.com/time_series?symbol=' + encodeURIComponent(symbol) +
      (exchange ? ('&exchange=' + encodeURIComponent(exchange)) : '') +
      '&interval=1day&outputsize=' + out + '&apikey=' + encodeURIComponent(getTdKey());
    var cached = cacheGet(url);
    if (cached !== undefined) return Promise.resolve(cached);
    if (inflight.has(url)) return inflight.get(url);
    var p = throttledFetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('Twelve Data HTTP ' + r.status); return r.json(); })
      .then(function (j) {
        if (!j || j.status === 'error' || !Array.isArray(j.values)) {
          throw new Error('Twelve Data: ' + ((j && j.message) || 'no data'));
        }
        var vals = j.values.slice().reverse();
        var candles = vals.map(function (v) {
          return { time: Date.parse(v.datetime), open: num(v.open), high: num(v.high), low: num(v.low), close: num(v.close), volume: num(v.volume) };
        });
        var res = { symbol: symbol, resolution: 'D', candles: candles, demo: false };
        cacheSet(url, res, TTL.candles);
        return res;
      })
      .finally(function () { inflight.delete(url); });
    inflight.set(url, p);
    return p;
  }

  function getCandles(symbol, resolution, from, to) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getCandles: symbol is required.'));
      resolution = resolution || 'D';
      if (isDemo()) return Promise.resolve(demoCandles(symbol, resolution, from, to));
      var ps = parseSym(symbol);
      // Prefer Twelve Data (free EOD) when a key is set — Finnhub candles are premium.
      if (hasTdKey()) return getCandlesTwelveData(ps.api, ps.exchange, from, to);
      // Non-US symbols require Twelve Data; without its key we can't chart them.
      if (ps.td) return Promise.resolve(null);

      var nowSec = Math.floor(Date.now() / 1000);
      var fromSec = isFinite(from) && from > 0 ? Math.floor(from) : nowSec - 90 * 86400;
      var toSec = isFinite(to) && to > 0 ? Math.floor(to) : nowSec;

      return fetchJson(buildUrl('/stock/candle', { symbol: symbol, resolution: resolution, from: fromSec, to: toSec }), TTL.candles)
        .then(function (raw) { return normalizeCandles(symbol, resolution, raw); })
        .catch(function (err) {
          // Premium/no-access → null so the UI shows an honest "no chart data" note.
          if (err && (err.status === 403 || err.status === 401)) return null;
          if (err && /premium|access to this resource/i.test(err.message || '')) return null;
          throw err;
        });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  function getNews(symbol) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getNews: symbol is required.'));
      if (isDemo()) return Promise.resolve(demoNews(symbol));
      var to = new Date();
      var from = new Date(to.getTime() - 14 * 86400 * 1000);
      return fetchJson(buildUrl('/company-news', { symbol: symbol, from: ymd(from), to: ymd(to) }), TTL.news).then(function (raw) {
        return normalizeNews(raw);
      });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  function searchSymbols(query) {
    try {
      query = String(query || '').trim();
      if (!query) return Promise.resolve([]);
      if (isDemo()) return Promise.resolve(demoSearch(query));
      return fetchJson(buildUrl('/search', { q: query }), TTL.search).then(function (raw) {
        return normalizeSearch(raw);
      });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  // ---- FX (Frankfurter / ECB — free, no key, CORS-friendly). Base-currency support. ----
  var DEMO_FX = { USD_AUD: 1.52, AUD_USD: 0.658, EUR_AUD: 1.63, GBP_AUD: 1.92, USD_EUR: 0.92, USD_GBP: 0.79 };
  function demoFxRate(from, to) {
    if (from === to) return 1;
    var k = from + '_' + to; if (DEMO_FX[k]) return DEMO_FX[k];
    var inv = to + '_' + from; if (DEMO_FX[inv]) return Math.round((1 / DEMO_FX[inv]) * 10000) / 10000;
    return 0.5 + (hashString(from + to) % 200) / 100;
  }
  // getFxRate always tries the live (free) ECB feed, even in Finnhub demo mode.
  function getFxRate(from, to) {
    try {
      from = String(from || 'USD').trim().toUpperCase();
      to = String(to || 'AUD').trim().toUpperCase();
      if (from === to) return Promise.resolve(1);
      var url = 'https://api.frankfurter.dev/v1/latest?base=' + from + '&symbols=' + to;
      var cached = cacheGet(url);
      if (cached !== undefined) return Promise.resolve(cached);
      if (inflight.has(url)) return inflight.get(url);
      var p = throttledFetch(url, { headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('FX HTTP ' + r.status); return r.json(); })
        .then(function (j) { var rate = j && j.rates && j.rates[to]; if (!rate) throw new Error('FX: no rate'); cacheSet(url, rate, TTL.profile); return rate; })
        .catch(function () { return demoFxRate(from, to); })
        .finally(function () { inflight.delete(url); });
      inflight.set(url, p);
      return p;
    } catch (e) { return Promise.resolve(demoFxRate(String(from).toUpperCase(), String(to).toUpperCase())); }
  }

  // ---- Valuation metrics (Finnhub /stock/metric — FREE). ----
  function demoMetrics(symbol) {
    var r = seededRng(hashString(symbol + '|metric'));
    var base = demoBasePrice(symbol);
    return {
      symbol: symbol, peTTM: round2(8 + r() * 40), ps: round2(1 + r() * 12), pb: round2(1 + r() * 15),
      netMargin: round2(-5 + r() * 35), roe: round2(r() * 45), beta: round2(0.4 + r() * 1.6),
      week52High: round2(base * (1.05 + r() * 0.5)), week52Low: round2(base * (0.4 + r() * 0.3)),
      revenueGrowth: round2(-10 + r() * 45), dividendYield: round2(r() * 4), eps: round2(base / (8 + r() * 30)), demo: true
    };
  }
  function normalizeMetrics(symbol, raw) {
    var m = (raw && raw.metric) || {};
    return {
      symbol: symbol, peTTM: numOrNull(m.peTTM), ps: numOrNull(m.psTTM), pb: numOrNull(m.pbAnnual != null ? m.pbAnnual : m.pbQuarterly),
      netMargin: numOrNull(m.netProfitMarginTTM), roe: numOrNull(m.roeTTM), beta: numOrNull(m.beta),
      week52High: numOrNull(m['52WeekHigh']), week52Low: numOrNull(m['52WeekLow']),
      revenueGrowth: numOrNull(m.revenueGrowthTTMYoy), dividendYield: numOrNull(m.currentDividendYieldTTM), eps: numOrNull(m.epsTTM), demo: false
    };
  }
  function getMetrics(symbol) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getMetrics: symbol required'));
      if (isDemo()) return Promise.resolve(demoMetrics(symbol));
      return fetchJson(buildUrl('/stock/metric', { symbol: symbol, metric: 'all' }), TTL.profile).then(function (raw) { return normalizeMetrics(symbol, raw); });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  // ---- Analyst ratings (Finnhub /recommendation-trends — FREE). ----
  function demoRecommendation(symbol) {
    var r = seededRng(hashString(symbol + '|rec'));
    return { symbol: symbol, strongBuy: Math.floor(r() * 12), buy: Math.floor(r() * 18), hold: Math.floor(r() * 14), sell: Math.floor(r() * 6), strongSell: Math.floor(r() * 3), period: 'demo', demo: true };
  }
  function getRecommendation(symbol) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getRecommendation: symbol required'));
      if (isDemo()) return Promise.resolve(demoRecommendation(symbol));
      return fetchJson(buildUrl('/stock/recommendation', { symbol: symbol }), TTL.profile).then(function (raw) {
        var t = Array.isArray(raw) && raw.length ? raw[0] : {};
        return { symbol: symbol, strongBuy: num(t.strongBuy), buy: num(t.buy), hold: num(t.hold), sell: num(t.sell), strongSell: num(t.strongSell), period: t.period || '', demo: false };
      });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  // ---- Price target (Finnhub /price-target — FREE). ----
  function demoPriceTarget(symbol) {
    var r = seededRng(hashString(symbol + '|pt')); var base = demoBasePrice(symbol);
    return { symbol: symbol, targetMean: round2(base * (0.9 + r() * 0.5)), targetHigh: round2(base * (1.2 + r() * 0.5)), targetLow: round2(base * (0.6 + r() * 0.2)), demo: true };
  }
  function getPriceTarget(symbol) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getPriceTarget: symbol required'));
      if (isDemo()) return Promise.resolve(demoPriceTarget(symbol));
      return fetchJson(buildUrl('/price-target', { symbol: symbol }), TTL.profile).then(function (raw) {
        raw = raw || {};
        return { symbol: symbol, targetMean: numOrNull(raw.targetMean), targetHigh: numOrNull(raw.targetHigh), targetLow: numOrNull(raw.targetLow), demo: false };
      });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  // ---- Earnings surprises + next date (Finnhub /stock/earnings + /calendar/earnings — FREE). ----
  function demoEarnings(symbol) {
    var r = seededRng(hashString(symbol + '|earn')); var recent = [];
    for (var i = 0; i < 4; i++) { var est = round2(0.5 + r() * 3); var act = round2(est * (0.85 + r() * 0.35)); recent.push({ period: 'Q' + (4 - i), estimate: est, actual: act, surprisePercent: round2(((act - est) / est) * 100) }); }
    var d = new Date(Date.now() + (10 + Math.floor(r() * 60)) * 86400000);
    return { symbol: symbol, next: { date: ymd(d), epsEstimate: round2(0.5 + r() * 3) }, recent: recent, demo: true };
  }
  function getEarnings(symbol) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getEarnings: symbol required'));
      if (isDemo()) return Promise.resolve(demoEarnings(symbol));
      var recentP = fetchJson(buildUrl('/stock/earnings', { symbol: symbol }), TTL.profile).then(function (raw) {
        return (Array.isArray(raw) ? raw : []).slice(0, 4).map(function (e) { return { period: e.period || '', estimate: numOrNull(e.estimate), actual: numOrNull(e.actual), surprisePercent: numOrNull(e.surprisePercent) }; });
      }).catch(function () { return []; });
      var to = new Date(Date.now() + 120 * 86400000), from = new Date();
      var nextP = fetchJson(buildUrl('/calendar/earnings', { symbol: symbol, from: ymd(from), to: ymd(to) }), TTL.news).then(function (raw) {
        var arr = (raw && raw.earningsCalendar) || []; var e = arr[0];
        return e ? { date: e.date, epsEstimate: numOrNull(e.epsEstimate) } : null;
      }).catch(function () { return null; });
      return Promise.all([nextP, recentP]).then(function (a) { return { symbol: symbol, next: a[0], recent: a[1], demo: false }; });
    } catch (e) { return Promise.reject(e instanceof Error ? e : new Error(String(e))); }
  }

  function numOrNull(v) { var n = Number(v); return isFinite(n) ? n : null; }

  window.MarketService = {
    setKey: setKey, hasKey: hasKey, isDemo: isDemo, clearCache: clearCache,
    setTdKey: setTdKey, hasTdKey: hasTdKey,
    getQuote: getQuote, getProfile: getProfile, getCandles: getCandles,
    getNews: getNews, searchSymbols: searchSymbols,
    getFxRate: getFxRate, getMetrics: getMetrics, getRecommendation: getRecommendation,
    getPriceTarget: getPriceTarget, getEarnings: getEarnings
  };
})();
