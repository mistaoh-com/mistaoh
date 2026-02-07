import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Log from "@/models/Log"
import { signJWT } from "@/lib/auth"
import {
    verifyOAuthState,
    exchangeGoogleCode,
    getGoogleUserInfo,
} from "@/lib/oauth"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        // Handle user denial
        if (error) {
            return NextResponse.redirect(
                new URL("/login?error=oauth_cancelled", req.url)
            )
        }

        if (!code || !state) {
            return NextResponse.redirect(
                new URL("/login?error=oauth_failed", req.url)
            )
        }

        // Verify state (CSRF protection)
        const cookieStore = cookies()
        const storedState = cookieStore.get("oauth_state")?.value

        if (!storedState || storedState !== state) {
            return NextResponse.redirect(
                new URL("/login?error=invalid_state", req.url)
            )
        }

        const { redirect, valid } = verifyOAuthState(state)
        if (!valid) {
            return NextResponse.redirect(
                new URL("/login?error=expired_state", req.url)
            )
        }

        // Exchange code for tokens
        const tokens = await exchangeGoogleCode(code)

        // Get user info from Google
        const googleUser = await getGoogleUserInfo(tokens.access_token)

        await dbConnect()

        // Check if user exists by googleId or email
        let user = await User.findOne({
            $or: [{ googleId: googleUser.id }, { email: googleUser.email }],
        })

        const ip = req.headers.get("x-forwarded-for") || "unknown"
        const userAgent = req.headers.get("user-agent") || "unknown"

        if (user) {
            // Update existing user with Google ID if not set
            if (!user.googleId) {
                user.googleId = googleUser.id
                user.provider = "google"
                user.isVerified = true
                await user.save()
            }

            // Log login
            await Log.create({
                action: "GOOGLE_LOGIN_SUCCESS",
                userId: user._id,
                ip,
                userAgent,
            })

            // Check if phone is missing
            if (!user.phone) {
                // Redirect to phone collection page
                const token = await signJWT(
                    {
                        userId: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        role: "user",
                    },
                    "1d"
                )

                const response = NextResponse.redirect(
                    new URL(
                        `/complete-profile?redirect=${encodeURIComponent(redirect)}`,
                        req.url
                    )
                )
                response.cookies.set("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24,
                    path: "/",
                })
                response.cookies.delete("oauth_state")
                return response
            }
        } else {
            // Create new user
            user = await User.create({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.id,
                provider: "google",
                isVerified: true,
                password: crypto.randomBytes(32).toString("hex"), // Random password (never used)
                phone: "", // Will be collected later
            })

            await Log.create({
                action: "GOOGLE_REGISTER_SUCCESS",
                userId: user._id,
                metadata: { email: user.email },
                ip,
                userAgent,
            })

            // Redirect to phone collection
            const token = await signJWT(
                {
                    userId: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: "user",
                },
                "1d"
            )

            const response = NextResponse.redirect(
                new URL(
                    `/complete-profile?redirect=${encodeURIComponent(redirect)}`,
                    req.url
                )
            )
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24,
                path: "/",
            })
            response.cookies.delete("oauth_state")
            return response
        }

        // Generate JWT and redirect
        const token = await signJWT(
            {
                userId: user._id.toString(),
                email: user.email,
                name: user.name,
                role: "user",
            },
            "1d"
        )

        const response = NextResponse.redirect(new URL(redirect, req.url))
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        })
        response.cookies.delete("oauth_state")

        return response
    } catch (error: any) {
        console.error("OAuth callback error:", error)
        return NextResponse.redirect(
            new URL("/login?error=oauth_failed", req.url)
        )
    }
}
