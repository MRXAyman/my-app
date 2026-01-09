import { Header } from '@/components/Header'
import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { ProductGrid } from '@/components/home/ProductGrid'
import { NewArrivals } from '@/components/home/NewArrivals'
import { getBrandSettings } from '@/lib/brandSettings'

export default async function HomePage() {
    const brandSettings = await getBrandSettings()

    return (
        <main className="min-h-screen bg-white">
            <Header
                siteName={brandSettings?.site_name}
                logoUrl={brandSettings?.logo_url}
            />
            <HeroSection />
            <TrustBar />
            <NewArrivals />
            <CategoriesGrid />
            <ProductGrid />
        </main>
    )
}
