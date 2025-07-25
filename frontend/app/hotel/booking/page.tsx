"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Users, Bed, Wifi, Car, Coffee, Dumbbell, Waves } from "lucide-react"

export default function HotelBookingPage() {
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "standard",
    name: "",
    email: "",
    phone: "",
  })

  const roomTypes = [
    {
      id: "standard",
      name: "Standard Room",
      price: 120,
      description: "Comfortable room with essential amenities",
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Private Bathroom"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "deluxe",
      name: "Deluxe Room",
      price: 180,
      description: "Spacious room with premium amenities",
      amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "City View"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "suite",
      name: "Executive Suite",
      price: 300,
      description: "Luxury suite with separate living area",
      amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Ocean View", "Balcony"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", bookingData)
    alert("Booking request submitted successfully!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const selectedRoom = roomTypes.find((room) => room.id === bookingData.roomType)
  const nights =
    bookingData.checkIn && bookingData.checkOut
      ? Math.ceil(
          (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Book Your Perfect Stay</h1>
            <p className="text-xl text-blue-100">Experience luxury and comfort at our premium hotel</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Reservation</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Check-in/Check-out */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="checkIn"
                        value={bookingData.checkIn}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="checkOut"
                        value={bookingData.checkOut}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <div className="space-y-3">
                    {roomTypes.map((room) => (
                      <label
                        key={room.id}
                        className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="roomType"
                          value={room.id}
                          checked={bookingData.roomType === room.id}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{room.name}</h4>
                              <p className="text-sm text-gray-600">{room.description}</p>
                            </div>
                            <span className="text-lg font-bold text-blue-600">${room.price}/night</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Guest Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Information</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={bookingData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={bookingData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={bookingData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now - ${totalPrice}
                </button>
              </form>
            </div>

            {/* Hotel Information */}
            <div className="space-y-8">
              {/* Selected Room Details */}
              {selectedRoom && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Selected Room</h3>
                  <img
                    src={selectedRoom.image || "/placeholder.svg"}
                    alt={selectedRoom.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-medium text-gray-900 mb-2">{selectedRoom.name}</h4>
                  <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
                  <div className="space-y-2">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                  {nights > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>
                          ${selectedRoom.price} × {nights} nights
                        </span>
                        <span className="font-medium">${totalPrice}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hotel Amenities */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Hotel Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Free Parking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coffee className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Restaurant</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Dumbbell className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Fitness Center</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Waves className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Swimming Pool</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bed className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Room Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center pb-12">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
