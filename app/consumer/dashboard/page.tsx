'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Item {
  id: string
  name: string
  description: string
  price: number
  image: string
  seller: string
  available: boolean
}

export default function ConsumerDashboard() {
  const [items, setItems] = useState<Item[]>([])
  const [cart, setCart] = useState<Item[]>([])
  const [wishlist, setWishlist] = useState<Item[]>([])

  useEffect(() => {
    // Load items from seller items
    const sellerItems = JSON.parse(localStorage.getItem('sellerItems') || '[]')
    const availableItems = sellerItems
      .filter((item: any) => item.available)
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        seller: item.seller || 'Seller',
        available: item.available,
      }))
    
    // If no seller items, use mock items
    if (availableItems.length === 0) {
      const mockItems: Item[] = [
        {
          id: '1',
          name: 'Vintage Camera',
          description: 'Beautiful vintage camera in excellent condition',
          price: 299,
          image: '📷',
          seller: 'Camera Store',
          available: true,
        },
        {
          id: '2',
          name: 'Designer Watch',
          description: 'Luxury watch with leather strap',
          price: 599,
          image: '⌚',
          seller: 'Time Pieces',
          available: true,
        },
        {
          id: '3',
          name: 'Laptop Stand',
          description: 'Ergonomic aluminum laptop stand',
          price: 49,
          image: '💻',
          seller: 'Tech Gear',
          available: true,
        },
        {
          id: '4',
          name: 'Coffee Maker',
          description: 'Premium espresso machine',
          price: 399,
          image: '☕',
          seller: 'Kitchen Pro',
          available: true,
        },
        {
          id: '5',
          name: 'Bookshelf',
          description: 'Modern wooden bookshelf',
          price: 199,
          image: '📚',
          seller: 'Furniture Hub',
          available: true,
        },
        {
          id: '6',
          name: 'Yoga Mat',
          description: 'Eco-friendly yoga mat with carry bag',
          price: 35,
          image: '🧘',
          seller: 'Fitness World',
          available: true,
        },
      ]
      setItems(mockItems)
    } else {
      setItems(availableItems)
    }

    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem('consumerCart')
    const savedWishlist = localStorage.getItem('consumerWishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  const addToCart = (item: Item) => {
    const newCart = [...cart, item]
    setCart(newCart)
    localStorage.setItem('consumerCart', JSON.stringify(newCart))
    alert('Item added to cart!')
  }

  const addToWishlist = (item: Item) => {
    if (!wishlist.find(i => i.id === item.id)) {
      const newWishlist = [...wishlist, item]
      setWishlist(newWishlist)
      localStorage.setItem('consumerWishlist', JSON.stringify(newWishlist))
      alert('Item added to wishlist!')
    } else {
      alert('Item already in wishlist!')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Store</h1>
        <p className="text-gray-600">Browse and book items from sellers</p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
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
                  onClick={() => addToWishlist(item)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Add to Wishlist"
                >
                  ❤️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
