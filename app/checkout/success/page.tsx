"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle, Calendar, Package } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { CartItem } from "@/lib/types"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isSubscription, setIsSubscription] = useState(false)
  const hasVerified = useRef(false)

  useEffect(() => {
    // Identify if it's a subscription based on local cart
    const cart = localStorage.getItem("mistaoh-cart")
    if (cart) {
      try {
        const items: CartItem[] = JSON.parse(cart)
        const hasSubscription = items.some((item) => item.isSubscription)
        setIsSubscription(hasSubscription)
      } catch (e) {
        // ignore corrupted cart
      }
    }

    if (sessionId && !hasVerified.current) {
      hasVerified.current = true

      // Verify payment and send email
      fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error("Verification failed:", data.error)
          }
          // success silently
        })
        .catch(err => console.error("Verification error:", err))

      // Update local storage orders
      // Note: In a real app, orders should be fetched from backend
      if (cart) {
        try {
          const items: CartItem[] = JSON.parse(cart)
          const hasSubscription = items.some((item) => item.isSubscription)
          const orders = JSON.parse(localStorage.getItem("mistaoh-orders") || "[]")

          // Check if order already added to avoid duplicates on refresh
          const exists = orders.some((o: any) => o.id === sessionId)
          if (!exists) {
            const newOrder = {
              id: sessionId,
              date: new Date().toLocaleDateString(),
              status: hasSubscription ? "Active" : "Processing",
              total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
              items: items.map((item) => ({
                title: item.title,
                quantity: item.quantity,
                price: item.price,
              })),
              isSubscription: hasSubscription,
              subscriptionPlan: hasSubscription ? items[0].subscriptionPlan : undefined,
              nextDelivery: hasSubscription ? getNextDeliveryDate(items[0].subscriptionPlan || "weekly") : undefined,

            }
            orders.unshift(newOrder)
            localStorage.setItem("mistaoh-orders", JSON.stringify(orders))

            // Clear cart ONLY if order processed successfully
            localStorage.removeItem("mistaoh-cart")
          }
        } catch (e) {
          console.error("Error updating local orders", e)
        }
      }
    }
  }, [sessionId])

  const getNextDeliveryDate = (plan: string) => {
    const today = new Date()
    let daysToAdd = 7 // default weekly

    if (plan === "biweekly") {
      daysToAdd = 14
    } else if (plan === "monthly") {
      daysToAdd = 30
    }

    const nextDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    return nextDate.toLocaleDateString()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-20 mt-20">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl mb-6 text-balance">
            {isSubscription ? "Subscription Activated!" : "Order Confirmed!"}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {isSubscription
              ? "Thank you for subscribing! Your meal plan is now active and we'll deliver fresh Korean meals on your schedule."
              : "Thank you for your order! We've received your payment and will start preparing your delicious Korean meal."}
          </p>

          <div className="bg-surface border border-border rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">What's Next?</h2>
            <ul className="text-left space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>
                  You'll receive an email confirmation with your {isSubscription ? "subscription" : "order"} details
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>
                  {isSubscription
                    ? "Your first delivery will be prepared and shipped according to your plan"
                    : "Our kitchen will start preparing your order"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>
                  {isSubscription
                    ? "You can manage your subscription anytime from your orders page"
                    : "We'll notify you when your order is ready for pickup or delivery"}
                </span>
              </li>
            </ul>
          </div>

          {isSubscription && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Subscription Benefits</h3>
              </div>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>✓ Automatic recurring deliveries</li>
                <li>✓ Exclusive subscription discounts</li>
                <li>✓ Skip or pause anytime</li>
                <li>✓ Modify your box contents</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              View {isSubscription ? "Subscription" : "Order"}
            </Link>
            <Link
              href="/menu"
              className="bg-surface hover:bg-gray-100 text-foreground px-8 py-4 rounded-lg font-semibold transition-colors border border-border"
            >
              Browse Menu
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Questions? Call us at{" "}
            <a href="tel:6465598858" className="text-primary hover:underline font-semibold">
              (646) 559-8858
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
