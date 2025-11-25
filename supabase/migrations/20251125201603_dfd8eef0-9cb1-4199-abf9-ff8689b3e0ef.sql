-- Update tag format table to support multiple series per category
DROP TABLE IF EXISTS public.itam_tag_format;

CREATE TABLE public.itam_tag_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id BIGINT NOT NULL REFERENCES public.tenants(id),
  organisation_id UUID REFERENCES public.organisations(id),
  category_name TEXT NOT NULL,
  prefix TEXT NOT NULL,
  current_number INTEGER DEFAULT 1,
  padding_length INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, organisation_id, category_name)
);

-- Enable RLS
ALTER TABLE public.itam_tag_series ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their org tag series"
  ON public.itam_tag_series FOR SELECT
  USING (organisation_id = get_user_org());

CREATE POLICY "Users can manage their org tag series"
  ON public.itam_tag_series FOR ALL
  USING (organisation_id = get_user_org());

-- Trigger for updated_at
CREATE TRIGGER update_itam_tag_series_updated_at
  BEFORE UPDATE ON public.itam_tag_series
  FOR EACH ROW EXECUTE FUNCTION update_itam_updated_at();

-- Function to get next available tag for a series
CREATE OR REPLACE FUNCTION get_next_asset_tags(p_organisation_id UUID, p_limit INTEGER DEFAULT 3)
RETURNS TABLE (
  category_name TEXT,
  suggested_tags TEXT[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.category_name,
    ARRAY(
      SELECT s.prefix || LPAD((s.current_number + i - 1)::TEXT, s.padding_length, '0')
      FROM generate_series(1, p_limit) AS i
    ) AS suggested_tags
  FROM itam_tag_series s
  WHERE s.organisation_id = p_organisation_id
    AND s.is_active = TRUE
  ORDER BY s.category_name;
END;
$$;

-- Insert default tag series
INSERT INTO public.itam_tag_series (tenant_id, organisation_id, category_name, prefix, current_number, padding_length)
SELECT 
  1,
  o.id,
  'Laptop',
  'RT-LTP-',
  1,
  3
FROM public.organisations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.itam_tag_series 
  WHERE organisation_id = o.id AND category_name = 'Laptop'
);

INSERT INTO public.itam_tag_series (tenant_id, organisation_id, category_name, prefix, current_number, padding_length)
SELECT 
  1,
  o.id,
  'Monitor',
  'RT-MTR-',
  1,
  3
FROM public.organisations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.itam_tag_series 
  WHERE organisation_id = o.id AND category_name = 'Monitor'
);

INSERT INTO public.itam_tag_series (tenant_id, organisation_id, category_name, prefix, current_number, padding_length)
SELECT 
  1,
  o.id,
  'Equipment',
  'RT-EQP-',
  1,
  3
FROM public.organisations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.itam_tag_series 
  WHERE organisation_id = o.id AND category_name = 'Equipment'
);