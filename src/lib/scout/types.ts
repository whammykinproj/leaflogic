export interface ScoutProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  resume_text: string;
  target_roles: string[];
  target_companies: string[];
  target_locations: string[];
  salary_min: number | null;
  salary_max: number | null;
  skills: string[];
  resume_variant_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScoutUser {
  id: string;
  email: string;
  full_name: string | null;
  stripe_customer_id: string | null;
  subscription_status: "trialing" | "active" | "canceled" | "past_due" | null;
  trial_ends_at: string | null;
  last_active_at: string | null;
  streak_days: number;
  created_at: string;
}

export interface ScoutDigest {
  id: string;
  user_id: string;
  jobs_found: number;
  email_html: string;
  sent_at: string;
}

export type SubscriptionGate = "active" | "trialing" | "expired";
