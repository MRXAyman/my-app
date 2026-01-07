-- Add availability flags and estimated delivery time to shipping_zones
ALTER TABLE shipping_zones 
ADD COLUMN IF NOT EXISTS home_delivery_available BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS desk_delivery_available BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS estimated_delivery_time TEXT DEFAULT '2-4 أيام';
