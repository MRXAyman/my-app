'use client'

import dynamic from 'next/dynamic'

const CategoriesContent = dynamic(() => import('./CategoriesContent'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )
})

export default function CategoriesPage() {
    return <CategoriesContent />
}
