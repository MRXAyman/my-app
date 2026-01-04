'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
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
import { useShipping } from '@/hooks/use-shipping' // Ensure this hook is created/correct
import { createClient } from '@/utils/supabase/client'

const phoneRegex = /^(05|06|07)[0-9]{8}$/

const formSchema = z.object({
    fullName: z.string().min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),
    phone: z.string().regex(phoneRegex, { message: 'رقم الهاتف غير صالح (يجب أن يبدأ ب 05، 06 أو 07)' }),
    wilaya: z.string().min(1, { message: 'يرجى اختيار الولاية' }),
    commune: z.string().min(1, { message: 'يرجى كتابة البلدية' }),
    deliveryType: z.enum(['home', 'desk'], { required_error: 'يرجى اختيار نوع التوصيل' }),
})

interface CheckoutFormProps {
    productId: number
    productPrice: number
    productTitle: string
}

export function CheckoutForm({ productId, productPrice, productTitle }: CheckoutFormProps) {
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

    const shippingPrice = rates
        ? (selectedDeliveryType === 'home' ? rates.home_delivery_price : rates.desk_delivery_price)
        : 0

    const totalPrice = productPrice + shippingPrice

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        const supabase = createClient()

        const orderData = {
            customer_info: {
                name: values.fullName,
                phone: values.phone,
                wilaya: wilayas.find(w => w.code === values.wilaya)?.name || values.wilaya,
                commune: values.commune,
            },
            items: [
                {
                    product_id: productId,
                    title: productTitle,
                    quantity: 1,
                    price: productPrice
                }
            ],
            shipping_cost: shippingPrice,
            total_amount: totalPrice,
            delivery_type: values.deliveryType,
            status: 'pending'
        }

        const { error } = await supabase.from('orders').insert(orderData)

        if (error) {
            console.error('Error placing order:', error)
            alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.')
        } else {
            alert('تم استلام طلبك بنجاح! شكرا لثقتكم.')
            form.reset()
            // Optional: router.push('/thank-you')
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
                                        <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0 rounded-md border p-3 hover:bg-gray-50">
                                            <FormControl>
                                                <RadioGroupItem value="home" />
                                            </FormControl>
                                            <FormLabel className="font-normal flex-1 flex justify-between items-center cursor-pointer">
                                                <span className="mr-2">توصيل للمنزل</span>
                                                {loadingShipping ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : rates ? (
                                                    <span className="font-bold text-green-600">{rates.home_delivery_price} د.ج</span>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">اختر الولاية</span>
                                                )}
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0 rounded-md border p-3 hover:bg-gray-50">
                                            <FormControl>
                                                <RadioGroupItem value="desk" />
                                            </FormControl>
                                            <FormLabel className="font-normal flex-1 flex justify-between items-center cursor-pointer">
                                                <span className="mr-2">توصيل للمكتب (Yalidine/StopDesk)</span>
                                                {loadingShipping ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : rates ? (
                                                    <span className="font-bold text-green-600">{rates.desk_delivery_price} د.ج</span>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">اختر الولاية</span>
                                                )}
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
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
