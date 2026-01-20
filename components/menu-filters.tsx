"use client"

import { Leaf, WheatOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuFiltersProps {
    showVegetarian: boolean
    showGlutenFree: boolean
    onVegetarianChange: (value: boolean) => void
    onGlutenFreeChange: (value: boolean) => void
    vegetarianCount: number
    glutenFreeCount: number
    totalCount: number
}

export function MenuFilters({
    showVegetarian,
    showGlutenFree,
    onVegetarianChange,
    onGlutenFreeChange,
    vegetarianCount,
    glutenFreeCount,
    totalCount,
}: MenuFiltersProps) {
    const hasActiveFilter = showVegetarian || showGlutenFree

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Filter:</span>

            <button
                onClick={() => onVegetarianChange(!showVegetarian)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    showVegetarian
                        ? "bg-green-600 text-white border-green-600 shadow-md"
                        : "bg-white text-foreground border-border hover:border-green-400 hover:bg-green-50"
                )}
            >
                <Leaf className="w-4 h-4" />
                Vegetarian
                <span
                    className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        showVegetarian ? "bg-white/20" : "bg-green-100 text-green-700"
                    )}
                >
                    {vegetarianCount}
                </span>
            </button>

            <button
                onClick={() => onGlutenFreeChange(!showGlutenFree)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    showGlutenFree
                        ? "bg-amber-600 text-white border-amber-600 shadow-md"
                        : "bg-white text-foreground border-border hover:border-amber-400 hover:bg-amber-50"
                )}
            >
                <WheatOff className="w-4 h-4" />
                Gluten-Free
                <span
                    className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        showGlutenFree ? "bg-white/20" : "bg-amber-100 text-amber-700"
                    )}
                >
                    {glutenFreeCount}
                </span>
            </button>

            {hasActiveFilter && (
                <button
                    onClick={() => {
                        onVegetarianChange(false)
                        onGlutenFreeChange(false)
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                >
                    Clear filters
                </button>
            )}

            {hasActiveFilter && (
                <span className="text-sm text-muted-foreground ml-auto">
                    Showing {totalCount} item{totalCount !== 1 ? "s" : ""}
                </span>
            )}
        </div>
    )
}
