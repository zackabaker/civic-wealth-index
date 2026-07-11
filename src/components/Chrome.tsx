import Link from "next/link";
import { CWI_VERSION } from "@/lib/config";

const NAV = [
  { href: "/rankings", label: "Rankings" },
  { href: "/compare", label: "Compare" },
  { href: "/gaps", label: "The Gap" },
  { href: "/methodology", label: "Method" },
  { href: "/essays", label: "Essays" },
  { href: "/data", label: "Data" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <Seal className="h-8 w-8 text-civic transition-transform group-hover:rotate-6" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-600 tracking-tight text-ink">
              Civic Wealth Index
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              A balance sheet for places
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 text-sm font-500 text-ink-soft transition-colors hover:bg-line/60 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/rankings"
          className="rounded-md bg-civic px-3 py-1.5 text-sm font-600 text-paper-raised transition-colors hover:bg-civic-bright md:hidden"
        >
          Rankings
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-raised/60">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <Seal className="h-6 w-6 text-civic" />
              <span className="font-display text-base font-600">Civic Wealth Index</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              A public measure of what American communities have built to last —
              the wealth GDP can&apos;t see. Independent, open-method, {CWI_VERSION}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-ink-soft hover:text-ink">
                {n.label}
              </Link>
            ))}
            <Link href="/about" className="text-ink-soft hover:text-ink">
              About
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-faint md:flex-row md:justify-between">
          <span>
            &ldquo;We are building this city for our children and grandchildren and
            people we will never know.&rdquo;
          </span>
          <span className="tnum">Civic Wealth Index {CWI_VERSION} · public data, open method</span>
        </div>
      </div>
    </footer>
  );
}

/** A simple engraved-seal mark: concentric ring with a rising column/spire. */
export function Seal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* stacked bars rising — accumulated stock */}
      <rect x="9" y="18" width="3.4" height="6" rx="0.6" fill="currentColor" />
      <rect x="14.3" y="13" width="3.4" height="11" rx="0.6" fill="currentColor" />
      <rect x="19.6" y="8.5" width="3.4" height="15.5" rx="0.6" fill="currentColor" />
    </svg>
  );
}
