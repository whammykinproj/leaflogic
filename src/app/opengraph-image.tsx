import { ImageResponse } from "next/og";

export const alt = "LeafLogic - Indoor Plant Care Guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f3d25",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.1)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.06)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "100px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.08)",
            display: "flex",
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#34d399",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "44px",
            marginBottom: "30px",
          }}
        >
          🌿
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#34d399",
            marginBottom: "16px",
          }}
        >
          LeafLogic
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 400,
          }}
        >
          Indoor Plant Care Guides
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.3)",
          }}
        >
          leaflogic.app
        </div>
      </div>
    ),
    { ...size }
  );
}
