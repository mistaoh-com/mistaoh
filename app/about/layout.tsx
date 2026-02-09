import type React from "react"
import type { Metadata } from "next"
import { createPageMetadata, seoKeywords } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "About Mista Oh | Family-Owned Korean Restaurant in Flatiron",
  description:
    "Learn the story behind Mista Oh, a family-owned Korean restaurant in Flatiron, NYC serving authentic Korean cuisine with traditional recipes and warm hospitality.",
  path: "/about",
  keywords: [...seoKeywords.primary, ...seoKeywords.about],
  images: ["/korean-bbq-horizontal.jpg", "/korean-food-spread-with-various-dishes.jpg"],
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}

