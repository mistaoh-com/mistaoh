"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Plus, Check } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"

const boxOptions = {
  proteins: [
    {
      title: "Cheese Seafood Tteokbokki",
      korean: "치즈해물떡볶음",
      price: 25.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheese_Seafood_Tteokbokki-VM2aVjnsEOF5nLoGw1TA5bnqS0WKhO.jpg",
    },
    {
      title: "Tteokbokki",
      korean: "떡볶이",
      price: 18.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tteokbokki-4e2ZohrfDz1z2rrUe5ZnzUGe2TbCM8.jpg",
    },
    {
      title: "Mukeunji Samgyupsal Jjim",
      korean: "묵은지삼겹살찜",
      price: 28.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mukeunji%20Samgyupsal%20Jjim-5NnZuBtcQN4paiMbgfQevPfXzeVJoK.avif",
    },
    {
      title: "Samgyupsal",
      korean: "삼겹살",
      price: 25.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Samgyupsal-44zmOCoRWIrYI8MTybS4VsqUG5BxzB.avif",
    },
    {
      title: "Ribeye Steak",
      korean: "꽃등심스테이크",
      price: 38.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ribeye%20Steak-8WGNp9hAY0NcKlhtrdrOzWvqPSNlUu.avif",
    },
    {
      title: "Spicy Pork",
      korean: "제육불고기",
      price: 25.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spicy%20Pork-lbwDgkFJmoBmWIYbZm7DAqPKT4XhRY.avif",
    },
    {
      title: "Mista Ramen",
      korean: "미스타라면",
      price: 12.0,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mista%20Ramen.JPG-Toi1pQC16zAFyBFnQt9fXMp90tcaiN.jpeg",
    },
    {
      title: "Miso Ramen",
      korean: "미소라면",
      price: 12.0,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Miso%20Ramen-h9JrAPQZ6ZkUBMJBibkA5Os0Sykhoh.jpg",
    },
  ],
  sides: [
    { title: "Kimchi", korean: "김치", price: 3.0 },
    { title: "Pickled Radish", korean: "단무지", price: 2.5 },
    { title: "Seaweed Salad", korean: "미역", price: 4.0 },
    { title: "Edamame", korean: "에다마메", price: 5.0 },
  ],
  extras: [
    { title: "Extra Rice", korean: "추가밥", price: 2.0 },
    { title: "Fried Egg", korean: "계란후라이", price: 2.5 },
    { title: "Extra Sauce", korean: "추가소스", price: 1.5 },
  ],
}

const readyToOrderBoxes = [
  {
    title: "Grilled Mackerel Box",
    korean: "고등어구이 도시락",
    price: 24.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grilled%20Mackerel%20Box-mT9nKd96DMNhx7e9C6ir4poSG1zOzq.jpg",
    description: "Grilled mackerel with kimchi, dumplings, salad, and seaweed",
  },
  {
    title: "Teriyaki Chicken Box",
    korean: "데리야끼 치킨 도시락",
    price: 22.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Teriyaki%20Chicken%20Box-0mhqgSA8DuKnqyTX0XmQigI6r6MH0u.jpeg",
    description: "Teriyaki chicken with rice, soup, salad, dumplings, and sides",
  },
  {
    title: "Spicy Pork Lunch Box",
    korean: "제육볶음 도시락",
    price: 22.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spicy%20Pork%20Lunch%20Box-V1p0JeVzO7ydHnO3vlwxH50YTg5e1p.jpeg",
    description: "Spicy pork with rice, soup, salad, dumplings, and sides",
  },
  {
    title: "Bulgogi Lunch Box",
    korean: "불고기 도시락",
    price: 24.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bulgogi%20Lunch%20Box-bo6A5bboLA1JNZY5YsIjjoMy1OWSGa.jpeg",
    description: "Marinated beef bulgogi with rice, soup, salad, dumplings, and sides",
  },
]

export default function BuildYourBoxPage() {
  const [selectedProtein, setSelectedProtein] = useState<any>(null)
  const [selectedSides, setSelectedSides] = useState<any[]>([])
  const [selectedExtras, setSelectedExtras] = useState<any[]>([])
  const { addToCart } = useCart()

  const totalPrice =
    (selectedProtein?.price || 0) +
    selectedSides.reduce((sum, side) => sum + side.price, 0) +
    selectedExtras.reduce((sum, extra) => sum + extra.price, 0)

  const handleAddToCart = () => {
    if (!selectedProtein) {
      alert("Please select a protein first!")
      return
    }

    addToCart({
      id: `custom-box-${Date.now()}`,
      title: `Custom Box: ${selectedProtein.title}`,
      korean: selectedProtein.korean,
      price: totalPrice,
      image: selectedProtein.image,
      category: "Custom Box",
    })

    // Reset selections
    setSelectedProtein(null)
    setSelectedSides([])
    setSelectedExtras([])
    alert("Custom box added to cart!")
  }

  const handleAddLunchBoxToCart = (box: any) => {
    addToCart({
      id: `lunch-box-${Date.now()}`,
      title: box.title,
      korean: box.korean,
      price: box.price,
      image: box.image,
      category: "Lunch Box",
    })
    alert(`${box.title} added to cart!`)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section with updated buildyourbox.jpg background */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/buildyourbox-9yWtutmj19xw1s6GCQ5Zjow9FLF8Ey.jpg"
            alt="Build Your Custom Box"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-balance">Build Your Box</h1>
          <p className="text-xl md:text-2xl text-pretty leading-relaxed">
            Create your perfect Korean meal with your choice of protein, sides, and extras
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Ready-to-Order Lunch Boxes</h2>
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              Complete lunch sets with rice, soup, salad, and sides - ready to enjoy!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {readyToOrderBoxes.map((box, idx) => (
              <div
                key={idx}
                className="bg-background rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all hover:shadow-xl group"
              >
                <div className="relative h-64">
                  <Image
                    src={box.image || "/placeholder.svg"}
                    alt={box.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-xl mb-1">{box.title}</h3>
                  <p className="text-sm text-muted mb-2">{box.korean}</p>
                  <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{box.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${box.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddLunchBoxToCart(box)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Box Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Or Build Your Own Custom Box</h2>
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              Choose your favorite protein and customize with sides and extras
            </p>
          </div>

          {/* Step 1: Choose Protein */}
          <div className="mb-16">
            <h2 className="font-serif text-4xl mb-8 text-center">Step 1: Choose Your Protein</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boxOptions.proteins.map((protein, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedProtein(protein)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
                    selectedProtein?.title === protein.title
                      ? "border-primary shadow-xl scale-105"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <div className="relative h-48">
                    <Image
                      src={protein.image || "/placeholder.svg"}
                      alt={protein.title}
                      fill
                      className="object-cover"
                    />
                    {selectedProtein?.title === protein.title && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-surface">
                    <h4 className="font-semibold text-lg">{protein.title}</h4>
                    <p className="text-sm text-muted">{protein.korean}</p>
                    <p className="text-primary font-bold mt-2">${protein.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Add Sides */}
          <div className="mb-16">
            <h2 className="font-serif text-4xl mb-8 text-center">Step 2: Add Sides (Optional)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {boxOptions.sides.map((side, idx) => {
                const isSelected = selectedSides.some((s) => s.title === side.title)
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSides(selectedSides.filter((s) => s.title !== side.title))
                      } else {
                        setSelectedSides([...selectedSides, side])
                      }
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{side.title}</h4>
                        <p className="text-sm text-muted">{side.korean}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${side.price.toFixed(2)}</p>
                        {isSelected && <Check className="w-5 h-5 text-primary ml-auto mt-1" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 3: Add Extras */}
          <div className="mb-16">
            <h2 className="font-serif text-4xl mb-8 text-center">Step 3: Add Extras (Optional)</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {boxOptions.extras.map((extra, idx) => {
                const isSelected = selectedExtras.some((e) => e.title === extra.title)
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedExtras(selectedExtras.filter((e) => e.title !== extra.title))
                      } else {
                        setSelectedExtras([...selectedExtras, extra])
                      }
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{extra.title}</h4>
                        <p className="text-sm text-muted">{extra.korean}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${extra.price.toFixed(2)}</p>
                        {isSelected && <Check className="w-5 h-5 text-primary ml-auto mt-1" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary and Add to Cart */}
          <div className="bg-surface p-8 rounded-2xl border-2 border-primary">
            <h3 className="font-serif text-3xl mb-6 text-center">Your Custom Box</h3>
            <div className="space-y-4 mb-6">
              {selectedProtein && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{selectedProtein.title}</span>
                  <span className="text-primary font-bold">${selectedProtein.price.toFixed(2)}</span>
                </div>
              )}
              {selectedSides.map((side, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span>{side.title}</span>
                  <span className="text-primary">${side.price.toFixed(2)}</span>
                </div>
              ))}
              {selectedExtras.map((extra, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span>{extra.title}</span>
                  <span className="text-primary">${extra.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t-2 border-border pt-4 flex justify-between items-center">
                <span className="font-bold text-xl">Total:</span>
                <span className="font-bold text-2xl text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedProtein}
              className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Custom Box to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Parallax Image Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0" style={{ transform: "translateZ(0)" }}>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201214_151021~2-17NcHYKQEJZKIbayvPHzZzpA4X4y9x.jpg"
            alt="Korean Food Spread"
            fill
            className="object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </section>

      <Footer />
    </div>
  )
}
