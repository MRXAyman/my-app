"use client"

import { ArrowUpDown } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ProductSortProps {
    sortBy: string
    onSortChange: (value: string) => void
}

export function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
    return (
        <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                    <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                    <SelectItem value="name-asc">الاسم: أ - ي</SelectItem>
                    <SelectItem value="name-desc">الاسم: ي - أ</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
