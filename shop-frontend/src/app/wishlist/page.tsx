'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'

export default function WishlistPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const addItem = useCartStore(s => s.addItem)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/auth/login'); return }
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    setLoading(true)
    try {
      const res = await api.get('/wishlist')
      const wishlistItems = res.data.data || []
      const products = await Promise.all(
        wishlistItems.map((w: any) => api.get(`/products/${w.productId}`).then(r => r.data.data).catch(() => null))
      )
      setItems(products.filter(Boolean))
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    await api.delete(`/wishlist/remove?productId=${productId}`)
    setItems(items.filter(i => i.id !== productId))
  }

  const addToCart = (product: any) => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.mainImage })
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart size={32} className="fill-red-500 text-red-500" /> My Wishlist
      </h1>
      {items.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={64} className="mx-auto text-gray-200 mb-6" />
          <p className="text-gray-400 mb-6">Your wishlist is empty</p>
          <Link href="/products" className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700">Discover Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(product => (
            <div key={product.id} className="group relative">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image src={product.mainImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition" />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                  <p className="text-base font-bold mt-1">{formatPrice(product.price)}</p>
                </div>
              </Link>
              <div className="flex gap-2 mt-2">
                <button onClick={() => addToCart(product)}
                  className="flex-1 bg-primary-600 text-white text-xs py-2 rounded-lg hover:bg-primary-700">Add to Cart</button>
                <button onClick={() => removeFromWishlist(product.id)}
                  className="p-2 border rounded-lg text-red-400 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
