import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Bits";
import { CWI_VERSION } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Civic Wealth Index is an independent, open-method measure of the public wealth American communities have built to last.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <Eyebrow>About</Eyebrow>
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        A balance sheet for places
      </h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink">
        <p>
          The Civic Wealth Index is an independent project to measure something GDP was never built
          to see: the accumulated stock of public wealth a community has built and maintained, and
          can hand to people it will never know.
        </p>
        <p>
          We score American places on seven pillars — movement, public realm, education, health and
          safety, systems, civic fabric, and stewardship — using open national data, with every
          number traceable to its source. Alongside each place&apos;s civic wealth we show its
          private wealth, and the distance between them: the Sovereignty Gap.
        </p>
        <p>
          This is version {CWI_VERSION}, a five-county pilot chosen to test the measure against very
          different kinds of places. The method, the weights, and the data are all open and meant to
          be argued with. Expansion to full state and national coverage is underway.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/methodology" className="rounded-lg bg-civic px-4 py-2 font-600 text-paper-raised hover:bg-civic-bright">
          Read the method
        </Link>
        <Link href="/rankings" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
          See the rankings
        </Link>
      </div>
    </div>
  );
}
