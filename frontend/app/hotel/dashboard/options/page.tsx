"use client"

import type React from "react"
import { useQuery, useMutation, gql } from "@apollo/client"
import { HotelDocument, UpdateHotelDocument } from "@/src/graphql/generated"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Wifi, Car, Coffee, Dumbbell, Waves, Utensils, X } from "lucide-react"

// Interfaces remain the same for form data structure, but will not be used for main state
interface Service {
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

interface Amenity {
  name: string
  description: string
  included: boolean
  category: string
}

interface Policy {
  title: string
  description: string
  category: string
}

const cleanTypename = (obj: any) => {
  if (!obj) return obj
  const { __typename, ...rest } = obj
  return rest
}

export default function HotelOptions() {
  const [activeTab, setActiveTab] = useState("services")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [modalType, setModalType] = useState<"service" | "amenity" | "policy">("service")
  const [formData, setFormData] = useState<any>({})

  const { data, loading, error, refetch } = useQuery(HotelDocument, {
    variables: { id: "1" },
  })

  const [updateHotel, { loading: updateLoading, error: updateError }] = useMutation(UpdateHotelDocument, {
    onCompleted: () => {
      refetch()
      setShowModal(false)
      setEditingItem(null)
      setFormData({})
    },
    onError: (err) => {
      console.error("Failed to update hotel:", err)
      // Optionally, show a toast notification to the user
    },
  })

  const services = data?.hotel?.services || []
  const amenities = data?.hotel?.amenities || []
  const policies = data?.hotel?.policies || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data?.hotel) return

    const hotelInput = {
      name: data.hotel.name,
      description: data.hotel.description,
      address: cleanTypename(data.hotel.address),
      contact: cleanTypename(data.hotel.contact),
      services: data.hotel.services.map(cleanTypename),
      amenities: data.hotel.amenities.map(cleanTypename),
      policies: data.hotel.policies.map(cleanTypename),
    }

    let updatedList
    switch (modalType) {
      case "service":
        updatedList = [...hotelInput.services]
        break
      case "amenity":
        updatedList = [...hotelInput.amenities]
        break
      case "policy":
        updatedList = [...hotelInput.policies]
        break
    }

    if (editingItem) {
      updatedList[editingItem.index] = { ...updatedList[editingItem.index], ...formData }
    } else {
      updatedList.push(formData)
    }

    switch (modalType) {
      case "service":
        hotelInput.services = updatedList
        break
      case "amenity":
        hotelInput.amenities = updatedList
        break
      case "policy":
        hotelInput.policies = updatedList
        break
    }

    updateHotel({
      variables: {
        id: data.hotel.id,
        input: hotelInput,
      },
    })
  }

  const handleEdit = (item: any, type: "service" | "amenity" | "policy", index: number) => {
    setEditingItem({ ...item, index })
    setFormData(item)
    setModalType(type)
    setShowModal(true)
  }

  const handleDelete = (index: number, type: "service" | "amenity" | "policy") => {
    if (!data?.hotel || !confirm("Are you sure you want to delete this item?")) return

    const hotelInput = {
      name: data.hotel.name,
      description: data.hotel.description,
      address: cleanTypename(data.hotel.address),
      contact: cleanTypename(data.hotel.contact),
      services: data.hotel.services.map(cleanTypename),
      amenities: data.hotel.amenities.map(cleanTypename),
      policies: data.hotel.policies.map(cleanTypename),
    }

    let updatedList
    switch (type) {
      case "service":
        updatedList = [...hotelInput.services]
        break
      case "amenity":
        updatedList = [...hotelInput.amenities]
        break
      case "policy":
        updatedList = [...hotelInput.policies]
        break
    }

    updatedList.splice(index, 1)

    switch (type) {
      case "service":
        hotelInput.services = updatedList
        break
      case "amenity":
        hotelInput.amenities = updatedList
        break
      case "policy":
        hotelInput.policies = updatedList
        break
    }

    updateHotel({
      variables: {
        id: data.hotel.id,
        input: hotelInput,
      },
    })
  }

  const openCreateModal = (type: "service" | "amenity" | "policy") => {
    setEditingItem(null)
    setModalType(type)
    setFormData({})
    setShowModal(true)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading hotel data: {error.message}</p>

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotel Services & Options</h1>
          <p className="text-gray-600">Manage services, amenities, and policies</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "services", label: "Services" },
              { id: "amenities", label: "Amenities" },
              { id: "policies", label: "Policies" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Hotel Services</h2>
                <button
                  onClick={() => openCreateModal("service")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = Utensils // Default icon
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-sm text-gray-500">{service.category}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(service, "service", index)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(index, "service")}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {service.price === 0 ? "Free" : `$${service.price}`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              service.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {service.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Amenities Tab */}
          {activeTab === "amenities" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Room Amenities</h2>
                <button
                  onClick={() => openCreateModal("amenity")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Amenity
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Included Amenities</h3>
                    <div className="space-y-3">
                      {amenities
                        .filter((a) => a.included)
                        .map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <div>
                              <span className="font-medium text-gray-900">{amenity.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({amenity.category})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600 text-sm font-medium">Included</span>
                              <button
                                onClick={() => handleEdit(amenity, "amenity", index)}
                                className="text-gray-400 hover:text-blue-600"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(index, "amenity")}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Premium Amenities</h3>
                    <div className="space-y-3">
                      {amenities
                        .filter((a) => !a.included)
                        .map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <div>
                              <span className="font-medium text-gray-900">{amenity.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({amenity.category})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600 text-sm font-medium">Premium</span>
                              <button
                                onClick={() => handleEdit(amenity, "amenity", index)}
                                className="text-gray-400 hover:text-blue-600"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(index, "amenity")}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === "policies" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Hotel Policies</h2>
                <button
                  onClick={() => openCreateModal("policy")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </button>
              </div>

              <div className="space-y-4">
                {policies.map((policy, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mt-1">
                          {policy.category}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(policy, "policy", index)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index, "policy")}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">{policy.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? `Edit ${modalType}` : `Create New ${modalType}`}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === "service" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ""}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                      <select
                        value={formData.available ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, available: e.target.value === "true" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {modalType === "amenity" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenity Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.included ? "included" : "premium"}
                      onChange={(e) => setFormData({ ...formData, included: e.target.value === "included" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="included">Included</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === "policy" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Policy Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ""}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {editingItem ? "Update" : "Create"} {modalType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
