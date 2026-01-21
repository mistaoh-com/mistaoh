import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

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
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const subscriptionItems = items.filter((item: any) => item.isSubscription)
    const oneTimeItems = items.filter((item: any) => !item.isSubscription)

    if (subscriptionItems.length > 0 && oneTimeItems.length > 0) {
      return NextResponse.json(
        { error: "Please checkout subscription items separately from one-time purchases" },
        { status: 400 },
      )
    }

    if (subscriptionItems.length > 0) {
      const lineItems = await Promise.all(
        subscriptionItems.map(async (item: any) => {
          // Create a price for this subscription
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
        success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.nextUrl.origin}/checkout/cancel`,
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        phone_number_collection: {
          enabled: true,
        },
        subscription_data: {
          metadata: {
            items: JSON.stringify(
              subscriptionItems.map((item: any) => ({
                title: item.title,
                plan: item.subscriptionPlan,
                mealsPerWeek: item.mealsPerWeek,
                price: item.price,
                description: `${item.korean} - ${item.mealsPerWeek} meals/week`
              })),
            ),
          },
        },
      })

      return NextResponse.json({ sessionId: session.id, url: session.url })
    }

    const lineItems = oneTimeItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.korean,
          images: item.image.startsWith("http") ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(
          oneTimeItems.map((item: any) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            description: item.korean
          })),
        ),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
