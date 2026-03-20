import { NextRequest, NextResponse } from "next/server";
import { getUser, createClient } from "@/lib/scout/supabase-server";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("scout_profiles")
    .select("digest_frequency, email_notifications")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 404 });
  }

  return NextResponse.json({
    digest_frequency: profile.digest_frequency ?? "daily",
    email_notifications: profile.email_notifications ?? true,
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowedFrequencies = ["daily", "3x_week", "weekly"];
  const updates: Record<string, unknown> = {};

  if ("digest_frequency" in body) {
    if (!allowedFrequencies.includes(body.digest_frequency as string)) {
      return NextResponse.json(
        { error: "Invalid digest_frequency. Must be daily, 3x_week, or weekly." },
        { status: 400 }
      );
    }
    updates.digest_frequency = body.digest_frequency;
  }

  if ("email_notifications" in body) {
    if (typeof body.email_notifications !== "boolean") {
      return NextResponse.json(
        { error: "email_notifications must be a boolean" },
        { status: 400 }
      );
    }
    updates.email_notifications = body.email_notifications;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from("scout_profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (dbError) {
    console.error("Settings update error:", dbError.message);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Delete in order: digests -> profiles -> users
  const { error: digestErr } = await supabase
    .from("scout_digests")
    .delete()
    .eq("user_id", user.id);

  if (digestErr) {
    console.error("Delete digests error:", digestErr.message);
    return NextResponse.json(
      { error: "Failed to delete account data" },
      { status: 500 }
    );
  }

  const { error: profileErr } = await supabase
    .from("scout_profiles")
    .delete()
    .eq("user_id", user.id);

  if (profileErr) {
    console.error("Delete profile error:", profileErr.message);
    return NextResponse.json(
      { error: "Failed to delete account data" },
      { status: 500 }
    );
  }

  const { error: userErr } = await supabase
    .from("scout_users")
    .delete()
    .eq("id", user.id);

  if (userErr) {
    console.error("Delete user error:", userErr.message);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }

  // Sign the user out
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
