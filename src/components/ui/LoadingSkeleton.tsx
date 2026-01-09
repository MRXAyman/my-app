export function LoadingSkeleton({ variant = 'product' }: { variant?: 'product' | 'category' | 'carousel' }) {
    if (variant === 'product') {
        return (
            <div className="animate-pulse">
                <div className="aspect-square bg-stone-200 rounded-sm mb-4"></div>
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            </div>
        )
    }

    if (variant === 'category') {
        return (
            <div className="animate-pulse aspect-square bg-stone-200 rounded-sm"></div>
        )
    }

    if (variant === 'carousel') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-stone-200 rounded-sm mb-4"></div>
                        <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    return null
}
