// Bulk OSM fetch: one query for all Indiana roundabout ways (centers) and one for
// all traffic-signal nodes, then assign each to a county by point-in-polygon using
// the county boundaries. Two Overpass calls total. Out-of-state anchors handled
// with individual small queries.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const GEO = process.argv[2]; // us-counties geojson
const OUT = path.join(ROOT, "data", "raw", "osm-roundabouts.json");
const EPS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const UA = "CivicWealthIndex/0.2 (civic data research; zackabaker@gmail.com)";

async function overpass(query, attempt = 0) {
  const ep = EPS[attempt % EPS.length];
  try {
    const res = await fetch(ep, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": UA,
      },
      body: "data=" + encodeURIComponent(query),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (e) {
    if (attempt < 6) {
      console.log(`  retry ${attempt + 1} (${e.message}) on next endpoint…`);
      await new Promise((r) => setTimeout(r, 8000 * (attempt + 1)));
      return overpass(query, attempt + 1);
    }
    throw e;
  }
}

// --- county polygons (outer rings) for Indiana ---
const geo = JSON.parse(fs.readFileSync(GEO, "utf8"));
const counties = geo.features
  .filter((f) => String(f.id).startsWith("18"))
  .map((f) => {
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    // bbox for quick reject + outer rings
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    const rings = polys.map((p) => p[0]); // outer ring of each polygon
    for (const ring of rings) for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    }
    return { fips: String(f.id), rings, minLon, maxLon, minLat, maxLat };
  });

function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function countyOf(lon, lat) {
  for (const c of counties) {
    if (lon < c.minLon || lon > c.maxLon || lat < c.minLat || lat > c.maxLat) continue;
    for (const ring of c.rings) if (inRing(lon, lat, ring)) return c.fips;
  }
  return null;
}

console.log("Fetching all Indiana roundabout ways…");
const rbJson = await overpass(
  '[out:json][timeout:600];area["name"="Indiana"]["admin_level"="4"]["boundary"="administrative"]->.st;way["junction"="roundabout"](area.st);out center;'
);
const roundabouts = rbJson.elements.filter((e) => e.center || (e.lat && e.lon));
console.log(`  ${roundabouts.length} roundabout ways`);

console.log("Fetching all Indiana traffic-signal nodes…");
const sigJson = await overpass(
  '[out:json][timeout:600];area["name"="Indiana"]["admin_level"="4"]["boundary"="administrative"]->.st;node["highway"="traffic_signals"](area.st);out;'
);
const signals = sigJson.elements.filter((e) => e.lat && e.lon);
console.log(`  ${signals.length} signal nodes`);

const tally = {};
for (const c of counties) tally[c.fips] = { roundabouts: 0, signals: 0 };
for (const e of roundabouts) {
  const lon = e.center ? e.center.lon : e.lon;
  const lat = e.center ? e.center.lat : e.lat;
  const f = countyOf(lon, lat);
  if (f && tally[f]) tally[f].roundabouts++;
}
for (const e of signals) {
  const f = countyOf(e.lon, e.lat);
  if (f && tally[f]) tally[f].signals++;
}

const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
for (const [fips, t] of Object.entries(tally)) {
  const denom = t.roundabouts + t.signals;
  out[fips] = { ...t, ratio: denom > 0 ? Math.round((t.roundabouts / denom) * 1000) / 1000 : null };
}
// out-of-state anchors: values fetched in prior runs (individual county queries)
const mk = (rb, sg) => ({ roundabouts: rb, signals: sg, ratio: Math.round((rb / (rb + sg)) * 1000) / 1000 });
out["47187"] = mk(109, 384); // Williamson County, TN
out["08097"] = mk(4, 18); // Pitkin County, CO
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
const withData = Object.values(out).filter((v) => v.ratio !== null).length;
console.log(`\n✅ ${Object.keys(out).length} places, ${withData} with a ratio → ${OUT}`);
// quick sanity: top 5 by ratio
const named = Object.entries(out).map(([f, v]) => ({ f, ...v })).filter((v) => v.ratio !== null).sort((a, b) => b.ratio - a.ratio);
console.log("Top roundabout ratios:", named.slice(0, 5).map((v) => `${v.f}:${v.ratio}`).join(" "));
