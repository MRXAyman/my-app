import { createClient } from "@/utils/supabase/server"
import { ShippingRatesEditor } from "@/components/admin/ShippingRatesEditor"

export default async function AdminShippingPage() {
    const supabase = await createClient()

    const { data: zones, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('wilaya_code', { ascending: true })

    // If no zones exist, we might need to seed them.
    // Realistically we should have a seed script, but for now we assume they might exist or we handle empty.

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">إدارة أسعار الشحن</h2>
            </div>

            {!zones || zones.length === 0 ? (
                <div className="p-8 text-center border rounded bg-white">
                    <p className="text-muted-foreground mb-4">لا توجد بيانات للولايات. يرجى تشغيل سكربت الإدخال الأولي.</p>
                </div>
            ) : (
                <ShippingRatesEditor initialZones={zones} />
            )}
        </div>
    )
}
