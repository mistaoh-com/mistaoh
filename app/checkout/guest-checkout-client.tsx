"use client"

import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ShoppingBag, User, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getPickupTimeMessage, getPickupAddress } from "@/lib/delivery-time"
import { TipSelector } from "@/components/tip-selector"
import { toCheckoutTipPayload } from "@/lib/tip"

const guestSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
        .string()
        .regex(
            /^\+?1?\s*\(?(\d{3})\)?[\s\-]*(\d{3})[\s\-]*(\d{4})$/,
            "Please provide a valid 10-digit US phone number"
        ),
})

export function GuestCheckoutClient() {
    const { cart, getSubtotalPrice, getTipAmount, getTotalBeforeTax, tipSelection } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [showGuestForm, setShowGuestForm] = useState(false)
    const [showClosedDialog, setShowClosedDialog] = useState(false)
    const [closedMessage, setClosedMessage] = useState("")
    const router = useRouter()
    const { toast } = useToast()
    const hasSubscriptionItems = cart.some((item) => item.isSubscription)
    const canAddTip = cart.length > 0 && !hasSubscriptionItems
    const subtotal = getSubtotalPrice()
    const tipAmount = canAddTip ? getTipAmount() : 0
    const totalBeforeTax = canAddTip ? getTotalBeforeTax() : subtotal

    const form = useForm<z.infer<typeof guestSchema>>({
        resolver: zodResolver(guestSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

    const handleGuestCheckout = async (values: z.infer<typeof guestSchema>) => {
        setIsCheckingOut(true)
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    guestInfo: values,
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
                        description: data.error || "An error occurred during checkout.",
                    })
                    setIsCheckingOut(false)
                }
            }
        } catch (error) {
            console.error("Checkout error:", error)
            toast({
                variant: "destructive",
                title: "Checkout Error",
                description: "Failed to connect to the server.",
            })
            setIsCheckingOut(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Your cart is empty
                </h1>
                <p className="text-muted-foreground mb-6">
                    Add some items to get started.
                </p>
                <Link href="/menu">
                    <Button size="lg" className="bg-[#FF813D] hover:bg-[#e67335]">
                        Browse Menu
                    </Button>
                </Link>
            </div>
        )
    }

    if (!showGuestForm) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link
                    href="/menu"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-[#FF813D] mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Menu
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Checkout
                </h1>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign In</CardTitle>
                            <CardDescription>
                                Already have an account? Sign in to access faster
                                checkout.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/login?redirect=/checkout`}>
                                <Button className="w-full bg-[#FF813D] hover:bg-[#e67335]" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Create Account</CardTitle>
                            <CardDescription>
                                New customer? Create an account for order tracking
                                and faster future checkouts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/register?redirect=/checkout`}>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    size="lg"
                                >
                                    Create Account
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-50 px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>

                    <Card className="border-[#FF813D]/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Continue as Guest
                            </CardTitle>
                            <CardDescription>
                                Checkout without creating an account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                variant="outline"
                                size="lg"
                                onClick={() => setShowGuestForm(true)}
                            >
                                Continue as Guest
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-lg mb-4">
                        Order Summary
                    </h3>
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
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Subtotal
                            </span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {canAddTip && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tip</span>
                                <span>${tipAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="text-xs text-muted-foreground">Calculated at payment on food only</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total (before tax)</span>
                            <span className="text-[#FF813D]">
                                ${totalBeforeTax.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Guest form view
    return (
        <>
        <div className="max-w-2xl mx-auto px-4 py-8">
            <button
                onClick={() => setShowGuestForm(false)}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-[#FF813D] mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Options
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Guest Checkout
            </h1>
            <p className="text-muted-foreground mb-8">
                Please provide your contact information
            </p>

            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleGuestCheckout)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="(123) 456-7890"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 border-t">
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

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span>
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    {canAddTip && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tip</span>
                                            <span>${tipAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span className="text-xs text-muted-foreground">Calculated at payment on food only</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total (before tax)</span>
                                        <span className="text-[#FF813D]">
                                            ${totalBeforeTax.toFixed(2)}
                                        </span>
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
                                    type="submit"
                                    className="w-full bg-[#FF813D] hover:bg-[#e67335]"
                                    size="lg"
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Continue to Payment"
                                    )}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Secure checkout powered by Stripe
                                </p>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
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
