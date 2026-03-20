import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/scout/dashboard",
          "/scout/admin",
          "/scout/api",
          "/scout/onboarding",
          "/scout/settings",
        ],
      },
    ],
    sitemap: "https://leaflogic.app/sitemap.xml",
  };
}
