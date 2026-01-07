import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-20 px-4 sm:px-6 lg:px-8" dir="rtl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6 animate-bounce">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">عروض حصرية ومحدودة</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                    تسوق بثقة من منزلك
                    <br />
                    <span className="text-yellow-200">دفع عند الاستلام</span>
                </h1>

                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                    منتجات عالية الجودة، توصيل سريع لجميع الولايات، وضمان استرجاع المال
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="#products">
                        <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                            تصفح المنتجات
                            <ArrowLeft className="mr-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="text-3xl font-bold text-white mb-1">+5000</div>
                        <div className="text-white/80 text-sm">عميل سعيد</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="text-3xl font-bold text-white mb-1">58</div>
                        <div className="text-white/80 text-sm">ولاية نغطيها</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="text-3xl font-bold text-white mb-1">24/7</div>
                        <div className="text-white/80 text-sm">خدمة العملاء</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
