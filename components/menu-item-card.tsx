"use client"

import Link from "next/link"
import Image from "next/image"
import { Leaf, WheatOff, Plus, Minus, ShoppingCart, Flame } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AddOnSelector } from "@/components/add-on-selector"
import type { MenuItem, AddOnOption } from "@/lib/menu-data"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BLUR_DATA_URL, getImageSizes } from "@/lib/image-utils"

interface MenuItemCardProps {
    item: MenuItem
    category: string
    variant?: "default" | "compact"
    accentColor?: string
    isAlcoholic?: boolean
}

export function MenuItemCard({
    item,
    category,
    variant = "default",
    accentColor = "primary",
    isAlcoholic = false,
}: MenuItemCardProps) {
    const { addToCart, cart, updateQuantity } = useCart()
    const [isAdding, setIsAdding] = useState(false)
    const [isAddOnSelectorOpen, setIsAddOnSelectorOpen] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // Helper to generate a consistent ID for checking quantity of specific item configuration
    // For the card display, we primarily check the base item quantity if no add-ons are involved
    // But if add-ons exist, we might treat it differently. 
    // For simplicity in the card view, we just check if ANY variant of this item is in the cart?
    // Or we just rely on the base ID?
    // Actually, "Add" button usually adds a NEW item or increments. 
    // If it has add-ons, clicking Add always opens the modal.
    // If it doesn't have add-ons, it behaves as before.

    // If item has add-ons, we don't show the quantity control on the card face for simplicity
    // because which variant's quantity would we be controlling?
    // We'll just always show "Add" for items with add-ons. 

    // Check if item has add-ons
    const hasAddOns = (item.addOns && item.addOns.length > 0)

    const cartItem = !hasAddOns
        ? cart.find((c) => c.id === `${category}-${item.title}`)
        : null // Don't match existing cart items if it has add-ons, to force "Add" flow

    const quantity = cartItem?.quantity || 0

    const handleAddToCart = () => {
        if (hasAddOns) {
            setIsAddOnSelectorOpen(true)
            return
        }

        setIsAdding(true)
        addToCart({
            id: `${category}-${item.title}`,
            title: item.title,
            korean: item.korean,
            price: item.price,
            image: item.image || "/placeholder.svg",
            category,
        })

        // Show toast notification
        toast({
            title: "Item added to cart",
            description: `${item.title} has been added to your cart.`,
            action: (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/cart")}
                    className="shrink-0"
                >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    View Cart
                </Button>
            ),
        })

        setTimeout(() => setIsAdding(false), 300)
    }

    const handleAddOnConfirm = (selectedAddOns: AddOnOption[]) => {
        setIsAddOnSelectorOpen(false)
        setIsAdding(true)

        // Generate a unique ID suffix based on sorted add-on IDs
        const addOnSuffix = selectedAddOns.length > 0
            ? '-' + selectedAddOns.map(a => a.id).sort().join('-')
            : ''

        addToCart({
            id: `${category}-${item.title}${addOnSuffix}`,
            title: item.title,
            korean: item.korean,
            price: item.price,
            image: item.image || "/placeholder.svg",
            category,
            selectedAddOns
        })

        // Show toast notification
        toast({
            title: "Item added to cart",
            description: `${item.title} with ${selectedAddOns.length} add-on(s) has been added to your cart.`,
            action: (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/cart")}
                    className="shrink-0"
                >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    View Cart
                </Button>
            ),
        })

        setTimeout(() => setIsAdding(false), 300)
    }

    const handleUpdateQuantity = (newQuantity: number) => {
        updateQuantity(`${category}-${item.title}`, newQuantity)
    }

    const getAccentClasses = () => {
        switch (accentColor) {
            case "rose":
                return "bg-rose-600 hover:bg-rose-700"
            case "purple":
                return "bg-purple-600 hover:bg-purple-700"
            case "cyan":
                return "bg-cyan-600 hover:bg-cyan-700"
            default:
                return "bg-primary hover:bg-primary-dark"
        }
    }

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-4 py-4 px-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                {item.image && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes={getImageSizes('thumbnail')}
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h4 className="font-sans font-bold text-base truncate text-foreground">{item.title}</h4>
                        {item.glutenFree && <WheatOff className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />}
                        {item.vegetarian && <Leaf className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />}
                        {item.spicyLevel && (
                            <div className="flex gap-0.5 shrink-0" aria-label={`Spice level: ${item.spicyLevel}`}>
                                <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                                {item.spicyLevel === 'medium' && <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />}
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.korean}</p>
                </div>
                <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                {!isAlcoholic && !item.notOrderable && (
                    <button
                        onClick={handleAddToCart}
                        className={cn(
                            "p-2.5 rounded-full text-white transition-all shadow-md",
                            getAccentClasses(),
                            isAdding && "scale-110"
                        )}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="flex items-start gap-5 py-6 px-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
            {item.image && (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes={getImageSizes('card')}
                                placeholder="blur"
                                blurDataURL={BLUR_DATA_URL}
                            />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <div className="relative w-full h-[500px]">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain"
                                sizes={getImageSizes('full')}
                                placeholder="blur"
                                blurDataURL={BLUR_DATA_URL}
                                priority
                            />
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="font-serif text-2xl mb-2 text-foreground">{item.title}</h3>
                            <p className="text-muted-foreground">{item.korean}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-sans font-bold text-xl tracking-tight text-foreground">{item.title}</h4>
                            {item.glutenFree && (
                                <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                                    <WheatOff className="w-3 h-3" />
                                    GF
                                </span>
                            )}
                            {item.vegetarian && (
                                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                                    <Leaf className="w-3 h-3" />
                                    Veg
                                </span>
                            )}
                            {item.spicyLevel && (
                                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium ${item.spicyLevel === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-50 text-red-600'}`}>
                                    <div className="flex gap-0.5" aria-label={`Spice level: ${item.spicyLevel}`}>
                                        <Flame className={`w-3 h-3 ${item.spicyLevel === 'medium' ? 'fill-orange-700' : 'fill-red-600'}`} />
                                        {item.spicyLevel === 'medium' && <Flame className="w-3 h-3 fill-orange-700" />}
                                    </div>
                                    <span className="capitalize">{item.spicyLevel === 'medium' ? 'Medium' : 'Mild'}</span>
                                </span>
                            )}
                        </div>
                        <p className="text-base font-medium text-muted-foreground mt-1">{item.korean}</p>
                        {item.description && (
                            <p className="text-base text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                                {item.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <span className="font-bold text-2xl text-primary">
                            ${item.price.toFixed(2)}
                        </span>

                        {!isAlcoholic && !item.notOrderable ? (
                            quantity > 0 ? (
                                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                                    <button
                                        onClick={() => handleUpdateQuantity(quantity - 1)}
                                        className="p-2 hover:bg-white rounded-full transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(quantity + 1)}
                                        className="p-2 hover:bg-white rounded-full transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className={cn(
                                        "flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg",
                                        getAccentClasses(),
                                        isAdding && "scale-105"
                                    )}
                                >
                                    <Plus className="w-5 h-5" />
                                    {hasAddOns ? "Customize & Add" : "Add"}
                                </button>
                            )
                        ) : item.notOrderable ? (
                            <span className="text-sm text-muted-foreground italic px-4 py-2 bg-gray-50 rounded-full">
                                In-store only
                            </span>
                        ) : (
                            <span className="text-sm text-muted-foreground italic px-4 py-2 bg-gray-50 rounded-full">
                                Dine-in only
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <AddOnSelector
                item={item}
                isOpen={isAddOnSelectorOpen}
                onClose={() => setIsAddOnSelectorOpen(false)}
                onConfirm={handleAddOnConfirm}
                accentColor={accentColor}
            />
        </div>
    )
}

