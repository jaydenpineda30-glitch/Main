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
      generate: function (prompt, opts) {
        opts = opts || {};
        var key = (localStorage.getItem('__gemini_key__') || '').trim();
        var gen = { temperature: 0.4, maxOutputTokens: opts.maxTokens || 400 };
        if (opts.json !== false) gen.responseMimeType = 'application/json';
        return fetch(GEMINI_URL + '?key=' + key, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: gen
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

  function route(prompt, opts, i) {
    i = i || 0;
    if (i >= providers.length) return Promise.resolve(null);
    var p = providers[i];
    if (!p.available()) return route(prompt, opts, i + 1);
    return p.generate(prompt, opts).catch(function (e) {
      if (window.ErrorHandler && ErrorHandler.warn) ErrorHandler.warn('Jarvis ' + p.name + ' failed: ' + e.message, 'jarvis-service');
      else console.warn('[Jarvis]', p.name, 'failed:', e.message);
      return route(prompt, opts, i + 1);
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
    return route(prompt, { json: true }).then(function (text) {
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

  /**
   * Conversational reply grounded in the briefing context.
   * context: compact pre-digested facts object built by the app (never raw dashData).
   * history: [{role:'user'|'jarvis', text}] — recent turns only (caller slices).
   * Resolves to a plain-text reply, or null when no provider is available/working.
   */
  function chat(question, context, history) {
    var convo = (history || []).slice(-8).map(function (m) {
      return (m.role === 'user' ? 'User: ' : 'Jarvis: ') + m.text;
    }).join('\n');
    var prompt =
      'You are Jarvis, Ashley’s calm personal chief-of-staff inside her life dashboard (Athena). ' +
      'Answer from the CONTEXT facts below — they are her real, current data. Be specific with numbers and dates. ' +
      'If the context doesn’t contain what’s needed, say so briefly rather than guessing. ' +
      'No exclamation marks, no emoji, no flattery. Max 100 words, plain text only.\n\n' +
      'CONTEXT (JSON):\n' + JSON.stringify(context) + '\n\n' +
      (convo ? 'RECENT CONVERSATION:\n' + convo + '\n\n' : '') +
      'User: ' + question + '\nJarvis:';
    return route(prompt, { json: false, maxTokens: 300 }).then(function (text) {
      if (!text || typeof text !== 'string') return null;
      var t = text.trim();
      if (!t || t.length > 1200) return null;
      return t;
    });
  }

  /**
   * Morning brief: 2–3 sentences over the whole day's context.
   * Resolves to plain text or null — the app shows no brief card on null
   * (the signal cards already carry the facts; a templated brief would
   * just repeat them).
   */
  function brief(context) {
    var prompt =
      'You are Jarvis, Ashley’s calm personal chief-of-staff. Compose her morning brief from the ' +
      'CONTEXT below: 2–3 sentences, max 60 words, most important thing first, specific numbers and ' +
      'dates, no exclamation marks, no emoji. Start with “Morning —”. Plain text only.\n\n' +
      'CONTEXT (JSON):\n' + JSON.stringify(context);
    return route(prompt, { json: false, maxTokens: 200 }).then(function (text) {
      if (!text || typeof text !== 'string') return null;
      var t = text.trim();
      if (!t || t.length > 500) return null;
      return t;
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

  window.JarvisService = { phrase: phrase, chat: chat, brief: brief, getCached: getCached, setCached: setCached, _providers: providers };

}());
