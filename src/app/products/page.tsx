import { createClient } from "@/utils/supabase/server"
import { ProductsPageClient } from "@/components/products/ProductsPageClient"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
    title: "جميع المنتجات | متجرنا",
    description: "تصفح جميع منتجاتنا مع إمكانية الفلترة والبحث",
}

export default async function ProductsPage() {
    const supabase = await createClient()

    // Fetch all products
    const { data: products } = await supabase
        .from("products")
        .select("id, title, slug, price, sale_price, images, in_stock, category_id, stock")
        .order("created_at", { ascending: false })

    // Fetch all categories for filter options
    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name")

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors mb-4"
                    >
                        <ArrowRight className="ml-2 h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        جميع المنتجات
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        تصفح مجموعتنا الكاملة من المنتجات
                    </p>
                </div>
            </div>

            {/* Products Content */}
            <ProductsPageClient
                initialProducts={products || []}
                categories={categories || []}
            />
        </div>
    )
}
