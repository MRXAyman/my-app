'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface DashboardStats {
    pendingOrdersCount: number
    todayRevenue: number
    todayOrdersCount: number
    totalProducts: number
    lowStockProducts: number
    totalOrders: number
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats>({
        pendingOrdersCount: 0,
        todayRevenue: 0,
        todayOrdersCount: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        totalOrders: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        async function fetchStats() {
            setLoading(true)
            setError(null)

            try {
                // Get today's date range
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const todayISO = today.toISOString()

                // Fetch pending orders count
                const { count: pendingCount } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending')

                // Fetch today's orders for revenue calculation
                const { data: todayOrders } = await supabase
                    .from('orders')
                    .select('total_amount, shipping_cost')
                    .gte('created_at', todayISO)

                // Calculate today's revenue
                const todayRevenue = todayOrders?.reduce((sum, order) => {
                    return sum + (order.total_amount || 0)
                }, 0) || 0

                // Fetch total products count
                const { count: productsCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })

                // Fetch low stock products (stock < 10)
                const { count: lowStockCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .lt('stock_quantity', 10)
                    .gt('stock_quantity', 0)

                // Fetch total orders count
                const { count: totalOrdersCount } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })

                setStats({
                    pendingOrdersCount: pendingCount || 0,
                    todayRevenue: todayRevenue,
                    todayOrdersCount: todayOrders?.length || 0,
                    totalProducts: productsCount || 0,
                    lowStockProducts: lowStockCount || 0,
                    totalOrders: totalOrdersCount || 0
                })
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch stats')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()

        // Set up real-time subscription for orders
        const ordersChannel = supabase
            .channel('orders-stats-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders'
                },
                () => {
                    fetchStats()
                }
            )
            .subscribe()

        // Set up real-time subscription for products
        const productsChannel = supabase
            .channel('products-stats-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'products'
                },
                () => {
                    fetchStats()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(ordersChannel)
            supabase.removeChannel(productsChannel)
        }
    }, [])

    return { stats, loading, error }
}
