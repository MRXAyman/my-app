import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { Shield, Truck, CreditCard } from 'lucide-react'

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <FeaturedProducts />
            <CategoriesGrid />

            {/* Trust Badges Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-pink-50" dir="rtl">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">دفع عند الاستلام</h3>
                            <p className="text-gray-600">افحص منتجك قبل الدفع، راحتك أولويتنا</p>
                        </div>

                        <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">توصيل سريع</h3>
                            <p className="text-gray-600">نوصل لجميع الولايات في 2-5 أيام فقط</p>
                        </div>

                        <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">ضمان الجودة</h3>
                            <p className="text-gray-600">منتجات أصلية 100% مع إمكانية الاستبدال</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
