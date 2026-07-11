# Place data spec — what each `data/places/<fips>.json` must contain

Each file is a `PlaceData` object (see `src/lib/types.ts`). Fill **every** metric key
below. Use real, retrieved figures wherever possible with a working `sourceUrl`. When a
figure can't be retrieved, estimate from known facts, set `quality` accordingly, and never
fabricate a precise-looking number you can't defend. Use `value: null` + `quality: "missing"`
only as a last resort.

`quality` values: `"measured"` (pulled from the named dataset), `"modeled"` (reasoned/estimated
from related public facts), `"partial"` (real but incomplete coverage, e.g. OSM sidewalks),
`"field"` (from an on-the-ground survey), `"missing"` (no data, value null).

## Metric keys (key — unit — direction — source)

### movement
- `bridgePoorPct` — % — lowerBetter — FHWA National Bridge Inventory (share of bridges rated Poor)
- `pavementPoorPct` — % — lowerBetter — FHWA HPMS / state DOT (share of road miles in poor ride quality)
- `roundaboutRatio` — ratio — higherBetter — OpenStreetMap Overpass (roundabouts ÷ (roundabouts + signalized intersections))
- `trafficDeathsPer100k` — per 100k — lowerBetter — NHTSA FARS / County Health Rankings
- `sidewalkCoverage` — km/km — higherBetter — OpenStreetMap (mapped sidewalk-km per road-km); usually `partial`

### publicRealm
- `parkAcresPer1k` — acres/1k — higherBetter — Trust for Public Land / PAD-US / local parks dept
- `parkAccessPct` — % — higherBetter — TPL ParkServe (residents within a 10-min walk of a park)
- `playgroundScore` — 0-100 — higherBetter — field/modeled (surface, equipment age, upkeep)
- `libraryVisitsPerCapita` — per capita — higherBetter — IMLS Public Libraries Survey
- `treeCanopyPct` — % — higherBetter — USFS Tree Canopy / NLCD

### education
- `learningRate` — grade/yr — higherBetter — SEDA (learning growth per grade; ~1.0 = one grade level/yr)
- `gradeLevelsVsNational` — grade levels — higherBetter — SEDA (avg grades above/below the national mean)
- `attainmentBachelorsPct` — % — higherBetter — Census ACS (bachelor's+ among age 25+)

### healthSafety
- `lifeExpectancy` — years — higherBetter — CDC/NCHS USALEEP / County Health Rankings
- `childWellbeingIndex` — 0-100 — higherBetter — modeled from CDC PLACES / KIDS COUNT
- `violentCrimePer1k` — per 1k — lowerBetter — FBI Crime Data Explorer

### systems
- `waterViolationPoints` — 0-10 — lowerBetter — EPA SDWIS (drinking-water violation severity; 0 = clean)
- `broadbandCoveragePct` — % — higherBetter — FCC Broadband Data Collection (100/20 Mbps availability)
- `broadbandGigabitPct` — % — higherBetter — FCC BDC (gigabit availability)

### civicFabric
- `historicRegisterPer10k` — per 10k — higherBetter — National Register of Historic Places (listings per 10k residents)
- `culturalVenuesPer10k` — per 10k — higherBetter — museums/theaters/venues per 10k (IMLS Museum Universe / local)
- `townCenterScore` — 0-100 — higherBetter — field/assessed (existence and quality of a walkable town center)

### stewardship
- `realCapitalOutlayPerCapita` — $/capita/yr — higherBetter — Census of Governments / local ACFR (avg annual capital outlay per resident)
- `capitalAssetsPerCapita` — $/capita — higherBetter — local ACFR (net capital assets, governmental activities)
- `investmentTrendScore` — 0-100 — higherBetter — assessed (is the place actively investing now?)

### privateWealth (drives the Sovereignty Gap; not part of CWI)
- `medianHouseholdIncome` — $ — Census ACS
- `medianHomeValue` — $ — Census ACS

## Shape example (abbreviated)

```json
{
  "fips": "18057",
  "slug": "hamilton-county-in",
  "name": "Hamilton County",
  "state": "IN",
  "stateName": "Indiana",
  "kind": "county",
  "metro": "Indianapolis metro",
  "seat": "Noblesville",
  "keyPlaces": ["Carmel", "Fishers", "Westfield", "Noblesville"],
  "population": 371000,
  "populationYear": 2023,
  "fieldSurveyed": true,
  "privateWealth": {
    "medianHouseholdIncome": { "key": "medianHouseholdIncome", "label": "Median household income", "value": 121000, "unit": "$", "direction": "higherBetter", "source": "Census ACS 5-year", "sourceUrl": "https://data.census.gov/...", "year": 2023, "quality": "measured" },
    "medianHomeValue": { "key": "medianHomeValue", "label": "Median home value", "value": 385000, "unit": "$", "direction": "higherBetter", "source": "Census ACS 5-year", "sourceUrl": "https://data.census.gov/...", "year": 2023, "quality": "measured" }
  },
  "pillars": [
    { "key": "movement", "label": "Movement", "blurb": "", "metrics": [ { "key": "bridgePoorPct", "label": "Bridges in poor condition", "value": 3.1, "unit": "%", "direction": "lowerBetter", "source": "FHWA National Bridge Inventory", "sourceUrl": "https://...", "year": 2024, "quality": "measured" }, ...] },
    ... one object per pillar key, in the order: movement, publicRealm, education, healthSafety, systems, civicFabric, stewardship
  ]
}
```

`blurb` on each pillar may be left as `""` — the app fills it from config.
