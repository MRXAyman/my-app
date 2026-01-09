'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductCarousel } from './ProductCarousel'
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

export function NewArrivals() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products/featured?limit=8&type=new')
                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }
                const data = await response.json()
                setProducts(data.products || [])
            } catch (err) {
                console.error('Error fetching new arrivals:', err)
                setError('فشل في تحميل المنتجات')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    return (
        <section className="py-12 sm:py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-3 sm:gap-4">
                    <div>
                        <span className="text-stone-500 font-light uppercase tracking-widest text-[10px] sm:text-xs mb-2 sm:mb-3 block">جديد</span>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2 sm:mb-3 font-cairo">وصلنا حديثاً</h2>
                        <p className="text-stone-600 font-light text-sm sm:text-lg">استكشفي أحدث الإضافات لمجموعتنا الفاخرة</p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden sm:inline-flex items-center text-stone-900 font-medium hover:text-stone-700 transition-all duration-300 group"
                    >
                        عرض الكل
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:mr-3 transition-all duration-300" />
                    </Link>
                </div>

                {/* Content */}
                {loading ? (
                    <LoadingSkeleton variant="carousel" />
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-stone-500 text-lg">{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-stone-500 text-lg">لا توجد منتجات جديدة حالياً</p>
                        <p className="text-stone-400 text-sm mt-2">يرجى إضافة منتجات من لوحة التحكم</p>
                    </div>
                ) : (
                    <ProductCarousel
                        products={products}
                        autoPlayInterval={5000}
                        showDots={true}
                        showArrows={true}
                    />
                )}

                {/* Mobile View All Button */}
                {!loading && products.length > 0 && (
                    <div className="sm:hidden text-center mt-6">
                        <Link
                            href="/products"
                            className="inline-flex items-center text-stone-900 font-medium hover:text-stone-700 transition-colors px-6 py-3 text-sm border border-stone-300 hover:border-stone-900"
                        >
                            عرض جميع المنتجات
                            <ArrowLeft className="mr-2 w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
