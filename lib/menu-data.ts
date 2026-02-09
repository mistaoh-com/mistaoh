export interface AddOnOption {
    id: string
    name: string
    price: number
}

export interface MenuItem {
    title: string
    korean: string
    price: number
    vegetarian?: boolean
    glutenFree?: boolean
    spicyLevel?: "mild" | "medium"
    description: string
    image?: string
    notOrderable?: boolean
    // New Add-on Support
    addOns?: {
        title: string
        type: "checkbox" | "radio"
        required?: boolean
        options: AddOnOption[]
    }[]
}

export interface MenuCategory {
    category: string
    isAlcoholic?: boolean
    items: MenuItem[]
}

export interface MenuData {
    lunch: MenuCategory[]
    dinner: MenuCategory[]
    drinks: MenuCategory[]
}

export const menuData: MenuData = {
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
                    image: "/menu-images/japchae.jpg",
                },
                {
                    title: "Mandoo",
                    korean: "만두",
                    price: 10.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Pork or Kimchi dumplings (6 pcs). Vegetarian $9.99. Fried or Steamed",
                    image:
                        "/menu-images/pork-dumplings.jpg",
                    addOns: [
                        {
                            title: "Filling",
                            type: "radio",
                            options: [
                                { id: "pork", name: "Pork", price: 0 },
                                { id: "kimchi", name: "Kimchi", price: 0 },
                                { id: "veg", name: "Vegetarian", price: -1.00 }
                            ]
                        },
                        {
                            title: "Style",
                            type: "radio",
                            options: [
                                { id: "fried", name: "Fried", price: 0 },
                                { id: "steamed", name: "Steamed", price: 0 },
                            ]
                        }
                    ]
                },
                {
                    title: "Fried Calamari",
                    korean: "칼라마리 튀김",
                    price: 16.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Crispy fried squid rings with dipping sauce",
                    image:
                        "/menu-images/fried-calamari.jpg",
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
                        "/menu-images/shrimp-tempura.jpg",
                },
                {
                    title: "Chicken Wings",
                    korean: "치킨윙",
                    price: 15.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Soy-garlic / sweet and spicy / BBQ / Buffalo (7pcs)",
                    image:
                        "/menu-images/chickenwings.jpg",
                    addOns: [
                        {
                            title: "Flavor",
                            type: "radio",
                            options: [
                                { id: "soy-garlic", name: "Soy-Garlic", price: 0 },
                                { id: "sweet-spicy", name: "Sweet & Spicy", price: 0 },
                                { id: "bbq", name: "BBQ", price: 0 },
                                { id: "buffalo", name: "Buffalo", price: 0 }
                            ]
                        }
                    ]
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
                        "/menu-images/bulgogi-kimchi-fries-1.jpg",
                },
                {
                    title: "Veggie Pancake",
                    korean: "파전",
                    price: 14.99,
                    vegetarian: true,
                    glutenFree: false,
                    description: "Savory Korean pancake filled with fresh vegetables",
                    image:
                        "/menu-images/vegetarian-pancakes.png",
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
                        "/menu-images/kimchi-pancakes.jpeg",
                },
                {
                    title: "Seafood Pancake",
                    korean: "해물파전",
                    price: 19.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Crispy Korean pancake loaded with seafood and scallions",
                    image:
                        "/menu-images/dd-seafood-pancake.jpg",
                },
                {
                    title: "Brisket Salad",
                    korean: "차돌샐러드",
                    price: 20.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Mixed greens with tender beef brisket with spicy dressing",
                    image:
                        "/menu-images/brisket-salad.jpg",
                },
                {
                    title: "Teriyaki Chicken Salad",
                    korean: "치킨샐러드",
                    price: 15.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Grilled chicken with teriyaki glaze over fresh greens",
                    image:
                        "/menu-images/teriyaki-chicken-salad.png",
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
                    addOns: [
                        {
                            title: "Protein Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 },
                                { id: "spicy-pork", name: "Spicy Pork", price: 3.00 },
                                { id: "tofu", name: "Tofu", price: 2.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Kimchi Fried Rice",
                    korean: "김치볶음밥",
                    price: 17.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Fried rice with kimchi and vegetables. Add Beef (+$3)",
                    image: "/kimchi-fried-rice-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Teriyaki Chicken",
                    korean: "데리야끼치킨",
                    price: 23.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Grilled chicken glazed with sweet teriyaki sauce, served with rice and salad",
                    image:
                        "/menu-images/teriyaki-chicken.jpg",
                },
                {
                    title: "Vegetable Fried Rice",
                    korean: "야채볶음밥",
                    price: 18.99,
                    vegetarian: true,
                    glutenFree: true,
                    description: "Fried rice with assorted vegetables",
                    image:
                        "/menu-images/vegetarian-fried-rice.png",
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
                    spicyLevel: "mild",
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
                    spicyLevel: "mild",
                    description: "Spicy soft tofu stew with vegetables in a rich broth. Add Beef (+$3), Seafood (+$3), or Vegetarian",
                    image:
                        "/menu-images/soondubu-jjigae.jpg",
                    addOns: [
                        {
                            title: "Options",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 },
                                { id: "seafood", name: "Seafood", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Kimchi Jjigae",
                    korean: "김치찌개",
                    price: 15.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "medium",
                    description: "Spicy kimchi stew with tofu. Add Pork (+$3)",
                    image:
                        "/menu-images/kimchi-jjigae.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "pork", name: "Pork", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Doenjang Jjigae",
                    korean: "된장찌개",
                    price: 15.99,
                    vegetarian: true,
                    glutenFree: false,
                    description: "Korean fermented soybean paste stew with vegetables and tofu. Add Beef (+$3), Seafood (+$3), or Vegetarian",
                    image:
                        "/menu-images/deonjang-jjigae.jpg",
                    addOns: [
                        {
                            title: "Options",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 },
                                { id: "seafood", name: "Seafood", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Budae Jjigae",
                    korean: "부대찌개",
                    price: 21.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Spicy stew with sausage, spam, bean, cream cheese, ramen noodles, and vegetables in spicy broth",
                    image: "/menu-images/budae.jpg",
                },
                {
                    title: "Yukgaejang",
                    korean: "육개장",
                    price: 18.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "medium",
                    description: "Spicy beef soup with vegetables and glass noodles",
                    image:
                        "/menu-images/yukgaejang.jpg",
                },
                {
                    title: "Galbitang",
                    korean: "갈비탕",
                    price: 20.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Beef short rib soup in clear with glass noodles, savory broth",
                    image: "/menu-images/galbitang.jpg",
                },
                {
                    title: "Maeun Tang",
                    korean: "매운탕",
                    price: 26.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Spicy Korean fish (salmon) stew with vegetables in chili broth",
                    image:
                        "/menu-images/maeun-tang.jpg",
                },
                {
                    title: "Korean Kalguksu",
                    korean: "칼국수",
                    price: 16.99,
                    vegetarian: true,
                    glutenFree: false,
                    description: "Light broth with hand-cut wheat noodles and vegetables. Add Seafood (+$3)",
                    image: "/kalguksu-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "seafood", name: "Seafood", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Miso Ramen",
                    korean: "미소 라면",
                    price: 12.00,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Ramen in savory miso broth. Add Bulgogi, boiled egg, chicken, or tofu (+$2.50)",
                    image: "/mista-ramen-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "bulgogi", name: "Bulgogi", price: 2.50 },
                                { id: "egg", name: "Boiled Egg", price: 2.50 },
                                { id: "chicken", name: "Chicken", price: 2.50 },
                                { id: "tofu", name: "Tofu", price: 2.50 }
                            ]
                        }
                    ]
                },
                {
                    title: "Mista Ramen",
                    korean: "미스타 라면",
                    price: 12.00,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Korean Instant ramen. Add Bulgogi, boiled egg, chicken, or tofu (+$2.50)",
                    image: "/miso-ramen-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "bulgogi", name: "Bulgogi", price: 2.50 },
                                { id: "egg", name: "Boiled Egg", price: 2.50 },
                                { id: "chicken", name: "Chicken", price: 2.50 },
                                { id: "tofu", name: "Tofu", price: 2.50 }
                            ]
                        }
                    ]
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
                    spicyLevel: "medium",
                    description: "Chewy rice cakes in sweet and spicy gochujang sauce with melted cheese. Seafood (+$6) Ramen noodles (+$5)",
                    image:
                        "/menu-images/tteokbokki.jpg",
                    addOns: [
                        {
                            title: "Extras",
                            type: "checkbox",
                            options: [
                                { id: "seafood", name: "Seafood", price: 6.00 },
                                { id: "ramen", name: "Ramen Noodles", price: 5.00 }
                            ]
                        }
                    ]
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
                    spicyLevel: "mild",
                    description: "Braised pork belly with aged kimchi",
                    image:
                        "/menu-images/mukeunji-samgyupsal-jjim.jpg",
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
                    image: "/menu-images/bulgogi-2.jpg",
                },
                {
                    title: "Samgyupsal",
                    korean: "삼겹살",
                    price: 28.99,
                    vegetarian: false,
                    glutenFree: true,
                    description: "Grilled pork belly slices, served with lettuce",
                    image:
                        "/menu-images/samgyupsal.jpg",
                },
                {
                    title: "Daeji Galbi",
                    korean: "돼지갈비",
                    price: 32.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Marinated pork shoulders",
                    image:
                        "/menu-images/daeji-galbi.jpg",
                },
                {
                    title: "Spicy Pork",
                    korean: "제육",
                    price: 31.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Spicy marinated pork shoulders with vegetables",
                    image:
                        "/menu-images/spicy-pork.jpg",
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
                    image: "/menu-images/galbi.jpg",
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
                        "/menu-images/ribeye-steak.jpg",
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
                        "/menu-images/dd-mackerel.jpg",
                },
                {
                    title: "Grilled Salmon",
                    korean: "연어구이",
                    price: 24.99,
                    vegetarian: false,
                    glutenFree: true,
                    description: "Fresh salmon fillet grilled with sea salt and lemon",
                    image:
                        "/menu-images/grilled-salmon.jpg",
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
                    spicyLevel: "mild",
                    description: "Spicy stir-fried squid with vegetables. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
                    image:
                        "/menu-images/spicy-squid-set.jpeg",
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
                    spicyLevel: "medium",
                    description: "Thinly sliced pork stir-fried in a spicy gochujang-based sauce. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
                    image:
                        "/menu-images/spicy-pork-set.jpeg",
                },
                {
                    title: "Bulgogi Set",
                    korean: "불고기 세트",
                    price: 20.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Thin sliced marinated ribeye. Lunch Box Set includes Vegetable Dumpling, Salad & Miso Soup",
                    image:
                        "/menu-images/bulgogi-set.jpeg",
                },
                {
                    title: "Gochujang Samgyupsal Set",
                    korean: "고추장 삼겹살 세트",
                    price: 22.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "medium",
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
                    image: "/menu-images/japchae.jpg",
                },
                {
                    title: "Mandoo",
                    korean: "만두",
                    price: 10.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Pork or Kimchi dumplings (6 pcs). Vegetarian $9.99. Fried or Steamed",
                    image:
                        "/menu-images/pork-dumplings.jpg",
                    addOns: [
                        {
                            title: "Filling",
                            type: "radio",
                            options: [
                                { id: "pork", name: "Pork", price: 0 },
                                { id: "kimchi", name: "Kimchi", price: 0 },
                                { id: "veg", name: "Vegetarian", price: -1.00 }
                            ]
                        },
                        {
                            title: "Style",
                            type: "radio",
                            options: [
                                { id: "fried", name: "Fried", price: 0 },
                                { id: "steamed", name: "Steamed", price: 0 },
                            ]
                        }
                    ]
                },
                {
                    title: "Fried Calamari",
                    korean: "칼라마리 튀김",
                    price: 18.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Crispy fried squid rings with dipping sauce",
                    image:
                        "/menu-images/fried-calamari.jpg",
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
                        "/menu-images/shrimp-tempura.jpg",
                },
                {
                    title: "Fried Chicken Wings",
                    korean: "윙",
                    price: 17.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Soy-garlic / sweet and spicy / BBQ / Buffalo (7pcs)",
                    image:
                        "/menu-images/chickenwings.jpg",
                    addOns: [
                        {
                            title: "Flavor",
                            type: "radio",
                            options: [
                                { id: "soy-garlic", name: "Soy-Garlic", price: 0 },
                                { id: "sweet-spicy", name: "Sweet & Spicy", price: 0 },
                                { id: "bbq", name: "BBQ", price: 0 },
                                { id: "buffalo", name: "Buffalo", price: 0 }
                            ]
                        }
                    ]
                },
                {
                    title: "Bulgogi Kimchi Fries",
                    korean: "감자튀김",
                    price: 17.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Crispy fries topped with bulgogi beef, kimchi and cheese curd with spicy mayo",
                    image:
                        "/menu-images/bulgogi-kimchi-fries-1.jpg",
                },
                {
                    title: "Veggie Pancake",
                    korean: "파전",
                    price: 15.99,
                    vegetarian: true,
                    glutenFree: false,
                    description: "Savory Korean pancake filled with fresh vegetables",
                    image:
                        "/menu-images/vegetarian-pancakes.png",
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
                        "/menu-images/kimchi-pancakes.jpeg",
                },
                {
                    title: "Seafood Pancake",
                    korean: "해물파전",
                    price: 21.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Crispy Korean pancake loaded with seafood and scallions",
                    image:
                        "/menu-images/dd-seafood-pancake.jpg",
                },
                {
                    title: "Brisket Salad",
                    korean: "차돌샐러드",
                    price: 20.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Mixed greens with tender beef brisket with spicy dressing",
                    image:
                        "/menu-images/brisket-salad.jpg",
                },
                {
                    title: "Teriyaki Chicken Salad",
                    korean: "치킨샐러드",
                    price: 17.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Grilled chicken with teriyaki glaze over fresh greens",
                    image:
                        "/menu-images/teriyaki-chicken-salad.png",
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
                    addOns: [
                        {
                            title: "Protein Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 },
                                { id: "spicy-pork", name: "Spicy Pork", price: 3.00 },
                                { id: "tofu", name: "Tofu", price: 2.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Kimchi Fried Rice",
                    korean: "김치볶음밥",
                    price: 25.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Fried rice with kimchi and vegetables. Add Beef (+$3)",
                    image: "/kimchi-fried-rice-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Vegetable Fried Rice",
                    korean: "야채볶음밥",
                    price: 18.99,
                    vegetarian: true,
                    glutenFree: true,
                    description: "Fried rice with assorted vegetables",
                    image:
                        "/menu-images/vegetarian-fried-rice.png",
                },
                {
                    title: "Teriyaki Chicken",
                    korean: "데리야끼치킨",
                    price: 28.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Grilled chicken glazed with sweet teriyaki sauce, served with rice and salad",
                    image:
                        "/menu-images/teriyaki-chicken.jpg",
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
                    spicyLevel: "mild",
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
                    spicyLevel: "mild",
                    description: "Spicy soft tofu stew with vegetables in a rich broth. Add Beef (+$3), Seafood (+$3), or Vegetarian",
                    image:
                        "/menu-images/soondubu-jjigae.jpg",
                    addOns: [
                        {
                            title: "Options",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 },
                                { id: "seafood", name: "Seafood", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Kimchi Jjigae",
                    korean: "김치찌개",
                    price: 18.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "medium",
                    description: "Spicy kimchi stew with tofu. Add Pork (+$3)",
                    image:
                        "/menu-images/kimchi-jjigae.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "pork", name: "Pork", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Doenjang Jjigae",
                    korean: "된장찌개",
                    price: 18.99,
                    vegetarian: true,
                    glutenFree: false,
                    description: "Korean fermented soybean paste stew with vegetables and tofu. Add Beef (+$3), Seafood (+$3), or Vegetarian",
                    image:
                        "/menu-images/deonjang-jjigae.jpg",
                    addOns: [
                        {
                            title: "Options",
                            type: "checkbox",
                            options: [
                                { id: "beef", name: "Beef", price: 3.00 },
                                { id: "seafood", name: "Seafood", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Budae Jjigae",
                    korean: "부대찌개",
                    price: 21.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Spicy stew with sausage, spam, bean, cream cheese, ramen noodles, and vegetables in spicy broth",
                    image: "/menu-images/budae.jpg",
                },
                {
                    title: "Yukgaejang",
                    korean: "육개장",
                    price: 22.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "medium",
                    description: "Spicy beef soup with vegetables and glass noodles",
                    image:
                        "/menu-images/yukgaejang.jpg",
                },
                {
                    title: "Galbitang",
                    korean: "갈비탕",
                    price: 22.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Beef short rib soup in clear with glass noodles, savory broth",
                    image: "/menu-images/galbitang.jpg",
                },
                {
                    title: "Maeun Tang",
                    korean: "매운탕",
                    price: 26.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Spicy Korean fish (salmon) stew with vegetables in chili broth",
                    image:
                        "/menu-images/maeun-tang.jpg",
                },
                {
                    title: "Korean Kalguksu",
                    korean: "칼국수",
                    price: 16.99,
                    vegetarian: true,
                    glutenFree: false,
                    description: "Light broth with hand-cut wheat noodles and vegetables. Add Seafood (+$3)",
                    image: "/kalguksu-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "seafood", name: "Seafood", price: 3.00 }
                            ]
                        }
                    ]
                },
                {
                    title: "Miso Ramen",
                    korean: "미소 라면",
                    price: 15.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Ramen in savory miso broth. Add Bulgogi, boiled egg, chicken, or tofu (+$2.50)",
                    image: "/miso-ramen-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "bulgogi", name: "Bulgogi", price: 2.50 },
                                { id: "egg", name: "Boiled Egg", price: 2.50 },
                                { id: "chicken", name: "Chicken", price: 2.50 },
                                { id: "tofu", name: "Tofu", price: 2.50 }
                            ]
                        }
                    ]
                },
                {
                    title: "Mista Ramen",
                    korean: "미스타 라면",
                    price: 15.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Korean Instant ramen. Add Bulgogi, boiled egg, chicken, or tofu (+$2.50)",
                    image: "/miso-ramen-korean-food.jpg",
                    addOns: [
                        {
                            title: "Add-ons",
                            type: "checkbox",
                            options: [
                                { id: "bulgogi", name: "Bulgogi", price: 2.50 },
                                { id: "egg", name: "Boiled Egg", price: 2.50 },
                                { id: "chicken", name: "Chicken", price: 2.50 },
                                { id: "tofu", name: "Tofu", price: 2.50 }
                            ]
                        }
                    ]
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
                    spicyLevel: "medium",
                    description: "Chewy rice cakes in sweet and spicy gochujang sauce with melted cheese. Seafood (+$6) Ramen noodles (+$5)",
                    image:
                        "/menu-images/tteokbokki.jpg",
                    addOns: [
                        {
                            title: "Extras",
                            type: "checkbox",
                            options: [
                                { id: "seafood", name: "Seafood", price: 6.00 },
                                { id: "ramen", name: "Ramen Noodles", price: 5.00 }
                            ]
                        }
                    ]
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
                    spicyLevel: "mild",
                    description: "Braised pork belly with aged kimchi",
                    image:
                        "/menu-images/mukeunji-samgyupsal-jjim.jpg",
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
                    image: "/menu-images/bulgogi-2.jpg",
                },
                {
                    title: "Samgyupsal",
                    korean: "삼겹살",
                    price: 34.99,
                    vegetarian: false,
                    glutenFree: true,
                    description: "Grilled pork belly slices, served with lettuce",
                    image:
                        "/menu-images/samgyupsal.jpg",
                },
                {
                    title: "Daeji Galbi",
                    korean: "돼지갈비",
                    price: 36.99,
                    vegetarian: false,
                    glutenFree: false,
                    description: "Marinated pork shoulders",
                    image:
                        "/menu-images/daeji-galbi.jpg",
                },
                {
                    title: "Spicy Pork",
                    korean: "제육",
                    price: 35.99,
                    vegetarian: false,
                    glutenFree: false,
                    spicyLevel: "mild",
                    description: "Spicy marinated pork shoulders with vegetables",
                    image:
                        "/menu-images/spicy-pork.jpg",
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
                    image: "/menu-images/galbi.jpg",
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
                        "/menu-images/ribeye-steak.jpg",
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
                    glutenFree: true,
                    description: "Whole mackerel grilled with sea salt and lemon",
                    image:
                        "/menu-images/dd-mackerel.jpg",
                },
                {
                    title: "Grilled Salmon",
                    korean: "연어구이",
                    price: 29.99,
                    vegetarian: false,
                    glutenFree: true,
                    description: "Fresh salmon fillet grilled with sea salt and lemon",
                    image:
                        "/menu-images/grilled-salmon.jpg",
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
            category: "Soju",
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
                    addOns: [
                        {
                            title: "Flavor",
                            type: "radio",
                            required: true,
                            options: [
                                { id: "peach", name: "Peach", price: 0 },
                                { id: "apple", name: "Apple", price: 0 },
                                { id: "yogurt", name: "Yogurt", price: 0 },
                                { id: "green-grape", name: "Green Grape", price: 0 },
                                { id: "strawberry", name: "Strawberry", price: 0 }
                            ]
                        }
                    ]
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
                    addOns: [
                        {
                            title: "Tea Selection",
                            type: "radio",
                            required: true,
                            options: [
                                { id: "green-tea", name: "Green Tea", price: 0 },
                                { id: "black-tea", name: "Black Tea", price: 0 },
                                { id: "barley-tea", name: "Barley Tea", price: 0 },
                                { id: "honey-ginger", name: "Honey Ginger Tea", price: 0 }
                            ]
                        }
                    ]
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
                    addOns: [
                        {
                            title: "Soda Selection",
                            type: "radio",
                            required: true,
                            options: [
                                { id: "coke", name: "Coke", price: 0 },
                                { id: "diet-coke", name: "Diet Coke", price: 0 },
                                { id: "sprite", name: "Sprite", price: 0 },
                                { id: "fanta", name: "Fanta", price: 0 },
                                { id: "ginger-ale", name: "Ginger Ale", price: 0 }
                            ]
                        }
                    ]
                },
                {
                    title: "Juice",
                    korean: "주스",
                    price: 4.0,
                    description: "Orange or Apple Juice",
                    addOns: [
                        {
                            title: "Juice Flavor",
                            type: "radio",
                            required: true,
                            options: [
                                { id: "orange", name: "Orange Juice", price: 0 },
                                { id: "apple", name: "Apple Juice", price: 0 }
                            ]
                        }
                    ]
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
                    addOns: [
                        {
                            title: "Flavor",
                            type: "radio",
                            required: true,
                            options: [
                                { id: "strawberry", name: "Strawberry", price: 0 },
                                { id: "vanilla", name: "Vanilla", price: 0 },
                                { id: "green-tea", name: "Green Tea", price: 0 }
                            ]
                        }
                    ]
                },
            ],
        },
    ],
}
