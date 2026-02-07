"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Phone } from "lucide-react"
import { BLUR_DATA_URL } from "@/lib/image-utils"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Single Unified Composition */}
      <section id="main-content" className="bg-[#FAF9F6] min-h-[100dvh] relative overflow-hidden">
        {/* Orange Background Block - 35% right accent */}
        <div className="absolute top-0 right-0 w-[35%] h-full bg-[#FF813D] hidden md:block"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-12 sm:pb-16">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center min-h-[70vh]">
            {/* Left Column - Text Content */}
            <div className="max-w-[520px]">
              <h1 className="text-[28px] sm:text-[34px] md:text-[46px] lg:text-[54px] font-bold leading-[1.15] sm:leading-[1.1] tracking-tight text-[#161412] mb-4 sm:mb-6">
                One of the Best Korean Restaurants in{" "}
                <span className="text-[#FF813D]">NYC.</span>
              </h1>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#696969] leading-[1.6] sm:leading-[1.75] mb-6 sm:mb-8">
                From rich, comforting stews to grilled favorites and shareable classics, Mista Oh brings together the many flavors of Korean cuisine, prepared fresh and meant to be enjoyed any day of the week.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="https://www.opentable.com/restref/client/?rid=1144366"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF813D] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-[#e67335] transition-colors text-sm sm:text-base text-center"
                >
                  Reservation
                </a>
                <Link
                  href="/menu"
                  className="bg-[#F0F0F0] text-[#161412] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-[#e5e5e5] transition-colors text-sm sm:text-base text-center"
                >
                  Order online
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="flex justify-center md:justify-end mt-6 md:mt-0">
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[540px] lg:max-w-[600px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/dolsot-bibimbap-korean-food.jpg"
                  alt="Korean food spread"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-8 hidden md:flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full border-2 border-[#161412] flex items-center justify-center cursor-pointer hover:bg-[#161412] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.51.13%20PM%20%281%29-VN6o0kqxjUYVnEkUQSzaNbvFVbzbJm.jpeg"
                alt="Mista Oh and his wife outside their restaurant"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-balance text-secondary">Our Story</h2>
              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg leading-relaxed text-foreground">
                <p>
                  Meet Mista Oh, the heart and soul behind our restaurant. With a successful kimchi business in Korea,
                  Mista Oh brought his passion for authentic Korean flavors to New York City.
                </p>
                <p>
                  Together with his wife, they opened Mista Oh in the vibrant Flatiron district, creating a warm,
                  family-run establishment where traditional Korean recipes meet the energy of NYC.
                </p>
                <p>
                  Every dish we serve carries the legacy of generations, prepared with the same care and authenticity
                  that made Mista Oh's kimchi famous in Korea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Family Authentic Korean Food */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-secondary">Family. Authentic. Korean.</h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed">
            At Mista Oh, we believe that the best food comes from the heart. Our family recipes have been passed down
            through generations, bringing you the true taste of Korea.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10 md:mt-12">
            <div className="text-center">
              <div className="relative h-48 sm:h-56 md:h-64 mb-3 sm:mb-4 rounded-[2rem] overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.55.43%20PM%20%283%29-ubNJtkaxZ5ncOXNI86x1uQbgIiwjfn.jpeg"
                  alt="Mista Oh and his wife in their restaurant"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-secondary">Family Owned</h3>
              <p className="text-foreground">A husband and wife team bringing authentic Korean hospitality to NYC</p>
            </div>

            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-[2rem] overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.55.44%20PM%20%281%29-VLTe43Oi4XBF5LXSZ3k1LF8fHXOWsM.jpeg"
                  alt="Dining at Mista Oh restaurant"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-secondary">Authentic Recipes</h3>
              <p className="text-foreground">Traditional Korean dishes made with time-honored techniques</p>
            </div>

            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-[2rem] overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.55.43%20PM-I2eRSekz4BiORzEyZhVTZMT0QUn7TH.jpeg"
                  alt="Beautiful entrance of Mista Oh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-secondary">Warm Atmosphere</h3>
              <p className="text-foreground">A cozy space that feels like home, right in Flatiron</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-secondary">Explore Our Menu</h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            From traditional stews to grilled specialties, discover the flavors of Korea
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-surface p-8 rounded-2xl border border-border">
              <h3 className="font-serif text-3xl mb-4 text-primary">Lunch Menu</h3>
              <p className="text-lg mb-4 text-secondary">Mon-Sat: 11 AM - 3 PM</p>
              <p className="text-foreground mb-6">Enjoy our lunch specials featuring bibimbap, stews, and more</p>
              <Link
                href="/menu"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md"
              >
                View Lunch Menu
              </Link>
            </div>

            <div className="bg-surface p-8 rounded-2xl border border-border">
              <h3 className="font-serif text-3xl mb-4 text-secondary">Dinner Menu</h3>
              <p className="text-lg mb-4 text-secondary">Mon-Thurs: 3 PM - 10 PM | Fri & Sat: 3 PM - 11 PM</p>
              <p className="text-foreground mb-6">Experience our full menu with premium cuts and signature dishes</p>
              <Link
                href="/menu"
                className="inline-block bg-secondary hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md"
              >
                View Dinner Menu
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Reviews Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-secondary">What Our Guests Say</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-2xl font-bold text-secondary">4.6</span>
            </div>
            <p className="text-foreground text-lg">Based on 624 Google reviews</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-background p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  G
                </div>
                <div>
                  <p className="font-semibold">Glenn C</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted leading-relaxed">
                "I went to this Korean place a while back with a group of others. The staff here was very friendly even
                compared the most other Korean spots checking in on us and making us feel very welcome..."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-background p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div>
                  <p className="font-semibold">Diane Y</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted leading-relaxed">
                "Felt like I went to grandma's house for dinner. Super cozy and homey with tasty classics: we got the
                soondubu and pork belly — loved both."
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-background p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div>
                  <p className="font-semibold">Jasmine Pak</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted leading-relaxed">
                "I tried the new Korean restaurant and ordered the budae jjigae soup, it was amazing! The flavor was so
                rich and tasty, definitely one of the best I've had."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catering CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-primary text-white p-12 rounded-2xl shadow-xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Catering Services</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Bring the authentic taste of Mista Oh to your next event. We offer catering for parties, corporate events,
            and special occasions.
          </p>
          <Link
            href="/catering"
            className="inline-block bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-full font-semibold transition-colors text-lg shadow-md"
          >
            Learn More About Catering
          </Link>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl mb-12 text-center text-secondary">Visit Us</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Map */}
            <div className="h-[400px] rounded-[2rem] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9476819253204!2d-73.99263492346658!3d40.74290097138747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a7e3b6c5a7%3A0x1234567890abcdef!2s41%20W%2024th%20St%2C%20New%20York%2C%20NY%2010010!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-2xl mb-2 text-secondary">Address</h3>
                    <p className="text-lg text-foreground">
                      41 W 24 St
                      <br />
                      New York, NY 10010
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-2xl mb-2 text-secondary">Phone</h3>
                    <a href="tel:6465598858" className="text-lg text-foreground hover:text-primary transition-colors">
                      (646) 559-8858
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-3 text-secondary">Hours</h3>
                  <div className="space-y-2 text-lg text-foreground">
                    <div>
                      <p className="font-semibold text-secondary">Lunch</p>
                      <p>Monday - Saturday: 11 AM - 3 PM</p>
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold text-secondary">Dinner</p>
                      <p>Monday - Thursday: 3 PM - 10 PM</p>
                      <p>Friday & Saturday: 3 PM - 11 PM</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.opentable.com/restref/client/?rid=1144366"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold transition-colors text-lg mt-4 shadow-md"
                >
                  Reservation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
