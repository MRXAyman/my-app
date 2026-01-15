'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from '@/utils/supabase/client'
import { MultiImageUpload } from '@/components/admin/MultiImageUpload'
import { ProductVariantsComponent, ProductVariants } from '@/components/admin/ProductVariants'
import { BundleOffersComponent } from '@/components/admin/BundleOffers'
import { BundleOffer } from '@/types/bundle'

const productSchema = z.object({
    title: z.string().min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل'),
    description: z.string().optional(),
    category_id: z.string().min(1, 'يرجى اختيار الصنف'),
    is_active: z.boolean(),
    // For simple products - these will be ignored if variants are used
    price: z.number().min(0),
    sale_price: z.number().min(0),
    stock: z.number().min(0),
})

interface ProductFormProps {
    initialData?: any
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<string[]>(initialData?.images || [])
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
    const [variants, setVariants] = useState<ProductVariants | null>(initialData?.variants || null)
    const [bundleOffers, setBundleOffers] = useState<BundleOffer[]>(initialData?.bundle_offers || [])
    const supabase = createClient()

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            category_id: initialData?.category_id?.toString() || '',
            is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
            price: initialData?.price || 0,
            sale_price: initialData?.sale_price || 0,
            stock: initialData?.stock || 0,
        },
    })

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient()
            const { data } = await supabase.from('categories').select('id, name')
            if (data) {
                setCategories(data)
            }
        }
        fetchCategories()
    }, [])

    async function onSubmit(values: z.infer<typeof productSchema>) {
        setIsSubmitting(true)
        try {
            // Validation
            if (images.length === 0) {
                alert('يرجى رفع صورة واحدة على الأقل')
                setIsSubmitting(false)
                return
            }

            // Validate variants
            if (variants && variants.items.length === 0) {
                alert('يرجى إضافة متغيرات للمنتج أو اختيار "منتج بسيط"')
                setIsSubmitting(false)
                return
            }

            const supabase = createClient()

            // Prepare product data
            const productData: any = {
                title: values.title,
                description: values.description,
                category_id: parseInt(values.category_id),
                images: images,
                slug: Date.now().toString(),
                is_active: values.is_active,
                variants: variants,
                bundle_offers: bundleOffers.length > 0 ? bundleOffers : null,
            }

            // For simple products, use the form values
            if (!variants) {
                productData.price = values.price || 0
                productData.sale_price = values.sale_price || 0
                productData.stock = values.stock || 0
                productData.in_stock = (values.stock || 0) > 0
            } else {
                // For products with variants, calculate totals
                const totalStock = variants.items.reduce((sum, item) => sum + item.stock, 0)
                const minPrice = Math.min(...variants.items.map(item => item.sale_price || item.price))

                productData.price = minPrice
                productData.sale_price = 0
                productData.stock = totalStock
                productData.in_stock = totalStock > 0
            }

            let error;

            if (initialData?.id) {
                // Update existing product
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                // Insert new product
                const { error: insertError } = await supabase
                    .from('products')
                    .insert(productData)
                error = insertError
            }

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

    const isSimpleProduct = !variants

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            املأ جميع الحقول المطلوبة لإضافة منتج جديد إلى المتجر
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Images Upload */}
                            <div className="space-y-2">
                                <FormLabel className="text-base font-semibold">صور المنتج *</FormLabel>
                                <FormDescription>
                                    ارفع صور المنتج (الصورة الأولى ستكون الصورة الرئيسية)
                                </FormDescription>
                                <MultiImageUpload
                                    images={images}
                                    onChange={setImages}
                                    maxImages={10}
                                />
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>اسم المنتج *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: ساعة يد رجالية..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الصنف *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="flex-row-reverse">
                                                        <SelectValue placeholder="اختر الصنف" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()} className="justify-end">
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50/50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">تفعيل المنتج</FormLabel>
                                                <FormDescription>
                                                    سيظهر المنتج في المتجر للعملاء
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
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
                                            <Textarea
                                                placeholder="وصف تفصيلي للمنتج..."
                                                className="h-32 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Product Variants */}
                            <ProductVariantsComponent
                                value={variants}
                                onChange={setVariants}
                                basePrice={form.watch('price') || 0}
                                baseSalePrice={form.watch('sale_price')}
                                baseStock={form.watch('stock') || 0}
                                productImages={images}
                            />

                            {/* Simple Product Fields */}
                            {isSimpleProduct && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border rounded-lg bg-blue-50/30">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>السعر (د.ج) *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sale_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>سعر التخفيض (اختياري)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        value={field.value || ''}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
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
                                                <FormLabel>الكمية *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Bundle Offers */}
                            <BundleOffersComponent
                                value={bundleOffers}
                                onChange={setBundleOffers}
                                basePrice={
                                    variants && variants.items.length > 0
                                        ? Math.min(...variants.items.map(item => item.sale_price || item.price))
                                        : (form.watch('price') || 0)
                                }
                            />

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    إلغاء
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 min-w-[120px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        initialData ? 'حفظ التعديلات' : 'حفظ المنتج'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
