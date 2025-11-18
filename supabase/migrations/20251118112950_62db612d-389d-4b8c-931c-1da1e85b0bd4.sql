-- =====================================================================
-- PART 10: AppMaster Admin Suite (Super Admin) Database Schema
-- =====================================================================

-- 10.1.1 SaaS Organisations (Top-level tenant records)
CREATE TABLE IF NOT EXISTS public.saas_organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  subscription_plan_id UUID REFERENCES public.subscription_plans(id),
  plan_name TEXT DEFAULT 'free',
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  next_billing_date DATE,
  max_users_allowed INTEGER DEFAULT 3,
  active_users_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'trial' CHECK (status IN ('active', 'trial', 'suspended', 'cancelled')),
  custom_domain TEXT,
  stripe_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.2 SaaS Users (Global user records across all orgs)
CREATE TABLE IF NOT EXISTS public.saas_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  global_status TEXT DEFAULT 'active' CHECK (global_status IN ('active', 'blocked', 'pending_verification')),
  last_login_at TIMESTAMPTZ,
  multi_org BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.3 SaaS Org-User Links (Multi-org membership)
CREATE TABLE IF NOT EXISTS public.saas_org_user_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.saas_organisations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.saas_users(id) ON DELETE CASCADE,
  org_role TEXT DEFAULT 'member' CHECK (org_role IN ('org_admin', 'member', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organisation_id, user_id)
);

-- 10.1.4 SaaS Subscription Plans (already exists as subscription_plans, add more fields if needed)
-- Enhancing existing subscription_plans table
ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS max_storage_mb INTEGER DEFAULT 1024,
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro', 'enterprise'));

-- 10.1.5 SaaS Billing History
CREATE TABLE IF NOT EXISTS public.saas_billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.saas_organisations(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  bill_period_start DATE NOT NULL,
  bill_period_end DATE NOT NULL,
  invoice_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  payment_provider TEXT DEFAULT 'stripe' CHECK (payment_provider IN ('stripe', 'razorpay')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.6 SaaS System Logs (System-wide audit)
CREATE TABLE IF NOT EXISTS public.saas_system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  description TEXT,
  performed_by UUID REFERENCES public.saas_users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.7 SaaS API Keys
CREATE TABLE IF NOT EXISTS public.saas_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.saas_organisations(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  scopes TEXT[] DEFAULT ARRAY[]::TEXT[],
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.saas_users(id),
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.8 SaaS Webhooks
CREATE TABLE IF NOT EXISTS public.saas_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.saas_organisations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  event_triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
  secret TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'failed')),
  retry_count INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.9 SaaS Feature Flags
CREATE TABLE IF NOT EXISTS public.saas_feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT UNIQUE NOT NULL,
  feature_name TEXT NOT NULL,
  description TEXT,
  enabled_for_plans TEXT[] DEFAULT ARRAY[]::TEXT[],
  enabled_for_orgs UUID[] DEFAULT ARRAY[]::UUID[],
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  is_global_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.10 SaaS Worker Jobs
CREATE TABLE IF NOT EXISTS public.saas_worker_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  retries INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.1.11 SaaS Usage Metrics
CREATE TABLE IF NOT EXISTS public.saas_usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES public.saas_organisations(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saas_orgs_status ON public.saas_organisations(status);
CREATE INDEX IF NOT EXISTS idx_saas_users_email ON public.saas_users(email);
CREATE INDEX IF NOT EXISTS idx_saas_users_global_status ON public.saas_users(global_status);
CREATE INDEX IF NOT EXISTS idx_saas_org_links_org ON public.saas_org_user_links(organisation_id);
CREATE INDEX IF NOT EXISTS idx_saas_org_links_user ON public.saas_org_user_links(user_id);
CREATE INDEX IF NOT EXISTS idx_saas_billing_org ON public.saas_billing_history(organisation_id);
CREATE INDEX IF NOT EXISTS idx_saas_system_logs_timestamp ON public.saas_system_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_saas_system_logs_entity ON public.saas_system_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_saas_api_keys_org ON public.saas_api_keys(organisation_id);
CREATE INDEX IF NOT EXISTS idx_saas_webhooks_org ON public.saas_webhooks(organisation_id);
CREATE INDEX IF NOT EXISTS idx_saas_worker_jobs_status ON public.saas_worker_jobs(status);
CREATE INDEX IF NOT EXISTS idx_saas_usage_org ON public.saas_usage_metrics(organisation_id, recorded_at DESC);

-- Super Admin role enum (if not already created)
DO $$ BEGIN
  CREATE TYPE public.super_admin_role AS ENUM (
    'super_admin',
    'saas_manager',
    'saas_support_agent',
    'billing_manager',
    'read_only_auditor'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Super Admin Users table
CREATE TABLE IF NOT EXISTS public.super_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.super_admin_role NOT NULL,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.super_admin_users
    WHERE user_id = _user_id
      AND is_active = true
  );
$$;

-- Function to check super admin permission
CREATE OR REPLACE FUNCTION public.has_super_admin_permission(_user_id UUID, _permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.super_admin_users
    WHERE user_id = _user_id
      AND is_active = true
      AND (
        role = 'super_admin'
        OR _permission = ANY(permissions)
      )
  );
$$;

-- Enable RLS on all SaaS tables
ALTER TABLE public.saas_organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_org_user_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_worker_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Super Admin Full Access
CREATE POLICY "Super admins have full access to saas_organisations"
  ON public.saas_organisations FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_users"
  ON public.saas_users FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_org_user_links"
  ON public.saas_org_user_links FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_billing_history"
  ON public.saas_billing_history FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_system_logs"
  ON public.saas_system_logs FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_api_keys"
  ON public.saas_api_keys FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_webhooks"
  ON public.saas_webhooks FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_feature_flags"
  ON public.saas_feature_flags FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_worker_jobs"
  ON public.saas_worker_jobs FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins have full access to saas_usage_metrics"
  ON public.saas_usage_metrics FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can view super_admin_users"
  ON public.super_admin_users FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_saas_organisations_updated_at
  BEFORE UPDATE ON public.saas_organisations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saas_users_updated_at
  BEFORE UPDATE ON public.saas_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saas_org_user_links_updated_at
  BEFORE UPDATE ON public.saas_org_user_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saas_billing_history_updated_at
  BEFORE UPDATE ON public.saas_billing_history
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saas_api_keys_updated_at
  BEFORE UPDATE ON public.saas_api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saas_webhooks_updated_at
  BEFORE UPDATE ON public.saas_webhooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saas_feature_flags_updated_at
  BEFORE UPDATE ON public.saas_feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saas_worker_jobs_updated_at
  BEFORE UPDATE ON public.saas_worker_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_super_admin_users_updated_at
  BEFORE UPDATE ON public.super_admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();