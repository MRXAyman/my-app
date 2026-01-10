"use client"

import { useState, useMemo } from "react"
import { ProductFilters } from "./ProductFilters"
import { ProductSort } from "./ProductSort"
import { ProductsGrid } from "./ProductsGrid"

interface Product {
    id: number
    title: string
    slug: string
    price: number
    sale_price?: number
    images: string[]
    in_stock: boolean
    category_id: number
    stock: number
}

interface Category {
    id: number
    name: string
    slug: string
}

interface ProductsPageClientProps {
    initialProducts: Product[]
    categories: Category[]
}

export function ProductsPageClient({ initialProducts, categories }: ProductsPageClientProps) {
    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 })
    const [showInStockOnly, setShowInStockOnly] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Sort state
    const [sortBy, setSortBy] = useState<string>("newest")

    // Mobile filter visibility
    const [showFilters, setShowFilters] = useState(false)

    // Calculate price range from products
    const productPriceRange = useMemo(() => {
        if (initialProducts.length === 0) return { min: 0, max: 100000 }

        const prices = initialProducts.map(p => p.sale_price || p.price)
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        }
    }, [initialProducts])

    // Filter products
    const filteredProducts = useMemo(() => {
        let filtered = [...initialProducts]

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category_id))
        }

        // Price range filter
        filtered = filtered.filter(p => {
            const price = p.sale_price || p.price
            return price >= priceRange.min && price <= priceRange.max
        })

        // Stock filter
        if (showInStockOnly) {
            filtered = filtered.filter(p => p.in_stock)
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query)
            )
        }

        return filtered
    }, [initialProducts, selectedCategories, priceRange, showInStockOnly, searchQuery])

    // Sort products
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts]

        switch (sortBy) {
            case "price-asc":
                return sorted.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
            case "price-desc":
                return sorted.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
            case "name-asc":
                return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ar'))
            case "name-desc":
                return sorted.sort((a, b) => b.title.localeCompare(a.title, 'ar'))
            case "newest":
            default:
                return sorted
        }
    }, [filteredProducts, sortBy])

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange(productPriceRange)
        setShowInStockOnly(false)
        setSearchQuery("")
    }

    const hasActiveFilters = selectedCategories.length > 0 ||
        priceRange.min !== productPriceRange.min ||
        priceRange.max !== productPriceRange.max ||
        showInStockOnly ||
        searchQuery.trim() !== ""

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <ProductFilters
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    productPriceRange={productPriceRange}
                    showInStockOnly={showInStockOnly}
                    onStockFilterChange={setShowInStockOnly}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Sort and Results Count */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <p className="text-gray-600">
                                <span className="font-bold text-gray-900">{sortedProducts.length}</span> منتج
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    مسح الفلاتر
                                </button>
                            )}
                        </div>
                        <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                    </div>

                    {/* Products Grid */}
                    <ProductsGrid products={sortedProducts} />
                </div>
            </div>
        </div>
    )
}
