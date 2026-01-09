'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Home, Package, Grid3x3 } from 'lucide-react'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    siteName: string
}

export function MobileMenu({ isOpen, onClose, siteName }: MobileMenuProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Menu Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200">
                    <h2 className="text-xl font-bold text-stone-900 font-cairo">{siteName}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6 text-stone-700" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-6 space-y-2">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-all duration-200 group"
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">الرئيسية</span>
                    </Link>

                    <Link
                        href="#products"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-all duration-200 group"
                    >
                        <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">المنتجات</span>
                    </Link>

                    <Link
                        href="#categories"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-all duration-200 group"
                    >
                        <Grid3x3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">الفئات</span>
                    </Link>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-stone-200">
                    <p className="text-sm text-stone-500 text-center">
                        © 2026 {siteName}
                    </p>
                </div>
            </div>
        </>
    )
}
