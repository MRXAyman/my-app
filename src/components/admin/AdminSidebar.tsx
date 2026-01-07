'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Truck,
    ShoppingCart,
    Settings,
    LogOut,
    Store,
    X,
    UserCircle,
    ChevronLeft,
    Bell,
    TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const navigation = [
    { name: 'لوحة القيادة', href: '/admin', icon: LayoutDashboard, badge: null },
    { name: 'المنتجات', href: '/admin/products', icon: Package, badge: null },
    { name: 'الأصناف', href: '/admin/categories', icon: FolderTree, badge: null },
    { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCart, badge: '3' },
    { name: 'الشحن', href: '/admin/shipping', icon: Truck, badge: null },
    { name: 'الإعدادات', href: '/admin/settings', icon: Settings, badge: null },
]

interface AdminSidebarProps {
    open: boolean
    setOpen: (open: boolean) => void
    handleLogout: () => void
}

export function AdminSidebar({ open, setOpen, handleLogout }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-white to-gray-50/50 border-l border-gray-200/80 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col shadow-xl",
                open ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header with gradient */}
                <div className="relative flex h-16 items-center border-b border-gray-200/80 px-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                            <Store className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-foreground">لوحة التحكم</span>
                            <span className="text-xs text-muted-foreground">إدارة المتجر</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        className="mr-auto lg:hidden text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="space-y-1.5">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== '/admin')
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                                            : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 hover:scale-[1.01]"
                                    )}
                                >
                                    {/* Animated background effect */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    )}

                                    <item.icon className={cn(
                                        "h-5 w-5 transition-all duration-200 relative z-10",
                                        isActive
                                            ? "text-primary-foreground drop-shadow-sm"
                                            : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                                    )} />
                                    <span className="relative z-10 flex-1">{item.name}</span>

                                    {item.badge && (
                                        <Badge
                                            variant={isActive ? "secondary" : "default"}
                                            className={cn(
                                                "relative z-10 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold",
                                                isActive
                                                    ? "bg-white/20 text-white border-white/30"
                                                    : "bg-red-500 text-white animate-pulse"
                                            )}
                                        >
                                            {item.badge}
                                        </Badge>
                                    )}

                                    {isActive && (
                                        <ChevronLeft className="mr-auto h-4 w-4 opacity-70 relative z-10" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Quick Stats Card */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-900">الأداء اليوم</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">طلبات جديدة</span>
                                <span className="text-sm font-bold text-gray-900">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">الإيرادات</span>
                                <span className="text-sm font-bold text-green-600">45,231 د.ج</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-gray-200/80 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 px-2 py-2 mb-3 rounded-lg hover:bg-white/60 transition-colors">
                        <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary ring-2 ring-primary/20">
                            <UserCircle className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-semibold text-gray-900">المسؤول</span>
                            <span className="text-xs text-gray-500">admin@store.com</span>
                        </div>
                        <Bell className="h-4 w-4 text-gray-400" />
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md"
                    >
                        <LogOut className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                    </Button>
                </div>
            </aside>
        </>
    )
}
