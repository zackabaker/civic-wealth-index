"use client";

import { useState } from "react";
import { CWI_VERSION } from "@/lib/config";

export function CiteBox({
  place,
}: {
  place?: { name: string; state: string; slug: string; cwi: number };
}) {
  const year = 2026;
  const url = place
    ? `https://civicwealthindex.org/place/${place.slug}`
    : "https://civicwealthindex.org";
  const title = place
    ? `Civic Wealth Index: ${place.name}, ${place.state}`
    : `Civic Wealth Index (${CWI_VERSION})`;

  const apa = `Civic Wealth Index. (${year}). ${title}. Retrieved from ${url}`;
  const bibtex = `@misc{cwi_${place ? place.slug.replace(/-/g, "_") : "dataset"}_${year},
  title  = {${title}},
  author = {{Civic Wealth Index}},
  year   = {${year}},
  note   = {Version ${CWI_VERSION}},
  url    = {${url}}
}`;

  const [tab, setTab] = useState<"apa" | "bibtex">("apa");
  const [copied, setCopied] = useState(false);
  const text = tab === "apa" ? apa : bibtex;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked; ignore */
    }
  };

  return (
    <div className="rounded-xl border border-line bg-paper-raised">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex gap-1">
          {(["apa", "bibtex"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-2.5 py-1 text-xs font-600 uppercase tracking-wide transition-colors ${
                tab === t ? "bg-civic text-paper-raised" : "text-ink-faint hover:bg-line/60"
              }`}
            >
              {t === "apa" ? "APA" : "BibTeX"}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="rounded-md px-2.5 py-1 text-xs font-600 text-civic hover:bg-line/60"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words px-4 py-3 text-xs leading-relaxed text-ink-soft">
        {text}
      </pre>
    </div>
  );
}
