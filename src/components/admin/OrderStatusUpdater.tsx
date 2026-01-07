'use client'

import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface OrderStatusUpdaterProps {
    currentStatus: string
    orderId: number
    onStatusUpdate: (orderId: number, newStatus: string) => Promise<void>
}

const statusOptions = [
    { value: 'pending', label: 'قيد الانتظار', color: 'orange' },
    { value: 'no_answer_1', label: 'لم يرد على الإتصال 1', color: 'yellow' },
    { value: 'no_answer_2', label: 'لم يرد على الإتصال 2', color: 'yellow' },
    { value: 'no_answer_3', label: 'لم يرد على الإتصال 3', color: 'amber' },
    { value: 'confirmed', label: 'تم التأكيد', color: 'green' },
    { value: 'shipped', label: 'قيد الشحن', color: 'purple' },
    { value: 'delivered', label: 'تم التوصيل', color: 'emerald' },
    { value: 'returned', label: 'مسترجع', color: 'gray' },
    { value: 'cancelled', label: 'ملغى', color: 'red' },
]

export function OrderStatusUpdater({
    currentStatus,
    orderId,
    onStatusUpdate
}: OrderStatusUpdaterProps) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus)
    const [updating, setUpdating] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setSelectedStatus(newStatus)
        setUpdating(true)

        try {
            await onStatusUpdate(orderId, newStatus)
        } catch (error) {
            console.error('Error updating status:', error)
            // Revert on error
            setSelectedStatus(currentStatus)
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={updating}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {updating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
    )
}
