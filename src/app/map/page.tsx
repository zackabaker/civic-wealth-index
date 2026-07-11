import type { Metadata } from "next";
import { Eyebrow } from "@/components/Bits";
import MapExplorer from "@/components/MapExplorer";
import { getScoredPlaces } from "@/lib/data";

export const metadata: Metadata = {
  title: "The map of Indiana",
  description:
    "Every Indiana county, colored by its Civic Wealth Index or its Sovereignty Gap. Hover to compare, click for the full scorecard.",
};

export default function MapPage() {
  const places = getScoredPlaces().filter((p) => p.state === "IN");
  const data = Object.fromEntries(
    places.map((p) => [p.fips, { cwi: p.cwi, gap: p.sovereigntyGap, name: p.name, profile: p.profile }])
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Eyebrow>The whole state</Eyebrow>
      <h1 className="font-display text-4xl font-600 tracking-tight text-ink md:text-5xl">
        Indiana, county by county
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Civic wealth isn&apos;t evenly spread. Color the map by the Civic Wealth Index to see where
        the public realm is deepest, or by the Sovereignty Gap to see where private wealth has —
        and hasn&apos;t — become common wealth.
      </p>

      <div className="mt-8">
        <MapExplorer data={data} />
      </div>
    </div>
  );
}
