import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Log from "@/models/Log"
import { verifyPassword, signJWT } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit, getRateLimitResponse } from "@/lib/rate-limit"
import { ErrorCode, createErrorResponse } from "@/lib/errors"

const ADMIN_USER = process.env.ADMIN_USER
const ADMIN_PASS = process.env.ADMIN_PASS

if (!ADMIN_USER || !ADMIN_PASS) {
    console.warn("ADMIN_USER or ADMIN_PASS not defined in environment. Admin login will be disabled.")
}

export async function POST(req: NextRequest) {
    // Rate limiting check
    if (!checkRateLimit(req)) {
        return getRateLimitResponse()
    }

    try {
        await dbConnect()
        const { email, password } = await req.json()
        const ip = req.headers.get("x-forwarded-for") || "unknown"
        const userAgent = req.headers.get("user-agent") || "unknown"

        // 1. Check Admin Login
        if (ADMIN_USER && ADMIN_PASS && email === ADMIN_USER && password === ADMIN_PASS) {
            const token = await signJWT({ role: "admin", name: "Admin" })

            const response = NextResponse.json({ message: "Login successful", role: "admin" })
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            })

            // Log
            await Log.create({
                action: "ADMIN_LOGIN_SUCCESS",
                ip,
                userAgent,
            })

            return response
        }

        // 2. Check User Login
        const user = await User.findOne({ email })
        if (!user) {
            return createErrorResponse(ErrorCode.INVALID_CREDENTIALS, 401)
        }

        const isValid = await verifyPassword(password, user.password)
        if (!isValid) {
            return createErrorResponse(ErrorCode.INVALID_CREDENTIALS, 401)
        }

        if (!user.isVerified) {
            return createErrorResponse(ErrorCode.EMAIL_NOT_VERIFIED, 403)
        }

        // Generate JWT
        const token = await signJWT({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: "user"
        })

        const response = NextResponse.json({ message: "Login successful", role: "user" })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        })

        // Log
        await Log.create({
            action: "USER_LOGIN_SUCCESS",
            userId: user._id,
            ip,
            userAgent,
        })

        return response

    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
