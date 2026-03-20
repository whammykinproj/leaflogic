import { Resend } from "resend";

export async function sendWelcomeEmail(email: string, name: string | null) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobscoutai.com";

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Welcome to JobScout AI — your first digest arrives tomorrow",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 22px; font-weight: 700;">
            <span style="color: #10b981;">JobScout</span>
            <span style="color: #999; font-weight: 400;"> AI</span>
          </span>
        </div>

        <h1 style="font-size: 22px; color: #111; margin-bottom: 16px;">
          Welcome${name ? `, ${name.split(" ")[0]}` : ""}!
        </h1>

        <p style="color: #555; font-size: 14px; line-height: 1.7;">
          You're all set. Here's what happens next:
        </p>

        <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <div style="margin-bottom: 12px;">
            <span style="display: inline-block; background: #10b981; color: #000; font-weight: 700; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 8px;">1</span>
            <strong style="color: #111;">Complete your profile</strong>
            <span style="color: #666; font-size: 13px;"> — paste your resume, pick target roles & companies</span>
          </div>
          <div style="margin-bottom: 12px;">
            <span style="display: inline-block; background: #10b981; color: #000; font-weight: 700; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 8px;">2</span>
            <strong style="color: #111;">Tomorrow morning</strong>
            <span style="color: #666; font-size: 13px;"> — your first AI-curated digest lands in your inbox</span>
          </div>
          <div>
            <span style="display: inline-block; background: #10b981; color: #000; font-weight: 700; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 8px;">3</span>
            <strong style="color: #111;">Copy, paste, apply</strong>
            <span style="color: #666; font-size: 13px;"> — each match includes a tailored pitch ready to use</span>
          </div>
        </div>

        <p style="color: #555; font-size: 14px; line-height: 1.7;">
          Your 7-day free trial is active. You'll get full access to everything — daily digests, AI-drafted pitches, and all job board sources.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${baseUrl}/scout/onboarding" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px;">
            Set up your profile
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
        <p style="color: #999; font-size: 11px; text-align: center;">
          Questions? Reply to this email or reach us at support@jobscoutai.com
        </p>
      </div>
    `,
  });
}
