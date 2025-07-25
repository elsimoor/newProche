"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Bed, Users, Settings, Plus, Edit, Trash2, X } from "lucide-react"

interface Room {
  id: string
  type: string
  floor: number
  status: string
  guest: string | null
  checkOut: string | null
  price: number
  amenities: string[]
  lastCleaned: string
  condition: string
}

export default function HotelRooms() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [floorFilter, setFloorFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "101",
      type: "Standard",
      floor: 1,
      status: "occupied",
      guest: "John Smith",
      checkOut: "2024-01-18",
      price: 120,
      amenities: ["WiFi", "AC", "TV", "Bathroom"],
      lastCleaned: "2024-01-15",
      condition: "excellent",
    },
    {
      id: "102",
      type: "Standard",
      floor: 1,
      status: "available",
      guest: null,
      checkOut: null,
      price: 120,
      amenities: ["WiFi", "AC", "TV", "Bathroom"],
      lastCleaned: "2024-01-16",
      condition: "good",
    },
    {
      id: "201",
      type: "Deluxe",
      floor: 2,
      status: "maintenance",
      guest: null,
      checkOut: null,
      price: 180,
      amenities: ["WiFi", "AC", "Smart TV", "Mini Bar", "City View"],
      lastCleaned: "2024-01-14",
      condition: "needs_repair",
    },
    {
      id: "202",
      type: "Deluxe",
      floor: 2,
      status: "occupied",
      guest: "Sarah Johnson",
      checkOut: "2024-01-20",
      price: 180,
      amenities: ["WiFi", "AC", "Smart TV", "Mini Bar", "City View"],
      lastCleaned: "2024-01-16",
      condition: "excellent",
    },
    {
      id: "301",
      type: "Suite",
      floor: 3,
      status: "occupied",
      guest: "Mike Davis",
      checkOut: "2024-01-22",
      price: 300,
      amenities: ["WiFi", "AC", "Smart TV", "Mini Bar", "Ocean View", "Balcony"],
      lastCleaned: "2024-01-17",
      condition: "excellent",
    },
    {
      id: "302",
      type: "Suite",
      floor: 3,
      status: "cleaning",
      guest: null,
      checkOut: null,
      price: 300,
      amenities: ["WiFi", "AC", "Smart TV", "Mini Bar", "Ocean View", "Balcony"],
      lastCleaned: "2024-01-17",
      condition: "good",
    },
  ])

  const [formData, setFormData] = useState<Partial<Room>>({
    id: "",
    type: "Standard",
    floor: 1,
    status: "available",
    guest: null,
    checkOut: null,
    price: 120,
    amenities: [],
    lastCleaned: "",
    condition: "excellent",
  })

  const [newAmenity, setNewAmenity] = useState("")

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.id.includes(searchTerm) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter
    return matchesSearch && matchesStatus && matchesFloor
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "cleaning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "needs_repair":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const roomStats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRoom) {
      setRooms(rooms.map((room) => (room.id === editingRoom.id ? { ...room, ...formData } : room)))
    } else {
      const newRoom: Room = {
        ...(formData as Room),
      }
      setRooms([...rooms, newRoom])
    }
    setShowModal(false)
    setEditingRoom(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      id: "",
      type: "Standard",
      floor: 1,
      status: "available",
      guest: null,
      checkOut: null,
      price: 120,
      amenities: [],
      lastCleaned: "",
      condition: "excellent",
    })
    setNewAmenity("")
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setFormData(room)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      setRooms(rooms.filter((room) => room.id !== id))
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), newAmenity.trim()],
      })
      setNewAmenity("")
    }
  }

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities?.filter((_, i) => i !== index) || [],
    })
  }

  const openCreateModal = () => {
    setEditingRoom(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Monitor and manage all hotel rooms</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{roomStats.total}</p>
            </div>
            <Bed className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{roomStats.available}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-blue-600">{roomStats.occupied}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-red-600">{roomStats.maintenance}</p>
            </div>
            <Settings className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by room number, type, or guest name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Cleaning</option>
            </select>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Room {room.id}</h3>
                <p className="text-sm text-gray-500">
                  {room.type} • Floor {room.floor}
                </p>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}
              >
                {room.status}
              </span>
            </div>

            {room.guest && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Current Guest</p>
                <p className="text-sm text-blue-700">{room.guest}</p>
                <p className="text-xs text-blue-600">Check-out: {room.checkOut}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price per night</span>
                <span className="font-semibold text-gray-900">${room.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Condition</span>
                <span className={`text-sm font-medium ${getConditionColor(room.condition)}`}>
                  {room.condition.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last cleaned</span>
                <span className="text-sm text-gray-900">{room.lastCleaned}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
              <div className="flex flex-wrap gap-1">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{room.amenities.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(room)} className="text-blue-600 hover:text-blue-900">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingRoom ? "Edit Room" : "Create New Room"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={formData.id || ""}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    value={formData.type || "Standard"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.floor || 1}
                    onChange={(e) => setFormData({ ...formData, floor: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status || "available"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price || 120}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={formData.condition || "excellent"}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="needs_repair">Needs Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Guest</label>
                  <input
                    type="text"
                    value={formData.guest || ""}
                    onChange={(e) => setFormData({ ...formData, guest: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={formData.checkOut || ""}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Cleaned</label>
                  <input
                    type="date"
                    value={formData.lastCleaned || ""}
                    onChange={(e) => setFormData({ ...formData, lastCleaned: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities?.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
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
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {editingRoom ? "Update" : "Create"} Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
