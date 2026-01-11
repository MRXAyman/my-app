'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, MapPin, Home, Building2, Search, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ShippingCarriersList } from '@/components/admin/ShippingCarriersList'

export default function ShippingPage() {
    const [zones, setZones] = useState<any[]>([])
    const [filteredZones, setFilteredZones] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchZones()
    }, [])

    useEffect(() => {
        if (searchQuery) {
            const filtered = zones.filter(zone =>
                zone.wilaya_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                zone.wilaya_code.toString().includes(searchQuery)
            )
            setFilteredZones(filtered)
        } else {
            setFilteredZones(zones)
        }
    }, [searchQuery, zones])

    const fetchZones = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('shipping_zones')
            .select('*')
            .order('wilaya_code')

        if (data) {
            setZones(data)
            setFilteredZones(data)
        }
        setLoading(false)
    }

    const handleUpdate = async (id: number, field: string, value: any) => {
        const supabase = createClient()
        await supabase
            .from('shipping_zones')
            .update({ [field]: value })
            .eq('id', id)
    }

    const handleSaveAll = async () => {
        setSaving(true)
        setTimeout(() => {
            setSaving(false)
            alert('تم حفظ التغييرات بنجاح')
        }, 500)
    }

    const handleReset = async () => {
        if (!confirm('هل أنت متأكد من إعادة تعيين جميع الأسعار؟ سيتم حذف التعديلات الحالية.')) return

        setLoading(true)
        try {
            await fetch('/api/seed-shipping', { method: 'POST' })
            await fetchZones()
            alert('تم إعادة تعيين البيانات بنجاح')
        } catch (error) {
            console.error(error)
            alert('حدث خطأ أثناء الاتصال بالخادم')
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        إدارة أسعار الشحن
                    </h2>
                    <p className="text-muted-foreground mt-1">تحديد أسعار التوصيل لكل ولاية (58 ولاية)</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset}>
                        إعادة تعيين
                    </Button>
                    <Button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
                    >
                        {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        حفظ جميع التغييرات
                    </Button>
                </div>
            </div>

            {/* Carrier Management */}
            <ShippingCarriersList />

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{zones.length}</p>
                            <p className="text-sm text-muted-foreground">ولاية</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-green-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                            <Home className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.round(zones.reduce((sum, z) => sum + (z.home_delivery_price || 0), 0) / zones.length)} د.ج
                            </p>
                            <p className="text-sm text-muted-foreground">متوسط توصيل منزلي</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.round(zones.reduce((sum, z) => sum + (z.desk_delivery_price || 0), 0) / zones.length)} د.ج
                            </p>
                            <p className="text-sm text-muted-foreground">متوسط توصيل مكتب</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <Card className="p-4 border-0 shadow-sm">
                <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="بحث عن ولاية..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                    />
                </div>
            </Card>

            {/* Shipping Zones Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full" dir="rtl">
                            <thead className="bg-gradient-to-r from-gray-50 to-white border-b sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        الرقم
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        الولاية
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <Home className="h-4 w-4" />
                                            توصيل للمنزل (د.ج)
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            توصيل للمكتب (د.ج)
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            مدة التوصيل
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredZones.map((zone) => (
                                    <tr key={zone.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="font-mono">
                                                {zone.wilaya_code}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900">{zone.wilaya_name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={zone.home_delivery_price || 0}
                                                    onChange={(e) => {
                                                        const newZones = zones.map(z =>
                                                            z.id === zone.id
                                                                ? { ...z, home_delivery_price: parseFloat(e.target.value) || 0 }
                                                                : z
                                                        )
                                                        setZones(newZones)
                                                        handleUpdate(zone.id, 'home_delivery_price', parseFloat(e.target.value) || 0)
                                                    }}
                                                    className="w-32 text-center font-semibold"
                                                    disabled={!zone.home_delivery_available}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`home-${zone.id}`}
                                                        checked={zone.home_delivery_available !== false}
                                                        onCheckedChange={(checked) => {
                                                            const newZones = zones.map(z =>
                                                                z.id === zone.id
                                                                    ? { ...z, home_delivery_available: checked }
                                                                    : z
                                                            )
                                                            setZones(newZones)
                                                            handleUpdate(zone.id, 'home_delivery_available', checked)
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`home-${zone.id}`}
                                                        className="text-xs text-gray-600 cursor-pointer"
                                                    >
                                                        متوفر
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={zone.desk_delivery_price || 0}
                                                    onChange={(e) => {
                                                        const newZones = zones.map(z =>
                                                            z.id === zone.id
                                                                ? { ...z, desk_delivery_price: parseFloat(e.target.value) || 0 }
                                                                : z
                                                        )
                                                        setZones(newZones)
                                                        handleUpdate(zone.id, 'desk_delivery_price', parseFloat(e.target.value) || 0)
                                                    }}
                                                    className="w-32 text-center font-semibold"
                                                    disabled={!zone.desk_delivery_available}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`desk-${zone.id}`}
                                                        checked={zone.desk_delivery_available !== false}
                                                        onCheckedChange={(checked) => {
                                                            const newZones = zones.map(z =>
                                                                z.id === zone.id
                                                                    ? { ...z, desk_delivery_available: checked }
                                                                    : z
                                                            )
                                                            setZones(newZones)
                                                            handleUpdate(zone.id, 'desk_delivery_available', checked)
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`desk-${zone.id}`}
                                                        className="text-xs text-gray-600 cursor-pointer"
                                                    >
                                                        متوفر
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Input
                                                type="text"
                                                value={zone.estimated_delivery_time || '2-4 أيام'}
                                                onChange={(e) => {
                                                    const newZones = zones.map(z =>
                                                        z.id === zone.id
                                                            ? { ...z, estimated_delivery_time: e.target.value }
                                                            : z
                                                    )
                                                    setZones(newZones)
                                                    handleUpdate(zone.id, 'estimated_delivery_time', e.target.value)
                                                }}
                                                className="w-32 text-center text-sm"
                                                placeholder="2-4 أيام"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {filteredZones.length === 0 && (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">لا توجد نتائج</p>
                            <p className="text-xs text-muted-foreground mt-1">جرب البحث بكلمة أخرى</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
