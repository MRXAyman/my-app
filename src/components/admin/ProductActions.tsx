'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, MoreHorizontal, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/client'

interface ProductActionsProps {
    product: {
        id: number
        slug: string
    }
}

export function ProductActions({ product }: ProductActionsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', product.id)

            if (error) throw error

            router.refresh()
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('حدث خطأ أثناء حذف المنتج')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <span className="sr-only">Open menu</span>
                    {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MoreHorizontal className="h-4 w-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="flex items-center w-full cursor-pointer"
                    >
                        <Edit className="ml-2 h-4 w-4" />
                        تعديل
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault()
                        handleDelete()
                    }}
                    disabled={isDeleting}
                >
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
