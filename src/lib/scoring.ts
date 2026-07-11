// Civic Wealth Index — scoring engine
//
// Pure functions: raw PlaceData in, ScoredPlace out. No I/O, fully unit-testable.

import { BENCHMARKS, PILLAR_META, PILLAR_WEIGHTS } from "./config";
import type {
  Metric,
  PillarKey,
  PlaceData,
  ScoredMetric,
  ScoredPillar,
  ScoredPlace,
} from "./types";

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** Map a raw metric value to a 0-100 score against its national benchmark anchors.
 *  `weak` anchors to 10, `strong` to 90; linear in between, clamped to [0,100].
 *  Direction is encoded by which anchor is larger, so lower-is-better metrics
 *  (crime, poor bridges) just have weak > strong and the same math applies. */
export function scoreMetric(value: number | null, key: string): number | null {
  if (value === null || Number.isNaN(value)) return null;
  const b = BENCHMARKS[key];
  if (!b) return null;
  const t = (value - b.weak) / (b.strong - b.weak); // 0 at weak, 1 at strong
  return clamp(10 + t * 80);
}

function scoreMetrics(metrics: Metric[]): ScoredMetric[] {
  return metrics.map((m) => ({ ...m, score: scoreMetric(m.value, m.key) }));
}

/** Roll scored metrics up to a pillar score (equal weight within a pillar).
 *  Metrics without data are excluded from the average but lower the coverage. */
export function scorePillar(
  key: PillarKey,
  metrics: Metric[]
): ScoredPillar {
  const scored = scoreMetrics(metrics);
  const withData = scored.filter((m) => m.score !== null);
  const score =
    withData.length === 0
      ? 0
      : withData.reduce((s, m) => s + (m.score as number), 0) / withData.length;
  return {
    key,
    label: PILLAR_META[key].label,
    blurb: PILLAR_META[key].blurb,
    score: Math.round(score * 10) / 10,
    coverage: metrics.length === 0 ? 0 : withData.length / metrics.length,
    metrics: scored,
  };
}

function privateWealthScore(place: PlaceData): number {
  const parts = [
    scoreMetric(place.privateWealth.medianHouseholdIncome.value, "medianHouseholdIncome"),
    scoreMetric(place.privateWealth.medianHomeValue.value, "medianHomeValue"),
  ].filter((s): s is number => s !== null);
  return parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
}

/** Score one place's pillars and CWI. Percentiles/gap are filled in by scoreAll,
 *  which needs the whole set. */
function scorePlaceCore(place: PlaceData) {
  const pillars = place.pillars.map((p) => scorePillar(p.key, p.metrics));
  // Weighted composite. If a pillar has zero coverage, redistribute its weight
  // across the pillars that do have data, so missing data neither helps nor hurts.
  let usableWeight = 0;
  let weighted = 0;
  for (const p of pillars) {
    if (p.coverage > 0) {
      const w = PILLAR_WEIGHTS[p.key];
      usableWeight += w;
      weighted += w * p.score;
    }
  }
  const cwi = usableWeight > 0 ? weighted / usableWeight : 0;
  return { pillars, cwi: Math.round(cwi * 10) / 10, pw: privateWealthScore(place) };
}

/** Percentile rank of a value within an array (0-100), average-rank on ties. */
function percentile(values: number[], v: number): number {
  if (values.length <= 1) return 50;
  const below = values.filter((x) => x < v).length;
  const equal = values.filter((x) => x === v).length;
  return Math.round(((below + (equal - 1) / 2) / (values.length - 1)) * 100);
}

/** Score every place and compute the cross-place Sovereignty Gap. */
export function scoreAll(places: PlaceData[]): ScoredPlace[] {
  const cores = places.map((p) => ({ place: p, ...scorePlaceCore(p) }));
  const cwis = cores.map((c) => c.cwi);
  const pws = cores.map((c) => c.pw);

  return cores.map((c) => {
    const civicWealthPercentile = percentile(cwis, c.cwi);
    const privateWealthPercentile = percentile(pws, c.pw);
    return {
      fips: c.place.fips,
      slug: c.place.slug,
      name: c.place.name,
      state: c.place.state,
      stateName: c.place.stateName,
      kind: c.place.kind,
      metro: c.place.metro,
      seat: c.place.seat,
      keyPlaces: c.place.keyPlaces,
      population: c.place.population,
      populationYear: c.place.populationYear,
      fieldSurveyed: c.place.fieldSurveyed,
      cwi: c.cwi,
      privateWealthScore: Math.round(c.pw * 10) / 10,
      privateWealthPercentile,
      civicWealthPercentile,
      sovereigntyGap: privateWealthPercentile - civicWealthPercentile,
      pillars: c.pillars,
    };
  });
}
