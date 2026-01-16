'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: string
  itemId: string
  itemName: string
  consumerEmail: string
  consumerName: string
  status: string
  bookingDate: string
}

export default function Profile() {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Seller'
    const email = localStorage.getItem('userEmail') || ''
    setUserName(name)
    setUserEmail(email)

    const sellerEmail = email
    const allItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
    const myItems = allItems.filter((item: any) => item.sellerEmail === sellerEmail)
    setItems(myItems)

    const allBookings = JSON.parse(localStorage.getItem('sellerBookings') || '[]')
    const sellerItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
    const myItemIds = sellerItems
      .filter((item: any) => item.sellerEmail === sellerEmail)
      .map((item: any) => item.id)
    const myBookings = allBookings.filter((booking: Booking) =>
      myItemIds.includes(booking.itemId)
    )
    setBookings(myBookings)
  }, [])

  const totalItems = items.length
  const availableItems = items.filter(i => i.available).length
  const totalBookings = bookings.length
  const acceptedBookings = bookings.filter(b => b.status === 'accepted').length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length

  const totalRevenue = items.reduce((sum, item) => {
    const itemBookings = bookings.filter(b => b.itemId === item.id && b.status === 'accepted')
    return sum + (item.price * itemBookings.length)
  }, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Your seller account information</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
            <p className="text-gray-600">{userEmail}</p>
            <p className="text-sm text-gray-500 mt-2">Seller Account</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">{totalItems}</div>
          <div className="text-gray-600">Total Items</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">{availableItems}</div>
          <div className="text-gray-600">Available</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">{totalBookings}</div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingBookings}</div>
          <div className="text-gray-600">Pending</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Accepted Bookings</h3>
          <div className="text-4xl font-bold text-green-600">{acceptedBookings}</div>
          <p className="text-sm text-gray-600 mt-2">Bookings you've accepted</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimated Revenue</h3>
          <div className="text-4xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</div>
          <p className="text-sm text-gray-600 mt-2">From accepted bookings</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings yet. Your booking requests will appear here!</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.itemName}</p>
                  <p className="text-sm text-gray-600">
                    {booking.consumerName} • {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
            {bookings.length > 5 && (
              <a
                href="/seller/bookings"
                className="block text-center text-purple-600 hover:underline mt-4"
              >
                View All Bookings →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
