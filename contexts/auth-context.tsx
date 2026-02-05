"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface Order {
    _id: string
    totalAmount: number
    status: string
    createdAt: string
    items: Array<{ title: string; quantity: number }>
}

interface User {
    name: string
    email: string
    phone: string
}

interface AuthContextType {
    user: User | null
    orders: Order[]
    isLoading: boolean
    refreshUser: () => Promise<void>
    logout: () => Promise<void>
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

    return (
        <AuthContext.Provider
            value={{
                user,
                orders,
                isLoading,
                refreshUser: fetchUserData,
                logout,
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
