'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    label: string
    currentImage?: string | null
    onImageSelect: (file: File | null) => void
    onRemove?: () => void
    accept?: string
    maxSize?: number // in MB
}

export function ImageUpload({
    label,
    currentImage,
    onImageSelect,
    onRemove,
    accept = "image/*",
    maxSize = 2
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (file: File | null) => {
        setError(null)

        if (!file) {
            setPreview(null)
            onImageSelect(null)
            return
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`حجم الملف يجب أن يكون أقل من ${maxSize}MB`)
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('يرجى اختيار ملف صورة')
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        onImageSelect(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) {
            handleFileChange(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleRemove = () => {
        setPreview(null)
        onImageSelect(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        if (onRemove) {
            onRemove()
        }
    }

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">{label}</label>

            <div
                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${isDragging
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-300 hover:border-sky-400'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {preview ? (
                    <div className="relative p-4">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-100 to-teal-100 rounded-2xl flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-sky-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            اسحب الصورة هنا أو انقر للاختيار
                        </p>
                        <p className="text-xs text-gray-500">
                            الحد الأقصى: {maxSize}MB
                        </p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-lg hover:from-sky-700 hover:to-teal-700 transition-all"
                        >
                            <Upload className="w-4 h-4" />
                            اختر صورة
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                />
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
