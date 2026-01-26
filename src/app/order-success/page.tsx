'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackPurchase } from '@/components/FacebookPixel'

export default function OrderSuccessPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const total = searchParams.get('total')
    const productId = searchParams.get('productId')
    const productName = searchParams.get('productName')
    const quantity = searchParams.get('quantity')

    useEffect(() => {
        console.log('OrderSuccess: useEffect triggered', { productId, productName, total, quantity })
        // Fire Facebook Pixel Purchase event with product details
        if (productId && productName && total) {
            console.log('OrderSuccess: calling trackPurchase')
            trackPurchase(
                productId,
                productName,
                parseFloat(total),
                quantity ? parseInt(quantity) : 1
            )
        } else {
            console.warn('OrderSuccess: Missing required params for pixel', { productId, productName, total })
        }
    }, [productId, productName, total, quantity])

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle className="w-16 h-16 text-white" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        تم استلام طلبك بنجاح! 🎉
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        شكراً لثقتكم بنا. سنتواصل معكم قريباً لتأكيد الطلب
                    </p>

                    {/* Order Details */}
                    {orderId && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <p className="text-sm text-gray-500 mb-2">رقم الطلب</p>
                            <p className="text-2xl font-bold text-purple-600">#{orderId}</p>
                            {total && (
                                <>
                                    <p className="text-sm text-gray-500 mt-4 mb-2">المبلغ الإجمالي</p>
                                    <p className="text-xl font-bold text-gray-900">{total} د.ج</p>
                                </>
                            )}
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="space-y-4 mb-8 text-right">
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">تأكيد الطلب</h3>
                                <p className="text-sm text-gray-600">سنتصل بك خلال 24 ساعة لتأكيد الطلب</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">التوصيل</h3>
                                <p className="text-sm text-gray-600">سيصلك المنتج خلال 2-5 أيام عمل</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">الاستلام والدفع</h3>
                                <p className="text-sm text-gray-600">افحص المنتج قبل الدفع للتأكد من جودته</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 font-bold">
                                العودة للمتجر
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
