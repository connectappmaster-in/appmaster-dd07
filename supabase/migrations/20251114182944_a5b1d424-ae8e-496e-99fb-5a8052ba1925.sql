-- Create enums for ticket management
CREATE TYPE public.issue_type AS ENUM ('Bug', 'Feature Request', 'Question', 'Urgent', 'General');
CREATE TYPE public.ticket_status AS ENUM ('Open', 'In Progress', 'Pending', 'Resolved', 'Closed');
CREATE TYPE public.ticket_priority AS ENUM ('Critical', 'High', 'Medium', 'Low');
CREATE TYPE public.availability_status AS ENUM ('Available', 'Busy', 'Away', 'Offline');

-- Create teams table
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name text NOT NULL UNIQUE,
  description text,
  manager_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  color_code text DEFAULT '#0066CC',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  issue_type issue_type NOT NULL DEFAULT 'General',
  status ticket_status NOT NULL DEFAULT 'Open',
  priority ticket_priority NOT NULL DEFAULT 'Medium',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_team uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  closed_at timestamp with time zone,
  due_date timestamp with time zone,
  tags jsonb DEFAULT '[]'::jsonb,
  custom_fields jsonb DEFAULT '{}'::jsonb
);

-- Create ticket_comments table
CREATE TABLE public.ticket_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  mentions jsonb DEFAULT '[]'::jsonb
);

-- Create sla_rules table
CREATE TABLE public.sla_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name text NOT NULL,
  priority ticket_priority NOT NULL,
  first_response_time_minutes integer NOT NULL,
  resolution_time_minutes integer NOT NULL,
  escalate_if_breached boolean DEFAULT false,
  escalate_to_role text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create automation_rules table
CREATE TABLE public.automation_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name text NOT NULL,
  trigger text NOT NULL,
  trigger_value jsonb DEFAULT '{}'::jsonb,
  action text NOT NULL,
  action_value jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  execution_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create activity_log table
CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX idx_tickets_created_by ON public.tickets(created_by);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);
CREATE INDEX idx_activity_log_ticket_id ON public.activity_log(ticket_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Teams are viewable by authenticated users"
  ON public.teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage teams"
  ON public.teams FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- RLS Policies for tickets
CREATE POLICY "Users can view tickets they created or are assigned to"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() 
    OR assigned_to = auth.uid()
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'super_admin')
  );

CREATE POLICY "Authenticated users can create tickets"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update tickets they're assigned to or created"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() 
    OR assigned_to = auth.uid()
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'super_admin')
  );

CREATE POLICY "Admins can delete tickets"
  ON public.tickets FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- RLS Policies for ticket_comments
CREATE POLICY "Users can view comments on tickets they have access to"
  ON public.ticket_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.created_by = auth.uid()
        OR tickets.assigned_to = auth.uid()
        OR has_role(auth.uid(), 'admin')
        OR has_role(auth.uid(), 'super_admin')
      )
    )
  );

CREATE POLICY "Users can create comments on tickets they have access to"
  ON public.ticket_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.created_by = auth.uid()
        OR tickets.assigned_to = auth.uid()
        OR has_role(auth.uid(), 'admin')
        OR has_role(auth.uid(), 'super_admin')
      )
    )
  );

CREATE POLICY "Users can update their own comments"
  ON public.ticket_comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments or admins can delete any"
  ON public.ticket_comments FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'super_admin')
  );

-- RLS Policies for sla_rules
CREATE POLICY "Everyone can view active SLA rules"
  ON public.sla_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage SLA rules"
  ON public.sla_rules FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- RLS Policies for automation_rules
CREATE POLICY "Everyone can view active automation rules"
  ON public.automation_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage automation rules"
  ON public.automation_rules FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- RLS Policies for activity_log
CREATE POLICY "Users can view activity logs for tickets they have access to"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE tickets.id = activity_log.ticket_id
      AND (
        tickets.created_by = auth.uid()
        OR tickets.assigned_to = auth.uid()
        OR has_role(auth.uid(), 'admin')
        OR has_role(auth.uid(), 'super_admin')
      )
    )
  );

CREATE POLICY "System can insert activity logs"
  ON public.activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_tickets
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_ticket_comments
  BEFORE UPDATE ON public.ticket_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS text AS $$
DECLARE
  new_number text;
  date_part text;
  sequence_part integer;
BEGIN
  date_part := 'TKT-' || to_char(now(), 'YYYY-MMDD');
  
  SELECT COALESCE(MAX(
    CAST(substring(ticket_number from '\d+$') AS integer)
  ), 0) + 1
  INTO sequence_part
  FROM public.tickets
  WHERE ticket_number LIKE date_part || '%';
  
  new_number := date_part || '-' || lpad(sequence_part::text, 3, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add default SLA rules
INSERT INTO public.sla_rules (rule_name, priority, first_response_time_minutes, resolution_time_minutes, escalate_if_breached, escalate_to_role, is_active)
VALUES
  ('Critical - 1 Hour Response', 'Critical', 60, 480, true, 'admin', true),
  ('High - 4 Hour Response', 'High', 240, 1440, true, 'admin', true),
  ('Medium - 24 Hour Response', 'Medium', 1440, 4320, false, null, true),
  ('Low - 48 Hour Response', 'Low', 2880, 10080, false, null, true);