/**
 * Affiliate Link Injector Agent
 *
 * Scans articles and injects Amazon affiliate links for relevant plant products.
 * Run: npx tsx agents/05-affiliate-injector.ts
 *
 * Set AMAZON_AFFILIATE_TAG env var (e.g., "leaflogic-20")
 */

import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

const TAG = process.env.AMAZON_AFFILIATE_TAG || "leaflogic-20";

// Product keyword → Amazon search link mapping
// These are generic search links — no specific ASINs needed
const PRODUCT_MAP: Record<string, { text: string; search: string }> = {
  // Soil & growing media
  "potting mix": { text: "quality potting mix", search: "indoor+plant+potting+mix" },
  "potting soil": { text: "indoor potting soil", search: "indoor+plant+potting+soil" },
  "perlite": { text: "perlite", search: "perlite+for+plants" },
  "cactus soil": { text: "cactus & succulent soil", search: "cactus+succulent+soil+mix" },
  "orchid bark": { text: "orchid bark mix", search: "orchid+bark+potting+mix" },
  "sphagnum moss": { text: "sphagnum moss", search: "sphagnum+moss+plants" },

  // Fertilizer
  "fertilizer": { text: "balanced liquid fertilizer", search: "liquid+fertilizer+indoor+plants" },
  "10-10-10": { text: "10-10-10 fertilizer", search: "10-10-10+liquid+fertilizer" },
  "plant food": { text: "indoor plant food", search: "indoor+plant+food+liquid" },

  // Pots & containers
  "drainage holes": { text: "pots with drainage holes", search: "indoor+plant+pots+drainage+holes" },
  "terra cotta": { text: "terra cotta pots", search: "terra+cotta+pots+indoor+plants" },
  "nursery pot": { text: "nursery pots", search: "nursery+pots+plants" },

  // Tools
  "moisture meter": { text: "soil moisture meter", search: "soil+moisture+meter+plants" },
  "pruning shears": { text: "pruning shears", search: "pruning+shears+houseplants" },
  "spray bottle": { text: "plant misting bottle", search: "plant+mister+spray+bottle" },
  "grow light": { text: "LED grow light", search: "led+grow+light+indoor+plants" },
  "humidity tray": { text: "humidity tray", search: "humidity+tray+indoor+plants" },
  "humidifier": { text: "plant humidifier", search: "humidifier+for+plants" },

  // Pest control
  "neem oil": { text: "neem oil spray", search: "neem+oil+spray+plants" },
  "hydrogen peroxide": { text: "hydrogen peroxide", search: "hydrogen+peroxide+3+percent" },
  "sticky traps": { text: "yellow sticky traps", search: "yellow+sticky+traps+fungus+gnats" },
  "diatomaceous earth": { text: "diatomaceous earth", search: "diatomaceous+earth+plants" },
  "insecticidal soap": { text: "insecticidal soap", search: "insecticidal+soap+houseplants" },

  // Propagation
  "rooting hormone": { text: "rooting hormone", search: "rooting+hormone+powder" },
  "propagation station": { text: "propagation station", search: "plant+propagation+station" },
};

function buildAffiliateUrl(search: string): string {
  return `https://www.amazon.com/s?k=${search}&tag=${TAG}`;
}

function injectAffiliateLinks(content: string): { content: string; count: number } {
  let modified = content;
  let count = 0;
  const maxLinks = 3; // Don't spam — max 3 affiliate links per article

  // Skip if already has affiliate links
  if (modified.includes(`tag=${TAG}`)) {
    return { content: modified, count: 0 };
  }

  for (const [keyword, product] of Object.entries(PRODUCT_MAP)) {
    if (count >= maxLinks) break;

    // Case-insensitive search for the keyword in content (not already in a link)
    const regex = new RegExp(
      `(?<![">])\\b(${keyword})\\b(?![^<]*<\\/a>)`,
      "i"
    );

    if (regex.test(modified)) {
      const url = buildAffiliateUrl(product.search);
      // Only replace first occurrence
      modified = modified.replace(
        regex,
        `<a href="${url}" target="_blank" rel="nofollow noopener">${product.text}</a>`
      );
      count++;
    }
  }

  return { content: modified, count };
}

function main() {
  console.log(`💰 Affiliate Injector starting (tag: ${TAG})...\n`);

  const files = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));

  let totalLinks = 0;

  for (const file of files) {
    const filePath = path.join(CONFIG.CONTENT_DIR, file);
    const article = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const { content, count } = injectAffiliateLinks(article.content);

    if (count > 0) {
      article.content = content;
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
      console.log(`  ✅ ${article.slug} → ${count} affiliate links added`);
      totalLinks += count;
    } else {
      console.log(`  ⏭️  ${article.slug} → already has links or no matches`);
    }
  }

  console.log(`\n✅ Done! ${totalLinks} total affiliate links injected.`);
}

main();
