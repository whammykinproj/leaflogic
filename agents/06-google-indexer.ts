/**
 * Google Indexer Agent
 *
 * Pings Google to request indexing of new/updated pages.
 * Uses the public "ping" endpoint (no API key needed).
 * Also submits sitemap.
 *
 * Run: npx tsx agents/06-google-indexer.ts
 */

import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

const SITE_URL = "https://leaflogic-two.vercel.app";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

async function pingSitemap() {
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  try {
    const res = await fetch(pingUrl);
    if (res.ok) {
      console.log(`  ✅ Sitemap pinged successfully`);
    } else {
      console.log(`  ⚠️  Sitemap ping returned ${res.status}`);
    }
  } catch (err) {
    console.log(`  ❌ Sitemap ping failed:`, err);
  }
}

async function pingBing() {
  const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  try {
    const res = await fetch(pingUrl);
    if (res.ok) {
      console.log(`  ✅ Bing sitemap pinged successfully`);
    } else {
      console.log(`  ⚠️  Bing ping returned ${res.status}`);
    }
  } catch (err) {
    console.log(`  ❌ Bing ping failed:`, err);
  }
}

async function pingIndexNow(urls: string[]) {
  // IndexNow — free instant indexing for Bing, Yandex, and others
  // Generate a simple key file
  const key = "leaflogic2024indexnow";
  const keyFilePath = path.join(process.cwd(), `public/${key}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    fs.writeFileSync(keyFilePath, key);
    console.log(`  📄 Created IndexNow key file: public/${key}.txt`);
  }

  const body = {
    host: new URL(SITE_URL).host,
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok || res.status === 202) {
      console.log(`  ✅ IndexNow: submitted ${urls.length} URLs`);
    } else {
      console.log(`  ⚠️  IndexNow returned ${res.status}`);
    }
  } catch (err) {
    console.log(`  ❌ IndexNow failed:`, err);
  }
}

async function main() {
  console.log("🔍 Google Indexer starting...\n");

  // Collect all article URLs
  const files = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));

  const urls = [
    SITE_URL,
    `${SITE_URL}/articles`,
    ...files.map((f) => {
      const article = JSON.parse(
        fs.readFileSync(path.join(CONFIG.CONTENT_DIR, f), "utf-8")
      );
      return `${SITE_URL}/articles/${article.slug}`;
    }),
  ];

  console.log(`Found ${urls.length} URLs to index.\n`);

  // Ping all search engines
  console.log("--- Google ---");
  await pingSitemap();

  console.log("\n--- Bing ---");
  await pingBing();

  console.log("\n--- IndexNow (Bing, Yandex, Naver, etc.) ---");
  await pingIndexNow(urls);

  console.log(`\n✅ Done! Pinged all major search engines.`);
}

main().catch(console.error);
