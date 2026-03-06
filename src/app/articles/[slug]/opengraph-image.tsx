import { ImageResponse } from "next/og";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";

export const alt = "LeafLogic Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "LeafLogic Article";
  const category = article?.category ?? "Plant Care";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f3d25",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative leaf circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.1)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.06)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "-100px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.08)",
            display: "flex",
          }}
        />

        {/* Top: category badge */}
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              backgroundColor: "#34d399",
              color: "#0f3d25",
              fontSize: "22px",
              fontWeight: 700,
              padding: "8px 24px",
              borderRadius: "50px",
            }}
          >
            {category}
          </div>
        </div>

        {/* Middle: title */}
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
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#34d399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              🌿
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#34d399",
              }}
            >
              LeafLogic
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            leaflogic.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
