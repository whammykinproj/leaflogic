import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JobScout AI — Jobs found. Pitches drafted. While you sleep.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#10b981",
            }}
          >
            JobScout
          </span>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 400,
              color: "#71717a",
              marginLeft: "12px",
            }}
          >
            AI
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          Jobs found. Pitches drafted.
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#10b981",
            textAlign: "center",
            lineHeight: 1.2,
            marginTop: "8px",
          }}
        >
          While you sleep.
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            marginTop: "32px",
            textAlign: "center",
          }}
        >
          AI-powered daily job digest with personalized pitches — $29/mo
        </div>
      </div>
    ),
    { ...size }
  );
}
