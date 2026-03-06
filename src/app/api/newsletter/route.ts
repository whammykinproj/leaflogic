import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const recentSignups = new Map<string, number>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const last = recentSignups.get(email);
  if (last && now - last < 60_000) return true;
  recentSignups.set(email, now);
  // Clean old entries periodically
  if (recentSignups.size > 1000) {
    for (const [key, time] of recentSignups) {
      if (now - time > 60_000) recentSignups.delete(key);
    }
  }
  return false;
}

const WELCOME_HTML = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fafdf7; padding: 0;">
  <div style="background-color: #0f3d25; padding: 32px 24px; text-align: center;">
    <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">LeafLogic</h1>
    <p style="color: #34d399; font-size: 14px; margin: 8px 0 0 0;">Smart plant care, simplified</p>
  </div>

  <div style="padding: 32px 24px;">
    <h2 style="color: #0f3d25; font-size: 24px; margin: 0 0 16px 0;">Welcome to the plant fam!</h2>
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Thanks for joining LeafLogic. We send one actionable plant tip each week to help you grow healthier, happier houseplants. No fluff, no spam.
    </p>

    <div style="background-color: #ffffff; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
      <h3 style="color: #0f3d25; font-size: 18px; margin: 0 0 16px 0;">Here are 3 guides to get you started:</h3>

      <div style="margin: 0 0 16px 0;">
        <a href="https://leaflogic.app/articles/best-low-light-houseplants-for-beginners-2024-guide" style="color: #0f3d25; font-size: 16px; font-weight: 600; text-decoration: none;">1. Best Low Light Houseplants for Beginners</a>
        <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0; line-height: 1.4;">Perfect picks for dim apartments and offices.</p>
      </div>

      <div style="margin: 0 0 16px 0;">
        <a href="https://leaflogic.app/articles/how-to-save-an-overwatered-plant-before-it-s-too-late" style="color: #0f3d25; font-size: 16px; font-weight: 600; text-decoration: none;">2. How to Save an Overwatered Plant</a>
        <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0; line-height: 1.4;">Rescue your plant before root rot sets in.</p>
      </div>

      <div style="margin: 0;">
        <a href="https://leaflogic.app/articles/why-are-my-plant-leaves-turning-yellow-10-common-causes" style="color: #0f3d25; font-size: 16px; font-weight: 600; text-decoration: none;">3. Why Are My Plant Leaves Turning Yellow?</a>
        <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0; line-height: 1.4;">The 10 most common causes and how to fix each one.</p>
      </div>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
      Happy growing,<br>
      <strong style="color: #0f3d25;">The LeafLogic Team</strong>
    </p>
  </div>

  <div style="background-color: #f3f4f6; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
      You received this because you signed up at leaflogic.app.<br>
      Don't want these emails? Simply reply with "unsubscribe" and we'll remove you right away.
    </p>
  </div>
</div>
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (isRateLimited(email)) {
      return NextResponse.json(
        { error: "You already signed up. Check your inbox!" },
        { status: 429 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Add to Resend audience if configured
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      try {
        await resend.contacts.create({
          email,
          audienceId,
        });
      } catch (err) {
        console.error("Failed to add contact to audience:", err);
        // Continue to send welcome email even if audience add fails
      }
    }

    // Send welcome email
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "LeafLogic <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to LeafLogic! Your first plant tip inside",
      html: WELCOME_HTML,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
