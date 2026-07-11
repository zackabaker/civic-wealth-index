import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 44, height: 44, borderRadius: 22, border: "3px solid #1f5c3d" }} />
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#1b1a16" }}>
            Civic Wealth Index
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 800, color: "#1b1a16", lineHeight: 1.05 }}>
            GDP measures what a place earns.
          </div>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 800, color: "#1f5c3d", lineHeight: 1.05 }}>
            We measure what it has built.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#4b4a42" }}>
          A balance sheet for American places — infrastructure, parks, schools, safe streets.
        </div>
      </div>
    ),
    size
  );
}
