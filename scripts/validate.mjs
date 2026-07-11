// Quick integrity + scoring sanity check for the pilot data files.
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "data", "places");

const EXPECTED = {
  movement: ["bridgePoorPct", "pavementPoorPct", "roundaboutRatio", "trafficDeathsPer100k", "sidewalkCoverage"],
  publicRealm: ["parkAcresPer1k", "parkAccessPct", "playgroundScore", "libraryVisitsPerCapita", "treeCanopyPct"],
  education: ["learningRate", "gradeLevelsVsNational", "attainmentBachelorsPct"],
  healthSafety: ["lifeExpectancy", "childWellbeingIndex", "violentCrimePer1k"],
  systems: ["waterViolationPoints", "broadbandCoveragePct", "broadbandGigabitPct"],
  civicFabric: ["historicRegisterPer10k", "culturalVenuesPer10k", "townCenterScore"],
  stewardship: ["realCapitalOutlayPerCapita", "capitalAssetsPerCapita", "investmentTrendScore"],
};

const BENCH = {
  bridgePoorPct: [15, 1], pavementPoorPct: [40, 5], roundaboutRatio: [0.02, 0.3], trafficDeathsPer100k: [20, 5], sidewalkCoverage: [0.1, 0.8],
  parkAcresPer1k: [3, 25], parkAccessPct: [25, 85], playgroundScore: [30, 85], libraryVisitsPerCapita: [1.5, 6], treeCanopyPct: [10, 45],
  learningRate: [0.85, 1.15], gradeLevelsVsNational: [-1.5, 2.0], attainmentBachelorsPct: [18, 60],
  lifeExpectancy: [74, 82], childWellbeingIndex: [40, 80], violentCrimePer1k: [8, 1.5],
  waterViolationPoints: [10, 0], broadbandCoveragePct: [70, 98], broadbandGigabitPct: [30, 90],
  historicRegisterPer10k: [0.2, 5], culturalVenuesPer10k: [0.5, 4], townCenterScore: [20, 85],
  realCapitalOutlayPerCapita: [150, 900], capitalAssetsPerCapita: [3000, 12000], investmentTrendScore: [25, 80],
  medianHouseholdIncome: [45000, 130000], medianHomeValue: [120000, 700000],
};
const W = { movement: 0.2, publicRealm: 0.2, education: 0.15, healthSafety: 0.15, systems: 0.1, civicFabric: 0.1, stewardship: 0.1 };
const clamp = (n) => Math.max(0, Math.min(100, n));
const sc = (v, k) => (v == null || Number.isNaN(v) ? null : clamp(10 + ((v - BENCH[k][0]) / (BENCH[k][1] - BENCH[k][0])) * 80));

let ok = true;
const rows = [];
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"))) {
  let d;
  try { d = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")); }
  catch (e) { console.error(`❌ ${f} PARSE ERROR: ${e.message}`); ok = false; continue; }

  const problems = [];
  const pillars = Object.fromEntries(d.pillars.map((p) => [p.key, p]));
  let usable = 0, weighted = 0;
  for (const [pk, keys] of Object.entries(EXPECTED)) {
    const p = pillars[pk];
    if (!p) { problems.push(`missing pillar ${pk}`); continue; }
    const present = new Set(p.metrics.map((m) => m.key));
    for (const k of keys) if (!present.has(k)) problems.push(`missing metric ${pk}.${k}`);
    const scored = p.metrics.map((m) => sc(m.value, m.key)).filter((s) => s !== null);
    if (scored.length) { const ps = scored.reduce((a, b) => a + b, 0) / scored.length; usable += W[pk]; weighted += W[pk] * ps; }
  }
  for (const k of ["medianHouseholdIncome", "medianHomeValue"]) if (!d.privateWealth?.[k]) problems.push(`missing privateWealth.${k}`);

  const cwi = usable ? weighted / usable : 0;
  const pwParts = [sc(d.privateWealth?.medianHouseholdIncome?.value, "medianHouseholdIncome"), sc(d.privateWealth?.medianHomeValue?.value, "medianHomeValue")].filter((x) => x !== null);
  const pw = pwParts.length ? pwParts.reduce((a, b) => a + b, 0) / pwParts.length : 0;
  rows.push({ name: d.name + ", " + d.state, cwi, pw, fieldSurveyed: d.fieldSurveyed });
  if (problems.length) { ok = false; console.error(`❌ ${f} (${d.name}):\n   - ${problems.join("\n   - ")}`); }
  else console.log(`✅ ${f} ${d.name}, ${d.state} — all keys present`);
}

// percentiles for gap
const cwis = rows.map((r) => r.cwi), pws = rows.map((r) => r.pw);
const pct = (arr, v) => { const b = arr.filter((x) => x < v).length, e = arr.filter((x) => x === v).length; return Math.round(((b + (e - 1) / 2) / (arr.length - 1)) * 100); };
console.log("\n— Scored ranking —");
rows.sort((a, b) => b.cwi - a.cwi);
for (const r of rows) {
  const gap = pct(pws, r.pw) - pct(cwis, r.cwi);
  console.log(`${r.name.padEnd(24)} CWI ${r.cwi.toFixed(1).padStart(5)}  PrivWealth ${r.pw.toFixed(1).padStart(5)}  Gap ${(gap > 0 ? "+" : "") + gap}`);
}
console.log(ok ? "\n✅ ALL FILES VALID" : "\n❌ VALIDATION FAILED");
process.exit(ok ? 0 : 1);
