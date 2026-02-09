import type { Metadata } from "next"

const DEFAULT_SITE_URL = "https://www.mistaoh.com"

function normalizeSiteUrl(url: string): string {
  if (!url) return DEFAULT_SITE_URL
  const withProtocol = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
  return withProtocol.replace(/\/+$/, "")
}

const envSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || ""

export const siteConfig = {
  name: "Mista Oh",
  description:
    "Order authentic Korean food online for pickup in Flatiron, NYC. Enjoy bibimbap, bulgogi, kimchi jjigae, galbi, and more from Mista Oh.",
  url: normalizeSiteUrl(envSiteUrl || DEFAULT_SITE_URL),
  phone: "+1-646-559-8858",
  email: "mistaohnyc@gmail.com",
  address: {
    streetAddress: "41 W 24 St",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10010",
    addressCountry: "US",
  },
  geo: {
    latitude: 40.742901,
    longitude: -73.992635,
  },
  opentableUrl: "https://www.opentable.com/restref/client/?rid=1144366",
  instagramUrl: "https://www.instagram.com/mr.mistaoh_nyc/",
}

export const seoKeywords = {
  primary: [
    "korean restaurant nyc",
    "korean restaurant flatiron",
    "korean food pickup nyc",
    "order korean food online nyc",
    "korean takeout manhattan",
    "korean lunch flatiron",
    "korean dinner nyc",
    "bibimbap nyc",
    "bulgogi nyc",
    "kimchi jjigae nyc",
    "soondubu nyc",
    "galbi nyc",
    "mista oh nyc",
  ],
  home: [
    "order food pickup nyc",
    "korean food pickup flatiron",
    "authentic korean restaurant nyc",
    "family owned korean restaurant manhattan",
  ],
  menu: [
    "korean menu nyc",
    "korean food takeout flatiron",
    "order bibimbap nyc",
    "order bulgogi nyc",
    "korean lunch pickup nyc",
    "korean dinner pickup nyc",
  ],
  catering: [
    "korean catering nyc",
    "korean catering flatiron",
    "corporate catering manhattan",
    "event catering korean food nyc",
  ],
  about: [
    "about mista oh",
    "family owned korean restaurant nyc",
    "flatiron korean restaurant",
  ],
  contact: [
    "mista oh address",
    "korean restaurant 41 w 24 st",
    "korean restaurant flatiron directions",
    "mista oh phone number",
  ],
}

export function absoluteUrl(path: string = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${siteConfig.url}${normalizedPath}`
}

type PageMetadataInput = {
  title: string
  description: string
  path: string
  keywords?: string[]
  images?: string[]
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  images = ["/korean-food-spread-with-various-dishes.jpg"],
}: PageMetadataInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalPath,
      siteName: siteConfig.name,
      title,
      description,
      images: images.map((imagePath) => ({
        url: absoluteUrl(imagePath),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Korean cuisine in NYC`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((imagePath) => absoluteUrl(imagePath)),
    },
  }
}

type NoIndexMetadataInput = {
  title: string
  description?: string
}

export function createNoIndexMetadata({
  title,
  description = "This page is not intended for search indexing.",
}: NoIndexMetadataInput): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }
}

export const indexableRoutes = ["/", "/menu", "/catering", "/about", "/contact"] as const

