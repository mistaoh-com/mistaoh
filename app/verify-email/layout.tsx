import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Verify Email",
})

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children
}

