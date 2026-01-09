'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Home, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { wilayas } from '@/lib/algeria-data'
import { useShipping } from '@/hooks/use-shipping'
import { createClient } from '@/utils/supabase/client'
import { BundleOffer, BundleItem } from '@/types/bundle'

const phoneRegex = /^(05|06|07)[0-9]{8}$/

const formSchema = z.object({
    fullName: z.string().min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),
    phone: z.string().regex(phoneRegex, { message: 'رقم الهاتف غير صالح (يجب أن يبدأ ب 05، 06 أو 07)' }),
    wilaya: z.string().min(1, { message: 'يرجى اختيار الولاية' }),
    commune: z.string().min(1, { message: 'يرجى كتابة البلدية' }),
    deliveryType: z.enum(['home', 'desk']),
})

interface VariantItem {
    color?: string
    size?: string
    price: number
    sale_price?: number
    stock: number
    sku?: string
}

interface CheckoutFormProps {
    productId: number
    productPrice: number
    productTitle: string
    selectedVariant?: VariantItem | null
    selectedBundle?: BundleOffer | null
    bundleItems?: BundleItem[]
}

export function CheckoutForm({ productId, productPrice, productTitle, selectedVariant, selectedBundle, bundleItems = [] }: CheckoutFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            wilaya: '',
            commune: '',
            deliveryType: 'home',
        },
    })

    // Watch for changes
    const selectedWilaya = form.watch('wilaya')
    const selectedDeliveryType = form.watch('deliveryType')

    // Custom hook to fetch shipping rates. 
    // Make sure useShipping handles "undefined" or empty string gracefully.
    const { rates, loading: loadingShipping } = useShipping(selectedWilaya)

    // Automatically select available delivery type
    useEffect(() => {
        if (rates) {
            const currentType = form.getValues('deliveryType')
            if (currentType === 'home' && !rates.home_delivery_available && rates.desk_delivery_available) {
                form.setValue('deliveryType', 'desk')
            } else if (currentType === 'desk' && !rates.desk_delivery_available && rates.home_delivery_available) {
                form.setValue('deliveryType', 'home')
            }
        }
    }, [rates, form])

    const shippingPrice = rates
        ? (selectedDeliveryType === 'home' ? rates.home_delivery_price : rates.desk_delivery_price)
        : 0

    const totalPrice = productPrice + shippingPrice

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        const supabase = createClient()

        // Build variant info string for display
        let variantInfo = ''
        if (selectedVariant) {
            const parts = []
            if (selectedVariant.color) parts.push(`اللون: ${selectedVariant.color}`)
            if (selectedVariant.size) parts.push(`المقاس: ${selectedVariant.size}`)
            variantInfo = parts.join(' - ')
        }

        // Build order items based on bundle or single product
        let orderItems
        if (selectedBundle && bundleItems.length > 0) {
            // Bundle order - create separate items for each bundle item
            orderItems = bundleItems.map((item, index) => {
                const parts = []
                if (item.color) parts.push(`اللون: ${item.color}`)
                if (item.size) parts.push(`المقاس: ${item.size}`)
                const itemVariantInfo = parts.join(' - ')

                return {
                    product_id: productId,
                    title: `${productTitle} (${selectedBundle.title || `عرض ${selectedBundle.quantity} قطع`} - القطعة ${index + 1})`,
                    quantity: 1,
                    price: productPrice, // Individual price for reference
                    variant: item.color || item.size ? {
                        color: item.color,
                        size: item.size
                    } : null,
                    variant_display: itemVariantInfo || null,
                    bundle_info: {
                        bundle_title: selectedBundle.title,
                        bundle_quantity: selectedBundle.quantity,
                        bundle_price: selectedBundle.price,
                        item_index: index + 1
                    }
                }
            })
        } else {
            // Single product order
            orderItems = [
                {
                    product_id: productId,
                    title: productTitle,
                    quantity: 1,
                    price: productPrice,
                    variant: selectedVariant ? {
                        color: selectedVariant.color,
                        size: selectedVariant.size,
                        sku: selectedVariant.sku
                    } : null,
                    variant_display: variantInfo || null
                }
            ]
        }

        const orderData = {
            customer_info: {
                name: values.fullName,
                phone: values.phone,
                wilaya: wilayas.find(w => w.code === values.wilaya)?.name || values.wilaya,
                commune: values.commune,
            },
            items: orderItems,
            shipping_cost: shippingPrice,
            total_amount: totalPrice,
            delivery_type: values.deliveryType,
            status: 'pending'
        }

        const { data: insertedOrder, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select('id')
            .single()

        if (error) {
            console.error('Error placing order:', error)
            alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.')
        } else if (insertedOrder) {
            // Redirect to success page with order details
            router.push(`/order-success?orderId=${insertedOrder.id}&total=${totalPrice}`)
        }
        setIsSubmitting(false)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100" dir="rtl">
            <h3 className="text-xl font-bold mb-6 text-gray-800">معلومات التوصيل</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم واللقب</FormLabel>
                                <FormControl>
                                    <Input placeholder="محمد بن فلان" className="text-right" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>رقم الهاتف</FormLabel>
                                <FormControl>
                                    <Input placeholder="0555..." className="text-right" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="wilaya"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الولاية</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="flex-row-reverse">
                                                <SelectValue placeholder="اختر الولاية" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {wilayas.map((wilaya) => (
                                                <SelectItem key={wilaya.code} value={wilaya.code} className="justify-end">
                                                    {wilaya.code} - {wilaya.name}
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
                            name="commune"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>البلدية</FormLabel>
                                    <FormControl>
                                        <Input placeholder="البلدية" className="text-right" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="deliveryType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>نوع التوصيل</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-3"
                                    >
                                        <div className="space-y-1">
                                            <FormItem
                                                className={`flex items-center space-x-3 space-x-reverse space-y-0 rounded-md border p-3 ${rates && !rates.home_delivery_available
                                                    ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                                    : 'hover:bg-gray-50 bg-white'
                                                    }`}
                                            >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="home"
                                                        disabled={rates ? !rates.home_delivery_available : false}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal flex-1 flex justify-between items-center cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <Home className="h-4 w-4 text-gray-500" />
                                                        <span className="mr-2 font-medium">توصيل للمنزل</span>
                                                    </div>
                                                    {loadingShipping ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : rates ? (
                                                        rates.home_delivery_available ? (
                                                            <span className="font-bold text-green-600">{rates.home_delivery_price} د.ج</span>
                                                        ) : (
                                                            <span className="text-red-500 text-sm">غير متوفر</span>
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">اختر الولاية</span>
                                                    )}
                                                </FormLabel>
                                            </FormItem>
                                        </div>

                                        <div className="space-y-1">
                                            <FormItem
                                                className={`flex items-center space-x-3 space-x-reverse space-y-0 rounded-md border p-3 ${rates && !rates.desk_delivery_available
                                                    ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                                    : 'hover:bg-gray-50 bg-white'
                                                    }`}
                                            >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="desk"
                                                        disabled={rates ? !rates.desk_delivery_available : false}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal flex-1 flex justify-between items-center cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-gray-500" />
                                                        <span className="mr-2 font-medium">توصيل للمكتب</span>
                                                    </div>
                                                    {loadingShipping ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : rates ? (
                                                        rates.desk_delivery_available ? (
                                                            <span className="font-bold text-green-600">{rates.desk_delivery_price} د.ج</span>
                                                        ) : (
                                                            <span className="text-red-500 text-sm">غير متوفر</span>
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">اختر الولاية</span>
                                                    )}
                                                </FormLabel>
                                            </FormItem>
                                        </div>
                                    </RadioGroup>
                                </FormControl>

                                {rates && rates.estimated_delivery_time && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 bg-blue-50 p-2 rounded text-blue-700">
                                        <span>مدة التوصيل المتوقعة: {rates.estimated_delivery_time}</span>
                                    </div>
                                )}

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>سعر المنتج:</span>
                            <span className="font-medium text-gray-900">{productPrice} د.ج</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>سعر التوصيل:</span>
                            <span className="font-medium text-gray-900">{shippingPrice} د.ج</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-primary pt-2 border-t border-gray-200 mt-2">
                            <span>المجموع الكلي:</span>
                            <span>{totalPrice} د.ج</span>
                        </div>
                    </div>

                    <Button type="submit" className="w-full font-bold text-lg h-12" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري الطلب...
                            </>
                        ) : (
                            'تأكيد الطلب الآن'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
