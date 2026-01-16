'use client'

import { useState, useEffect } from 'react'

interface Item {
  id: string
  name: string
  description: string
  price: number
  image: string
  available: boolean
}

export default function SellerDashboard() {
  const [items, setItems] = useState<Item[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '📦',
  })

  useEffect(() => {
    // Load seller items from localStorage
    const sellerEmail = localStorage.getItem('userEmail')
    const allItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
    const myItems = allItems.filter((item: any) => item.sellerEmail === sellerEmail)
    setItems(myItems)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sellerEmail = localStorage.getItem('userEmail') || ''
    const sellerName = localStorage.getItem('userName') || 'Seller'

    if (editingItem) {
      // Update existing item
      const allItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
      const updatedItems = allItems.map((item: any) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              description: formData.description,
              price: parseFloat(formData.price),
              image: formData.image,
              available: editingItem.available,
            }
          : item
      )
      localStorage.setItem('sellerItems', JSON.stringify(updatedItems))
      setItems(updatedItems.filter((item: any) => item.sellerEmail === sellerEmail))
    } else {
      // Add new item
      const newItem: Item = {
        id: `item-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        available: true,
        sellerEmail,
        seller: sellerName,
      }
      const allItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
      const updatedItems = [...allItems, newItem]
      localStorage.setItem('sellerItems', JSON.stringify(updatedItems))
      setItems(updatedItems.filter((item: any) => item.sellerEmail === sellerEmail))
    }

    // Reset form
    setFormData({ name: '', description: '', price: '', image: '📦' })
    setShowAddForm(false)
    setEditingItem(null)
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
    })
    setShowAddForm(true)
  }

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const allItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
      const updatedItems = allItems.filter((item: any) => item.id !== itemId)
      localStorage.setItem('sellerItems', JSON.stringify(updatedItems))
      const sellerEmail = localStorage.getItem('userEmail') || ''
      setItems(updatedItems.filter((item: any) => item.sellerEmail === sellerEmail))
    }
  }

  const toggleAvailability = (itemId: string) => {
    const allItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
    const updatedItems = allItems.map((item: any) =>
      item.id === itemId ? { ...item, available: !item.available } : item
    )
    localStorage.setItem('sellerItems', JSON.stringify(updatedItems))
    const sellerEmail = localStorage.getItem('userEmail') || ''
    setItems(updatedItems.filter((item: any) => item.sellerEmail === sellerEmail))
  }

  const emojiOptions = ['📦', '📷', '⌚', '💻', '☕', '📚', '🧘', '🎮', '🎨', '🏠', '🚗', '📱']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Items</h1>
          <p className="text-gray-600">Manage your store items</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingItem(null)
            setFormData({ name: '', description: '', price: '', image: '📦' })
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          + Add Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Enter item description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emoji Icon</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: emoji })}
                    className={`text-2xl p-2 rounded-lg border-2 ${
                      formData.image === emoji ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Or type emoji"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingItem(null)
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No items yet</h2>
          <p className="text-gray-600 mb-6">Add your first item to start selling!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-6xl">
                {item.image}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">${item.price}</span>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
