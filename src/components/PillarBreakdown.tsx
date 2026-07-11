import { ScoreBar, QualityDot } from "./Bits";
import { formatValue, scoreColor, QUALITY_LABEL } from "@/lib/format";
import type { ScoredPillar } from "@/lib/types";
import { PILLAR_WEIGHTS } from "@/lib/config";

export default function PillarBreakdown({ pillars }: { pillars: ScoredPillar[] }) {
  return (
    <div className="space-y-3">
      {pillars.map((p) => (
        <details
          key={p.key}
          className="group rounded-xl border border-line bg-paper-raised open:shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-600 text-ink">{p.label}</h3>
                <span className="tnum text-sm text-ink-faint">
                  weight {Math.round(PILLAR_WEIGHTS[p.key] * 100)}%
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="tnum w-8 font-600" style={{ color: scoreColor(p.score) }}>
                  {p.score.toFixed(0)}
                </span>
                <div className="flex-1">
                  <ScoreBar score={p.score} />
                </div>
                <span className="text-ink-faint transition-transform group-open:rotate-180" aria-hidden>
                  ▾
                </span>
              </div>
            </div>
          </summary>

          <div className="border-t border-line px-5 py-4">
            <p className="mb-4 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>
            {p.coverage < 1 && (
              <p className="mb-3 text-xs text-ink-faint">
                {Math.round(p.coverage * 100)}% of this pillar&apos;s metrics have data for this place.
              </p>
            )}
            <ul className="divide-y divide-line/70">
              {p.metrics.map((m) => (
                <li key={m.key} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-500 text-ink">{m.label}</span>
                      <a
                        href={m.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-ink-faint hover:text-civic"
                        title={`${m.source} (${m.year})`}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                          <path d="M7 17L17 7M17 7H8M17 7v9" />
                        </svg>
                      </a>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-faint">
                      <QualityDot quality={m.quality} />
                      <span>{QUALITY_LABEL[m.quality] ?? m.quality}</span>
                      <span>·</span>
                      <span>{m.source}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="tnum text-sm font-600 text-ink">{formatValue(m)}</div>
                  </div>
                  <div className="w-16 shrink-0">
                    <ScoreBar score={m.score} height={6} />
                    <div className="mt-1 text-right text-[10px] tnum text-ink-faint">
                      {m.score === null ? "—" : m.score.toFixed(0)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </details>
      ))}
    </div>
  );
}
