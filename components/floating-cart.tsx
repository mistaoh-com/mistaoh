"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

export function FloatingCart() {
    const { getTotalItems, getTotalPrice, setIsCartOpen, cart } = useCart()

    const totalItems = getTotalItems()
    const totalPrice = getTotalPrice()

    if (totalItems === 0) return null

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className={cn(
                "fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105",
                "animate-in fade-in slide-in-from-bottom-4"
            )}
        >
            <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                </span>
            </div>
            <div className="flex flex-col items-start">
                <span className="text-xs opacity-80">View Cart</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </div>
        </button>
    )
}
