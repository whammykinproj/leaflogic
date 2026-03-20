import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/scout/stripe";
import { createServerClient } from "@supabase/ssr";
import { notifyAdmin } from "@/lib/scout/notifications";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Service role client for admin writes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );

  // Helper to look up user email for notifications
  async function getUserEmail(userId: string): Promise<string> {
    const { data } = await supabase
      .from("scout_users")
      .select("email")
      .eq("id", userId)
      .single();
    return data?.email || "unknown";
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        await supabase
          .from("scout_users")
          .update({
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
          })
          .eq("id", userId);

        const email = await getUserEmail(userId);
        notifyAdmin({
          event: "new_subscription",
          userEmail: email,
          details: `$29/mo subscription started via Stripe`,
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      const status = subscription.status;

      if (userId) {
        let mappedStatus: string | null = null;
        if (status === "active") mappedStatus = "active";
        else if (status === "trialing") mappedStatus = "trialing";
        else if (status === "canceled") mappedStatus = "canceled";
        else if (status === "past_due") mappedStatus = "past_due";

        if (mappedStatus) {
          await supabase
            .from("scout_users")
            .update({ subscription_status: mappedStatus })
            .eq("id", userId);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await supabase
          .from("scout_users")
          .update({ subscription_status: "canceled" })
          .eq("id", userId);

        const email = await getUserEmail(userId);
        notifyAdmin({
          event: "churn",
          userEmail: email,
          details: "Subscription canceled/deleted",
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
