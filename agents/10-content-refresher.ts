/**
 * Content Refresher Agent
 *
 * Finds thin/weak articles and rewrites them to be longer, more comprehensive,
 * and better optimized for SEO.
 *
 * Run: npx tsx agents/10-content-refresher.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  keywords: string[];
}

function getWordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

function findWeakArticles(): Article[] {
  const files = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));

  const weak: Article[] = [];

  for (const file of files) {
    const article: Article = JSON.parse(
      fs.readFileSync(path.join(CONFIG.CONTENT_DIR, file), "utf-8")
    );

    const wordCount = getWordCount(article.content);
    const h2Count = (article.content.match(/<h2/g) || []).length;

    // Flag articles that are too short or poorly structured
    if (wordCount < 700 || h2Count < 3) {
      weak.push(article);
    }
  }

  return weak;
}

async function refreshArticle(
  client: Anthropic,
  article: Article
): Promise<string | null> {
  const wordCount = getWordCount(article.content);

  const prompt = `You are an expert indoor plant care writer for LeafLogic. An existing article needs to be expanded and improved.

Title: "${article.title}"
Keywords: ${article.keywords.join(", ")}
Category: ${article.category}
Current word count: ${wordCount} (needs to be 900-1400)

Current content:
${article.content}

TASK: Rewrite and expand this article to be more comprehensive. Keep the same topic and overall structure but:
1. Expand to 900-1400 words
2. Add more practical, actionable detail
3. Include at least 4 H2 headings
4. Add lists (ul/ol) where appropriate
5. Make sure the primary keyword appears naturally 2-3 times
6. Add a brief conclusion/summary section
7. Keep the friendly, approachable tone

Return ONLY the new HTML content (h2, h3, p, ul, ol, li, strong tags). No JSON wrapper, no code blocks — just the raw HTML.`;

  try {
    const response = await client.messages.create({
      model: CONFIG.MODEL,
      max_tokens: 5000,
      messages: [{ role: "user", content: prompt }],
    });

    let text =
      response.content[0].type === "text" ? response.content[0].text : "";
    text = text.replace(/^```(?:html)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    return text;
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

  console.log("🔄 Content Refresher starting...\n");

  const client = new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY });
  const weak = findWeakArticles();

  if (weak.length === 0) {
    console.log("All articles meet quality standards. Nothing to refresh!");
    return;
  }

  console.log(`Found ${weak.length} articles needing improvement.\n`);

  const batch = weak.slice(0, 5);

  for (const article of batch) {
    const wordCount = getWordCount(article.content);
    console.log(`📝 "${article.title}" (${wordCount} words)`);

    const newContent = await refreshArticle(client, article);

    if (newContent) {
      const newWordCount = getWordCount(newContent);
      // Only save if actually improved
      if (newWordCount > wordCount + 100) {
        article.content = newContent;
        article.date = new Date().toISOString().split("T")[0];
        const filePath = path.join(CONFIG.CONTENT_DIR, `${article.slug}.json`);
        fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
        console.log(
          `  ✅ Refreshed: ${wordCount} → ${newWordCount} words`
        );
      } else {
        console.log(`  ⏭️  New content not significantly longer, skipping`);
      }
    }
  }

  console.log(`\n✅ Done!`);
}

main().catch(console.error);
