import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, MapPin } from "lucide-react"

export function RecentOrders({ orders }: { orders: any[] }) {
    if (!orders?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">لا توجد طلبات حديثة</p>
                <p className="text-xs text-muted-foreground mt-1">ستظهر الطلبات الجديدة هنا</p>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        }
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const getStatusText = (status: string) => {
        const texts = {
            pending: 'قيد الانتظار',
            confirmed: 'مؤكد',
            shipped: 'قيد الشحن',
            delivered: 'تم التوصيل',
            cancelled: 'ملغي',
        }
        return texts[status as keyof typeof texts] || status
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-white group cursor-pointer"
                >
                    <Avatar className="h-12 w-12 ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold">
                            {order.customer_info?.name?.substring(0, 2).toUpperCase() || 'NA'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900">
                                {order.customer_info?.name || 'غير محدد'}
                            </p>
                            <Badge
                                variant="outline"
                                className={`text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                                {getStatusText(order.status)}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                #{String(order.id).substring(0, 8)}
                            </span>
                            {order.customer_info?.wilaya && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {order.customer_info.wilaya}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(order.created_at).toLocaleDateString('ar-DZ', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-lg font-bold text-gray-900">{order.total_amount} د.ج</p>
                        <p className="text-xs text-muted-foreground">المبلغ الإجمالي</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
