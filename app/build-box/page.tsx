"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useState } from "react"
import { Plus, Minus, Check, Package, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/cart-context" // Fixed import path from context to contexts

// Pre-configured lunch boxes
const lunchBoxes = [
  {
    id: "bulgogi-box",
    name: "Bulgogi Lunch Box",
    korean: "불고기 도시락",
    price: 20.99,
    description: "Bulgogi with salad, 2 fried dumplings, and soup of the day",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi-2-PjvUbvKALCkjnx9fEPzce6WQrYKkNq.jpg",
    items: ["Bulgogi", "Fresh Salad", "2 Fried Dumplings", "Soup of the Day"],
  },
  {
    id: "spicy-pork-box",
    name: "Spicy Pork Lunch Box",
    korean: "제육볶음 도시락",
    price: 20.99,
    description: "Spicy pork with salad, 2 fried dumplings, and soup of the day",
    image: "/spicy-pork-lunch-box.jpg",
    items: ["Spicy Pork", "Fresh Salad", "2 Fried Dumplings", "Soup of the Day"],
  },
  {
    id: "teriyaki-chicken-box",
    name: "Teriyaki Chicken Box",
    korean: "데리야끼치킨 도시락",
    price: 22.99,
    description: "Teriyaki chicken with salad, 2 fried dumplings, and soup of the day",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teriyaki%20chicken-EcVhieclUrFrsrwg8T5ajngJCXX8My.jpg",
    items: ["Teriyaki Chicken", "Fresh Salad", "2 Fried Dumplings", "Soup of the Day"],
  },
  {
    id: "mackerel-box",
    name: "Grilled Mackerel Box",
    korean: "고등어 도시락",
    price: 17.99,
    description: "Grilled mackerel with salad, 2 fried dumplings, and soup of the day",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DD_mackerel-TBCI17lH6xu23GkicSlrtzA2EqTtPO.jpg",
    items: ["Grilled Mackerel", "Fresh Salad", "2 Fried Dumplings", "Soup of the Day"],
  },
]

// Popular menu items for custom box building
const popularItems = [
  {
    id: "bulgogi",
    name: "Bulgogi",
    korean: "불고기",
    price: 25.99,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi-2-PjvUbvKALCkjnx9fEPzce6WQrYKkNq.jpg",
  },
  {
    id: "teriyaki-chicken",
    name: "Teriyaki Chicken",
    korean: "데리야끼치킨",
    price: 23.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teriyaki%20chicken-EcVhieclUrFrsrwg8T5ajngJCXX8My.jpg",
  },
  {
    id: "chicken-katsu",
    name: "Chicken Katsu",
    korean: "치킨까스",
    price: 24.99,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chicken%20katsu-QBf9XCewKqGTuuEjuZUtZWt62RVCrQ.png",
  },
  {
    id: "kimchi-fried-rice",
    name: "Kimchi Fried Rice",
    korean: "김치볶음밥",
    price: 17.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kimchi%20fried%20rice-8XVmSM2fcc4MZY71V04jwVjMwqmhDj.png",
  },
  {
    id: "bibimbap",
    name: "Dolsot Bibimbap",
    korean: "돌솥비빔밥",
    price: 16.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dolsot%20bibimbap-iX2AsxTuIvspzBGhx6n6x5yJOKa8tH.png",
  },
  {
    id: "galbi-rice",
    name: "Galbi Rice",
    korean: "갈비덮밥",
    price: 29.99,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/galbi%20rice-SRGGS2r77NOIAktINn7FYWJCaKwN8q.png",
  },
  {
    id: "japchae",
    name: "Japchae",
    korean: "잡채",
    price: 13.99,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/japchae-f8yb9hFK9UmTaANkh2I3L991tDRlJc.jpg",
  },
  {
    id: "dumplings",
    name: "Pork Dumplings",
    korean: "돼지만두",
    price: 10.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pork%20Dumplings-JWxg0E8xFaVt6TmlhtZamWC1O3PYt4.jpg",
  },
]

const subscriptionPlans = [
  { id: "weekly", name: "Weekly", description: "Delivered every week", discount: 0 },
  { id: "biweekly", name: "Bi-Weekly", description: "Delivered every 2 weeks", discount: 5 },
  { id: "monthly", name: "Monthly", description: "Delivered every month", discount: 10 },
]

const menuCategories = {
  appetizers: [
    {
      id: "japchae",
      name: "Japchae",
      korean: "잡채",
      price: 13.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/japchae-f8yb9hFK9UmTaANkh2I3L991tDRlJc.jpg",
    },
    {
      id: "pork-dumplings",
      name: "Pork Dumplings",
      korean: "돼지만두",
      price: 10.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pork%20Dumplings-JWxg0E8xFaVt6TmlhtZamWC1O3PYt4.jpg",
    },
    {
      id: "kimchi-dumplings",
      name: "Kimchi Dumplings",
      korean: "김치만두",
      price: 10.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kimchi%20dumplings-SxlYaOnOVZuFInXaz0h61JQ2gPZ9yL.jpg",
    },
    {
      id: "vegetable-dumplings",
      name: "Vegetable Dumplings",
      korean: "야채만두",
      price: 9.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vegetarian%20dumplings-x7E91pzNc5BZXLTwKKl6TeithTY6Dm.jpg",
    },
    {
      id: "shrimp-tempura",
      name: "Shrimp Tempura",
      korean: "새우튀김",
      price: 11.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shrimp%20tempura-RBhJNZZw1V3tIi8Vn8L2YQiJ3CTN2T.jpg",
    },
    {
      id: "fried-calamari",
      name: "Fried Calamari",
      korean: "칼라마리튀김",
      price: 16.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fried%20calamari-IefJteE5ehZDTnuaknZqCx2sxdpXOb.jpg",
    },
    {
      id: "chicken-wings",
      name: "Fried Chicken Wings",
      korean: "치킨윙",
      price: 15.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chickenwings-Jriq5QpQlTIRJ0bgC2Yo3Kz7cH0Als.jpg",
    },
    {
      id: "bulgogi-kimchi-fries",
      name: "Bulgogi Kimchi Fries",
      korean: "불고기감자튀김",
      price: 15.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi%20kimchi%20fries%201-KPsj5xIRmzQORZPrfFhmN9PqiE8cFi.jpg",
    },
    {
      id: "brisket-salad",
      name: "Brisket Salad",
      korean: "차돌샐러드",
      price: 18.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brisket%20salad-VwvV128ve0BtugZWN1IpamLuati5Fy.jpg",
    },
    {
      id: "teriyaki-chicken-salad",
      name: "Teriyaki Chicken Salad",
      korean: "치킨샐러드",
      price: 15.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Teriyaki%20chicken%20salad-2taJe0YTlfPMBZUkTJ8jQn3ALCG1DW.png",
    },
    {
      id: "seafood-pancake",
      name: "Seafood Pancake",
      korean: "해물파전",
      price: 15.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd_seafood%20pancake-8VZVqcmQ7k7Cw5fXFwcKeueOJJwSKj.jpg",
    },
    {
      id: "vegetarian-pancake",
      name: "Vegetarian Pancake",
      korean: "야채파전",
      price: 13.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vegetarian%20Pancakes-zoMiswKLJT1W5mm4VLazB13hxZHTwt.png",
    },
    {
      id: "kimchi-pancake",
      name: "Kimchi Pancake",
      korean: "김치파전",
      price: 15.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kimchi%20pancakes-obLeYgTLbFXkTTOmAanu99JEPzzHtK.jpeg",
    },
  ],
  riceDishes: [
    {
      id: "dolsot-bibimbap",
      name: "Dolsot Bibimbap",
      korean: "돌솥비빔밥",
      price: 16.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dolsot%20bibimbap-iX2AsxTuIvspzBGhx6n6x5yJOKa8tH.png",
    },
    {
      id: "kimchi-fried-rice",
      name: "Kimchi Fried Rice",
      korean: "김치볶음밥",
      price: 17.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kimchi%20fried%20rice-8XVmSM2fcc4MZY71V04jwVjMwqmhDj.png",
    },
    {
      id: "vegetarian-fried-rice",
      name: "Vegetarian Fried Rice",
      korean: "야채볶음밥",
      price: 17.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vegetarian%20fried%20rice-cM6Og0OgyD39c3nGIA39bXElxehwEi.png",
    },
    {
      id: "teriyaki-chicken",
      name: "Teriyaki Chicken",
      korean: "데리야끼치킨",
      price: 23.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teriyaki%20chicken-EcVhieclUrFrsrwg8T5ajngJCXX8My.jpg",
    },
    {
      id: "chicken-katsu",
      name: "Chicken Katsu",
      korean: "치킨까스",
      price: 24.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chicken%20katsu-QBf9XCewKqGTuuEjuZUtZWt62RVCrQ.png",
    },
    {
      id: "truffle-bulgogi-rice",
      name: "Truffle Bulgogi Rice",
      korean: "트러플불고기덮밥",
      price: 26.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/truffle%20bulgogi%20rice-pxH3HxQ8HWZXao6vTvBqXVJwImfave.png",
    },
    {
      id: "spicy-squid-rice",
      name: "Spicy Squid Rice",
      korean: "매운오징어덮밥",
      price: 25.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spicy%20squid%20rice-CdfqLwrUvA3F0lWE6WKZwFW6Wk3zAC.png",
    },
    {
      id: "galbi-rice",
      name: "Galbi Rice",
      korean: "갈비덮밥",
      price: 29.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/galbi%20rice-SRGGS2r77NOIAktINn7FYWJCaKwN8q.png",
    },
  ],
  soupsStews: [
    {
      id: "budae-jjigae",
      name: "Budae Jjigae",
      korean: "부대찌개",
      price: 21.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budae-H1m9fKidjppIPNiMMfi9vZvbLG61MV.jpg",
    },
    {
      id: "kimchi-jjigae",
      name: "Kimchi Jjigae",
      korean: "김치찌개",
      price: 15.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kimchi%20Jjigae-BohyNJaFOnDK3AWb89Kme58cibnpTD.jpg",
    },
    {
      id: "doenjang-jjigae",
      name: "Doenjang Jjigae",
      korean: "된장찌개",
      price: 15.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deonjang%20jjigae-f0SEaORNpmSdF01SfOkess6gUerkXE.jpg",
    },
    {
      id: "yukgaejang",
      name: "Yukgaejang",
      korean: "육개장",
      price: 18.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Yukgaejang-WV5pLfJhDfwBnvvHheB3m87P0FtC0x.jpg",
    },
    {
      id: "soondubu-jjigae",
      name: "Soondubu Jjigae",
      korean: "순두부",
      price: 16.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Soondubu%20Jjigae-lHpXMHh9g0E6yJYiTWvLEE27U8GzFB.jpg",
    },
    {
      id: "galbitang",
      name: "Galbitang",
      korean: "갈비탕",
      price: 20.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galbitang-ul3c8wXqHR0ovCFkCb84BtWAckTZz5.jpg",
    },
  ],
  braisedDishes: [
    {
      id: "cheese-seafood-tteokbokki",
      name: "Cheese Seafood Tteokbokki",
      korean: "치즈해물떡볶음",
      price: 25.99,
      image: "/cheese-seafood-tteokbokki.jpg",
    },
    {
      id: "tteokbokki",
      name: "Tteokbokki",
      korean: "떡볶이",
      price: 18.99,
      image: "/tteokbokki-rice-cakes.jpg",
    },
    {
      id: "galbi-jjim",
      name: "Galbi Jjim",
      korean: "갈비찜",
      price: 35.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galbi%20Jjim-RRSBc34DRqRaQ7vZepjo9FwbcS0J2g.jpg",
    },
    {
      id: "mukeunji-samgyupsal-jjim",
      name: "Mukeunji Samgyupsal Jjim",
      korean: "묵은지삼겹살찜",
      price: 28.99,
      image: "/braised-pork-belly-kimchi.jpg",
    },
  ],
  koreanBBQ: [
    {
      id: "samgyupsal",
      name: "Samgyupsal",
      korean: "삼겹살",
      price: 25.99,
      image: "/samgyupsal-pork-belly.jpg",
    },
    {
      id: "daeji-galbi",
      name: "Daeji Galbi",
      korean: "돼지갈비",
      price: 29.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Daeji%20Galbi-JbqCvnKsaIrtNuofI4p74UeVTvuYTA.jpg",
    },
    {
      id: "spicy-pork",
      name: "Spicy Pork",
      korean: "제육불고기",
      price: 25.99,
      image: "/spicy-pork-bulgogi.jpg",
    },
    {
      id: "bulgogi",
      name: "Bulgogi",
      korean: "불고기",
      price: 25.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi-2-PjvUbvKALCkjnx9fEPzce6WQrYKkNq.jpg",
    },
    {
      id: "dakgui",
      name: "Dakgui",
      korean: "닭구이",
      price: 23.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dakgui-W2aRs6LF7CC2LC45lvADkvNt4yaY7q.jpg",
    },
    {
      id: "galbi",
      name: "Galbi",
      korean: "양념갈비",
      price: 35.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galbi-SxWHpzARBRTDdGD4mcBfY9QHzlb2Di.jpg",
    },
    {
      id: "ribeye-steak",
      name: "Ribeye Steak",
      korean: "꽃등심스테이크",
      price: 38.99,
      image: "/korean-ribeye-steak.jpg",
    },
    {
      id: "la-galbi",
      name: "LA Galbi",
      korean: "LA갈비",
      price: 33.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LA%20Galbi-g5iIZcKWizf7IlPYA9gp9ObWllQMQu.jpg",
    },
  ],
  fish: [
    {
      id: "grilled-mackerel",
      name: "Grilled Mackerel",
      korean: "고등어구이",
      price: 18.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DD_mackerel-TBCI17lH6xu23GkicSlrtzA2EqTtPO.jpg",
    },
    {
      id: "grilled-salmon",
      name: "Grilled Salmon",
      korean: "연어구이",
      price: 19.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grilled%20Salmon-UVycvhKeBF7shIC8fyiicGlZht4t1g.jpg",
    },
  ],
  ramen: [
    {
      id: "mista-ramen",
      name: "Mista Ramen",
      korean: "미스타라면",
      price: 12.0,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "miso-ramen",
      name: "Miso Ramen",
      korean: "미소라면",
      price: 12.0,
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
}

export default function BuildBoxPage() {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})
  const [selectedPlan, setSelectedPlan] = useState("weekly")
  const [mealsPerWeek, setMealsPerWeek] = useState(5)
  const { addToCart } = useCart()

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev }
      if (newItems[itemId]) {
        delete newItems[itemId]
      } else {
        newItems[itemId] = 1
      }
      return newItems
    })
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev }
      const newQty = (newItems[itemId] || 0) + delta
      if (newQty <= 0) {
        delete newItems[itemId]
      } else {
        newItems[itemId] = newQty
      }
      return newItems
    })
  }

  const calculateTotal = () => {
    let total = 0
    Object.entries(selectedItems).forEach(([itemId, quantity]) => {
      let item = null
      for (const category of Object.values(menuCategories)) {
        item = category.find((i) => i.id === itemId)
        if (item) break
      }
      if (item) {
        total += item.price * quantity
      }
    })

    const plan = subscriptionPlans.find((p) => p.id === selectedPlan)
    if (plan && plan.discount > 0) {
      total = total * (1 - plan.discount / 100)
    }

    return total
  }

  const selectedCount = Object.keys(selectedItems).length

  const handleAddCustomBoxToCart = () => {
    const subscriptionItems = Object.entries(selectedItems).map(([itemId, quantity]) => {
      let item = null
      for (const category of Object.values(menuCategories)) {
        item = category.find((i) => i.id === itemId)
        if (item) break
      }
      return {
        id: itemId,
        name: item?.name || "",
        quantity,
      }
    })

    const boxId = `custom-box-${Date.now()}`

    addToCart({
      id: boxId,
      title: "Custom Subscription Box",
      korean: "맞춤 구독 박스",
      price: calculateTotal(),
      image: "/placeholder.svg",
      category: "subscription",
      isSubscription: true,
      subscriptionPlan: selectedPlan as "weekly" | "biweekly" | "monthly",
      mealsPerWeek,
      subscriptionItems,
    })

    setSelectedItems({})
    setMealsPerWeek(5)
  }

  const handleAddLunchBoxToCart = (box: (typeof lunchBoxes)[0]) => {
    const boxId = `lunch-box-${box.id}-${Date.now()}`

    addToCart({
      id: boxId,
      title: box.name,
      korean: box.korean,
      price: box.price,
      image: box.image,
      category: "subscription",
      isSubscription: true,
      subscriptionPlan: selectedPlan as "weekly" | "biweekly" | "monthly",
      mealsPerWeek: 1,
      subscriptionItems: box.items.map((item) => ({ id: item, name: item, quantity: 1 })),
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 z-0">
          <Image src="/korean-food-spread-with-various-dishes.jpg" alt="Build Your Box" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-balance">Build Your Box</h1>
          <p className="text-xl md:text-2xl text-pretty leading-relaxed">
            Create your perfect meal plan with our delicious Korean dishes
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="lunch-boxes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12 h-auto p-2 gap-2 bg-transparent">
              <TabsTrigger
                value="lunch-boxes"
                className="text-lg py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-amber-100 hover:bg-amber-200 transition-all duration-300 rounded-lg font-semibold"
              >
                Pre-Made Lunch Boxes
              </TabsTrigger>
              <TabsTrigger
                value="custom-box"
                className="text-lg py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-rose-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg bg-rose-100 hover:bg-rose-200 transition-all duration-300 rounded-lg font-semibold"
              >
                Build Custom Box
              </TabsTrigger>
            </TabsList>

            {/* Pre-Made Lunch Boxes */}
            <TabsContent value="lunch-boxes">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl mb-4 text-amber-600">Ready-to-Order Lunch Boxes</h2>
                <p className="text-lg text-muted">Perfect for busy days - complete meals ready to go</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {lunchBoxes.map((box) => (
                  <Card key={box.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-64">
                      <Image src={box.image || "/placeholder.svg"} alt={box.name} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl mb-2">{box.name}</h3>
                      <p className="text-sm text-muted mb-2">{box.korean}</p>
                      <p className="text-muted-foreground mb-4">{box.description}</p>
                      <div className="mb-4">
                        <p className="font-semibold mb-2">Includes:</p>
                        <ul className="space-y-1">
                          {box.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${box.price.toFixed(2)}</span>
                        <Button
                          onClick={() => handleAddLunchBoxToCart(box)}
                          className="bg-primary hover:bg-primary-dark"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Subscription Plan Selection for Lunch Boxes */}
              <div className="bg-surface rounded-lg p-8 border border-border">
                <h3 className="font-serif text-3xl mb-6 text-center">Choose Your Plan</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {subscriptionPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-semibold text-xl mb-2">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                      {plan.discount > 0 && <p className="text-green-600 font-semibold">Save {plan.discount}%</p>}
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <Button size="lg" className="bg-primary hover:bg-primary-dark text-lg px-12">
                    Continue to Checkout
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom-box">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl mb-4 text-rose-700">Build Your Custom Box</h2>
                <p className="text-lg text-muted">Select your favorite dishes and create your perfect meal plan</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="font-serif text-2xl mb-6">Select Your Dishes</h3>

                  <Tabs defaultValue="appetizers" className="w-full">
                    <TabsList className="w-full mb-8 h-auto p-1 bg-gray-100 rounded-lg flex flex-wrap justify-start gap-2">
                      <TabsTrigger
                        value="appetizers"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Appetizers
                      </TabsTrigger>
                      <TabsTrigger
                        value="riceDishes"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Rice Dishes
                      </TabsTrigger>
                      <TabsTrigger
                        value="soupsStews"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Soups & Stews
                      </TabsTrigger>
                      <TabsTrigger
                        value="braisedDishes"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Braised
                      </TabsTrigger>
                      <TabsTrigger
                        value="koreanBBQ"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Korean BBQ
                      </TabsTrigger>
                      <TabsTrigger
                        value="fish"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Fish
                      </TabsTrigger>
                      <TabsTrigger
                        value="ramen"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Ramen
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(menuCategories).map(([categoryKey, items]) => (
                      <TabsContent key={categoryKey} value={categoryKey}>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                                selectedItems[item.id]
                                  ? "border-primary bg-primary/5"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              {/* Image */}
                              <div className="relative w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              {/* Item Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base mb-0.5">{item.name}</h4>
                                <p className="text-sm text-gray-500">{item.korean}</p>
                              </div>

                              {/* Price */}
                              <div className="text-lg font-bold text-primary flex-shrink-0">
                                ${item.price.toFixed(2)}
                              </div>

                              {/* Add/Quantity Controls */}
                              <div className="flex-shrink-0">
                                {selectedItems[item.id] ? (
                                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-semibold w-8 text-center">{selectedItems[item.id]}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="p-1.5 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => toggleItem(item.id)}
                                    size="sm"
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary hover:text-white"
                                  >
                                    Add
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                {/* Order Summary & Plan Selection */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <Card className="p-6">
                      <h3 className="font-serif text-2xl mb-6">Your Box</h3>

                      {selectedCount === 0 ? (
                        <p className="text-muted-foreground text-center py-8">Select dishes to build your custom box</p>
                      ) : (
                        <>
                          <div className="mb-6">
                            <p className="text-sm text-muted-foreground mb-2">Selected Items: {selectedCount}</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {Object.entries(selectedItems).map(([itemId, quantity]) => {
                                let item = null
                                for (const category of Object.values(menuCategories)) {
                                  item = category.find((i) => i.id === itemId)
                                  if (item) break
                                }
                                if (!item) return null
                                return (
                                  <div key={itemId} className="flex justify-between text-sm">
                                    <span>
                                      {item.name} x{quantity}
                                    </span>
                                    <span className="font-semibold">${(item.price * quantity).toFixed(2)}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div className="border-t border-border pt-6 mb-6">
                            <h4 className="font-semibold mb-4">Meals Per Week</h4>
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={() => setMealsPerWeek(Math.max(1, mealsPerWeek - 1))}
                                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="text-2xl font-bold">{mealsPerWeek}</span>
                              <button
                                onClick={() => setMealsPerWeek(mealsPerWeek + 1)}
                                className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="border-t border-border pt-6 mb-6">
                            <h4 className="font-semibold mb-4">Subscription Plan</h4>
                            <div className="space-y-3">
                              {subscriptionPlans.map((plan) => (
                                <button
                                  key={plan.id}
                                  onClick={() => setSelectedPlan(plan.id)}
                                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                    selectedPlan === plan.id
                                      ? "border-primary bg-primary/10"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold">{plan.name}</span>
                                    {plan.discount > 0 && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        -{plan.discount}%
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border pt-6">
                            <div className="flex justify-between mb-4">
                              <span className="font-semibold">Total per delivery:</span>
                              <span className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
                            </div>
                            <Button
                              onClick={handleAddCustomBoxToCart}
                              className="w-full bg-primary hover:bg-primary-dark"
                              size="lg"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-center mb-12">Why Subscribe?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Convenient Delivery</h3>
              <p className="text-muted-foreground">Fresh meals delivered right to your door on your schedule</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Flexible Plans</h3>
              <p className="text-muted-foreground">Choose weekly, bi-weekly, or monthly delivery options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Save Money</h3>
              <p className="text-muted-foreground">Get up to 10% off with monthly subscriptions</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
