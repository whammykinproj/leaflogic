import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/scout/dashboard", "/scout/onboarding"];
// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ["/scout/login"];
// Public scout routes that never need auth checks
const PUBLIC_ROUTES = ["/scout", "/scout/privacy", "/scout/terms"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /scout routes
  if (!pathname.startsWith("/scout")) {
    return NextResponse.next();
  }

  // Skip auth for API routes, public pages, and static assets
  if (
    pathname.startsWith("/scout/api/") ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Gracefully handle missing Supabase config (pre-setup)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // No Supabase configured yet — let all routes through
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — redirect to login if not authenticated
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/scout/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth routes — redirect to dashboard if already authenticated
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/scout/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/scout/:path*"],
};
