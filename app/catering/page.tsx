"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Users, Calendar, Phone, Mail, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"

export default function CateringPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    eventType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/catering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventDate: "",
          guestCount: "",
          eventType: "",
          message: "",
        })
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Failed to send inquiry. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Reset status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Clean, minimal design */}
      <section className="pt-40 pb-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#161412]">Catering</h1>
          <p className="text-lg text-[#696969] mb-10">
            Authentic Korean catering for corporate events and private parties in NYC
          </p>
          <a
            href="#request-form"
            className="inline-block bg-[#FF813D] hover:bg-[#e67335] text-white px-10 py-4 rounded-full font-semibold transition-colors text-lg"
          >
            Request Catering
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section id="request-form" className="py-16 px-4 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl mb-6 text-center">Request a Catering Quote</h2>
          <p className="text-center text-muted mb-8">
            Fill out the form below and we'll get back to you within 24 hours
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium mb-2">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  required
                  min="10"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select event type</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="family">Family Gathering</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Additional Details
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your event, dietary restrictions, or any special requests..."
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Submit Catering Request'
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
                <div className="flex items-center justify-center gap-2 font-semibold mb-1">
                  <CheckCircle className="w-5 h-5" />
                  Thank you for your inquiry!
                </div>
                <p className="text-sm">We've received your catering request and will contact you within 24 hours.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
                <p className="font-semibold mb-1">Unable to send your inquiry</p>
                <p className="text-sm">{errorMessage}</p>
                <p className="text-sm mt-2">Please try again or contact us directly at <a href="mailto:mistaohnyc@gmail.com" className="underline font-semibold">mistaohnyc@gmail.com</a></p>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted mb-4">Or contact us directly:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+16465598858" className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="w-5 h-5" />
                +1-646-559-8858
              </a>
              <a href="mailto:mistaohnyc@gmail.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="w-5 h-5" />
                mistaohnyc@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-2xl mb-3">Any Size Event</h3>
              <p className="text-muted">
                From intimate gatherings of 10 to large events of 200+, we've got you covered
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-2xl mb-3">Flexible Planning</h3>
              <p className="text-muted">We work with your schedule and dietary requirements</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-2xl mb-3">Full Service</h3>
              <p className="text-muted">Setup, service, and cleanup - we handle everything</p>
            </div>
          </div>
        </div>
      </section>



      {/* Popular Catering Items */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl mb-12 text-center">Popular Catering Items</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/menu-images/bulgogi-2.jpg"
                  alt="Bulgogi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={65}
                />
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl mb-2">Bulgogi</h4>
                <p className="text-sm text-muted">Marinated beef, a crowd favorite</p>
              </div>
            </div>

            <div className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/menu-images/japchae.jpg"
                  alt="Japchae"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={65}
                />
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl mb-2">Japchae</h4>
                <p className="text-sm text-muted">Stir-fried glass noodles with vegetables</p>
              </div>
            </div>

            <div className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/menu-images/chickenwings.jpg"
                  alt="Korean Fried Chicken"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={65}
                />
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl mb-2">Korean Fried Chicken</h4>
                <p className="text-sm text-muted">Crispy and flavorful</p>
              </div>
            </div>

            <div className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/dolsot-bibimbap-korean-food.jpg"
                  alt="Bibimbap"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={65}
                />
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl mb-2">Bibimbap</h4>
                <p className="text-sm text-muted">Mixed rice bowl with vegetables</p>
              </div>
            </div>

            <div className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/menu-images/pork-dumplings.jpg"
                  alt="Dumplings"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={65}
                />
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl mb-2">Dumplings</h4>
                <p className="text-sm text-muted">Pork, kimchi, or vegetarian options</p>
              </div>
            </div>

            <div className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/korean-bbq-horizontal.jpg"
                  alt="Korean BBQ"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={65}
                />
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl mb-2">Korean BBQ</h4>
                <p className="text-sm text-muted">Grilled meats with traditional sides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
