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
      <Eyebrow>An honest test</Eyebrow>
      <h1 className="font-display text-4xl font-600 leading-tight tracking-tight text-ink md:text-5xl">
        Does civic wealth pay?
      </h1>
      <p className="mt-5 font-display text-xl italic leading-snug text-ink-soft">
        We ran the obvious test — does a county&apos;s civic wealth predict its growth? — and we&apos;re
        going to tell you what we found even though it isn&apos;t the tidy answer.
      </p>

      <div className="rule-civic my-9" />

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

      {/* the reframe — why this is the point, not a problem */}
      <section className="mt-12 rounded-2xl border border-civic/30 bg-civic/5 p-6 md:p-8">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">
          Why we measure it anyway
        </h2>
        <div className="mt-3 space-y-4 text-lg leading-relaxed text-ink">
          <p>
            A null result here would sink the index only if its claim were &ldquo;civic wealth makes
            you grow.&rdquo; That was never the claim. The whole premise is that public wealth is
            worth having <em>for its own sake</em> — a great park, a safe street, a school that
            actually teaches, a bridge that doesn&apos;t fail — and worth handing to people who
            aren&apos;t born yet. That value doesn&apos;t need to show up as migration to be real.
          </p>
          <p>
            Growth is what GDP-thinking rewards, and chasing it is how Williamson County ended up
            rich and under-built. The point of this index is to name the wealth that the growth
            scoreboard can&apos;t see — not to become another growth scoreboard. So we&apos;ll report
            the honest finding, keep the caveats in plain view, and go on measuring the thing because
            it matters, not because it pays.
          </p>
        </div>
      </section>

      {/* standouts */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">The revealing cases</h2>
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
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">Everything wrong with this test</h2>
        <p className="mt-2 text-sm text-ink-soft">
          In the spirit of an instrument that invites correction, here is what we&apos;d fix given
          better data. Based on {s.n} counties.
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
