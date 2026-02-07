import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import crypto from "crypto"
import dbConnect from "@/lib/db"
import Order, { IOrder } from "@/models/Order"
import Log from "@/models/Log"
import User from "@/models/User"
import { verifyJWT } from "@/lib/auth"
import { cookies } from "next/headers"
import { CartItem, GuestInfo } from "@/lib/types"
import { validateEmail, validatePhone } from "@/lib/validation"
import { ErrorCode, createErrorResponse } from "@/lib/errors"

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY || process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
})

function getSubscriptionInterval(plan: string): "week" | "month" {
  switch (plan) {
    case "weekly":
      return "week"
    case "biweekly":
      return "week"
    case "monthly":
      return "month"
    default:
      return "week"
  }
}

function getIntervalCount(plan: string): number {
  return plan === "biweekly" ? 2 : 1
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // 1. Check Operating Hours (New York Time)
    const now = new Date()
    const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
    const day = nyTime.getDay() // 0 = Sun, 1 = Mon, ... 6 = Sat
    const hour = nyTime.getHours()
    const minute = nyTime.getMinutes()

    let isOpen = false

    // Sunday (0): Closed
    if (day === 0) {
      isOpen = false
    }
    // Mon (1) - Thu (4): 11:00 AM - 11:00 PM
    else if (day >= 1 && day <= 4) {
      if (hour >= 11 && hour < 23) isOpen = true
    }
    // Fri (5) - Sat (6): 11:00 AM - 10:00 PM
    else if (day === 5 || day === 6) {
      if (hour >= 11 && hour < 22) isOpen = true
    }

    // Use environment variable for bypass (dev/testing only)
    const bypassHours = process.env.BYPASS_HOURS === 'true'
    if (bypassHours && process.env.NODE_ENV !== 'production') {
      isOpen = true
    }

    if (!isOpen && !bypassHours) {
      return createErrorResponse(ErrorCode.RESTAURANT_CLOSED, 400)
    }

    const { items, guestInfo }: { items: CartItem[], guestInfo?: GuestInfo } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Check Authentication OR Guest Info
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value
    let userId: string | undefined = undefined
    let userEmail: string | undefined = undefined
    let isGuest = false

    if (token) {
      const payload = await verifyJWT(token)
      if (payload?.userId && typeof payload.userId === 'string') {
        userId = payload.userId
        const user = await User.findById(userId)
        if (user) userEmail = user.email
      }
    }

    // If no authenticated user, require guest info
    if (!userId) {
      if (!guestInfo || !guestInfo.name || !guestInfo.email || !guestInfo.phone) {
        return NextResponse.json(
          { error: "Guest information required" },
          { status: 400 }
        )
      }

      // Validate guest email
      if (!validateEmail(guestInfo.email)) {
        return createErrorResponse(ErrorCode.INVALID_EMAIL, 400)
      }

      // Validate guest phone
      if (!validatePhone(guestInfo.phone)) {
        return createErrorResponse(ErrorCode.INVALID_PHONE, 400)
      }

      isGuest = true
      userEmail = guestInfo.email
    }

    // Get tax rate ID (optional for testing)
    const taxRateId = process.env.STRIPE_TAX_RATE_ID
    if (!taxRateId) {
      console.warn("STRIPE_TAX_RATE_ID is not configured - checkout will proceed without tax")
    }

    const subscriptionItems = items.filter((item: CartItem) => item.isSubscription)
    const oneTimeItems = items.filter((item: CartItem) => !item.isSubscription)

    if (subscriptionItems.length > 0 && oneTimeItems.length > 0) {
      return NextResponse.json(
        { error: "Please checkout subscription items separately from one-time purchases" },
        { status: 400 },
      )
    }

    // Calculate total including add-ons
    const totalAmount = items.reduce((sum: number, item: CartItem) => {
      const addOnsPrice = item.selectedAddOns?.reduce((addonSum, addon) =>
        addonSum + addon.price, 0) || 0
      return sum + ((item.price + addOnsPrice) * item.quantity)
    }, 0)

    // Generate guest token for non-authenticated users
    const guestToken = !userId ? crypto.randomBytes(32).toString("hex") : undefined

    const newOrder = await Order.create({
      user: userId, // Mongoose accepts string ID here if defined, or undefined
      guestInfo: userId ? undefined : guestInfo,
      guestToken: guestToken,
      items: items.map((i: CartItem) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        id: i.id,
        selectedAddOns: i.selectedAddOns
      })),
      totalAmount,
      status: "PENDING",
      createdAt: new Date()
    }) as unknown as IOrder

    const ip = req.headers.get("x-forwarded-for") || "unknown"
    await Log.create({
      action: isGuest ? "GUEST_ORDER_CREATED" : "ORDER_CREATED",
      userId: userId,
      metadata: {
        orderId: newOrder._id,
        amount: totalAmount,
        itemCount: items.length,
        isSubscription: subscriptionItems.length > 0,
        isGuest,
        guestEmail: isGuest ? guestInfo?.email : undefined
      },
      ip,
      userAgent: req.headers.get("user-agent") || "unknown"
    })

    if (subscriptionItems.length > 0) {
      const lineItems = await Promise.all(
        subscriptionItems.map(async (item: CartItem) => {
          if (!item.subscriptionPlan) throw new Error("Subscription plan required")

          // Calculate price including add-ons
          const addOnsPrice = item.selectedAddOns?.reduce((sum, addon) => sum + addon.price, 0) || 0
          const priceWithAddOns = item.price + addOnsPrice

          // Build description including add-ons
          let description = `${item.korean} - ${item.mealsPerWeek} meals per delivery`
          if (item.selectedAddOns && item.selectedAddOns.length > 0) {
            const addOnsText = item.selectedAddOns.map(addon => addon.name).join(", ")
            description += ` (Add-ons: ${addOnsText})`
          }

          const price = await stripe.prices.create({
            currency: "usd",
            unit_amount: Math.round(priceWithAddOns * 100),
            recurring: {
              interval: getSubscriptionInterval(item.subscriptionPlan),
              interval_count: getIntervalCount(item.subscriptionPlan),
            },
            product_data: {
              name: item.title,
              metadata: {
                description: description,
              },
            },
          })

          return {
            price: price.id,
            quantity: 1,
            ...(taxRateId && { tax_rates: [taxRateId] }),
          }
        }),
      )

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "subscription",
        success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${newOrder._id}`,
        cancel_url: `${req.nextUrl.origin}/checkout/cancel`,
        customer_email: userEmail || undefined,
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        phone_number_collection: {
          enabled: true,
        },
        subscription_data: {
          metadata: {
            orderId: newOrder._id.toString(),
            items: JSON.stringify(
              subscriptionItems.map((item: CartItem) => ({
                title: item.title,
                plan: item.subscriptionPlan,
                mealsPerWeek: item.mealsPerWeek,
                price: item.price,
                description: `${item.korean} - ${item.mealsPerWeek} meals/week`
              })),
            ),
          },
        },
        metadata: {
          orderId: newOrder._id.toString()
        }
      })

      newOrder.stripeSessionId = session.id
      await newOrder.save()

      return NextResponse.json({ sessionId: session.id, url: session.url })
    }

    const lineItems = oneTimeItems.map((item: CartItem) => {
      // Calculate unit price including add-ons
      const addOnsPrice = item.selectedAddOns?.reduce((sum, addon) => sum + addon.price, 0) || 0
      const unitPriceWithAddOns = item.price + addOnsPrice

      // Build description including add-ons
      let description = item.korean
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        const addOnsText = item.selectedAddOns.map(addon => addon.name).join(", ")
        description += ` (Add-ons: ${addOnsText})`
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: description,
            images: item.image?.startsWith("http") ? [item.image] : [],
          },
          unit_amount: Math.round(unitPriceWithAddOns * 100),
        },
        quantity: item.quantity,
        ...(taxRateId && { tax_rates: [taxRateId] }),
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${newOrder._id}`,
      cancel_url: `${req.nextUrl.origin}/checkout/cancel`,
      customer_email: userEmail || undefined,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        orderId: newOrder._id.toString(),
      },
    })

    newOrder.stripeSessionId = session.id
    await newOrder.save()

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
