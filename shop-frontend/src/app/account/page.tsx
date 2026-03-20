'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Order, PageResult } from '@/types'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoggedIn, logout } = useAuthStore()
  const [orders, setOrders] = useState<PageResult<Order> | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/auth/login'); return }
    api.get('/users/me/orders?page=1&size=20').then(r => setOrders(r.data.data))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">{user?.email}</p>
        </div>
        <button onClick={() => { logout(); router.push('/') }}
          className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg">Logout</button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      {!orders?.records.length ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No orders yet</p>
          <Link href="/products" className="text-primary-600 hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.records.map(order => (
            <Link key={order.id} href={`/account/orders/${order.id}`}
              className="block bg-white border rounded-xl p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">#{order.orderNo}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-gray-900 mt-1">{formatPrice(order.total)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
