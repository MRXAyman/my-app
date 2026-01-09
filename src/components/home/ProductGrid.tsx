'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

interface Product {
    id: string
    name: string
    price: number
    originalPrice?: number | null
    image: string
    hoverImage?: string
    tag?: string
    slug: string
}

export function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products/featured?limit=8&type=featured')
                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }
                const data = await response.json()
                setProducts(data.products || [])
            } catch (err) {
                console.error('Error fetching featured products:', err)
                setError('فشل في تحميل المنتجات')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    return (
        <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-stone-50" id="products" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="text-stone-500 font-light uppercase tracking-widest text-[10px] sm:text-xs mb-2 sm:mb-3 block">مختاراتنا لك</span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2 sm:mb-4 font-cairo">الأكثر طلباً هذا الموسم</h2>
                    <p className="text-stone-600 font-light text-sm sm:text-lg max-w-2xl mx-auto px-4">
                        اكتشف أفضل الحقائب التي اختارها عملاؤنا
                    </p>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-12 md:gap-y-16">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <LoadingSkeleton key={i} variant="product" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-stone-500 text-lg">{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-stone-500 text-lg">لا توجد منتجات حالياً</p>
                        <p className="text-stone-400 text-sm mt-2">يرجى إضافة منتجات من لوحة التحكم</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-12 md:gap-y-16">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
