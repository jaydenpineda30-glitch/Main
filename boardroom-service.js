/**
 * boardroom-service.js
 * Boardroom AI coaching via Groq (Llama 3.3 70B).
 * Two personas (Alex, Chris) respond to every user turn.
 * Exposes global: window.BoardroomService
 */
(function () {
  'use strict';

  var GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
  var MODEL    = 'llama-3.3-70b-versatile';

  function getKey() {
    try { return (localStorage.getItem('__groq_key__') || '').trim(); } catch (_) { return ''; }
  }

  /**
   * Low-level chat call.
   * @param {string} systemPrompt
   * @param {Array<{role,content}>} history  prior turns (role: 'user'|'assistant')
   * @param {string} userText  the new user message
   * @returns {Promise<string>}
   */
  function chat(systemPrompt, history, userText) {
    var key = getKey();
    if (!key) return Promise.reject(new Error('No Groq API key set — add it in Settings'));
    var messages = [{ role: 'system', content: systemPrompt }]
      .concat(history || [])
      .concat([{ role: 'user', content: userText }]);
    return fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: MODEL, messages: messages, temperature: 0.8, max_tokens: 500 })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (e) {
        throw new Error('Groq ' + r.status + ': ' + ((e.error && e.error.message) || r.statusText));
      });
      return r.json();
    }).then(function (json) {
      if (!json.choices || !json.choices[0]) throw new Error('Empty Groq response');
      return json.choices[0].message.content.trim();
    });
  }

  window.BoardroomService = { chat: chat, _model: MODEL };
}());
