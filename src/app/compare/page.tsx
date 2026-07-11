import type { Metadata } from "next";
import Link from "next/link";
import CompareControls from "@/components/CompareControls";
import { ScoreDial, GapPill, ScoreBar, Eyebrow } from "@/components/Bits";
import { getScoredPlaces } from "@/lib/data";
import { scoreColor } from "@/lib/format";
import type { ScoredPlace } from "@/lib/types";

export const metadata: Metadata = {
  title: "Compare places",
  description: "Compare two American places pillar by pillar on the Civic Wealth Index.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const sp = await searchParams;
  const places = getScoredPlaces();
  const options = places.map((p) => ({ slug: p.slug, name: p.name, state: p.state }));

  const a =
    places.find((p) => p.slug === sp.a) ??
    places.find((p) => p.slug === "hamilton-county-in") ??
    places[0];
  const b =
    places.find((p) => p.slug === sp.b && p.slug !== a.slug) ??
    places.find((p) => p.slug === "williamson-county-tn" && p.slug !== a.slug) ??
    places.find((p) => p.slug !== a.slug) ??
    places[1] ??
    places[0];

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Eyebrow>Head to head</Eyebrow>
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        Compare
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Two places, pillar by pillar. The default pairing — Hamilton County against Williamson
        County — is the whole thesis in one screen: similar affluence, very different public wealth.
      </p>

      <div className="mt-8">
        <CompareControls options={options} a={a.slug} b={b.slug} />
      </div>

      {/* Headline cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[a, b].map((p) => (
          <div key={p.slug} className="rounded-2xl border border-line bg-paper-raised p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Link href={`/place/${p.slug}`} className="font-display text-2xl font-600 text-ink hover:text-civic">
                  {p.name}
                </Link>
                <div className="text-sm text-ink-faint">{p.state} · {p.metro}</div>
                <div className="mt-3">
                  <GapPill gap={p.sovereigntyGap} />
                </div>
              </div>
              <ScoreDial score={p.cwi} size={104} />
            </div>
          </div>
        ))}
      </div>

      {/* Pillar comparison */}
      <div className="mt-10 rounded-2xl border border-line bg-paper-raised">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line px-5 py-3 text-xs uppercase tracking-wider text-ink-faint">
          <div className="text-right font-600">{a.name.replace(" County", "")}</div>
          <div className="text-center font-600">Pillar</div>
          <div className="font-600">{b.name.replace(" County", "")}</div>
        </div>
        {a.pillars.map((pa, i) => {
          const pb = b.pillars[i];
          return (
            <PillarRow key={pa.key} label={pa.label} left={pa.score} right={pb.score} />
          );
        })}
        <PillarRow label="Civic Wealth Index" left={a.cwi} right={b.cwi} emphasize />
      </div>
    </div>
  );
}

function PillarRow({
  label,
  left,
  right,
  emphasize = false,
}: {
  label: string;
  left: number;
  right: number;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3 ${
        emphasize ? "border-t-2 border-line-strong bg-line/20" : "border-b border-line/60"
      }`}
    >
      {/* left (mirrored) */}
      <div className="flex items-center justify-end gap-2.5">
        <span className="tnum text-sm font-600" style={{ color: scoreColor(left) }}>
          {left.toFixed(0)}
        </span>
        <div className="w-28 scale-x-[-1]">
          <ScoreBar score={left} />
        </div>
      </div>
      <div className={`w-36 text-center text-sm ${emphasize ? "font-display font-600" : "font-500 text-ink-soft"}`}>
        {label}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-28">
          <ScoreBar score={right} />
        </div>
        <span className="tnum text-sm font-600" style={{ color: scoreColor(right) }}>
          {right.toFixed(0)}
        </span>
      </div>
    </div>
  );
}
