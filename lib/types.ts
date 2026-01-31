import { JWTPayload as JoseJWTPayload } from "jose"

export interface CartItem {
    id: string
    title: string
    korean: string
    price: number
    quantity: number
    image: string
    category: string
    isSubscription?: boolean
    subscriptionPlan?: "weekly" | "biweekly" | "monthly"
    mealsPerWeek?: number
    subscriptionItems?: Array<{ id: string; name: string; quantity: number }>
    selectedAddOns?: Array<{ id: string; name: string; price: number }>
}

export interface FoodOption {
    title: string
    korean: string
    price: number
    image?: string
    description?: string
}

export interface MailItem {
    title: string
    price: number
    quantity?: number
    description?: string
}

export interface JWTPayload extends JoseJWTPayload {
    userId?: string
    email?: string
    name?: string
    role: "admin" | "user"
}

export interface GuestInfo {
    name: string
    email: string
    phone: string
}
