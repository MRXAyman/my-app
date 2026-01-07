'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Product {
    id: number
    title: string
    description?: string
    price: number
    sale_price?: number
    stock_quantity: number
    category_id?: number
    images?: string[]
    created_at: string
    updated_at?: string
}

interface UseProductsOptions {
    categoryId?: number
    searchQuery?: string
    lowStock?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        async function fetchProducts() {
            setLoading(true)
            setError(null)

            try {
                let query = supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false })

                // Apply filters
                if (options.categoryId) {
                    query = query.eq('category_id', options.categoryId)
                }

                if (options.searchQuery) {
                    query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`)
                }

                if (options.lowStock) {
                    query = query.lt('stock_quantity', 10)
                }

                const { data, error: fetchError } = await query

                if (fetchError) {
                    setError(fetchError.message)
                    setProducts([])
                } else {
                    setProducts(data as Product[])
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch products')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()

        // Set up real-time subscription
        const channel = supabase
            .channel('products-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'products'
                },
                () => {
                    fetchProducts()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [options.categoryId, options.searchQuery, options.lowStock])

    return {
        products,
        loading,
        error
    }
}
