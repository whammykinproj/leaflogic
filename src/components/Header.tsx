import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-100">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-green-primary">
          LeafLogic
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-green-primary transition-colors">
            Home
          </Link>
          <Link href="/articles" className="hover:text-green-primary transition-colors">
            Plant Guides
          </Link>
          <Link href="/about" className="hover:text-green-primary transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
