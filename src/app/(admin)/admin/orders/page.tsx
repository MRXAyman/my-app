'use client'

import { useState } from 'react'
import { useOrders, Order } from '@/hooks/use-orders'
import { calculateOrderStats } from '@/lib/order-utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { AdminSearch } from "@/components/admin/AdminSearch"
import { OrderKPICards } from "@/components/admin/OrderKPICards"
import { OrderDetailsDialog } from "@/components/admin/OrderDetailsDialog"
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater"
import { OrderFilters } from "@/components/admin/OrderFilters"
import { DuplicateOrderAlert } from "@/components/admin/DuplicateOrderAlert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Eye,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck as TruckIcon,
    Download,
    Phone,
    PhoneOff,
    Printer
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'

export default function AdminOrdersPage() {
    const searchParams = useSearchParams()
    const statusFilter = searchParams?.get('status') || ''

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [filters, setFilters] = useState({})

    const { orders, loading, updateOrderStatus, updateOrderNotes } = useOrders({
        status: statusFilter,
        searchQuery,
        ...filters
    })

    const stats = calculateOrderStats(orders)

    const statusTabs = [
        { label: 'الكل', value: '', count: stats.total, icon: Package, color: 'gray' },
        { label: 'قيد الانتظار', value: 'pending', count: stats.pending, icon: Clock, color: 'orange' },
        { label: 'لم يرد 1', value: 'no_answer_1', count: stats.noAnswer1, icon: PhoneOff, color: 'yellow' },
        { label: 'لم يرد 2', value: 'no_answer_2', count: stats.noAnswer2, icon: PhoneOff, color: 'yellow' },
        { label: 'لم يرد 3', value: 'no_answer_3', count: stats.noAnswer3, icon: PhoneOff, color: 'amber' },
        { label: 'مؤكد', value: 'confirmed', count: stats.confirmed, icon: CheckCircle, color: 'green' },
        { label: 'قيد الشحن', value: 'shipped', count: stats.shipped, icon: TruckIcon, color: 'purple' },
        { label: 'تم التوصيل', value: 'delivered', count: stats.delivered, icon: CheckCircle, color: 'emerald' },
        { label: 'مسترجع', value: 'returned', count: stats.returned, icon: XCircle, color: 'gray' },
        { label: 'ملغى', value: 'cancelled', count: stats.cancelled, icon: XCircle, color: 'red' },
    ]

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order)
        setDialogOpen(true)
    }

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`
    }

    const handleExport = () => {
        // Convert orders to CSV
        const headers = ['رقم الطلب', 'العميل', 'الهاتف', 'الولاية', 'المبلغ', 'الحالة', 'التاريخ']
        const rows = orders.map(order => [
            order.id,
            order.customer_info?.name || '',
            order.customer_info?.phone || '',
            order.customer_info?.wilaya || '',
            order.total_amount,
            order.status,
            new Date(order.created_at).toLocaleDateString('ar-DZ')
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        إدارة الطلبات
                    </h2>
                    <p className="text-muted-foreground mt-1">نظام متقدم لإدارة الطلبات والمتابعة</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    تصدير
                </Button>
            </div>

            {/* KPI Cards */}
            <OrderKPICards orders={orders} />

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {statusTabs.map((tab) => (
                    <Link key={tab.value} href={`/admin/orders${tab.value ? `?status=${tab.value}` : ''}`}>
                        <Button
                            variant={statusFilter === tab.value || (!statusFilter && tab.value === '') ? "default" : "outline"}
                            className={`gap-2 whitespace-nowrap ${statusFilter === tab.value || (!statusFilter && tab.value === '')
                                    ? 'bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25'
                                    : ''
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                            <Badge
                                variant="secondary"
                                className={`${statusFilter === tab.value || (!statusFilter && tab.value === '')
                                        ? 'bg-white/20 text-white border-white/30'
                                        : 'bg-gray-100'
                                    }`}
                            >
                                {tab.count}
                            </Badge>
                        </Button>
                    </Link>
                ))}
            </div>

            {/* Filters */}
            <OrderFilters onFilterChange={setFilters} />

            {/* Search Bar */}
            <Card className="p-4 border-0 shadow-sm">
                <input
                    type="text"
                    placeholder="بحث برقم الطلب، الهاتف، أو اسم العميل..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </Card>

            {/* Orders Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-gray-50 to-white hover:from-gray-50 hover:to-white">
                                    <TableHead className="text-right">رقم الطلب</TableHead>
                                    <TableHead className="text-right">العميل</TableHead>
                                    <TableHead className="text-right">الهاتف</TableHead>
                                    <TableHead className="text-right">الولاية</TableHead>
                                    <TableHead className="text-right">المبلغ</TableHead>
                                    <TableHead className="text-right">الحالة</TableHead>
                                    <TableHead className="text-right">تحديث الحالة</TableHead>
                                    <TableHead className="text-right">التاريخ</TableHead>
                                    <TableHead className="text-right w-[150px]">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {searchQuery || Object.keys(filters).length > 0 ? 'لا توجد نتائج مطابقة' : 'لا توجد طلبات'}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    ستظهر الطلبات الجديدة هنا
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {orders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <TableCell className="font-mono font-medium">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                        <Package className="h-4 w-4 text-primary" />
                                                    </div>
                                                    #{String(order.id).substring(0, 8)}
                                                </div>
                                                {/* Duplicate Alert */}
                                                <DuplicateOrderAlert order={order} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {order.customer_info?.name || '-'}
                                        </TableCell>
                                        <TableCell dir="ltr" className="text-right font-mono text-sm">
                                            {order.customer_info?.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-gray-50">
                                                {order.customer_info?.wilaya || '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-gray-900">
                                            {order.total_amount?.toLocaleString()} د.ج
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={order.status} type="order" />
                                        </TableCell>
                                        <TableCell>
                                            <OrderStatusUpdater
                                                currentStatus={order.status}
                                                orderId={order.id}
                                                onStatusUpdate={updateOrderStatus}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString('ar-DZ', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(order)}
                                                    className="h-8 gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    عرض
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCall(order.customer_info?.phone || '')}
                                                    className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>

            {/* Order Details Dialog */}
            <OrderDetailsDialog
                order={selectedOrder}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onUpdateNotes={updateOrderNotes}
            />
        </div>
    )
}
