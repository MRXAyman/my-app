import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'

interface CategoryPageProps {
    params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    // Get category
    const { data: category } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('slug', slug)
        .single()

    if (!category) {
        return notFound()
    }

    // Get products in this category
    const { data: products } = await supabase
        .from('products')
        .select('id, title, slug, price, sale_price, images, in_stock')
        .eq('category_id', category.id)

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors"
                    >
                        <ArrowRight className="ml-2 h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                </div>

                {/* Category Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        {category.name}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {products?.length || 0} منتج متوفر
                    </p>
                </div>

                {/* Products Grid */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500">لا توجد منتجات في هذا الصنف حالياً</p>
                    </div>
                )}
            </div>
        </div>
    )
}
