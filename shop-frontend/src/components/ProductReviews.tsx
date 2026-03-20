'use client'
import { useEffect, useState } from 'react'
import { Star, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

interface Review {
  id: string
  userName: string
  rating: number
  title: string
  content: string
  reply?: string
  createdAt: string
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [form, setForm] = useState({ rating: 5, title: '', content: '', userName: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    api.get(`/products/${productId}/reviews`).then(r => setReviews(r.data.data || []))
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn()) { window.location.href = '/auth/login'; return }
    setSubmitting(true)
    try {
      await api.post('/reviews', { ...form, productId })
      setSubmitted(true)
      setForm({ rating: 5, title: '', content: '', userName: '' })
      api.get(`/products/${productId}/reviews`).then(r => setReviews(r.data.data || []))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 mb-8">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6 mb-10">
          {reviews.map(r => (
            <div key={r.id} className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">{r.userName || 'Anonymous'}</p>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} className={s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-gray-400">{r.createdAt?.slice(0,10)}</span>
              </div>
              {r.title && <p className="font-semibold text-sm mb-1">{r.title}</p>}
              <p className="text-gray-600 text-sm">{r.content}</p>
              {r.reply && (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-300 px-4 py-2 text-sm text-blue-800">
                  <span className="font-semibold">Seller reply: </span>{r.reply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Write review form */}
      <div className="border rounded-xl p-6">
        <h4 className="font-bold mb-4">Write a Review</h4>
        {submitted ? (
          <p className="text-green-600">Thank you for your review!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Your Name</label>
              <input value={form.userName} onChange={e => setForm(f => ({...f, userName: e.target.value}))}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="John D." required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({...f, rating: s}))}>
                    <Star size={24} className={s <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Great product!" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Review</label>
              <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))}
                className="w-full border rounded-lg px-3 py-2 text-sm" rows={4}
                placeholder="Share your experience..." required />
            </div>
            <button type="submit" disabled={submitting}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
