import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Fetch categories with product count
        const { data: categories, error } = await supabase
            .from('categories')
            .select(`
                id,
                name,
                slug,
                created_at
            `)
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching categories:', error)
            return NextResponse.json(
                { error: 'Failed to fetch categories' },
                { status: 500 }
            )
        }

        // Get product count for each category
        const categoriesWithCount = await Promise.all(
            (categories || []).map(async (category) => {
                const { count, error: countError } = await supabase
                    .from('products')
                    .select('id', { count: 'exact', head: true })
                    .eq('category_id', category.id)
                    .eq('in_stock', true)

                if (countError) {
                    console.error(`Error counting products for category ${category.id}:`, countError)
                }

                // Get first product image for category thumbnail
                const { data: firstProduct } = await supabase
                    .from('products')
                    .select('images')
                    .eq('category_id', category.id)
                    .eq('in_stock', true)
                    .limit(1)
                    .single()

                const productCount = count || 0
                const countText = productCount === 1
                    ? 'منتج واحد'
                    : productCount === 2
                        ? 'منتجان'
                        : productCount >= 3 && productCount <= 10
                            ? `${productCount} منتجات`
                            : `${productCount} منتج`

                return {
                    id: category.id.toString(),
                    name: category.name,
                    slug: category.slug,
                    image: firstProduct?.images?.[0] || '/placeholder-category.png',
                    count: countText,
                    productCount: productCount
                }
            })
        )

        // Filter out categories with no products
        const activeCategories = categoriesWithCount.filter(cat => cat.productCount > 0)

        return NextResponse.json({
            success: true,
            categories: activeCategories,
            count: activeCategories.length
        })

    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
