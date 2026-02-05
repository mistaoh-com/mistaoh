"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { User as UserIcon, LogOut, Package, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function UserSidebar() {
    const [open, setOpen] = useState(false)
    const { user, orders, isLoading, refreshUser, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        setOpen(false)
        router.push("/")
        router.refresh()
    }

    // Formatting helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-green-500 hover:bg-green-600"
            case "READY": return "bg-blue-500 hover:bg-blue-600"
            case "PREPARING": return "bg-yellow-500 hover:bg-yellow-600"
            case "PAID": return "bg-indigo-500 hover:bg-indigo-600"
            case "CANCELLED": return "bg-red-500 hover:bg-red-600"
            default: return "bg-gray-500 hover:bg-gray-600"
        }
    }

    if (isLoading) {
        return <div className="w-10 h-10 flex items-center justify-center"><RefreshCw className="w-4 h-4 animate-spin text-gray-400" /></div>
    }

    if (!user) {
        return (
            <Button
                variant="secondary"
                className="font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-all rounded-full px-6"
                onClick={() => router.push("/login")}
            >
                Login
            </Button>
        )
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="secondary"
                    className="relative group flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-all rounded-full border border-transparent hover:border-primary/20"
                >
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm hidden sm:inline-block text-primary">
                        Hi {user.name.split(' ')[0]}
                    </span>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[400px] flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-serif">My Profile</SheetTitle>
                </SheetHeader>

                {user ? (
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        {/* Profile Info */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 flex-shrink-0">
                            <p className="font-semibold text-lg">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.phone}</p>
                        </div>

                        {/* Orders */}
                        <div className="flex flex-col flex-1 mt-6 min-h-0">
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Package className="w-5 h-5" /> Order History
                                </h3>
                                <Button variant="ghost" size="sm" onClick={refreshUser} disabled={isLoading}>
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>

                            <ScrollArea className="flex-1 w-full rounded-md border p-4">
                                {orders.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No orders found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order._id} className="border-b pb-4 last:border-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {order.items.slice(0, 2).map((i, idx) => (
                                                        <span key={idx}>
                                                            {i.quantity}x {i.title}{idx < Math.min(order.items.length, 2) - 1 ? ", " : ""}
                                                        </span>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <span className="text-gray-400 text-xs ml-1">
                                                            +{order.items.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 text-right font-semibold">
                                                    ${order.totalAmount.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        <div className="mt-6 flex-shrink-0 pb-6">
                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-white"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <p className="text-gray-500">Please sign in to view your profile.</p>
                        <Button onClick={() => router.push("/login")} className="w-full">Sign In</Button>
                        <Button variant="outline" onClick={() => router.push("/register")} className="w-full">Create Account</Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
