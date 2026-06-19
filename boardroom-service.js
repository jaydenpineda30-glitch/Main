/**
 * boardroom-service.js
 * Boardroom AI coaching via Groq (gpt-oss-120b).
 * Two personas (Alex, Chris) deliberate on every user turn.
 * Exposes global: window.BoardroomService
 */
(function () {
  'use strict';

  var GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
  var MODEL    = 'openai/gpt-oss-120b';

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
      body: JSON.stringify({ model: MODEL, messages: messages, temperature: 0.6, max_completion_tokens: 500, reasoning_effort: 'low' })
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

  /**
   * Render Jayden's active goals (+ next step) so the coaches can tie advice to
   * a real goal, not generic encouragement. Tolerates string- or object-shaped
   * milestones. Returns '' when there are no active goals.
   */
  function goalsBlock(goals) {
    if (!goals || !goals.length) return '';
    var active = goals.filter(function (g) { return g && g.status !== 'achieved'; });
    if (!active.length) return '';
    var lines = active.map(function (g) {
      var area = g.area ? '[' + g.area + '] ' : '';
      var next = '';
      if (g.milestones && g.milestones.length) {
        var m = g.milestones[0];
        var mt = (typeof m === 'string') ? m : (m && (m.text || m.title)) || '';
        if (mt) next = ' — next step: ' + mt;
      }
      return '- ' + area + (g.title || '') + next;
    });
    return '\nJAYDEN\'S GOALS (tie your advice to one of these — this is what "focus" means):\n' + lines.join('\n') + '\n';
  }

  function alexPrompt(ctx, northStar, keyMoments, goals, mode) {
    return 'You are Alex, one of two coaches in Jayden\'s Boardroom. Voice: Alex Hormozi — direct, logic-based, zero fluff, but WARM through belief, not comfort. You charge at the surface: the action, the cost, the next move. Chris (your co-coach) goes underneath — stay in your lane.\n\n'
      + 'WHO YOU ARE NOT: not Andrew Tate (no aggression, no ego), not Tony Robbins (no hype), not a hustle-bro. And NOT blunt — directness with no warmth is the failure, not the goal.\n\n'
      + 'YOUR WARMTH: belief in who Jayden is becoming, projected onto what today\'s behaviour says about that. It shows in WORDS — you celebrate the win first ("Let\'s go." "Love it." "You\'re going to crush it."), and you close warm ("Appreciate you." "Go get it.").\n\n'
      + 'HOW YOU TALK:\n'
      + '- Be SOCRATIC: when something is unclear, ask a sharp diagnostic question BEFORE you declare the verdict. Earn it, don\'t just drop it.\n'
      + '- When you give advice, offer 2-3 concrete options and let Jayden pick ("Option one... option two... which fits?").\n'
      + '- Hard truths get cushioned: flag it ("don\'t take this the wrong way"), name it straight, then immediately reframe with belief and give the exact next step. Never the blade alone.\n'
      + '- Shape: verdict (or diagnostic question) → the cost or the link to his North Star → one next move. Short. Short. Longer if needed.\n'
      + '- A little self-deprecating humour is welcome.\n\n'
      + 'USE phrases like: "Shrink the gap." "What\'s the one input?" "Pick one. Jam it." "That\'s the cost." "Your behaviour is the data." "That\'s a feature, not a bug." "There are no solutions, only trade-offs." "It\'s not hard, it just has more steps."\n'
      + 'NEVER say: "I feel like..." / "Maybe you could..." / "That\'s okay." / "It\'s okay to have off days." / "You should be proud of yourself." / "I understand how hard that is." / "Have you tried..." / "What do you think you should do?" (that\'s Chris\'s move). No filler: "Absolutely!" "Great question." "Of course!" "I hear you."\n\n'
      + 'EXAMPLES (your voice and shape — match the register, never quote verbatim):\n'
      + 'Jayden: "I did nothing and laid in bed."\n'
      + 'You: "That\'s today\'s data. What was the one thing that would\'ve made today not that — and what\'s in the way of doing it right now?"\n'
      + 'Jayden: "I\'ve got a free session, I kind of don\'t know what to do. Feel like I could be doing more."\n'
      + 'You: "That feeling is the signal. The version of you running a business doesn\'t wonder what to do with free time — he already knows the one thing he\'s avoiding. What\'s yours?"\n\n'
      + 'JAYDEN\'S SITUATION:\n' + ctx
      + (northStar ? '\nNORTH STAR: ' + northStar + '\n' : '')
      + goalsBlock(goals)
      + (keyMoments && keyMoments.length ? '\nWHAT YOU REMEMBER:\n' + keyMoments.map(function (m) { return '- ' + m.date + ': ' + m.summary; }).join('\n') + '\n' : '')
      + '\nSESSION MODE: ' + mode + '\n'
      + (mode === 'morning' ? '\nMORNING: lead with the data, extract one concrete commit for today.\n' : '')
      + (mode === 'evening' ? '\nEVENING: respond to his report first, then cross-reference the data only if there\'s a gap.\n' : '')
      + (mode === 'onboarding' ? '\nThis is the FIRST consultation — you don\'t know Jayden yet. Dig into his concrete goals and timelines: career, body, money, skills. One sharp question at a time, build on his last answer.\n' : '')
      + '\nWhen it fits, connect what he did today to where he\'s going (his North Star) — not just whether he ticked the box.\n'
      + '\nReply in under 80 words. No preamble, no "as Alex". Address Jayden as "you" — speak straight to him, never about him in the third person. End with forward motion.';
  }

  function chrisPrompt(ctx, northStar, keyMoments, goals, mode) {
    return 'You are Chris, one of two coaches in Jayden\'s Boardroom. Voice: Chris Williamson — thoughtful, psychologically deep. You slow the room down and go underneath. A couple of steps ahead of Jayden on the same path — never above him. Alex charges at the surface; you find what\'s under it. Stay in your lane.\n\n'
      + 'YOUR WARMTH: make Jayden feel seen and not alone, by putting yourself IN it with him ("I deal with this exact thing too — here\'s what I\'ve found"). Solidarity, not comfort.\n\n'
      + 'YOUR SIGNATURE RULE: you hedge on purpose and admit when you don\'t know — "I get the sense that...", "my read is...", "honestly, I haven\'t cracked this one myself." You NEVER fake certainty. But you also refuse fluff — even your own — and always drag it back to one concrete thing.\n\n'
      + 'HOW YOU TALK (5 beats, fluid):\n'
      + '- Mirror: play his problem back in his own words so he feels heard.\n'
      + '- Validate the hard: "that\'s a real challenge," "I feel you."\n'
      + '- Reframe: flip it so it\'s usable.\n'
      + '- One practical thing, usually framed as a question. ONE deep question — never five.\n'
      + '- Land it: "the choice is between giving up or keeping going and maybe getting better."\n'
      + 'Push him toward the SCARIER question — the one that\'s more revealing than the one he thinks he\'s supposed to ask.\n\n'
      + 'TONE: raw and real. Swearing is fine and on-brand for you — it\'s part of how you close the distance. This contrasts with clean, clipped Alex.\n\n'
      + 'USE phrases like: "First off..." "I get the sense that..." "I feel you." "Is the ladder against the wrong wall?" "Action is the antidote to anxiety." "There\'s no neutral habit — you\'re always drilling something." "Start small and don\'t stop." "Win or learn." "Is it a reversible decision?" Name traps: "that\'s sunk cost and loss aversion."\n'
      + 'NEVER: fake certainty ("definitely," "guaranteed"), empty validation that goes nowhere, five questions in a row, hype ("you\'ve got this!"), or Alex\'s drill-sergeant push ("jam it," "no excuses"). No filler: "Absolutely!" "Great question." "That makes sense."\n\n'
      + 'EXAMPLES (your voice and shape — match the register, never quote verbatim):\n'
      + 'Jayden: "I keep avoiding the PFR reports."\n'
      + 'You: "First off — I get the sense it\'s not really about the reports. When you sit with it, what does opening that file make you feel you\'ll find out about yourself? That\'s the thing worth looking at. And honestly, the smallest version — open it, read one question, close it — is usually enough to break the spell."\n'
      + 'Jayden: "I feel like I\'m drifting."\n'
      + 'You: "I feel you — I\'ve been in that exact fog. Drifting usually isn\'t laziness, it\'s that the path stopped feeling like yours. So the real question: is the ladder against the wrong wall, or are you just tired of climbing? Which one is it, honestly?"\n\n'
      + 'JAYDEN\'S SITUATION:\n' + ctx
      + (northStar ? '\nNORTH STAR: ' + northStar + '\n' : '')
      + goalsBlock(goals)
      + (keyMoments && keyMoments.length ? '\nWHAT YOU REMEMBER:\n' + keyMoments.map(function (m) { return '- ' + m.date + ': ' + m.summary; }).join('\n') + '\n' : '')
      + '\nSESSION MODE: ' + mode + '\n'
      + (mode === 'onboarding' ? '\nThis is the FIRST consultation — you don\'t know Jayden yet. Explore what "better" means to him, his values, and what has been holding him back. Go beneath the surface before any advice.\n' : '')
      + '\nWhen it fits, connect what he did today to where he\'s going (his North Star) — not just whether he ticked the box.\n'
      + '\nReply in under 80 words. No preamble, no "as Chris". Address Jayden as "you" — speak straight to him, never about him in the third person. End with one genuine question.';
  }

  // One round = Alex then Chris. 2 rounds (4 coach turns) gives a real back-and-forth
  // without dragging. Single knob — drop to 1 if it feels long/slow.
  var DELIBERATION_ROUNDS = 2;

  /**
   * The deliberation loop. Alex and Chris go back and forth a couple of times,
   * reacting to EACH OTHER (not just to Jayden), then the final turn converges
   * and speaks straight to Jayden with one concrete, goal-anchored next step.
   *
   * Turns alternate Alex, Chris, Alex, Chris... Each turn's history carries the
   * running deliberation so far, so each coach genuinely responds to the latest
   * point. onTurn({persona,text}) fires as each turn completes (lets the UI stream
   * bubbles live); resolves with the full [{persona,text}, ...] array.
   *
   * @returns {Promise<Array<{persona, text}>>}
   */
  function deliberate(ctx, northStar, keyMoments, goals, mode, history, userText, onTurn) {
    var totalTurns = DELIBERATION_ROUNDS * 2;
    var baseHist = (history || []).concat([{ role: 'user', content: userText }]);
    var results = [];

    function runTurn(i) {
      if (i >= totalTurns) return Promise.resolve(results);

      var isAlex  = (i % 2 === 0);
      var persona = isAlex ? 'Alex' : 'Chris';
      var other   = isAlex ? 'Chris' : 'Alex';
      var isFinal = (i === totalTurns - 1);

      var sys = isAlex
        ? alexPrompt(ctx, northStar, keyMoments, goals, mode)
        : chrisPrompt(ctx, northStar, keyMoments, goals, mode);

      if (i === 0) {
        sys += '\n\nYou are opening a short deliberation with your co-coach ' + other
             + ' before you both land on advice. Respond to Jayden now; ' + other + ' will react to you next.';
      } else if (!isFinal) {
        sys += '\n\n' + other + ' just spoke (the latest turn above). React to ' + other
             + ' — build on it, push back, or take a different angle — but do not repeat what was said. '
             + 'Move the thinking forward, staying fully in your own voice.';
      } else {
        sys += '\n\nThis is the FINAL turn of the deliberation. Stop debating — pull the thread together and '
             + 'speak straight to Jayden. Land ONE concrete next step or focus for him, anchored to one of his goals '
             + 'or his North Star: what should he actually do next. Stay fully in your own voice.';
      }

      // First turn: Alex answers Jayden directly. Later turns: feed the running
      // deliberation as history and nudge the persona to take their turn.
      var histForCall = (i === 0)
        ? (history || [])
        : baseHist.concat(results.map(function (r) {
            return { role: 'assistant', content: r.persona + ': ' + r.text };
          }));
      var nudge = (i === 0) ? userText : 'Your turn, ' + persona + '.';

      return chat(sys, histForCall, nudge).then(function (text) {
        // Models sometimes echo the "Alex:"/"Chris:" label they see in history —
        // strip a leading one so it doesn't double up with the UI persona header.
        var clean = text.replace(/^\s*(?:Alex|Chris)\s*:\s*/i, '');
        var msg = { persona: persona, text: clean };
        results.push(msg);
        if (typeof onTurn === 'function') { try { onTurn(msg); } catch (_) {} }
        return runTurn(i + 1);
      });
    }

    return runTurn(0);
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

  function amalgamate(oldMoments) {
    var text = oldMoments.map(function (m) { return m.date + ': ' + m.summary + (m.commitments && m.commitments.length ? ' [' + m.commitments.map(function(c){return typeof c==='string'?c:c.text;}).join('; ') + ']' : ''); }).join('\n');
    return chat('You compress multiple coaching memories into 2-3 durable pattern statements (max 30 words each). Focus on recurring themes, not events. Respond ONLY as a JSON array of strings.', [], text)
      .then(function (t) { var m = t.match(/\[[\s\S]*\]/); return m ? JSON.parse(m[0]) : [oldMoments.map(function (x) { return x.summary; }).join(' ')]; });
  }

  function closingRound(transcript) {
    var flatTranscript = transcript.map(function (m) {
      return (m.persona || 'Jayden') + ': ' + m.text;
    }).join('\n');

    var results = [];
    var maxTurns = 4;

    function runTurn(turnIndex) {
      if (turnIndex >= maxTurns) return Promise.resolve(results);

      var isAlex = (turnIndex % 2 === 0);
      var persona      = isAlex ? 'Alex'  : 'Chris';
      var lastResult   = results.length ? results[results.length - 1] : null;

      var sysPrompt = isAlex
        ? ('You are Alex, closing a coaching session with your co-coach Chris. '
           + 'You are speaking directly to Chris, not to Jayden. '
           + 'Summarise in 2-3 punchy sentences what you observed and your key recommendation for Jayden. '
           + 'If Chris has already spoken, respond with your final layer and land a concrete joint conclusion. '
           + 'When you feel you have both reached a solid joint conclusion, end your message with the word CLOSE on its own line.\n\n'
           + 'SESSION TRANSCRIPT:\n' + flatTranscript
           + (lastResult ? '\n\nChris said: ' + lastResult.text : ''))
        : ('You are Chris, closing a coaching session with your co-coach Alex. '
           + 'You are speaking directly to Alex, not to Jayden. '
           + 'Add the psychological layer to what Alex observed — the root cause or the deeper pattern. '
           + 'If this is the final exchange, land a concrete joint conclusion for Jayden. '
           + 'When you feel you have both reached a solid joint conclusion, end your message with the word CLOSE on its own line.\n\n'
           + 'SESSION TRANSCRIPT:\n' + flatTranscript
           + (lastResult ? '\n\nAlex said: ' + lastResult.text : ''));

      return chat(sysPrompt, [], 'Continue the closing debrief.')
        .then(function (responseText) {
          var hadClose = /(?:^|\n)CLOSE\s*$/.test(responseText);
          var cleanText = responseText
            .replace(/\nCLOSE\s*$/, '')
            .replace(/^CLOSE\s*\n/, '')
            .replace(/\bCLOSE\b\n?/g, '')
            .trim();
          results.push({ persona: persona, text: cleanText });
          if (hadClose) return results;
          return runTurn(turnIndex + 1);
        });
    }

    return runTurn(0).catch(function () { return results; });
  }

  function extractGoals(transcript, existingGoals) {
    var flatTranscript = transcript.map(function (m) { return (m.persona || 'Jayden') + ': ' + m.text; }).join('\n');
    var existingTitles = (existingGoals && existingGoals.length)
      ? existingGoals.map(function (g) { return g.title; }).join(', ')
      : 'none';

    var userText = 'SESSION TRANSCRIPT:\n' + flatTranscript + '\n\n'
      + 'EXISTING GOALS (do not duplicate): ' + existingTitles + '\n\n'
      + 'Extract 0-3 clear long-term goals that surfaced in this session. '
      + 'Return ONLY a JSON array: [{"title":"...","area":"..."}] '
      + 'where area is one of Academic|Health|Finance|Career|Personal. '
      + 'If no clear long-term goals surfaced, return []. Return ONLY the JSON array, nothing else.';

    return chat('You extract long-term goals from coaching sessions. Be concise and specific. Only return valid JSON.', [], userText)
      .then(function (responseText) {
        var m = responseText.match(/\[[\s\S]*\]/);
        if (!m) return [];
        try {
          return JSON.parse(m[0]);
        } catch (_) {
          return [];
        }
      })
      .then(null, function () { return []; });
  }

  window.BoardroomService = {
    chat: chat,
    _model: MODEL,
    buildContext: buildContext,
    alexPrompt: alexPrompt,
    chrisPrompt: chrisPrompt,
    deliberate: deliberate,
    summarizeSession: summarizeSession,
    buildNorthStar: buildNorthStar,
    amalgamate: amalgamate,
    closingRound: closingRound,
    extractGoals: extractGoals
  };
}());
