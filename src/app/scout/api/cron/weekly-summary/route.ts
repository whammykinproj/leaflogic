import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";
import { isActiveUser, type EngineUser } from "@/lib/scout/scout-engine";

// Vercel Cron — runs Fridays at 4pm UTC
// vercel.json: { "path": "/scout/api/cron/weekly-summary", "schedule": "0 16 * * 5" }

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

  const { data: users } = await supabase
    .from("scout_users")
    .select("*")
    .in("subscription_status", ["active", "trialing"]);

  if (!users || users.length === 0) {
    return NextResponse.json({ message: "No active users", sent: 0 });
  }

  const activeUsers = (users as EngineUser[]).filter(isActiveUser);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "JobScout AI <noreply@resend.dev>";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobscoutai.com";

  // This week = last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let sent = 0;

  for (const user of activeUsers) {
    try {
      // Jobs matched this week
      const { data: weekDigests } = await supabase
        .from("scout_digests")
        .select("jobs_found, sent_at")
        .eq("user_id", user.id)
        .gte("sent_at", weekAgo);

      const jobsMatched =
        weekDigests?.reduce((sum, d) => sum + (d.jobs_found || 0), 0) ?? 0;
      const digestCount = weekDigests?.length ?? 0;

      // Applications tracked this week
      const { data: weekApps } = await supabase
        .from("scout_applications")
        .select("id, company, role_title, status, created_at, updated_at")
        .eq("user_id", user.id)
        .gte("created_at", weekAgo);

      const appsTracked = weekApps?.length ?? 0;

      // Status changes this week (apps that moved beyond "saved")
      const { data: statusChanges } = await supabase
        .from("scout_applications")
        .select("id, company, role_title, status, updated_at")
        .eq("user_id", user.id)
        .neq("status", "saved")
        .gte("updated_at", weekAgo);

      // Calculate streak — consecutive weeks with at least one digest
      let streakWeeks = 0;
      const { data: allDigests } = await supabase
        .from("scout_digests")
        .select("sent_at")
        .eq("user_id", user.id)
        .order("sent_at", { ascending: false })
        .limit(52); // up to a year

      if (allDigests && allDigests.length > 0) {
        // Count consecutive weeks going backwards from now
        const now = Date.now();
        for (let w = 0; w < 52; w++) {
          const weekStart = now - (w + 1) * 7 * 24 * 60 * 60 * 1000;
          const weekEnd = now - w * 7 * 24 * 60 * 60 * 1000;
          const hasDigest = allDigests.some((d) => {
            const t = new Date(d.sent_at).getTime();
            return t >= weekStart && t < weekEnd;
          });
          if (hasDigest) {
            streakWeeks++;
          } else {
            break;
          }
        }
      }

      // Read streak_days from scout_users if available
      const { data: scoutUser } = await supabase
        .from("scout_users")
        .select("streak_days, last_active_at")
        .eq("id", user.id)
        .single();

      const streakDays = scoutUser?.streak_days ?? 0;

      const firstName = user.full_name?.split(" ")[0] || "there";

      // Build status change HTML
      let statusChangeHtml = "";
      if (statusChanges && statusChanges.length > 0) {
        const changeItems = statusChanges
          .slice(0, 5)
          .map((sc) => {
            const statusEmoji =
              sc.status === "applied"
                ? "&#x1F4E8;"
                : sc.status === "interviewing"
                  ? "&#x1F3A4;"
                  : sc.status === "offered"
                    ? "&#x1F3C6;"
                    : "&#x25CF;";
            return `<li style="padding:4px 0;font-size:14px;color:#333;">${statusEmoji} <strong>${sc.company}</strong> — ${sc.role_title} <span style="color:#10b981;font-weight:600;">(${sc.status})</span></li>`;
          })
          .join("");
        statusChangeHtml = `
          <div style="margin-top:20px;">
            <h3 style="font-size:16px;color:#111;margin-bottom:8px;">Pipeline Movement</h3>
            <ul style="list-style:none;padding:0;margin:0;">${changeItems}</ul>
          </div>
        `;
      }

      // Streak message
      const streakMessage =
        streakWeeks >= 4
          ? `<p style="font-size:14px;color:#10b981;font-weight:600;margin-top:16px;">&#x1F525; ${streakWeeks}-week streak! You're on fire — consistency wins in the job search.</p>`
          : streakWeeks >= 2
            ? `<p style="font-size:14px;color:#f59e0b;margin-top:16px;">&#x1F525; ${streakWeeks}-week streak — keep the momentum going!</p>`
            : "";

      const dailyStreakLine =
        streakDays > 0
          ? `<p style="font-size:13px;color:#a78bfa;margin-top:8px;">&#x1F525; Daily activity streak: ${streakDays} day${streakDays !== 1 ? "s" : ""}</p>`
          : "";

      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: `Your Week in Review — ${jobsMatched} jobs matched`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;background:#fafafa;padding:32px;">
            <div style="text-align:center;margin-bottom:24px;">
              <span style="font-size:20px;font-weight:700;">
                <span style="color:#10b981;">JobScout</span>
                <span style="color:#999;font-weight:400;"> AI</span>
              </span>
            </div>
            <h1 style="font-size:22px;color:#111;border-bottom:2px solid #10b981;padding-bottom:8px;">
              Weekly Progress Report
            </h1>
            <p style="color:#555;font-size:14px;">Hey ${firstName}, here's how your job search went this week.</p>

            <div style="display:flex;gap:12px;margin:20px 0;">
              <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;text-align:center;">
                <p style="font-size:28px;font-weight:700;color:#10b981;margin:0;">${jobsMatched}</p>
                <p style="font-size:12px;color:#999;margin:4px 0 0;">Jobs matched</p>
              </div>
              <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;text-align:center;">
                <p style="font-size:28px;font-weight:700;color:#10b981;margin:0;">${digestCount}</p>
                <p style="font-size:12px;color:#999;margin:4px 0 0;">Digests received</p>
              </div>
              <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;text-align:center;">
                <p style="font-size:28px;font-weight:700;color:#10b981;margin:0;">${appsTracked}</p>
                <p style="font-size:12px;color:#999;margin:4px 0 0;">Jobs tracked</p>
              </div>
            </div>

            ${statusChangeHtml}
            ${streakMessage}
            ${dailyStreakLine}

            <div style="margin-top:24px;padding:16px;background:#10b98115;border-radius:12px;border:1px solid #10b98133;">
              <p style="font-size:14px;color:#111;margin:0;font-weight:600;">
                ${jobsMatched > 0
                  ? "Keep going! Your next digest arrives Monday morning."
                  : "No matches this week, but your scout is still working. Consider expanding your target roles or locations."}
              </p>
            </div>

            <div style="text-align:center;margin-top:24px;">
              <a href="${baseUrl}/scout/dashboard" style="display:inline-block;background:#10b981;color:#000;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">
                View Dashboard
              </a>
            </div>

            <hr style="margin-top:32px;border:none;border-top:1px solid #e5e5e5;">
            <p style="font-size:11px;color:#999;text-align:center;margin-top:16px;">
              <a href="${baseUrl}/scout/settings" style="color:#10b981;">Manage email preferences</a>
            </p>
          </div>
        `,
      });

      sent++;
    } catch (error) {
      console.error(
        `Weekly summary failed for ${user.email}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  return NextResponse.json({ sent, total: activeUsers.length });
}
