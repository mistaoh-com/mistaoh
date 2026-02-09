import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Orders",
})

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children
}

