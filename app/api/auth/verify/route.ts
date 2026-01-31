import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Log from "@/models/Log"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
        return NextResponse.json({ message: "Missing token" }, { status: 400 })
    }

    try {
        await dbConnect()

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() },
        })

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            )
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiry = undefined
        await user.save()

        // Log action
        await Log.create({
            action: "USER_VERIFIED",
            userId: user._id,
            metadata: { email: user.email },
            ip: req.headers.get("x-forwarded-for") || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown",
        })

        // Redirect to login page
        return NextResponse.redirect(new URL("/login?verified=true", req.url))
    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
