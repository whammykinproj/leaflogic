"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  question: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    question: "How much light does your space get?",
    options: [
      { label: "Low - mostly shade or north-facing", value: "low" },
      { label: "Medium - some indirect light", value: "medium" },
      { label: "Bright - lots of sunshine", value: "bright" },
    ],
  },
  {
    question: "How often do you want to water?",
    options: [
      { label: "Rarely - I forget sometimes", value: "rarely" },
      { label: "Weekly - I can stick to a routine", value: "weekly" },
      { label: "Often - I love tending my plants", value: "often" },
    ],
  },
  {
    question: "Do you have pets?",
    options: [
      { label: "Yes - pet safety is a must", value: "yes" },
      { label: "No - no furry friends around", value: "no" },
    ],
  },
  {
    question: "What's your experience level?",
    options: [
      { label: "Beginner - just getting started", value: "beginner" },
      { label: "Intermediate - I've kept a few alive", value: "intermediate" },
      { label: "Expert - bring on the challenge", value: "expert" },
    ],
  },
  {
    question: "What look do you prefer?",
    options: [
      { label: "Trailing vines", value: "trailing" },
      { label: "Big statement leaves", value: "statement" },
      { label: "Compact & cute", value: "compact" },
    ],
  },
];

interface PlantRec {
  name: string;
  slug: string;
  description: string;
}

const plantDatabase: Record<string, PlantRec> = {
  pothos: {
    name: "Pothos",
    slug: "/plants/pothos",
    description:
      "Nearly indestructible trailing vine. Thrives in low light and tolerates irregular watering.",
  },
  "snake-plant": {
    name: "Snake Plant",
    slug: "/plants/snake-plant",
    description:
      "One of the hardiest houseplants around. Tolerates low light and needs water only every 2-3 weeks.",
  },
  "zz-plant": {
    name: "ZZ Plant",
    slug: "/plants/zz-plant",
    description:
      "Virtually unkillable with glossy leaves. Handles low light and drought like a champ.",
  },
  "fiddle-leaf-fig": {
    name: "Fiddle Leaf Fig",
    slug: "/plants/fiddle-leaf-fig",
    description:
      "Stunning statement tree with large, violin-shaped leaves. Loves bright, indirect light.",
  },
  "bird-of-paradise": {
    name: "Bird of Paradise",
    slug: "/plants/bird-of-paradise",
    description:
      "Tropical showstopper with giant banana-like leaves. Needs bright light to thrive.",
  },
  monstera: {
    name: "Monstera",
    slug: "/plants/monstera",
    description:
      "Iconic split-leaf beauty. A statement piece that does well in medium to bright indirect light.",
  },
  "spider-plant": {
    name: "Spider Plant",
    slug: "/plants/spider-plant",
    description:
      "Pet-safe classic that produces adorable baby plantlets. Easy care and adaptable.",
  },
  "boston-fern": {
    name: "Boston Fern",
    slug: "/plants/boston-fern",
    description:
      "Lush, pet-safe fern with graceful arching fronds. Loves humidity and consistent moisture.",
  },
  "prayer-plant": {
    name: "Prayer Plant",
    slug: "/plants/prayer-plant",
    description:
      "Pet-safe beauty with striking leaf patterns that fold up at night. Prefers medium light.",
  },
  "string-of-pearls": {
    name: "String of Pearls",
    slug: "/plants/string-of-pearls",
    description:
      "Delicate trailing succulent with bead-like leaves. A unique conversation starter.",
  },
};

function scorePlants(answers: string[]): PlantRec[] {
  const scores: Record<string, number> = {};
  const allPlants = Object.keys(plantDatabase);
  allPlants.forEach((p) => (scores[p] = 0));

  const [light, watering, pets, experience, look] = answers;

  // Light scoring
  if (light === "low") {
    scores["pothos"] += 3;
    scores["snake-plant"] += 3;
    scores["zz-plant"] += 3;
    scores["prayer-plant"] += 1;
  } else if (light === "medium") {
    scores["pothos"] += 2;
    scores["monstera"] += 2;
    scores["spider-plant"] += 2;
    scores["prayer-plant"] += 2;
    scores["boston-fern"] += 1;
  } else if (light === "bright") {
    scores["fiddle-leaf-fig"] += 3;
    scores["bird-of-paradise"] += 3;
    scores["monstera"] += 2;
    scores["string-of-pearls"] += 2;
  }

  // Watering scoring
  if (watering === "rarely") {
    scores["snake-plant"] += 3;
    scores["zz-plant"] += 3;
    scores["pothos"] += 2;
    scores["string-of-pearls"] += 1;
  } else if (watering === "weekly") {
    scores["monstera"] += 2;
    scores["fiddle-leaf-fig"] += 2;
    scores["spider-plant"] += 2;
    scores["pothos"] += 1;
  } else if (watering === "often") {
    scores["boston-fern"] += 3;
    scores["prayer-plant"] += 2;
    scores["bird-of-paradise"] += 1;
  }

  // Pet safety
  if (pets === "yes") {
    scores["spider-plant"] += 4;
    scores["boston-fern"] += 4;
    scores["prayer-plant"] += 4;
    // Penalize toxic plants
    scores["pothos"] -= 5;
    scores["monstera"] -= 5;
    scores["fiddle-leaf-fig"] -= 5;
    scores["zz-plant"] -= 5;
    scores["bird-of-paradise"] -= 5;
    scores["string-of-pearls"] -= 5;
    scores["snake-plant"] -= 5;
  }

  // Experience level
  if (experience === "beginner") {
    scores["pothos"] += 3;
    scores["snake-plant"] += 3;
    scores["zz-plant"] += 2;
    scores["spider-plant"] += 2;
  } else if (experience === "intermediate") {
    scores["monstera"] += 2;
    scores["prayer-plant"] += 1;
    scores["bird-of-paradise"] += 1;
  } else if (experience === "expert") {
    scores["fiddle-leaf-fig"] += 2;
    scores["string-of-pearls"] += 2;
    scores["bird-of-paradise"] += 2;
    scores["boston-fern"] += 1;
  }

  // Preferred look
  if (look === "trailing") {
    scores["pothos"] += 3;
    scores["string-of-pearls"] += 3;
  } else if (look === "statement") {
    scores["fiddle-leaf-fig"] += 3;
    scores["bird-of-paradise"] += 3;
    scores["monstera"] += 3;
  } else if (look === "compact") {
    scores["zz-plant"] += 2;
    scores["snake-plant"] += 2;
    scores["prayer-plant"] += 2;
    scores["spider-plant"] += 2;
  }

  const sorted = allPlants.sort((a, b) => scores[b] - scores[a]);
  return sorted.slice(0, 3).map((key) => plantDatabase[key]);
}

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<PlantRec[] | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  function handleAnswer(value: string) {
    setDirection("forward");
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ + 1 >= questions.length) {
      setResults(scorePlants(newAnswers));
    } else {
      setCurrentQ(currentQ + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setDirection("back");
      setAnswers(answers.slice(0, -1));
      setCurrentQ(currentQ - 1);
    }
  }

  function restart() {
    setCurrentQ(0);
    setAnswers([]);
    setResults(null);
    setDirection("forward");
  }

  const progress = results
    ? 100
    : ((currentQ) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-green-dark sm:text-4xl">
          Which Plant Is Right for You?
        </h1>
        <p className="mt-3 text-foreground/60">
          Answer a few questions and we&apos;ll match you with your perfect plant.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 overflow-hidden rounded-full bg-green-bg">
          <div
            className="h-full rounded-full bg-green-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-foreground/40">
          {results
            ? "Complete!"
            : `Question ${currentQ + 1} of ${questions.length}`}
        </p>
      </div>

      {/* Quiz content */}
      {!results ? (
        <div
          key={currentQ}
          className={`${
            direction === "forward"
              ? "animate-[fadeSlideIn_0.3s_ease-out]"
              : "animate-[fadeSlideBack_0.3s_ease-out]"
          }`}
        >
          <h2 className="mb-6 text-center text-xl font-semibold text-green-primary">
            {questions[currentQ].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQ].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="w-full rounded-xl border-2 border-border bg-cream px-5 py-4 text-left font-medium text-foreground/80 transition-all hover:border-green-primary hover:bg-green-bg hover:text-green-primary"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {currentQ > 0 && (
            <button
              onClick={handleBack}
              className="mt-4 text-sm text-foreground/40 transition-colors hover:text-green-primary"
            >
              &larr; Back
            </button>
          )}
        </div>
      ) : (
        /* Results */
        <div className="animate-[fadeSlideIn_0.4s_ease-out]">
          <h2 className="mb-2 text-center text-xl font-semibold text-green-primary">
            Your Perfect Plants
          </h2>
          <p className="mb-8 text-center text-sm text-foreground/50">
            Based on your answers, here are our top picks for you.
          </p>

          <div className="space-y-4">
            {results.map((plant, i) => (
              <Link
                key={plant.slug}
                href={plant.slug}
                className="group block rounded-xl border-2 border-border bg-cream p-5 transition-all hover:border-green-primary hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-bg text-lg font-bold text-green-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-green-dark group-hover:text-green-primary">
                      {plant.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                      {plant.description}
                    </p>
                    <span className="mt-2 inline-block text-xs font-medium text-green-primary">
                      View care guide &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={restart}
              className="rounded-lg bg-green-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-dark"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeSlideBack {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
