import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT } from "@/lib/auth"

export const dynamic = "force-dynamic"

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
}

export async function GET() {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { headers: NO_STORE_HEADERS },
      )
    }

    const payload = await verifyJWT(token)

    if (
      !payload ||
      payload.role !== "user" ||
      !payload.userId ||
      typeof payload.userId !== "string"
    ) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { headers: NO_STORE_HEADERS },
      )
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          name: payload.name || "",
          email: payload.email || "",
          phone: "",
        },
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    console.error("Session check failed:", error)
    return NextResponse.json(
      { authenticated: false, user: null },
      { headers: NO_STORE_HEADERS },
    )
  }
}
