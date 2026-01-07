'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Order {
    id: number
    created_at: string
    customer_info: {
        name: string
        phone: string
        address: string
        wilaya: string
        commune: string
    }
    items: Array<{
        product_id: number
        quantity: number
        price: number
        title: string
        image?: string
    }>
    total_amount: number
    shipping_cost: number
    delivery_type: string
    status: string
    call_attempts?: number
    call_notes?: string
    shipping_company?: string
    delivery_location?: string
    notes?: string
    last_status_update?: string
}

interface UseOrdersOptions {
    status?: string
    wilaya?: string
    shippingCompany?: string
    deliveryLocation?: string
    dateFrom?: string
    dateTo?: string
    searchQuery?: string
}

export function useOrders(options: UseOrdersOptions = {}) {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        async function fetchOrders() {
            setLoading(true)
            setError(null)

            let query = supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            // Apply filters
            if (options.status) {
                query = query.eq('status', options.status)
            }

            if (options.wilaya) {
                query = query.eq('customer_info->>wilaya', options.wilaya)
            }

            if (options.shippingCompany) {
                query = query.eq('shipping_company', options.shippingCompany)
            }

            if (options.deliveryLocation) {
                query = query.eq('delivery_location', options.deliveryLocation)
            }

            if (options.dateFrom) {
                query = query.gte('created_at', options.dateFrom)
            }

            if (options.dateTo) {
                query = query.lte('created_at', options.dateTo)
            }

            if (options.searchQuery) {
                query = query.or(`id.eq.${options.searchQuery},customer_info->>phone.ilike.%${options.searchQuery}%,customer_info->>name.ilike.%${options.searchQuery}%`)
            }

            const { data, error: fetchError } = await query

            if (fetchError) {
                setError(fetchError.message)
                setOrders([])
            } else {
                setOrders(data as Order[])
            }

            setLoading(false)
        }

        fetchOrders()

        // Set up real-time subscription
        const channel = supabase
            .channel('orders-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders'
                },
                () => {
                    // Refetch orders when changes occur
                    fetchOrders()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [options.status, options.wilaya, options.shippingCompany, options.deliveryLocation, options.dateFrom, options.dateTo, options.searchQuery])

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        const supabase = createClient()

        const { error } = await supabase
            .from('orders')
            .update({
                status: newStatus,
                last_status_update: new Date().toISOString()
            })
            .eq('id', orderId)

        if (error) {
            throw new Error(error.message)
        }

        // Optimistic update
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus, last_status_update: new Date().toISOString() }
                : order
        ))
    }

    const addCallAttempt = async (orderId: number, notes: string) => {
        const supabase = createClient()

        const order = orders.find(o => o.id === orderId)
        if (!order) return

        const newAttempts = (order.call_attempts || 0) + 1
        const existingNotes = order.call_notes || ''
        const timestamp = new Date().toLocaleString('ar-DZ')
        const updatedNotes = existingNotes
            ? `${existingNotes}\n\n[${timestamp}] محاولة ${newAttempts}: ${notes}`
            : `[${timestamp}] محاولة ${newAttempts}: ${notes}`

        const { error } = await supabase
            .from('orders')
            .update({
                call_attempts: newAttempts,
                call_notes: updatedNotes,
                last_status_update: new Date().toISOString()
            })
            .eq('id', orderId)

        if (error) {
            throw new Error(error.message)
        }

        // Optimistic update
        setOrders(prev => prev.map(o =>
            o.id === orderId
                ? { ...o, call_attempts: newAttempts, call_notes: updatedNotes }
                : o
        ))
    }

    const updateOrderNotes = async (orderId: number, notes: string) => {
        const supabase = createClient()

        const { error } = await supabase
            .from('orders')
            .update({ notes })
            .eq('id', orderId)

        if (error) {
            throw new Error(error.message)
        }

        // Optimistic update
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, notes }
                : order
        ))
    }

    return {
        orders,
        loading,
        error,
        updateOrderStatus,
        addCallAttempt,
        updateOrderNotes
    }
}
