import type { Metadata } from "next";
import Link from "next/link";
import { ScoreDial, GapPill } from "@/components/Bits";
import { getPlace } from "@/lib/data";
import { scoreColor } from "@/lib/format";
import { ScoreBar } from "@/components/Bits";

export const metadata: Metadata = {
  title: "Carmel vs. Williamson County",
  description:
    "Williamson County, TN is richer. Carmel's Hamilton County, IN is better built: 539 vs 109 roundabouts, 0.75 vs 0.18 sidewalk coverage, CWI 80 vs 65.",
  openGraph: {
    title: "Carmel vs. Williamson County: the receipts",
    description:
      "The richer county loses almost every row that isn't about money. 539 vs 109 roundabouts.",
  },
};

const RENN_THREAD = "https://x.com/aaron_renn/status/1937316103195095515";
const RENN_SITE = "https://www.aaronrenn.com";

function Row({
  label,
  carmel,
  williamson,
  carmelWins,
  note,
}: {
  label: string;
  carmel: string;
  williamson: string;
  carmelWins: boolean;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line/70 py-3 last:border-0">
      <div className={`text-right tnum text-lg ${carmelWins ? "font-700 text-civic" : "text-ink-soft"}`}>
        {carmel}
      </div>
      <div className="w-32 text-center text-xs font-600 uppercase tracking-wide text-ink-faint md:w-44">
        {label}
        {note && <div className="mt-0.5 text-[10px] normal-case tracking-normal text-ink-faint/80">{note}</div>}
      </div>
      <div className={`tnum text-lg ${!carmelWins ? "font-700 text-gap-bad" : "text-ink-soft"}`}>
        {williamson}
      </div>
    </div>
  );
}

export default function CarmelVsWilliamson() {
  const carmel = getPlace("hamilton-county-in")!;
  const will = getPlace("williamson-county-tn")!;

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-600 leading-[1.05] tracking-tight text-ink md:text-5xl">
        Carmel vs. Williamson County
      </h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        Williamson County, TN (suburban Nashville) is richer than Hamilton County, IN (Carmel) —
        higher incomes, much higher home values. On what each county built with the money, it
        isn&apos;t close the other way. The richer county loses almost every row that isn&apos;t
        about money.
      </p>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Source of the comparison: urbanist{" "}
        <a href={RENN_SITE} target="_blank" rel="noopener noreferrer" className="font-600 text-civic hover:underline">
          Aaron Renn
        </a>
        &apos;s 2025 field survey of Williamson County (&ldquo;the least impressive wealthy,
        favored-quarter suburban area I&apos;ve ever visited&rdquo;) —{" "}
        <a href={RENN_THREAD} target="_blank" rel="noopener noreferrer" className="font-600 text-civic hover:underline">
          original thread
        </a>
        . We put numbers on it.
      </p>

      {/* The table */}
      <div className="mt-8 rounded-2xl border border-line bg-paper-raised p-5 md:p-7">
        <div className="mb-4 grid grid-cols-[1fr_auto_1fr] gap-3 text-center">
          <div className="font-display text-lg font-700 text-civic">
            Carmel
            <div className="text-xs font-500 text-ink-faint">Hamilton County, IN</div>
          </div>
          <div className="w-32 md:w-44" />
          <div className="font-display text-lg font-700 text-gap-bad">
            Williamson
            <div className="text-xs font-500 text-ink-faint">Franklin, TN</div>
          </div>
        </div>
        <Row label="Median income" carmel="$125,509" williamson="$131,202" carmelWins={false} />
        <Row label="Median home value" carmel="$437,400" williamson="$673,700" carmelWins={false} />
        <Row label="Roundabouts" carmel="539" williamson="109" carmelWins note="OSM ways, whole county" />
        <Row label="Traffic signals" carmel="320" williamson="384" carmelWins note="fewer = better flow" />
        <Row label="Sidewalk coverage" carmel="0.75" williamson="0.18" carmelWins note="mapped km per road-km" />
        <Row label="Playground quality" carmel="90" williamson="38" carmelWins note="field survey, 0–100" />
        <Row label="Civic Wealth Index" carmel={carmel.cwi.toFixed(0)} williamson={will.cwi.toFixed(0)} carmelWins />
        <Row
          label="Sovereignty Gap"
          carmel={`${carmel.sovereigntyGap}`}
          williamson={`+${will.sovereigntyGap}`}
          carmelWins
          note="private − civic; +24 is the widest measured"
        />
      </div>

      {/* Pillars */}
      <div className="mt-8 rounded-xl border border-line bg-paper-raised p-5">
        <div className="mb-2 text-xs uppercase tracking-wider text-ink-faint">Pillar scores</div>
        {carmel.pillars.map((pa, i) => {
          const pb = will.pillars[i];
          return (
            <div key={pa.key} className="grid grid-cols-[1fr_120px_1fr] items-center gap-3 py-1.5 text-sm">
              <div className="flex items-center justify-end gap-2">
                <span className="tnum font-600" style={{ color: scoreColor(pa.score) }}>{pa.score.toFixed(0)}</span>
                <div className="w-20 scale-x-[-1]"><ScoreBar score={pa.score} height={6} /></div>
              </div>
              <div className="text-center text-xs text-ink-soft">{pa.label}</div>
              <div className="flex items-center gap-2">
                <div className="w-20"><ScoreBar score={pb.score} height={6} /></div>
                <span className="tnum font-600" style={{ color: scoreColor(pb.score) }}>{pb.score.toFixed(0)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Context, brief */}
      <div className="mt-8 space-y-4 leading-relaxed text-ink">
        <p>
          The mechanism is a policy choice, not a mystery. Carmel spent its growth years building
          the public realm — 150+ roundabouts under one long-serving mayor, the Monon Trail network,
          new parks and playgrounds. Williamson County&apos;s boom went into private domains: larger
          houses, rural estates, subdivision amenities. Its public playgrounds date to the
          1990s–2000s; new upscale subdivisions were built without sidewalks. Downtown Franklin is
          the exception, and it&apos;s excellent.
        </p>
        <p className="text-sm text-ink-soft">
          Williamson&apos;s measured strengths are real: top-ranked schools (Education 87), life
          expectancy 81.3 (Health &amp; Safety 91). The deficit is specifically the shared built
          environment: Public Realm 37, Stewardship 34.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[carmel, will].map((p) => (
          <div key={p.slug} className="rounded-2xl border border-line bg-paper-raised p-5 text-center">
            <Link href={`/place/${p.slug}`} className="font-display text-lg font-600 text-ink hover:text-civic">
              {p.name}, {p.state}
            </Link>
            <div className="mt-3 flex justify-center"><ScoreDial score={p.cwi} size={100} /></div>
            <div className="mt-2 flex justify-center"><GapPill gap={p.sovereigntyGap} /></div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/compare?a=hamilton-county-in&b=williamson-county-tn" className="rounded-lg bg-civic px-4 py-2 font-600 text-paper-raised hover:bg-civic-bright">
          Metric-level comparison
        </Link>
        <Link href="/methodology" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
          Method
        </Link>
        <a href={RENN_THREAD} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
          Renn&apos;s survey
        </a>
      </div>
    </article>
  );
}
