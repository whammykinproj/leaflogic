-- JobScout AI Database Schema
-- Run this in your Supabase SQL editor

-- Users table (extends Supabase auth.users)
CREATE TABLE scout_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT CHECK (subscription_status IN ('trialing', 'active', 'canceled', 'past_due')),
  trial_ends_at TIMESTAMPTZ,
  referred_by UUID REFERENCES scout_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (job search preferences)
CREATE TABLE scout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES scout_users(id) ON DELETE CASCADE UNIQUE,
  resume_text TEXT NOT NULL DEFAULT '',
  target_roles TEXT[] DEFAULT '{}',
  target_companies TEXT[] DEFAULT '{}',
  target_locations TEXT[] DEFAULT '{NYC}',
  salary_min INTEGER,
  salary_max INTEGER,
  skills TEXT[] DEFAULT '{}',
  resume_variant_notes TEXT,
  digest_frequency TEXT DEFAULT 'daily' CHECK (digest_frequency IN ('daily', '3x_week', 'weekly')),
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Digest history (past emails sent)
CREATE TABLE scout_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES scout_users(id) ON DELETE CASCADE,
  jobs_found INTEGER DEFAULT 0,
  email_html TEXT NOT NULL,
  sources_checked TEXT[] DEFAULT '{}',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE scout_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_digests ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users read own data" ON scout_users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own data" ON scout_users
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: users manage their own
CREATE POLICY "Users read own profile" ON scout_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON scout_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON scout_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Digests: users read their own
CREATE POLICY "Users read own digests" ON scout_digests
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for cron jobs and webhooks)
CREATE POLICY "Service role full access users" ON scout_users
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access profiles" ON scout_profiles
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access digests" ON scout_digests
  FOR ALL USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX idx_scout_users_email ON scout_users(email);
CREATE INDEX idx_scout_users_subscription ON scout_users(subscription_status);
CREATE INDEX idx_scout_users_referred_by ON scout_users(referred_by);
CREATE INDEX idx_scout_profiles_user ON scout_profiles(user_id);
CREATE INDEX idx_scout_profiles_frequency ON scout_profiles(digest_frequency);
CREATE INDEX idx_scout_digests_user_sent ON scout_digests(user_id, sent_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scout_users_updated_at
  BEFORE UPDATE ON scout_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER scout_profiles_updated_at
  BEFORE UPDATE ON scout_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Application tracker
CREATE TABLE scout_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES scout_users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role_title TEXT NOT NULL,
  url TEXT,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  notes TEXT,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scout_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own applications" ON scout_applications
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role full access applications" ON scout_applications
  FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX idx_scout_applications_user ON scout_applications(user_id, status);
CREATE TRIGGER scout_applications_updated_at
  BEFORE UPDATE ON scout_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Streak system columns
ALTER TABLE scout_users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
ALTER TABLE scout_users ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;
