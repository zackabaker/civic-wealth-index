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
  body: Block[];
}

export const ESSAYS: Essay[] = [
  {
    slug: "what-gdp-cannot-see",
    title: "What GDP Can't See",
    dek: "Why the standard measure of a place misses almost everything that makes a place worth living in.",
    date: "2026-07-11",
    readMins: 4,
    body: [
      { t: "p", x: "Gross domestic product is an income statement. It counts what an economy produced in a year — the transactions, the wages, the output. It is a genuinely useful number, and it is the number we reach for by reflex when we ask whether a place is doing well. But an income statement is not a balance sheet, and a place is far more balance sheet than income statement." },
      { t: "p", x: "Paris is not great because of what it produced last year. It is great because of centuries of accumulated decisions — boulevards cut and maintained, a river embanked, museums filled, a cathedral that consumed a meaningful share of the city's labor for 180 years. None of that shows up in a single year's output, and most of it was paid for by people who are long dead, for the benefit of people they would never meet." },
      { t: "quote", x: "We are building this city for our children and grandchildren and people we will never know.", cite: "Jim Brainard, longtime mayor of Carmel, Indiana" },
      { t: "p", x: "That sentence describes a kind of wealth GDP cannot register: the stock of public things a community has built and kept in repair. Roads that move you without a fight. Parks and playgrounds you don't have to own to use. Schools that compound a child's learning year over year. Bridges that don't fail. Water you can drink without thinking. Libraries, street trees, a downtown that's alive after six o'clock. This is civic wealth, and it is the truest measure of whether a place is rich in any sense that lasts." },
      { t: "h2", x: "Income is not the same as wealth" },
      { t: "p", x: "You can meet people who earn a great deal and own very little, and places are the same. A county can post enviable household incomes while its public realm quietly thins out — sidewalks that stop halfway, playgrounds last updated two decades ago, an intersection that backs up a mile and a half at dinnertime because no one built the roundabout. The money is real. It simply never became common wealth. It stayed private." },
      { t: "p", x: "The Civic Wealth Index is our attempt to measure the other thing — the balance sheet, not the income statement. We score every place on seven pillars of accumulated public wealth, from public data, with every number traceable to its source. And we put that civic-wealth score next to a place's private wealth to reveal the distance between them: the Sovereignty Gap, the space where a community's shared inheritance falls short of what its people could afford to build." },
      { t: "p", x: "None of this is anti-wealth. It is an argument about what wealth is for. The point of prosperity, in the end, is to build things worth inheriting — to leave a place better stocked for people you will never know. That is the number we're trying to see." },
    ],
  },
  {
    slug: "the-land-that-time-forgot",
    title: "The Land That Time Forgot",
    dek: "A field survey of suburban Nashville's Williamson County — one of the richest places in America, and one of the least invested in its public realm.",
    date: "2026-07-09",
    readMins: 7,
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
      { t: "p", x: "Williamson County may be richer than Carmel, Indiana — that's the benefit of a much stronger market. But with the exception of Franklin's downtown, Carmel blows it out of the water on amenities and infrastructure, with better traffic and lower costs too. Williamson has the look and feel of a wealthy suburb from twenty-five years ago: the land that time forgot. It is, in other words, a place with a large Sovereignty Gap — and the whole point of this project is to make that gap something you can measure, not just something you feel driving through." },
    ],
  },
  {
    slug: "the-roundabout",
    title: "The Roundabout as a Measure of Civilization",
    dek: "Why one humble intersection tells you more about a community's civic wealth than its median income does.",
    date: "2026-07-10",
    readMins: 3,
    body: [
      { t: "p", x: "Carmel, Indiana has more than 150 roundabouts and very few stoplights. This is usually told as a quirk — the roundabout mayor, the town that hates red lights. It is actually one of the clearest signals of civic wealth you can find, and it's hiding in plain sight in a free public map anyone can query." },
      { t: "p", x: "A roundabout is more expensive and harder to build than a traffic signal. It requires land, engineering, a willingness to redesign an intersection rather than bolt a light onto it, and a community that plans decades ahead. In return it moves more cars with less waiting, keeps traffic flowing during a power outage, and — because collisions happen at glancing angles instead of head-on — it turns fatal crashes into fender benders. It is, in miniature, exactly the kind of decision civic wealth is made of: pay more now, in public, so that everyone benefits later, including people who haven't moved to town yet." },
      { t: "p", x: "The reason we can measure this at all is that intersections are mapped. Every roundabout and every traffic signal in the country sits in OpenStreetMap, tagged and countable. So the ratio of roundabouts to signals becomes a real, national, comparable metric — and it separates places that merely have money from places that have built something with it." },
      { t: "p", x: "Williamson County, Tennessee is richer than Hamilton County, Indiana, and has almost no roundabouts. Carmel has a hundred and fifty. That difference is not about what either place can afford. It's about what each decided to build for people it will never know. That's the whole index, in one intersection." },
    ],
  },
];

export function getEssay(slug: string) {
  return ESSAYS.find((e) => e.slug === slug);
}
