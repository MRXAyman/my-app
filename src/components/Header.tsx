'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu } from 'lucide-react'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'
import { SearchBar } from './SearchBar'

interface HeaderProps {
    siteName?: string
    logoUrl?: string | null
}

export function Header({ siteName = 'StaylBag', logoUrl = null }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchExpanded, setIsSearchExpanded] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <>
            <header
                className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${isScrolled
                        ? 'border-stone-200 shadow-lg h-16 md:h-18'
                        : 'border-stone-100 shadow-sm h-18 md:h-20'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo & Site Name */}
                        <Link href="/" className="flex items-center gap-3 group">
                            {logoUrl ? (
                                <div className={`relative transition-all duration-300 ${isScrolled ? 'w-9 h-9 md:w-10 md:h-10' : 'w-10 h-10 md:w-12 md:h-12'
                                    }`}>
                                    <Image
                                        src={logoUrl}
                                        alt={siteName}
                                        fill
                                        className="object-contain transition-transform group-hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className={`rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${isScrolled ? 'w-9 h-9 md:w-10 md:h-10' : 'w-10 h-10 md:w-12 md:h-12'
                                    }`}>
                                    <ShoppingCart className={`text-white transition-all ${isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                                        }`} />
                                </div>
                            )}
                            <span className={`font-bold text-stone-900 font-cairo transition-all duration-300 ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                                }`}>
                                {siteName}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link
                                href="/"
                                className="relative text-stone-700 hover:text-stone-900 font-medium transition-colors group py-2"
                            >
                                الرئيسية
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-900 transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="#products"
                                className="relative text-stone-700 hover:text-stone-900 font-medium transition-colors group py-2"
                            >
                                المنتجات
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-900 transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="#categories"
                                className="relative text-stone-700 hover:text-stone-900 font-medium transition-colors group py-2"
                            >
                                الفئات
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-900 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Search Bar */}
                            <div className="hidden sm:block">
                                <SearchBar
                                    isExpanded={isSearchExpanded}
                                    onToggle={() => setIsSearchExpanded(!isSearchExpanded)}
                                />
                            </div>

                            {/* Cart Button */}
                            <button className="relative p-2 hover:bg-stone-100 rounded-lg transition-all duration-200 group">
                                <ShoppingCart className="w-5 h-5 text-stone-700 group-hover:text-stone-900 transition-colors" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-900 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                                    0
                                </span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5 text-stone-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                siteName={siteName}
            />
        </>
    )
}
