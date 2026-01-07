'use client'

import { useState, useCallback } from 'react'
import { Upload, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadMultipleProductImages, deleteProductImage } from '@/utils/supabase/storage'

interface MultiImageUploadProps {
    images: string[]
    onChange: (images: string[]) => void
    maxImages?: number
}

export function MultiImageUpload({ images, onChange, maxImages = 10 }: MultiImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        )

        if (files.length === 0) return

        const remainingSlots = maxImages - images.length
        const filesToUpload = files.slice(0, remainingSlots)

        if (filesToUpload.length > 0) {
            await uploadImages(filesToUpload)
        }
    }, [images.length, maxImages])

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter(file =>
            file.type.startsWith('image/')
        )

        if (files.length === 0) return

        const remainingSlots = maxImages - images.length
        const filesToUpload = files.slice(0, remainingSlots)

        if (filesToUpload.length > 0) {
            await uploadImages(filesToUpload)
        }

        // Reset input
        e.target.value = ''
    }, [images.length, maxImages])

    const uploadImages = async (files: File[]) => {
        setIsUploading(true)
        try {
            const result = await uploadMultipleProductImages(files)
            if (result.urls) {
                onChange([...images, ...result.urls])
            } else if (result.error) {
                console.error('Upload error:', result.error)
                alert('حدث خطأ أثناء رفع الصور')
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('حدث خطأ أثناء رفع الصور')
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = async (index: number) => {
        const imageUrl = images[index]
        const newImages = images.filter((_, i) => i !== index)
        onChange(newImages)

        // Optionally delete from storage (commented out to keep images in storage)
        // await deleteProductImage(imageUrl)
    }

    const handleDragStart = (index: number) => {
        setDraggedIndex(index)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }

    const handleDragOverImage = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === index) return

        const newImages = [...images]
        const draggedImage = newImages[draggedIndex]
        newImages.splice(draggedIndex, 1)
        newImages.splice(index, 0, draggedImage)

        onChange(newImages)
        setDraggedIndex(index)
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {images.length < maxImages && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <Upload className={`h-12 w-12 mb-4 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            {isUploading ? 'جاري الرفع...' : 'اسحب الصور هنا أو اضغط للاختيار'}
                        </p>
                        <p className="text-xs text-gray-500">
                            يمكنك رفع حتى {maxImages} صور ({maxImages - images.length} متبقية)
                        </p>
                    </label>
                </div>
            )}

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOverImage(e, index)}
                            className={`relative group rounded-lg overflow-hidden border-2 transition-all ${draggedIndex === index
                                    ? 'border-primary opacity-50 scale-95'
                                    : 'border-gray-200 hover:border-primary/50'
                                }`}
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gray-100">
                                <img
                                    src={image}
                                    alt={`صورة ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                {/* Drag Handle */}
                                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 rounded p-1 cursor-move">
                                        <GripVertical className="h-4 w-4 text-gray-700" />
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Primary Badge */}
                            {index === 0 && (
                                <div className="absolute bottom-2 right-2">
                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                                        رئيسية
                                    </span>
                                </div>
                            )}

                            {/* Image Number */}
                            <div className="absolute top-2 right-2">
                                <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                    {index + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    لم يتم رفع أي صور بعد
                </p>
            )}
        </div>
    )
}
