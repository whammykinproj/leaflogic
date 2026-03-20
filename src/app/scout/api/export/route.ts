import { NextResponse } from "next/server";
import { getUser, getScoutProfile } from "@/lib/scout/supabase-server";
import { createClient } from "@/lib/scout/supabase-server";

// Export all user data as JSON (GDPR-friendly)
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Fetch all user data in parallel
  const [profileResult, digestsResult, applicationsResult, userResult] =
    await Promise.all([
      getScoutProfile(user.id),
      supabase
        .from("scout_digests")
        .select("id, jobs_found, sent_at")
        .eq("user_id", user.id)
        .order("sent_at", { ascending: false }),
      supabase
        .from("scout_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("scout_users")
        .select("email, full_name, subscription_status, trial_ends_at, created_at")
        .eq("id", user.id)
        .single(),
    ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    account: userResult.data || {},
    profile: profileResult || {},
    digests: digestsResult.data || [],
    applications: applicationsResult.data || [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="jobscout-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
