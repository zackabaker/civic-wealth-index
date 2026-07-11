// Civic Wealth Index — core data model
//
// Design principle: measure the *stock* of accumulated public wealth, not the
// annual *flow* of economic output. Every metric below describes something a
// community has built and maintained, or failed to.

export type Direction = "higherBetter" | "lowerBetter";

export type DataQuality = "measured" | "modeled" | "partial" | "field" | "missing";

/** A single raw metric with full provenance. Every number on the site traces back to one of these. */
export interface Metric {
  /** stable key, e.g. "bridgePoorPct" */
  key: string;
  /** human label, e.g. "Bridges in poor condition" */
  label: string;
  /** the measured value; null when we have no data for this place */
  value: number | null;
  /** display unit, e.g. "%", "per 1,000", "years" */
  unit: string;
  direction: Direction;
  /** data source name, e.g. "FHWA National Bridge Inventory" */
  source: string;
  /** link to the source dataset or record */
  sourceUrl: string;
  /** vintage of the data */
  year: number | string;
  quality: DataQuality;
  /** optional human note shown in tooltips / methodology */
  note?: string;
}

export type PillarKey =
  | "movement"
  | "publicRealm"
  | "education"
  | "healthSafety"
  | "systems"
  | "civicFabric"
  | "stewardship";

export interface Pillar {
  key: PillarKey;
  label: string;
  /** one-line description of what this pillar measures */
  blurb: string;
  metrics: Metric[];
}

export type PlaceKind = "county" | "city";

/** A place's raw, un-scored record. This is what the data pipeline writes to data/places/<fips>.json */
export interface PlaceData {
  fips: string;
  slug: string;
  name: string;          // "Hamilton County"
  state: string;         // "IN"
  stateName: string;     // "Indiana"
  kind: PlaceKind;
  metro: string;         // "Indianapolis metro"
  seat?: string;         // county seat
  keyPlaces?: string[];  // ["Carmel", "Fishers", "Westfield", "Noblesville"]
  population: number;
  populationYear: number;
  /** whether a human has done an on-the-ground field survey */
  fieldSurveyed: boolean;
  /** "deep" = individually researched/surveyed; "estimate" = bulk statewide data
   *  with several metrics modeled from urbanicity. Defaults to "deep" when absent. */
  profile?: "deep" | "estimate";
  /** private-wealth inputs used for the Sovereignty Gap */
  privateWealth: {
    medianHouseholdIncome: Metric;
    medianHomeValue: Metric;
    /** optional composite already computed 0-100; if absent, scoring derives it */
    perCapitaIncome?: Metric;
  };
  pillars: Pillar[];
}

// --- Scored outputs (produced by the scoring engine) ---

export interface ScoredMetric extends Metric {
  /** 0-100 against the national benchmark anchors; null if value is null */
  score: number | null;
}

export interface ScoredPillar {
  key: PillarKey;
  label: string;
  blurb: string;
  /** 0-100 weighted rollup of scored metrics (metrics with data only) */
  score: number;
  /** share of metrics that had real data (0-1); a coverage/confidence signal */
  coverage: number;
  metrics: ScoredMetric[];
}

export interface ScoredPlace {
  fips: string;
  slug: string;
  name: string;
  state: string;
  stateName: string;
  kind: PlaceKind;
  metro: string;
  seat?: string;
  keyPlaces?: string[];
  population: number;
  populationYear: number;
  fieldSurveyed: boolean;
  profile?: "deep" | "estimate";
  /** the headline Civic Wealth Index, 0-100 */
  cwi: number;
  /** private-wealth score, 0-100, on the same benchmark scale */
  privateWealthScore: number;
  /** private-wealth percentile among the scored set (0-100) */
  privateWealthPercentile: number;
  /** civic-wealth percentile among the scored set (0-100) */
  civicWealthPercentile: number;
  /** THE signature metric: privateWealthPercentile - civicWealthPercentile.
   *  Positive = rich but under-invested in the public realm. */
  sovereigntyGap: number;
  pillars: ScoredPillar[];
}
