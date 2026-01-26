-- Ensure settings table exists with proper structure
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Read Settings" ON settings;
DROP POLICY IF EXISTS "Admin Manage Settings" ON settings;

-- Create policies
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin Manage Settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert default pixel key (empty) if it doesn't exist
INSERT INTO settings (key, value) 
VALUES ('facebook_pixel_id', '') 
ON CONFLICT (key) DO NOTHING;
