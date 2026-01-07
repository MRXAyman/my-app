import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Package } from 'lucide-react'

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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        تصفح حسب الفئة
                    </h2>
                    <p className="text-lg text-gray-600">
                        اكتشف منتجاتنا المتنوعة في جميع الأصناف
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group"
                        >
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500">
                                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Package className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
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
