/**
 * gemini-service.js
 * Handles quick capture classification and expansion via Gemini 1.5 Flash.
 * Exposes global: window.GeminiService
 */
(function () {
  'use strict';

  var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  var SUBJECTS_LIST = [
    'WIA&B - Work in Accounting & Bookkeeping Industry',
    'POB - Prepare Operational Budgets',
    'BAS/IAS - BAS/IAS Preparation',
    'FinStmts NRE - Financial Statements for Non-Reporting Entities',
    'Payroll - Payroll Systems',
    'PFR - Prepare Financial Reports',
    'Law - Business Law'
  ];

  function getKey() {
    try { return (localStorage.getItem('__gemini_key__') || '').trim(); } catch (_) { return ''; }
  }

  function extractJson(text) {
    var match = text.trim().match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in Gemini response');
    return JSON.parse(match[0]);
  }

  function callGemini(prompt) {
    var key = getKey();
    if (!key) return Promise.reject(new Error('No Gemini API key set — add it in dashboard settings'));
    return fetch(GEMINI_URL + '?key=' + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
      })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function(e){ throw new Error('Gemini ' + r.status + ': ' + ((e.error&&e.error.message)||r.statusText)); });
      return r.json();
    }).then(function (json) {
      if (!json.candidates || !json.candidates[0]) throw new Error('Empty Gemini response');
      return json.candidates[0].content.parts[0].text;
    });
  }

  /**
   * Classify and expand a raw capture input.
   * Returns Promise<{ type, title, content, formula, example, subject, tags }>
   */
  function classify(rawText) {
    var prompt =
      'You are a personal knowledge assistant for Jayden, an accounting student.\n\n' +
      'Classify and expand this note:\n"' + rawText + '"\n\n' +
      'Rules:\n' +
      '- type: "learning" if it mentions learning, understanding, or studying something specific. "thought" for reflections, feelings, or daily observations. "reflection" for self-assessment or week reviews.\n' +
      '- If type is "learning": write a clear explanation (max 150 words), a formula/steps if applicable, and a concise example (max 80 words).\n' +
      '- If type is "thought" or "reflection": preserve the essence of what was written without adding information they did not state.\n' +
      '- subject: match to one of these if relevant: ' + SUBJECTS_LIST.join(', ') + '. Use "" if not accounting-related.\n' +
      '- tags: 2-5 lowercase keyword tags.\n' +
      '- title: a concise title (for learnings) or leave as short summary (for thoughts).\n\n' +
      'Respond ONLY with a JSON object, no markdown:\n' +
      '{\n' +
      '  "type": "learning|thought|reflection",\n' +
      '  "title": "...",\n' +
      '  "content": "Full explanation or preserved thought",\n' +
      '  "formula": "Formula or step-by-step process (learnings only, else empty string)",\n' +
      '  "example": "Short worked example (learnings only, else empty string)",\n' +
      '  "subject": "Subject abbreviation or empty string",\n' +
      '  "tags": ["tag1", "tag2"]\n' +
      '}';

    return callGemini(prompt).then(function (text) {
      var result = extractJson(text);
      result.rawInput = rawText;
      return result;
    });
  }

  window.GeminiService = { classify: classify };

}());
