# Narrative spec — `data/narratives/<slug>.json`

A written profile of a place, shown on its page above the scorecard. Voice model: the
"Land That Time Forgot" Williamson County field essay — concrete, opinionated but always
sourced, praise-first-then-receipts, plain confident words (never ornate or academic; no
words like "assay"). Reference the place's ACTUAL metric values and pillar scores (read the
data file). Do NOT mention GDP-replacement theory abstractly more than a touch; stay grounded
in the specific place. Never mention "Domesday," "center.study," "sovereignty" as jargon —
you may use the plain idea of private-vs-public wealth.

Shape:

```json
{
  "dek": "One-sentence standfirst that captures this place's story in the index.",
  "sections": [
    { "heading": "Short heading", "body": ["Paragraph one.", "Paragraph two."] },
    { "heading": "...", "body": ["..."] }
  ],
  "byline": "Civic Wealth Index · pilot profile"
}
```

Aim for 3–4 sections, ~450–700 words total. Lead with what's genuinely good about the place,
then turn to where its public wealth lags or leads its private wealth, citing specific pillars
and numbers. End with a forward-looking or summarizing line. Valid JSON only.
