// Demo mode — activated when Supabase is not configured.
// Allows the full product to be used with only ANTHROPIC_API_KEY set.

export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    !url ||
    url === "https://your-project.supabase.co" ||
    url === ""
  );
}

export const DEMO_USER = {
  id: "demo-user-00000000-0000-0000-0000-000000000000",
  email: "demo@jobscoutai.com",
  user_metadata: { full_name: "Demo User" },
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  created_at: new Date().toISOString(),
} as const;

export const DEMO_SCOUT_USER = {
  id: DEMO_USER.id,
  email: DEMO_USER.email,
  full_name: "Demo User",
  stripe_customer_id: null,
  subscription_status: "trialing" as const,
  trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  referred_by: null,
  last_active_at: new Date().toISOString(),
  streak_days: 3,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_PROFILE = {
  id: "demo-profile-00000000",
  user_id: DEMO_USER.id,
  resume_text:
    "Experienced product manager with 5+ years in B2B SaaS. Led cross-functional teams at Series B startup, shipped features used by 500K+ users. Background in data science and strategy consulting. Skilled in SQL, Python, Figma, and stakeholder management.",
  target_roles: ["Product Manager", "Senior PM", "Chief of Staff"],
  target_companies: ["Anthropic", "Stripe", "Ramp", "OpenAI", "Notion"],
  target_locations: ["NYC", "SF", "Remote"],
  salary_min: 150000,
  salary_max: 220000,
  skills: [
    "Product Strategy",
    "SQL",
    "Python",
    "Cross-functional Leadership",
    "Data Analysis",
    "User Research",
  ],
  resume_variant_notes: null,
  digest_frequency: "daily",
  email_notifications: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_DIGESTS = [
  {
    id: "demo-digest-1",
    user_id: DEMO_USER.id,
    jobs_found: 7,
    email_html: "",
    sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-digest-2",
    user_id: DEMO_USER.id,
    jobs_found: 5,
    email_html: "",
    sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-digest-3",
    user_id: DEMO_USER.id,
    jobs_found: 9,
    email_html: "",
    sent_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
