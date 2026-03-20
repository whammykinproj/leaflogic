import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "./welcome-email";
import { notifyAdmin } from "@/lib/scout/notifications";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/scout/login?error=no_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    return NextResponse.redirect(`${origin}/scout/login?error=auth_failed`);
  }

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/scout/login?error=no_user`);
  }

  // Check if scout_user record exists, create if not
  const serviceSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: existingUser } = await serviceSupabase
    .from("scout_users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingUser) {
    // New user — create scout_user with 7-day trial
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await serviceSupabase.from("scout_users").insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || null,
      subscription_status: "trialing",
      trial_ends_at: trialEnd.toISOString(),
    });

    // Send welcome email + notify admin (non-blocking)
    sendWelcomeEmail(
      user.email!,
      user.user_metadata?.full_name || null
    ).catch((err) =>
      console.error("Welcome email failed:", err instanceof Error ? err.message : err)
    );

    notifyAdmin({
      event: "new_signup",
      userEmail: user.email!,
      userName: user.user_metadata?.full_name || null,
    });

    // Redirect to onboarding for new users
    return NextResponse.redirect(`${origin}/scout/onboarding`);
  }

  // Check if they have a profile
  const { data: profile } = await serviceSupabase
    .from("scout_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.redirect(`${origin}/scout/onboarding`);
  }

  // Existing user with profile — go to dashboard
  return NextResponse.redirect(`${origin}/scout/dashboard`);
}
