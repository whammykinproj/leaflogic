import path from "path";

export const CONFIG = {
  // Anthropic API key — set as environment variable
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",

  // Paths
  CONTENT_DIR: path.join(process.cwd(), "content/articles"),
  KEYWORDS_FILE: path.join(process.cwd(), "agents/data/keywords.json"),
  PUBLISHED_LOG: path.join(process.cwd(), "agents/data/published.json"),

  // Content settings
  ARTICLES_PER_BATCH: parseInt(process.env.BATCH_SIZE || "5", 10),
  MODEL: "claude-sonnet-4-6",

  // Site
  SITE_NAME: "LeafLogic",
  SITE_NICHE: "indoor plant care",
};
