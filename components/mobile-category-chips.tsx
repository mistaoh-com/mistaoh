"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Category {
    category: string
    items: any[]
}

interface MobileCategoryChipsProps {
    categories: Category[]
    activeCategory: string
    onCategoryClick: (category: string) => void
    accentColor?: string
}

export function MobileCategoryChips({
    categories,
    activeCategory,
    onCategoryClick,
    accentColor = "amber",
}: MobileCategoryChipsProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const activeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (activeRef.current && scrollRef.current) {
            const container = scrollRef.current
            const activeButton = activeRef.current
            const scrollLeft = activeButton.offsetLeft - container.offsetWidth / 2 + activeButton.offsetWidth / 2
            container.scrollTo({ left: scrollLeft, behavior: "smooth" })
        }
    }, [activeCategory])

    const getAccentClasses = () => {
        switch (accentColor) {
            case "rose":
                return {
                    active: "bg-rose-600 text-white border-rose-600",
                    inactive: "bg-white text-foreground border-gray-300 hover:border-rose-400",
                }
            case "purple":
                return {
                    active: "bg-purple-600 text-white border-purple-600",
                    inactive: "bg-white text-foreground border-gray-300 hover:border-purple-400",
                }
            case "cyan":
                return {
                    active: "bg-cyan-600 text-white border-cyan-600",
                    inactive: "bg-white text-foreground border-gray-300 hover:border-cyan-400",
                }
            default:
                return {
                    active: "bg-primary text-white border-primary",
                    inactive: "bg-card text-foreground border-border hover:border-primary",
                }
        }
    }

    const accent = getAccentClasses()

    return (
        <div className="lg:hidden w-full overflow-hidden -mx-4 px-4">
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {categories.map((cat) => (
                    <button
                        key={cat.category}
                        ref={activeCategory === cat.category ? activeRef : null}
                        onClick={() => onCategoryClick(cat.category)}
                        className={cn(
                            "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap shadow-sm",
                            activeCategory === cat.category ? accent.active : accent.inactive
                        )}
                    >
                        {cat.category}
                    </button>
                ))}
            </div>
        </div>
    )
}
