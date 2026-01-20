"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Category {
    category: string
    items: any[]
}

interface MenuSidebarProps {
    categories: Category[]
    activeCategory: string
    onCategoryClick: (category: string) => void
    accentColor?: string
}

export function MenuSidebar({
    categories,
    activeCategory,
    onCategoryClick,
    accentColor = "amber",
}: MenuSidebarProps) {
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 500)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const getAccentClasses = () => {
        switch (accentColor) {
            case "rose":
                return {
                    active: "bg-rose-600 text-white",
                    hover: "hover:bg-rose-100",
                    border: "border-rose-500",
                }
            case "purple":
                return {
                    active: "bg-purple-600 text-white",
                    hover: "hover:bg-purple-100",
                    border: "border-purple-500",
                }
            case "cyan":
                return {
                    active: "bg-cyan-600 text-white",
                    hover: "hover:bg-cyan-100",
                    border: "border-cyan-500",
                }
            default:
                return {
                    active: "bg-primary text-white",
                    hover: "hover:bg-primary-light",
                    border: "border-primary",
                }
        }
    }

    const accent = getAccentClasses()

    return (
        <aside
            className={cn(
                "hidden lg:block w-56 flex-shrink-0 transition-all duration-300",
                isSticky && "sticky top-24"
            )}
        >
            <nav className="bg-card rounded-2xl shadow-sm border border-border/50 p-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-5">
                    Categories
                </h3>
                <ul className="space-y-1">
                    {categories.map((cat) => (
                        <li key={cat.category}>
                            <button
                                onClick={() => onCategoryClick(cat.category)}
                                className={cn(
                                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    activeCategory === cat.category
                                        ? accent.active
                                        : `text-foreground ${accent.hover}`
                                )}
                            >
                                {cat.category}
                                <span className="text-xs ml-1 opacity-70">
                                    ({cat.items.length})
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
