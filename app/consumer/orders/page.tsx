'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  item: {
    id: string
    name: string
    description: string
    price: number
    image: string
    seller: string
  }
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  bookingDate: string
  pickupDate: string | null
  completed: boolean
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem('consumerOrders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    // Check for status updates from seller
    const checkForUpdates = setInterval(() => {
      const savedOrders = localStorage.getItem('consumerOrders')
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }, 1000)

    return () => clearInterval(checkForUpdates)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  const markAsCompleted = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, completed: true, status: 'completed' as const }
      }
      return order
    })
    setOrders(updatedOrders)
    localStorage.setItem('consumerOrders', JSON.stringify(updatedOrders))
  }

  const daysSinceBooking = (bookingDate: string) => {
    const booking = new Date(bookingDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - booking.getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track your bookings and order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Book items from the store to see them here!</p>
          <a
            href="/consumer/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Store
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-4xl">
                    {order.item.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{order.item.name}</h3>
                    <p className="text-sm text-gray-600">{order.item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Seller: {order.item.seller}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">${order.item.price}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.status === 'accepted' && !order.completed && (
                    <button
                      onClick={() => markAsCompleted(order.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Booking Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Days Since Booking</p>
                    <p className="font-medium text-gray-900">{daysSinceBooking(order.bookingDate)} days</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Status</p>
                    <p className="font-medium text-gray-900">
                      {order.completed ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pickup Status</p>
                    <p className="font-medium text-gray-900">
                      {order.pickupDate ? 'Picked Up' : 'Not Picked Up'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
