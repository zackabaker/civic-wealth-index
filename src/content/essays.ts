export type Block =
  | { t: "p"; x: string }
  | { t: "h2"; x: string }
  | { t: "quote"; x: string; cite?: string };

export interface Essay {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  readMins: number;
  /** author credit; defaults to the site when absent */
  author?: string;
  /** short attribution/standfirst shown under the dek (may contain a source note) */
  credit?: string;
  /** link to the original source (e.g. the author's thread) */
  sourceUrl?: string;
  sourceLabel?: string;
  body: Block[];
}

export const ESSAYS: Essay[] = [
  {
    slug: "the-land-that-time-forgot",
    title: "The Land That Time Forgot",
    dek: "A field survey of suburban Nashville's Williamson County — one of the richest places in America, and one of the least invested in its public realm.",
    date: "2026-06-23",
    readMins: 7,
    author: "Aaron Renn",
    credit:
      "By Aaron Renn, urbanist and author of the newsletter at aaronrenn.com. Adapted, with light edits, from his field survey originally published as a thread on X in June 2025. This survey is the observation that prompted the Civic Wealth Index.",
    sourceUrl: "https://x.com/aaron_renn/status/1937316103195095515",
    sourceLabel: "Read the original thread on X",
    body: [
      { t: "p", x: "I spent time surveying suburban Nashville's Williamson County — Franklin, Brentwood, Nolensville, Leipers Fork. I'm not going to lie: it might be the least impressive wealthy, favored-quarter suburban area I've ever visited. Let me talk about the good up front, because there's real good here." },
      { t: "h2", x: "The good" },
      { t: "p", x: "Downtown Franklin is very nice. It's a genuinely historic downtown with great housing stock dating to the early 1800s. As Bill Fulton noted, it's a tourist rather than a living downtown, but still great — a few chains like Anthropologie, but not chain-dominated. Having a few major national brands present is a good thing. There's a nice Hilton Curio hotel, the Harpeth. The main problem is that there's too little residential within walking distance of the commercial core; they've chosen not to build the apartments that might scale it up. But there's tasteful infill — very nicely designed townhouses, functional shutters, real gas lamps. Nice touches." },
      { t: "p", x: "The rural estates along Old Hillsboro Road are impressive. There's an ideal here of living a plantation-style existence — buy some land on a main road, build a big visible house with a huge front yard, raise horses in a Lexington-influenced setup with wooden or Irish-style rock fencing, even if you don't actually have horses. Leipers Fork was cutesy, and gives easy access to the Natchez Trace Parkway, which is lovely." },
      { t: "h2", x: "The private domain, and the public afterthought" },
      { t: "p", x: "The rural-estate ideal has heavily shaped the ethos of the area, in negative ways. In effect, everything here is about the private domain. The public realm is essentially an afterthought." },
      { t: "p", x: "Williamson County has very underdeveloped infrastructure and what appears to be no planning. It's behind the times in important respects. Carmel and Hamilton County went all in on roundabouts — 150-plus in Carmel, with very few stoplights. Williamson County is stoplight city; there are very few roundabouts. They've done little on sidewalks: there are newish, very upscale subdivisions without them, and I'm not sure they're even mandated. Some main roads have multi-use paths, but many don't, and virtually all of the ones that do have gaps. Unsurprisingly, traffic can be bad. I sat through a mile-and-a-half backup on Concord Road at 6:30 on a Monday night." },
      { t: "p", x: "Weirdly, Brentwood doesn't appear to have a downtown or to have tried to create a town center at all. It's pure sprawl — another example of how this area is behind the times." },
      { t: "p", x: "There's an edge-city office district called Cool Springs along I-65, with landscaped four-lane collector-distributor streets on either side. The east side has the office buildings, including Nissan's US headquarters, and Carothers Parkway is nicely done. The west side along Mallory Lane is a retail hellscape anchored by the Cool Springs Galleria. There isn't even much genuinely high-end retail here — that's concentrated back in the city, at Green Hills. Cool Springs is doing well because the region is booming, and there's still empty land being developed. But it's an obsolete typology." },
      { t: "p", x: "I surveyed half the playgrounds in Franklin. They were very dated — probably 1990s or 2000s. Only one had a modern rubberized surface; the rest were still mulch, with paint peeling off the metal fixtures. You would never in a million years think this was a wealthy community by looking at its playgrounds. Presumably people use private playgrounds in their subdivisions. Again: private over public." },
      { t: "h2", x: "The verdict" },
      { t: "p", x: "If you want to live on a rural estate or exist entirely in your own private domain, Williamson County might be a good choice. But for anyone who remotely cares about the public realm and amenities, it will greatly disappoint." },
      { t: "p", x: "Williamson County may be richer than Carmel, Indiana — that's the benefit of a much stronger market. But with the exception of Franklin's downtown, Carmel blows it out of the water on amenities and infrastructure, with better traffic and lower costs too. Williamson has the look and feel of a wealthy suburb from twenty-five years ago: the land that time forgot." },
    ],
  },
];

export function getEssay(slug: string) {
  return ESSAYS.find((e) => e.slug === slug);
}
