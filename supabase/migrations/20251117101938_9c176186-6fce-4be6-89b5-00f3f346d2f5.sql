-- CRM Module Database Schema
-- Drop existing tables if they need to be recreated with new structure
-- Note: We'll extend existing leads, companies, contacts tables instead of recreating

-- Extend leads table with CRM-specific fields
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS score integer DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company text;

-- Create customers table (separate from companies for CRM-specific customer data)
CREATE TABLE IF NOT EXISTS public.crm_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  city text,
  country text,
  website text,
  industry text,
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS public.crm_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  customer_id uuid REFERENCES public.crm_customers(id) ON DELETE CASCADE,
  amount numeric(15,2),
  probability integer DEFAULT 0,
  stage text NOT NULL DEFAULT 'new',
  close_date date,
  owner_id uuid REFERENCES auth.users(id),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS public.crm_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES public.crm_customers(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES public.crm_opportunities(id) ON DELETE SET NULL,
  amount numeric(15,2) DEFAULT 0,
  tax_amount numeric(15,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  valid_until date,
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create quote_items table
CREATE TABLE IF NOT EXISTS public.crm_quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES public.crm_quotes(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  quantity integer DEFAULT 1,
  unit_price numeric(15,2) DEFAULT 0,
  tax_rate numeric(5,2) DEFAULT 0,
  amount numeric(15,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  related_table text NOT NULL,
  related_id uuid NOT NULL,
  activity_type text NOT NULL,
  title text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_customers_owner_id ON public.crm_customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_stage ON public.crm_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_owner_id ON public.crm_opportunities(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_close_date ON public.crm_opportunities(close_date);
CREATE INDEX IF NOT EXISTS idx_crm_quotes_status ON public.crm_quotes(status);
CREATE INDEX IF NOT EXISTS idx_crm_activities_related ON public.crm_activities(related_table, related_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON public.crm_activities(user_id);

-- Enable full-text search on leads
CREATE INDEX IF NOT EXISTS idx_leads_search ON public.leads USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(company, '') || ' ' || coalesce(email, '')));

-- Create trigger function for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_crm_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_crm_customers_updated_at ON public.crm_customers;
CREATE TRIGGER update_crm_customers_updated_at
  BEFORE UPDATE ON public.crm_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_updated_at();

DROP TRIGGER IF EXISTS update_crm_opportunities_updated_at ON public.crm_opportunities;
CREATE TRIGGER update_crm_opportunities_updated_at
  BEFORE UPDATE ON public.crm_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_updated_at();

DROP TRIGGER IF EXISTS update_crm_quotes_updated_at ON public.crm_quotes;
CREATE TRIGGER update_crm_quotes_updated_at
  BEFORE UPDATE ON public.crm_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_updated_at();

-- Create trigger function to auto-assign owner_id on insert
CREATE OR REPLACE FUNCTION public.auto_assign_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Add auto-assign triggers
DROP TRIGGER IF EXISTS auto_assign_crm_customers_owner ON public.crm_customers;
CREATE TRIGGER auto_assign_crm_customers_owner
  BEFORE INSERT ON public.crm_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_owner();

DROP TRIGGER IF EXISTS auto_assign_crm_opportunities_owner ON public.crm_opportunities;
CREATE TRIGGER auto_assign_crm_opportunities_owner
  BEFORE INSERT ON public.crm_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_owner();

DROP TRIGGER IF EXISTS auto_assign_crm_quotes_owner ON public.crm_quotes;
CREATE TRIGGER auto_assign_crm_quotes_owner
  BEFORE INSERT ON public.crm_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_owner();

-- Enable Row Level Security
ALTER TABLE public.crm_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_customers
-- Users can view their own records
CREATE POLICY "Users can view own customers"
  ON public.crm_customers FOR SELECT
  USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Users can insert their own records
CREATE POLICY "Users can insert customers"
  ON public.crm_customers FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Users can update their own records
CREATE POLICY "Users can update own customers"
  ON public.crm_customers FOR UPDATE
  USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete customers"
  ON public.crm_customers FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for crm_opportunities
CREATE POLICY "Users can view own opportunities"
  ON public.crm_opportunities FOR SELECT
  USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Users can insert opportunities"
  ON public.crm_opportunities FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own opportunities"
  ON public.crm_opportunities FOR UPDATE
  USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete opportunities"
  ON public.crm_opportunities FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for crm_quotes
CREATE POLICY "Users can view own quotes"
  ON public.crm_quotes FOR SELECT
  USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Users can insert quotes"
  ON public.crm_quotes FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own quotes"
  ON public.crm_quotes FOR UPDATE
  USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quotes"
  ON public.crm_quotes FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for crm_quote_items
CREATE POLICY "Users can view quote items"
  ON public.crm_quote_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.crm_quotes
    WHERE crm_quotes.id = crm_quote_items.quote_id
    AND (crm_quotes.owner_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  ));

CREATE POLICY "Users can insert quote items"
  ON public.crm_quote_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.crm_quotes
    WHERE crm_quotes.id = crm_quote_items.quote_id
    AND (crm_quotes.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  ));

CREATE POLICY "Users can update quote items"
  ON public.crm_quote_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.crm_quotes
    WHERE crm_quotes.id = crm_quote_items.quote_id
    AND (crm_quotes.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  ));

CREATE POLICY "Users can delete quote items"
  ON public.crm_quote_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.crm_quotes
    WHERE crm_quotes.id = crm_quote_items.quote_id
    AND (crm_quotes.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  ));

-- RLS Policies for crm_activities
CREATE POLICY "Users can view related activities"
  ON public.crm_activities FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Users can insert activities"
  ON public.crm_activities FOR INSERT
  WITH CHECK (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own activities"
  ON public.crm_activities FOR UPDATE
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete activities"
  ON public.crm_activities FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Enable realtime for CRM tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_activities;