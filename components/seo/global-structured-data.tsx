import { absoluteUrl, seoKeywords, siteConfig } from "@/lib/seo"

export function GlobalStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en-US",
        publisher: {
          "@id": absoluteUrl("/#restaurant"),
        },
      },
      {
        "@type": "Restaurant",
        "@id": absoluteUrl("/#restaurant"),
        name: siteConfig.name,
        url: siteConfig.url,
        image: [
          absoluteUrl("/korean-food-spread-with-various-dishes.jpg"),
          absoluteUrl("/dolsot-bibimbap-korean-food.jpg"),
        ],
        description: siteConfig.description,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        priceRange: "$$",
        servesCuisine: ["Korean", "Korean BBQ"],
        acceptsReservations: true,
        hasMenu: absoluteUrl("/menu"),
        sameAs: [siteConfig.instagramUrl, siteConfig.opentableUrl],
        paymentAccepted: "Cash, Credit Card, Debit Card",
        currenciesAccepted: "USD",
        address: {
          "@type": "PostalAddress",
          ...siteConfig.address,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
        areaServed: {
          "@type": "City",
          name: "New York",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "11:00",
            closes: "15:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
            opens: "15:00",
            closes: "22:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Friday", "Saturday"],
            opens: "15:00",
            closes: "23:00",
          },
        ],
        potentialAction: {
          "@type": "OrderAction",
          target: absoluteUrl("/menu"),
        },
        keywords: seoKeywords.primary.join(", "),
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
