import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Log from "@/models/Log"
import { hashPassword } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { name, email, password, phone } = await req.json()

        // Validation
        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            )
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Please provide a valid email address" },
                { status: 400 }
            )
        }

        // Basic phone validation (at least 10 digits)
        const phoneRegex = /^\+?[\d\s\-()]{10,}$/
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { message: "Please provide a valid phone number (at least 10 digits)" },
                { status: 400 }
            )
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
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
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
