import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('brand_settings')
            .select('*')
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch brand settings' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const formData = await request.formData()

        const siteName = formData.get('site_name') as string
        const logoFile = formData.get('logo') as File | null
        const faviconFile = formData.get('favicon') as File | null
        const deleteLogo = formData.get('delete_logo') === 'true'
        const deleteFavicon = formData.get('delete_favicon') === 'true'

        // Get current settings to check for old files
        const { data: currentSettings } = await supabase
            .from('brand_settings')
            .select('*')
            .single()

        let logoUrl = currentSettings?.logo_url
        let faviconUrl = currentSettings?.favicon_url

        // Handle logo deletion (only if not uploading a new one)
        if (deleteLogo && (!logoFile || logoFile.size === 0)) {
            if (currentSettings?.logo_url) {
                const oldLogoPath = currentSettings.logo_url.split('/').pop()
                if (oldLogoPath) {
                    await supabase.storage
                        .from('brand-assets')
                        .remove([`logos/${oldLogoPath}`])
                }
            }
            logoUrl = null
        }

        // Handle favicon deletion (only if not uploading a new one)
        if (deleteFavicon && (!faviconFile || faviconFile.size === 0)) {
            if (currentSettings?.favicon_url) {
                const oldFaviconPath = currentSettings.favicon_url.split('/').pop()
                if (oldFaviconPath) {
                    await supabase.storage
                        .from('brand-assets')
                        .remove([`favicons/${oldFaviconPath}`])
                }
            }
            faviconUrl = null
        }

        // Handle logo upload
        if (logoFile && logoFile.size > 0) {
            // Delete old logo if exists
            if (currentSettings?.logo_url) {
                const oldLogoPath = currentSettings.logo_url.split('/').pop()
                if (oldLogoPath) {
                    await supabase.storage
                        .from('brand-assets')
                        .remove([`logos/${oldLogoPath}`])
                }
            }

            // Upload new logo
            const logoFileName = `logo-${Date.now()}.${logoFile.name.split('.').pop()}`
            const { data: logoData, error: logoError } = await supabase.storage
                .from('brand-assets')
                .upload(`logos/${logoFileName}`, logoFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (logoError) {
                return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
            }

            const { data: { publicUrl } } = supabase.storage
                .from('brand-assets')
                .getPublicUrl(`logos/${logoFileName}`)

            logoUrl = publicUrl
        }

        // Handle favicon upload
        if (faviconFile && faviconFile.size > 0) {
            // Delete old favicon if exists
            if (currentSettings?.favicon_url) {
                const oldFaviconPath = currentSettings.favicon_url.split('/').pop()
                if (oldFaviconPath) {
                    await supabase.storage
                        .from('brand-assets')
                        .remove([`favicons/${oldFaviconPath}`])
                }
            }

            // Upload new favicon
            const faviconFileName = `favicon-${Date.now()}.${faviconFile.name.split('.').pop()}`
            const { data: faviconData, error: faviconError } = await supabase.storage
                .from('brand-assets')
                .upload(`favicons/${faviconFileName}`, faviconFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (faviconError) {
                return NextResponse.json({ error: 'Failed to upload favicon' }, { status: 500 })
            }

            const { data: { publicUrl } } = supabase.storage
                .from('brand-assets')
                .getPublicUrl(`favicons/${faviconFileName}`)

            faviconUrl = publicUrl
        }

        // Update brand settings
        const { data, error } = await supabase
            .from('brand_settings')
            .update({
                site_name: siteName,
                logo_url: logoUrl,
                favicon_url: faviconUrl,
            })
            .eq('id', currentSettings?.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Brand settings update error:', error)
        return NextResponse.json({ error: 'Failed to update brand settings' }, { status: 500 })
    }
}
