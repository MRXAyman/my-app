import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { name, slug } = await request.json()

        // Validate input
        if (!name || !slug) {
            return NextResponse.json(
                { error: 'الاسم والرابط مطلوبان' },
                { status: 400 }
            )
        }

        // Insert category
        const { data, error } = await supabase
            .from('categories')
            .insert({ name, slug })
            .select()
            .single()

        if (error) {
            console.error('Error creating category:', error)
            return NextResponse.json(
                { error: 'حدث خطأ أثناء إضافة الصنف' },
                { status: 500 }
            )
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error in POST /api/categories:', error)
        return NextResponse.json(
            { error: 'حدث خطأ غير متوقع' },
            { status: 500 }
        )
    }
}
