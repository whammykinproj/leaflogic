import { headers } from "next/headers";
import Footer from "./Footer";

/**
 * Server-side wrapper that reads the x-pathname header (set by middleware)
 * and suppresses the LeafLogic footer on /scout routes.
 * This is a reliable server-side fallback for the client-side usePathname()
 * check in Footer.tsx, which may not work consistently in production.
 */
export default async function FooterWrapper() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Don't render the LeafLogic footer on any scout route
  if (pathname.startsWith("/scout")) return null;

  return <Footer />;
}
