import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import Log from "@/models/Log"

export const dynamic = 'force-dynamic'

// This endpoint should be called by a cron job (e.g., Vercel Cron or external service)
// to automatically delete COMPLETED orders older than 12 hours
export async function GET(req: Request) {
    try {
        // Optional: Add authorization header check for security
        const authHeader = req.headers.get("authorization")
        const cronSecret = process.env.CRON_SECRET

        // If CRON_SECRET is set, verify it matches
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        await dbConnect()

        // Calculate the cutoff time (12 hours ago)
        const twelveHoursAgo = new Date()
        twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12)

        // Find COMPLETED orders that were updated more than 12 hours ago
        const ordersToDelete = await Order.find({
            status: "COMPLETED",
            updatedAt: { $lt: twelveHoursAgo }
        })

        if (ordersToDelete.length === 0) {
            return NextResponse.json({
                message: "No orders to delete",
                deleted: 0
            })
        }

        // Log the cleanup action
        await Log.create({
            action: "CLEANUP_COMPLETED_ORDERS",
            metadata: {
                count: ordersToDelete.length,
                orderIds: ordersToDelete.map(o => o._id.toString()),
                cutoffTime: twelveHoursAgo.toISOString()
            },
            ip: req.headers.get("x-forwarded-for") || "cron-job",
            userAgent: req.headers.get("user-agent") || "cron-job"
        })

        // Delete the orders
        const deleteResult = await Order.deleteMany({
            status: "COMPLETED",
            updatedAt: { $lt: twelveHoursAgo }
        })

        return NextResponse.json({
            message: "Cleanup completed successfully",
            deleted: deleteResult.deletedCount,
            cutoffTime: twelveHoursAgo.toISOString()
        })
    } catch (error: any) {
        console.error("Order cleanup error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to clean up orders" },
            { status: 500 }
        )
    }
}

// Also support POST method for cron services that prefer POST
export async function POST(req: Request) {
    return GET(req)
}
