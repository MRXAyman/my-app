-- Create Brand Settings Table
CREATE TABLE IF NOT EXISTS brand_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'DzShop',
  logo_url TEXT,
  favicon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Storage Bucket for Brand Assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Brand Assets
CREATE POLICY "Public Read Brand Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Authenticated Upload Brand Assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update Brand Assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete Brand Assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

-- RLS for Brand Settings Table
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Brand Settings"
ON brand_settings FOR SELECT
USING (true);

CREATE POLICY "Authenticated Manage Brand Settings"
ON brand_settings FOR ALL
USING (auth.role() = 'authenticated');

-- Insert Default Brand Settings
INSERT INTO brand_settings (site_name, logo_url, favicon_url)
VALUES ('DzShop - متجر إلكتروني جزائري', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Create Updated At Trigger
CREATE OR REPLACE FUNCTION update_brand_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brand_settings_updated_at
BEFORE UPDATE ON brand_settings
FOR EACH ROW
EXECUTE FUNCTION update_brand_settings_updated_at();
