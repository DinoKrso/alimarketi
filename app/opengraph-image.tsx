import { ImageResponse } from "next/og";

export const alt = "Ali Marketi - Vaša dnevna rutina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF5EC",
          color: "#12261E",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", fontSize: 42, fontWeight: 800 }}>
          <span style={{ color: "#F15E19" }}>ali</span>
          <span style={{ marginLeft: 12 }}>MARKETI</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
            Vaša dnevna rutina.
          </div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#5B6B63" }}>
            12 marketa po Sarajevu. Svježe, blizu i po pravoj cijeni.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FFFFFF",
              border: "2px solid rgba(18,38,30,0.15)",
              borderRadius: 8,
              padding: "16px 20px",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            12 marketa u Sarajevu
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#F15E19",
              color: "#12261E",
              borderRadius: 8,
              padding: "0 22px",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Katalog i akcije
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
