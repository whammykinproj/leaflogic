import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";
import Anthropic from "@anthropic-ai/sdk";
import { getUser } from "@/lib/scout/supabase-server";
import { runScoutForUser, isActiveUser } from "@/lib/scout/scout-engine";

const RATE_LIMIT_HOURS = 4;

export async function POST() {
  // ── Auth ──────────────────────────────────────────────────────────
  const authUser = await getUser();
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use the service-role client so we can read/write any row
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );

  // ── Fetch scout_user & verify active subscription ────────────────
  const { data: scoutUser, error: userError } = await supabase
    .from("scout_users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (userError || !scoutUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!isActiveUser(scoutUser)) {
    return NextResponse.json(
      { error: "Subscription inactive" },
      { status: 403 }
    );
  }

  // ── Rate limit: 1 run per 4 hours ────────────────────────────────
  const cutoff = new Date(
    Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data: recentDigests } = await supabase
    .from("scout_digests")
    .select("sent_at")
    .eq("user_id", authUser.id)
    .gte("sent_at", cutoff)
    .order("sent_at", { ascending: false })
    .limit(1);

  if (recentDigests && recentDigests.length > 0) {
    const lastSentAt = new Date(recentDigests[0].sent_at);
    const nextRunAt = new Date(
      lastSentAt.getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1000
    );
    return NextResponse.json(
      {
        error: "Too soon",
        nextRunAt: nextRunAt.toISOString(),
      },
      { status: 429 }
    );
  }

  // ── Load profile ─────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("scout_profiles")
    .select("*")
    .eq("user_id", authUser.id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found. Complete onboarding first." },
      { status: 404 }
    );
  }

  // ── Run scout ─────────────────────────────────────────────────────
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";

  try {
    const result = await runScoutForUser(
      scoutUser,
      profile,
      anthropic,
      resend,
      fromEmail,
      supabase
    );

    return NextResponse.json({
      success: true,
      jobsFound: result.jobsFound,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[RunNow] Scout failed for user ${authUser.id}:`, message);
    return NextResponse.json(
      { error: "Scout run failed. Try again later." },
      { status: 500 }
    );
  }
}
