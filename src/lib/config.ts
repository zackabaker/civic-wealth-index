// Civic Wealth Index — scoring configuration
//
// This file is the single source of truth for weights and benchmark anchors.
// The methodology page is generated from it, so the published method can never
// drift from the code that produces the numbers.

import type { PillarKey } from "./types";

export const CWI_VERSION = "v0.1";

// --- Pillar weights (must sum to 1.0) ---
export const PILLAR_WEIGHTS: Record<PillarKey, number> = {
  movement: 0.2,
  publicRealm: 0.2,
  education: 0.15,
  healthSafety: 0.15,
  systems: 0.1,
  civicFabric: 0.1,
  stewardship: 0.1,
};

export const PILLAR_META: Record<PillarKey, { label: string; blurb: string }> = {
  movement: {
    label: "Movement",
    blurb:
      "How well a place lets people get around: pavement and bridge condition, intersection design, safety, and whether you can actually walk or bike.",
  },
  publicRealm: {
    label: "Public Realm",
    blurb:
      "The shared outdoors and indoors — parks, playgrounds, libraries, tree canopy, and places to gather that belong to everyone.",
  },
  education: {
    label: "Education",
    blurb:
      "Not just test scores, but how much students actually learn each year, and how educated the community has become.",
  },
  healthSafety: {
    label: "Health & Safety",
    blurb:
      "How long people live, how well children fare, and how safe the streets are.",
  },
  systems: {
    label: "Systems",
    blurb:
      "The invisible backbone: clean water, reliable broadband, and the utility networks a modern community runs on.",
  },
  civicFabric: {
    label: "Civic Fabric",
    blurb:
      "The buildings, institutions, and town centers that give a place identity and continuity across generations.",
  },
  stewardship: {
    label: "Stewardship",
    blurb:
      "Whether a community actually invests in itself — cumulative capital built, assets maintained, and the direction it's heading.",
  },
};

/** Benchmark anchors: value that scores 10 ("weak") and value that scores 90 ("strong").
 *  Scores interpolate linearly and clamp to [0,100]. These are national reference
 *  points, not percentiles among the pilot places, so a score means the same thing
 *  everywhere and stays stable as more places are added. */
export interface Benchmark {
  weak: number;
  strong: number;
}

export const BENCHMARKS: Record<string, Benchmark> = {
  // Movement
  bridgePoorPct: { weak: 15, strong: 1 },
  pavementPoorPct: { weak: 40, strong: 5 },
  roundaboutRatio: { weak: 0.02, strong: 0.3 },
  trafficDeathsPer100k: { weak: 20, strong: 5 },
  sidewalkCoverage: { weak: 0.1, strong: 0.8 },

  // Public Realm
  parkAcresPer1k: { weak: 3, strong: 25 },
  parkAccessPct: { weak: 25, strong: 85 },
  playgroundScore: { weak: 30, strong: 85 },
  libraryVisitsPerCapita: { weak: 1.5, strong: 6 },
  treeCanopyPct: { weak: 10, strong: 45 },

  // Education
  learningRate: { weak: 0.85, strong: 1.15 },
  gradeLevelsVsNational: { weak: -1.5, strong: 2.0 },
  attainmentBachelorsPct: { weak: 18, strong: 60 },

  // Health & Safety
  lifeExpectancy: { weak: 74, strong: 82 },
  childWellbeingIndex: { weak: 40, strong: 80 },
  violentCrimePer1k: { weak: 8, strong: 1.5 },

  // Systems
  waterViolationPoints: { weak: 10, strong: 0 },
  broadbandCoveragePct: { weak: 70, strong: 98 },
  broadbandGigabitPct: { weak: 30, strong: 90 },

  // Civic Fabric
  historicRegisterPer10k: { weak: 0.2, strong: 5 },
  culturalVenuesPer10k: { weak: 0.5, strong: 4 },
  townCenterScore: { weak: 20, strong: 85 },

  // Stewardship
  realCapitalOutlayPerCapita: { weak: 150, strong: 900 },
  capitalAssetsPerCapita: { weak: 3000, strong: 12000 },
  investmentTrendScore: { weak: 25, strong: 80 },

  // Private wealth (for the Sovereignty Gap; scored, not part of CWI)
  medianHouseholdIncome: { weak: 45000, strong: 130000 },
  medianHomeValue: { weak: 120000, strong: 700000 },
};
