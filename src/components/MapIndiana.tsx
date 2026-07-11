"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import mapData from "@/content/in-map.json";
import { scoreColor, gapColor } from "@/lib/format";

type Cell = { cwi: number; gap: number; name: string; profile?: string };

export default function MapIndiana({
  data,
  metric = "cwi",
}: {
  data: Record<string, Cell>;
  metric?: "cwi" | "gap";
}) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const { width, height, counties } = mapData as {
    width: number;
    height: number;
    counties: { fips: string; name: string; slug: string; d: string }[];
  };

  const fill = (fips: string) => {
    const c = data[fips];
    if (!c) return "var(--line)";
    return metric === "gap" ? gapColor(c.gap) : scoreColor(c.cwi);
  };

  const hovered = hover ? data[hover] : null;
  const hoveredCounty = hover ? counties.find((c) => c.fips === hover) : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Map of Indiana counties by Civic Wealth Index">
        {counties.map((c) => {
          const active = hover === c.fips;
          return (
            <path
              key={c.fips}
              d={c.d}
              fill={fill(c.fips)}
              stroke={active ? "var(--ink)" : "var(--paper)"}
              strokeWidth={active ? 2.5 : 1}
              opacity={data[c.fips] ? (active ? 1 : 0.9) : 0.5}
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHover(c.fips)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/place/${c.slug}`)}
            />
          );
        })}
      </svg>

      {hovered && hoveredCounty && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-line bg-paper-raised/95 px-3 py-2 text-sm shadow-sm backdrop-blur">
          <div className="font-600 text-ink">{hovered.name}</div>
          <div className="tnum text-xs text-ink-soft">
            CWI {hovered.cwi.toFixed(0)} · Gap {hovered.gap > 0 ? "+" : ""}
            {hovered.gap}
          </div>
        </div>
      )}
    </div>
  );
}
