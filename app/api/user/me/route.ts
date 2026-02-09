import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Order from "@/models/Order"
import Log from "@/models/Log"
import { verifyJWT } from "@/lib/auth"

export const dynamic = 'force-dynamic'

const NO_STORE_HEADERS = {
    "Cache-Control": "private, no-store, max-age=0",
}

function shouldLogDashboardView() {
    if (process.env.ENABLE_DASHBOARD_VIEW_LOGS !== "true") {
        return false
    }

    const sampleRate = Number.parseFloat(process.env.DASHBOARD_VIEW_LOG_SAMPLE_RATE ?? "1")
    const normalizedSampleRate = Number.isFinite(sampleRate)
        ? Math.min(Math.max(sampleRate, 0), 1)
        : 1

    return Math.random() < normalizedSampleRate
}

export async function GET(req: Request) {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401, headers: NO_STORE_HEADERS }
            )
        }

        const payload = await verifyJWT(token)
        if (!payload || !payload.userId || typeof payload.userId !== 'string') {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401, headers: NO_STORE_HEADERS }
            )
        }

        await dbConnect()

        const [user, orders] = await Promise.all([
            User.findById(payload.userId).select("name email phone provider").lean(),
            Order.find({ user: payload.userId })
                .sort({ createdAt: -1 })
                .limit(20)
                .select("totalAmount status createdAt items")
                .lean(),
        ])

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404, headers: NO_STORE_HEADERS }
            )
        }

        if (shouldLogDashboardView()) {
            const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
            const userAgent = req.headers.get("user-agent") || "unknown"

            void Log.create({
                action: "USER_DASHBOARD_VIEW",
                userId: payload.userId,
                ip,
                userAgent,
            }).catch((logError) => {
                console.error("Failed to write USER_DASHBOARD_VIEW log:", logError)
            })
        }

        return NextResponse.json({ user, orders }, { headers: NO_STORE_HEADERS })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500, headers: NO_STORE_HEADERS }
        )
    }
}
