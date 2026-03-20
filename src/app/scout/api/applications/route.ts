import { NextRequest, NextResponse } from "next/server";
import { getUser, createClient } from "@/lib/scout/supabase-server";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scout_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Applications fetch error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

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

  const company = typeof body.company === "string" ? body.company.trim() : "";
  const role_title =
    typeof body.role_title === "string" ? body.role_title.trim() : "";

  if (!company || !role_title) {
    return NextResponse.json(
      { error: "company and role_title are required" },
      { status: 400 }
    );
  }

  const allowedStatuses = [
    "saved",
    "applied",
    "interviewing",
    "offered",
    "rejected",
    "withdrawn",
  ];
  const status =
    typeof body.status === "string" && allowedStatuses.includes(body.status)
      ? body.status
      : "saved";

  const insert: Record<string, unknown> = {
    user_id: user.id,
    company,
    role_title,
    status,
  };

  if (typeof body.url === "string" && body.url.trim()) {
    insert.url = body.url.trim();
  }
  if (typeof body.notes === "string" && body.notes.trim()) {
    insert.notes = body.notes.trim();
  }
  if (typeof body.applied_at === "string" && body.applied_at) {
    insert.applied_at = body.applied_at;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scout_applications")
    .insert(insert)
    .select()
    .single();

  if (error) {
    console.error("Application create error:", error.message);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
