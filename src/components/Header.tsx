import Link from 'next/link'
import { ShoppingCart, Search, Menu } from 'lucide-react'
import { getBrandSettings } from '@/lib/brandSettings'
import Image from 'next/image'

export async function Header() {
    const brandSettings = await getBrandSettings()

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo & Site Name */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {brandSettings?.logo_url ? (
                            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105">
                                <Image
                                    src={brandSettings.logo_url}
                                    alt={brandSettings.site_name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center transition-transform group-hover:scale-105">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                            {brandSettings?.site_name || 'DzShop'}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
                            الرئيسية
                        </Link>
                        <Link href="#products" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
                            المنتجات
                        </Link>
                        <Link href="#categories" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
                            الفئات
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Search className="w-5 h-5 text-gray-700" />
                        </button>
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ShoppingCart className="w-5 h-5 text-gray-700" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-sky-500 to-teal-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                0
                            </span>
                        </button>
                        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
