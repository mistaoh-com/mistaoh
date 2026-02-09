import type React from "react"
import type { Metadata } from "next"
import { absoluteUrl, createPageMetadata, seoKeywords } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Contact Mista Oh | Korean Restaurant in Flatiron NYC",
  description:
    "Contact Mista Oh for Korean food pickup, reservations, and catering in NYC. Find our hours, phone number, and directions to 41 W 24 St, New York, NY 10010.",
  path: "/contact",
  keywords: [...seoKeywords.primary, ...seoKeywords.contact],
  images: ["/korean-bbq-horizontal.jpg", "/korean-food-spread-with-various-dishes.jpg"],
})

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you take reservations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We recommend making a reservation, especially for dinner and weekends. You can book online or call (646) 559-8858.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer vegetarian options?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer several vegetarian dishes and can help accommodate dietary restrictions.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer catering services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We provide Korean catering for events of different sizes in NYC.",
      },
    },
  ],
  isPartOf: {
    "@type": "WebPage",
    "@id": absoluteUrl("/contact"),
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      {children}
    </>
  )
}
