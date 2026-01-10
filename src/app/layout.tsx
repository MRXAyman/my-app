import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/FacebookPixel";
import { createClient } from "@/utils/supabase/server";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const tajawal = Tajawal({
    variable: "--font-tajawal",
    subsets: ["arabic"],
    weight: ["200", "300", "400", "500", "700", "800", "900"],
    display: "swap",
});

export async function generateMetadata() {
    const supabase = await createClient()
    const { data: brandSettings } = await supabase
        .from('brand_settings')
        .select('site_name, favicon_url')
        .single()

    return {
        title: brandSettings?.site_name || "DzShop - متجر إلكتروني جزائري",
        description: "أفضل المنتجات بأسعار تنافسية - توصيل سريع لجميع الولايات",
        icons: {
            icon: brandSettings?.favicon_url || '/favicon.ico',
        },
    }
}

import { FooterWrapper } from "@/components/layout/FooterWrapper";

// ... existing imports ...

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient()

    // Fetch settings and brand data in parallel
    const [settingsResponse, brandResponse] = await Promise.all([
        supabase.from('settings').select('value').eq('key', 'facebook_pixel_id').single(),
        supabase.from('brand_settings').select('*').single()
    ])

    const pixelId = settingsResponse.data?.value || null
    const brandSettings = brandResponse.data

    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} antialiased bg-gray-50 font-tajawal min-h-screen flex flex-col`}
            >
                <FacebookPixel pixelId={pixelId} />
                <main className="flex-grow">
                    {children}
                </main>
                <FooterWrapper brandSettings={brandSettings} />
                <SpeedInsights />
            </body>
        </html>
    );
}
