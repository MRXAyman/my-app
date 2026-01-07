import { Order } from '@/hooks/use-orders'

/**
 * Detect duplicate orders based on phone number within a time window
 */
export async function detectDuplicateOrders(
    phoneNumber: string,
    currentOrderId: number,
    hoursWindow: number = 24
): Promise<Order[]> {
    const { createClient } = await import('@/utils/supabase/client')
    const supabase = createClient()

    const timeThreshold = new Date()
    timeThreshold.setHours(timeThreshold.getHours() - hoursWindow)

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_info->>phone', phoneNumber)
        .neq('id', currentOrderId)
        .gte('created_at', timeThreshold.toISOString())
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error detecting duplicates:', error)
        return []
    }

    return data as Order[]
}

/**
 * Calculate delivery success rate
 */
export function calculateDeliveryRate(orders: Order[]): number {
    if (orders.length === 0) return 0

    const deliveredOrders = orders.filter(
        order => order.status === 'delivered'
    ).length

    const completedOrders = orders.filter(
        order => ['delivered', 'returned', 'cancelled'].includes(order.status)
    ).length

    if (completedOrders === 0) return 0

    return Math.round((deliveredOrders / completedOrders) * 100)
}

/**
 * Get top performing wilayas
 */
export function getTopWilayas(orders: Order[], limit: number = 5): Array<{
    wilaya: string
    count: number
    revenue: number
}> {
    const wilayaStats = new Map<string, { count: number; revenue: number }>()

    orders
        .filter(order => order.status === 'delivered')
        .forEach(order => {
            const wilaya = order.customer_info?.wilaya || 'Unknown'
            const existing = wilayaStats.get(wilaya) || { count: 0, revenue: 0 }

            wilayaStats.set(wilaya, {
                count: existing.count + 1,
                revenue: existing.revenue + (order.total_amount || 0)
            })
        })

    return Array.from(wilayaStats.entries())
        .map(([wilaya, stats]) => ({ wilaya, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit)
}

/**
 * Calculate net profit from delivered orders
 */
export function calculateNetProfit(orders: Order[]): number {
    return orders
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + (order.total_amount || 0), 0)
}

/**
 * Format order data for invoice printing
 */
export function formatOrderForInvoice(order: Order) {
    return {
        orderId: `#${String(order.id).padStart(8, '0')}`,
        date: new Date(order.created_at).toLocaleDateString('ar-DZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        customer: {
            name: order.customer_info?.name || '',
            phone: order.customer_info?.phone || '',
            address: order.customer_info?.address || '',
            wilaya: order.customer_info?.wilaya || '',
            commune: order.customer_info?.commune || ''
        },
        items: order.items || [],
        subtotal: (order.total_amount || 0) - (order.shipping_cost || 0),
        shipping: order.shipping_cost || 0,
        total: order.total_amount || 0,
        deliveryType: order.delivery_type === 'home' ? 'توصيل للمنزل' : 'توصيل للمكتب',
        shippingCompany: order.shipping_company || 'غير محدد'
    }
}

/**
 * Get order status label in Arabic
 */
export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        'pending': 'قيد الانتظار',
        'no_answer_1': 'لم يرد على الإتصال 1',
        'no_answer_2': 'لم يرد على الإتصال 2',
        'no_answer_3': 'لم يرد على الإتصال 3',
        'confirmed': 'تم التأكيد',
        'shipped': 'قيد الشحن',
        'delivered': 'تم التوصيل',
        'returned': 'مسترجع',
        'cancelled': 'ملغى'
    }

    return labels[status] || status
}

/**
 * Calculate order statistics
 */
export function calculateOrderStats(orders: Order[]) {
    const total = orders.length
    const pending = orders.filter(o => o.status === 'pending').length
    const confirmed = orders.filter(o => o.status === 'confirmed').length
    const shipped = orders.filter(o => o.status === 'shipped').length
    const delivered = orders.filter(o => o.status === 'delivered').length
    const returned = orders.filter(o => o.status === 'returned').length
    const cancelled = orders.filter(o => o.status === 'cancelled').length
    const noAnswer1 = orders.filter(o => o.status === 'no_answer_1').length
    const noAnswer2 = orders.filter(o => o.status === 'no_answer_2').length
    const noAnswer3 = orders.filter(o => o.status === 'no_answer_3').length

    const totalRevenue = calculateNetProfit(orders)
    const deliveryRate = calculateDeliveryRate(orders)

    return {
        total,
        pending,
        confirmed,
        shipped,
        delivered,
        returned,
        cancelled,
        noAnswer1,
        noAnswer2,
        noAnswer3,
        totalRevenue,
        deliveryRate
    }
}
