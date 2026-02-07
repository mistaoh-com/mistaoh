"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
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
import { getPickupTimeMessage, getPickupAddress } from "@/lib/delivery-time"
import { BLUR_DATA_URL, getImageSizes } from "@/lib/image-utils"

export function CartItemsSection() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  const router = useRouter()
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cart Items ({cart.length})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Items ready to checkout
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 border rounded-lg bg-white">
                {/* Item Image */}
                {item.image && (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                      sizes={getImageSizes('thumbnail')}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                )}

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.title}</h3>
                  {item.korean && (
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{item.korean}</p>
                  )}
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5 sm:mt-1">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setItemToDelete({ id: item.id, title: item.title })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 p-0"
                  title="Remove item"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Checkout Button */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-3 sm:space-y-4">
            <div className="flex justify-between text-base sm:text-lg font-bold">
              <span>Total</span>
              <span className="text-[#FF813D]">${getTotalPrice().toFixed(2)}</span>
            </div>

            {/* Estimated Pickup Time */}
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                <span className="font-medium text-green-800">{getPickupTimeMessage()}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-green-700 pl-5 sm:pl-6">Pickup at: {getPickupAddress()}</p>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              className="w-full bg-[#FF813D] hover:bg-[#e67335] text-sm sm:text-base py-5 sm:py-6"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{itemToDelete?.title}</strong> from your cart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  removeFromCart(itemToDelete.id)
                  setItemToDelete(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
