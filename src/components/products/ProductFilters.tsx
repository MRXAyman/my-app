"use client"

import { Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useMemo } from "react"

interface Category {
    id: number
    name: string
    slug: string
}

interface ProductFiltersProps {
    categories: Category[]
    selectedCategories: number[]
    onCategoryChange: (categories: number[]) => void
    priceRange: { min: number; max: number }
    onPriceRangeChange: (range: { min: number; max: number }) => void
    productPriceRange: { min: number; max: number }
    showInStockOnly: boolean
    onStockFilterChange: (show: boolean) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    onClearFilters: () => void
    hasActiveFilters: boolean
    showFilters: boolean
    onToggleFilters: () => void
}

export function ProductFilters({
    categories,
    selectedCategories,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    productPriceRange,
    showInStockOnly,
    onStockFilterChange,
    searchQuery,
    onSearchChange,
    onClearFilters,
    hasActiveFilters,
    showFilters,
    onToggleFilters,
}: ProductFiltersProps) {
    const [localMinPrice, setLocalMinPrice] = useState(priceRange.min.toString())
    const [localMaxPrice, setLocalMaxPrice] = useState(priceRange.max.toString())

    // Update local state when parent state changes (e.g., when filters are cleared)
    useEffect(() => {
        setLocalMinPrice(priceRange.min.toString())
    }, [priceRange.min])

    useEffect(() => {
        setLocalMaxPrice(priceRange.max.toString())
    }, [priceRange.max])

    const handleCategoryToggle = (categoryId: number) => {
        if (selectedCategories.includes(categoryId)) {
            onCategoryChange(selectedCategories.filter(id => id !== categoryId))
        } else {
            onCategoryChange([...selectedCategories, categoryId])
        }
    }

    const handleMinPriceBlur = () => {
        const numValue = parseInt(localMinPrice) || productPriceRange.min
        const validValue = Math.max(productPriceRange.min, Math.min(numValue, priceRange.max))
        setLocalMinPrice(validValue.toString())
        onPriceRangeChange({ min: validValue, max: priceRange.max })
    }

    const handleMaxPriceBlur = () => {
        const numValue = parseInt(localMaxPrice) || productPriceRange.max
        const validValue = Math.min(productPriceRange.max, Math.max(numValue, priceRange.min))
        setLocalMaxPrice(validValue.toString())
        onPriceRangeChange({ min: priceRange.min, max: validValue })
    }

    const FiltersContent = useMemo(() => (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <Label className="text-base font-bold mb-3 block">البحث</Label>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="ابحث عن منتج..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pr-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
                <div>
                    <Label className="text-base font-bold mb-3 block">الفئات</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={`category-${category.id}`}
                                    checked={selectedCategories.includes(category.id)}
                                    onCheckedChange={() => handleCategoryToggle(category.id)}
                                />
                                <Label
                                    htmlFor={`category-${category.id}`}
                                    className="text-sm font-normal cursor-pointer flex-1"
                                >
                                    {category.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Range */}
            <div>
                <Label className="text-base font-bold mb-3 block">نطاق السعر</Label>
                <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                        <div className="flex-1">
                            <Label htmlFor="min-price" className="text-xs text-gray-600 mb-1 block">
                                من
                            </Label>
                            <Input
                                id="min-price"
                                type="number"
                                value={localMinPrice}
                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                onBlur={handleMinPriceBlur}
                                min={productPriceRange.min}
                                max={productPriceRange.max}
                                className="text-sm"
                            />
                        </div>
                        <span className="text-gray-400 mt-5">-</span>
                        <div className="flex-1">
                            <Label htmlFor="max-price" className="text-xs text-gray-600 mb-1 block">
                                إلى
                            </Label>
                            <Input
                                id="max-price"
                                type="number"
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                onBlur={handleMaxPriceBlur}
                                min={productPriceRange.min}
                                max={productPriceRange.max}
                                className="text-sm"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {priceRange.min.toLocaleString()} د.ج - {priceRange.max.toLocaleString()} د.ج
                    </p>
                </div>
            </div>

            {/* Stock Filter */}
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="stock-filter" className="text-base font-bold cursor-pointer">
                        المتوفر فقط
                    </Label>
                    <Switch
                        id="stock-filter"
                        checked={showInStockOnly}
                        onCheckedChange={onStockFilterChange}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    إظهار المنتجات المتوفرة في المخزون فقط
                </p>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                    <X className="ml-2 h-4 w-4" />
                    مسح جميع الفلاتر
                </Button>
            )}
        </div>
    ), [
        searchQuery,
        onSearchChange,
        categories,
        selectedCategories,
        handleCategoryToggle,
        localMinPrice,
        localMaxPrice,
        handleMinPriceBlur,
        handleMaxPriceBlur,
        productPriceRange,
        priceRange,
        showInStockOnly,
        onStockFilterChange,
        hasActiveFilters,
        onClearFilters
    ])

    return (
        <>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <Button
                    variant="outline"
                    onClick={onToggleFilters}
                    className="w-full"
                >
                    <SlidersHorizontal className="ml-2 h-4 w-4" />
                    الفلاتر
                    {hasActiveFilters && (
                        <span className="mr-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                            نشط
                        </span>
                    )}
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <Card className="hidden lg:block w-80 p-6 h-fit sticky top-4 border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        الفلاتر
                    </h2>
                </div>
                {FiltersContent}
            </Card>

            {/* Mobile Drawer */}
            {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={onToggleFilters}>
                    <Card
                        className="absolute top-0 right-0 h-full w-80 max-w-[85vw] p-6 rounded-none overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                الفلاتر
                            </h2>
                            <button
                                onClick={onToggleFilters}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {FiltersContent}
                    </Card>
                </div>
            )}
        </>
    )
}
