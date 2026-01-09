'use client'

import { useState } from 'react'
import { ImageGallery } from "@/components/product/ImageGallery"
import { ProductVariantSelector } from "@/components/product/ProductVariantSelector"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { BundleOfferSelector } from "@/components/product/BundleOfferSelector"
import { BundleOffer, BundleItem } from "@/types/bundle"

interface VariantItem {
    color?: string
    colorHex?: string
    image?: string
    size?: string
    price: number
    sale_price?: number
    stock: number
    sku?: string
}

interface ProductVariants {
    type: 'simple' | 'colors' | 'sizes' | 'hybrid'
    items: VariantItem[]
}

interface Product {
    id: number
    title: string
    price: number
    sale_price?: number
    description?: string
    images: string[]
    variants?: ProductVariants | null
    stock: number
    in_stock: boolean
    bundle_offers?: BundleOffer[] | null
}

interface ProductPageClientProps {
    product: Product
}

export function ProductPageClient({ product }: ProductPageClientProps) {
    const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(null)
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [selectedBundle, setSelectedBundle] = useState<BundleOffer | null>(null)
    const [bundleItems, setBundleItems] = useState<BundleItem[]>([])

    // Check if product has variants
    const hasVariants = product.variants && product.variants.items && product.variants.items.length > 0

    // Determine which images to display
    // If a color-specific image is selected, replace the first image with it
    // and filter it out from the rest to avoid duplicates
    const displayImages = currentImage
        ? [currentImage, ...(product.images || []).filter(img => img !== currentImage)]
        : (product.images || [])

    // Calculate display price
    let displayPrice = product.price
    let originalPrice = null

    if (selectedBundle) {
        // Use bundle price
        displayPrice = selectedBundle.price
        originalPrice = product.price * selectedBundle.quantity
    } else if (hasVariants && selectedVariant) {
        // Use variant price
        displayPrice = selectedVariant.sale_price && selectedVariant.sale_price > 0
            ? selectedVariant.sale_price
            : selectedVariant.price
        if (selectedVariant.sale_price && selectedVariant.sale_price > 0) {
            originalPrice = selectedVariant.price
        }
    } else if (!hasVariants) {
        // Use product price
        if (product.sale_price && product.sale_price > 0) {
            displayPrice = product.sale_price
            originalPrice = product.price
        }
    }

    // Get stock info
    const stockInfo = hasVariants && selectedVariant
        ? { stock: selectedVariant.stock, in_stock: selectedVariant.stock > 0 }
        : { stock: product.stock, in_stock: product.in_stock }

    // Handle image change when variant is selected
    const handleImageChange = (image: string | null) => {
        setCurrentImage(image)
    }

    // Handle bundle selection
    const handleBundleSelect = (bundle: BundleOffer | null, items: BundleItem[]) => {
        setSelectedBundle(bundle)
        setBundleItems(items)
        // Reset single variant selection when bundle is selected
        if (bundle) {
            setSelectedVariant(null)
        }
    }

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
            {/* Image Gallery - Shows second on mobile, first on desktop */}
            <div className="order-2 lg:order-1 mb-8 lg:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <ImageGallery images={displayImages} title={product.title} />
                </div>
            </div>

            {/* Product Info - Shows first on mobile, second on desktop */}
            <div className="order-1 lg:order-2">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{product.title}</h1>

                    {/* Price */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 inline-block">
                            <p className="text-3xl tracking-tight text-primary font-bold">{displayPrice} د.ج</p>
                        </div>
                        {originalPrice && (
                            <div className="text-gray-400 line-through text-xl">
                                {originalPrice} د.ج
                            </div>
                        )}
                    </div>

                    {/* Variant Selector */}
                    {hasVariants && product.variants && !selectedBundle && (
                        <ProductVariantSelector
                            variants={product.variants}
                            onVariantChange={setSelectedVariant}
                            onImageChange={handleImageChange}
                        />
                    )}

                    {/* Bundle Offers Selector */}
                    {product.bundle_offers && product.bundle_offers.length > 0 && (
                        <BundleOfferSelector
                            bundleOffers={product.bundle_offers}
                            variants={product.variants}
                            basePrice={product.price}
                            onBundleSelect={handleBundleSelect}
                            onImageChange={handleImageChange}
                        />
                    )}

                    {/* Stock Status */}
                    {!hasVariants && (
                        <div className="mt-4">
                            {stockInfo.stock === 0 ? (
                                <p className="text-red-600 font-medium">غير متوفر حالياً</p>
                            ) : stockInfo.stock < 5 ? (
                                <p className="text-orange-600 font-medium">متبقي {stockInfo.stock} قطع فقط!</p>
                            ) : (
                                <p className="text-green-600 font-medium">متوفر في المخزون</p>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">وصف المنتج</h3>
                        <div className="space-y-4 text-base text-gray-600 leading-relaxed">
                            <p>{product.description || "لا يوجد وصف لهذا المنتج حاليا."}</p>
                            <ul className="list-disc list-inside space-y-2 mt-4 marker:text-primary">
                                <li>جودة عالية ومضمونة.</li>
                                <li>متوفر بكميات محدودة.</li>
                                <li>توصيل لجميع الولايات (58 ولاية).</li>
                            </ul>
                        </div>
                    </div>

                    {/* Checkout Form - Shows on mobile only, after description */}
                    <div className="lg:hidden mt-8">
                        <CheckoutForm
                            productId={product.id}
                            productPrice={displayPrice}
                            productTitle={product.title}
                            selectedVariant={selectedVariant}
                            selectedBundle={selectedBundle}
                            bundleItems={bundleItems}
                        />

                        {/* Trust Badges */}
                        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                            <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                <span className="font-bold mb-1 text-gray-900">دفع عند الاستلام</span>
                                <span>افحص منتجك قبل الدفع</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                <span className="font-bold mb-1 text-gray-900">توصيل سريع</span>
                                <span>3-1 أيام لجميع الولايات</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                <span className="font-bold mb-1 text-gray-900">ضمان الجودة</span>
                                <span>استبدال في حالة عطب</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form - Shows on desktop only, below product info */}
                <div className="hidden lg:block mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <CheckoutForm
                            productId={product.id}
                            productPrice={displayPrice}
                            productTitle={product.title}
                            selectedVariant={selectedVariant}
                            selectedBundle={selectedBundle}
                            bundleItems={bundleItems}
                        />

                        {/* Trust Badges */}
                        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                            <div className="flex flex-col items-center p-2 bg-gray-50 rounded shadow-sm">
                                <span className="font-bold mb-1 text-gray-900">دفع عند الاستلام</span>
                                <span>افحص منتجك قبل الدفع</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-gray-50 rounded shadow-sm">
                                <span className="font-bold mb-1 text-gray-900">توصيل سريع</span>
                                <span>3-1 أيام لجميع الولايات</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-gray-50 rounded shadow-sm">
                                <span className="font-bold mb-1 text-gray-900">ضمان الجودة</span>
                                <span>استبدال في حالة عطب</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
