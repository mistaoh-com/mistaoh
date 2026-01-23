"use client"

import { X, Minus, Plus, ShoppingBag, Loader2, Calendar, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import { useState } from "react"

export function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("No checkout URL returned")
        setIsCheckingOut(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setIsCheckingOut(false)
    }
  }

  const getPlanLabel = (plan?: string) => {
    switch (plan) {
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Bi-Weekly"
      case "monthly":
        return "Monthly"
      default:
        return ""
    }
  }

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-serif font-bold">Your Cart</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="pb-4 border-b border-border">
                  {item.isSubscription ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{getPlanLabel(item.subscriptionPlan)}</p>
                          </div>
                          {item.mealsPerWeek && (
                            <p className="text-xs text-muted-foreground mt-1">{item.mealsPerWeek} meals per week</p>
                          )}
                          <p className="text-sm font-semibold text-primary mt-2">${item.price.toFixed(2)}/delivery</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      {item.subscriptionItems && item.subscriptionItems.length > 0 && (
                        <div className="ml-15 pl-4 border-l-2 border-primary/20">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Items in box:</p>
                          <ul className="space-y-1">
                            {item.subscriptionItems.map((subItem, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground">
                                • {subItem.name} {subItem.quantity > 1 && `(x${subItem.quantity})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.korean}</p>

                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.selectedAddOns.map(addon => (
                              <p key={addon.id} className="text-xs text-muted-foreground flex justify-between">
                                <span>+ {addon.name}</span>
                                <span>${addon.price.toFixed(2)}</span>
                              </p>
                            ))}
                          </div>
                        )}

                        <p className="text-sm font-semibold text-primary mt-1">${(
                          (item.price + (item.selectedAddOns?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity
                        ).toFixed(2)}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground">Secure checkout powered by Stripe</p>
          </div>
        )}
      </div>
    </>
  )
}
