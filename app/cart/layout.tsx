import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Cart",
})

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}

