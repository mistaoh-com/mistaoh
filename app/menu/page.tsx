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
import { menuData } from "@/lib/menu-data"

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
