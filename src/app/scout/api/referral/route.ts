import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import { createClient } from "@/lib/scout/supabase-server";

// GET: Get user's referral code and stats
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Referral code = first 8 chars of user ID (simple, unique)
  const referralCode = user.id.slice(0, 8);

  // Count referrals
  const { count } = await supabase
    .from("scout_users")
    .select("id", { count: "exact", head: true })
    .eq("referred_by", user.id);

  return NextResponse.json({
    code: referralCode,
    referrals: count || 0,
    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://jobscoutai.com"}/scout/login?signup=true&ref=${referralCode}`,
  });
}

// POST: Apply a referral code (called during signup)
export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { code: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.code || body.code.length < 6) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const supabase = await createClient();

  // Find the referrer by matching first 8 chars of their ID
  const { data: users } = await supabase
    .from("scout_users")
    .select("id")
    .like("id", `${body.code}%`)
    .neq("id", user.id)
    .limit(1);

  if (!users || users.length === 0) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  }

  const referrerId = users[0].id;

  // Mark this user as referred
  await supabase
    .from("scout_users")
    .update({ referred_by: referrerId })
    .eq("id", user.id);

  // Extend referrer's trial by 7 days (bonus)
  const { data: referrer } = await supabase
    .from("scout_users")
    .select("trial_ends_at")
    .eq("id", referrerId)
    .single();

  if (referrer?.trial_ends_at) {
    const newEnd = new Date(referrer.trial_ends_at);
    newEnd.setDate(newEnd.getDate() + 7);
    await supabase
      .from("scout_users")
      .update({ trial_ends_at: newEnd.toISOString() })
      .eq("id", referrerId);
  }

  // Extend new user's trial by 7 days too
  const { data: currentUser } = await supabase
    .from("scout_users")
    .select("trial_ends_at")
    .eq("id", user.id)
    .single();

  if (currentUser?.trial_ends_at) {
    const newEnd = new Date(currentUser.trial_ends_at);
    newEnd.setDate(newEnd.getDate() + 7);
    await supabase
      .from("scout_users")
      .update({ trial_ends_at: newEnd.toISOString() })
      .eq("id", user.id);
  }

  return NextResponse.json({ success: true, message: "Referral applied! Both accounts get +7 days." });
}
