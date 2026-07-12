import type { Metadata } from "next";
import RankTable from "@/components/RankTable";
import GapScatter from "@/components/GapScatter";
import { getScoredPlaces } from "@/lib/data";

export const metadata: Metadata = {
  title: "Rankings",
  description:
    "American places ranked by the Civic Wealth Index — the stock of public wealth a community has built and maintained.",
};

export default function RankingsPage() {
  const places = getScoredPlaces();
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        Rankings
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        All {places.filter((p) => p.state === "IN").length} Indiana counties plus two out-of-state
        comparisons, ordered by Civic Wealth Index. Gap = private wealth score − CWI.{" "}
        <em>Estimate</em> rows use shared national data with some modeled metrics;{" "}
        <em>researched</em>/<em>field-surveyed</em> rows are individually sourced.
      </p>

      <div className="mt-10">
        <RankTable places={places} />
      </div>

      <div className="mt-16 rounded-2xl border border-line bg-paper-raised/60 p-6 md:p-8">
        <h2 className="font-display text-2xl font-600 tracking-tight text-ink">
          The same places, on two axes
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Private wealth runs left to right; civic wealth runs bottom to top. Distance from the
          dashed line is the Sovereignty Gap.
        </p>
        <div className="mt-6 max-w-2xl">
          <GapScatter places={places} />
        </div>
      </div>
    </div>
  );
}
