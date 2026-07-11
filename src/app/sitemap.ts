import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";
import { ESSAYS } from "@/content/essays";

const BASE = "https://civicwealthindex.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/rankings", "/compare", "/gaps", "/methodology", "/essays", "/about"];
  const places = getAllSlugs().map((s) => `/place/${s}`);
  const essays = ESSAYS.map((e) => `/essays/${e.slug}`);
  return [...staticPaths, ...places, ...essays].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date("2026-07-11"),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
