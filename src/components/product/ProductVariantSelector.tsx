'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

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

interface ProductVariantSelectorProps {
    variants: ProductVariants
    onVariantChange: (variant: VariantItem | null) => void
    onImageChange?: (image: string | null) => void
}

export function ProductVariantSelector({ variants, onVariantChange, onImageChange }: ProductVariantSelectorProps) {
    const [selectedColor, setSelectedColor] = useState<string | undefined>()
    const [selectedSize, setSelectedSize] = useState<string | undefined>()

    // Get unique colors and sizes
    const colors = Array.from(new Set(variants.items.map(item => item.color).filter(Boolean)))
    const sizes = Array.from(new Set(variants.items.map(item => item.size).filter(Boolean)))

    // Get color info (hex and image)
    const getColorInfo = (colorName: string) => {
        const item = variants.items.find(item => item.color === colorName)
        return {
            hex: item?.colorHex || '#cccccc',
            image: item?.image
        }
    }

    // Find the selected variant
    useEffect(() => {
        let selectedVariant: VariantItem | null = null

        if (variants.type === 'colors' && selectedColor) {
            selectedVariant = variants.items.find(item => item.color === selectedColor) || null
        } else if (variants.type === 'sizes' && selectedSize) {
            selectedVariant = variants.items.find(item => item.size === selectedSize) || null
        } else if (variants.type === 'hybrid' && selectedColor && selectedSize) {
            selectedVariant = variants.items.find(
                item => item.color === selectedColor && item.size === selectedSize
            ) || null
        }

        onVariantChange(selectedVariant)

        // Update image if color has a specific image
        if (selectedVariant?.image && onImageChange) {
            onImageChange(selectedVariant.image)
        } else if (onImageChange) {
            onImageChange(null)
        }
    }, [selectedColor, selectedSize, variants, onVariantChange, onImageChange])

    // Auto-select first available variant
    useEffect(() => {
        if (colors.length > 0 && !selectedColor) {
            setSelectedColor(colors[0])
        }
        if (sizes.length > 0 && !selectedSize && variants.type !== 'hybrid') {
            setSelectedSize(sizes[0])
        }
    }, [colors, sizes, selectedColor, selectedSize, variants.type])

    if (variants.type === 'simple') {
        return null
    }

    return (
        <div className="space-y-6 mt-6 border-t pt-6">
            {/* Color Selection */}
            {colors.length > 0 && (
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4">
                        اللون: {selectedColor && <span className="text-primary mr-2">{selectedColor}</span>}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            const isAvailable = variants.items.some(
                                item => item.color === color && item.stock > 0
                            )
                            const isSelected = selectedColor === color
                            const colorInfo = getColorInfo(color)

                            return (
                                <button
                                    key={color}
                                    onClick={() => isAvailable && setSelectedColor(color)}
                                    disabled={!isAvailable}
                                    className={`
                                        group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                                        ${isSelected
                                            ? 'border-primary bg-primary/5 shadow-md scale-105'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                        }
                                        ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                    title={color}
                                >
                                    {/* Color Circle */}
                                    <div className="relative">
                                        <div
                                            className={`
                                                w-12 h-12 rounded-full border-2 transition-all
                                                ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}
                                                ${!isAvailable ? 'opacity-50' : ''}
                                            `}
                                            style={{ backgroundColor: colorInfo.hex }}
                                        />
                                        {isSelected && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-white rounded-full p-1">
                                                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                                                </div>
                                            </div>
                                        )}
                                        {!isAvailable && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Color Name */}
                                    <span className={`
                                        text-xs font-medium text-center
                                        ${isSelected ? 'text-primary' : 'text-gray-700'}
                                    `}>
                                        {color}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4">
                        المقاس: {selectedSize && <span className="text-primary mr-2">{selectedSize}</span>}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size) => {
                            const isAvailable = variants.items.some(
                                item => {
                                    if (variants.type === 'hybrid') {
                                        return item.size === size && item.color === selectedColor && item.stock > 0
                                    }
                                    return item.size === size && item.stock > 0
                                }
                            )
                            const isSelected = selectedSize === size

                            return (
                                <button
                                    key={size}
                                    onClick={() => isAvailable && setSelectedSize(size)}
                                    disabled={!isAvailable}
                                    className={`
                                        relative min-w-[70px] px-5 py-3 rounded-xl border-2 transition-all font-semibold
                                        ${isSelected
                                            ? 'border-primary bg-primary text-white shadow-md scale-105'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                                        }
                                        ${!isAvailable ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
                                    `}
                                >
                                    {size}
                                    {isSelected && (
                                        <Check className="absolute top-1 left-1 h-4 w-4" strokeWidth={3} />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Stock Status */}
            {((selectedColor && !selectedSize && variants.type === 'colors') ||
                (selectedColor && selectedSize && variants.type === 'hybrid') ||
                (selectedSize && !selectedColor && variants.type === 'sizes')) && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                        {(() => {
                            let variant: VariantItem | undefined

                            if (variants.type === 'colors' && selectedColor) {
                                variant = variants.items.find(item => item.color === selectedColor)
                            } else if (variants.type === 'sizes' && selectedSize) {
                                variant = variants.items.find(item => item.size === selectedSize)
                            } else if (variants.type === 'hybrid' && selectedColor && selectedSize) {
                                variant = variants.items.find(
                                    item => item.color === selectedColor && item.size === selectedSize
                                )
                            }

                            if (!variant) return null

                            if (variant.stock === 0) {
                                return (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <p className="text-red-600 font-semibold">غير متوفر حالياً</p>
                                    </div>
                                )
                            } else if (variant.stock < 5) {
                                return (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                        <p className="text-orange-600 font-semibold">⚠️ متبقي {variant.stock} قطع فقط - اطلب الآن!</p>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-green-600 font-semibold">✓ متوفر في المخزون</p>
                                    </div>
                                )
                            }
                        })()}
                    </div>
                )}
        </div>
    )
}
