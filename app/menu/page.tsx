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
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navigation />

      {/* Hero Section - Clean centered design like reference */}
      <section id="main-content" className="pt-40 pb-16 px-4 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#161412]">Our Menu</h1>
          <p className="text-lg text-[#696969] leading-relaxed max-w-xl mx-auto">
            Authentic Korean flavors crafted with love and tradition. Fresh ingredients, time-honored recipes.
          </p>
        </div>
      </section>

      {/* Category Tabs - Pill style like reference */}
      <section className="pb-12 px-4 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="lunch" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="inline-flex gap-3 p-0 bg-transparent h-auto">
                <TabsTrigger
                  value="lunch"
                  className="px-8 py-3 text-base font-medium rounded-full border border-[#e5e5e5] bg-white text-[#161412] data-[state=active]:bg-[#FF813D] data-[state=active]:text-white data-[state=active]:border-[#FF813D] hover:border-[#FF813D] transition-all duration-200"
                >
                  Lunch
                </TabsTrigger>
                <TabsTrigger
                  value="dinner"
                  className="px-8 py-3 text-base font-medium rounded-full border border-[#e5e5e5] bg-white text-[#161412] data-[state=active]:bg-[#FF813D] data-[state=active]:text-white data-[state=active]:border-[#FF813D] hover:border-[#FF813D] transition-all duration-200"
                >
                  Dinner
                </TabsTrigger>
                <TabsTrigger
                  value="drinks"
                  className="px-8 py-3 text-base font-medium rounded-full border border-[#e5e5e5] bg-white text-[#161412] data-[state=active]:bg-[#FF813D] data-[state=active]:text-white data-[state=active]:border-[#FF813D] hover:border-[#FF813D] transition-all duration-200"
                >
                  Drinks
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 flex-wrap mb-12 pb-8 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <WheatOff className="w-4 h-4 text-amber-700" />
                </div>
                <span className="text-sm font-medium text-[#161412]">Gluten-Free Option</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-[#161412]">Vegetarian Option</span>
              </div>
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
