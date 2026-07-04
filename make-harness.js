// Generates harness-jarvis.html — a local, Firebase-stubbed copy of dashboard.html
// seeded with real backup dashData + synthetic gcal events (work shifts AND
// personal events), to verify the Jarvis briefing/chat/brief end-to-end without
// Google sign-in. NOT committed to the repo.
const fs = require('fs');
const backup = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const dashData = backup.dashData;

const today = new Date();
function ds(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function off(n) { const d = new Date(today); d.setDate(today.getDate() + n); return ds(d); }
const events = [
  // GoTab shifts: one past (in-cycle), three upcoming
  { id: 'h_s1', title: 'GoTab shift', date: off(-2), time: '16:00–22:00', allDay: false, calId: 'h', calName: 'GoTab', source: 'harness' },
  { id: 'h_s2', title: 'GoTab shift', date: off(1),  time: '16:00–22:00', allDay: false, calId: 'h', calName: 'GoTab', source: 'harness' },
  { id: 'h_s3', title: 'GoTab shift', date: off(4),  time: '16:00–22:00', allDay: false, calId: 'h', calName: 'GoTab', source: 'harness' },
  { id: 'h_s4', title: 'GoTab shift', date: off(7),  time: '16:00–22:00', allDay: false, calId: 'h', calName: 'GoTab', source: 'harness' },
  // Personal events: today + tomorrow (calendarSource fodder)
  { id: 'h_p1', title: 'Dentist', date: off(0), time: '14:00–14:45', allDay: false, calId: 'p', calName: 'Personal', source: 'harness' },
  { id: 'h_p2', title: 'Dinner with Maya', date: off(1), time: '19:00–21:00', allDay: false, calId: 'p', calName: 'Personal', source: 'harness' }
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Jarvis Harness</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script>
localStorage.setItem('dash_v1', ${JSON.stringify(JSON.stringify(dashData))});
localStorage.setItem('__gcal_events__', ${JSON.stringify(JSON.stringify(events))});
localStorage.removeItem('__jarvis_briefing__');
localStorage.removeItem('__jarvis_brief__');
window.firebase = {
  initializeApp: function(){ return {}; },
  auth: Object.assign(function(){ return window._auth; }, { Auth: { Persistence: { LOCAL: 1, SESSION: 2, NONE: 3 } }, GoogleAuthProvider: function(){} }),
  firestore: Object.assign(function(){ return window._db; }, { FieldValue: { serverTimestamp: function(){ return new Date().toISOString(); } } })
};
var HARNESS_DOC = {
  get: function(){ return Promise.resolve({ exists: false, data: function(){ return null; } }); },
  set: function(){ window.__harnessWrites = (window.__harnessWrites || 0) + 1; return Promise.resolve(); },
  collection: function(){ return { get: function(){ return Promise.resolve({ docs: [] }); }, doc: function(){ return HARNESS_DOC; }, add: function(){ return Promise.resolve(); } }; }
};
window._auth = {
  setPersistence: function(){ return Promise.resolve(); },
  getRedirectResult: function(){ return Promise.resolve({}); },
  onAuthStateChanged: function(cb){ setTimeout(function(){ cb({ uid: 'harness', displayName: 'Ashley', email: 'harness@local', photoURL: null }); }, 0); return function(){}; },
  signInWithPopup: function(){ return Promise.resolve(); },
  signInWithRedirect: function(){ return Promise.resolve(); },
  signOut: function(){ return Promise.resolve(); }
};
window._db = { collection: function(){ return { doc: function(){ return HARNESS_DOC; } }; } };
var _auth = window._auth, _db = window._db, _googleProvider = {};
window._currentUser = null;
window.DASH_DOC = null;
</script>
<script src="error-handler.js"></script>
<script src="network-monitor.js"></script>
<script src="health-monitor.js"></script>
<script src="data-validator.js"></script>
<script src="error-boundary.js"></script>
<script src="monitoring-dashboard.js"></script>
<script src="ollama-service.js"></script>
<script src="gemini-service.js"></script>
<script src="jarvis-service.js"></script>
<script src="boardroom-service.js"></script>
<script src="market-service.js"></script>
<script src="gcal-sync.js"></script>
<link rel="stylesheet" href="dashboard.css"/>
<script src="data.js"></script>
</head>
<body>
<div id="root"></div>
<script src="app.js" defer></script>
</body>
</html>
`;
fs.writeFileSync('harness-jarvis.html', html);
console.log('harness-jarvis.html written;', events.length, 'events:', events.map(e => e.title + ' ' + e.date).join(' | '));
