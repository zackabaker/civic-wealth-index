import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const Col = ({
    place,
    sub,
    color,
    rb,
    cwi,
  }: {
    place: string;
    sub: string;
    color: string;
    rb: string;
    cwi: string;
  }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 380 }}>
      <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color }}>{place}</div>
      <div style={{ display: "flex", fontSize: 20, color: "#8a887c", marginBottom: 20 }}>{sub}</div>
      <div style={{ display: "flex", fontSize: 120, fontWeight: 800, lineHeight: 1, color }}>{rb}</div>
      <div style={{ display: "flex", fontSize: 20, color: "#4b4a42" }}>roundabouts</div>
      <div style={{ display: "flex", fontSize: 26, color: "#4b4a42", marginTop: 16 }}>
        Civic Wealth {cwi}
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f4ec",
          padding: "52px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#1b1a16" }}>
            Civic Wealth Index
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#8a887c" }}>the receipts</div>
        </div>

        <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#1b1a16", marginTop: 20 }}>
          Rich isn&apos;t the same as well-built.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 30 }}>
          <Col place="Carmel" sub="Hamilton County, IN" color="#1f5c3d" rb="539" cwi="80" />
          <div style={{ display: "flex", fontSize: 40, color: "#8a887c" }}>vs</div>
          <Col place="Williamson" sub="Franklin, TN (richer)" color="#c0492f" rb="109" cwi="65" />
        </div>
      </div>
    ),
    size
  );
}
