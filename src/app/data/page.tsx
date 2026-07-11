import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Bits";
import { CWI_VERSION } from "@/lib/config";
import { getScoredPlaces } from "@/lib/data";
import { CiteBox } from "@/components/CiteBox";

export const metadata: Metadata = {
  title: "Data & Citation",
  description:
    "Download the full Civic Wealth Index dataset (CSV/JSON), read the license, and cite the index.",
};

const REPO = "https://github.com/zackabaker/civic-wealth-index";

export default function DataPage() {
  const places = getScoredPlaces();
  const inCount = places.filter((p) => p.state === "IN").length;

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Civic Wealth Index",
    version: CWI_VERSION,
    description:
      "A measure of the accumulated stock of public wealth in American places — infrastructure, parks, schools, health, safety, civic fabric, and stewardship — scored 0-100 against national benchmarks, with the Sovereignty Gap comparing public to private wealth.",
    url: "https://civicwealthindex.org",
    creator: { "@type": "Organization", name: "Civic Wealth Index" },
    license: "https://creativecommons.org/licenses/by/4.0/",
    distribution: [
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://civicwealthindex.org/download/cwi.csv" },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://civicwealthindex.org/download/cwi.json" },
    ],
    spatialCoverage: "Indiana, United States",
    temporalCoverage: "2025/2026",
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <Eyebrow>Open data</Eyebrow>
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        Data &amp; citation
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        The Civic Wealth Index is open. Every score, and the inputs behind it, is downloadable and
        free to reuse with attribution. This is {CWI_VERSION}, covering all {inCount} Indiana
        counties plus out-of-state anchors.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="/download/cwi.csv" className="group rounded-xl border border-line bg-paper-raised p-5 transition-colors hover:border-civic">
          <div className="font-display text-lg font-600 text-ink group-hover:text-civic">Download CSV</div>
          <p className="mt-1 text-sm text-ink-soft">
            One row per place: composite, private-wealth, Sovereignty Gap, and all seven pillar scores.
          </p>
        </a>
        <a href="/download/cwi.json" className="group rounded-xl border border-line bg-paper-raised p-5 transition-colors hover:border-civic">
          <div className="font-display text-lg font-600 text-ink group-hover:text-civic">Download JSON</div>
          <p className="mt-1 text-sm text-ink-soft">
            The same scores, structured, with dataset version and license metadata.
          </p>
        </a>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">License</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          The Civic Wealth Index data and scores are released under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-civic hover:underline">
            Creative Commons Attribution 4.0
          </a>
          . Use it, remix it, build on it — just credit the Civic Wealth Index and link back.
          Underlying source data belongs to its original providers (Census, CDC, County Health
          Rankings, OpenStreetMap, FHWA, and others named on the{" "}
          <Link href="/methodology" className="text-civic hover:underline">methodology page</Link>).
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Source code</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          The scoring engine, data pipeline, and this site are open source. Read exactly how every
          number is produced, file an issue, or send a correction.
        </p>
        <a href={REPO} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-600 text-civic hover:underline">
          View the repository on GitHub →
        </a>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Cite this</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Writing about a place? Please cite the index and link to the specific scorecard.
        </p>
        <div className="mt-4">
          <CiteBox />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Corrections</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Found a number that looks wrong, or have better data for a county? That&apos;s exactly the
          kind of note that improves the index. Open an issue on{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-civic hover:underline">GitHub</a>{" "}
          or get in touch. Estimate-tier counties especially are meant to be upgraded to researched
          data over time, and corrections are logged with each version.
        </p>
      </section>
    </div>
  );
}
