-- Add shipping_carriers table for dynamic account management

CREATE TABLE IF NOT EXISTS shipping_carriers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    api_key TEXT NOT NULL,
    api_url TEXT NOT NULL DEFAULT 'https://anderson-ecommerce.ecotrack.dz',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add index for active carrier lookup
CREATE INDEX IF NOT EXISTS idx_shipping_carriers_is_active 
ON shipping_carriers (is_active);

-- Insert default carrier if none exists (using environment variables if possible, otherwise placeholder)
-- Note: We can't access env vars in SQL directly easily, so we'll just create the table structure.
-- The user can verify/add their current carrier via the UI later.

-- Enable RLS
ALTER TABLE shipping_carriers ENABLE ROW LEVEL SECURITY;

-- Allow access to authenticated users (admins)
CREATE POLICY "Allow all access to authenticated users" ON shipping_carriers
    FOR ALL USING (auth.role() = 'authenticated');
