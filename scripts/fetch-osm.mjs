// Fetch real roundabout + traffic-signal counts per county from OpenStreetMap
// (Overpass API). Writes data/raw/osm-roundabouts.json keyed by FIPS.
//
// Note: OSM maps a roundabout as one or more `junction=roundabout` ways; large
// roundabouts are split into arcs, so way-counts are a consistent *index* of
// roundabout provision rather than a hand count of junctions. We report the
// ratio of roundabout ways to signalized-intersection nodes — directionally
// robust and computed identically everywhere.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PLACES = path.join(ROOT, "data", "places");
const OUT = path.join(ROOT, "data", "raw", "osm-roundabouts.json");
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const STATE_NAME = { IN: "Indiana", TN: "Tennessee", CO: "Colorado" };

function q(stateName, county) {
  return `[out:json][timeout:180];area["name"="${stateName}"]["admin_level"="4"]["boundary"="administrative"]->.st;rel["name"="${county}"]["admin_level"="6"]["boundary"="administrative"](area.st);map_to_area->.c;way["junction"="roundabout"](area.c);out count;node["highway"="traffic_signals"](area.c);out count;`;
}

async function fetchCounts(stateName, county, attempt = 0) {
  const ep = ENDPOINTS[attempt % ENDPOINTS.length];
  try {
    const res = await fetch(ep, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "CivicWealthIndex/0.2 (civic data research; contact zackabaker@gmail.com)",
      },
      body: "data=" + encodeURIComponent(q(stateName, county)),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const counts = j.elements.filter((e) => e.type === "count");
    const roundabouts = Number(counts[0]?.tags?.ways ?? 0);
    const signals = Number(counts[1]?.tags?.nodes ?? 0);
    return { roundabouts, signals };
  } catch (e) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 6000 * (attempt + 1)));
      return fetchCounts(stateName, county, attempt + 1);
    }
    console.error(`  ✗ ${county}: ${e.message}`);
    return null;
  }
}

const files = fs.readdirSync(PLACES).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
const places = files.map((f) => {
  const d = JSON.parse(fs.readFileSync(path.join(PLACES, f), "utf8"));
  return { fips: d.fips, name: d.name, state: d.state };
});

const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
let done = 0;
for (const p of places) {
  if (out[p.fips]) { done++; continue; } // resume-friendly
  const stateName = STATE_NAME[p.state];
  const r = await fetchCounts(stateName, p.name);
  if (r) {
    const ratio = r.roundabouts + r.signals > 0 ? r.roundabouts / (r.roundabouts + r.signals) : null;
    out[p.fips] = { ...r, ratio: ratio === null ? null : Math.round(ratio * 1000) / 1000 };
    done++;
    console.log(`  ✓ ${p.name}, ${p.state}: ${r.roundabouts} roundabout ways / ${r.signals} signals → ${out[p.fips].ratio}`);
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  }
  await new Promise((r) => setTimeout(r, 2500));
}
console.log(`\nDone. ${done}/${places.length} counties have OSM data → ${OUT}`);
