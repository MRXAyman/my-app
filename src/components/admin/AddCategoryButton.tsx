'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AddCategoryButtonProps {
    onClick: () => void
}

export function AddCategoryButton({ onClick }: AddCategoryButtonProps) {
    return (
        <Button
            onClick={onClick}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
        >
            <Plus className="ml-2 h-4 w-4" />
            إضافة صنف جديد
        </Button>
    )
}
