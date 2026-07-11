import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Bits";
import { getScoredPlaces, getRawPlace } from "@/lib/data";
import { BENCHMARKS, CWI_VERSION, PILLAR_META, PILLAR_WEIGHTS } from "@/lib/config";
import type { PillarKey } from "@/lib/types";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How the Civic Wealth Index is built: seven pillars, national benchmark scoring, open sources, and known limitations. Version " +
    CWI_VERSION,
};

export default function MethodologyPage() {
  const places = getScoredPlaces();
  // Use any place as the schema template (all share metric metadata).
  const template = getRawPlace(places[0].slug);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>Method · {CWI_VERSION}</Eyebrow>
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        How the index is built
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        The Civic Wealth Index measures the <em>stock</em> of public wealth a community has
        accumulated and maintained — not the annual flow of economic output. Everything here is
        generated from the same configuration file that produces the scores, so the published method
        can never drift from the numbers.
      </p>

      <Section title="The principle">
        <p>
          GDP is an income statement: it counts what an economy produced this year. A place can post
          a high number while its bridges rust and its schools coast. Wealth is a balance sheet — the
          things already built and kept in good repair. Notre Dame took 180 years; a great park
          system takes generations; a network of maintained roads and sidewalks is decades of
          compounding decisions. We try to measure that accumulated stock.
        </p>
      </Section>

      <Section title="Scoring">
        <p>
          Each underlying metric is scored 0–100 against fixed <strong>national benchmark
          anchors</strong> — a value that earns a 10 (&ldquo;weak&rdquo;) and one that earns a 90
          (&ldquo;strong&rdquo;), with a straight line between and clamped at the ends. We use
          absolute anchors rather than ranking places only against each other, so a score means the
          same thing everywhere and stays stable as more places are added.
        </p>
        <p>
          Metrics roll up to a pillar score (equal weight within a pillar), and the seven pillars
          combine into the Civic Wealth Index using the weights below. When a place is missing a
          whole pillar, its weight is redistributed across the pillars that do have data, so gaps in
          coverage neither help nor hurt.
        </p>
      </Section>

      <Section title="The seven pillars &amp; their weights">
        <div className="not-prose overflow-hidden rounded-xl border border-line">
          {(Object.keys(PILLAR_META) as PillarKey[]).map((k) => (
            <div key={k} className="flex items-start gap-4 border-b border-line/70 bg-paper-raised px-4 py-3 last:border-0">
              <span className="tnum mt-0.5 w-10 shrink-0 font-600 text-gold">
                {Math.round(PILLAR_WEIGHTS[k] * 100)}%
              </span>
              <div>
                <div className="font-600 text-ink">{PILLAR_META[k].label}</div>
                <div className="text-sm text-ink-soft">{PILLAR_META[k].blurb}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Every metric &amp; source">
        <p>
          Below is the full instrument. Each metric shows its data source and the benchmark anchors
          that map it to a score.
        </p>
        {template?.pillars.map((pillar) => (
          <div key={pillar.key} className="not-prose mt-6">
            <h3 className="font-display text-lg font-600 text-ink">
              {PILLAR_META[pillar.key].label}
            </h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
                    <th className="py-2 pr-3 font-600">Metric</th>
                    <th className="py-2 pr-3 font-600">Source</th>
                    <th className="py-2 pr-3 font-600 text-right">Weak→10</th>
                    <th className="py-2 font-600 text-right">Strong→90</th>
                  </tr>
                </thead>
                <tbody>
                  {pillar.metrics.map((m) => {
                    const b = BENCHMARKS[m.key];
                    return (
                      <tr key={m.key} className="border-b border-line/60">
                        <td className="py-2 pr-3 font-500 text-ink">{m.label}</td>
                        <td className="py-2 pr-3 text-ink-soft">{m.source}</td>
                        <td className="py-2 pr-3 text-right tnum text-ink-faint">{b?.weak ?? "—"}</td>
                        <td className="py-2 text-right tnum text-ink-faint">{b?.strong ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Data quality, stated plainly">
        <p>
          Every number carries a quality flag: <strong>measured</strong> (pulled from the named
          dataset), <strong>modeled</strong> (estimated from related public facts),{" "}
          <strong>partial</strong> (real but incomplete, like crowd-mapped sidewalks),{" "}
          <strong>field</strong> (from an on-the-ground survey), or <strong>missing</strong>. In the
          pilot, some metrics are modeled where a clean county-level figure wasn&apos;t retrievable;
          those are labeled as such on every scorecard rather than hidden.
        </p>
      </Section>

      <Section title="Coverage tiers">
        <p>
          Places come at two levels of depth, labeled honestly throughout the site:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Deep profiles</strong> — individually researched, and in some cases surveyed on
            the ground. Each carries a written profile and metric-by-metric sourcing. The five pilot
            anchors are here.
          </li>
          <li>
            <strong>Estimates</strong> — scored from shared national data so an entire state can be
            covered at once. Real measures (income, life expectancy, traffic deaths, broadband, park
            access, drinking-water safety, child poverty) come from{" "}
            <a href="https://www.countyhealthrankings.org" target="_blank" rel="noopener noreferrer" className="text-civic hover:underline">
              County Health Rankings
            </a>{" "}
            and the datasets behind it; the remaining civic metrics are modeled from how urban or
            rural a county is — deliberately <em>not</em> from its income, so civic wealth stays
            independent of private wealth. Every Indiana county is covered at this tier or deeper.
          </li>
        </ul>
      </Section>

      <Section title="The Sovereignty Gap">
        <p>
          The gap is the private-wealth score minus the Civic Wealth Index, both on the same fixed
          0–100 benchmark scale. Because it&apos;s anchored rather than ranked against the current
          set of places, a county&apos;s gap doesn&apos;t change when neighbors are added — a rich,
          under-built county reads the same whether it&apos;s measured alone or against the whole
          state. Positive means private wealth outruns public wealth; negative means the public
          realm is ahead.
        </p>
      </Section>

      <Section title="Known limitations">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Crowd-mapped data (sidewalks, intersections) undercounts where mapping is sparse; we flag
            it as partial and never present it as complete.
          </li>
          <li>
            Small-population places produce noisy per-capita figures; read them with wide error bars.
          </li>
          <li>
            County-level scores blend very different communities — an affluent suburb and a
            disinvested city can share a county line. Where that matters, the scorecards note it.
          </li>
          <li>
            The weights are a starting point, published so they can be argued with. This is {CWI_VERSION}.
          </li>
        </ul>
      </Section>

      <div className="mt-12 rounded-xl border border-line bg-paper-raised/60 p-6">
        <p className="text-ink-soft">
          Want the underlying numbers? Every metric on a place page links to its source. The full
          pilot dataset and scoring code are open.
        </p>
        <Link href="/rankings" className="mt-3 inline-block text-sm font-600 text-civic hover:underline">
          Back to the rankings →
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-600 tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink-soft [&_strong]:text-ink">{children}</div>
    </section>
  );
}
