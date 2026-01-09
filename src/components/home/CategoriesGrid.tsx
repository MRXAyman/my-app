'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

interface Category {
    id: string
    name: string
    slug: string
    image: string
    count: string
    productCount: number
}

export function CategoriesGrid() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories/with-count')
                if (!response.ok) {
                    throw new Error('Failed to fetch categories')
                }
                const data = await response.json()
                setCategories(data.categories || [])
            } catch (err) {
                console.error('Error fetching categories:', err)
                setError('فشل في تحميل الأصناف')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <section className="py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white" id="categories" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-14">
                    <span className="text-stone-500 font-light uppercase tracking-widest text-[10px] sm:text-xs mb-2 sm:mb-3 block">اكتشف مجموعتنا</span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2 sm:mb-3 font-cairo">تصفح حسب الفئة</h2>
                    <p className="text-stone-600 font-light text-sm sm:text-lg">اختر من تشكيلتنا المتنوعة من الحقائب الفاخرة</p>
                </div>

                {/* Category Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <LoadingSkeleton key={i} variant="category" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-stone-500 text-lg">{error}</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-stone-500 text-lg">لا توجد أصناف حالياً</p>
                        <p className="text-stone-400 text-sm mt-2">يرجى إضافة أصناف ومنتجات من لوحة التحكم</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group relative block aspect-square overflow-hidden bg-stone-50 shadow-sm hover:shadow-luxury transition-shadow duration-500"
                            >
                                {/* Category Image */}
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent sm:from-black/60 sm:via-black/20 group-hover:from-black/80 sm:group-hover:from-black/70 transition-all duration-500" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 md:p-6 text-center">
                                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 font-cairo drop-shadow-lg">{category.name}</h3>
                                    <span className="text-[10px] sm:text-xs md:text-sm text-white/80 mb-2 sm:mb-3">{category.count}</span>
                                    <span className="inline-flex items-center text-xs sm:text-sm text-white font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                        تصفح الآن <ArrowLeft className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
