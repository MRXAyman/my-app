import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { Sparkles } from 'lucide-react'

export async function FeaturedProducts() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('id, title, slug, price, sale_price, images, in_stock')
        .eq('in_stock', true)
        .limit(6)

    if (!products || products.length === 0) {
        return null
    }

    return (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white" id="products" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/10 to-teal-500/10 px-4 py-2 rounded-full border border-sky-200/50 mb-2">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        <span className="text-sm font-semibold text-sky-700">الأكثر مبيعاً</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        المنتجات المميزة
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        اختر من بين أفضل منتجاتنا بأسعار تنافسية وجودة عالية
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
