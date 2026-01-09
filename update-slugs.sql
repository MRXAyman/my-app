-- Update all existing products to use timestamp-only slugs
-- This fixes the 404 error caused by Arabic text in URLs

UPDATE products
SET slug = id::text
WHERE slug LIKE '%-%';

-- Verify the update
SELECT id, title, slug FROM products;
