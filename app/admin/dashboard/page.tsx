"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw, Bell, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Order {
    _id: string
    items: Array<{ title: string; quantity: number; price: number; id?: string }>
    totalAmount: number
    status: string
    createdAt: string
    user?: {
        name: string
        email: string
        phone: string
    }
    guestInfo?: {
        name: string
        email: string
        phone: string
    }
}

// Sound file for new order
const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newOrder, setNewOrder] = useState<Order | null>(null)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const lastCheckedRef = useRef<number>(Date.now())
    const router = useRouter()
    const { toast } = useToast()

    // Load initial orders
    const fetchOrders = async (isPolling = false) => {
        if (!isPolling) setIsLoading(true)
        try {
            const res = await fetch("/api/admin/orders")
            if (res.status === 401 || res.status === 403) {
                if (!isPolling) router.push("/admin") // Redirect to admin login
                return
            }
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()

            // Check for new PAID orders since last check
            if (isPolling && data.orders.length > 0) {
                const latestOrders = data.orders.filter((o: Order) => {
                    const orderTime = new Date(o.createdAt).getTime()
                    // Check if order is newer than last check AND is 'PAID' (meaning just arrived/paid)
                    return orderTime > lastCheckedRef.current && o.status === 'PAID'
                })

                if (latestOrders.length > 0) {
                    // Trigger Alert for the most recent one
                    const newest = latestOrders[0]
                    setNewOrder(newest)
                    setIsAlertOpen(true)
                    playNotificationSound()
                }
            }

            setOrders(data.orders)
            // Update last checked time
            lastCheckedRef.current = Date.now()
        } catch (error) {
            console.error(error)
            if (!isPolling) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load orders",
                })
            }
        } finally {
            if (!isPolling) setIsLoading(false)
        }
    }

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(e => console.error("Audio play failed (interaction needed first):", e))
        }
    }

    // Polling effect
    useEffect(() => {
        fetchOrders(false) // Initial load

        const interval = setInterval(() => {
            fetchOrders(true)
        }, 10000) // Poll every 10 seconds

        return () => clearInterval(interval)
    }, [])

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH", // Changed to PATCH
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) throw new Error("Failed to update status")

            toast({
                title: "Success",
                description: `Order updated to ${newStatus}`,
            })

            // Update local state without full refetch for speed
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))

            // Close alert if it was for this order
            if (newOrder && newOrder._id === orderId) {
                setIsAlertOpen(false)
                setNewOrder(null)
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update order status",
            })
        }
    }

    const handleAcceptOrder = async () => {
        if (newOrder) {
            await handleStatusChange(newOrder._id, "PREPARING")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-green-500 hover:bg-green-600"
            case "READY": return "bg-blue-500 hover:bg-blue-600"
            case "PREPARING": return "bg-yellow-500 hover:bg-yellow-600"
            case "PAID": return "bg-indigo-500 hover:bg-indigo-600"
            case "PENDING": return "bg-gray-500 hover:bg-gray-600 border-none text-white"
            case "CANCELLED": return "bg-red-500 hover:bg-red-600"
            default: return "bg-gray-500"
        }
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <audio ref={audioRef} src={NOTIFICATION_SOUND} preload="auto" />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fetchOrders(false)} disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Mobile View - Cards */}
                    <div className="md:hidden space-y-4">
                        {isLoading && orders.length === 0 ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No orders found.</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                            <p className="font-medium mt-2">{order.user?.name || order.guestInfo?.name || "Guest"}</p>
                                            <div className="text-xs text-gray-500 space-y-0.5">
                                                <p>{order.user?.email || order.guestInfo?.email}</p>
                                                <p>{order.user?.phone || order.guestInfo?.phone || "No Phone"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs font-medium"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Order Details ({order.items.length} items)
                                        </Button>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-lg">
                                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalAmount)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div className="w-[140px]">
                                                <Select
                                                    defaultValue={order.status}
                                                    onValueChange={(val) => handleStatusChange(order._id, val)}
                                                >
                                                    <SelectTrigger className={`w-full text-white h-9 text-xs ${getStatusColor(order.status)}`}>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                        <SelectItem value="PAID">Paid</SelectItem>
                                                        <SelectItem value="PREPARING">Preparing</SelectItem>
                                                        <SelectItem value="READY">Ready</SelectItem>
                                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell className="font-mono text-xs">
                                                {order._id.slice(-8).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {order.user?.name || order.guestInfo?.name || "Guest"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs text-gray-500">
                                                    <p>{order.user?.email || order.guestInfo?.email}</p>
                                                    <p>{order.user?.phone || order.guestInfo?.phone || "-"}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View ({order.items.length} items)
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalAmount)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                                <br />
                                                <span className="text-xs text-gray-400">
                                                    {new Date(order.createdAt).toLocaleTimeString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    defaultValue={order.status}
                                                    onValueChange={(val) => handleStatusChange(order._id, val)}
                                                >
                                                    <SelectTrigger className={`w-[130px] text-white ${getStatusColor(order.status)}`}>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                        <SelectItem value="PAID">Paid</SelectItem>
                                                        <SelectItem value="PREPARING">Preparing</SelectItem>
                                                        <SelectItem value="READY">Ready</SelectItem>
                                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* New Order Alert Modal */}
            <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary">
                            <Bell className="h-6 w-6 animate-pulse" />
                            New Order Received!
                        </DialogTitle>
                        <DialogDescription>
                            Please review the order and accept it to notify the customer.
                        </DialogDescription>
                    </DialogHeader>
                    {newOrder && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-500">Customer</p>
                                    <p>{newOrder.user?.name || newOrder.guestInfo?.name || "Guest"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-500">Contact</p>
                                    <p>{newOrder.user?.phone || newOrder.guestInfo?.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-500">Order ID</p>
                                    <p className="font-mono">#{newOrder._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-500">Total</p>
                                    <p className="font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(newOrder.totalAmount)}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <p className="font-semibold text-xs text-gray-500 mb-2">ITEMS</p>
                                <ul className="text-sm space-y-1">
                                    {newOrder.items.map((item, i) => (
                                        <li key={i}>{item.quantity}x {item.title}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg" onClick={handleAcceptOrder}>
                                Accept Order
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Order Details Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Order Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete order information for preparation
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* Order Header */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Order ID</p>
                                    <p className="font-mono text-lg font-bold">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
                                    <Badge className={`${getStatusColor(selectedOrder.status)} text-sm mt-1`}>
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Order Time</p>
                                    <p className="text-sm font-medium">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Total</p>
                                    <p className="text-lg font-bold text-primary">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selectedOrder.totalAmount)}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase mb-3">Customer Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold min-w-[80px]">Name:</span>
                                        <span className="text-sm">{selectedOrder.user?.name || selectedOrder.guestInfo?.name || "Guest"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold min-w-[80px]">Email:</span>
                                        <span className="text-sm">{selectedOrder.user?.email || selectedOrder.guestInfo?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold min-w-[80px]">Phone:</span>
                                        <span className="text-sm">{selectedOrder.user?.phone || selectedOrder.guestInfo?.phone || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items - Kitchen View */}
                            <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                                <h3 className="font-bold text-base sm:text-lg mb-4 flex flex-wrap items-center gap-2">
                                    <span className="bg-primary text-white px-3 py-1 rounded text-sm">KITCHEN</span>
                                    Order Items ({selectedOrder.items.length})
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                        <span className="bg-primary text-white font-bold text-base sm:text-lg px-2 sm:px-3 py-1 rounded-md min-w-[45px] sm:min-w-[50px] text-center">
                                                            {item.quantity}x
                                                        </span>
                                                        <div>
                                                            <p className="font-bold text-base sm:text-lg">{item.title}</p>
                                                            {item.id && <p className="text-sm text-gray-500">Item ID: {item.id}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-600">
                                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((item as any).price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Actions */}
                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-500 mb-3 font-semibold">Update Order Status:</p>
                                <Select
                                    value={selectedOrder.status}
                                    onValueChange={(val) => {
                                        handleStatusChange(selectedOrder._id, val)
                                        setSelectedOrder({ ...selectedOrder, status: val })
                                    }}
                                >
                                    <SelectTrigger className={`w-full text-white h-12 text-base font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="PAID">Paid</SelectItem>
                                        <SelectItem value="PREPARING">Preparing</SelectItem>
                                        <SelectItem value="READY">Ready</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
