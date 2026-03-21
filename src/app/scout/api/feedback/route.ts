import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import { notifyAdmin } from "@/lib/scout/notifications";

// Simple feedback endpoint — sends feedback directly to admin email
export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { type: string; message: string; page?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.message || body.message.length < 5) {
    return NextResponse.json(
      { error: "Message must be at least 5 characters" },
      { status: 400 }
    );
  }

  if (body.message.length > 2000) {
    return NextResponse.json(
      { error: "Message too long (max 2000 chars)" },
      { status: 400 }
    );
  }

  await notifyAdmin({
    event: "new_signup", // reusing the event type for notifications
    userEmail: user.email!,
    details: `[${body.type || "feedback"}] ${body.message}${body.page ? ` (from: ${body.page})` : ""}`,
  });

  return NextResponse.json({ success: true });
}
