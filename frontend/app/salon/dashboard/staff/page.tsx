"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Plus, Edit, Trash2, Phone, Mail, Calendar, Clock, User, X, Star } from "lucide-react"

interface StaffMember {
  id: number
  name: string
  role: string
  email: string
  phone: string
  status: string
  hireDate: string
  schedule: string
  hourlyRate: number
  nextShift: string | null
  avatar: string
  specialties: string[]
  rating: number
  totalClients: number
}

export default function SalonStaff() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "Emily Brown",
      role: "Senior Hair Stylist",
      email: "emily.b@salon.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      hireDate: "2021-03-15",
      schedule: "Full-time",
      hourlyRate: 35.0,
      nextShift: "2024-01-16 09:00",
      avatar: "/placeholder.svg?height=50&width=50",
      specialties: ["Hair Cutting", "Hair Coloring", "Styling"],
      rating: 4.9,
      totalClients: 156,
    },
    {
      id: 2,
      name: "Alex Davis",
      role: "Hair Colorist",
      email: "alex.d@salon.com",
      phone: "+1 (555) 234-5678",
      status: "active",
      hireDate: "2022-01-20",
      schedule: "Full-time",
      hourlyRate: 32.0,
      nextShift: "2024-01-16 10:00",
      avatar: "/placeholder.svg?height=50&width=50",
      specialties: ["Hair Coloring", "Highlights", "Balayage"],
      rating: 4.8,
      totalClients: 98,
    },
    {
      id: 3,
      name: "Maria Garcia",
      role: "Esthetician",
      email: "maria.g@salon.com",
      phone: "+1 (555) 345-6789",
      status: "active",
      hireDate: "2021-08-10",
      schedule: "Part-time",
      hourlyRate: 28.0,
      nextShift: "2024-01-16 13:00",
      avatar: "/placeholder.svg?height=50&width=50",
      specialties: ["Facial Treatments", "Skin Care", "Anti-Aging"],
      rating: 4.7,
      totalClients: 87,
    },
    {
      id: 4,
      name: "Nina Lopez",
      role: "Nail Technician",
      email: "nina.l@salon.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      hireDate: "2022-06-05",
      schedule: "Full-time",
      hourlyRate: 25.0,
      nextShift: "2024-01-16 11:00",
      avatar: "/placeholder.svg?height=50&width=50",
      specialties: ["Manicure", "Pedicure", "Nail Art"],
      rating: 4.6,
      totalClients: 124,
    },
    {
      id: 5,
      name: "Sarah Johnson",
      role: "Massage Therapist",
      email: "sarah.j@salon.com",
      phone: "+1 (555) 567-8901",
      status: "on-leave",
      hireDate: "2020-11-15",
      schedule: "Part-time",
      hourlyRate: 30.0,
      nextShift: null,
      avatar: "/placeholder.svg?height=50&width=50",
      specialties: ["Relaxation Massage", "Deep Tissue", "Hot Stone"],
      rating: 4.9,
      totalClients: 203,
    },
    {
      id: 6,
      name: "Tom Wilson",
      role: "Barber",
      email: "tom.w@salon.com",
      phone: "+1 (555) 678-9012",
      status: "active",
      hireDate: "2023-02-01",
      schedule: "Full-time",
      hourlyRate: 27.0,
      nextShift: "2024-01-16 12:00",
      avatar: "/placeholder.svg?height=50&width=50",
      specialties: ["Men's Haircuts", "Beard Trimming", "Shaving"],
      rating: 4.5,
      totalClients: 67,
    },
  ])

  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: "",
    role: "",
    email: "",
    phone: "",
    status: "active",
    hireDate: "",
    schedule: "Full-time",
    hourlyRate: 25.0,
    nextShift: null,
    avatar: "/placeholder.svg?height=50&width=50",
    specialties: [],
    rating: 0,
    totalClients: 0,
  })

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role.toLowerCase().includes(roleFilter.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "on-leave":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "senior hair stylist":
        return "bg-purple-100 text-purple-800"
      case "hair colorist":
        return "bg-blue-100 text-blue-800"
      case "esthetician":
        return "bg-green-100 text-green-800"
      case "nail technician":
        return "bg-pink-100 text-pink-800"
      case "massage therapist":
        return "bg-orange-100 text-orange-800"
      case "barber":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingStaff) {
      setStaff(staff.map((member) => (member.id === editingStaff.id ? { ...member, ...formData } : member)))
    } else {
      const newStaff: StaffMember = {
        id: Date.now(),
        ...(formData as StaffMember),
      }
      setStaff([...staff, newStaff])
    }
    setShowModal(false)
    setEditingStaff(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      status: "active",
      hireDate: "",
      schedule: "Full-time",
      hourlyRate: 25.0,
      nextShift: null,
      avatar: "/placeholder.svg?height=50&width=50",
      specialties: [],
      rating: 0,
      totalClients: 0,
    })
  }

  const handleEdit = (member: StaffMember) => {
    setEditingStaff(member)
    setFormData(member)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaff(staff.filter((member) => member.id !== id))
    }
  }

  const openCreateModal = () => {
    setEditingStaff(null)
    resetForm()
    setShowModal(true)
  }

  const staffStats = {
    total: staff.length,
    active: staff.filter((s) => s.status === "active").length,
    onLeave: staff.filter((s) => s.status === "on-leave").length,
    fullTime: staff.filter((s) => s.schedule === "Full-time").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage your salon team and schedules</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staffStats.total}</p>
            </div>
            <User className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{staffStats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">{staffStats.onLeave}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Full-time</p>
              <p className="text-2xl font-bold text-blue-600">{staffStats.fullTime}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
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
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="stylist">Hair Stylist</option>
              <option value="colorist">Hair Colorist</option>
              <option value="esthetician">Esthetician</option>
              <option value="nail">Nail Technician</option>
              <option value="massage">Massage Therapist</option>
              <option value="barber">Barber</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}
                >
                  {member.status.replace("-", " ")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {member.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {member.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Hired: {member.hireDate}
              </div>
              {member.nextShift && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Next shift: {member.nextShift}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <p className="text-lg font-semibold text-gray-900">{member.rating}</p>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{member.totalClients}</p>
                  <p className="text-xs text-gray-500">Total Clients</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-1">
                {member.specialties.slice(0, 2).map((specialty, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded">
                    {specialty}
                  </span>
                ))}
                {member.specialties.length > 2 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{member.specialties.length - 2} more
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Schedule</p>
                  <p className="font-medium text-gray-900">{member.schedule}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Rate</p>
                  <p className="font-medium text-gray-900">${member.hourlyRate}/hr</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">View Profile</button>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(member)} className="text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(member.id)} className="text-gray-400 hover:text-red-600">
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
              <h2 className="text-xl font-bold text-gray-900">
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    required
                    value={formData.role || ""}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select Role</option>
                    <option value="Senior Hair Stylist">Senior Hair Stylist</option>
                    <option value="Hair Stylist">Hair Stylist</option>
                    <option value="Hair Colorist">Hair Colorist</option>
                    <option value="Esthetician">Esthetician</option>
                    <option value="Nail Technician">Nail Technician</option>
                    <option value="Massage Therapist">Massage Therapist</option>
                    <option value="Barber">Barber</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Manager">Manager</option>
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                  <input
                    type="date"
                    required
                    value={formData.hireDate || ""}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                  <select
                    value={formData.schedule || "Full-time"}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    required
                    value={formData.hourlyRate || 25.0}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number.parseFloat(e.target.value) })}
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
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Shift</label>
                  <input
                    type="datetime-local"
                    value={formData.nextShift || ""}
                    onChange={(e) => setFormData({ ...formData, nextShift: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating || 0}
                    onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Clients</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalClients || 0}
                    onChange={(e) => setFormData({ ...formData, totalClients: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={formData.avatar || ""}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.specialties?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, specialties: e.target.value.split(", ").filter((s) => s.trim()) })
                    }
                    placeholder="Hair Cutting, Hair Coloring, Styling"
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
                  {editingStaff ? "Update" : "Add"} Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {staff
              .filter((s) => s.nextShift && s.status === "active")
              .map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{member.nextShift?.split(" ")[1]}</p>
                    <p className="text-sm text-gray-600">Start time</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
