import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Account Access",
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}

