'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { Store, Loader2, Save, CheckCircle2 } from 'lucide-react'

interface BrandSettings {
    id: string
    site_name: string
    logo_url: string | null
    favicon_url: string | null
}

export function BrandSettingsTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    const [siteName, setSiteName] = useState('')
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [faviconFile, setFaviconFile] = useState<File | null>(null)
    const [deleteLogo, setDeleteLogo] = useState(false)
    const [deleteFavicon, setDeleteFavicon] = useState(false)
    const [currentSettings, setCurrentSettings] = useState<BrandSettings | null>(null)

    useEffect(() => {
        fetchBrandSettings()
    }, [])

    const fetchBrandSettings = async () => {
        try {
            const response = await fetch('/api/brand')
            if (response.ok) {
                const data = await response.json()
                setCurrentSettings(data)
                setSiteName(data.site_name || '')
                setDeleteLogo(false)
                setDeleteFavicon(false)
            }
        } catch (error) {
            console.error('Error fetching brand settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setSuccess(false)

        try {
            const formData = new FormData()
            formData.append('site_name', siteName)

            if (logoFile) {
                formData.append('logo', logoFile)
            }

            if (faviconFile) {
                formData.append('favicon', faviconFile)
            }

            if (deleteLogo) {
                formData.append('delete_logo', 'true')
            }

            if (deleteFavicon) {
                formData.append('delete_favicon', 'true')
            }

            const response = await fetch('/api/brand', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const data = await response.json()
                setCurrentSettings(data)
                setLogoFile(null)
                setFaviconFile(null)
                setSuccess(true)

                // Reload page after 1.5 seconds to reflect changes
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            } else {
                alert('حدث خطأ أثناء حفظ الإعدادات')
            }
        } catch (error) {
            console.error('Error saving brand settings:', error)
            alert('حدث خطأ أثناء حفظ الإعدادات')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-12 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-0 shadow-lg animate-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-teal-500/10 rounded-full blur-3xl" />
            <CardHeader className="bg-gradient-to-r from-sky-50/50 to-teal-50/50 border-b relative">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">إعدادات العلامة التجارية</CardTitle>
                        <CardDescription className="mt-1">
                            إدارة اسم الموقع، الشعار، والأيقونة المصغرة
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8 relative">
                {/* Site Name */}
                <div className="space-y-3 max-w-md">
                    <Label htmlFor="site_name" className="text-sm font-semibold">اسم الموقع</Label>
                    <Input
                        id="site_name"
                        placeholder="مثال: DzShop - متجر إلكتروني جزائري"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                        سيظهر هذا الاسم في عنوان المتصفح وفي ترويسة الموقع
                    </p>
                </div>

                {/* Logo Upload */}
                <div className="max-w-md">
                    <ImageUpload
                        label="شعار الموقع (Logo)"
                        currentImage={currentSettings?.logo_url}
                        onImageSelect={(file) => {
                            setLogoFile(file)
                            if (file) setDeleteLogo(false)
                        }}
                        onRemove={() => setDeleteLogo(true)}
                        maxSize={2}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        الأبعاد الموصى بها: 200x200 بكسل أو أعلى
                    </p>
                </div>

                {/* Favicon Upload */}
                <div className="max-w-md">
                    <ImageUpload
                        label="أيقونة المتصفح (Favicon)"
                        currentImage={currentSettings?.favicon_url}
                        onImageSelect={(file) => {
                            setFaviconFile(file)
                            if (file) setDeleteFavicon(false)
                        }}
                        onRemove={() => setDeleteFavicon(true)}
                        maxSize={1}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        الأبعاد الموصى بها: 32x32 أو 64x64 بكسل
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">تم حفظ الإعدادات بنجاح! جاري تحديث الصفحة...</span>
                    </div>
                )}

                {/* Save Button */}
                <div className="pt-4 flex justify-end border-t">
                    <Button
                        onClick={handleSave}
                        disabled={saving || !siteName.trim()}
                        className="min-w-[140px] bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 shadow-lg shadow-sky-500/25"
                    >
                        {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        {!saving && <Save className="ml-2 h-4 w-4" />}
                        حفظ التغييرات
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
