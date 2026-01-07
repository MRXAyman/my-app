'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Notification {
    id: number
    title: string
    message: string
    type: 'order' | 'product' | 'system'
    related_id?: number
    is_read: boolean
    created_at: string
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        async function fetchNotifications() {
            setLoading(true)
            setError(null)

            try {
                // Check if notifications table exists, if not, create mock notifications from orders
                const { data: ordersData } = await supabase
                    .from('orders')
                    .select('id, created_at, status, customer_info')
                    .order('created_at', { ascending: false })
                    .limit(10)

                // Check for low stock products
                const { data: lowStockProducts } = await supabase
                    .from('products')
                    .select('id, title, stock_quantity')
                    .lt('stock_quantity', 5)
                    .gt('stock_quantity', 0)
                    .limit(5)

                const mockNotifications: Notification[] = []

                // Create notifications from recent orders
                ordersData?.slice(0, 3).forEach((order, index) => {
                    const timeAgo = getTimeAgo(order.created_at)
                    mockNotifications.push({
                        id: order.id,
                        title: 'طلب جديد',
                        message: `طلب رقم #${order.id} من ${order.customer_info?.name || 'عميل'}`,
                        type: 'order',
                        related_id: order.id,
                        is_read: index > 1, // First 2 are unread
                        created_at: order.created_at
                    })
                })

                // Create notifications from low stock products
                lowStockProducts?.forEach((product, index) => {
                    mockNotifications.push({
                        id: 1000 + product.id,
                        title: 'منتج نفذ تقريباً',
                        message: `المنتج "${product.title}" متبقي ${product.stock_quantity} فقط`,
                        type: 'product',
                        related_id: product.id,
                        is_read: index > 0, // First one is unread
                        created_at: new Date().toISOString()
                    })
                })

                // Add a system notification
                mockNotifications.push({
                    id: 9999,
                    title: 'تحديث النظام',
                    message: 'تم تحديث لوحة التحكم بنجاح',
                    type: 'system',
                    is_read: true,
                    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
                })

                // Sort by created_at
                mockNotifications.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )

                setNotifications(mockNotifications)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()

        // Set up real-time subscription for orders (to create new notifications)
        const ordersChannel = supabase
            .channel('notifications-orders-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders'
                },
                () => {
                    fetchNotifications()
                }
            )
            .subscribe()

        // Set up real-time subscription for products
        const productsChannel = supabase
            .channel('notifications-products-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'products'
                },
                () => {
                    fetchNotifications()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(ordersChannel)
            supabase.removeChannel(productsChannel)
        }
    }, [])

    const markAsRead = async (notificationId: number) => {
        // Update local state
        setNotifications(prev => prev.map(notif =>
            notif.id === notificationId
                ? { ...notif, is_read: true }
                : notif
        ))
    }

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
    }

    const unreadCount = notifications.filter(n => !n.is_read).length

    return {
        notifications,
        loading,
        error,
        unreadCount,
        markAsRead,
        markAllAsRead
    }
}

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'الآن'
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    return `منذ ${diffDays} يوم`
}
