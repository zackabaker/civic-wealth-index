// Findings: short, factual observations mined from the dataset. Every number is
// computed from data/places/ and data/raw/. Terse by design — the numbers carry it.

export interface Finding {
  id: string;
  stat: string; // the headline number
  text: string; // 1-3 sentences, factual
  href?: string;
  hrefLabel?: string;
}

export const FINDINGS: Finding[] = [
  {
    id: "roundabout-concentration",
    stat: "28.5%",
    text: "of Indiana's mapped roundabouts are in one county. Hamilton County has 539 — more than the next four counties combined (Marion 207, Johnson 115, Tippecanoe 103, St. Joseph 96). 33 of 92 counties have zero.",
    href: "/place/hamilton-county-in",
    hrefLabel: "Hamilton County scorecard",
  },
  {
    id: "suburb-vs-city",
    stat: "539 vs 207",
    text: "The suburb out-built the city. Indianapolis (Marion County, pop. ~977,000) has 207 roundabouts and 2,890 traffic signals. Hamilton County, its northern suburb at two-fifths the population, has 539 roundabouts and 320 signals — the only large county with more roundabouts than signals.",
    href: "/compare?a=hamilton-county-in&b=marion-county-in",
    hrefLabel: "Compare them",
  },
  {
    id: "williamson-richer",
    stat: "$131,202",
    text: "Williamson County, TN has a higher median household income than all 92 Indiana counties — and a civic wealth score 15 points below Hamilton County's. Its Sovereignty Gap (+24) is the widest measured.",
    href: "/carmel-vs-williamson",
    hrefLabel: "The full comparison",
  },
  {
    id: "college-towns",
    stat: "4 of 4",
    text: "The four Indiana counties whose public wealth most exceeds their private wealth are all college towns: Monroe/IU (−38), Tippecanoe/Purdue (−34), Vigo/Indiana State (−34), Wayne/Earlham (−31). Universities put campuses, libraries, hospitals, and parks in modest-income places.",
    href: "/place/monroe-county-in",
    hrefLabel: "Monroe County",
  },
  {
    id: "life-expectancy-spread",
    stat: "11.9 years",
    text: "of life expectancy separate two counties in the same state: Hamilton (81.0) and Scott (69.1). Scott County is also second-worst on traffic deaths (32 per 100k). Source: County Health Rankings 2025.",
    href: "/place/scott-county-in",
    hrefLabel: "Scott County",
  },
  {
    id: "rural-roads",
    stat: "5×",
    text: "spread in traffic deaths. Rural Benton (35), Scott (32), and Newton (31) per 100k vs. college-town Monroe (7.0) and Tippecanoe (7.2). The safest roads in Indiana are where the fewest people drive alone on rural highways.",
  },
  {
    id: "amish-broadband",
    stat: "66%",
    text: "broadband coverage in LaGrange County — the state's lowest, in the heart of Amish northern Indiana. Best: Hendricks County at 93%.",
    href: "/place/lagrange-county-in",
    hrefLabel: "LaGrange County",
  },
  {
    id: "water",
    stat: "25 of 89",
    text: "Indiana counties with measured data had a drinking-water violation flag in the EPA/CHR data.",
  },
  {
    id: "no-in-underdeliverer",
    stat: "0",
    text: "Indiana counties under-deliver. Every one of the 92 has a negative Sovereignty Gap against national benchmarks — Indiana incomes are modest while its civic stock is middling-to-good. Wide positive gaps appear in wealthy metros elsewhere (Williamson, TN: +24).",
    href: "/gaps",
    hrefLabel: "How the gap works",
  },
  {
    id: "null-result",
    stat: "r = 0.03",
    text: "Civic wealth does not predict county growth once income is controlled for (raw r = 0.58 collapses to 0.03 partial). We tested it, and we publish the null.",
    href: "/does-civic-wealth-pay",
    hrefLabel: "The validation study",
  },
];
