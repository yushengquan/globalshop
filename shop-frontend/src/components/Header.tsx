'use client'
import Link from 'next/link'
import { ShoppingCart, Search, User, Menu } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function Header() {
  const count = useCartStore((s) => s.count())
  const { user, logout } = useAuthStore()
  const [search, setSearch] = useState('')

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600">GlobalShop</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/products" className="text-gray-600 hover:text-primary-600">All Products</Link>
            <Link href="/products?categoryId=1000000000000001" className="text-gray-600 hover:text-primary-600">Pet Supplies</Link>
            <Link href="/products?categoryId=1000000000000002" className="text-gray-600 hover:text-primary-600">Home Decor</Link>
            <Link href="/products?categoryId=1000000000000003" className="text-gray-600 hover:text-primary-600">Outdoor</Link>
          </nav>
          <div className="flex items-center gap-3">
            <form action="/search" className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1">
              <Search size={16} className="text-gray-400" />
              <input
                name="q"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent ml-2 text-sm outline-none w-40"
              />
            </form>
            <Link href="/cart" className="relative p-2">
              <ShoppingCart size={22} className="text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/account" className="text-sm text-gray-700">{user.firstName}</Link>
                <button onClick={logout} className="text-xs text-gray-500 hover:text-red-500">Logout</button>
              </div>
            ) : (
              <Link href="/auth/login" className="p-2">
                <User size={22} className="text-gray-700" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
