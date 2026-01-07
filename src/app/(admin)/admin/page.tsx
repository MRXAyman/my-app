import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, DollarSign, Users, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { DashboardCharts } from "@/components/admin/DashboardCharts"
import { RecentOrders } from "@/components/admin/RecentOrders"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch quick stats
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
    const { count: pendingOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    const { count: confirmedOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'confirmed')
    const { count: deliveredOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered')

    // Calculate total revenue from delivered orders
    const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'delivered')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    // Fetch latest 5 orders for recent orders list
    const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    // Fetch data for charts - Monthly Revenue (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: monthlyOrdersData } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .eq('status', 'delivered')
        .gte('created_at', sixMonthsAgo.toISOString())

    // Group by month and calculate totals
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    const monthlyRevenueMap = new Map<string, number>()

    monthlyOrdersData?.forEach(order => {
        const date = new Date(order.created_at)
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`
        const monthName = monthNames[date.getMonth()]
        const current = monthlyRevenueMap.get(monthKey) || 0
        monthlyRevenueMap.set(monthKey, current + (order.total_amount || 0))
    })

    // Convert to array format for charts
    const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-6) // Get last 6 months
        .map(([key, total]) => {
            const [year, month] = key.split('-')
            return {
                name: monthNames[parseInt(month)],
                total: Math.round(total)
            }
        })

    // Fetch data for daily sales (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: dailyOrdersData } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())

    // Group by day
    const dailySalesMap = new Map<string, number>()

    dailyOrdersData?.forEach(order => {
        const date = new Date(order.created_at)
        const dayKey = date.toISOString().split('T')[0]
        const current = dailySalesMap.get(dayKey) || 0
        dailySalesMap.set(dayKey, current + (order.total_amount || 0))
    })

    // Convert to array format for charts
    const dailySales = Array.from(dailySalesMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([dateStr, total]) => {
            const date = new Date(dateStr)
            const day = date.getDate()
            const month = monthNames[date.getMonth()]
            return {
                name: `${day} ${month}`,
                total: Math.round(total)
            }
        })

    // Ensure we have at least some data for the charts
    const defaultMonthlyRevenue = monthlyRevenue.length > 0 ? monthlyRevenue :
        monthNames.slice(0, 6).map(name => ({ name, total: 0 }))

    const defaultDailySales = dailySales.length > 0 ? dailySales :
        Array.from({ length: 7 }, (_, i) => ({ name: `${i + 1}`, total: 0 }))

    const stats = [
        {
            title: 'إجمالي الإيرادات',
            value: `${totalRevenue.toLocaleString()} د.ج`,
            change: '+20.1%',
            changeType: 'positive',
            icon: DollarSign,
            gradient: 'from-green-500 to-emerald-600',
            bgGradient: 'from-green-50 to-emerald-50',
            description: 'من الشهر الماضي'
        },
        {
            title: 'الطلبات',
            value: `+${ordersCount || 0}`,
            change: '+12%',
            changeType: 'positive',
            icon: ShoppingCart,
            gradient: 'from-blue-500 to-cyan-600',
            bgGradient: 'from-blue-50 to-cyan-50',
            description: 'نشاط مرتفع'
        },
        {
            title: 'قيد الانتظار',
            value: `${pendingOrders || 0}`,
            change: `${confirmedOrders || 0} مؤكد`,
            changeType: 'neutral',
            icon: Clock,
            gradient: 'from-orange-500 to-amber-600',
            bgGradient: 'from-orange-50 to-amber-50',
            description: 'تحتاج إلى معالجة'
        },
        {
            title: 'المنتجات النشطة',
            value: `${productsCount || 0}`,
            change: `${deliveredOrders || 0} تم توصيله`,
            changeType: 'neutral',
            icon: Package,
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-50 to-pink-50',
            description: 'منتج في المستودع'
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        نظرة عامة
                    </h2>
                    <p className="text-muted-foreground mt-1">مرحباً بك في لوحة تحكم المتجر.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Clock className="ml-2 h-4 w-4" />
                        آخر 30 يوم
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 group cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`} />

                        {/* Content */}
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">
                                {stat.title}
                            </CardTitle>
                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`flex items-center text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' :
                                    stat.changeType === 'negative' ? 'text-red-600' :
                                        'text-blue-600'
                                    }`}>
                                    {stat.changeType === 'positive' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                    {stat.changeType === 'negative' && <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    {stat.change}
                                </div>
                                <span className="text-xs text-muted-foreground">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/admin/orders?status=pending">
                    <Card className="hover:shadow-md transition-all cursor-pointer border-orange-100 bg-gradient-to-br from-orange-50/50 to-white group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                    <AlertCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{pendingOrders || 0}</p>
                                    <p className="text-sm text-muted-foreground">طلبات قيد الانتظار</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/orders?status=confirmed">
                    <Card className="hover:shadow-md transition-all cursor-pointer border-blue-100 bg-gradient-to-br from-blue-50/50 to-white group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <CheckCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{confirmedOrders || 0}</p>
                                    <p className="text-sm text-muted-foreground">طلبات مؤكدة</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/products/new">
                    <Card className="hover:shadow-md transition-all cursor-pointer border-purple-100 bg-gradient-to-br from-purple-50/50 to-white group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <Package className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900">إضافة منتج</p>
                                    <p className="text-sm text-muted-foreground">منتج جديد للمتجر</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Charts */}
            <DashboardCharts
                monthlyRevenue={defaultMonthlyRevenue}
                dailySales={defaultDailySales}
            />

            {/* Recent Orders */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card className="col-span-1 hover:shadow-md transition-all border-0 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">الطلبات الحديثة</CardTitle>
                                <CardDescription className="mt-1">
                                    تم تسجيل {ordersCount} طلب في هذا الشهر.
                                </CardDescription>
                            </div>
                            <Link href="/admin/orders">
                                <Button variant="outline" size="sm">
                                    عرض الكل
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <RecentOrders orders={recentOrders || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
