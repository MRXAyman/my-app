'use client'

import { useState } from 'react'
import { Plus, X, Package, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { BundleOffer } from '@/types/bundle'

interface BundleOffersProps {
    value: BundleOffer[]
    onChange: (offers: BundleOffer[]) => void
    basePrice?: number
}

export function BundleOffersComponent({ value, onChange, basePrice = 0 }: BundleOffersProps) {
    const [quantity, setQuantity] = useState<number>(2)
    const [price, setPrice] = useState<number>(0)
    const [title, setTitle] = useState<string>('')

    const handleAddOffer = () => {
        // Check if base price is set
        if (!basePrice || basePrice <= 0) {
            alert('يجب تحديد سعر المنتج أولاً قبل إضافة العروض الخاصة')
            return
        }

        if (quantity < 2) {
            alert('الكمية يجب أن تكون 2 على الأقل')
            return
        }
        if (price <= 0) {
            alert('السعر يجب أن يكون أكبر من 0')
            return
        }

        const regularTotal = basePrice * quantity
        if (price >= regularTotal) {
            alert(`سعر العرض يجب أن يكون أقل من السعر العادي (${regularTotal.toLocaleString()} د.ج)`)
            return
        }

        const newOffer: BundleOffer = {
            quantity,
            price,
            title: title.trim() || `عرض ${quantity} قطع`
        }

        onChange([...value, newOffer])

        // Reset form
        setQuantity(quantity + 1)
        setPrice(0)
        setTitle('')
    }

    const handleRemoveOffer = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const handleUpdateOffer = (index: number, field: keyof BundleOffer, newValue: any) => {
        const updated = [...value]
        updated[index] = { ...updated[index], [field]: newValue }
        onChange(updated)
    }

    const calculateSavings = (offer: BundleOffer) => {
        const regularTotal = basePrice * offer.quantity
        const savings = regularTotal - offer.price
        const percentage = ((savings / regularTotal) * 100).toFixed(0)
        return { savings, percentage }
    }

    return (
        <div className="space-y-6 border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
            <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                <Label className="text-base font-semibold text-gray-900">العروض الخاصة (Bundle Offers)</Label>
            </div>
            <p className="text-sm text-muted-foreground">
                أضف عروض خاصة لتشجيع العملاء على شراء كميات أكبر بأسعار مخفضة
            </p>

            {/* Warning if base price is not set */}
            {(!basePrice || basePrice <= 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-yellow-800">يجب تحديد سعر المنتج أولاً</p>
                        <p className="text-sm text-yellow-700 mt-1">
                            لإضافة عروض خاصة، يجب عليك أولاً تحديد السعر الأساسي للمنتج في قسم "منتج بسيط" أو في "المتغيرات" أعلاه.
                        </p>
                    </div>
                </div>
            )}

            {/* Add New Offer Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border-2 border-dashed border-purple-200">
                <div className="space-y-2">
                    <Label className="text-sm">الكمية</Label>
                    <Input
                        type="number"
                        min="2"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="2"
                        className="bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm">السعر (د.ج)</Label>
                    <Input
                        type="number"
                        min="0"
                        value={price || ''}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="8000"
                        className="bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm">العنوان (اختياري)</Label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="عرض خاص"
                        className="bg-white"
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        type="button"
                        onClick={handleAddOffer}
                        disabled={!basePrice || basePrice <= 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة عرض
                    </Button>
                </div>
            </div>

            {/* Existing Offers Table */}
            {value.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-base font-semibold">العروض المضافة ({value.length})</Label>
                    <div className="border rounded-lg overflow-hidden bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-purple-50">
                                    <TableHead className="text-right font-semibold">العنوان</TableHead>
                                    <TableHead className="text-right font-semibold">الكمية</TableHead>
                                    <TableHead className="text-right font-semibold">السعر</TableHead>
                                    <TableHead className="text-right font-semibold">السعر العادي</TableHead>
                                    <TableHead className="text-right font-semibold">التوفير</TableHead>
                                    <TableHead className="text-right font-semibold">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {value.map((offer, index) => {
                                    const { savings, percentage } = calculateSavings(offer)
                                    const regularTotal = basePrice * offer.quantity

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    value={offer.title || ''}
                                                    onChange={(e) => handleUpdateOffer(index, 'title', e.target.value)}
                                                    className="w-full"
                                                    placeholder={`عرض ${offer.quantity} قطع`}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="2"
                                                    value={offer.quantity}
                                                    onChange={(e) => handleUpdateOffer(index, 'quantity', Number(e.target.value))}
                                                    className="w-20"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={offer.price}
                                                    onChange={(e) => handleUpdateOffer(index, 'price', Number(e.target.value))}
                                                    className="w-28"
                                                />
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {regularTotal.toLocaleString()} د.ج
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                                        <Tag className="h-3 w-3 ml-1" />
                                                        {savings.toLocaleString()} د.ج ({percentage}%)
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveOffer(index)}
                                                    className="hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {value.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>لم يتم إضافة أي عروض بعد</p>
                    <p className="text-sm">استخدم النموذج أعلاه لإضافة عرض خاص</p>
                </div>
            )}
        </div>
    )
}
