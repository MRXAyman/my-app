import Link from 'next/link'
import { ArrowLeft, Sparkles, TrendingUp, Award, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8" dir="rtl">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/10 to-teal-500/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-sky-200/50">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        <span className="text-sm font-semibold text-sky-700">عروض حصرية لفترة محدودة</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        تسوق بذكاء من منزلك
                        <br />
                        <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                            دفع عند الاستلام
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        منتجات عالية الجودة، توصيل سريع لجميع الولايات، وضمان استرجاع المال
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link href="#products">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-lg px-10 py-6 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transform hover:scale-105 transition-all duration-300"
                            >
                                تصفح المنتجات
                                <ArrowLeft className="mr-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Stats */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto pt-8">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-200/50 hover:border-sky-300 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center justify-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-1">
                                +5000
                            </div>
                            <div className="text-gray-600 text-xs md:text-sm font-medium">عميل سعيد</div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-200/50 hover:border-sky-300 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center justify-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-1">
                                58
                            </div>
                            <div className="text-gray-600 text-xs md:text-sm font-medium">ولاية نغطيها</div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-200/50 hover:border-sky-300 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center justify-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-1">
                                24/7
                            </div>
                            <div className="text-gray-600 text-xs md:text-sm font-medium">خدمة العملاء</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
