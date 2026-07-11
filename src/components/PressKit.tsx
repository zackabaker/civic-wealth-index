"use client";

import { useState } from "react";

type Item = { name: string; slug: string; blurb: string };

export default function PressKit({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const filtered = q
    ? items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()))
    : items;

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find your county…"
        className="mb-5 w-full rounded-lg border border-line-strong bg-paper-raised px-4 py-2.5 text-sm focus:border-civic focus:outline-none"
      />
      <div className="space-y-3">
        {filtered.map((i) => (
          <Card key={i.slug} item={i} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-ink-faint">No county matches &ldquo;{q}&rdquo;.</p>}
      </div>
    </div>
  );
}

function Card({ item }: { item: Item }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.blurb);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="rounded-xl border border-line bg-paper-raised p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-600 text-ink">{item.name}</span>
        <button onClick={copy} className="rounded-md px-2.5 py-1 text-xs font-600 text-civic hover:bg-line/60">
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft">{item.blurb}</p>
    </div>
  );
}
