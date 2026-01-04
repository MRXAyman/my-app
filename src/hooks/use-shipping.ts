import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export type ShippingRates = {
    home_delivery_price: number
    desk_delivery_price: number
}

export function useShipping(wilayaCode: string | undefined) {
    const [rates, setRates] = useState<ShippingRates | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchShipping() {
            if (!wilayaCode) {
                setRates(null)
                return
            }

            setLoading(true)
            const supabase = createClient()

            const { data, error } = await supabase
                .from('shipping_zones')
                .select('home_delivery_price, desk_delivery_price')
                .eq('wilaya_code', parseInt(wilayaCode))
                .single()

            if (error) {
                console.error('Error fetching shipping rates:', error)
                // Fallback or handle error
                setRates({ home_delivery_price: 0, desk_delivery_price: 0 })
            } else {
                setRates(data)
            }
            setLoading(false)
        }

        fetchShipping()
    }, [wilayaCode])

    return { rates, loading }
}
