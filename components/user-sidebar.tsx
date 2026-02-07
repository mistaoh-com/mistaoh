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
import { User as UserIcon, LogOut, Package, RefreshCw, Pencil, X, Plus, Minus, Trash2, Loader2, CreditCard } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface OrderItem {
    title: string
    quantity: number
    price: number
    id?: string
}

export function UserSidebar() {
    const [open, setOpen] = useState(false)
    const { user, orders, isLoading, refreshUser, logout, updateOrder, cancelOrder } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    // Edit order state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
    const [editedItems, setEditedItems] = useState<OrderItem[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // Cancel order state
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
    const [isCancelling, setIsCancelling] = useState(false)

    // Resume checkout state
    const [isResuming, setIsResuming] = useState(false)
    const [resumingOrderId, setResumingOrderId] = useState<string | null>(null)

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
            case "CANCELLED": return "bg-gray-400 hover:bg-gray-500"
            default: return "bg-gray-500 hover:bg-gray-600"
        }
    }

    // Edit order handlers
    const handleEditOrder = (orderId: string) => {
        const order = orders.find(o => o._id === orderId)
        if (!order) return

        setEditingOrderId(orderId)
        setEditedItems([...order.items])
        setIsEditModalOpen(true)
    }

    const handleUpdateQuantity = (index: number, change: number) => {
        const newItems = [...editedItems]
        newItems[index].quantity += change
        if (newItems[index].quantity < 1) {
            newItems[index].quantity = 1
        }
        setEditedItems(newItems)
    }

    const handleRemoveItem = (index: number) => {
        if (editedItems.length === 1) {
            toast({
                variant: "destructive",
                title: "Cannot remove item",
                description: "Order must have at least one item.",
            })
            return
        }
        const newItems = editedItems.filter((_, i) => i !== index)
        setEditedItems(newItems)
    }

    const handleSaveOrder = async () => {
        if (!editingOrderId || editedItems.length === 0) return

        setIsSaving(true)
        try {
            await updateOrder(editingOrderId, editedItems)
            toast({
                title: "Order updated",
                description: "Your order has been updated successfully.",
            })
            setIsEditModalOpen(false)
            setEditingOrderId(null)
            setEditedItems([])
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.message || "Failed to update order.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Cancel order handlers
    const handleCancelOrder = (orderId: string) => {
        setCancellingOrderId(orderId)
        setIsCancelDialogOpen(true)
    }

    const handleConfirmCancel = async () => {
        if (!cancellingOrderId) return

        setIsCancelling(true)
        try {
            await cancelOrder(cancellingOrderId)
            toast({
                title: "Order cancelled",
                description: "Your order has been cancelled successfully.",
            })
            setIsCancelDialogOpen(false)
            setCancellingOrderId(null)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Cancellation failed",
                description: error.message || "Failed to cancel order.",
            })
        } finally {
            setIsCancelling(false)
        }
    }

    const getTotalPrice = () => {
        return editedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    // Resume checkout handler
    const handleResumeCheckout = async (orderId: string) => {
        setIsResuming(true)
        setResumingOrderId(orderId)

        try {
            const response = await fetch("/api/checkout/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to resume checkout")
            }

            const { url } = await response.json()

            // Redirect to Stripe checkout
            window.location.href = url
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Checkout Failed",
                description: error.message || "Failed to resume checkout.",
            })
            setIsResuming(false)
            setResumingOrderId(null)
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
                                {orders.filter(o => o.status !== "CANCELLED").length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No orders found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.filter(o => o.status !== "CANCELLED").map((order) => (
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

                                                {order.status === "PENDING" && (
                                                    <div className="flex gap-2 mt-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditOrder(order._id)}
                                                            className="flex-1"
                                                            disabled={isResuming && resumingOrderId === order._id}
                                                        >
                                                            <Pencil className="w-3 h-3 mr-1" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCancelOrder(order._id)}
                                                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            disabled={isResuming && resumingOrderId === order._id}
                                                        >
                                                            <X className="w-3 h-3 mr-1" />
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleResumeCheckout(order._id)}
                                                            className="flex-1 bg-[#FF813D] hover:bg-[#e67335] text-white"
                                                            disabled={isResuming && resumingOrderId === order._id}
                                                        >
                                                            {isResuming && resumingOrderId === order._id ? (
                                                                <>
                                                                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                                                    Loading
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CreditCard className="w-3 h-3 mr-1" />
                                                                    Pay Now
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
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

            {/* Edit Order Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Order</DialogTitle>
                        <DialogDescription>
                            Modify items and quantities in your order.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {editedItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{item.title}</p>
                                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateQuantity(index, -1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateQuantity(index, 1)}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveItem(index)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-[#FF813D]">${getTotalPrice().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveOrder}
                            disabled={isSaving || editedItems.length === 0}
                            className="bg-[#FF813D] hover:bg-[#e67335]"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Order Confirmation */}
            <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this order? This action cannot be undone.
                            {cancellingOrderId && (() => {
                                const order = orders.find(o => o._id === cancellingOrderId)
                                return order ? (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
                                        <p className="font-medium text-sm text-gray-900">Order #{order._id.slice(-6)}</p>
                                        <div className="text-xs text-gray-600">
                                            {order.items.map((item, idx) => (
                                                <div key={idx}>{item.quantity}x {item.title}</div>
                                            ))}
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">Total: ${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                ) : null
                            })()}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCancelling}>
                            No, Keep It
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmCancel}
                            disabled={isCancelling}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sheet>
    )
}
