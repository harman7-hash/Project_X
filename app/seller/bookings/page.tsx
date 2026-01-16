'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: string
  itemId: string
  itemName: string
  consumerEmail: string
  consumerName: string
  status: 'pending' | 'accepted' | 'rejected'
  bookingDate: string
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const sellerEmail = localStorage.getItem('userEmail')
    
    const updateBookings = () => {
      // Get all bookings
      const allBookings = JSON.parse(localStorage.getItem('sellerBookings') || '[]')
      
      // Filter bookings for items belonging to this seller
      const sellerItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
      const myItemIds = sellerItems
        .filter((item: any) => item.sellerEmail === sellerEmail)
        .map((item: any) => item.id)
      
      const myBookings = allBookings.filter((booking: Booking) =>
        myItemIds.includes(booking.itemId)
      )
      
      setBookings(myBookings)
    }

    updateBookings()
    const interval = setInterval(updateBookings, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleAccept = (bookingId: string) => {
    // Update booking status
    const allBookings = JSON.parse(localStorage.getItem('sellerBookings') || '[]')
    const updatedBookings = allBookings.map((booking: Booking) =>
      booking.id === bookingId ? { ...booking, status: 'accepted' as const } : booking
    )
    localStorage.setItem('sellerBookings', JSON.stringify(updatedBookings))

    // Update consumer order status
    const booking = allBookings.find((b: Booking) => b.id === bookingId)
    if (booking) {
      const consumerOrders = JSON.parse(localStorage.getItem('consumerOrders') || '[]')
      const updatedOrders = consumerOrders.map((order: any) =>
        order.item.id === booking.itemId && order.status === 'pending'
          ? { ...order, status: 'accepted' as const }
          : order
      )
      localStorage.setItem('consumerOrders', JSON.stringify(updatedOrders))
    }

    setBookings(updatedBookings.filter((b: Booking) => 
      JSON.parse(localStorage.getItem('sellerItems') || '[]')
        .filter((item: any) => item.sellerEmail === localStorage.getItem('userEmail'))
        .map((item: any) => item.id)
        .includes(b.itemId)
    ))
  }

  const handleReject = (bookingId: string) => {
    // Update booking status
    const allBookings = JSON.parse(localStorage.getItem('sellerBookings') || '[]')
    const updatedBookings = allBookings.map((booking: Booking) =>
      booking.id === bookingId ? { ...booking, status: 'rejected' as const } : booking
    )
    localStorage.setItem('sellerBookings', JSON.stringify(updatedBookings))

    // Update consumer order status
    const booking = allBookings.find((b: Booking) => b.id === bookingId)
    if (booking) {
      const consumerOrders = JSON.parse(localStorage.getItem('consumerOrders') || '[]')
      const updatedOrders = consumerOrders.map((order: any) =>
        order.item.id === booking.itemId && order.status === 'pending'
          ? { ...order, status: 'rejected' as const }
          : order
      )
      localStorage.setItem('consumerOrders', JSON.stringify(updatedOrders))
    }

    setBookings(updatedBookings.filter((b: Booking) => 
      JSON.parse(localStorage.getItem('sellerItems') || '[]')
        .filter((item: any) => item.sellerEmail === localStorage.getItem('userEmail'))
        .map((item: any) => item.id)
        .includes(b.itemId)
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const otherBookings = bookings.filter(b => b.status !== 'pending')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Requests</h1>
        <p className="text-gray-600">Manage booking requests from consumers</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-gray-600">Booking requests will appear here when consumers book your items.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Bookings */}
          {pendingBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Pending Requests ({pendingBookings.length})
              </h2>
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.itemName}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Consumer: <span className="font-medium">{booking.consumerName}</span></p>
                          <p>Email: <span className="font-medium">{booking.consumerEmail}</span></p>
                          <p>Booking Date: <span className="font-medium">
                            {new Date(booking.bookingDate).toLocaleString()}
                          </span></p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(booking.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Bookings */}
          {otherBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Bookings</h2>
              <div className="space-y-4">
                {otherBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.itemName}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Consumer: <span className="font-medium">{booking.consumerName}</span></p>
                          <p>Email: <span className="font-medium">{booking.consumerEmail}</span></p>
                          <p>Booking Date: <span className="font-medium">
                            {new Date(booking.bookingDate).toLocaleString()}
                          </span></p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
