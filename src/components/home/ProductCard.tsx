import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
    id: string
    name: string
    price: number
    image: string
    hoverImage?: string // Optional hover image
    tag?: string
    slug: string
}

export function ProductCard({ id, name, price, image, hoverImage, tag, slug }: ProductCardProps) {
    return (
        <Link href={`/products/${slug}`} className="group block">
            {/* Product Image Container */}
            <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden mb-3 sm:mb-4 shadow-sm group-hover:shadow-luxury transition-shadow duration-500">
                {/* Tag Badge */}
                {tag && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                        <Badge
                            variant="secondary"
                            className={`backdrop-blur-sm text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 shadow-md ${tag === 'تخفيض'
                                    ? 'bg-red-600/90 text-white hover:bg-red-600'
                                    : tag === 'الأكثر مبيعاً'
                                        ? 'bg-amber-500/90 text-white hover:bg-amber-500'
                                        : 'bg-white/90 text-stone-900 hover:bg-white'
                                }`}
                        >
                            {tag}
                        </Badge>
                    </div>
                )}

                {/* Main Image */}
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover object-center transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
                        }`}
                />

                {/* Hover Image */}
                {hoverImage && (
                    <img
                        src={hoverImage}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
                    />
                )}

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            </div>

            {/* Product Info */}
            <div className="space-y-1 sm:space-y-2 text-right" dir="rtl">
                <h3 className="text-stone-900 font-medium text-sm sm:text-base md:text-lg leading-snug group-hover:text-stone-700 transition-colors duration-300 line-clamp-2">
                    {name}
                </h3>
                <p className="text-stone-900 font-bold text-base sm:text-lg tracking-tight">
                    {price.toLocaleString()} <span className="text-xs sm:text-sm font-normal text-stone-600">د.ج</span>
                </p>
            </div>
        </Link>
    )
}
