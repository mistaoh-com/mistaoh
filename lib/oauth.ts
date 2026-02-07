import crypto from "crypto"

/**
 * Generate secure OAuth state token with CSRF protection
 * @param redirectTo - URL to redirect to after OAuth completion
 * @returns Base64URL-encoded state token
 */
export function generateOAuthState(redirectTo?: string): string {
    const state = {
        nonce: crypto.randomBytes(32).toString("hex"),
        redirect: redirectTo || "/",
        timestamp: Date.now(),
    }
    return Buffer.from(JSON.stringify(state)).toString("base64url")
}

/**
 * Verify OAuth state token
 * @param stateParam - State parameter from OAuth callback
 * @returns Object with redirect URL and validity status
 */
export function verifyOAuthState(stateParam: string): {
    redirect: string
    valid: boolean
} {
    try {
        const decoded = JSON.parse(
            Buffer.from(stateParam, "base64url").toString()
        )
        const age = Date.now() - decoded.timestamp

        // State expires after 10 minutes
        if (age > 10 * 60 * 1000) {
            return { redirect: "/", valid: false }
        }

        return { redirect: decoded.redirect, valid: true }
    } catch {
        return { redirect: "/", valid: false }
    }
}

/**
 * Build Google OAuth authorization URL
 * @param state - State token for CSRF protection
 * @returns Google OAuth authorization URL
 */
export function getGoogleAuthUrl(state: string): string {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/auth/google/callback`,
        response_type: "code",
        scope: "openid email profile",
        state,
        access_type: "offline",
        prompt: "consent",
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 * @param code - Authorization code from Google
 * @returns Token response from Google
 */
export async function exchangeGoogleCode(code: string) {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/api/auth/google/callback`,
            grant_type: "authorization_code",
        }),
    })

    if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for tokens")
    }

    return tokenResponse.json()
}

/**
 * Get user information from Google
 * @param accessToken - Access token from Google
 * @returns User profile information
 */
export async function getGoogleUserInfo(accessToken: string) {
    const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    )

    if (!response.ok) {
        throw new Error("Failed to fetch user info")
    }

    return response.json()
}
