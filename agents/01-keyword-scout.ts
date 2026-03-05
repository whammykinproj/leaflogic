/**
 * Keyword Scout Agent
 *
 * Expands seed keywords using Google Autocomplete suggestions.
 * Run: npx tsx agents/01-keyword-scout.ts
 */

import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

interface KeywordsData {
  seed_keywords: string[];
  categories: string[];
  expanded_keywords?: string[];
}

async function getAutocompleteSuggestions(
  query: string
): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data[1] as string[]) || [];
  } catch {
    console.log(`  Failed to fetch suggestions for: ${query}`);
    return [];
  }
}

async function main() {
  console.log("🔍 Keyword Scout starting...\n");

  const data: KeywordsData = JSON.parse(
    fs.readFileSync(CONFIG.KEYWORDS_FILE, "utf-8")
  );

  const allKeywords = new Set<string>(data.seed_keywords);
  const expanded = new Set<string>(data.expanded_keywords || []);

  for (const seed of data.seed_keywords) {
    console.log(`Expanding: "${seed}"`);
    const suggestions = await getAutocompleteSuggestions(seed);

    for (const s of suggestions) {
      if (!allKeywords.has(s) && !expanded.has(s)) {
        expanded.add(s);
        console.log(`  + ${s}`);
      }
    }

    // Also try appending common modifiers
    for (const mod of ["how to", "why", "best", "when to"]) {
      const modQuery = `${seed} ${mod}`;
      const modSuggestions = await getAutocompleteSuggestions(modQuery);
      for (const s of modSuggestions) {
        if (!allKeywords.has(s) && !expanded.has(s)) {
          expanded.add(s);
        }
      }
    }

    // Rate limit: small delay between requests
    await new Promise((r) => setTimeout(r, 200));
  }

  data.expanded_keywords = [...expanded];

  fs.writeFileSync(CONFIG.KEYWORDS_FILE, JSON.stringify(data, null, 2));

  console.log(
    `\n✅ Done! ${expanded.size} expanded keywords saved to keywords.json`
  );
}

main().catch(console.error);
