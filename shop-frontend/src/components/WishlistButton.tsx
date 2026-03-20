'use client'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

export default function WishlistButton({ productId }: { productId: string }) {
  const [wishlisted, setWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn()) {
      api.get(`/wishlist/check?productId=${productId}`).then(r => setWishlisted(r.data.data || false))
    }
  }, [productId])

  const toggle = async () => {
    if (!isLoggedIn()) { window.location.href = '/auth/login'; return }
    setLoading(true)
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/remove?productId=${productId}`)
        setWishlisted(false)
      } else {
        await api.post('/wishlist/add', { productId })
        setWishlisted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`p-2 rounded-full border transition ${
        wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400'
      }`}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size={20} className={wishlisted ? 'fill-red-500' : ''} />
    </button>
  )
}
