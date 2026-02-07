import { cookies } from "next/headers"
import { verifyJWT } from "@/lib/auth"
import { CheckoutClient } from "./checkout-client"
import { GuestCheckoutClient } from "./guest-checkout-client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    let isAuthenticated = false

    if (token) {
        const payload = await verifyJWT(token)
        if (payload && payload.userId) {
            isAuthenticated = true
        }
    }

    return (
        <main id="main-content" className="min-h-screen bg-gray-50 pb-20">
            <Navigation />
            <div className="pt-20">
                {isAuthenticated ? <CheckoutClient /> : <GuestCheckoutClient />}
            </div>
            <Footer />
        </main>
    )
}
