import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LeafLogic",
  description:
    "LeafLogic is your trusted resource for indoor plant care. Learn about our mission to help every plant parent succeed.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">About LeafLogic</h1>

      <div className="prose mt-8">
        <p>
          LeafLogic was born from a simple idea: everyone deserves to enjoy
          thriving indoor plants, regardless of experience level.
        </p>

        <h2>Our Mission</h2>
        <p>
          We create clear, actionable plant care guides that cut through the
          noise. No fluff, no jargon — just practical advice backed by
          horticultural science and real-world experience.
        </p>

        <h2>What We Cover</h2>
        <ul>
          <li>
            <strong>Care Guides</strong> — Step-by-step care instructions for
            popular houseplants
          </li>
          <li>
            <strong>Troubleshooting</strong> — Diagnose and fix common plant
            problems like yellowing leaves, drooping, and pests
          </li>
          <li>
            <strong>Propagation</strong> — Learn how to multiply your plant
            collection for free
          </li>
          <li>
            <strong>Plant Selection</strong> — Find the perfect plants for your
            space, light conditions, and lifestyle
          </li>
        </ul>

        <h2>Why Trust Us?</h2>
        <p>
          Every article on LeafLogic is thoroughly researched and reviewed for
          accuracy. We reference trusted horticultural sources and draw on years
          of hands-on experience growing hundreds of plant species indoors.
        </p>

        <h2>Contact</h2>
        <p>
          Have a question or suggestion? We&apos;d love to hear from you. Reach
          out at{" "}
          <a href="mailto:hello@leaflogic.app">hello@leaflogic.app</a>.
        </p>
      </div>
    </div>
  );
}
