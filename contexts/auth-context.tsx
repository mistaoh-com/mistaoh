"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface OrderItem {
    title: string
    quantity: number
    price: number
    id?: string
}

interface Order {
    _id: string
    totalAmount: number
    status: string
    createdAt: string
    items: OrderItem[]
}

interface User {
    name: string
    email: string
    phone: string
    provider?: "email" | "google"
}

interface AuthContextType {
    user: User | null
    orders: Order[]
    isLoading: boolean
    refreshUser: () => Promise<void>
    logout: () => Promise<void>
    updateOrder: (orderId: string, items: OrderItem[]) => Promise<void>
    cancelOrder: (orderId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeUser(rawUser: any): User | null {
    if (!rawUser || typeof rawUser !== "object") return null
    if (typeof rawUser.name !== "string" || typeof rawUser.email !== "string") return null

    const provider =
        rawUser.provider === "google" || rawUser.provider === "email"
            ? rawUser.provider
            : undefined

    return {
        name: rawUser.name,
        email: rawUser.email,
        phone: typeof rawUser.phone === "string" ? rawUser.phone : "",
        provider,
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const clearAuthState = useCallback(() => {
        setUser(null)
        setOrders([])
    }, [])

    const fetchSession = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/session", { cache: "no-store" })
            const data = await res.json()
            const nextUser = normalizeUser(data?.user)

            if (data?.authenticated && nextUser) {
                setUser(nextUser)
                setOrders([])
            } else {
                clearAuthState()
            }
        } catch (error) {
            console.error("Failed to fetch auth session")
            clearAuthState()
        } finally {
            setIsLoading(false)
        }
    }, [clearAuthState])

    const fetchUserData = useCallback(async () => {
        const shouldShowLoadingState = !user
        if (shouldShowLoadingState) {
            setIsLoading(true)
        }

        try {
            const res = await fetch("/api/user/me", { cache: "no-store" })
            if (res.ok) {
                const data = await res.json()
                const nextUser = normalizeUser(data?.user)
                if (nextUser) {
                    setUser(nextUser)
                    setOrders(Array.isArray(data?.orders) ? data.orders : [])
                } else {
                    clearAuthState()
                }
            } else {
                clearAuthState()
            }
        } catch (error) {
            console.error("Failed to fetch user data")
            clearAuthState()
        } finally {
            if (shouldShowLoadingState) {
                setIsLoading(false)
            }
        }
    }, [clearAuthState, user])

    useEffect(() => {
        void fetchSession()
    }, [fetchSession])

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            clearAuthState()
        } catch (error) {
            console.error("Logout failed")
        }
    }

    const updateOrder = async (orderId: string, items: OrderItem[]) => {
        const response = await fetch(`/api/user/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || "Failed to update order")
        }

        await fetchUserData()
    }

    const cancelOrder = async (orderId: string) => {
        const response = await fetch(`/api/user/orders/${orderId}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || "Failed to cancel order")
        }

        await fetchUserData()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                orders,
                isLoading,
                refreshUser: fetchUserData,
                logout,
                updateOrder,
                cancelOrder,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
