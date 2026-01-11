-- Fix permissions for shipping_carriers table

-- Enable RLS (idempotent)
ALTER TABLE shipping_carriers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON shipping_carriers;
DROP POLICY IF EXISTS "Enable read access for all users" ON shipping_carriers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON shipping_carriers;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON shipping_carriers;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON shipping_carriers;

-- Re-create the comprehensive policy
CREATE POLICY "Allow all access to authenticated users" ON shipping_carriers
    FOR ALL 
    USING (auth.role() = 'authenticated');

-- Verify
-- SELECT * FROM pg_policies WHERE tablename = 'shipping_carriers';
