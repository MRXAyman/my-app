'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen overflow-hidden">
                <AdminSidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    handleLogout={handleLogout}
                />

                <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <AdminHeader
                        setSidebarOpen={setSidebarOpen}
                        handleLogout={handleLogout}
                    />

                    <main>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
