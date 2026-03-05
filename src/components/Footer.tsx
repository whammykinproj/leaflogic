import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-green-bg">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LeafLogic. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/about" className="hover:text-green-primary transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-green-primary transition-colors">
              Privacy
            </Link>
            <Link href="/articles" className="hover:text-green-primary transition-colors">
              Plant Guides
            </Link>
          </nav>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          LeafLogic is a participant in the Amazon Services LLC Associates Program.
        </p>
      </div>
    </footer>
  );
}
