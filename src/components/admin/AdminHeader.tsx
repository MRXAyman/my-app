'use client'

import { Bell, Menu, Search, User, ChevronLeft, Download, Plus, Settings as SettingsIcon } from 'lucide-react'
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

interface AdminHeaderProps {
    setSidebarOpen: (open: boolean) => void
    handleLogout: () => void
}

export function AdminHeader({ setSidebarOpen, handleLogout }: AdminHeaderProps) {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean).slice(1) // Remove 'admin'

    const breadcrumbs = {
        products: 'المنتجات',
        categories: 'الأصناف',
        orders: 'الطلبات',
        shipping: 'الشحن',
        settings: 'الإعدادات',
        new: 'جديد',
        edit: 'تعديل',
    }

    // Mock notifications
    const notifications = [
        { id: 1, title: 'طلب جديد', message: 'طلب رقم #1234', time: 'منذ 5 دقائق', unread: true },
        { id: 2, title: 'منتج نفذ', message: 'المنتج "سماعات" نفذ من المخزون', time: 'منذ ساعة', unread: true },
        { id: 3, title: 'تحديث النظام', message: 'تم تحديث النظام بنجاح', time: 'منذ 3 ساعات', unread: false },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

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
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((notification) => (
                                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                                        <div className="flex items-start justify-between w-full">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{notification.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                                            </div>
                                            {notification.unread && (
                                                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1" />
                                            )}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center text-sm text-primary cursor-pointer justify-center">
                                عرض جميع الإشعارات
                            </DropdownMenuItem>
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
