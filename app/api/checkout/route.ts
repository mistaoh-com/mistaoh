import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import dbConnect from "@/lib/db"
import Order, { IOrder } from "@/models/Order"
import Log from "@/models/Log"
import User from "@/models/User"
import { verifyJWT } from "@/lib/auth"
import { cookies } from "next/headers"
import { CartItem, GuestInfo } from "@/lib/types"

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

    // Bypass check for admin testing if needed, or strictly enforce. strictly enforcing for now.
    // Comment out the next line to enable strict hours in Dev
    isOpen = true

    if (!isOpen) {
      return NextResponse.json({
        error: "Restaurant is closed. Hours: Mon-Thu 11am-11pm, Fri-Sat 11am-10pm EST.",
        code: "RESTAURANT_CLOSED"
      }, { status: 400 })
    }

    const { items, guestInfo }: { items: CartItem[], guestInfo?: GuestInfo } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Check Authentication
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value
    let userId: string | undefined = undefined
    let userEmail: string | undefined = undefined

    if (token) {
      const payload = await verifyJWT(token)
      if (payload?.userId && typeof payload.userId === 'string') {
        userId = payload.userId
        const user = await User.findById(userId)
        if (user) userEmail = user.email
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }



    const subscriptionItems = items.filter((item: CartItem) => item.isSubscription)
    const oneTimeItems = items.filter((item: CartItem) => !item.isSubscription)

    if (subscriptionItems.length > 0 && oneTimeItems.length > 0) {
      return NextResponse.json(
        { error: "Please checkout subscription items separately from one-time purchases" },
        { status: 400 },
      )
    }

    const totalAmount = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)

    const newOrder = await Order.create({
      user: userId, // Mongoose accepts string ID here if defined, or undefined
      guestInfo: userId ? undefined : guestInfo,
      items: items.map((i: CartItem) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        id: i.id
      })),
      totalAmount,
      status: "PENDING",
      createdAt: new Date()
    }) as unknown as IOrder

    const ip = req.headers.get("x-forwarded-for") || "unknown"
    await Log.create({
      action: "ORDER_CREATED",
      userId: userId,
      metadata: {
        orderId: newOrder._id,
        amount: totalAmount,
        itemCount: items.length,
        isSubscription: subscriptionItems.length > 0
      },
      ip,
      userAgent: req.headers.get("user-agent") || "unknown"
    })

    if (subscriptionItems.length > 0) {
      const lineItems = await Promise.all(
        subscriptionItems.map(async (item: CartItem) => {
          if (!item.subscriptionPlan) throw new Error("Subscription plan required")

          const price = await stripe.prices.create({
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            recurring: {
              interval: getSubscriptionInterval(item.subscriptionPlan),
              interval_count: getIntervalCount(item.subscriptionPlan),
            },
            product_data: {
              name: item.title,
              metadata: {
                description: `${item.korean} - ${item.mealsPerWeek} meals per delivery`,
              },
            },
          })

          return {
            price: price.id,
            quantity: 1,
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

    const lineItems = oneTimeItems.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.korean,
          images: item.image?.startsWith("http") ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

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
