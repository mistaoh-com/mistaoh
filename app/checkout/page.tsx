import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyJWT } from "@/lib/auth"
import { CheckoutClient } from "./checkout-client"
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

    if (!isAuthenticated) {
        redirect("/login?redirect=/checkout")
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <Navigation />
            <div className="pt-20">
                <CheckoutClient />
            </div>
            <Footer />
        </main>
    )
}
