'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function FacebookPixel({ pixelId }: { pixelId?: string }) {
    const pathname = usePathname()

    useEffect(() => {
        if (!pixelId) return

        // Initialize Facebook Pixel
        if (typeof window !== 'undefined') {
            (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
                if (f.fbq) return
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                }
                if (!f._fbq) f._fbq = n
                n.push = n
                n.loaded = !0
                n.version = '2.0'
                n.queue = []
                t = b.createElement(e)
                t.async = !0
                t.src = v
                s = b.getElementsByTagName(e)[0]
                s.parentNode.insertBefore(t, s)
            })(
                window,
                document,
                'script',
                'https://connect.facebook.net/en_US/fbevents.js'
            )

                ; (window as any).fbq('init', pixelId)
                ; (window as any).fbq('track', 'PageView')
        }
    }, [pixelId])

    // Track page views on route change
    useEffect(() => {
        if (pixelId && typeof window !== 'undefined' && (window as any).fbq) {
            ; (window as any).fbq('track', 'PageView')
        }
    }, [pathname, pixelId])

    return null
}

// Helper functions for tracking events
export const trackViewContent = (productId: string, productName: string, value: number) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        ; (window as any).fbq('track', 'ViewContent', {
            content_ids: [productId],
            content_name: productName,
            content_type: 'product',
            value: value,
            currency: 'DZD'
        })
    }
}

export const trackAddToCart = (productId: string, productName: string, value: number) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        ; (window as any).fbq('track', 'AddToCart', {
            content_ids: [productId],
            content_name: productName,
            content_type: 'product',
            value: value,
            currency: 'DZD'
        })
    }
}
