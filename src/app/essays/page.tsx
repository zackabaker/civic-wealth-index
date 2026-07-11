import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Bits";
import { ESSAYS } from "@/content/essays";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Field surveys and arguments on civic wealth — what GDP can't see, and what a great public realm is worth.",
};

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function EssaysPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>Essays</Eyebrow>
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        Field notes &amp; arguments
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        The index is the instrument; these are the observations behind it — what the public realm
        looks like on the ground, and why it&apos;s the wealth that matters most.
      </p>

      <div className="mt-10 divide-y divide-line">
        {ESSAYS.map((e) => (
          <Link key={e.slug} href={`/essays/${e.slug}`} className="group block py-6">
            <div className="text-xs uppercase tracking-wider text-ink-faint">
              {fmt(e.date)} · {e.readMins} min read
            </div>
            <h2 className="mt-1 font-display text-2xl font-600 tracking-tight text-ink group-hover:text-civic">
              {e.title}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{e.dek}</p>
            <span className="mt-2 inline-block text-sm font-600 text-civic">Read →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
