-- ============================================
-- Order Management System - Schema Update
-- ============================================
-- This migration adds advanced order management fields
-- for Algerian COD e-commerce operations

-- Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS call_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS call_notes TEXT,
ADD COLUMN IF NOT EXISTS shipping_company TEXT,
ADD COLUMN IF NOT EXISTS delivery_location TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
-- EcoTrack Shipping Integration Fields
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS courier TEXT,
ADD COLUMN IF NOT EXISTS shipment_status TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ecotrack_order_id TEXT;

-- Add index for phone number duplicate detection
CREATE INDEX IF NOT EXISTS idx_orders_phone_created 
ON orders ((customer_info->>'phone'), created_at DESC);

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders (status);

-- Add index for wilaya filtering
CREATE INDEX IF NOT EXISTS idx_orders_wilaya 
ON orders ((customer_info->>'wilaya'));

-- Update existing orders to have last_status_update
UPDATE orders 
SET last_status_update = created_at 
WHERE last_status_update IS NULL;

-- ============================================
-- Migration Complete!
-- ============================================
