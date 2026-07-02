/**
 * jarvis-service.js
 * LLM phrasing layer for the Jarvis prioritizer brain. Deterministic rules in
 * app.jsx produce candidate signals with render-ready `template` sentences;
 * this service optionally rephrases the top few in a consistent voice.
 *
 * Provider-agnostic by design: providers are tried in order and any failure
 * falls through to the next, ending in null (caller keeps the templates).
 * Adding Claude later = providers.unshift({name:'claude', available, generate})
 * with the same interface — nothing else changes.
 *
 * Exposes global: window.JarvisService
 */
(function () {
  'use strict';

  var CACHE_KEY = '__jarvis_briefing__'; // {date, fingerprint, cards:[{id,text}]}
  var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  var providers = [
    {
      name: 'gemini',
      available: function () {
        try { return !!(localStorage.getItem('__gemini_key__') || '').trim(); } catch (_) { return false; }
      },
      generate: function (prompt) {
        var key = (localStorage.getItem('__gemini_key__') || '').trim();
        return fetch(GEMINI_URL + '?key=' + key, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 400, responseMimeType: 'application/json' }
          })
        }).then(function (r) {
          if (!r.ok) return r.json().then(function (e) { throw new Error('Gemini ' + r.status + ': ' + ((e.error && e.error.message) || r.statusText)); });
          return r.json();
        }).then(function (json) {
          if (!json.candidates || !json.candidates[0]) throw new Error('Empty Gemini response');
          return json.candidates[0].content.parts[0].text;
        });
      }
    }
  ];

  function route(prompt, i) {
    i = i || 0;
    if (i >= providers.length) return Promise.resolve(null);
    var p = providers[i];
    if (!p.available()) return route(prompt, i + 1);
    return p.generate(prompt).catch(function (e) {
      if (window.ErrorHandler && ErrorHandler.warn) ErrorHandler.warn('Jarvis ' + p.name + ' failed: ' + e.message, 'jarvis-service');
      else console.warn('[Jarvis]', p.name, 'failed:', e.message);
      return route(prompt, i + 1);
    });
  }

  /**
   * Rephrase the top signals in a consistent voice.
   * Only pre-digested facts are sent — never raw dashData.
   * Resolves to [{id, text}] or null (→ caller renders templates).
   */
  function phrase(signals) {
    var payload = (signals || []).slice(0, 5).map(function (s) {
      return { id: s.id, domain: s.domain, facts: s.facts, template: s.template };
    });
    if (!payload.length) return Promise.resolve(null);
    var prompt =
      'You are Jarvis, a calm personal chief-of-staff. Rephrase each briefing item below into ONE ' +
      'sentence, max 20 words, keep the specific numbers, no exclamation marks, no advice unless the ' +
      'numbers are bad.\n' +
      'Respond ONLY with a JSON array, no markdown: [{"id":"...","text":"..."}]\n\n' +
      JSON.stringify(payload);
    return route(prompt).then(function (text) {
      if (!text) return null;
      var arr;
      try { arr = JSON.parse((text.match(/\[[\s\S]*\]/) || [text])[0]); } catch (_) { return null; }
      var ids = {};
      (signals || []).forEach(function (s) { ids[s.id] = true; });
      // Trust boundary: only known ids, strings only, length-capped — garbage can never render.
      var out = (arr || []).filter(function (c) {
        return c && ids[c.id] && typeof c.text === 'string' && c.text.length > 0 && c.text.length < 160;
      }).map(function (c) { return { id: c.id, text: c.text }; });
      return out.length ? out : null;
    });
  }

  function getCached(fingerprint) {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      return (c && c.fingerprint === fingerprint && c.date === new Date().toISOString().slice(0, 10)) ? c.cards : null;
    } catch (_) { return null; }
  }

  function setCached(fingerprint, cards) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ date: new Date().toISOString().slice(0, 10), fingerprint: fingerprint, cards: cards }));
    } catch (_) {}
  }

  window.JarvisService = { phrase: phrase, getCached: getCached, setCached: setCached, _providers: providers };

}());
