import Link from "next/link";

export default function ScoutNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl font-bold text-zinc-800 mb-4">404</div>
        <p className="text-zinc-400 mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/scout"
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-6 py-2.5 rounded-lg transition"
        >
          Back to JobScout AI
        </Link>
      </div>
    </div>
  );
}
