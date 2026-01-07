-- Add the missing in_stock column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;

-- Update existing records to reflect stock status
UPDATE products 
SET in_stock = (stock > 0);

-- Force schema cache reload (usually automatic, but changing comment triggers it sometimes)
COMMENT ON TABLE products IS 'Products table with inventory status';
