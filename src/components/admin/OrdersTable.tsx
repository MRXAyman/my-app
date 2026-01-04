'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type Order = {
    id: number
    created_at: string
    customer_info: {
        name: string
        phone: string
        wilaya: string
        commune: string
    }
    total_amount: number
    status: string
    items: any[]
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
}

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState(initialOrders)

    const updateStatus = async (orderId: number, newStatus: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (error) {
            alert('فشل تحديث الحالة')
            console.error(error)
        } else {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        }
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-right">رقم الطلب</TableHead>
                        <TableHead className="text-right">العميل</TableHead>
                        <TableHead className="text-right">الهاتف</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">العنوان</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{order.customer_info?.name}</TableCell>
                            <TableCell dir="ltr" className="text-right">{order.customer_info?.phone}</TableCell>
                            <TableCell>{order.total_amount} د.ج</TableCell>
                            <TableCell className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {order.customer_info?.wilaya} - {order.customer_info?.commune}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Select defaultValue={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                                        <SelectTrigger className={`w-[130px] h-8 ${statusColors[order.status] || ""}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">قيد الانتظار</SelectItem>
                                            <SelectItem value="confirmed">تم التأكيد</SelectItem>
                                            <SelectItem value="shipped">تم الشحن</SelectItem>
                                            <SelectItem value="delivered">تم التوصيل</SelectItem>
                                            <SelectItem value="cancelled">ملغى</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
