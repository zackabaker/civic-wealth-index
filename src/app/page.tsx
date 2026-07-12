import Link from "next/link";
import GapScatter from "@/components/GapScatter";
import RankTable from "@/components/RankTable";
import MapExplorer from "@/components/MapExplorer";
import { getScoredPlaces } from "@/lib/data";
import { FINDINGS } from "@/content/findings";
import { CWI_VERSION } from "@/lib/config";

export default function Home() {
  const places = getScoredPlaces();
  const deep = places.filter((p) => p.profile !== "estimate");
  const inCount = places.filter((p) => p.state === "IN").length;
  const mapData = Object.fromEntries(
    places
      .filter((p) => p.state === "IN")
      .map((p) => [p.fips, { cwi: p.cwi, gap: p.sovereigntyGap, name: p.name, profile: p.profile }])
  );
  const topFindings = FINDINGS.slice(0, 4);

  return (
    <div>
      {/* Hero — short */}
      <section className="mx-auto max-w-6xl px-5 pt-14 pb-10 md:pt-20">
        <h1 className="max-w-3xl font-display text-4xl font-600 leading-[1.08] tracking-tight text-ink md:text-5xl">
          GDP measures what a place earns.
          <br />
          <span className="italic text-civic">This measures what it has built.</span>
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          The Civic Wealth Index scores places 0–100 on the stock of public wealth they&apos;ve
          accumulated and maintained — roads, parks, schools, safety, water, civic institutions —
          from public data, every number traceable to its source. Currently: all {inCount} Indiana
          counties plus two out-of-state comparisons. {CWI_VERSION}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/rankings" className="rounded-lg bg-civic px-4 py-2 font-600 text-paper-raised hover:bg-civic-bright">
            Rankings
          </Link>
          <Link href="/findings" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
            Findings
          </Link>
          <Link href="/download/cwi.csv" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
            Data (CSV)
          </Link>
        </div>
      </section>

      {/* Findings strip */}
      <section className="border-y border-line bg-paper-raised/50">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topFindings.map((f) => (
              <Link
                key={f.id}
                href={f.href ?? `/findings#${f.id}`}
                className="group rounded-xl border border-line bg-paper-raised p-4 transition-colors hover:border-civic"
              >
                <div className="font-display text-2xl font-700 tnum text-civic">{f.stat}</div>
                <p className="mt-1.5 text-sm leading-snug text-ink-soft">
                  {f.text.split(". ")[0]}.
                </p>
              </Link>
            ))}
          </div>
          <Link href="/findings" className="mt-4 inline-block text-sm font-600 text-civic hover:underline">
            All findings →
          </Link>
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-600 tracking-tight text-ink">
            Indiana by county
          </h2>
          <Link href="/map" className="text-sm font-600 text-civic hover:underline">
            Full map →
          </Link>
        </div>
        <MapExplorer data={mapData} />
      </section>

      {/* Scatter + gap, brief */}
      <section className="border-y border-line bg-paper-raised/50">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <GapScatter places={places} />
            <div>
              <h2 className="font-display text-2xl font-600 tracking-tight text-ink">
                The Sovereignty Gap
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Private wealth score minus civic wealth score, both 0–100 against fixed national
                benchmarks. Positive: a place is richer than its public realm shows. Negative: it
                built more than its incomes predict. Williamson County, TN (+24) is the widest
                measured; every Indiana county is negative.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link href="/gaps" className="font-600 text-civic hover:underline">
                  Definition →
                </Link>
                <Link href="/carmel-vs-williamson" className="font-600 text-civic hover:underline">
                  Carmel vs. Williamson →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-600 tracking-tight text-ink">
            Researched places
          </h2>
          <Link href="/rankings" className="text-sm font-600 text-civic hover:underline">
            All {places.length} →
          </Link>
        </div>
        <RankTable places={deep} />
        <p className="mt-3 text-sm text-ink-faint">
          These five are individually researched (three field-surveyed). The other{" "}
          {places.length - deep.length} are scored from shared national data and labeled
          estimates — <Link href="/methodology" className="text-civic hover:underline">methodology</Link>.
        </p>
      </section>
    </div>
  );
}
