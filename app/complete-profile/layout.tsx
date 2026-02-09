import type React from "react"
import type { Metadata } from "next"
import { createNoIndexMetadata } from "@/lib/seo"

export const metadata: Metadata = createNoIndexMetadata({
  title: "Complete Profile",
})

export default function CompleteProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}

