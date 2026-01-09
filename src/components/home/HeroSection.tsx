'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section className="relative h-[70vh] sm:h-[85vh] lg:h-[90vh] min-h-[500px] sm:min-h-[600px] w-full bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden" dir="rtl">
            {/* Background Image with Parallax */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-l from-white/40 via-white/60 to-white/80 sm:from-white/30 sm:via-white/50 sm:to-white/70 z-10" />
                <img
                    src="/hero_luxury_bag.png"
                    alt="Luxury Bag Collection"
                    className="w-full h-full object-contain object-center scale-125 sm:scale-110 opacity-90 transition-transform duration-300"
                    style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                />
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-60" />
                <div className="absolute top-40 right-40 w-3 h-3 bg-stone-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-32 right-32 w-2 h-2 bg-amber-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center z-20">
                <div className="w-full max-w-full sm:max-w-2xl glass-effect p-6 sm:p-10 md:p-14 lg:p-16 border-r-2 sm:border-r-4 border-stone-900 shadow-luxury animate-fade-in-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-stone-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 group hover:bg-stone-800 transition-colors">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-medium tracking-widest uppercase">تشكيلة حصرية 2026</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-stone-900 leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6 font-cairo">
                        أناقتك تبدأ من<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-stone-700 to-stone-900 inline-block animate-gradient">حقيبتك</span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-lg md:text-xl text-stone-600 mb-6 sm:mb-10 max-w-xl leading-relaxed font-light">
                        اكتشفي مجموعتنا الجديدة من الحقائب الفاخرة التي تجمع بين التصميم العصري والجودة الاستثنائية
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <Link href="#products">
                            <Button className="bg-stone-900 hover:bg-stone-800 text-white text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 h-auto tracking-wide transition-all duration-500 hover:pr-10 sm:hover:pr-12 hover:shadow-2xl group relative overflow-hidden w-full sm:w-auto">
                                <span className="relative z-10 flex items-center justify-center">
                                    تسوقي الآن
                                    <ArrowLeft className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:mr-4 sm:group-hover:mr-5 transition-all duration-500" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-l from-stone-700 to-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Elements - Hidden on mobile */}
            <div className="hidden sm:block absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-stone-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="hidden sm:block absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-stone-100/40 to-transparent rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
        </section>
    )
}
