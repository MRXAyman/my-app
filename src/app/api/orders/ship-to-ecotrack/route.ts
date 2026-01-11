import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { shipMultipleOrdersToEcoTrack, ShipOrderResult } from '@/lib/ecotrack-api'
import { Order } from '@/hooks/use-orders'

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json()
        const { orderIds } = body

        // Validate input
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'يجب تحديد طلب واحد على الأقل' },
                { status: 400 }
            )
        }

        // Initialize Supabase client
        const supabase = await createClient()

        // Fetch orders from database
        const { data: orders, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .in('id', orderIds)

        if (fetchError) {
            console.error('Error fetching orders:', fetchError)
            return NextResponse.json(
                { success: false, error: 'فشل في جلب الطلبات من قاعدة البيانات' },
                { status: 500 }
            )
        }

        if (!orders || orders.length === 0) {
            return NextResponse.json(
                { success: false, error: 'لم يتم العثور على الطلبات المحددة' },
                { status: 404 }
            )
        }

        // Ship orders to EcoTrack
        const results = await shipMultipleOrdersToEcoTrack(orders as Order[])

        // Update database for successful shipments
        const updatePromises = results
            .filter(result => result.status === 'success')
            .map(async (result) => {
                const { error: updateError } = await supabase
                    .from('orders')
                    .update({
                        tracking_number: result.tracking_number,
                        courier: 'ANDERSON',
                        shipment_status: 'pending_pickup',
                        shipped_at: new Date().toISOString(),
                        ecotrack_order_id: result.ecotrack_order_id,
                        status: 'shipped',
                        last_status_update: new Date().toISOString()
                    })
                    .eq('id', result.order_id)

                if (updateError) {
                    console.error(`Error updating order ${result.order_id}:`, updateError)
                    return {
                        ...result,
                        status: 'failed' as const,
                        error: 'تم إنشاء الشحنة ولكن فشل تحديث قاعدة البيانات'
                    }
                }

                return result
            })

        const finalResults = await Promise.all(updatePromises)

        // Combine results with failed shipments
        const allResults = [
            ...finalResults,
            ...results.filter(result => result.status === 'failed')
        ]

        // Calculate summary
        const successCount = allResults.filter(r => r.status === 'success').length
        const failedCount = allResults.filter(r => r.status === 'failed').length

        return NextResponse.json({
            success: successCount > 0,
            results: allResults,
            summary: {
                total: allResults.length,
                successful: successCount,
                failed: failedCount
            }
        })

    } catch (error) {
        console.error('Error in ship-to-ecotrack API:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
            },
            { status: 500 }
        )
    }
}
