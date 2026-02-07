"use client"

import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

export function FloatingCart() {
    const { getTotalItems, getTotalPrice, setIsCartOpen, cart } = useCart()

    const totalItems = getTotalItems()
    const totalPrice = getTotalPrice()

    if (totalItems === 0) return null

    return (
        <Link
            href="/cart"
            className={cn(
                "fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105",
                "animate-in fade-in slide-in-from-bottom-4",
                // Mobile optimization
                "md:bottom-6 md:right-6 bottom-4 right-4 md:px-6 md:py-4 px-4 py-3",
                "touch-manipulation" // Better touch response on mobile
            )}
        >
            <div className="relative">
                <ShoppingBag className="md:w-6 md:h-6 w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-green-800 text-xs font-bold md:w-5 md:h-5 w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                </span>
            </div>
            <div className="flex flex-col items-start">
                <span className="md:text-xs text-[10px] opacity-80">View Cart</span>
                <span className="md:font-bold font-semibold md:text-base text-sm">${totalPrice.toFixed(2)}</span>
            </div>
        </Link>
    )
}
