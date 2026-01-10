'use client'

import { useState } from 'react'
import { Archive, ArchiveRestore, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface ArchiveOrderButtonProps {
    orderId: number
    isArchived?: boolean
    onArchive: (orderId: number) => Promise<void>
    onUnarchive: (orderId: number) => Promise<void>
    variant?: 'default' | 'ghost' | 'outline'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    showLabel?: boolean
}

export function ArchiveOrderButton({
    orderId,
    isArchived = false,
    onArchive,
    onUnarchive,
    variant = 'ghost',
    size = 'sm',
    showLabel = true
}: ArchiveOrderButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleConfirm = async () => {
        setIsLoading(true)
        setMessage(null)
        try {
            if (isArchived) {
                await onUnarchive(orderId)
                setMessage({ type: 'success', text: 'تم إلغاء الأرشفة بنجاح' })
            } else {
                await onArchive(orderId)
                setMessage({ type: 'success', text: 'تم الأرشفة بنجاح' })
            }
            setTimeout(() => {
                setIsOpen(false)
                setMessage(null)
            }, 1000)
        } catch (error) {
            setMessage({
                type: 'error',
                text: isArchived ? 'فشل إلغاء الأرشفة' : 'فشل الأرشفة'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setIsOpen(true)}
                className={`gap-2 ${isArchived
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                    }`}
            >
                {isArchived ? (
                    <ArchiveRestore className="h-4 w-4" />
                ) : (
                    <Archive className="h-4 w-4" />
                )}
                {showLabel && (
                    <span className="text-xs">
                        {isArchived ? 'إلغاء الأرشفة' : 'أرشفة'}
                    </span>
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {isArchived ? (
                                <>
                                    <ArchiveRestore className="h-5 w-5 text-blue-600" />
                                    إلغاء أرشفة الطلب
                                </>
                            ) : (
                                <>
                                    <Archive className="h-5 w-5 text-gray-600" />
                                    أرشفة الطلب
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-right">
                            {isArchived ? (
                                <>
                                    هل أنت متأكد من إلغاء أرشفة هذا الطلب؟
                                    <br />
                                    سيتم إعادة الطلب إلى القائمة النشطة.
                                </>
                            ) : (
                                <>
                                    هل أنت متأكد من أرشفة هذا الطلب؟
                                    <br />
                                    سيتم نقل الطلب إلى الأرشيف ولن يظهر في القائمة النشطة.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            إلغاء
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={
                                isArchived
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-600 hover:bg-gray-700'
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري المعالجة...
                                </>
                            ) : (
                                isArchived ? 'إلغاء الأرشفة' : 'أرشفة'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
