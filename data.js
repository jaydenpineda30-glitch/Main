/**
 * data.js
 * Static data constants for the dashboard.
 * Loaded before the Babel bundle — all vars are global.
 * Update SYLLABUS_ASSESSMENTS each semester (or use the Gemini importer in the Uni section).
 */

var DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

var TASK_CATS = ["Finances","Errands","Admin","Health","Social","Study","Meal Prep","Car & Transport","Home","Family","Work","Self-care","Shopping","Other"];

// One fixed colour per task category, so a category always looks the same
// wherever it appears. Validated with the dataviz skill's validate_palette.js
// against the dark glass background (#0a0a0a): all 14 pass lightness band,
// chroma floor, and contrast; adjacent pairs (this TASK_CATS order) pass CVD
// separation with one WARN in the legal 6-8 floor band (Health vs Admin,
// dE 7.1) — legal because every swatch always renders with its category name
// beside it, so hue is never the only signal. Study/Admin/Work/Health (the
// four Jayden uses most) were additionally validated as a standalone all-pairs
// set — ALL CHECKS PASS, worst CVD dE 7.1 (WARN band, same mitigation), worst
// normal-vision dE 18.2 (well clear of the 15 floor) — so those four stay
// unmistakable from each other even at a 3px bar or 7px dot. Fourteen
// categories exceeds what any hue-only palette can make pairwise-distinct
// (the skill's own 8-hue reference palette only clears all-pairs CVD for 3
// slots); this is accepted per the task brief. Any category missing here
// falls back to TASK_CAT_FALLBACK. Keys must exactly match TASK_CATS above.
var TASK_CAT_COLORS = {
  "Finances":        "#c45034",
  "Errands":         "#00949a",
  "Admin":           "#9e7e00",
  "Health":          "#dc3864",
  "Social":          "#0090af",
  "Study":           "#6e69f3",
  "Meal Prep":       "#7d8200",
  "Car & Transport": "#008abe",
  "Home":            "#c54e44",
  "Family":          "#3f77d5",
  "Work":            "#00a29b",
  "Self-care":       "#8d5fc5",
  "Shopping":        "#bd5b00",
  "Other":           "#218cb5"
};
var TASK_CAT_FALLBACK = "#7A8699";

// Uni subjects are fully dynamic now (stored in data.uni.subjects, not here) — add
// them in the Uni tab's "+ Subject" button, or paste a syllabus into the Gemini
// importer, which creates subjects automatically from whatever the syllabus contains.
// SUBJECT_PALETTE is just the rotating default color new subjects get assigned.
var SUBJECT_PALETTE = ["#BA7517","#D85A30","#7F77DD","#D4537E","#378ADD","#1D9E75","#639922","#C77DFF","#4DD0E1","#FF6B6B"];

// ── Semester assessments ──────────────────────────────────────────────────────
// Cleared — old TAFE semester 1 2026 assessments are complete.
// Re-populate via Gemini importer (Uni → Import Syllabus) when a new course starts.
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
