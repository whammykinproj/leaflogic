/**
 * Social Media Post Generator Agent
 *
 * Generates ready-to-post social content for each new article.
 * Outputs to agents/social/ as JSON files you can auto-post or manually use.
 *
 * For full automation, connect to Twitter/X API, Pinterest API, or use
 * a scheduling tool like Buffer/Typefully that accepts CSV imports.
 *
 * Run: npx tsx agents/07-social-poster.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

const SITE_URL = "https://leaflogic.app";
const SOCIAL_DIR = path.join(process.cwd(), "agents/social");

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  keywords: string[];
}

interface SocialPosts {
  slug: string;
  url: string;
  twitter: string[];
  pinterest: string;
  reddit: string;
  generated: string;
}

async function generateSocialPosts(
  client: Anthropic,
  article: Article
): Promise<SocialPosts | null> {
  const url = `${SITE_URL}/articles/${article.slug}`;

  const prompt = `Generate social media posts for this plant care article:

Title: "${article.title}"
Summary: "${article.excerpt}"
URL: ${url}
Keywords: ${article.keywords.join(", ")}

Generate the following (respond in raw JSON, no code blocks):
{
  "twitter": [
    "Tweet 1 (under 280 chars, include the URL, use 2-3 relevant hashtags)",
    "Tweet 2 (different angle, under 280 chars, include the URL)",
    "Tweet 3 (question format to drive engagement, under 280 chars, include the URL)"
  ],
  "pinterest": "Pinterest pin description (150-300 chars, keyword-rich, include URL)",
  "reddit": "Reddit post title for r/houseplants or r/IndoorGarden (engaging question or helpful framing, NO url in title)"
}

Make them sound natural and helpful, not salesy. Use plant parent language.`;

  try {
    const response = await client.messages.create({
      model: CONFIG.MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    let text =
      response.content[0].type === "text" ? response.content[0].text : "";
    // Strip markdown code blocks if present
    text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    const parsed = JSON.parse(text);

    return {
      slug: article.slug,
      url,
      twitter: parsed.twitter,
      pinterest: parsed.pinterest,
      reddit: parsed.reddit,
      generated: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`  Failed for "${article.title}":`, err);
    return null;
  }
}

async function main() {
  if (!CONFIG.ANTHROPIC_API_KEY) {
    console.error("❌ Set ANTHROPIC_API_KEY environment variable.");
    process.exit(1);
  }

  console.log("📱 Social Post Generator starting...\n");

  const client = new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY });

  // Find articles that don't have social posts yet
  const articles = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      JSON.parse(fs.readFileSync(path.join(CONFIG.CONTENT_DIR, f), "utf-8"))
    ) as Article[];

  const existingSocial = new Set(
    fs
      .readdirSync(SOCIAL_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""))
  );

  const newArticles = articles.filter((a) => !existingSocial.has(a.slug));

  if (newArticles.length === 0) {
    console.log("All articles already have social posts. Nothing to do!");
    return;
  }

  console.log(`Generating social posts for ${newArticles.length} articles...\n`);

  // Also build a CSV for bulk scheduling tools
  const csvRows: string[] = ["platform,content,url,scheduled_date"];

  for (const article of newArticles) {
    console.log(`  📝 ${article.title}`);
    const posts = await generateSocialPosts(client, article);

    if (posts) {
      const filePath = path.join(SOCIAL_DIR, `${article.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

      // Add to CSV
      for (const tweet of posts.twitter) {
        csvRows.push(`twitter,"${tweet.replace(/"/g, '""')}",${posts.url},`);
      }
      csvRows.push(
        `pinterest,"${posts.pinterest.replace(/"/g, '""')}",${posts.url},`
      );

      console.log(`    ✅ Saved social posts`);
    }
  }

  // Write CSV for bulk import into scheduling tools
  const csvPath = path.join(SOCIAL_DIR, "bulk-schedule.csv");
  fs.writeFileSync(csvPath, csvRows.join("\n"));
  console.log(`\n📋 Bulk CSV saved to: agents/social/bulk-schedule.csv`);
  console.log(
    `   Import this into Buffer, Hootsuite, or Typefully for auto-scheduling.`
  );

  console.log(`\n✅ Done!`);
}

main().catch(console.error);
