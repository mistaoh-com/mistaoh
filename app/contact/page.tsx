"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
      const response = await fetch('/api/contact', {
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
          subject: "",
          message: "",
        })
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Failed to send message. Please try again.')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Failed to send message. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 px-4 mt-20 bg-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-balance text-foreground">Get in Touch</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our menu, want to make a reservation, or just
            want to say hello, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Address */}
            <div className="bg-card p-8 rounded-2xl text-center shadow-sm border border-border/50">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">Address</h3>
              <p className="text-muted-foreground">
                41 W 24 St
                <br />
                New York, NY 10010
              </p>
              <a
                href="https://maps.google.com/?q=41+W+24+St+New+York+NY+10010"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm mt-3 inline-flex items-center gap-1 font-medium"
              >
                Get Directions →
              </a>
            </div>

            {/* Phone */}
            <div className="bg-card p-8 rounded-2xl text-center shadow-sm border border-border/50">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">Phone</h3>
              <a href="tel:6465598858" className="text-muted-foreground hover:text-primary transition-colors">
                (646) 559-8858
              </a>
              <p className="text-sm text-muted-foreground mt-3">Call for reservations or inquiries</p>
            </div>

            {/* Email */}
            <div className="bg-card p-8 rounded-2xl text-center shadow-sm border border-border/50">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">Email</h3>
              <a href="mailto:mistaohnyc@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                mistaohnyc@gmail.com
              </a>
              <p className="text-sm text-muted-foreground mt-3">We'll respond within 24 hours</p>
            </div>

            {/* Hours */}
            <div className="bg-card p-8 rounded-2xl text-center shadow-sm border border-border/50">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">Hours</h3>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Lunch</p>
                <p>Mon-Sat: 11 AM - 3 PM</p>
                <p className="font-semibold text-foreground mt-2">Dinner</p>
                <p>Mon-Thu: 3 PM - 10 PM</p>
                <p>Fri-Sat: 3 PM - 11 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 px-4 bg-accent">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-4xl mb-8 text-foreground">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-foreground">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                  >
                    <option value="">Select a subject</option>
                    <option value="reservation">Reservation Inquiry</option>
                    <option value="catering">Catering Inquiry</option>
                    <option value="menu">Menu Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-5 py-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-200 rounded-xl text-green-800">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="font-medium">Thanks—your message was sent. We'll get back to you within 24 hours.</p>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    <p className="font-medium">{errorMessage}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-serif text-4xl mb-8 text-foreground">Find Us</h2>
              <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
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

              <div className="mt-8 p-8 bg-card rounded-2xl shadow-sm border border-border/50">
                <h3 className="font-serif text-2xl mb-5 text-foreground">Getting Here</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">Subway:</span> N, R, W, F, M to 23rd Street
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Bus:</span> M1, M2, M3, M5, M7, M55
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Parking:</span> Street parking and nearby garages
                    available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl mb-14 text-center text-foreground">Frequently Asked Questions</h2>

          <div className="space-y-5">
            <div className="bg-card p-7 rounded-2xl shadow-sm border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Do you take reservations?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! We highly recommend making a reservation, especially for dinner and weekends. You can book online
                or call us at (646) 559-8858.
              </p>
            </div>

            <div className="bg-card p-7 rounded-2xl shadow-sm border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Do you offer vegetarian options?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We have several vegetarian dishes marked on our menu. Please let us know about any dietary restrictions
                and we'll be happy to accommodate.
              </p>
            </div>

            <div className="bg-card p-7 rounded-2xl shadow-sm border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Is parking available?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Street parking is available in the area, and there are several parking garages within walking distance.
                We're also easily accessible by subway.
              </p>
            </div>

            <div className="bg-card p-7 rounded-2xl shadow-sm border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Do you offer catering services?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! We offer catering for events of all sizes. Visit our catering page or contact us directly to
                discuss your needs.
              </p>
            </div>

            <div className="bg-card p-7 rounded-2xl shadow-sm border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground">What payment methods do you accept?</h3>
              <p className="text-muted-foreground leading-relaxed">We accept all major credit cards, debit cards, and cash.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

