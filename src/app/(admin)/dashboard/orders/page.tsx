import { supabase } from "@/utils/supabase/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge" // Need to add badge
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Note: In real app, make this async server component with specialized fetching
// For now, client-side fetching or simple server fetch

export const dynamic = 'force-dynamic'

async function getOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching orders:", error)
        return []
    }
    return data || []
}

export default async function OrdersPage() {
    const orders = await getOrders()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Orders Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders ({orders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Wilaya</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.customer_info.name}</div>
                                            <div className="text-xs text-gray-500">{order.customer_info.phone}</div>
                                        </TableCell>
                                        <TableCell>{order.customer_info.wilaya}</TableCell>
                                        <TableCell>{order.total_amount} DZD</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
