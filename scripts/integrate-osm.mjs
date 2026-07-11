// Merge real OSM roundabout data into place files, replacing the modeled
// roundaboutRatio metric. Uses shrinkage toward zero (denominator + K) so counties
// with very few mapped intersections don't get noisy-extreme ratios.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PLACES = path.join(ROOT, "data", "places");
const OSM = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "raw", "osm-roundabouts.json"), "utf8"));
const K = 15;

let updated = 0;
for (const file of fs.readdirSync(PLACES).filter((f) => f.endsWith(".json") && !f.startsWith("_"))) {
  const p = path.join(PLACES, file);
  const d = JSON.parse(fs.readFileSync(p, "utf8"));
  const o = OSM[d.fips];
  if (!o || o.ratio === null) continue;
  const shrunk = Math.round((o.roundabouts / (o.roundabouts + o.signals + K)) * 1000) / 1000;
  const mv = d.pillars.find((pl) => pl.key === "movement");
  const m = mv?.metrics.find((mm) => mm.key === "roundaboutRatio");
  if (!m) continue;
  m.value = shrunk;
  m.source = "OpenStreetMap (Overpass API)";
  m.sourceUrl = "https://www.openstreetmap.org/";
  m.year = 2026;
  m.quality = "measured";
  m.note = `${o.roundabouts} roundabout ways vs ${o.signals} signalized-intersection nodes in OpenStreetMap; reported as an adoption index (shrunk toward zero for low counts).`;
  fs.writeFileSync(p, JSON.stringify(d, null, 2));
  updated++;
}
console.log(`✅ updated roundaboutRatio with real OSM data in ${updated} place files`);
