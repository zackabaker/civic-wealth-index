"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { scoreColor, gapColor } from "@/lib/format";

type PlaceLite = {
  slug: string;
  name: string;
  state: string;
  profile?: string;
  pw: number;
  pillars: Record<string, number>;
};

const PILLARS: { key: string; label: string; def: number }[] = [
  { key: "movement", label: "Movement", def: 20 },
  { key: "publicRealm", label: "Public Realm", def: 20 },
  { key: "education", label: "Education", def: 15 },
  { key: "healthSafety", label: "Health & Safety", def: 15 },
  { key: "systems", label: "Systems", def: 10 },
  { key: "civicFabric", label: "Civic Fabric", def: 10 },
  { key: "stewardship", label: "Stewardship", def: 10 },
];

export default function WeightsExplorer({ places }: { places: PlaceLite[] }) {
  const [w, setW] = useState<Record<string, number>>(
    Object.fromEntries(PILLARS.map((p) => [p.key, p.def]))
  );

  const total = Object.values(w).reduce((a, b) => a + b, 0) || 1;

  const ranked = useMemo(() => {
    const scored = places.map((p) => {
      const cwi =
        PILLARS.reduce((s, pl) => s + (w[pl.key] / total) * (p.pillars[pl.key] ?? 0), 0);
      return { ...p, cwi, gap: Math.round(p.pw - cwi) };
    });
    return scored.sort((a, b) => b.cwi - a.cwi);
  }, [w, total, places]);

  const reset = () => setW(Object.fromEntries(PILLARS.map((p) => [p.key, p.def])));
  const isDefault = PILLARS.every((p) => w[p.key] === p.def);

  return (
    <div className="not-prose grid gap-6 md:grid-cols-[300px_1fr]">
      {/* Sliders */}
      <div className="rounded-xl border border-line bg-paper-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-600 text-ink">Pillar weights</span>
          <button
            onClick={reset}
            disabled={isDefault}
            className="text-xs font-600 text-civic disabled:text-ink-faint disabled:opacity-50 hover:underline"
          >
            Reset
          </button>
        </div>
        {PILLARS.map((p) => (
          <div key={p.key} className="mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">{p.label}</span>
              <span className="tnum font-600 text-ink">{Math.round((w[p.key] / total) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={w[p.key]}
              onChange={(e) => setW({ ...w, [p.key]: Number(e.target.value) })}
              className="mt-1 w-full accent-[var(--civic)]"
            />
          </div>
        ))}
        <p className="mt-2 text-xs text-ink-faint">
          Weights normalize to 100%. Watch the ranking re-sort as you shift them.
        </p>
      </div>

      {/* Live ranking */}
      <div className="rounded-xl border border-line bg-paper-raised">
        <div className="border-b border-line px-4 py-2 text-xs uppercase tracking-wider text-ink-faint">
          Live ranking {isDefault && "· default weights (v0.1)"}
        </div>
        <ol className="max-h-[420px] overflow-y-auto">
          {ranked.slice(0, 20).map((p, i) => (
            <li key={p.slug} className="flex items-center gap-3 border-b border-line/60 px-4 py-2 text-sm last:border-0">
              <span className="tnum w-5 text-ink-faint">{i + 1}</span>
              <Link href={`/place/${p.slug}`} className="flex-1 truncate font-500 text-ink hover:text-civic">
                {p.name}, {p.state}
              </Link>
              <span className="tnum w-8 text-right font-600" style={{ color: scoreColor(p.cwi) }}>
                {p.cwi.toFixed(0)}
              </span>
              <span className="tnum w-10 text-right text-xs" style={{ color: gapColor(p.gap) }}>
                {p.gap > 0 ? "+" : ""}
                {p.gap}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
