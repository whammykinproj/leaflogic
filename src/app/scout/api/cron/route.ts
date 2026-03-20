import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";
import Anthropic from "@anthropic-ai/sdk";
import {
  isActiveUser,
  runScoutForUser,
  type EngineUser,
} from "@/lib/scout/scout-engine";

// Vercel Cron — runs daily at 10am ET (2pm UTC)
// vercel.json: { "path": "/scout/api/cron", "schedule": "0 14 * * *" }

// DB MIGRATION SUGGESTION:
// ALTER TABLE scout_digests ADD COLUMN sources_checked TEXT[] DEFAULT '{}';
// -- Tracks which sources were actually scraped (vs failed) per digest run.

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  // Get all active users with profiles
  const { data: users, error: usersError } = await supabase
    .from("scout_users")
    .select("*")
    .in("subscription_status", ["active", "trialing"]);

  if (usersError || !users) {
    console.error("Failed to fetch users:", usersError?.message);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }

  const activeUsers = (users as EngineUser[]).filter(isActiveUser);

  if (activeUsers.length === 0) {
    return NextResponse.json({ message: "No active users", processed: 0 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";

  const results: { userId: string; success: boolean; jobsFound: number }[] = [];

  // Process users sequentially to avoid rate limits
  for (const user of activeUsers) {
    const { data: profile } = await supabase
      .from("scout_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      console.warn(`No profile for user ${user.id}, skipping`);
      continue;
    }

    try {
      const result = await runScoutForUser(
        user,
        profile,
        anthropic,
        resend,
        fromEmail,
        supabase
      );
      results.push({ userId: user.id, ...result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Scout failed for user ${user.id}:`, message);
      results.push({ userId: user.id, success: false, jobsFound: 0 });
    }
  }

  return NextResponse.json({
    processed: results.length,
    successful: results.filter((r) => r.success).length,
    totalJobs: results.reduce((sum, r) => sum + r.jobsFound, 0),
  });
}
