// ───────────────────────────────────────────────────────────────────────────
// app.jsx — SOURCE OF TRUTH for the dashboard app (JSX).
// Edit THIS file, not app.js. Before pushing run:  node build.js  (or: npm run build)
// build.js compiles this -> app.js using the pinned in-browser Babel (identical output).
// (A git pre-commit hook auto-rebuilds app.js when this file is staged.)
// ───────────────────────────────────────────────────────────────────────────
const { useState, useEffect, useRef } = React;
// Usage tracking helper — safe wrapper around window.UsageTracker.track. No-op if module not loaded.
function trk(name){try{if(window.UsageTracker)window.UsageTracker.track(name);}catch(_){}}
// Use the enhanced ErrorBoundary from error-boundary.js if it loaded, otherwise inline fallback
const ErrorBoundary = window.ErrorBoundary || class extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err: err }; }
  componentDidCatch(err, info) {
    if (window.ErrorHandler) ErrorHandler.critical((err&&err.message)||'Component crash','error-boundary',{error:err,data:{componentStack:info&&info.componentStack}});
    var el = document.getElementById('app-error');
    if (el) {
      el.style.display = 'block';
      el.innerHTML = '<h2 style="color:#ff6b6b;margin-bottom:16px">Render Error</h2>' +
        '<pre style="background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;font-size:12px;white-space:pre-wrap;color:#ffd166">' +
        (err ? err.message : 'Unknown') + '</pre>';
    }
  }
  render() {
    if (this.state.err) return null;
    return this.props.children;
  }
};

const T={bg:"#0a0a0a",bg2:"rgba(225,234,255,0.07)",bg3:"rgba(225,234,255,0.04)",border:"rgba(255,255,255,0.10)",border2:"rgba(255,255,255,0.16)",text:"#e6ecf5",text2:"#9aa2b2",text3:"rgba(255,255,255,0.30)",accent:"#5b8cff",accentBg:"rgba(91,140,255,0.15)",danger:"#ff6b6b",dangerBg:"rgba(255,107,107,0.15)",success:"#69f0ae",successBg:"rgba(105,240,174,0.15)",warn:"#ffd166",warnBg:"rgba(255,209,102,0.15)",orange:"#ff9a3c",orangeBg:"rgba(255,154,60,0.15)"};
// DAYS, TASK_CATS, SUBJECTS, SC, SYLLABUS_ASSESSMENTS, REFL_QS, REFL_LABELS, WX_MAP, WX_DAYS → data.js

// ── Navigation glyphs — consistent stroke-based line icons (replaces emoji) ──
const NAV_PAGES=["Dashboard","Uni","Work","Gym","Personal","Finance","Journal","Boardroom"];
function NavGlyph(props){
  const n=props.name;const s=props.size||18;
  const a={width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:props.sw||1.7,strokeLinecap:"round",strokeLinejoin:"round"};
  const g={
    Dashboard:<g><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></g>,
    Uni:<g><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/></g>,
    Work:<g><rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/><path d="M2.5 12.5h19"/></g>,
    Gym:<g><path d="M6.5 6.5v11M17.5 6.5v11M4 9v6M20 9v6M6.5 12h11"/></g>,
    Personal:<g><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/></g>,
    Finance:<g><circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-1-1.5-1.5-2.7-1.5-1.6 0-2.8.9-2.8 2.2 0 1.4 1.2 1.9 2.8 2.3 1.6.4 2.8.9 2.8 2.3 0 1.3-1.2 2.2-2.8 2.2-1.3 0-2.3-.6-2.8-1.6M12 6v1.7M12 16.3V18"/></g>,
    Journal:<g><path d="M5 4h11a2 2 0 0 1 2 2v14l-4-2.2L10 20l-4-2.2V6a2 2 0 0 1 2-2Z"/><path d="M9 8h6M9 11.5h6"/></g>,
    Boardroom:<g><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5.5-5.5 2 2-5.5 5.5-2Z"/></g>
  };
  return <svg {...a}>{g[n]||null}</svg>;
}

// ── Utility glyphs — stroke-based line icons that replace functional emoji ──
function UIcon(props){
  const n=props.name;const s=props.size||16;
  const a={width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:props.sw||1.7,strokeLinecap:"round",strokeLinejoin:"round"};
  const g={
    bolt:<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>,
    pencil:<g><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></g>,
    calendar:<g><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></g>,
    gear:<g><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"/></g>,
    phone:<g><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/></g>,
    desktop:<g><rect x="2.5" y="4" width="19" height="12" rx="2"/><path d="M9 20h6M12 16v4"/></g>,
    moon:<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>,
    flag:<g><path d="M5 21V4"/><path d="M5 4h11l-2 3 2 3H5"/></g>,
    clock:<g><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></g>,
    drag:<g fill="currentColor" stroke="none"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></g>,
    restore:<g><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></g>,
    upload:<g><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></g>,
    sparkle:<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z"/>,
    target:<g><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/></g>,
    droplet:<path d="M12 3.5s6 6.3 6 10.2a6 6 0 0 1-12 0C6 9.8 12 3.5 12 3.5Z"/>,
    wind:<g><path d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5M3 16h15a2.5 2.5 0 1 1-2.5 2.5M3 12h7"/></g>,
    thermometer:<g><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 9v6.5"/></g>,
    cloudrain:<g><path d="M7 16h9.5a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1A3.6 3.6 0 0 0 7 16Z"/><path d="M9 19l-1 2.5M13 19l-1 2.5M17 19l-1 2.5"/></g>,
    sync:<g><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 4v4h-4M3 20v-4h4"/></g>,
    pin:<g><path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></g>,
    bulb:<g><path d="M9.2 17.5a6 6 0 1 1 5.6 0"/><path d="M9.5 18.5h5M10.2 21h3.6"/><path d="M9.2 17.5h5.6"/></g>,
    chart:<g><path d="M4 20V4M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></g>,
    trend:<g><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></g>,
    eye:<g><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></g>,
    warn:<g><path d="M12 3.5 22 20H2L12 3.5Z"/><path d="M12 10v4.5M12 17.2v.1"/></g>
  };
  return <svg {...a}>{g[n]||null}</svg>;
}

// ── Weather glyphs — line icons keyed to Open-Meteo weather codes ──
function wxGlyph(code,size){
  const s=size||30;
  const a={width:s,height:s,viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};
  function kind(c){
    if(c===0)return"clear";
    if(c===1||c===2)return"partly";
    if(c===3)return"cloud";
    if(c===45||c===48)return"fog";
    if(c>=51&&c<=55)return"drizzle";
    if((c>=61&&c<=65)||c===80||c===81)return"rain";
    if(c===82)return"heavy";
    if(c>=71&&c<=75)return"snow";
    if(c>=95)return"storm";
    return"cloud";
  }
  const cloud=<path d="M9.5 23.5h13a4.8 4.8 0 0 0 .4-9.6 6.6 6.6 0 0 0-12.7-1.3 4.9 4.9 0 0 0-.7 10.9Z"/>;
  const k=kind(code);
  if(k==="clear")return <svg {...a}><circle cx="16" cy="16" r="6"/><path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2.1 2.1M22.4 22.4l2.1 2.1M24.5 7.5l-2.1 2.1M9.6 22.4l-2.1 2.1"/></svg>;
  if(k==="partly")return <svg {...a}><circle cx="11" cy="11" r="4"/><path d="M11 4v2M4 11h2M6 6l1.4 1.4M16 6l-1.4 1.4"/><path d="M12 26h11a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.8-1.1A4.2 4.2 0 0 0 12 26Z"/></svg>;
  if(k==="cloud")return <svg {...a}>{cloud}</svg>;
  if(k==="fog")return <svg {...a}>{cloud}<path d="M8 27h16M10 30h13"/></svg>;
  if(k==="drizzle")return <svg {...a}>{cloud}<path d="M12 26l-.8 2M16 26l-.8 2M20 26l-.8 2"/></svg>;
  if(k==="rain")return <svg {...a}>{cloud}<path d="M12 26l-1.4 3.2M16.5 26l-1.4 3.2M21 26l-1.4 3.2"/></svg>;
  if(k==="heavy")return <svg {...a}>{cloud}<path d="M11 25.5l-1.8 4M16 25.5l-1.8 4M21 25.5l-1.8 4"/></svg>;
  if(k==="snow")return <svg {...a}>{cloud}<g fill="currentColor" stroke="none"><circle cx="11.5" cy="27.5" r="1"/><circle cx="16" cy="27.5" r="1"/><circle cx="20.5" cy="27.5" r="1"/></g></svg>;
  if(k==="storm")return <svg {...a}>{cloud}<path d="M16.5 25l-3 4.5h3.2l-2.4 3.5"/></svg>;
  return <svg {...a}>{cloud}</svg>;
}

// ── Shared button textures (white glass — matches the mock pill, no blue) ──
const whitePill={appearance:"none",border:"1px solid rgba(255,255,255,0.30)",cursor:"pointer",background:"linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))",backdropFilter:"blur(14px) saturate(1.3)",WebkitBackdropFilter:"blur(14px) saturate(1.3)",color:"#f3f7fd",fontWeight:600,fontSize:13,padding:"11px 18px",borderRadius:999,boxShadow:"0 6px 22px rgba(0,0,0,0.40),inset 0 1px 0 rgba(255,255,255,0.28),inset 0 -1px 0 rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:8,letterSpacing:0.2};
const editPill={appearance:"none",border:"1px solid rgba(255,255,255,0.22)",cursor:"pointer",background:"linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))",color:"#dce4f0",fontWeight:600,fontSize:11,padding:"4px 12px",borderRadius:999,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.20)",display:"inline-flex",alignItems:"center",gap:5,lineHeight:1.5,whiteSpace:"nowrap"};
// ── Canonical button textures (white frosted glass) — secondary + primary ──
const btnGlass={appearance:"none",padding:"6px 13px",borderRadius:999,border:"1px solid rgba(91,140,255,0.35)",background:"rgba(91,140,255,0.14)",color:"rgba(180,210,255,0.92)",cursor:"pointer",fontSize:12,fontWeight:500,boxShadow:"inset 0 1px 0 rgba(91,140,255,0.18)",whiteSpace:"nowrap"};
const btnGlassP={appearance:"none",padding:"6px 14px",borderRadius:999,border:"1px solid rgba(91,140,255,0.55)",background:"linear-gradient(135deg,rgba(91,140,255,0.88),rgba(50,85,204,0.92))",color:"#ffffff",cursor:"pointer",fontSize:12,fontWeight:600,boxShadow:"0 2px 12px rgba(50,90,200,0.40),inset 0 1px 0 rgba(255,255,255,0.22)",whiteSpace:"nowrap"};
// ── Card surface: soft white "aurora" bloom from the TOP-RIGHT corner + elevated shadow so cards pop ──
const cardBg="radial-gradient(ellipse 108% 72px at 0% 0%,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.06) 40%,transparent 65%),radial-gradient(ellipse 108% 60px at 100% 100%,rgba(255,255,255,0.09) 0%,rgba(255,255,255,0.02) 40%,transparent 65%),rgba(18,22,42,0.82)";
const cardShadow="0 18px 46px rgba(0,0,0,0.52),0 6px 16px rgba(0,0,0,0.34),inset 0 1px 0 rgba(255,255,255,0.22)";
const cardShadowSoft="0 10px 26px rgba(0,0,0,0.44),inset 0 1px 0 rgba(255,255,255,0.18)";

const INIT={
  uni:{subjects:Object.keys(SUBJECTS).map(function(k,i){return{id:i+1,name:k,progress:0};}),completedEvents:[],assessments:SYLLABUS_ASSESSMENTS.map(function(a){return{...a};})},
  gym:{
    exercises:[],
    bodyWeight:[],
    lastBWWeek:null,
    rotation:[
      {id:1,name:"Push Day",focus:"Chest, shoulders, triceps"},
      {id:2,name:"Pull Day",focus:"Back, biceps"},
      {id:3,name:"Legs — Hamstring Focus",focus:"Hamstrings, glutes, calves"},
      {id:4,name:"Upper Day",focus:"Full upper body"},
      {id:5,name:"Legs — Quad Focus",focus:"Quads, glutes, calves"},
    ],
    rotIdx:0,
    workouts:[],
  },
  personal:{
    tasks:[],
    archived:[],
  },
  docs:[],
  reflections:[],
  finance:{
    financeVersion:2,
    sources:[{id:1,name:"GoTab (Rippling)",amount:0},{id:2,name:"Jobseeker",amount:0},{id:3,name:"",amount:0}],
    monthlyBudget:0,
    monthlyIncome:{},
    recurringTemplates:[],
    monthlyRecurringOverrides:{},
    expenses:[],
    hourlyRate:0
  },
  work:{
    hourlyRate:0,
    payCycleDay:1,
    goals:[
      {id:"g2",label:"Pay target",target:800,unit:"$"},
      {id:"g3",label:"Tasks logged",target:20,unit:" tasks"}
    ],
    shiftLogs:{},
    taskLog:[],
    focusGoals:[]
  },
};

// Recursively remove undefined values — Firestore rejects any undefined in the document
function stripUndefined(v){
  if(Array.isArray(v))return v.map(stripUndefined);
  if(v&&typeof v==="object"){var o={};Object.keys(v).forEach(function(k){if(v[k]!==undefined)o[k]=stripUndefined(v[k]);});return o;}
  return v;
}
// Reconcile saved assessments with the latest SYLLABUS_ASSESSMENTS defaults.
// Always uses the canonical date from defaults; preserves done status and custom entries.
function reconcileAssessments(saved,defaults){
  var defMap={};defaults.forEach(function(a){defMap[a.id]=a;});
  var result=defaults.map(function(a){
    var s=saved.filter(function(x){return x.id===a.id;})[0];
    return s?{...a,done:!!s.done}:{...a};
  });
  saved.forEach(function(s){if(!defMap[s.id])result.push(s);});
  return result;
}

// Merge cloud/localStorage data with INIT defaults so no field is ever undefined
function mergeWithDefaults(cloud){
  if(!cloud||typeof cloud!=="object")return{...INIT,reflections:SEED_REFL};
  var g=cloud.gym||{};var p=cloud.personal||{};var u=cloud.uni||{};
  return{
    ...INIT,...cloud,
    personal:{...INIT.personal,...p,
      tasks:Array.isArray(p.tasks)?p.tasks:(INIT.personal.tasks||[]),
      archived:Array.isArray(p.archived)?p.archived:[],
    },
    gym:{...INIT.gym,...g,
      exercises:Array.isArray(g.exercises)?g.exercises:INIT.gym.exercises,
      bodyWeight:Array.isArray(g.bodyWeight)?g.bodyWeight:[],
      workouts:Array.isArray(g.workouts)?g.workouts:[],
      rotation:Array.isArray(g.rotation)?g.rotation:INIT.gym.rotation,
      rotIdx:typeof g.rotIdx==="number"?g.rotIdx:0,
    },
    uni:{...INIT.uni,...u,
      subjects:Array.isArray(u.subjects)?u.subjects:INIT.uni.subjects,
      completedEvents:Array.isArray(u.completedEvents)?u.completedEvents:[],
      assessments:Array.isArray(u.assessments)&&u.assessments.length>0?reconcileAssessments(u.assessments,SYLLABUS_ASSESSMENTS):SYLLABUS_ASSESSMENTS.map(function(a){return{...a};}),
    },
    work:(function(){var w=cloud.work||{};return{...INIT.work,...w,hourlyRate:Number(w.hourlyRate||(cloud.finance&&cloud.finance.hourlyRate)||0),payCycleDay:Number(w.payCycleDay||cloud.payCycleDay||1),goals:Array.isArray(w.goals)?w.goals:INIT.work.goals,shiftLogs:(w.shiftLogs&&typeof w.shiftLogs==="object")?w.shiftLogs:{},taskLog:Array.isArray(w.taskLog)?w.taskLog:[],focusGoals:Array.isArray(w.focusGoals)?w.focusGoals:[]};}()),
    reflections:(Array.isArray(cloud.reflections)&&cloud.reflections.length>0)?cloud.reflections:SEED_REFL,
  };
}
// Returns true if `d` looks like a freshly-seeded state with no user-generated content.
// Used as a safety net to refuse Firestore writes that would wipe real cloud data.
// Add fields here if you introduce new user-generated arrays elsewhere in INIT.
function isLikelySeedState(d){
  if(!d||typeof d!=="object")return true;
  var n=function(arr){return Array.isArray(arr)?arr.length:0;};
  return n(d.reflections)===0
      && n(d.personal&&d.personal.tasks)===0
      && n(d.personal&&d.personal.archived)===0
      && n(d.gym&&d.gym.exercises)===0
      && n(d.gym&&d.gym.workouts)===0
      && n(d.gym&&d.gym.bodyWeight)===0
      && n(d.finance&&d.finance.expenses)===0
      && n(d.uni&&d.uni.completedEvents)===0
      && n(d.docs)===0;
}
function localDateStr(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function todayStr(){return localDateStr(new Date());}
function futureDateStr(n){const d=new Date();d.setDate(d.getDate()+n);return localDateStr(d);}
function weekMonday(){const n=new Date();const d=n.getDay();const off=d===0?-6:1-d;const m=new Date(n);m.setDate(n.getDate()+off);return localDateStr(m);}
function daysBetween(s){const d=new Date(s+'T00:00:00');const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());return Math.round((d-today)/864e5);}
function fmtDate(s){if(!s)return"";return new Date(s).toLocaleDateString("en-AU",{day:"numeric",month:"short"});}
function toMins(s){const parts=(s||"0:00").split(":");return parseInt(parts[0])*60+parseInt(parts[1]||0);}
function parseTimes(t){if(!t)return{start:480,end:540};const norm=t.replace(/[–-]/g,"|");const parts=norm.split("|");return{start:toMins(parts[0].trim()),end:toMins(parts[1].trim())};}
function getWeekDates(ref){const now=ref||new Date();const dow=now.getDay();const off=dow===0?-6:1-dow;return DAYS.map(function(_,i){const d=new Date(now);d.setDate(now.getDate()+off+i);return d;});}
function dStr(d){return localDateStr(d);}
function shiftPay(timeStr){if(!timeStr)return null;const t=parseTimes(timeStr);const CUT=19*60;let norm=0,pen=0;for(let m=t.start;m<t.end;m++){m<CUT?norm++:pen++;}return{normalHrs:+(norm/60).toFixed(2),penaltyHrs:+(pen/60).toFixed(2),totalEquiv:+(norm/60+pen/60*1.5).toFixed(2)};}
function taskUrg(t){if(t.done)return"done";const od=t.due?daysBetween(t.due)*-1:0;const ref=t.editedAt||t.addedAt||todayStr();const age=Math.floor((new Date()-new Date(ref))/864e5);if(od>7)return"red";if(od>3)return"yellow";if(od>0)return"orange";if(age>7)return"yellow";return t.priority==="urgent"?"urgent":"normal";}
const TUC={red:T.danger,yellow:T.warn,orange:T.orange,urgent:T.danger,normal:T.text2,done:T.success};
function taskLabel(t){if(t.done)return"done";const od=t.due?daysBetween(t.due)*-1:0;const ref=t.editedAt||t.addedAt||todayStr();const age=Math.floor((new Date()-new Date(ref))/864e5);if(od>0)return od+"d overdue";if(age>7)return"untouched "+age+"d";if(t.due)return"due "+fmtDate(t.due);return"";}

const SEED_REFL=[];
function analyzeReflectionFallback(answers,history){
  const allText=answers.map(function(a){return a.a;}).join(" ").toLowerCase();
  const NEG=["overwhelm","stressed","stress","anxious","anxiety","tired","exhaust","frustrat","struggl","difficult","hard","fail","behind","worr","drain","burnout","burnt out","can't","couldn't","unable","avoid","procrastinat","miss","forgot","lonely","isolat","depress","hopeless","unmotivated","no motivation","falling behind"];
  const POS=["great","well","good","happy","proud","confident","motivat","focused","achiev","succeed","managed","improv","progress","excited","grateful","calm","balanced","productive","consistent","win","celebrat","better","strong","growth","learn","breakthrough","clarity","clear"];
  const PERF=["perfect","not good enough","should have","could have","disappoint","let myself down","not where","behind schedule","should be","wasn't enough","fell short","not enough","never enough"];
  const BURNOUT=["exhaust","burnt out","burnout","drain","can't keep","too much","overwhelming","no energy","so tired","no motivation","running on empty","barely"];
  const GROWTH=["learn","improv","trying","working on","getting better","progress","develop","growing","want to improve","next week","work on","focus on"];
  const AON=["always","never","everything","nothing","complete failure","totally","all the time","every time","impossible","worst"];
  function countHits(text,kws){return kws.filter(function(k){return text.indexOf(k)!==-1;}).length;}
  const neg=countHits(allText,NEG);const pos=countHits(allText,POS);const perf=countHits(allText,PERF);const burn=countHits(allText,BURNOUT);const growth=countHits(allText,GROWTH);const aon=countHits(allText,AON);
  const sentScore=Math.max(-1,Math.min(1,(pos-neg)/6));
  let emotionalState;
  if(sentScore>=0.5)emotionalState="Positive — feeling capable and progressing";
  else if(sentScore>=0.1)emotionalState="Cautiously optimistic — mixed but moving forward";
  else if(sentScore>=-0.1)emotionalState="Neutral — steady but not thriving";
  else if(sentScore>=-0.4)emotionalState="Stressed — carrying notable tension this week";
  else emotionalState="Depleted — significant strain detected";
  const patterns=[];
  if(burn>=2)patterns.push("burnout_risk");
  if(perf>=2)patterns.push("perfectionism");
  if(aon>=2)patterns.push("all_or_nothing");
  if(growth>=2)patterns.push("growth_mindset");
  if(neg>pos*1.5)patterns.push("high_stress");
  if(pos>neg*2)patterns.push("resilient_week");
  const qScores=answers.map(function(a){const t=a.a.toLowerCase();return countHits(t,POS)-countHits(t,NEG);});
  const worstIdx=qScores.indexOf(Math.min.apply(null,qScores));
  const bestIdx=qScores.indexOf(Math.max.apply(null,qScores));
  const areas=["your academic load","your work situation","your physical health habits","your work-life balance","your personal growth direction"];
  let dominantPattern;
  if(patterns.indexOf("burnout_risk")!==-1)dominantPattern="Burnout risk — energy reserves running low";
  else if(patterns.indexOf("perfectionism")!==-1)dominantPattern="Perfectionist pressure — very high internal standards";
  else if(patterns.indexOf("high_stress")!==-1)dominantPattern="High stress load — multiple areas feeling stretched";
  else if(patterns.indexOf("all_or_nothing")!==-1)dominantPattern="All-or-nothing thinking — seeing things in extremes";
  else if(patterns.indexOf("growth_mindset")!==-1)dominantPattern="Growth orientation — approaching challenges with curiosity";
  else if(patterns.indexOf("resilient_week")!==-1)dominantPattern="Resilient week — navigating challenges effectively";
  else dominantPattern="Steady week — maintaining baseline without major spikes";
  let rootIssue;
  if(worstIdx>=0&&qScores[worstIdx]<0){rootIssue="Strongest friction in "+areas[worstIdx];if(patterns.indexOf("perfectionism")!==-1)rootIssue+=" — possibly amplified by perfectionist expectations";else if(patterns.indexOf("all_or_nothing")!==-1)rootIssue+=" — all-or-nothing framing may be intensifying this";}
  else{rootIssue=bestIdx>=0?"Strongest momentum in "+areas[bestIdx]:"No single dominant friction point this week";}
  let insight;
  if(patterns.indexOf("burnout_risk")!==-1)insight="Your language this week signals depletion across multiple areas. Burnout doesn't arrive suddenly — it builds through sustained output without adequate recovery. The fact that you're recognising it is the first and most important step. Your nervous system is asking for genuine rest, not just less work.";
  else if(patterns.indexOf("perfectionism")!==-1)insight="There's a pattern of measuring your efforts against an ideal rather than a realistic baseline. Perfectionism often masquerades as high standards but functions as a stress amplifier — raising the bar each time you clear it. Progress over perfection is a skill worth practising deliberately this week.";
  else if(patterns.indexOf("all_or_nothing")!==-1)insight="Your language this week leans toward absolutes (always/never/everything/nothing). This thinking pattern amplifies difficulty — one missed session becomes 'failing at fitness,' one hard day becomes 'a terrible week.' The reality almost always sits in the grey zone.";
  else if(patterns.indexOf("high_stress")!==-1)insight="Multiple domains felt strained simultaneously this week. When stress shows up across academic, physical, and relational areas at once, it usually signals that recovery mechanisms need attention — sleep quality, micro-breaks, and brief transitions between tasks often matter more than you'd expect.";
  else if(patterns.indexOf("growth_mindset")!==-1)insight="You approached challenges this week with curiosity rather than rigidity — looking at what to improve rather than cataloguing what went wrong. That orientation is a genuine psychological strength. It's the difference between feedback as information and feedback as verdict.";
  else if(sentScore>=0.3)insight="This was a strong week. Take a moment to notice what conditions made that possible — specific habits, environments, or mindsets. Understanding what works is as valuable as diagnosing what doesn't, and most people skip this step.";
  else insight="A stable week — not dramatic in either direction. These plateau periods are where consistent habits quietly build the foundations for future momentum. The absence of visible progress doesn't mean nothing is moving.";
  let recommendation;
  if(patterns.indexOf("burnout_risk")!==-1)recommendation="Prioritise one genuinely restorative activity this week — not productive rest, actual rest. Protect one block of time with no output requirement. Even 90 minutes of complete disconnection can meaningfully reset your baseline.";
  else if(patterns.indexOf("perfectionism")!==-1)recommendation="Before your next major task, decide in advance what 'good enough' looks like and aim for that deliberately. Notice the difference in energy expenditure versus your usual standard.";
  else if(patterns.indexOf("all_or_nothing")!==-1)recommendation="When you notice absolute language in your own thinking, pause and find one counter-example. One exception breaks the rule and restructures the framing entirely.";
  else if(patterns.indexOf("high_stress")!==-1)recommendation="Identify the single highest-leverage action that would reduce your stress load most — not the most urgent task, but the one whose completion creates the most breathing room — and do that one first this week.";
  else if(patterns.indexOf("growth_mindset")!==-1)recommendation="Channel this week's momentum into one specific commitment: pick the area with the most untapped potential from your reflection and schedule a deliberate block of time for it.";
  else recommendation="Note down what made this week manageable — two or three specific conditions that were present. Keep these as a reference point when harder weeks arrive.";
  let patternHistory="First reflection — patterns will emerge as you keep logging each week.";
  if(history&&history.length>=2){
    const prev=history.slice(-5);
    const prevTexts=prev.map(function(r){return(r.answers||[]).map(function(a){return(a.a||a.answer||"");}).join(" ").toLowerCase();});
    const stressWeeks=prevTexts.filter(function(t){return countHits(t,NEG)>countHits(t,POS);}).length;
    const prevPats=[].concat.apply([],history.slice(-4).filter(function(r){return r.analysis&&r.analysis.detectedPatterns;}).map(function(r){return r.analysis.detectedPatterns;}));
    const burnCount=prevPats.filter(function(p){return p==="burnout_risk";}).length;
    const perfCount=prevPats.filter(function(p){return p==="perfectionism";}).length;
    const stressCount=prevPats.filter(function(p){return p==="high_stress";}).length;
    const total=prev.length;
    if(burnCount>=2)patternHistory="Burnout risk has appeared in "+burnCount+" of your last "+Math.min(4,history.length)+" reflections. This is a recurring pattern that warrants real attention, not just a harder push.";
    else if(perfCount>=2)patternHistory="Perfectionism has surfaced in "+perfCount+" of your last "+Math.min(4,history.length)+" reflections — a consistent internal pressure source rather than a one-off response.";
    else if(stressCount>=2)patternHistory="High stress has been flagged in "+stressCount+" recent reflections. Worth asking: is this situational (exam period, busy work stretch) or a longer pattern?";
    else if(stressWeeks>=Math.ceil(total*0.7))patternHistory="Stress has dominated "+stressWeeks+" of your last "+total+" reflections. Worth asking: is this environment, workload, or an internal pattern?";
    else if(stressWeeks===0)patternHistory="Consistently positive tone across your last "+total+" reflections — you're tracking a meaningful stretch of stability and growth.";
    else patternHistory="Mixed weeks across your last "+total+" reflections ("+stressWeeks+" higher-stress, "+(total-stressWeeks)+" more positive). No single dominant pattern yet — keep logging for clearer trends.";
  } else if(history&&history.length===1){patternHistory="Second reflection logged. One more week of data needed before cross-week patterns can be identified.";}
  return{emotionalState,dominantPattern,rootIssue,insight,recommendation,patternHistory,sentimentScore:sentScore,detectedPatterns:patterns,sentColor:sentScore>=0.1?"#69f0ae":sentScore<=-0.1?"#ff6b6b":"#ffd166",sentBg:sentScore>=0.1?"rgba(105,240,174,0.06)":sentScore<=-0.1?"rgba(255,107,107,0.06)":"rgba(255,209,102,0.06)",sentBorder:sentScore>=0.1?"rgba(105,240,174,0.25)":sentScore<=-0.1?"rgba(255,107,107,0.25)":"rgba(255,209,102,0.25)"};
}

// ── Assessment detection (module-level so generateCheckinFallback can use it) ─
const DEFINITE_ASSESS_MARKERS=["🔴","🔵","SUPERVISED ASSESSMENT","assessment due","submission due","submit by","due date","AT1 due","AT2 due","AT3 due","AT4 due","AT5 due"];
const ASSESS_KEYWORDS=["AT1","AT2","AT3","AT4","AT5","exam","final exam","quiz","mid-sem","midsem","submission","assignment","due","assessment","supervised","test","prac exam","lab exam"];
function isWeeklyClass(title){return /^Wk\s*\d/i.test(title)||/^Week\s*\d/i.test(title)||/^Lecture/i.test(title)||/^Tutorial/i.test(title)||/^Lab\s/i.test(title)||/^Seminar/i.test(title)||/^Workshop/i.test(title);}
function isAssessmentEvent(ev){
  var title=ev.title||"";
  if(isWeeklyClass(title))return false;
  var desc=ev.description||"";
  var combined=title+" "+desc;
  var combinedLower=combined.toLowerCase();
  // Definite markers (emoji + key phrases) — checked case-sensitively for emoji support
  if(DEFINITE_ASSESS_MARKERS.some(function(m){return combined.includes(m);}))return true;
  // Keyword list — checked in combined title+description
  if(ASSESS_KEYWORDS.some(function(k){return combinedLower.includes(k.toLowerCase());}))return true;
  return false;
}
function isGoTabEvent(ev){
  return !ev.allDay&&ev.time&&ev.time!=="All day"&&(
    (ev.calName&&(ev.calName.toLowerCase().includes("gotab")||ev.calName.toLowerCase().includes("jayden.pineda")))||
    (ev._email&&ev._email.toLowerCase().includes("gotab"))||
    (ev.title&&(ev.title.toLowerCase().includes("gotab")||ev.title.toLowerCase().includes("shift")))
  );
}

function dedupeEvents(evs){
  var seen=new Map();
  var sorted=evs.slice().sort(function(a,b){
    var aP=(a._email||"").includes("jaydenpineda30")?0:1;
    var bP=(b._email||"").includes("jaydenpineda30")?0:1;
    return aP-bP;
  });
  for(var i=0;i<sorted.length;i++){var ev=sorted[i];var key=(ev.title||"")+"||"+(ev.date||"")+"||"+(ev.time||"");if(!seen.has(key))seen.set(key,ev);}
  return Array.from(seen.values());
}
// ── Rule-based check-in (fallback) ────────────────────────────────────────
function generateCheckinFallback(data){
  const blocks=[];
  const overdue=data.personal.tasks.filter(function(t){return !t.done&&t.due&&daysBetween(t.due)<0;});
  const urgent=data.personal.tasks.filter(function(t){return !t.done&&t.priority==="urgent"&&t.due&&daysBetween(t.due)>=0;});
  const gymRot=data.gym.rotation||[];
  const rotLen=gymRot.length>0?gymRot.length:1;
  const nextSess=gymRot.length>0?gymRot[(data.gym.rotIdx||0)%rotLen]:null;

  // Schedule block from cached Google Calendar events
  var cachedEvs=[];try{var ce=localStorage.getItem('__gcal_events__');if(ce)cachedEvs=JSON.parse(ce);}catch(_){}
  cachedEvs=dedupeEvents(cachedEvs);
  // tmrFree: true if tomorrow has no timed events
  const tmrDate=new Date(Date.now()+864e5);
  const tmrStr=dStr(tmrDate);
  const tmrEvs=cachedEvs.filter(function(ev){return ev.date===tmrStr&&!ev.allDay;});
  const tmrFree=tmrEvs.length===0;
  // soon: assessment events in the next 4 days — uses shared isAssessmentEvent (checks description too)
  const soon=cachedEvs.filter(function(ev){var d=daysBetween(ev.date);return d>=0&&d<=4&&isAssessmentEvent(ev);});
  const tToday=cachedEvs.filter(function(ev){return ev.date===todayStr()&&!ev.allDay;});
  let schedLines=[];
  if(tToday.length>0){schedLines=tToday.map(function(ev){var s=ev.title+(ev.time?" "+ev.time:"");if(ev.description)s+=" ["+ev.description.slice(0,80)+"]";return s;});}
  else{schedLines.push("No events found in Google Calendar for today.");}
  blocks.push({header:"Today's Schedule",items:schedLines});

  // Tasks block
  if(overdue.length>0||urgent.length>0){
    const lines=[];
    overdue.forEach(function(t){lines.push(t.name+" is "+Math.abs(daysBetween(t.due))+"d overdue — worth sorting today.");});
    urgent.forEach(function(t){lines.push(t.name+" is due "+fmtDate(t.due)+" — don't leave it too late.");});
    blocks.push({header:"Tasks",items:lines});
  }

  // Suggestion block
  if(tmrFree){
    const pending=data.personal.tasks.filter(function(t){return !t.done;});
    if(pending.length>0){
      blocks.push({header:"Suggestion",items:["Tomorrow looks free — good window to knock off "+pending[0].name+(pending.length>1?" or "+pending[1].name:"")+"."+(nextSess?" Could also fit in your "+nextSess.name+"!":"")]});
    } else {
      blocks.push({header:"Suggestion",items:["Tomorrow is free — great chance to get ahead on study or hit the gym"+(nextSess?" ("+nextSess.name+" is up next).":".")]}); 
    }
  } else if(nextSess){
    blocks.push({header:"Suggestion",items:["Next gym session is "+nextSess.name+" ("+nextSess.focus+"). Pre-fill your weights on the dashboard before you go."]});
  }

  // Question block
  if(soon.length>0){
    blocks.push({header:"Check-in",items:["What's the first assessment you're going to put time into today, Jayden?"]});
  } else if(overdue.length>0){
    blocks.push({header:"Check-in",items:["Which overdue task are you clearing first today?"]});
  } else {
    blocks.push({header:"Check-in",items:["What's the one thing you want to have done by end of day?"]});
  }

  return blocks;
}

// AI functions are provided by OllamaService (ollama-service.js)
// which tries Gemini first, then falls back to local rule-based logic.

function renderMd(text){
  if(!text)return null;
  var lines=text.split('\n');
  var elements=[];
  var listItems=[];
  function flushList(){
    if(listItems.length>0){
      elements.push(<ul key={'ul'+elements.length} style={{margin:'4px 0 4px 4px',paddingLeft:14}}>{listItems}</ul>);
      listItems=[];
    }
  }
  lines.forEach(function(line,i){
    var trimmed=line.trim();
    if(!trimmed){flushList();return;}
    var isBullet=trimmed.startsWith('* ')||trimmed.startsWith('- ');
    var content=isBullet?trimmed.slice(2):trimmed;
    var boldParts=content.split(/\*\*(.*?)\*\*/);
    var inline=[];
    boldParts.forEach(function(p,j){
      if(j%2===1){inline.push(<strong key={'b'+i+'_'+j}>{p}</strong>);return;}
      var wlParts=p.split(/\[\[([^\]]+)\]\]/);
      wlParts.forEach(function(wp,k){
        if(k%2===1){
          inline.push(<span key={'w'+i+'_'+j+'_'+k} style={{color:'#5b8cff',background:'rgba(91,140,255,0.10)',padding:'1px 6px',borderRadius:4,fontWeight:500,fontSize:'0.96em'}}>{wp}</span>);
        }else if(wp){
          inline.push(wp);
        }
      });
    });
    if(isBullet){
      listItems.push(<li key={i} style={{marginBottom:1}}>{inline}</li>);
    }else{
      flushList();
      elements.push(<div key={i} style={{marginBottom:2}}>{inline}</div>);
    }
  });
  flushList();
  return elements;
}

function Sparkline(props){
  const data=props.data||[];const color=props.color||T.accent;const w=props.width||220;const h=props.height||48;
  if(data.length<2)return React.createElement("div",{style:{fontSize:11,color:T.text3,padding:"8px 0"}},"Log more entries to see trend");
  const vals=data.map(function(d){return d.weight;});
  const mn=Math.min.apply(null,vals)-1;const mx=Math.max.apply(null,vals)+1;const range=mx-mn;
  const pts=vals.map(function(v,i){return((i/(vals.length-1))*w)+","+(h-((v-mn)/range)*h);}).join(" ");
  return React.createElement("div",{style:{position:"relative",marginBottom:4}},
    React.createElement("svg",{width:w,height:h,style:{overflow:"visible",display:"block"}},
      React.createElement("polyline",{points:pts,fill:"none",stroke:color,strokeWidth:"1.5",strokeLinejoin:"round"}),
      vals.map(function(v,i){const x=(i/(vals.length-1))*w;const y=h-((v-mn)/range)*h;return React.createElement("circle",{key:i,cx:x,cy:y,r:"2.5",fill:color});})
    ),
    React.createElement("div",{style:{position:"absolute",right:0,top:0,fontSize:11,fontWeight:700,color:color}},vals[vals.length-1]+"kg")
  );
}

function useIsMob(){const [m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);useEffect(function(){function h(){setM(window.innerWidth<768);}window.addEventListener("resize",h);return function(){window.removeEventListener("resize",h);};},[]);return m;}

// ── Weather widget ────────────────────────────────────────────────────────────
// WX_MAP, WX_DAYS → data.js
const WX_STALE=30*60*1000;
const WX_URL="https://api.open-meteo.com/v1/forecast?latitude=-37.8136&longitude=144.9631&current=temperature_2m,apparent_temperature,weather_code,precipitation_probability,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Australia/Melbourne&forecast_days=8";

function wxOpenDB(){return new Promise(function(res,rej){const r=indexedDB.open("dash_weather",1);r.onupgradeneeded=function(e){const db=e.target.result;if(!db.objectStoreNames.contains("c"))db.createObjectStore("c",{keyPath:"k"});};r.onsuccess=function(e){res(e.target.result);};r.onerror=function(){rej(r.error);};});}
function wxGet(db){return new Promise(function(res){const r=db.transaction("c","readonly").objectStore("c").get("wx");r.onsuccess=function(){res(r.result||null);};r.onerror=function(){res(null);};});}
function wxPut(db,payload){return new Promise(function(res){const tx=db.transaction("c","readwrite");tx.objectStore("c").put({k:"wx",...payload});tx.oncomplete=res;tx.onerror=res;});}

function WeatherWidget(props){
  const mob=props.mob||false;
  const [wx,setWx]=useState(null);
  const [status,setStatus]=useState("loading");
  const [open,setOpen]=useState(false);
  const [selDay,setSelDay]=useState(null);

  async function load(){
    try{
      const db=await wxOpenDB();
      const cached=await wxGet(db);
      const stale=!cached||!cached.current||(Date.now()-cached.fetchedAt)>WX_STALE;
      if(cached&&cached.current)setWx(cached);
      if(!navigator.onLine){setStatus(cached&&cached.current?"offline":"error");return;}
      if(stale){
        try{
          const resp=await fetch(WX_URL);
          if(!resp.ok)throw new Error("HTTP "+resp.status);
          const json=await resp.json();
          const c=json.current;
          const pad=function(n){return String(n).padStart(2,"0");};
          const now=new Date();
          const curKey=now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate())+"T"+pad(now.getHours())+":00";
          let hStart=json.hourly.time.indexOf(curKey);
          if(hStart<0)hStart=0;
          const hourly=json.hourly.time.slice(hStart,hStart+25).map(function(t,i){return{time:t,temp:Math.round(json.hourly.temperature_2m[hStart+i]),code:json.hourly.weather_code[hStart+i]||0,rain:json.hourly.precipitation_probability[hStart+i]||0};});
          const daily=json.daily.time.map(function(date,i){return{date,high:Math.round(json.daily.temperature_2m_max[i]),low:Math.round(json.daily.temperature_2m_min[i]),code:json.daily.weather_code[i]||0,rain:json.daily.precipitation_probability_max[i]||0};});
          const fresh={current:{temp:Math.round(c.temperature_2m),feelsLike:Math.round(c.apparent_temperature),code:c.weather_code,rain:c.precipitation_probability||0,humidity:c.relative_humidity_2m,wind:Math.round(c.wind_speed_10m)},hourly,daily,fetchedAt:Date.now()};
          await wxPut(db,fresh);
          setWx(fresh);setStatus("ok");
        }catch(e){
          if(window.ErrorHandler)ErrorHandler.log("Weather fetch failed: "+e.message,"error","weather");
          setStatus(cached&&cached.current?"offline":"error");
        }
      }else{setStatus("ok");}
    }catch(e){
      if(window.ErrorHandler)ErrorHandler.log("WeatherWidget error: "+e.message,"error","weather");
      setStatus("error");
    }
  }

  useEffect(function(){
    load();
    const timer=setInterval(load,WX_STALE);
    window.addEventListener("online",load);
    return function(){clearInterval(timer);window.removeEventListener("online",load);};
  },[]);

  const cur=wx&&wx.current;
  const desc=cur?(WX_MAP[cur.code]||"Unknown"):"--";
  const ageMin=wx?Math.floor((Date.now()-wx.fetchedAt)/60000):null;
  const ageStr=ageMin===null?null:ageMin<2?"just now":ageMin<60?ageMin+"m ago":Math.floor(ageMin/60)+"h ago";

  function fmtHour(t){const h=parseInt((t||"T0").split("T")[1]);return h===0?"12am":h<12?h+"am":h===12?"12pm":(h-12)+"pm";}
  function fmtDayLabel(dateStr,i){if(i===0)return"Today";if(i===1)return"Tomorrow";const d=new Date(dateStr+"T00:00");return WX_DAYS[d.getDay()];}
  function fmtFullDate(dateStr){const d=new Date(dateStr+"T00:00");return WX_DAYS[d.getDay()]+" "+d.getDate()+" "+["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];}

  return(
    <>
      {/* ── Compact dashboard widget ── */}
      <div className="glow-item" style={{background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:16,padding:"14px 16px",boxShadow:cardShadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:10,color:T.text3}}>Melbourne</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {status==="offline"&&<div style={{fontSize:9,padding:"1px 6px",borderRadius:99,background:T.warnBg,color:T.warn}}>cached</div>}
            {status==="loading"&&!wx&&<div style={{fontSize:9,color:T.text3}}>loading...</div>}
            <button style={editPill} onClick={function(){trk("weather.refresh");setOpen(true);}}>Forecast →</button>
          </div>
        </div>
        {status==="error"&&!cur
          ?<div style={{fontSize:11,color:T.text3,padding:"8px 0"}}>Weather unavailable</div>
          :<>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{color:"#aebfe0",display:"flex",alignItems:"center"}}>{cur?wxGlyph(cur.code,40):<span style={{fontSize:26,color:T.text3}}>--</span>}</div>
              <div>
                <div style={{fontSize:26,fontWeight:700,color:T.text,lineHeight:1}}>{cur?cur.temp+"°":"--"}</div>
                <div style={{fontSize:11,color:T.text2,marginTop:3}}>{desc}</div>
              </div>
            </div>
            {cur&&cur.rain>0&&<div style={{fontSize:11,color:T.warn,marginTop:6}}>{cur.rain}% rain</div>}
            {ageStr&&<div style={{fontSize:9,color:T.text3,marginTop:6}}>Updated {ageStr}</div>}
          </>
        }
      </div>

      {/* ── Full detail modal ── */}
      {open&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.9)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",zIndex:300,overflowY:"auto",padding:mob?"0":"20px"}} onClick={function(){setOpen(false);setSelDay(null);}}>
        <div style={{maxWidth:700,margin:mob?"56px auto 0":"24px auto",background:"rgba(11,14,40,0.99)",borderRadius:mob?"16px 16px 0 0":"20px",border:"0.5px solid rgba(91,140,255,0.3)",boxShadow:"0 20px 60px rgba(0,0,0,0.85)",overflow:"hidden",minHeight:mob?"calc(100vh - 56px)":"auto"}} onClick={function(e){e.stopPropagation();}}>

          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 22px 0"}}>
            <div>
              <div style={{fontSize:20,fontWeight:700,color:T.text}}>Melbourne</div>
              <div style={{fontSize:11,color:T.text3,marginTop:1}}>Victoria, Australia{ageStr?" · Updated "+ageStr:""}</div>
            </div>
            <button style={{background:"rgba(255,255,255,0.07)",border:"0.5px solid "+T.border,borderRadius:8,color:T.text2,cursor:"pointer",fontSize:15,padding:"5px 11px",lineHeight:1}} onClick={function(){setOpen(false);setSelDay(null);}}>✕</button>
          </div>

          {/* Current conditions */}
          {cur&&<div style={{padding:"18px 22px 20px",borderBottom:"0.5px solid "+T.border}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:18,marginBottom:18}}>
              <div style={{color:"#aebfe0",display:"flex",alignItems:"flex-end"}}>{cur&&wxGlyph(cur.code,72)}</div>
              <div>
                <div style={{fontSize:60,fontWeight:800,color:T.text,lineHeight:1,letterSpacing:"-2px"}}>{cur.temp}°</div>
                <div style={{fontSize:17,color:T.text2,marginTop:6}}>{desc}</div>
                <div style={{fontSize:12,color:T.text3,marginTop:3}}>Feels like {cur.feelsLike}°C</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[["droplet","Humidity",cur.humidity+"%"],["wind","Wind",cur.wind+" km/h"],["cloudrain","Rain chance",cur.rain+"%"]].map(function(row){return(
                <div key={row[1]} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:"0.5px solid "+T.border,textAlign:"center"}}>
                  <div style={{color:"#aebfe0",display:"flex",justifyContent:"center",marginBottom:5}}><UIcon name={row[0]} size={22}/></div>
                  <div style={{fontSize:10,color:T.text3,marginBottom:3}}>{row[1]}</div>
                  <div style={{fontSize:16,fontWeight:700,color:T.text}}>{row[2]}</div>
                </div>
              );})}
            </div>
          </div>}

          {/* 24-hour timeline */}
          {wx&&wx.hourly&&wx.hourly.length>0&&<div style={{padding:"18px 22px 20px",borderBottom:"0.5px solid "+T.border}}>
            <div style={{fontSize:11,fontWeight:700,color:T.text2,marginBottom:12,letterSpacing:0.3}}>24-hour forecast</div>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
              {wx.hourly.map(function(h,i){const isNow=i===0;return(
                <div key={h.time} style={{flexShrink:0,textAlign:"center",padding:"12px 8px",borderRadius:12,background:isNow?"rgba(91,140,255,0.18)":"rgba(255,255,255,0.03)",border:"0.5px solid "+(isNow?T.accent+"":(T.border)),minWidth:64,position:"relative"}}>
                  {isNow&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2,borderRadius:1,background:T.accent}}/>}
                  <div style={{fontSize:10,color:isNow?T.accent:T.text3,fontWeight:isNow?700:400,marginBottom:6}}>{isNow?"Now":fmtHour(h.time)}</div>
                  <div style={{color:"#aebfe0",display:"flex",justifyContent:"center",marginBottom:6}}>{wxGlyph(h.code,24)}</div>
                  <div style={{fontSize:14,fontWeight:700,color:T.text}}>{h.temp}°</div>
                  {h.rain>0&&<div style={{fontSize:10,color:T.warn,marginTop:4,fontWeight:600}}>{h.rain}%</div>}
                </div>
              );})}
            </div>
          </div>}

          {/* 7-day forecast */}
          {wx&&wx.daily&&wx.daily.length>0&&<div style={{padding:"18px 22px 24px"}}>
            <div style={{fontSize:11,fontWeight:700,color:T.text2,marginBottom:12,letterSpacing:0.3}}>7-day forecast</div>
            {wx.daily.slice(0,7).map(function(d,i){const dDesc=WX_MAP[d.code]||"Unknown";const isSel=selDay===i;return(
              <React.Fragment key={d.date}>
                <div onClick={function(){setSelDay(isSel?null:i);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:isSel?"rgba(91,140,255,0.1)":"rgba(255,255,255,0.02)",border:"0.5px solid "+(isSel?T.accent:T.border),cursor:"pointer",marginBottom:6,transition:"background 0.12s,border 0.12s"}}>
                  <div style={{width:80,fontSize:13,fontWeight:i===0?700:400,color:i===0?T.accent:T.text}}>{fmtDayLabel(d.date,i)}</div>
                  <div style={{color:"#aebfe0",display:"flex",flexShrink:0}}>{wxGlyph(d.code,24)}</div>
                  <div style={{flex:1,fontSize:12,color:T.text2}}>{dDesc}</div>
                  {d.rain>0&&<div style={{fontSize:11,color:T.warn,fontWeight:600,minWidth:34,textAlign:"right"}}>{d.rain}%</div>}
                  <div style={{display:"flex",gap:8,alignItems:"center",minWidth:70,justifyContent:"flex-end"}}>
                    <span style={{fontSize:13,fontWeight:700,color:T.text}}>{d.high}°</span>
                    <span style={{fontSize:11,color:T.text3}}>{d.low}°</span>
                  </div>
                  <div style={{fontSize:12,color:T.text3,marginLeft:2}}>{isSel?"▴":"▾"}</div>
                </div>
                {isSel&&<div style={{padding:"14px 16px",marginBottom:6,borderRadius:10,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.2)"}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:10}}>{fmtFullDate(d.date)}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                    {[["thermometer","High",d.high+"°C"],["thermometer","Low",d.low+"°C"],["cloudrain","Rain",d.rain+"%"]].map(function(row){return(
                      <div key={row[1]} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"10px 12px",border:"0.5px solid "+T.border,textAlign:"center"}}>
                        <div style={{color:"#aebfe0",display:"flex",justifyContent:"center",marginBottom:4}}><UIcon name={row[0]} size={18}/></div>
                        <div style={{fontSize:9,color:T.text3,marginBottom:2}}>{row[1]}</div>
                        <div style={{fontSize:14,fontWeight:700,color:T.text}}>{row[2]}</div>
                      </div>
                    );})}
                  </div>
                </div>}
              </React.Fragment>
            );})}
          </div>}

        </div>
      </div>}
    </>
  );
}

function GymSection(props){
  const gymData=props.gymData;const onAddEx=props.onAddEx;const onLogW=props.onLogW;const onSave=props.onSave;const onUpdateRot=props.onUpdateRot;const onDeleteBW=props.onDeleteBW;const onAddBW=props.onAddBW;const mob=props.mob||false;
  const [wkt,setWkt]=useState({name:"",date:todayStr(),sets:[]});
  const [row,setRow]=useState({exercise:"",sets:"",reps:"",weight:""});
  const [rName,setRName]=useState("");const [rFocus,setRFocus]=useState("");
  const [dragIdx,setDragIdx]=useState(null);const [dragOver,setDragOver]=useState(null);
  const [editRotIdx,setEditRotIdx]=useState(null);const [editRotForm,setEditRotForm]=useState({rName:"",rFocus:"",exercises:[]});
  const [showArchive,setShowArchive]=useState(false);const [showProgress,setShowProgress]=useState(true);const [expandedWktId,setExpandedWktId]=useState(null);
  const [bwInput,setBwInput]=useState("");const [editWktName,setEditWktName]=useState(false);
  const rotation=gymData.rotation||[];const rotLen=rotation.length>0?rotation.length:1;
  const rotIdx=(gymData.rotIdx||0)%rotLen;const nextSess=rotation.length>0?rotation[rotIdx]:null;
  useEffect(function(){
    try{
      var draft=JSON.parse(localStorage.getItem('gym_tab_draft')||'null');
      if(draft&&nextSess&&draft.rotId===nextSess.id&&draft.sets&&draft.sets.some(function(r){return r.exercise;})){
        setWkt(function(w){return w.sets.length>0&&w.sets.some(function(r){return r.exercise;})?w:{...w,sets:draft.sets};});
        return;
      }
    }catch(_){}
    if(!nextSess||!nextSess.exercises||nextSess.exercises.length===0)return;
    setWkt(function(w){
      if(w.sets.length>0&&w.sets.some(function(r){return r.exercise;}))return w;
      return{...w,sets:nextSess.exercises.map(function(ex,i){return{id:ex.id||i+1,exercise:ex.exercise||"",sets:ex.sets||"",reps:ex.reps||"",weight:ex.weight||""};})};
    });
  },[nextSess?nextSess.id:null]);
  useEffect(function(){
    if(!nextSess||wkt.sets.length===0)return;
    try{localStorage.setItem('gym_tab_draft',JSON.stringify({rotId:nextSess?nextSess.id:null,sets:wkt.sets,savedAt:Date.now()}));}catch(_){}
  },[wkt.sets]);
  const gs={card:{position:"relative",background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:20,padding:"18px 20px",marginBottom:12,boxShadow:cardShadow},btn:{...btnGlass,padding:"5px 12px"},btnP:{...btnGlassP},inp:{width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.05)",color:T.text,fontSize:12,boxSizing:"border-box"},acc:{background:T.bg3,borderRadius:12,padding:"10px 14px",marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",border:"0.5px solid "+T.border,userSelect:"none"}};
  function gCellEdge(g){return{borderBottom:"1.5px solid rgba("+g+",0.45)",boxShadow:"inset 0 -10px 22px rgba("+g+",0.16)"}}
  function getExPrev(name){const ex=(gymData.exercises||[]).find(function(e){return e.name&&e.name.toLowerCase()===name.toLowerCase();});if(!ex||!ex.logs||!ex.logs.length)return null;return ex.logs[ex.logs.length-1].weight;}
  const currentMonth=todayStr().slice(0,7);
  const sessThisMonth=(gymData.workouts||[]).filter(function(w){return w.date&&w.date.startsWith(currentMonth);}).length;
  function calcStreak(){const dates=new Set((gymData.workouts||[]).map(function(w){return w.date;}));const msDay=86400000;const now=new Date();const dow=now.getDay()||7;var ws=new Date(now.getTime()-((dow-1)*msDay));var s=0;while(s<52){const we=new Date(ws.getTime()+(6*msDay));var hit=false;for(var d=new Date(ws);d<=we;d=new Date(d.getTime()+msDay)){if(dates.has(d.toISOString().slice(0,10))){hit=true;break;}}if(!hit)break;s++;ws=new Date(ws.getTime()-(7*msDay));}return s;}
  const streak=calcStreak();
  const bwArr=gymData.bodyWeight||[];const lastBW=bwArr.length>0?bwArr[bwArr.length-1]:null;const prevBW=bwArr.length>1?bwArr[bwArr.length-2]:null;const bwDiff=lastBW&&prevBW?lastBW.weight-prevBW.weight:null;const bwTrend=bwDiff===null?null:bwDiff>0?"↑":bwDiff<0?"↓":"=";
  const topLiftName=nextSess&&nextSess.exercises&&nextSess.exercises.length>0?nextSess.exercises[0].exercise:null;const topLiftPrev=topLiftName?getExPrev(topLiftName):null;
  function addRow(){if(!row.exercise)return;trk("gym.set_log");setWkt(function(w){return{...w,sets:[...w.sets,{...row,id:Date.now()}]};});setRow({exercise:"",sets:"",reps:"",weight:""});}
  function removeRow(i){setWkt(function(w){return{...w,sets:w.sets.filter(function(_,j){return j!==i;})};});}
  function saveWkt(){
    if(window.DataValidator){const name=wkt.name||(nextSess?nextSess.name:"Workout");const r=DataValidator.validate("gymWorkout",{name:name,date:wkt.date||todayStr(),sets:wkt.sets});if(!r.valid){if(window.showToast)window.showToast(r.firstError);return;}}else if(wkt.sets.length===0)return;
    const name=wkt.name||(nextSess?nextSess.name:"Workout");const rotId=nextSess?nextSess.id:null;
    if(onSave){trk("gym.workout_save");onSave({...wkt,name:name,id:Date.now(),rotId:rotId});}
    try{localStorage.removeItem('gym_tab_draft');}catch(_){}
    setWkt({name:"",date:todayStr(),sets:[]});setEditWktName(false);
    if(window.showToast)window.showToast("Workout saved!","success");
  }
  function addRotItem(){if(!rName)return;const nr=rotation.concat([{id:Date.now(),name:rName,focus:rFocus,exercises:[]}]);if(onUpdateRot)onUpdateRot(nr,rotIdx);setRName("");setRFocus("");}
  function removeRotItem(id){const nr=rotation.filter(function(r){return r.id!==id;});if(onUpdateRot)onUpdateRot(nr,Math.min(rotIdx,Math.max(0,nr.length-1)));}
  function handleDragStart(i){setDragIdx(i);}
  function handleDragOver(e,i){e.preventDefault();setDragOver(i);}
  function handleDrop(i){if(dragIdx===null||dragIdx===i){setDragIdx(null);setDragOver(null);return;}var nr=rotation.slice();var moved=nr.splice(dragIdx,1)[0];nr.splice(i,0,moved);var ni=rotIdx;if(rotIdx===dragIdx)ni=i;else if(dragIdx<rotIdx&&i>=rotIdx)ni=rotIdx-1;else if(dragIdx>rotIdx&&i<=rotIdx)ni=rotIdx+1;if(onUpdateRot)onUpdateRot(nr,ni);setDragIdx(null);setDragOver(null);}
  function logBWInline(){if(!bwInput)return;const w=Number(bwInput);if(isNaN(w)||w<30||w>300){if(window.showToast)window.showToast("Enter a valid weight (30–300 kg)");return;}if(onAddBW)onAddBW({date:todayStr(),weight:w});setBwInput("");}
  const archiveCount=(gymData.workouts||[]).length;const exCount=(gymData.exercises||[]).length;
  const exNames=(function(){var seen={};var names=[];(gymData.exercises||[]).forEach(function(ex){var n=(ex.name||"").trim();if(n&&!seen[n.toLowerCase()]){seen[n.toLowerCase()]=true;names.push(n);}});(gymData.rotation||[]).forEach(function(r){(r.exercises||[]).forEach(function(ex){var n=(ex.exercise||"").trim();if(n&&!seen[n.toLowerCase()]){seen[n.toLowerCase()]=true;names.push(n);}});});return names;})();
  function drawBWSpark(){
    if(bwArr.length<2)return null;
    const vals=bwArr.map(function(d){return d.weight;});const mn=Math.min.apply(null,vals);const mx=Math.max.apply(null,vals);const range=mx-mn||1;
    const W=400;const H=54;const pad=5;
    function px(i){return(i/(vals.length-1))*W;}
    function py(v){return H-pad-((v-mn)/range)*(H-pad*2);}
    const linePts=vals.map(function(v,i){return px(i)+","+py(v);}).join(" ");
    const areaD="M "+vals.map(function(v,i){return px(i)+" "+py(v);}).join(" L ")+" L "+W+" "+H+" L 0 "+H+" Z";
    const lx=px(vals.length-1);const ly=py(vals[vals.length-1]);
    return(
      <div>
        <svg width="100%" height="54" viewBox="0 0 400 54" preserveAspectRatio="none" style={{display:"block",overflow:"visible"}}>
          <defs><linearGradient id="gymBwG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5b8cff" stopOpacity="0.20"/><stop offset="100%" stopColor="#5b8cff" stopOpacity="0"/></linearGradient></defs>
          <path d={areaD} fill="url(#gymBwG)"/>
          <polyline points={linePts} fill="none" stroke="#5b8cff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
          <circle cx={lx} cy={ly} r="3.5" fill="#5b8cff"/>
        </svg>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
          <span style={{fontSize:9,color:T.text3}}>{fmtDate(bwArr[0].date)}</span>
          <span style={{fontSize:9,color:T.text3}}>{fmtDate(bwArr[bwArr.length-1].date)}</span>
        </div>
      </div>
    );
  }
  function drawMiniSpark(logs){
    if(!logs||logs.length<2)return null;
    const vals=logs.map(function(l){return l.weight;});const mn=Math.min.apply(null,vals);const mx=Math.max.apply(null,vals);const range=mx-mn||1;
    const W=72;const H=22;
    const pts=vals.map(function(v,i){return((i/(vals.length-1))*W)+","+(H-2-((v-mn)/range)*(H-4));}).join(" ");
    return(<svg width={W} height={H} style={{display:"block",overflow:"visible",flexShrink:0}}><polyline points={pts} fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.8"/></svg>);
  }
  const wktsByMonth=(function(){const groups={};(gymData.workouts||[]).forEach(function(wk){const m=wk.date?wk.date.slice(0,7):"unknown";if(!groups[m])groups[m]=[];groups[m].push(wk);});return Object.keys(groups).sort(function(a,b){return b.localeCompare(a);}).map(function(m){return{month:m,workouts:groups[m].slice().reverse()};});})();
  function fmtMonth(ym){const parts=ym.split("-");const names=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return(names[parseInt(parts[1])-1]||parts[1])+" "+parts[0];}
  return(
    <div style={{maxWidth:800}}>
      <datalist id="gymExSuggestions">{exNames.map(function(n){return React.createElement("option",{key:n,value:n});})}</datalist>

      {/* 1 — Hero: Today's Session */}
      <div className="card-rim" style={gs.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,color:T.accent,letterSpacing:0.8}}>Today's session</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {rotation.length>0&&<span style={{fontSize:10,color:T.text3,background:T.bg3,borderRadius:99,padding:"2px 8px",flexShrink:0}}>{rotIdx+1} of {rotation.length}</span>}
            <input style={{...gs.inp,width:130,padding:"4px 8px",fontSize:11}} type="date" value={wkt.date} onChange={function(ev){setWkt(function(w){return{...w,date:ev.target.value};});}}/>
          </div>
        </div>
        {nextSess?(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
              {editWktName?(
                <input style={{...gs.inp,fontSize:15,fontWeight:700,padding:"3px 8px",flex:1}} value={wkt.name||nextSess.name} onChange={function(ev){setWkt(function(w){return{...w,name:ev.target.value};});}} onBlur={function(){setEditWktName(false);}} autoFocus/>
              ):(
                <div style={{fontSize:17,fontWeight:700,color:T.text}}>{wkt.name||nextSess.name}</div>
              )}
              <button style={{background:"none",border:"none",cursor:"pointer",color:T.text3,padding:0,lineHeight:1}} onClick={function(){setEditWktName(true);}}><UIcon name="pencil" size={11}/></button>
            </div>
            <div style={{fontSize:12,color:T.text2,marginTop:2}}>{nextSess.focus}</div>
            {rotation.length>1&&(function(){
              const cyclesCompleted=Math.floor((gymData.rotIdx||0)/rotation.length);
              return(
                <div style={{marginTop:10}}>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
                    {rotation.map(function(r,i){const done=i<rotIdx;const cur=i===rotIdx;return(
                      <div key={r.id} style={{fontSize:10,padding:"3px 10px",borderRadius:99,fontWeight:cur?600:400,color:cur?T.accent:done?T.text2:T.text3,background:cur?T.accentBg:done?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.03)",border:"0.5px solid "+(cur?T.accent+"80":done?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.06)"),transition:"background 0.15s,border 0.15s,color 0.15s"}}>{r.name}</div>
                    );})}
                  </div>
                  <div style={{fontSize:10,color:T.text3}}>Cycle {cyclesCompleted+1}{cyclesCompleted>0?" · "+cyclesCompleted+" complete":""} · {rotation.length-rotIdx-1} session{rotation.length-rotIdx-1!==1?"s":""} until repeat</div>
                </div>
              );
            })()}
          </div>
        ):(
          <div style={{fontSize:13,color:T.text2}}>No rotation set — add one below ↓</div>
        )}
      </div>

      {/* 2 — Stats Strip */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        {[
          {label:"BODY WT",val:lastBW?lastBW.weight+"kg"+(bwTrend?" "+bwTrend:""):"—",g:bwTrend==="↑"?"34,197,94":bwTrend==="↓"?"239,68,68":"148,163,184"},
          {label:"TOP LIFT",val:topLiftPrev!=null?topLiftPrev+"kg"+(topLiftName?" · "+topLiftName.split(" ")[0]:""):"—",g:"91,140,255"},
          {label:"THIS MONTH",val:sessThisMonth+" sess",g:"91,140,255"},
          {label:"STREAK",val:streak>0?streak+" wk":"—",g:streak>0?"34,197,94":"148,163,184"}
        ].map(function(c,i){return(
          <div key={i} style={{flex:1,minWidth:mob?130:110,background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:14,padding:"10px 14px",boxShadow:cardShadowSoft,...gCellEdge(c.g)}}>
            <div style={{fontSize:9,fontWeight:700,color:"#8f97a6",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>{c.label}</div>
            <div style={{fontSize:15,fontWeight:700,color:T.text,fontVariantNumeric:"tabular-nums"}}>{c.val}</div>
          </div>
        );})}
      </div>

      {/* 3 — Workout Log */}
      <div className="card-rim" style={gs.card}>
        <div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:12}}>Log Workout</div>
        {!mob&&wkt.sets.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 52px 44px 44px 62px 36px",gap:6,marginBottom:4,paddingLeft:2}}>
            {["Exercise","Prev","Sets","Reps","kg",""].map(function(h,i){return<div key={i} style={{fontSize:9,color:T.text3,fontWeight:600}}>{h}</div>;})}
          </div>
        )}
        {wkt.sets.length>0&&<div style={{marginBottom:10}}>
          {wkt.sets.map(function(ws,wi){
            const prev=getExPrev(ws.exercise);
            return mob?(
              <div key={ws.id||wi} style={{padding:"8px 10px",background:T.bg3,borderRadius:8,marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:500,color:T.text}}>{ws.exercise}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {prev!=null&&<span style={{fontSize:10,color:T.text3}}>prev {prev}kg</span>}
                    <button onClick={function(){removeRow(wi);}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:14,padding:0}}>×</button>
                  </div>
                </div>
                <div style={{fontSize:11,color:T.text2}}>{ws.sets}×{ws.reps} @ {ws.weight}kg</div>
              </div>
            ):(
              <div key={ws.id||wi} style={{display:"grid",gridTemplateColumns:"1fr 52px 44px 44px 62px 36px",gap:6,alignItems:"center",padding:"5px 8px",background:T.bg3,borderRadius:8,marginBottom:4}}>
                <span style={{fontSize:12,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ws.exercise}</span>
                <span style={{fontSize:10,color:T.text3,textAlign:"center"}}>{prev!=null?prev+"kg":"—"}</span>
                <span style={{fontSize:12,color:T.text2,textAlign:"center"}}>{ws.sets}</span>
                <span style={{fontSize:12,color:T.text2,textAlign:"center"}}>{ws.reps}</span>
                <span style={{fontSize:12,color:T.text,textAlign:"center"}}>{ws.weight}kg</span>
                <button onClick={function(){removeRow(wi);}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:14,padding:0}}>×</button>
              </div>
            );
          })}
        </div>}
        {mob?(<div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:10}}>
          <input style={{...gs.inp,padding:"10px 12px",fontSize:14}} list="gymExSuggestions" placeholder="Exercise (e.g. Squat)" value={row.exercise} onChange={function(ev){setRow(function(r){return{...r,exercise:ev.target.value};});}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <input style={{...gs.inp,padding:"10px 12px",fontSize:14}} type="number" placeholder="Sets" value={row.sets} onChange={function(ev){setRow(function(r){return{...r,sets:ev.target.value};});}}/>
            <input style={{...gs.inp,padding:"10px 12px",fontSize:14}} type="number" placeholder="Reps" value={row.reps} onChange={function(ev){setRow(function(r){return{...r,reps:ev.target.value};});}}/>
            <input style={{...gs.inp,padding:"10px 12px",fontSize:14}} type="number" placeholder="kg" value={row.weight} onChange={function(ev){setRow(function(r){return{...r,weight:ev.target.value};});}}/>
          </div>
          <button style={{...gs.btnP,padding:"10px",fontSize:14,borderRadius:10}} onClick={addRow}>+ Add set</button>
        </div>):(<div>
          {!mob&&<div style={{display:"grid",gridTemplateColumns:"1fr 52px 44px 44px 62px 36px",gap:6,marginBottom:4,paddingLeft:2}}>
            {wkt.sets.length===0&&["Exercise","","Sets","Reps","kg",""].map(function(h,i){return<div key={i} style={{fontSize:9,color:T.text3}}>{h}</div>;})}
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 52px 44px 44px 62px 36px",gap:6,marginBottom:10}}>
            <input style={gs.inp} list="gymExSuggestions" placeholder="e.g. Squat" value={row.exercise} onChange={function(ev){setRow(function(r){return{...r,exercise:ev.target.value};});}}/>
            <div style={{background:T.bg3,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:T.text3}}>prev</span></div>
            <input style={gs.inp} type="number" placeholder="4" value={row.sets} onChange={function(ev){setRow(function(r){return{...r,sets:ev.target.value};});}}/>
            <input style={gs.inp} type="number" placeholder="8" value={row.reps} onChange={function(ev){setRow(function(r){return{...r,reps:ev.target.value};});}}/>
            <input style={gs.inp} type="number" placeholder="80" value={row.weight} onChange={function(ev){setRow(function(r){return{...r,weight:ev.target.value};});}}/>
            <button style={gs.btnP} onClick={addRow}>+</button>
          </div>
        </div>)}
        <button style={{...gs.btnP,width:"100%"}} onClick={saveWkt}>Save & advance rotation →</button>
      </div>

      {/* 4 — Body Weight */}
      <div className="card-rim" style={gs.card}>
        <div style={{fontSize:11,fontWeight:600,color:T.text2,letterSpacing:"0.03em",marginBottom:10}}>Body Weight</div>
        <div style={{display:"flex",gap:16,alignItems:"flex-start",flexDirection:mob?"column":"row"}}>
          <div style={{flex:2,minWidth:0}}>
            {bwArr.length>1?drawBWSpark():<div style={{fontSize:11,color:T.text3,padding:"14px 0"}}>Log a few entries to see your trend</div>}
          </div>
          <div style={{flex:1,minWidth:116}}>
            <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
              <input style={{...gs.inp,padding:"6px 8px",textAlign:"center",flex:1}} type="number" step="0.1" placeholder="82.0" value={bwInput} onChange={function(ev){setBwInput(ev.target.value);}} onKeyDown={function(ev){if(ev.key==="Enter")logBWInline();}}/>
              <span style={{fontSize:11,color:T.text3,flexShrink:0}}>kg</span>
              <button style={{...gs.btnP,flexShrink:0,padding:"5px 10px",fontSize:11}} onClick={logBWInline}>Log</button>
            </div>
            {bwArr.length>0&&<div style={{display:"flex",flexDirection:"column",gap:2}}>
              {bwArr.slice(-4).reverse().map(function(l,i){return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10}}>
                  <span style={{color:T.text2}}>{fmtDate(l.date)}: {l.weight}kg</span>
                  <button style={{background:"none",border:"none",cursor:"pointer",color:T.text3,fontSize:11,opacity:0.45,lineHeight:1,padding:"0 2px"}} onClick={function(){onDeleteBW&&onDeleteBW(l.date);}}>×</button>
                </div>
              );})}
            </div>}
          </div>
        </div>
      </div>

      {/* 5 — Exercise History (compact) */}
      <div className="card-rim" style={gs.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:exCount>0&&showProgress?10:0}}>
          <span style={{fontSize:13,fontWeight:500,color:T.text}}>Exercise History{exCount>0?" ("+exCount+")":""}</span>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button style={{...gs.btn,fontSize:10,padding:"2px 8px"}} onClick={function(){onAddEx&&onAddEx();}}>+ Exercise</button>
            <button style={{background:"none",border:"none",cursor:"pointer",color:T.text3,fontSize:13,lineHeight:1,padding:"2px 4px"}} onClick={function(){setShowProgress(function(v){return!v;});}}>{showProgress?"▾":"▸"}</button>
          </div>
        </div>
        {showProgress&&(exCount===0?(
          <div style={{fontSize:12,color:T.text2,paddingTop:8}}>No exercises tracked yet.</div>
        ):(gymData.exercises||[]).map(function(ex,ei){
          const logs=ex.logs||[];const last=logs.length>0?logs[logs.length-1]:null;const prev2=logs.length>1?logs[logs.length-2]:null;const diff=(last&&prev2)?last.weight-prev2.weight:null;const trend=diff===null?null:diff>0?"↑":diff<0?"↓":"=";const tCol=trend==="↑"?T.success:trend==="↓"?T.danger:T.text3;
          return(
            <div key={ex.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:"0.5px solid "+T.border}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:500,color:T.text,marginBottom:1}}>{ex.name}</div>
                <div style={{fontSize:10,color:T.text3,display:"flex",alignItems:"center",gap:4}}>
                  {last?<span>{last.weight}kg</span>:<span>no data</span>}
                  {trend&&<span style={{color:tCol,fontSize:11}}>{trend}</span>}
                </div>
              </div>
              <div style={{flexShrink:0}}>{drawMiniSpark(logs)}</div>
              <button style={{...gs.btn,fontSize:10,padding:"2px 7px",flexShrink:0}} onClick={function(){if(onLogW)onLogW(ex);}}>Log</button>
            </div>
          );
        }))}
      </div>

      {/* 6 — Rotation (static) */}
      <div className="card-rim" style={gs.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:13,fontWeight:500,color:T.text}}>Manage Rotation</span>
          {rotation.length>0&&<span style={{fontSize:10,color:T.text3}}>drag to reorder</span>}
        </div>
        {rotation.map(function(r,i){const isCur=i===rotIdx;const isDragTarget=dragOver===i&&dragIdx!==null&&dragIdx!==i;return(<React.Fragment key={r.id}>
          <div draggable onDragStart={function(){handleDragStart(i);}} onDragOver={function(e){handleDragOver(e,i);}} onDrop={function(){handleDrop(i);}} onDragEnd={function(){setDragIdx(null);setDragOver(null);}}
            style={{display:"flex",alignItems:"center",gap:8,marginBottom:editRotIdx===i?4:8,padding:"10px 12px",borderRadius:8,background:isDragTarget?"rgba(91,140,255,0.12)":isCur?T.accentBg:T.bg3,border:"0.5px solid "+(isDragTarget?T.accent:isCur?T.accent+"60":T.border),opacity:dragIdx===i?0.5:1,cursor:"grab",transition:"background 0.15s,border 0.15s"}}>
            <span style={{display:"flex",color:T.text3,cursor:"grab",userSelect:"none",flexShrink:0}}><UIcon name="drag" size={14}/></span>
            <div style={{width:22,height:22,borderRadius:"50%",background:isCur?T.accent:"rgba(255,255,255,0.06)",border:"1px solid "+(isCur?T.accent:T.border2),display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:isCur?"#fff":T.text3,flexShrink:0}}>{i+1}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:isCur?600:400,color:T.text}}>{r.name}{isCur&&<span style={{fontSize:10,color:T.accent,marginLeft:8}}>← next</span>}</div><div style={{fontSize:10,color:T.text2}}>{r.focus}{(r.exercises&&r.exercises.length>0)&&<span style={{marginLeft:6,color:T.text3}}>{r.exercises.length} ex</span>}</div></div>
            <button onClick={function(e){e.stopPropagation();trk("gym.rotation_advance");if(onUpdateRot)onUpdateRot(rotation,i);}} style={{...gs.btn,fontSize:10,padding:"2px 7px"}}>Set current</button>
            <button onClick={function(e){e.stopPropagation();const exs=(r.exercises&&r.exercises.length>0)?r.exercises.map(function(ex){return{...ex};}):Array(3).fill(null).map(function(_,j){return{id:j+1,exercise:"",sets:"",reps:"",weight:""};});setEditRotIdx(editRotIdx===i?null:i);setEditRotForm({rName:r.name,rFocus:r.focus||"",exercises:exs});}} style={editRotIdx===i?{...editPill,color:T.accent,border:"1px solid rgba(91,140,255,0.5)",background:"rgba(91,140,255,0.14)"}:editPill}><UIcon name="pencil" size={11}/>Edit</button>
            <button onClick={function(e){e.stopPropagation();removeRotItem(r.id);}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:14}}>×</button>
          </div>
          {editRotIdx===i&&<div style={{padding:"12px",borderRadius:8,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.2)",marginBottom:8}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
              <div><div style={{fontSize:10,color:T.text2,marginBottom:3}}>Session name</div><input style={gs.inp} value={editRotForm.rName} onChange={function(ev){var v=ev.target.value;setEditRotForm(function(f){return{...f,rName:v};});}}/></div>
              <div><div style={{fontSize:10,color:T.text2,marginBottom:3}}>Focus muscles</div><input style={gs.inp} placeholder="e.g. Chest, Triceps" value={editRotForm.rFocus} onChange={function(ev){var v=ev.target.value;setEditRotForm(function(f){return{...f,rFocus:v};});}}/></div>
            </div>
            <div style={{fontSize:10,color:T.text2,marginBottom:4}}>Exercises</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 44px 44px 52px 24px",gap:4,marginBottom:3}}>{["Exercise","Sets","Reps","kg",""].map(function(h,hi){return<div key={hi} style={{fontSize:9,color:T.text3}}>{h}</div>;})}</div>
            {(editRotForm.exercises||[]).map(function(ex,ei){return(<div key={ex.id||ei} style={{display:"grid",gridTemplateColumns:"1fr 44px 44px 52px 24px",gap:4,marginBottom:4}}>
              <input style={{...gs.inp,padding:"4px 6px",fontSize:11}} list="gymExSuggestions" placeholder="Exercise" value={ex.exercise||""} onChange={function(ev){var v=ev.target.value;setEditRotForm(function(f){return{...f,exercises:f.exercises.map(function(e,j){return j===ei?{...e,exercise:v}:e;})};});}}/>
              <input style={{...gs.inp,padding:"4px 3px",fontSize:11}} type="number" placeholder="4" value={ex.sets||""} onChange={function(ev){var v=ev.target.value;setEditRotForm(function(f){return{...f,exercises:f.exercises.map(function(e,j){return j===ei?{...e,sets:v}:e;})};});}}/>
              <input style={{...gs.inp,padding:"4px 3px",fontSize:11}} type="number" placeholder="8" value={ex.reps||""} onChange={function(ev){var v=ev.target.value;setEditRotForm(function(f){return{...f,exercises:f.exercises.map(function(e,j){return j===ei?{...e,reps:v}:e;})};});}}/>
              <input style={{...gs.inp,padding:"4px 3px",fontSize:11}} type="number" placeholder="80" value={ex.weight||""} onChange={function(ev){var v=ev.target.value;setEditRotForm(function(f){return{...f,exercises:f.exercises.map(function(e,j){return j===ei?{...e,weight:v}:e;})};});}}/>
              <button style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:13,padding:0}} onClick={function(){setEditRotForm(function(f){return{...f,exercises:f.exercises.filter(function(_,j){return j!==ei;})};});}}>×</button>
            </div>);})}
            <div style={{display:"flex",gap:6,marginTop:6}}>
              <button style={{...gs.btn,fontSize:10,padding:"2px 8px"}} onClick={function(){setEditRotForm(function(f){return{...f,exercises:(f.exercises||[]).concat([{id:Date.now(),exercise:"",sets:"",reps:"",weight:""}])};});}}>+ Row</button>
              <button style={{...gs.btnP,fontSize:10,padding:"3px 10px"}} onClick={function(){trk("gym.rotation_edit");var nr=rotation.map(function(rt,ri){return ri===i?{...rt,name:editRotForm.rName||rt.name,focus:editRotForm.rFocus,exercises:(editRotForm.exercises||[]).filter(function(ex){return ex.exercise&&ex.exercise.trim();})}:rt;});if(onUpdateRot)onUpdateRot(nr,rotIdx);setEditRotIdx(null);if(window.showToast)window.showToast("Template saved!","success");}}>Save template</button>
              <button style={{...gs.btn,fontSize:10,padding:"2px 8px"}} onClick={function(){setEditRotIdx(null);}}>Cancel</button>
            </div>
          </div>}
        </React.Fragment>);})}
        <div style={{marginTop:14,paddingTop:12,borderTop:"0.5px solid "+T.border}}>
          <div style={{fontSize:11,color:T.text2,marginBottom:8}}>Add to rotation</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:6}}>
            <input style={mob?{...gs.inp,padding:"10px 12px",fontSize:14}:gs.inp} placeholder="Session name" value={rName} onChange={function(ev){setRName(ev.target.value);}}/>
            <input style={mob?{...gs.inp,padding:"10px 12px",fontSize:14}:gs.inp} placeholder="Focus muscles" value={rFocus} onChange={function(ev){setRFocus(ev.target.value);}}/>
          </div>
          <button style={gs.btnP} onClick={addRotItem}>Add session</button>
        </div>
      </div>

      {/* 7 — Past Workouts (grouped, expandable) */}
      <div style={{marginBottom:8}}>
        <div style={gs.acc} onClick={function(){setShowArchive(function(v){return!v;});}}>
          <span style={{fontSize:12,fontWeight:500,color:T.text}}>Past workouts{archiveCount>0?" ("+archiveCount+")":""}</span>
          <span style={{color:T.text3,fontSize:12}}>{showArchive?"▾":"▸"}</span>
        </div>
        {showArchive&&<div style={{paddingTop:4}}>
          {archiveCount===0?(
            <div style={{fontSize:12,color:T.text2,padding:"8px 0"}}>No workouts yet.</div>
          ):wktsByMonth.map(function(grp){return(
            <div key={grp.month} style={{marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:T.text3,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6,paddingLeft:2}}>{fmtMonth(grp.month)} · {grp.workouts.length}</div>
              <div className="card-rim" style={{...gs.card,padding:"0",marginBottom:0,overflow:"hidden"}}>
                {grp.workouts.map(function(wk,wi){const rotMatch=rotation.filter(function(r){return r.id===wk.rotId;});const rotFocus=rotMatch.length>0?rotMatch[0].focus:null;const isExp=expandedWktId===wk.id;return(
                  <div key={wk.id} style={{borderBottom:wi<grp.workouts.length-1?"0.5px solid "+T.border:"none"}}>
                    <div onClick={function(){setExpandedWktId(isExp?null:wk.id);}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",cursor:"pointer"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <span style={{fontSize:12,fontWeight:500,color:T.text}}>{wk.name}</span>
                        {rotFocus&&<span style={{fontSize:10,color:T.text3,marginLeft:8}}>{rotFocus}</span>}
                      </div>
                      <span style={{fontSize:10,color:T.text3,flexShrink:0}}>{fmtDate(wk.date)}</span>
                      <span style={{fontSize:10,color:T.text3,flexShrink:0,minWidth:36,textAlign:"right"}}>{(wk.sets||[]).length} sets</span>
                      <span style={{fontSize:11,color:T.text3,marginLeft:2}}>{isExp?"▾":"▸"}</span>
                    </div>
                    {isExp&&<div style={{padding:"2px 16px 10px",borderTop:"0.5px solid "+T.border}}>
                      {(wk.sets||[]).map(function(ws,si){return(
                        <div key={si} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderBottom:si<(wk.sets||[]).length-1?"0.5px solid rgba(255,255,255,0.04)":"none"}}>
                          <span style={{color:T.text2}}>{ws.exercise}</span>
                          <span style={{color:T.text3}}>{ws.sets}×{ws.reps} @ {ws.weight}kg</span>
                        </div>
                      );})}
                    </div>}
                  </div>
                );})}
              </div>
            </div>
          );})}
        </div>}
      </div>

    </div>
  );
}

function FinanceSection({data,onUpdate,mob,gcalEvents}){
  mob=mob||false;
  const [month,setMonth]=useState(todayStr().slice(0,7));
  const [expForm,setExpForm]=useState({name:"",amount:"",cat:"Other"});
  const [editExpId,setEditExpId]=useState(null);
  const [editExpForm,setEditExpForm]=useState({name:"",amount:"",cat:"Other"});
  const [editSrc,setEditSrc]=useState(false);
  const [showRecMgr,setShowRecMgr]=useState(false);
  const [recForm,setRecForm]=useState({name:"",amount:"",cat:"Bills",dueDay:""});
  const fBtnP={...btnGlassP};
  const fInp={width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.05)",color:T.text,fontSize:12,boxSizing:"border-box"};
  function fCard(ex){return{position:"relative",background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:20,padding:"18px 20px",marginBottom:12,boxShadow:cardShadow,...(ex||{})};}
  const fGlassMini={background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:14,boxShadow:cardShadowSoft};
  const fStatLabel={fontSize:10,fontWeight:600,color:"#8f97a6",textTransform:"uppercase",letterSpacing:"0.05em"};
  const fST={fontSize:13,fontWeight:600,marginBottom:0,color:"#cdd5e2",letterSpacing:"-0.01em"};
  function fmtNum(n){return n.toLocaleString("en-AU",{minimumFractionDigits:2,maximumFractionDigits:2});}
  function fmtRound(n){return Math.round(n).toLocaleString("en-AU");}
  const CATS=["Bills","Addiction","Other"];
  const CAT_COL={Bills:T.accent,Addiction:T.danger,Other:T.warn};
  const sources=data.sources||[{id:1,name:"GoTab (Rippling)",amount:0},{id:2,name:"Jobseeker",amount:802.40},{id:3,name:"",amount:0}];
  const monthlyIncome=data.monthlyIncome||{};
  const allExpenses=data.expenses||[];
  const recurringTemplates=data.recurringTemplates||[];
  const monthlyRecurringOverrides=data.monthlyRecurringOverrides||{};
  const monthOverrides=monthlyRecurringOverrides[month]||{};
  const recurringThisMonth=recurringTemplates.filter(function(t){return !(monthOverrides[t.id]&&monthOverrides[t.id].excluded);}).map(function(t){const ov=monthOverrides[t.id];return{...t,amount:ov&&ov.amount!==undefined?ov.amount:t.amount,isRecurring:true};});
  const skippedThisMonth=recurringTemplates.filter(function(t){return monthOverrides[t.id]&&monthOverrides[t.id].excluded;});
  const oneOffThisMonth=allExpenses.filter(function(e){return e.month===month;});
  const allThisMonth=recurringThisMonth.concat(oneOffThisMonth);
  const srcAmounts=monthlyIncome[month]||{};
  const hourlyRate=Number(data.hourlyRate||0);
  const monthShifts=(gcalEvents||[]).filter(function(ev){return ev.date&&ev.date.startsWith(month)&&isGoTabEvent(ev);});
  const calcGoTabIncome=hourlyRate>0?monthShifts.reduce(function(a,ev){const pay=shiftPay(ev.time);return a+(pay?pay.totalEquiv*hourlyRate:0);},0):0;
  const totalIncome=sources.reduce(function(a,s){var amt=srcAmounts[s.id]!==undefined?Number(srcAmounts[s.id]):Number(s.amount)||0;if(s.id===1&&calcGoTabIncome>0)amt=calcGoTabIncome;return a+amt;},0);
  const totalExpenses=allThisMonth.reduce(function(a,e){return a+Number(e.amount);},0);
  const net=totalIncome-totalExpenses;
  function updateHourlyRate(val){onUpdate({...data,hourlyRate:Number(val)});}
  const billsRecurring=recurringThisMonth.filter(function(e){return e.cat==="Bills";});
  const billsMonthlyTotal=billsRecurring.reduce(function(a,e){return a+Number(e.amount);},0);
  const weeklyBills=billsMonthlyTotal*12/52;
  const oneOffTotal=oneOffThisMonth.reduce(function(a,e){return a+Number(e.amount);},0);
  const disposableBudget=totalIncome-billsMonthlyTotal;
  const _sgCommit=(function(){var _sg=data.savingsGoal||{};var _t=Number(_sg.target)||0;var _c=Number(_sg.current)||0;var _r=Math.max(0,_t-_c);var _dl=_sg.deadline||"";if(!_dl||!_t)return 0;var fp=month.split("-").map(Number);var tp=_dl.split("-").map(Number);var ml=Math.max(0,(tp[0]-fp[0])*12+(tp[1]-fp[1]));return ml>0?_r/ml:0;})();
  const disposableLeft=disposableBudget-oneOffTotal-_sgCommit;
  const weeklyDisposable=disposableLeft/4.33;
  function shiftMonth(n){const d=new Date(month+"-15");d.setMonth(d.getMonth()+n);return d.toISOString().slice(0,7);}
  function fmtM(m){return new Date(m+"-15").toLocaleDateString("en-AU",{month:"long",year:"numeric"});}
  function totalForMonth(m){const mo=monthlyRecurringOverrides[m]||{};const rec=recurringTemplates.filter(function(t){return !(mo[t.id]&&mo[t.id].excluded);}).reduce(function(a,t){return a+Number(mo[t.id]&&mo[t.id].amount!==undefined?mo[t.id].amount:t.amount);},0);const oo=allExpenses.filter(function(e){return e.month===m;}).reduce(function(a,e){return a+Number(e.amount);},0);return rec+oo;}
  function avgExp(){const past=[-3,-2,-1].map(function(o){return totalForMonth(shiftMonth(o));});const nz=past.filter(function(v){return v>0;});return nz.length>0?nz.reduce(function(a,b){return a+b;},0)/nz.length:totalExpenses;}
  const avgE=avgExp();
  const forecast=[1,2,3,4,5,6].map(function(i){const m=shiftMonth(i);return{month:m,income:totalIncome,expenses:avgE,net:totalIncome-avgE};});
  const curDate=new Date(month+"-15");
  const futureMonthsInYear=11-curDate.getMonth();
  function addExpense(){
    if(window.DataValidator){
      const r=DataValidator.validate("financeEntry",{amount:Number(expForm.amount),category:expForm.cat||"Other",date:month+"-01"});
      if(!r.valid){if(window.showToast)showToast(r.firstError);return;}
    }else if(!expForm.name||!expForm.amount)return;
    trk("finance.expense_add");
    onUpdate({...data,expenses:allExpenses.concat([{id:Date.now(),name:expForm.name,amount:Number(expForm.amount),cat:expForm.cat,month:month}])});
    setExpForm({name:"",amount:"",cat:"Other"});
    if(window.showToast)showToast("Expense added!","success");
  }
  function removeOneOff(id){onUpdate({...data,expenses:allExpenses.filter(function(e){return e.id!==id;})});}
  function saveEditExp(){if(!editExpForm.name||!editExpForm.amount)return;trk("finance.expense_edit");onUpdate({...data,expenses:allExpenses.map(function(e){return e.id===editExpId?{...e,name:editExpForm.name,amount:Number(editExpForm.amount),cat:editExpForm.cat}:e;})});setEditExpId(null);}
  function skipRecurring(tId){const mo={...monthOverrides,[tId]:{...(monthOverrides[tId]||{}),excluded:true}};onUpdate({...data,monthlyRecurringOverrides:{...monthlyRecurringOverrides,[month]:mo}});}
  function restoreRecurring(tId){const mo={...monthOverrides};if(mo[tId]){const n={...mo[tId]};delete n.excluded;mo[tId]=n;}onUpdate({...data,monthlyRecurringOverrides:{...monthlyRecurringOverrides,[month]:mo}});}
  function deleteTemplate(tId){onUpdate({...data,recurringTemplates:recurringTemplates.filter(function(t){return t.id!==tId;})});}
  function addRecurring(){
    if(window.DataValidator){
      const r=DataValidator.validate("financeEntry",{amount:Number(recForm.amount),category:recForm.cat||"Bills",date:month+"-01"});
      if(!r.valid){if(window.showToast)showToast(r.firstError);return;}
    }else if(!recForm.name||!recForm.amount)return;
    onUpdate({...data,recurringTemplates:recurringTemplates.concat([{id:"r"+Date.now(),name:recForm.name,amount:Number(recForm.amount),cat:recForm.cat}])});
    setRecForm({name:"",amount:"",cat:"Bills"});
    if(window.showToast)showToast("Recurring entry added!","success");
  }
  function updateSourceIncome(srcId,val){const mi={...monthlyIncome,[month]:{...(monthlyIncome[month]||{}),[srcId]:Number(val)}};onUpdate({...data,monthlyIncome:mi});}
  function updateSourceName(id,val){onUpdate({...data,sources:sources.map(function(s){return s.id===id?{...s,name:val}:s;})});}
  function updateBudget(val){onUpdate({...data,monthlyBudget:Number(val)});}
  function updateDueDay(tId,val){onUpdate({...data,recurringTemplates:recurringTemplates.map(function(t){return t.id===tId?{...t,dueDay:Number(val)||null}:t;})});}
  function daysUntilDue(dueDay,monthStr){if(!dueDay)return null;var td=new Date();var d=Number(dueDay);var pad=d<10?"0"+d:String(d);var due=new Date(monthStr+"-"+pad+"T12:00:00");return Math.round((due-td)/864e5);}
  function updateSavingsGoal(patch){onUpdate({...data,savingsGoal:{...(data.savingsGoal||{}),  ...patch}});}
  const todayStr_=todayStr();
  const isCurrentMonth=month===todayStr_.slice(0,7);
  const daysInMonth=new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate();
  const daysElapsed=Math.max(1,isCurrentMonth?Number(todayStr_.slice(8,10)):daysInMonth);
  const dailyRate=totalExpenses/daysElapsed;
  const projectedMonthly=dailyRate*daysInMonth;
  const burnDiff=projectedMonthly-totalIncome;
  const sg=data.savingsGoal||{};
  const sgTarget=Number(sg.target)||0;
  const sgCurrent=Number(sg.current)||0;
  const sgDeadline=sg.deadline||"";
  const sgRemaining=Math.max(0,sgTarget-sgCurrent);
  function monthsDiff(from,to){if(!to)return 0;var fp=from.split("-").map(Number);var tp=to.split("-").map(Number);return Math.max(0,(tp[0]-fp[0])*12+(tp[1]-fp[1]));}
  const sgMonthsLeft=monthsDiff(month,sgDeadline);
  const sgPerMonth=sgMonthsLeft>0?sgRemaining/sgMonthsLeft:null;
  const sgShiftsNeeded=sgPerMonth&&hourlyRate>0?Math.ceil(sgPerMonth/(hourlyRate*6)):null;
  const sgProgress=sgTarget>0?Math.min(100,Math.round(sgCurrent/sgTarget*100)):0;
  return(
    <div style={{maxWidth:700}}>
      {/* Month nav */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <button style={editPill} onClick={function(){setMonth(shiftMonth(-1));}}>← prev</button>
        <div style={{flex:1,textAlign:"center",fontSize:15,fontWeight:700,color:T.text}}>{fmtM(month)}</div>
        <button style={editPill} onClick={function(){setMonth(shiftMonth(1));}}>next →</button>
      </div>
      {/* Hero strip */}
      {(function(){
        function cellEdge(g){
          if(!g)return {};
          var rgb=g==="rgba(105,240,174,1)"?"105,240,174":g==="rgba(255,209,102,1)"?"255,209,102":"255,107,107";
          return {borderBottom:"1.5px solid rgba("+rgb+",0.45)",boxShadow:"inset 0 -10px 22px rgba("+rgb+",0.16)"};
        }
        const dispRatio=totalIncome>0?disposableLeft/totalIncome:0;
        const chips=[
          {label:"Income",value:"$"+fmtRound(totalIncome),sub:calcGoTabIncome>0?"GoTab · "+monthShifts.length+" shifts":"manual entry",col:T.text,glow:"rgba(105,240,174,1)"},
          {label:"Expenses",value:"−$"+fmtRound(totalExpenses),sub:recurringThisMonth.length+" fixed · "+oneOffThisMonth.length+" variable",col:T.text,glow:"rgba(255,107,107,1)"},
          {label:"Net",value:(net>=0?"+$":"−$")+fmtRound(Math.abs(net)),sub:net>=0?"surplus":"shortfall",col:T.text,glow:net>=0?"rgba(105,240,174,1)":"rgba(255,107,107,1)"},
          {label:"Disposable",value:(disposableLeft>=0?"$":"−$")+fmtRound(Math.abs(disposableLeft)),sub:_sgCommit>0?"after bills, one-offs & savings":"after bills & one-offs",col:T.text,glow:disposableLeft<=0?"rgba(255,107,107,1)":dispRatio<0.15?"rgba(255,209,102,1)":"rgba(105,240,174,1)"}
        ];
        const stripBase={background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:14,overflow:"hidden",marginBottom:14,boxShadow:cardShadow};
        const cell={padding:mob?"11px 14px":"13px 20px"};
        const divV={width:1,flexShrink:0,alignSelf:"stretch",background:"rgba(255,255,255,0.07)"};
        if(mob){return(
          <div style={{...stripBase,display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,backgroundColor:"rgba(255,255,255,0.07)"}}>
            {chips.map(function(s,i){return(
              <div key={s.label} style={{...cell,...cellEdge(s.glow)}}>
                <div style={{fontSize:9,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:17,fontWeight:500,letterSpacing:"-0.02em",color:s.col,lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{s.value}</div>
                <div style={{fontSize:9,color:T.text3,marginTop:3}}>{s.sub}</div>
              </div>
            );})}
          </div>
        );}
        return(
          <div style={{...stripBase,display:"flex"}}>
            {chips.map(function(s,i){return(
              <React.Fragment key={s.label}>
                {i>0&&<div style={divV}/>}
                <div style={{...cell,flex:1,...cellEdge(s.glow)}}>
                  <div style={{fontSize:9,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>{s.label}</div>
                  <div style={{fontSize:20,fontWeight:500,letterSpacing:"-0.02em",color:s.col,lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{s.value}</div>
                  <div style={{fontSize:9,color:T.text3,marginTop:4}}>{s.sub}</div>
                </div>
              </React.Fragment>
            );})}
          </div>
        );
      })()}
      {/* Burn rate strip */}
      {isCurrentMonth&&totalExpenses>0&&(function(){
        var over=burnDiff>0;
        var edgeRgb=over?"255,107,107":"105,240,174";
        var edgeSt={borderBottom:"1.5px solid rgba("+edgeRgb+",0.45)",boxShadow:"inset 0 -10px 22px rgba("+edgeRgb+",0.13),"+cardShadow};
        var divV={width:1,flexShrink:0,alignSelf:"stretch",background:"rgba(255,255,255,0.07)"};
        var seg={padding:mob?"10px 12px":"11px 18px"};
        var lbl={fontSize:9,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4};
        return(
          <div style={{display:"flex",background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:14,overflow:"hidden",marginBottom:12,...edgeSt}}>
            <div style={{...seg,flex:1}}>
              <div style={lbl}>Daily avg</div>
              <div style={{fontSize:mob?13:15,fontWeight:500,color:T.text,letterSpacing:"-0.01em"}}>${fmtRound(dailyRate)}/day</div>
            </div>
            <div style={divV}/>
            <div style={{...seg,flex:2}}>
              <div style={lbl}>Projected spend</div>
              <div style={{fontSize:mob?13:15,fontWeight:500,color:T.text,letterSpacing:"-0.01em"}}>${fmtRound(projectedMonthly)} <span style={{fontSize:10,fontWeight:400,color:T.text3}}>of ${fmtRound(totalIncome)}</span></div>
            </div>
            <div style={divV}/>
            <div style={{...seg,flexShrink:0}}>
              <div style={lbl}>Month end</div>
              <div style={{fontSize:mob?13:15,fontWeight:500,color:over?T.danger:T.success,letterSpacing:"-0.01em"}}>{over?"▲ $"+fmtRound(burnDiff)+" over":"✓ $"+fmtRound(Math.abs(burnDiff))+" to spare"}</div>
            </div>
          </div>
        );
      })()}
      {/* Income + Bills row */}
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12,marginBottom:12}}>
        {/* Income Sources */}
        <div className="card-rim" style={fCard()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={fST}>Income Sources</div>
            <button style={editSrc?{...editPill,color:T.accent,border:"1px solid rgba(91,140,255,0.5)",background:"rgba(91,140,255,0.14)"}:editPill} onClick={function(){setEditSrc(function(s){return !s;});}}><UIcon name="pencil" size={11}/>{editSrc?"Done":"Edit"}</button>
          </div>
          {sources.map(function(s){const val=srcAmounts[s.id]!==undefined?srcAmounts[s.id]:(s.amount||"");return(
            <div key={s.id} style={{position:"relative",padding:"9px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:6,overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:6,bottom:6,width:2,borderRadius:1,background:T.success,opacity:0.55}}/>
              {editSrc&&<input style={{...fInp,marginBottom:5,fontSize:11}} placeholder={"Source "+s.id} value={s.name} onChange={function(ev){updateSourceName(s.id,ev.target.value);}}/>}
              {!editSrc&&<div style={{fontSize:11,color:T.text2,marginBottom:4}}>{s.name||"Source "+s.id}</div>}
              <input style={{...fInp,padding:"4px 8px",fontSize:13,fontWeight:600}} type="number" step="0.01" placeholder="0.00" value={val} onBlur={function(){trk("finance.income_edit");}} onChange={function(ev){updateSourceIncome(s.id,ev.target.value);}}/>
            </div>
          );})}
          <div style={{position:"relative",padding:"9px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:6,overflow:"hidden"}}>
            <div style={{position:"absolute",left:0,top:6,bottom:6,width:2,borderRadius:1,background:T.text3,opacity:0.35}}/>
            <div style={{fontSize:11,color:T.text2,marginBottom:4}}>Hourly rate ($/hr)</div>
            <input style={{...fInp,padding:"4px 8px",fontSize:12}} type="number" step="0.01" placeholder="e.g. 41.58" value={hourlyRate||""} onChange={function(ev){updateHourlyRate(ev.target.value);}}/>
          </div>
          {hourlyRate>0&&<div style={{position:"relative",padding:"9px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:10,overflow:"hidden"}}>
            <div style={{position:"absolute",left:0,top:6,bottom:6,width:2,borderRadius:1,background:T.accent,opacity:0.7}}/>
            {calcGoTabIncome>0
              ?<div><div style={{fontSize:10,color:T.text3,marginBottom:2}}>GoTab auto-calculated</div><div style={{fontSize:16,fontWeight:700,color:T.accent}}>${fmtNum(calcGoTabIncome)}</div><div style={{fontSize:9,color:T.text3,marginTop:2}}>{monthShifts.length} shift{monthShifts.length!==1?"s":""} · {monthShifts.reduce(function(a,ev){const p=shiftPay(ev.time);return a+(p?p.totalEquiv:0);},0).toFixed(1)}h equiv @ ${hourlyRate}/hr</div></div>
              :<div style={{fontSize:11,color:T.text3}}>No GoTab shifts found for {fmtM(month)}</div>
            }
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"0.5px solid "+T.border}}>
            <span style={{fontSize:11,color:T.text2}}>Total income</span>
            <span style={{fontSize:14,fontWeight:700,color:T.text}}>${fmtNum(totalIncome)}</span>
          </div>
          <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginTop:10,overflow:"hidden",boxShadow:weeklyDisposable<0?"0 0 10px rgba(255,107,107,0.2)":"none"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,borderRadius:"3px 0 0 3px",background:weeklyDisposable>=0?T.success:T.danger}}/>
            <div><div style={{fontSize:11,color:T.text2}}>Weekly disposable</div><div style={{fontSize:9,color:T.text3,marginTop:2}}>{_sgCommit>0?"after bills, one-offs & savings ÷ 4.3 wks":"after bills & one-offs ÷ 4.3 wks"}</div></div>
            <span style={{fontSize:14,fontWeight:700,color:T.text}}>{weeklyDisposable>=0?"$":"−$"}{fmtNum(Math.abs(weeklyDisposable))}</span>
          </div>
        </div>
        {/* Upcoming Bills */}
        <div className="card-rim" style={fCard()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={fST}>Upcoming Bills</div>
            <div style={{fontSize:9,color:T.text3}}>set due day →</div>
          </div>
          {billsRecurring.length===0&&<div style={{fontSize:12,color:T.text3}}>No recurring bills set. Add one via Manage below.</div>}
          {billsRecurring.slice().sort(function(a,b){return (a.dueDay||99)-(b.dueDay||99);}).map(function(b){
            const dd=daysUntilDue(b.dueDay,month);
            const glow=dd===null?"none":dd<0?"0 0 12px rgba(255,107,107,0.35)":dd<=5?"0 0 8px rgba(255,209,102,0.28)":"none";
            const dueLbl=dd===null?null:dd===0?"due today":dd<0?Math.abs(dd)+"d ago":"in "+dd+"d";
            const dueCol=dd===null?T.text3:dd<0?T.danger:dd<=5?T.warn:T.text3;
            return(
              <div key={b.id} style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"9px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,boxShadow:glow,marginBottom:6,overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:6,bottom:6,width:2,borderRadius:1,background:dd!==null&&dd<0?T.danger:T.accent,opacity:dd!==null&&dd<=5?1:0.5}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:4}}>{b.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <input type="number" min={1} max={31} placeholder="day" style={{...fInp,width:40,padding:"2px 5px",fontSize:10,textAlign:"center"}} value={b.dueDay||""} onChange={function(ev){updateDueDay(b.id,ev.target.value);}}/>
                    <span style={{fontSize:9,color:T.text3}}>th</span>
                    {dueLbl&&<span style={{fontSize:9,fontWeight:700,color:dueCol,marginLeft:2}}>{dueLbl}</span>}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>${fmtNum(Number(b.amount))}</div>
                  <div style={{fontSize:9,color:T.text3}}>/mo · ${fmtNum(Number(b.amount)*12/52)}/wk</div>
                </div>
              </div>
            );
          })}
          {billsRecurring.length>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"0.5px solid "+T.border,marginTop:4}}>
            <span style={{fontSize:11,color:T.text2}}>Total bills</span>
            <div>
              <span style={{fontSize:13,fontWeight:700,color:T.text}}>${fmtNum(billsMonthlyTotal)}/mo</span>
              <span style={{fontSize:10,color:T.text3,marginLeft:8}}>${fmtNum(weeklyBills)}/wk</span>
            </div>
          </div>}
        </div>
      </div>
      {/* Expenses card */}
      <div className="card-rim" style={fCard()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={fST}>Expenses — {fmtM(month)}</div>
            <div style={{fontSize:10,color:T.text3,marginTop:3}}>recurring auto-apply · one-off you log manually</div>
          </div>
          <button style={editPill} onClick={function(){setShowRecMgr(function(s){return !s;});}}><UIcon name="gear" size={11}/>Manage</button>
        </div>
        {/* Add expense form */}
        <div style={{padding:"10px 12px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:14}}>
          <div style={{...fStatLabel,marginBottom:8}}>Add one-off</div>
          {mob?(<div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input style={{...fInp,padding:"10px 12px",fontSize:14}} placeholder="e.g. KFC Brimbank" value={expForm.name} onChange={function(ev){setExpForm(function(f){return{...f,name:ev.target.value};});}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <input style={{...fInp,padding:"10px 12px",fontSize:14}} type="number" step="0.01" placeholder="Amount $" value={expForm.amount} onChange={function(ev){setExpForm(function(f){return{...f,amount:ev.target.value};});}}/>
              <select style={{...fInp,padding:"10px 12px",fontSize:14}} value={expForm.cat} onChange={function(ev){setExpForm(function(f){return{...f,cat:ev.target.value};});}}>{CATS.map(function(c){return<option key={c}>{c}</option>;})}</select>
            </div>
            <button style={{...fBtnP,padding:"11px",fontSize:14,borderRadius:10}} onClick={addExpense}>+ Add</button>
          </div>):(<div style={{display:"grid",gridTemplateColumns:"1fr 90px 105px 44px",gap:6,alignItems:"center"}}>
            <input style={fInp} placeholder="e.g. KFC Brimbank" value={expForm.name} onChange={function(ev){setExpForm(function(f){return{...f,name:ev.target.value};});}}/>
            <input style={fInp} type="number" step="0.01" placeholder="Amount" value={expForm.amount} onChange={function(ev){setExpForm(function(f){return{...f,amount:ev.target.value};});}}/>
            <select style={fInp} value={expForm.cat} onChange={function(ev){setExpForm(function(f){return{...f,cat:ev.target.value};});}}>{CATS.map(function(c){return<option key={c}>{c}</option>;})}</select>
            <button style={fBtnP} onClick={addExpense}>+</button>
          </div>)}
        </div>
        {/* Skipped this month */}
        {skippedThisMonth.length>0&&<div style={{marginBottom:10,padding:"6px 10px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border}}>
          <div style={{fontSize:9,color:T.text3,marginBottom:6}}>SKIPPED THIS MONTH — tap to restore</div>
          {skippedThisMonth.map(function(t){return(<button key={t.id} onClick={function(){restoreRecurring(t.id);}} style={{...editPill,marginRight:4,marginBottom:4,fontSize:10,textDecoration:"line-through",color:T.text3}}>{t.name}</button>);})}
        </div>}
        {/* Recurring rows */}
        {recurringThisMonth.length>0&&<div style={{marginBottom:12}}>
          <div style={{...fStatLabel,marginBottom:6}}>Recurring</div>
          {recurringThisMonth.map(function(e){return(
            <div key={e.id||e.name} style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:6,overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:6,bottom:6,width:2,borderRadius:1,background:T.accent,opacity:0.6}}/>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div><div style={{fontSize:12,color:T.text}}>{e.name}</div><div style={{fontSize:9,color:CAT_COL[e.cat]}}>{e.cat}</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:12,fontWeight:600,color:T.text}}>−${fmtNum(Number(e.amount))}</span>
                <button onClick={function(){skipRecurring(e.id);}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:10}}>skip</button>
              </div>
            </div>
          );})}
        </div>}
        {/* One-off rows */}
        <div>
          <div style={{...fStatLabel,marginBottom:6}}>One-off</div>
          {oneOffThisMonth.length===0&&<div style={{fontSize:11,color:T.text3,padding:"6px 0"}}>Nothing added yet — use the form above</div>}
          {oneOffThisMonth.map(function(e){
            if(editExpId===e.id){return mob?(<div key={e.id} style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8,padding:"10px 12px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border}}>
              <input style={{...fInp,padding:"10px 12px",fontSize:14}} value={editExpForm.name} onChange={function(ev){setEditExpForm(function(f){return{...f,name:ev.target.value};});}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <input style={{...fInp,padding:"10px 12px",fontSize:14}} type="number" step="0.01" value={editExpForm.amount} onChange={function(ev){setEditExpForm(function(f){return{...f,amount:ev.target.value};});}}/>
                <select style={{...fInp,padding:"10px 12px",fontSize:14}} value={editExpForm.cat} onChange={function(ev){setEditExpForm(function(f){return{...f,cat:ev.target.value};});}}>{CATS.map(function(c){return<option key={c}>{c}</option>;})}</select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button style={{...fBtnP,padding:"10px",fontSize:14,borderRadius:10}} onClick={saveEditExp}>Save ✓</button>
                <button style={{...editPill,padding:"10px",fontSize:14,borderRadius:10,textAlign:"center"}} onClick={function(){setEditExpId(null);}}>Cancel</button>
              </div>
            </div>):(<div key={e.id} style={{display:"grid",gridTemplateColumns:"1fr 90px 105px 44px 36px",gap:5,marginBottom:6,alignItems:"center"}}>
              <input style={fInp} value={editExpForm.name} onChange={function(ev){setEditExpForm(function(f){return{...f,name:ev.target.value};});}}/>
              <input style={fInp} type="number" step="0.01" value={editExpForm.amount} onChange={function(ev){setEditExpForm(function(f){return{...f,amount:ev.target.value};});}}/>
              <select style={fInp} value={editExpForm.cat} onChange={function(ev){setEditExpForm(function(f){return{...f,cat:ev.target.value};});}}>{CATS.map(function(c){return<option key={c}>{c}</option>;})}</select>
              <button style={fBtnP} onClick={saveEditExp}>✓</button>
              <button style={editPill} onClick={function(){setEditExpId(null);}}>✕</button>
            </div>);}
            return(<div key={e.id} style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:6,overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:6,bottom:6,width:2,borderRadius:1,background:T.warn,opacity:0.6}}/>
              <div><div style={{fontSize:12,color:T.text}}>{e.name}</div><div style={{fontSize:9,color:CAT_COL[e.cat]}}>{e.cat}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,fontWeight:600,color:T.text}}>−${fmtNum(Number(e.amount))}</span>
                <button onClick={function(){setEditExpId(e.id);setEditExpForm({name:e.name,amount:e.amount,cat:e.cat});}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",display:"flex",alignItems:"center",padding:2}}><UIcon name="pencil" size={13}/></button>
                <button onClick={function(){removeOneOff(e.id);}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
              </div>
            </div>);
          })}
        </div>
        {allThisMonth.length>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",marginTop:8,borderTop:"0.5px solid "+T.border}}>
          <span style={{fontSize:11,fontWeight:700,color:T.text}}>Total expenses</span>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>−${fmtNum(totalExpenses)}</span>
        </div>}
      </div>
      {/* Recurring manager */}
      {showRecMgr&&<div className="card-rim" style={fCard()}>
        <div style={fST}>Manage Recurring</div>
        <div style={{fontSize:10,color:T.text3,marginTop:4,marginBottom:12}}>Apply every month automatically. Use "skip" above to exclude for a specific month.</div>
        {recurringTemplates.map(function(t){return(
          <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:6}}>
            <div>
              <span style={{fontSize:12,color:T.text}}>{t.name}</span>
              <span style={{fontSize:9,color:CAT_COL[t.cat]||T.text2,marginLeft:8}}>{t.cat}</span>
              {t.dueDay&&<span style={{fontSize:9,color:T.text3,marginLeft:6}}>due {t.dueDay}th</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:12,fontWeight:600,color:T.text}}>${fmtNum(Number(t.amount))}/mo</span>
              <button onClick={function(){deleteTemplate(t.id);}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
            </div>
          </div>
        );})}
        <div style={{marginTop:12,paddingTop:10,borderTop:"0.5px solid "+T.border}}>
          <div style={{...fStatLabel,marginBottom:8}}>Add recurring</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px 100px 50px 44px",gap:6,alignItems:"center"}}>
            <input style={fInp} placeholder="Name" value={recForm.name} onChange={function(ev){setRecForm(function(f){return{...f,name:ev.target.value};});}}/>
            <input style={fInp} type="number" step="0.01" placeholder="$/mo" value={recForm.amount} onChange={function(ev){setRecForm(function(f){return{...f,amount:ev.target.value};});}}/>
            <select style={fInp} value={recForm.cat} onChange={function(ev){setRecForm(function(f){return{...f,cat:ev.target.value};});}}>{CATS.map(function(c){return<option key={c}>{c}</option>;})}</select>
            <input style={fInp} type="number" min={1} max={31} placeholder="day" title="Due day of month" value={recForm.dueDay||""} onChange={function(ev){setRecForm(function(f){return{...f,dueDay:ev.target.value};});}}/>
            <button style={fBtnP} onClick={addRecurring}>+</button>
          </div>
        </div>
      </div>}
      {/* Savings Goal */}
      <div className="card-rim" style={fCard()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={fST}>{sg.name||"Savings Goal"}</div>
            {sg.name&&<div style={{fontSize:10,color:T.text3,marginTop:2}}>savings goal</div>}
          </div>
          {sgTarget>0&&<button style={editPill} onClick={function(){updateSavingsGoal({target:0,deadline:"",current:0,target_draft:"",name:""});}}>Clear</button>}
        </div>
        {sgTarget===0
          ?<div>
            <div style={{fontSize:11,color:T.text3,marginBottom:12}}>Name your goal and set a target — we'll show how much to put away each month and how many shifts that takes.</div>
            <div style={{marginBottom:8}}><div style={{...fStatLabel,marginBottom:4}}>Goal name</div><input style={fInp} placeholder="e.g. Europe trip, Car, Emergency fund" value={sg.name||""} onChange={function(ev){updateSavingsGoal({name:ev.target.value});}}/></div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:8}}>
              <div><div style={{...fStatLabel,marginBottom:4}}>Target $</div><input style={fInp} type="number" step="50" placeholder="e.g. 5000" value={sg.target_draft||""} onChange={function(ev){updateSavingsGoal({target_draft:ev.target.value});}}/></div>
              <div><div style={{...fStatLabel,marginBottom:4}}>By month</div><input style={{...fInp,colorScheme:"dark"}} type="month" value={sgDeadline} onChange={function(ev){updateSavingsGoal({deadline:ev.target.value});}}/></div>
              <div><div style={{...fStatLabel,marginBottom:4}}>Have now $</div><input style={fInp} type="number" step="50" placeholder="0" value={sg.current||""} onChange={function(ev){updateSavingsGoal({current:Number(ev.target.value)||0});}}/></div>
            </div>
            {sg.target_draft&&sgDeadline&&<button style={{...fBtnP,marginTop:10,width:"100%",justifyContent:"center"}} onClick={function(){updateSavingsGoal({target:Number(sg.target_draft)||0,target_draft:""});}}>Set goal →</button>}
          </div>
          :<div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(3,1fr)",gap:10,marginBottom:14}}>
              <div style={{...fGlassMini,padding:"14px 16px",borderBottom:"1.5px solid rgba(91,140,255,0.45)",boxShadow:"inset 0 -10px 22px rgba(91,140,255,0.14),"+cardShadowSoft}}>
                <div style={{...fStatLabel,marginBottom:4}}>Remaining</div>
                <div style={{fontSize:mob?18:22,fontWeight:500,letterSpacing:"-0.02em",color:T.text,lineHeight:1.05,fontVariantNumeric:"tabular-nums"}}>${fmtRound(sgRemaining)}</div>
                <div style={{fontSize:10,color:T.text3,marginTop:4}}>${fmtRound(sgCurrent)} of ${fmtRound(sgTarget)} saved</div>
              </div>
              <div style={{...fGlassMini,padding:"14px 16px",borderBottom:"1.5px solid rgba(255,209,102,0.45)",boxShadow:"inset 0 -10px 22px rgba(255,209,102,0.14),"+cardShadowSoft}}>
                <div style={{...fStatLabel,marginBottom:4}}>Per month</div>
                <div style={{fontSize:mob?18:22,fontWeight:500,letterSpacing:"-0.02em",color:T.text,lineHeight:1.05,fontVariantNumeric:"tabular-nums"}}>{sgPerMonth!=null?"$"+fmtRound(sgPerMonth):"—"}</div>
                <div style={{fontSize:10,color:T.text3,marginTop:4}}>{sgMonthsLeft>0?sgMonthsLeft+" months left":"set a deadline"}</div>
              </div>
              <div style={{...fGlassMini,padding:"14px 16px"}}>
                <div style={{...fStatLabel,marginBottom:4}}>Shifts/mo</div>
                <div style={{fontSize:mob?18:22,fontWeight:500,letterSpacing:"-0.02em",color:sgShiftsNeeded!=null?T.text:T.text3,lineHeight:1.05,fontVariantNumeric:"tabular-nums"}}>{sgShiftsNeeded!=null?sgShiftsNeeded:"—"}</div>
                <div style={{fontSize:10,color:T.text3,marginTop:4}}>{hourlyRate>0?"@ $"+hourlyRate+"/hr · 6h avg":"set hourly rate ↑"}</div>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,color:T.text3}}>Progress toward ${fmtRound(sgTarget)}</span><span style={{fontSize:10,fontWeight:700,color:T.accent}}>{sgProgress}%</span></div>
              <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)"}}><div className="bar-reveal" style={{width:sgProgress+"%",height:"100%",borderRadius:2,background:T.accent,transition:"width 0.4s cubic-bezier(0.23,1,0.32,1)"}}/></div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:T.text3}}>Have $</span><input style={{...fInp,width:90,padding:"3px 8px",fontSize:11}} type="number" step="50" placeholder="0" value={sgCurrent||""} onChange={function(ev){updateSavingsGoal({current:Number(ev.target.value)||0});}}/></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:T.text3}}>By</span><input style={{...fInp,width:120,padding:"3px 8px",fontSize:11,colorScheme:"dark"}} type="month" value={sgDeadline} onChange={function(ev){updateSavingsGoal({deadline:ev.target.value});}}/></div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

function WorkSection({data,mob,onUpdate,gcalEvents}){
  mob=mob||false;
  const [expandedShift,setExpandedShift]=useState(null);
  const [logDraft,setLogDraft]=useState({notes:""});
  const [goalInput,setGoalInput]=useState("");
  const [showSettings,setShowSettings]=useState(false);
  const [cycleOffset,setCycleOffset]=useState(0);
  const [taskInput,setTaskInput]=useState("");
  const [taskTag,setTaskTag]=useState(null);
  const [taskShiftDate,setTaskShiftDate]=useState(todayStr());
  useEffect(function(){const first=(gcalEvents||[]).filter(isGoTabEvent).sort(function(a,b){return b.date.localeCompare(a.date);})[0];if(first)setTaskShiftDate(first.date);},[]);
  const wBtn={...btnGlass,padding:"5px 12px"};
  const wBtnP={...btnGlassP};
  const wInp={width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.05)",color:T.text,fontSize:12,boxSizing:"border-box"};
  function wCard(ex){return{position:"relative",background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:20,padding:"18px 20px",marginBottom:12,boxShadow:cardShadow,...(ex||{})};}
  const wGlassMini={background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:14,boxShadow:cardShadowSoft};
  const wStatLabel={fontSize:10,fontWeight:600,color:"#8f97a6",textTransform:"uppercase",letterSpacing:"0.05em"};
  const wST={fontSize:13,fontWeight:600,marginBottom:0,color:"#cdd5e2",letterSpacing:"-0.01em"};
  function cellEdge(hex){return{borderBottom:"1.5px solid "+hex+"80",boxShadow:"inset 0 -5px 12px "+hex+"15"};}
  const TAGS=[{label:"Issue resolved",col:"#69f0ae"},{label:"Escalated",col:"#ff6b6b"},{label:"Venue call",col:"#5b8cff"},{label:"Other",col:"#8f97a6"}];
  const focusGoals=data.focusGoals||[];
  const shiftLogs=data.shiftLogs||{};
  const taskLog=data.taskLog||[];
  const hrRate=Number(data.hourlyRate||0);
  const payCycleDay=Number(data.payCycleDay||1);
  function getPeriodRange(offset){
    const today=new Date();const yr=today.getFullYear();const mo=today.getMonth();
    let cs=new Date(yr,mo,payCycleDay);
    if(today<cs)cs=new Date(yr,mo-1,payCycleDay);
    const start=new Date(cs.getTime()+offset*14*864e5);
    const end=new Date(start.getTime()+13*864e5);
    return{start:dStr(start),end:dStr(end)};
  }
  const {start:periodStart,end:periodEnd}=getPeriodRange(cycleOffset);
  const periodShifts=(gcalEvents||[]).filter(isGoTabEvent).filter(function(ev){return ev.date>=periodStart&&ev.date<=periodEnd;}).sort(function(a,b){return a.date.localeCompare(b.date);});
  const periodNorm=periodShifts.reduce(function(a,ev){const p=shiftPay(ev.time);return a+(p?p.normalHrs:0);},0);
  const periodPen=periodShifts.reduce(function(a,ev){const p=shiftPay(ev.time);return a+(p?p.penaltyHrs:0);},0);
  const periodEquiv=periodShifts.reduce(function(a,ev){const p=shiftPay(ev.time);return a+(p?p.totalEquiv:0);},0);
  const estimatedPay=hrRate>0?periodEquiv*hrRate:null;
  function estimateTax(gross){if(gross<=18200)return gross*0.02;if(gross<=45000)return(gross-18200)*0.19+gross*0.02;if(gross<=135000)return 5092+(gross-45000)*0.30+gross*0.02;if(gross<=190000)return 32092+(gross-135000)*0.37+gross*0.02;return 52442+(gross-190000)*0.45+gross*0.02;}
  const periodDays=Math.max(1,Math.round((new Date(periodEnd)-new Date(periodStart))/864e5)+1);
  const annualGross=estimatedPay!=null?estimatedPay/periodDays*365:0;
  const periodTax=estimatedPay!=null?estimateTax(annualGross)/365*periodDays:null;
  const periodNet=estimatedPay!=null&&periodTax!=null?estimatedPay-periodTax:null;
  const periodTaskCount=taskLog.filter(function(t){return t.shiftDate>=periodStart&&t.shiftDate<=periodEnd;}).length;
  const recentShiftDates=(gcalEvents||[]).filter(isGoTabEvent).sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0,14).map(function(ev){return ev.date;});
  function fmt$(n){return n!=null?"$"+n.toFixed(2):"—";}
  function fmtPeriod(){const s=new Date(periodStart+"T12:00:00");const e=new Date(periodEnd+"T12:00:00");return s.toLocaleDateString("en-AU",{day:"numeric",month:"short"})+" – "+e.toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"});}
  function openShift(date){
    if(expandedShift===date){setExpandedShift(null);return;}
    setExpandedShift(date);
    setLogDraft({notes:(shiftLogs[date]||{}).notes||""});
  }
  function saveShiftLog(){
    onUpdate({...data,shiftLogs:{...shiftLogs,[expandedShift]:{...(shiftLogs[expandedShift]||{}),notes:logDraft.notes}}});
    setExpandedShift(null);
    if(window.showToast)window.showToast("Diary saved","success");
  }
  function addTask(){
    if(!taskInput.trim()&&!taskTag)return;
    const entry={id:Date.now(),shiftDate:taskShiftDate,text:taskInput.trim(),tag:taskTag,addedAt:todayStr()};
    onUpdate({...data,taskLog:[...taskLog,entry]});
    setTaskInput("");setTaskTag(null);
    if(window.showToast)window.showToast("Task logged","success");
  }
  function removeTask(id){onUpdate({...data,taskLog:taskLog.filter(function(t){return t.id!==id;})});}
  const tasksByDate=(function(){
    const map={};
    taskLog.forEach(function(t){if(!map[t.shiftDate])map[t.shiftDate]=[];map[t.shiftDate].push(t);});
    return Object.keys(map).sort(function(a,b){return b.localeCompare(a);}).map(function(d){return{date:d,tasks:map[d]};});
  }());
  function addFocusGoal(){if(!goalInput.trim())return;onUpdate({...data,focusGoals:[...focusGoals,{id:Date.now(),text:goalInput.trim(),status:"active",addedAt:todayStr()}]});setGoalInput("");}
  function toggleGoal(id){onUpdate({...data,focusGoals:focusGoals.map(function(g){return g.id===id?{...g,status:g.status==="done"?"active":"done"}:g;})});}
  function removeGoal(id){onUpdate({...data,focusGoals:focusGoals.filter(function(g){return g.id!==id;})});}
  return(
    <div style={{maxWidth:mob?undefined:900}}>
      <div className="card-rim" style={wCard({marginBottom:16})}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,paddingBottom:14,borderBottom:"0.5px solid "+T.border}}>
          <button style={wBtn} onClick={function(){setCycleOffset(function(o){return o-1;});}}>&#8592; prev</button>
          <div style={{flex:1,textAlign:"center",fontSize:13,fontWeight:700,color:T.text}}>{fmtPeriod()}</div>
          <button style={wBtn} onClick={function(){setCycleOffset(function(o){return o+1;});}}>next &#8594;</button>
          <button style={{...editPill,marginLeft:4}} onClick={function(){setShowSettings(function(v){return !v;});}}>
            <UIcon name="gear" size={12}/> settings
          </button>
        </div>
        {showSettings&&<div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",marginBottom:14,paddingBottom:14,borderBottom:"0.5px solid "+T.border}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:T.text3}}>Rate $</span><input type="number" min={0} step={0.01} style={{...wInp,width:66,padding:"3px 6px",fontSize:11}} placeholder="0.00" value={hrRate||""} onChange={function(ev){onUpdate({...data,hourlyRate:Number(ev.target.value)||0});}}/><span style={{fontSize:11,color:T.text3}}>/hr</span></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:T.text3}}>Pay cycle</span><input type="number" min={1} max={28} style={{...wInp,width:44,textAlign:"center",padding:"3px 6px",fontSize:11}} value={payCycleDay} onChange={function(ev){onUpdate({...data,payCycleDay:Math.max(1,Math.min(28,Number(ev.target.value)||1))});}}/><span style={{fontSize:11,color:T.text3}}>th of month</span></div>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:10,marginBottom:10}}>
          {[
            {label:"Gross pay",value:fmt$(estimatedPay),sub:periodEquiv.toFixed(1)+"h equiv · "+periodShifts.length+" shift"+(periodShifts.length!==1?"s":""),edge:"#5b8cff"},
            {label:"Est. tax",value:periodTax!=null?"−$"+periodTax.toFixed(2):"—",sub:hrRate>0?"ATO 2025-26 · annualised":"set rate in settings",edge:"#ff6b6b"},
            {label:"Take-home",value:fmt$(periodNet),sub:"after est. tax",edge:"#69f0ae"}
          ].map(function(c){return(
            <div key={c.label} style={{...wGlassMini,padding:"16px 18px",...cellEdge(c.edge)}}>
              <div style={{...wStatLabel,marginBottom:4}}>{c.label}</div>
              <div style={{fontSize:mob?18:20,fontWeight:700,letterSpacing:"-0.02em",color:T.text,lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{c.value}</div>
              <div style={{fontSize:10,color:T.text3,marginTop:5}}>{c.sub}</div>
            </div>
          );})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:10}}>
          {[
            {label:"Standard hrs",value:periodNorm.toFixed(1)+"h",sub:"before 7pm · 1×",edge:"rgba(255,255,255,0.15)"},
            {label:"Penalty hrs",value:periodPen.toFixed(1)+"h",sub:"after 7pm · 1.5×",edge:"#ffd166"},
            {label:"Shifts",value:String(periodShifts.length),sub:"this period",edge:"rgba(255,255,255,0.15)"},
            {label:"Tasks",value:String(periodTaskCount),sub:"logged this period",edge:"#c77dff"}
          ].map(function(c){return(
            <div key={c.label} style={{background:"rgba(225,234,255,0.07)",border:"0.5px solid rgba(255,255,255,0.10)",borderRadius:12,padding:"12px 14px",...cellEdge(c.edge)}}>
              <div style={{...wStatLabel,marginBottom:4}}>{c.label}</div>
              <div style={{fontSize:mob?14:16,fontWeight:700,letterSpacing:"-0.01em",color:T.text,lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{c.value}</div>
              <div style={{fontSize:10,color:T.text3,marginTop:4}}>{c.sub}</div>
            </div>
          );})}
        </div>
        <div style={{fontSize:9,color:T.text3,marginTop:10}}>Tax estimate only — actual PAYG may differ</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"2fr 1fr",gap:12,alignItems:"start",marginBottom:12}}>
        <div className="card-rim" style={wCard({marginBottom:0})}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={wST}>Shifts</div>
            <div style={{fontSize:9,color:T.text3}}>click to add diary</div>
          </div>
          {periodShifts.length===0
            ?<div style={{fontSize:12,color:T.text2,padding:"20px 0",textAlign:"center"}}>{gcalEvents&&gcalEvents.length>0?"No GoTab shifts this period — use prev to look back":"Connect Google Calendar to see shifts"}</div>
            :<div>
              {periodShifts.map(function(ev){
                const past=daysBetween(ev.date)<0;
                const pay=shiftPay(ev.time);
                const rowPay=hrRate>0&&pay?fmt$(pay.totalEquiv*hrRate):"—";
                const d=new Date(ev.date+"T12:00:00");
                const diary=(shiftLogs[ev.date]||{}).notes||"";
                const shiftTaskCount=taskLog.filter(function(t){return t.shiftDate===ev.date;}).length;
                const isExp=expandedShift===ev.date;
                const dotCol=!past?"#5b8cff":diary?"#69f0ae":T.text3;
                const dotGlow=!past?"0 0 7px #5b8cff":diary?"0 0 7px #69f0ae":"none";
                return(
                  <div key={ev.id||ev.date} style={{marginBottom:6}}>
                    <div onClick={function(){openShift(ev.date);}} style={{position:"relative",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",paddingLeft:14,borderRadius:isExp?"10px 10px 0 0":8,background:isExp?"rgba(91,140,255,0.08)":T.bg3,border:"0.5px solid "+(isExp?T.accent:T.border),borderBottom:isExp?"none":"0.5px solid "+T.border,cursor:"pointer",opacity:past&&!isExp?0.65:1,overflow:"hidden",transition:"background 0.12s,border 0.12s"}}>
                      <div style={{position:"absolute",left:0,top:5,bottom:5,width:2,borderRadius:1,background:T.accent,opacity:past?0.35:0.7}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:600,color:T.text,marginBottom:2}}>{d.toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"})}</div>
                        <div style={{fontSize:10,color:T.text2}}>{ev.time}</div>
                      </div>
                      {pay&&<div style={{display:"flex",gap:8,fontSize:10,flexShrink:0,color:T.text2}}>
                        <span>{pay.normalHrs}h std</span>
                        {pay.penaltyHrs>0&&<span>{pay.penaltyHrs}h pen</span>}
                      </div>}
                      <div style={{fontSize:12,fontWeight:700,color:T.text,flexShrink:0,minWidth:52,textAlign:"right"}}>{rowPay}</div>
                      {shiftTaskCount>0&&<span style={{fontSize:9,color:"#c77dff",background:"rgba(199,125,255,0.12)",border:"0.5px solid rgba(199,125,255,0.25)",borderRadius:4,padding:"1px 5px",flexShrink:0}}>{shiftTaskCount} task{shiftTaskCount!==1?"s":""}</span>}
                      <div style={{width:8,height:8,borderRadius:"50%",background:dotCol,boxShadow:dotGlow,flexShrink:0}}/>
                    </div>
                    {isExp&&<div style={{background:"rgba(91,140,255,0.05)",border:"0.5px solid "+T.accent,borderTop:"none",borderRadius:"0 0 10px 10px",padding:"12px 14px"}}>
                      <div style={{fontSize:10,color:T.text3,marginBottom:6,letterSpacing:"0.02em"}}>Shift diary</div>
                      <textarea rows={4} placeholder="How did the shift go? Any notable incidents, wins, or patterns worth remembering." value={logDraft.notes} onChange={function(e){setLogDraft({notes:e.target.value});}} style={{...wInp,resize:"none",fontSize:11,lineHeight:1.6}}/>
                      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:10}}>
                        <button onClick={function(){setExpandedShift(null);}} style={wBtn}>Cancel</button>
                        <button onClick={saveShiftLog} style={wBtnP}>Save</button>
                      </div>
                    </div>}
                  </div>
                );
              })}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderTop:"0.5px solid "+T.border,marginTop:4}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text}}>Total</div>
                <div style={{display:"flex",gap:14,fontSize:10,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  <span style={{color:T.text2,fontWeight:600}}>{periodNorm.toFixed(1)}h std</span>
                  {periodPen>0&&<span style={{color:T.warn,fontWeight:600}}>{periodPen.toFixed(1)}h pen</span>}
                  <span style={{color:T.accent,fontWeight:700}}>{periodEquiv.toFixed(1)}h equiv</span>
                  <span style={{color:T.text,fontWeight:700}}>{fmt$(estimatedPay)}</span>
                </div>
              </div>
            </div>
          }
        </div>
        <div className="card-rim" style={wCard({marginBottom:0})}>
          <div style={{marginBottom:14}}>
            <div style={wST}>Focus Goals</div>
          </div>
          {focusGoals.length===0
            ?<div style={{fontSize:11,color:T.text3,textAlign:"center",padding:"18px 0 14px"}}>No goals yet — add something you are working towards</div>
            :<div style={{marginBottom:14}}>
              {focusGoals.map(function(g){
                const done=g.status==="done";
                const dot=done?"#69f0ae":"#5b8cff";
                const dotGlow=done?"0 0 6px #69f0ae":"0 0 6px #5b8cff";
                return(
                  <div key={g.id} onClick={function(){toggleGoal(g.id);}} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",borderRadius:8,cursor:"pointer",transition:"background 0.1s",marginBottom:4,background:"rgba(255,255,255,0.015)"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:dot,boxShadow:dotGlow,flexShrink:0,marginTop:3}}/>
                    <div style={{flex:1,fontSize:12,color:done?T.text3:T.text,textDecoration:done?"line-through":"none",lineHeight:1.5,transition:"color 0.15s"}}>{g.text}</div>
                    <button onClick={function(e){e.stopPropagation();removeGoal(g.id);}} style={{background:"none",border:"none",color:T.text3,fontSize:14,lineHeight:1,cursor:"pointer",padding:"0 2px",flexShrink:0}}>&#215;</button>
                  </div>
                );
              })}
            </div>
          }
          <div style={{display:"flex",gap:6,borderTop:"0.5px solid "+T.border,paddingTop:12}}>
            <input type="text" placeholder="what are you going for?" value={goalInput} onChange={function(e){setGoalInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();addFocusGoal();}}} style={{...wInp,flex:1,fontSize:11}}/>
            <button onClick={addFocusGoal} style={wBtnP}>Add</button>
          </div>
        </div>
      </div>
      <div className="card-rim" style={wCard({marginBottom:0})}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={wST}>Work Log</div>
          <div style={{fontSize:9,color:T.text3}}>individual tasks &amp; actions</div>
        </div>
        <div style={{marginBottom:14,paddingBottom:14,borderBottom:"0.5px solid "+T.border}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {TAGS.map(function(tag){
              const active=taskTag===tag.label;
              return(
                <button key={tag.label} onClick={function(){setTaskTag(active?null:tag.label);}} style={{...editPill,border:"0.5px solid "+(active?tag.col+"90":"rgba(255,255,255,0.14)"),background:active?tag.col+"1a":"rgba(255,255,255,0.04)",color:active?tag.col:T.text2,transition:"all 0.12s",display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:tag.col,display:"inline-block",flexShrink:0}}/>
                  {tag.label}
                </button>
              );
            })}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:mob?"wrap":"nowrap"}}>
            <input type="text" placeholder={taskTag?"Describe what happened…":"Pick a tag or just type what you did"} value={taskInput} onChange={function(e){setTaskInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();addTask();}}} style={{...wInp,flex:1}}/>
            <select value={taskShiftDate} onChange={function(e){setTaskShiftDate(e.target.value);}} style={{background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.14)",color:T.text,fontSize:11,borderRadius:8,padding:"7px 10px",cursor:"pointer",flexShrink:0}}>
              {recentShiftDates.map(function(sd){const dd=new Date(sd+"T12:00:00");return <option key={sd} value={sd}>{dd.toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"})}</option>;})}
              {recentShiftDates.indexOf(taskShiftDate)===-1&&<option value={taskShiftDate}>{new Date(taskShiftDate+"T12:00:00").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"})}</option>}
            </select>
            <button onClick={addTask} style={{...wBtnP,flexShrink:0}}>Log it</button>
          </div>
        </div>
        {tasksByDate.length===0
          ?<div style={{fontSize:12,color:T.text2,textAlign:"center",padding:"28px 0"}}>No tasks logged yet — pick a tag above and describe what you did</div>
          :<div style={{borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:16}}>
            {tasksByDate.map(function(group){
              const shiftMatch=(gcalEvents||[]).filter(isGoTabEvent).find(function(ev){return ev.date===group.date;});
              const dd=new Date(group.date+"T12:00:00");
              const dateLabel=dd.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"short"});
              return(
                <div key={group.date} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,marginLeft:-19}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:T.accent,boxShadow:"0 0 6px "+T.accent,flexShrink:0}}/>
                    <div style={{fontSize:11,fontWeight:700,color:T.text}}>{dateLabel}</div>
                    {shiftMatch&&<div style={{fontSize:10,color:T.text3}}>· {shiftMatch.time}</div>}
                    <div style={{marginLeft:"auto",fontSize:9,color:T.text3}}>{group.tasks.length} task{group.tasks.length!==1?"s":""}</div>
                  </div>
                  {group.tasks.map(function(task){
                    const tagObj=TAGS.find(function(t){return t.label===task.tag;});
                    const tagCol=tagObj?tagObj.col:"#8f97a6";
                    return(
                      <div key={task.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 10px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"0.5px solid rgba(255,255,255,0.06)",marginBottom:5}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:tagCol,flexShrink:0,marginTop:5}}/>
                        <div style={{flex:1,minWidth:0}}>
                          {task.tag&&<div style={{fontSize:9,color:tagCol,fontWeight:600,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.04em"}}>{task.tag}</div>}
                          <div style={{fontSize:11,color:task.text?T.text:T.text3,lineHeight:1.5,fontStyle:task.text?"normal":"italic"}}>{task.text||task.tag}</div>
                        </div>
                        <button onClick={function(){removeTask(task.id);}} style={{...wBtn,padding:"1px 7px",fontSize:12,color:T.text3,flexShrink:0,lineHeight:1}}>&#215;</button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
}

function App(){
  const [page,setPage]=useState("Dashboard");
  const [data,setData]=useState(function(){try{const s=localStorage.getItem("dash_v1");if(!s)return mergeWithDefaults({...INIT,reflections:SEED_REFL});const saved=JSON.parse(s);const fin=saved.finance||{};let out=saved;if(!fin.financeVersion||fin.financeVersion<2){out={...out,finance:INIT.finance};}return mergeWithDefaults(out);}catch(_){return mergeWithDefaults({...INIT,reflections:SEED_REFL});}});
  const [wkOff,setWkOff]=useState(0);
  const [activeDay,setActiveDay]=useState(todayStr());
  const [checkinBlocks,setCheckinBlocks]=useState([]);
  const [checkinOpen,setCheckinOpen]=useState(false);
  const [nxtRows,setNxtRows]=useState([{id:1,exercise:"",sets:"",reps:"",weight:""},{id:2,exercise:"",sets:"",reps:"",weight:""},{id:3,exercise:"",sets:"",reps:"",weight:""}]);
  // Pre-fill nxtRows — check for a saved draft first, then fall back to rotation template
  useEffect(function(){
    const gr=data.gym.rotation||[];const gl=gr.length>0?gr.length:1;const gi=(data.gym.rotIdx||0)%gl;const nr=gr.length>0?gr[gi]:null;
    try{
      var draft=JSON.parse(localStorage.getItem('gym_draft')||'null');
      if(draft&&nr&&draft.rotId===nr.id&&draft.rows&&draft.rows.some(function(r){return r.exercise;})){
        setNxtRows(draft.rows);
        setGymDraftBanner(true);
        return;
      }
    }catch(_){}
    setGymDraftBanner(false);
    if(nr&&nr.exercises&&nr.exercises.length>0){
      setNxtRows(nr.exercises.map(function(ex,i){return{id:ex.id||i+1,exercise:ex.exercise||"",sets:ex.sets||"",reps:ex.reps||"",weight:ex.weight||""};}).concat(nr.exercises.length<3?[{id:Date.now()+1,exercise:"",sets:"",reps:"",weight:""}].slice(0,3-nr.exercises.length):[]).slice(0,Math.max(nr.exercises.length,3)));
    }
  },[data.gym.rotIdx,data.gym.rotation]);
  // Auto-save gym session draft whenever rows change
  useEffect(function(){
    if(!nxtRows.some(function(r){return r.exercise||r.weight;}))return;
    const gr=data.gym.rotation||[];const gl=gr.length>0?gr.length:1;const gi=(data.gym.rotIdx||0)%gl;const nr=gr.length>0?gr[gi]:null;
    try{localStorage.setItem('gym_draft',JSON.stringify({rotId:nr?nr.id:null,rows:nxtRows,savedAt:Date.now()}));}catch(_){}
  },[nxtRows]);
  const [bwIn,setBwIn]=useState("");
  const [bwDate,setBwDate]=useState(todayStr());
  const [bwEditing,setBwEditing]=useState(false);
  const [showCapture,setShowCapture]=useState(false);
  const [captureText,setCaptureText]=useState("");
  const [captureLoading,setCaptureLoading]=useState(false);
  const [captureResult,setCaptureResult]=useState(null);
  const [showBoardroom,setShowBoardroom]=useState(false);
  const [brMessages,setBrMessages]=useState([]);
  const [brInput,setBrInput]=useState("");
  const [brLoading,setBrLoading]=useState(false);
  const [brLastSpeaker,setBrLastSpeaker]=useState(null); // kept for Firestore compat only
  const [brGoalProposals,setBrGoalProposals]=useState([]);
  const [brClosing,setBrClosing]=useState(false);
  const [brIntentMode,setBrIntentMode]=useState(null); // 'howto' | 'direction' — for header badge / loading copy
  const [brPendingIntent,setBrPendingIntent]=useState(null); // {text, reconfirmed} awaiting a one-tap mode choice
  const [brShowProjCtx,setBrShowProjCtx]=useState(false); // project-context panel open/closed
  const brMigrationRef=React.useRef(false);
  const [capturesData,setCapturesData]=useState([]);
  const [capturesLoading,setCapturesLoading]=useState(false);
  const [capturesFilter,setCapturesFilter]=useState("all");
  const [journalTab,setJournalTab]=useState("captures");
  const [capturesSearch,setCapturesSearch]=useState("");
  const [expandedCapture,setExpandedCapture]=useState(null);
  const [expandedRefl,setExpandedRefl]=useState(null);
  const [editCaptureData,setEditCaptureData]=useState(null);
  const [editCaptureTagStr,setEditCaptureTagStr]=useState("");
  const [appVersion,setAppVersion]=useState(null);
  const [editTaskId,setEditTaskId]=useState(null);
  const [editTaskForm,setEditTaskForm]=useState({});
  const [gymDraftBanner,setGymDraftBanner]=useState(false);
  const [scheduleTaskId,setScheduleTaskId]=useState(null);
  const [scheduleForDay,setScheduleForDay]=useState(null);
  const [scheduleTime,setScheduleTime]=useState("09:00");
  const [scheduleDuration,setScheduleDuration]=useState(60);
  const [showTimePicker,setShowTimePicker]=useState(false);
  const [showArch,setShowArch]=useState(false);
  const [reflStep,setReflStep]=useState(0);
  const [reflAns,setReflAns]=useState([]);
  const [reflIn,setReflIn]=useState("");
  const [reflAnalysis,setReflAnalysis]=useState(null);
  const [modal,setModal]=useState(null);
  const [mForm,setMForm]=useState({});
  const [syncStatus,setSyncStatus]=useState("loading");
  const [obsExportStatus,setObsExportStatus]=useState("idle"); // idle | running | done | error
  const [authUser,setAuthUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const _fbReady=useRef(false);
  const _dataLoaded=useRef(false); // only true after we've confirmed Firebase state
  const _saveTimer=useRef(null);
  const [docIn,setDocIn]=useState({title:"",tags:"",content:""});
  const [forceMob,setForceMob]=useState(false);
  const [navCollapsed,setNavCollapsed]=useState(function(){try{return localStorage.getItem("nav_collapsed")==="1";}catch(_){return false;}});
  function toggleNav(){setNavCollapsed(function(c){const nv=!c;try{localStorage.setItem("nav_collapsed",nv?"1":"0");}catch(_){}return nv;});}
  const rawMob=useIsMob();
  const mob=forceMob||rawMob;
  const [checkinLoading,setCheckinLoading]=useState(false);
  const [reflAnalysisLoading,setReflAnalysisLoading]=useState(false);

  const [showMonitor,setShowMonitor]=useState(false);
  const [toast,setToast]=useState(null); // {msg,type:'error'|'success'|'warn'}
  const [errLog,setErrLog]=useState([]);
  const [showErrPanel,setShowErrPanel]=useState(false);
  // Google Calendar sync state
  const [gcalEvents,setGcalEvents]=useState(function(){try{var c=localStorage.getItem('__gcal_events__');return c?JSON.parse(c):[];}catch(_){return [];}});
  const [gcalConnected,setGcalConnected]=useState(false);
  const [gcalCalendars,setGcalCalendars]=useState([]);
  const [gcalSelectedIds,setGcalSelectedIds]=useState(function(){try{var s=localStorage.getItem('__gcal_selected__');return s?JSON.parse(s):[];}catch(_){return [];}});
  const [gcalReady,setGcalReady]=useState(false);
  const [showCalPicker,setShowCalPicker]=useState(false);
  // Syllabus / assessment hub state
  const [showSyllabusImport,setShowSyllabusImport]=useState(false);
  const [syllabusText,setSyllabusText]=useState("");
  const [syllabusStart,setSyllabusStart]=useState("2026-04-20");
  const [geminiKey,setGeminiKey]=useState(function(){try{return localStorage.getItem('__gemini_key__')||"";}catch(_){return "";}});
  const [groqKey,setGroqKey]=useState(function(){try{return localStorage.getItem('__groq_key__')||"";}catch(_){return "";}});
  const [geminiLoading,setGeminiLoading]=useState(false);
  const [geminiPreview,setGeminiPreview]=useState(null);
  const [showAddAssess,setShowAddAssess]=useState(false);
  const [addAssessForm,setAddAssessForm]=useState({subject:"WIA&B",name:"",type:"SUBMISSION",date:todayStr()});
  const [gcalExcludedIds,setGcalExcludedIds]=useState(function(){try{var x=localStorage.getItem('__gcal_excluded__');return x?JSON.parse(x):[];}catch(_){return [];}});

  // Call this anywhere in App to show a brief auto-dismissing notification.
  // Child components can call window.showToast() which is wired up below.
  function showToast(msg,type){
    setToast({msg:msg,type:type||"error"});
    clearTimeout(window._toastTimer);
    window._toastTimer=setTimeout(function(){setToast(null);},3500);
  }
  // Expose globally so FinanceSection and GymSection can reach it without prop drilling
  useEffect(function(){window.showToast=showToast;return function(){window.showToast=null;};},[]);
  // ESC key cancels active task-scheduling mode
  useEffect(function(){
    function onKey(e){if(e.key==="Escape"&&scheduleTaskId){setScheduleTaskId(null);}}
    window.addEventListener("keydown",onKey);
    return function(){window.removeEventListener("keydown",onKey);};
  },[scheduleTaskId]);
  // Usage tracking — auto-instrument tab/sub-tab/modal switches (see monitoring-dashboard.js).
  useEffect(function(){trk("tab."+page);},[page]);
  useEffect(function(){
    if(page!=="Boardroom") return;
    if(brMigrationRef.current) return;
    var b=data.boardroom||{};
    if(!b.onboarded||!b.northStar) return;
    var goals=b.goals||[];
    if(goals.length>0) return; // already migrated / has goals — nothing to do
    var km=b.keyMoments||[];
    var onboardingMoment=km.find(function(m){return m.mode==="onboarding";});
    brMigrationRef.current=true;
    // Goal-extraction source: the onboarding session summary if one exists, otherwise the
    // North Star — the only surviving artifact when an early consult cleared its transcript.
    var sourceText;
    if(onboardingMoment){
      sourceText=onboardingMoment.summary+" "+(onboardingMoment.commitments||[]).map(function(c){return typeof c==="string"?c:c.text;}).join(", ");
    } else {
      sourceText=b.northStar;
      // Backfill a first-consultation entry so the original consult appears in the Session Log.
      setData(function(p){
        var pb=p.boardroom||{};
        var pkm=pb.keyMoments||[];
        if(pkm.some(function(m){return m.mode==="onboarding";})) return p; // guard double-write
        var seedMoment={date:todayStr(),summary:pb.northStar,commitments:[],mode:"onboarding"};
        return{...p,boardroom:{...pb,keyMoments:[seedMoment].concat(pkm)}};
      });
    }
    var fakeTranscript=[{role:"assistant",persona:"Alex",text:sourceText}];
    BoardroomService.extractGoals(fakeTranscript,[]).then(function(proposed){
      if(proposed&&proposed.length) setBrGoalProposals(proposed);
    });
  },[page]);
  useEffect(function(){if(page==="Journal")trk("subtab.Journal."+(journalTab==="reflection"?"Reflection":"Captures"));},[page,journalTab]);
  useEffect(function(){if(modal)trk("modal."+modal);},[modal]);
  useEffect(function(){
    var targets=new Map();
    var currents=new Map();
    var raf=null;
    function lerp(a,b,t){return a+(b-a)*t;}
    function tick(){
      var anyActive=false;
      targets.forEach(function(t,el){
        if(!el.isConnected){targets.delete(el);currents.delete(el);return;}
        var c=currents.get(el)||{cx:t.tx,cy:t.ty};
        c.cx=lerp(c.cx,t.tx,0.10);
        c.cy=lerp(c.cy,t.ty,0.10);
        el.style.setProperty('--mouse-x',c.cx.toFixed(2)+'%');
        el.style.setProperty('--mouse-y',c.cy.toFixed(2)+'%');
        currents.set(el,c);
        if(Math.abs(c.cx-t.tx)>0.05||Math.abs(c.cy-t.ty)>0.05)anyActive=true;
      });
      raf=anyActive?requestAnimationFrame(tick):null;
    }
    function onMove(e){
      var el=e.target.closest('.card-rim,.glow-item');
      if(!el)return;
      var r=el.getBoundingClientRect();
      targets.set(el,{tx:(e.clientX-r.left)/r.width*100,ty:(e.clientY-r.top)/r.height*100});
      if(!raf)raf=requestAnimationFrame(tick);
    }
    document.addEventListener('mousemove',onMove);
    return function(){document.removeEventListener('mousemove',onMove);if(raf)cancelAnimationFrame(raf);};
  },[]);

  // Wire GCalSync callbacks so gcal-sync.js can push into React state
  useEffect(function(){
    window.__dashSetGcalEvents=function(evs){setGcalEvents(evs||[]);};
    window.__dashSetGcalConnected=function(v){setGcalConnected(!!v);};
    window.__dashSetGcalCalendars=function(cs){setGcalCalendars(cs||[]);};
    window.__dashSetGcalSelectedIds=function(ids){setGcalSelectedIds(ids||[]);};
    window.__dashSetGcalReady=function(){setGcalReady(true);};
    return function(){
      window.__dashSetGcalEvents=null;
      window.__dashSetGcalConnected=null;
      window.__dashSetGcalCalendars=null;
      window.__dashSetGcalSelectedIds=null;
      window.__dashSetGcalReady=null;
    };
  },[]);

  // Capture an error: log to console, add to errLog, show toast
  function captureError(err,fnName){
    var entry={id:Date.now(),time:new Date().toLocaleTimeString(),fn:fnName||"unknown",
      msg:(err&&err.message)?err.message:String(err),
      stack:(err&&err.stack)?err.stack.split("\n").slice(0,6).join("\n"):""};
    console.error("[Dashboard] Error in "+entry.fn+": "+entry.msg);
    if(err&&err.stack)console.error(err.stack);
    setErrLog(function(prev){return[entry].concat(prev).slice(0,20);});
    setShowErrPanel(true);
    showToast("Error in "+entry.fn+": "+entry.msg.slice(0,80),"error");
  }
  // Wire the global pre-React onerror/unhandledrejection to our errLog state
  useEffect(function(){
    window.__dashAddError=function(entry){setErrLog(function(p){return[entry].concat(p).slice(0,20);});setShowErrPanel(true);showToast("Error in "+entry.fn+": "+entry.msg.slice(0,80),"error");};
    // Flush any errors that fired before React mounted
    var q=window.__dashErrQueue||[];q.forEach(function(e){window.__dashAddError(e);});window.__dashErrQueue=[];
    return function(){window.__dashAddError=null;};
  },[]);

  // Listen for auth state — sets DASH_DOC to users/{uid} once signed in
  useEffect(function(){
    var unsub=_auth.onAuthStateChanged(function(user){
      window._currentUser=user;
      if(user){
        window.DASH_DOC=_db.collection('users').doc(user.uid);
        setAuthUser(user);
      }else{
        window.DASH_DOC=null;
        setAuthUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  },[]);
  // Re-read the evening-nudge flag from Firestore when the tab regains focus,
  // so the cron's nudgePending survives the dashboard's full-document auto-save.
  useEffect(function(){
    function checkNudge(){
      if(document.hidden||!window.DASH_DOC) return;
      window.DASH_DOC.get().then(function(doc){
        var sd=doc&&doc.exists?doc.data():null;
        var pending=sd&&sd.dashData&&sd.dashData.boardroom&&sd.dashData.boardroom.nudgePending;
        if(pending){
          setData(function(p){
            if(p.boardroom&&p.boardroom.nudgePending) return p;
            return {...p,boardroom:{...(p.boardroom||{}),nudgePending:true}};
          });
        }
      }).catch(function(){});
    }
    document.addEventListener("visibilitychange",checkNudge);
    window.addEventListener("focus",checkNudge);
    checkNudge();
    return function(){document.removeEventListener("visibilitychange",checkNudge);window.removeEventListener("focus",checkNudge);};
  },[]);
  // Load from Firestore once auth user is known — runs migration first if needed
  useEffect(function(){
    if(!authUser||!window.DASH_DOC){if(!authLoading)setSyncStatus("offline");return;}
    _fbReady.current=false;

    var MIGRATED_KEY='dash_migrated_'+authUser.uid;
    var alreadyMigrated=localStorage.getItem(MIGRATED_KEY)==='1';
    var rawLocal=localStorage.getItem('dash_v1');

    function loadFromFirestore(){
      window.DASH_DOC.get().then(function(doc){
        var safeToEnableSaves=true;
        if(doc.exists){
          var cloud=doc.data().dashData;
          if(cloud){
            var fin=cloud.finance||{};
            if(!fin.financeVersion||fin.financeVersion<2)cloud={...cloud,finance:INIT.finance};
            // Write a rolling daily backup to localStorage the moment we load from Firestore.
            // This ensures recovery is always possible even if a future session corrupts Firestore.
            try{
              var bk='dash_backup_'+new Date().toISOString().slice(0,10);
              localStorage.setItem(bk,JSON.stringify(cloud));
              var bks=Object.keys(localStorage).filter(function(k){return k.startsWith('dash_backup_');}).sort();
              while(bks.length>3){try{localStorage.removeItem(bks.shift());}catch(_){}}
            }catch(_){}
            setData(mergeWithDefaults(cloud));
          }else{
            // Doc exists but dashData field is missing/falsy. This is the wipe edge case:
            // enabling saves here would let the next state change overwrite Firestore with
            // React seed defaults. Refuse to enable saves and surface the failure mode loudly.
            console.error("[Firestore] Doc exists but dashData is missing — refusing to enable saves to prevent overwrite. Investigate the doc manually.");
            safeToEnableSaves=false;
          }
          // Restore cross-device settings if not already set locally
          var settings=doc.data().settings||{};
          if(settings.geminiKey&&!localStorage.getItem('__gemini_key__')){
            var restoredKey=settings.geminiKey.trim();
            setGeminiKey(restoredKey);
            try{localStorage.setItem('__gemini_key__',restoredKey);}catch(_){}
          }
          if(settings.groqKey&&!localStorage.getItem('__groq_key__')){
            var restoredGroq=settings.groqKey.trim();
            setGroqKey(restoredGroq);
            try{localStorage.setItem('__groq_key__',restoredGroq);}catch(_){}
          }
          if(settings.gcalSelected&&!localStorage.getItem('__gcal_selected__')){
            setGcalSelectedIds(settings.gcalSelected);
            try{localStorage.setItem('__gcal_selected__',JSON.stringify(settings.gcalSelected));}catch(_){}
            if(window.GCalSync)window.GCalSync.setSelectedIds(settings.gcalSelected);
          }
          if(settings.gcalExcluded&&!localStorage.getItem('__gcal_excluded__')){
            setGcalExcludedIds(settings.gcalExcluded);
            try{localStorage.setItem('__gcal_excluded__',JSON.stringify(settings.gcalExcluded));}catch(_){}
          }
        }
        if(safeToEnableSaves){
          _dataLoaded.current=true;
          _fbReady.current=true;
          setSyncStatus("synced");
        }else{
          setSyncStatus("offline");
          try{showToast("Cloud data field missing — saves disabled. Contact dev to investigate.","error");}catch(_){}
        }
      }).catch(function(err){
        console.error("[Firestore] Load failed:",err);
        // IMPORTANT: do NOT set _fbReady or _dataLoaded on error.
        // If we did, the empty initial state would get saved over real Firestore data
        // on the next user interaction. Stay in offline mode instead.
        setSyncStatus("offline");
      });
    }

    // Run migration only if: not already migrated AND local data exists
    if(!alreadyMigrated&&rawLocal){
      var parsed;
      try{ parsed=JSON.parse(rawLocal); }catch(e){
        console.warn("[Migration] Failed to parse localStorage data:",e);
        localStorage.setItem(MIGRATED_KEY,'1');
        loadFromFirestore();
        return;
      }

      // SAFETY: refuse to migrate seed-shaped local data. dash_v1 is written from React
      // state by the save effect — including the initial seed state — so on a fresh browser
      // it contains defaults, not real user data. Uploading that to Firestore would wipe
      // whatever the user actually has in the cloud.
      if(isLikelySeedState(mergeWithDefaults(parsed))){
        console.warn("[Migration] localStorage data looks seed-shaped — skipping upload to prevent Firestore overwrite. Loading from Firestore instead.");
        localStorage.setItem(MIGRATED_KEY,'1');
        loadFromFirestore();
        return;
      }

      showToast("Migrating your saved data to the cloud…","warn");

      window.DASH_DOC.set({dashData:stripUndefined(mergeWithDefaults(parsed))}).then(function(){
        localStorage.setItem(MIGRATED_KEY,'1');
        localStorage.removeItem('dash_v1');
        showToast("Migration complete! Your data is now synced.","success");
        _dataLoaded.current=true;
        _fbReady.current=true;
        setSyncStatus("synced");
        setData(mergeWithDefaults(parsed));
      }).catch(function(err){
        console.error("[Migration] Upload failed:",err);
        showToast("Migration failed — your data is still saved locally.","error");
        // Do NOT set _fbReady on migration failure — local data is still in dash_v1
        // and we don't want to risk overwriting Firestore with anything
        setSyncStatus("offline");
      });
    }else{
      loadFromFirestore();
    }
  },[authUser]);
  // Save to localStorage immediately + Firestore (debounced 2s)
  useEffect(function(){
    try{localStorage.setItem("dash_v1",JSON.stringify(data));}catch(_){}
    // Require BOTH flags: _fbReady (connected) AND _dataLoaded (confirmed Firebase state).
    // This prevents the race condition where empty initial state saves over real Firestore data
    // when opening the dashboard on a new device before Firebase finishes loading.
    if(!_fbReady.current||!_dataLoaded.current||!window.DASH_DOC)return;
    // SAFETY: never save seed-shaped state. If ALL user-generated arrays are empty, this is
    // almost certainly React initial state and saving would wipe real cloud data. The 2026-05-29
    // wipe happened here. Refuse the write and surface it loudly.
    if(isLikelySeedState(data)){
      console.error("[SAFETY] Refused to save seed-shaped state to Firestore — would have wiped real data. State:",data);
      try{showToast("Refused to save empty state — possible bug, data not synced.","error");}catch(_){}
      setSyncStatus("offline");
      return;
    }
    setSyncStatus("syncing");
    if(_saveTimer.current)clearTimeout(_saveTimer.current);
    _saveTimer.current=setTimeout(function(){
      window.DASH_DOC.set({dashData:stripUndefined(data)}).then(function(){setSyncStatus("synced");}).catch(function(e){console.error("[Firestore] Write failed:",e.message);setSyncStatus("offline");});
    },2000);
  },[data]);
  useEffect(function(){
    if(!_fbReady.current||!_dataLoaded.current||!window.DASH_DOC)return;
    window.DASH_DOC.set({settings:{geminiKey:geminiKey,groqKey:groqKey,gcalSelected:gcalSelectedIds,gcalExcluded:gcalExcludedIds}},{merge:true}).catch(function(){});
  },[geminiKey,groqKey,gcalSelectedIds,gcalExcludedIds]);
  // Start health monitor (runs checks every 30s)
  useEffect(function(){if(window.HealthMonitor){HealthMonitor.start();}return function(){if(window.HealthMonitor)HealthMonitor.stop();};},[]);
  // Fetch version badge from version.json written by release workflow
  useEffect(function(){
    fetch("version.json?_="+Date.now()).then(function(r){return r.ok?r.json():null;}).then(function(d){
      if(d&&d.version)setAppVersion(d);
    }).catch(function(){});
  },[]);
  useEffect(function(){
    if(page!=="Journal"||journalTab!=="captures"||!window._currentUser||!window._db)return;
    setCapturesLoading(true);
    _db.collection('users').doc(window._currentUser.uid).collection('captures').get().then(function(snap){
      var items=[];
      snap.forEach(function(doc){items.push({id:doc.id,...doc.data()});});
      items.sort(function(a,b){
        var ta=a.date&&a.date.toDate?a.date.toDate().getTime():0;
        var tb=b.date&&b.date.toDate?b.date.toDate().getTime():0;
        return tb-ta;
      });
      setCapturesData(items);setCapturesLoading(false);
    }).catch(function(){setCapturesLoading(false);});
  },[page,journalTab]);

  const baseDate=new Date();baseDate.setDate(baseDate.getDate()+wkOff*7);
  const weekDates=getWeekDates(baseDate);
  const thisWeek=weekMonday();
  const bwLogged=data.gym.lastBWWeek===thisWeek;
  const dow=new Date().getDay();const dLeft=dow===0?0:7-dow;
  const bwUrg=bwLogged?"done":dLeft>=4?"blue":dLeft>=2?"yellow":"red";
  const bwColMap={blue:T.accent,yellow:T.warn,red:T.danger,done:T.success};
  const gymRot=data.gym.rotation||[];const gymRotLen=gymRot.length>0?gymRot.length:1;
  const gymRotIdx=(data.gym.rotIdx||0)%gymRotLen;const nextRot=gymRot.length>0?gymRot[gymRotIdx]:null;
  const dedupedEvents=dedupeEvents(gcalEvents);
  const visibleGcalEvents=dedupedEvents.filter(function(ev){
    if(gcalExcludedIds.indexOf(ev.calId)!==-1)return false;
    if(gcalSelectedIds.length===0)return true;
    return gcalSelectedIds.indexOf(ev.calId)!==-1;
  });
  function toggleExclude(calId){
    setGcalExcludedIds(function(prev){
      var next=prev.indexOf(calId)!==-1?prev.filter(function(x){return x!==calId;}):prev.concat([calId]);
      try{localStorage.setItem('__gcal_excluded__',JSON.stringify(next));}catch(_){}
      return next;
    });
  }
  // Assessment helpers
  function typeBadge(type){
    if(type==="IN-CLASS")return{label:"IN-CLASS",bg:"rgba(255,154,60,0.12)",color:"#ffb06a",border:"rgba(255,154,60,0.28)"};
    if(type==="EXAM")return{label:"EXAM",bg:"rgba(255,107,107,0.12)",color:"#ff9090",border:"rgba(255,107,107,0.28)"};
    if(type==="SUBMISSION")return{label:"SUBMISSION",bg:"rgba(91,140,255,0.12)",color:"#8eb4ff",border:"rgba(91,140,255,0.28)"};
    return{label:"ASSESSMENT",bg:"rgba(255,209,102,0.12)",color:"#ffd166",border:"rgba(255,209,102,0.28)"};
  }
  // Upcoming pulls from structured assessments — no GCal keyword matching needed
  const allAssessments=data.uni.assessments||SYLLABUS_ASSESSMENTS;
  const upcoming=allAssessments.filter(function(a){return !a.done&&a.date>=todayStr();}).sort(function(a,b){return a.date.localeCompare(b.date);}).slice(0,8).map(function(a){return{id:a.id,title:a.name,date:a.date,subject:a.subject,badge:typeBadge(a.type)};});
  const activeTasks=data.personal.tasks.filter(function(t){return !t.done;});
  const doneTasks=data.personal.tasks.filter(function(t){return t.done;});
  const urgTasks=activeTasks.filter(function(t){return t.priority==="urgent";}).sort(function(a,b){return new Date(a.due||"9999")-new Date(b.due||"9999");});
  const normTasks=activeTasks.filter(function(t){return t.priority==="normal";}).sort(function(a,b){return new Date(a.due||"9999")-new Date(b.due||"9999");});
  const todayEvs=visibleGcalEvents.filter(function(ev){return ev.date===todayStr()&&!ev.allDay;}).sort(function(a,b){return(a.time||"").localeCompare(b.time||"");});
  const shifts=visibleGcalEvents.filter(isGoTabEvent);

  function doCheckin(){
    setCheckinLoading(true);setCheckinBlocks([]);
    var key=(geminiKey||localStorage.getItem('__gemini_key__')||'').trim();
    if(!key){setCheckinBlocks(generateCheckinFallback(data));setCheckinLoading(false);return;}

    // ── Raw data ─────────────────────────────────────────────────────────────
    var cachedEvs=[];try{var ce=localStorage.getItem('__gcal_events__');if(ce)cachedEvs=JSON.parse(ce);}catch(_){}
    var td=todayStr();
    var yday=new Date();yday.setDate(yday.getDate()-1);var ydayStr=dStr(yday);

    var todayEvs=cachedEvs.filter(function(ev){return ev.date===td&&!ev.allDay;});
    var workedYesterday=cachedEvs.some(function(ev){return ev.date===ydayStr&&isGoTabEvent(ev);});
    var workingToday=todayEvs.some(isGoTabEvent);
    var nonWorkEvs=todayEvs.filter(function(ev){return !isGoTabEvent(ev);});

    var tasks=(data.personal&&data.personal.tasks)||[];
    var overdueTasks=tasks.filter(function(t){return !t.done&&t.due&&t.due<td;});
    var urgentTasks=tasks.filter(function(t){return !t.done&&t.priority==='urgent'&&(!t.due||t.due>=td);});

    var in7=new Date();in7.setDate(in7.getDate()+7);var in7Str=dStr(in7);
    var upcomingA=(data.uni&&data.uni.assessments||[]).filter(function(a){return !a.done&&a.date>=td&&a.date<=in7Str;}).sort(function(a,b){return a.date.localeCompare(b.date);});

    var gymRot=(data.gym&&data.gym.rotation)||[];
    var nextGym=gymRot.length>0?gymRot[((data.gym&&data.gym.rotIdx)||0)%gymRot.length]:null;
    var workouts=(data.gym&&data.gym.workouts)||[];
    var lastWkt=workouts.length>0?workouts[workouts.length-1]:null;
    var daysSinceGym=lastWkt?Math.abs(daysBetween(lastWkt.date)):null;
    var bwThisWeek=!!(data.gym&&data.gym.lastBWWeek===thisWeek);

    var recentRefls=(data.reflections||[]).slice(-2).reverse();
    var lastRefl=recentRefls[0]||null;
    var an=(lastRefl&&lastRefl.analysis)||{};

    var subjects=(data.uni&&data.uni.subjects||[]).map(function(s){return s.name;}).join(', ');

    // ── Build context string ─────────────────────────────────────────────────
    var ctx='WHO: Jayden — TAFE Melbourne accounting student. Subjects: '+subjects+'.\n';

    if(workedYesterday) ctx+='WORK: Had a GoTab shift yesterday — energy may be lower today.\n';
    if(workingToday)    ctx+='WORK: GoTab shift today.\n';

    ctx+='\nCALENDAR TODAY:\n'+(nonWorkEvs.length>0?nonWorkEvs.map(function(ev){return'- '+ev.title+(ev.time?' at '+ev.time:'');}).join('\n'):'No events today')+'\n';

    if(upcomingA.length>0){
      ctx+='\nASSESSMENTS DUE SOON:\n';
      upcomingA.forEach(function(a){ctx+='- '+a.subject+' '+a.name+' in '+daysBetween(a.date)+'d\n';});
    }

    if(overdueTasks.length>0){
      ctx+='\nOVERDUE: '+overdueTasks.map(function(t){return t.name;}).join(', ')+'\n';
    } else if(urgentTasks.length>0){
      ctx+='\nURGENT TASKS: '+urgentTasks.slice(0,3).map(function(t){return t.name;}).join(', ')+'\n';
    }

    if(nextGym){
      var gymLine='Next: '+nextGym.name+(nextGym.focus?' ('+nextGym.focus+')':'');
      if(daysSinceGym===0) gymLine+=' — logged today';
      else if(daysSinceGym===1) gymLine+=' — last session yesterday';
      else if(daysSinceGym!==null) gymLine+=' — '+daysSinceGym+'d since last session';
      ctx+='\nGYM: '+gymLine+'\n';
    }
    if(!bwThisWeek) ctx+='GYM: Body weight not yet logged this week.\n';

    if(lastRefl&&an.dominantPattern){
      var reflDate=new Date(lastRefl.date).toLocaleDateString('en-AU',{day:'numeric',month:'short'});
      ctx+='\nLAST REFLECTION ('+reflDate+'):\n';
      ctx+='  Pattern identified: '+an.dominantPattern+'\n';
      if(an.recommendation) ctx+='  Recommendation: '+an.recommendation+'\n';
      if(recentRefls.length>=2&&an.patternHistory) ctx+='  Trend: '+an.patternHistory+'\n';
    }

    // ── Prompt ───────────────────────────────────────────────────────────────
    var prompt='You are Jayden\'s personal coach. You know him — TAFE accounting student, works GoTab shifts, trains at the gym, does weekly reflections.\n\n'+ctx+'\nWrite a personalised morning check-in. Exactly 3 lines:\nLine 1: Acknowledge his specific day — name actual assessments, work, or events if present\nLine 2: One concrete suggestion tied to his context (if reflection data present, connect to the identified pattern or recommendation)\nLine 3: A question that feels personal to his actual situation — not generic\n\nRules: under 65 words. Use his name once. Warm and direct — not cheesy. Plain lines, no bullets or numbers.';

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.75}})})
      .then(function(r){if(!r.ok)throw new Error('Gemini '+r.status);return r.json();})
      .then(function(json){
        var text=json.candidates[0].content.parts[0].text;
        var lines=text.trim().split('\n').map(function(l){return l.replace(/^[\d.\-*]+\s*/,'').trim();}).filter(function(l){return l.length>0;});
        var blocks=[];
        if(lines[0])blocks.push({header:'Your Day Ahead',items:[lines[0]]});
        if(lines[1])blocks.push({header:'Suggestion',items:[lines[1]]});
        if(lines[2])blocks.push({header:'Check-in',items:[lines[2]]});
        setCheckinBlocks(blocks.length>0?blocks:generateCheckinFallback(data));
        setCheckinLoading(false);
      })
      .catch(function(e){showToast('Check-in failed: '+(e&&e.message?e.message:'unknown error'),'error');setCheckinBlocks(generateCheckinFallback(data));setCheckinLoading(false);});
  }
  function toggleCalEv(id){trk("uni.gcal_event_toggle");setData(function(p){const ce=p.uni.completedEvents||[];const next=ce.indexOf(id)!==-1?ce.filter(function(x){return x!==id;}):ce.concat([id]);return{...p,uni:{...p.uni,completedEvents:next}};});}
  function brOpener(mode){
    if(mode==="evening"){
      return [{role:"assistant",persona:"Chris",text:"Walk me through your day. What actually happened — not the highlight reel?",ts:Date.now()}];
    }
    if(mode==="drift"){
      return [{role:"assistant",persona:"Chris",text:"You opened this in the middle of the day. That usually means something's off. What's going on right now?",ts:Date.now()}];
    }
    return [];
  }
  function brOpen(){
    trk("boardroom.open");
    setShowBoardroom(true);
    var b=data.boardroom||{};
    if(b.nudgePending){setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),nudgePending:false}};});}
    if(brMessages&&brMessages.length) return;
    if(b.messages&&b.messages.length){
      setBrMessages(b.messages);
      if(b.lastSpeaker) setBrLastSpeaker(b.lastSpeaker);
      return;
    }
    if(!b.onboarded){
      setBrMessages([{role:"assistant",persona:"Chris",text:"Before we get into tasks — I want to understand you, not just your to-do list. What does \"better\" actually look like for you right now?",ts:Date.now()}]);
      setBrLastSpeaker("Chris");
    } else {
      var seed=brOpener(brSessionMode());
      if(seed.length){
        setBrMessages(seed);
        setBrLastSpeaker(seed[seed.length-1].persona);
      }
    }
  }
  function brSessionMode(){
    var h=new Date().getHours();
    if(!(data.boardroom&&data.boardroom.onboarded)) return "onboarding";
    if(h>=17) return "evening";
    return "drift";
  }
  function brSend(){
    var text=brInput.trim();
    if(!text||brLoading) return;
    if(!groqKey.trim()){showToast("Add your Groq API key in Settings first","warn");return;}
    var hist=brMessages.map(function(m){return m.role==="user"?{role:"user",content:m.text}:{role:"assistant",content:m.persona+": "+m.text};}); // history BEFORE this message
    var userMsg={role:"user",persona:null,text:text,ts:Date.now()};
    setBrMessages(function(p){return p.concat([userMsg]);});
    setBrInput("");
    var intent=BoardroomService.detectMode(text);
    var wasPending=brPendingIntent;
    if(intent==="ambiguous"){
      if(wasPending&&wasPending.reconfirmed){ brRun(text,"direction",hist,userMsg); return; } // asked twice — stop guessing, default to direction
      setBrPendingIntent({text:text,hist:hist,userMsg:userMsg,reconfirmed:!!wasPending}); // UI shows the one-tap confirm; no model call
      return;
    }
    setBrPendingIntent(null);
    brRun(text,intent,hist,userMsg);
  }
  // Tap-to-confirm when intent was ambiguous: route the original message to the chosen mode.
  function brConfirmIntent(intent){
    if(!brPendingIntent) return;
    var pi=brPendingIntent;
    setBrPendingIntent(null);
    brRun(pi.text,intent,pi.hist,pi.userMsg);
  }
  // Shared runner: 'direction' → deliberation loop, 'howto' → step-by-step. userMsg is already rendered; hist is the history before it.
  function brRun(text,intent,hist,userMsg){
    setBrLoading(true);
    setBrIntentMode(intent);
    var mode=brSessionMode();
    var cachedEvs=[];try{var ce=localStorage.getItem('__gcal_events__');if(ce)cachedEvs=JSON.parse(ce);}catch(_){}
    var ctx=BoardroomService.buildContext(data,{todayStr:todayStr,dStr:dStr,daysBetween:daysBetween,isGoTabEvent:isGoTabEvent,thisWeek:thisWeek,cachedEvs:cachedEvs});
    var ns=(data.boardroom&&data.boardroom.northStar)||"";
    var km=(data.boardroom&&data.boardroom.keyMoments)||[];
    var goals=(data.boardroom&&data.boardroom.goals)||[];
    var projectContext=(data.boardroom&&data.boardroom.projectContext)||"";
    var coachMsgs=[];
    var onTurn=function(turn){
      var m={role:"assistant",persona:turn.persona,text:turn.text,ts:Date.now()};
      coachMsgs.push(m);
      setBrMessages(function(p){return p.concat([m]);});
    };
    var run=intent==="howto"
      ? BoardroomService.howTo(ctx,ns,goals,projectContext,mode,hist,text,onTurn)
      : BoardroomService.deliberate(ctx,ns,km,goals,mode,hist,text,onTurn);
    run.then(function(replies){
      var last=(replies&&replies.length)?replies[replies.length-1].persona:"Chris";
      setBrLastSpeaker(last);
      setData(function(p){
        var msgs=(p.boardroom&&p.boardroom.messages)||[];
        return{...p,boardroom:{...(p.boardroom||{}),messages:msgs.concat([userMsg].concat(coachMsgs)),sessionStartedAt:(p.boardroom&&p.boardroom.sessionStartedAt)||new Date().toISOString(),lastSpeaker:last}};
      });
      setBrLoading(false);
    }).catch(function(e){
      // Preserve any turns that already streamed before the error (e.g. a 429 mid-deliberation).
      if(coachMsgs.length){
        setBrLastSpeaker(coachMsgs[coachMsgs.length-1].persona);
        setData(function(p){
          var msgs=(p.boardroom&&p.boardroom.messages)||[];
          return{...p,boardroom:{...(p.boardroom||{}),messages:msgs.concat([userMsg].concat(coachMsgs)),sessionStartedAt:(p.boardroom&&p.boardroom.sessionStartedAt)||new Date().toISOString()}};
        });
      }
      if(e&&e.rateLimited) showToast("Boardroom paused — Groq's free limit was hit. Wait ~30s, then continue.","warn");
      else showToast("Boardroom: "+(e&&e.message||"error"),"error");
      setBrLoading(false);
    });
  }
  function brEndSession(){
    if(brMessages.filter(function(m){return m.role==="user";}).length<1){setShowBoardroom(false);return;}
    setBrLoading(true);
    setBrClosing(true);
    var mode=brSessionMode();
    var fullTranscript=brMessages.slice();
    BoardroomService.closingRound(fullTranscript).then(function(closingMsgs){
      var allMsgs=fullTranscript.concat(closingMsgs.map(function(m){return{role:"assistant",persona:m.persona,text:m.text,ts:Date.now()};}));
      setBrMessages(function(p){return p.concat(closingMsgs.map(function(m){return{role:"assistant",persona:m.persona,text:m.text,ts:Date.now()};}));});
      return BoardroomService.summarizeSession(allMsgs,mode).then(function(km){
        var newMoment={date:todayStr(),summary:km.summary,commitments:(km.commitments||[]).map(function(c){return{text:c,done:false};}),mode:mode,transcript:allMsgs.map(function(m){return{role:m.role,persona:m.persona||null,text:m.text};})};
        var prev=(data.boardroom&&data.boardroom.keyMoments)||[];
        var existingGoals=(data.boardroom&&data.boardroom.goals)||[];
        function finishSave(moments){
          setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),keyMoments:moments,messages:[],sessionStartedAt:null,lastSpeaker:null}};});
          setBrMessages([]);
          setBrLastSpeaker(null);
          setBrClosing(false);
          setBrLoading(false);
          setShowBoardroom(false);
          showToast("Session saved","success");
          setPage("Boardroom");
        }
        function saveWithGoals(moments){
          BoardroomService.extractGoals(allMsgs,existingGoals).then(function(proposed){
            setBrGoalProposals(proposed||[]);
            if(prev.length>=15){
              BoardroomService.amalgamate(prev.slice(0,10)).then(function(patterns){
                var compacted=patterns.map(function(s){return{date:"pattern",summary:s,commitments:[],mode:"amalgamated"};});
                finishSave(compacted.concat(prev.slice(10)).concat([moments]));
              }).catch(function(){finishSave(prev.concat([moments]).slice(-15));});
            } else {
              finishSave(prev.concat([moments]));
            }
          });
        }
        saveWithGoals(newMoment);
      });
    }).catch(function(){
      setBrClosing(false);
      setBrLoading(false);
      setShowBoardroom(false);
    });
  }
  function brAcceptGoal(proposed) {
    var newGoal={
      id: Date.now()+'_'+Math.random().toString(36).slice(2,7),
      title: proposed.title,
      area: proposed.area,
      status: "active",
      createdAt: todayStr(),
      targetDate: null,
      achievedAt: null,
      milestones: []
    };
    setData(function(p){
      var goals=(p.boardroom&&p.boardroom.goals)||[];
      return{...p,boardroom:{...(p.boardroom||{}),goals:goals.concat([newGoal])}};
    });
    setBrGoalProposals(function(p){return p.filter(function(g){return g.title!==proposed.title;});});
  }
  function brSkipGoal(proposed){
    setBrGoalProposals(function(p){return p.filter(function(g){return g.title!==proposed.title;});});
  }
  function brMarkGoalAchieved(goalId){
    setData(function(p){
      var goals=(p.boardroom&&p.boardroom.goals)||[];
      var updated=goals.map(function(g){return g.id===goalId?{...g,status:"achieved",achievedAt:todayStr()}:g;});
      return{...p,boardroom:{...(p.boardroom||{}),goals:updated}};
    });
  }
  function brToggleCommitment(momentIdx, commitIdx){
    setData(function(p){
      var km=(p.boardroom&&p.boardroom.keyMoments)||[];
      var updated=km.map(function(m,mi){
        if(mi!==momentIdx) return m;
        var commits=m.commitments||[];
        var newCommits=commits.map(function(c,ci){
          if(ci!==commitIdx) return c;
          if(typeof c==='string') return c;
          return{...c,done:!c.done};
        });
        return{...m,commitments:newCommits};
      });
      return{...p,boardroom:{...(p.boardroom||{}),keyMoments:updated}};
    });
  }
  function brFinishOnboarding(){
    if(brMessages.filter(function(m){return m.role==="user";}).length<1){showToast("Chat a bit first so we can set your North Star","warn");return;}
    setBrLoading(true);
    var transcript=brMessages.slice();
    var existingGoals=(data.boardroom&&data.boardroom.goals)||[];
    BoardroomService.buildNorthStar(transcript).then(function(ns){
      return BoardroomService.summarizeSession(transcript,"onboarding").then(function(km){
        var moment={date:todayStr(),summary:km.summary,commitments:(km.commitments||[]).map(function(c){return{text:c,done:false};}),mode:"onboarding",transcript:transcript.map(function(m){return{role:m.role,persona:m.persona||null,text:m.text};})};
        setData(function(p){
          var pb=p.boardroom||{};
          var pkm=pb.keyMoments||[];
          return{...p,boardroom:{...pb,onboarded:true,northStar:(ns||"").trim(),keyMoments:pkm.concat([moment]),messages:[],sessionStartedAt:null,lastSpeaker:null}};
        });
        BoardroomService.extractGoals(transcript,existingGoals).then(function(proposed){setBrGoalProposals(proposed||[]);}).catch(function(){});
        setBrMessages([]);
        setBrLastSpeaker(null);
        setBrLoading(false);
        setShowBoardroom(false);
        showToast("North Star set. The Boardroom knows your direction now.","success");
        setPage("Boardroom");
      });
    }).catch(function(e){setBrLoading(false);showToast("Couldn't finish setup: "+(e&&e.message||"error"),"error");});
  }
  function brRedoConsultation(){
    if(!window.confirm("Start a fresh consultation? It sets a new North Star — your current one is kept in the Session Log below, and your goals and history stay untouched.")) return;
    trk("boardroom.redo");
    setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),onboarded:false,messages:[],sessionStartedAt:null,lastSpeaker:null}};});
    setBrMessages([{role:"assistant",persona:"Chris",text:"Let's reset and go deep again. What does \"better\" actually look like for you right now — today, not in theory?",ts:Date.now()}]);
    setBrLastSpeaker("Chris");
    setShowBoardroom(true);
  }
  // ── Backup & restore helpers ───────────────────────────────────────────────
  function getLatestBackup(){
    try{
      var bks=Object.keys(localStorage).filter(function(k){return k.startsWith('dash_backup_');}).sort();
      if(bks.length===0)return null;
      var raw=localStorage.getItem(bks[bks.length-1]);
      if(!raw)return null;
      return{key:bks[bks.length-1],data:JSON.parse(raw)};
    }catch(_){return null;}
  }
  function exportData(){
    try{
      var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
      var a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download="dashboard-backup-"+new Date().toISOString().slice(0,10)+".json";
      a.click();
    }catch(e){showToast("Export failed: "+e.message,"error");}
  }
  function downloadObsidianExport(){
    if(!window._currentUser){showToast("Sign in first","error");return;}
    if(capturesData.length===0){showToast("Visit the Journal → Captures tab first so they load, then try again","warn");return;}
    var payload={
      exportedAt:new Date().toISOString(),
      captures:capturesData,
      reflections:data.reflections||[]
    };
    var blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="obsidian-export.json";
    a.click();
    showToast("Downloaded — move to my-project folder then run: node export-to-obsidian.js","success");
  }
  function restoreFromBackup(){
    var bk=getLatestBackup();
    if(!bk){showToast("No local backup found","error");return;}
    var merged=mergeWithDefaults(bk.data);
    setData(merged);
    // Also push to Firestore immediately if connected
    if(_fbReady.current&&_dataLoaded.current&&window.DASH_DOC){
      window.DASH_DOC.set({dashData:stripUndefined(merged)}).then(function(){
        showToast("Restored from backup ("+bk.key.replace("dash_backup_","")+") and saved to cloud","success");
        setSyncStatus("synced");
      }).catch(function(){showToast("Restored locally — cloud sync failed","warn");});
    }else{
      showToast("Restored from backup ("+bk.key.replace("dash_backup_","")+"). Reconnect to sync to cloud.","success");
    }
  }
  function toggleAssessmentDone(id){trk("uni.assessment_complete");setData(function(p){const as=p.uni.assessments||[];return{...p,uni:{...p.uni,assessments:as.map(function(a){return a.id===id?{...a,done:!a.done}:a;})}};}); }
  function removeAssessment(id){setData(function(p){return{...p,uni:{...p.uni,assessments:(p.uni.assessments||[]).filter(function(a){return a.id!==id;})}};}); }
  function addAssessment(){
    if(!addAssessForm.name||!addAssessForm.date)return;
    const na={id:"custom-"+Date.now(),subject:addAssessForm.subject,name:addAssessForm.name,type:addAssessForm.type,date:addAssessForm.date,done:false};
    setData(function(p){return{...p,uni:{...p.uni,assessments:(p.uni.assessments||[]).concat([na])}};});
    setAddAssessForm({subject:"WIA&B",name:"",type:"SUBMISSION",date:todayStr()});
    setShowAddAssess(false);
  }
  async function parseWithGemini(){
    if(!syllabusText.trim()){return;}
    var key=geminiKey.trim();
    if(!key){showToast("Paste your Gemini API key first","error");return;}
    try{localStorage.setItem('__gemini_key__',key);}catch(_){}
    setGeminiLoading(true);setGeminiPreview(null);
    try{
      const prompt="Parse this university syllabus. Extract ONLY formal graded assessments (NOT quizzes, NOT self-testing exercises, NOT review questions, NOT resubmissions).\n\nSemester starts: "+syllabusStart+"\nWeek 1 = week of "+syllabusStart+"\nToday: "+todayStr()+"\n\nSubjects (use exact keys): WIA&B, POB, BAS/IAS, FinStmts NRE, Payroll, PFR, Law\n\nFor each assessment:\n- subject: one of the exact keys above\n- name: short descriptive name\n- type: IN-CLASS (supervised/in-class) | SUBMISSION (online submission/assignment) | EXAM\n- date: YYYY-MM-DD calculated from week number and semester start\n- done: false\n- id: short unique slug like 'wiab-at1'\n\nReturn ONLY a raw JSON array. No markdown, no explanation.\n\nSyllabus:\n"+syllabusText;
      const resp=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+key,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.1}})});
      if(!resp.ok)throw new Error("Gemini API error "+resp.status);
      const json=await resp.json();
      const text=json.candidates[0].content.parts[0].text;
      const match=text.match(/\[[\s\S]*\]/);
      if(!match)throw new Error("No JSON array in response");
      const parsed=JSON.parse(match[0]);
      setGeminiPreview(parsed);
    }catch(e){showToast("Gemini error: "+e.message,"error");}
    setGeminiLoading(false);
  }
  function saveGeminiPreview(){
    if(!geminiPreview||geminiPreview.length===0)return;
    setData(function(p){return{...p,uni:{...p.uni,assessments:geminiPreview.map(function(a){return{...a,done:a.done||false};})}}; });
    setGeminiPreview(null);setSyllabusText("");setShowSyllabusImport(false);
    showToast("Assessments saved!","success");
  }
  function updateProg(id,val){setData(function(p){return{...p,uni:{...p.uni,subjects:p.uni.subjects.map(function(s){return s.id===id?{...s,progress:Number(val)}:s;})}}; });}
  function toggleTask(id){setData(function(p){const ts=p.personal.tasks||[];const cur=ts.find(function(t){return t.id===id;});trk(cur&&cur.done?"task.uncomplete":"task.complete");return{...p,personal:{...p.personal,tasks:ts.map(function(t){return t.id===id?{...t,done:!t.done}:t;})}}; });}
  function archiveDone(){trk("task.archive");setData(function(p){const ts=p.personal.tasks||[];const done=ts.filter(function(t){return t.done;}).map(function(t){return{...t,archivedAt:todayStr()};});return{...p,personal:{...p.personal,tasks:ts.filter(function(t){return !t.done;}),archived:(p.personal.archived||[]).concat(done)}};});}
  function restoreTask(id){trk("task.restore");setData(function(p){const arch=p.personal.archived||[];const match=arch.filter(function(t){return t.id===id;});if(match.length===0)return p;const ts=p.personal.tasks||[];return{...p,personal:{...p.personal,tasks:ts.concat([{...match[0],done:false,archivedAt:undefined}]),archived:arch.filter(function(x){return x.id!==id;})}};});}
  function saveEditTask(){
    if(window.DataValidator){
      const r=DataValidator.validate("task",{name:editTaskForm.name,priority:editTaskForm.priority||"normal",due:editTaskForm.due||null,cat:editTaskForm.cat});
      if(!r.valid){showToast(r.firstError);return;}
    }
    setData(function(p){const ts=p.personal.tasks||[];return{...p,personal:{...p.personal,tasks:ts.map(function(t){return t.id===editTaskId?{...t,...editTaskForm,editedAt:todayStr()}:t;})}}; });
    trk("task.edit");setEditTaskId(null);setEditTaskForm({});
    showToast("Task updated!","success");
  }
  function logBW(){
    if(!bwIn)return;
    if(window.DataValidator){
      const r=DataValidator.validate("bodyWeight",{weight:Number(bwIn),date:bwDate||todayStr()});
      if(!r.valid){showToast(r.firstError);return;}
    }
    trk("gym.bodyweight_log");
    const entryDate=bwDate||todayStr();
    setData(function(p){
      const existing=(p.gym.bodyWeight||[]).filter(function(e){return e.date!==entryDate;});
      const updated=existing.concat([{date:entryDate,weight:Number(bwIn)}]).sort(function(a,b){return a.date.localeCompare(b.date);});
      return{...p,gym:{...p.gym,bodyWeight:updated,lastBWWeek:entryDate>=thisWeek?thisWeek:p.gym.lastBWWeek}};
    });
    setBwIn("");setBwDate(todayStr());setBwEditing(false);
    showToast("Body weight logged!","success");
  }
  function deleteBWEntry(dateStr){
    setData(function(p){
      var newBW=(p.gym.bodyWeight||[]).filter(function(e){return e.date!==dateStr;});
      return{...p,gym:{...p.gym,bodyWeight:newBW,lastBWWeek:dateStr>=thisWeek?null:p.gym.lastBWWeek}};
    });
    showToast("Entry removed","success");
  }
  function submitCapture(){trk("capture.save");
    if(!captureText.trim())return;
    if(!window.GeminiService){showToast("Gemini service not loaded.","error");return;}
    setCaptureLoading(true);setCaptureResult(null);
    window.GeminiService.classify(captureText).then(function(result){
      setCaptureResult(result);setCaptureLoading(false);
      if(window._currentUser&&window._db){
        _db.collection('users').doc(window._currentUser.uid).collection('captures').add({
          uid:window._currentUser.uid,
          type:result.type||"thought",
          title:result.title||"",
          content:result.content||"",
          formula:result.formula||"",
          example:result.example||"",
          subject:result.subject||"",
          tags:result.tags||[],
          rawInput:captureText,
          date:firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        }).then(function(){setCaptureText("");})
          .catch(function(e){showToast("Save failed — "+(e.message||"check connection."),"error");});
      }
    }).catch(function(e){
      setCaptureLoading(false);
      showToast("Capture failed: "+(e.message||"Check your Gemini API key in settings."),"error");
    });
  }

  function openEditCapture(c,ev){
    if(ev)ev.stopPropagation();
    setEditCaptureData({...c});
    setEditCaptureTagStr((c.tags||[]).join(", "));
  }
  function saveEditCapture(){trk("capture.edit");
    if(!editCaptureData||!window._currentUser||!window._db)return;
    var tagsArr=editCaptureTagStr.split(",").map(function(t){return t.trim().toLowerCase();}).filter(Boolean);
    _db.collection('users').doc(window._currentUser.uid).collection('captures').doc(editCaptureData.id).update({
      title:editCaptureData.title||"",
      content:editCaptureData.content||"",
      formula:editCaptureData.formula||"",
      example:editCaptureData.example||"",
      tags:tagsArr,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    }).then(function(){
      setCapturesData(function(prev){return prev.map(function(c){
        if(c.id!==editCaptureData.id)return c;
        return{...c,title:editCaptureData.title,content:editCaptureData.content,formula:editCaptureData.formula,example:editCaptureData.example,tags:tagsArr};
      });});
      showToast("Capture updated — will re-export on next sync","success");
      setEditCaptureData(null);
    }).catch(function(e){showToast("Save failed: "+e.message,"error");});
  }

  function nearestHalfHour(){
    var d=new Date();var m=d.getHours()*60+d.getMinutes();
    var rounded=Math.ceil(m/30)*30;var h=Math.floor(rounded/60)%24;var min=rounded%60;
    return String(h).padStart(2,"0")+":"+String(min).padStart(2,"0");
  }
  function openSchedulePicker(taskId,ds,existingTime,existingDuration){
    if(!taskId)return;
    setScheduleTaskId(taskId);setScheduleForDay(ds);
    setScheduleTime(existingTime||nearestHalfHour());setScheduleDuration(existingDuration||60);
    setShowTimePicker(true);
  }
  function confirmSchedule(justDate){
    if(!scheduleTaskId||!scheduleForDay)return;
    if(justDate){
      setData(function(p){return{...p,personal:{...p.personal,tasks:p.personal.tasks.map(function(t){return t.id===scheduleTaskId?{...t,due:scheduleForDay,editedAt:todayStr()}:t;})}}; });
      showToast("Due date set to "+fmtDate(scheduleForDay),"success");
    }else{
      setData(function(p){return{...p,personal:{...p.personal,tasks:p.personal.tasks.map(function(t){return t.id===scheduleTaskId?{...t,due:scheduleForDay,scheduledDate:scheduleForDay,scheduledTime:scheduleTime,scheduledDuration:scheduleDuration,editedAt:todayStr()}:t;})}}; });
      showToast("Scheduled for "+fmtDate(scheduleForDay)+" at "+scheduleTime,"success");
    }
    setShowTimePicker(false);setScheduleTaskId(null);setScheduleForDay(null);
  }
  function unscheduleTask(){
    if(!scheduleTaskId)return;
    setData(function(p){return{...p,personal:{...p.personal,tasks:p.personal.tasks.map(function(t){
      return t.id!==scheduleTaskId?t:{...t,scheduledDate:null,scheduledTime:null,scheduledDuration:null,editedAt:todayStr()};
    })}};});
    showToast("Removed from calendar","success");
    setShowTimePicker(false);setScheduleTaskId(null);
  }

  function saveNextSess(){
    const rows=nxtRows.filter(function(r){return r.exercise&&r.weight;});
    if(rows.length===0){showToast("Add at least one exercise with a weight.");return;}
    if(window.DataValidator){
      const r=DataValidator.validate("gymWorkout",{name:nextRot?nextRot.name:"Next Session",date:todayStr(),sets:rows});
      if(!r.valid){showToast(r.firstError);return;}
    }
    const name=nextRot?nextRot.name:"Next Session";
    const rotId=nextRot?nextRot.id:null;
    const today=todayStr();
    const wk={id:Date.now(),name:name,date:today,rotId:rotId,sets:rows.map(function(r,i){return{...r,id:i+1};})};
    setData(function(p){
      const rl=p.gym.rotation?p.gym.rotation.length:1;
      // Write exercises+weights back to rotation template so next session pre-fills
      const newRot=(p.gym.rotation||[]).map(function(rt){
        if(rt.id!==rotId)return rt;
        return{...rt,exercises:rows.map(function(r){return{id:r.id||Date.now(),exercise:r.exercise,sets:r.sets,reps:r.reps,weight:r.weight};})};
      });
      // Log each exercise weight for progression tracking
      var newExercises=[...(p.gym.exercises||[])];
      rows.forEach(function(r){
        var idx=newExercises.findIndex(function(e){return e.name&&e.name.toLowerCase()===r.exercise.toLowerCase();});
        var logEntry={date:today,weight:Number(r.weight)||0};
        if(idx>=0){
          newExercises[idx]={...newExercises[idx],logs:[...(newExercises[idx].logs||[]),logEntry]};
        }else{
          newExercises.push({id:'ex_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),name:r.exercise,logs:[logEntry]});
        }
      });
      return{...p,gym:{...p.gym,workouts:(p.gym.workouts||[]).concat([wk]),rotIdx:((p.gym.rotIdx||0)+1)%Math.max(rl,1),rotation:newRot,exercises:newExercises}};
    });
    try{localStorage.removeItem('gym_draft');}catch(_){}
    setGymDraftBanner(false);
    setNxtRows([{id:1,exercise:"",sets:"",reps:"",weight:""},{id:2,exercise:"",sets:"",reps:"",weight:""},{id:3,exercise:"",sets:"",reps:"",weight:""}]);
    showToast("Session saved!","success");
  }
  function saveModal(){
   try{
    // Validate before saving — validator returns user-friendly messages
    if(window.DataValidator){
      if(modal==="add_task"){
        const r=DataValidator.validate("task",{name:mForm.name,priority:mForm.priority||"normal",due:mForm.due||null,cat:mForm.cat||"Errands"});
        if(!r.valid){showToast(r.firstError);return;}
      }
      if(modal==="add_subject"){
        if(!mForm.name||!mForm.name.trim()){showToast("Subject name can't be empty.");return;}
      }
      if(modal==="add_exercise"){
        if(!mForm.name||!mForm.name.trim()){showToast("Exercise name can't be empty.");return;}
      }
      if(modal==="log_weight"){
        const r=DataValidator.validate("exerciseLog",{weight:Number(mForm.weight),date:todayStr()});
        if(!r.valid){showToast(r.firstError);return;}
      }
    }
    if(modal==="add_subject"){trk("uni.subject_add");setData(function(p){return{...p,uni:{...p.uni,subjects:p.uni.subjects.concat([{id:Date.now(),name:mForm.name,progress:0}])}};});}
    else if(modal==="add_exercise"){trk("gym.exercise_add");setData(function(p){return{...p,gym:{...p.gym,exercises:p.gym.exercises.concat([{id:Date.now(),name:mForm.name,logs:[]}])}};});}
    else if(modal==="log_weight")setData(function(p){return{...p,gym:{...p.gym,exercises:p.gym.exercises.map(function(ex){return ex.id===mForm.exId?{...ex,logs:ex.logs.concat([{date:todayStr(),weight:Number(mForm.weight)}])}:ex;})}};});
    else if(modal==="add_task"){trk("task.add");setData(function(p){const ts=p.personal.tasks||[];return{...p,personal:{...p.personal,tasks:ts.concat([{id:Date.now(),name:mForm.name,cat:mForm.cat||"Errands",priority:mForm.priority||"normal",due:mForm.due||null,done:false,addedAt:todayStr(),editedAt:null}])}};});}
    else if(modal==="edit_rotation"){
      var ri=mForm.rotIdx;
      setData(function(p){
        var rot=(p.gym.rotation||[]).map(function(r,i){
          return i===ri?{...r,name:mForm.rName||r.name,focus:mForm.rFocus,exercises:(mForm.exercises||[]).filter(function(ex){return ex.exercise&&ex.exercise.trim();})}:r;
        });
        return{...p,gym:{...p.gym,rotation:rot}};
      });
      setModal(null);setMForm({});showToast("Template updated!","success");return;
    }
    setModal(null);setMForm({});
    showToast("Saved!","success");
   }catch(err){captureError(err,"saveModal");}
  }
  function updateFinance(fin){setData(function(p){return{...p,finance:fin};});}
  function updateWork(w){setData(function(p){return{...p,work:w};});}
  function submitRefl(){
    if(!reflIn.trim()){showToast("Write something before continuing.");return;}
    const na=reflAns.concat([{q:REFL_QS[reflStep-1],a:reflIn}]);
    setReflAns(na);setReflIn("");
    if(reflStep<REFL_QS.length){
      setReflStep(reflStep+1);
    }else{
      // Final step — validate the full answer set before analysing
      if(window.DataValidator){
        const r=DataValidator.validate("reflection",{answers:na});
        if(!r.valid){showToast(r.firstError);return;}
      }
      trk("reflection.submit");
      setReflStep(REFL_QS.length+1);
      setReflAnalysisLoading(true);
      OllamaService.analyzeReflection(na,data.reflections).then(function(an){
        const analysis=an||analyzeReflectionFallback(na,data.reflections);
        setReflAnalysis(analysis);setReflAnalysisLoading(false);
        setData(function(p){return{...p,reflections:p.reflections.concat([{id:Date.now(),date:new Date().toISOString(),answers:na.map(function(qa,i){return{question:qa.q,answer:qa.a,area:REFL_LABELS[i]};}),analysis:analysis}])};});
      }).catch(function(){setReflAnalysisLoading(false);showToast("Analysis failed — reflection was still saved.","warn");});
    }
  }

  function evColor(ev){return ev.calColor||"#4285F4";}
  function evLabel(ev){const keys=Object.keys(SUBJECTS);const match=keys.find(function(k){return ev.title&&ev.title.toUpperCase().includes(k.toUpperCase());});return match||ev.calName||"Google";}

  function renderWeek(){
    if(mob){
      const dayEvs=visibleGcalEvents.filter(function(ev){return ev.date===activeDay;}).sort(function(a,b){return(a.time||"").localeCompare(b.time||"");});
      return(
        <div>
          <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:6,marginBottom:12}}>
            {weekDates.map(function(d,di){const ds=dStr(d);const isTdy=ds===todayStr();const isActive=ds===activeDay;const hasEv=visibleGcalEvents.some(function(ev){return ev.date===ds;});return(
              <button key={di} onClick={function(){setActiveDay(ds);}} style={{flex:"0 0 auto",minWidth:44,padding:"8px 6px",borderRadius:12,border:isActive?"1px solid "+T.accent:"0.5px solid rgba(255,255,255,0.08)",background:isActive?T.accentBg:isTdy?"rgba(91,140,255,0.06)":"rgba(255,255,255,0.02)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,boxShadow:isActive?"0 0 12px rgba(91,140,255,0.2)":"none",transition:"background 0.12s,border 0.12s,box-shadow 0.12s"}}>
                <span style={{fontSize:9,color:isTdy?T.accent:T.text3,fontWeight:700,letterSpacing:"0.04em"}}>{DAYS[di]}</span>
                <span style={{fontSize:16,fontWeight:700,color:isTdy?T.accent:isActive?T.text:T.text2,width:26,height:26,borderRadius:"50%",background:isTdy&&!isActive?"rgba(91,140,255,0.15)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isTdy?"0 0 8px rgba(91,140,255,0.25)":"none"}}>{d.getDate()}</span>
                {hasEv&&<div style={{width:4,height:4,borderRadius:"50%",background:isActive?T.accent:"rgba(91,140,255,0.45)"}}/>}
              </button>
            );})}
          </div>
          {dayEvs.length===0
            ?<div style={{fontSize:12,color:T.text3,padding:"16px 0",textAlign:"center"}}>{gcalConnected?"No events today":"Connect Google Calendar to see events"}</div>
            :dayEvs.map(function(ev){const col=evColor(ev);return(
              <div key={ev.id} style={{display:"flex",gap:10,padding:"10px 14px",borderRadius:12,background:"rgba(255,255,255,0.03)",border:"0.5px solid rgba(255,255,255,0.08)",marginBottom:8,alignItems:"flex-start"}}>
                <div style={{width:3,background:col,borderRadius:2,alignSelf:"stretch",minHeight:28,flexShrink:0,marginTop:2,boxShadow:"0 0 6px "+col+"80"}}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                    <div style={{fontSize:10,fontWeight:700,color:col,letterSpacing:"0.02em"}}>{evLabel(ev)}</div>
                    <div style={{fontSize:10,color:T.text3}}>{ev.time}</div>
                  </div>
                  <div style={{fontSize:13,color:T.text,lineHeight:1.4}}>{ev.title}</div>
                  {ev.location&&<div style={{fontSize:10,color:T.text3,marginTop:3,display:"flex",alignItems:"center",gap:3}}><UIcon name="pin" size={9}/>{ev.location}</div>}
                </div>
              </div>
            );})}
        </div>
      );
    }
    const PPM=0.26;
    const allEvs=[];weekDates.forEach(function(d){var ds=dStr(d);visibleGcalEvents.filter(function(ev){return ev.date===ds&&!ev.allDay;}).forEach(function(ev){allEvs.push(ev);});});
    const allT=allEvs.length>0?allEvs.map(function(ev){return parseTimes(ev.time);}):[];
    const minH=allT.length>0?Math.max(6,Math.floor(Math.min.apply(null,allT.map(function(t){return t.start;}))/60)):7;
    const maxH=allT.length>0?Math.min(24,Math.ceil(Math.max.apply(null,allT.map(function(t){return t.end;}))/60)+1):22;
    const hours=[];for(let h=minH;h<=maxH;h++)hours.push(h);
    const totalH=(maxH-minH)*60*PPM;
    const now=new Date();const nowMins=now.getHours()*60+now.getMinutes();
    return(
      <div style={{display:"flex"}}>
        <div style={{width:28,flexShrink:0,position:"relative",height:totalH,marginTop:26}}>{hours.map(function(h){return<div key={h} style={{position:"absolute",top:(h-minH)*60*PPM-6,fontSize:8,color:T.text3,textAlign:"right",width:24,opacity:0.6}}>{h===12?"12p":h<12?h+"a":(h-12)+"p"}</div>;})}</div>
        <div style={{flex:1,display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
          {weekDates.map(function(d,di){
            const ds=dStr(d);const isTdy=ds===todayStr();const isPast=new Date(ds)<new Date(todayStr());
            const timedEvs=visibleGcalEvents.filter(function(ev){return ev.date===ds&&!ev.allDay;});
            const allDayEvs=visibleGcalEvents.filter(function(ev){return ev.date===ds&&ev.allDay;});
            const isSchedTarget=!!scheduleTaskId;
            return(<div key={di} style={{display:"flex",flexDirection:"column",cursor:isSchedTarget?"crosshair":"pointer",borderRadius:6,background:isTdy?"rgba(91,140,255,0.05)":isSchedTarget?"rgba(91,140,255,0.04)":"transparent",outline:isSchedTarget?"1.5px dashed "+T.accent:"none",transition:"background 0.1s"}} onClick={function(){if(isSchedTarget){openSchedulePicker(scheduleTaskId,ds);}else{setActiveDay(ds);}}}>
              <div style={{textAlign:"center",marginBottom:2,padding:"3px 0",borderRadius:6,background:activeDay===ds&&!isTdy?T.accentBg:"transparent"}}>
                <div style={{fontSize:8,color:isTdy?T.accent:T.text3,fontWeight:isTdy?700:400,letterSpacing:"0.04em"}}>{DAYS[di]}</div>
                <div style={{fontSize:10,fontWeight:700,color:isTdy?"#fff":isPast?T.text3:T.text,width:18,height:18,borderRadius:"50%",background:isTdy?"#5b8cff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto",boxShadow:isTdy?"0 0 8px rgba(91,140,255,0.55)":"none"}}>{d.getDate()}</div>
                {allDayEvs.map(function(ev){return<div key={ev.id} style={{fontSize:6,background:ev.calColor+"20",borderLeft:"2px solid "+ev.calColor,borderRadius:2,padding:"0 2px",color:ev.calColor,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:1}}>{ev.title.slice(0,10)}</div>;})}
              </div>
              <div style={{position:"relative",height:totalH,borderLeft:"0.5px solid rgba(255,255,255,0.06)",opacity:isPast?0.45:1}}>
                {hours.map(function(h){return<div key={h} style={{position:"absolute",top:(h-minH)*60*PPM,left:0,right:0,borderTop:"0.5px solid rgba(255,255,255,0.05)"}}/>;} )}
                {isTdy&&nowMins>=minH*60&&nowMins<=maxH*60&&<div style={{position:"absolute",top:(nowMins-minH*60)*PPM,left:0,right:0,borderTop:"1.5px solid "+T.danger,zIndex:10,boxShadow:"0 0 4px rgba(255,107,107,0.5)"}}><div style={{position:"absolute",left:-3,top:-3,width:6,height:6,borderRadius:"50%",background:T.danger,boxShadow:"0 0 6px "+T.danger}}/></div>}
                {timedEvs.map(function(ev){const col=evColor(ev);const tp=parseTimes(ev.time);return(<div key={ev.id} style={{position:"absolute",top:(tp.start-minH*60)*PPM,left:1,right:1,height:Math.max((tp.end-tp.start)*PPM,10),borderRadius:3,background:col+"18",borderLeft:"2px solid "+col,padding:"1px 3px",overflow:"hidden",boxSizing:"border-box",zIndex:5}}><div style={{fontSize:6.5,fontWeight:700,color:col,whiteSpace:"nowrap",overflow:"hidden"}}>{evLabel(ev)}</div></div>);})}
                {data.personal.tasks.filter(function(t){return t.scheduledDate===ds&&t.scheduledTime;}).map(function(t){const sm=toMins(t.scheduledTime);const em=sm+(t.scheduledDuration||60);const isDone=!!t.done;return(<div key={"sched_"+t.id} title={(isDone?"✓ Done · ":"")+t.name+" · "+t.scheduledTime+" ("+(t.scheduledDuration||60)+"min)"} style={{position:"absolute",top:Math.max((sm-minH*60)*PPM,0),left:1,right:1,height:Math.max((em-sm)*PPM,10),borderRadius:3,background:isDone?"rgba(105,240,174,0.14)":"rgba(91,140,255,0.18)",border:isDone?"1px solid rgba(105,240,174,0.55)":"1px dashed rgba(91,140,255,0.65)",padding:"1px 3px",overflow:"hidden",boxSizing:"border-box",zIndex:6,cursor:"pointer",opacity:isDone?0.7:1}} onClick={function(e){e.stopPropagation();openSchedulePicker(t.id,t.scheduledDate,t.scheduledTime,t.scheduledDuration);}}><div style={{fontSize:6.5,fontWeight:700,color:isDone?T.success:T.accent,whiteSpace:"nowrap",overflow:"hidden",textDecoration:isDone?"line-through":"none"}}>{isDone?"✓ ":""}{t.name}</div></div>);})}
              </div>
            </div>);
          })}
        </div>
      </div>
    );
  }

  function card(ex){return{position:"relative",background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:20,padding:"18px 20px",marginBottom:12,boxShadow:cardShadow,...(ex||{})};}
  const sT={fontSize:13,fontWeight:600,marginBottom:12,color:"#cdd5e2",letterSpacing:"-0.01em"};
  const btn={...btnGlass,padding:"5px 12px"};
  const btnP={...btnGlassP};
  const inp={width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.05)",color:T.text,fontSize:12,boxSizing:"border-box"};
  // ── Mock design-language helpers (Sapphire glass) ──
  const eyebrow={fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:T.accent};
  const sectLabel={fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.42)",marginBottom:14};
  const pill={fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:999,background:"rgba(91,140,255,0.16)",color:T.accentSoft||"#8fb0ff",border:"1px solid rgba(120,150,255,0.4)"};
  const glassMini={background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:12,boxShadow:cardShadowSoft};
  const tagStyle={academic:{background:"rgba(55,138,221,0.18)",color:"#7eb3e8"},health:{background:"rgba(59,109,17,0.22)",color:"#8ac571"},finance:{background:"rgba(186,117,23,0.22)",color:"#e8b970"},career:{background:"rgba(127,119,221,0.22)",color:"#b3acff"},personal:{background:"rgba(136,135,128,0.22)",color:"#b4b3ac"}};
  function getTagStyle(area){return tagStyle[(area||"personal").toLowerCase()]||tagStyle.personal;}

  // Auth loading — minimal loading screen
  if(authLoading){return(
    <div className="startup-screen">
      <div className="startup-loader"/>
      <div className="startup-label">Loading</div>
    </div>
  );}

  // Login screen — shown until Google sign-in completes
  if(!authUser){return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse 70% 55% at 82% 8%,rgba(40,90,210,0.30) 0%,transparent 60%),radial-gradient(ellipse 65% 60% at 12% 92%,rgba(20,40,120,0.34) 0%,transparent 62%),#0a0a0a",fontFamily:"'Geist',system-ui,sans-serif"}}>
      <div style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"0.5px solid rgba(255,255,255,0.16)",borderRadius:20,padding:"40px 36px",textAlign:"center",maxWidth:340,width:"90%",boxShadow:"0 8px 40px rgba(0,0,0,0.5)"}}>
        <div style={{display:"flex",justifyContent:"center",color:T.accent,marginBottom:8}}><UIcon name="sparkle" size={30}/></div>
        <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>Jayden's Dashboard</div>
        <div style={{fontSize:13,color:T.text2,marginBottom:28,lineHeight:1.6}}>Sign in with Google to access your dashboard and sync your data across devices.</div>
        <button onClick={function(){_auth.signInWithPopup(_googleProvider).catch(function(e){if(window.ErrorHandler)ErrorHandler.warn("Sign-in failed: "+e.message,"auth");});}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,width:"100%",padding:"13px 20px",borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:T.text,fontSize:14,fontWeight:600,cursor:"pointer",transition:"background 0.2s"}}
          onMouseOver={function(e){e.currentTarget.style.background="rgba(255,255,255,0.18)";}}
          onMouseOut={function(e){e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.8 0 6.9 5.4 3 13.3l7.8 6C12.7 13 18 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/><path fill="#FBBC05" d="M10.8 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.3-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.3-7.7 2.3-6 0-11.1-4-12.9-9.4l-8.3 6.1C6.9 42.6 14.8 48 24 48z"/></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );}

  return(
    <div className="dashboard-reveal" style={{fontFamily:"'Geist',system-ui,sans-serif",minHeight:"100vh",background:"transparent",color:T.text,position:"relative",boxSizing:"border-box",paddingLeft:mob?0:(navCollapsed?80:230),transition:"padding-left 0.22s cubic-bezier(0.23,1,0.32,1)"}}>
      {/* Status info lives in the sidebar sync dot + Logs button */}
      {/* Full monitoring panel modal */}
      {showMonitor&&window.MonitoringPanel&&<MonitoringPanel
        onClose={function(){setShowMonitor(false);}}
        settings={{geminiKey:geminiKey,groqKey:groqKey,githubPAT:(data.settings&&data.settings.githubPAT)||""}}
        onSaveSettings={function(s){
          if(s.geminiKey!==undefined){
            var k=s.geminiKey.trim();
            setGeminiKey(k);
            try{localStorage.setItem('__gemini_key__',k);}catch(_){}
          }
          if(s.groqKey!==undefined){
            var gk=s.groqKey.trim();
            setGroqKey(gk);
            try{localStorage.setItem('__groq_key__',gk);}catch(_){}
          }
          if(s.githubPAT!==undefined){
            setData(function(p){return{...p,settings:{...(p.settings||{}),githubPAT:s.githubPAT.trim()}};});
          }
        }}
      />}
      {/* Toast notification — auto-dismisses after 3.5s, never blocks interaction */}
      {toast&&<div className="toast-popup" style={{position:"fixed",bottom:mob?90:28,left:"50%",transform:"translateX(-50%)",
        background:toast.type==="success"?"rgba(105,240,174,0.97)":toast.type==="warn"?"rgba(255,209,102,0.97)":"rgba(255,107,107,0.97)",
        color:"#05071a",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:600,
        zIndex:500,boxShadow:"0 4px 24px rgba(0,0,0,0.5)",maxWidth:320,textAlign:"center",
        pointerEvents:"none",whiteSpace:"pre-line"}}>{toast.msg}</div>}
      {/* Error log panel */}
      {errLog.length>0&&!showErrPanel&&<button onClick={function(){setShowErrPanel(true);}} style={{position:"fixed",bottom:mob?160:80,right:16,zIndex:498,background:"rgba(255,107,107,0.92)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700,color:"#fff",boxShadow:"0 4px 16px rgba(255,107,107,0.5)",display:"flex",alignItems:"center",gap:5}}><UIcon name="warn" size={12}/>{errLog.length} error{errLog.length!==1?"s":""}</button>}
      {showErrPanel&&<div style={{position:"fixed",bottom:mob?170:80,right:16,zIndex:499,width:Math.min(400,window.innerWidth-32),maxHeight:"60vh",overflowY:"auto",background:"rgba(10,5,5,0.98)",border:"1px solid rgba(255,107,107,0.5)",borderRadius:12,padding:"12px 14px",boxShadow:"0 8px 32px rgba(0,0,0,0.7)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:11,fontWeight:700,color:"#ff6b6b",display:"inline-flex",alignItems:"center",gap:5}}><UIcon name="warn" size={12}/>Error log ({errLog.length})</span>
          <div style={{display:"flex",gap:6}}>
            <button style={{padding:"1px 7px",borderRadius:5,border:"0.5px solid rgba(255,107,107,0.4)",background:"transparent",color:"#ff6b6b",cursor:"pointer",fontSize:10}} onClick={function(){setErrLog([]);setShowErrPanel(false);}}>Clear all</button>
            <button style={{padding:"1px 7px",borderRadius:5,border:"0.5px solid rgba(255,255,255,0.12)",background:"transparent",color:"#aaa",cursor:"pointer",fontSize:10}} onClick={function(){setShowErrPanel(false);}}>Hide</button>
          </div>
        </div>
        {errLog.map(function(e){return(<div key={e.id} style={{marginBottom:10,paddingBottom:10,borderBottom:"0.5px solid rgba(255,107,107,0.12)"}}>
          <div style={{fontSize:10,fontWeight:600,color:"#ff6b6b",marginBottom:2}}>{e.time} · in <code style={{background:"rgba(255,107,107,0.15)",padding:"0 4px",borderRadius:3}}>{e.fn}</code></div>
          <div style={{fontSize:11,color:"#ffcdd2",marginBottom:e.stack?4:0,wordBreak:"break-word"}}>{e.msg}</div>
          {e.stack&&<pre style={{fontSize:9,color:"rgba(255,255,255,0.3)",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,lineHeight:1.4}}>{e.stack}</pre>}
        </div>);})}
      </div>}
      {!mob&&<nav style={{position:"fixed",left:0,top:0,bottom:0,width:navCollapsed?68:218,zIndex:50,display:"flex",flexDirection:"column",padding:navCollapsed?"18px 10px":"18px 14px",gap:3,background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",borderRight:"1px solid rgba(255,255,255,0.10)",boxShadow:"8px 0 32px rgba(0,0,0,0.40),inset 0 1px 0 rgba(255,255,255,0.22)",transition:"width 0.22s cubic-bezier(0.23,1,0.32,1)",overflowY:"auto",overflowX:"hidden"}}>
        {/* Rail header — avatar, name, sync dot */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:navCollapsed?"0 0 16px":"2px 4px 16px",borderBottom:"0.5px solid rgba(255,255,255,0.08)",marginBottom:10,justifyContent:navCollapsed?"center":"flex-start"}}>
          <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,overflow:"hidden",background:"linear-gradient(135deg,#5b8cff,#3a5fcc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{authUser&&authUser.photoURL?<img src={authUser.photoURL} alt="" style={{width:34,height:34,borderRadius:"50%"}}/>:"J"}</div>
          {!navCollapsed&&<div style={{minWidth:0,flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{fontSize:14,fontWeight:600,color:T.text,letterSpacing:-0.2,whiteSpace:"nowrap"}}>Ashley</div>
              <div title={syncStatus==="synced"?"Synced to cloud":syncStatus==="syncing"?"Saving...":syncStatus==="loading"?"Connecting...":"Offline — saved locally"} style={{width:7,height:7,borderRadius:"50%",flexShrink:0,background:syncStatus==="synced"?T.success:syncStatus==="syncing"?T.warn:syncStatus==="loading"?T.text3:T.danger,boxShadow:syncStatus==="synced"?"0 0 6px "+T.success:syncStatus==="syncing"?"0 0 6px "+T.warn:"none",transition:"background 0.4s"}}/>
            </div>
            <div style={{fontSize:11,color:T.text3,marginTop:1}}>Personal Dashboard</div>
          </div>}
        </div>
        {syncStatus==="offline"&&getLatestBackup()&&<button onClick={restoreFromBackup} title="Restore backup" style={{fontSize:10,padding:navCollapsed?"7px 0":"5px 10px",marginBottom:8,borderRadius:8,border:"0.5px solid rgba(255,209,102,0.5)",background:"rgba(255,209,102,0.1)",color:T.warn,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",justifyContent:navCollapsed?"center":"flex-start",gap:6}}><span style={{display:"flex"}}><UIcon name="restore" size={13}/></span>{!navCollapsed&&"Restore backup"}</button>}
        {/* Nav items */}
        {NAV_PAGES.map(function(s){const active=page===s;return(
          <button key={s} title={navCollapsed?s:undefined} onClick={function(){setPage(s);}} style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:navCollapsed?"11px 0":"10px 12px",justifyContent:navCollapsed?"center":"flex-start",borderRadius:12,border:"none",cursor:"pointer",background:active?"rgba(91,140,255,0.14)":"transparent",color:active?T.text:T.text2,fontSize:13,fontWeight:active?600:500,position:"relative",textAlign:"left",transition:"background 0.15s,color 0.15s"}} onMouseOver={function(e){if(!active)e.currentTarget.style.background="rgba(225,234,255,0.06)";}} onMouseOut={function(e){if(!active)e.currentTarget.style.background="transparent";}}>
            {active&&<div style={{position:"absolute",left:0,top:"22%",bottom:"22%",width:3,borderRadius:"0 3px 3px 0",background:T.accent}}/>}
            <span style={{display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:active?T.accent:T.text2}}><NavGlyph name={s}/></span>
            {!navCollapsed&&<span style={{flex:1,whiteSpace:"nowrap"}}>{s}</span>}
          </button>
        );})}
        {/* Footer — utilities */}
        <div style={{marginTop:"auto",paddingTop:10,borderTop:"0.5px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:3}}>
          <button onClick={exportData} title="Download all your data as JSON backup" style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:navCollapsed?"10px 0":"9px 12px",justifyContent:navCollapsed?"center":"flex-start",borderRadius:12,border:"none",cursor:"pointer",background:"transparent",color:T.text2,fontSize:12.5,fontWeight:500}}>
            <span style={{display:"flex",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 11l5 4 5-4M5 21h14"/></svg></span>
            {!navCollapsed&&<span style={{whiteSpace:"nowrap"}}>Export data</span>}
          </button>
          <button
            disabled={obsExportStatus==="running"}
            title="Trigger Obsidian export now via GitHub Actions"
            onClick={function(){
              var pat=(data.settings&&data.settings.githubPAT||"").trim();
              if(!pat){showToast("GitHub PAT not set — add it in Settings.","error");return;}
              trk("export.manual");
              setObsExportStatus("running");
              fetch("https://api.github.com/repos/jaydenpineda30-glitch/obsidian-notes/actions/workflows/export.yml/dispatches",{
                method:"POST",
                headers:{"Authorization":"Bearer "+pat,"Content-Type":"application/json","Accept":"application/vnd.github+json"},
                body:JSON.stringify({ref:"main"})
              }).then(function(r){
                if(r.status===204){setObsExportStatus("done");showToast("Export triggered — notes will appear in Obsidian in ~30s","success");setTimeout(function(){setObsExportStatus("idle");},4000);}
                else{setObsExportStatus("error");showToast("Export trigger failed (status "+r.status+")","error");setTimeout(function(){setObsExportStatus("idle");},3000);}
              }).catch(function(){setObsExportStatus("error");showToast("Export trigger failed — check connection","error");setTimeout(function(){setObsExportStatus("idle");},3000);});
            }}
            style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:navCollapsed?"10px 0":"9px 12px",justifyContent:navCollapsed?"center":"flex-start",borderRadius:12,border:"none",cursor:obsExportStatus==="running"?"default":"pointer",background:"transparent",color:obsExportStatus==="running"?T.text3:obsExportStatus==="done"?T.success:T.text2,fontSize:12.5,fontWeight:500}}>
            <span style={{display:"flex",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 21h14"/></svg></span>
            {!navCollapsed&&<span style={{whiteSpace:"nowrap"}}>{obsExportStatus==="running"?"Exporting…":obsExportStatus==="done"?"Exported ✓":"Obsidian sync"}</span>}
          </button>
          <button onClick={function(){setShowMonitor(true);}} title="System logs & health" style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:navCollapsed?"10px 0":"9px 12px",justifyContent:navCollapsed?"center":"flex-start",borderRadius:12,border:"none",cursor:"pointer",background:"transparent",color:T.text2,fontSize:12.5,fontWeight:500}}>
            <span style={{display:"flex",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg></span>
            {!navCollapsed&&<span style={{whiteSpace:"nowrap"}}>Logs</span>}
          </button>
          <button onClick={function(){_auth.signOut();}} title="Sign out" style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:navCollapsed?"10px 0":"9px 12px",justifyContent:navCollapsed?"center":"flex-start",borderRadius:12,border:"none",cursor:"pointer",background:"transparent",color:T.text2,fontSize:12.5,fontWeight:500}}>
            <span style={{display:"flex",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg></span>
            {!navCollapsed&&<span style={{whiteSpace:"nowrap"}}>Sign out</span>}
          </button>
          <button onClick={toggleNav} title={navCollapsed?"Expand sidebar":"Collapse sidebar"} style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:navCollapsed?"10px 0":"9px 12px",justifyContent:navCollapsed?"center":"flex-start",borderRadius:12,border:"none",cursor:"pointer",background:"transparent",color:T.text3,fontSize:12.5,fontWeight:500,marginTop:2}}>
            <span style={{display:"flex",flexShrink:0,transform:navCollapsed?"rotate(180deg)":"none",transition:"transform 0.22s cubic-bezier(0.23,1,0.32,1)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg></span>
            {!navCollapsed&&<span style={{whiteSpace:"nowrap"}}>Collapse</span>}
          </button>
          {!navCollapsed&&appVersion&&<div onClick={function(){trk("version.click");}} title={"Released "+appVersion.date} style={{fontSize:9,color:T.text3,opacity:0.6,padding:"6px 12px 0",letterSpacing:0.3,cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{appVersion.version}</div>}
        </div>
      </nav>}
      {!mob&&<button onClick={function(){setForceMob(true);}} style={{position:"fixed",bottom:24,right:24,zIndex:200,padding:"10px 16px",borderRadius:99,border:"1px solid rgba(91,140,255,0.5)",background:"rgba(14,16,40,0.95)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:T.accent,cursor:"pointer",fontSize:12,fontWeight:700,boxShadow:"0 4px 16px rgba(0,0,0,0.35)",display:"flex",alignItems:"center",gap:6}}><span style={{display:"flex"}}><UIcon name="phone" size={14}/></span>Mobile view</button>}
      {mob&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:"rgba(5,7,26,0.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"0.5px solid rgba(91,140,255,0.2)",position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 20px rgba(0,0,0,0.4)"}}>
        <div style={{fontSize:13,fontWeight:700,color:T.accent,textShadow:"0 0 12px rgba(91,140,255,0.6)"}}>{page}</div>
        {!rawMob&&<button onClick={function(){setForceMob(false);}} style={{...btn,padding:"5px 10px",borderRadius:8,display:"flex",alignItems:"center",gap:5}}><span style={{display:"flex"}}><UIcon name="desktop" size={13}/></span>Desktop view</button>}
      </div>}
      <div style={{padding:mob?"10px 12px":"24px 28px",maxWidth:mob?430:1180,margin:"0 auto",position:"relative",zIndex:1,paddingBottom:mob?80:40}}>
        {page==="Dashboard"&&<div>
          {/* Greeting */}
          <div style={{marginBottom:18}}>
            <div style={{fontSize:mob?20:24,fontWeight:800,letterSpacing:"-0.02em",color:"#eef3fb"}}>{(function(){var h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening";})()}, Ashley</div>
            <div style={{fontSize:13,color:"#7a85a0",marginTop:4}}>{new Date().toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          {/* Bento masonry — cards pack by height, no dead gaps */}
          <div style={{columnCount:mob?1:3,columnGap:18}}>
            <div className="card-rim" style={card({columnSpan:"all",breakInside:"avoid",padding:"16px 20px"})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,letterSpacing:"-0.01em"}}>{new Date(dStr(weekDates[0])).toLocaleDateString("en-AU",{month:"long",year:"numeric"})}</div>
                  <div style={{fontSize:10,color:T.text3,marginTop:1}}>{fmtDate(dStr(weekDates[0]))} — {fmtDate(dStr(weekDates[6]))}</div>
                </div>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  {gcalReady&&!gcalConnected&&<button style={{...btn,fontSize:10,color:"#4285F4",border:"0.5px solid rgba(66,133,244,0.35)",display:"inline-flex",alignItems:"center",gap:4}} onClick={function(){window.GCalSync&&window.GCalSync.connect();}}><UIcon name="calendar" size={10}/>Connect</button>}
                  {gcalConnected&&<button style={{...btn,fontSize:10,color:T.text2,display:"inline-flex",alignItems:"center",gap:4}} onClick={function(){setShowCalPicker(true);}}><UIcon name="calendar" size={10}/>{gcalEvents.length}</button>}
                  <button style={{...btn,padding:"4px 10px",fontSize:13}} onClick={function(){setWkOff(function(o){return o-1;});}}>←</button>
                  <button style={{...btn,padding:"4px 10px",color:wkOff===0?T.accent:T.text2,border:wkOff===0?"0.5px solid rgba(91,140,255,0.4)":"0.5px solid rgba(255,255,255,0.12)"}} onClick={function(){setWkOff(0);setActiveDay(todayStr());}}>Today</button>
                  <button style={{...btn,padding:"4px 10px",fontSize:13}} onClick={function(){setWkOff(function(o){return o+1;});}}>→</button>
                </div>
              </div>
              {renderWeek()}
              {gcalCalendars.length>0&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10,paddingTop:8,borderTop:"0.5px solid "+T.border}}>
                {gcalCalendars.slice(0,6).map(function(cal){return<div key={cal.id} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:2,background:cal.backgroundColor||"#4285F4"}}/><span style={{fontSize:9,color:T.text3}}>{cal.summary}</span></div>;})}
              </div>}
            </div>
            <div style={{breakInside:"avoid",marginBottom:12}}><WeatherWidget mob={mob}/></div>
            {nextRot&&<div className="card-rim" style={{...card({breakInside:"avoid"}),padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontSize:12,color:"#eef3fb",fontWeight:700,letterSpacing:0.2}}>Next session</div>
                  <button style={editPill} onClick={function(){setPage("Gym");}}>Open →</button>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>{nextRot.name}</div>
                <div style={{fontSize:11,color:T.text2,lineHeight:1.4}}>{nextRot.focus}</div>
                {nextRot.exercises&&nextRot.exercises.length>0&&<div style={{fontSize:10,color:T.text3,marginTop:4}}>{nextRot.exercises.length} exercise{nextRot.exercises.length!==1?"s":""} planned</div>}
              </div>}

          {/* Check-in (slim) */}
          <div className="card-rim" style={{...card({breakInside:"avoid"}),marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,marginBottom:(checkinOpen||todayEvs.length>0)?10:0}}>
              <div style={{fontSize:10,color:T.text3,display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:T.accent}}/>Daily Check-in · {new Date().toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})}</div>
              {checkinOpen
                ?<div style={{display:"flex",gap:6}}><button style={{...btn,fontSize:11}} onClick={function(){trk("checkin.generate");doCheckin();}}>Refresh</button><button style={{...btn,fontSize:11}} onClick={function(){setCheckinOpen(false);}}>Hide</button></div>
                :<button style={{...btnP,fontSize:11,padding:"5px 12px"}} onClick={function(){setCheckinOpen(true);if(checkinBlocks.length===0&&!checkinLoading){trk("checkin.generate");doCheckin();}}}>Generate check-in</button>}
            </div>
            {checkinOpen&&(checkinLoading?<div style={{fontSize:12,color:T.accent,display:"flex",alignItems:"center",gap:6}}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:T.accent,animation:"pulse 1.2s ease-in-out infinite"}}/>AI is thinking...</div>:checkinBlocks.length===0?<div style={{fontSize:12,color:T.text3}}>Generating today's check-in…</div>:checkinBlocks.map(function(block,bi){return(<div key={bi} style={{marginBottom:10}}>{block.header&&<div style={{fontSize:11,fontWeight:600,color:T.accent,marginBottom:4}}>{block.header}</div>}{block.items.map(function(item,ii){return<div key={ii} style={{fontSize:13,lineHeight:1.7,color:T.text}}>{item}</div>;})}</div>);}))}
            {todayEvs.length>0&&<div style={{marginTop:12,paddingTop:10,borderTop:"0.5px solid "+T.border,display:"flex",gap:6,flexWrap:"wrap"}}>{todayEvs.map(function(ev){const col=evColor(ev);return(<div key={ev.id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:6,background:col+"18",border:"0.5px solid "+col+"40",flexShrink:0}}><div><div style={{fontSize:10,fontWeight:600,color:col}}>{evLabel(ev)}<span style={{fontWeight:400,color:T.text3}}> · {ev.time}</span></div><div style={{fontSize:9,color:T.text2}}>{ev.title.slice(0,32)}</div></div></div>);})}</div>}
          </div>

          {/* Goals */}
          {(function(){
            var b=data.boardroom||{};
            if(!b.onboarded) return null;
            var ag=(b.goals||[]).filter(function(g){return g.status==="active";});
            var ns=b.northStar||"";
            if(!ag.length&&!ns) return null;
            return(
              <div className="card-rim" style={{...card({breakInside:"avoid"}),borderLeft:"3px solid rgba(91,140,255,0.6)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:ns?10:12}}>
                  <div style={sT}>Goals</div>
                  <button onClick={function(){setPage("Boardroom");}} style={{...btnGlass,fontSize:11,padding:"3px 10px"}}>Boardroom →</button>
                </div>
                {ns&&<div style={{fontSize:12,color:"rgba(255,255,255,0.42)",fontStyle:"italic",lineHeight:1.65,marginBottom:ag.length?14:4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>"{ns}"</div>}
                {ag.length===0&&<div style={{fontSize:12,color:T.text3,marginTop:4}}>Start a session to set your first goal.</div>}
                {ag.map(function(g,i){
                  var ts=getTagStyle(g.area);
                  return(
                    <div key={g.id} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<ag.length-1?"0.5px solid rgba(255,255,255,0.06)":"none"}}>
                      <span style={{width:6,height:6,borderRadius:"50%",flexShrink:0,background:ts.color,boxShadow:"0 0 6px "+ts.color}}/>
                      <span style={{fontSize:10,padding:"2px 6px",borderRadius:4,...ts,flexShrink:0}}>{g.area}</span>
                      <span style={{fontSize:13,color:"rgba(255,255,255,0.82)",lineHeight:1.4}}>{g.title}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Assessments */}
          <div className="card-rim" style={card({breakInside:"avoid"})}>
              <div style={sT}>Upcoming assessments</div>
              {upcoming.length===0?<div style={{fontSize:12,color:T.text2}}>All clear ✓</div>:upcoming.map(function(a){const days=daysBetween(a.date);const col=SC[a.subject]||T.accent;const dayLabel=days===0?"Today":days===1?"Tomorrow":days<=13?WX_DAYS[new Date(a.date+"T00:00").getDay()]+" · "+days+" days":fmtDate(a.date);return(<div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:6,cursor:"pointer"}} onClick={function(){setPage("Uni");}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:col,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0,fontSize:12,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}><span style={{color:col,fontWeight:700}}>{a.subject}</span>{" — "}{a.title}</div>
                <div style={{fontSize:10,color:days<=3?T.danger:T.text2,fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>{dayLabel}</div>
              </div>);})}
            </div>
          {/* Pre-fill weights */}
          <div className="card-rim" style={card({breakInside:"avoid"})}>
                <div style={sT}>Next session — pre-fill weights</div>
                {!nextRot&&<div style={{fontSize:11,color:T.text2,marginBottom:8}}>Set up your rotation in the Gym tab.</div>}
                {gymDraftBanner&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"10px 13px",borderRadius:12,background:"rgba(225,234,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 0 20px rgba(255,209,102,0.3),inset 0 1px 0 rgba(255,255,255,0.05)",marginBottom:10}}>
                  <span style={{fontSize:11,color:T.warn}}>Unfinished session restored — keep logging or discard</span>
                  <button onClick={function(){try{localStorage.removeItem('gym_draft');}catch(_){}setGymDraftBanner(false);setNxtRows(nextRot&&nextRot.exercises&&nextRot.exercises.length>0?nextRot.exercises.map(function(ex,i){return{id:ex.id||i+1,exercise:ex.exercise||"",sets:ex.sets||"",reps:ex.reps||"",weight:ex.weight||""};}):[{id:1,exercise:"",sets:"",reps:"",weight:""},{id:2,exercise:"",sets:"",reps:"",weight:""},{id:3,exercise:"",sets:"",reps:"",weight:""}]);}} style={{...btnGlass,fontSize:10,padding:"3px 10px"}}>Discard</button>
                </div>}
                <datalist id="homeExSuggestions">{(function(){var seen={};var names=[];((data.gym||{}).exercises||[]).forEach(function(ex){var n=(ex.name||"").trim();if(n&&!seen[n.toLowerCase()]){seen[n.toLowerCase()]=true;names.push(n);}});((data.gym||{}).rotation||[]).forEach(function(r){(r.exercises||[]).forEach(function(ex){var n=(ex.exercise||"").trim();if(n&&!seen[n.toLowerCase()]){seen[n.toLowerCase()]=true;names.push(n);}});});return names;})().map(function(n){return React.createElement("option",{key:n,value:n});})}</datalist>
                {mob?nxtRows.map(function(row,i){return(<div key={row.id} style={{display:"grid",gridTemplateColumns:"1fr 52px 52px 64px",gap:5,marginBottom:6}}>
                  <input style={{...inp,padding:"8px 8px",fontSize:12}} list="homeExSuggestions" placeholder={["Bench Press","Squat","OHP"][i]||"Exercise"} value={row.exercise} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,exercise:ev.target.value}:x;});});}}/>
                  <input style={{...inp,padding:"8px 4px",fontSize:12}} type="number" placeholder="Sets" value={row.sets} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,sets:ev.target.value}:x;});});}}/>
                  <input style={{...inp,padding:"8px 4px",fontSize:12}} type="number" placeholder="Reps" value={row.reps} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,reps:ev.target.value}:x;});});}}/>
                  <input style={{...inp,padding:"8px 4px",fontSize:12}} type="number" placeholder="kg" value={row.weight} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,weight:ev.target.value}:x;});});}}/>
                </div>);}):(
                <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 50px 50px 60px",gap:6,marginBottom:4}}>{["Exercise","Sets","Reps","kg"].map(function(h){return<div key={h} style={{fontSize:9,color:T.text3}}>{h}</div>;})}</div>
                {nxtRows.map(function(row,i){return(<div key={row.id} style={{display:"grid",gridTemplateColumns:"1fr 50px 50px 60px",gap:6,marginBottom:6}}>
                  <input style={inp} list="homeExSuggestions" placeholder={["Bench Press","Squat","Overhead Press"][i]||"Exercise"} value={row.exercise} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,exercise:ev.target.value}:x;});});}}/>
                  <input style={inp} type="number" placeholder="4" value={row.sets} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,sets:ev.target.value}:x;});});}}/>
                  <input style={inp} type="number" placeholder="8" value={row.reps} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,reps:ev.target.value}:x;});});}}/>
                  <input style={inp} type="number" placeholder="80" value={row.weight} onChange={function(ev){setNxtRows(function(r){return r.map(function(x,j){return j===i?{...x,weight:ev.target.value}:x;});});}}/>
                </div>);})}
                </div>)}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                  <button style={btn} onClick={function(){setNxtRows(function(r){return r.concat([{id:Date.now(),exercise:"",sets:"",reps:"",weight:""}]);});}}>+ Row</button>
                  <button style={btnP} onClick={saveNextSess}>Save to Gym →</button>
                </div>
              </div>
              <div className="card-rim" style={card((!bwLogged&&dLeft<=3)?{boxShadow:"0 0 26px "+bwColMap[bwUrg]+"55,"+cardShadow,breakInside:"avoid"}:{breakInside:"avoid"})}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#f3f7fd"}}>Weekly body weight</div>
                  {!bwLogged&&<div style={{fontSize:10,color:bwColMap[bwUrg],fontWeight:600,padding:"2px 7px",borderRadius:99,background:bwColMap[bwUrg]+"18"}}>{dLeft}d left</div>}
                </div>
                {bwLogged&&!bwEditing
                  ?<div>
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"4px 0 8px"}}>
                      <div style={{fontSize:32,color:T.success,lineHeight:1,fontWeight:700}}>✓</div>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{fontSize:22,fontWeight:700,color:T.success,lineHeight:1.1}}>{(function(){const e=(data.gym.bodyWeight||[]).find(function(e){return e.date>=thisWeek;});return e?e.weight+" kg":"Logged";})()}</div>
                          <button style={{background:"none",border:"none",cursor:"pointer",color:T.text3,fontSize:16,opacity:0.45,lineHeight:1,padding:"0 2px"}} title="Delete this entry" onClick={function(){const e=(data.gym.bodyWeight||[]).find(function(en){return en.date>=thisWeek;});if(e)deleteBWEntry(e.date);}}>×</button>
                        </div>
                        <div style={{fontSize:10,color:T.success,opacity:0.75,marginTop:2}}>Logged this week</div>
                      </div>
                    </div>
                    {(data.gym.bodyWeight||[]).length>=2&&<Sparkline data={data.gym.bodyWeight} color={T.success} width={180} height={40}/>}
                    <button style={{...btn,fontSize:10,padding:"4px 10px",marginTop:8}} onClick={function(){const e=(data.gym.bodyWeight||[]).find(function(e){return e.date>=thisWeek;});if(e){setBwIn(String(e.weight));setBwDate(e.date);}else{setBwIn("");setBwDate(todayStr());}setBwEditing(true);}}>Edit / add past entry</button>
                  </div>
                  :<div>
                    <div style={{fontSize:10,color:T.text3,marginBottom:8}}>{bwEditing?"Update your entry or add a past entry below":dLeft<=1?"Last chance — ends tomorrow!":dLeft<=3?"Log before the week ends":"Log once this week"}</div>
                    <div style={{display:"flex",gap:6,marginBottom:6}}><input style={{...inp,flex:1}} type="number" step="0.1" placeholder="e.g. 81.2 kg" value={bwIn} onChange={function(ev){setBwIn(ev.target.value);}}/><button style={btnP} onClick={logBW}>Log</button></div>
                    <input type="date" style={{...inp,padding:"6px 10px",fontSize:11,color:T.text3}} value={bwDate} onChange={function(ev){setBwDate(ev.target.value);}}/>
                    {bwLogged&&bwEditing&&<button style={{...btn,fontSize:10,padding:"4px 10px",marginTop:6,opacity:0.6}} onClick={function(){setBwEditing(false);setBwIn("");setBwDate(todayStr());}}>Cancel</button>}
                  </div>
                }
              </div>
          {/* Tasks */}
          <div className="card-rim" style={card({breakInside:"avoid"})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={sT}>Tasks</div><button style={{...editPill,fontSize:14,padding:"2px 12px"}} onClick={function(){setModal("add_task");setMForm({priority:"normal",cat:"Errands"});}}>+</button></div>
              {urgTasks.length===0&&normTasks.length===0&&doneTasks.length===0&&<div style={{fontSize:12,color:T.text2}}>All clear ✓</div>}
              {scheduleTaskId&&<div style={{fontSize:9,color:T.accent,marginBottom:6,padding:"3px 8px",borderRadius:6,background:T.accentBg,border:"0.5px solid rgba(91,140,255,0.3)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}><span>Tap a calendar day to schedule (or ESC)</span><button onClick={function(){setScheduleTaskId(null);}} title="Cancel scheduling" style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontSize:14,padding:"0 4px",lineHeight:1,fontWeight:700}}>×</button></div>}
              {urgTasks.length>0&&<div><div style={{fontSize:9,color:T.danger,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Urgent</div>{urgTasks.map(function(t){const urg=taskUrg(t);const isActive=scheduleTaskId===t.id;return(<div key={t.id} className="glow-item" style={{display:"flex",gap:9,marginBottom:7,alignItems:"flex-start",padding:"10px 12px",borderRadius:12,background:isActive?"rgba(91,140,255,0.12)":"rgba(225,234,255,0.04)",border:"1px solid "+(isActive?"rgba(91,140,255,0.5)":"rgba(255,255,255,0.07)"),boxShadow:"inset 10px 0 9px -8px "+TUC[urg],cursor:"default",transition:"background 0.15s"}}><input type="checkbox" checked={t.done} onChange={function(){toggleTask(t.id);}} style={{accentColor:T.accent,marginTop:2,flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:500,color:T.text,textDecoration:t.done?"line-through":"none"}}>{t.name}</div><div style={{fontSize:9,color:TUC[urg]}}>{taskLabel(t)}</div></div><button style={{background:"none",border:"none",padding:"2px 4px",cursor:"pointer",color:scheduleTaskId===t.id?T.accent:T.text3,fontSize:14,flexShrink:0,lineHeight:1,opacity:scheduleTaskId===t.id?1:0.45,transition:"opacity 0.15s,color 0.15s"}} title="Schedule" onClick={function(e){e.stopPropagation();if(scheduleTaskId===t.id){setScheduleTaskId(null);}else{trk("task.schedule");setScheduleTaskId(t.id);showToast("Tap a calendar day to schedule (or ESC)","warn");}}}>⠿</button></div>);})}</div>}
              {normTasks.length>0&&<div><div style={{fontSize:9,color:T.text3,fontWeight:700,marginBottom:6,marginTop:8,textTransform:"uppercase",letterSpacing:0.5}}>Normal</div>{normTasks.map(function(t){const urg=taskUrg(t);const isActive=scheduleTaskId===t.id;return(<div key={t.id} className="glow-item" style={{display:"flex",gap:9,marginBottom:7,alignItems:"flex-start",padding:"10px 12px",borderRadius:12,background:isActive?"rgba(91,140,255,0.12)":"rgba(225,234,255,0.04)",border:"1px solid "+(isActive?"rgba(91,140,255,0.5)":"rgba(255,255,255,0.07)"),boxShadow:"inset 10px 0 9px -8px "+TUC[urg],cursor:"default",transition:"background 0.15s"}}><input type="checkbox" checked={t.done} onChange={function(){toggleTask(t.id);}} style={{accentColor:T.accent,marginTop:2,flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:500,color:T.text,textDecoration:t.done?"line-through":"none"}}>{t.name}</div><div style={{fontSize:9,color:TUC[urg]}}>{taskLabel(t)}</div></div><button style={{background:"none",border:"none",padding:"2px 4px",cursor:"pointer",color:scheduleTaskId===t.id?T.accent:T.text3,fontSize:14,flexShrink:0,lineHeight:1,opacity:scheduleTaskId===t.id?1:0.45,transition:"opacity 0.15s,color 0.15s"}} title="Schedule" onClick={function(e){e.stopPropagation();if(scheduleTaskId===t.id){setScheduleTaskId(null);}else{trk("task.schedule");setScheduleTaskId(t.id);showToast("Tap a calendar day to schedule (or ESC)","warn");}}}>⠿</button></div>);})}</div>}
              {doneTasks.length>0&&<div><div style={{fontSize:9,color:T.text3,fontWeight:700,marginBottom:6,marginTop:8,textTransform:"uppercase",letterSpacing:0.5}}>Done</div>{doneTasks.map(function(t){return(<div key={t.id} style={{display:"flex",gap:7,marginBottom:5,alignItems:"center",opacity:0.45}}><input type="checkbox" checked={true} onChange={function(){toggleTask(t.id);}} style={{accentColor:T.accent,flexShrink:0}}/><div style={{fontSize:11,color:T.text3,textDecoration:"line-through"}}>{t.name}</div></div>);})}</div>}
            </div>
          </div>
          {appVersion&&<div style={{textAlign:"center",padding:"10px 0 2px",fontSize:10,color:T.text3,opacity:0.5}}>
            <span onClick={function(){trk("version.click");}} title={"Released "+appVersion.date} style={{cursor:"pointer"}}>{appVersion.version}</span>
            {" · "}<a href={"https://github.com/jaydenpineda30-glitch/Main/releases"} target="_blank" rel="noreferrer" style={{color:T.text3,textDecoration:"none"}}>patch notes ↗</a>
          </div>}
        </div>}

        {page==="Uni"&&<div>
          {(function(){
            const assessments=data.uni.assessments||SYLLABUS_ASSESSMENTS;
            const totalA=assessments.length;const doneA=assessments.filter(function(a){return a.done;}).length;
            const UNI_KEYS=["uni","tafe","rmit","university","curtin","monash","deakin","uts","usyd","uq","uwa","anu","unsw","federation"];
            function isUniCalEv(ev){return ev.calName&&UNI_KEYS.some(function(k){return ev.calName.toLowerCase().includes(k);});}
            const uc28=new Date();uc28.setDate(uc28.getDate()+28);const ucEnd=dStr(uc28);
            const upcomingClasses=dedupedEvents.filter(function(ev){return isUniCalEv(ev)&&!isAssessmentEvent(ev)&&!ev.allDay&&ev.date>=todayStr()&&ev.date<=ucEnd;}).sort(function(a,b){return a.date.localeCompare(b.date)||(a.time||"").localeCompare(b.time||"");});
            return(<React.Fragment>
              {/* ── Assessments ── */}
              <div className="card-rim" style={card()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:totalA>0?10:0}}>
                  <div>
                    <div style={sT}>Assessments</div>
                    {totalA>0&&<div style={{fontSize:10,color:T.text3,marginTop:2}}>{doneA} of {totalA} complete</div>}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{...btn,fontSize:10}} onClick={function(){setShowAddAssess(true);}}>+ Add</button>
                    <button style={{...editPill,borderColor:"rgba(91,140,255,0.4)"}} onClick={function(){setShowSyllabusImport(true);}}><UIcon name="upload" size={11}/>Import</button>
                  </div>
                </div>
                {totalA>0&&<div style={{height:2,borderRadius:1,background:"rgba(255,255,255,0.06)",marginBottom:14}}>
                  <div className="bar-reveal" style={{height:"100%",borderRadius:1,background:doneA===totalA?"#69f0ae":"#5b8cff",width:Math.round(doneA/totalA*100)+"%",transition:"width 0.4s cubic-bezier(0.23,1,0.32,1)"}}/>
                </div>}
                {assessments.length===0
                  ?<div style={{textAlign:"center",padding:"36px 0 24px"}}>
                    <div style={{fontSize:12,color:T.text2,marginBottom:14}}>No assessments this semester</div>
                    <button style={{...editPill,borderColor:"rgba(91,140,255,0.4)",padding:"6px 16px"}} onClick={function(){setShowSyllabusImport(true);}}>
                      <UIcon name="upload" size={11}/> Import syllabus
                    </button>
                  </div>
                  :(function(){
                    const upcoming2=assessments.filter(function(a){return !a.done&&daysBetween(a.date)>=0;}).sort(function(a,b){return a.date.localeCompare(b.date);});
                    const overdue=assessments.filter(function(a){return !a.done&&daysBetween(a.date)<0;}).sort(function(a,b){return b.date.localeCompare(a.date);});
                    const done2=assessments.filter(function(a){return a.done;}).sort(function(a,b){return b.date.localeCompare(a.date);});
                    return upcoming2.concat(overdue).concat(done2).map(function(a){
                      const days=daysBetween(a.date);
                      const badge=typeBadge(a.type);
                      const isUrg=!a.done&&days>=0&&days<=3;
                      const isPast=!a.done&&days<0;
                      const dayLabel=days===0?"Today":days===1?"Tomorrow":days<=13?WX_DAYS[new Date(a.date+"T00:00").getDay()]+" · "+days+"d":fmtDate(a.date);
                      const dotCol=a.done?"#69f0ae":isPast?"#ff6b6b":isUrg?"#ffd166":"#5b8cff";
                      const dotGlow=a.done?"0 0 6px #69f0ae":isPast?"0 0 6px #ff6b6b":isUrg?"0 0 5px #ffd166":"0 0 6px #5b8cff";
                      const barCol=isPast?T.danger:a.done?"#69f0ae":"#5b8cff";
                      return(<div key={a.id} style={{position:"relative",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",paddingLeft:14,borderRadius:8,background:T.bg3,border:"0.5px solid "+(isPast&&!a.done?"rgba(255,107,107,0.2)":T.border),marginBottom:5,opacity:a.done?0.5:1,overflow:"hidden",transition:"all 0.15s"}}>
                        <div style={{position:"absolute",left:0,top:5,bottom:5,width:2,borderRadius:1,background:barCol,opacity:a.done?0.35:isPast?1:0.7}}/>
                        <div style={{width:18,height:18,borderRadius:5,border:"1.5px solid "+(a.done?"#69f0ae":T.border2),background:a.done?"#69f0ae":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){toggleAssessmentDone(a.id);}}>
                          {a.done&&<span style={{fontSize:10,color:"#05071a",fontWeight:700}}>✓</span>}
                        </div>
                        <div style={{flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          <span style={{fontSize:9,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.04em",marginRight:6}}>{a.subject}</span>
                          <span style={{fontSize:12,color:a.done?T.text3:T.text,textDecoration:a.done?"line-through":"none"}}>{a.name}</span>
                        </div>
                        <span style={{fontSize:9,fontWeight:600,color:T.text3,background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.10)",padding:"2px 7px",borderRadius:999,flexShrink:0,whiteSpace:"nowrap"}}>{badge.label}</span>
                        <div style={{width:8,height:8,borderRadius:"50%",background:dotCol,boxShadow:dotGlow,flexShrink:0}}/>
                        <span style={{fontSize:10,color:T.text3,flexShrink:0,whiteSpace:"nowrap",minWidth:56,textAlign:"right"}}>{a.done?fmtDate(a.date):isPast?Math.abs(days)+"d overdue":dayLabel}</span>
                        <button style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:13,padding:"0 2px",flexShrink:0,opacity:0.4,lineHeight:1}} onClick={function(){removeAssessment(a.id);}}>×</button>
                      </div>);
                    });
                  })()
                }
              </div>
              {/* ── Upcoming Classes ── */}
              <div className="card-rim" style={card()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={sT}>Upcoming Classes</div>
                  <div style={{fontSize:9,color:T.text3}}>next 28 days</div>
                </div>
                {upcomingClasses.length===0?<div style={{fontSize:12,color:T.text2}}>{gcalConnected?"No upcoming classes in the next 28 days.":"Connect Google Calendar to see your schedule."}</div>:(function(){let lastDate2="";return upcomingClasses.map(function(ev){const showDate=ev.date!==lastDate2;lastDate2=ev.date;const col=evColor(ev);const isToday=ev.date===todayStr();return(<div key={ev.id}>{showDate&&<div style={{fontSize:10,fontWeight:600,color:isToday?T.accent:T.text2,marginTop:10,marginBottom:6,paddingTop:8,borderTop:"0.5px solid "+T.border}}>{isToday?"Today — ":""}{new Date(ev.date+"T12:00:00").toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"short"})}</div>}<div style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}><div style={{width:2,borderRadius:2,background:col,alignSelf:"stretch",minHeight:28,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:T.text2,marginBottom:1}}>{evLabel(ev)}</div><div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{ev.title}</div>{ev.description&&<div style={{fontSize:10,color:T.text3,marginTop:2,lineHeight:1.4}}>{ev.description.slice(0,120)}{ev.description.length>120?"…":""}</div>}<div style={{fontSize:10,color:T.text3,marginTop:2}}>{ev.time}</div></div></div></div>);});}())}
              </div>
            </React.Fragment>);
          })()}
        </div>}

        {page==="Work"&&<div style={{maxWidth:mob?undefined:900}}><ErrorBoundary name="Work"><WorkSection mob={mob} data={data.work||{}} onUpdate={updateWork} gcalEvents={dedupedEvents}/></ErrorBoundary></div>}

        {page==="Gym"&&<ErrorBoundary name="Gym"><GymSection mob={mob} gymData={data.gym} onAddEx={function(){setModal("add_exercise");setMForm({});}} onLogW={function(ex){setModal("log_weight");setMForm({exId:ex.id,exName:ex.name});}} onSave={function(wk){setData(function(p){
  const rl=p.gym.rotation?p.gym.rotation.length:1;
  const today=wk.date||todayStr();
  // Write sets back to rotation template so next session pre-fills with updated weights
  const newRot=(p.gym.rotation||[]).map(function(rt){
    if(!wk.rotId||rt.id!==wk.rotId)return rt;
    return{...rt,exercises:(wk.sets||[]).map(function(r){return{id:r.id||Date.now(),exercise:r.exercise,sets:r.sets,reps:r.reps,weight:r.weight};})};
  });
  // Log each exercise weight for progressive overload tracking
  var newExercises=[...(p.gym.exercises||[])];
  (wk.sets||[]).forEach(function(r){
    if(!r.exercise)return;
    var idx=newExercises.findIndex(function(e){return e.name&&e.name.toLowerCase()===r.exercise.toLowerCase();});
    var logEntry={date:today,weight:Number(r.weight)||0};
    if(idx>=0){newExercises[idx]={...newExercises[idx],logs:[...(newExercises[idx].logs||[]),logEntry]};}
    else{newExercises.push({id:'ex_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),name:r.exercise,logs:[logEntry]});}
  });
  return{...p,gym:{...p.gym,workouts:(p.gym.workouts||[]).concat([wk]),rotIdx:((p.gym.rotIdx||0)+1)%Math.max(rl,1),rotation:newRot,exercises:newExercises}};
});}} onUpdateRot={function(rot,idx){setData(function(p){return{...p,gym:{...p.gym,rotation:rot,rotIdx:idx}};});}} onDeleteBW={deleteBWEntry} onAddBW={function(entry){trk("gym.bodyweight_log");setData(function(p){const existing=(p.gym.bodyWeight||[]).filter(function(e){return e.date!==entry.date;});const updated=existing.concat([{date:entry.date,weight:Number(entry.weight)}]).sort(function(a,b){return a.date.localeCompare(b.date);});return{...p,gym:{...p.gym,bodyWeight:updated,lastBWWeek:entry.date>=thisWeek?thisWeek:p.gym.lastBWWeek}};});showToast("Body weight logged!","success");}}/></ErrorBoundary>}

        {page==="Personal"&&<div style={{maxWidth:640}}>
          <div className="card-rim" style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={sT}>Tasks</div><div style={{display:"flex",gap:6}}>{doneTasks.length>0&&<button style={{...btn,color:T.success,borderColor:T.success+"50"}} onClick={archiveDone}>Archive done</button>}<button style={btn} onClick={function(){setModal("add_task");setMForm({priority:"normal",cat:"Errands"});}}>+ Task</button></div></div>
            {editTaskId&&<div style={{marginBottom:14,padding:"10px 12px",background:T.bg3,borderRadius:8,border:"0.5px solid "+T.accent+"40"}}><div style={{fontSize:11,color:T.accent,marginBottom:8,fontWeight:500}}>Editing task</div><div style={{display:"flex",flexDirection:"column",gap:6}}><input style={inp} value={editTaskForm.name||""} onChange={function(ev){setEditTaskForm(function(f){return{...f,name:ev.target.value};});}} placeholder="Task name"/><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:6}}><select style={inp} value={editTaskForm.cat||"Errands"} onChange={function(ev){setEditTaskForm(function(f){return{...f,cat:ev.target.value};});}}>{TASK_CATS.map(function(c){return<option key={c}>{c}</option>;})}</select><select style={inp} value={editTaskForm.priority||"normal"} onChange={function(ev){setEditTaskForm(function(f){return{...f,priority:ev.target.value};});}}><option value="normal">Normal</option><option value="urgent">Urgent</option></select><input type="date" style={inp} value={editTaskForm.due||""} onChange={function(ev){setEditTaskForm(function(f){return{...f,due:ev.target.value};});}}/></div><div style={{display:"flex",gap:6,justifyContent:"flex-end"}}><button style={btn} onClick={function(){setEditTaskId(null);}}>Cancel</button><button style={btnP} onClick={saveEditTask}>Save</button></div></div></div>}
            {data.personal.tasks.length===0&&<div style={{fontSize:12,color:T.text2}}>No tasks yet.</div>}
            {["urgent","normal"].map(function(pri){const tasks=data.personal.tasks.filter(function(t){return t.priority===pri;}).sort(function(a,b){return new Date(a.due||"9999")-new Date(b.due||"9999");});if(tasks.length===0)return null;return(<div key={pri} style={{marginBottom:14}}><div style={{fontSize:9,fontWeight:700,color:pri==="urgent"?T.danger:T.text3,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>{pri}</div>{tasks.map(function(t){const urg=taskUrg(t);const col=TUC[urg];return(<div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:8,padding:"11px 13px",borderRadius:12,background:"rgba(225,234,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"inset 10px 0 9px -8px "+col}}><input type="checkbox" checked={t.done} onChange={function(){toggleTask(t.id);}} style={{accentColor:T.accent,marginTop:2,flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,color:T.text,textDecoration:t.done?"line-through":"none"}}>{t.name}</div><div style={{fontSize:10,color:col,marginTop:1}}>{t.cat} · {taskLabel(t)}</div></div><button onClick={function(){setEditTaskId(t.id);setEditTaskForm({name:t.name,cat:t.cat,priority:t.priority,due:t.due});}} style={{...btn,fontSize:10,padding:"2px 7px"}}>Edit</button></div>);})}</div>);})}
          </div>
          {(data.personal.archived||[]).length>0&&<div className="card-rim" style={card()}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:12,fontWeight:500,color:T.text3}}>Archived ({(data.personal.archived||[]).length})</div><button style={btn} onClick={function(){setShowArch(function(a){return !a;});}}>{showArch?"Hide":"Show"}</button></div>{showArch&&(data.personal.archived||[]).slice().reverse().map(function(t){return(<div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,padding:"6px 0",borderBottom:"0.5px solid "+T.border}}><div><span style={{color:T.text3,textDecoration:"line-through"}}>{t.name}</span><span style={{fontSize:10,color:T.text3,marginLeft:8}}>{fmtDate(t.archivedAt)}</span></div><button onClick={function(){restoreTask(t.id);}} style={{...btn,fontSize:10,padding:"2px 8px",color:T.accent,borderColor:T.accent+"50"}}>Restore</button></div>);})}</div>}
          <div className="card-rim" style={card()}><div style={sT}>Knowledge base</div><div style={{fontSize:11,color:T.text2,marginBottom:10}}>Notes here feed your daily check-in context.</div>{(data.docs||[]).map(function(d){return(<div key={d.id} style={{marginBottom:8,padding:"8px 10px",background:T.bg3,borderRadius:6,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:12,fontWeight:500,color:T.text}}>{d.title}</div><div style={{fontSize:10,color:T.text3,marginTop:2}}>{d.content.slice(0,80)}...</div><div style={{marginTop:4,display:"flex",gap:4}}>{(d.tags||[]).map(function(tag){return<span key={tag} style={{fontSize:9,padding:"1px 6px",borderRadius:99,background:T.accentBg,color:T.accent}}>{tag}</span>;})}</div></div><button onClick={function(){trk("kb.doc_delete");setData(function(p){return{...p,docs:(p.docs||[]).filter(function(x){return x.id!==d.id;})};});}} style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:16,marginLeft:8}}>×</button></div>);})}<div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}><input style={inp} placeholder="Title" value={docIn.title} onChange={function(ev){setDocIn(function(p){return{...p,title:ev.target.value};});}}/><input style={inp} placeholder="Tags (comma separated)" value={docIn.tags} onChange={function(ev){setDocIn(function(p){return{...p,tags:ev.target.value};});}}/><textarea style={{...inp,resize:"vertical"}} rows={3} placeholder="Content..." value={docIn.content} onChange={function(ev){setDocIn(function(p){return{...p,content:ev.target.value};});}}/><button style={btnP} onClick={function(){if(!docIn.title||!docIn.content)return;trk("kb.doc_add");setData(function(p){return{...p,docs:(p.docs||[]).concat([{id:"doc"+Date.now(),title:docIn.title,tags:docIn.tags.split(",").map(function(t){return t.trim();}),content:docIn.content}])};});setDocIn({title:"",tags:"",content:""});}}>Add document</button></div></div>
        </div>}

        {page==="Finance"&&<div style={{maxWidth:mob?undefined:900}}><ErrorBoundary name="Finance"><FinanceSection mob={mob} data={data.finance||{}} onUpdate={updateFinance} gcalEvents={visibleGcalEvents}/></ErrorBoundary></div>}

        {page==="Journal"&&<div style={{display:"flex",gap:6,marginBottom:14}}>
          {[{key:"captures",label:"Captures",icon:"bolt"},{key:"reflection",label:"Reflection",icon:"target"}].map(function(t){const active=journalTab===t.key;return(<button key={t.key} onClick={function(){setJournalTab(t.key);}} style={{padding:"6px 14px",borderRadius:99,fontSize:12,cursor:"pointer",border:active?"1px solid "+T.accent:"0.5px solid "+T.border,background:active?T.accentBg:"transparent",color:active?T.accent:T.text2,fontWeight:active?600:400,display:"flex",alignItems:"center",gap:6}}><span style={{display:"flex"}}><UIcon name={t.icon} size={13}/></span>{t.label}</button>);})}
        </div>}

        {page==="Journal"&&journalTab==="reflection"&&<div style={{maxWidth:600}}>
          <div className="card-rim" style={card()}>
            <div style={sT}>Weekly Reflection</div>
            {reflStep===0&&<div>
              <div style={{fontSize:12,color:T.text2,marginBottom:14,lineHeight:1.6}}>5 focused questions. ~5 minutes. Honest answers only.{data.reflections.length>0&&<span style={{marginLeft:8,color:T.text3}}>Last: {new Date(data.reflections[data.reflections.length-1].date).toLocaleDateString("en-AU")}</span>}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>{REFL_LABELS.map(function(l,i){return<div key={i} style={{fontSize:10,padding:"3px 10px",borderRadius:99,background:T.accentBg,border:"0.5px solid rgba(91,140,255,0.25)",color:T.accent}}>{l}</div>;})}</div>
              <button style={btnP} onClick={function(){trk("reflection.start");setReflStep(1);setReflAns([]);setReflAnalysis(null);}}>Start this week's reflection →</button>
              {data.reflections.length>0&&<div style={{marginTop:20}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>Previous Reflections</div>
                {data.reflections.slice().reverse().map(function(r,i){
                  const a=r.analysis;const sc=a?a.sentimentScore:null;
                  const isExp=expandedRefl===i;
                  const sentCol=sc>=0.1?T.success:sc<=-0.1?T.danger:T.warn;
                  const sentLabel=sc>=0.1?"↑ Positive":sc<=-0.1?"↓ Stressed":"→ Neutral";
                  return<div key={i} style={{marginBottom:8,borderRadius:10,border:"0.5px solid "+(isExp?T.accent:T.border),overflow:"hidden"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:isExp?T.accentBg:T.bg3,cursor:"pointer"}} onClick={function(){if(!isExp)trk("reflection.expand_past");setExpandedRefl(isExp?null:i);}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{fontSize:11,fontWeight:600,color:T.text}}>{new Date(r.date).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"})}</div>
                        {a&&<div style={{fontSize:10,color:T.accent}}>{a.dominantPattern}</div>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {sc!==null&&<div style={{fontSize:10,fontWeight:700,color:sentCol}}>{sentLabel}</div>}
                        <span style={{fontSize:11,color:T.text3}}>{isExp?"▲":"▼"}</span>
                      </div>
                    </div>
                    {isExp&&<div style={{padding:"14px 14px",background:"rgba(14,16,40,0.6)"}}>
                      {a&&<div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                          <div style={{padding:"8px 10px",borderRadius:8,background:a.sentBg||T.bg3,border:"0.5px solid "+(a.sentBorder||T.border)}}>
                            <div style={{fontSize:9,color:T.text3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Emotional State</div>
                            <div style={{fontSize:11,color:a.sentColor||T.text,fontWeight:600,lineHeight:1.4}}>{a.emotionalState}</div>
                          </div>
                          <div style={{padding:"8px 10px",borderRadius:8,background:T.accentBg,border:"0.5px solid rgba(91,140,255,0.18)"}}>
                            <div style={{fontSize:9,color:T.text3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Dominant Pattern</div>
                            <div style={{fontSize:11,color:T.accent,fontWeight:600,lineHeight:1.4}}>{a.dominantPattern}</div>
                          </div>
                        </div>
                        {a.rootIssue&&<div style={{padding:"8px 10px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:8}}>
                          <div style={{fontSize:9,color:T.text3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Root Issue</div>
                          <div style={{fontSize:11,color:T.text,lineHeight:1.5}}>{a.rootIssue}</div>
                        </div>}
                        {a.insight&&<div style={{padding:"10px 12px",borderRadius:8,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.18)",marginBottom:8}}>
                          <div style={{fontSize:9,color:T.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Analysis</div>
                          <div style={{fontSize:11,color:T.text2,lineHeight:1.8}}>{a.insight}</div>
                        </div>}
                        {a.recommendation&&<div style={{padding:"10px 12px",borderRadius:8,background:"rgba(105,240,174,0.06)",border:"0.5px solid rgba(105,240,174,0.2)",marginBottom:8}}>
                          <div style={{fontSize:9,color:T.success,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4,display:"flex",alignItems:"center",gap:5}}><UIcon name="bulb" size={11}/>Recommendation</div>
                          <div style={{fontSize:11,color:T.text2,lineHeight:1.8}}>{a.recommendation}</div>
                        </div>}
                      </div>}
                      {r.answers&&r.answers.length>0&&<div style={{marginTop:10,paddingTop:10,borderTop:"0.5px solid "+T.border}}>
                        <div style={{fontSize:9,color:T.text3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Your Answers</div>
                        {r.answers.map(function(qa,qi){return<div key={qi} style={{marginBottom:8}}>
                          <div style={{fontSize:10,color:T.accent,fontWeight:600,marginBottom:2}}>{qa.area||("Q"+(qi+1))}</div>
                          <div style={{fontSize:11,color:T.text2,lineHeight:1.6,padding:"6px 10px",background:T.bg3,borderRadius:6}}>{qa.answer||qa.a}</div>
                        </div>;})}
                      </div>}
                    </div>}
                  </div>;
                })}
              </div>}
            </div>}
            {reflStep>0&&reflStep<=REFL_QS.length&&<div>
              <div style={{display:"flex",gap:3,marginBottom:14}}>{REFL_QS.map(function(_,i){return<div key={i} style={{flex:1,height:3,borderRadius:2,background:i<reflStep?T.accent:"rgba(255,255,255,0.08)",transition:"background 0.3s"}}/>;})}</div>
              <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.accent,background:T.accentBg,padding:"3px 10px",borderRadius:99,display:"inline-block",marginBottom:10}}>{REFL_LABELS[reflStep-1]} · {reflStep} of {REFL_QS.length}</div>
              <div style={{fontSize:14,fontWeight:500,marginBottom:16,lineHeight:1.6,color:T.text}}>{REFL_QS[reflStep-1]}</div>
              {reflAns.length>0&&<div style={{marginBottom:12}}>{reflAns.map(function(qa,i){return<div key={i} style={{marginBottom:4,fontSize:11,color:T.text3,padding:"5px 8px",background:T.bg3,borderRadius:6}}><span style={{color:T.text2,fontWeight:500}}>{REFL_LABELS[i]}: </span>{qa.a.slice(0,60)}{qa.a.length>60?"...":""}</div>;})}</div>}
              <textarea value={reflIn} onChange={function(ev){setReflIn(ev.target.value);}} rows={5} style={{...inp,resize:"vertical",marginBottom:12,fontSize:13,lineHeight:1.6}} placeholder="Be honest — this is only visible to you..."/>
              <div style={{display:"flex",gap:8}}>
                {reflStep>1&&<button style={btn} onClick={function(){const prev=reflAns[reflStep-2]?reflAns[reflStep-2].a:"";setReflAns(reflAns.slice(0,reflStep-2));setReflIn(prev);setReflStep(reflStep-1);}}>← Back</button>}
                <button style={btnP} onClick={submitRefl}>{reflStep<REFL_QS.length?"Next →":"Finish & Analyse"}</button>
              </div>
            </div>}
            {reflStep>REFL_QS.length&&<div>
              {reflAnalysisLoading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"30px 0",color:T.text2}}><div style={{width:28,height:28,borderRadius:"50%",border:"2px solid "+T.accent,borderTopColor:"transparent",animation:"spin 0.9s linear infinite"}}/><div style={{fontSize:12}}>AI is analysing your reflection...</div></div>}
              {reflAnalysis&&!reflAnalysisLoading&&<div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,padding:"10px 12px",borderRadius:10,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.2)"}}>
                  <span style={{display:"flex",color:T.accent}}><UIcon name="chart" size={20}/></span>
                  <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>Weekly Psychological Insight</div><div style={{fontSize:10,color:T.text3}}>Based on your answers and reflection history</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div style={{padding:"10px 12px",borderRadius:10,background:reflAnalysis.sentBg,border:"0.5px solid "+reflAnalysis.sentBorder}}>
                    <div style={{fontSize:9,color:T.text3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Emotional State</div>
                    <div style={{fontSize:11,color:reflAnalysis.sentColor,fontWeight:600,lineHeight:1.4}}>{reflAnalysis.emotionalState}</div>
                  </div>
                  <div style={{padding:"10px 12px",borderRadius:10,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.18)"}}>
                    <div style={{fontSize:9,color:T.text3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Dominant Pattern</div>
                    <div style={{fontSize:11,color:T.accent,fontWeight:600,lineHeight:1.4}}>{reflAnalysis.dominantPattern}</div>
                  </div>
                </div>
                <div style={{padding:"10px 12px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:10}}>
                  <div style={{fontSize:9,color:T.text3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Root Issue Identified</div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{reflAnalysis.rootIssue}</div>
                </div>
                <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.18)",marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Psychological Analysis</div>
                  <div style={{fontSize:12,color:T.text2,lineHeight:1.8}}>{reflAnalysis.insight}</div>
                </div>
                <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(105,240,174,0.06)",border:"0.5px solid rgba(105,240,174,0.2)",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{display:"flex",color:T.success}}><UIcon name="bulb" size={14}/></span><div style={{fontSize:10,fontWeight:700,color:T.success,textTransform:"uppercase",letterSpacing:0.5}}>Recommendation</div></div>
                  <div style={{fontSize:12,color:T.text2,lineHeight:1.8}}>{reflAnalysis.recommendation}</div>
                </div>
                <div style={{padding:"12px 14px",borderRadius:10,background:T.bg3,border:"0.5px solid "+T.border,marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{display:"flex",color:T.text2}}><UIcon name="trend" size={14}/></span><div style={{fontSize:10,fontWeight:700,color:T.text2,textTransform:"uppercase",letterSpacing:0.5}}>Pattern History</div></div>
                  <div style={{fontSize:12,color:T.text2,lineHeight:1.7}}>{reflAnalysis.patternHistory}</div>
                </div>
                <button style={btn} onClick={function(){setReflStep(0);setReflAnalysis(null);}}>Done</button>
              </div>}
              {!reflAnalysis&&!reflAnalysisLoading&&<div><div style={{fontSize:12,color:T.success,marginBottom:10}}>✓ Reflection saved</div><button style={btn} onClick={function(){setReflStep(0);}}>Done</button></div>}
            </div>}
          </div>
        </div>}

        {page==="Journal"&&journalTab==="captures"&&<div>
          <div className="card-rim" style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={sT}>Captures</div>
              <button style={{...btnP,fontSize:11,padding:"5px 12px"}} onClick={function(){trk("capture.refresh");if(window._currentUser&&window._db){setCapturesLoading(true);_db.collection('users').doc(window._currentUser.uid).collection('captures').get().then(function(snap){var items=[];snap.forEach(function(doc){items.push({id:doc.id,...doc.data()});});items.sort(function(a,b){var ta=a.date&&a.date.toDate?a.date.toDate().getTime():0;var tb=b.date&&b.date.toDate?b.date.toDate().getTime():0;return tb-ta;});setCapturesData(items);setCapturesLoading(false);}).catch(function(){setCapturesLoading(false);});}}}>Refresh</button>
            </div>
            <input value={capturesSearch} onBlur={function(){if(capturesSearch.trim())trk("capture.search");}} onChange={function(ev){setCapturesSearch(ev.target.value);}} placeholder="Search captures..." style={{...inp,padding:"9px 12px",marginBottom:12,width:"100%"}}/>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {["all","learning","thought","reflection"].map(function(f){return(
                <button key={f} onClick={function(){trk("capture.filter");setCapturesFilter(f);}} style={{padding:"4px 12px",borderRadius:99,fontSize:11,cursor:"pointer",border:capturesFilter===f?"1px solid "+T.accent:"0.5px solid "+T.border,background:capturesFilter===f?T.accentBg:"transparent",color:capturesFilter===f?T.accent:T.text2,fontWeight:capturesFilter===f?600:400}}>
                  {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)+"s"}
                </button>
              );})}
            </div>
            {capturesLoading&&<div style={{fontSize:12,color:T.text3,padding:"20px 0",textAlign:"center"}}>Loading...</div>}
            {!capturesLoading&&capturesData.length===0&&<div style={{fontSize:12,color:T.text3,padding:"20px 0",textAlign:"center"}}>No captures yet — hit Capture to add your first one.</div>}
            {!capturesLoading&&(function(){
              var filtered=capturesData.filter(function(c){
                if(capturesFilter!=="all"&&c.type!==capturesFilter)return false;
                if(capturesSearch.trim()){var q=capturesSearch.toLowerCase();return(c.title||"").toLowerCase().includes(q)||(c.content||"").toLowerCase().includes(q)||(c.rawInput||"").toLowerCase().includes(q)||(c.tags||[]).some(function(t){return t.toLowerCase().includes(q);});}
                return true;
              });
              if(filtered.length===0)return<div style={{fontSize:12,color:T.text3,padding:"16px 0",textAlign:"center"}}>No results.</div>;
              return filtered.map(function(c){
                var isExp=expandedCapture===c.id;
                var ts=c.date&&c.date.toDate?c.date.toDate():null;
                var dateLabel=ts?ts.toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"})+" · "+ts.toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}):"";
                var typeColor=c.type==="learning"?T.accent:c.type==="reflection"?T.warn:T.text3;
                var typeBg=c.type==="learning"?T.accentBg:c.type==="reflection"?"rgba(255,209,102,0.12)":T.bg3;
                return(
                  <div key={c.id} style={{marginBottom:10,padding:"12px 14px",borderRadius:10,background:T.bg2,border:"0.5px solid "+(isExp?T.accent:T.border),cursor:"pointer",transition:"border 0.15s"}} onClick={function(){if(!isExp)trk("capture.expand");setExpandedCapture(isExp?null:c.id);}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:isExp?10:4}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,background:typeBg,color:typeColor}}>{c.type||"thought"}</span>
                      {c.subject&&<span style={{fontSize:10,color:T.text3}}>{c.subject}</span>}
                      <span style={{fontSize:10,color:T.text3,marginLeft:"auto"}}>{dateLabel}</span>
                      <span style={{fontSize:12,color:T.text3}}>{isExp?"▲":"▼"}</span>
                    </div>
                    <div style={{fontSize:12,fontWeight:isExp?700:500,color:T.text,marginBottom:isExp?8:0}}>{c.title||c.rawInput||""}</div>
                    {isExp&&<div>
                      <div style={{fontSize:12,color:T.text2,lineHeight:1.8,marginBottom:c.formula?10:0}}>{renderMd(c.content)}</div>
                      {c.formula&&<div style={{padding:"8px 12px",borderRadius:8,background:T.bg3,border:"0.5px solid "+T.border,fontSize:11,color:T.accent,fontFamily:"monospace",marginBottom:8}}>{c.formula}</div>}
                      {c.example&&<div style={{padding:"8px 12px",borderRadius:8,background:"rgba(105,240,174,0.06)",border:"0.5px solid rgba(105,240,174,0.2)",fontSize:11,color:T.text2,lineHeight:1.6,marginBottom:8}}><span style={{fontWeight:600,color:T.success}}>Example: </span>{c.example}</div>}
                      {c.tags&&c.tags.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>{c.tags.map(function(tag){return<span key={tag} style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:T.bg3,color:T.text3}}>#{tag}</span>;})}</div>}
                      <div style={{display:"flex",justifyContent:"flex-end",marginTop:12,paddingTop:10,borderTop:"0.5px solid "+T.border}}>
                        <button onClick={function(ev){openEditCapture(c,ev);}} style={{...btn,padding:"5px 14px",borderRadius:8,display:"inline-flex",alignItems:"center",gap:5}}><UIcon name="pencil" size={11}/>Edit</button>
                      </div>
                    </div>}
                  </div>
                );
              });
            })()}
          </div>
        </div>}
      </div>

      {modal&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.82)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:200,padding:mob?"0":"16px"}} onClick={function(){setModal(null);}}>
        <div style={{background:"rgba(14,16,40,0.97)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:mob?"20px 20px 0 0":"16px",padding:mob?"24px 20px 32px":"22px",width:mob?"100%":modal==="edit_rotation"?"480px":"340px",maxWidth:"100%",border:"0.5px solid rgba(91,140,255,0.25)",boxShadow:"0 8px 32px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.1)"}} onClick={function(ev){ev.stopPropagation();}}>
          {mob&&<div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)",margin:"0 auto 20px"}}/>}
          <div style={{fontSize:15,fontWeight:600,marginBottom:16,color:T.text}}>{modal==="add_subject"&&"Add subject"}{modal==="add_exercise"&&"Add exercise"}{modal==="log_weight"&&"Log weight — "+(mForm.exName||"")}{modal==="add_task"&&"Add task"}{modal==="edit_rotation"&&"Edit rotation template"}</div>
          {modal==="add_exercise"&&(function(){
            var names=[];var seen={};
            (data.gym.exercises||[]).forEach(function(ex){var n=(ex.name||"").trim();if(n&&!seen[n.toLowerCase()]){seen[n.toLowerCase()]=true;names.push(n);}});
            (data.gym.rotation||[]).forEach(function(r){(r.exercises||[]).forEach(function(ex){var n=(ex.exercise||"").trim();if(n&&!seen[n.toLowerCase()]){seen[n.toLowerCase()]=true;names.push(n);}});});
            names.sort(function(a,b){return a.localeCompare(b);});
            if(names.length===0)return null;
            return(<div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.text2,marginBottom:6}}>Pick from history</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",maxHeight:140,overflowY:"auto",paddingRight:4}}>
                {names.map(function(n){var active=(mForm.name||"").toLowerCase()===n.toLowerCase();return(<button key={n} type="button" onClick={function(){trk("gym.exercise_picker");setMForm(function(f){return{...f,name:n};});}} style={{padding:"4px 10px",borderRadius:99,border:active?"1px solid "+T.accent:"0.5px solid "+T.border,background:active?T.accentBg:"transparent",color:active?T.accent:T.text2,fontSize:11,cursor:"pointer",fontWeight:active?600:400,whiteSpace:"nowrap"}}>{n}</button>);})}
              </div>
            </div>);
          })()}
          {(modal==="add_subject"||modal==="add_exercise"||modal==="add_task")&&<div style={{marginBottom:12}}><div style={{fontSize:11,color:T.text2,marginBottom:6}}>{modal==="add_exercise"?"Or type a new one":"Name"}</div><input style={{...inp,padding:"10px 12px",fontSize:14}} value={mForm.name||""} onChange={function(ev){setMForm(function(f){return{...f,name:ev.target.value};});}} placeholder="Enter name..."/></div>}
          {modal==="log_weight"&&<div style={{marginBottom:12}}><div style={{fontSize:11,color:T.text2,marginBottom:6}}>Weight (kg)</div><input type="number" step="0.5" style={{...inp,padding:"10px 12px",fontSize:14}} value={mForm.weight||""} onChange={function(ev){setMForm(function(f){return{...f,weight:ev.target.value};});}} placeholder="e.g. 85"/></div>}
          {modal==="add_task"&&<div><div style={{marginBottom:12}}><div style={{fontSize:11,color:T.text2,marginBottom:6}}>Category</div><select style={{...inp,padding:"10px 12px",fontSize:14}} value={mForm.cat||"Errands"} onChange={function(ev){setMForm(function(f){return{...f,cat:ev.target.value};});}}>{TASK_CATS.map(function(c){return<option key={c}>{c}</option>;})}</select></div><div style={{marginBottom:12}}><div style={{fontSize:11,color:T.text2,marginBottom:6}}>Priority</div><select style={{...inp,padding:"10px 12px",fontSize:14}} value={mForm.priority||"normal"} onChange={function(ev){setMForm(function(f){return{...f,priority:ev.target.value};});}}><option value="normal">Normal</option><option value="urgent">Urgent</option></select></div><div style={{marginBottom:12}}><div style={{fontSize:11,color:T.text2,marginBottom:6}}>Due date</div><div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>{[["Today",0],["3 days",3],["7 days",7],["14 days",14]].map(function(item){const label=item[0];const n=item[1];const val=futureDateStr(n);const active=mForm.due===val;return(<button key={label} type="button" onClick={function(){setMForm(function(f){return{...f,due:val};});}} style={{padding:"5px 10px",borderRadius:99,border:active?"1px solid "+T.accent:"0.5px solid "+T.border,background:active?T.accentBg:"transparent",color:active?T.accent:T.text2,fontSize:11,cursor:"pointer",fontWeight:active?600:400}}>{label}</button>);})}</div><input type="date" style={{...inp,padding:"10px 12px",fontSize:14}} value={mForm.due||""} onChange={function(ev){setMForm(function(f){return{...f,due:ev.target.value};});}}/></div></div>}
          {modal==="edit_rotation"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              <div><div style={{fontSize:11,color:T.text2,marginBottom:4}}>Session name</div><input style={{...inp,padding:"8px 10px",fontSize:13}} value={mForm.rName||""} onChange={function(ev){setMForm(function(f){return{...f,rName:ev.target.value};});}}/></div>
              <div><div style={{fontSize:11,color:T.text2,marginBottom:4}}>Focus muscles</div><input style={{...inp,padding:"8px 10px",fontSize:13}} placeholder="e.g. Chest, Triceps" value={mForm.rFocus||""} onChange={function(ev){setMForm(function(f){return{...f,rFocus:ev.target.value};});}}/></div>
            </div>
            <div style={{fontSize:11,color:T.text2,marginBottom:6}}>Exercise template <span style={{color:T.text3,fontWeight:400}}>(saved as defaults for this rotation)</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 46px 46px 56px 28px",gap:5,marginBottom:4}}>{["Exercise","Sets","Reps","kg",""].map(function(h,i){return<div key={i} style={{fontSize:9,color:T.text3}}>{h}</div>;})}</div>
            {(mForm.exercises||[]).map(function(ex,i){return(<div key={ex.id||i} style={{display:"grid",gridTemplateColumns:"1fr 46px 46px 56px 28px",gap:5,marginBottom:5}}>
              <input style={{...inp,padding:"6px 8px",fontSize:12}} placeholder="Exercise" value={ex.exercise||""} onChange={function(ev){var v=ev.target.value;setMForm(function(f){var exs=f.exercises.map(function(e,j){return j===i?{...e,exercise:v}:e;});return{...f,exercises:exs};});}}/>
              <input style={{...inp,padding:"6px 4px",fontSize:12}} type="number" placeholder="4" value={ex.sets||""} onChange={function(ev){var v=ev.target.value;setMForm(function(f){var exs=f.exercises.map(function(e,j){return j===i?{...e,sets:v}:e;});return{...f,exercises:exs};});}}/>
              <input style={{...inp,padding:"6px 4px",fontSize:12}} type="number" placeholder="8" value={ex.reps||""} onChange={function(ev){var v=ev.target.value;setMForm(function(f){var exs=f.exercises.map(function(e,j){return j===i?{...e,reps:v}:e;});return{...f,exercises:exs};});}}/>
              <input style={{...inp,padding:"6px 4px",fontSize:12}} type="number" placeholder="80" value={ex.weight||""} onChange={function(ev){var v=ev.target.value;setMForm(function(f){var exs=f.exercises.map(function(e,j){return j===i?{...e,weight:v}:e;});return{...f,exercises:exs};});}}/>
              <button style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:14,padding:0}} onClick={function(){setMForm(function(f){return{...f,exercises:f.exercises.filter(function(_,j){return j!==i;})};});}}>×</button>
            </div>);})}
            <button style={{...btn,marginTop:4,fontSize:11}} onClick={function(){setMForm(function(f){return{...f,exercises:(f.exercises||[]).concat([{id:Date.now(),exercise:"",sets:"",reps:"",weight:""}])};});}}>+ Exercise</button>
          </div>}
          <div style={{display:"flex",gap:8,marginTop:16,flexDirection:mob?"column":"row",justifyContent:"flex-end"}}>
            {mob?<button style={{...btnP,padding:"13px",fontSize:14,width:"100%",borderRadius:10}} onClick={saveModal}>Save</button>:<button style={btnP} onClick={saveModal}>Save</button>}
            <button style={{...(mob?{...btn,padding:"11px",fontSize:13,width:"100%",borderRadius:10,textAlign:"center"}:btn)}} onClick={function(){setModal(null);}}>Cancel</button>
          </div>
        </div>
      </div>}

      {showTimePicker&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.82)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:250,padding:mob?"0":"16px"}} onClick={function(){setShowTimePicker(false);setScheduleTaskId(null);}}>
        <div style={{background:"rgba(14,16,40,0.97)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:mob?"20px 20px 0 0":"16px",padding:mob?"24px 20px 32px":"22px",width:mob?"100%":"320px",maxWidth:"100%",border:"0.5px solid rgba(91,140,255,0.25)",boxShadow:"0 8px 32px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.08)"}} onClick={function(e){e.stopPropagation();}}>
          {mob&&<div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)",margin:"0 auto 20px"}}/>}
          {(function(){const editingBlock=!!(data.personal.tasks.find(function(tt){return tt.id===scheduleTaskId;})||{}).scheduledDate;return(<React.Fragment>
          <div style={{fontSize:15,fontWeight:600,color:T.text,marginBottom:14}}>{editingBlock?"Edit time block":"Schedule task"}</div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:6}}>Date</div>
            <input type="date" style={{...inp,padding:"10px 12px",fontSize:14}} value={scheduleForDay||""} onChange={function(ev){setScheduleForDay(ev.target.value);}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:6}}>Start time</div>
            <input type="time" style={{...inp,padding:"10px 12px",fontSize:14}} value={scheduleTime} onChange={function(ev){setScheduleTime(ev.target.value);}}/>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:6}}>Duration</div>
            <div style={{display:"flex",gap:6}}>{[30,60,90,120].map(function(d){const active=scheduleDuration===d;return(<button key={d} style={{flex:1,padding:"8px 0",borderRadius:8,border:active?"1px solid "+T.accent:"0.5px solid "+T.border,background:active?T.accentBg:"rgba(255,255,255,0.04)",color:active?T.accent:T.text2,cursor:"pointer",fontSize:12,fontWeight:active?600:400}} onClick={function(){setScheduleDuration(d);}}>{d<60?d+"m":d===60?"1h":d===90?"1.5h":"2h"}</button>);})}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button style={{...btnP,padding:"12px",fontSize:14,width:"100%",borderRadius:10}} onClick={function(){confirmSchedule(false);}}>{editingBlock?"Update block →":"Schedule block →"}</button>
            <button style={{...btn,padding:"10px",fontSize:12,width:"100%",borderRadius:10,textAlign:"center"}} onClick={function(){confirmSchedule(true);}}>Just set due date</button>
            <button style={{...btn,padding:"10px",fontSize:12,width:"100%",borderRadius:10,textAlign:"center",opacity:0.6}} onClick={function(){setShowTimePicker(false);setScheduleTaskId(null);}}>Cancel</button>
            {editingBlock&&<button style={{...btn,padding:"10px",fontSize:12,width:"100%",borderRadius:10,textAlign:"center",color:T.danger,borderColor:T.danger+"40",marginTop:4}} onClick={unscheduleTask}>Remove from calendar</button>}
          </div>
          </React.Fragment>);}())}
        </div>
      </div>}

      {showCalPicker&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.82)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:200,padding:mob?"0":"16px"}} onClick={function(){setShowCalPicker(false);}}>
        <div style={{background:"rgba(14,16,40,0.97)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:mob?"20px 20px 0 0":"16px",padding:mob?"24px 20px 32px":"22px",width:mob?"100%":"380px",maxWidth:"100%",border:"0.5px solid rgba(91,140,255,0.25)",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}} onClick={function(e){e.stopPropagation();}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{fontSize:15,fontWeight:600,color:T.text}}>Google Calendars</div>
            <button style={{...btn,fontSize:10,color:"#4285F4",border:"0.5px solid #4285F440"}} onClick={function(){if(window.GCalSync)window.GCalSync.connect();}}>+ Add account</button>
          </div>
          <div style={{fontSize:11,color:T.text3,marginBottom:8,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>Tap a calendar to toggle. <span style={{display:"inline-flex"}}><UIcon name="eye" size={12}/></span> to hide from all views.</div>
          <div style={{fontSize:9,color:T.text3,marginBottom:12,padding:"5px 8px",borderRadius:6,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.15)"}}>Duplicate events (same title, date, time) are merged automatically. Events from jaydenpineda30@gmail.com are preferred when duplicates are detected.</div>
          {gcalCalendars.length===0?<div style={{fontSize:12,color:T.text2,marginBottom:16}}>No calendars found. Connect a Google account above.</div>:(function(){
            var byAccount={};
            gcalCalendars.forEach(function(cal){var e=cal._email||"Google";(byAccount[e]=byAccount[e]||[]).push(cal);});
            var accountEmails=Object.keys(byAccount);
            var multiAccount=accountEmails.length>1;
            return accountEmails.map(function(email){
              var accountCalIds=byAccount[email].map(function(c){return c.id;});
              var allSelected=gcalSelectedIds.length===0||accountCalIds.every(function(id){return gcalSelectedIds.indexOf(id)!==-1;});
              var isSolo=multiAccount&&gcalSelectedIds.length>0&&accountCalIds.every(function(id){return gcalSelectedIds.indexOf(id)!==-1;})&&accountEmails.filter(function(e){return e!==email;}).every(function(e){return byAccount[e].every(function(c){return gcalSelectedIds.indexOf(c.id)===-1;});});
              return(
              <div key={email} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:10,color:T.text3,fontWeight:600}}>{email}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {multiAccount&&<button style={{fontSize:9,color:isSolo?T.accent:T.text3,background:isSolo?"rgba(91,140,255,0.1)":"none",border:isSolo?"0.5px solid rgba(91,140,255,0.3)":"none",cursor:"pointer",padding:"2px 7px",borderRadius:5,fontWeight:isSolo?700:400}} onClick={function(){if(window.GCalSync)window.GCalSync.setSingleAccountMode(isSolo?null:email);}}>Solo</button>}
                    <button style={{fontSize:9,color:allSelected?T.warn:T.success,background:"none",border:"none",cursor:"pointer",padding:"2px 6px"}} onClick={function(){trk("settings.gcal_change");var next=allSelected?gcalSelectedIds.filter(function(id){return accountCalIds.indexOf(id)===-1;}):[].concat(gcalSelectedIds,accountCalIds.filter(function(id){return gcalSelectedIds.indexOf(id)===-1;}));if(window.GCalSync)window.GCalSync.setSelectedIds(next);}}>{allSelected?"Mute all":"Enable all"}</button>
                    <button style={{fontSize:9,color:T.danger,background:"none",border:"none",cursor:"pointer",padding:"2px 6px"}} onClick={function(){if(window.GCalSync)window.GCalSync.disconnect(email);}}>Remove</button>
                  </div>
                </div>
                {byAccount[email].map(function(cal){
                  var sel=gcalSelectedIds.indexOf(cal.id)!==-1;
                  var excl=gcalExcludedIds.indexOf(cal.id)!==-1;
                  return(<div key={cal.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,background:excl?"rgba(247,111,111,0.04)":sel?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.02)",marginBottom:4,border:"0.5px solid "+(excl?"rgba(247,111,111,0.2)":sel?"rgba(255,255,255,0.1)":"transparent"),transition:"all 0.15s"}}>
                    <div style={{width:12,height:12,borderRadius:3,background:cal.backgroundColor||"#4285F4",flexShrink:0,opacity:excl?0.2:sel?1:0.35,cursor:"pointer"}} onClick={function(){trk("settings.gcal_change");var next=sel?gcalSelectedIds.filter(function(id){return id!==cal.id;}):[].concat(gcalSelectedIds,[cal.id]);if(window.GCalSync)window.GCalSync.setSelectedIds(next);}}/>
                    <div style={{flex:1,fontSize:13,color:excl?T.text3:sel?T.text:T.text2,textDecoration:excl?"line-through":"none",cursor:"pointer"}} onClick={function(){trk("settings.gcal_change");var next=sel?gcalSelectedIds.filter(function(id){return id!==cal.id;}):[].concat(gcalSelectedIds,[cal.id]);if(window.GCalSync)window.GCalSync.setSelectedIds(next);}}>{cal.summary}</div>
                    <button style={{display:"flex",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:excl?T.danger:T.text3,padding:"2px 4px",opacity:excl?1:0.5,flexShrink:0}} title={excl?"Show calendar":"Hide calendar"} onClick={function(e){e.stopPropagation();toggleExclude(cal.id);}}><UIcon name="eye" size={13}/></button>
                    <div style={{width:18,height:18,borderRadius:"50%",border:"1.5px solid "+(sel&&!excl?"#34A853":"rgba(255,255,255,0.2)"),background:sel&&!excl?"#34A853":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}} onClick={function(){trk("settings.gcal_change");var next=sel?gcalSelectedIds.filter(function(id){return id!==cal.id;}):[].concat(gcalSelectedIds,[cal.id]);if(window.GCalSync)window.GCalSync.setSelectedIds(next);}}>
                      {sel&&!excl&&<div style={{fontSize:9,color:"#fff",fontWeight:700}}>✓</div>}
                    </div>
                  </div>);
                })}
              </div>
            );});
          })()}
          <div style={{display:"flex",gap:8,marginTop:14,paddingTop:12,borderTop:"0.5px solid "+T.border,flexWrap:"wrap"}}>
            <button style={{...btn,flex:1}} onClick={function(){if(window.GCalSync)window.GCalSync.refresh();setShowCalPicker(false);}}>Sync & close</button>
            <button style={{...btn,padding:"6px 11px",borderRadius:8}} onClick={function(){try{localStorage.removeItem('__gcal_selected__');localStorage.removeItem('__gcal_excluded__');}catch(_){}setGcalExcludedIds([]);if(window.GCalSync){window.GCalSync.setSelectedIds([]);window.GCalSync.refresh();}setShowCalPicker(false);}}>↺ Reset to all</button>
            <button style={{padding:"6px 13px",borderRadius:8,border:"1px solid rgba(247,111,111,0.4)",background:"rgba(247,111,111,0.1)",color:T.danger,cursor:"pointer",fontSize:12}} onClick={function(){if(window.GCalSync)window.GCalSync.disconnect();setShowCalPicker(false);}}>Disconnect all</button>
          </div>
        </div>
      </div>}

      {/* ── Add Assessment modal ── */}
      {showAddAssess&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.82)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:210,padding:mob?"0":"16px"}} onClick={function(){setShowAddAssess(false);}}>
        <div style={{background:"rgba(14,16,40,0.97)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:mob?"20px 20px 0 0":"16px",padding:mob?"24px 20px 32px":"22px",width:mob?"100%":"360px",maxWidth:"100%",border:"0.5px solid rgba(91,140,255,0.25)",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}} onClick={function(e){e.stopPropagation();}}>
          {mob&&<div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)",margin:"0 auto 20px"}}/>}
          <div style={{fontSize:15,fontWeight:600,marginBottom:16,color:T.text}}>Add Assessment</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div>
              <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Subject</div>
              <select style={{...inp,padding:"9px 11px"}} value={addAssessForm.subject} onChange={function(ev){setAddAssessForm(function(f){return{...f,subject:ev.target.value};});}}>
                {Object.keys(SUBJECTS).map(function(s){return<option key={s} value={s}>{s}</option>;})}
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Assessment name</div>
              <input style={{...inp,padding:"9px 11px"}} placeholder="e.g. Assignment 1" value={addAssessForm.name} onChange={function(ev){setAddAssessForm(function(f){return{...f,name:ev.target.value};});}}/>
            </div>
            <div>
              <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Type</div>
              <select style={{...inp,padding:"9px 11px"}} value={addAssessForm.type} onChange={function(ev){setAddAssessForm(function(f){return{...f,type:ev.target.value};});}}>
                <option value="SUBMISSION">Submission</option>
                <option value="IN-CLASS">In-Class / Supervised</option>
                <option value="EXAM">Exam</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Due date</div>
              <input type="date" style={{...inp,padding:"9px 11px"}} value={addAssessForm.date} onChange={function(ev){setAddAssessForm(function(f){return{...f,date:ev.target.value};});}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:18,flexDirection:mob?"column":"row",justifyContent:"flex-end"}}>
            <button style={btnP} onClick={addAssessment} disabled={!addAssessForm.name||!addAssessForm.date}>Save</button>
            <button style={btn} onClick={function(){setShowAddAssess(false);}}>Cancel</button>
          </div>
        </div>
      </div>}

      {/* ── Syllabus Import modal ── */}
      {showSyllabusImport&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.82)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:210,padding:mob?"0":"16px"}} onClick={function(){setShowSyllabusImport(false);}}>
        <div style={{background:"rgba(14,16,40,0.97)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:mob?"20px 20px 0 0":"16px",padding:mob?"24px 20px 32px":"22px",width:mob?"100%":"520px",maxWidth:"100%",maxHeight:mob?"90vh":"85vh",overflowY:"auto",border:"0.5px solid rgba(91,140,255,0.25)",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}} onClick={function(e){e.stopPropagation();}}>
          {mob&&<div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)",margin:"0 auto 20px"}}/>}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <div style={{fontSize:15,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8}}><UIcon name="upload" size={16}/>Import Syllabus via Gemini AI</div>
          </div>
          <div style={{fontSize:11,color:T.text3,marginBottom:16,lineHeight:1.5}}>Paste your unit outline or assessment schedule below. Gemini AI will extract all assessment due dates and add them to your hub.</div>

          {!geminiKey.trim()&&<div style={{marginBottom:14,padding:"9px 12px",borderRadius:8,background:"rgba(255,209,102,0.08)",border:"0.5px solid rgba(255,209,102,0.25)",fontSize:11,color:T.warn,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><UIcon name="warn" size={12}/>No Gemini API key set — add it in <button onClick={function(){setShowSyllabusImport(false);setShowMonitor(true);}} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontSize:11,padding:0,fontWeight:600}}>Logs → Settings</button></div>}

          {/* Semester start */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Semester start date <span style={{color:T.text3,fontWeight:400}}>(used to calculate week dates)</span></div>
            <input type="date" style={{...inp,padding:"9px 11px"}} value={syllabusStart} onChange={function(ev){setSyllabusStart(ev.target.value);}}/>
          </div>

          {/* Syllabus text */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Syllabus / unit outline text</div>
            <textarea style={{...inp,resize:"vertical",fontFamily:"monospace",fontSize:11,lineHeight:1.5}} rows={8} placeholder={"Paste your subject outline here...\nE.g.:\nWeek 5 — Assessment 1 due\nWeek 7 — Supervised exam (AT2)\n..."} value={syllabusText} onChange={function(ev){setSyllabusText(ev.target.value);}}/>
          </div>

          {/* Parse button */}
          <button style={{...btnP,width:"100%",padding:"11px",marginBottom:12,opacity:geminiLoading?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7}} onClick={parseWithGemini} disabled={geminiLoading||!syllabusText.trim()}>
            <UIcon name={geminiLoading?"clock":"sparkle"} size={14}/>{geminiLoading?"Parsing with Gemini AI...":"Parse with Gemini AI"}
          </button>

          {/* Preview */}
          {geminiPreview&&geminiPreview.length>0&&<div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.success,marginBottom:8}}>✓ {geminiPreview.length} assessments found — review before saving:</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:240,overflowY:"auto",paddingRight:2}}>
              {geminiPreview.map(function(a,i){
                const badge=typeBadge(a.type||"SUBMISSION");
                return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,background:T.bg3,border:"0.5px solid "+T.border}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,color:T.text,fontWeight:500}}>{a.name}</div>
                    <div style={{fontSize:9,color:T.text3,marginTop:1}}>{a.subject} · {fmtDate(a.date)}</div>
                  </div>
                  <span style={{fontSize:7,fontWeight:700,color:"#fff",background:badge.color,padding:"2px 5px",borderRadius:3,flexShrink:0}}>{badge.label}</span>
                </div>);
              })}
            </div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button style={{...btnP,flex:1}} onClick={saveGeminiPreview}>Save all to Assessment Hub</button>
              <button style={btn} onClick={function(){setGeminiPreview(null);}}>Discard</button>
            </div>
          </div>}

          {!geminiPreview&&<div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
            <button style={btn} onClick={function(){setShowSyllabusImport(false);setSyllabusText("");setGeminiPreview(null);}}>Close</button>
          </div>}
        </div>
      </div>}

      {page==="Boardroom"&&(function(){
        var b=data.boardroom||{};
        var northStar=b.northStar||"";
        var goals=(b.goals||[]).filter(function(g){return g.status==="active";});
        var achieved=(b.goals||[]).filter(function(g){return g.status==="achieved";});
        var keyMoments=(b.keyMoments||[]).slice().reverse();
        function modeBadgeStyle(mode){
          if(mode==="evening") return{background:"rgba(127,119,221,0.2)",color:"#b3acff"};
          if(mode==="onboarding") return{background:"rgba(29,158,117,0.2)",color:"#6ed8b8"};
          return{background:"rgba(186,117,23,0.2)",color:"#e8b970"};
        }
        function modeLabel(mode){return mode==="drift"?"Check-in":mode==="onboarding"?"Onboarding":mode==="evening"?"Evening":"Session";}
        function modeIcon(mode){var nm=mode==="evening"?"moon":mode==="onboarding"?"flag":"clock";return <span style={{display:"flex",color:"#8fb0ff"}}><UIcon name={nm} size={14}/></span>;}
        return(
          <div style={{maxWidth:mob?undefined:860,padding:mob?"12px 12px 120px":"20px 20px 40px"}}>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,gap:12}}>
              <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.02em",color:"#eef3fb"}}>Boardroom</div>
              <button onClick={brRedoConsultation} style={{...btnGlassP,padding:"7px 16px",flexShrink:0}}>New consultation</button>
            </div>

            {northStar&&<div className="card-rim" style={{...card({marginBottom:20}),padding:"18px 22px",borderLeft:"3px solid #5b8cff"}}>
              <div style={{...eyebrow,marginBottom:8}}>North Star</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.85)",lineHeight:1.65,fontStyle:"italic"}}>{northStar}</div>
            </div>}

            <button onClick={brOpen} style={{...btnGlassP,width:"100%",padding:"13px 0",fontSize:14,fontWeight:700,borderRadius:14,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <NavGlyph name="Boardroom" size={15}/>Start Session
            </button>

            {brGoalProposals.length>0&&<div className="card-rim" style={{background:cardBg,backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)",border:"1px solid rgba(91,140,255,0.28)",borderRadius:14,padding:"14px 18px",marginBottom:20,boxShadow:cardShadow}}>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(91,140,255,0.8)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>Goals surfaced from your last session</div>
              {brGoalProposals.map(function(p,i){return(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<brGoalProposals.length-1?"0.5px solid rgba(255,255,255,0.06)":"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,...getTagStyle(p.area)}}>{p.area}</span>
                    <span style={{fontSize:13,color:"rgba(255,255,255,0.85)"}}>{p.title}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={function(){brAcceptGoal(p);}} style={{...btnGlassP,fontSize:11,padding:"4px 12px"}}>Add</button>
                    <button onClick={function(){brSkipGoal(p);}} style={{...btnGlass,fontSize:11,padding:"4px 12px"}}>Skip</button>
                  </div>
                </div>
              );})}
            </div>}

            <div style={{marginBottom:24}}>
              <div style={{...sectLabel,marginBottom:12}}>Active Goals</div>
              {goals.length===0&&brGoalProposals.length===0&&<div style={{fontSize:13,color:"rgba(255,255,255,0.3)",padding:"20px 0"}}>Open a session to surface your first goal.</div>}
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
                {goals.map(function(g){return(
                  <div key={g.id} className="card-rim" style={{...glassMini,padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,...getTagStyle(g.area)}}>{g.area}</span>
                      <button onClick={function(){brMarkGoalAchieved(g.id);}} style={{...btnGlass,fontSize:10,padding:"3px 9px"}}>Done ✓</button>
                    </div>
                    <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)",lineHeight:1.4}}>{g.title}</div>
                  </div>
                );})}
              </div>
            </div>

            {achieved.length>0&&<div style={{marginBottom:24}}>
              <details>
                <summary style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",marginBottom:8}}>Achieved ({achieved.length})</summary>
                <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(180px,1fr))",gap:8,marginTop:8}}>
                  {achieved.map(function(g){return(
                    <div key={g.id} style={{background:"rgba(10,12,32,0.4)",border:"0.5px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px",opacity:0.6}}>
                      <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,...getTagStyle(g.area)}}>{g.area}</span>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:6,textDecoration:"line-through"}}>{g.title}</div>
                    </div>
                  );})}
                </div>
              </details>
            </div>}

            <div>
              <div style={{...sectLabel,marginBottom:16}}>Session Log</div>
              {keyMoments.length===0&&<div style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>No sessions recorded yet.</div>}
              <div className="br-tl-wrap">
                {keyMoments.filter(function(m){return m.mode!=="amalgamated";}).map(function(m,i){return(
                  <div key={i} className="br-tl-item">
                    <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,background:"rgba(10,12,32,0.9)",border:"2px solid rgba(91,140,255,0.35)",zIndex:1,position:"relative"}}>{modeIcon(m.mode)}</div>
                    <div className="card-rim" style={{...glassMini,flex:1,padding:"12px 14px",marginBottom:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <span style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)"}}>{m.date}</span>
                        <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,...modeBadgeStyle(m.mode)}}>{modeLabel(m.mode)}</span>
                      </div>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.55,borderLeft:"2px solid rgba(91,140,255,0.3)",paddingLeft:10,marginBottom:m.commitments&&m.commitments.length?10:0}}>
                        <div style={{fontSize:10,fontWeight:500,color:"rgba(91,140,255,0.5)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>Alex & Chris concluded</div>
                        {m.summary}
                      </div>
                      {m.commitments&&m.commitments.length>0&&<div>
                        {m.commitments.map(function(c,ci){
                          var isDone=typeof c==="object"?c.done:false;
                          var text=typeof c==="string"?c:c.text;
                          return(
                            <label key={ci} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"4px 0",cursor:typeof c==="object"?"pointer":"default"}}>
                              <input type="checkbox" checked={isDone} readOnly={typeof c==="string"} onChange={typeof c==="object"?function(){brToggleCommitment((b.keyMoments||[]).length-1-i,ci);}:undefined} style={{marginTop:2,flexShrink:0,accentColor:"#5b8cff"}}/>
                              <span style={{fontSize:12,color:isDone?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.75)",textDecoration:isDone?"line-through":"none"}}>{text}</span>
                            </label>
                          );
                        })}
                      </div>}
                      {m.transcript&&m.transcript.length>0&&<details style={{marginTop:10}}>
                        <summary style={{fontSize:11,color:"rgba(91,140,255,0.6)",cursor:"pointer",userSelect:"none"}}>View full conversation ({m.transcript.length})</summary>
                        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6,maxHeight:320,overflowY:"auto",paddingRight:4}}>
                          {m.transcript.map(function(t,ti){
                            var isUser=t.role==="user";
                            var who=isUser?"You":(t.persona||"Coach");
                            return(
                              <div key={ti} style={{fontSize:11,lineHeight:1.55}}>
                                <span style={{fontWeight:700,color:isUser?"#5b8cff":(t.persona==="Alex"?"#5b9bff":"#9a8cff")}}>{who}: </span>
                                <span style={{color:"rgba(255,255,255,0.6)",whiteSpace:"pre-wrap"}}>{t.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </details>}
                    </div>
                  </div>
                );})}
              </div>
            </div>

          </div>
        );
      })()}

      {/* ── Quick Capture floating button ── */}
      <button onClick={function(){trk("capture.quick_open");setShowCapture(true);setCaptureResult(null);}} style={{...whitePill,position:"fixed",bottom:mob?70:80,right:20,zIndex:150,padding:"7px 14px",fontSize:12,background:"linear-gradient(135deg,rgba(91,140,255,0.92),rgba(50,85,204,0.94))",border:"1px solid rgba(91,140,255,0.55)",color:"#fff",boxShadow:"0 4px 18px rgba(50,90,200,0.45),inset 0 1px 0 rgba(255,255,255,0.20)"}}>
        <span style={{display:"flex"}}><UIcon name="bolt" size={14}/></span>Capture
      </button>

      {/* ── Quick Capture panel ── */}
      {showCapture&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.70)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:200,padding:mob?"0":"16px"}} onClick={function(){if(!captureLoading){setShowCapture(false);setCaptureResult(null);}}}>
        <div className="card-rim" style={{background:"rgba(12,16,38,0.82)",backdropFilter:"blur(28px) saturate(1.5)",WebkitBackdropFilter:"blur(28px) saturate(1.5)",borderRadius:mob?"20px 20px 0 0":"20px",padding:mob?"24px 20px 32px":"28px 28px 24px",width:mob?"100%":"480px",maxWidth:"100%",border:"1px solid rgba(91,140,255,0.18)",boxShadow:"inset 0 0 0 0.5px rgba(120,160,255,0.08),0 24px 60px rgba(0,0,0,0.65),0 0 80px rgba(40,70,200,0.14)",animation:"panel-in 280ms cubic-bezier(0.23,1,0.32,1) both"}} onClick={function(e){e.stopPropagation();}}>
          {mob&&<div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.18)",margin:"0 auto 20px"}}/>}
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:20}}>
            <div style={{width:28,height:28,borderRadius:8,background:"rgba(91,140,255,0.10)",border:"0.5px solid rgba(91,140,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,flexShrink:0}}><UIcon name="bolt" size={14}/></div>
            <div style={{fontSize:14,fontWeight:700,color:T.text,letterSpacing:"-0.01em"}}>Quick Capture</div>
            <div style={{fontSize:10,color:T.text3,marginLeft:"auto",letterSpacing:"0.01em"}}>Ctrl+Enter · Esc</div>
            <button style={{background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:18,lineHeight:1,padding:"2px 6px",marginLeft:4}} onClick={function(){if(!captureLoading){setShowCapture(false);setCaptureResult(null);}}} title="Close">×</button>
          </div>

          {!captureResult&&<div>
            <textarea
              autoFocus
              rows={4}
              value={captureText}
              onChange={function(ev){setCaptureText(ev.target.value);}}
              onKeyDown={function(ev){if(ev.key==="Escape"){setShowCapture(false);setCaptureResult(null);}if(ev.key==="Enter"&&ev.ctrlKey){ev.preventDefault();submitCapture();}}}
              onFocus={function(ev){ev.target.style.borderColor="rgba(91,140,255,0.50)";ev.target.style.boxShadow="0 0 0 3px rgba(91,140,255,0.10)";}}
              onBlur={function(ev){ev.target.style.borderColor="rgba(91,140,255,0.18)";ev.target.style.boxShadow="none";}}
              placeholder="What's on your mind, or something you just learned..."
              style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(91,140,255,0.18)",borderRadius:12,padding:"13px 15px",color:T.text,fontSize:13,lineHeight:1.7,resize:"none",fontFamily:"inherit",outline:"none",marginBottom:14,transition:"border-color 0.2s,box-shadow 0.2s",colorScheme:"dark"}}
            />
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",alignItems:"center"}}>
              <button style={{...btn,padding:"8px 16px",borderRadius:10}} onClick={function(){setShowCapture(false);setCaptureResult(null);}}>Cancel</button>
              <button onClick={submitCapture} disabled={captureLoading||!captureText.trim()} style={{...btnP,padding:"9px 22px",borderRadius:10,display:"flex",alignItems:"center",gap:6,opacity:captureLoading||!captureText.trim()?0.45:1,cursor:captureLoading||!captureText.trim()?"default":"pointer"}}>
                {captureLoading&&<span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",animation:"spin 0.8s linear infinite"}}/>}
                {captureLoading?"Thinking...":"Save"}
              </button>
            </div>
          </div>}

          {captureResult&&<div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"10px 14px",borderRadius:12,background:"rgba(105,240,174,0.06)",border:"0.5px solid rgba(105,240,174,0.22)"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#69f0ae",boxShadow:"0 0 7px rgba(105,240,174,0.8)",flexShrink:0}}/>
              <div style={{fontSize:12,fontWeight:600,color:T.success}}>Captured & saved</div>
              <div style={{marginLeft:"auto",padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:600,letterSpacing:"0.04em",background:captureResult.type==="learning"?T.accentBg:captureResult.type==="reflection"?"rgba(255,209,102,0.12)":"rgba(255,255,255,0.07)",color:captureResult.type==="learning"?T.accent:captureResult.type==="reflection"?T.warn:T.text3,border:"0.5px solid "+(captureResult.type==="learning"?"rgba(91,140,255,0.28)":captureResult.type==="reflection"?"rgba(255,209,102,0.25)":"rgba(255,255,255,0.10)")}}>{captureResult.type}</div>
            </div>
            {captureResult.title&&<div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:8,letterSpacing:"-0.01em",lineHeight:1.3}}>{captureResult.title}</div>}
            <div style={{fontSize:12,color:T.text2,lineHeight:1.75,marginBottom:captureResult.formula?12:0}}>{(captureResult.content||"").slice(0,200)}{(captureResult.content||"").length>200?"...":""}</div>
            {captureResult.formula&&<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(91,140,255,0.06)",border:"0.5px solid rgba(91,140,255,0.18)",fontSize:11,color:T.accent,fontFamily:"monospace",marginBottom:10,lineHeight:1.6}}>{captureResult.formula}</div>}
            {captureResult.tags&&captureResult.tags.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:10}}>{captureResult.tags.map(function(tag){return<span key={tag} style={{fontSize:10,padding:"3px 9px",borderRadius:99,background:"rgba(91,140,255,0.08)",border:"0.5px solid rgba(91,140,255,0.18)",color:T.text3}}>{"#"+tag}</span>;})}</div>}
            <button style={{...btnP,marginTop:16,padding:"9px 22px",borderRadius:10}} onClick={function(){setShowCapture(false);setCaptureResult(null);}}>Done</button>
          </div>}
        </div>
      </div>}

      {/* ── Boardroom chat panel ── */}
      {showBoardroom&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.92)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",display:"flex",alignItems:mob?"stretch":"center",justifyContent:"center",zIndex:200,padding:mob?"0":"16px"}} onClick={function(){setShowBoardroom(false);}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:"rgba(10,12,32,0.98)",border:"1px solid rgba(91,140,255,0.4)",borderRadius:mob?0:16,width:mob?"100%":680,maxWidth:"100%",height:mob?"100%":"80vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",gap:8}}><NavGlyph name="Boardroom" size={17}/>Boardroom</span>
              {brIntentMode&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:brIntentMode==="howto"?"rgba(105,240,174,0.15)":"rgba(91,140,255,0.15)",color:brIntentMode==="howto"?"#69f0ae":"#8fb4ff",border:"0.5px solid "+(brIntentMode==="howto"?"rgba(105,240,174,0.4)":"rgba(91,140,255,0.4)")}}>{brIntentMode==="howto"?"How-to":"Direction"}</span>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={function(){setBrShowProjCtx(function(v){return !v;});}} style={{background:brShowProjCtx?"rgba(99,102,241,0.18)":"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"5px 10px",color:T.text3,fontSize:11,fontWeight:600,cursor:"pointer"}}>{(data.boardroom&&data.boardroom.projectContext)?"Context ✓":"Project context"}</button>
              {(data.boardroom&&data.boardroom.onboarded)
                ? <button onClick={brEndSession} style={{...btn,borderRadius:8,padding:"5px 10px",fontSize:11}}>End session</button>
                : <button onClick={brFinishOnboarding} style={{background:"rgba(105,240,174,0.12)",border:"0.5px solid rgba(105,240,174,0.4)",borderRadius:8,padding:"5px 10px",color:"#69f0ae",fontSize:11,fontWeight:600,cursor:"pointer"}}>Finish setup</button>}
              <button onClick={function(){setShowBoardroom(false);}} style={{background:"none",border:"none",color:T.text3,fontSize:20,cursor:"pointer"}}>×</button>
            </div>
          </div>
          {brShowProjCtx&&<div style={{padding:"10px 18px",borderBottom:"1px solid rgba(255,255,255,0.08)",background:"rgba(99,102,241,0.05)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"rgba(199,125,255,0.8)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Project context</div>
            <div style={{fontSize:11,color:T.text3,marginBottom:6}}>Paste what you're working on (e.g. a build handoff). The coaches use this for situation-specific step-by-step help.</div>
            <textarea value={(data.boardroom&&data.boardroom.projectContext)||""} onChange={function(e){var v=e.target.value;setData(function(p){return{...p,boardroom:{...(p.boardroom||{}),projectContext:v}};});}} placeholder="e.g. Building a LilyGO T-Display-S3 AMOLED keychain. Step 3 = solder battery wires to BAT pads. Battery is a 400mAh LiPo with a JST-PH plug…" style={{width:"100%",minHeight:80,background:"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 10px",color:"#fff",fontSize:12,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
          </div>}
          <div style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
            {brMessages.length===0&&<div style={{color:T.text3,fontSize:13,textAlign:"center",marginTop:24}}>Alex and Chris are here. Tell them how your day's going.</div>}
            {brMessages.map(function(m,i){
              if(m.role==="user")return <div key={i} style={{alignSelf:"flex-end",maxWidth:"80%",background:"linear-gradient(135deg,#5b8cff,#3a5fcc)",color:"#fff",padding:"9px 13px",borderRadius:14,fontSize:13}}>{m.text}</div>;
              var isAlex=m.persona==="Alex";
              return <div key={i} style={{alignSelf:"flex-start",maxWidth:"85%"}}><div style={{fontSize:11,fontWeight:700,color:isAlex?"#5b9bff":"#9a8cff",marginBottom:3,display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:isAlex?"#5b9bff":"#9a8cff",boxShadow:"0 0 8px "+(isAlex?"#5b9bff":"#9a8cff")}}/>{isAlex?"Alex":"Chris"}</div><div style={{background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.1)",color:"#e8e9f3",padding:"9px 13px",borderRadius:14,fontSize:13,whiteSpace:"pre-wrap"}}>{m.text}</div></div>;
            })}
            {brPendingIntent&&<div style={{alignSelf:"flex-start",maxWidth:"90%"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#c77dff",marginBottom:3}}>🔵🟣 Boardroom</div>
              <div style={{background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.1)",color:"#e8e9f3",padding:"10px 13px",borderRadius:14,fontSize:13}}>
                Quick check — want us to talk this through, or walk you through the actual steps?
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button onClick={function(){brConfirmIntent("direction");}} style={{flex:1,background:"rgba(91,140,255,0.15)",border:"0.5px solid rgba(91,140,255,0.4)",borderRadius:8,padding:"7px 10px",color:"#8fb4ff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Talk it through</button>
                  <button onClick={function(){brConfirmIntent("howto");}} style={{flex:1,background:"rgba(105,240,174,0.12)",border:"0.5px solid rgba(105,240,174,0.4)",borderRadius:8,padding:"7px 10px",color:"#69f0ae",fontSize:12,fontWeight:600,cursor:"pointer"}}>Show me the steps</button>
                </div>
              </div>
            </div>}
            {brLoading&&<div style={{color:T.text3,fontSize:12,fontStyle:"italic"}}>{brClosing?"Alex & Chris are wrapping up the session…":(brIntentMode==="howto"?"Alex & Chris are working out the steps…":"Alex & Chris are talking it through…")}</div>}
          </div>
          <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:8}}>
            <input value={brInput} onChange={function(e){setBrInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")brSend();}} placeholder="Talk to the Boardroom…" style={{flex:1,background:"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none"}}/>
            <button onClick={brSend} disabled={brLoading} style={{...btnGlassP,borderRadius:10,padding:"0 18px",fontSize:13,cursor:brLoading?"default":"pointer",opacity:brLoading?0.6:1}}>Send</button>
          </div>
        </div>
      </div>}

      {/* ── Edit Capture modal ── */}
      {editCaptureData&&<div style={{position:"fixed",inset:0,background:"rgba(5,7,26,0.85)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:220,padding:mob?"0":"16px"}} onClick={function(){setEditCaptureData(null);}}>
        <div style={{background:"rgba(14,16,40,0.98)",borderRadius:mob?"20px 20px 0 0":"16px",padding:mob?"24px 20px 36px":"24px",width:mob?"100%":"520px",maxWidth:"100%",border:"0.5px solid rgba(91,140,255,0.3)",boxShadow:"0 8px 40px rgba(0,0,0,0.7)",maxHeight:mob?"90vh":"80vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
          {mob&&<div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)",margin:"0 auto 20px"}}/>}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
            <span style={{display:"flex",color:T.accent}}><UIcon name="pencil" size={16}/></span>
            <div style={{fontSize:15,fontWeight:700,color:T.text}}>Edit capture</div>
            <div style={{marginLeft:"auto",padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700,background:editCaptureData.type==="learning"?T.accentBg:editCaptureData.type==="reflection"?"rgba(255,209,102,0.15)":T.bg3,color:editCaptureData.type==="learning"?T.accent:editCaptureData.type==="reflection"?T.warn:T.text2}}>{editCaptureData.type||"thought"}</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Title</div>
            <input value={editCaptureData.title||""} onChange={function(ev){setEditCaptureData(function(p){return{...p,title:ev.target.value};});}} style={{...inp,padding:"9px 12px",fontSize:13,width:"100%"}} placeholder="Title..."/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Content</div>
            <textarea rows={5} value={editCaptureData.content||""} onChange={function(ev){setEditCaptureData(function(p){return{...p,content:ev.target.value};});}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(91,140,255,0.2)",borderRadius:8,padding:"9px 12px",color:T.text,fontSize:13,lineHeight:1.7,resize:"vertical",fontFamily:"inherit",outline:"none"}} placeholder="Content..."/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Formula <span style={{color:T.text3,fontWeight:400}}>(optional)</span></div>
            <input value={editCaptureData.formula||""} onChange={function(ev){setEditCaptureData(function(p){return{...p,formula:ev.target.value};});}} style={{...inp,padding:"9px 12px",fontSize:12,fontFamily:"monospace",width:"100%"}} placeholder="e.g. Revenue – Expenses = Profit"/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Example <span style={{color:T.text3,fontWeight:400}}>(optional)</span></div>
            <input value={editCaptureData.example||""} onChange={function(ev){setEditCaptureData(function(p){return{...p,example:ev.target.value};});}} style={{...inp,padding:"9px 12px",fontSize:13,width:"100%"}} placeholder="A real-world example..."/>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:T.text2,marginBottom:5}}>Tags <span style={{color:T.text3,fontWeight:400}}>(comma separated)</span></div>
            <input value={editCaptureTagStr} onChange={function(ev){setEditCaptureTagStr(ev.target.value);}} style={{...inp,padding:"9px 12px",fontSize:13,width:"100%"}} placeholder="e.g. accounting, tax, gst"/>
          </div>
          <div style={{display:"flex",gap:8,flexDirection:mob?"column":"row",justifyContent:"flex-end"}}>
            {mob
              ?<React.Fragment>
                <button style={{...btnP,padding:"13px",fontSize:14,width:"100%",borderRadius:10}} onClick={saveEditCapture}>Save changes</button>
                <button style={{...btn,padding:"11px",fontSize:13,width:"100%",borderRadius:10,textAlign:"center"}} onClick={function(){setEditCaptureData(null);}}>Cancel</button>
              </React.Fragment>
              :<React.Fragment>
                <button style={btnP} onClick={saveEditCapture}>Save changes</button>
                <button style={btn} onClick={function(){setEditCaptureData(null);}}>Cancel</button>
              </React.Fragment>
            }
          </div>
        </div>
      </div>}

      {mob&&<nav style={{display:"flex",position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(5,7,26,0.97)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"0.5px solid rgba(91,140,255,0.18)",justifyContent:"space-around",alignItems:"stretch",boxShadow:"0 -4px 24px rgba(0,0,0,0.5)"}}>
        {NAV_PAGES.map(function(name){const active=page===name;return(
          <button key={name} onClick={function(){setPage(name);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"8px 4px",color:active?T.accent:T.text3,flex:1,minHeight:54,position:"relative"}}>
            {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2,borderRadius:1,background:T.accent}}/>}
            <span style={{display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}><NavGlyph name={name} size={18}/></span>
            <span style={{fontSize:9,fontWeight:active?700:400,letterSpacing:0.2}}>{name}</span>
          </button>
        );})}
      </nav>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));
