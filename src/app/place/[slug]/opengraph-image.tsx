import { ImageResponse } from "next/og";
import { getAllSlugs, getPlace } from "@/lib/data";
import { gapLabel } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Concrete hex colors (satori can't resolve CSS variables).
function scoreHex(s: number): string {
  if (s >= 75) return "#2f7d54";
  if (s >= 60) return "#5c8a3a";
  if (s >= 45) return "#c9a227";
  if (s >= 30) return "#cc7a2a";
  return "#c0492f";
}
function gapHex(g: number): string {
  if (g <= -8) return "#2f7d54";
  if (g < 8) return "#c9a227";
  return "#c0492f";
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) {
    return new ImageResponse(<div style={{ display: "flex" }}>Civic Wealth Index</div>, size);
  }
  const gapSign = p.sovereigntyGap > 0 ? "+" : "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f4ec",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 40, height: 40, borderRadius: 20, border: "3px solid #1f5c3d" }} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#1b1a16" }}>
              Civic Wealth Index
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#8a887c" }}>{p.metro}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "#1b1a16" }}>
            {p.name}, {p.state}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 48, marginTop: 28 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 128, fontWeight: 800, lineHeight: 1, color: scoreHex(p.cwi) }}>
                {p.cwi.toFixed(0)}
              </div>
              <div style={{ display: "flex", fontSize: 24, color: "#8a887c", marginTop: 6 }}>
                Civic Wealth Index / 100
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "16px 28px",
                borderRadius: 16,
                background: gapHex(p.sovereigntyGap) + "22",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: gapHex(p.sovereigntyGap) }}>
                {gapSign}
                {p.sovereigntyGap}
              </div>
              <div style={{ display: "flex", fontSize: 22, color: gapHex(p.sovereigntyGap) }}>
                Sovereignty Gap · {gapLabel(p.sovereigntyGap)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#4b4a42" }}>
          Measuring what a place has built to last — not what it earns.
        </div>
      </div>
    ),
    size
  );
}
