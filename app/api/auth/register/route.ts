import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Log from "@/models/Log"
import { hashPassword } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/email"
import { checkRateLimit, getRateLimitResponse } from "@/lib/rate-limit"
import { validateEmail, validatePhone } from "@/lib/validation"
import { ErrorCode, createErrorResponse } from "@/lib/errors"

export async function POST(req: NextRequest) {
    // Rate limiting check
    if (!checkRateLimit(req)) {
        return getRateLimitResponse()
    }

    try {
        await dbConnect()
        const { name, email, password, phone } = await req.json()

        // Validation
        if (!name || !email || !password || !phone) {
            return createErrorResponse(ErrorCode.MISSING_FIELDS, 400)
        }

        if (!validateEmail(email)) {
            return createErrorResponse(ErrorCode.INVALID_EMAIL, 400)
        }

        if (!validatePhone(phone)) {
            return createErrorResponse(ErrorCode.INVALID_PHONE, 400)
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters long" },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json(
                    { message: "An account with this email already exists. Please sign in." },
                    { status: 409 }
                )
            }

            // User exists but is unverified - allow re-registration
            const hashedPassword = await hashPassword(password)
            const verificationToken = generateVerificationToken()
            const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

            existingUser.name = name
            existingUser.phone = phone
            existingUser.password = hashedPassword
            existingUser.verificationToken = verificationToken
            existingUser.verificationTokenExpiry = verificationTokenExpiry
            await existingUser.save()

            // Send Email
            await sendVerificationEmail(email, verificationToken)

            return NextResponse.json(
                { message: "Registration re-initiated. Please check your email to verify your account." },
                { status: 200 }
            )
        }

        // Create user
        const hashedPassword = await hashPassword(password)
        const verificationToken = generateVerificationToken()
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            verificationToken,
            verificationTokenExpiry,
        })

        // Log action
        await Log.create({
            action: "USER_REGISTER_INITIATED",
            userId: user._id,
            metadata: { email: user.email },
            ip: req.headers.get("x-forwarded-for") || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown",
        })

        // Send Email
        await sendVerificationEmail(email, verificationToken)

        return NextResponse.json(
            { message: "Registration successful. Please check your email to verify account." },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        )
    }
}
