'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Filter, X } from 'lucide-react'

interface OrderFiltersProps {
    onFilterChange: (filters: {
        wilaya?: string
        shippingCompany?: string
        deliveryLocation?: string
        dateFrom?: string
        dateTo?: string
    }) => void
}

const WILAYAS = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
    'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
]

const SHIPPING_COMPANIES = ['Yalidine', 'ZR Express', 'Procolis', 'Maystro Delivery']

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<{
        wilaya?: string
        shippingCompany?: string
        deliveryLocation?: string
        dateFrom?: string
        dateTo?: string
    }>({})

    const handleFilterChange = (key: string, value: string | undefined) => {
        const newFilters = { ...filters }

        if (value && value !== '') {
            newFilters[key as keyof typeof newFilters] = value
        } else {
            delete newFilters[key as keyof typeof newFilters]
        }

        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const clearFilters = () => {
        setFilters({})
        onFilterChange({})
    }

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                >
                    <Filter className="h-4 w-4" />
                    فلترة متقدمة
                    {activeFilterCount > 0 && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-1 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                        مسح الفلاتر
                    </Button>
                )}
            </div>

            {showFilters && (
                <Card className="p-4 border-0 shadow-sm bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Wilaya Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="wilaya-filter">الولاية</Label>
                            <Select
                                value={filters.wilaya}
                                onValueChange={(value) => handleFilterChange('wilaya', value)}
                            >
                                <SelectTrigger id="wilaya-filter">
                                    <SelectValue placeholder="الكل" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WILAYAS.map((wilaya) => (
                                        <SelectItem key={wilaya} value={wilaya}>
                                            {wilaya}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Shipping Company Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="shipping-filter">شركة الشحن</Label>
                            <Select
                                value={filters.shippingCompany}
                                onValueChange={(value) => handleFilterChange('shippingCompany', value)}
                            >
                                <SelectTrigger id="shipping-filter">
                                    <SelectValue placeholder="الكل" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SHIPPING_COMPANIES.map((company) => (
                                        <SelectItem key={company} value={company}>
                                            {company}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Delivery Location Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="delivery-filter">مكان التوصيل</Label>
                            <Select
                                value={filters.deliveryLocation}
                                onValueChange={(value) => handleFilterChange('deliveryLocation', value)}
                            >
                                <SelectTrigger id="delivery-filter">
                                    <SelectValue placeholder="الكل" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="home">المنزل</SelectItem>
                                    <SelectItem value="desk">المكتب</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date From */}
                        <div className="space-y-2">
                            <Label htmlFor="date-from">من تاريخ</Label>
                            <Input
                                id="date-from"
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                        </div>

                        {/* Date To */}
                        <div className="space-y-2">
                            <Label htmlFor="date-to">إلى تاريخ</Label>
                            <Input
                                id="date-to"
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
