import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { ImageGallery } from "@/components/product/ImageGallery"

// Mock data in case DB is empty for demonstration
const MOCK_PRODUCT = {
    id: 1,
    title: "ساعة فاخرة (نسخة محدودة)",
    price: 4500,
    description: "ساعة يد أنيقة ذات جودة عالية، مصممة لتناسب جميع الأذواق. مقاومة للماء والخدش.",
    images: [] // Placeholder
}

async function getProduct(slug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, title, price, description, images")
        .eq("slug", slug)
        .single()

    if (error || !data) {
        if (slug === 'test-product') return MOCK_PRODUCT
        return null
    }

    return data
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug

    const product = await getProduct(slug)

    if (!product) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition-colors">
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة للمتجر
                </Link>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Product Info - Shows first on mobile, second on desktop */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            {/* Image Gallery */}
                            <ImageGallery images={product.images || []} title={product.title} />

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{product.title}</h1>



                            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10 inline-block">
                                <p className="text-3xl tracking-tight text-primary font-bold">{product.price} د.ج</p>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">وصف المنتج</h3>
                                <div className="space-y-4 text-base text-gray-600 leading-relaxed">
                                    <p>{product.description || "لا يوجد وصف لهذا المنتج حاليا."}</p>
                                    <ul className="list-disc list-inside space-y-2 mt-4 marker:text-primary">
                                        <li>جودة عالية ومضمونة.</li>
                                        <li>متوفر بكميات محدودة.</li>
                                        <li>توصيل لجميع الولايات (58 ولاية).</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Checkout Form - Shows on mobile only, after description */}
                            <div className="lg:hidden mt-8">
                                <CheckoutForm
                                    productId={product.id}
                                    productPrice={product.price}
                                    productTitle={product.title}
                                />

                                {/* Trust Badges */}
                                <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                                    <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                        <span className="font-bold mb-1 text-gray-900">دفع عند الاستلام</span>
                                        <span>افحص منتجك قبل الدفع</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                        <span className="font-bold mb-1 text-gray-900">توصيل سريع</span>
                                        <span>3-1 أيام لجميع الولايات</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                        <span className="font-bold mb-1 text-gray-900">ضمان الجودة</span>
                                        <span>استبدال في حالة عطب</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Order Form (One-page Checkout) - Shows on desktop only, sticky */}
                    <div className="hidden lg:block lg:order-1">
                        <div className="sticky top-10">
                            <CheckoutForm
                                productId={product.id}
                                productPrice={product.price}
                                productTitle={product.title}
                            />

                            {/* Trust Badges */}
                            <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                    <span className="font-bold mb-1 text-gray-900">دفع عند الاستلام</span>
                                    <span>افحص منتجك قبل الدفع</span>
                                </div>
                                <div className="flex flex-col items-center p-وصف المنتج2 bg-white rounded shadow-sm">
                                    <span className="font-bold mb-1 text-gray-900">توصيل سريع</span>
                                    <span>3-1 أيام لجميع الولايات</span>
                                </div>
                                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                                    <span className="font-bold mb-1 text-gray-900">ضمان الجودة</span>
                                    <span>استبدال في حالة عطب</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
