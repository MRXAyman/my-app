-- ============================================
-- Bundle Offers Schema Migration
-- ============================================
-- This migration adds bundle offers support to the products table
-- Bundle offers allow customers to buy multiple items at a discounted price

-- Add bundle_offers column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS bundle_offers JSONB DEFAULT NULL;

-- Add comment to explain the structure
COMMENT ON COLUMN products.bundle_offers IS 'Array of bundle offers with structure: [{"quantity": 2, "price": 8000, "title": "عرض قطعتين"}]';

-- Example of bundle_offers structure:
-- [
--   {
--     "quantity": 2,
--     "price": 8000,
--     "title": "عرض قطعتين"
--   },
--   {
--     "quantity": 3,
--     "price": 11000,
--     "title": "عرض ثلاث قطع"
--   }
-- ]

-- ============================================
-- Migration Complete!
-- ============================================
