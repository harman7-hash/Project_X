'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Item {
  id: string
  name: string
  description: string
  price: number
  image: string
  seller: string
  available: boolean
}

export default function Cart() {
  const [cart, setCart] = useState<Item[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem('consumerCart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter(item => item.id !== itemId)
    setCart(newCart)
    localStorage.setItem('consumerCart', JSON.stringify(newCart))
  }

  const bookItems = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    // Get existing orders
    const existingOrders = JSON.parse(localStorage.getItem('consumerOrders') || '[]')
    const newOrders = cart.map((item, index) => ({
      id: `order-${Date.now()}-${index}`,
      item: item,
      status: 'pending',
      bookingDate: new Date().toISOString(),
      pickupDate: null,
      completed: false,
    }))

    // Save orders
    const allOrders = [...existingOrders, ...newOrders]
    localStorage.setItem('consumerOrders', JSON.stringify(allOrders))

    // Notify sellers (in a real app, this would be done via backend)
    const sellerBookings = JSON.parse(localStorage.getItem('sellerBookings') || '[]')
    const newBookings = cart.map(item => ({
      id: `booking-${Date.now()}-${item.id}`,
      itemId: item.id,
      itemName: item.name,
      consumerEmail: localStorage.getItem('userEmail'),
      consumerName: localStorage.getItem('userName') || 'Consumer',
      status: 'pending',
      bookingDate: new Date().toISOString(),
    }))
    localStorage.setItem('sellerBookings', JSON.stringify([...sellerBookings, ...newBookings]))

    // Clear cart
    setCart([])
    localStorage.setItem('consumerCart', JSON.stringify([]))

    alert('Items booked successfully! Sellers will be notified.')
    router.push('/consumer/orders')
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{cart.length} item(s) in your cart</p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to get started!</p>
          <a
            href="/consumer/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Store
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-4xl">
                  {item.image}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Seller: {item.seller}</p>
                  <p className="text-xl font-bold text-blue-600 mt-2">${item.price}</p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={bookItems}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Book Items
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
