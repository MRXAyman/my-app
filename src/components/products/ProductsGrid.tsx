"use client"

import { ProductCard } from "@/components/ProductCard"
import { Package } from "lucide-react"

interface Product {
    id: number
    title: string
    slug: string
    price: number
    sale_price?: number
    images: string[]
    in_stock: boolean
}

interface ProductsGridProps {
    products: Product[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    لا توجد منتجات
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                    لم نتمكن من العثور على أي منتجات تطابق معايير البحث. جرب تغيير الفلاتر أو مسحها.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
