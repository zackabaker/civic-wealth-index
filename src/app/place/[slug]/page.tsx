import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PillarBreakdown from "@/components/PillarBreakdown";
import { ScoreDial, GapPill, Eyebrow } from "@/components/Bits";
import { CiteBox } from "@/components/CiteBox";
import { getAllSlugs, getPlace, getNarrative } from "@/lib/data";
import { formatPop, gapSentence, scoreColor, formatValue } from "@/lib/format";
import { getRawPlace } from "@/lib/data";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};
  return {
    title: `${place.name}, ${place.state}`,
    description: `Civic Wealth Index ${place.cwi.toFixed(
      0
    )}/100 for ${place.name}, ${place.state}. How its public realm measures up to its private wealth.`,
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();
  const raw = getRawPlace(slug);
  const narrative = getNarrative(slug);

  const best = [...place.pillars].sort((a, b) => b.score - a.score)[0];
  const worst = [...place.pillars].sort((a, b) => a.score - b.score)[0];

  return (
    <article className="mx-auto max-w-5xl px-5 py-12">
      <Link href="/rankings" className="text-sm text-ink-faint hover:text-civic">
        ← All places
      </Link>

      {/* Header */}
      <header className="mt-4 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <Eyebrow>
            {place.metro}
            {place.fieldSurveyed && " · Field-surveyed"}
          </Eyebrow>
          <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
            {place.name}, {place.state}
          </h1>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-ink-faint">Population</dt>
              <dd className="tnum font-600 text-ink">{formatPop(place.population)}</dd>
            </div>
            {place.seat && (
              <div>
                <dt className="text-ink-faint">County seat</dt>
                <dd className="font-600 text-ink">{place.seat}</dd>
              </div>
            )}
            {place.keyPlaces && place.keyPlaces.length > 0 && (
              <div className="max-w-xs">
                <dt className="text-ink-faint">Includes</dt>
                <dd className="font-600 text-ink">{place.keyPlaces.join(", ")}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="flex items-center gap-6 rounded-2xl border border-line bg-paper-raised p-6">
          <ScoreDial score={place.cwi} />
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-ink-faint">Sovereignty Gap</div>
              <div className="mt-1">
                <GapPill gap={place.sovereigntyGap} />
              </div>
            </div>
            <div>
              <div className="text-ink-faint">Private wealth score</div>
              <div className="tnum font-600 text-ink-soft">
                {place.privateWealthScore.toFixed(0)}/100
              </div>
            </div>
          </div>
        </div>
      </header>

      {place.profile === "estimate" && (
        <div className="mt-8 rounded-xl border border-gold/40 bg-gold/5 px-5 py-3 text-sm text-ink-soft">
          <strong className="text-ink">Estimate.</strong> Measured values from County Health
          Rankings 2025 and OpenStreetMap; remaining metrics modeled from urbanicity. Not yet
          individually researched. Quality flags on every metric below.
        </div>
      )}

      {/* Reading of the gap */}
      <div className="mt-8 rounded-xl border-l-4 bg-paper-raised/70 px-5 py-4"
        style={{ borderColor: scoreColor(100 - Math.abs(place.sovereigntyGap)) }}>
        <p className="leading-relaxed text-ink">
          <strong>{place.name}</strong> {gapSentence(place.sovereigntyGap)}. Its strongest pillar is{" "}
          <strong style={{ color: scoreColor(best.score) }}>{best.label}</strong> ({best.score.toFixed(0)}),
          its weakest is{" "}
          <strong style={{ color: scoreColor(worst.score) }}>{worst.label}</strong> ({worst.score.toFixed(0)}).
        </p>
      </div>

      {/* Pillar breakdown */}
      <section className="mt-10">
        <h2 className="mb-1 font-display text-2xl font-600 tracking-tight text-ink">
          The seven pillars
        </h2>
        <div className="rule-civic mb-5 mt-2 max-w-xs" />
        <PillarBreakdown pillars={place.pillars} />
      </section>

      {/* Written profile, collapsed below the data */}
      {narrative && (
        <details className="group mt-10 max-w-2xl rounded-xl border border-line bg-paper-raised/60">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5">
            <span className="font-600 text-ink">Written profile</span>
            <span className="text-ink-faint transition-transform group-open:rotate-180" aria-hidden>
              ▾
            </span>
          </summary>
          <div className="border-t border-line px-5 py-4">
            {narrative.sections.map((s, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <h3 className="font-display text-xl font-600 tracking-tight text-ink">{s.heading}</h3>
                <div className="mt-2 space-y-3">
                  {s.body.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-ink-soft">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Private wealth footnote */}
      {raw && (
        <section className="mt-10 rounded-xl border border-line bg-paper-raised/60 p-5 text-sm">
          <h3 className="font-600 text-ink">Private wealth inputs</h3>
          <p className="mt-1 text-ink-faint">
            These drive the Sovereignty Gap but are not part of the Civic Wealth Index itself.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-10 gap-y-2">
            {[raw.privateWealth.medianHouseholdIncome, raw.privateWealth.medianHomeValue].map((m) => (
              <div key={m.key}>
                <div className="text-ink-faint">{m.label}</div>
                <div className="tnum font-600 text-ink">
                  {formatValue(m)}{" "}
                  <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-400 text-civic hover:underline">
                    {m.source} {m.year}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/compare" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
          Compare with another place
        </Link>
        <Link href="/methodology" className="rounded-lg border border-line-strong px-4 py-2 font-600 text-ink hover:bg-line/50">
          How these are scored
        </Link>
      </div>

      <section className="mt-10">
        <h3 className="mb-2 text-sm font-600 uppercase tracking-wide text-ink-faint">Cite this page</h3>
        <CiteBox place={{ name: place.name, state: place.state, slug: place.slug, cwi: place.cwi }} />
      </section>
    </article>
  );
}
