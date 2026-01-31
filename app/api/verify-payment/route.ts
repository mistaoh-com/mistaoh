import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/email"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import Log from "@/models/Log"
import { MailItem } from "@/lib/types"
import { IOrder } from "@/models/Order"

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY || process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
})

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { sessionId } = await req.json()

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
        }

        // Get Order ID from metadata
        let orderId = session.metadata?.orderId

        // Handling subscription case where metadata might be nested differently or just in session.metadata if we set it there
        if (!orderId && session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
            orderId = subscription.metadata?.orderId
        }

        let dbOrder: IOrder | null = null


        if (orderId) {
            // Populate user to get phone number if available
            dbOrder = await Order.findById(orderId).populate("user")
            if (dbOrder && dbOrder.status === "PENDING") {
                dbOrder.status = "PAID"
                dbOrder.paymentStatus = session.payment_status
                await dbOrder.save()

                // Log Payment Success
                await Log.create({
                    action: "PAYMENT_SUCCESS",
                    userId: (dbOrder.user as any)?._id || dbOrder.user,
                    metadata: { orderId: dbOrder._id, stripeSessionId: sessionId },
                    ip: req.headers.get("x-forwarded-for") || "unknown",
                    userAgent: req.headers.get("user-agent") || "unknown"
                })
            }
        } else {
            console.warn("No orderId found in session metadata for session:", sessionId)
        }

        const customerEmail = session.customer_details?.email
        const customerName = session.customer_details?.name || "Customer"
        // Try to get phone from DB (User or Guest) -> Fallback to Stripe Session
        const customerPhone = (dbOrder?.user as any)?.phone || dbOrder?.guestInfo?.phone || session.customer_details?.phone || ""

        // 1. Get items for email
        // Strategy: Use DB items if available (most reliable), else fallback to metadata/subscription
        let items: MailItem[] = []
        let isSubscription = false

        if (dbOrder && dbOrder.items && dbOrder.items.length > 0) {
            items = dbOrder.items.map((i: any) => ({
                title: i.title,
                quantity: i.quantity,
                price: i.price,
                description: i.id // or any other description mapping
            }))
        } else if (session.metadata?.items) {
            items = JSON.parse(session.metadata.items)
        } else if (session.subscription) {
            isSubscription = true
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
            if (subscription.metadata?.items) {
                items = JSON.parse(subscription.metadata.items)
            }
        }

        // 1. Send Customer Email
        await sendOrderConfirmationEmail(
            customerEmail!,
            customerName,
            items,
            session.amount_total ? session.amount_total / 100 : 0,
            orderId || session.id, // Fallback to session ID for email display if orderId missing
            isSubscription
        )

        // 2. Send Admin Notification Email
        // Only if we actually found/updated a relevant order to attach to
        if (dbOrder) {
            await sendAdminNewOrderEmail(
                customerName,
                customerEmail!,
                customerPhone,
                dbOrder._id.toString(),
                items,
                session.amount_total ? session.amount_total / 100 : 0
            )
        } else {
            // Fallback admin email even if DB order was missing but payment succeeded (Critical)
            await sendAdminNewOrderEmail(
                customerName,
                customerEmail!,
                customerPhone,
                "STRIPE-" + session.id.slice(-8), // Temporary ID
                items,
                session.amount_total ? session.amount_total / 100 : 0,
                "WARNING: Database Order not found for this payment."
            )
        }

        return NextResponse.json({ success: true, orderId })
    } catch (error: any) {
        console.error("Payment verification error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
