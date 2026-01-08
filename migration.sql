-- Add new columns to brand_settings table
ALTER TABLE brand_settings ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE brand_settings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE brand_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE brand_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE brand_settings ADD COLUMN IF NOT EXISTS tiktok_url TEXT;
ALTER TABLE brand_settings ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Verify the columns were added
SELECT * FROM brand_settings LIMIT 1;
