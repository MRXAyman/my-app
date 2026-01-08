import Link from 'next/link'
import { Facebook, Instagram, Phone, Mail, Youtube, Video } from 'lucide-react'

interface FooterProps {
    brandSettings: {
        site_name: string
        logo_url: string | null
        phone_number: string | null
        email: string | null
        facebook_url: string | null
        instagram_url: string | null
        tiktok_url: string | null
        youtube_url: string | null
    } | null
}

export function Footer({ brandSettings }: FooterProps) {
    if (!brandSettings) return null

    return (
        <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">{brandSettings.site_name}</h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                            وجهتك الأولى للتسوق الإلكتروني في الجزائر. نقدم لك أفضل المنتجات بأسعار تنافسية وخدمة توصيل سريعة.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">تواصل معنا</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            {brandSettings.phone_number && (
                                <a href={`tel:${brandSettings.phone_number}`} className="flex items-center gap-2 hover:text-primary">
                                    <Phone className="w-4 h-4" />
                                    <span dir="ltr">{brandSettings.phone_number}</span>
                                </a>
                            )}
                            {brandSettings.email && (
                                <a href={`mailto:${brandSettings.email}`} className="flex items-center gap-2 hover:text-primary">
                                    <Mail className="w-4 h-4" />
                                    <span>{brandSettings.email}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">تابعنا على</h3>
                        <div className="flex items-center gap-4">
                            {brandSettings.facebook_url && (
                                <a
                                    href={brandSettings.facebook_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {brandSettings.instagram_url && (
                                <a
                                    href={brandSettings.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {brandSettings.tiktok_url && (
                                <a
                                    href={brandSettings.tiktok_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <Video className="w-5 h-5" />
                                </a>
                            )}
                            {brandSettings.youtube_url && (
                                <a
                                    href={brandSettings.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                                >
                                    <Youtube className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} {brandSettings.site_name}. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    )
}
