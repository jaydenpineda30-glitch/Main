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
// Cleared — old TAFE semester 1 2026 assessments are complete.
// Re-populate via Gemini importer (Uni → Import Syllabus) when diploma starts.
// Also update SUBJECTS and SC above to match diploma subject codes.
var SYLLABUS_ASSESSMENTS = [];

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
  0:"Sunny",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",
  45:"Foggy",48:"Icy fog",
  51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",
  61:"Light rain",63:"Rain",65:"Heavy rain",
  71:"Light snow",73:"Snow",75:"Heavy snow",
  80:"Showers",81:"Heavy showers",82:"Violent showers",
  95:"Thunderstorm",96:"Thunderstorm",99:"Thunderstorm"
};
var WX_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
