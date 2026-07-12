import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Bits";
import PressKit from "@/components/PressKit";
import { getScoredPlaces } from "@/lib/data";
import { gapLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Press kit",
  description:
    "Free, ready-to-run county blurbs from the Civic Wealth Index for every Indiana county — for local news, newsletters, and civic groups.",
};

export default function PressPage() {
  const inPlaces = getScoredPlaces().filter((p) => p.state === "IN");
  const byCwi = [...inPlaces].sort((a, b) => b.cwi - a.cwi);
  const rank = new Map(byCwi.map((p, i) => [p.slug, i + 1]));
  const n = inPlaces.length;

  const items = byCwi.map((p) => {
    const best = [...p.pillars].sort((a, b) => b.score - a.score)[0];
    const worst = [...p.pillars].sort((a, b) => a.score - b.score)[0];
    const gapPhrase =
      p.sovereigntyGap <= -8
        ? "builds more public wealth than its incomes would predict"
        : p.sovereigntyGap >= 8
        ? "has more private wealth than its public realm to show for it"
        : "converts private wealth into public wealth at about the expected rate";
    const blurb = `${p.name}, Indiana ranks ${rank.get(p.slug)} of ${n} Indiana counties on the Civic Wealth Index (score ${p.cwi.toFixed(
      0
    )}/100), a measure of accumulated public wealth — infrastructure, parks, schools, health, and safety — rather than income. Its strongest area is ${best.label} (${best.score.toFixed(
      0
    )}) and its weakest is ${worst.label} (${worst.score.toFixed(
      0
    )}). The county ${gapPhrase} (Sovereignty Gap ${p.sovereigntyGap > 0 ? "+" : ""}${p.sovereigntyGap}, "${gapLabel(
      p.sovereigntyGap
    )}"). Full scorecard: civicwealthindex.org/place/${p.slug}`;
    return { name: `${p.name}, IN`, slug: p.slug, blurb };
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>For newsrooms &amp; newsletters</Eyebrow>
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        Press kit
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        A ready-to-run blurb for every Indiana county. Free to use with a link back to the
        county&apos;s scorecard.
      </p>
      <p className="mt-3 text-sm text-ink-faint">
        Want the raw numbers instead? Grab the full{" "}
        <Link href="/data" className="text-civic hover:underline">dataset</Link>, or read the{" "}
        <Link href="/report/indiana-2026" className="text-civic hover:underline">2026 Indiana report</Link>.
      </p>

      <div className="mt-8">
        <PressKit items={items} />
      </div>
    </div>
  );
}
