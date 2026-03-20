import { ImageResponse } from "next/og";
import { getPostBySlug } from "../posts";

export const runtime = "edge";
export const alt = "JobScout AI Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title || "JobScout AI Blog";
  const date = post
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
        }}
      >
        {/* Top: brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#10b981",
            }}
          >
            JobScout
          </span>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 400,
              color: "#71717a",
              marginLeft: "8px",
            }}
          >
            AI
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#52525b",
              marginLeft: "16px",
              borderLeft: "1px solid #3f3f46",
              paddingLeft: "16px",
            }}
          >
            Blog
          </span>
        </div>

        {/* Center: title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? "42px" : "52px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: date + CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "18px", color: "#71717a" }}>{date}</span>
          <span
            style={{
              fontSize: "16px",
              color: "#10b981",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px",
            }}
          >
            leaflogic.app/scout
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
