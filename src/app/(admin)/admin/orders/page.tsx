import { createClient } from "@/utils/supabase/server"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, Package, Clock, CheckCircle, XCircle, Truck as TruckIcon, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string; status?: string }>
}) {
    const supabase = await createClient()
    const params = await searchParams
    const query = params.q
    const statusFilter = params.status

    let ordersQuery = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (query) {
        ordersQuery = ordersQuery.or(`id.eq.${query},customer_info->>phone.ilike.%${query}%`)
    }

    if (statusFilter) {
        ordersQuery = ordersQuery.eq('status', statusFilter)
    }

    const { data: orders, error } = await ordersQuery

    // Get counts for each status
    const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    const { count: confirmedCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'confirmed')
    const { count: shippedCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'shipped')
    const { count: deliveredCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered')
    const { count: cancelledCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled')

    const statusTabs = [
        { label: 'الكل', value: '', count: orders?.length || 0, icon: Package },
        { label: 'قيد الانتظار', value: 'pending', count: pendingCount || 0, icon: Clock, color: 'orange' },
        { label: 'مؤكد', value: 'confirmed', count: confirmedCount || 0, icon: CheckCircle, color: 'blue' },
        { label: 'قيد الشحن', value: 'shipped', count: shippedCount || 0, icon: TruckIcon, color: 'purple' },
        { label: 'تم التوصيل', value: 'delivered', count: deliveredCount || 0, icon: CheckCircle, color: 'green' },
        { label: 'ملغي', value: 'cancelled', count: cancelledCount || 0, icon: XCircle, color: 'red' },
    ]

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        إدارة الطلبات
                    </h2>
                    <p className="text-muted-foreground mt-1">عرض وإدارة جميع الطلبات</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                </Button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
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

            {/* Search Bar */}
            <Card className="p-4 border-0 shadow-sm">
                <AdminSearch placeholder="بحث برقم الطلب أو الهاتف..." />
            </Card>

            {/* Orders Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-white hover:from-gray-50 hover:to-white">
                            <TableHead className="text-right">رقم الطلب</TableHead>
                            <TableHead className="text-right">العميل</TableHead>
                            <TableHead className="text-right">الهاتف</TableHead>
                            <TableHead className="text-right">الولاية</TableHead>
                            <TableHead className="text-right">المبلغ</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">التاريخ</TableHead>
                            <TableHead className="text-right w-[50px]"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Package className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {query ? 'لا توجد نتائج بحث مطابقة' : 'لا توجد طلبات'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            ستظهر الطلبات الجديدة هنا
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {orders?.map((order) => (
                            <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <TableCell className="font-mono font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                            <Package className="h-4 w-4 text-primary" />
                                        </div>
                                        #{String(order.id).substring(0, 8)}
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
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString('ar-DZ', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Eye className="ml-2 h-4 w-4" />
                                                عرض التفاصيل
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <CheckCircle className="ml-2 h-4 w-4" />
                                                تأكيد الطلب
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <TruckIcon className="ml-2 h-4 w-4" />
                                                تحديث الحالة
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                                <XCircle className="ml-2 h-4 w-4" />
                                                إلغاء الطلب
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
