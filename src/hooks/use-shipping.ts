'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface ShippingRates {
    home_delivery_price: number
    desk_delivery_price: number
    home_delivery_available: boolean
    desk_delivery_available: boolean
    estimated_delivery_time: string
}

export function useShipping(wilayaCode: string) {
    const [rates, setRates] = useState<ShippingRates | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!wilayaCode) {
            setRates(null)
            return
        }

        async function fetchRates() {
            setLoading(true)
            const supabase = createClient()

            const { data, error } = await supabase
                .from('shipping_zones')
                .select('home_delivery_price, desk_delivery_price, home_delivery_available, desk_delivery_available, estimated_delivery_time')
                .eq('wilaya_code', parseInt(wilayaCode))
                .single()

            if (data && !error) {
                setRates(data as ShippingRates)
            } else {
                setRates(null)
            }
            setLoading(false)
        }

        fetchRates()
    }, [wilayaCode])

    return { rates, loading }
}
