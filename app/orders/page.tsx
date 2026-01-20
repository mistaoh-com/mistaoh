"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Package, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: Array<{
    title: string
    quantity: number
    price: number
  }>
  isSubscription?: boolean
  subscriptionPlan?: string
  nextDelivery?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("mistaoh-orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-100"
      case "in transit":
        return "text-blue-600 bg-blue-100"
      case "processing":
        return "text-yellow-600 bg-yellow-100"
      case "active":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden mt-20 bg-gradient-to-br from-primary to-primary-dark">
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-serif text-5xl md:text-6xl mb-4 text-balance">Your Orders</h1>
          <p className="text-xl text-pretty">Track your orders and manage subscriptions</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="font-serif text-2xl mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-6">Start ordering delicious Korean food today!</p>
              <a
                href="/menu"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Menu
              </a>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">Order #{order.id.slice(-8)}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                      {order.isSubscription && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.subscriptionPlan === "weekly"
                            ? "Weekly"
                            : order.subscriptionPlan === "biweekly"
                              ? "Bi-Weekly"
                              : "Monthly"}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.isSubscription && order.nextDelivery && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Calendar className="w-4 h-4" />
                        <p className="text-sm font-medium">Next Delivery: {order.nextDelivery}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold mb-3 text-sm">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.title} x{item.quantity}
                          </span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.isSubscription && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <button className="text-sm text-primary hover:text-primary-dark font-medium">
                        Manage Subscription
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
