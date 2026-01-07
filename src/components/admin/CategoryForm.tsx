'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface CategoryFormProps {
    category?: {
        id: number
        name: string
        slug: string
    }
    onSuccess?: () => void
    onCancel?: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
    const router = useRouter()
    const [name, setName] = useState(category?.name || '')
    const [slug, setSlug] = useState(category?.slug || '')
    const [loading, setLoading] = useState(false)

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '')
    }

    const handleNameChange = (value: string) => {
        setName(value)
        if (!category) {
            setSlug(generateSlug(value))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const url = category
            ? `/api/categories/${category.id}`
            : '/api/categories'

        const method = category ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, slug }),
        })

        setLoading(false)

        if (response.ok) {
            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/admin/categories')
                router.refresh()
            }
        } else {
            alert('حدث خطأ أثناء حفظ الصنف')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">اسم الصنف</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="مثال: إلكترونيات"
                    required
                    disabled={loading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">الرابط (Slug)</Label>
                <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="electronics"
                    required
                    disabled={loading}
                />
                <p className="text-xs text-gray-500">
                    سيتم استخدامه في رابط الصفحة
                </p>
            </div>

            <div className="flex gap-2 justify-end">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        إلغاء
                    </Button>
                )}
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    {category ? 'تحديث' : 'إضافة'} الصنف
                </Button>
            </div>
        </form>
    )
}
