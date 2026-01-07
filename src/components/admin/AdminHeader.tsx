'use client'

import { Bell, Menu, Search, User, ChevronLeft, Download, Plus, Settings as SettingsIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/hooks/use-notifications'

interface AdminHeaderProps {
    setSidebarOpen: (open: boolean) => void
    handleLogout: () => void
}

export function AdminHeader({ setSidebarOpen, handleLogout }: AdminHeaderProps) {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean).slice(1) // Remove 'admin'
    const { notifications, loading: notificationsLoading, unreadCount, markAsRead } = useNotifications()


    const breadcrumbs = {
        products: 'المنتجات',
        categories: 'الأصناف',
        orders: 'الطلبات',
        shipping: 'الشحن',
        settings: 'الإعدادات',
        new: 'جديد',
        edit: 'تعديل',
    }

    // Helper function to get time ago in Arabic
    const getTimeAgo = (dateString: string): string => {
        const now = new Date()
        const past = new Date(dateString)
        const diffMs = now.getTime() - past.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'الآن'
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`
        if (diffHours < 24) return `منذ ${diffHours} ساعة`
        return `منذ ${diffDays} يوم`
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-white/95 backdrop-blur-md px-6 shadow-sm">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch justify-between items-center lg:gap-x-6">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-muted-foreground">
                    <Link href="/admin" className="font-semibold text-foreground hover:text-primary transition-colors">
                        الرئيسية
                    </Link>
                    {pathSegments.length > 0 && pathSegments.map((segment, index) => (
                        <div key={segment} className="flex items-center">
                            <ChevronLeft className="h-4 w-4 mx-1" />
                            <span className={index === pathSegments.length - 1 ? "font-medium text-foreground capitalize" : "capitalize hover:text-primary transition-colors cursor-pointer"}>
                                {/* @ts-ignore */}
                                {breadcrumbs[segment] || segment}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-x-3 lg:gap-x-4">
                    {/* Search */}
                    <form className="relative hidden md:flex" action="#" method="GET">
                        <label htmlFor="search-field" className="sr-only">
                            بحث
                        </label>
                        <div className="relative w-64">
                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                            <Input
                                id="search-field"
                                className="h-9 w-full rounded-full border-gray-200 bg-gray-50 pr-9 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="بحث..."
                                type="search"
                                name="search"
                            />
                        </div>
                    </form>

                    {/* Quick Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="relative hover:bg-primary/5 hover:border-primary/30 transition-all" suppressHydrationWarning>
                                <Plus className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>إضافة جديد</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/products/new" className="cursor-pointer">
                                    منتج جديد
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/categories" className="cursor-pointer">
                                    صنف جديد
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" suppressHydrationWarning>
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600 animate-pulse">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel className="flex items-center justify-between">
                                <span>الإشعارات</span>
                                {unreadCount > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {unreadCount} جديد
                                    </Badge>
                                )}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notificationsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="py-8 text-center text-sm text-muted-foreground">
                                                لا توجد إشعارات
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <DropdownMenuItem
                                                    key={notification.id}
                                                    className="flex flex-col items-start p-3 cursor-pointer"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <div className="flex items-start justify-between w-full">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{notification.title}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(notification.created_at)}</p>
                                                        </div>
                                                        {!notification.is_read && (
                                                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-1" />
                                                        )}
                                                    </div>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-center text-sm text-primary cursor-pointer justify-center">
                                        عرض جميع الإشعارات
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-gray-200 hidden sm:block" aria-hidden="true" />

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent" suppressHydrationWarning>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-md ring-2 ring-white hover:shadow-lg transition-all">
                                    AD
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium leading-none">Admin User</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">admin@store.com</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings" className="cursor-pointer">
                                    <SettingsIcon className="ml-2 h-4 w-4" />
                                    الإعدادات
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <User className="ml-2 h-4 w-4" />
                                الملف الشخصي
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50" onClick={handleLogout}>
                                تسجيل الخروج
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
