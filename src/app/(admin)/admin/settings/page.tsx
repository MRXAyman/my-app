'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Store, FileCode, Truck, Settings as SettingsIcon, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('integrations')

    // Pixel State
    const [pixelId, setPixelId] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetchSettings() {
            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from('settings')
                    .select('value')
                    .eq('key', 'facebook_pixel_id')
                    .single()

                if (data) {
                    setPixelId(data.value || '')
                }
            } catch (error) {
                console.error("Error fetching settings:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSavePixel = async () => {
        setSaving(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('settings')
            .upsert({ key: 'facebook_pixel_id', value: pixelId }, { onConflict: 'key' })

        if (error) {
            console.error('Error saving settings:', error)
            alert('حدث خطأ أثناء حفظ الإعدادات')
        } else {
            alert('تم حفظ الإعدادات بنجاح')
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const tabs = [
        { id: 'general', label: 'عام', icon: Store, gradient: 'from-blue-500 to-cyan-600' },
        { id: 'integrations', label: 'التكاملات', icon: FileCode, gradient: 'from-purple-500 to-pink-600' },
        { id: 'shipping', label: 'الشحن', icon: Truck, gradient: 'from-green-500 to-emerald-600' },
    ]

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    الإعدادات
                </h2>
                <p className="text-muted-foreground mt-1">إدارة إعدادات المتجر والتكاملات الخارجية</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap rounded-t-lg",
                            activeTab === tab.id
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="grid gap-6">
                {/* Integrations Tab */}
                {activeTab === 'integrations' && (
                    <Card className="border-0 shadow-lg animate-in slide-in-from-bottom-2 duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
                        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b relative">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                                    <FileCode className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">تتبع الفيسبوك (Facebook Pixel)</CardTitle>
                                    <CardDescription className="mt-1">
                                        أدخل معرف البيكسل (Pixel ID) الخاص بك ليتم تفعيل التتبع تلقائياً في المتجر
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 relative">
                            <div className="space-y-3 max-w-md">
                                <Label htmlFor="pixel_id" className="text-sm font-semibold">Facebook Pixel ID</Label>
                                <Input
                                    id="pixel_id"
                                    placeholder="مثال: 123456789012345"
                                    value={pixelId}
                                    onChange={(e) => setPixelId(e.target.value)}
                                    className="font-mono text-sm h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    يمكنك العثور على معرف البيكسل في إعدادات مدير الأحداث في فيسبوك
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    onClick={handleSavePixel}
                                    disabled={saving}
                                    className="min-w-[140px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                                >
                                    {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                    {!saving && <Save className="ml-2 h-4 w-4" />}
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* General Tab */}
                {activeTab === 'general' && (
                    <Card className="border-0 shadow-lg animate-in slide-in-from-bottom-2 duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
                        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-b relative">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                                    <Store className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">إعدادات المتجر العامة</CardTitle>
                                    <CardDescription className="mt-1">
                                        معلومات المتجر والإعدادات الأساسية
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 relative">
                            <div className="text-center py-12 text-gray-500">
                                <Store className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">إعدادات المتجر العامة قريباً...</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    سيتم إضافة إعدادات اسم المتجر، الشعار، ومعلومات الاتصال
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Shipping Tab */}
                {activeTab === 'shipping' && (
                    <Card className="border-0 shadow-lg animate-in slide-in-from-bottom-2 duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
                        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b relative">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                    <Truck className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">إعدادات الشحن</CardTitle>
                                    <CardDescription className="mt-1">
                                        تكوين خيارات الشحن والتوصيل
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 relative">
                            <div className="text-center py-12 text-gray-500">
                                <Truck className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">إعدادات الشحن قريباً...</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    يمكنك إدارة أسعار الشحن من صفحة الشحن
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
