// Shared serializers for the open dataset (CSV + JSON downloads).
import { getScoredPlaces } from "./data";
import { CWI_VERSION } from "./config";
import type { PillarKey } from "./types";

const PILLAR_ORDER: PillarKey[] = [
  "movement",
  "publicRealm",
  "education",
  "healthSafety",
  "systems",
  "civicFabric",
  "stewardship",
];

export function datasetJSON() {
  const places = getScoredPlaces();
  return {
    dataset: "Civic Wealth Index",
    version: CWI_VERSION,
    generated: "2026-07-11",
    license: "CC BY 4.0",
    url: "https://civicwealthindex.org",
    note: "Scores 0-100 against fixed national benchmarks. See /methodology. 'profile' is 'deep' (individually researched) or 'estimate' (bulk national data with some metrics modeled from urbanicity).",
    places: places.map((p) => ({
      fips: p.fips,
      name: p.name,
      state: p.state,
      profile: p.profile,
      population: p.population,
      cwi: p.cwi,
      privateWealthScore: p.privateWealthScore,
      sovereigntyGap: p.sovereigntyGap,
      pillars: Object.fromEntries(
        PILLAR_ORDER.map((k) => [k, p.pillars.find((pp) => pp.key === k)?.score ?? null])
      ),
    })),
  };
}

export function datasetCSV(): string {
  const places = getScoredPlaces();
  const head = [
    "fips",
    "name",
    "state",
    "profile",
    "population",
    "cwi",
    "private_wealth_score",
    "sovereignty_gap",
    ...PILLAR_ORDER.map((k) => `pillar_${k}`),
  ];
  const rows = places.map((p) => {
    const byKey = Object.fromEntries(p.pillars.map((pp) => [pp.key, pp.score]));
    return [
      p.fips,
      `"${p.name}"`,
      p.state,
      p.profile,
      p.population,
      p.cwi,
      p.privateWealthScore,
      p.sovereigntyGap,
      ...PILLAR_ORDER.map((k) => byKey[k] ?? ""),
    ].join(",");
  });
  return [head.join(","), ...rows].join("\n") + "\n";
}
