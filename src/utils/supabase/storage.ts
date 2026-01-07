import { createClient } from '@/utils/supabase/client'

/**
 * Ensures the 'products' storage bucket exists
 * Creates it if it doesn't exist
 */
export async function ensureProductsBucket() {
    const supabase = createClient()

    try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()

        if (listError) {
            console.error('Error listing buckets:', listError)
            return { success: false, error: listError }
        }

        const bucketExists = buckets?.some(bucket => bucket.name === 'products')

        if (!bucketExists) {
            // Create the bucket
            const { data, error: createError } = await supabase.storage.createBucket('products', {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/*']
            })

            if (createError) {
                console.error('Error creating bucket:', createError)
                return { success: false, error: createError }
            }

            console.log('Products bucket created successfully')
            return { success: true, created: true }
        }

        return { success: true, created: false }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error }
    }
}

/**
 * Upload an image to the products bucket
 * Simplified version - assumes bucket exists
 */
export async function uploadProductImage(file: File): Promise<{ url?: string; error?: any }> {
    const supabase = createClient()

    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = fileName

        // Try to upload directly
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { error: uploadError }
        }

        // Get public URL
        const { data } = supabase.storage.from('products').getPublicUrl(filePath)
        return { url: data.publicUrl }
    } catch (error) {
        console.error('Unexpected upload error:', error)
        return { error }
    }
}

/**
 * Upload multiple images to the products bucket
 * Returns array of URLs in the same order as input files
 */
export async function uploadMultipleProductImages(files: File[]): Promise<{
    urls?: string[];
    error?: any;
}> {
    const supabase = createClient()

    try {
        const uploadPromises = files.map(async (file) => {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = fileName

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('products').getPublicUrl(filePath)
            return data.publicUrl
        })

        const urls = await Promise.all(uploadPromises)
        return { urls }
    } catch (error) {
        console.error('Multiple upload error:', error)
        return { error }
    }
}

/**
 * Delete an image from the products bucket
 */
export async function deleteProductImage(imageUrl: string): Promise<{ success: boolean; error?: any }> {
    const supabase = createClient()

    try {
        // Extract filename from URL
        const urlParts = imageUrl.split('/')
        const fileName = urlParts[urlParts.length - 1]

        const { error } = await supabase.storage
            .from('products')
            .remove([fileName])

        if (error) {
            console.error('Delete error:', error)
            return { success: false, error }
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected delete error:', error)
        return { success: false, error }
    }
}
