'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  item: {
    id: string
    name: string
    price: number
    seller: string
  }
  status: string
  bookingDate: string
  completed: boolean
}

export default function Profile() {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User'
    const email = localStorage.getItem('userEmail') || ''
    setUserName(name)
    setUserEmail(email)

    const savedOrders = localStorage.getItem('consumerOrders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const completedOrders = orders.filter(o => o.completed).length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const acceptedOrders = orders.filter(o => o.status === 'accepted' && !o.completed).length

  const totalSpent = orders.reduce((sum, order) => sum + order.item.price, 0)

  // Check if user has taken orders within 30 days
  const recentOrders = orders.filter(order => {
    if (!order.completed) return false
    const orderDate = new Date(order.bookingDate)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 30
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Your account information and order history</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
            <p className="text-gray-600">{userEmail}</p>
            <p className="text-sm text-gray-500 mt-2">Consumer Account</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">{orders.length}</div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">{completedOrders}</div>
          <div className="text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingOrders}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">${totalSpent}</div>
          <div className="text-gray-600">Total Value</div>
        </div>
      </div>

      {/* Order History Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order History Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Orders in Last 30 Days</p>
              <p className="text-sm text-gray-600">Completed orders within 30 days of booking</p>
            </div>
            <div className="text-2xl font-bold text-blue-600">{recentOrders.length}</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Active Bookings</p>
              <p className="text-sm text-gray-600">Orders waiting for seller response or pickup</p>
            </div>
            <div className="text-2xl font-bold text-purple-600">{acceptedOrders}</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet. Start booking items to see your history here!</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.item.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.bookingDate).toLocaleDateString()} • ${order.item.price} • {order.item.seller}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.completed ? 'bg-green-100 text-green-700' :
                  order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.completed ? 'Completed' : order.status}
                </span>
              </div>
            ))}
            {orders.length > 5 && (
              <a
                href="/consumer/orders"
                className="block text-center text-blue-600 hover:underline mt-4"
              >
                View All Orders →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
