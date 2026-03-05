/**
 * FAQ Schema Injector Agent
 *
 * Extracts Q&A pairs from articles and injects FAQ structured data (JSON-LD)
 * into the article metadata. This makes articles eligible for FAQ rich snippets
 * in Google search results — dramatically increases click-through rate.
 *
 * Run: npx tsx agents/11-faq-schema.ts
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
  faq?: { question: string; answer: string }[];
}

async function extractFAQ(
  client: Anthropic,
  article: Article
): Promise<{ question: string; answer: string }[] | null> {
  const prompt = `Extract 3-5 frequently asked questions and concise answers from this plant care article.

Title: "${article.title}"
Content: ${article.content.replace(/<[^>]+>/g, "").slice(0, 3000)}

Return raw JSON array (no code blocks):
[
  {"question": "...", "answer": "Concise 1-2 sentence answer"},
  ...
]

The questions should be natural queries someone would type into Google. Answers should be direct and factual.`;

  try {
    const response = await client.messages.create({
      model: CONFIG.MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    let text =
      response.content[0].type === "text" ? response.content[0].text : "";
    text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    return JSON.parse(text);
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

  console.log("❓ FAQ Schema Injector starting...\n");

  const client = new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY });

  const files = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));

  let updated = 0;

  for (const file of files) {
    const filePath = path.join(CONFIG.CONTENT_DIR, file);
    const article: Article = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Skip if already has FAQ
    if (article.faq && article.faq.length > 0) {
      continue;
    }

    console.log(`📝 ${article.slug}`);
    const faq = await extractFAQ(client, article);

    if (faq && faq.length > 0) {
      article.faq = faq;

      // Also inject FAQ section into content if not present
      if (!article.content.includes("Frequently Asked Questions")) {
        const faqHtml = faq
          .map(
            (f) =>
              `<h3>${f.question}</h3><p>${f.answer}</p>`
          )
          .join("");
        // Insert before "Related Guides" if it exists, otherwise append
        if (article.content.includes("Related Guides")) {
          article.content = article.content.replace(
            '<h2>Related Guides</h2>',
            `<h2>Frequently Asked Questions</h2>${faqHtml}<h2>Related Guides</h2>`
          );
        } else {
          article.content += `<h2>Frequently Asked Questions</h2>${faqHtml}`;
        }
      }

      fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
      console.log(`  ✅ ${faq.length} FAQs added`);
      updated++;
    }
  }

  console.log(`\n✅ Done! Added FAQ schema to ${updated} articles.`);
}

main().catch(console.error);
