"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { gapColor } from "@/lib/format";
import type { ScoredPlace } from "@/lib/types";

type P = Pick<
  ScoredPlace,
  "slug" | "name" | "state" | "cwi" | "privateWealthScore" | "sovereigntyGap"
>;

export default function GapScatter({ places }: { places: P[] }) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);

  // viewBox coordinate system; axes run 0..100 in data space.
  const W = 640;
  const H = 520;
  const M = { t: 28, r: 28, b: 56, l: 60 };
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;

  const x = (v: number) => M.l + (v / 100) * iw;
  const y = (v: number) => M.t + (1 - v / 100) * ih;

  const ticks = [0, 25, 50, 75, 100];

  return (
    <figure className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[520px]"
          role="img"
          aria-label="Scatter plot of private wealth versus civic wealth for each place"
        >
          {/* shaded triangles: above diagonal = over-delivers (green), below = under-delivers (red) */}
          <polygon
            points={`${x(0)},${y(0)} ${x(100)},${y(100)} ${x(0)},${y(100)}`}
            fill="color-mix(in srgb, var(--gap-good) 8%, transparent)"
          />
          <polygon
            points={`${x(0)},${y(0)} ${x(100)},${y(100)} ${x(100)},${y(0)}`}
            fill="color-mix(in srgb, var(--gap-bad) 8%, transparent)"
          />

          {/* grid */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} y1={M.t} x2={x(t)} y2={M.t + ih} stroke="var(--line)" strokeWidth="1" />
              <line x1={M.l} y1={y(t)} x2={M.l + iw} y2={y(t)} stroke="var(--line)" strokeWidth="1" />
              <text x={x(t)} y={M.t + ih + 20} textAnchor="middle" className="tnum" fontSize="11" fill="var(--ink-faint)">
                {t}
              </text>
              <text x={M.l - 10} y={y(t) + 4} textAnchor="end" className="tnum" fontSize="11" fill="var(--ink-faint)">
                {t}
              </text>
            </g>
          ))}

          {/* the line of expectation: civic wealth = private wealth */}
          <line
            x1={x(0)}
            y1={y(0)}
            x2={x(100)}
            y2={y(100)}
            stroke="var(--ink-faint)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text x={x(88)} y={y(96)} fontSize="11" fill="var(--ink-faint)" className="italic">
            line of expectation
          </text>

          {/* zone labels */}
          <text x={x(6)} y={y(90)} fontSize="12" fill="var(--gap-good)" fontWeight="600" opacity="0.9">
            builds beyond its means
          </text>
          <text x={x(52)} y={y(12)} fontSize="12" fill="var(--gap-bad)" fontWeight="600" opacity="0.9">
            rich, little to show
          </text>

          {/* points */}
          {places.map((p) => {
            const cx = x(p.privateWealthScore);
            const cy = y(p.cwi);
            const active = hover === p.slug;
            return (
              <g
                key={p.slug}
                className="cursor-pointer"
                onMouseEnter={() => setHover(p.slug)}
                onMouseLeave={() => setHover(null)}
                onClick={() => router.push(`/place/${p.slug}`)}
              >
                {/* drop line to the diagonal shows the size of the gap */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={x(p.privateWealthScore)}
                  y2={y(p.privateWealthScore)}
                  stroke={gapColor(p.sovereigntyGap)}
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray="2 3"
                  opacity={active ? 0.9 : 0.4}
                />
                <circle cx={cx} cy={cy} r={active ? 9 : 7} fill={gapColor(p.sovereigntyGap)} stroke="var(--paper-raised)" strokeWidth="2" />
                <text
                  x={cx + 12}
                  y={cy + 4}
                  fontSize={active ? "13" : "12"}
                  fontWeight={active ? "700" : "600"}
                  fill="var(--ink)"
                >
                  {p.name.replace(" County", "")}
                </text>
              </g>
            );
          })}

          {/* axis titles */}
          <text x={M.l + iw / 2} y={H - 8} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--ink-soft)">
            Private wealth →
          </text>
          <text
            x={16}
            y={M.t + ih / 2}
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="600"
            fill="var(--ink-soft)"
            transform={`rotate(-90 16 ${M.t + ih / 2})`}
          >
            Civic wealth (CWI) →
          </text>
        </svg>
      </div>
      <figcaption className="mt-3 text-sm text-ink-soft">
        Each place sits at its private wealth (income &amp; home values) against its Civic
        Wealth Index. On the dashed line, the two match. <span style={{ color: "var(--gap-bad)" }}>Below</span> it,
        a place is richer than its public realm shows; <span style={{ color: "var(--gap-good)" }}>above</span>,
        it has built more than its incomes would predict. Click a dot for the full scorecard.
      </figcaption>
    </figure>
  );
}
