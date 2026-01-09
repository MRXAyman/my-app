import { Truck, BadgeCheck, Eye } from 'lucide-react'

export function TrustBar() {
    const features = [
        {
            icon: Truck,
            title: "توصيل سريع",
            description: "لجميع الولايات (58 ولاية)"
        },
        {
            icon: Eye,
            title: "عاين قبل الدفع",
            description: "تأكد من المنتج بنفسك"
        },
        {
            icon: BadgeCheck,
            title: "الدفع عند الاستلام",
            description: "100% ضمان وراحة بال"
        }
    ]

    return (
        <section className="bg-gradient-to-b from-white to-stone-50 border-y border-stone-200/50 py-8 sm:py-12 md:py-16" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-4 sm:p-6 group cursor-default luxury-hover hover:transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-stone-900 group-hover:scale-110 transition-all duration-500 shadow-md group-hover:shadow-luxury">
                                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-stone-700 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1 sm:mb-2 font-cairo">{feature.title}</h3>
                            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
