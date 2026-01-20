import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Heart, Award, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/family-msXrKaIcg3q09vxpPGfw3nBHFSsoiB.jpeg"
            alt="Mista Oh Family"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-balance">Our Story</h1>
          <p className="text-xl md:text-2xl text-pretty leading-relaxed max-w-2xl mx-auto">
            A family's journey from Korea to the heart of New York City
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl mb-10 text-center text-foreground">Meet Mista Oh</h2>

          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <p>
              In the bustling streets of Flatiron, New York, there's a warm corner where authentic Korean flavors meet
              heartfelt hospitality. This is Mista Oh, a family-run restaurant that brings the soul of Korea to
              Manhattan.
            </p>

            <p>
              The story begins with Mista Oh himself, a successful entrepreneur who built a thriving kimchi business in
              Korea. His kimchi, made with traditional recipes passed down through generations, became beloved across
              the country. But Mista Oh had a bigger dream—to share his passion for authentic Korean cuisine with the
              world.
            </p>

            <p>
              Together with his wife, Mista Oh made the bold decision to bring their culinary heritage to New York City.
              They chose the vibrant Flatiron district, a neighborhood known for its diverse food scene and welcoming
              community. In 2020, they opened the doors to Mista Oh restaurant, transforming their family recipes into a
              dining experience that feels like coming home.
            </p>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 px-4 bg-accent">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.51.13%20PM%20%281%29-VN6o0kqxjUYVnEkUQSzaNbvFVbzbJm.jpeg"
                alt="Mista Oh and his wife outside their restaurant"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.55.43%20PM%20%283%29-ubNJtkaxZ5ncOXNI86x1uQbgIiwjfn.jpeg"
                alt="Mista Oh and his wife in the restaurant"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl mb-16 text-center text-foreground">What We Stand For</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-9 h-9 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Family First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every dish is prepared with the same love and care we'd give to our own family. When you dine with us,
                you become part of the Mista Oh family.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-9 h-9 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Authentic Tradition</h3>
              <p className="text-muted-foreground leading-relaxed">
                We honor traditional Korean cooking methods and recipes, using the finest ingredients to create flavors
                that transport you to Korea.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-9 h-9 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Community Connection</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're proud to be part of the Flatiron community, building relationships one meal at a time and sharing
                Korean culture with our neighbors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Restaurant */}
      <section className="py-24 px-4 bg-accent">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl mb-8 text-foreground">The Restaurant</h2>
              <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Step into Mista Oh and you'll immediately feel the warmth. The cozy atmosphere, decorated with touches
                  of Korean culture and family photos, creates an intimate dining experience that's both authentic and
                  welcoming.
                </p>
                <p>
                  Our open kitchen allows you to see the care that goes into every dish. From the sizzle of bulgogi on
                  the grill to the aromatic steam rising from our stews, every element is designed to engage your senses
                  and create lasting memories.
                </p>
                <p>
                  Whether you're a Korean food enthusiast or trying it for the first time, Mista Oh and his wife are
                  always ready to guide you through the menu, share stories, and ensure your experience is nothing short
                  of exceptional.
                </p>
              </div>
            </div>

            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.55.43%20PM-I2eRSekz4BiORzEyZhVTZMT0QUn7TH.jpeg"
                alt="Mista Oh restaurant entrance"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Kimchi Legacy */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-8 text-foreground">The Kimchi Legacy</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            At the heart of Mista Oh's culinary expertise is his renowned kimchi. Made using the same traditional
            methods that made his Korean business successful, our kimchi is a testament to quality, patience, and
            respect for tradition. Each batch is carefully fermented to achieve the perfect balance of flavors—spicy,
            tangy, and deeply satisfying.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This dedication to excellence extends to every dish we serve. From our signature stews to our grilled
            specialties, each recipe carries the same commitment to authenticity and flavor that made Mista Oh's kimchi
            famous in Korea.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">Experience Our Story</h2>
          <p className="text-xl mb-10 leading-relaxed text-white/90">
            Come taste the passion, tradition, and love that goes into every dish at Mista Oh
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.opentable.com/restref/client/?rid=1144366"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-primary px-8 py-4 rounded-full font-semibold transition-colors text-lg shadow-lg"
            >
              Make a Reservation
            </a>
            <Link
              href="/menu"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold transition-colors text-lg shadow-lg"
            >
              View Our Menu
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

