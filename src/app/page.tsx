import { Header } from '@/components/Header'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { Shield, Truck, CreditCard } from 'lucide-react'

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Header />
            <HeroSection />
            <FeaturedProducts />
            <CategoriesGrid />

            {/* Trust Badges Section */}
            <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white" dir="rtl">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="text-center p-8 bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl border border-sky-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">دفع عند الاستلام</h3>
                            <p className="text-gray-600">افحص منتجك قبل الدفع، راحتك أولويتنا</p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl border border-sky-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/25">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">توصيل سريع</h3>
                            <p className="text-gray-600">نوصل لجميع الولايات في 2-5 أيام فقط</p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl border border-sky-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
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
