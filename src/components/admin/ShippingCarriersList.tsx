'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle, Edit } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface ShippingCarrier {
    id: number
    name: string
    api_key: string
    api_url: string
    is_active: boolean
    created_at?: string
}

export function ShippingCarriersList() {
    const [carriers, setCarriers] = useState<ShippingCarrier[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editingCarrier, setEditingCarrier] = useState<ShippingCarrier | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        api_key: '',
        api_url: 'https://anderson-ecommerce.ecotrack.dz'
    })

    const supabase = createClient()

    useEffect(() => {
        fetchCarriers()
    }, [])

    const fetchCarriers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('shipping_carriers')
            .select('*')
            .order('id', { ascending: true })

        if (error) {
            console.error('Error fetching carriers:', error)
        } else {
            setCarriers(data || [])
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!formData.name || !formData.api_key || !formData.api_url) {
            alert('يرجى ملء جميع الحقول')
            return
        }

        setIsSaving(true)

        try {
            if (editingCarrier) {
                // Update existing
                const { error } = await supabase
                    .from('shipping_carriers')
                    .update({
                        name: formData.name,
                        api_key: formData.api_key,
                        api_url: formData.api_url
                    })
                    .eq('id', editingCarrier.id)

                if (error) throw error
            } else {
                // Create new
                // If this is the first carrier, make it active by default
                const isFirst = carriers.length === 0

                const { error } = await supabase
                    .from('shipping_carriers')
                    .insert({
                        name: formData.name,
                        api_key: formData.api_key,
                        api_url: formData.api_url,
                        is_active: isFirst
                    })

                if (error) throw error
            }

            setIsDialogOpen(false)
            resetForm()
            fetchCarriers()
        } catch (error) {
            console.error('Error saving carrier:', error)
            alert('حدث خطأ أثناء الحفظ')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا الحساب؟')) return

        const { error } = await supabase
            .from('shipping_carriers')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting:', error)
            alert(`فشل الحذف: ${error.message}`)
        } else {
            fetchCarriers()
        }
    }

    const handleActivate = async (id: number) => {
        setIsSaving(true)
        try {
            // First set all to inactive
            await supabase
                .from('shipping_carriers')
                .update({ is_active: false })
                .neq('id', 0) // Update all

            // Set selected to active
            await supabase
                .from('shipping_carriers')
                .update({ is_active: true })
                .eq('id', id)

            fetchCarriers()
        } catch (error) {
            console.error('Error activating:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const startEdit = (carrier: ShippingCarrier) => {
        setEditingCarrier(carrier)
        setFormData({
            name: carrier.name,
            api_key: carrier.api_key,
            api_url: carrier.api_url
        })
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setEditingCarrier(null)
        setFormData({
            name: '',
            api_key: '',
            api_url: 'https://anderson-ecommerce.ecotrack.dz'
        })
    }

    return (
        <Card className="border-0 shadow-sm mb-8 bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl text-indigo-900">حسابات شركات الشحن (EcoTrack)</CardTitle>
                        <CardDescription>إدارة حسابات متعددة للتبديل بينها بسهولة</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) resetForm()
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="w-4 h-4 ml-2" />
                                إضافة حساب جديد
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCarrier ? 'تعديل الحساب' : 'إضافة حساب جديد'}</DialogTitle>
                                <DialogDescription>
                                    أدخل معلومات API الخاصة بحساب EcoTrack
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>اسم الحساب (للتمييز)</Label>
                                    <Input
                                        placeholder="مثلاً: حساب وهران الرئيسي"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>رابط API URL</Label>
                                    <Input
                                        placeholder="https://..."
                                        value={formData.api_url}
                                        onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter API Key..."
                                        value={formData.api_key}
                                        onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                                    حفظ
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                ) : carriers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>لا توجد حسابات مضافة حالياً</p>
                        <p className="text-sm">أضف حسابك الأول للبدء في الشحن</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {carriers.map((carrier) => (
                            <div
                                key={carrier.id}
                                className={`relative p-4 rounded-lg border-2 transition-all ${carrier.is_active
                                    ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                    }`}
                            >
                                {carrier.is_active && (
                                    <div className="absolute top-2 left-3">
                                        <Badge className="bg-green-600 hover:bg-green-700">نشط حالياً</Badge>
                                    </div>
                                )}

                                <div className="mt-6 space-y-2">
                                    <h3 className="font-bold text-lg">{carrier.name}</h3>
                                    <p className="text-xs text-muted-foreground truncate" dir="ltr">
                                        {carrier.api_url}
                                    </p>
                                    <p className="text-xs font-mono bg-gray-100 p-1 rounded w-fit">
                                        {carrier.api_key.substring(0, 8)}...
                                    </p>
                                </div>

                                <div className="mt-4 flex gap-2 pt-4 border-t">
                                    {!carrier.is_active && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full"
                                            onClick={() => handleActivate(carrier.id)}
                                            disabled={isSaving}
                                        >
                                            <CheckCircle2 className="w-4 h-4 ml-1" />
                                            تفعيل
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1"
                                        onClick={() => startEdit(carrier)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                                        onClick={() => handleDelete(carrier.id)}
                                        title="حذف الحساب"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
