import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // In demo mode, return a client pointing to a dummy URL
  // This prevents crashes — actual auth is bypassed server-side
  if (!url || url === "https://your-project.supabase.co" || url === "") {
    return createBrowserClient(
      "https://demo.supabase.co",
      "demo-anon-key"
    );
  }

  return createBrowserClient(url, key!);
}
