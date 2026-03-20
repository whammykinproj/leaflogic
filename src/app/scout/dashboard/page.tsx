import { redirect } from "next/navigation";
import { getUser } from "@/lib/scout/supabase-server";
import { createClient } from "@/lib/scout/supabase-server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/scout/login");

  const supabase = await createClient();

  const { data: scoutUser } = await supabase
    .from("scout_users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!scoutUser) redirect("/scout/login");

  const { data: profile } = await supabase
    .from("scout_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/scout/onboarding");

  const { data: digests } = await supabase
    .from("scout_digests")
    .select("*")
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(10);

  // Calculate subscription gate
  let gate: "active" | "trialing" | "expired" = "expired";
  if (scoutUser.subscription_status === "active") {
    gate = "active";
  } else if (
    scoutUser.subscription_status === "trialing" &&
    scoutUser.trial_ends_at &&
    new Date(scoutUser.trial_ends_at) > new Date()
  ) {
    gate = "trialing";
  }

  const trialDaysLeft =
    scoutUser.trial_ends_at
      ? Math.max(
          0,
          Math.ceil(
            (new Date(scoutUser.trial_ends_at).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  // Update streak: track daily activity
  const now = new Date();
  const lastActive = scoutUser.last_active_at
    ? new Date(scoutUser.last_active_at)
    : null;
  const isNewDay =
    !lastActive ||
    lastActive.toDateString() !== now.toDateString();

  if (isNewDay) {
    // Check if it's consecutive (last active was yesterday or today)
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive =
      lastActive && lastActive.toDateString() === yesterday.toDateString();

    const newStreak = isConsecutive
      ? (scoutUser.streak_days ?? 0) + 1
      : 1;

    await supabase
      .from("scout_users")
      .update({
        last_active_at: now.toISOString(),
        streak_days: newStreak,
      })
      .eq("id", user.id);

    scoutUser.streak_days = newStreak;
    scoutUser.last_active_at = now.toISOString();
  }

  return (
    <DashboardClient
      user={{
        email: user.email || "",
        fullName: scoutUser.full_name || user.user_metadata?.full_name || "",
      }}
      profile={{
        targetRoles: profile.target_roles || [],
        targetLocations: profile.target_locations || [],
        targetCompanies: profile.target_companies || [],
        skills: profile.skills || [],
      }}
      digests={
        digests?.map((d) => ({
          id: d.id,
          jobsFound: d.jobs_found,
          sentAt: d.sent_at,
        })) || []
      }
      gate={gate}
      trialDaysLeft={trialDaysLeft}
      hasStripeCustomer={!!scoutUser.stripe_customer_id}
      streakDays={scoutUser.streak_days ?? 0}
    />
  );
}
