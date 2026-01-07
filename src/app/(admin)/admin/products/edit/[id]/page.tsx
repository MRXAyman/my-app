import { createClient } from '@/utils/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { redirect } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) {
        redirect('/admin/products')
    }

    return <ProductForm initialData={product} />
}
