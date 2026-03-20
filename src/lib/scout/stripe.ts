import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

export function getScoutPriceId(): string {
  return process.env.STRIPE_SCOUT_PRICE_ID!;
}

export async function createCheckoutSession(
  customerId: string,
  userEmail: string,
  userId: string
) {
  const stripe = getStripe();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobscoutai.com";

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: getScoutPriceId(), quantity: 1 }],
    success_url: `${baseUrl}/scout/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/scout/dashboard?checkout=canceled`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });
}

export async function createCustomerPortalSession(customerId: string) {
  const stripe = getStripe();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobscoutai.com";

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/scout/dashboard`,
  });
}

export async function getOrCreateCustomer(
  email: string,
  name: string | null,
  existingCustomerId: string | null
) {
  if (existingCustomerId) {
    return existingCustomerId;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
  });

  return customer.id;
}
