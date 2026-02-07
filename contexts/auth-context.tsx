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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchUserData = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/user/me")
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                setOrders(data.orders)
            } else {
                setUser(null)
                setOrders([])
            }
        } catch (error) {
            console.error("Failed to fetch user data")
            setUser(null)
            setOrders([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [fetchUserData])

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            setUser(null)
            setOrders([])
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

        await fetchUserData() // Reload orders
    }

    const cancelOrder = async (orderId: string) => {
        const response = await fetch(`/api/user/orders/${orderId}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || "Failed to cancel order")
        }

        await fetchUserData() // Reload orders
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
