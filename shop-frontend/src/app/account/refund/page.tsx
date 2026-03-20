'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

const REASONS = [
  'Item not as described',
  'Item damaged',
  'Wrong item received',
  'Item not received',
  'Changed my mind',
  'Other',
]

export default function RefundPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [form, setForm] = useState({ orderId: '', reason: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/auth/login')
      return
    }
    api.get('/orders/my').then(r => setOrders(r.data.data?.records || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/refunds', form)
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-bold mb-2">Refund Request Submitted</h2>
      <p className="text-gray-500 mb-6">We will process your request within 3-5 business days.</p>
      <button
        onClick={() => router.push('/account')}
        className="bg-blue-600 text-white px-6 py-2 rounded-full"
      >
        Back to Account
      </button>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Request a Refund</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Select Order</label>
          <select
            value={form.orderId}
            onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">-- Select an order --</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                {o.orderNo} - ${o.total?.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <select
            value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">-- Select reason --</option>
            {REASONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            rows={4}
            placeholder="Please provide more details..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Refund Request'}
        </button>
      </form>
    </div>
  )
}
