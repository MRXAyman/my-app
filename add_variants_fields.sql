-- ============================================
-- Add Variants and Active Status to Products
-- ============================================

-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing products to be active by default
UPDATE products SET is_active = TRUE WHERE is_active IS NULL;

-- ============================================
-- Variants Structure Documentation
-- ============================================
-- {
--   "type": "simple" | "colors" | "sizes" | "hybrid",
--   "options": {
--     "colors": ["أحمر", "أزرق", "أسود"],
--     "sizes": ["S", "M", "L", "XL"]
--   },
--   "items": [
--     {
--       "color": "أحمر",
--       "size": "M",
--       "price": 2500,
--       "sale_price": 2000,
--       "stock": 10
--     }
--   ]
-- }
-- ============================================
