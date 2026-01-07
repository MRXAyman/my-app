import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/ProductCard'

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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" id="products" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        المنتجات المميزة
                    </h2>
                    <p className="text-lg text-gray-600">
                        اختر من بين أفضل منتجاتنا بأسعار تنافسية
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
