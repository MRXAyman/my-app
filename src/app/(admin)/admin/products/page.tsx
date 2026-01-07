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
import { Plus, Edit, Trash2, MoreHorizontal, Eye, TrendingUp, TrendingDown, Package as PackageIcon, ExternalLink } from "lucide-react"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { AdminSearch } from "@/components/admin/AdminSearch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ProductActions } from "@/components/admin/ProductActions"

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>
}) {
    const supabase = await createClient()
    const query = (await searchParams).q

    let productQuery = supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })

    if (query) {
        productQuery = productQuery.ilike('title', `%${query}%`)
    }

    const { data: products, error } = await productQuery
    const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const { count: inStockProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true)
    const { count: outOfStockProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false)

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        إدارة المنتجات
                    </h2>
                    <p className="text-muted-foreground mt-1">عرض وإدارة جميع المنتجات في المتجر</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25">
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة منتج جديد
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <PackageIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalProducts || 0}</p>
                            <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-green-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{inStockProducts || 0}</p>
                            <p className="text-sm text-muted-foreground">متوفر في المخزون</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-red-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                            <TrendingDown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{outOfStockProducts || 0}</p>
                            <p className="text-sm text-muted-foreground">نفذ من المخزون</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <Card className="p-4 border-0 shadow-sm">
                <AdminSearch placeholder="بحث عن منتج..." />
            </Card>

            {/* Products Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-white hover:from-gray-50 hover:to-white">
                            <TableHead className="text-right w-[100px]">صورة</TableHead>
                            <TableHead className="text-right">اسم المنتج</TableHead>
                            <TableHead className="text-right">السعر</TableHead>
                            <TableHead className="text-right">الصنف</TableHead>
                            <TableHead className="text-right">المخزون</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right w-[100px]">معاينة</TableHead>
                            <TableHead className="text-right w-[50px]"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <PackageIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {query ? 'لا توجد نتائج بحث مطابقة' : 'لا توجد منتجات حاليا'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {!query && 'ابدأ بإضافة منتج جديد'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {products?.map((product) => (
                            <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                <TableCell>
                                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover:border-primary/30 transition-colors shadow-sm">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                <PackageIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium max-w-[250px]">
                                    <div className="flex flex-col">
                                        <span className="truncate" title={product.title}>{product.title}</span>
                                        {product.sale_price && (
                                            <Badge variant="secondary" className="w-fit mt-1 text-xs bg-red-100 text-red-700 border-red-200">
                                                تخفيض
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{product.sale_price || product.price} د.ج</span>
                                        {product.sale_price && (
                                            <span className="text-xs text-muted-foreground line-through">{product.price} د.ج</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-gray-50">
                                        {product.categories?.name || 'غير مصنف'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {product.stock}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={product.in_stock} type="product" />
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={`/products/${product.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            معاينة
                                        </Button>
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <ProductActions product={product} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
