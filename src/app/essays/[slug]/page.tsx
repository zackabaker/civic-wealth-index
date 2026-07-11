import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ESSAYS, getEssay } from "@/content/essays";

export function generateStaticParams() {
  return ESSAYS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getEssay(slug);
  if (!e) return {};
  return { title: e.title, description: e.dek };
}

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getEssay(slug);
  if (!e) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-14">
      <Link href="/essays" className="text-sm text-ink-faint hover:text-civic">
        ← Essays
      </Link>
      <div className="mt-4 text-xs uppercase tracking-wider text-gold">
        {fmt(e.date)} · {e.readMins} min read
      </div>
      <h1 className="mt-2 font-display text-4xl font-600 leading-tight tracking-tight text-ink md:text-5xl">
        {e.title}
      </h1>
      <p className="mt-4 font-display text-xl italic leading-snug text-ink-soft">{e.dek}</p>

      <div className="rule-civic my-8" />

      <div className="space-y-5">
        {e.body.map((b, i) => {
          if (b.t === "h2")
            return (
              <h2 key={i} className="pt-4 font-display text-2xl font-600 tracking-tight text-ink">
                {b.x}
              </h2>
            );
          if (b.t === "quote")
            return (
              <figure key={i} className="my-6 border-l-4 border-gold pl-5">
                <blockquote className="font-display text-xl italic leading-snug text-ink">
                  &ldquo;{b.x}&rdquo;
                </blockquote>
                {b.cite && <figcaption className="mt-2 text-sm text-ink-faint">— {b.cite}</figcaption>}
              </figure>
            );
          return (
            <p key={i} className="text-lg leading-relaxed text-ink">
              {b.x}
            </p>
          );
        })}
      </div>

      <div className="mt-12 rounded-xl border border-line bg-paper-raised/60 p-6">
        <p className="text-ink-soft">
          See how these observations become numbers — every place scored on seven pillars of civic
          wealth.
        </p>
        <Link href="/rankings" className="mt-3 inline-block text-sm font-600 text-civic hover:underline">
          Explore the rankings →
        </Link>
      </div>
    </article>
  );
}
