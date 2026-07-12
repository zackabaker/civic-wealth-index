import type { Metadata } from "next";
import Link from "next/link";
import { CWI_VERSION } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: "What the Civic Wealth Index is, what it covers, and what it claims.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink">About</h1>
      <div className="mt-5 space-y-4 leading-relaxed text-ink">
        <p>
          The Civic Wealth Index scores places on the accumulated stock of public wealth — roads,
          parks, schools, health, safety, utilities, civic institutions — rather than annual income
          or output. Seven pillars, 0–100 against fixed national benchmarks, every metric with a
          source link and a quality flag.
        </p>
        <p>
          Current coverage ({CWI_VERSION}): all 92 Indiana counties plus Williamson County, TN and
          Pitkin County, CO as comparisons. Five places are individually researched; the rest are
          scored from shared national data and labeled estimates.
        </p>
        <p className="text-ink-soft">
          The index describes; it doesn&apos;t predict. We tested whether civic wealth predicts
          growth and published the{" "}
          <Link href="/does-civic-wealth-pay" className="text-civic hover:underline">null result</Link>.
          Data and code are open:{" "}
          <Link href="/data" className="text-civic hover:underline">downloads &amp; citation</Link>,{" "}
          <a href="https://github.com/zackabaker/civic-wealth-index" target="_blank" rel="noopener noreferrer" className="text-civic hover:underline">
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
