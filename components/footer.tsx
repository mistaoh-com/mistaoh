import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/mista-oh-logo.png"
                alt="Mista Oh Logo"
                width={160}
                height={54}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Authentic Korean cuisine in the heart of Flatiron, NYC. Family-owned and operated with love.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl mb-5 text-foreground">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  41 W 24 St<br />
                  New York, NY 10010
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <a href="tel:6465598858" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  (646) 559-8858
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <a href="mailto:mistaohnyc@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  mistaohnyc@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-xl mb-5 text-foreground">Hours</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Lunch</p>
                <p>Mon-Sat: 11 AM - 3 PM</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Dinner</p>
                <p>Mon-Thurs: 3 PM - 10 PM</p>
                <p>Fri & Sat: 3 PM - 11 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl mb-5 text-foreground">Quick Links</h4>
            <nav className="space-y-3 text-sm">
              <Link href="/menu" className="block text-muted-foreground hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/catering" className="block text-muted-foreground hover:text-primary transition-colors">
                Catering
              </Link>
              <a href="https://www.opentable.com/restref/client/?rid=1144366" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors">
                Reservation
              </a>
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mista Oh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
