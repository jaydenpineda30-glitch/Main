/**
 * jarvis-service.js
 * Stage 2's model path: the only part of Jarvis that talks to a network.
 *
 * The rule the rest of the design rests on — **the model phrases, it never
 * decides** — is enforced here by what the model is given. It does not see the
 * dashboard. It sees the candidates `jarvis-signals.js` has already ranked, with
 * their headlines, reasons and facts, and is asked to answer from those alone.
 * It cannot reorder them, cannot invent a figure, and cannot reach anything.
 *
 * Everything that can go wrong resolves to `null`: no key, no network, a 429, a
 * refusal, a shape nobody expected. `null` means the caller shows the stage-1
 * card, which needs no key and is always correct. There is no error state to
 * put in front of Jayden, because there is nothing he could do about it.
 *
 * ── On the API, checked 2026-08-08 rather than assumed ──────────────────────
 * Google restructured this API in May 2026: `steps` replaced `outputs`,
 * `response_mime_type` was folded into a polymorphic `response_format`, and the
 * legacy schema was removed on 8 June 2026. `gemini-service.js` and
 * `boardroom-service.js` in this repo are still on the old shape and an older
 * model generation — they are NOT worth migrating, because stage 4 deletes
 * Boardroom and the capture flow is moving to Obsidian.
 *
 * Two consequences for this file:
 *   1. It asks for a response **schema**. jarvis-view.js remains the guarantee —
 *      never trust the wire — but a schema stops most malformed output being
 *      generated at all, instead of catching it afterwards.
 *   2. `extractText` accepts every documented response shape rather than betting
 *      on one. If they change it again, the cost is a fallback, not a crash.
 *
 * The key is read from the app at call time and travels in a header, never in
 * the URL — URLs reach browser history, referrers and server logs.
 *
 * Pure apart from the injected `fetchImpl`, so the whole file is testable with
 * no key and no network. Browser global or require().
 */
(function (root) {
  'use strict';

  var JV = (typeof module !== 'undefined' && module.exports && typeof require === 'function')
    ? require('./jarvis-view.js')
    : root.JarvisView;

  var ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
  var MODEL = 'gemini-3.5-flash';

  // Measured against the live API on 2026-08-08, not guessed: a real grounded
  // question took 7.8s, and a one-word smoke test still took 3.6–5.0s because
  // this model thinks before answering (73 thought tokens to produce the word
  // "ok"). 12s left almost no headroom.
  //
  // Thinking does not appear to be controllable here. `thinking_level`,
  // `thinking_config`, `thinking` and `reasoning_effort` are all rejected as
  // unknown parameters. `generation_config` is accepted, but a 200 does not
  // prove a nested `thinking_level` was honoured — the token difference was
  // within run-to-run noise — so it is deliberately not sent. Shipping a
  // parameter that cannot be shown to work is cargo cult.
  var TIMEOUT_MS = 25000;
  // Enough for the ranked list and the question; short enough to stay cheap and
  // fast on a free tier.
  var PROMPT_MAX = 6000;
  var MAX_CANDIDATES = 6;

  function str(v) { return typeof v === 'string' ? v : ''; }

  // Mirrors the view spec jarvis-view.js already validates. Sending it as a
  // schema means the model is steered into the shape rather than guessing at it.
  function schema(views, pages) {
    return {
      type: 'object',
      properties: {
        say: { type: 'string', description: 'One or two sentences answering the question, in a dry, plain register.' },
        show: {
          type: 'object',
          properties: {
            view: { type: 'string', enum: views.slice(), description: 'Which existing view to open.' },
            ids: { type: 'array', items: { type: 'string' }, description: 'Ids taken from the facts given. Never invented.' }
          },
          required: ['view']
        },
        cta: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            page: { type: 'string', enum: pages.slice() }
          },
          required: ['label', 'page']
        }
      },
      required: ['say']
    };
  }

  /**
   * The prompt. Everything the model is allowed to know is in here, and it is
   * all output of the ranking rules — no raw dashboard, no free-floating data.
   */
  function buildPrompt(o) {
    var opts = o || {};
    var today = str(opts.today);
    var question = str(opts.question).slice(0, 500);
    var views = (JV && JV.VIEWS) || [];
    var pages = (JV && JV.PAGES) || [];

    var lines = [];
    (opts.candidates || []).slice(0, MAX_CANDIDATES).forEach(function (c, i) {
      lines.push((i === 0 ? 'LEAD' : 'also') + ' [' + c.band + '] ' + str(c.headline));
      if (c.why) lines.push('     ' + str(c.why));
      if (c.facts) lines.push('     facts: ' + JSON.stringify(c.facts));
      if (c.items && c.items.length) {
        lines.push('     items: ' + JSON.stringify(c.items.map(function (it) {
          return { id: it.id, label: it.label, sub: it.sub };
        })));
      }
      if (c.view) lines.push('     view: ' + c.view);
    });

    var prompt =
      'You are Jarvis, the assistant inside Jayden\'s personal dashboard.\n' +
      'Today is ' + today + '.\n\n' +
      'His question:\n' + question + '\n\n' +
      'What his dashboard has already worked out, ranked most important first:\n' +
      lines.join('\n') + '\n\n' +
      'Rules:\n' +
      '- Answer ONLY from the facts above. You must not invent figures, dates, ' +
      'task names or amounts, and you must not do arithmetic on his money.\n' +
      '- The ranking is already decided. Do not reorder it or argue with it. ' +
      'Your job is to phrase it, not to choose it.\n' +
      '- If the facts above do not answer his question, say so plainly in one ' +
      'sentence. That is a good answer, not a failure.\n' +
      '- "say": one or two sentences. Dry, plain, a little wry. Never chirpy, ' +
      'never a pep talk, never an apology.\n' +
      '- "show.view": one of ' + views.join(', ') + ' — or leave it out.\n' +
      '- "show.ids": only ids that appear in the facts above.\n' +
      '- "cta.page": one of ' + pages.join(', ') + ' — or leave it out.\n';

    // Trimmed at the end, where the least important candidates sit, so the
    // question and the rules always survive.
    return prompt.length > PROMPT_MAX ? prompt.slice(0, PROMPT_MAX) : prompt;
  }

  /**
   * Pull the reply text out of whichever response shape came back.
   * Returns '' when nothing recognisable is there — never a guess.
   */
  function extractText(json) {
    if (!json || typeof json !== 'object' || Array.isArray(json)) return '';

    // Current shape (May 2026 onwards).
    if (typeof json.output_text === 'string') return json.output_text;

    var fromParts = function (arr) {
      if (!Array.isArray(arr)) return '';
      for (var i = 0; i < arr.length; i++) {
        var content = arr[i] && arr[i].content;
        if (Array.isArray(content)) {
          for (var j = 0; j < content.length; j++) {
            if (content[j] && typeof content[j].text === 'string') return content[j].text;
          }
        }
      }
      return '';
    };

    var t = fromParts(json.steps) || fromParts(json.outputs);
    if (t) return t;

    // Legacy generateContent shape, kept because it costs four lines and the
    // alternative is a blank card if anything is still routed that way.
    var cand = Array.isArray(json.candidates) ? json.candidates[0] : null;
    var parts = cand && cand.content && cand.content.parts;
    if (Array.isArray(parts) && parts[0] && typeof parts[0].text === 'string') return parts[0].text;

    return '';
  }

  /** Raw model text -> a validated view spec, or null. */
  function parse(text) {
    if (!JV || typeof JV.parseViewSpec !== 'function') return null;
    return JV.parseViewSpec(text);
  }

  function warn(msg) {
    if (root.ErrorHandler && root.ErrorHandler.warn) root.ErrorHandler.warn(msg, 'jarvis-service');
    else if (typeof console !== 'undefined' && console.warn) console.warn('[Jarvis] ' + msg);
  }

  /**
   * Ask Jarvis a question.
   *
   * @param {object} o
   * @param {string} o.question     what Jayden typed
   * @param {Array}  o.candidates   output of JarvisSignals.rank()
   * @param {string} o.key          the Gemini key, read from the app
   * @param {string} o.today        local YYYY-MM-DD
   * @param {number} [o.timeoutMs]
   * @param {Function} [o.fetchImpl] injected for tests
   * @returns {Promise<{say:string, show:?object, cta:?object}|null>}
   *
   * Never rejects. Null means "use the stage-1 card".
   */
  function ask(o) {
    var opts = o || {};
    var key = str(opts.key).trim();
    // No key is a supported state, not an error: the design works without one.
    if (!key) return Promise.resolve(null);

    var doFetch = opts.fetchImpl || (typeof root.fetch === 'function' ? root.fetch.bind(root) : null);
    if (!doFetch) return Promise.resolve(null);

    var views = (JV && JV.VIEWS) || [];
    var pages = (JV && JV.PAGES) || [];
    var body = {
      model: MODEL,
      input: buildPrompt(opts),
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: schema(views, pages)
      }
    };

    // No `temperature`. The handover records that Opus 5 rejects it outright
    // (400) and that every existing service here sets one — leaving it off keeps
    // the provider swappable without a surprise.
    var request = doFetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res || !res.ok) {
        warn('model call failed: ' + ((res && (res.status + ' ' + res.statusText)) || 'no response'));
        return null;
      }
      return res.json();
    }).then(function (json) {
      if (!json) return null;
      var text = extractText(json);
      if (!text) { warn('unrecognised response shape'); return null; }
      return parse(text);
    }).catch(function (e) {
      warn('model call error: ' + (e && e.message));
      return null;
    });

    // A card that arrives after he has moved on is worse than no card, so the
    // wait is bounded and losing the race is just another null.
    var timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : TIMEOUT_MS;
    var timeout = new Promise(function (resolve) {
      setTimeout(function () { resolve(null); }, timeoutMs);
    });

    return Promise.race([request, timeout]);
  }

  var api = {
    ENDPOINT: ENDPOINT,
    MODEL: MODEL,
    PROMPT_MAX: PROMPT_MAX,
    TIMEOUT_MS: TIMEOUT_MS,
    buildPrompt: buildPrompt,
    extractText: extractText,
    parse: parse,
    ask: ask
  };

  root.JarvisService = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
