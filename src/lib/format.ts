import type { Metric } from "./types";

/** Color for a 0-100 score, from muted red (low) through amber to civic green (high). */
export function scoreColor(score: number | null): string {
  if (score === null) return "var(--ink-faint)";
  if (score >= 75) return "var(--civic-bright)";
  if (score >= 60) return "#5c8a3a";
  if (score >= 45) return "var(--gap-mid)";
  if (score >= 30) return "#cc7a2a";
  return "var(--gap-bad)";
}

/** Color for a Sovereignty Gap: negative (invested) green, positive (under-invested) red. */
export function gapColor(gap: number): string {
  if (gap <= -8) return "var(--gap-good)";
  if (gap < 8) return "var(--gap-mid)";
  return "var(--gap-bad)";
}

export function gapLabel(gap: number): string {
  if (gap <= -8) return "Over-delivers";
  if (gap < 8) return "In balance";
  return "Under-delivers";
}

/** Plain-language reading of a gap for a specific place. */
export function gapSentence(gap: number): string {
  if (gap <= -8)
    return "builds more public wealth than its incomes would predict";
  if (gap < 8) return "converts private wealth into public wealth at about the expected rate";
  return "has far more private wealth than public wealth to show for it";
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Format a metric value for display using its unit. */
export function formatValue(m: Metric): string {
  if (m.value === null) return "—";
  const v = m.value;
  switch (m.unit) {
    case "$":
      return money.format(v);
    case "$/capita":
    case "$/capita/yr":
      return money.format(v);
    case "%":
      return `${round(v)}%`;
    case "ratio":
      return v.toFixed(2);
    case "years":
      return `${v.toFixed(1)} yrs`;
    case "0-100":
      return `${round(v)}`;
    case "km/km":
      return v.toFixed(2);
    default:
      return `${round(v)} ${m.unit}`.trim();
  }
}

function round(v: number): string {
  if (Math.abs(v) >= 100) return Math.round(v).toLocaleString();
  if (Math.abs(v) >= 10) return v.toFixed(1).replace(/\.0$/, "");
  return v.toFixed(2).replace(/\.00$/, "");
}

export function formatPop(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export const QUALITY_LABEL: Record<string, string> = {
  measured: "Measured",
  modeled: "Modeled",
  partial: "Partial coverage",
  field: "Field survey",
  missing: "No data",
};
