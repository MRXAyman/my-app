'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/hooks/use-orders'
import { detectDuplicateOrders } from '@/lib/order-utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DuplicateOrderAlertProps {
    order: Order
}

export function DuplicateOrderAlert({ order }: DuplicateOrderAlertProps) {
    const [duplicates, setDuplicates] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkDuplicates() {
            if (!order.customer_info?.phone) {
                setLoading(false)
                return
            }

            const found = await detectDuplicateOrders(
                order.customer_info.phone,
                order.id,
                24 // Check last 24 hours
            )

            setDuplicates(found)
            setLoading(false)
        }

        checkDuplicates()
    }, [order.id, order.customer_info?.phone])

    if (loading || duplicates.length === 0) {
        return null
    }

    return (
        <Alert variant="destructive" className="bg-yellow-50 border-yellow-300 text-yellow-900">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900 font-bold">
                تحذير: طلب مكرر محتمل
            </AlertTitle>
            <AlertDescription className="text-yellow-800">
                <p className="mb-2">
                    تم العثور على {duplicates.length} طلب(ات) أخرى بنفس رقم الهاتف خلال آخر 24 ساعة:
                </p>
                <div className="space-y-2">
                    {duplicates.map((dup) => (
                        <div
                            key={dup.id}
                            className="flex items-center justify-between bg-white p-2 rounded border border-yellow-200"
                        >
                            <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="font-mono">
                                    #{String(dup.id).substring(0, 8)}
                                </Badge>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(dup.created_at).toLocaleDateString('ar-DZ')}
                                </span>
                                <Badge variant="secondary">
                                    {dup.total_amount?.toLocaleString()} د.ج
                                </Badge>
                            </div>
                            <Badge variant="outline">
                                {dup.status}
                            </Badge>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-xs">
                    تحقق من الطلبات السابقة قبل المتابعة لتجنب الطلبات الوهمية.
                </p>
            </AlertDescription>
        </Alert>
    )
}
