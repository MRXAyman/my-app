'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'

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

interface ProductCarouselProps {
    products: Product[]
    autoPlayInterval?: number
    showDots?: boolean
    showArrows?: boolean
}

export function ProductCarousel({
    products,
    autoPlayInterval = 5000,
    showDots = true,
    showArrows = true
}: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

    // Calculate items per view based on screen size
    const [itemsPerView, setItemsPerView] = useState(4)

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1)
            } else if (window.innerWidth < 768) {
                setItemsPerView(2)
            } else if (window.innerWidth < 1024) {
                setItemsPerView(3)
            } else {
                setItemsPerView(4)
            }
        }

        updateItemsPerView()
        window.addEventListener('resize', updateItemsPerView)
        return () => window.removeEventListener('resize', updateItemsPerView)
    }, [])

    const maxIndex = Math.max(0, products.length - itemsPerView)

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, [maxIndex])

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }, [maxIndex])

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(Math.min(index, maxIndex))
    }, [maxIndex])

    // Auto-play functionality
    useEffect(() => {
        if (!isHovered && autoPlayInterval > 0) {
            autoPlayRef.current = setInterval(goToNext, autoPlayInterval)
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current)
            }
        }
    }, [isHovered, autoPlayInterval, goToNext])

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) {
            goToNext()
        }
        if (isRightSwipe) {
            goToPrevious()
        }

        setTouchStart(0)
        setTouchEnd(0)
    }

    if (products.length === 0) {
        return null
    }

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Carousel Container */}
            <div className="overflow-hidden -mx-2 md:-mx-3">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                        transform: `translateX(${currentIndex * 100}%)`
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 md:px-3"
                        >
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && products.length > itemsPerView && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-1/2 z-10 bg-white hover:bg-stone-900 text-stone-900 hover:text-white rounded-full p-2 md:p-3 shadow-luxury transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentIndex === 0}
                        aria-label="Previous"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-1/2 z-10 bg-white hover:bg-stone-900 text-stone-900 hover:text-white rounded-full p-2 md:p-3 shadow-luxury transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-hover:-translate-x-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentIndex >= maxIndex}
                        aria-label="Next"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </>
            )}

            {/* Dot Indicators */}
            {showDots && products.length > itemsPerView && (
                <div className="flex justify-center gap-2 mt-6 md:mt-8">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                ? 'bg-stone-900 w-8 h-2'
                                : 'bg-stone-300 hover:bg-stone-400 w-2 h-2'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
