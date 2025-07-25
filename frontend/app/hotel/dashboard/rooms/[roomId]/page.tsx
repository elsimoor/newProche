"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Bed, Users, Wifi, Car, Coffee, Tv, Wind, Bath, Calendar, Clock, Settings, Edit } from "lucide-react"

export default function HotelRoomDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string

  // Mock room data - in real app, fetch based on roomId
  const room = {
    id: roomId,
    number: roomId,
    type: roomId === "301" ? "Suite" : roomId === "201" || roomId === "202" ? "Deluxe" : "Standard",
    status: roomId === "102" || roomId === "301" ? "occupied" : roomId === "202" ? "maintenance" : "available",
    guest: roomId === "102" ? "Michael Brown" : roomId === "301" ? "John Smith" : null,
    price: roomId === "301" || roomId === "302" ? 300 : roomId === "201" || roomId === "202" ? 180 : 120,
    capacity: roomId === "301" || roomId === "302" ? 4 : roomId === "201" || roomId === "202" ? 3 : 2,
    floor: Math.floor(Number(roomId) / 100),
    size: roomId === "301" || roomId === "302" ? 60 : roomId === "201" || roomId === "202" ? 35 : 25,
    amenities:
      roomId === "301" || roomId === "302"
        ? ["WiFi", "TV", "AC", "Mini-bar", "Balcony", "Jacuzzi", "Living Room", "Safe", "Bathrobe"]
        : roomId === "201" || roomId === "202"
          ? ["WiFi", "TV", "AC", "Mini-bar", "Balcony", "Safe"]
          : ["WiFi", "TV", "AC", "Mini-bar"],
    images: [
      `/placeholder.svg?height=300&width=400&query=hotel+room+${roomId}`,
      `/placeholder.svg?height=300&width=400&query=hotel+bathroom+${roomId}`,
      `/placeholder.svg?height=300&width=400&query=hotel+balcony+${roomId}`,
    ],
    description:
      roomId === "301" || roomId === "302"
        ? "Suite luxueuse avec salon séparé, jacuzzi privé et vue panoramique sur la ville."
        : roomId === "201" || roomId === "202"
          ? "Chambre deluxe spacieuse avec balcon privé et vue sur le jardin."
          : "Chambre standard confortable avec tous les équipements essentiels.",
    lastCleaned: "2024-03-15 10:00",
    nextMaintenance: "2024-04-01",
    bookingHistory: [
      { guest: "John Smith", checkIn: "2024-03-15", checkOut: "2024-03-18", rating: 5 },
      { guest: "Emma Johnson", checkIn: "2024-03-10", checkOut: "2024-03-12", rating: 4 },
      { guest: "Michael Brown", checkIn: "2024-03-05", checkOut: "2024-03-08", rating: 5 },
    ],
  }

  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "occupied":
        return "Occupée"
      case "maintenance":
        return "Maintenance"
      default:
        return status
    }
  }

  const amenityIcons: { [key: string]: any } = {
    WiFi: Wifi,
    TV: Tv,
    AC: Wind,
    "Mini-bar": Coffee,
    Balcony: Bath,
    Jacuzzi: Bath,
    "Living Room": Bed,
    Safe: Settings,
    Bathrobe: Bath,
    Parking: Car,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chambre {room.number}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-gray-600">
                {room.type} • Étage {room.floor}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(room.status)}`}>
                {getStatusLabel(room.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </button>
          {room.status === "available" && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Réserver</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video">
              <img
                src={room.images[selectedImage] || "/placeholder.svg"}
                alt={`Chambre ${room.number}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex space-x-2">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Vue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: "overview", label: "Aperçu" },
                  { key: "amenities", label: "Équipements" },
                  { key: "history", label: "Historique" },
                  { key: "maintenance", label: "Maintenance" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <p className="text-gray-600">{room.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Superficie: {room.size} m²</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Capacité: {room.capacity} personnes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Dernier nettoyage: {room.lastCleaned}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Prochaine maintenance: {room.nextMaintenance}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "amenities" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Settings
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  {room.bookingHistory.map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.guest}</p>
                        <p className="text-sm text-gray-600">
                          {booking.checkIn} → {booking.checkOut}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 rounded-full ${i < booking.rating ? "bg-yellow-400" : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "maintenance" && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Dernière maintenance</h4>
                    <p className="text-sm text-green-700">Nettoyage complet effectué le {room.lastCleaned}</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Prochaine maintenance programmée</h4>
                    <p className="text-sm text-blue-700">Maintenance préventive prévue le {room.nextMaintenance}</p>
                  </div>
                  <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700">
                    Programmer une maintenance
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Price and Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations tarifaires</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prix par nuit:</span>
                <span className="text-2xl font-bold text-gray-900">${room.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Type de chambre:</span>
                <span className="font-medium text-gray-900">{room.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Statut actuel:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(room.status)}`}>
                  {getStatusLabel(room.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Current Guest */}
          {room.guest && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client actuel</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{room.guest}</p>
                    <p className="text-sm text-gray-600">Séjour en cours</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  Voir le profil client
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                Marquer comme nettoyée
              </button>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700">
                Signaler un problème
              </button>
              <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">
                Changer le statut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
