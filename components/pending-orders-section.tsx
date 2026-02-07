"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, X, CreditCard, Loader2, Plus, Minus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
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
import { ScrollArea } from "@/components/ui/scroll-area"

interface OrderItem {
  title: string
  quantity: number
  price: number
  id?: string
}

export function PendingOrdersSection() {
  const { orders, cancelOrder, updateOrder } = useAuth()
  const { toast } = useToast()

  // Resume checkout state
  const [isResuming, setIsResuming] = useState(false)
  const [resumingOrderId, setResumingOrderId] = useState<string | null>(null)

  // Edit order state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editedItems, setEditedItems] = useState<OrderItem[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Cancel order state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const pendingOrders = orders.filter(o => o.status === "PENDING")

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
      window.location.href = url
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: error.message,
      })
      setIsResuming(false)
      setResumingOrderId(null)
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>PENDING Orders ({pendingOrders.length})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Orders awaiting payment
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {pendingOrders.map((order) => (
              <div key={order._id} className="p-3 sm:p-4 border rounded-lg bg-white">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-2 sm:mb-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5">
                    PENDING
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 space-y-0.5 sm:space-y-1">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx}>
                      {item.quantity}x {item.title}
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-gray-400">
                      +{order.items.length - 2} more items
                    </span>
                  )}
                </div>

                {/* Total */}
                <div className="text-right font-semibold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4">
                  ${order.totalAmount.toFixed(2)}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Prominent Pay Now Button */}
                  <Button
                    size="lg"
                    className="w-full bg-[#FF813D] hover:bg-[#e67335] text-white font-bold shadow-lg text-sm sm:text-base py-5 sm:py-6"
                    onClick={() => handleResumeCheckout(order._id)}
                    disabled={isResuming && resumingOrderId === order._id}
                  >
                    {isResuming && resumingOrderId === order._id ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Pay Now
                      </>
                    )}
                  </Button>

                  {/* Urgency Indicator */}
                  <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                    ⏱️ Order expires in 24 hours
                  </p>

                  {/* Secondary Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => handleEditOrder(order._id)}
                      disabled={isResuming && resumingOrderId === order._id}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isResuming && resumingOrderId === order._id}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Order Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Order</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update quantities or remove items from your order.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[300px] sm:max-h-[400px] pr-2 sm:pr-4">
            <div className="space-y-2 sm:space-y-3">
              {editedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">{item.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(index, -1)}
                      disabled={item.quantity <= 1}
                      className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                    >
                      <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </Button>
                    <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(index, 1)}
                      className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                    >
                      <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-700 h-6 w-6 sm:h-7 sm:w-7 p-0 shrink-0"
                    disabled={editedItems.length === 1}
                  >
                    <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center pt-3 sm:pt-4 border-t">
            <span className="font-semibold text-sm sm:text-base">Total:</span>
            <span className="text-base sm:text-lg font-bold text-[#FF813D]">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveOrder}
              disabled={isSaving || editedItems.length === 0}
              className="bg-[#FF813D] hover:bg-[#e67335] w-full sm:w-auto text-xs sm:text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              No, Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Order"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
