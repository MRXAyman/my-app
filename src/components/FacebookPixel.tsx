'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const FacebookPixel = ({ pixelId }: { pixelId: string | null }) => {
    const pathname = usePathname()

    useEffect(() => {
        if (!pixelId) return

        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.init(pixelId)
                ReactPixel.pageView()
            })
    }, [pathname, pixelId])

    return null
}
