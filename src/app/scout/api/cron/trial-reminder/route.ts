import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";

// Vercel Cron — runs daily at 2pm UTC
// Sends reminder email to users whose trial ends tomorrow

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

  // Find users whose trial ends within the next 24-48 hours
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const { data: expiringUsers } = await supabase
    .from("scout_users")
    .select("*")
    .eq("subscription_status", "trialing")
    .gte("trial_ends_at", tomorrow.toISOString())
    .lt("trial_ends_at", dayAfter.toISOString());

  if (!expiringUsers || expiringUsers.length === 0) {
    return NextResponse.json({ message: "No expiring trials", sent: 0 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobscoutai.com";

  let sent = 0;
  for (const user of expiringUsers) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Your JobScout AI trial ends tomorrow",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 20px; font-weight: 700;">
                <span style="color: #10b981;">JobScout</span>
                <span style="color: #999; font-weight: 400;"> AI</span>
              </span>
            </div>
            <h1 style="font-size: 20px; color: #111;">Your free trial ends tomorrow</h1>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Hey ${user.full_name || "there"},
            </p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Your 7-day JobScout AI trial wraps up tomorrow. After that, your daily job digests will pause.
            </p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              To keep getting AI-curated job matches and personalized pitches delivered to your inbox:
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${baseUrl}/scout/dashboard" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                Subscribe — $29/mo
              </a>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">
              Cancel anytime. No questions asked.
            </p>
          </div>
        `,
      });
      sent++;
    } catch (error) {
      console.error(
        `Failed to send trial reminder to ${user.email}:`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  return NextResponse.json({ sent });
}
