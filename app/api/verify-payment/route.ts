import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { sendOrderConfirmationEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY || process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
})

export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json()

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
        }

        // Check if email already sent? 
        // For now, we rely on client behavior. 
        // In a real app, we should check a DB.

        const customerEmail = session.customer_details?.email
        const customerName = session.customer_details?.name || "Customer"

        // Get items from metadata
        let items = []
        let isSubscription = false

        if (session.metadata?.items) {
            items = JSON.parse(session.metadata.items)
        } else if (session.subscription) {
            // It was a subscription, check subscription metadata
            isSubscription = true
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
            if (subscription.metadata?.items) {
                items = JSON.parse(subscription.metadata.items)
            }
        }

        // If still no items, fallback to line items (optional implementation, but metadata should be reliable now)

        await sendOrderConfirmationEmail(
            customerEmail!,
            customerName,
            items,
            session.amount_total ? session.amount_total / 100 : 0,
            session.id,
            isSubscription
        )

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Payment verification error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
