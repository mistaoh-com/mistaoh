"use client"

import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CartItemsSection } from "@/components/cart-items-section"
import { PendingOrdersSection } from "@/components/pending-orders-section"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart } = useCart()
  const { orders, isLoading } = useAuth()
  const router = useRouter()

  const pendingOrders = orders.filter(order => order.status === "PENDING")

  const isEmpty = cart.length === 0 && pendingOrders.length === 0

  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
            <Button
              onClick={() => router.push("/menu")}
              className="bg-[#FF813D] hover:bg-[#e67335]"
              size="lg"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid gap-8">
            {cart.length > 0 && <CartItemsSection />}
            {pendingOrders.length > 0 && <PendingOrdersSection />}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
