import type { Metadata } from "next";
import Link from "next/link";
import { FINDINGS } from "@/content/findings";

export const metadata: Metadata = {
  title: "Findings",
  description:
    "Observations from the Civic Wealth Index data: roundabout concentration, life-expectancy spreads, college-town over-delivery, and a published null result.",
};

export default function FindingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink">Findings</h1>
      <p className="mt-3 text-ink-soft">
        Observations from the data. Each number is computed from the{" "}
        <Link href="/data" className="text-civic hover:underline">open dataset</Link>.
      </p>

      <ol className="mt-8 space-y-4">
        {FINDINGS.map((f, i) => (
          <li key={f.id} id={f.id} className="rounded-xl border border-line bg-paper-raised p-5">
            <div className="flex items-baseline gap-4">
              <span className="tnum text-sm text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-2xl font-700 tnum text-civic">{f.stat}</span>
            </div>
            <p className="mt-2 leading-relaxed text-ink">{f.text}</p>
            {f.href && (
              <Link href={f.href} className="mt-2 inline-block text-sm font-600 text-civic hover:underline">
                {f.hrefLabel} →
              </Link>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-ink-faint">
        Five counties are individually researched; the rest are scored from shared national data
        with some metrics modeled. Quality flags on every metric —{" "}
        <Link href="/methodology" className="text-civic hover:underline">methodology</Link>.
      </p>
    </div>
  );
}
