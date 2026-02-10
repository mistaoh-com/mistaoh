import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import Log from "@/models/Log"
import { verifyJWT } from "@/lib/auth"
import { isValidTipPercentage, roundCurrency } from "@/lib/tip"

export const dynamic = 'force-dynamic'

// PATCH - Update order items (only PENDING orders)
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Verify user authentication
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const payload = await verifyJWT(token)
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            )
        }

        const userId = payload.userId

        // 2. Parse request body
        const { items } = await req.json()

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Items array is required and cannot be empty" },
                { status: 400 }
            )
        }

        // 3. Validate items structure
        const isValidItems = items.every(
            (item: any) =>
                item.title &&
                typeof item.title === "string" &&
                item.quantity &&
                typeof item.quantity === "number" &&
                item.quantity > 0 &&
                item.price &&
                typeof item.price === "number" &&
                item.price >= 0
        )

        if (!isValidItems) {
            return NextResponse.json(
                { error: "Invalid items format" },
                { status: 400 }
            )
        }

        await dbConnect()

        // 4. Fetch order
        const order = await Order.findById(params.id)

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        // 5. Verify order ownership
        if (order.user?.toString() !== userId) {
            return NextResponse.json(
                { error: "You do not have permission to modify this order" },
                { status: 403 }
            )
        }

        // 6. Verify order status is PENDING
        if (order.status !== "PENDING") {
            return NextResponse.json(
                { error: "Order is no longer pending and cannot be modified" },
                { status: 403 }
            )
        }

        // 7. Store previous data for logging
        const previousItems = order.items
        const previousTotal = order.totalAmount

        // 8. Recalculate subtotal and preserve tip strategy
        const subtotalAmount = roundCurrency(
            items.reduce((sum: number, item: any) => {
                const addOnsPrice = item.selectedAddOns?.reduce((addOnSum: number, addon: any) => addOnSum + addon.price, 0) || 0
                return sum + (item.price + addOnsPrice) * item.quantity
            }, 0),
        )

        let tipAmount = 0
        if (order.tipType === "percentage" && isValidTipPercentage(order.tipPercentage)) {
            tipAmount = roundCurrency((subtotalAmount * order.tipPercentage) / 100)
        } else if (typeof order.tipAmount === "number" && Number.isFinite(order.tipAmount) && order.tipAmount >= 0) {
            tipAmount = roundCurrency(order.tipAmount)
        }

        const totalAmount = roundCurrency(subtotalAmount + tipAmount)

        // 9. Update order
        order.items = items
        order.subtotal = subtotalAmount
        order.tipAmount = tipAmount
        order.totalAmount = totalAmount
        await order.save()

        // 10. Log the update
        await Log.create({
            action: "ORDER_UPDATED_BY_USER",
            userId: userId,
            metadata: {
                orderId: order._id.toString(),
                previousItems,
                newItems: items,
                subtotal: subtotalAmount,
                tipAmount,
                previousTotal,
                newTotal: totalAmount,
            },
            ip: req.headers.get("x-forwarded-for") || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown",
        })

        return NextResponse.json({ order })
    } catch (error: any) {
        console.error("Failed to update order:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE - Cancel order (soft delete - change status to CANCELLED)
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Verify user authentication
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const payload = await verifyJWT(token)
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            )
        }

        const userId = payload.userId

        await dbConnect()

        // 2. Fetch order
        const order = await Order.findById(params.id)

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        // 3. Verify order ownership
        if (order.user?.toString() !== userId) {
            return NextResponse.json(
                { error: "You do not have permission to cancel this order" },
                { status: 403 }
            )
        }

        // 4. Verify order status is PENDING
        if (order.status !== "PENDING") {
            return NextResponse.json(
                { error: "Order is no longer pending and cannot be cancelled" },
                { status: 403 }
            )
        }

        // 5. Soft delete - update status to CANCELLED
        order.status = "CANCELLED"
        await order.save()

        // 6. Log the cancellation
        await Log.create({
            action: "ORDER_CANCELLED_BY_USER",
            userId: userId,
            metadata: {
                orderId: order._id.toString(),
                items: order.items,
                totalAmount: order.totalAmount,
            },
            ip: req.headers.get("x-forwarded-for") || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown",
        })

        return NextResponse.json({
            message: "Order cancelled successfully",
            order: {
                _id: order._id,
                status: order.status,
            },
        })
    } catch (error: any) {
        console.error("Failed to cancel order:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
