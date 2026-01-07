'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
    images: string[]
    title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)

    // Fallback if no images
    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <span className="text-xl">لا توجد صور</span>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-100 relative group">
                <img
                    src={images[selectedImage]}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                                selectedImage === index
                                    ? "border-purple-600 ring-2 ring-purple-100"
                                    : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <img
                                src={image}
                                alt={`${title} - صورة ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
