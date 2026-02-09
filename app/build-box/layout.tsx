import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Build Box",
})

export default function BuildBoxLayout({ children }: { children: React.ReactNode }) {
  return children
}

