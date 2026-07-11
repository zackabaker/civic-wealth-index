import Link from "next/link";
import { ScoreBar, GapPill } from "./Bits";
import { scoreColor } from "@/lib/format";
import type { ScoredPlace } from "@/lib/types";

export default function RankTable({ places }: { places: ScoredPlace[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-paper-raised">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
            <th className="py-3 pl-5 pr-3 font-600">#</th>
            <th className="py-3 pr-3 font-600">Place</th>
            <th className="py-3 pr-3 font-600">Civic Wealth</th>
            <th className="hidden py-3 pr-3 font-600 sm:table-cell">Private wealth</th>
            <th className="py-3 pr-5 font-600 text-right">Sovereignty Gap</th>
          </tr>
        </thead>
        <tbody>
          {places.map((p, i) => (
            <tr
              key={p.slug}
              className="group border-b border-line/70 last:border-0 transition-colors hover:bg-line/30"
            >
              <td className="py-3.5 pl-5 pr-3 tnum text-ink-faint">{i + 1}</td>
              <td className="py-3.5 pr-3">
                <Link href={`/place/${p.slug}`} className="flex flex-col">
                  <span className="font-600 text-ink group-hover:text-civic">
                    {p.name}, {p.state}
                  </span>
                  <span className="text-xs text-ink-faint">
                    {p.metro}
                    {p.fieldSurveyed && " · field-surveyed"}
                    {!p.fieldSurveyed && p.profile === "deep" && " · researched"}
                    {p.profile === "estimate" && " · estimate"}
                  </span>
                </Link>
              </td>
              <td className="py-3.5 pr-3">
                <div className="flex items-center gap-2.5">
                  <span className="tnum w-8 font-600" style={{ color: scoreColor(p.cwi) }}>
                    {p.cwi.toFixed(0)}
                  </span>
                  <div className="w-24">
                    <ScoreBar score={p.cwi} />
                  </div>
                </div>
              </td>
              <td className="hidden py-3.5 pr-3 sm:table-cell">
                <div className="flex items-center gap-2.5">
                  <span className="tnum w-8 text-ink-soft">{p.privateWealthScore.toFixed(0)}</span>
                  <div className="w-20 opacity-70">
                    <ScoreBar score={p.privateWealthScore} height={6} />
                  </div>
                </div>
              </td>
              <td className="py-3.5 pr-5 text-right">
                <GapPill gap={p.sovereigntyGap} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
