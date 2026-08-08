// Stage 2's model path, tested without a key and without a network.
//
// The call is injected, so every case below drives a fake: a refusal, a 429, a
// timeout, a hallucinated view, an empty body. None of it touches the internet
// and none of it needs Jayden's key — the key is read from the app at call time
// and never leaves the browser.
//
// The rule this file exists to protect: the model PHRASES, it never DECIDES. It
// is handed the ranked candidates and may only speak from their facts. If it
// returns anything unusable, the answer is null and the caller falls back to the
// stage-1 card, which needs no key at all.

const test = require('node:test');
const assert = require('node:assert');
const JS = require('../jarvis-signals.js');
const SVC = require('../jarvis-service.js');

const TODAY = '2026-08-08';

const CANDIDATES = JS.rank({
  data: {
    uni: { assessments: [
      { id: 'a1', subject: 'SPREADSHEETS', name: 'AT1 - Submission', date: '2026-08-09', done: false },
      { id: 'a2', subject: 'FinStmts NRE', name: 'Assessment 1 Part A', date: '2026-08-16', done: false },
      { id: 'a3', subject: 'WIA&B', name: 'Assessment 1', date: '2026-08-16', done: false },
      { id: 'a4', subject: 'IND_TAX', name: 'Assessment 1', date: '2026-08-17', done: false }
    ] },
    personal: { tasks: [{ id: 1722308451234, name: 'Chapter review questions', due: '2026-08-05', done: false, addedAt: TODAY, editedAt: TODAY }] }
  },
  gcalEvents: [], today: TODAY,
  money: { income: 1251, bills: 227, oneOffs: 0, savings: 1226, disposable: -202 }
});

// A fetch stand-in that returns whatever body the test wants, in Gemini's shape.
function fakeFetch(text, over) {
  const calls = [];
  const impl = function (url, init) {
    calls.push({ url: url, init: init });
    return Promise.resolve(Object.assign({
      ok: true,
      json: function () {
        return Promise.resolve({ steps: [{ content: [{ text: text }] }] });
      }
    }, over || {}));
  };
  impl.calls = calls;
  return impl;
}

const ask = (opts) => SVC.ask(Object.assign({
  question: 'what should I do today?',
  candidates: CANDIDATES,
  key: 'test-key-not-a-real-one',
  today: TODAY
}, opts));

// ── No key is a supported state, not an error ────────────────────────────────

test('with no key it resolves null rather than throwing', async () => {
  // The whole design survives without an API key. A missing one must fall back
  // to the stage-1 card silently, not surface an error at Jayden.
  for (const key of ['', '   ', null, undefined]) {
    const out = await ask({ key: key, fetchImpl: fakeFetch('{"say":"hi"}') });
    assert.strictEqual(out, null, 'expected null for key ' + JSON.stringify(key));
  }
});

test('with no key it never makes a network call', async () => {
  const f = fakeFetch('{"say":"hi"}');
  await ask({ key: '', fetchImpl: f });
  assert.strictEqual(f.calls.length, 0, 'called out with no key');
});

// ── The prompt is grounded in the ranked candidates ──────────────────────────

test('the prompt carries the ranked facts, so the model can only phrase them', () => {
  const prompt = SVC.buildPrompt({ question: 'what should I do?', candidates: CANDIDATES, today: TODAY });
  assert.ok(prompt.indexOf('SPREADSHEETS AT1 - Submission is due in 1 day') !== -1,
    'the lead headline should be in the prompt');
  assert.ok(prompt.indexOf(TODAY) !== -1, "today's date should be in the prompt");
  assert.ok(prompt.indexOf('what should I do?') !== -1, 'the question should be in the prompt');
});

test('the prompt lists the allowed views and forbids inventing one', () => {
  const prompt = SVC.buildPrompt({ question: 'q', candidates: CANDIDATES, today: TODAY });
  require('../jarvis-view.js').VIEWS.forEach((v) => {
    assert.ok(prompt.indexOf(v) !== -1, 'view "' + v + '" missing from the prompt');
  });
});

test('the prompt tells the model it may not invent figures', () => {
  const prompt = SVC.buildPrompt({ question: 'q', candidates: CANDIDATES, today: TODAY });
  assert.ok(/only .*facts|do not invent|never invent|must not invent/i.test(prompt),
    'the grounding instruction is the point of this prompt');
});

test('the prompt is capped so a huge dashboard cannot blow the request up', () => {
  const many = [];
  for (let i = 0; i < 400; i++) {
    many.push({ id: 'x' + i, subject: 'Subject ' + i, name: 'Assessment ' + i, date: '2026-09-01', done: false });
  }
  const big = JS.rank({ data: { uni: { assessments: many } }, gcalEvents: [], today: TODAY });
  const prompt = SVC.buildPrompt({ question: 'q', candidates: big, today: TODAY });
  assert.ok(prompt.length <= SVC.PROMPT_MAX, 'prompt was ' + prompt.length);
});

test('the key never appears in the prompt', () => {
  const prompt = SVC.buildPrompt({ question: 'q', candidates: CANDIDATES, today: TODAY, key: 'SECRET-KEY-VALUE' });
  assert.strictEqual(prompt.indexOf('SECRET-KEY-VALUE'), -1, 'the key leaked into the prompt body');
});

// ── A good answer comes back through the trust boundary ──────────────────────

test('a clean reply is parsed through jarvis-view, not trusted raw', () => {
  const out = SVC.parse('{"say":"Start the spreadsheet.","show":{"view":"uni","ids":["a1"]},"cta":{"label":"Uni","page":"Uni"}}');
  assert.strictEqual(out.say, 'Start the spreadsheet.');
  assert.strictEqual(out.show.view, 'uni');
  assert.deepStrictEqual(out.cta, { label: 'Uni', page: 'Uni' });
});

test('a hallucinated view is dropped but the sentence survives', () => {
  const out = SVC.parse('{"say":"Here you go.","show":{"view":"pie-chart"}}');
  assert.strictEqual(out.say, 'Here you go.');
  assert.strictEqual(out.show, null);
});

test('an end-to-end ask returns the parsed spec', async () => {
  const out = await ask({ fetchImpl: fakeFetch('{"say":"The spreadsheet is the one.","show":{"view":"uni"}}') });
  assert.strictEqual(out.say, 'The spreadsheet is the one.');
  assert.strictEqual(out.show.view, 'uni');
});

// ── Every failure degrades to null ───────────────────────────────────────────

test('an http error resolves null instead of rejecting', async () => {
  const out = await ask({
    fetchImpl: fakeFetch('', { ok: false, status: 429, statusText: 'Too Many Requests',
      json: function () { return Promise.resolve({ error: { message: 'quota' } }); } })
  });
  assert.strictEqual(out, null);
});

test('a network failure resolves null instead of rejecting', async () => {
  const out = await ask({ fetchImpl: function () { return Promise.reject(new Error('offline')); } });
  assert.strictEqual(out, null);
});

test('a malformed body resolves null', async () => {
  const bodies = [{}, { steps: [] }, { steps: [{}] }, { candidates: [{ content: {} }] }];
  for (const body of bodies) {
    const out = await ask({
      fetchImpl: function () { return Promise.resolve({ ok: true, json: function () { return Promise.resolve(body); } }); }
    });
    assert.strictEqual(out, null, 'expected null for ' + JSON.stringify(body));
  }
});

test('a refusal degrades to the sentence, which is still useful', async () => {
  const out = await ask({ fetchImpl: fakeFetch("I'm sorry, I can't help with that.") });
  assert.ok(out, 'a refusal is still something to show');
  assert.strictEqual(out.show, null);
});

test('a slow model does not hang the card forever', async () => {
  const out = await SVC.ask({
    question: 'q', candidates: CANDIDATES, key: 'k', today: TODAY, timeoutMs: 20,
    fetchImpl: function () { return new Promise(function () { /* never settles */ }); }
  });
  assert.strictEqual(out, null, 'a hung request must resolve null, not hang');
});

// ── The request itself ───────────────────────────────────────────────────────

test('the key travels in a header, never in the url', async () => {
  // gemini-service.js puts it in the query string. URLs end up in browser
  // history, referrers and server logs, so the current docs use a header and so
  // does this. Copying the old pattern would have inherited a weaker one.
  const f = fakeFetch('{"say":"ok"}');
  await ask({ key: 'abc123', fetchImpl: f });
  const call = f.calls[0];
  assert.ok(/generativelanguage\.googleapis\.com/.test(call.url), 'got: ' + call.url);
  assert.strictEqual(call.url.indexOf('abc123'), -1, 'the key leaked into the url');
  assert.strictEqual(call.init.body.indexOf('abc123'), -1, 'the key leaked into the body');
  assert.strictEqual(call.init.headers['x-goog-api-key'], 'abc123');
  assert.strictEqual(call.init.method, 'POST');
});

test('it asks for a schema, so the shape is enforced at the source', async () => {
  // jarvis-view.js stays as the guarantee — never trust the wire — but a
  // response schema stops most malformed output being produced at all, rather
  // than catching it afterwards.
  const f = fakeFetch('{"say":"ok"}');
  await ask({ fetchImpl: f });
  const body = JSON.parse(f.calls[0].init.body);
  assert.ok(body.response_format, 'no response_format sent');
  assert.ok(body.response_format.schema, 'no schema sent');
  assert.deepStrictEqual(body.response_format.schema.required, ['say']);
});

test('it calls a current model, not one from an older generation', async () => {
  const f = fakeFetch('{"say":"ok"}');
  await ask({ fetchImpl: f });
  const body = JSON.parse(f.calls[0].init.body);
  assert.strictEqual(body.model, SVC.MODEL);
  assert.ok(!/gemini-[12]\./.test(SVC.MODEL), 'stale model generation: ' + SVC.MODEL);
});

// ── Reading the reply back ───────────────────────────────────────────────────
// Google restructured this API in May 2026 — `steps` replaced `outputs`, and the
// legacy schema was removed on 8 June. Rather than bet on one shape being right,
// the extractor accepts the documented ones and returns null for anything else.
// A wrong guess then costs a fallback to the stage-1 card, not an exception.

test('the reply text is found across the shapes this API has used', () => {
  const shapes = [
    { label: 'output_text', body: { output_text: '{"say":"a"}' } },
    { label: 'steps', body: { steps: [{ content: [{ text: '{"say":"a"}' }] }] } },
    { label: 'outputs', body: { outputs: [{ content: [{ text: '{"say":"a"}' }] }] } },
    { label: 'candidates', body: { candidates: [{ content: { parts: [{ text: '{"say":"a"}' }] } }] } }
  ];
  shapes.forEach((s) => {
    assert.strictEqual(SVC.extractText(s.body), '{"say":"a"}', 'failed to read the ' + s.label + ' shape');
  });
});

test('an unrecognised reply shape returns empty rather than guessing', () => {
  [null, {}, { steps: [] }, { steps: [{}] }, { output_text: 42 }, []].forEach((body) => {
    assert.strictEqual(SVC.extractText(body), '', 'invented text for ' + JSON.stringify(body));
  });
});

test('no temperature is sent', async () => {
  // Opus 5 rejects `temperature` outright (400), and the handover warns that
  // every existing service in this app sets one. Not sending it keeps the door
  // open to swapping providers without a surprise.
  const f = fakeFetch('{"say":"ok"}');
  await ask({ fetchImpl: f });
  assert.strictEqual(f.calls[0].init.body.indexOf('temperature'), -1,
    'temperature must not be sent: ' + f.calls[0].init.body);
});
