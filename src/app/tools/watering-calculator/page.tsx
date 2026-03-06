"use client";

import { useState } from "react";

interface PlantData {
  baseFrequency: number; // days
  tips: string[];
  overwater: string[];
  underwater: string[];
}

const plantData: Record<string, PlantData> = {
  Pothos: {
    baseFrequency: 7,
    tips: [
      "Let the top inch of soil dry between waterings.",
      "Yellow leaves often mean overwatering; wilting means underwatering.",
      "Pothos in lower light will need less water than those in bright spots.",
    ],
    overwater: [
      "Yellowing leaves, especially lower ones",
      "Mushy, brown stems near the soil",
      "Foul smell from the soil (root rot)",
    ],
    underwater: [
      "Drooping, wilting leaves that perk up after watering",
      "Brown, crispy leaf edges",
      "Slow growth or smaller new leaves",
    ],
  },
  "Snake Plant": {
    baseFrequency: 14,
    tips: [
      "One of the most drought-tolerant houseplants. When in doubt, wait.",
      "Water less in winter - every 3-4 weeks is usually fine.",
      "Always let the soil dry completely between waterings.",
    ],
    overwater: [
      "Soft, mushy leaves at the base",
      "Leaves falling over or becoming wrinkled and soft",
      "Yellowing leaves and soggy soil",
    ],
    underwater: [
      "Wrinkling or curling leaves",
      "Brown, crispy leaf tips",
      "Leaves leaning or drooping slightly",
    ],
  },
  Monstera: {
    baseFrequency: 9,
    tips: [
      "Water when the top 2 inches of soil feel dry.",
      "Monsteras love humidity - mist occasionally or use a pebble tray.",
      "Reduce watering in fall and winter when growth slows.",
    ],
    overwater: [
      "Yellow leaves with brown spots",
      "Weeping or sweating on leaf edges (guttation)",
      "Soil stays wet for more than 10 days",
    ],
    underwater: [
      "Drooping leaves that curl inward",
      "Brown, crispy edges on leaves",
      "Soil pulling away from the pot edges",
    ],
  },
  "Peace Lily": {
    baseFrequency: 7,
    tips: [
      "Peace lilies will dramatically droop when thirsty - a built-in reminder.",
      "Use filtered water if possible, as they are sensitive to chlorine.",
      "Keep soil consistently moist but never soggy.",
    ],
    overwater: [
      "Yellow leaves across the plant",
      "Black leaf tips (as opposed to brown)",
      "Root rot and mushy stems",
    ],
    underwater: [
      "Dramatic wilting and drooping",
      "Brown leaf tips and edges",
      "Leaves becoming pale or dull",
    ],
  },
  "Fiddle Leaf Fig": {
    baseFrequency: 10,
    tips: [
      "Water thoroughly until it drains, then let the top 2 inches dry.",
      "Use room-temperature water to avoid shocking the roots.",
      "Stick to a consistent schedule - fiddle leaf figs dislike change.",
    ],
    overwater: [
      "Brown spots in the middle of leaves",
      "Leaves dropping from the bottom of the plant",
      "Mushy, dark roots when you check the root ball",
    ],
    underwater: [
      "Leaves curling inward",
      "Brown edges or crispy spots",
      "Drooping leaves that feel dry to the touch",
    ],
  },
  "ZZ Plant": {
    baseFrequency: 14,
    tips: [
      "ZZ plants store water in their rhizomes - they prefer to dry out.",
      "Water thoroughly but infrequently, every 2-3 weeks.",
      "In low light, water even less frequently.",
    ],
    overwater: [
      "Yellowing stems that become mushy",
      "Leaves falling off easily when touched",
      "Rotting rhizomes (tubers) below the soil",
    ],
    underwater: [
      "Leaf drop starting at the tips of stems",
      "Wrinkling or curling leaflets",
      "Dry, compacted soil pulling from pot edges",
    ],
  },
  "Spider Plant": {
    baseFrequency: 7,
    tips: [
      "Keep soil evenly moist but not waterlogged.",
      "Brown tips are common with tap water - try filtered water.",
      "Spider plants prefer to be slightly root-bound.",
    ],
    overwater: [
      "Blackened or dark leaf tips (vs. brown from underwatering)",
      "Root rot and mushy roots",
      "Leaves turning pale or yellow",
    ],
    underwater: [
      "Pale, faded leaf color",
      "Brown, crispy leaf tips",
      "Leaves folding or curling lengthwise",
    ],
  },
  Succulent: {
    baseFrequency: 12,
    tips: [
      "Soak the soil completely, then let it dry out fully before watering again.",
      "Always use a pot with drainage - succulents hate sitting in water.",
      "Water less in winter when most succulents go dormant.",
    ],
    overwater: [
      "Leaves turning translucent or mushy",
      "Leaves falling off at the slightest touch",
      "Black stem or base (stem rot)",
    ],
    underwater: [
      "Wrinkled, deflated-looking leaves",
      "Aerial roots growing from the stem",
      "Lower leaves drying up and shriveling",
    ],
  },
  Fern: {
    baseFrequency: 5,
    tips: [
      "Keep the soil consistently moist - ferns dislike drying out.",
      "Mist regularly or place on a humidity tray.",
      "Avoid placing near heating vents or drafts.",
    ],
    overwater: [
      "Yellowing fronds from the center",
      "Gray mold on the soil surface",
      "Root rot and mushy base",
    ],
    underwater: [
      "Crispy, brown frond tips that spread",
      "Massive leaf drop",
      "Fronds curling inward and turning pale",
    ],
  },
  Calathea: {
    baseFrequency: 7,
    tips: [
      "Use filtered or distilled water - calatheas are sensitive to minerals.",
      "Keep soil moist but never soggy.",
      "High humidity is key - 50%+ is ideal.",
    ],
    overwater: [
      "Yellowing lower leaves",
      "Limp, mushy stems",
      "Fungus gnats around the soil",
    ],
    underwater: [
      "Leaves curling inward to conserve moisture",
      "Brown, crispy leaf edges",
      "Leaves losing their vibrant patterns",
    ],
  },
};

const potSizes = [
  { label: 'Small (4-6")', value: "small", factor: 0.7 },
  { label: 'Medium (6-8")', value: "medium", factor: 1.0 },
  { label: 'Large (8-12")', value: "large", factor: 1.3 },
  { label: 'XL (12"+)', value: "xl", factor: 1.5 },
];

const lightLevels = [
  { label: "Low", value: "low", factor: 1.3 },
  { label: "Medium", value: "medium", factor: 1.0 },
  { label: "Bright", value: "bright", factor: 0.8 },
];

const seasons = [
  { label: "Spring", value: "spring", factor: 0.9 },
  { label: "Summer", value: "summer", factor: 0.7 },
  { label: "Fall", value: "fall", factor: 1.1 },
  { label: "Winter", value: "winter", factor: 1.4 },
];

interface CalcResult {
  minDays: number;
  maxDays: number;
  tips: string[];
  overwater: string[];
  underwater: string[];
}

function calculate(
  plant: string,
  pot: string,
  light: string,
  season: string
): CalcResult {
  const data = plantData[plant];
  const potFactor = potSizes.find((p) => p.value === pot)!.factor;
  const lightFactor = lightLevels.find((l) => l.value === light)!.factor;
  const seasonFactor = seasons.find((s) => s.value === season)!.factor;

  const adjusted = data.baseFrequency * potFactor * lightFactor * seasonFactor;
  const minDays = Math.max(1, Math.round(adjusted * 0.85));
  const maxDays = Math.round(adjusted * 1.15);

  return {
    minDays,
    maxDays,
    tips: data.tips,
    overwater: data.overwater,
    underwater: data.underwater,
  };
}

export default function WateringCalculatorPage() {
  const [plant, setPlant] = useState("");
  const [pot, setPot] = useState("medium");
  const [light, setLight] = useState("medium");
  const [season, setSeason] = useState("spring");
  const [result, setResult] = useState<CalcResult | null>(null);

  function handleCalculate() {
    if (!plant) return;
    setResult(calculate(plant, pot, light, season));
  }

  const selectClass =
    "w-full rounded-lg border-2 border-border bg-cream px-4 py-3 text-sm font-medium text-foreground/80 transition-colors focus:border-green-primary focus:outline-none";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-green-dark sm:text-4xl">
          Watering Calculator
        </h1>
        <p className="mt-3 text-foreground/60">
          Find the perfect watering schedule for your houseplant.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5 rounded-2xl border-2 border-border bg-white p-6 shadow-sm sm:p-8">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-green-dark">
            Plant Type
          </label>
          <select
            value={plant}
            onChange={(e) => setPlant(e.target.value)}
            className={selectClass}
          >
            <option value="">Select a plant...</option>
            {Object.keys(plantData).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-green-dark">
            Pot Size
          </label>
          <select
            value={pot}
            onChange={(e) => setPot(e.target.value)}
            className={selectClass}
          >
            {potSizes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-green-dark">
            Light Level
          </label>
          <select
            value={light}
            onChange={(e) => setLight(e.target.value)}
            className={selectClass}
          >
            {lightLevels.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-green-dark">
            Current Season
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className={selectClass}
          >
            {seasons.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!plant}
          className="w-full rounded-lg bg-green-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Calculate Watering Schedule
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-8 animate-[fadeIn_0.3s_ease-out] space-y-6">
          {/* Frequency */}
          <div className="rounded-2xl border-2 border-green-primary/20 bg-green-bg p-6 text-center">
            <p className="text-sm font-medium text-green-primary/60">
              Recommended Watering Frequency
            </p>
            <p className="mt-2 text-3xl font-bold text-green-dark">
              Every {result.minDays}-{result.maxDays} days
            </p>
            <p className="mt-1 text-sm text-foreground/50">
              for {plant} in a {potSizes.find((p) => p.value === pot)?.label}{" "}
              pot with {light} light during {season}
            </p>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border-2 border-border bg-white p-6">
            <h3 className="mb-3 font-semibold text-green-dark">
              Care Tips for {plant}
            </h3>
            <ul className="space-y-2">
              {result.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-foreground/70"
                >
                  <span className="mt-0.5 text-green-primary">&#10003;</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Warning signs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-border bg-white p-5">
              <h4 className="mb-3 text-sm font-semibold text-amber-700">
                Overwatering Signs
              </h4>
              <ul className="space-y-1.5">
                {result.overwater.map((sign, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs leading-relaxed text-foreground/60"
                  >
                    <span className="text-amber-500">&#9679;</span>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-border bg-white p-5">
              <h4 className="mb-3 text-sm font-semibold text-orange-700">
                Underwatering Signs
              </h4>
              <ul className="space-y-1.5">
                {result.underwater.map((sign, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs leading-relaxed text-foreground/60"
                  >
                    <span className="text-orange-500">&#9679;</span>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="rounded-2xl border-2 border-border bg-cream p-6 text-center">
            <h3 className="font-semibold text-green-dark">
              Get Watering Reminders
            </h3>
            <p className="mt-1 text-sm text-foreground/50">
              Join our newsletter for seasonal care tips and watering schedules
              delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-4 flex max-w-sm gap-2"
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-lg border-2 border-border bg-white px-4 py-2.5 text-sm transition-colors focus:border-green-primary focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-green-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-dark"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
