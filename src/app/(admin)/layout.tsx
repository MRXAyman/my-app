import Link from "next/link"
import { Package, Truck, Settings, BarChart, LayoutDashboard } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6" />
                        Admin Panel
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/dashboard/orders" icon={<Package />}>Orders</NavLink>
                    <NavLink href="/dashboard/products" icon={<LayoutDashboard />}>Products</NavLink>
                    <NavLink href="/dashboard/shipping" icon={<Truck />}>Shipping</NavLink>
                    <NavLink href="/dashboard/settings" icon={<Settings />}>Settings</NavLink>
                </nav>
                <div className="p-4 border-t text-sm text-gray-500">
                    User: Admin
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <span className="h-5 w-5">{icon}</span>
            <span className="font-medium">{children}</span>
        </Link>
    )
}
