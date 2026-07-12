import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Bits";
import { getValidationStudy } from "@/lib/data";

export const metadata: Metadata = {
  title: "Does civic wealth pay?",
  description:
    "We tested whether a place's civic wealth predicts its growth. The honest answer is a null result — and it clarifies exactly what the index does and doesn't claim.",
};

export default function ValidationPage() {
  const s = getValidationStudy();
  if (!s) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-ink-soft">The validation study is being prepared.</p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>Validation study</Eyebrow>
      <h1 className="font-display text-4xl font-600 leading-tight tracking-tight text-ink md:text-5xl">
        Does civic wealth predict growth?
      </h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        Test: CWI vs. 2020–2024 population change, 92 Indiana counties. Result: no, once income is
        controlled for.
      </p>

      <div className="rule-civic my-8" />

      {/* headline numbers */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <Num n={s.cwiGrowthCorrelation !== null ? s.cwiGrowthCorrelation.toFixed(2) : "—"} l="CWI vs. growth (raw)" />
        <Num n="0.77" l="Income vs. growth" tone="warn" />
        <Num n="0.03" l="CWI vs. growth, income held constant" tone="bad" />
      </div>

      <div className="mt-8 rounded-xl border-l-4 border-gap-bad bg-paper-raised/70 px-5 py-4">
        <p className="leading-relaxed text-ink">{s.headline}</p>
      </div>

      {/* findings */}
      <section className="mt-10 space-y-8">
        {s.findings.map((f, i) => (
          <div key={i}>
            <h2 className="font-display text-2xl font-600 tracking-tight text-ink">{f.heading}</h2>
            <div className="mt-3 space-y-4">
              {f.body.map((p, j) => (
                <p key={j} className="text-lg leading-relaxed text-ink-soft">{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-xl border border-line bg-paper-raised/70 p-5">
        <p className="leading-relaxed text-ink-soft">
          <strong className="text-ink">Scope note:</strong> the index claims civic wealth is worth
          measuring, not that it causes growth. This test checks the stronger claim and rejects it;
          the descriptive use is unaffected. Caveats below.
        </p>
      </section>

      {/* standouts */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Notable cases</h2>
        <div className="mt-4 space-y-3">
          {s.standouts.map((st) => (
            <div key={st.county} className="rounded-xl border border-line bg-paper-raised px-4 py-3">
              <div className="font-600 text-ink">{st.county}</div>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{st.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* caveats */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Limitations</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Based on {s.n} counties.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-soft">
          {s.caveats.map((c, i) => (
            <li key={i} className="leading-relaxed">{c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 text-sm text-ink-faint">
        <div className="font-600 text-ink-soft">Sources</div>
        <ul className="mt-2 space-y-1">
          {s.sources.map((u) => (
            <li key={u}>
              <a href={u} target="_blank" rel="noopener noreferrer" className="text-civic hover:underline break-all">
                {u}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link href="/gaps" className="text-sm font-600 text-civic hover:underline">
          What the index does claim — the Sovereignty Gap →
        </Link>
      </div>
    </article>
  );
}

function Num({ n, l, tone }: { n: string; l: string; tone?: "warn" | "bad" }) {
  const color = tone === "bad" ? "var(--gap-bad)" : tone === "warn" ? "var(--gap-mid)" : "var(--civic)";
  return (
    <div className="rounded-xl border border-line bg-paper-raised p-4">
      <div className="font-display text-4xl font-700 tnum" style={{ color }}>{n}</div>
      <div className="mt-1 text-xs text-ink-faint">{l}</div>
    </div>
  );
}
