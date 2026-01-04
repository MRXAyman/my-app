import { ReactNode } from "react"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Truck, Settings } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100 flex" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-l shadow-sm fixed h-full hidden md:block">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-primary">لوحة التحكم</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>الرئيسية</span>
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                        <Package className="w-5 h-5" />
                        <span>المنتجات</span>
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                        <ShoppingCart className="w-5 h-5" />
                        <span>الطلبات</span>
                    </Link>
                    <Link href="/admin/shipping" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                        <Truck className="w-5 h-5" />
                        <span>الشحن والولايات</span>
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                        <Settings className="w-5 h-5" />
                        <span>الإعدادات</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="md:mr-64 flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
