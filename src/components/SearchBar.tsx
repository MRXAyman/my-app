'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
    isExpanded: boolean
    onToggle: () => void
}

export function SearchBar({ isExpanded, onToggle }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isExpanded])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isExpanded) {
                onToggle()
                setSearchQuery('')
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isExpanded, onToggle])

    const handleClear = () => {
        setSearchQuery('')
        inputRef.current?.focus()
    }

    return (
        <div className="relative flex items-center">
            {/* Search Input */}
            <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className={`absolute left-0 h-10 bg-stone-50 border border-stone-200 rounded-lg px-4 pr-10 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all duration-300 ${isExpanded ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}
                dir="rtl"
            />

            {/* Clear Button */}
            {isExpanded && searchQuery && (
                <button
                    onClick={handleClear}
                    className="absolute left-12 z-10 p-1 hover:bg-stone-200 rounded transition-colors"
                    aria-label="Clear search"
                >
                    <X className="w-4 h-4 text-stone-500" />
                </button>
            )}

            {/* Search Button */}
            <button
                onClick={onToggle}
                className={`p-2 hover:bg-stone-100 rounded-lg transition-all duration-300 ${isExpanded ? 'bg-stone-100' : ''
                    }`}
                aria-label={isExpanded ? 'Close search' : 'Open search'}
            >
                <Search className={`w-5 h-5 text-stone-700 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''
                    }`} />
            </button>
        </div>
    )
}
