import type React from "react"
import type { Metadata } from "next"
import { createPageMetadata, seoKeywords } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Korean Menu for Pickup in Flatiron NYC",
  description:
    "Order Korean food online for pickup in Flatiron, Manhattan. Browse lunch, dinner, and drinks including bibimbap, bulgogi, galbi, kimchi jjigae, and more.",
  path: "/menu",
  keywords: [...seoKeywords.primary, ...seoKeywords.menu],
  images: ["/dolsot-bibimbap-korean-food.jpg", "/korean-food-spread-with-various-dishes.jpg"],
})

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children
}

