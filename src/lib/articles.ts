import fs from "fs";
import path from "path";

export interface ProductData {
  name: string;
  features: string[];
  priceRange: string;
  affiliateUrl: string;
  rating: number;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  keywords: string[];
  faq?: { question: string; answer: string }[];
  products?: ProductData[];
  wordCount: number;
}

const CONTENT_DIR = path.join(process.cwd(), "content/articles");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const data = JSON.parse(raw) as Article;
    data.wordCount = data.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    return data;
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as Article;
  data.wordCount = data.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return data;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}
