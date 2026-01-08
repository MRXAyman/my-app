'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

interface FooterWrapperProps {
    brandSettings: any
}

export function FooterWrapper({ brandSettings }: FooterWrapperProps) {
    const pathname = usePathname()

    // Hide footer on admin and dashboard pages
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
        return null
    }

    return <Footer brandSettings={brandSettings} />
}
