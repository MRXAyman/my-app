'use client'

import { Order } from '@/hooks/use-orders'
import { calculateDeliveryRate, calculateNetProfit, getTopWilayas } from '@/lib/order-utils'
import { Card } from '@/components/ui/card'
import { TrendingUp, DollarSign, MapPin, Package } from 'lucide-react'

interface OrderKPICardsProps {
    orders: Order[]
}

export function OrderKPICards({ orders }: OrderKPICardsProps) {
    const deliveryRate = calculateDeliveryRate(orders)
    const netProfit = calculateNetProfit(orders)
    const topWilayas = getTopWilayas(orders, 3)
    const totalOrders = orders.length

    const kpis = [
        {
            title: 'إجمالي الطلبات',
            value: totalOrders.toLocaleString(),
            icon: Package,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'نسبة التوصيل',
            value: `${deliveryRate}%`,
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'الأرباح الصافية',
            value: `${netProfit.toLocaleString()} د.ج`,
            icon: DollarSign,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            title: 'أفضل ولاية',
            value: topWilayas[0]?.wilaya || 'لا توجد بيانات',
            subtitle: topWilayas[0] ? `${topWilayas[0].count} طلب` : '',
            icon: MapPin,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, index) => (
                <Card
                    key={index}
                    className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    {kpi.title}
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {kpi.value}
                                </h3>
                                {kpi.subtitle && (
                                    <p className="text-xs text-muted-foreground">
                                        {kpi.subtitle}
                                    </p>
                                )}
                            </div>
                            <div className={`h-12 w-12 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                                <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
                            </div>
                        </div>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
                </Card>
            ))}
        </div>
    )
}
