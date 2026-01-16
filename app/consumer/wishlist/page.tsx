'use client'

import { useState, useEffect } from 'react'

interface Item {
  id: string
  name: string
  description: string
  price: number
  image: string
  seller: string
  available: boolean
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Item[]>([])

  useEffect(() => {
    const savedWishlist = localStorage.getItem('consumerWishlist')
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  const removeFromWishlist = (itemId: string) => {
    const newWishlist = wishlist.filter(item => item.id !== itemId)
    setWishlist(newWishlist)
    localStorage.setItem('consumerWishlist', JSON.stringify(newWishlist))
  }

  const addToCart = (item: Item) => {
    const savedCart = JSON.parse(localStorage.getItem('consumerCart') || '[]')
    if (!savedCart.find((i: Item) => i.id === item.id)) {
      const newCart = [...savedCart, item]
      localStorage.setItem('consumerCart', JSON.stringify(newCart))
      alert('Item added to cart!')
    } else {
      alert('Item already in cart!')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wishlist</h1>
        <p className="text-gray-600">{wishlist.length} item(s) in your wishlist</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Add items you love to your wishlist!</p>
          <a
            href="/consumer/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Store
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl">
                {item.image}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-500 mb-2">Seller: {item.seller}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                  <span className={`px-2 py-1 rounded text-xs ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove from Wishlist"
                  >
                    Remove
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
