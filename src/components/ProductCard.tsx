import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Product {
    id: number
    title: string
    slug: string
    price: number
    sale_price?: number
    images: string[]
    in_stock: boolean
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const displayPrice = product.sale_price || product.price
    const hasDiscount = product.sale_price && product.sale_price < product.price

    return (
        <Link href={`/products/${product.slug}`}>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-purple-500">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="w-16 h-16" />
                        </div>
                    )}

                    {hasDiscount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            تخفيض
                        </div>
                    )}

                    {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">نفذت الكمية</span>
                        </div>
                    )}
                </div>

                <CardContent className="p-4" dir="rtl">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-purple-600">
                            {displayPrice} د.ج
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                {product.price} د.ج
                            </span>
                        )}
                    </div>

                    <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 font-bold"
                        disabled={!product.in_stock}
                    >
                        {product.in_stock ? 'اطلب الآن' : 'غير متوفر'}
                        {product.in_stock && <ArrowLeft className="mr-2 h-4 w-4" />}
                    </Button>
                </CardContent>
            </Card>
        </Link>
    )
}
