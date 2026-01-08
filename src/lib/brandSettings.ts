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
        .single()

    if (error) {
        console.error('Error fetching brand settings:', error)
        return null
    }

    return data
}
