
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { wilayas } from "@/lib/algeria-data";

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        // Optional: Check if admin is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const shippingData = wilayas.map((wilaya) => ({
            wilaya_code: wilaya.code,
            wilaya_name: wilaya.name_ascii,
            home_delivery_price: 800, // Default price
            desk_delivery_price: 500, // Default price
            is_active: true
        }));

        const { error } = await supabase
            .from("shipping_zones")
            .upsert(shippingData, { onConflict: "wilaya_code" });

        if (error) {
            console.error("Error seeding shipping zones:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Shipping zones seeded successfully" });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
