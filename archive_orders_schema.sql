-- ============================================
-- Order Archive System - Schema Update
-- ============================================
-- This migration adds archive functionality to orders table
-- Allows manual archiving of completed or old orders

-- Add archive columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_by TEXT;

-- Add index for archived status filtering (improves performance)
CREATE INDEX IF NOT EXISTS idx_orders_archived 
ON orders (is_archived, created_at DESC);

-- Add composite index for common queries (active orders by status)
CREATE INDEX IF NOT EXISTS idx_orders_active_status 
ON orders (is_archived, status) WHERE is_archived = FALSE;

-- Set all existing orders to not archived
UPDATE orders 
SET is_archived = FALSE 
WHERE is_archived IS NULL;

-- Add comment to table
COMMENT ON COLUMN orders.is_archived IS 'Indicates if the order has been archived';
COMMENT ON COLUMN orders.archived_at IS 'Timestamp when the order was archived';
COMMENT ON COLUMN orders.archived_by IS 'User who archived the order';

-- ============================================
-- Migration Complete!
-- ============================================
