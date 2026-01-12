'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Truck, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ShipOrderResult {
    order_id: number
    status: 'success' | 'failed'
    tracking_number?: string
    ecotrack_order_id?: string
    error?: string
}

interface ShipToEcoTrackButtonProps {
    selectedOrderIds: number[]
    onShipmentComplete: () => void
}

export function ShipToEcoTrackButton({ selectedOrderIds, onShipmentComplete }: ShipToEcoTrackButtonProps) {
    const [isShipping, setIsShipping] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState<ShipOrderResult[]>([])
    const [summary, setSummary] = useState<{ total: number; successful: number; failed: number } | null>(null)

    const handleShipOrders = async () => {
        setIsShipping(true)
        setShowResults(false)

        try {
            const response = await fetch('/api/orders/ship-to-ecotrack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderIds: selectedOrderIds
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'فشل في شحن الطلبات')
            }

            setResults(data.results || [])
            setSummary(data.summary || null)
            setShowResults(true)

            // If all successful, refresh the orders list
            if (data.summary?.successful > 0) {
                onShipmentComplete()
            }
        } catch (error) {
            console.error('Error shipping orders:', error)
            setResults([{
                order_id: 0,
                status: 'failed',
                error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
            }])
            setSummary({ total: selectedOrderIds.length, successful: 0, failed: selectedOrderIds.length })
            setShowResults(true)
        } finally {
            setIsShipping(false)
        }
    }

    const handleCloseDialog = () => {
        setShowResults(false)
        setResults([])
        setSummary(null)
    }

    return (
        <>
            <Button
                onClick={handleShipOrders}
                disabled={selectedOrderIds.length === 0 || isShipping}
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                size="lg"
            >
                {isShipping ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        جاري الشحن...
                    </>
                ) : (
                    <>
                        <Truck className="h-5 w-5" />
                        رفع إلى شركة التوصيل ({selectedOrderIds.length})
                    </>
                )}
            </Button>

            <Dialog open={showResults} onOpenChange={setShowResults}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            {summary && summary.failed === 0 ? (
                                <>
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    تم الشحن بنجاح
                                </>
                            ) : summary && summary.successful > 0 ? (
                                <>
                                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                                    تم الشحن جزئياً
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-6 w-6 text-red-600" />
                                    فشل الشحن
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            نتائج عملية الشحن
                        </DialogDescription>
                        {summary && (
                            <div className="flex gap-4 mt-2">
                                <Badge variant="outline" className="bg-gray-50">
                                    الإجمالي: {summary.total}
                                </Badge>
                                {summary.successful > 0 && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        نجح: {summary.successful}
                                    </Badge>
                                )}
                                {summary.failed > 0 && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        فشل: {summary.failed}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </DialogHeader>

                    <div className="max-h-[400px] overflow-y-auto mt-4">
                        <div className="space-y-3">
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${result.status === 'success'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            {result.status === 'success' ? (
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                            )}
                                            <div>
                                                <p className="font-medium">
                                                    طلب #{result.order_id}
                                                </p>
                                                {result.status === 'success' ? (
                                                    <div className="mt-1 space-y-1">
                                                        {result.tracking_number && (
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">رقم التتبع:</span>{' '}
                                                                <span className="font-mono bg-white px-2 py-0.5 rounded">
                                                                    {result.tracking_number}
                                                                </span>
                                                            </p>
                                                        )}
                                                        <Badge className="bg-green-600">
                                                            تم الشحن عبر Anderson
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {result.error || 'فشل في الشحن'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleCloseDialog} variant="outline">
                            إغلاق
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
