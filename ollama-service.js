/**
 * ollama-service.js
 * AI routing for check-ins and reflection analysis.
 * Priority: Gemini (if key stored) → Ollama (if running locally) → null (caller uses fallback)
 * No external dependencies.
 * Exposes global: window.OllamaService
 */
(function () {
  'use strict';

  var DEFAULT_MODEL = 'llama2';
  var DEFAULT_URL   = 'http://localhost:11434/api/generate';
  var GEMINI_URL    = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getGeminiKey() {
    try { return (localStorage.getItem('__gemini_key__') || '').trim(); } catch (_) { return ''; }
  }

  function extractJson(text) {
    var match = text.trim().match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in response');
    return JSON.parse(match[0]);
  }

  function scoreAnalysis(ai) {
    var patterns = ai.detectedPatterns || [];
    var score = patterns.indexOf('burnout_risk')   !== -1 ? -0.5
              : patterns.indexOf('growth_mindset') !== -1 ?  0.3
              : 0;
    ai.sentimentScore = score;
    ai.sentColor  = score >=  0.1 ? '#69f0ae' : score <= -0.1 ? '#ff6b6b' : '#ffd166';
    ai.sentBg     = score >=  0.1 ? 'rgba(105,240,174,0.06)'  : score <= -0.1 ? 'rgba(255,107,107,0.06)'  : 'rgba(255,209,102,0.06)';
    ai.sentBorder = score >=  0.1 ? 'rgba(105,240,174,0.25)'  : score <= -0.1 ? 'rgba(255,107,107,0.25)'  : 'rgba(255,209,102,0.25)';
    return ai;
  }

  // ── Gemini calls ───────────────────────────────────────────────────────────

  function geminiGenerate(prompt) {
    var key = getGeminiKey();
    if (!key) return Promise.reject(new Error('No Gemini key'));
    return fetch(GEMINI_URL + '?key=' + key, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    }).then(function (r) {
      if (!r.ok) throw new Error('Gemini HTTP ' + r.status);
      return r.json();
    }).then(function (json) {
      return json.candidates[0].content.parts[0].text;
    });
  }

  // ── Ollama calls ───────────────────────────────────────────────────────────

  function ollamaGenerate(prompt) {
    return fetch(DEFAULT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ model: DEFAULT_MODEL, prompt: prompt, stream: false, temperature: 0.7 })
    }).then(function (r) {
      if (!r.ok) throw new Error('Ollama HTTP ' + r.status);
      return r.json();
    }).then(function (json) {
      return json.response;
    });
  }

  // Try Gemini; resolve null if it fails (Ollama removed — Gemini is primary)
  function generate(prompt) {
    return geminiGenerate(prompt).catch(function (e) {
      if (window.ErrorHandler) ErrorHandler.warn('AI unavailable: ' + e.message, 'ollama-service');
      return null;
    });
  }

  // ── Build check-in context from full app data object ──────────────────────

  function buildCheckinContext(data) {
    var cachedEvs = [];
    try { var ce = localStorage.getItem('__gcal_events__'); if (ce) cachedEvs = JSON.parse(ce); } catch (_) {}

    var todayStr = (function () {
      var d = new Date();
      return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    }());

    var tToday = cachedEvs.filter(function (ev) { return ev.date === todayStr && !ev.allDay; });
    var tasks  = (data.personal && data.personal.tasks) || [];
    var overdue = tasks.filter(function (t) { return !t.done && t.due && t.due < todayStr; });
    var gymRot  = (data.gym && data.gym.rotation) || [];
    var rotLen  = gymRot.length > 0 ? gymRot.length : 1;
    var nextSess = gymRot.length > 0 ? gymRot[((data.gym && data.gym.rotIdx) || 0) % rotLen] : null;

    return {
      schedule: tToday.length > 0
        ? tToday.map(function (ev) {
            var s = ev.title + (ev.time ? ' ' + ev.time : '');
            if (ev.description) s += ' [' + ev.description.slice(0, 80) + ']';
            return s;
          }).join('\n')
        : 'No events found',
      tasks: tasks.filter(function (t) { return !t.done; }).slice(0, 5)
        .map(function (t) { return t.name + (overdue.indexOf(t) !== -1 ? ' (OVERDUE)' : ''); })
        .join(', ') || 'No pending tasks',
      gym: nextSess
        ? 'Next gym session: ' + nextSess.name + (nextSess.focus ? ' (' + nextSess.focus + ')' : '')
        : 'No gym rotation set'
    };
  }

  // ── OllamaService ──────────────────────────────────────────────────────────

  var OllamaService = {

    model: DEFAULT_MODEL,
    url:   DEFAULT_URL,

    /** Test whether Ollama is reachable. Returns Promise<{ ok, detail }>. */
    checkHealth: function () {
      return fetch('http://localhost:11434/api/tags', { method: 'GET' })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (json) {
          var models = (json.models || []).map(function (m) { return m.name; });
          return { ok: true, detail: 'Ollama online. Models: ' + (models.join(', ') || 'none') };
        })
        .catch(function () {
          return { ok: false, detail: 'Ollama not running. Start with: ollama serve' };
        });
    },

    /**
     * Generate a daily check-in.
     * Accepts either:
     *   - the full app data object (has .personal and .gym)
     *   - a pre-built context object { schedule, tasks, gym }
     * Returns Promise<Array<{ header, items }>> or null on total failure.
     */
    generateCheckIn: function (dataOrContext) {
      var ctx = (dataOrContext && dataOrContext.personal)
        ? buildCheckinContext(dataOrContext)
        : (dataOrContext || {});

      var prompt =
        'You are a supportive coach helping Jayden start their day.\n\n' +
        'TODAY\'S CONTEXT:\n' +
        'Calendar: '   + (ctx.schedule || 'No schedule today')     + '\n' +
        'Pending tasks: ' + (ctx.tasks || 'No pending tasks')      + '\n' +
        'Gym: '        + (ctx.gym     || 'No gym session planned') + '\n\n' +
        'Write a brief, warm check-in. Exactly 3 short lines:\n' +
        'Line 1: Acknowledge the day ahead\n' +
        'Line 2: One specific realistic suggestion\n' +
        'Line 3: One reflection question based on what they\'re facing\n\n' +
        'Under 60 words total. Warm but not cheesy. Plain lines, no bullets or numbering.';

      return generate(prompt).then(function (text) {
        if (!text) return null;
        var lines = text.trim()
          .split('\n')
          .map(function (l) { return l.replace(/^[\d.\-*]+\s*/, '').trim(); })
          .filter(function (l) { return l.length > 0; });
        if (lines.length === 0) return null;
        var blocks = [];
        if (lines[0]) blocks.push({ header: '📅 Your Day Ahead', items: [lines[0]] });
        if (lines[1]) blocks.push({ header: '💡 Suggestion',    items: [lines[1]] });
        if (lines[2]) blocks.push({ header: '❓ Check-in',       items: [lines[2]] });
        return blocks.length > 0 ? blocks : null;
      });
    },

    /**
     * Analyse weekly reflection answers.
     * @param {Array}  reflectionAnswers  — [{ q, a }]
     * @param {Array}  history            — past reflection snapshots
     * Returns Promise<object|null>  (null = both AI providers failed, caller uses fallback)
     */
    analyzeReflection: function (reflectionAnswers, history) {
      var answers = reflectionAnswers || [];
      var LABELS  = ['Academic', 'Work', 'Health', 'Balance', 'Growth & Wins'];

      var reflText = answers.map(function (qa, i) {
        return 'Q' + (i + 1) + ' (' + (LABELS[i] || 'Q' + (i + 1)) + '):\n' + qa.q + '\nA: ' + qa.a;
      }).join('\n\n');

      var histCtx = '';
      if (history && history.length > 0) {
        histCtx = '\n\nREFLECTION HISTORY (last ' + Math.min(4, history.length) + ' weeks):\n' +
          history.slice(-4).map(function (r) {
            return '- ' + ((r.analysis && r.analysis.emotionalState) || 'no analysis') +
              ': "' + ((r.answers[0] && (r.answers[0].answer || r.answers[0].a)) || '').slice(0, 80) + '..."';
          }).join('\n');
      }

      var prompt =
        'You are a psychological analyst providing deep, personalized feedback on weekly reflections.\n\n' +
        'Read these reflection answers and provide genuine insights specific to what was written ' +
        '(NOT generic — make them specific to their actual words):\n\n' +
        reflText + histCtx + '\n\n' +
        'Respond with ONLY a JSON object — no markdown, no explanation:\n' +
        '{\n' +
        '  "emotionalState": "One phrase capturing their overall emotional state (specific to their words)",\n' +
        '  "dominantPattern": "One phrase describing the main psychological pattern detected",\n' +
        '  "rootIssue": "What is actually causing friction, specific to their answers",\n' +
        '  "insight": "2-3 sentences of genuine insight about their mindset and patterns, specific to what they wrote",\n' +
        '  "recommendation": "1-2 sentences of actionable advice specific to their situation this week",\n' +
        '  "patternHistory": "Note any patterns across multiple weeks if history provided, otherwise note this is early data",\n' +
        '  "detectedPatterns": ["array","of","pattern","tags"]\n' +
        '}';

      return generate(prompt).then(function (text) {
        if (!text) return null;
        var ai = extractJson(text);
        return scoreAnalysis(ai);
      });
    }
  };

  window.OllamaService = OllamaService;

}());
