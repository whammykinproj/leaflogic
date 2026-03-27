import { NextResponse } from "next/server";
import { getScoutUser } from "@/lib/scout/supabase-server";
import { isDemoMode } from "@/lib/scout/demo";
import { createCustomerPortalSession } from "@/lib/scout/stripe";

export async function POST() {
  if (isDemoMode()) {
    return NextResponse.json({ error: "Billing is not configured in demo mode." }, { status: 400 });
  }
  const scoutUser = await getScoutUser();
  if (!scoutUser?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account" }, { status: 404 });
  }

  const session = await createCustomerPortalSession(
    scoutUser.stripe_customer_id
  );

  return NextResponse.json({ url: session.url });
}
