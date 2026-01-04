'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Save } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

type ShippingZone = {
    id: number
    wilaya_code: number
    wilaya_name: string
    home_delivery_price: number
    desk_delivery_price: number
}

interface ShippingRatesEditorProps {
    initialZones: ShippingZone[]
}

export function ShippingRatesEditor({ initialZones }: ShippingRatesEditorProps) {
    const [zones, setZones] = useState(initialZones)
    const [loading, setLoading] = useState(false)
    const [dirty, setDirty] = useState(false)

    const handlePriceChange = (id: number, field: 'home_delivery_price' | 'desk_delivery_price', value: string) => {
        const numValue = parseInt(value) || 0
        setZones(prev => prev.map(z => z.id === id ? { ...z, [field]: numValue } : z))
        setDirty(true)
    }

    const saveChanges = async () => {
        setLoading(true)
        const supabase = createClient()

        // In a real app, we would only update changed rows. 
        // Supabase upsert is efficient.
        const updates = zones.map(({ id, home_delivery_price, desk_delivery_price }) => ({
            id,
            home_delivery_price,
            desk_delivery_price,
            updated_at: new Date().toISOString()
        }))

        const { error } = await supabase.from('shipping_zones').upsert(updates)

        if (error) {
            console.error('Error updating zones:', error)
            alert('حدث خطأ أثناء حفظ التغييرات')
        } else {
            alert('تم حفظ الأسعار بنجاح')
            setDirty(false)
        }
        setLoading(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end sticky top-0 bg-gray-100 z-10 py-2 border-b">
                <Button onClick={saveChanges} disabled={!dirty || loading}>
                    {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                    حفظ التعديلات
                </Button>
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-[100px]">الرمز</TableHead>
                            <TableHead className="text-right">الولاية</TableHead>
                            <TableHead className="text-right">توصيل منزلي (د.ج)</TableHead>
                            <TableHead className="text-right">توصيل مكتب (د.ج)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {zones.map((zone) => (
                            <TableRow key={zone.id}>
                                <TableCell className="text-center font-medium">{zone.wilaya_code}</TableCell>
                                <TableCell>{zone.wilaya_name}</TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={zone.home_delivery_price}
                                        onChange={(e) => handlePriceChange(zone.id, 'home_delivery_price', e.target.value)}
                                        className="w-32"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={zone.desk_delivery_price}
                                        onChange={(e) => handlePriceChange(zone.id, 'desk_delivery_price', e.target.value)}
                                        className="w-32"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
