import { NextResponse } from "next/server";
import { getUser, getScoutUser } from "@/lib/scout/supabase-server";
import { createClient } from "@/lib/scout/supabase-server";
import { isDemoMode } from "@/lib/scout/demo";
import {
  createCheckoutSession,
  getOrCreateCustomer,
} from "@/lib/scout/stripe";

export async function POST() {
  if (isDemoMode()) {
    return NextResponse.json({ error: "Billing is not configured in demo mode." }, { status: 400 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scoutUser = await getScoutUser();
  if (!scoutUser) {
    return NextResponse.json({ error: "No scout account" }, { status: 404 });
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateCustomer(
    user.email!,
    scoutUser.full_name,
    scoutUser.stripe_customer_id
  );

  // Save customer ID if new
  if (!scoutUser.stripe_customer_id) {
    const supabase = await createClient();
    await supabase
      .from("scout_users")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await createCheckoutSession(
    customerId,
    user.email!,
    user.id
  );

  return NextResponse.json({ url: session.url });
}
