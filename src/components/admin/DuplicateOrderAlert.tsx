'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/hooks/use-orders'
import { detectDuplicateOrders } from '@/lib/order-utils'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Calendar, Package, Clock } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface DuplicateOrderAlertProps {
    order: Order
}

export function DuplicateOrderAlert({ order }: DuplicateOrderAlertProps) {
    const [duplicates, setDuplicates] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

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
        <>
            {/* Compact Warning Badge */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative group inline-flex items-center gap-1.5 mt-1"
            >
                {/* Animated Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-full blur opacity-40 group-hover:opacity-70 animate-pulse transition-opacity" />

                {/* Badge */}
                <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
                    <span className="text-xs font-bold">
                        {duplicates.length} طلب مكرر
                    </span>
                </div>
            </button>

            {/* Detailed Alert Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-2 border-amber-300/60">
                    {/* Decorative Top Border */}
                    <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-gradient-x" />

                    <div className="p-6">
                        <DialogHeader>
                            <div className="flex items-start gap-4 mb-4">
                                {/* Animated Warning Icon */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-md animate-pulse" />
                                    <div className="relative h-12 w-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent mb-2">
                                        ⚠️ تحذير: طلب مكرر محتمل
                                    </DialogTitle>
                                    <DialogDescription className="text-amber-800 font-medium">
                                        تم العثور على <span className="font-bold text-orange-600">{duplicates.length}</span> طلب(ات) أخرى بنفس رقم الهاتف خلال آخر 24 ساعة
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Duplicates List */}
                        <div className="space-y-3 mt-6 max-h-[400px] overflow-y-auto pr-2">
                            {duplicates.map((dup, index) => (
                                <div
                                    key={dup.id}
                                    className="group relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border border-amber-200/60 rounded-lg p-4 hover:shadow-md hover:border-amber-300 transition-all duration-300 animate-in slide-in-from-right"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Hover Gradient Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100/0 via-orange-100/50 to-amber-100/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />

                                    <div className="relative space-y-3">
                                        {/* Top Row - Order ID and Status */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-9 w-9 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <Package className="h-4 w-4 text-amber-600" />
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono text-xs bg-white/80 border-amber-300 text-amber-900 shadow-sm"
                                                >
                                                    #{String(dup.id).substring(0, 8)}
                                                </Badge>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="bg-white/80 border-amber-300/60 text-amber-800 font-medium shadow-sm"
                                            >
                                                {dup.status}
                                            </Badge>
                                        </div>

                                        {/* Bottom Row - Details */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-white/60 px-2.5 py-1.5 rounded-md border border-amber-200/50">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="font-medium">
                                                    {new Date(dup.created_at).toLocaleDateString('ar-DZ', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            <Badge
                                                variant="secondary"
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm font-bold text-xs px-2.5 py-1"
                                            >
                                                {dup.total_amount?.toLocaleString()} د.ج
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Warning */}
                        <div className="mt-6 bg-gradient-to-r from-amber-100/80 via-orange-100/80 to-red-100/80 px-4 py-3 rounded-lg border border-amber-200/60">
                            <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                    💡 <strong>تنبيه:</strong> تحقق من الطلبات السابقة قبل المتابعة لتجنب الطلبات الوهمية أو المكررة
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
