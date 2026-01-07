'use client'

import { Bell, Menu, Search, User, ChevronRight, Plus, Settings as SettingsIcon, Loader2, Sparkles, TrendingUp, Package, ShoppingCart } from 'lucide-react'
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
import { useState } from 'react'

interface AdminHeaderProps {
    setSidebarOpen: (open: boolean) => void
    handleLogout: () => void
}

export function AdminHeader({ setSidebarOpen, handleLogout }: AdminHeaderProps) {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean).slice(1)
    const { notifications, loading: notificationsLoading, unreadCount, markAsRead } = useNotifications()
    const [searchFocused, setSearchFocused] = useState(false)

    const breadcrumbs = {
        products: 'المنتجات',
        categories: 'الأصناف',
        orders: 'الطلبات',
        shipping: 'الشحن',
        settings: 'الإعدادات',
        new: 'جديد',
        edit: 'تعديل',
    }

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

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <ShoppingCart className="h-4 w-4" />
            case 'product':
                return <Package className="h-4 w-4" />
            default:
                return <Bell className="h-4 w-4" />
        }
    }

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center gap-x-4 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/60 backdrop-blur-xl px-6 shadow-sm">
            {/* Mobile Menu Button */}
            <button
                type="button"
                className="group -m-2.5 p-2.5 lg:hidden rounded-xl hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 transition-all duration-300"
                onClick={() => setSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6 text-slate-600 group-hover:text-primary transition-colors" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-6 self-stretch justify-between items-center">
                {/* Breadcrumbs with Modern Design */}
                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <Link href="/admin" className="font-bold text-sm bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/60 transition-all">
                            لوحة التحكم
                        </Link>
                    </div>
                    {pathSegments.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            {pathSegments.map((segment, index) => (
                                <div key={segment} className="flex items-center gap-1.5">
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                    <span className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${index === pathSegments.length - 1
                                            ? "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 border border-slate-200"
                                            : "text-slate-600 hover:text-primary hover:bg-slate-50"
                                        }`}>
                                        {/* @ts-ignore */}
                                        {breadcrumbs[segment] || segment}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* Enhanced Search Bar */}
                    <form className="relative hidden md:flex" action="#" method="GET">
                        <div className={`relative transition-all duration-300 ${searchFocused ? 'w-80' : 'w-64'}`}>
                            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${searchFocused ? 'text-primary' : 'text-slate-400'}`} />
                            <Input
                                id="search-field"
                                className={`h-11 w-full rounded-xl border-2 pr-10 text-sm font-medium transition-all duration-300 ${searchFocused
                                        ? 'border-primary/30 bg-white shadow-lg shadow-primary/5 ring-4 ring-primary/5'
                                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                                    }`}
                                placeholder="ابحث عن منتجات، طلبات..."
                                type="search"
                                name="search"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                        </div>
                    </form>

                    {/* Quick Actions with Gradient */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                                suppressHydrationWarning
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-xl border-slate-200 shadow-xl">
                            <DropdownMenuLabel className="text-base font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                إضافة جديد
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1">
                                <Link href="/admin/products/new" className="flex items-center gap-3 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                        <Package className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">منتج جديد</p>
                                        <p className="text-xs text-muted-foreground">أضف منتج للمتجر</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1">
                                <Link href="/admin/categories" className="flex items-center gap-3 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">صنف جديد</p>
                                        <p className="text-xs text-muted-foreground">أنشئ تصنيف جديد</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Enhanced Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-11 w-11 rounded-xl hover:bg-slate-100 transition-all duration-300 group"
                                suppressHydrationWarning
                            >
                                <Bell className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1">
                                        <Badge className="h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-red-500 to-red-600 border-2 border-white shadow-lg animate-pulse">
                                            {unreadCount}
                                        </Badge>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-96 rounded-xl border-slate-200 shadow-2xl">
                            <DropdownMenuLabel className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                        <Bell className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="font-bold text-base">الإشعارات</span>
                                </div>
                                {unreadCount > 0 && (
                                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                        {unreadCount} جديد
                                    </Badge>
                                )}
                            </DropdownMenuLabel>
                            {notificationsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <div className="max-h-[400px] overflow-y-auto p-2">
                                        {notifications.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                    <Bell className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-600">لا توجد إشعارات</p>
                                                <p className="text-xs text-slate-400 mt-1">سنعلمك عند وجود تحديثات</p>
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <DropdownMenuItem
                                                    key={notification.id}
                                                    className="flex items-start gap-3 p-3 cursor-pointer rounded-lg my-1 hover:bg-slate-50 transition-all"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${!notification.is_read
                                                            ? 'bg-gradient-to-br from-primary to-primary/70 text-white'
                                                            : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {getNotificationIcon(notification.type || 'default')}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-semibold ${!notification.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                            {getTimeAgo(notification.created_at)}
                                                        </p>
                                                    </div>
                                                    {!notification.is_read && (
                                                        <div className="h-2.5 w-2.5 bg-gradient-to-br from-primary to-primary/70 rounded-full flex-shrink-0 mt-1" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-center text-sm font-semibold text-primary cursor-pointer justify-center p-3 hover:bg-primary/5">
                                                عرض جميع الإشعارات
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent hidden sm:block" />

                    {/* Enhanced User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="gap-3 hover:bg-slate-100 rounded-xl px-3 py-2 h-auto transition-all duration-300"
                                suppressHydrationWarning
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 text-white font-bold shadow-lg shadow-primary/25 ring-2 ring-white hover:shadow-xl hover:scale-105 transition-all">
                                    AD
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold leading-none text-slate-900">Admin User</p>
                                    <p className="text-xs text-slate-500 mt-1">admin@store.com</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-xl border-slate-200 shadow-xl">
                            <DropdownMenuLabel className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        AD
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Admin User</p>
                                        <p className="text-xs text-muted-foreground">admin@store.com</p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1 mx-2">
                                <Link href="/admin/settings" className="flex items-center gap-3 p-2">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <SettingsIcon className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <span className="font-medium">الإعدادات</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-lg my-1 mx-2">
                                <div className="flex items-center gap-3 p-2">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <span className="font-medium">الملف الشخصي</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50 rounded-lg my-1 mx-2 font-semibold"
                                onClick={handleLogout}
                            >
                                <div className="flex items-center gap-3 p-2">
                                    <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                                        <User className="h-4 w-4 text-red-600" />
                                    </div>
                                    <span>تسجيل الخروج</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
