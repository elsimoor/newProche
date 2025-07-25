"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, Filter, DollarSign, Clock, Star, UtensilsCrossed, X } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
  popular: boolean
  prepTime: number
  allergens: string[]
  image: string
}

export default function RestaurantMenus() {
  const [activeCategory, setActiveCategory] = useState("appetizers")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const categories = [
    { id: "appetizers", name: "Appetizers", count: 8 },
    { id: "mains", name: "Main Courses", count: 12 },
    { id: "desserts", name: "Desserts", count: 6 },
    { id: "beverages", name: "Beverages", count: 15 },
    { id: "specials", name: "Daily Specials", count: 4 },
  ]

  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({
    appetizers: [
      {
        id: 1,
        name: "Caesar Salad",
        description: "Crisp romaine lettuce, parmesan cheese, croutons, caesar dressing",
        price: 14.99,
        category: "appetizers",
        available: true,
        popular: true,
        prepTime: 10,
        allergens: ["gluten", "dairy"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Bruschetta Trio",
        description: "Three varieties of bruschetta with fresh tomatoes, basil, and mozzarella",
        price: 16.99,
        category: "appetizers",
        available: true,
        popular: false,
        prepTime: 8,
        allergens: ["gluten", "dairy"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: "Calamari Rings",
        description: "Crispy fried squid rings served with marinara sauce",
        price: 18.99,
        category: "appetizers",
        available: false,
        popular: true,
        prepTime: 12,
        allergens: ["seafood", "gluten"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    mains: [
      {
        id: 4,
        name: "Grilled Salmon",
        description: "Atlantic salmon with lemon herb butter, seasonal vegetables",
        price: 28.99,
        category: "mains",
        available: true,
        popular: true,
        prepTime: 20,
        allergens: ["fish"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        name: "Beef Tenderloin",
        description: "8oz prime beef tenderloin with red wine reduction",
        price: 34.99,
        category: "mains",
        available: true,
        popular: true,
        prepTime: 25,
        allergens: [],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        name: "Pasta Carbonara",
        description: "Fresh pasta with pancetta, eggs, parmesan, black pepper",
        price: 22.99,
        category: "mains",
        available: true,
        popular: false,
        prepTime: 15,
        allergens: ["gluten", "dairy", "eggs"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    desserts: [
      {
        id: 7,
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee-soaked ladyfingers",
        price: 9.99,
        category: "desserts",
        available: true,
        popular: true,
        prepTime: 5,
        allergens: ["dairy", "eggs", "gluten"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 8,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center, vanilla ice cream",
        price: 11.99,
        category: "desserts",
        available: true,
        popular: true,
        prepTime: 12,
        allergens: ["dairy", "eggs", "gluten"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    beverages: [
      {
        id: 9,
        name: "House Wine Red",
        description: "Cabernet Sauvignon, full-bodied with berry notes",
        price: 8.99,
        category: "beverages",
        available: true,
        popular: false,
        prepTime: 2,
        allergens: ["sulfites"],
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 10,
        name: "Craft Beer Selection",
        description: "Rotating selection of local craft beers",
        price: 6.99,
        category: "beverages",
        available: true,
        popular: true,
        prepTime: 2,
        allergens: ["gluten"],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    specials: [
      {
        id: 11,
        name: "Chef's Special",
        description: "Pan-seared duck breast with cherry gastrique",
        price: 32.99,
        category: "specials",
        available: true,
        popular: true,
        prepTime: 30,
        allergens: [],
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  })

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: activeCategory,
    available: true,
    popular: false,
    prepTime: 10,
    allergens: [],
    image: "/placeholder.svg?height=100&width=100",
  })

  const currentItems = menuItems[activeCategory as keyof typeof menuItems] || []
  const filteredItems = currentItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      setMenuItems((prev) => ({
        ...prev,
        [activeCategory]: prev[activeCategory].map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item,
        ),
      }))
    } else {
      const newItem: MenuItem = {
        id: Date.now(),
        ...(formData as MenuItem),
      }
      setMenuItems((prev) => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], newItem],
      }))
    }
    setShowModal(false)
    setEditingItem(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: activeCategory,
      available: true,
      popular: false,
      prepTime: 10,
      allergens: [],
      image: "/placeholder.svg?height=100&width=100",
    })
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems((prev) => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter((item) => item.id !== id),
      }))
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant menu items and categories</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Export Menu
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
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">{menuItems[category.id]?.length || 0}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {activeCategory.replace("_", " ")} ({filteredItems.length} items)
                </h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Bulk Edit
                  </button>
                  <button
                    onClick={openCreateModal}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                              {item.popular && (
                                <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </span>
                              )}
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.available ? "Available" : "Out of Stock"}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{item.description}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleEdit(item)} className="text-gray-400 hover:text-blue-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="font-semibold text-gray-900">${item.price}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.prepTime} min
                            </div>
                          </div>

                          {item.allergens.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-500">Allergens:</span>
                              {item.allergens.map((allergen, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <UtensilsCrossed className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Start by adding your first menu item"}
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Add Menu Item
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
                {editingItem ? "Edit Menu Item" : "Create New Menu Item"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={formData.category || activeCategory}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="appetizers">Appetizers</option>
                    <option value="mains">Main Courses</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                    <option value="specials">Daily Specials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.prepTime || 10}
                    onChange={(e) => setFormData({ ...formData, prepTime: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.allergens?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, allergens: e.target.value.split(", ").filter((a) => a.trim()) })
                    }
                    placeholder="gluten, dairy, nuts"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    Popular Item
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
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  {editingItem ? "Update" : "Create"} Menu Item
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
            <p className="text-2xl font-bold text-red-600">{Object.values(menuItems).flat().length}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {
                Object.values(menuItems)
                  .flat()
                  .filter((item) => item.available).length
              }
            </p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {
                Object.values(menuItems)
                  .flat()
                  .filter((item) => item.popular).length
              }
            </p>
            <p className="text-sm text-gray-600">Popular Items</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              $
              {(
                Object.values(menuItems)
                  .flat()
                  .reduce((sum, item) => sum + item.price, 0) / Object.values(menuItems).flat().length
              ).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Avg. Price</p>
          </div>
        </div>
      </div>
    </div>
  )
}
