import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const alt = "Ali Marketi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const svg = await readFile(join(process.cwd(), "public/logo-ali.svg"));
  const png = await sharp(svg)
    .resize({ width: 720, height: 420, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const logoSrc = `data:image/png;base64,${png.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF5EC",
        }}
      >
        {/* Soft brand glow behind the mark */}
        <div
          style={{
            position: "absolute",
            width: 560,
            height: 560,
            borderRadius: 999,
            background: "rgba(241, 94, 25, 0.14)",
          }}
        />
        <img src={logoSrc} width={720} height={420} alt="" />
      </div>
    ),
    { ...size },
  );
}
