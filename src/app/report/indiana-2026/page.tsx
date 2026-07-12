import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, GapPill } from "@/components/Bits";
import MapExplorer from "@/components/MapExplorer";
import { getScoredPlaces } from "@/lib/data";
import { CiteBox } from "@/components/CiteBox";
import { scoreColor } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Civic Wealth of Indiana, 2026",
  description:
    "The inaugural Civic Wealth Index report on Indiana: which counties have built the most public wealth, which are rich but under-built, and what the map reveals.",
};

export default function IndianaReport() {
  const inPlaces = getScoredPlaces().filter((p) => p.state === "IN");
  const byCwi = [...inPlaces].sort((a, b) => b.cwi - a.cwi);
  const avg = inPlaces.reduce((s, p) => s + p.cwi, 0) / inPlaces.length;
  const overDeliver = [...inPlaces].sort((a, b) => a.sovereigntyGap - b.sovereigntyGap).slice(0, 5);
  const underDeliver = [...inPlaces].sort((a, b) => b.sovereigntyGap - a.sovereigntyGap).slice(0, 5);
  const mapData = Object.fromEntries(
    inPlaces.map((p) => [p.fips, { cwi: p.cwi, gap: p.sovereigntyGap, name: p.name, profile: p.profile }])
  );

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>Report · 2026 · v0.1</Eyebrow>
      <h1 className="font-display text-4xl font-600 leading-tight tracking-tight text-ink md:text-6xl">
        The Civic Wealth of Indiana
      </h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        All {inPlaces.length} Indiana counties scored on accumulated public wealth. Data:
        County Health Rankings 2025, OpenStreetMap, ACS, and the sources on each scorecard.
      </p>

      <div className="rule-civic my-9" />

      <div className="grid grid-cols-3 gap-4 text-center">
        <Stat n={byCwi[0].cwi.toFixed(0)} l={`Highest — ${byCwi[0].name.replace(" County", "")}`} />
        <Stat n={avg.toFixed(0)} l="State average" />
        <Stat n={byCwi[byCwi.length - 1].cwi.toFixed(0)} l={`Lowest — ${byCwi[byCwi.length - 1].name.replace(" County", "")}`} />
      </div>

      <section className="mt-12 space-y-5 text-lg leading-relaxed text-ink">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">The map</h2>
        <p className="text-base">
          Three patterns: the Indianapolis suburban ring scores highest (Hamilton 80, Boone 63,
          Hendricks 62); college towns over-deliver relative to income (Monroe −38, Tippecanoe −34);
          post-industrial and rural counties hold inherited infrastructure they struggle to maintain
          (Lake 36, lowest).
        </p>
      </section>

      <div className="mt-6">
        <MapExplorer data={mapData} />
      </div>

      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-600 text-ink">Builds beyond its means</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Counties whose public wealth most outruns their private wealth.
          </p>
          <ol className="mt-3 space-y-2">
            {overDeliver.map((p) => (
              <ReportRow key={p.slug} p={p} />
            ))}
          </ol>
        </div>
        <div>
          <h3 className="font-display text-xl font-600 text-ink">Narrowest margins</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Counties closest to balance. No Indiana county has a positive gap; the widest measured
            is Williamson County, TN (+24).
          </p>
          <ol className="mt-3 space-y-2">
            {underDeliver.map((p) => (
              <ReportRow key={p.slug} p={p} />
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-14 space-y-5 text-lg leading-relaxed text-ink">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Roundabouts</h2>
        <p className="text-base">
          Hamilton County has 539 mapped roundabout ways — 28.5% of the state total and more than
          the next four counties combined. 33 of 92 counties have none.{" "}
          <Link href="/carmel-vs-williamson" className="text-civic hover:underline">
            Carmel vs. Williamson →
          </Link>
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Cite this report</h2>
        <p className="mt-2 text-ink-soft">
          Data and method are open. Download the full dataset on the{" "}
          <Link href="/data" className="text-civic hover:underline">data page</Link>.
        </p>
        <div className="mt-4">
          <CiteBox />
        </div>
      </section>

      <p className="mt-10 text-sm text-ink-faint">
        Note: five counties are individually researched or field-surveyed; the rest are scored from
        shared national data with some metrics modeled from urbanicity, and labeled accordingly. See
        the <Link href="/methodology" className="text-civic hover:underline">methodology</Link>.
      </p>
    </article>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper-raised p-4">
      <div className="font-display text-4xl font-700 tnum text-civic">{n}</div>
      <div className="mt-1 text-xs text-ink-faint">{l}</div>
    </div>
  );
}

function ReportRow({ p }: { p: ReturnType<typeof getScoredPlaces>[number] }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm">
      <Link href={`/place/${p.slug}`} className="flex-1 truncate font-500 text-ink hover:text-civic">
        {p.name.replace(" County", "")}
      </Link>
      <span className="tnum font-600" style={{ color: scoreColor(p.cwi) }}>{p.cwi.toFixed(0)}</span>
      <GapPill gap={p.sovereigntyGap} compact />
    </li>
  );
}
