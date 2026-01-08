import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Package, Grid3x3 } from 'lucide-react'

export async function CategoriesGrid() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .limit(6)

    if (!categories || categories.length === 0) {
        return null
    }

    return (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-sky-50/30" id="categories" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/10 to-teal-500/10 px-4 py-2 rounded-full border border-sky-200/50 mb-2">
                        <Grid3x3 className="w-4 h-4 text-sky-600" />
                        <span className="text-sm font-semibold text-sky-700">تصنيفات متنوعة</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        تصفح حسب الفئة
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        اكتشف منتجاتنا المتنوعة في جميع الأصناف
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-sky-300">
                                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-gradient-to-br from-sky-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:from-sky-500 group-hover:to-teal-500">
                                    <Package className="w-7 h-7 md:w-8 md:h-8 text-sky-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors text-sm md:text-base">
                                    {category.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
