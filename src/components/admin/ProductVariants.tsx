'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export type VariantType = 'simple' | 'colors' | 'sizes' | 'hybrid'

export interface VariantItem {
    color?: string
    size?: string
    price: number
    sale_price?: number
    stock: number
}

export interface ProductVariants {
    type: VariantType
    options: {
        colors?: string[]
        sizes?: string[]
    }
    items: VariantItem[]
}

interface ProductVariantsProps {
    value: ProductVariants | null
    onChange: (variants: ProductVariants | null) => void
    basePrice?: number
    baseSalePrice?: number
    baseStock?: number
}

export function ProductVariantsComponent({
    value,
    onChange,
    basePrice = 0,
    baseSalePrice,
    baseStock = 0,
}: ProductVariantsProps) {
    const [variantType, setVariantType] = useState<VariantType>(value?.type || 'simple')
    const [colors, setColors] = useState<string[]>(value?.options.colors || [])
    const [sizes, setSizes] = useState<string[]>(value?.options.sizes || [])
    const [colorInput, setColorInput] = useState('')
    const [sizeInput, setSizeInput] = useState('')
    const [variantItems, setVariantItems] = useState<VariantItem[]>(value?.items || [])

    // Update parent when data changes
    useEffect(() => {
        if (variantType === 'simple') {
            onChange(null)
        } else {
            onChange({
                type: variantType,
                options: {
                    colors: variantType === 'colors' || variantType === 'hybrid' ? colors : undefined,
                    sizes: variantType === 'sizes' || variantType === 'hybrid' ? sizes : undefined,
                },
                items: variantItems,
            })
        }
    }, [variantType, colors, sizes, variantItems])

    // Generate variant items when colors/sizes change
    useEffect(() => {
        if (variantType === 'simple') {
            setVariantItems([])
            return
        }

        let newItems: VariantItem[] = []

        if (variantType === 'colors') {
            newItems = colors.map(color => {
                const existing = variantItems.find(item => item.color === color && !item.size)
                return existing || {
                    color,
                    price: basePrice,
                    sale_price: baseSalePrice,
                    stock: baseStock,
                }
            })
        } else if (variantType === 'sizes') {
            newItems = sizes.map(size => {
                const existing = variantItems.find(item => item.size === size && !item.color)
                return existing || {
                    size,
                    price: basePrice,
                    sale_price: baseSalePrice,
                    stock: baseStock,
                }
            })
        } else if (variantType === 'hybrid') {
            newItems = colors.flatMap(color =>
                sizes.map(size => {
                    const existing = variantItems.find(
                        item => item.color === color && item.size === size
                    )
                    return existing || {
                        color,
                        size,
                        price: basePrice,
                        sale_price: baseSalePrice,
                        stock: baseStock,
                    }
                })
            )
        }

        setVariantItems(newItems)
    }, [variantType, colors, sizes])

    const handleAddColor = () => {
        if (colorInput.trim() && !colors.includes(colorInput.trim())) {
            setColors([...colors, colorInput.trim()])
            setColorInput('')
        }
    }

    const handleRemoveColor = (color: string) => {
        setColors(colors.filter(c => c !== color))
    }

    const handleAddSize = () => {
        if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
            setSizes([...sizes, sizeInput.trim()])
            setSizeInput('')
        }
    }

    const handleRemoveSize = (size: string) => {
        setSizes(sizes.filter(s => s !== size))
    }

    const handleVariantItemChange = (index: number, field: keyof VariantItem, value: any) => {
        const newItems = [...variantItems]
        newItems[index] = { ...newItems[index], [field]: value }
        setVariantItems(newItems)
    }

    const handleTypeChange = (newType: VariantType) => {
        setVariantType(newType)
        if (newType === 'simple') {
            setColors([])
            setSizes([])
            setVariantItems([])
        }
    }

    return (
        <div className="space-y-6 border rounded-lg p-6 bg-gray-50/50" dir="rtl">
            <div>
                <Label className="text-base font-semibold">نوع المنتج</Label>
                <p className="text-sm text-muted-foreground mb-3">
                    اختر نوع المنتج حسب المتغيرات المتوفرة
                </p>
                <Select value={variantType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="bg-white flex-row-reverse">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="simple" className="justify-end">
                            منتج بسيط (بدون متغيرات)
                        </SelectItem>
                        <SelectItem value="colors" className="justify-end">
                            ألوان فقط
                        </SelectItem>
                        <SelectItem value="sizes" className="justify-end">
                            مقاسات فقط
                        </SelectItem>
                        <SelectItem value="hybrid" className="justify-end">
                            هجين (ألوان + مقاسات)
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {variantType !== 'simple' && (
                <>
                    {/* Colors Input */}
                    {(variantType === 'colors' || variantType === 'hybrid') && (
                        <div className="space-y-3">
                            <Label>الألوان المتوفرة</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="مثال: أحمر، أزرق، أسود..."
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                                    className="bg-white"
                                />
                                <Button type="button" onClick={handleAddColor} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {colors.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <Badge
                                            key={color}
                                            variant="secondary"
                                            className="px-3 py-1 text-sm bg-white border"
                                        >
                                            {color}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveColor(color)}
                                                className="mr-2 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sizes Input */}
                    {(variantType === 'sizes' || variantType === 'hybrid') && (
                        <div className="space-y-3">
                            <Label>المقاسات المتوفرة</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="مثال: S, M, L, XL..."
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                                    className="bg-white"
                                />
                                <Button type="button" onClick={handleAddSize} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {sizes.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <Badge
                                            key={size}
                                            variant="secondary"
                                            className="px-3 py-1 text-sm bg-white border"
                                        >
                                            {size}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSize(size)}
                                                className="mr-2 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Variants Table */}
                    {variantItems.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">تفاصيل المتغيرات</Label>
                            <div className="border rounded-lg overflow-hidden bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            {variantType === 'colors' && (
                                                <TableHead className="text-right">اللون</TableHead>
                                            )}
                                            {variantType === 'sizes' && (
                                                <TableHead className="text-right">المقاس</TableHead>
                                            )}
                                            {variantType === 'hybrid' && (
                                                <>
                                                    <TableHead className="text-right">اللون</TableHead>
                                                    <TableHead className="text-right">المقاس</TableHead>
                                                </>
                                            )}
                                            <TableHead className="text-right">السعر (د.ج)</TableHead>
                                            <TableHead className="text-right">سعر التخفيض</TableHead>
                                            <TableHead className="text-right">الكمية</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {variantItems.map((item, index) => (
                                            <TableRow key={index}>
                                                {variantType === 'colors' && (
                                                    <TableCell className="font-medium">{item.color}</TableCell>
                                                )}
                                                {variantType === 'sizes' && (
                                                    <TableCell className="font-medium">{item.size}</TableCell>
                                                )}
                                                {variantType === 'hybrid' && (
                                                    <>
                                                        <TableCell className="font-medium">{item.color}</TableCell>
                                                        <TableCell className="font-medium">{item.size}</TableCell>
                                                    </>
                                                )}
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) =>
                                                            handleVariantItemChange(
                                                                index,
                                                                'price',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="w-24"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.sale_price || ''}
                                                        onChange={(e) =>
                                                            handleVariantItemChange(
                                                                index,
                                                                'sale_price',
                                                                e.target.value ? Number(e.target.value) : undefined
                                                            )
                                                        }
                                                        className="w-24"
                                                        placeholder="اختياري"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.stock}
                                                        onChange={(e) =>
                                                            handleVariantItemChange(
                                                                index,
                                                                'stock',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="w-20"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                إجمالي المتغيرات: {variantItems.length}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
