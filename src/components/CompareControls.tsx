"use client";

import { useRouter } from "next/navigation";

type Opt = { slug: string; name: string; state: string };

export default function CompareControls({
  options,
  a,
  b,
}: {
  options: Opt[];
  a: string;
  b: string;
}) {
  const router = useRouter();
  const go = (na: string, nb: string) => router.push(`/compare?a=${na}&b=${nb}`);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={a} exclude={b} options={options} onChange={(v) => go(v, b)} />
      <span className="text-ink-faint">vs</span>
      <Select value={b} exclude={a} options={options} onChange={(v) => go(a, v)} />
    </div>
  );
}

function Select({
  value,
  exclude,
  options,
  onChange,
}: {
  value: string;
  exclude: string;
  options: Opt[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-line-strong bg-paper-raised px-3 py-2 text-sm font-600 text-ink focus:border-civic focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.slug} value={o.slug} disabled={o.slug === exclude}>
          {o.name}, {o.state}
        </option>
      ))}
    </select>
  );
}
