'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function AdminSettingsPage() {
    const [pixelId, setPixelId] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetchSettings() {
            const supabase = createClient()
            const { data } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'facebook_pixel_id')
                .single()

            if (data) {
                setPixelId(data.value || '')
            }
            setLoading(false)
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()

        // Check if row exists first or upsert logic
        // We assume the row might not exist, so upsert is best.
        const { error } = await supabase
            .from('settings')
            .upsert({ key: 'facebook_pixel_id', value: pixelId })

        if (error) {
            console.error('Error saving settings:', error)
            alert('حدث خطأ أثناء حفظ الإعدادات')
        } else {
            alert('تم حفظ الإعدادات بنجاح')
        }
        setSaving(false)
    }

    if (loading) {
        return <div>جاري التحميل...</div>
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">الإعدادات العامة</h2>

            <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                <h3 className="text-xl font-semibold">تتبع الفيسبوك (Facebook Pixel)</h3>
                <p className="text-sm text-gray-500">
                    أدخل معرف البيكسل (Pixel ID) الخاص بك ليتم تفعيل التتبع تلقائياً في المتجر.
                </p>

                <div className="space-y-2">
                    <Label htmlFor="pixel_id" className="">Facebook Pixel ID</Label>
                    <Input
                        id="pixel_id"
                        placeholder="Ex: 123456789012345"
                        value={pixelId}
                        onChange={(e) => setPixelId(e.target.value)}
                    />
                </div>

                <div className="pt-2 flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        حفظ التغييرات
                    </Button>
                </div>
            </div>
        </div>
    )
}
