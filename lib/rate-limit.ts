import { NextRequest, NextResponse } from "next/server"

const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
    req: NextRequest,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const now = Date.now()

    const record = rateLimit.get(ip)

    if (!record || now > record.resetTime) {
        rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
        return true
    }

    if (record.count >= maxAttempts) {
        return false
    }

    record.count++
    return true
}

export function getRateLimitResponse(): NextResponse {
    return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
    )
}
