import { NextResponse } from "next/server";
import { getUser, createClient } from "@/lib/scout/supabase-server";
import { isDemoMode } from "@/lib/scout/demo";

export interface ActivityItem {
  id: string;
  type: "digest" | "application_created" | "status_change";
  description: string;
  icon: string;
  timestamp: string;
}

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    return NextResponse.json([
      { id: "d1", type: "digest", description: "Digest received (7 jobs matched)", icon: "mail", timestamp: new Date(now - 1 * day).toISOString() },
      { id: "d2", type: "application_created", description: "Saved Senior PM at Anthropic to tracker", icon: "bookmark", timestamp: new Date(now - 1.5 * day).toISOString() },
      { id: "d3", type: "status_change", description: "Applied to Stripe for Product Manager", icon: "send", timestamp: new Date(now - 2 * day).toISOString() },
      { id: "d4", type: "digest", description: "Digest received (5 jobs matched)", icon: "mail", timestamp: new Date(now - 2 * day).toISOString() },
      { id: "d5", type: "status_change", description: "Interviewing at Ramp for Chief of Staff", icon: "chat", timestamp: new Date(now - 3 * day).toISOString() },
      { id: "d6", type: "digest", description: "Digest received (9 jobs matched)", icon: "mail", timestamp: new Date(now - 3 * day).toISOString() },
    ]);
  }

  const supabase = await createClient();
  const items: ActivityItem[] = [];

  // Fetch recent digests (last 30 days)
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: digests } = await supabase
    .from("scout_digests")
    .select("id, jobs_found, sent_at")
    .eq("user_id", user.id)
    .gte("sent_at", thirtyDaysAgo)
    .order("sent_at", { ascending: false })
    .limit(10);

  if (digests) {
    for (const d of digests) {
      items.push({
        id: `digest-${d.id}`,
        type: "digest",
        description: `Digest received (${d.jobs_found} job${d.jobs_found !== 1 ? "s" : ""} matched)`,
        icon: "mail",
        timestamp: d.sent_at,
      });
    }
  }

  // Fetch recent applications
  const { data: apps } = await supabase
    .from("scout_applications")
    .select("id, company, role_title, status, created_at, updated_at")
    .eq("user_id", user.id)
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: false })
    .limit(10);

  if (apps) {
    for (const app of apps) {
      // Created event
      items.push({
        id: `app-created-${app.id}`,
        type: "application_created",
        description: `Saved ${app.role_title} at ${app.company} to tracker`,
        icon: "bookmark",
        timestamp: app.created_at,
      });

      // Status change event (if status is not "saved" and updated_at differs from created_at)
      if (
        app.status !== "saved" &&
        app.updated_at !== app.created_at
      ) {
        const statusLabel =
          app.status === "applied"
            ? "Applied to"
            : app.status === "interviewing"
              ? "Interviewing at"
              : app.status === "offered"
                ? "Received offer from"
                : app.status === "rejected"
                  ? "Rejected by"
                  : `${app.status} —`;

        items.push({
          id: `app-status-${app.id}`,
          type: "status_change",
          description: `${statusLabel} ${app.company} for ${app.role_title}`,
          icon:
            app.status === "offered"
              ? "trophy"
              : app.status === "interviewing"
                ? "chat"
                : app.status === "applied"
                  ? "send"
                  : "circle",
          timestamp: app.updated_at,
        });
      }
    }
  }

  // Sort by timestamp descending and take 10
  items.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return NextResponse.json(items.slice(0, 10));
}
