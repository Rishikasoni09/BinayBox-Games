import { ImageResponse } from "next/og";

export const alt = "BinaryBox Games - Free Browser Games & Online HTML5 Gaming";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "radial-gradient(circle at center, #151b2e 0%, #090d16 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "40px",
          position: "relative",
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108, 92, 231, 0.25) 0%, rgba(108, 92, 231, 0) 70%)",
          }}
        />

        {/* Brand Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(108, 92, 231, 0.2)",
            border: "1px solid rgba(108, 92, 231, 0.4)",
            padding: "8px 24px",
            borderRadius: "9999px",
            fontSize: "20px",
            fontWeight: 800,
            color: "#a29bfe",
            letterSpacing: "1px",
            marginBottom: "24px",
          }}
        >
          ⚡ FREE HTML5 BROWSER GAMING
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            letterSpacing: "-2px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <span>BINARY</span>
          <span
            style={{
              background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            BOX
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: "32px",
          }}
        >
          Discover & Play Free Online Games. Zero Downloads, Instant Fun.
        </div>

        {/* Domain */}
        <div
          style={{
            fontSize: "20px",
            color: "#a29bfe",
            fontWeight: 700,
          }}
        >
          binaryboxgames.shivanshji.in
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
