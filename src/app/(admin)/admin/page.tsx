import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch quick stats
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
    const { count: pendingOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">لوحة القيادة</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ordersCount || 0}</div>
                        <p className="text-xs text-muted-foreground">طلبات مسجلة في النظام</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">طلبات قيد الانتظار</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders || 0}</div>
                        <p className="text-xs text-muted-foreground text-orange-600">تحتاج إلى معالجة</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المنتجات النشطة</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsCount || 0}</div>
                        <p className="text-xs text-muted-foreground">منتج معروض للبيع</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
