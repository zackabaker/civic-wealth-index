// Data loading — reads raw place files, scores them, caches the result.
// Runs at build time (all pages are static/ISR), so fs access is fine.

import fs from "node:fs";
import path from "node:path";
import { scoreAll } from "./scoring";
import type { PlaceData, ScoredPlace } from "./types";

const PLACES_DIR = path.join(process.cwd(), "data", "places");

let _cache: ScoredPlace[] | null = null;
let _rawCache: Map<string, PlaceData> | null = null;

function loadRaw(): PlaceData[] {
  if (!fs.existsSync(PLACES_DIR)) return [];
  const files = fs
    .readdirSync(PLACES_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  const places: PlaceData[] = [];
  _rawCache = new Map();
  for (const f of files) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(PLACES_DIR, f), "utf8")
      ) as PlaceData;
      places.push(raw);
      _rawCache.set(raw.slug, raw);
    } catch (e) {
      console.error(`[data] failed to parse ${f}:`, e);
    }
  }
  return places;
}

export function getScoredPlaces(): ScoredPlace[] {
  if (_cache) return _cache;
  const raw = loadRaw();
  _cache = scoreAll(raw).sort((a, b) => b.cwi - a.cwi);
  return _cache;
}

export function getPlace(slug: string): ScoredPlace | undefined {
  return getScoredPlaces().find((p) => p.slug === slug);
}

export function getRawPlace(slug: string): PlaceData | undefined {
  if (!_rawCache) loadRaw();
  return _rawCache?.get(slug);
}

export function getAllSlugs(): string[] {
  return getScoredPlaces().map((p) => p.slug);
}

export interface Narrative {
  dek: string; // one-line standfirst
  sections: { heading: string; body: string[] }[];
  byline?: string;
}

const NARR_DIR = path.join(process.cwd(), "data", "narratives");

export function getNarrative(slug: string): Narrative | null {
  const f = path.join(NARR_DIR, `${slug}.json`);
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, "utf8")) as Narrative;
  } catch {
    return null;
  }
}
