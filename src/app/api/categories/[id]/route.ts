import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params
        const { name, slug } = await request.json()

        // Validate input
        if (!name || !slug) {
            return NextResponse.json(
                { error: 'الاسم والرابط مطلوبان' },
                { status: 400 }
            )
        }

        // Update category
        const { data, error } = await supabase
            .from('categories')
            .update({ name, slug })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating category:', error)
            return NextResponse.json(
                { error: 'حدث خطأ أثناء تحديث الصنف' },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in PUT /api/categories/[id]:', error)
        return NextResponse.json(
            { error: 'حدث خطأ غير متوقع' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting category:', error)

            // Check for foreign key violation
            if (error.code === '23503') {
                return NextResponse.json(
                    { error: 'لا يمكن حذف هذا الصنف لأنه مرتبط بمنتجات. قم بحذف المنتجات أولاً.' },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                { error: 'حدث خطأ أثناء حذف الصنف' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in DELETE /api/categories/[id]:', error)
        return NextResponse.json(
            { error: 'حدث خطأ غير متوقع' },
            { status: 500 }
        )
    }
}
