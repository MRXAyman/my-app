'use client'

import { useState, useEffect } from 'react'
import { Check, Package, Tag, Sparkles } from 'lucide-react'
import { BundleOffer, BundleItem } from '@/types/bundle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface VariantItem {
    color?: string
    colorHex?: string
    image?: string
    size?: string
    price: number
    sale_price?: number
    stock: number
}

interface ProductVariants {
    type: 'simple' | 'colors' | 'sizes' | 'hybrid'
    items: VariantItem[]
}

interface BundleOfferSelectorProps {
    bundleOffers: BundleOffer[]
    variants?: ProductVariants | null
    basePrice: number
    onBundleSelect: (bundleOffer: BundleOffer | null, items: BundleItem[]) => void
    onImageChange?: (image: string | null) => void
}

export function BundleOfferSelector({
    bundleOffers,
    variants,
    basePrice,
    onBundleSelect,
    onImageChange
}: BundleOfferSelectorProps) {
    const [selectedBundle, setSelectedBundle] = useState<BundleOffer | null>(null)
    const [bundleItems, setBundleItems] = useState<BundleItem[]>([])

    const hasVariants = variants && variants.items && variants.items.length > 0

    // Initialize bundle items when bundle is selected
    useEffect(() => {
        if (selectedBundle) {
            const items: BundleItem[] = Array(selectedBundle.quantity).fill(null).map(() => ({}))
            setBundleItems(items)
        } else {
            setBundleItems([])
        }
    }, [selectedBundle])

    // Notify parent of changes
    useEffect(() => {
        onBundleSelect(selectedBundle, bundleItems)
    }, [selectedBundle, bundleItems])

    const handleBundleClick = (offer: BundleOffer) => {
        if (selectedBundle?.quantity === offer.quantity) {
            // Deselect
            setSelectedBundle(null)
            setBundleItems([])
        } else {
            // Select
            setSelectedBundle(offer)
        }
    }

    const handleItemVariantChange = (itemIndex: number, field: keyof BundleItem, value: any) => {
        const newItems = [...bundleItems]
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }

        // If color is selected and has an image, update the main product image
        if (field === 'color' && hasVariants && variants.type !== 'sizes') {
            const variant = variants.items.find(v => v.color === value)
            if (variant?.image && onImageChange) {
                onImageChange(variant.image)
            }
        }

        setBundleItems(newItems)
    }

    const calculateSavings = (offer: BundleOffer) => {
        const regularTotal = basePrice * offer.quantity
        const savings = regularTotal - offer.price
        const percentage = ((savings / regularTotal) * 100).toFixed(0)
        return { savings, percentage }
    }

    const getAvailableColors = () => {
        if (!hasVariants || variants.type === 'sizes') return []
        const colors = [...new Set(variants.items.map(v => v.color).filter(Boolean))]
        return colors as string[]
    }

    const getAvailableSizes = (color?: string) => {
        if (!hasVariants || variants.type === 'colors') return []

        if (variants.type === 'hybrid' && color) {
            // Filter sizes by selected color
            const sizes = variants.items
                .filter(v => v.color === color)
                .map(v => v.size)
                .filter(Boolean)
            return [...new Set(sizes)] as string[]
        }

        // For sizes-only variants
        const sizes = [...new Set(variants.items.map(v => v.size).filter(Boolean))]
        return sizes as string[]
    }

    const getVariantDetails = (color?: string, size?: string) => {
        if (!hasVariants) return null

        if (variants.type === 'colors') {
            return variants.items.find(v => v.color === color)
        } else if (variants.type === 'sizes') {
            return variants.items.find(v => v.size === size)
        } else if (variants.type === 'hybrid') {
            return variants.items.find(v => v.color === color && v.size === size)
        }
        return null
    }

    if (!bundleOffers || bundleOffers.length === 0) {
        return null
    }

    return (
        <div className="space-y-6 mt-6" dir="rtl">
            <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">عروض خاصة</h3>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0">
                    وفر أكثر!
                </Badge>
            </div>

            {/* Bundle Offer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bundleOffers.map((offer, index) => {
                    const { savings, percentage } = calculateSavings(offer)
                    const isSelected = selectedBundle?.quantity === offer.quantity
                    const regularTotal = basePrice * offer.quantity

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleBundleClick(offer)}
                            className={`relative p-6 rounded-xl border-2 transition-all text-right ${isSelected
                                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                                }`}
                        >
                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 left-3 bg-purple-600 text-white rounded-full p-1">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}

                            {/* Savings Badge */}
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Tag className="h-3 w-3 ml-1" />
                                    وفر {percentage}%
                                </Badge>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-purple-600" />
                                    <h4 className="text-xl font-bold text-gray-900">
                                        {offer.title || `عرض ${offer.quantity} قطع`}
                                    </h4>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-purple-600">
                                            {offer.price.toLocaleString()} د.ج
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="line-through">{regularTotal.toLocaleString()} د.ج</span>
                                        <span className="text-green-600 font-semibold">
                                            (توفير {savings.toLocaleString()} د.ج)
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600">
                                    اشتري {offer.quantity} قطع بسعر مخفض
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Bundle Items Selection */}
            {selectedBundle && hasVariants && (
                <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-600" />
                        <Label className="text-base font-semibold">اختر المواصفات لكل قطعة</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bundleItems.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                className="p-4 bg-white rounded-lg border border-purple-200 space-y-3"
                            >
                                <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
                                    <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-sm font-bold rounded-full">
                                        {itemIndex + 1}
                                    </span>
                                    <span className="font-semibold text-gray-900">القطعة {itemIndex + 1}</span>
                                </div>

                                {/* Color Selection */}
                                {(variants.type === 'colors' || variants.type === 'hybrid') && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">اللون</Label>
                                        <Select
                                            value={item.color || ''}
                                            onValueChange={(value) => handleItemVariantChange(itemIndex, 'color', value)}
                                        >
                                            <SelectTrigger className="flex-row-reverse">
                                                <SelectValue placeholder="اختر اللون" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableColors().map((color) => {
                                                    const variant = variants.items.find(v => v.color === color)
                                                    return (
                                                        <SelectItem key={color} value={color} className="justify-end">
                                                            <div className="flex items-center gap-2">
                                                                {variant?.colorHex && (
                                                                    <div
                                                                        className="w-4 h-4 rounded-full border"
                                                                        style={{ backgroundColor: variant.colorHex }}
                                                                    />
                                                                )}
                                                                <span>{color}</span>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Size Selection */}
                                {(variants.type === 'sizes' || variants.type === 'hybrid') && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">المقاس</Label>
                                        <Select
                                            value={item.size || ''}
                                            onValueChange={(value) => handleItemVariantChange(itemIndex, 'size', value)}
                                            disabled={variants.type === 'hybrid' && !item.color}
                                        >
                                            <SelectTrigger className="flex-row-reverse">
                                                <SelectValue placeholder="اختر المقاس" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableSizes(item.color).map((size) => (
                                                    <SelectItem key={size} value={size} className="justify-end">
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Stock Status */}
                                {item.color && (variants.type === 'sizes' ? true : item.size || variants.type === 'colors') && (
                                    <div className="pt-2">
                                        {(() => {
                                            const variantDetails = getVariantDetails(item.color, item.size)
                                            if (!variantDetails) return null

                                            return variantDetails.stock === 0 ? (
                                                <p className="text-xs text-red-600">غير متوفر</p>
                                            ) : variantDetails.stock < 5 ? (
                                                <p className="text-xs text-orange-600">متبقي {variantDetails.stock} فقط</p>
                                            ) : (
                                                <p className="text-xs text-green-600">متوفر</p>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                        يمكنك اختيار لون ومقاس مختلف لكل قطعة في العرض
                    </p>
                </div>
            )}
        </div>
    )
}
