'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface AdminSearchProps {
    placeholder?: string
    targetUrl?: string
}

export function AdminSearch({ placeholder = "بحث...", targetUrl }: AdminSearchProps) {
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const pathname = useSearchParams()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }

        // If targetUrl is provided, use it, otherwise use current path (which is not directly available via useSearchParams, so we rely on parent or default behavior if we used usePathname, but sticking to router.replace with just params is tricky without path)
        // Better:
        replace(`${targetUrl || window.location.pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className="flex items-center space-x-2 relative max-w-sm">
            <Search className="h-4 w-4 absolute right-3 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                className="pr-10"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
            />
        </div>
    )
}
