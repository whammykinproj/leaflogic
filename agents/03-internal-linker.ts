/**
 * Internal Linker Agent
 *
 * Scans all articles and adds internal links between related content.
 * Run: npx tsx agents/03-internal-linker.ts
 */

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

function getAllArticles(): Article[] {
  const files = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(CONFIG.CONTENT_DIR, f), "utf-8");
    return JSON.parse(raw);
  });
}

function findRelatedArticles(
  article: Article,
  allArticles: Article[]
): Article[] {
  const others = allArticles.filter((a) => a.slug !== article.slug);

  // Score by keyword overlap and category match
  const scored = others.map((other) => {
    let score = 0;
    // Category match
    if (other.category === article.category) score += 2;

    // Keyword overlap
    for (const kw of article.keywords) {
      const kwLower = kw.toLowerCase();
      for (const otherKw of other.keywords) {
        if (otherKw.toLowerCase().includes(kwLower) || kwLower.includes(otherKw.toLowerCase())) {
          score += 1;
        }
      }
    }

    // Title word overlap
    const titleWords = article.title.toLowerCase().split(/\s+/);
    const otherTitleWords = other.title.toLowerCase().split(/\s+/);
    const commonWords = new Set(["the", "a", "an", "is", "to", "for", "and", "or", "in", "of", "my", "your", "how", "why", "what"]);
    for (const word of titleWords) {
      if (!commonWords.has(word) && otherTitleWords.includes(word)) {
        score += 1;
      }
    }

    return { article: other, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.article);
}

function addLinksToContent(article: Article, related: Article[]): string {
  let content = article.content;

  // Check if article already has a "Related Guides" section
  if (content.includes("Related Guides") || content.includes("related-links")) {
    return content;
  }

  if (related.length === 0) return content;

  // Add a related articles section at the end
  const links = related
    .map(
      (r) =>
        `<li><a href="/articles/${r.slug}">${r.title}</a></li>`
    )
    .join("");

  content += `<h2>Related Guides</h2><ul class="related-links">${links}</ul>`;
  return content;
}

function main() {
  console.log("🔗 Internal Linker starting...\n");

  const articles = getAllArticles();
  console.log(`Found ${articles.length} articles.\n`);

  let updated = 0;

  for (const article of articles) {
    const related = findRelatedArticles(article, articles);
    if (related.length === 0) continue;

    const newContent = addLinksToContent(article, related);
    if (newContent !== article.content) {
      article.content = newContent;
      const filePath = path.join(CONFIG.CONTENT_DIR, `${article.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
      console.log(
        `  ✅ ${article.slug} → linked to ${related.length} articles`
      );
      updated++;
    } else {
      console.log(`  ⏭️  ${article.slug} → already has links`);
    }
  }

  console.log(`\n✅ Done! Updated ${updated} articles with internal links.`);
}

main();
