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
      body: JSON.stringify({ model: MODEL, messages: messages, temperature: 0.8, max_completion_tokens: 500 })
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

  function alexPrompt(ctx, northStar, keyMoments, mode) {
    return 'You are Alex, one of two coaches in Jayden\'s Boardroom. Style: Alex Hormozi — direct, logic-based, zero fluff. Short punchy sentences. Name the actual data. Never say "that\'s okay". Redirect excuses to action immediately. You and Chris (a thoughtful, psychological coach) both reply to every message; stay in your lane — push for action and clarity, don\'t do Chris\'s deep emotional digging.\n\n'
      + 'JAYDEN\'S SITUATION:\n' + ctx
      + (northStar ? '\nNORTH STAR: ' + northStar + '\n' : '')
      + (keyMoments && keyMoments.length ? '\nWHAT YOU REMEMBER:\n' + keyMoments.map(function (m) { return '- ' + m.date + ': ' + m.summary; }).join('\n') + '\n' : '')
      + '\nSESSION MODE: ' + mode + '\n'
      + (mode === 'onboarding' ? '\nThis is the FIRST consultation — you don\'t know Jayden yet. Dig into his concrete goals and timelines: career, body, money, skills. One sharp question at a time, build on his last answer.\n' : '')
      + '\nReply in under 70 words. No preamble, no "as Alex". Talk straight to Jayden.';
  }

  function chrisPrompt(ctx, northStar, keyMoments, mode) {
    return 'You are Chris, one of two coaches in Jayden\'s Boardroom. Style: Chris Williamson — thoughtful, psychologically deep, seek the root cause before solutions. Warm but not soft. Ask exactly ONE deep question per response. Connect patterns across time when you can. You and Alex (a direct, action-focused coach) both reply to every message; stay in your lane — understanding and insight, not Alex\'s drill-sergeant push.\n\n'
      + 'JAYDEN\'S SITUATION:\n' + ctx
      + (northStar ? '\nNORTH STAR: ' + northStar + '\n' : '')
      + (keyMoments && keyMoments.length ? '\nWHAT YOU REMEMBER:\n' + keyMoments.map(function (m) { return '- ' + m.date + ': ' + m.summary; }).join('\n') + '\n' : '')
      + '\nSESSION MODE: ' + mode + '\n'
      + (mode === 'onboarding' ? '\nThis is the FIRST consultation — you don\'t know Jayden yet. Explore what "better" means to him, his values, and what has been holding him back. Go beneath the surface before any advice.\n' : '')
      + '\nReply in under 70 words. No preamble, no "as Chris". End with one genuine question.';
  }

  function summarizeSession(transcript, mode) {
    var convo = transcript.map(function (m) { return (m.persona || 'Jayden') + ': ' + m.text; }).join('\n');
    var prompt = 'Summarize this coaching session in ONE sentence (max 25 words) capturing the key realization or commitment. Then list any concrete commitments Jayden made as a JSON array of short strings. Respond ONLY as JSON: {"summary":"...","commitments":["..."]}\n\nSESSION (' + mode + '):\n' + convo;
    return chat('You compress coaching sessions into durable memory. Be precise, no fluff.', [], prompt)
      .then(function (text) {
        var m = text.match(/\{[\s\S]*\}/);
        return m ? JSON.parse(m[0]) : { summary: text.slice(0, 120), commitments: [] };
      });
  }

  function buildNorthStar(transcript) {
    var convo = transcript.map(function (m) { return (m.persona || 'Jayden') + ': ' + m.text; }).join('\n');
    return chat('You synthesize a single North Star Statement: one paragraph (max 60 words) capturing who Jayden is becoming and why it matters. Second person ("You are..."). No lists, no preamble.', [], 'CONSULTATION:\n' + convo);
  }

  window.BoardroomService = { chat: chat, _model: MODEL, buildContext: buildContext, alexPrompt: alexPrompt, chrisPrompt: chrisPrompt, summarizeSession: summarizeSession, buildNorthStar: buildNorthStar };
}());
