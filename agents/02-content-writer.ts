/**
 * Content Writer Agent
 *
 * Takes keywords and generates SEO-optimized articles using Claude.
 * Run: npx tsx agents/02-content-writer.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import { CONFIG } from "./config";
import path from "path";

interface KeywordsData {
  seed_keywords: string[];
  categories: string[];
  expanded_keywords?: string[];
}

interface PublishedData {
  articles: string[];
}

interface ArticleData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  keywords: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

async function generateArticle(
  client: Anthropic,
  keyword: string,
  categories: string[]
): Promise<ArticleData | null> {
  const prompt = `You are an expert indoor plant care writer for a website called LeafLogic. Write a comprehensive, SEO-optimized article targeting the keyword: "${keyword}"

Requirements:
- Title: Compelling, includes the keyword naturally, under 70 characters
- Content: 800-1200 words, formatted in HTML (use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong> tags)
- Include practical, actionable advice
- Use a friendly, approachable tone
- Include relevant internal linking opportunities (mention related plant topics)
- Structure with clear headings and short paragraphs for readability

Choose the most appropriate category from: ${categories.join(", ")}

Respond in this exact JSON format (no markdown code blocks, just raw JSON):
{
  "title": "...",
  "excerpt": "A 1-2 sentence summary for search results and previews",
  "content": "Full HTML content...",
  "category": "...",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`;

  try {
    const response = await client.messages.create({
      model: CONFIG.MODEL,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    const slug = slugify(parsed.title);

    return {
      slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      category: parsed.category,
      date: todayString(),
      keywords: parsed.keywords,
    };
  } catch (err) {
    console.error(`  Failed to generate article for "${keyword}":`, err);
    return null;
  }
}

async function main() {
  if (!CONFIG.ANTHROPIC_API_KEY) {
    console.error(
      "❌ Set ANTHROPIC_API_KEY environment variable before running."
    );
    process.exit(1);
  }

  console.log("✍️  Content Writer starting...\n");

  const client = new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY });

  const keywordsData: KeywordsData = JSON.parse(
    fs.readFileSync(CONFIG.KEYWORDS_FILE, "utf-8")
  );
  const published: PublishedData = JSON.parse(
    fs.readFileSync(CONFIG.PUBLISHED_LOG, "utf-8")
  );

  // Combine seed + expanded, filter already published
  const allKeywords = [
    ...keywordsData.seed_keywords,
    ...(keywordsData.expanded_keywords || []),
  ];

  const unpublished = allKeywords.filter((kw) => {
    const slug = slugify(kw);
    return !published.articles.some(
      (a) => a === slug || slug.includes(a) || a.includes(slug)
    );
  });

  if (unpublished.length === 0) {
    console.log("No new keywords to write about. Add more to keywords.json!");
    return;
  }

  const batch = unpublished.slice(0, CONFIG.ARTICLES_PER_BATCH);
  console.log(`Writing ${batch.length} articles...\n`);

  for (const keyword of batch) {
    console.log(`📝 Generating: "${keyword}"`);
    const article = await generateArticle(
      client,
      keyword,
      keywordsData.categories
    );

    if (article) {
      const filePath = path.join(CONFIG.CONTENT_DIR, `${article.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
      published.articles.push(article.slug);
      console.log(`  ✅ Saved: ${article.slug}`);
    }
  }

  fs.writeFileSync(CONFIG.PUBLISHED_LOG, JSON.stringify(published, null, 2));
  console.log(`\n✅ Done! ${batch.length} articles generated.`);
}

main().catch(console.error);
