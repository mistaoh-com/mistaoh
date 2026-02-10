"use client"

import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, ShoppingBag, Package, Calendar, Minus, Plus, ArrowLeft, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getPickupTimeMessage, getPickupAddress } from "@/lib/delivery-time"
import { TipSelector } from "@/components/tip-selector"
import { toCheckoutTipPayload } from "@/lib/tip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function CheckoutClient() {
    const { cart, removeFromCart, updateQuantity, getSubtotalPrice, getTipAmount, getTotalBeforeTax, tipSelection } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [showClosedDialog, setShowClosedDialog] = useState(false)
    const [closedMessage, setClosedMessage] = useState("")
    const router = useRouter()
    const { toast } = useToast()
    const hasSubscriptionItems = cart.some((item) => item.isSubscription)
    const canAddTip = cart.length > 0 && !hasSubscriptionItems
    const subtotal = getSubtotalPrice()
    const tipAmount = canAddTip ? getTipAmount() : 0
    const totalBeforeTax = canAddTip ? getTotalBeforeTax() : subtotal

    const handlePlaceOrder = async () => {
        setIsCheckingOut(true)
        try {
            // User is already authenticated (checked by server page)
            // Proceed directly to checkout API
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart,
                    tip: canAddTip ? toCheckoutTipPayload(tipSelection) : { mode: "custom", amount: 0 },
                }),
            })

            const data = await response.json()

            if (data.url) {
                window.location.href = data.url
            } else {
                console.error("No checkout URL returned:", data.error || data)

                // Show prominent dialog for closed hours
                if (data.code === "RESTAURANT_CLOSED") {
                    setClosedMessage(data.error || "We're currently closed. Please check our business hours and visit us during open hours.")
                    setShowClosedDialog(true)
                    setIsCheckingOut(false)
                } else {
                    toast({
                        variant: "destructive",
                        title: "Checkout Failed",
                        description: data.error || "An error occurred during checkout. Please try again.",
                    })
                    setIsCheckingOut(false)
                }
            }
        } catch (error) {
            console.error("Checkout error:", error)
            toast({
                variant: "destructive",
                title: "Checkout Error",
                description: "Failed to connect to the server. Please check your internet connection.",
            })
            setIsCheckingOut(false)
        }
    }

    const getPlanLabel = (plan?: string) => {
        switch (plan) {
            case "weekly":
                return "Weekly"
            case "biweekly":
                return "Bi-Weekly"
            case "monthly":
                return "Monthly"
            default:
                return ""
        }
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-muted-foreground mb-6">Looks like you haven't added any items yet.</p>
                <Link href="/menu">
                    <Button size="lg">Browse Menu</Button>
                </Link>
            </div>
        )
    }

    return (
        <>
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <Link href="/menu" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Menu
                </Link>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Checkout</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    {item.isSubscription ? (
                                        <>
                                            <div className="w-20 h-20 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">{getPlanLabel(item.subscriptionPlan)}</p>
                                                </div>
                                                {item.mealsPerWeek && (
                                                    <p className="text-xs text-muted-foreground mt-1">{item.mealsPerWeek} meals per week</p>
                                                )}
                                                <div className="flex justify-between items-center mt-3">
                                                    <p className="font-semibold text-primary">${item.price.toFixed(2)} / delivery</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                {item.subscriptionItems && item.subscriptionItems.length > 0 && (
                                                    <div className="mt-3 pl-3 border-l-2 border-primary/20">
                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Items in box:</p>
                                                        <ul className="space-y-1">
                                                            {item.subscriptionItems.map((subItem, idx) => (
                                                                <li key={idx} className="text-xs text-muted-foreground">
                                                                    • {subItem.name} {subItem.quantity > 1 && `(x${subItem.quantity})`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                <Image
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="96px"
                                                    quality={55}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{item.korean}</p>
                                                        </div>
                                                        <p className="font-bold text-gray-900">
                                                            ${((item.price + (item.selectedAddOns?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                                                        <div className="mt-2 space-y-1">
                                                            {item.selectedAddOns.map(addon => (
                                                                <p key={addon.id} className="text-xs text-muted-foreground flex items-center gap-2">
                                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                                    <span>{addon.name} (+${addon.price.toFixed(2)})</span>
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-end mt-4">
                                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors text-gray-600"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors text-gray-600"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-sm text-red-600 hover:text-red-700 font-medium underline-offset-4 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                        {canAddTip ? (
                            <div className="mb-4">
                                <TipSelector />
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 mb-4">
                                <p className="text-xs text-gray-600">
                                    Tips are available for one-time food orders. Subscription checkout is tip-free in this flow.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {canAddTip && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Tip</span>
                                    <span>${tipAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span className="text-xs text-muted-foreground">Calculated at payment on food only</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total (before tax)</span>
                                <span>${totalBeforeTax.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Estimated Pickup Time */}
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-800">{getPickupTimeMessage()}</span>
                            </div>
                            <p className="text-xs text-green-700 pl-6">Pickup at: {getPickupAddress()}</p>
                        </div>

                        <Button
                            className="w-full py-6 text-lg"
                            onClick={handlePlaceOrder}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Place Order"
                            )}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Secure checkout powered by Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Restaurant Closed Dialog */}
        <AlertDialog open={showClosedDialog} onOpenChange={setShowClosedDialog}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl flex items-center gap-2">
                        <Clock className="w-6 h-6 text-[#FF813D]" />
                        Restaurant Closed
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base pt-2">
                        {closedMessage}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
                    <p className="font-semibold text-sm mb-2">Our Business Hours:</p>
                    <div className="text-sm space-y-1">
                        <p><span className="font-medium">Monday - Thursday:</span> 11:00 AM - 11:00 PM</p>
                        <p><span className="font-medium">Friday & Saturday:</span> 11:00 AM - 10:00 PM</p>
                        <p><span className="font-medium">Sunday:</span> Closed</p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => router.push("/menu")}
                        className="bg-[#FF813D] hover:bg-[#e67335] w-full"
                    >
                        Back to Menu
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
