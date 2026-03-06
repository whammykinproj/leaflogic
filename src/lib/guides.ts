import { getAllArticles, type Article } from "./articles";

export interface TopicHub {
  slug: string;
  title: string;
  description: string;
  tips: string[];
  articleMatchers: string[];
}

const TOPIC_HUBS: TopicHub[] = [
  {
    slug: "pothos-care",
    title: "Pothos Care Guide",
    description:
      "Everything you need to know about growing, propagating, and troubleshooting pothos plants. From golden pothos to marble queen, these hardy trailing vines are perfect for beginners and experienced plant parents alike.",
    tips: [
      "Pothos thrive in bright, indirect light but tolerate low light well.",
      "Allow the top inch of soil to dry between waterings.",
      "Propagate easily by cutting just below a node and placing in water.",
      "Yellow leaves usually indicate overwatering or too much direct sun.",
      "Feed monthly during spring and summer with a balanced liquid fertilizer.",
    ],
    articleMatchers: ["pothos"],
  },
  {
    slug: "monstera-care",
    title: "Monstera Care Guide",
    description:
      "Your complete resource for monstera care, from the iconic deliciosa to lesser-known varieties. Learn how to encourage fenestration, fix yellowing leaves, and keep your monstera thriving year-round.",
    tips: [
      "Monsteras prefer bright, indirect light for the best fenestration.",
      "Water when the top 2 inches of soil feel dry.",
      "Provide a moss pole or trellis for climbing support.",
      "Wipe leaves regularly to keep them dust-free and photosynthesizing efficiently.",
      "Repot every 1-2 years in well-draining aroid mix.",
    ],
    articleMatchers: ["monstera"],
  },
  {
    slug: "plant-troubleshooting",
    title: "Plant Troubleshooting Guide",
    description:
      "Diagnose and fix common houseplant problems fast. From yellowing leaves and brown tips to drooping stems and pest infestations, find solutions to get your plants back on track.",
    tips: [
      "Yellow leaves are most commonly caused by overwatering.",
      "Brown leaf tips often signal low humidity or inconsistent watering.",
      "Drooping can mean either too much or too little water -- check the soil first.",
      "Isolate any plant showing signs of pests immediately.",
      "When in doubt, check the roots -- healthy roots are firm and white.",
    ],
    articleMatchers: [
      "yellow",
      "brown",
      "drooping",
      "dying",
      "falling",
      "curling",
      "overwater",
      "pest",
      "fungus gnat",
      "mealybug",
      "troubleshoot",
      "fix",
      "save",
    ],
  },
];

export function getAllTopicHubs() {
  return TOPIC_HUBS;
}

export function getTopicHub(slug: string): TopicHub | null {
  return TOPIC_HUBS.find((h) => h.slug === slug) || null;
}

export function getArticlesForTopic(hub: TopicHub): Article[] {
  const articles = getAllArticles();
  return articles.filter((article) => {
    const searchText =
      `${article.slug} ${article.title} ${article.keywords.join(" ")}`.toLowerCase();
    return hub.articleMatchers.some((matcher) =>
      searchText.includes(matcher.toLowerCase())
    );
  });
}

export function getAllTopicSlugs(): string[] {
  return TOPIC_HUBS.map((h) => h.slug);
}
