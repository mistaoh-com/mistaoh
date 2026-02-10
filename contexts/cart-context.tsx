"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

import { CartItem } from "@/lib/types"
import {
  calculateTipAmount,
  DEFAULT_TIP_SELECTION,
  roundCurrency,
  sanitizeTipSelection,
  TipMode,
  TipPercentageOption,
  TipSelection,
} from "@/lib/tip"

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotalPrice: () => number
  getTotalPrice: () => number
  getTipAmount: () => number
  getTotalBeforeTax: () => number
  tipSelection: TipSelection
  setTipPercentage: (percentage: TipPercentageOption) => void
  setTipType: (mode: TipMode) => void
  setCustomTipAmount: (amount: number) => void
  resetTip: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "mistaoh-cart"
const TIP_STORAGE_KEY = "mistaoh-tip"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [tipSelection, setTipSelection] = useState<TipSelection>(DEFAULT_TIP_SELECTION)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        setCart([])
      }
    }

    const savedTip = localStorage.getItem(TIP_STORAGE_KEY)
    if (savedTip) {
      try {
        setTipSelection(sanitizeTipSelection(JSON.parse(savedTip)))
      } catch {
        setTipSelection(DEFAULT_TIP_SELECTION)
      }
    }

    setHasHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!hasHydrated) return
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart, hasHydrated])

  // Save tip settings to localStorage whenever they change
  useEffect(() => {
    if (!hasHydrated) return
    localStorage.setItem(TIP_STORAGE_KEY, JSON.stringify(tipSelection))
  }, [tipSelection, hasHydrated])

  // Reset tip defaults when cart is empty
  useEffect(() => {
    if (!hasHydrated) return
    if (cart.length === 0) {
      setTipSelection(DEFAULT_TIP_SELECTION)
    }
  }, [cart.length, hasHydrated])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      if (item.isSubscription) {
        return [...prevCart, { ...item, quantity: 1 }]
      }

      // Generate a unique ID that includes add-ons if present
      // For items with add-ons, we use the provided ID which should already be unique
      // or we can append sorted add-on IDs to ensure uniqueness
      const existingItem = prevCart.find((cartItem) => {
        // If IDs match directly
        if (cartItem.id === item.id) return true

        // If it's the same base item (same title/category) check if add-ons match
        // This is a backup if the ID generation logic happens outside
        return false
      })

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
    // setIsCartOpen(true) - User requested to not open sidebar on add
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
    setTipSelection(DEFAULT_TIP_SELECTION)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotalPrice = () => {
    return cart.reduce((total, item) => {
      const addOnsPrice = item.selectedAddOns?.reduce((sum, addon) => sum + addon.price, 0) || 0
      return total + (item.price + addOnsPrice) * item.quantity
    }, 0)
  }

  const getTotalPrice = () => {
    return getSubtotalPrice()
  }

  const getTipAmount = () => {
    return calculateTipAmount(getSubtotalPrice(), tipSelection)
  }

  const getTotalBeforeTax = () => {
    return roundCurrency(getSubtotalPrice() + getTipAmount())
  }

  const setTipPercentage = (percentage: TipPercentageOption) => {
    setTipSelection((previous) => ({
      ...previous,
      mode: "percentage",
      percentage,
    }))
  }

  const setTipType = (mode: TipMode) => {
    setTipSelection((previous) => ({
      ...previous,
      mode,
    }))
  }

  const setCustomTipAmount = (amount: number) => {
    setTipSelection((previous) => ({
      ...previous,
      mode: "custom",
      customAmount: Math.max(roundCurrency(amount), 0),
    }))
  }

  const resetTip = () => {
    setTipSelection(DEFAULT_TIP_SELECTION)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotalPrice,
        getTotalPrice,
        getTipAmount,
        getTotalBeforeTax,
        tipSelection,
        setTipPercentage,
        setTipType,
        setCustomTipAmount,
        resetTip,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
