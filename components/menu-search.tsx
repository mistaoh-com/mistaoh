"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"

interface MenuItem {
    title: string
    korean: string
    price: number
    description?: string
    category?: string
}

interface MenuSearchProps {
    items: MenuItem[]
    onItemSelect: (item: MenuItem) => void
    onAddToCart: (item: MenuItem) => void
    placeholder?: string
}

export function MenuSearch({
    items,
    onItemSelect,
    onAddToCart,
    placeholder = "Search menu items...",
}: MenuSearchProps) {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<MenuItem[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (query.length > 0) {
            const filtered = items.filter(
                (item) =>
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.korean.includes(query) ||
                    item.description?.toLowerCase().includes(query.toLowerCase())
            )
            setResults(filtered.slice(0, 8))
            setIsOpen(true)
        } else {
            setResults([])
            setIsOpen(false)
        }
    }, [query, items])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const highlightMatch = (text: string) => {
        if (!query) return text
        const regex = new RegExp(`(${query})`, "gi")
        const parts = text.split(regex)
        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-200 rounded px-0.5">
                    {part}
                </mark>
            ) : (
                part
            )
        )
    }

    const clearSearch = () => {
        setQuery("")
        setIsOpen(false)
        inputRef.current?.focus()
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border z-50 max-h-80 overflow-y-auto"
                >
                    <div className="p-2">
                        <p className="text-xs text-muted-foreground px-2 py-1">
                            {results.length} result{results.length !== 1 ? "s" : ""} found
                        </p>
                        {results.map((item, idx) => (
                            <button
                                key={`${item.title}-${idx}`}
                                onClick={() => {
                                    onItemSelect(item)
                                    setIsOpen(false)
                                    setQuery("")
                                }}
                                className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between gap-3 group"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                        {highlightMatch(item.title)}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {item.korean}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-sm font-semibold text-primary">
                                        ${item.price.toFixed(2)}
                                    </span>
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onAddToCart(item)
                                            setIsOpen(false)
                                            setQuery("")
                                        }}
                                        className="text-xs bg-primary text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-primary/90"
                                    >
                                        Add
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && query && results.length === 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border z-50 p-6 text-center"
                >
                    <p className="text-muted-foreground">No items found for "{query}"</p>
                </div>
            )}
        </div>
    )
}
