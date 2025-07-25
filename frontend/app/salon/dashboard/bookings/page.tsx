"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, Calendar, Clock, Phone, Mail, Plus, Edit, Trash2, X, Eye } from "lucide-react"

interface Booking {
  id: string
  client: string
  email: string
  phone: string
  service: string
  stylist: string
  date: string
  time: string
  duration: number
  price: number
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
  notes: string
  created: string
  paymentStatus: "pending" | "paid" | "refunded"
  reminderSent: boolean
}

export default function SalonBookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "APT001",
      client: "Sarah Wilson",
      email: "sarah.w@email.com",
      phone: "+1 (555) 123-4567",
      service: "Hair Cut & Style",
      stylist: "Emily Brown",
      date: "2024-01-15",
      time: "09:00",
      duration: 60,
      price: 65,
      status: "confirmed",
      notes: "First time client, prefers shorter styles",
      created: "2024-01-10",
      paymentStatus: "paid",
      reminderSent: true,
    },
    {
      id: "APT002",
      client: "Mike Johnson",
      email: "mike.j@email.com",
      phone: "+1 (555) 234-5678",
      service: "Beard Trim",
      stylist: "Alex Davis",
      date: "2024-01-15",
      time: "10:30",
      duration: 30,
      price: 25,
      status: "in-progress",
      notes: "Regular client, likes it neat and professional",
      created: "2024-01-12",
      paymentStatus: "pending",
      reminderSent: true,
    },
    {
      id: "APT003",
      client: "Lisa Davis",
      email: "lisa.d@email.com",
      phone: "+1 (555) 345-6789",
      service: "Facial Treatment",
      stylist: "Maria Garcia",
      date: "2024-01-15",
      time: "11:00",
      duration: 90,
      price: 85,
      status: "confirmed",
      notes: "Sensitive skin, avoid harsh products",
      created: "2024-01-08",
      paymentStatus: "paid",
      reminderSent: false,
    },
    {
      id: "APT004",
      client: "Jennifer Smith",
      email: "jen.smith@email.com",
      phone: "+1 (555) 456-7890",
      service: "Hair Color & Highlights",
      stylist: "Nina Lopez",
      date: "2024-01-16",
      time: "14:00",
      duration: 180,
      price: 150,
      status: "pending",
      notes: "Wants to go from brunette to blonde",
      created: "2024-01-13",
      paymentStatus: "pending",
      reminderSent: false,
    },
  ])

  const [formData, setFormData] = useState<Partial<Booking>>({
    client: "",
    email: "",
    phone: "",
    service: "",
    stylist: "",
    date: "",
    time: "",
    duration: 60,
    price: 0,
    status: "pending",
    notes: "",
    paymentStatus: "pending",
    reminderSent: false,
  })

  const services = [
    { name: "Hair Cut & Style", duration: 60, price: 65 },
    { name: "Hair Color", duration: 120, price: 95 },
    { name: "Highlights", duration: 150, price: 120 },
    { name: "Hair Color & Highlights", duration: 180, price: 150 },
    { name: "Facial Treatment", duration: 90, price: 85 },
    { name: "Manicure", duration: 45, price: 35 },
    { name: "Pedicure", duration: 60, price: 45 },
    { name: "Massage", duration: 60, price: 80 },
    { name: "Beard Trim", duration: 30, price: 25 },
    { name: "Eyebrow Shaping", duration: 30, price: 30 },
  ]

  const stylists = [
    "Emily Brown",
    "Alex Davis",
    "Maria Garcia",
    "Nina Lopez",
    "Sarah Johnson",
    "David Wilson",
    "Jessica Lee",
  ]

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.stylist.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    let matchesDate = true
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

    if (dateFilter === "today") {
      matchesDate = booking.date === today
    } else if (dateFilter === "tomorrow") {
      matchesDate = booking.date === tomorrow
    } else if (dateFilter === "week") {
      const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
      matchesDate = booking.date >= today && booking.date <= weekFromNow
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "refunded":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const handleServiceChange = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName)
    if (service) {
      setFormData({
        ...formData,
        service: serviceName,
        duration: service.duration,
        price: service.price,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBooking) {
      setBookings(
        bookings.map((booking) =>
          booking.id === editingBooking.id ? ({ ...booking, ...formData } as Booking) : booking,
        ),
      )
    } else {
      const newBooking: Booking = {
        id: `APT${String(bookings.length + 1).padStart(3, "0")}`,
        created: new Date().toISOString().split("T")[0],
        ...(formData as Booking),
      }
      setBookings([...bookings, newBooking])
    }
    setShowModal(false)
    setEditingBooking(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      client: "",
      email: "",
      phone: "",
      service: "",
      stylist: "",
      date: "",
      time: "",
      duration: 60,
      price: 0,
      status: "pending",
      notes: "",
      paymentStatus: "pending",
      reminderSent: false,
    })
  }

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking)
    setFormData(booking)
    setShowModal(true)
  }

  const handleView = (booking: Booking) => {
    setViewingBooking(booking)
    setShowViewModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setBookings(bookings.filter((booking) => booking.id !== id))
    }
  }

  const handleStatusChange = (id: string, newStatus: Booking["status"]) => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: newStatus } : booking)))
  }

  const handlePaymentStatusChange = (id: string, newPaymentStatus: Booking["paymentStatus"]) => {
    setBookings(
      bookings.map((booking) => (booking.id === id ? { ...booking, paymentStatus: newPaymentStatus } : booking)),
    )
  }

  const sendReminder = (id: string) => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, reminderSent: true } : booking)))
    alert("Reminder sent successfully!")
  }

  const openCreateModal = () => {
    setEditingBooking(null)
    resetForm()
    setShowModal(true)
  }

  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.status === "confirmed").length,
    inProgress: filteredBookings.filter((b) => b.status === "in-progress").length,
    completed: filteredBookings.filter((b) => b.status === "completed").length,
    revenue: filteredBookings.reduce((sum, b) => sum + (b.paymentStatus === "paid" ? b.price : 0), 0),
    pending: filteredBookings.filter((b) => b.paymentStatus === "pending").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage all salon appointments and bookings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">${stats.revenue}</p>
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending Payment</p>
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
                placeholder="Search by client name, service, stylist, or appointment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This Week</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stylist
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                      <div className="text-sm text-gray-500">Created: {booking.created}</div>
                      {!booking.reminderSent && (
                        <button
                          onClick={() => sendReminder(booking.id)}
                          className="text-xs text-pink-600 hover:text-pink-800 mt-1"
                        >
                          Send Reminder
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.client}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {booking.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {booking.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.service}</div>
                      <div className="text-sm text-gray-500">{booking.duration} minutes</div>
                      <div className="text-sm font-medium text-gray-900">${booking.price}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {booking.date}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {booking.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.stylist}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking["status"])}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(booking.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusChange(booking.id, e.target.value as Booking["paymentStatus"])
                      }
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getPaymentStatusColor(booking.paymentStatus)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(booking)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(booking)}
                        className="text-pink-600 hover:text-pink-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBooking ? "Edit Appointment" : "Create New Appointment"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.client || ""}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                  <select
                    required
                    value={formData.service || ""}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                      <option key={service.name} value={service.name}>
                        {service.name} - ${service.price} ({service.duration}min)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stylist *</label>
                  <select
                    required
                    value={formData.stylist || ""}
                    onChange={(e) => setFormData({ ...formData, stylist: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select Stylist</option>
                    {stylists.map((stylist) => (
                      <option key={stylist} value={stylist}>
                        {stylist}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.time || ""}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration || 60}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status || "pending"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Booking["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus || "pending"}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentStatus: e.target.value as Booking["paymentStatus"] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Any special requests or notes..."
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
                  {editingBooking ? "Update" : "Create"} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Appointment ID</label>
                  <p className="text-lg font-semibold">{viewingBooking.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-lg">{viewingBooking.created}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg">{viewingBooking.client}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{viewingBooking.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-lg">{viewingBooking.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Service</label>
                    <p className="text-lg">{viewingBooking.service}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Stylist</label>
                    <p className="text-lg">{viewingBooking.stylist}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date</label>
                    <p className="text-lg">{viewingBooking.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Time</label>
                    <p className="text-lg">{viewingBooking.time}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-lg">{viewingBooking.duration} minutes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Price</label>
                    <p className="text-lg font-semibold">${viewingBooking.price}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Status Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Appointment Status</label>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewingBooking.status)}`}
                    >
                      {viewingBooking.status.replace("-", " ")}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Payment Status</label>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(viewingBooking.paymentStatus)}`}
                    >
                      {viewingBooking.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Reminder</label>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${viewingBooking.reminderSent ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {viewingBooking.reminderSent ? "Sent" : "Not Sent"}
                    </span>
                  </div>
                </div>
              </div>

              {viewingBooking.notes && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{viewingBooking.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleEdit(viewingBooking)
                }}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Edit Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
