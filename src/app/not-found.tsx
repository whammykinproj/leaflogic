import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-bg text-4xl">
        &#127793;
      </div>
      <h1 className="mt-6 text-5xl font-bold text-green-primary">404</h1>
      <p className="mt-3 text-lg text-foreground/50">
        This page hasn&apos;t sprouted yet.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/articles"
          className="rounded-xl bg-green-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-dark"
        >
          Browse Guides
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground/60 transition-colors hover:bg-green-bg"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
