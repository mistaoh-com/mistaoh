import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Heart, Award, Users, Instagram } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#161412] font-sans">
      <Navigation />

      {/* Hero Section - Split Layout */}
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Our story started <br />
              <span className="text-[#FF813D]">in Busan.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#696969] leading-relaxed max-w-lg">
              A family's journey from Korea to the heart of New York City, bringing authentic flavors and warmth to every plate.
            </p>
          </div>
          <div className="relative h-[600px] w-full rounded-[32px] overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/family-msXrKaIcg3q09vxpPGfw3nBHFSsoiB.jpeg"
              alt="Mista Oh Family"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Story Section 1 - Image Left / Text Right - Light Gray Background */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative h-[550px] w-full rounded-[32px] overflow-hidden order-2 md:order-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.51.13%20PM%20%281%29-VN6o0kqxjUYVnEkUQSzaNbvFVbzbJm.jpeg"
              alt="Mista Oh outside"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold">Meet Mista Oh</h2>
            <div className="space-y-6 text-lg text-[#696969] leading-relaxed">
              <p>
                In the bustling streets of Flatiron, New York, there's a warm corner where authentic Korean flavors meet heartfelt hospitality. This is Mista Oh, a family-run restaurant that brings the soul of Korea to Manhattan.
              </p>
              <p>
                The story begins with Mista Oh himself, a successful entrepreneur who built a thriving kimchi business in Korea. His kimchi, made with traditional recipes passed down through generations, became beloved across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 2 - Text Left / Image Right - Orange Background */}
      <section className="py-24 px-6 md:px-12 bg-[#FF813D] text-white">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">The Kimchi Legacy</h2>
            <div className="space-y-6 text-lg text-white/90 leading-relaxed">
              <p>
                Together with his wife, Mista Oh made the bold decision to bring their culinary heritage to New York City. They chose the vibrant Flatiron district to share their passion.
              </p>
              <p>
                At the heart of Mista Oh's culinary expertise is his renowned kimchi. Made using the same traditional methods that made his Korean business successful, our kimchi is a testament to quality, patience, and respect for tradition.
              </p>
            </div>
          </div>
          <div className="relative h-[550px] w-full rounded-[32px] overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-02%20at%201.55.43%20PM%20%283%29-ubNJtkaxZ5ncOXNI86x1uQbgIiwjfn.jpeg"
              alt="Inside Mista Oh"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Industry Leadership Section - White Background */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Industry Leadership</h2>
          <p className="text-lg text-[#696969] leading-relaxed max-w-3xl mx-auto">
            Our owner, Holly Diamond, proudly serves on the Board of Directors for the <a href="https://www.nysra.org/about/board-of-directors-2/" target="_blank" rel="noopener noreferrer" className="text-[#FF813D] hover:underline">New York State Restaurant Association</a>, demonstrating our commitment to excellence and advocacy within the hospitality community.
          </p>
        </div>
      </section>

      {/* Values Section - Light Peach Background */}
      <section className="py-32 px-6 md:px-12 bg-[#FFF5EF]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Stand For</h2>
            <p className="text-xl text-[#696969]">The values that drive everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Heart className="w-8 h-8 text-[#FF813D]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Family First</h3>
              <p className="text-[#696969] leading-relaxed">
                Every dish is prepared with the same love and care we'd give to our own family. When you dine with us, you become part of the Mista Oh family.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Award className="w-8 h-8 text-[#FF813D]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Authentic Tradition</h3>
              <p className="text-[#696969] leading-relaxed">
                We honor traditional Korean cooking methods and recipes, using the finest ingredients to create flavors that transport you to Korea.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-8 h-8 text-[#FF813D]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Community</h3>
              <p className="text-[#696969] leading-relaxed">
                We're proud to be part of the Flatiron community, building relationships one meal at a time and sharing Korean culture with our neighbors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">Follow us on Instagram</h2>
            <Link
              href="https://www.instagram.com/mr.mistaoh_nyc/"
              target="_blank"
              className="text-xl text-[#FF813D] font-medium hover:underline flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              @mr.mistaoh_nyc
            </Link>
          </div>
          <Link
            href="https://www.instagram.com/mr.mistaoh_nyc/"
            target="_blank"
            className="bg-[#161412] text-white px-8 py-4 rounded-full font-semibold hover:bg-black/80 transition-colors"
          >
            See More Photos
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "/dolsot-bibimbap-korean-food.jpg",
            "/mista-ramen-korean-food.jpg",
            "/kimchi-fried-rice-korean-food.jpg",
            "/galbi-jjim-korean-food.jpg"
          ].map((src, i) => (
            <Link
              key={i}
              href="https://www.instagram.com/mr.mistaoh_nyc/"
              target="_blank"
              className="relative aspect-square rounded-3xl overflow-hidden group"
            >
              <Image
                src={src}
                alt="Instagram post"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
