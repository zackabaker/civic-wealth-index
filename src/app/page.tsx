import Link from "next/link";
import GapScatter from "@/components/GapScatter";
import RankTable from "@/components/RankTable";
import MapExplorer from "@/components/MapExplorer";
import { Eyebrow } from "@/components/Bits";
import { getScoredPlaces } from "@/lib/data";
import { PILLAR_META, PILLAR_WEIGHTS } from "@/lib/config";
import type { PillarKey } from "@/lib/types";

export default function Home() {
  const places = getScoredPlaces();
  const deep = places.filter((p) => p.profile !== "estimate");
  const inCount = places.filter((p) => p.state === "IN").length;
  const mapData = Object.fromEntries(
    places
      .filter((p) => p.state === "IN")
      .map((p) => [p.fips, { cwi: p.cwi, gap: p.sovereigntyGap, name: p.name, profile: p.profile }])
  );

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-14 md:pt-24">
        <div className="max-w-3xl">
          <Eyebrow>A new measure of wealth</Eyebrow>
          <h1 className="font-display text-4xl font-600 leading-[1.05] tracking-tight text-ink md:text-6xl">
            GDP measures what a place earns.
            <br />
            <span className="italic text-civic">We measure what it has built.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Paris is not great because of what it produced last year. It is great because of
            centuries of accumulated investment — Notre Dame alone was a meaningful share of the
            city&apos;s work for 180 years. The <strong className="text-ink">Civic Wealth Index</strong> is
            a balance sheet for American places: it scores the <em>stock</em> of public wealth a
            community has actually built and maintained — roads, parks, schools, safe streets, sound
            bridges — and can hand to people it will never know.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rankings"
              className="rounded-lg bg-civic px-5 py-2.5 text-sm font-600 text-paper-raised transition-colors hover:bg-civic-bright"
            >
              See the rankings
            </Link>
            <Link
              href="/gaps"
              className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-600 text-ink transition-colors hover:bg-line/50"
            >
              What&apos;s the Sovereignty Gap?
            </Link>
          </div>
        </div>
      </section>

      {/* The Gap scatter */}
      <section className="border-y border-line bg-paper-raised/50">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <GapScatter places={places} />
            </div>
            <div className="order-1 lg:order-2">
              <Eyebrow>The signature finding</Eyebrow>
              <h2 className="font-display text-3xl font-600 tracking-tight text-ink">
                Rich is not the same as well-built.
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                For every place we compute two things: how wealthy its people are, and how much
                public wealth the community has to show for it. The distance between them is the{" "}
                <strong className="text-ink">Sovereignty Gap</strong>.
              </p>
              <p className="mt-3 leading-relaxed text-ink-soft">
                A large gap means a place is affluent but has left the public realm an afterthought —
                private domains behind gates, dated playgrounds, missing sidewalks. Where the public
                fails to build, someone else quietly fills in, subdivision by subdivision. The gap
                makes that trade-off visible.
              </p>
              <Link href="/gaps" className="mt-5 inline-block text-sm font-600 text-civic hover:underline">
                Read how the gap works →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured: Carmel vs Williamson */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Link
          href="/carmel-vs-williamson"
          className="group block overflow-hidden rounded-2xl border border-line bg-paper-raised transition-colors hover:border-civic"
        >
          <div className="grid gap-6 p-7 md:grid-cols-[1.4fr_1fr] md:items-center md:p-9">
            <div>
              <Eyebrow>The case that started this</Eyebrow>
              <h2 className="font-display text-3xl font-600 leading-tight tracking-tight text-ink group-hover:text-civic md:text-4xl">
                Carmel vs. Williamson County
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Suburban Nashville&apos;s Williamson County is the richer place. Carmel, Indiana has
                five times the roundabouts, four times the sidewalks, and a public realm that laps
                it. A data reckoning — built on urbanist Aaron Renn&apos;s field survey.
              </p>
              <span className="mt-4 inline-block text-sm font-600 text-civic">Read the receipts →</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-line bg-paper p-4">
                <div className="font-display text-3xl font-700 text-civic tnum">539</div>
                <div className="mt-1 text-xs text-ink-faint">Carmel roundabouts</div>
              </div>
              <div className="rounded-xl border border-line bg-paper p-4">
                <div className="font-display text-3xl font-700 text-gap-bad tnum">109</div>
                <div className="mt-1 text-xs text-ink-faint">Williamson roundabouts</div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Map */}
      <section className="border-y border-line bg-paper-raised/40">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <Eyebrow>The whole state</Eyebrow>
              <h2 className="font-display text-3xl font-600 tracking-tight text-ink">
                Indiana, county by county
              </h2>
            </div>
            <Link href="/map" className="text-sm font-600 text-civic hover:underline">
              Open the map →
            </Link>
          </div>
          <MapExplorer data={mapData} />
        </div>
      </section>

      {/* Rankings preview */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Indiana, complete</Eyebrow>
            <h2 className="font-display text-3xl font-600 tracking-tight text-ink">
              All {inCount} counties, plus the anchors
            </h2>
          </div>
          <Link href="/rankings" className="text-sm font-600 text-civic hover:underline">
            Full rankings →
          </Link>
        </div>
        <RankTable places={deep} />
        <p className="mt-4 text-sm text-ink-faint">
          The five deep-profile anchors above are individually researched and, where noted,
          surveyed on the ground — from Carmel&apos;s roundabout-and-trail suburbia to Gary&apos;s
          inherited industrial capital. Every one of Indiana&apos;s {inCount} counties is scored from
          shared national data on the{" "}
          <Link href="/rankings" className="text-civic hover:underline">
            full rankings
          </Link>
          .
        </p>
      </section>

      {/* Seven pillars */}
      <section className="border-t border-line bg-paper-raised/50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Eyebrow>What we count</Eyebrow>
          <h2 className="font-display text-3xl font-600 tracking-tight text-ink">
            Seven pillars of civic wealth
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
            Each is scored 0–100 against national benchmarks, from public data, with every number
            traceable to its source. The method is open and versioned.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(PILLAR_META) as PillarKey[]).map((k) => (
              <div key={k} className="rounded-xl border border-line bg-paper-raised p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-600 text-ink">{PILLAR_META[k].label}</h3>
                  <span className="tnum text-xs text-gold">{Math.round(PILLAR_WEIGHTS[k] * 100)}%</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{PILLAR_META[k].blurb}</p>
              </div>
            ))}
          </div>
          <Link href="/methodology" className="mt-8 inline-block text-sm font-600 text-civic hover:underline">
            See the full method &amp; sources →
          </Link>
        </div>
      </section>

      {/* Founding quote */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-display text-2xl font-500 italic leading-snug text-ink md:text-3xl">
            &ldquo;We are building this city for our children and grandchildren and people we will
            never know.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm text-ink-faint">
            — Jim Brainard, longtime mayor of Carmel, Indiana, on why a city invests
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
