-- Comprehensive Column Fix for Products Table
-- Run this script to ensure all required columns exist

-- 1. sale_price
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sale_price NUMERIC DEFAULT 0;

-- 2. in_stock
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;

-- 3. stock
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- 4. variants (JSONB)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;

-- 5. is_active
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 6. images (Array)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update schema cache description to force refresh
COMMENT ON TABLE products IS 'Products table with full e-commerce fields';
