import { createClient } from '@/utils/supabase/server'

export interface BrandSettings {
    id: string
    site_name: string
    logo_url: string | null
    favicon_url: string | null
    updated_at: string
}

export async function getBrandSettings(): Promise<BrandSettings | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .maybeSingle()

    if (error) {
        console.error('Error fetching brand settings:', error)
        return null
    }

    // Return default settings if no data exists
    if (!data) {
        return {
            id: 'default',
            site_name: 'My Store',
            logo_url: null,
            favicon_url: null,
            updated_at: new Date().toISOString()
        }
    }

    return data
}
