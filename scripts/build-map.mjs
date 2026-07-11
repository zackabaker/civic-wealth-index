// Convert Indiana county GeoJSON into projected SVG paths for the choropleth.
// Simple equirectangular projection with latitude correction — Indiana is small
// enough that this looks clean without a full geo library.

import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
const OUT = path.join(process.cwd(), "src", "content", "in-map.json");
const W = 1000;
const H = 1100;
const PAD = 12;

const g = JSON.parse(fs.readFileSync(SRC, "utf8"));
const feats = g.features.filter((f) => String(f.id).startsWith("18"));

// bounds
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
const eachCoord = (geom, cb) => {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  for (const poly of polys) for (const ring of poly) for (const [lon, lat] of ring) cb(lon, lat);
};
for (const f of feats) eachCoord(f.geometry, (lon, lat) => {
  if (lon < minLon) minLon = lon;
  if (lon > maxLon) maxLon = lon;
  if (lat < minLat) minLat = lat;
  if (lat > maxLat) maxLat = lat;
});

const midLat = (minLat + maxLat) / 2;
const cos = Math.cos((midLat * Math.PI) / 180);
const spanLon = (maxLon - minLon) * cos;
const spanLat = maxLat - minLat;
const scale = Math.min((W - 2 * PAD) / spanLon, (H - 2 * PAD) / spanLat);
const offX = (W - spanLon * scale) / 2;
const offY = (H - spanLat * scale) / 2;

const px = (lon) => offX + (lon - minLon) * cos * scale;
const py = (lat) => offY + (maxLat - lat) * scale;

function toPath(geom) {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  let d = "";
  for (const poly of polys) {
    for (const ring of poly) {
      d += ring
        .map(([lon, lat], i) => `${i === 0 ? "M" : "L"}${px(lon).toFixed(1)},${py(lat).toFixed(1)}`)
        .join("") + "Z";
    }
  }
  return d;
}

const counties = feats
  .map((f) => ({
    fips: String(f.id),
    name: `${f.properties.NAME} County`,
    slug: `${f.properties.NAME.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-county-in`,
    d: toPath(f.geometry),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(OUT, JSON.stringify({ width: W, height: H, counties }, null, 0));
console.log(`✅ wrote ${counties.length} county paths → ${OUT}`);
