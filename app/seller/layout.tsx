'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0)

  useEffect(() => {
    // Check if user is logged in and is a seller
    if (!localStorage.getItem('userEmail')) {
      router.push('/login')
      return
    }
    if (localStorage.getItem('userRole') !== 'seller') {
      router.push('/role-selection')
    }

    // Check for pending bookings
    const updateBookingCount = () => {
      const bookings = JSON.parse(localStorage.getItem('sellerBookings') || '[]')
      const pending = bookings.filter((b: any) => b.status === 'pending').length
      setPendingBookingsCount(pending)
    }
    updateBookingCount()
    const interval = setInterval(updateBookingCount, 1000)
    return () => clearInterval(interval)
  }, [router])

  const menuItems = [
    { href: '/seller/dashboard', label: 'Items', icon: '📦' },
    { href: '/seller/bookings', label: 'Bookings', icon: '🔔', badge: pendingBookingsCount },
    { href: '/seller/profile', label: 'Profile', icon: '👤' },
  ]

  const logout = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 z-30 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Project X</h2>
            <p className="text-sm text-gray-500 mt-1">Seller Portal</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors relative ${
                  pathname === item.href
                    ? 'bg-purple-100 text-purple-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
