import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watering Calculator - Find Your Plant's Perfect Schedule",
  description:
    "Calculate the ideal watering frequency for your houseplant based on plant type, pot size, light level, and season. Includes care tips and warning signs.",
  openGraph: {
    title: "Watering Calculator - Find Your Plant's Perfect Schedule",
    description:
      "Calculate the ideal watering frequency for your houseplant based on plant type, pot size, light level, and season.",
  },
};

export default function WateringCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
