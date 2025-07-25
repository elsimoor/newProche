// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { Search, Filter, Calendar, Users, Phone, Mail, Plus, Edit, Trash2, X } from "lucide-react"
// import { useCreateReservationMutation, useReservationsQuery } from "@/src/graphql/generated"

// const formatDate = (d?: string | null) =>
//   d ? new Date(d).toLocaleDateString() : "";

// interface Reservation {
//   id: string
//   guest: string
//   email: string
//   phone: string
//   room: string
//   roomType: string
//   checkIn: string
//   checkOut: string
//   guests: number
//   status: string
//   amount: number
//   created: string
// }

// export default function HotelReservations() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [showModal, setShowModal] = useState(false)
//   const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
//   const [
//     createReservationMutation,
//     // { loading: creatingReservation, error: createError, data: createData },
//   ] = useCreateReservationMutation()
//   const {
//     data: reservationsData,
//     loading,
//     error,
//   } = useReservationsQuery({
//     variables: {
//       businessId: "60d21b4667d0d8992e610c85", // Example business ID
//       businessType: "Hotel",
//     },
//   })
//   const [reservations, setReservations] = useState<Reservation[]>([])

//   useEffect(() => {
//     if (reservationsData) {
//       const formattedReservations = reservationsData.reservations.map((res: any) => ({
//         id: res.id,
//         guest: res.customerInfo.name,
//         email: res.customerInfo.email,
//         phone: res.customerInfo.phone,
//         room: res.room?.number ?? "",          // ⬅ safe-chaining
//         roomType: res.room?.type ?? "Standard",
//         checkIn: formatDate(res.checkIn),      // ⬅ use helper
//         checkOut: formatDate(res.checkOut),
//         guests: res.guests,                    // ⬅  Int, not res.guests.total
//         status: res.status,
//         amount: res.totalAmount,               // ⬅  field exists on type
//         created: formatDate(res.createdAt),
//       }));

//       setReservations(formattedReservations)
//     }
//   }, [reservationsData])

//   const [formData, setFormData] = useState<Partial<Reservation>>({
//     guest: "",
//     email: "",
//     phone: "",
//     room: "",
//     roomType: "Standard",
//     checkIn: "",
//     checkOut: "",
//     guests: 1,
//     status: "pending",
//     amount: 0,
//   })

//   const filteredReservations = reservations.filter((reservation) => {
//     const matchesSearch =
//       reservation.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "cancelled":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (editingReservation) {
//       // Update logic will be handled here
//     } else {
//       try {
//         await createReservationMutation({
//           variables: {
//             input: {
//               businessId: "60d21b4667d0d8992e610c85",
//               businessType: "Hotel",
//               customerInfo: {
//                 name: formData.guest!,
//                 email: formData.email!,
//                 phone: formData.phone!,
//               },
//               roomId: formData.room,                 // ⬅ pass the actual room ID
//               checkIn: formData.checkIn,             // keep as ISO «YYYY-MM-DD»
//               checkOut: formData.checkOut,
//               guests: formData.guests ?? 1,
//               date: new Date().toISOString(),
//               totalAmount: formData.amount ?? 0,
//               status: formData.status!,
//             },
//           },
//           refetchQueries: ["Reservations"],         // ⬅ refresh list automatically
//         });
//       } catch (err) {
//         console.log(err)
//       }
//     }
//     setShowModal(false)
//     setEditingReservation(null)
//     setFormData({
//       guest: "",
//       email: "",
//       phone: "",
//       room: "",
//       roomType: "Standard",
//       checkIn: "",
//       checkOut: "",
//       guests: 1,
//       status: "pending",
//       amount: 0,
//     })
//   }

//   const handleEdit = (reservation: Reservation) => {
//     setEditingReservation(reservation)
//     setFormData(reservation)
//     setShowModal(true)
//   }

//   const handleDelete = (id: string) => {
//     if (confirm("Are you sure you want to delete this reservation?")) {
//       setReservations(reservations.filter((res) => res.id !== id))
//     }
//   }

//   const openCreateModal = () => {
//     setEditingReservation(null)
//     setFormData({
//       guest: "",
//       email: "",
//       phone: "",
//       room: "",
//       roomType: "Standard",
//       checkIn: "",
//       checkOut: "",
//       guests: 1,
//       status: "pending",
//       amount: 0,
//     })
//     setShowModal(true)
//   }


//   if (loading) return <p>Loading…</p>;
//   if (error) return <p className="text-red-600">Error: {error.message}</p>;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
//           <p className="text-gray-600">Manage all hotel reservations and bookings</p>
//         </div>
//         <button
//           onClick={openCreateModal}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           New Reservation
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
//                 placeholder="Search by guest name or reservation ID..."
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
//               <option value="all">All Status</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="pending">Pending</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//             <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//               <Filter className="h-5 w-5 mr-2" />
//               More Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Reservations Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Reservation
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Guest Details
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Dates
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredReservations.map((reservation) => (
//                 <tr key={reservation.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
//                       <div className="text-sm text-gray-500">Created: {reservation.created}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{reservation.guest}</div>
//                       <div className="text-sm text-gray-500 flex items-center">
//                         <Mail className="h-4 w-4 mr-1" />
//                         {reservation.email}
//                       </div>
//                       <div className="text-sm text-gray-500 flex items-center">
//                         <Phone className="h-4 w-4 mr-1" />
//                         {reservation.phone}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">Room {reservation.room}</div>
//                       <div className="text-sm text-gray-500">{reservation.roomType}</div>
//                       <div className="text-sm text-gray-500 flex items-center">
//                         <Users className="h-4 w-4 mr-1" />
//                         {reservation.guests} guests
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900 flex items-center">
//                         <Calendar className="h-4 w-4 mr-1" />
//                         Check-in: {reservation.checkIn}
//                       </div>
//                       <div className="text-sm text-gray-500 flex items-center">
//                         <Calendar className="h-4 w-4 mr-1" />
//                         Check-out: {reservation.checkOut}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}
//                     >
//                       {reservation.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">${reservation.amount}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center space-x-2">
//                       <button onClick={() => handleEdit(reservation)} className="text-blue-600 hover:text-blue-900">
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button onClick={() => handleDelete(reservation.id)} className="text-red-600 hover:text-red-900">
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900">
//                 {editingReservation ? "Edit Reservation" : "Create New Reservation"}
//               </h2>
//               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.guest || ""}
//                     onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
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
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.room || ""}
//                     onChange={(e) => setFormData({ ...formData, room: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
//                   <select
//                     value={formData.roomType || "Standard"}
//                     onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="Standard">Standard</option>
//                     <option value="Deluxe">Deluxe</option>
//                     <option value="Suite">Suite</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
//                   <input
//                     type="number"
//                     min="1"
//                     required
//                     value={formData.guests || 1}
//                     onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
//                   <input
//                     type="date"
//                     required
//                     value={formData.checkIn || ""}
//                     onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
//                   <input
//                     type="date"
//                     required
//                     value={formData.checkOut || ""}
//                     onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={formData.status || "pending"}
//                     onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="confirmed">Confirmed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
//                   <input
//                     type="number"
//                     min="0"
//                     required
//                     value={formData.amount || 0}
//                     onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
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
//                 <button type="submit"
//                   onClick={handleSubmit}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                   {editingReservation ? "Update" : "Create"} Reservation
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
//             <p className="text-2xl font-bold text-blue-600">{filteredReservations.length}</p>
//             <p className="text-sm text-gray-600">Total Reservations</p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-green-600">
//               {filteredReservations.filter((r) => r.status === "confirmed").length}
//             </p>
//             <p className="text-sm text-gray-600">Confirmed</p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-yellow-600">
//               {filteredReservations.filter((r) => r.status === "pending").length}
//             </p>
//             <p className="text-sm text-gray-600">Pending</p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-gray-900">
//               ${filteredReservations.reduce((sum, r) => sum + r.amount, 0)}
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

import { useEffect, useState } from "react"
import { Search, Filter, Calendar, Users, Phone, Mail, Plus, Edit, Trash2, X } from "lucide-react"
import {
  useCreateReservationMutation,
  useReservationsQuery,
  // useUpdateReservationMutation,
  // useDeleteReservationMutation,
  type Reservation,
} from "@/src/graphql/generated"

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString() : ""

export default function HotelReservations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [createReservationMutation] = useCreateReservationMutation()
  // const [updateReservationMutation] = useUpdateReservationMutation()
  // const [deleteReservationMutation] = useDeleteReservationMutation()
  const {
    data: reservationsData,
    loading,
    error,
    refetch,
  } = useReservationsQuery({
    variables: {
      businessId: "60d21b4667d0d8992e610c85", // Example business ID
      businessType: "Hotel",
    },
  })
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    if (reservationsData) {
      setReservations(reservationsData.reservations as Reservation[])
    }
  }, [reservationsData])

  const [formData, setFormData] = useState<Partial<Reservation>>({
    customerInfo: { name: "", email: "", phone: "" },
    roomId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    status: "pending",
    totalAmount: 0,
  })

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const input = {
      businessId: "60d21b4667d0d8992e610c85",
      businessType: "Hotel",
      customerInfo: {
        name: formData.customerInfo?.name!,
        email: formData.customerInfo?.email!,
        phone: formData.customerInfo?.phone!,
      },
      roomId: formData.roomId,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests ?? 1,
      date: new Date().toISOString(),
      totalAmount: formData.totalAmount ?? 0,
      status: formData.status!,
    }

    try {
      if (editingReservation) {
        // await updateReservationMutation({
        //   variables: {
        //     id: editingReservation.id,
        //     input,
        //   },
        // })
      } else {
        await createReservationMutation({
          variables: {
            input,
          },
        })
      }
      refetch()
      setShowModal(false)
      setEditingReservation(null)
      setFormData({
        customerInfo: { name: "", email: "", phone: "" },
        roomId: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        status: "pending",
        totalAmount: 0,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation)
    setFormData({
      ...reservation,
      checkIn: reservation.checkIn ? new Date(reservation.checkIn).toISOString().split("T")[0] : "",
      checkOut: reservation.checkOut ? new Date(reservation.checkOut).toISOString().split("T")[0] : "",
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      try {
        // await deleteReservationMutation({
        //   variables: { id },
        // })
        refetch()
      } catch (err) {
        console.log(err)
      }
    }
  }

  const openCreateModal = () => {
    setEditingReservation(null)
    setFormData({
      customerInfo: { name: "", email: "", phone: "" },
      roomId: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      status: "pending",
      totalAmount: 0,
    })
    setShowModal(true)
  }


  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage all hotel reservations and bookings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
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
                placeholder="Search by guest name or reservation ID..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(reservation.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.customerInfo.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {reservation.customerInfo.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {reservation.customerInfo.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Room {reservation.roomId?.number}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.roomId?.type}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {reservation.guests} guests
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Check-in: {formatDate(reservation.checkIn)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Check-out: {formatDate(reservation.checkOut)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        reservation.status,
                      )}`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${reservation.totalAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(reservation as Reservation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="text-red-600 hover:text-red-900"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingReservation ? "Edit Reservation" : "Create New Reservation"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerInfo?.name || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerInfo: { ...formData.customerInfo, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.customerInfo?.email || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerInfo: { ...formData.customerInfo, email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerInfo?.phone || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerInfo: { ...formData.customerInfo, phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
                  <input
                    type="text"
                    required
                    value={formData.roomId || ""}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.guests || 1}
                    onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn || ""}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut || ""}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status || "pending"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.totalAmount || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, totalAmount: Number.parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingReservation ? "Update" : "Create"} Reservation
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
            <p className="text-2xl font-bold text-blue-600">{filteredReservations.length}</p>
            <p className="text-sm text-gray-600">Total Reservations</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredReservations.filter((r) => r.status === "confirmed").length}
            </p>
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {filteredReservations.filter((r) => r.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              ${filteredReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  )
}
