"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Users, Clock, CheckCircle, XCircle, AlertCircle, Plus, Edit, Trash2, X } from "lucide-react"

interface Table {
  id: string
  number: number
  capacity: number
  status: string
  location: string
  currentGuest: string | null
  reservedFor: string | null
  nextReservation: string | null
  seatedAt: string | null
  features: string[]
}

export default function RestaurantTables() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [capacityFilter, setCapacityFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [tables, setTables] = useState<Table[]>([
    {
      id: "T01",
      number: 1,
      capacity: 2,
      status: "available",
      location: "Main Dining",
      currentGuest: null,
      reservedFor: null,
      nextReservation: "19:30",
      seatedAt: null,
      features: ["Window view"],
    },
    {
      id: "T02",
      number: 2,
      capacity: 4,
      status: "occupied",
      location: "Main Dining",
      currentGuest: "Johnson Party",
      reservedFor: null,
      seatedAt: "18:45",
      nextReservation: null,
      features: ["Corner table"],
    },
    {
      id: "T03",
      number: 3,
      capacity: 2,
      status: "reserved",
      location: "Main Dining",
      currentGuest: null,
      reservedFor: "Smith Party - 19:00",
      nextReservation: null,
      seatedAt: null,
      features: ["Quiet area"],
    },
    {
      id: "T04",
      number: 4,
      capacity: 6,
      status: "cleaning",
      location: "Main Dining",
      currentGuest: null,
      reservedFor: null,
      nextReservation: "20:00",
      seatedAt: null,
      features: ["Large table", "Near kitchen"],
    },
    {
      id: "T05",
      number: 5,
      capacity: 4,
      status: "occupied",
      location: "Patio",
      currentGuest: "Davis Party",
      reservedFor: null,
      seatedAt: "19:15",
      nextReservation: null,
      features: ["Outdoor seating", "Garden view"],
    },
    {
      id: "T06",
      number: 6,
      capacity: 2,
      status: "available",
      location: "Bar Area",
      currentGuest: null,
      reservedFor: null,
      nextReservation: null,
      seatedAt: null,
      features: ["Bar seating", "High table"],
    },
    {
      id: "T07",
      number: 7,
      capacity: 8,
      status: "reserved",
      location: "Private Room",
      currentGuest: null,
      reservedFor: "Wilson Party - 20:30",
      nextReservation: null,
      seatedAt: null,
      features: ["Private dining", "Projector available"],
    },
    {
      id: "T08",
      number: 8,
      capacity: 4,
      status: "available",
      location: "Main Dining",
      currentGuest: null,
      reservedFor: null,
      nextReservation: "21:00",
      seatedAt: null,
      features: ["Center table"],
    },
  ])

  const [formData, setFormData] = useState<Partial<Table>>({
    number: 0,
    capacity: 2,
    status: "available",
    location: "Main Dining",
    currentGuest: null,
    reservedFor: null,
    nextReservation: null,
    seatedAt: null,
    features: [],
  })

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.number.toString().includes(searchTerm) ||
      (table.currentGuest && table.currentGuest.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || table.status === statusFilter
    const matchesCapacity =
      capacityFilter === "all" ||
      (capacityFilter === "2" && table.capacity <= 2) ||
      (capacityFilter === "4" && table.capacity <= 4 && table.capacity > 2) ||
      (capacityFilter === "6+" && table.capacity >= 6)
    return matchesSearch && matchesStatus && matchesCapacity
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-blue-100 text-blue-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      case "cleaning":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />
      case "occupied":
        return <Users className="h-4 w-4" />
      case "reserved":
        return <Clock className="h-4 w-4" />
      case "cleaning":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTable) {
      setTables(tables.map((table) => (table.id === editingTable.id ? { ...table, ...formData } : table)))
    } else {
      const newTable: Table = {
        id: `T${String(formData.number).padStart(2, "0")}`,
        ...(formData as Table),
      }
      setTables([...tables, newTable])
    }
    setShowModal(false)
    setEditingTable(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      number: 0,
      capacity: 2,
      status: "available",
      location: "Main Dining",
      currentGuest: null,
      reservedFor: null,
      nextReservation: null,
      seatedAt: null,
      features: [],
    })
  }

  const handleEdit = (table: Table) => {
    setEditingTable(table)
    setFormData(table)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      setTables(tables.filter((table) => table.id !== id))
    }
  }

  const openCreateModal = () => {
    setEditingTable(null)
    resetForm()
    setShowModal(true)
  }

  const tableStats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600">Monitor and manage all restaurant tables</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Table
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900">{tableStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{tableStats.available}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-blue-600">{tableStats.occupied}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-yellow-600">{tableStats.reserved}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
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
                placeholder="Search by table number or guest name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="cleaning">Cleaning</option>
            </select>
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Sizes</option>
              <option value="2">2 seats</option>
              <option value="4">3-4 seats</option>
              <option value="6+">6+ seats</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Table {table.number}</h3>
                <p className="text-sm text-gray-500">{table.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(table.status)}`}
                >
                  {getStatusIcon(table.status)}
                  <span className="ml-1">{table.status}</span>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacity</span>
                <span className="font-medium text-gray-900 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {table.capacity} guests
                </span>
              </div>

              {table.currentGuest && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Current Guest</p>
                  <p className="text-sm text-blue-700">{table.currentGuest}</p>
                  {table.seatedAt && <p className="text-xs text-blue-600">Seated at: {table.seatedAt}</p>}
                </div>
              )}

              {table.reservedFor && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Reserved For</p>
                  <p className="text-sm text-yellow-700">{table.reservedFor}</p>
                </div>
              )}

              {table.nextReservation && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Reservation</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {table.nextReservation}
                  </span>
                </div>
              )}
            </div>

            {table.features.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {table.features.map((feature, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                {table.status === "available" && (
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Seat Guest
                  </button>
                )}
                {table.status === "occupied" && (
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Check Out
                  </button>
                )}
                {table.status === "cleaning" && (
                  <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
                    Mark Clean
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(table)} className="text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(table.id)} className="text-gray-400 hover:text-red-600">
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
              <h2 className="text-xl font-bold text-gray-900">{editingTable ? "Edit Table" : "Create New Table"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.number || ""}
                    onChange={(e) => setFormData({ ...formData, number: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.capacity || 2}
                    onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    required
                    value={formData.location || "Main Dining"}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Main Dining">Main Dining</option>
                    <option value="Patio">Patio</option>
                    <option value="Bar Area">Bar Area</option>
                    <option value="Private Room">Private Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status || "available"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Guest</label>
                  <input
                    type="text"
                    value={formData.currentGuest || ""}
                    onChange={(e) => setFormData({ ...formData, currentGuest: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reserved For</label>
                  <input
                    type="text"
                    value={formData.reservedFor || ""}
                    onChange={(e) => setFormData({ ...formData, reservedFor: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Reservation</label>
                  <input
                    type="time"
                    value={formData.nextReservation || ""}
                    onChange={(e) => setFormData({ ...formData, nextReservation: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seated At</label>
                  <input
                    type="time"
                    value={formData.seatedAt || ""}
                    onChange={(e) => setFormData({ ...formData, seatedAt: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.features?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, features: e.target.value.split(", ").filter((f) => f.trim()) })
                    }
                    placeholder="Window view, Corner table, Quiet area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
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
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  {editingTable ? "Update" : "Create"} Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
