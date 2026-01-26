'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function FacebookPixel({ pixelId }: { pixelId?: string }) {
    const pathname = usePathname()

    useEffect(() => {
        console.log('Facebook Pixel: Component mounted. Pixel ID:', pixelId)
        if (!pixelId) {
            console.warn('Facebook Pixel: No Pixel ID provided')
            return
        }

        // Initialize Facebook Pixel
        if (typeof window !== 'undefined') {
            console.log('Facebook Pixel: Initializing script...');
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

// Helper to wait for fbq to be ready
const waitForFbq = (callback: () => void) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        console.log('Facebook Pixel: fbq found, executing callback')
        callback()
    } else {
        console.log('Facebook Pixel: fbq not found, starting polling...')
        let attempts = 0
        const interval = setInterval(() => {
            if (typeof window !== 'undefined' && (window as any).fbq) {
                console.log('Facebook Pixel: fbq found after polling', attempts, 'attempts')
                callback()
                clearInterval(interval)
            }
            attempts++
            if (attempts > 50) { // Stop after ~5s
                clearInterval(interval)
                console.warn('Facebook Pixel: fbq not loaded after 5s')
            }
        }, 100)
    }
}

// Helper functions for tracking events
export const trackViewContent = (productId: string, productName: string, value: number) => {
    console.log('Facebook Pixel: trackViewContent called', { productId, productName, value })
    waitForFbq(() => {
        ; (window as any).fbq('track', 'ViewContent', {
            content_ids: [productId],
            content_name: productName,
            content_type: 'product',
            value: value,
            currency: 'USD'
        })
    })
}

export const trackAddToCart = (productId: string, productName: string, value: number) => {
    console.log('Facebook Pixel: trackAddToCart called', { productId, productName, value })
    waitForFbq(() => {
        ; (window as any).fbq('track', 'AddToCart', {
            content_ids: [productId],
            content_name: productName,
            content_type: 'product',
            value: value,
            currency: 'USD'
        })
    })
}

export const trackPurchase = (productId: string, productName: string, value: number, quantity: number = 1) => {
    console.log('Facebook Pixel: trackPurchase called', { productId, productName, value, quantity })
    waitForFbq(() => {
        console.log('Facebook Pixel: Firing Purchase event')
            ; (window as any).fbq('track', 'Purchase', {
                content_ids: [productId],
                content_name: productName,
                content_type: 'product',
                value: value,
                currency: 'USD', // Note: Facebook Pixel might not support 'DZD', using 'USD' for now.
                num_items: quantity
            })
    })
}
