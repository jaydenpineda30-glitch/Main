/**
 * ollama-service.js
 * Standalone service for Ollama local LLM integration.
 * No external dependencies.
 * Exposes global: window.OllamaService
 */
(function () {
  'use strict';

  var DEFAULT_MODEL = 'llama2';
  var DEFAULT_URL   = 'http://localhost:11434/api/generate';

  // ── Helpers ────────────────────────────────────────────────────────────────

  function extractJson(text) {
    var match = text.trim().match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in Ollama response');
    return JSON.parse(match[0]);
  }

  function scoreAnalysis(ai) {
    var patterns = ai.detectedPatterns || [];
    var score = patterns.indexOf('burnout_risk')  !== -1 ? -0.5
              : patterns.indexOf('growth_mindset') !== -1 ?  0.3
              : 0;
    ai.sentimentScore = score;
    ai.sentColor  = score >=  0.1 ? '#69f0ae' : score <= -0.1 ? '#ff6b6b' : '#ffd166';
    ai.sentBg     = score >=  0.1 ? 'rgba(105,240,174,0.06)' : score <= -0.1 ? 'rgba(255,107,107,0.06)' : 'rgba(255,209,102,0.06)';
    ai.sentBorder = score >=  0.1 ? 'rgba(105,240,174,0.25)' : score <= -0.1 ? 'rgba(255,107,107,0.25)' : 'rgba(255,209,102,0.25)';
    return ai;
  }

  // ── OllamaService ──────────────────────────────────────────────────────────

  var OllamaService = {

    model: DEFAULT_MODEL,
    url:   DEFAULT_URL,

    /**
     * Test whether Ollama is reachable.
     * Returns Promise<{ ok: boolean, detail: string }>
     */
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
        .catch(function (e) {
          return { ok: false, detail: 'Ollama not running. Start with: ollama serve' };
        });
    },

    /**
     * Generate a daily check-in message based on today's data.
     *
     * @param {object} todayData  — shape:
     *   {
     *     schedule:    string   // today's uni/work schedule summary
     *     assessments: string   // upcoming assessments summary
     *     tasks:       string   // pending tasks summary
     *     gym:         string   // next gym session summary
     *   }
     * Returns Promise<Array<{ header: string, items: string[] }>>
     */
    generateCheckIn: function (todayData) {
      var self = this;
      var data = todayData || {};
      var prompt =
        'You are a supportive coach helping Jayden start their day.\n\n' +
        'TODAY\'S CONTEXT:\n' +
        'Uni/Work: '           + (data.schedule    || 'No schedule today')     + '\n' +
        'Upcoming assessments: ' + (data.assessments || 'None coming up')        + '\n' +
        'Pending tasks: '      + (data.tasks       || 'No pending tasks')      + '\n' +
        'Gym: '                + (data.gym         || 'No gym session planned') + '\n\n' +
        'Write a brief, warm check-in. Exactly 3 short lines:\n' +
        'Line 1: Acknowledge the day ahead\n' +
        'Line 2: One specific realistic suggestion\n' +
        'Line 3: One reflection question based on what they\'re facing\n\n' +
        'Under 60 words total. Warm but not cheesy. Plain lines, no bullets or numbering.';

      return fetch(self.url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ model: self.model, prompt: prompt, stream: false, temperature: 0.7 })
      })
        .then(function (r) {
          if (!r.ok) throw new Error('Ollama not available');
          return r.json();
        })
        .then(function (json) {
          var lines = json.response.trim()
            .split('\n')
            .map(function (l) { return l.replace(/^[\d.\-*]+\s*/, '').trim(); })
            .filter(function (l) { return l.length > 0; });
          if (lines.length === 0) throw new Error('Empty response');
          var blocks = [];
          if (lines[0]) blocks.push({ header: '📅 Your Day Ahead', items: [lines[0]] });
          if (lines[1]) blocks.push({ header: '💡 Suggestion',    items: [lines[1]] });
          if (lines[2]) blocks.push({ header: '❓ Check-in',       items: [lines[2]] });
          return blocks;
        })
        .catch(function (e) {
          if (window.ErrorHandler) ErrorHandler.warn('OllamaService.generateCheckIn: ' + e.message, 'ollama-service');
          return null; // caller should fall back to local logic
        });
    },

    /**
     * Analyse weekly reflection answers and return AI insights.
     *
     * @param {Array}  reflectionAnswers  — array of { q: string, a: string }
     * @param {Array}  history            — optional array of past reflection snapshots
     * Returns Promise<object | null>  (null = Ollama unavailable, use fallback)
     *
     * Returned object shape:
     * {
     *   emotionalState, dominantPattern, rootIssue, insight,
     *   recommendation, patternHistory, detectedPatterns,
     *   sentimentScore, sentColor, sentBg, sentBorder
     * }
     */
    analyzeReflection: function (reflectionAnswers, history) {
      var self = this;
      var answers = reflectionAnswers || [];

      var LABELS = ['Challenges', 'Work', 'Health', 'Balance', 'Growth'];
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

      return fetch(self.url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ model: self.model, prompt: prompt, stream: false, temperature: 0.7 })
      })
        .then(function (r) {
          if (!r.ok) throw new Error('Ollama not available');
          return r.json();
        })
        .then(function (json) {
          var ai = extractJson(json.response);
          return scoreAnalysis(ai);
        })
        .catch(function (e) {
          if (window.ErrorHandler) ErrorHandler.warn('OllamaService.analyzeReflection: ' + e.message, 'ollama-service');
          return null; // caller should fall back to local logic
        });
    }
  };

  window.OllamaService = OllamaService;

})();
