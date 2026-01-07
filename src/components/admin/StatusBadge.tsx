import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
    status: string | boolean | null
    type?: 'order' | 'product'
}

export function StatusBadge({ status, type = 'product' }: StatusBadgeProps) {
    if (type === 'product') {
        return status === 'in_stock' || status === 'true' || status === true ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-none">
                متوفر
            </Badge>
        ) : (
            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 shadow-none">
                نفذت الكمية
            </Badge>
        )
    }

    // Order status
    switch (status) {
        case 'new':
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 shadow-none">جديد</Badge>
        case 'confirmed':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-none">مؤكد</Badge>
        case 'shipping':
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 shadow-none">قيد التوصيل</Badge>
        case 'delivered':
            return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200 shadow-none">تم التسليم</Badge>
        case 'cancelled':
            return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 shadow-none">ملغى</Badge>
        case 'returned':
            return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 shadow-none">مرتجع</Badge>
        default:
            return <Badge variant="outline">{String(status || 'غير معروف')}</Badge>
    }
}
