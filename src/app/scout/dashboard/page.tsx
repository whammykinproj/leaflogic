import { redirect } from "next/navigation";
import { getUser, getScoutUser, getScoutProfile } from "@/lib/scout/supabase-server";
import { createClient } from "@/lib/scout/supabase-server";
import { isDemoMode, DEMO_SCOUT_USER, DEMO_PROFILE, DEMO_DIGESTS } from "@/lib/scout/demo";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/scout/login");

  const demo = isDemoMode();

  // In demo mode, use mock data directly. No Supabase calls.
  const scoutUser = demo ? { ...DEMO_SCOUT_USER } : await (async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("scout_users")
      .select("*")
      .eq("id", user.id)
      .single();
    return data;
  })();

  if (!scoutUser) redirect("/scout/login");

  const profile = demo ? DEMO_PROFILE : await getScoutProfile(user.id);
  if (!profile) redirect("/scout/onboarding");

  const digests = demo ? DEMO_DIGESTS : await (async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("scout_digests")
      .select("*")
      .eq("user_id", user.id)
      .order("sent_at", { ascending: false })
      .limit(10);
    return data;
  })();

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

  // Update streak (skip in demo mode)
  if (!demo) {
    const now = new Date();
    const lastActive = scoutUser.last_active_at
      ? new Date(scoutUser.last_active_at)
      : null;
    const isNewDay =
      !lastActive ||
      lastActive.toDateString() !== now.toDateString();

    if (isNewDay) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive =
        lastActive && lastActive.toDateString() === yesterday.toDateString();

      const newStreak = isConsecutive
        ? (scoutUser.streak_days ?? 0) + 1
        : 1;

      const supabase = await createClient();
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
        digests?.map((d: { id: string; jobs_found: number; sent_at: string }) => ({
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
