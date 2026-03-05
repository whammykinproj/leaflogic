/**
 * Sitemap Generator Agent
 *
 * Generates sitemap.xml for SEO.
 * Run: npx tsx agents/04-sitemap-generator.ts
 */

import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

interface Article {
  slug: string;
  date: string;
}

const SITE_URL = "https://leaflogic.app";

function main() {
  console.log("🗺️  Sitemap Generator starting...\n");

  const files = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));

  const articles: Article[] = files.map((f) => {
    const raw = fs.readFileSync(path.join(CONFIG.CONTENT_DIR, f), "utf-8");
    const data = JSON.parse(raw);
    return { slug: data.slug, date: data.date };
  });

  const urls = [
    `  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    `  <url>
    <loc>${SITE_URL}/articles</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
    ...articles.map(
      (a) => `  <url>
    <loc>${SITE_URL}/articles/${a.slug}</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  const outputPath = path.join(process.cwd(), "public/sitemap.xml");
  fs.writeFileSync(outputPath, sitemap);

  console.log(`✅ Sitemap generated with ${articles.length + 2} URLs.`);
  console.log(`   Saved to: public/sitemap.xml`);
}

main();
