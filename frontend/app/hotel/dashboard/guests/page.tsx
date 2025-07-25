// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Search, Filter, Phone, Mail, Calendar, MapPin, Plus, Edit, Trash2, X } from "lucide-react"

// interface Guest {
//   id: string
//   name: string
//   email: string
//   phone: string
//   address: string
//   vipStatus: string
//   totalStays: number
//   totalSpent: number
//   lastVisit: string
//   preferences: string[]
//   status: string
//   joinDate: string
// }

// export default function HotelGuests() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [showModal, setShowModal] = useState(false)
//   const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
//   const [guests, setGuests] = useState<Guest[]>([
//     {
//       id: "G001",
//       name: "John Smith",
//       email: "john.smith@email.com",
//       phone: "+1 (555) 123-4567",
//       address: "New York, NY",
//       vipStatus: "Gold",
//       totalStays: 12,
//       totalSpent: 4500,
//       lastVisit: "2024-01-15",
//       preferences: ["Non-smoking", "High floor", "Late checkout"],
//       status: "active",
//       joinDate: "2022-03-15",
//     },
//     {
//       id: "G002",
//       name: "Sarah Johnson",
//       email: "sarah.j@email.com",
//       phone: "+1 (555) 234-5678",
//       address: "Los Angeles, CA",
//       vipStatus: "Silver",
//       totalStays: 8,
//       totalSpent: 2800,
//       lastVisit: "2024-01-10",
//       preferences: ["Ocean view", "Room service", "Gym access"],
//       status: "active",
//       joinDate: "2022-07-20",
//     },
//     {
//       id: "G003",
//       name: "Mike Davis",
//       email: "mike.davis@email.com",
//       phone: "+1 (555) 345-6789",
//       address: "Chicago, IL",
//       vipStatus: "Platinum",
//       totalStays: 25,
//       totalSpent: 12000,
//       lastVisit: "2024-01-08",
//       preferences: ["Suite upgrade", "Business center", "Airport transfer"],
//       status: "active",
//       joinDate: "2021-11-10",
//     },
//   ])

//   const [formData, setFormData] = useState<Partial<Guest>>({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     vipStatus: "Regular",
//     totalStays: 0,
//     totalSpent: 0,
//     lastVisit: "",
//     preferences: [],
//     status: "active",
//   })

//   const [newPreference, setNewPreference] = useState("")

//   const filteredGuests = guests.filter((guest) => {
//     const matchesSearch =
//       guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       guest.id.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || guest.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getVipColor = (status: string) => {
//     switch (status) {
//       case "Platinum":
//         return "bg-purple-100 text-purple-800"
//       case "Gold":
//         return "bg-yellow-100 text-yellow-800"
//       case "Silver":
//         return "bg-gray-100 text-gray-800"
//       default:
//         return "bg-blue-100 text-blue-800"
//     }
//   }

//   const getStatusColor = (status: string) => {
//     return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (editingGuest) {
//       setGuests(guests.map((guest) => (guest.id === editingGuest.id ? { ...guest, ...formData } : guest)))
//     } else {
//       const newGuest: Guest = {
//         id: `G${String(guests.length + 1).padStart(3, "0")}`,
//         joinDate: new Date().toISOString().split("T")[0],
//         ...(formData as Guest),
//       }
//       setGuests([...guests, newGuest])
//     }
//     setShowModal(false)
//     setEditingGuest(null)
//     resetForm()
//   }

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       address: "",
//       vipStatus: "Regular",
//       totalStays: 0,
//       totalSpent: 0,
//       lastVisit: "",
//       preferences: [],
//       status: "active",
//     })
//     setNewPreference("")
//   }

//   const handleEdit = (guest: Guest) => {
//     setEditingGuest(guest)
//     setFormData(guest)
//     setShowModal(true)
//   }

//   const handleDelete = (id: string) => {
//     if (confirm("Are you sure you want to delete this guest?")) {
//       setGuests(guests.filter((guest) => guest.id !== id))
//     }
//   }

//   const addPreference = () => {
//     if (newPreference.trim()) {
//       setFormData({
//         ...formData,
//         preferences: [...(formData.preferences || []), newPreference.trim()],
//       })
//       setNewPreference("")
//     }
//   }

//   const removePreference = (index: number) => {
//     setFormData({
//       ...formData,
//       preferences: formData.preferences?.filter((_, i) => i !== index) || [],
//     })
//   }

//   const openCreateModal = () => {
//     setEditingGuest(null)
//     resetForm()
//     setShowModal(true)
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
//           <p className="text-gray-600">Manage guest profiles and preferences</p>
//         </div>
//         <button
//           onClick={openCreateModal}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add New Guest
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, or guest ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <div className="flex gap-4">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Guests</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//             <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//               <Filter className="h-5 w-5 mr-2" />
//               More Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Guests Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredGuests.map((guest) => (
//           <div
//             key={guest.id}
//             className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                   <span className="text-blue-600 font-semibold text-lg">
//                     {guest.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{guest.name}</h3>
//                   <p className="text-sm text-gray-500">{guest.id}</p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <span
//                   className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVipColor(guest.vipStatus)}`}
//                 >
//                   {guest.vipStatus}
//                 </span>
//                 <span
//                   className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(guest.status)}`}
//                 >
//                   {guest.status}
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center text-sm text-gray-600">
//                 <Mail className="h-4 w-4 mr-2" />
//                 {guest.email}
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Phone className="h-4 w-4 mr-2" />
//                 {guest.phone}
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <MapPin className="h-4 w-4 mr-2" />
//                 {guest.address}
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Calendar className="h-4 w-4 mr-2" />
//                 Last visit: {guest.lastVisit}
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-100">
//               <div className="grid grid-cols-2 gap-4 text-center">
//                 <div>
//                   <p className="text-lg font-semibold text-gray-900">{guest.totalStays}</p>
//                   <p className="text-xs text-gray-500">Total Stays</p>
//                 </div>
//                 <div>
//                   <p className="text-lg font-semibold text-gray-900">${guest.totalSpent}</p>
//                   <p className="text-xs text-gray-500">Total Spent</p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4">
//               <p className="text-sm font-medium text-gray-700 mb-2">Preferences:</p>
//               <div className="flex flex-wrap gap-1">
//                 {guest.preferences.slice(0, 2).map((pref, index) => (
//                   <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
//                     {pref}
//                   </span>
//                 ))}
//                 {guest.preferences.length > 2 && (
//                   <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
//                     +{guest.preferences.length - 2} more
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4 flex justify-between items-center">
//               <button
//                 onClick={() => handleEdit(guest)}
//                 className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//               >
//                 Edit Profile
//               </button>
//               <div className="flex space-x-2">
//                 <button onClick={() => handleEdit(guest)} className="text-blue-600 hover:text-blue-900">
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button onClick={() => handleDelete(guest.id)} className="text-red-600 hover:text-red-900">
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900">{editingGuest ? "Edit Guest" : "Create New Guest"}</h2>
//               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name || ""}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     required
//                     value={formData.email || ""}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                   <input
//                     type="tel"
//                     required
//                     value={formData.phone || ""}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.address || ""}
//                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">VIP Status</label>
//                   <select
//                     value={formData.vipStatus || "Regular"}
//                     onChange={(e) => setFormData({ ...formData, vipStatus: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="Regular">Regular</option>
//                     <option value="Silver">Silver</option>
//                     <option value="Gold">Gold</option>
//                     <option value="Platinum">Platinum</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={formData.status || "active"}
//                     onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Total Stays</label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={formData.totalStays || 0}
//                     onChange={(e) => setFormData({ ...formData, totalStays: Number.parseInt(e.target.value) })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent ($)</label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={formData.totalSpent || 0}
//                     onChange={(e) => setFormData({ ...formData, totalSpent: Number.parseFloat(e.target.value) })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
//                   <input
//                     type="date"
//                     value={formData.lastVisit || ""}
//                     onChange={(e) => setFormData({ ...formData, lastVisit: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Preferences */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
//                 <div className="flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     value={newPreference}
//                     onChange={(e) => setNewPreference(e.target.value)}
//                     placeholder="Add preference..."
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <button
//                     type="button"
//                     onClick={addPreference}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {formData.preferences?.map((pref, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
//                     >
//                       {pref}
//                       <button
//                         type="button"
//                         onClick={() => removePreference(index)}
//                         className="ml-2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                   {editingGuest ? "Update" : "Create"} Guest
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-blue-600">{filteredGuests.length}</p>
//             <p className="text-sm text-gray-600">Total Guests</p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-green-600">
//               {filteredGuests.filter((g) => g.status === "active").length}
//             </p>
//             <p className="text-sm text-gray-600">Active Guests</p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-purple-600">
//               {filteredGuests.filter((g) => g.vipStatus === "Platinum").length}
//             </p>
//             <p className="text-sm text-gray-600">VIP Members</p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-gray-900">
//               ${filteredGuests.reduce((sum, g) => sum + g.totalSpent, 0)}
//             </p>
//             <p className="text-sm text-gray-600">Total Revenue</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// test1



"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Phone, Mail, Calendar, MapPin, Plus, Edit, Trash2, X } from "lucide-react"

import {
  useCreateGuestMutation,
  useDeleteGuestMutation,
  useGuestsQuery,
  useUpdateGuestMutation,
  type Guest,
} from "@/src/graphql/generated"

export default function HotelGuests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const { data, loading, error, refetch } = useGuestsQuery({
    variables: {
      businessId: "60d21b4667d0d8992e610c85", // Example business ID
      businessType: "Hotel",
    },
  })
  const [createGuestMutation] = useCreateGuestMutation()
  const [updateGuestMutation] = useUpdateGuestMutation()
  const [deleteGuestMutation] = useDeleteGuestMutation()

  const guests = data?.guests as Guest[] | undefined

  const [formData, setFormData] = useState<Partial<Guest>>({
    name: "",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    membershipLevel: "Regular",
    preferences: {
      roomType: "",
      bedType: "",
      floor: "",
      seatingPreference: "",
      cuisinePreferences: [],
      dietaryRestrictions: [],
      preferredStylist: "",
      favoriteServices: [],
      allergies: [],
    },
    status: "active",
  })

  const [newPreference, setNewPreference] = useState("")
  const filteredGuests =
    guests?.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || guest.status === statusFilter
      return matchesSearch && matchesStatus
    }) || []

  const getVipColor = (status: string) => {
    switch (status) {
      case "Platinum":
        return "bg-purple-100 text-purple-800"
      case "Gold":
        return "bg-yellow-100 text-yellow-800"
      case "Silver":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const input = {
      businessId: "60d21b4667d0d8992e610c85",
      businessType: "hotel",
      name: formData.name!,
      email: formData.email!,
      phone: formData.phone,
      address: formData.address,
      membershipLevel: formData.membershipLevel,
      preferences: formData.preferences,
      status: formData.status,
    }

    try {
      if (editingGuest) {
        await updateGuestMutation({
          variables: {
            id: editingGuest.id,
            input,
          },
        })
      } else {
        await createGuestMutation({
          variables: {
            input,
          },
        })
      }
      refetch()
      setShowModal(false)
      setEditingGuest(null)
      resetForm()
    } catch (err) {
      console.log(err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: { street: "", city: "", state: "", zipCode: "", country: "" },
      membershipLevel: "Regular",
      preferences: {
        roomType: "",
        bedType: "",
        floor: "",
        seatingPreference: "",
        cuisinePreferences: [],
        dietaryRestrictions: [],
        preferredStylist: "",
        favoriteServices: [],
        allergies: [],
      },
      status: "active",
    })
    setNewPreference("")
  }

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest)
    setFormData(guest)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this guest?")) {
      try {
        await deleteGuestMutation({
          variables: { id },
        })
        refetch()
      } catch (err) {
        console.log(err)
      }
    }
  }

  const addPreference = () => {
    if (newPreference.trim()) {
      const currentPreferences = formData.preferences?.cuisinePreferences || []
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          cuisinePreferences: [...currentPreferences, newPreference.trim()],
        },
      })
      setNewPreference("")
    }
  }

  const removePreference = (index: number) => {
    const currentPreferences = formData.preferences?.cuisinePreferences || []
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        cuisinePreferences: currentPreferences.filter((_, i) => i !== index),
      },
    })
  }

  const openCreateModal = () => {
    setEditingGuest(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
          <p className="text-gray-600">Manage guest profiles and preferences</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Guest
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
                placeholder="Search by name, email, or guest ID..."
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
              <option value="all">All Guests</option>
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

      {/* Guests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {guest.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                  <p className="text-sm text-gray-500">{guest.id}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVipColor(
                    guest.membershipLevel,
                  )}`}
                >
                  {guest.membershipLevel}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    guest.status,
                  )}`}
                >
                  {guest.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {guest.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {guest.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {guest.address?.city}, {guest.address?.country}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Last visit: {guest.lastVisit ? new Date(guest.lastVisit).toLocaleDateString() : "N/A"}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{guest.totalVisits}</p>
                  <p className="text-xs text-gray-500">Total Stays</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">${guest.totalSpent}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preferences:</p>
              <div className="flex flex-wrap gap-1">
                {guest.preferences?.cuisinePreferences?.slice(0, 2).map((pref, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {pref}
                  </span>
                ))}
                {(guest.preferences?.cuisinePreferences?.length ?? 0) > 2 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{(guest.preferences?.cuisinePreferences?.length ?? 0) - 2} more
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleEdit(guest as Guest)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Profile
              </button>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(guest as Guest)} className="text-blue-600 hover:text-blue-900">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(guest.id)} className="text-red-600 hover:text-red-900">
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
              <h2 className="text-xl font-bold text-gray-900">{editingGuest ? "Edit Guest" : "Create New Guest"}</h2>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address?.street || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Level</label>
                  <select
                    value={formData.membershipLevel || "Regular"}
                    onChange={(e) => setFormData({ ...formData, membershipLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder="Add preference..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addPreference}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.preferences?.cuisinePreferences?.map((pref, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {pref}
                      <button
                        type="button"
                        onClick={() => removePreference(index)}
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
                  {editingGuest ? "Update" : "Create"} Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredGuests.length}</p>
            <p className="text-sm text-gray-600">Total Guests</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredGuests.filter((g) => g.status === "active").length}
            </p>
            <p className="text-sm text-gray-600">Active Guests</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {filteredGuests.filter((g) => g.membershipLevel === "Platinum").length}
            </p>
            <p className="text-sm text-gray-600">VIP Members</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              ${filteredGuests.reduce((sum, g) => sum + g.totalSpent, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  )
}
