-- Add missing columns to subscriptions table for Tab 4 and other tabs
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS invoice_email TEXT,
ADD COLUMN IF NOT EXISTS account_email TEXT,
ADD COLUMN IF NOT EXISTS subscription_url TEXT,
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS send_reminder BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_methods JSONB DEFAULT '["email"]'::jsonb,
ADD COLUMN IF NOT EXISTS plan_tier TEXT,
ADD COLUMN IF NOT EXISTS plan_description TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS reminder_days INTEGER DEFAULT 7;

COMMENT ON COLUMN public.subscriptions.invoice_email IS 'Email where invoices are sent';
COMMENT ON COLUMN public.subscriptions.account_email IS 'Email used to login to the subscription service';
COMMENT ON COLUMN public.subscriptions.subscription_url IS 'Direct URL to access/login to the subscription';
COMMENT ON COLUMN public.subscriptions.username IS 'Username for the subscription account';
COMMENT ON COLUMN public.subscriptions.send_reminder IS 'Whether to send renewal reminders';
COMMENT ON COLUMN public.subscriptions.notification_methods IS 'Array of notification methods (email, in-app, sms)';
COMMENT ON COLUMN public.subscriptions.plan_tier IS 'Subscription plan name/tier';
COMMENT ON COLUMN public.subscriptions.plan_description IS 'Description of the plan features';
COMMENT ON COLUMN public.subscriptions.website_url IS 'Provider website URL';
COMMENT ON COLUMN public.subscriptions.description IS 'General description of the subscription';
COMMENT ON COLUMN public.subscriptions.logo_url IS 'URL to subscription logo/icon';
COMMENT ON COLUMN public.subscriptions.currency IS 'Currency code (INR, USD, EUR, etc)';
COMMENT ON COLUMN public.subscriptions.reminder_days IS 'Days before renewal to send reminder';