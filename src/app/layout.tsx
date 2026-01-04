import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata = {
    title: "DzShop - متجر إلكتروني جزائري",
    description: "أفضل المنتجات بأسعار تنافسية",
    icons: {
        icon: '/favicon.ico',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient()
    const { data: settings } = await supabase.from('settings').select('value').eq('key', 'facebook_pixel_id').single()
    const pixelId = settings?.value || null

    return (
        <html lang="ar" dir="rtl">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
            >
                <FacebookPixel pixelId={pixelId} />
                {children}
            </body>
        </html>
    );
}
