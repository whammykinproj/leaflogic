import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import { createClient } from "@/lib/scout/supabase-server";
import { validateAndSanitizeProfile } from "@/lib/scout/validation";

export async function POST(request: NextRequest) {
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

  const { valid, data, error } = validateAndSanitizeProfile(body);
  if (!valid || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const supabase = await createClient();

  const { error: dbError } = await supabase.from("scout_profiles").upsert(
    {
      user_id: user.id,
      ...data,
    },
    { onConflict: "user_id" }
  );

  if (dbError) {
    console.error("Profile save error:", dbError.message);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scout_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No profile found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
