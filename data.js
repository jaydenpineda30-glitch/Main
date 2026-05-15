/**
 * data.js
 * Static data constants for the dashboard.
 * Loaded before the Babel bundle — all vars are global.
 * Update SYLLABUS_ASSESSMENTS each semester (or use the Gemini importer in the Uni section).
 */

var DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

var TASK_CATS = ["Finances","Errands","Admin","Health","Social","Study","Meal Prep","Car & Transport","Home","Family","Work","Self-care","Shopping","Other"];

var SUBJECTS = {
  "WIA&B":       "WORK IN ACCOUNTING & BOOKKEEPING INDUSTRY",
  "POB":         "PREPARE OPERATIONAL BUDGETS",
  "BAS/IAS":     "BAS/IAS",
  "FinStmts NRE":"PREPARE FINANCIAL STATEMENTS FOR NON-REPORTING ENTITIES",
  "Payroll":     "ESTABLISH & MAINTAIN PAYROLL SYSTEMS",
  "PFR":         "PREPARE FINANCIAL REPORTS",
  "Law":         "LAW"
};

var SC = {
  "WIA&B":       "#BA7517",
  "POB":         "#D85A30",
  "BAS/IAS":     "#7F77DD",
  "FinStmts NRE":"#D4537E",
  "Payroll":     "#378ADD",
  "PFR":         "#1D9E75",
  "Law":         "#639922"
};

// ── Semester assessments ──────────────────────────────────────────────────────
// Semester start: Monday 20 April 2026.
// Update each semester, or use the Gemini importer (Uni → Import Syllabus).
var SYLLABUS_ASSESSMENTS = [
  // WIA&B — Monday class
  {id:"wiab-at1",  subject:"WIA&B",        name:"Assessment 1",                            type:"SUBMISSION", date:"2026-05-18", done:false},
  {id:"wiab-at2",  subject:"WIA&B",        name:"Assessment 2",                            type:"SUBMISSION", date:"2026-06-08", done:false},
  // POB — Monday class
  {id:"pob-at1",   subject:"POB",          name:"Assessment 1",                            type:"SUBMISSION", date:"2026-05-11", done:false},
  {id:"pob-at2a",  subject:"POB",          name:"Assessment 2 — Part A",                  type:"SUBMISSION", date:"2026-05-18", done:false},
  {id:"pob-at2b",  subject:"POB",          name:"Assessment 2 — Part B",                  type:"SUBMISSION", date:"2026-06-01", done:false},
  // BAS/IAS — Tuesday class
  {id:"bas-at1",   subject:"BAS/IAS",      name:"AT1 — IAS & BAS Preparation (Supervised)",type:"IN-CLASS",  date:"2026-05-26", done:false},
  {id:"bas-at2",   subject:"BAS/IAS",      name:"AT2 — Xero Case Study",                  type:"SUBMISSION", date:"2026-06-02", done:false},
  // FinStmts NRE — Tuesday class
  {id:"fin-at1",   subject:"FinStmts NRE", name:"Assignment 1",                            type:"SUBMISSION", date:"2026-05-19", done:false},
  {id:"fin-at2",   subject:"FinStmts NRE", name:"Assessment 2",                            type:"SUBMISSION", date:"2026-06-02", done:false},
  // Law — Wednesday class
  {id:"law-at1",   subject:"Law",          name:"Assessment 1",                            type:"SUBMISSION", date:"2026-05-20", done:false},
  {id:"law-at2a",  subject:"Law",          name:"Assessment 2 — Part A",                  type:"SUBMISSION", date:"2026-06-03", done:false},
  {id:"law-at2b",  subject:"Law",          name:"Assessment 2 — Part B (Compliance)",     type:"SUBMISSION", date:"2026-06-10", done:false},
  // Payroll — Thursday class
  {id:"pay-at1",   subject:"Payroll",      name:"AT1 — In-Class Manual Payroll (Supervised)",type:"IN-CLASS", date:"2026-05-14", done:false},
  {id:"pay-at2",   subject:"Payroll",      name:"AT2 — Xero Case Study",                  type:"SUBMISSION", date:"2026-06-04", done:false},
  {id:"pay-at1-resit",subject:"Payroll",   name:"AT1 Resit",                               type:"IN-CLASS",  date:"2026-06-11", done:false},
  // PFR — Thursday class
  {id:"pfr-at1",   subject:"PFR",          name:"Assessment 1",                            type:"SUBMISSION", date:"2026-05-14", done:false},
  {id:"pfr-at2",   subject:"PFR",          name:"Assessment 2",                            type:"SUBMISSION", date:"2026-06-04", done:false},
];

// ── Reflection questions ──────────────────────────────────────────────────────
var REFL_QS = [
  "Which subject or concept felt most challenging this week? What specifically made it difficult?",
  "What work task or project did you struggle with most? What would help you succeed with it?",
  "How consistent were you with exercise and nutrition this week? What got in the way?",
  "How well did you balance study/work with personal relationships? What felt neglected?",
  "What's one area you want to improve next week? What's one win from this week worth celebrating?"
];
var REFL_LABELS = ["Academic","Work","Health","Balance","Growth & Wins"];

// ── Weather code lookup (Open-Meteo WMO codes) ────────────────────────────────
var WX_MAP = {
  0:["☀️","Sunny"],1:["🌤️","Mainly clear"],2:["⛅","Partly cloudy"],3:["☁️","Overcast"],
  45:["🌫️","Foggy"],48:["🌫️","Icy fog"],
  51:["🌦️","Light drizzle"],53:["🌦️","Drizzle"],55:["🌧️","Heavy drizzle"],
  61:["🌧️","Light rain"],63:["🌧️","Rain"],65:["🌧️","Heavy rain"],
  71:["🌨️","Light snow"],73:["🌨️","Snow"],75:["❄️","Heavy snow"],
  80:["🌦️","Showers"],81:["🌧️","Heavy showers"],82:["⛈️","Violent showers"],
  95:["⛈️","Thunderstorm"],96:["⛈️","Thunderstorm"],99:["⛈️","Thunderstorm"]
};
var WX_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
