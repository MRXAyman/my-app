'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { createClient } from '@/utils/supabase/client'
import { uploadProductImage } from '@/utils/supabase/storage'

const productSchema = z.object({
    title: z.string().min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل'),
    price: z.preprocess((val) => Number(val), z.number().min(1, 'السعر مطلوب')),
    description: z.string().optional(),
    stock: z.preprocess((val) => Number(val), z.number().min(0).default(0)),
    category_id: z.string().optional(), // For now optional
})

export function ProductForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            price: 0,
            description: '',
            stock: 10,
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    async function onSubmit(values: z.infer<typeof productSchema>) {
        setIsSubmitting(true)
        try {
            let imageUrl = null
            if (imageFile) {
                const result = await uploadProductImage(imageFile)
                if (result.error) {
                    throw result.error
                }
                imageUrl = result.url
            }

            const supabase = createClient()
            const { error } = await supabase.from('products').insert({
                title: values.title,
                price: values.price,
                description: values.description,
                stock: values.stock,
                images: imageUrl ? [imageUrl] : [],
                slug: values.title.toLowerCase().replace(/ /g, '-') + '-' + Date.now(), // Simple slug generation
            })

            if (error) throw error

            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error('Error creating product:', error)
            alert('حدث خطأ أثناء إضافة المنتج: ' + (error as any)?.message || 'خطأ غير معروف')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl bg-white p-6 rounded-lg border shadow-sm" dir="rtl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <FormLabel>صورة المنتج</FormLabel>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                            {imagePreview ? (
                                <div className="relative w-full h-48">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setImageFile(null)
                                            setImagePreview(null)
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">اضغط لرفع صورة</span>
                                </>
                            )}
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>اسم المنتج</FormLabel>
                                <FormControl>
                                    <Input placeholder="مثال: ساعة يد..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>السعر (د.ج)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المخزون</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الوصف</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="وصف تفصيلي للمنتج..." className="h-32" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                'حفظ المنتج'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
