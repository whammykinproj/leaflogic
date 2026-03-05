import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-green-dark text-white/60">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-light text-sm font-bold text-green-dark">
                L
              </span>
              <span className="text-lg font-bold text-white">
                Leaf<span className="text-green-light">Logic</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Your trusted resource for indoor plant care. Simple guides,
              real results.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Explore
            </h3>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/articles" className="hover:text-green-light transition-colors">
                Plant Guides
              </Link>
              <Link href="/plants" className="hover:text-green-light transition-colors">
                Plants A-Z
              </Link>
              <Link href="/about" className="hover:text-green-light transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Legal
            </h3>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="hover:text-green-light transition-colors">
                Privacy Policy
              </Link>
              <a href="mailto:hello@leaflogic.app" className="hover:text-green-light transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} LeafLogic. All rights reserved.</p>
          <p className="mt-1 text-white/30">
            LeafLogic is a participant in the Amazon Services LLC Associates Program.
          </p>
        </div>
      </div>
    </footer>
  );
}
