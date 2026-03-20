'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Star, Truck, Shield } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import api from '@/lib/api'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data.data))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem({ productId: product.id, name: product.name, price: product.price, quantity, image: product.mainImage })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image src={product.mainImage || 'https://picsum.photos/600/600'} alt={product.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}
            <span className="text-sm text-gray-500">({product.soldCount} sold)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.shortDescription || product.description}</p>
          <div className="flex items-center gap-3 mb-6">
            <label className="text-sm font-medium">Qty:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg">−</button>
              <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-lg">+</button>
            </div>
          </div>
          <button onClick={handleAddToCart}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition ${
              added ? 'bg-green-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
            <ShoppingCart size={22} />
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck size={18} className="text-primary-600" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield size={18} className="text-primary-600" />
              <span>30-day return guarantee</span>
            </div>
          </div>
          {product.description && (
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
