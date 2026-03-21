import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body as { email?: string; source?: string };

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Store in Supabase using service role (public endpoint, no auth)
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

    const { error: dbError } = await supabase
      .from("scout_waitlist")
      .upsert(
        { email: email.toLowerCase().trim(), source: source || "landing_page" },
        { onConflict: "email" }
      );

    if (dbError) {
      console.error("Waitlist insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save email" },
        { status: 500 }
      );
    }

    // Send confirmation email via Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";

      await resend.emails.send({
        from: fromEmail,
        to: email.toLowerCase().trim(),
        subject: "You're on the list — JobScout AI insights coming soon",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 22px; font-weight: 700;">
                <span style="color: #10b981;">JobScout</span>
                <span style="color: #999; font-weight: 400;"> AI</span>
              </span>
            </div>

            <h1 style="font-size: 22px; color: #111; margin-bottom: 16px;">
              You're in!
            </h1>

            <p style="color: #555; font-size: 14px; line-height: 1.7;">
              Thanks for subscribing. You'll get free job market insights, salary trends, and career tips delivered to your inbox.
            </p>

            <p style="color: #555; font-size: 14px; line-height: 1.7;">
              In the meantime, here's what JobScout AI can do for your job search:
            </p>

            <ul style="color: #555; font-size: 14px; line-height: 1.9;">
              <li>Scans 6+ job boards daily while you sleep</li>
              <li>Matches roles to your exact background and preferences</li>
              <li>Drafts personalized pitches for every match</li>
              <li>Delivers everything to your inbox each morning</li>
            </ul>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://leaflogic.app"}/scout/login?signup=true" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                Try JobScout AI free for 7 days
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
            <p style="color: #999; font-size: 11px; text-align: center;">
              You're receiving this because you subscribed at JobScout AI.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // Don't fail the request if email fails — the signup is still saved
      console.error("Waitlist confirmation email error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
