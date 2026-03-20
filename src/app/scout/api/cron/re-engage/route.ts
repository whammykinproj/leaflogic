import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";

// Vercel Cron — runs weekly on Mondays at 3pm UTC
// Sends re-engagement email to users who haven't received a digest in 7+ days
// Add to vercel.json: { "path": "/scout/api/cron/re-engage", "schedule": "0 15 * * 1" }

export async function GET(request: NextRequest) {
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

  // Find active/trialing users with no digest in the last 7 days
  // This catches users who signed up but never completed onboarding,
  // or whose digests have been failing silently
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: users } = await supabase
    .from("scout_users")
    .select("id, email, full_name, subscription_status, trial_ends_at")
    .in("subscription_status", ["active", "trialing"]);

  if (!users || users.length === 0) {
    return NextResponse.json({ message: "No users to check", sent: 0 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobscoutai.com";

  let sent = 0;

  for (const user of users) {
    // Check if user is still within trial
    if (
      user.subscription_status === "trialing" &&
      user.trial_ends_at &&
      new Date(user.trial_ends_at) < new Date()
    ) {
      continue; // Trial expired, skip
    }

    // Check last digest
    const { data: lastDigest } = await supabase
      .from("scout_digests")
      .select("sent_at")
      .eq("user_id", user.id)
      .order("sent_at", { ascending: false })
      .limit(1)
      .single();

    // Check if they have a profile at all
    const { data: profile } = await supabase
      .from("scout_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const needsReengagement =
      !lastDigest || new Date(lastDigest.sent_at) < new Date(sevenDaysAgo);

    if (!needsReengagement) continue;

    const hasProfile = !!profile;
    const firstName = user.full_name?.split(" ")[0] || "there";

    try {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: hasProfile
          ? `Your JobScout is waiting — ${firstName}, jobs are piling up`
          : "Finish setting up your JobScout AI profile",
        html: hasProfile
          ? `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 20px; font-weight: 700;">
                <span style="color: #10b981;">JobScout</span>
                <span style="color: #999; font-weight: 400;"> AI</span>
              </span>
            </div>
            <h1 style="font-size: 20px; color: #111;">Hey ${firstName}, your scout misses you</h1>
            <p style="color: #555; font-size: 14px; line-height: 1.7;">
              It's been a while since your last job digest. The job market moves fast — new roles matching your profile are posted every day.
            </p>
            <p style="color: #555; font-size: 14px; line-height: 1.7;">
              Your scout is ready to get back to work. Update your profile or just sit back and let the digests flow.
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${baseUrl}/scout/dashboard" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                Check your dashboard
              </a>
            </div>
            <p style="color: #555; font-size: 14px; line-height: 1.7;">
              New this week: AI cover letter generator and interview prep tools. Try them out!
            </p>
          </div>
        `
          : `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 20px; font-weight: 700;">
                <span style="color: #10b981;">JobScout</span>
                <span style="color: #999; font-weight: 400;"> AI</span>
              </span>
            </div>
            <h1 style="font-size: 20px; color: #111;">You're almost there, ${firstName}</h1>
            <p style="color: #555; font-size: 14px; line-height: 1.7;">
              You signed up for JobScout AI but haven't finished setting up your profile yet. Your free trial is ticking!
            </p>
            <p style="color: #555; font-size: 14px; line-height: 1.7;">
              It only takes 5 minutes — paste your resume, pick your target roles, and tomorrow morning you'll wake up to a personalized job digest.
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${baseUrl}/scout/onboarding" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                Complete your profile
              </a>
            </div>
          </div>
        `,
      });
      sent++;
    } catch (error) {
      console.error(
        `Re-engage email failed for ${user.email}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  return NextResponse.json({ sent });
}
