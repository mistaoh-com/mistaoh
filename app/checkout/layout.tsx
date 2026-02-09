import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Checkout",
})

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}

