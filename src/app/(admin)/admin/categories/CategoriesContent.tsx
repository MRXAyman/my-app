'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { Plus, Pencil, Trash2, FolderTree, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Category {
    id: number
    name: string
    slug: string
}

export default function CategoriesContent() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (data) {
                setCategories(data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        console.log('handleDelete called for id:', id)

        if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
            console.log('Delete cancelled by user')
            return
        }
        console.log('User confirmed delete')

        try {
            console.log(`Sending DELETE request to /api/categories/${id}`)
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            })
            console.log('Response status:', response.status)

            if (response.ok) {
                console.log('Delete successful, fetching categories...')
                fetchCategories()
            } else {
                console.log('Delete failed with status:', response.status)
                const data = await response.json()
                console.log('Error data:', data)
                alert(data.error || 'حدث خطأ أثناء الحذف')
            }
        } catch (error) {
            console.error('Error deleting category:', error)
            alert('حدث خطأ أثناء الحذف')
        }
    }

    const handleFormSuccess = () => {
        setShowForm(false)
        setEditingCategory(null)
        fetchCategories()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        إدارة الأصناف
                    </h2>
                    <p className="text-muted-foreground mt-1">تنظيم المنتجات في أصناف</p>
                </div>
                <Button
                    onClick={() => {
                        console.log('Button clicked!')
                        setShowForm(true)
                    }}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
                    type="button"
                >
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة صنف جديد
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <FolderTree className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            <p className="text-sm text-muted-foreground">إجمالي الأصناف</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">-</p>
                            <p className="text-sm text-muted-foreground">منتجات مصنفة</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Category Form */}
            {showForm && (
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                        <CardTitle className="flex items-center gap-2">
                            <FolderTree className="h-5 w-5 text-primary" />
                            {editingCategory ? 'تعديل' : 'إضافة'} صنف
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <CategoryForm
                            category={editingCategory || undefined}
                            onSuccess={handleFormSuccess}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingCategory(null)
                            }}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Categories Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.length === 0 ? (
                    <Card className="col-span-full border-0 shadow-sm">
                        <CardContent className="py-12">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FolderTree className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">لا توجد أصناف</p>
                                <p className="text-xs text-muted-foreground mt-1">قم بإضافة صنف جديد للبدء</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    categories.map((category) => (
                        <Card
                            key={category.id}
                            className="group relative hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FolderTree className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                console.log('Edit clicked')
                                                setEditingCategory(category)
                                                setShowForm(true)
                                            }}
                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:border-primary/30"
                                            type="button"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                console.log('Delete clicked')
                                                handleDelete(category.id)
                                            }}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                                            type="button"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                                <p className="text-sm text-muted-foreground font-mono">{category.slug}</p>
                                <Badge variant="secondary" className="mt-3">
                                    0 منتجات
                                </Badge>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
