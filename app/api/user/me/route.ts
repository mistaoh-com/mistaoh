import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Order from "@/models/Order"
import Log from "@/models/Log"
import { verifyJWT } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const payload = await verifyJWT(token)
        if (!payload || !payload.userId || typeof payload.userId !== 'string') {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 })
        }

        await dbConnect()

        // Fetch User (exclude password)
        const user = await User.findById(payload.userId).select("-password -verificationToken")

        // Fetch Orders
        const orders = await Order.find({ user: payload.userId }).sort({ createdAt: -1 })

        // Log this view
        const ip = req.headers.get("x-forwarded-for") || "unknown"
        const userAgent = req.headers.get("user-agent") || "unknown"

        // Only log if it's not spamming logs (optional, but requirement says "Log every view")
        await Log.create({
            action: "USER_DASHBOARD_VIEW",
            userId: payload.userId,
            ip,
            userAgent
        })

        return NextResponse.json({ user, orders })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
