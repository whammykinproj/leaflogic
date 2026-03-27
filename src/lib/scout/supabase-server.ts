import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  isDemoMode,
  DEMO_USER,
  DEMO_SCOUT_USER,
  DEMO_PROFILE,
} from "./demo";

// A proxy that absorbs any chain of method calls and returns empty success data.
// This lets demo mode pass through any Supabase query without crashing.
function createDemoProxy(): ReturnType<typeof createServerClient> {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      // Terminal methods that should return data
      if (prop === "then") return undefined; // not a thenable
      if (prop === "single" || prop === "maybeSingle") {
        return () => Promise.resolve({ data: null, error: null });
      }
      // Return chainable proxy for everything else
      return (..._args: unknown[]) => new Proxy({}, handler);
    },
  };
  const proxy = new Proxy({}, handler);
  // Top-level: supabase.from(), supabase.auth, etc.
  return new Proxy(
    {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => proxy,
    },
    {
      get(target, prop) {
        if (prop in target) return (target as Record<string | symbol, unknown>)[prop];
        return () => proxy;
      },
    }
  ) as unknown as ReturnType<typeof createServerClient>;
}

export async function createClient() {
  if (isDemoMode()) {
    return createDemoProxy();
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — can't set cookies, safe to ignore
          }
        },
      },
    }
  );
}

export async function getUser() {
  if (isDemoMode()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return DEMO_USER as any;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getScoutUser() {
  if (isDemoMode()) {
    return DEMO_SCOUT_USER;
  }

  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("scout_users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getScoutProfile(userId: string) {
  if (isDemoMode()) {
    return DEMO_PROFILE;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("scout_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}
