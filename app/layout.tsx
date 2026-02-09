import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Crimson_Text } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/contexts/theme-context"
import { Analytics as GoogleAnalytics } from "@/components/analytics"
import { Analytics as VercelAnalytics } from "@vercel/analytics/next"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
})

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["400", "600", "700"],
  display: "swap",
  style: ["normal", "italic"],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FF813D',
}

export const metadata: Metadata = {
  title: "Mista Oh - Authentic Korean Restaurant in Flatiron, NYC",
  description:
    "Experience authentic Korean cuisine at Mista Oh in Flatiron, New York. Family-owned restaurant serving traditional Korean dishes with love.",
  generator: 'v0.app',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mista Oh',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${crimsonText.variable}`}>
      <body>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-NEP3K80RQZ"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NEP3K80RQZ', { send_page_view: false });
            `,
          }}
        />

        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <GoogleAnalytics />
              <ScrollToTop />
              {children}
              <CartSidebar />
              <Toaster />
              <VercelAnalytics />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
