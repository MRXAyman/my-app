-- ============================================
-- EMERGENCY FIX: Disable RLS Completely
-- ============================================
-- This script disables RLS to allow development
-- WARNING: Only use in development environment!

-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (cleanup)
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for all users" ON products;
DROP POLICY IF EXISTS "Enable update for all users" ON products;
DROP POLICY IF EXISTS "Enable delete for all users" ON products;

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for all users" ON categories;
DROP POLICY IF EXISTS "Enable update for all users" ON categories;
DROP POLICY IF EXISTS "Enable delete for all users" ON categories;

DROP POLICY IF EXISTS "Enable read access for all users" ON shipping_zones;
DROP POLICY IF EXISTS "Enable insert for all users" ON shipping_zones;
DROP POLICY IF EXISTS "Enable update for all users" ON shipping_zones;
DROP POLICY IF EXISTS "Enable delete for all users" ON shipping_zones;

DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Enable update for all users" ON orders;
DROP POLICY IF EXISTS "Enable delete for all users" ON orders;

-- Storage policies (keep these)
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for all users" ON storage.objects;

CREATE POLICY "Enable read access for all users" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Enable insert for all users" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Enable update for all users" ON storage.objects
  FOR UPDATE USING (bucket_id = 'products');

CREATE POLICY "Enable delete for all users" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');

-- ============================================
-- RLS is now DISABLED for development
-- You can now add products without any restrictions
-- ============================================
