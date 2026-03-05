/**
 * Product Roundup Generator Agent
 *
 * Creates high-converting "Best X for Plants" articles that drive affiliate revenue.
 * These articles target buyer-intent keywords — people searching for "best grow light"
 * are ready to purchase.
 *
 * Run: npx tsx agents/09-product-roundups.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

const TAG = process.env.AMAZON_AFFILIATE_TAG || "leaflogic-20";

const ROUNDUP_TOPICS = [
  {
    keyword: "best grow lights for indoor plants",
    category: "Plant Selection",
    products: [
      { name: "GE Grow Light LED", search: "GE+grow+light+LED+indoor+plants" },
      { name: "Barrina T5 Grow Lights", search: "Barrina+T5+grow+lights" },
      { name: "Spider Farmer SF1000", search: "Spider+Farmer+SF1000+LED" },
      { name: "Soltech Solutions Aspect", search: "Soltech+Solutions+Aspect+grow+light" },
      { name: "GooingTop LED Grow Light", search: "GooingTop+LED+grow+light+clip" },
    ],
  },
  {
    keyword: "best indoor plant pots with drainage",
    category: "Plant Selection",
    products: [
      { name: "D'vine Dev Ceramic Planters", search: "Dvine+Dev+ceramic+planter+drainage" },
      { name: "Mkono Plastic Planters", search: "Mkono+plastic+planters+drainage" },
      { name: "Costa Farms Self-Watering Pots", search: "Costa+Farms+self+watering+planter" },
      { name: "Fox & Fern Mid-Century Planter", search: "Fox+Fern+mid+century+plant+stand" },
      { name: "Terracotta Pots Set", search: "terracotta+pots+set+indoor+plants" },
    ],
  },
  {
    keyword: "best soil for indoor plants",
    category: "Plant Selection",
    products: [
      { name: "Fox Farm Ocean Forest", search: "Fox+Farm+Ocean+Forest+potting+soil" },
      { name: "Miracle-Gro Indoor Potting Mix", search: "Miracle+Gro+indoor+potting+mix" },
      { name: "Espoma Organic Potting Mix", search: "Espoma+organic+potting+mix" },
      { name: "Black Gold All Purpose", search: "Black+Gold+all+purpose+potting+soil" },
      { name: "Noot Organic Indoor Plant Soil", search: "Noot+organic+indoor+plant+soil" },
    ],
  },
  {
    keyword: "best plant watering tools and accessories",
    category: "Plant Selection",
    products: [
      { name: "Sustee Aquameter", search: "Sustee+Aquameter+moisture+sensor" },
      { name: "XLUX Soil Moisture Meter", search: "XLUX+soil+moisture+meter" },
      { name: "Blumat Classic Watering Stakes", search: "Blumat+classic+plant+watering" },
      { name: "Haws Indoor Watering Can", search: "Haws+indoor+watering+can" },
      { name: "Plant Self-Watering Globes", search: "plant+self+watering+globes+glass" },
    ],
  },
  {
    keyword: "best fertilizer for houseplants",
    category: "Plant Selection",
    products: [
      { name: "Dyna-Gro Foliage Pro", search: "Dyna+Gro+Foliage+Pro+fertilizer" },
      { name: "Espoma Indoor Liquid Plant Food", search: "Espoma+indoor+liquid+plant+food" },
      { name: "Schultz All Purpose Plant Food", search: "Schultz+all+purpose+plant+food" },
      { name: "Osmocote Smart-Release Plant Food", search: "Osmocote+smart+release+plant+food" },
      { name: "SUPERthrive Vitamin Solution", search: "SUPERthrive+vitamin+solution" },
    ],
  },
  {
    keyword: "best humidifiers for plants",
    category: "Plant Selection",
    products: [
      { name: "Levoit LV600S Humidifier", search: "Levoit+LV600S+humidifier" },
      { name: "GENIANI Top Fill Humidifier", search: "GENIANI+top+fill+humidifier" },
      { name: "Honeywell HCM350W Cool Mist", search: "Honeywell+HCM350W+cool+mist" },
      { name: "AquaOasis Cool Mist Humidifier", search: "AquaOasis+cool+mist+humidifier" },
      { name: "Pure Enrichment MistAire", search: "Pure+Enrichment+MistAire+humidifier" },
    ],
  },
  {
    keyword: "best pest control for houseplants",
    category: "Pests & Disease",
    products: [
      { name: "Bonide Systemic Granules", search: "Bonide+systemic+houseplant+granules" },
      { name: "Natria Neem Oil Spray", search: "Natria+neem+oil+spray+ready+to+use" },
      { name: "Mosquito Bits for Fungus Gnats", search: "Mosquito+Bits+fungus+gnats" },
      { name: "Sticky Stakes Traps", search: "sticky+stakes+traps+houseplant" },
      { name: "Captain Jack's Dead Bug Brew", search: "Captain+Jacks+Dead+Bug+Brew" },
    ],
  },
  {
    keyword: "best plant propagation tools and stations",
    category: "Propagation",
    products: [
      { name: "Wall-Mounted Propagation Station", search: "wall+mounted+propagation+station+plant" },
      { name: "Desktop Glass Propagation Tubes", search: "desktop+glass+propagation+tubes" },
      { name: "Garden Safe Rooting Hormone", search: "Garden+Safe+rooting+hormone" },
      { name: "Fiskars Micro-Tip Pruning Snips", search: "Fiskars+micro+tip+pruning+snips" },
      { name: "Seed Starting Heat Mat", search: "seed+starting+heat+mat+plants" },
    ],
  },
];

function buildAffiliateUrl(search: string): string {
  return `https://www.amazon.com/s?k=${search}&tag=${TAG}`;
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

async function generateRoundup(
  client: Anthropic,
  topic: (typeof ROUNDUP_TOPICS)[0]
): Promise<null | { title: string; excerpt: string; content: string; keywords: string[] }> {
  const productList = topic.products
    .map(
      (p) =>
        `- ${p.name}: ${buildAffiliateUrl(p.search)}`
    )
    .join("\n");

  const prompt = `You are an expert indoor plant product reviewer for LeafLogic. Write a comprehensive product roundup article targeting: "${topic.keyword}"

Include these products with their affiliate links:
${productList}

Requirements:
- Title: Compelling, includes the year 2026, under 70 characters
- Structure: Introduction → product reviews (each with pros/cons) → buying guide → FAQ
- For each product, write 100-150 words covering: what it is, who it's for, key features, one pro, one con
- Include affiliate links as <a href="URL" target="_blank" rel="nofollow noopener">Product Name</a>
- Add a "How We Chose" section for credibility
- Include a quick-pick summary table at the top as an HTML table
- End with a "Frequently Asked Questions" section (3-5 Q&As)
- 1500-2000 words total
- Friendly, helpful tone — not salesy
- Format in HTML (h2, h3, p, ul, ol, table tags)

Respond in raw JSON (no code blocks):
{
  "title": "...",
  "excerpt": "1-2 sentence summary under 160 chars",
  "content": "full HTML...",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

  try {
    const response = await client.messages.create({
      model: CONFIG.MODEL,
      max_tokens: 6000,
      messages: [{ role: "user", content: prompt }],
    });

    let text =
      response.content[0].type === "text" ? response.content[0].text : "";
    text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    return JSON.parse(text);
  } catch (err) {
    console.error(`  Failed for "${topic.keyword}":`, err);
    return null;
  }
}

async function main() {
  if (!CONFIG.ANTHROPIC_API_KEY) {
    console.error("❌ Set ANTHROPIC_API_KEY environment variable.");
    process.exit(1);
  }

  console.log("🛒 Product Roundup Generator starting...\n");

  const client = new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY });

  const published = JSON.parse(
    fs.readFileSync(CONFIG.PUBLISHED_LOG, "utf-8")
  );

  const unpublished = ROUNDUP_TOPICS.filter((topic) => {
    const slug = slugify(topic.keyword);
    return !published.articles.some(
      (a: string) => a.includes(slug) || slug.includes(a)
    );
  });

  if (unpublished.length === 0) {
    console.log("All roundups already published!");
    return;
  }

  const batch = unpublished.slice(0, 3);
  console.log(`Generating ${batch.length} product roundups...\n`);

  for (const topic of batch) {
    console.log(`📝 "${topic.keyword}"`);
    const result = await generateRoundup(client, topic);

    if (result) {
      const slug = slugify(result.title);
      const article = {
        slug,
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        category: topic.category,
        date: todayString(),
        keywords: result.keywords,
      };

      const filePath = path.join(CONFIG.CONTENT_DIR, `${slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
      published.articles.push(slug);
      console.log(`  ✅ Saved: ${slug}`);
    }
  }

  fs.writeFileSync(CONFIG.PUBLISHED_LOG, JSON.stringify(published, null, 2));
  console.log(`\n✅ Done! ${batch.length} product roundups generated.`);
}

main().catch(console.error);
