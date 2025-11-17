-- Create app_role enum if not exists
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'tenant_admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true
);

-- Create tenant_users table for user-tenant relationships
CREATE TABLE IF NOT EXISTS public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Add subdomain and route_prefix columns to existing tools table
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS subdomain TEXT;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS route_prefix TEXT;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS icon TEXT;

-- Update existing tools with subdomain and route_prefix
UPDATE public.tools SET 
  subdomain = LOWER(display_name),
  route_prefix = '/' || LOWER(display_name),
  icon = CASE LOWER(display_name)
    WHEN 'crm' THEN '👥'
    WHEN 'tickets' THEN '🎫'
    WHEN 'subscriptions' THEN '🔄'
    WHEN 'assets' THEN '🏢'
    WHEN 'recruitment' THEN '👔'
    WHEN 'attendance' THEN '⏰'
    WHEN 'inventory' THEN '📦'
    WHEN 'marketing' THEN '📢'
    WHEN 'depreciation' THEN '📉'
    WHEN 'invoicing' THEN '📄'
    WHEN 'contact' THEN '📞'
    WHEN 'personal expense' THEN '💳'
    WHEN 'shop income expense' THEN '🏪'
    ELSE '🔧'
  END
WHERE subdomain IS NULL;

-- Enable RLS on new tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check tenant access
CREATE OR REPLACE FUNCTION public.has_tenant_access(_user_id UUID, _tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_users
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
  );
$$;

-- Create function to check if user has role in tenant
CREATE OR REPLACE FUNCTION public.has_tenant_role(_user_id UUID, _tenant_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_users
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
      AND role = _role
  );
$$;

-- RLS Policies for tenants
CREATE POLICY "Users can view their tenants"
  ON public.tenants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE tenant_id = tenants.id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all tenants"
  ON public.tenants FOR ALL
  USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Tenant admins can update their tenant"
  ON public.tenants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE tenant_id = tenants.id
        AND user_id = auth.uid()
        AND role IN ('tenant_admin', 'super_admin')
    )
  );

-- RLS Policies for tenant_users
CREATE POLICY "Users can view members of their tenants"
  ON public.tenant_users FOR SELECT
  USING (
    has_tenant_access(auth.uid(), tenant_id)
  );

CREATE POLICY "Tenant admins can manage users in their tenant"
  ON public.tenant_users FOR ALL
  USING (
    has_tenant_role(auth.uid(), tenant_id, 'tenant_admin') OR
    has_tenant_role(auth.uid(), tenant_id, 'super_admin') OR
    has_role(auth.uid(), 'super_admin')
  );

-- Create updated_at trigger for tenants
DROP TRIGGER IF EXISTS update_tenants_updated_at ON public.tenants;
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();