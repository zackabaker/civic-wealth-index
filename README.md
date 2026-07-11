# Civic Wealth Index

> GDP measures what a place earns. This measures what it has built.

A public website that scores American places on the *stock* of public wealth they have
accumulated and maintained — roads, parks, schools, safe streets, sound bridges — rather than
the annual flow of economic output. The signature metric is the **Sovereignty Gap**: the
distance between a place's private wealth and its civic wealth.

## How it works

- **Seven pillars** (`src/lib/config.ts`): Movement, Public Realm, Education, Health & Safety,
  Systems, Civic Fabric, Stewardship. Weights live in one config file.
- **Benchmark-anchored scoring** (`src/lib/scoring.ts`): each metric maps to a 0–100 score
  against fixed national anchors, so scores mean the same thing everywhere and stay stable as
  places are added. Pure functions, no I/O.
- **Data** (`data/places/<fips>.json`): one file per place, every metric carrying full
  provenance (source, url, year, quality flag). See `data/SPEC.md`.
- **Narratives** (`data/narratives/<slug>.json`): written field profiles. See its SPEC.
- The methodology page is generated from the same config that produces the scores, so the
  published method can't drift from the numbers.

## Pilot (v0.1)

Five counties chosen to test the measure against very different places: Hamilton County IN
(Carmel), Williamson County TN (Franklin), Pitkin County CO (Aspen), Lake County IN (Gary),
Allen County IN (Fort Wayne).

## Develop

```bash
npm install
npm run dev                  # http://localhost:3000
node scripts/validate.mjs    # data integrity + scoring sanity check
npm run build
```

## Add a place

1. Add `data/places/<fips>.json` (follow `data/SPEC.md`).
2. Add `data/narratives/<slug>.json` (optional; follow that SPEC).
3. `node scripts/validate.mjs`, then `npm run build`. Everything else is automatic.

Stack: Next.js 16 (App Router) · Tailwind v4 · TypeScript. Static / ISR, no database.
