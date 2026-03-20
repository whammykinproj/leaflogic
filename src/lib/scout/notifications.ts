import { Resend } from "resend";

// Send notification to admin when key events happen
// Uses Resend to email Mac directly

const ADMIN_EMAIL = "mac.kincheloe@gmail.com";

type EventType = "new_signup" | "new_subscription" | "trial_expired" | "churn";

interface NotificationPayload {
  event: EventType;
  userEmail: string;
  userName?: string | null;
  details?: string;
}

const EVENT_SUBJECTS: Record<EventType, string> = {
  new_signup: "New signup",
  new_subscription: "New paying customer!",
  trial_expired: "Trial expired",
  churn: "Customer churned",
};

const EVENT_EMOJI: Record<EventType, string> = {
  new_signup: "👋",
  new_subscription: "💰",
  trial_expired: "⏰",
  churn: "😢",
};

export async function notifyAdmin(payload: NotificationPayload) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";

    const emoji = EVENT_EMOJI[payload.event];
    const subject = `${emoji} JobScout: ${EVENT_SUBJECTS[payload.event]} — ${payload.userEmail}`;

    await resend.emails.send({
      from: fromEmail,
      to: ADMIN_EMAIL,
      subject,
      html: `
        <div style="font-family: monospace; padding: 20px; background: #18181b; color: #e4e4e7; border-radius: 8px;">
          <p style="font-size: 16px; margin-bottom: 12px;">
            <strong>${emoji} ${EVENT_SUBJECTS[payload.event]}</strong>
          </p>
          <table style="font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 12px 4px 0; color: #71717a;">Email:</td>
              <td style="padding: 4px 0;">${payload.userEmail}</td>
            </tr>
            ${payload.userName ? `<tr><td style="padding: 4px 12px 4px 0; color: #71717a;">Name:</td><td style="padding: 4px 0;">${payload.userName}</td></tr>` : ""}
            ${payload.details ? `<tr><td style="padding: 4px 12px 4px 0; color: #71717a;">Details:</td><td style="padding: 4px 0;">${payload.details}</td></tr>` : ""}
            <tr>
              <td style="padding: 4px 12px 4px 0; color: #71717a;">Time:</td>
              <td style="padding: 4px 0;">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</td>
            </tr>
          </table>
        </div>
      `,
    });
  } catch (error) {
    // Never let notification failures break the main flow
    console.error(
      "Admin notification failed:",
      error instanceof Error ? error.message : error
    );
  }
}
