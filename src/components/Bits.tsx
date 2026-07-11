import { scoreColor, gapColor, gapLabel } from "@/lib/format";

/** Big circular CWI score dial. */
export function ScoreDial({
  score,
  size = 132,
  label = "CWI",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="7" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <span className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-600 tnum leading-none" style={{ color: scoreColor(score) }}>
          {score.toFixed(0)}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink-faint">{label}</span>
      </span>
    </div>
  );
}

/** Horizontal 0-100 bar for a pillar or metric score. */
export function ScoreBar({
  score,
  height = 8,
}: {
  score: number | null;
  height?: number;
}) {
  const pct = score === null ? 0 : Math.max(0, Math.min(100, score));
  return (
    <div
      className="relative w-full overflow-hidden rounded-full bg-line"
      style={{ height }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-[width]"
        style={{ width: `${pct}%`, background: scoreColor(score) }}
      />
    </div>
  );
}

/** Sovereignty Gap pill: signed number + verdict. */
export function GapPill({ gap, compact = false }: { gap: number; compact?: boolean }) {
  const sign = gap > 0 ? "+" : "";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-600"
      style={{ background: `color-mix(in srgb, ${gapColor(gap)} 14%, transparent)`, color: gapColor(gap) }}
    >
      <span className="tnum">{sign}{gap}</span>
      {!compact && <span className="font-500 opacity-80">· {gapLabel(gap)}</span>}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs font-600 uppercase tracking-[0.16em] text-gold">{children}</div>
  );
}

export function QualityDot({ quality }: { quality: string }) {
  const map: Record<string, string> = {
    measured: "var(--civic-bright)",
    field: "var(--gold)",
    partial: "var(--gap-mid)",
    modeled: "var(--ink-faint)",
    missing: "var(--line-strong)",
  };
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ background: map[quality] ?? "var(--ink-faint)" }}
      title={quality}
    />
  );
}
