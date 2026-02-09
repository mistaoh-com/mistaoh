import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Build Your Box",
})

export default function BuildYourBoxLayout({ children }: { children: React.ReactNode }) {
  return children
}

