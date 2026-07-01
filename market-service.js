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

  function fetchJson(url, ttl) {
    var cached = cacheGet(url);
    if (cached !== undefined) return Promise.resolve(cached);
    if (inflight.has(url)) return inflight.get(url);

    var p = fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
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
      return fetchJson(buildUrl('/quote', { symbol: symbol }), TTL.quote).then(function (raw) {
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

  function getCandles(symbol, resolution, from, to) {
    try {
      symbol = String(symbol || '').trim().toUpperCase();
      if (!symbol) return Promise.reject(new Error('getCandles: symbol is required.'));
      resolution = resolution || 'D';
      if (isDemo()) return Promise.resolve(demoCandles(symbol, resolution, from, to));

      var nowSec = Math.floor(Date.now() / 1000);
      var fromSec = isFinite(from) && from > 0 ? Math.floor(from) : nowSec - 90 * 86400;
      var toSec = isFinite(to) && to > 0 ? Math.floor(to) : nowSec;

      return fetchJson(buildUrl('/stock/candle', { symbol: symbol, resolution: resolution, from: fromSec, to: toSec }), TTL.candles)
        .then(function (raw) { return normalizeCandles(symbol, resolution, raw); })
        .catch(function (err) {
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

  window.MarketService = {
    setKey: setKey, hasKey: hasKey, isDemo: isDemo, clearCache: clearCache,
    getQuote: getQuote, getProfile: getProfile, getCandles: getCandles,
    getNews: getNews, searchSymbols: searchSymbols
  };
})();
