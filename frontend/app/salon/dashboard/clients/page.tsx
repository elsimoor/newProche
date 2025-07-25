"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Phone, Mail, Calendar, MapPin, Plus, Edit, Trash2, X } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  membershipLevel: string
  totalVisits: number
  totalSpent: number
  lastVisit: string
  favoriteServices: string[]
  preferredStylist: string
  status: string
  joinDate: string
  notes: string
}

export default function SalonClients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([
    {
      id: "C001",
      name: "Sarah Wilson",
      email: "sarah.w@email.com",
      phone: "+1 (555) 123-4567",
      address: "New York, NY",
      membershipLevel: "VIP",
      totalVisits: 24,
      totalSpent: 2400,
      lastVisit: "2024-01-10",
      favoriteServices: ["Hair Cut & Style", "Hair Color"],
      preferredStylist: "Emily Brown",
      status: "active",
      joinDate: "2022-03-15",
      notes: "Prefers natural hair colors",
    },
    {
      id: "C002",
      name: "Mike Johnson",
      email: "mike.j@email.com",
      phone: "+1 (555) 234-5678",
      address: "Los Angeles, CA",
      membershipLevel: "Regular",
      totalVisits: 8,
      totalSpent: 320,
      lastVisit: "2024-01-08",
      favoriteServices: ["Beard Trim", "Hair Cut"],
      preferredStylist: "Alex Davis",
      status: "active",
      joinDate: "2023-07-20",
      notes: "Comes in monthly for maintenance",
    },
    {
      id: "C003",
      name: "Lisa Davis",
      email: "lisa.d@email.com",
      phone: "+1 (555) 345-6789",
      address: "Chicago, IL",
      membershipLevel: "Premium",
      totalVisits: 18,
      totalSpent: 1800,
      lastVisit: "2024-01-05",
      favoriteServices: ["Facial Treatment", "Massage"],
      preferredStylist: "Maria Garcia",
      status: "active",
      joinDate: "2022-11-10",
      notes: "Has sensitive skin, uses organic products only",
    },
    {
      id: "C004",
      name: "Tom Brown",
      email: "tom.b@email.com",
      phone: "+1 (555) 456-7890",
      address: "Miami, FL",
      membershipLevel: "Regular",
      totalVisits: 5,
      totalSpent: 175,
      lastVisit: "2023-12-20",
      favoriteServices: ["Manicure"],
      preferredStylist: "Nina Lopez",
      status: "inactive",
      joinDate: "2023-08-05",
      notes: "Travels frequently, irregular schedule",
    },
    {
      id: "C005",
      name: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "+1 (555) 567-8901",
      address: "Seattle, WA",
      membershipLevel: "VIP",
      totalVisits: 32,
      totalSpent: 4200,
      lastVisit: "2024-01-12",
      favoriteServices: ["Hair Color", "Highlights", "Blowout"],
      preferredStylist: "Emily Brown",
      status: "active",
      joinDate: "2021-01-30",
      notes: "Long-term client, very loyal",
    },
  ])

  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipLevel: "Regular",
    totalVisits: 0,
    totalSpent: 0,
    lastVisit: "",
    favoriteServices: [],
    preferredStylist: "",
    status: "active",
    joinDate: "",
    notes: "",
  })

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "VIP":
        return "bg-purple-100 text-purple-800"
      case "Premium":
        return "bg-yellow-100 text-yellow-800"
      case "Regular":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClient) {
      setClients(clients.map((client) => (client.id === editingClient.id ? { ...client, ...formData } : client)))
    } else {
      const newClient: Client = {
        id: `C${String(clients.length + 1).padStart(3, "0")}`,
        ...(formData as Client),
      }
      setClients([...clients, newClient])
    }
    setShowModal(false)
    setEditingClient(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      membershipLevel: "Regular",
      totalVisits: 0,
      totalSpent: 0,
      lastVisit: "",
      favoriteServices: [],
      preferredStylist: "",
      status: "active",
      joinDate: "",
      notes: "",
    })
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData(client)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((client) => client.id !== id))
    }
  }

  const openCreateModal = () => {
    setEditingClient(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage client profiles and preferences</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or client ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Clients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-semibold text-lg">
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.id}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMembershipColor(client.membershipLevel)}`}
                >
                  {client.membershipLevel}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}
                >
                  {client.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {client.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {client.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {client.address}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Last visit: {client.lastVisit}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{client.totalVisits}</p>
                  <p className="text-xs text-gray-500">Total Visits</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">${client.totalSpent}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Favorite Services:</p>
              <div className="flex flex-wrap gap-1">
                {client.favoriteServices.slice(0, 2).map((service, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {service}
                  </span>
                ))}
                {client.favoriteServices.length > 2 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{client.favoriteServices.length - 2} more
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Preferred Stylist:</p>
              <p className="text-sm text-gray-600">{client.preferredStylist}</p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">View Profile</button>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(client)} className="text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(client.id)} className="text-gray-400 hover:text-red-600">
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
              <h2 className="text-xl font-bold text-gray-900">{editingClient ? "Edit Client" : "Add New Client"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Level</label>
                  <select
                    value={formData.membershipLevel || "Regular"}
                    onChange={(e) => setFormData({ ...formData, membershipLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Stylist</label>
                  <select
                    value={formData.preferredStylist || ""}
                    onChange={(e) => setFormData({ ...formData, preferredStylist: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select Stylist</option>
                    <option value="Emily Brown">Emily Brown</option>
                    <option value="Alex Davis">Alex Davis</option>
                    <option value="Maria Garcia">Maria Garcia</option>
                    <option value="Nina Lopez">Nina Lopez</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Tom Wilson">Tom Wilson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    required
                    value={formData.joinDate || ""}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                  <input
                    type="date"
                    value={formData.lastVisit || ""}
                    onChange={(e) => setFormData({ ...formData, lastVisit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Visits</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalVisits || 0}
                    onChange={(e) => setFormData({ ...formData, totalVisits: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalSpent || 0}
                    onChange={(e) => setFormData({ ...formData, totalSpent: Number.parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Favorite Services (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.favoriteServices?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, favoriteServices: e.target.value.split(", ").filter((s) => s.trim()) })
                    }
                    placeholder="Hair Cut, Hair Color, Facial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
                  {editingClient ? "Update" : "Add"} Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">{clients.length}</p>
            <p className="text-sm text-gray-600">Total Clients</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{clients.filter((c) => c.status === "active").length}</p>
            <p className="text-sm text-gray-600">Active Clients</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {clients.filter((c) => c.membershipLevel === "VIP").length}
            </p>
            <p className="text-sm text-gray-600">VIP Members</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  )
}
