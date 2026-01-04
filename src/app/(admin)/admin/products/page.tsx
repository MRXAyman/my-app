import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function AdminProductsPage() {
    const supabase = await createClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">إدارة المنتجات</h2>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة منتج جديد
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">صورة</TableHead>
                            <TableHead className="text-right">اسم المنتج</TableHead>
                            <TableHead className="text-right">السعر</TableHead>
                            <TableHead className="text-right">المخزون</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    لا توجد منتجات حاليا.
                                </TableCell>
                            </TableRow>
                        )}
                        {products?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                        {product.images?.[0] && (
                                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.title}</TableCell>
                                <TableCell>{product.price} د.ج</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
