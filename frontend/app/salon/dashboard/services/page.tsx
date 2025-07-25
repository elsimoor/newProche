"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Clock, DollarSign, Star, Plus, Edit, Trash2, X, Scissors } from "lucide-react"

interface Service {
  id: number
  name: string
  category: string
  description: string
  duration: number
  price: number
  available: boolean
  popular: boolean
  staffRequired: string[]
  image: string
}

export default function SalonServices() {
  const [activeCategory, setActiveCategory] = useState("hair")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const categories = [
    { id: "hair", name: "Hair Services", count: 12 },
    { id: "nails", name: "Nail Services", count: 8 },
    { id: "facial", name: "Facial & Skin", count: 6 },
    { id: "massage", name: "Massage", count: 4 },
    { id: "packages", name: "Packages", count: 3 },
  ]

  const [services, setServices] = useState<Record<string, Service[]>>({
    hair: [
      {
        id: 1,
        name: "Hair Cut & Style",
        category: "hair",
        description: "Professional haircut with styling",
        duration: 60,
        price: 65,
        available: true,
        popular: true,
        staffRequired: ["Hair Stylist"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Hair Color",
        category: "hair",
        description: "Full hair coloring service",
        duration: 120,
        price: 120,
        available: true,
        popular: true,
        staffRequired: ["Hair Colorist"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: "Highlights",
        category: "hair",
        description: "Hair highlighting service",
        duration: 90,
        price: 95,
        available: true,
        popular: false,
        staffRequired: ["Hair Colorist"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        name: "Blowout",
        category: "hair",
        description: "Professional hair blowout and styling",
        duration: 45,
        price: 45,
        available: true,
        popular: true,
        staffRequired: ["Hair Stylist"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    nails: [
      {
        id: 5,
        name: "Manicure",
        category: "nails",
        description: "Classic manicure with polish",
        duration: 45,
        price: 35,
        available: true,
        popular: true,
        staffRequired: ["Nail Technician"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        name: "Pedicure",
        category: "nails",
        description: "Relaxing pedicure with foot massage",
        duration: 60,
        price: 45,
        available: true,
        popular: true,
        staffRequired: ["Nail Technician"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 7,
        name: "Gel Nails",
        category: "nails",
        description: "Long-lasting gel nail application",
        duration: 75,
        price: 55,
        available: true,
        popular: false,
        staffRequired: ["Nail Technician"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    facial: [
      {
        id: 8,
        name: "Classic Facial",
        category: "facial",
        description: "Deep cleansing and moisturizing facial",
        duration: 60,
        price: 75,
        available: true,
        popular: true,
        staffRequired: ["Esthetician"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 9,
        name: "Anti-Aging Facial",
        category: "facial",
        description: "Advanced anti-aging treatment",
        duration: 90,
        price: 120,
        available: true,
        popular: false,
        staffRequired: ["Esthetician"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    massage: [
      {
        id: 10,
        name: "Relaxation Massage",
        category: "massage",
        description: "Full body relaxation massage",
        duration: 60,
        price: 85,
        available: true,
        popular: true,
        staffRequired: ["Massage Therapist"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 11,
        name: "Deep Tissue Massage",
        category: "massage",
        description: "Therapeutic deep tissue massage",
        duration: 90,
        price: 110,
        available: true,
        popular: false,
        staffRequired: ["Massage Therapist"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    packages: [
      {
        id: 12,
        name: "Bridal Package",
        category: "packages",
        description: "Complete bridal beauty package",
        duration: 240,
        price: 350,
        available: true,
        popular: true,
        staffRequired: ["Hair Stylist", "Makeup Artist", "Nail Technician"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  })

  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    category: activeCategory,
    description: "",
    duration: 60,
    price: 0,
    available: true,
    popular: false,
    staffRequired: [],
    image: "/placeholder.svg?height=100&width=100",
  })

  const currentServices = services[activeCategory as keyof typeof services] || []
  const filteredServices = currentServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService) {
      setServices((prev) => ({
        ...prev,
        [activeCategory]: prev[activeCategory].map((service) =>
          service.id === editingService.id ? { ...service, ...formData } : service,
        ),
      }))
    } else {
      const newService: Service = {
        id: Date.now(),
        ...(formData as Service),
      }
      setServices((prev) => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], newService],
      }))
    }
    setShowModal(false)
    setEditingService(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: activeCategory,
      description: "",
      duration: 60,
      price: 0,
      available: true,
      popular: false,
      staffRequired: [],
      image: "/placeholder.svg?height=100&width=100",
    })
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData(service)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter((service) => service.id !== id),
      }))
    }
  }

  const openCreateModal = () => {
    setEditingService(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Manage your salon services and pricing</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
              Export Services
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? "bg-pink-100 text-pink-700 border border-pink-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">{services[category.id]?.length || 0}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {activeCategory.replace("_", " ")} Services ({filteredServices.length} services)
                </h3>
                <button
                  onClick={openCreateModal}
                  className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                  Add Service
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                              {service.popular && (
                                <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleEdit(service)} className="text-gray-400 hover:text-blue-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="font-semibold text-gray-900">${service.price}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.duration} min
                            </div>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              service.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {service.available ? "Available" : "Unavailable"}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Staff Required:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.staffRequired.map((staff, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded"
                              >
                                {staff}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Scissors className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Start by adding your first service"}
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Add Service
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingService ? "Edit Service" : "Create New Service"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={formData.category || activeCategory}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="hair">Hair Services</option>
                    <option value="nails">Nail Services</option>
                    <option value="facial">Facial & Skin</option>
                    <option value="massage">Massage</option>
                    <option value="packages">Packages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    required
                    value={formData.duration || 60}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Required (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.staffRequired?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, staffRequired: e.target.value.split(", ").filter((s) => s.trim()) })
                    }
                    placeholder="Hair Stylist, Nail Technician"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available || false}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="mr-2"
                    />
                    Available
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.popular || false}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="mr-2"
                    />
                    Popular Service
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
                  {editingService ? "Update" : "Create"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">{Object.values(services).flat().length}</p>
            <p className="text-sm text-gray-600">Total Services</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {
                Object.values(services)
                  .flat()
                  .filter((service) => service.available).length
              }
            </p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {
                Object.values(services)
                  .flat()
                  .filter((service) => service.popular).length
              }
            </p>
            <p className="text-sm text-gray-600">Popular Services</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              $
              {(
                Object.values(services)
                  .flat()
                  .reduce((sum, service) => sum + service.price, 0) / Object.values(services).flat().length
              ).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Avg. Price</p>
          </div>
        </div>
      </div>
    </div>
  )
}
