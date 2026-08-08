/**
 * jarvis-view.js — the trust boundary between the model and the screen.
 *
 * Jarvis replies with a *view spec*: a short instruction saying what to put on
 * screen, not the screen itself. Athena then mounts its own real components, so
 * the tick buttons work and there is no markup from the model anywhere near the
 * DOM. This file turns whatever actually came back into that shape, or into
 * nothing.
 *
 * Treat everything arriving here as untrusted input that happens to read
 * fluently. Two rules follow from that:
 *
 *   1. Whitelist, never blacklist. An unrecognised view or page is dropped
 *      silently rather than passed along hopefully.
 *   2. Degrade, never throw. A refusal, a truncated stream, a fenced code block
 *      and a hallucinated view name all have to land somewhere sensible.
 *      Returning null is fine — the caller falls back to the stage-1 rules,
 *      which need no model at all. Jarvis going blank is the one outcome the
 *      whole design exists to prevent.
 *
 * Pure: no DOM, no network, no React. Loadable as a browser global or via
 * require(), matching task-grouping.js / jarvis-signals.js.
 */
(function (root) {
  'use strict';

  // The vocabulary grows one component at a time — Jarvis cannot show what
  // nobody has wired up. Adding a name here without building the component
  // means a blank panel, so this list and renderView() move together.
  //
  // These are exactly the view names `jarvis-signals.js` tags its candidates
  // with. That is not a coincidence and must not become one: the ranker decides
  // which view illustrates a candidate, and this list decides what a model is
  // allowed to put on screen. If they diverge, the model's answer gets silently
  // dropped. `test/jarvis-contract.test.js` fails the moment they do.
  //
  // The first draft of this list read ['next-step', 'task-list', 'money', 'week']
  // — two of which named nothing that existed anywhere, while `uni`, `tasks` and
  // `gym`, which the ranker emits constantly, were absent.
  var VIEWS = ['money', 'uni', 'tasks', 'gym', 'week'];

  // Real pages in Athena's nav. A cta pointing anywhere else is a dead button.
  var PAGES = ['Home', 'Personal', 'Uni', 'Work', 'Finance', 'Gym', 'Journal', 'Projects'];

  // Long enough for a real observation, short enough that a runaway response
  // cannot push the rest of the card off screen.
  var SAY_MAX = 400;

  function str(v) { return typeof v === 'string' ? v : ''; }

  /**
   * `say` is rendered as text, never as markup — but defence in depth is cheap
   * and one day someone will render it somewhere careless.
   */
  function cleanSay(v) {
    var s = str(v).replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
    if (s.length <= SAY_MAX) return s;
    // Cut at a word boundary so the sentence does not end mid-word.
    var cut = s.slice(0, SAY_MAX - 1);
    var lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > SAY_MAX * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + '…';
  }

  /**
   * Models wrap JSON in prose and code fences regardless of what the response
   * format asked for. Try the whole string first, then the widest brace-delimited
   * span inside it. Mirrors gemini-service.js's extractJson.
   */
  function extractJson(text) {
    var raw = str(text).trim();
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { /* fall through */ }
    var first = raw.indexOf('{');
    var last = raw.lastIndexOf('}');
    if (first === -1 || last <= first) return null;
    try { return JSON.parse(raw.slice(first, last + 1)); } catch (e) { return null; }
  }

  /**
   * Did this try to be JSON? A cut-off stream and a plain English refusal both
   * fail to parse, but they must be handled differently — one gets salvaged,
   * the other gets shown as-is.
   */
  function looksLikeJson(text) {
    return /^[\[{]/.test(text) || /"\s*(say|show|cta|view)\s*"\s*:/.test(text);
  }

  /**
   * Pull the `say` value out of JSON that never finished arriving. Deliberately
   * narrow: it only accepts a complete, quoted string value, so a sentence cut
   * off mid-word yields nothing rather than half a word.
   */
  function salvageSay(text) {
    var m = /"say"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(text);
    if (!m) return '';
    try { return JSON.parse('"' + m[1] + '"'); } catch (e) { return ''; }
  }

  function parseShow(show) {
    if (!show || typeof show !== 'object') return null;
    var view = str(show.view).trim();
    if (VIEWS.indexOf(view) === -1) return null;   // whitelist, not blacklist
    // ids identify existing records; anything that is not a plain scalar cannot
    // be one, so it is dropped rather than passed to a lookup.
    var ids = Array.isArray(show.ids) ? show.ids.filter(function (id) {
      return (typeof id === 'number' && isFinite(id)) || (typeof id === 'string' && id.length > 0);
    }) : [];
    return { view: view, ids: ids };
  }

  function parseCta(cta) {
    if (!cta || typeof cta !== 'object') return null;
    var label = str(cta.label).replace(/[<>]/g, '').trim().slice(0, 24);
    var page = str(cta.page).trim();
    if (!label || PAGES.indexOf(page) === -1) return null;   // a dead button is worse than none
    return { label: label, page: page };
  }

  /**
   * @param {string|object} raw - the model's reply, or an already-parsed object
   * @returns {{say:string, show:?{view:string,ids:Array}, cta:?{label:string,page:string}}|null}
   *          null means "nothing usable" — the caller should fall back to the
   *          stage-1 rules rather than render an empty card.
   */
  function parseViewSpec(raw) {
    if (raw == null) return null;
    var obj = (typeof raw === 'object') ? raw : extractJson(raw);

    if (!obj || typeof obj !== 'object') {
      // Unparseable. Two very different cases hide here.
      var text = str(raw).trim();
      if (looksLikeJson(text)) {
        // A cut-off stream. Salvage the sentence if one survived, and otherwise
        // give up — showing Jayden `{"say":"Your bills are` is worse than
        // falling back to the rules, which always have something true to say.
        var salvaged = cleanSay(salvageSay(text));
        return salvaged ? { say: salvaged, show: null, cta: null } : null;
      }
      // Genuine prose: a refusal or a plain answer. Still worth showing — it is
      // the model talking to Jayden, just without a view attached.
      var prose = cleanSay(text);
      return prose ? { say: prose, show: null, cta: null } : null;
    }

    var say = cleanSay(obj.say);
    // A view with nothing said is not worth rendering: the card leads with the
    // sentence, and a panel appearing under silence reads as a glitch.
    if (!say) return null;

    return { say: say, show: parseShow(obj.show), cta: parseCta(obj.cta) };
  }

  var api = {
    VIEWS: VIEWS,
    PAGES: PAGES,
    SAY_MAX: SAY_MAX,
    extractJson: extractJson,
    parseViewSpec: parseViewSpec
  };

  root.JarvisView = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
