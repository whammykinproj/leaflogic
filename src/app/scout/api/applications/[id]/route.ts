import { NextRequest, NextResponse } from "next/server";
import { getUser, createClient } from "@/lib/scout/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowedStatuses = [
    "saved",
    "applied",
    "interviewing",
    "offered",
    "rejected",
    "withdrawn",
  ];
  const updates: Record<string, unknown> = {};

  if ("status" in body) {
    if (
      typeof body.status !== "string" ||
      !allowedStatuses.includes(body.status)
    ) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }
    updates.status = body.status;
  }

  if ("notes" in body) {
    updates.notes = typeof body.notes === "string" ? body.notes : null;
  }

  if ("url" in body) {
    updates.url = typeof body.url === "string" ? body.url : null;
  }

  if ("applied_at" in body) {
    updates.applied_at =
      typeof body.applied_at === "string" ? body.applied_at : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scout_applications")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Application update error:", error.message);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("scout_applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Application delete error:", error.message);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
