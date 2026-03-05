import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="text-6xl font-bold text-green-primary">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        This plant page hasn&apos;t sprouted yet.
      </p>
      <Link
        href="/articles"
        className="mt-6 rounded-full bg-green-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-light"
      >
        Browse Plant Guides
      </Link>
    </div>
  );
}
