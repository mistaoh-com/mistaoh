import type { MetadataRoute } from "next"
import { absoluteUrl, indexableRoutes } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return indexableRoutes.map((route, index) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: index === 0 ? 1 : 0.8,
  }))
}

