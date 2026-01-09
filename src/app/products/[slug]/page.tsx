import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { ArrowRight } from "lucide-react"
import { ImageGallery } from "@/components/product/ImageGallery"
import { ProductPageClient } from "@/components/product/ProductPageClient"

// Mock data in case DB is empty for demonstration
const MOCK_PRODUCT = {
    id: 1,
    title: "ساعة فاخرة (نسخة محدودة)",
    price: 4500,
    description: "ساعة يد أنيقة ذات جودة عالية، مصممة لتناسب جميع الأذواق. مقاومة للماء والخدش.",
    images: [], // Placeholder
    variants: null,
    sale_price: 0,
    stock: 10,
    in_stock: true
}

async function getProduct(slug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, title, price, sale_price, description, images, variants, stock, in_stock, bundle_offers")
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

                <ProductPageClient product={product} />
            </div>
        </div>
    )
}
