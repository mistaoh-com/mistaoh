"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Leaf, WheatOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/cart-context"
import { MenuSidebar } from "@/components/menu-sidebar"
import { MenuSearch } from "@/components/menu-search"
import { MenuFilters } from "@/components/menu-filters"
import { MenuItemCard } from "@/components/menu-item-card"
import { MobileCategoryChips } from "@/components/mobile-category-chips"
import { FloatingCart } from "@/components/floating-cart"

const menuData = {
  lunch: [
    {
      category: "Appetizers",
      items: [
        {
          title: "Japchae",
          korean: "잡채",
          price: 13.99,
          vegetarian: true,
          glutenFree: false,
          description: "Stir-fried sweet potato glass noodles with vegetables",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/japchae-f8yb9hFK9UmTaANkh2I3L991tDRlJc.jpg",
        },
        {
          title: "Mandoo",
          korean: "만두",
          price: 10.99,
          vegetarian: false,
          glutenFree: false,
          description: "Pork or Kimchi dumplings (6 pcs). Vegetarian $9.99. Fried or Steamed",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pork%20Dumplings-JWxg0E8xFaVt6TmlhtZamWC1O3PYt4.jpg",
        },
        {
          title: "Fried Calamari",
          korean: "칼라마리 튀김",
          price: 16.99,
          vegetarian: false,
          glutenFree: false,
          description: "Crispy fried squid rings with dipping sauce",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fried%20calamari-IefJteE5ehZDTnuaknZqCx2sxdpXOb.jpg",
        },
        {
          title: "Fluffy Steamed Egg",
          korean: "계란찜",
          price: 11.99,
          vegetarian: false,
          glutenFree: false,
          description: "An extra fluffy Korean-style steamed egg, dramatically puffed up like a volcano",
          image: "/fluffy-steamed-egg.jpg",
          notOrderable: true,
        },
        {
          title: "Shrimp Tempura",
          korean: "새우튀김",
          price: 16.95,
          vegetarian: false,
          glutenFree: false,
          description: "6 pieces of crispy battered shrimp served with dipping sauce",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shrimp%20tempura-RBhJNZZw1V3tIi8Vn8L2YQiJ3CTN2T.jpg",
        },
        {
          title: "Chicken Wings",
          korean: "치킨윙",
          price: 15.99,
          vegetarian: false,
          glutenFree: false,
          description: "Soy-garlic / sweet and spicy / BBQ / Buffalo (7pcs)",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chickenwings-Jriq5QpQlTIRJ0bgC2Yo3Kz7cH0Als.jpg",
        },
        {
          title: "Bulgogi Kimchi Fries",
          korean: "감자튀김",
          price: 15.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild",
          description: "Crispy fries topped with bulgogi beef, kimchi and cheese curd with spicy mayo",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi%20kimchi%20fries%201-KPsj5xIRmzQORZPrfFhmN9PqiE8cFi.jpg",
        },
        {
          title: "Veggie Pancake",
          korean: "파전",
          price: 14.99,
          vegetarian: true,
          glutenFree: false,
          description: "Savory Korean pancake filled with fresh vegetables",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vegetarian%20Pancakes-zoMiswKLJT1W5mm4VLazB13hxZHTwt.png",
        },
        {
          title: "Kimchi Pancake",
          korean: "김치전",
          price: 17.99,
          vegetarian: true,
          glutenFree: false,
          spicyLevel: "mild",
          description: "Crispy pancake made with spicy fermented kimchi",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kimchi%20pancakes-obLeYgTLbFXkTTOmAanu99JEPzzHtK.jpeg",
        },
        {
          title: "Seafood Pancake",
          korean: "해물파전",
          price: 19.99,
          vegetarian: false,
          glutenFree: false,
          description: "Crispy Korean pancake loaded with seafood and scallions",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd_seafood%20pancake-8VZVqcmQ7k7Cw5fXFwcKeueOJJwSKj.jpg",
        },
        {
          title: "Brisket Salad",
          korean: "차돌샐러드",
          price: 20.99,
          vegetarian: false,
          glutenFree: false,
          description: "Mixed greens with tender beef brisket with spicy dressing",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brisket%20salad-VwvV128ve0BtugZWN1IpamLuati5Fy.jpg",
        },
        {
          title: "Teriyaki Chicken Salad",
          korean: "치킨샐러드",
          price: 15.99,
          vegetarian: false,
          glutenFree: false,
          description: "Grilled chicken with teriyaki glaze over fresh greens",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Teriyaki%20chicken%20salad-2taJe0YTlfPMBZUkTJ8jQn3ALCG1DW.png",
        },
        {
          title: "House Salad",
          korean: "샐러드",
          price: 4.99,
          vegetarian: true,
          glutenFree: true,
          description: "Mixed greens with ginger dressing",
          image: "/placeholder.jpg",
        },
      ],
    },
    {
      category: "Rice Dishes",
      items: [
        {
          title: "Dolsot Bibimbap",
          korean: "돌솥비빔밥",
          price: 19.99,
          vegetarian: true,
          glutenFree: true,
          description: "Hot stone bowl with rice and vegetables, topped with egg strips. Add Beef or Spicy Pork (+$3), Tofu (+$2)",
          image: "/dolsot-bibimbap-korean-food.jpg",
        },
        {
          title: "Kimchi Fried Rice",
          korean: "김치볶음밥",
          price: 17.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Fried rice with kimchi and vegetables. Add Beef (+$3)",
          image: "/kimchi-fried-rice-korean-food.jpg",
        },
        {
          title: "Teriyaki Chicken",
          korean: "데리야끼치킨",
          price: 23.99,
          vegetarian: false,
          glutenFree: false,
          description: "Grilled chicken glazed with sweet teriyaki sauce, served with rice and salad",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teriyaki%20chicken-EcVhieclUrFrsrwg8T5ajngJCXX8My.jpg",
        },
        {
          title: "Vegetable Fried Rice",
          korean: "야채볶음밥",
          price: 18.99,
          vegetarian: true,
          glutenFree: true,
          description: "Fried rice with assorted vegetables",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vegetarian%20fried%20rice-cM6Og0OgyD39c3nGIA39bXElxehwEi.png",
        },
        {
          title: "Chicken Katsu",
          korean: "치킨까스",
          price: 24.99,
          vegetarian: false,
          glutenFree: false,
          description: "Crispy breaded chicken cutlet with tonkatsu sauce with rice and salad",
          image: "/chicken-katsu-korean-food.jpg",
        },
        {
          title: "Truffle Bulgogi Rice",
          korean: "트러플 불고기 덮밥",
          price: 26.99,
          vegetarian: false,
          glutenFree: false,
          description: "Thinly sliced marinated ribeye over rice with cilantro and truffle on a sizzling stone pan",
          image: "/truffle-bulgogi-rice-korean-food.jpg",
        },
        {
          title: "Spicy Squid Rice",
          korean: "오징어 덮밥",
          price: 25.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy stir-fried squid with vegetables over steamed rice",
          image: "/spicy-squid-rice-korean-food.jpg",
        },
        {
          title: "Galbi Rice",
          korean: "갈비 덮밥",
          price: 29.99,
          vegetarian: false,
          glutenFree: false,
          description: "Tender marinated short ribs over rice with salad",
          image: "/galbi-rice-korean-food.jpg",
        },
      ],
    },
    {
      category: "Soups & Noodles",
      items: [
        {
          title: "Soondubu Jjigae",
          korean: "순두부",
          price: 16.99,
          vegetarian: true,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy soft tofu stew with vegetables in a rich broth. Add Beef (+$3), Seafood (+$3), or Vegetarian",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Soondubu%20Jjigae-lHpXMHh9g0E6yJYiTWvLEE27U8GzFB.jpg",
        },
        {
          title: "Kimchi Jjigae",
          korean: "김치찌개",
          price: 15.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Spicy kimchi stew with tofu. Add Pork (+$3)",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kimchi%20Jjigae-BohyNJaFOnDK3AWb89Kme58cibnpTD.jpg",
        },
        {
          title: "Doenjang Jjigae",
          korean: "된장찌개",
          price: 15.99,
          vegetarian: true,
          glutenFree: false,
          description: "Korean fermented soybean paste stew with vegetables and tofu. Add Beef (+$3), Seafood (+$3), or Vegetarian",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deonjang%20jjigae-f0SEaORNpmSdF01SfOkess6gUerkXE.jpg",
        },
        {
          title: "Budae Jjigae",
          korean: "부대찌개",
          price: 21.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy stew with sausage, spam, bean, cream cheese, ramen noodles, and vegetables in spicy broth",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budae-H1m9fKidjppIPNiMMfi9vZvbLG61MV.jpg",
        },
        {
          title: "Yukgaejang",
          korean: "육개장",
          price: 18.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Spicy beef soup with vegetables and glass noodles",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Yukgaejang-WV5pLfJhDfwBnvvHheB3m87P0FtC0x.jpg",
        },
        {
          title: "Galbitang",
          korean: "갈비탕",
          price: 20.99,
          vegetarian: false,
          glutenFree: false,
          description: "Beef short rib soup in clear with glass noodles, savory broth",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galbitang-ul3c8wXqHR0ovCFkCb84BtWAckTZz5.jpg",
        },
        {
          title: "Maeun Tang",
          korean: "매운탕",
          price: 26.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy Korean fish (salmon) stew with vegetables in chili broth",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maeun%20Tang-fmQulVK71wui2XCpMD4jhf8q0Iy2uj.jpg",
        },
        {
          title: "Korean Kalguksu",
          korean: "칼국수",
          price: 16.99,
          vegetarian: true,
          glutenFree: false,
          description: "Light broth with hand-cut wheat noodles and vegetables. Add Seafood (+$3)",
          image: "/kalguksu-korean-food.jpg",
        },
        {
          title: "Miso Ramen",
          korean: "미소 라면",
          price: 12.00,
          vegetarian: false,
          glutenFree: false,
          description: "Ramen in savory miso broth. Add Bulgogi, boiled egg, chicken, or tofu (+$2.50)",
          image: "/mista-ramen-korean-food.jpg",
        },
        {
          title: "Mista Ramen",
          korean: "미스타 라면",
          price: 12.00,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Korean Instant ramen. Add Bulgogi, boiled egg, chicken, or tofu (+$2.50)",
          image: "/miso-ramen-korean-food.jpg",
        },
      ],
    },
    {
      category: "Braised Dishes",
      items: [
        {
          title: "Tteokbokki",
          korean: "떡볶이",
          price: 18.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Chewy rice cakes in sweet and spicy gochujang sauce with melted cheese. Seafood (+$6) Ramen noodles (+$5)",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tteokbokki-pzokp2Uzds3o7nH8UgGa1o1E6tUuwE.jpg",
        },
        {
          title: "Galbi Jjim",
          korean: "갈비찜",
          price: 34.99,
          vegetarian: false,
          glutenFree: false,
          description: "Braised beef short ribs with vegetables in savory-sweet sauce",
          image: "/galbi-jjim-korean-food.jpg",
        },
        {
          title: "Mukeunji Samgyupsal Jjim",
          korean: "묵은지삼겹살찜",
          price: 28.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Braised pork belly with aged kimchi",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mukeunji%20Samgyupsal%20Jjim-9IIYFLzTtXqw3VH9R2w6e9om5lgw80.jpg",
        },
      ],
    },
    {
      category: "Korean BBQ",
      items: [
        {
          title: "Bulgogi",
          korean: "불고기",
          price: 33.99,
          vegetarian: false,
          glutenFree: false,
          description: "Thinly sliced ribeye marinated in sweet soy sauce",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi-2-PjvUbvKALCkjnx9fEPzce6WQrYKkNq.jpg",
        },
        {
          title: "Samgyupsal",
          korean: "삼겹살",
          price: 28.99,
          vegetarian: false,
          glutenFree: true,
          description: "Grilled pork belly slices, served with lettuce",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Samgyupsal-e2FbCHZ5myEMtNE0cLYNCW2Yz8fJFn.jpg",
        },
        {
          title: "Daeji Galbi",
          korean: "돼지갈비",
          price: 32.99,
          vegetarian: false,
          glutenFree: false,
          description: "Marinated pork shoulders",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Daeji%20Galbi-JbqCvnKsaIrtNuofI4p74UeVTvuYTA.jpg",
        },
        {
          title: "Spicy Pork",
          korean: "제육",
          price: 31.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy marinated pork shoulders with vegetables",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spicy%20Pork-634sw7W0NEXwkn7JJuLoASzHoEuh26.jpg",
        },
        {
          title: "Dakgui",
          korean: "닭구이",
          price: 27.99,
          vegetarian: false,
          glutenFree: false,
          description: "Grilled marinated boneless chicken with Korean spices",
          image: "/dakgui-korean-food.jpg",
        },
        {
          title: "Galbi",
          korean: "양념갈비",
          price: 35.99,
          vegetarian: false,
          glutenFree: false,
          description: "Korean marinated beef short ribs grilled",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galbi-SxWHpzARBRTDdGD4mcBfY9QHzlb2Di.jpg",
        },
        {
          title: "LA Galbi",
          korean: "LA 갈비",
          price: 34.99,
          vegetarian: false,
          glutenFree: false,
          description: "LA-style marinated beef short ribs",
          image: "/la-galbi-korean-food.jpg",
        },
        {
          title: "Ribeye Steak",
          korean: "꽃등심스테이크",
          price: 39.99,
          vegetarian: false,
          glutenFree: true,
          description: "Premium Korean ribeye steak grilled to order",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ribeye%20Steak-VYX5Ouo7LG7OzDjFJUsdOrSETMUr6Z.jpg",
        },
      ],
    },
    {
      category: "Fish",
      items: [
        {
          title: "Grilled Mackerel",
          korean: "고등어구이",
          price: 22.99,
          vegetarian: false,
          glutenFree: true,
          description: "Whole mackerel grilled with sea salt and lemon",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DD_mackerel-TBCI17lH6xu23GkicSlrtzA2EqTtPO.jpg",
        },
        {
          title: "Grilled Salmon",
          korean: "연어구이",
          price: 24.99,
          vegetarian: false,
          glutenFree: true,
          description: "Fresh salmon fillet grilled with sea salt and lemon",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grilled%20Salmon-UVycvhKeBF7shIC8fyiicGlZht4t1g.jpg",
        },
      ],
    },
    {
      category: "Dosirak (Lunch Box)",
      items: [
        {
          title: "Spicy Squid Set",
          korean: "오징어 세트",
          price: 20.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy stir-fried squid with vegetables. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spicy%20Squid%20Set-PkR1LX7SVjJW9Rh31LRSNY6bIBPDey.jpeg",
        },
        {
          title: "Daeji Galbi Set",
          korean: "돼지갈비 세트",
          price: 23.99,
          vegetarian: false,
          glutenFree: false,
          description: "Marinated pork shoulders. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
          image: "/daeji-galbi-dosirak.jpg",
        },
        {
          title: "Spicy Pork Set",
          korean: "제육볶음 세트",
          price: 20.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Thinly sliced pork stir-fried in a spicy gochujang-based sauce. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spicy%20Pork%20Set-adGWiVlzUIYENaHJuIWUC2GFuMAROk.jpeg",
        },
        {
          title: "Bulgogi Set",
          korean: "불고기 세트",
          price: 20.99,
          vegetarian: false,
          glutenFree: false,
          description: "Thin sliced marinated ribeye. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bulgogi%20Set-wHjsZQDdhLjzMURWgFuly4oRzJZ119.jpeg",
        },
        {
          title: "Gochujang Samgyupsal Set",
          korean: "고추장 삼겹살 세트",
          price: 22.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Grilled pork belly marinated in spicy Korean gochujang sauce. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
          image: "/gochujang-samgyupsal-dosirak.jpg",
        },
        {
          title: "Dakgui Set",
          korean: "닭구이 세트",
          price: 18.99,
          vegetarian: false,
          glutenFree: false,
          description: "Marinated boneless chicken. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
          image: "/dakgui-dosirak.jpg",
        },
        {
          title: "Grilled Mackerel Set",
          korean: "고등어 세트",
          price: 17.99,
          vegetarian: false,
          glutenFree: false,
          description: "Grilled Mackerel. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
          image: "/grilled-mackerel-dosirak.jpg",
        },
      ],
    },
  ],
  dinner: [
    {
      category: "Appetizers",
      items: [
        {
          title: "Japchae",
          korean: "잡채",
          price: 15.99,
          vegetarian: true,
          glutenFree: true,
          description: "Stir-fried sweet potato glass noodles with vegetables",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/japchae-f8yb9hFK9UmTaANkh2I3L991tDRlJc.jpg",
        },
        {
          title: "Mandoo",
          korean: "만두",
          price: 10.99,
          vegetarian: false,
          glutenFree: false,
          description: "Pork or Kimchi dumplings (6 pcs). Vegetarian $9.99. Fried or Steamed",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pork%20Dumplings-JWxg0E8xFaVt6TmlhtZamWC1O3PYt4.jpg",
        },
        {
          title: "Fried Calamari",
          korean: "칼라마리 튀김",
          price: 18.99,
          vegetarian: false,
          glutenFree: false,
          description: "Crispy fried squid rings with dipping sauce",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fried%20calamari-IefJteE5ehZDTnuaknZqCx2sxdpXOb.jpg",
        },
        {
          title: "Fluffy Steamed Egg",
          korean: "계란찜",
          price: 11.99,
          vegetarian: false,
          glutenFree: false,
          description: "An extra fluffy Korean-style steamed egg, dramatically puffed up like a volcano",
          image: "/fluffy-steamed-egg.jpg",
          notOrderable: true,
        },
        {
          title: "Shrimp Tempura",
          korean: "새우튀김",
          price: 16.95,
          vegetarian: false,
          glutenFree: false,
          description: "6 pieces of crispy battered shrimp served with dipping sauce",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shrimp%20tempura-RBhJNZZw1V3tIi8Vn8L2YQiJ3CTN2T.jpg",
        },
        {
          title: "Fried Chicken Wings",
          korean: "윙",
          price: 17.99,
          vegetarian: false,
          glutenFree: false,
          description: "Soy-garlic / sweet and spicy / BBQ / Buffalo (7pcs)",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chickenwings-Jriq5QpQlTIRJ0bgC2Yo3Kz7cH0Als.jpg",
        },
        {
          title: "Bulgogi Kimchi Fries",
          korean: "감자튀김",
          price: 17.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Crispy fries topped with bulgogi beef, kimchi and cheese curd with spicy mayo",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi%20kimchi%20fries%201-KPsj5xIRmzQORZPrfFhmN9PqiE8cFi.jpg",
        },
        {
          title: "Veggie Pancake",
          korean: "파전",
          price: 15.99,
          vegetarian: true,
          glutenFree: false,
          description: "Savory Korean pancake filled with fresh vegetables",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vegetarian%20Pancakes-zoMiswKLJT1W5mm4VLazB13hxZHTwt.png",
        },
        {
          title: "Kimchi Pancake",
          korean: "김치전",
          price: 17.99,
          vegetarian: true,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Crispy pancake made with spicy fermented kimchi",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kimchi%20pancakes-obLeYgTLbFXkTTOmAanu99JEPzzHtK.jpeg",
        },
        {
          title: "Seafood Pancake",
          korean: "해물파전",
          price: 21.99,
          vegetarian: false,
          glutenFree: false,
          description: "Crispy Korean pancake loaded with seafood and scallions",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd_seafood%20pancake-8VZVqcmQ7k7Cw5fXFwcKeueOJJwSKj.jpg",
        },
        {
          title: "Brisket Salad",
          korean: "차돌샐러드",
          price: 20.99,
          vegetarian: false,
          glutenFree: false,
          description: "Mixed greens with tender beef brisket with spicy dressing",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brisket%20salad-VwvV128ve0BtugZWN1IpamLuati5Fy.jpg",
        },
        {
          title: "Teriyaki Chicken Salad",
          korean: "치킨샐러드",
          price: 17.99,
          vegetarian: false,
          glutenFree: false,
          description: "Grilled chicken with teriyaki glaze over fresh greens",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Teriyaki%20chicken%20salad-2taJe0YTlfPMBZUkTJ8jQn3ALCG1DW.png",
        },
        {
          title: "House Salad",
          korean: "샐러드",
          price: 4.99,
          vegetarian: true,
          glutenFree: true,
          description: "Mixed greens with ginger dressing",
          image: "/placeholder.jpg",
        },
      ],
    },
    {
      category: "Rice Dishes",
      items: [
        {
          title: "Dolsot Bibimbap",
          korean: "돌솥비빔밥",
          price: 22.99,
          vegetarian: true,
          glutenFree: true,
          description: "Hot stone bowl with rice and vegetables, topped with egg strips. Add Beef or Spicy Pork (+$3), Tofu (+$2)",
          image: "/dolsot-bibimbap-korean-food.jpg",
        },
        {
          title: "Kimchi Fried Rice",
          korean: "김치볶음밥",
          price: 25.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Fried rice with kimchi and vegetables. Add Beef (+$3)",
          image: "/kimchi-fried-rice-korean-food.jpg",
        },
        {
          title: "Vegetable Fried Rice",
          korean: "야채볶음밥",
          price: 18.99,
          vegetarian: true,
          glutenFree: true,
          description: "Fried rice with assorted vegetables",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vegetarian%20fried%20rice-cM6Og0OgyD39c3nGIA39bXElxehwEi.png",
        },
        {
          title: "Teriyaki Chicken",
          korean: "데리야끼치킨",
          price: 28.99,
          vegetarian: false,
          glutenFree: false,
          description: "Grilled chicken glazed with sweet teriyaki sauce, served with rice and salad",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teriyaki%20chicken-EcVhieclUrFrsrwg8T5ajngJCXX8My.jpg",
        },
        {
          title: "Chicken Katsu",
          korean: "치킨까스",
          price: 26.99,
          vegetarian: false,
          glutenFree: false,
          description: "Crispy breaded chicken cutlet with tonkatsu sauce with rice and salad",
          image: "/chicken-katsu-korean-food.jpg",
        },
        {
          title: "Truffle Bulgogi Rice",
          korean: "트러플 불고기 덮밥",
          price: 29.99,
          vegetarian: false,
          glutenFree: false,
          description: "Thinly sliced marinated ribeye over rice with cilantro and truffle on a sizzling stone pan",
          image: "/truffle-bulgogi-rice-korean-food.jpg",
        },
        {
          title: "Spicy Squid Rice",
          korean: "오징어 덮밥",
          price: 28.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy stir-fried squid with vegetables over steamed rice",
          image: "/spicy-squid-rice-korean-food.jpg",
        },
        {
          title: "Galbi Rice",
          korean: "갈비 덮밥",
          price: 34.99,
          vegetarian: false,
          glutenFree: false,
          description: "Tender marinated short ribs over rice with salad",
          image: "/galbi-rice-korean-food.jpg",
        },
      ],
    },
    {
      category: "Soup & Noodles",
      items: [
        {
          title: "Soondubu Jjigae",
          korean: "순두부",
          price: 19.99,
          vegetarian: true,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy soft tofu stew with vegetables in a rich broth. Add Beef (+$3), Seafood (+$3), or Vegetarian",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Soondubu%20Jjigae-lHpXMHh9g0E6yJYiTWvLEE27U8GzFB.jpg",
        },
        {
          title: "Kimchi Jjigae",
          korean: "김치찌개",
          price: 18.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Spicy kimchi stew with tofu. Add Pork (+$3)",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kimchi%20Jjigae-BohyNJaFOnDK3AWb89Kme58cibnpTD.jpg",
        },
        {
          title: "Doenjang Jjigae",
          korean: "된장찌개",
          price: 18.99,
          vegetarian: true,
          glutenFree: false,
          description: "Korean fermented soybean paste stew with vegetables and tofu. Add Beef (+$3), Seafood (+$3), or Vegetarian",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deonjang%20jjigae-f0SEaORNpmSdF01SfOkess6gUerkXE.jpg",
        },
        {
          title: "Budae Jjigae",
          korean: "부대찌개",
          price: 21.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy stew with sausage, spam, bean, cream cheese, ramen noodles, and vegetables in spicy broth",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budae-H1m9fKidjppIPNiMMfi9vZvbLG61MV.jpg",
        },
        {
          title: "Yukgaejang",
          korean: "육개장",
          price: 22.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Spicy beef soup with vegetables and glass noodles",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Yukgaejang-WV5pLfJhDfwBnvvHheB3m87P0FtC0x.jpg",
        },
        {
          title: "Galbitang",
          korean: "갈비탕",
          price: 22.99,
          vegetarian: false,
          glutenFree: false,
          description: "Beef short rib soup in clear with glass noodles, savory broth",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galbitang-ul3c8wXqHR0ovCFkCb84BtWAckTZz5.jpg",
        },
        {
          title: "Maeun Tang",
          korean: "매운탕",
          price: 26.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy Korean fish (salmon) stew with vegetables in chili broth",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maeun%20Tang-fmQulVK71wui2XCpMD4jhf8q0Iy2uj.jpg",
        },
        {
          title: "Korean Kalguksu",
          korean: "칼국수",
          price: 16.99,
          vegetarian: true,
          glutenFree: false,
          description: "Light broth with hand-cut wheat noodles and vegetables. Add Seafood (+$3)",
          image: "/kalguksu-korean-food.jpg",
        },
      ],
    },
    {
      category: "Braised Dishes",
      items: [
        {
          title: "Tteokbokki",
          korean: "떡볶이",
          price: 20.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "medium" as const,
          description: "Chewy rice cakes in sweet and spicy gochujang sauce with melted cheese. Seafood (+$8), Ramen noodles (+$5)",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tteokbokki-pzokp2Uzds3o7nH8UgGa1o1E6tUuwE.jpg",
        },
        {
          title: "Galbi Jjim",
          korean: "갈비찜",
          price: 39.99,
          vegetarian: false,
          glutenFree: false,
          description: "Braised beef short ribs with vegetables in savory-sweet sauce",
          image: "/galbi-jjim-korean-food.jpg",
        },
        {
          title: "Mukeunji Samgyupsal Jjim",
          korean: "묵은지삼겹살찜",
          price: 32.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Braised pork belly with aged kimchi",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mukeunji%20Samgyupsal%20Jjim-9IIYFLzTtXqw3VH9R2w6e9om5lgw80.jpg",
        },
      ],
    },
    {
      category: "Korean BBQ",
      items: [
        {
          title: "Bulgogi",
          korean: "불고기",
          price: 37.99,
          vegetarian: false,
          glutenFree: false,
          description: "Thinly sliced ribeye marinated in sweet soy sauce",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bulgogi-2-PjvUbvKALCkjnx9fEPzce6WQrYKkNq.jpg",
        },
        {
          title: "Samgyupsal",
          korean: "삼겹살",
          price: 34.99,
          vegetarian: false,
          glutenFree: true,
          description: "Grilled pork belly slices, served with lettuce",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Samgyupsal-e2FbCHZ5myEMtNE0cLYNCW2Yz8fJFn.jpg",
        },
        {
          title: "Daeji Galbi",
          korean: "돼지갈비",
          price: 36.99,
          vegetarian: false,
          glutenFree: false,
          description: "Marinated pork shoulders",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Daeji%20Galbi-JbqCvnKsaIrtNuofI4p74UeVTvuYTA.jpg",
        },
        {
          title: "Spicy Pork",
          korean: "제육",
          price: 35.99,
          vegetarian: false,
          glutenFree: false,
          spicyLevel: "mild" as const,
          description: "Spicy marinated pork shoulders with vegetables",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spicy%20Pork-634sw7W0NEXwkn7JJuLoASzHoEuh26.jpg",
        },
        {
          title: "Dakgui",
          korean: "닭구이",
          price: 32.99,
          vegetarian: false,
          glutenFree: false,
          description: "Grilled marinated boneless chicken with Korean spices",
          image: "/dakgui-korean-food.jpg",
        },
        {
          title: "Galbi",
          korean: "양념갈비",
          price: 39.99,
          vegetarian: false,
          glutenFree: false,
          description: "Korean marinated beef short ribs grilled",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galbi-SxWHpzARBRTDdGD4mcBfY9QHzlb2Di.jpg",
        },
        {
          title: "LA Galbi",
          korean: "LA 갈비",
          price: 37.99,
          vegetarian: false,
          glutenFree: false,
          description: "LA-style marinated beef short ribs",
          image: "/la-galbi-korean-food.jpg",
        },
        {
          title: "Ribeye Steak",
          korean: "꽃등심스테이크",
          price: 43.99,
          vegetarian: false,
          glutenFree: true,
          description: "Premium Korean ribeye steak grilled to order",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ribeye%20Steak-VYX5Ouo7LG7OzDjFJUsdOrSETMUr6Z.jpg",
        },
      ],
    },
    {
      category: "Fish",
      items: [
        {
          title: "Grilled Mackerel",
          korean: "고등어구이",
          price: 27.99,
          vegetarian: false,
          glutenFree: false,
          description: "Whole mackerel grilled with sea salt and lemon",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DD_mackerel-TBCI17lH6xu23GkicSlrtzA2EqTtPO.jpg",
        },
        {
          title: "Grilled Salmon",
          korean: "연어구이",
          price: 29.99,
          vegetarian: false,
          glutenFree: false,
          description: "Fresh salmon fillet grilled with sea salt and lemon",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grilled%20Salmon-UVycvhKeBF7shIC8fyiicGlZht4t1g.jpg",
        },
      ],
    },
  ],
  drinks: [
    {
      category: "Beer",
      isAlcoholic: true,
      items: [
        {
          title: "Kloud",
          korean: "클라우드",
          price: 8.0,
          description: "Korea 5% ABV/335 ml",
        },
        {
          title: "Terra",
          korean: "테라",
          price: 8.0,
          description: "Korea 5% ABV/335 ml",
        },
        {
          title: "Blue Moon",
          korean: "블루문",
          price: 8.0,
          description: "USA 5.4% ABV/335 ml",
        },
        {
          title: "Sapporo",
          korean: "삿포로",
          price: 8.0,
          description: "Japan 5% ABV/335 ml",
        },
        {
          title: "Stella",
          korean: "스텔라",
          price: 8.0,
          description: "Belgium 5% ABV/330 ml",
        },
        {
          title: "Heineken",
          korean: "하이네켄",
          price: 8.0,
          description: "Dutch 5% ABV/335 ml",
        },
      ],
    },
    {
      category: "Makgeolli (Bottled)",
      isAlcoholic: true,
      items: [
        {
          title: "Original Saeng Makgeolli",
          korean: "생막걸리",
          price: 18.0,
          description: "Traditional Korean rice wine. Lightly sweet, creamy, and gently sparkling",
        },
        {
          title: "Flavored Makgeolli",
          korean: "과일막걸리",
          price: 18.0,
          description: "Choice of Banana or Peach",
        },
      ],
    },
    {
      category: "Premium Bottled Spirits",
      isAlcoholic: true,
      items: [
        {
          title: "Bok Bun Ja",
          korean: "복분자주",
          price: 18.0,
          description: "Sweet Korean fruit wine made from black raspberries. Rich berry aroma with a smooth, naturally sweet finish",
        },
        {
          title: "Jinro Ilpoom",
          korean: "진로일품",
          price: 40.0,
          description: "Premium rice soju made from 100% pure rice. Clean and silky on the palate with gentle, refined flavors and a soft, lingering finish",
        },
        {
          title: "Hwayo 23",
          korean: "화요",
          price: 32.0,
          description: "Craft rice soju produced using vacuum distillation",
        },
        {
          title: "Seoul Night",
          korean: "서울의밤",
          price: 35.0,
          description: "Double-distilled premium spirit made from golden maesil (Korean plum). Cold-filtered for clarity, offering clean plum notes and a dry, elegant finish",
        },
        {
          title: "Won Mae Plum",
          korean: "원매실주",
          price: 35.0,
          description: "Traditional Korean plum liqueur made with golden maesil and local honey. Floral, fruity aromas with subtle sweetness and a smooth, rounded body",
        },
      ],
    },
    {
      category: "Soju (Bottled)",
      isAlcoholic: true,
      items: [
        {
          title: "Jinro Is Back",
          korean: "진로",
          price: 16.0,
          description: "Clean, smooth, lightly sweet",
        },
        {
          title: "Chum Churum",
          korean: "참이슬",
          price: 16.0,
          description: "Very smooth, light, subtly sweet",
        },
        {
          title: "Chamisul Fresh",
          korean: "처음처럼",
          price: 16.0,
          description: "Clean and crisp with light sweetness",
        },
        {
          title: "Flavored Soju",
          korean: "과일소주",
          price: 16.0,
          description: "Choice of peach, apple, yogurt, green grape, and strawberry",
        },
        {
          title: "Saero",
          korean: "새로",
          price: 16.0,
          description: "Clean, dry, minimal sweetness (Zero Sugar)",
        },
      ],
    },
    {
      category: "Tea",
      isAlcoholic: false,
      items: [
        {
          title: "Hot Tea",
          korean: "차",
          price: 4.0,
          description: "Green Tea, Black Tea, Barley Tea, Honey Ginger Tea",
        },
      ],
    },
    {
      category: "Soft Drinks",
      isAlcoholic: false,
      items: [
        {
          title: "Soda",
          korean: "음료수",
          price: 3.0,
          description: "Coke, Diet Coke, Sprite, Fanta, Ginger Ale",
        },
        {
          title: "Juice",
          korean: "주스",
          price: 4.0,
          description: "Orange or Apple Juice",
        },
        {
          title: "Perrier",
          korean: "페리에",
          price: 4.0,
          description: "Sparkling mineral water",
        },
      ],
    },
    {
      category: "Dessert",
      isAlcoholic: false,
      items: [
        {
          title: "Mochi Ice Cream",
          korean: "모찌 아이스크림",
          price: 6.0,
          description: "Choice of strawberry, Vanilla, Green tea",
        },
      ],
    },
  ],
}

export default function MenuPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Food%20pic-AV3xRmPZhqXeBLRXbwbiXc8t73W19i.jpg"
            alt="Mista Oh Menu - Authentic Korean Cuisine"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-balance">Our Menu</h1>
          <p className="text-xl md:text-2xl text-pretty leading-relaxed max-w-2xl mx-auto">
            Authentic Korean flavors crafted with love and tradition
          </p>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 px-4 bg-accent border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <WheatOff className="w-4 h-4 text-amber-700" />
            </div>
            <span className="text-sm font-medium text-foreground">Gluten-Free Option</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-foreground">Vegetarian Option</span>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="lunch" className="w-full">
            <div className="sticky top-20 z-40 bg-background pb-6 -mx-4 px-4 border-b border-border">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-2 gap-3 bg-transparent">
                <TabsTrigger
                  value="lunch"
                  className="text-lg py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg bg-primary-light hover:bg-primary/20 transition-all duration-300 rounded-full font-semibold"
                >
                  Lunch
                </TabsTrigger>
                <TabsTrigger
                  value="dinner"
                  className="text-lg py-4 data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:shadow-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-full font-semibold"
                >
                  Dinner
                </TabsTrigger>
                <TabsTrigger
                  value="drinks"
                  className="text-lg py-4 data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-cyan-50 hover:bg-cyan-100 transition-all duration-300 rounded-full font-semibold"
                >
                  Drinks
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="lunch">
              <div className="text-center mb-14">
                <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Lunch Menu</h2>
                <p className="text-lg text-muted-foreground font-medium">Monday - Saturday: 11 AM - 3 PM</p>
              </div>

              {menuData.lunch.map((category, idx) => (
                <div key={idx} className="mb-20">
                  <h3 className="font-serif text-3xl mb-10 pb-4 border-b-2 border-primary text-foreground">{category.category}</h3>
                  <div className="grid gap-6">
                    {category.items.map((item, itemIdx) => (
                      <MenuItemCard key={itemIdx} item={item} category={`lunch-${category.category}`} accentColor="amber" />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="dinner">
              <div className="text-center mb-14">
                <h2 className="font-serif text-4xl md:text-5xl mb-4 text-secondary">Dinner Menu</h2>
                <p className="text-lg text-muted-foreground font-medium">
                  Monday - Thursday: 3 PM - 10 PM | Friday & Saturday: 3 PM - 11 PM
                </p>
              </div>

              {menuData.dinner.map((category, idx) => (
                <div key={idx} className="mb-20">
                  <h3 className="font-serif text-3xl mb-10 pb-4 border-b-2 border-secondary text-foreground">{category.category}</h3>
                  <div className="grid gap-6">
                    {category.items.map((item, itemIdx) => (
                      <MenuItemCard key={itemIdx} item={item} category={`dinner-${category.category}`} accentColor="rose" />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="drinks">
              <div className="text-center mb-14">
                <h2 className="font-serif text-4xl md:text-5xl mb-4 text-cyan-700">Drink Menu</h2>
                <p className="text-lg text-muted-foreground">Korean spirits, beer, non-alcoholic beverages, and more</p>
              </div>

              {menuData.drinks.map((category, idx) => (
                <div key={idx} className="mb-16">
                  <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-cyan-600">
                    <h3 className="font-serif text-3xl">{category.category}</h3>
                    {category.isAlcoholic ? (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">21+</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Non-Alcoholic</span>
                    )}
                  </div>
                  <div className="grid gap-6">
                    {category.items.map((item, itemIdx) => (
                      <MenuItemCard key={itemIdx} item={item} category={`drinks-${category.category}`} accentColor="cyan" isAlcoholic={category.isAlcoholic} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">Ready to Experience Authentic Korean Cuisine?</h2>
          <p className="text-xl mb-10 leading-relaxed text-white/90">
            Make a reservation today and taste the flavors that have made Mista Oh a Flatiron favorite
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.opentable.com/restref/client/?rid=1144366"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-primary px-8 py-4 rounded-full font-semibold transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              Make a Reservation
            </a>
            <a
              href="tel:6465598858"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              Call (646) 559-8858
            </a>
          </div>
        </div>
      </section>

      <FloatingCart />
      <Footer />
    </div>
  )
}
