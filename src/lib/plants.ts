import { getAllArticles, type Article } from "./articles";

export interface PlantHub {
  slug: string;
  name: string;
  articles: Article[];
}

// Map of common plant names to their hub slugs
const PLANT_NAMES: Record<string, string[]> = {
  pothos: ["pothos", "epipremnum"],
  monstera: ["monstera", "deliciosa"],
  "snake-plant": ["snake plant", "sansevieria", "dracaena trifasciata"],
  "fiddle-leaf-fig": ["fiddle leaf fig", "ficus lyrata"],
  "peace-lily": ["peace lily", "spathiphyllum"],
  "spider-plant": ["spider plant", "chlorophytum"],
  "zz-plant": ["zz plant", "zamioculcas"],
  calathea: ["calathea"],
  succulent: ["succulent"],
  "aloe-vera": ["aloe vera", "aloe"],
  philodendron: ["philodendron"],
  "rubber-plant": ["rubber plant", "ficus elastica"],
  "string-of-pearls": ["string of pearls", "senecio rowleyanus"],
  "chinese-money-plant": ["chinese money plant", "pilea"],
  "bird-of-paradise": ["bird of paradise", "strelitzia"],
  "jade-plant": ["jade plant", "crassula"],
  "boston-fern": ["boston fern", "nephrolepis"],
  hoya: ["hoya"],
  croton: ["croton"],
  "english-ivy": ["english ivy", "hedera"],
  dracaena: ["dracaena", "marginata"],
  alocasia: ["alocasia"],
};

function displayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getAllPlantHubs(): PlantHub[] {
  const articles = getAllArticles();
  const hubs: PlantHub[] = [];

  for (const [slug, keywords] of Object.entries(PLANT_NAMES)) {
    const matching = articles.filter((article) => {
      const searchText = `${article.title} ${article.excerpt} ${article.keywords.join(" ")}`.toLowerCase();
      return keywords.some((kw) => searchText.includes(kw.toLowerCase()));
    });

    if (matching.length > 0) {
      hubs.push({
        slug,
        name: displayName(slug),
        articles: matching,
      });
    }
  }

  return hubs.sort((a, b) => b.articles.length - a.articles.length);
}

export function getPlantHub(slug: string): PlantHub | null {
  const hubs = getAllPlantHubs();
  return hubs.find((h) => h.slug === slug) || null;
}

export function getAllPlantSlugs(): string[] {
  return getAllPlantHubs().map((h) => h.slug);
}
