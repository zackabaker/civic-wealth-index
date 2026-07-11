import type { Metadata } from "next";
import Link from "next/link";
import { ScoreDial, GapPill, Eyebrow, ScoreBar } from "@/components/Bits";
import { getPlace } from "@/lib/data";
import { scoreColor } from "@/lib/format";

export const metadata: Metadata = {
  title: "Carmel vs. Williamson County: the receipts",
  description:
    "One county is richer. The other is better built. A data reckoning of Carmel, Indiana against suburban Nashville's Williamson County — the case that started the Civic Wealth Index.",
  openGraph: {
    title: "Carmel vs. Williamson County: the receipts",
    description:
      "Williamson County, TN is richer than Carmel, IN. Carmel has five times the roundabouts, four times the sidewalks, and a public realm that laps it. Rich isn't the same as well-built.",
  },
};

const RENN_THREAD = "https://x.com/aaron_renn/status/1937316103195095515";
const RENN_SITE = "https://www.aaronrenn.com";

function Stat({
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
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line/70 py-3.5 last:border-0">
      <div className={`text-right ${carmelWins ? "font-700 text-civic" : "text-ink-soft"}`}>
        <span className="tnum text-lg">{carmel}</span>
      </div>
      <div className="w-28 text-center text-xs font-600 uppercase tracking-wide text-ink-faint md:w-40">
        {label}
        {note && <div className="mt-0.5 text-[10px] normal-case tracking-normal text-ink-faint/80">{note}</div>}
      </div>
      <div className={`${!carmelWins ? "font-700 text-gap-bad" : "text-ink-soft"}`}>
        <span className="tnum text-lg">{williamson}</span>
      </div>
    </div>
  );
}

export default function CarmelVsWilliamson() {
  const carmel = getPlace("hamilton-county-in")!;
  const will = getPlace("williamson-county-tn")!;

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>A data reckoning</Eyebrow>
      <h1 className="font-display text-4xl font-600 leading-[1.05] tracking-tight text-ink md:text-6xl">
        Carmel vs. Williamson County
      </h1>
      <p className="mt-5 font-display text-xl italic leading-snug text-ink-soft">
        One county is richer. The other is better built. This is what happens when you put a number
        on the difference.
      </p>

      {/* Renn credit */}
      <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 px-5 py-4 text-sm leading-relaxed text-ink-soft">
        This comparison began with a field survey by the urbanist{" "}
        <a href={RENN_SITE} target="_blank" rel="noopener noreferrer" className="font-600 text-civic hover:underline">
          Aaron Renn
        </a>
        , who drove suburban Nashville and came back unimpressed — &ldquo;the least impressive wealthy,
        favored-quarter suburban area I&apos;ve ever visited.&rdquo; He was comparing it, implicitly,
        to his own Carmel, Indiana. We took his observation and did the thing an observation
        can&apos;t do by itself: we measured it, county against county, on public data.{" "}
        <a href={RENN_THREAD} target="_blank" rel="noopener noreferrer" className="font-600 text-civic hover:underline">
          Read Renn&apos;s original thread →
        </a>
      </div>

      {/* The paradox */}
      <div className="rule-civic my-9" />
      <div className="space-y-5 text-lg leading-relaxed text-ink">
        <p>
          Start with the fact that should settle it: <strong>Williamson County is the richer
          place.</strong> Its median household income of $131,202 edges Carmel&apos;s $125,509, and
          its median home, at $673,700, is worth half again as much as Carmel&apos;s $437,400. By the
          usual scoreboard — incomes, home values, the GDP-shaped view of a place — Williamson wins,
          and it isn&apos;t close.
        </p>
        <p>
          Now look at what each county actually built with that wealth. This is where the scoreboard
          flips, and hard.
        </p>
      </div>

      {/* Hard numbers */}
      <div className="mt-8 rounded-2xl border border-line bg-paper-raised p-5 md:p-7">
        <div className="mb-4 grid grid-cols-[1fr_auto_1fr] gap-3 text-center">
          <div className="font-display text-lg font-700 text-civic">Carmel<div className="text-xs font-500 text-ink-faint">Hamilton County, IN</div></div>
          <div className="w-28 md:w-40" />
          <div className="font-display text-lg font-700 text-gap-bad">Williamson<div className="text-xs font-500 text-ink-faint">Franklin, TN</div></div>
        </div>
        <Stat label="Median income" carmel="$125,509" williamson="$131,202" carmelWins={false} />
        <Stat label="Median home value" carmel="$437,400" williamson="$673,700" carmelWins={false} />
        <Stat label="Roundabouts (OSM ways)" carmel="539" williamson="109" carmelWins note="vs. signalized intersections" />
        <Stat label="Traffic signals (OSM)" carmel="320" williamson="384" carmelWins />
        <Stat label="Sidewalk coverage" carmel="0.75" williamson="0.18" carmelWins note="mapped sidewalk-km per road-km" />
        <Stat label="Playground quality" carmel="90" williamson="38" carmelWins note="field survey, 0–100" />
        <Stat label="Civic Wealth Index" carmel={carmel.cwi.toFixed(0)} williamson={will.cwi.toFixed(0)} carmelWins note="0–100 composite" />
      </div>
      <p className="mt-3 text-center text-sm text-ink-faint">
        Green wins the row. The richer county loses almost every one that isn&apos;t about money.
      </p>

      {/* Scorecards */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[carmel, will].map((p) => (
          <div key={p.slug} className="rounded-2xl border border-line bg-paper-raised p-6 text-center">
            <Link href={`/place/${p.slug}`} className="font-display text-xl font-600 text-ink hover:text-civic">
              {p.name}, {p.state}
            </Link>
            <div className="mt-4 flex justify-center">
              <ScoreDial score={p.cwi} />
            </div>
            <div className="mt-3 flex justify-center">
              <GapPill gap={p.sovereigntyGap} />
            </div>
          </div>
        ))}
      </div>

      {/* Renn's framework */}
      <div className="rule-civic my-12" />
      <div className="space-y-5 text-lg leading-relaxed text-ink">
        <h2 className="font-display text-3xl font-600 tracking-tight text-ink">The favored quarter, tested</h2>
        <p>
          Renn has spent years on a simple idea: a growing suburb gets exactly one window — the
          growth years — to build the public realm that will keep it valuable after the growth
          stops. Carmel used its window. Under a long-serving mayor it put in more than a hundred and
          fifty roundabouts, a spine of multi-use trails, an arts district, a concert hall, and it
          kept its playgrounds new. Williamson County spent its boom on private domains: bigger
          houses, rural estates, subdivision amenities behind the gate — and left the commons as an
          afterthought. Its downtown Franklin is genuinely lovely; almost everything around it is
          sprawl without sidewalks.
        </p>
        <p>
          The Civic Wealth Index is built to catch precisely this. It ignores what a place earns and
          measures what it has built and kept: movement, public realm, schools, health and safety,
          the utility backbone, civic fabric, and whether it&apos;s still investing. On that ledger
          Carmel scores {carmel.cwi.toFixed(0)} and Williamson {will.cwi.toFixed(0)} — and the
          Sovereignty Gap, the distance between a place&apos;s private wealth and its public wealth,
          runs {will.sovereigntyGap > 0 ? "+" : ""}
          {will.sovereigntyGap} for Williamson, the widest we&apos;ve measured. It is rich, and it
          has remarkably little common wealth to show for it.
        </p>
        <PillarStrip a={carmel} b={will} />
        <p>
          None of this makes Williamson a bad place to be wealthy. It makes it a cautionary tale
          about what wealth is for. The point of a boom, as Renn keeps saying and as Carmel&apos;s
          mayor put it, is to build things for &ldquo;people we will never know.&rdquo; One of these
          counties did. The scoreboard that only counts money will never see the difference. This
          one is built to.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-line bg-paper-raised/60 p-6">
        <p className="text-ink-soft">
          Credit where it&apos;s due: this comparison exists because Aaron Renn drove Williamson
          County and wrote down what he saw. Read his{" "}
          <a href={RENN_THREAD} target="_blank" rel="noopener noreferrer" className="font-600 text-civic hover:underline">original thread</a>{" "}
          and his{" "}
          <a href={RENN_SITE} target="_blank" rel="noopener noreferrer" className="font-600 text-civic hover:underline">newsletter</a>.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/compare?a=hamilton-county-in&b=williamson-county-tn" className="rounded-lg bg-civic px-4 py-2 font-600 text-paper-raised hover:bg-civic-bright">
            See the full comparison
          </Link>
          <Link href="/gaps" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
            What&apos;s the Sovereignty Gap?
          </Link>
          <Link href="/methodology" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
            How it&apos;s measured
          </Link>
        </div>
      </div>
    </article>
  );
}

function PillarStrip({ a, b }: { a: ReturnType<typeof getPlace>; b: ReturnType<typeof getPlace> }) {
  if (!a || !b) return null;
  return (
    <div className="not-prose my-6 rounded-xl border border-line bg-paper-raised p-5">
      {a.pillars.map((pa, i) => {
        const pb = b.pillars[i];
        return (
          <div key={pa.key} className="grid grid-cols-[1fr_120px_1fr] items-center gap-3 py-2 text-sm">
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
  );
}
