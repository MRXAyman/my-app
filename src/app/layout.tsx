import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/FacebookPixel";
import { createClient } from "@/utils/supabase/server";

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient()
    const { data: settings } = await supabase.from('settings').select('value').eq('key', 'facebook_pixel_id').single()
    const pixelId = settings?.value || null

    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} antialiased bg-gray-50 font-tajawal`}
            >
                <FacebookPixel pixelId={pixelId} />
                {children}
            </body>
        </html>
    );
}
