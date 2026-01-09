'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function UpdateSlugsPage() {
    const [isUpdating, setIsUpdating] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)

    async function updateAllSlugs() {
        setIsUpdating(true)
        setResult(null)

        try {
            const supabase = createClient()

            // Get all products
            const { data: products, error: fetchError } = await supabase
                .from('products')
                .select('id, title, slug')

            if (fetchError) throw fetchError

            if (!products || products.length === 0) {
                setResult({ success: false, message: 'لا توجد منتجات للتحديث' })
                setIsUpdating(false)
                return
            }

            // Update each product
            let updatedCount = 0
            for (const product of products) {
                // Only update if slug contains Arabic or special characters
                if (product.slug && (product.slug.includes('-') || /[\u0600-\u06FF]/.test(product.slug))) {
                    const { error: updateError } = await supabase
                        .from('products')
                        .update({ slug: product.id.toString() })
                        .eq('id', product.id)

                    if (!updateError) {
                        updatedCount++
                    }
                }
            }

            setResult({
                success: true,
                message: `تم تحديث ${updatedCount} منتج بنجاح`,
                count: updatedCount
            })
        } catch (error) {
            console.error('Error updating slugs:', error)
            setResult({
                success: false,
                message: `حدث خطأ: ${(error as any)?.message || 'خطأ غير معروف'}`
            })
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">تحديث روابط المنتجات</h1>
                    <p className="text-gray-600 mb-6">
                        هذه الأداة ستقوم بتحديث جميع روابط المنتجات (slugs) لإصلاح مشكلة 404.
                        سيتم استبدال الروابط التي تحتوي على نص عربي بأرقام فقط.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>تنبيه:</strong> هذه العملية ستقوم بتحديث جميع المنتجات الموجودة في قاعدة البيانات.
                            تأكد من أنك تريد المتابعة.
                        </p>
                    </div>

                    <Button
                        onClick={updateAllSlugs}
                        disabled={isUpdating}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري التحديث...
                            </>
                        ) : (
                            'تحديث جميع الروابط'
                        )}
                    </Button>

                    {result && (
                        <div className={`mt-6 p-4 rounded-lg border ${result.success
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-center gap-2">
                                {result.success ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                )}
                                <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                    {result.message}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
