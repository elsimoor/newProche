"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, User, Phone, Mail, Sparkles } from "lucide-react"

export default function SalonBookingPage() {
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    service: "",
    stylist: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  const services = [
    { id: "haircut", name: "Haircut & Style", duration: 60, price: 65 },
    { id: "color", name: "Hair Color", duration: 120, price: 120 },
    { id: "highlights", name: "Highlights", duration: 150, price: 150 },
    { id: "blowout", name: "Blowout", duration: 45, price: 45 },
    { id: "facial", name: "Facial Treatment", duration: 90, price: 85 },
    { id: "manicure", name: "Manicure", duration: 45, price: 35 },
    { id: "pedicure", name: "Pedicure", duration: 60, price: 45 },
    { id: "massage", name: "Relaxing Massage", duration: 60, price: 80 },
  ]

  const stylists = [
    { id: "sarah", name: "Sarah Johnson", specialty: "Hair Styling & Color" },
    { id: "mike", name: "Mike Davis", specialty: "Men's Cuts & Beard Styling" },
    { id: "emily", name: "Emily Brown", specialty: "Facial Treatments & Skincare" },
    { id: "lisa", name: "Lisa Garcia", specialty: "Nail Art & Manicures" },
  ]

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Appointment booked:", bookingData)
    alert("Appointment request submitted successfully!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setBookingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const selectedService = services.find((s) => s.id === bookingData.service)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-xl text-pink-100">Transform your look with our expert beauty services</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Visit</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                  <select
                    name="service"
                    value={bookingData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price} ({service.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stylist Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Stylist</label>
                  <select
                    name="stylist"
                    value={bookingData.stylist}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a stylist</option>
                    {stylists.map((stylist) => (
                      <option key={stylist.id} value={stylist.id}>
                        {stylist.name} - {stylist.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        name="time"
                        value={bookingData.time}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={bookingData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={bookingData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={bookingData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any special requests, allergies, or preferences..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-pink-700 transition-colors"
                >
                  Book Appointment
                  {selectedService && ` - $${selectedService.price}`}
                </button>
              </form>
            </div>

            {/* Salon Information */}
            <div className="space-y-8">
              {/* Selected Service Details */}
              {selectedService && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium text-gray-900">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium text-gray-900">{selectedService.duration} minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium text-gray-900">${selectedService.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Salon Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Salon Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Opening Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Contact</h4>
                    <p className="text-gray-600">Phone: (555) 123-4567</p>
                    <p className="text-gray-600">Email: appointments@beautysalon.com</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">456 Beauty Boulevard</p>
                    <p className="text-gray-600">Style District, SD 12345</p>
                  </div>
                </div>
              </div>

              {/* Our Services */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Our Services</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-5 w-5 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Hair Services</h4>
                      <p className="text-sm text-gray-600">Cuts, colors, styling, and treatments</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-5 w-5 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Facial Treatments</h4>
                      <p className="text-sm text-gray-600">Deep cleansing, anti-aging, and skincare</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-5 w-5 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Nail Services</h4>
                      <p className="text-sm text-gray-600">Manicures, pedicures, and nail art</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-5 w-5 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Wellness</h4>
                      <p className="text-sm text-gray-600">Relaxing massages and spa treatments</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Policies</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Appointments can be cancelled up to 24 hours in advance</p>
                  <p>• Late arrivals may result in shortened service time</p>
                  <p>• Please arrive 10 minutes early for your appointment</p>
                  <p>• Consultation included with all color services</p>
                  <p>• Please inform us of any allergies or sensitivities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center pb-12">
        <Link href="/" className="text-pink-600 hover:text-pink-500 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
