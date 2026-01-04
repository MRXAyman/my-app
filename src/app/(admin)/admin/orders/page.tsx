import { createClient } from "@/utils/supabase/server"
import { OrdersTable } from "@/components/admin/OrdersTable"

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">إدارة الطلبات</h2>
            {orders && orders.length > 0 ? (
                <OrdersTable initialOrders={orders as any} />
            ) : (
                <div className="text-center py-10 bg-white rounded border">
                    <p className="text-muted-foreground">لا توجد طلبات حتى الآن.</p>
                </div>
            )}
        </div>
    )
}
