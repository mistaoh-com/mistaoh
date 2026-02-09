'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/lib/gtag'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      pageview(pathname + (searchParams.toString() ? '?' + searchParams.toString() : ''))
    }
  }, [pathname, searchParams])

  return null
}
