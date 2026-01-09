import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '8')
        const type = searchParams.get('type') || 'new' // 'new' or 'featured'

        const supabase = await createClient()

        // Fetch products with category information
        let query = supabase
            .from('products')
            .select(`
                id,
                title,
                slug,
                description,
                price,
                sale_price,
                images,
                stock,
                in_stock,
                created_at,
                categories (
                    id,
                    name,
                    slug
                )
            `)
            .eq('in_stock', true)
            .order('created_at', { ascending: false })
            .limit(limit)

        const { data: products, error } = await query

        if (error) {
            console.error('Error fetching products:', error)
            return NextResponse.json(
                { error: 'Failed to fetch products' },
                { status: 500 }
            )
        }

        // Transform products to match frontend expectations
        const transformedProducts = products?.map(product => {
            // Handle categories - it might be an array or single object depending on query
            const category = Array.isArray(product.categories)
                ? product.categories[0]
                : product.categories

            return {
                id: product.id.toString(),
                name: product.title,
                slug: product.slug,
                price: product.sale_price || product.price,
                originalPrice: product.sale_price ? product.price : null,
                image: product.images?.[0] || '/placeholder-product.png',
                hoverImage: product.images?.[1] || product.images?.[0] || '/placeholder-product.png',
                tag: product.sale_price ? 'تخفيض' : 'جديد',
                category: category?.name || null,
                inStock: product.in_stock,
                stock: product.stock
            }
        }) || []

        return NextResponse.json({
            success: true,
            products: transformedProducts,
            count: transformedProducts.length
        })

    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
