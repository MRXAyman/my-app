import { Order } from '@/hooks/use-orders'
import { getWilayaCode, getCommuneAsciiName } from './algeria-data'
import { createClient } from '@/utils/supabase/server'

// EcoTrack API Configuration
const ECOTRACK_API_URL = process.env.ECOTRACK_API_URL || 'https://anderson-ecommerce.ecotrack.dz/'
const ECOTRACK_API_KEY = process.env.ECOTRACK_API_KEY || ''

// EcoTrack API Types
export interface EcoTrackOrderRequest {
    order_id: string
    receiver_name: string
    receiver_phone: string
    receiver_address: string
    city: string
    amount: number
    notes?: string
    courier: string
}

export interface EcoTrackOrderResponse {
    success: boolean
    tracking_number?: string
    ecotrack_order_id?: string
    message?: string
    error?: string
}

export interface ShipOrderResult {
    order_id: number
    status: 'success' | 'failed'
    tracking_number?: string
    ecotrack_order_id?: string
    error?: string
}

/**
 * Validate if an order is eligible for shipping
 */
export function validateOrderForShipping(order: Order): { valid: boolean; error?: string } {
    // Check if order is already shipped
    if (order.tracking_number) {
        return {
            valid: false,
            error: 'الطلب مشحون مسبقاً'
        }
    }

    // Check if order status is confirmed
    if (order.status !== 'confirmed') {
        return {
            valid: false,
            error: 'يجب أن تكون حالة الطلب "مؤكد" للشحن'
        }
    }

    // Validate required customer information
    if (!order.customer_info?.name) {
        return {
            valid: false,
            error: 'اسم العميل مطلوب'
        }
    }

    if (!order.customer_info?.phone) {
        return {
            valid: false,
            error: 'رقم هاتف العميل مطلوب'
        }
    }

    if (!order.customer_info?.wilaya) {
        return {
            valid: false,
            error: 'الولاية مطلوبة'
        }
    }

    if (!order.customer_info?.commune) {
        return {
            valid: false,
            error: 'البلدية مطلوبة'
        }
    }

    if (!order.total_amount || order.total_amount <= 0) {
        return {
            valid: false,
            error: 'مبلغ الطلب غير صحيح'
        }
    }

    return { valid: true }
}

/**
 * Map order data to EcoTrack API format
 * Based on official EcoTrack API documentation
 */
export function mapOrderToEcoTrack(order: Order): any {
    // Get wilaya code
    const wilayaCode = getWilayaCode(order.customer_info.wilaya)

    // Get commune ASCII name for EcoTrack compatibility
    const communeAscii = getCommuneAsciiName(wilayaCode, order.customer_info.commune)

    // Combine commune and wilaya as address
    const address = `${order.customer_info.commune}, ${order.customer_info.wilaya}`

    return {
        reference: order.id.toString(),
        nom_client: order.customer_info.name,
        telephone: order.customer_info.phone,
        adresse: address,
        commune: communeAscii,  // Use ASCII name for EcoTrack
        code_wilaya: wilayaCode,  // Must be integer
        montant: order.total_amount,
        remarque: order.notes || '',
        type: 1,  // 1 = delivery, 2 = pick-up (must be integer)
    }
}

/**
 * Submit an order to EcoTrack API
 */
export async function shipOrderToEcoTrack(order: Order): Promise<ShipOrderResult> {
    let apiKey = ECOTRACK_API_KEY
    let apiUrl = ECOTRACK_API_URL

    try {
        // Fetch active carrier credentials

        try {
            const supabase = await createClient()
            const { data: carrier } = await supabase
                .from('shipping_carriers')
                .select('*')
                .eq('is_active', true)
                .single()

            if (carrier) {
                apiKey = carrier.api_key
                apiUrl = carrier.api_url
                console.log(`Using active carrier: ${carrier.name}`)
            }
        } catch (dbError) {
            console.warn('Failed to fetch carrier settings, using env vars', dbError)
        }

        // Validate order
        const validation = validateOrderForShipping(order)
        if (!validation.valid) {
            return {
                order_id: order.id,
                status: 'failed',
                error: validation.error
            }
        }

        // Map order data
        const ecotrackOrder = mapOrderToEcoTrack(order)

        // Robust URL construction
        if (apiUrl.endsWith('/')) {
            apiUrl = apiUrl.slice(0, -1)
        }

        // Only append path if not already present
        if (!apiUrl.includes('/api/v1/create/order')) {
            apiUrl = `${apiUrl}/api/v1/create/order`
        }

        console.log('Sending order to EcoTrack:', {
            url: apiUrl,
            reference: ecotrackOrder.reference,
            apiKeyStart: apiKey ? `${apiKey.substring(0, 5)}...` : 'missing'
        })

        // Call EcoTrack API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'Anderson/1.0'
            },
            body: JSON.stringify(ecotrackOrder)
        })

        console.log('EcoTrack response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('EcoTrack error response:', errorText)

            let errorData: any = {}
            try {
                errorData = JSON.parse(errorText)
            } catch (e) {
                errorData = { message: errorText }
            }

            return {
                order_id: order.id,
                status: 'failed',
                error: errorData.message || errorData.error || `خطأ في الاتصال بـ EcoTrack: ${response.status}`
            }
        }

        const data: any = await response.json()
        console.log('EcoTrack response data:', data)

        // EcoTrack returns tracking code in 'tracking' or 'tracking_number' field
        const trackingNumber = data.tracking_number || data.tracking

        // EcoTrack might return success: true but check for tracking number
        // Some APIs returns 200 OK even for logical errors
        if ((data.success || data.code === 200) && trackingNumber) {
            return {
                order_id: order.id,
                status: 'success',
                tracking_number: trackingNumber,
                ecotrack_order_id: data.ecotrack_order_id || data.reference
            }
        } else {
            // Extract detailed error message
            let errorMessage = data.error || data.message || data.msg

            // Check for validation errors object
            if (!errorMessage && data.errors) {
                if (typeof data.errors === 'object') {
                    errorMessage = Object.values(data.errors).join(', ')
                } else {
                    errorMessage = JSON.stringify(data.errors)
                }
            }

            if (!errorMessage) {
                errorMessage = 'استجابة غير متوقعة من EcoTrack: ' + JSON.stringify(data).substring(0, 100)
            }

            return {
                order_id: order.id,
                status: 'failed',
                error: errorMessage
            }
        }
    } catch (error) {
        console.error('Error shipping order to EcoTrack:', error)
        return {
            order_id: order.id,
            status: 'failed',
            error: error instanceof Error ? `fetch failed to ${apiUrl}: ${error.message}` : 'خطأ غير متوقع في النظام'
        }
    }
}

/**
 * Ship multiple orders to EcoTrack
 */
export async function shipMultipleOrdersToEcoTrack(orders: Order[]): Promise<ShipOrderResult[]> {
    const results: ShipOrderResult[] = []

    // Process orders sequentially to avoid overwhelming the API
    for (const order of orders) {
        const result = await shipOrderToEcoTrack(order)
        results.push(result)

        // Small delay between requests to be respectful to the API
        if (orders.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    return results
}
