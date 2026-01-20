import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-20 mt-20">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-amber-600" />
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl mb-6 text-balance">Checkout Cancelled</h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            No worries! Your cart items are still saved. You can continue shopping or checkout when you're ready.
          </p>

          <div className="bg-surface border border-border rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              If you experienced any issues during checkout, please don't hesitate to contact us.
            </p>
            <a href="tel:6465598858" className="text-primary hover:underline font-semibold text-lg">
              (646) 559-8858
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="bg-surface hover:bg-gray-100 text-foreground px-8 py-4 rounded-lg font-semibold transition-colors border border-border"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
