import type { Metadata } from "next";
import Link from "next/link";
import { GapPill } from "@/components/Bits";
import { getScoredPlaces } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Sovereignty Gap",
  description:
    "Definition and examples: the gap between a place's private wealth and its civic wealth, on a fixed 0-100 benchmark scale.",
};

export default function GapsPage() {
  const places = getScoredPlaces();
  const deep = places.filter((p) => p.profile !== "estimate");
  const sorted = [...deep].sort((a, b) => b.sovereigntyGap - a.sovereigntyGap);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink">
        The Sovereignty Gap
      </h1>

      <div className="mt-6 rounded-xl border border-line bg-paper-raised p-5 font-mono text-sm text-ink">
        gap = private wealth score − civic wealth score
        <div className="mt-2 text-xs text-ink-faint font-sans">
          Both 0–100 against fixed national benchmarks (income &amp; home values vs. the seven-pillar
          CWI). Anchored, not ranked — a place&apos;s gap doesn&apos;t change when other places are
          added.
        </div>
      </div>

      <div className="mt-6 space-y-4 leading-relaxed text-ink">
        <p>
          <strong>Positive gap:</strong> a place is richer than its public realm shows. The money
          stayed in private domains — housing, subdivision amenities — while sidewalks, parks, and
          playgrounds lagged. What the public realm doesn&apos;t provide, households buy privately,
          each at their own expense; those who can&apos;t pay go without.
        </p>
        <p>
          <strong>Negative gap:</strong> a place built more public wealth than its incomes predict.
          In Indiana the strongest cases are college towns (Monroe −38, Tippecanoe −34) and
          Carmel&apos;s Hamilton County (−10 at a much higher income level).
        </p>
        <p className="text-ink-soft text-sm">
          Calibration note: every Indiana county is negative — the state&apos;s incomes are modest
          against national benchmarks while its civic stock is middling-to-good. Wide positive gaps
          appear in wealthy metros elsewhere. The gap compares a place to national anchors, not to
          its neighbors.
        </p>
      </div>

      <h2 className="mt-10 font-display text-2xl font-600 tracking-tight text-ink">
        Researched places
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-paper-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
              <th className="py-2.5 pl-4 font-600">Place</th>
              <th className="py-2.5 font-600 text-right">Private</th>
              <th className="py-2.5 font-600 text-right">Civic</th>
              <th className="py-2.5 pr-4 font-600 text-right">Gap</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.slug} className="border-b border-line/60 last:border-0">
                <td className="py-2.5 pl-4">
                  <Link href={`/place/${p.slug}`} className="font-500 text-ink hover:text-civic">
                    {p.name}, {p.state}
                  </Link>
                </td>
                <td className="py-2.5 text-right tnum">{p.privateWealthScore.toFixed(0)}</td>
                <td className="py-2.5 text-right tnum">{p.cwi.toFixed(0)}</td>
                <td className="py-2.5 pr-4 text-right">
                  <GapPill gap={p.sovereigntyGap} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-ink-soft">
        Full method, weights, and benchmark anchors:{" "}
        <Link href="/methodology" className="text-civic hover:underline">methodology</Link>. Growth
        prediction tested and null:{" "}
        <Link href="/does-civic-wealth-pay" className="text-civic hover:underline">validation study</Link>.
      </p>
    </div>
  );
}
