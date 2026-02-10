import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import Stripe from "stripe"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import User from "@/models/User"
import { verifyJWT } from "@/lib/auth"
import { isValidTipPercentage, roundCurrency } from "@/lib/tip"

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY || process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
})

export async function POST(req: NextRequest) {
    try {
        // 1. Check authentication OR guest token
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        let userId: string | undefined

        // Get orderId and guestToken from request
        const { orderId, guestToken } = await req.json()

        // Try to authenticate as a user
        if (token) {
            const payload = await verifyJWT(token)
            if (payload && payload.userId) {
                userId = payload.userId
            }
        }

        // 2. Validate order ID
        if (!orderId) {
            return NextResponse.json(
                { error: "Order ID is required" },
                { status: 400 }
            )
        }

        await dbConnect()

        // 3. Fetch order from database
        const order = await Order.findById(orderId)

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        // 4. Verify order ownership: authenticated user OR guest token matches
        if (userId) {
            // Authenticated user - verify order belongs to them
            if (!order.user || order.user.toString() !== userId) {
                return NextResponse.json(
                    { error: "You do not have permission to access this order" },
                    { status: 403 }
                )
            }
        } else {
            // Guest user - verify guest token
            if (!guestToken || !order.guestToken || guestToken !== order.guestToken) {
                return NextResponse.json(
                    { error: "Invalid or missing guest token" },
                    { status: 403 }
                )
            }
        }

        // 5. Verify order status is PENDING
        if (order.status !== "PENDING") {
            return NextResponse.json(
                { error: "Only pending orders can be paid. This order is already " + order.status.toLowerCase() },
                { status: 403 }
            )
        }

        // 6. Validate order has items
        if (!order.items || order.items.length === 0) {
            return NextResponse.json(
                { error: "Order has no items" },
                { status: 400 }
            )
        }

        // 7. Get user email for Stripe session
        const user = await User.findById(userId)
        const userEmail = user?.email

        // 7a. Validate tax rate ID
        const taxRateId = process.env.STRIPE_TAX_RATE_ID
        if (!taxRateId) {
            console.error("STRIPE_TAX_RATE_ID is not configured")
            return NextResponse.json(
                { error: "Tax configuration error" },
                { status: 500 }
            )
        }

        const subtotalAmount = roundCurrency(
            order.items.reduce((sum: number, item: any) => {
                const addOnsPrice = item.selectedAddOns?.reduce((addOnSum: number, addon: any) => addOnSum + addon.price, 0) || 0
                return sum + (item.price + addOnsPrice) * item.quantity
            }, 0),
        )

        let tipAmount = 0
        let tipType: "percentage" | "custom" = "custom"
        let tipPercentage: number | undefined = undefined

        if (order.tipType === "percentage" && isValidTipPercentage(order.tipPercentage)) {
            tipType = "percentage"
            tipPercentage = order.tipPercentage
            tipAmount = roundCurrency((subtotalAmount * tipPercentage) / 100)
        } else if (typeof order.tipAmount === "number" && Number.isFinite(order.tipAmount) && order.tipAmount >= 0) {
            tipType = "custom"
            tipAmount = roundCurrency(order.tipAmount)
        }

        order.subtotal = subtotalAmount
        order.tipAmount = tipAmount
        order.tipType = tipType
        order.tipPercentage = tipType === "percentage" ? tipPercentage : undefined
        order.totalAmount = roundCurrency(subtotalAmount + tipAmount)

        // 8. Create line items from order items (including add-ons)
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item: any) => {
            // Calculate unit price including add-ons
            const addOnsPrice = item.selectedAddOns?.reduce((sum: number, addon: any) =>
                sum + addon.price, 0) || 0
            const unitPriceWithAddOns = item.price + addOnsPrice

            // Build description including add-ons
            let description = item.title
            if (item.selectedAddOns && item.selectedAddOns.length > 0) {
                const addOnsText = item.selectedAddOns.map((addon: any) => addon.name).join(", ")
                description += ` (Add-ons: ${addOnsText})`
            }

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.title,
                        description: description,
                    },
                    unit_amount: Math.round(unitPriceWithAddOns * 100),
                },
                quantity: item.quantity,
                tax_rates: [taxRateId!],
            }
        })

        if (tipAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Tip",
                        description: "Customer tip for the team",
                    },
                    unit_amount: Math.round(tipAmount * 100),
                },
                quantity: 1,
            })
        }

        // 9. Create Stripe checkout session with BNPL support
        const session = await stripe.checkout.sessions.create({
            payment_method_configuration: "pmc_1SyiSIEElRlbgqgdrP38OJdM", // Use your BNPL-enabled config
            line_items: lineItems,
            mode: "payment",
            currency: "usd", // Required for BNPL methods
            success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
            cancel_url: `${req.nextUrl.origin}/checkout/cancel`,
            customer_email: userEmail || undefined,
            shipping_address_collection: {
                allowed_countries: ["US"],
            },
            phone_number_collection: {
                enabled: true,
            },
            metadata: {
                orderId: order._id.toString(),
                foodSubtotal: subtotalAmount.toFixed(2),
                tipAmount: tipAmount.toFixed(2),
                tipType,
                ...(tipType === "percentage" && tipPercentage ? { tipPercentage: String(tipPercentage) } : {}),
            },
        })

        // 10. Update order with new Stripe session ID
        order.stripeSessionId = session.id
        await order.save()

        // 11. Return session URL for redirect
        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        })
    } catch (error: any) {
        console.error("Resume checkout error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to resume checkout" },
            { status: 500 }
        )
    }
}
