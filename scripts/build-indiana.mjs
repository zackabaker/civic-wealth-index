// Generate statewide Indiana county data files from County Health Rankings 2025
// bulk data. Real CHR values where available; remaining civic metrics modeled from
// urbanicity (% rural, population) — deliberately NOT from income, so civic wealth
// stays independent of private wealth. These counties are the "estimate" tier;
// the individually-researched pilot counties are preserved untouched.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CSV = process.argv[2]; // path to CHR csv
const OUT = path.join(ROOT, "data", "places");

// Preserve the individually-researched pilot counties.
const SKIP = new Set(["18057", "18089", "18003"]);

// 0-based column indices (verified against the 2025 analytic file header).
const COL = {
  stateFips: 0, fips5: 2, name: 4,
  exerciseAccess: 90, childPoverty: 222, waterViolation: 187, broadband: 192,
  someCollege: 202, lifeExp: 275, income: 612, mvDeaths: 670, firearm: 693,
  rural: 786, population: 791,
};

const CHR = {
  source: "County Health Rankings 2025",
  url: "https://www.countyhealthrankings.org/health-data/indiana/data-and-resources",
};
const MODEL = {
  source: "CWI model estimate (v0.1)",
  url: "https://civicwealthindex.org/methodology",
};

const METROS = {
  "18097": "Indianapolis metro", "18011": "Indianapolis metro", "18059": "Indianapolis metro",
  "18081": "Indianapolis metro", "18063": "Indianapolis metro", "18057": "Indianapolis metro",
  "18109": "Indianapolis metro", "18145": "Indianapolis metro", "18095": "Indianapolis metro",
  "18141": "South Bend metro", "18039": "Elkhart–Goshen", "18163": "Evansville metro",
  "18157": "Lafayette metro", "18105": "Bloomington metro", "18167": "Terre Haute metro",
  "18035": "Muncie metro", "18089": "Chicago metro (NW Indiana)", "18127": "Chicago metro (NW Indiana)",
  "18003": "Fort Wayne metro", "18179": "Fort Wayne metro",
};

// ---- CSV parsing (quote-aware) ----
function parseLine(line) {
  const out = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = false;
      else cur += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ",") { out.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

// ---- deterministic per-county jitter (stable across runs) ----
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000; // [0,1)
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-in";
}

const num = (v) => {
  if (v === undefined || v === null || v === "" || v === "NA") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function M(key, label, value, unit, direction, src, quality, year, note) {
  const m = { key, label, value: value === null ? null : Math.round(value * 1000) / 1000, unit, direction, source: src.source, sourceUrl: src.url, year, quality };
  if (note) m.note = note;
  return m;
}

const rows = fs.readFileSync(CSV, "utf8").split(/\r?\n/).filter(Boolean);
const header = parseLine(rows[0]);
if (header[COL.income] !== "Median Household Income raw value") {
  console.error("❌ Column layout mismatch. Got:", header[COL.income]);
  process.exit(1);
}

let written = 0, skipped = 0;
for (let i = 1; i < rows.length; i++) {
  const r = parseLine(rows[i]);
  if (r[COL.stateFips] !== "18") continue;
  const fips = r[COL.fips5];
  if (!fips || fips === "18000" || fips.length !== 5) continue; // skip state row
  if (SKIP.has(fips)) { skipped++; continue; }

  const name = r[COL.name].replace(/"/g, "").trim();
  const slug = slugify(name);
  const pop = num(r[COL.population]) ?? 0;
  const rural = clamp(num(r[COL.rural]) ?? 0.5, 0, 1);
  const urb = 1 - rural;
  const income = num(r[COL.income]) ?? 55000;
  const lifeExp = num(r[COL.lifeExp]);
  const mvDeaths = num(r[COL.mvDeaths]);
  const broadband = num(r[COL.broadband]);
  const exercise = num(r[COL.exerciseAccess]);
  const water = num(r[COL.waterViolation]); // 0/1 flag
  const poverty = num(r[COL.childPoverty]);
  const someCollege = num(r[COL.someCollege]);
  const firearm = num(r[COL.firearm]);
  const j = (k) => hash(fips + k) - 0.5; // [-0.5,0.5]

  // Modeled home value: correlates with income + urbanicity (private wealth input).
  const homeValue = clamp(income * (2.4 + urb * 1.1) + j("hv") * 40000, 85000, 780000);

  const movement = [
    M("bridgePoorPct", "Bridges in poor condition", clamp(6.5 + rural * 4 - urb * 1.5 + j("bp") * 6, 1, 20), "%", "lowerBetter", MODEL, "modeled", "v0.1"),
    M("pavementPoorPct", "Roads in poor ride quality", clamp(17 + rural * 9 + j("pp") * 14, 5, 45), "%", "lowerBetter", MODEL, "modeled", "v0.1"),
    M("roundaboutRatio", "Roundabouts vs. signals", clamp(0.02 + urb * 0.05 + Math.abs(j("rb")) * 0.04, 0.01, 0.28), "ratio", "higherBetter", MODEL, "modeled", "v0.1", "Carmel-style roundabout adoption is rare; most counties sit near the floor."),
    M("trafficDeathsPer100k", "Traffic deaths", mvDeaths, "per 100k", "lowerBetter", CHR, mvDeaths === null ? "missing" : "measured", 2025),
    M("sidewalkCoverage", "Sidewalk network coverage", clamp(0.12 + urb * 0.34 + j("sw") * 0.14, 0.05, 0.72), "km/km", "higherBetter", MODEL, "modeled", "v0.1"),
  ];

  const publicRealm = [
    M("parkAcresPer1k", "Park acres per 1,000", clamp(6 + rural * 12 + j("pa") * 9, 2, 30), "acres/1k", "higherBetter", MODEL, "modeled", "v0.1"),
    M("parkAccessPct", "Access to exercise / parks", exercise === null ? null : clamp(exercise * 100, 0, 100), "%", "higherBetter", CHR, exercise === null ? "missing" : "measured", 2025, "CHR 'access to exercise opportunities' — a parks/recreation access proxy."),
    M("playgroundScore", "Playground quality", clamp(55 + j("pg") * 28, 30, 82), "0-100", "higherBetter", MODEL, "modeled", "v0.1"),
    M("libraryVisitsPerCapita", "Library visits per capita", clamp(3.4 + urb * 1.4 + j("lv") * 2.4, 1, 7), "per capita", "higherBetter", MODEL, "modeled", "v0.1"),
    M("treeCanopyPct", "Tree canopy", clamp(21 + rural * 15 + j("tc") * 14, 8, 55), "%", "higherBetter", MODEL, "modeled", "v0.1"),
  ];

  const bachEst = someCollege === null ? clamp((income - 30000) / 1900 + j("ba") * 8, 8, 62) : clamp(someCollege * 100 * 0.55 + j("ba") * 8, 8, 65);
  const education = [
    M("learningRate", "Learning growth per grade", clamp(1.0 + j("lr") * 0.12, 0.85, 1.15), "grade/yr", "higherBetter", MODEL, "modeled", "v0.1"),
    M("gradeLevelsVsNational", "Grade levels vs. national", clamp((someCollege ?? 0.55) * 4 - 2.2 + j("gl") * 0.8, -1.5, 2.0), "grade levels", "higherBetter", MODEL, "modeled", "v0.1"),
    M("attainmentBachelorsPct", "Bachelor's degree or higher", bachEst, "%", "higherBetter", MODEL, "modeled", "v0.1", "Estimated from CHR post-secondary education share."),
  ];

  const healthSafety = [
    M("lifeExpectancy", "Life expectancy", lifeExp, "years", "higherBetter", CHR, lifeExp === null ? "missing" : "measured", 2025),
    M("childWellbeingIndex", "Child wellbeing", poverty === null ? null : clamp(100 - poverty * 100 * 1.6 + j("cw") * 6, 25, 92), "0-100", "higherBetter", CHR, poverty === null ? "missing" : "modeled", 2025, "Derived from CHR children-in-poverty rate."),
    M("violentCrimePer1k", "Violent crime", clamp((firearm ?? 12) * 0.22 + urb * 1.6 + Math.abs(j("vc")) * 2, 0.8, 9), "per 1k", "lowerBetter", MODEL, "modeled", "v0.1", "Modeled; CHR dropped county violent-crime rates from the analytic file."),
  ];

  const systems = [
    M("waterViolationPoints", "Drinking water violations", water === null ? null : clamp(water * 4 + Math.abs(j("wv")) * 2, 0, 10), "0-10", "lowerBetter", CHR, water === null ? "missing" : "measured", 2025, "CHR flags whether the county had a drinking-water violation."),
    M("broadbandCoveragePct", "Broadband access", broadband === null ? null : clamp(broadband * 100, 0, 100), "%", "higherBetter", CHR, broadband === null ? "missing" : "measured", 2025),
    M("broadbandGigabitPct", "Gigabit availability", broadband === null ? null : clamp((broadband * 100 - 22) * urb + 30 + j("gb") * 16, 20, 95), "%", "higherBetter", MODEL, "modeled", "v0.1"),
  ];

  const civicFabric = [
    M("historicRegisterPer10k", "Historic Register listings", clamp(1.1 + urb * 1.6 + Math.abs(j("hr")) * 2.2, 0.2, 6), "per 10k", "higherBetter", MODEL, "modeled", "v0.1"),
    M("culturalVenuesPer10k", "Cultural venues", clamp(0.9 + urb * 2.0 + (pop < 25000 ? 0.6 : 0) + j("cv") * 1.2, 0.3, 6), "per 10k", "higherBetter", MODEL, "modeled", "v0.1"),
    M("townCenterScore", "Town-center quality", clamp(44 + urb * 16 + j("tc2") * 22, 20, 82), "0-100", "higherBetter", MODEL, "modeled", "v0.1"),
  ];

  const stewardship = [
    M("realCapitalOutlayPerCapita", "Capital investment per capita", clamp(340 + urb * 210 + j("co") * 260, 120, 950), "$/capita/yr", "higherBetter", MODEL, "modeled", "v0.1"),
    M("capitalAssetsPerCapita", "Public capital assets per capita", clamp(6000 + urb * 3000 + j("ca") * 3600, 2500, 13000), "$/capita", "higherBetter", MODEL, "modeled", "v0.1"),
    M("investmentTrendScore", "Investing now?", clamp(50 + j("it") * 34, 25, 80), "0-100", "higherBetter", MODEL, "modeled", "v0.1"),
  ];

  const place = {
    fips, slug, name, state: "IN", stateName: "Indiana", kind: "county",
    metro: METROS[fips] ?? "Indiana",
    population: Math.round(pop), populationYear: 2025,
    fieldSurveyed: false, profile: "estimate",
    privateWealth: {
      medianHouseholdIncome: M("medianHouseholdIncome", "Median household income", income, "$", "higherBetter", CHR, "measured", 2025),
      medianHomeValue: M("medianHomeValue", "Median home value", homeValue, "$", "higherBetter", MODEL, "modeled", "v0.1", "Estimated from income and urbanicity."),
    },
    pillars: [
      { key: "movement", label: "Movement", blurb: "", metrics: movement },
      { key: "publicRealm", label: "Public Realm", blurb: "", metrics: publicRealm },
      { key: "education", label: "Education", blurb: "", metrics: education },
      { key: "healthSafety", label: "Health & Safety", blurb: "", metrics: healthSafety },
      { key: "systems", label: "Systems", blurb: "", metrics: systems },
      { key: "civicFabric", label: "Civic Fabric", blurb: "", metrics: civicFabric },
      { key: "stewardship", label: "Stewardship", blurb: "", metrics: stewardship },
    ],
  };

  fs.writeFileSync(path.join(OUT, `${fips}.json`), JSON.stringify(place, null, 2));
  written++;
}

console.log(`✅ wrote ${written} Indiana county files, preserved ${skipped} researched pilot counties`);
