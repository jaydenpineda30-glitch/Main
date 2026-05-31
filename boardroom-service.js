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
      if (!r.ok) {
        var status = r.status, statusText = r.statusText;
        return r.json().then(function (e) {
          throw new Error('Groq ' + status + ': ' + ((e.error && e.error.message) || statusText));
        }, function () {
          throw new Error('Groq ' + status + ': ' + statusText);
        });
      }
      return r.json();
    }).then(function (json) {
      if (!json.choices || !json.choices[0]) throw new Error('Empty Groq response');
      return json.choices[0].message.content.trim();
    });
  }

  /**
   * Build the live situational context string from dashData.
   * @param {object} d        dashData
   * @param {object} helpers  { todayStr, dStr, daysBetween, isGoTabEvent, thisWeek, cachedEvs }
   */
  function buildContext(d, helpers) {
    var td = helpers.todayStr();
    var ev = helpers.cachedEvs || [];
    var yday = new Date(); yday.setDate(yday.getDate() - 1); var ydayStr = helpers.dStr(yday);
    var todayEvs = ev.filter(function (e) { return e.date === td && !e.allDay; });
    var workingToday = todayEvs.some(helpers.isGoTabEvent);
    var workedYesterday = ev.some(function (e) { return e.date === ydayStr && helpers.isGoTabEvent(e); });

    var tasks = (d.personal && d.personal.tasks) || [];
    var overdue = tasks.filter(function (t) { return !t.done && t.due && t.due < td; });
    var in7 = new Date(); in7.setDate(in7.getDate() + 7); var in7Str = helpers.dStr(in7);
    var upcomingA = ((d.uni && d.uni.assessments) || [])
      .filter(function (a) { return !a.done && a.date >= td && a.date <= in7Str; })
      .sort(function (a, b) { return a.date.localeCompare(b.date); });

    var gymRot = (d.gym && d.gym.rotation) || [];
    var nextGym = gymRot.length ? gymRot[((d.gym && d.gym.rotIdx) || 0) % gymRot.length] : null;
    var workouts = (d.gym && d.gym.workouts) || [];
    var lastWkt = workouts.length ? workouts[workouts.length - 1] : null;
    var daysSinceGym = lastWkt ? Math.abs(helpers.daysBetween(lastWkt.date)) : null;
    var bwThisWeek = !!(d.gym && d.gym.lastBWWeek === helpers.thisWeek);

    var recentRefls = (d.reflections || []).slice(-2).reverse();
    var lastRefl = recentRefls[0] || null;
    var an = (lastRefl && lastRefl.analysis) || {};

    var c = 'WHO: Jayden — TAFE Melbourne accounting student.\n';
    if (workedYesterday) c += 'WORK: GoTab shift yesterday — energy may be lower today.\n';
    if (workingToday)    c += 'WORK: GoTab shift today.\n';
    c += 'CALENDAR TODAY: ' + (todayEvs.length ? todayEvs.map(function (e) { return e.title + (e.time ? ' @ ' + e.time : ''); }).join('; ') : 'nothing scheduled') + '\n';
    if (upcomingA.length) c += 'ASSESSMENTS DUE SOON: ' + upcomingA.map(function (a) { return a.subject + ' ' + a.name + ' in ' + helpers.daysBetween(a.date) + 'd'; }).join('; ') + '\n';
    if (overdue.length)   c += 'OVERDUE TASKS: ' + overdue.map(function (t) { return t.name; }).join(', ') + '\n';
    if (nextGym)          c += 'GYM: next ' + nextGym.name + (daysSinceGym != null ? ' (' + daysSinceGym + 'd since last)' : '') + '\n';
    if (!bwThisWeek)      c += 'GYM: body weight not logged this week.\n';
    if (lastRefl && an.dominantPattern) {
      c += 'LAST REFLECTION PATTERN: ' + an.dominantPattern + (an.recommendation ? ' — rec: ' + an.recommendation : '') + '\n';
    }
    return c;
  }

  window.BoardroomService = { chat: chat, _model: MODEL, buildContext: buildContext };
}());
