import { NextResponse } from "next/server"
import { generateOAuthState, getGoogleAuthUrl } from "@/lib/oauth"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const redirectTo = searchParams.get("redirect") || "/"

        // Generate secure state with redirect info
        const state = generateOAuthState(redirectTo)

        // Build Google OAuth URL
        const authUrl = getGoogleAuthUrl(state)

        // Store state in cookie for verification (more secure than localStorage)
        const response = NextResponse.redirect(authUrl)
        response.cookies.set("oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10, // 10 minutes
            path: "/",
        })

        return response
    } catch (error) {
        console.error("OAuth initiation error:", error)
        return NextResponse.redirect(
            new URL("/login?error=oauth_failed", req.url)
        )
    }
}
