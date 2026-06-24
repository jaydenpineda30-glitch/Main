// build.js — compiles app.jsx -> app.js using the pinned in-browser Babel.
//
// Run before every push:   node build.js     (or: npm run build)
// A git pre-commit hook also runs this automatically when app.jsx is staged.
//
// Why @babel/standalone (not @babel/cli): it is the exact same library + version
// the app used to run in the browser (babel-standalone@7.23.2), with the exact same
// default config for <script type="text/babel">. So the generated app.js is identical
// to what the page compiled on the fly before — zero behaviour change.

const Babel = require('@babel/standalone');
const fs = require('fs');

const SRC = 'app.jsx';
const OUT = 'app.js';

const code = fs.readFileSync(SRC, 'utf8');

// Mirrors babel-standalone's default config for a non-module <script type="text/babel">.
const opts = {
  presets: ['react', 'env'],
  plugins: ['transform-class-properties', 'transform-object-rest-spread', 'transform-flow-strip-types'],
  // sourceMaps intentionally omitted — keeps the shipped app.js lean.
};

try {
  const out = Babel.transform(code, opts).code;
  fs.writeFileSync(OUT, out);
  console.log('✓ ' + SRC + ' → ' + OUT + '  (' + (out.length / 1024).toFixed(0) + ' KB)');
} catch (e) {
  // A JSX/JS syntax error throws here — fail loudly so broken code never ships.
  console.error('✗ Babel compile failed:\n' + (e && e.message ? e.message : e));
  process.exit(1);
}
