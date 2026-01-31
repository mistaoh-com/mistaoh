import { NextRequest, NextResponse } from "next/server"
import { sendCateringEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, eventDate, guestCount, eventType, message } = body

    // Validate required fields
    if (!name || !email || !phone || !eventDate || !guestCount || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Use centralized email helper
    await sendCateringEmail({
      name,
      email,
      phone,
      eventDate,
      guestCount,
      eventType,
      message
    })

    return NextResponse.json(
      { success: true, message: "Inquiry sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending catering inquiry:", error)
    return NextResponse.json(
      { error: "Failed to send inquiry. Please try again or contact us directly." },
      { status: 500 }
    )
  }
}
