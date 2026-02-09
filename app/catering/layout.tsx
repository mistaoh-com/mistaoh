import type React from "react"
import type { Metadata } from "next"
import { createPageMetadata, seoKeywords } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Korean Catering in NYC for Events and Offices",
  description:
    "Plan Korean catering in NYC with Mista Oh. We cater corporate lunches, private events, and special occasions in Flatiron and across Manhattan.",
  path: "/catering",
  keywords: [...seoKeywords.primary, ...seoKeywords.catering],
  images: ["/korean-bbq-catering.jpg", "/korean-food-spread-with-various-dishes.jpg"],
})

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return children
}

