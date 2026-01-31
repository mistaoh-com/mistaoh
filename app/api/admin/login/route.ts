import { NextResponse } from "next/server"


export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        const ADMIN_USER = process.env.ADMIN_USER
        const ADMIN_PASS = process.env.ADMIN_PASS

        if (!ADMIN_USER || !ADMIN_PASS) {
            console.error("Admin credentials not set in env variables")
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
        }

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            const response = NextResponse.json({ message: "Login successful" })

            response.cookies.set("admin_token", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            })

            return response
        } else {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
        }

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
