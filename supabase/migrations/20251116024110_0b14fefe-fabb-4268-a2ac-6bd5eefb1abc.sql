-- Add subscription management fields to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS subscription_name text,
ADD COLUMN IF NOT EXISTS provider_name text,
ADD COLUMN IF NOT EXISTS cost numeric(10, 2),
ADD COLUMN IF NOT EXISTS billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'semi-annual', 'annual')),
ADD COLUMN IF NOT EXISTS renewal_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS auto_renew boolean DEFAULT true;

-- Update status column to have proper constraints
ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_status_check,
ADD CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'paused', 'cancelled', 'expired', 'trial'));

-- Create index for faster queries on renewal_date
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON public.subscriptions(renewal_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);

-- Add comment for documentation
COMMENT ON COLUMN public.subscriptions.billing_cycle IS 'How often the subscription renews: monthly, quarterly, semi-annual, or annual';
COMMENT ON COLUMN public.subscriptions.renewal_date IS 'Next renewal date for the subscription';
COMMENT ON COLUMN public.subscriptions.cost IS 'Cost per billing cycle in the subscription currency';