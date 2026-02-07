import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import { verifyAdminToken } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const cookieStore = cookies()
        const adminToken = cookieStore.get("admin_token")

        if (!adminToken) {
            return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 })
        }

        const isAdmin = await verifyAdminToken(adminToken.value)
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized - Invalid or expired token" }, { status: 401 })
        }

        await dbConnect()

        // Fetch all orders sorted by newest first (excluding PENDING/unpaid)
        const orders = await Order.find({ status: { $ne: 'PENDING' } })
            .sort({ createdAt: -1 })
            .populate("user", "name email phone")

        return NextResponse.json({ orders })
    } catch (error) {
        console.error("Failed to fetch orders:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
