import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, GapPill } from "@/components/Bits";
import { getScoredPlaces } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Sovereignty Gap",
  description:
    "When a community is rich but its public realm is thin, someone else fills the gap. The Sovereignty Gap measures how far a place's public wealth trails its private wealth.",
};

export default function GapsPage() {
  const places = getScoredPlaces().filter((p) => p.profile !== "estimate");
  const widest = [...places].sort((x, y) => y.sovereigntyGap - x.sovereigntyGap)[0];
  const tightest = [...places].sort((x, y) => x.sovereigntyGap - y.sovereigntyGap)[0];

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>The idea</Eyebrow>
      <h1 className="font-display text-4xl font-600 leading-tight tracking-tight text-ink md:text-5xl">
        The Sovereignty Gap
      </h1>
      <p className="mt-5 text-xl leading-relaxed text-ink-soft">
        A place can be wealthy and still hand its children very little. The Sovereignty Gap is the
        distance between how rich a community&apos;s people are and how much shared wealth the
        community has to show for it.
      </p>

      <div className="rule-civic my-10" />

      <div className="space-y-6 text-lg leading-relaxed text-ink">
        <p>
          Two numbers, side by side. The first is <strong>private wealth</strong> — household
          incomes and home values, the money that belongs to people individually. The second is{" "}
          <strong>civic wealth</strong> — the parks, streets, schools, libraries, bridges, and
          water systems that belong to everyone, built up over decades and kept in repair. We rank
          every place on both, and subtract.
        </p>
        <p>
          When the gap is large and positive, a community is affluent but its public realm is thin.
          The money went into private domains — bigger houses, gated subdivisions, a private
          playground behind the neighborhood clubhouse — while the sidewalks stayed unbuilt, the
          public playgrounds aged, and the roads filled with avoidable traffic. The wealth is real.
          It simply didn&apos;t become <em>common</em> wealth.
        </p>
        <p>
          Here is the part that matters. A shortfall in the public realm doesn&apos;t stay empty. It
          becomes a market. Where public schools thin out, private ones thicken. Where public
          safety frays, gates and cameras and private patrols appear. Where the public playground
          rusts, families buy the swing set and the fenced yard. Each household re-secures, at its
          own expense, the things a community used to provide together — and only those households
          that can afford to.
        </p>
        <p>
          That&apos;s the quiet cost the Sovereignty Gap makes visible. Private substitution works,
          for the people who can pay. But it&apos;s more expensive in total, it leaves everyone else
          exposed, and it can&apos;t be inherited by &ldquo;people we will never know.&rdquo; A great
          public realm is the one form of wealth a whole community holds in common and passes down
          intact. GDP can&apos;t see it. This index is built to.
        </p>
      </div>

      {/* The two poles */}
      <div className="my-12 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper-raised p-5">
          <div className="text-sm text-ink-faint">Widest gap</div>
          <Link href={`/place/${widest.slug}`} className="font-display text-xl font-600 text-ink hover:text-civic">
            {widest.name}, {widest.state}
          </Link>
          <div className="mt-2">
            <GapPill gap={widest.sovereigntyGap} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Among the richest places in the country, yet its public realm trails far behind what its
            incomes could build.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-paper-raised p-5">
          <div className="text-sm text-ink-faint">Builds beyond its means</div>
          <Link href={`/place/${tightest.slug}`} className="font-display text-xl font-600 text-ink hover:text-civic">
            {tightest.name}, {tightest.state}
          </Link>
          <div className="mt-2">
            <GapPill gap={tightest.sovereigntyGap} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            More civic wealth than its incomes would predict — a community that chose to build in
            common.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper-raised/60 p-6">
        <h2 className="font-display text-xl font-600 text-ink">How we compute it</h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          We score each place&apos;s private wealth (incomes and home values) and its Civic Wealth
          Index on the same fixed 0–100 scale, then subtract. The Sovereignty Gap is private minus
          civic. Because both are measured against fixed national benchmarks rather than ranked
          against whichever places happen to be in the set, a place&apos;s gap stays put as more
          places are added — it describes the place, not the crowd around it. Positive means private
          wealth outruns public wealth; negative means the public realm is ahead.
        </p>
        <Link href="/methodology" className="mt-4 inline-block text-sm font-600 text-civic hover:underline">
          Full methodology →
        </Link>
      </div>
    </div>
  );
}
