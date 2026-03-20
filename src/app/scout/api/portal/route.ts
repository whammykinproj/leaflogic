import { NextResponse } from "next/server";
import { getScoutUser } from "@/lib/scout/supabase-server";
import { createCustomerPortalSession } from "@/lib/scout/stripe";

export async function POST() {
  const scoutUser = await getScoutUser();
  if (!scoutUser?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account" }, { status: 404 });
  }

  const session = await createCustomerPortalSession(
    scoutUser.stripe_customer_id
  );

  return NextResponse.json({ url: session.url });
}
