import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { verifyJWT } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const payload = await verifyJWT(token)
        if (!payload?.userId) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            )
        }

        const { phone } = await req.json()

        if (!phone) {
            return NextResponse.json(
                { message: "Phone is required" },
                { status: 400 }
            )
        }

        const phoneRegex = /^\+?[\d\s\-()]{10,}$/
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { message: "Please provide a valid phone number" },
                { status: 400 }
            )
        }

        await dbConnect()

        const user = await User.findById(payload.userId)
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        user.phone = phone
        user.phoneVerified = true
        await user.save()

        return NextResponse.json({ message: "Phone updated successfully" })
    } catch (error) {
        console.error("Phone update error:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
