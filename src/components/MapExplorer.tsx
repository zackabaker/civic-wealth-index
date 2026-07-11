"use client";

import { useState } from "react";
import MapIndiana from "./MapIndiana";

type Cell = { cwi: number; gap: number; name: string; profile?: string };

export default function MapExplorer({ data }: { data: Record<string, Cell> }) {
  const [metric, setMetric] = useState<"cwi" | "gap">("cwi");

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-ink-faint">Color by:</span>
        <div className="inline-flex rounded-lg border border-line bg-paper-raised p-0.5">
          {(["cwi", "gap"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-md px-3 py-1.5 text-sm font-600 transition-colors ${
                metric === m ? "bg-civic text-paper-raised" : "text-ink-soft hover:bg-line/60"
              }`}
            >
              {m === "cwi" ? "Civic Wealth" : "Sovereignty Gap"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
        <div className="rounded-2xl border border-line bg-paper-raised/50 p-3">
          <MapIndiana data={data} metric={metric} />
        </div>
        <Legend metric={metric} />
      </div>
    </div>
  );
}

function Legend({ metric }: { metric: "cwi" | "gap" }) {
  const items =
    metric === "cwi"
      ? [
          { c: "var(--civic-bright)", l: "75+ · rich in civic wealth" },
          { c: "#5c8a3a", l: "60–75" },
          { c: "var(--gap-mid)", l: "45–60" },
          { c: "#cc7a2a", l: "30–45" },
          { c: "var(--gap-bad)", l: "under 30" },
        ]
      : [
          { c: "var(--gap-good)", l: "builds beyond its means" },
          { c: "var(--gap-mid)", l: "in balance" },
          { c: "var(--gap-bad)", l: "rich, little to show" },
        ];
  return (
    <div className="rounded-xl border border-line bg-paper-raised p-4 text-sm md:w-52">
      <div className="mb-2 font-600 text-ink">
        {metric === "cwi" ? "Civic Wealth Index" : "Sovereignty Gap"}
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.l} className="flex items-center gap-2">
            <span className="inline-block h-3.5 w-3.5 rounded" style={{ background: it.c }} />
            <span className="text-ink-soft">{it.l}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-faint">Hover a county for its score; click to open its scorecard.</p>
    </div>
  );
}
