'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Truck, RefreshCw, Star } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { Product, Category } from '@/types'
import api from '@/lib/api'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api.get('/products/featured?size=8').then(r => setFeatured(r.data.data?.records || []))
    api.get('/categories').then(r => setCategories(r.data.data || []))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Shop the World&apos;s Best Products</h1>
          <p className="text-xl text-primary-100 mb-8">Free shipping on orders over $50 · 30-day returns · Worldwide delivery</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition flex items-center gap-2">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href="/products?categoryId=1000000000000001" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
              Pet Supplies
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?categoryId=${cat.id}`}
              className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition">
              <div className="text-4xl mb-3">{cat.slug === 'pet-supplies' ? '🐾' : cat.slug === 'home-decor' ? '🏠' : cat.slug === 'outdoor-camping' ? '⛺' : '📱'}</div>
              <h3 className="font-semibold text-gray-800">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
          <Link href="/products" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Truck size={40} className="text-primary-600" />
            <h3 className="font-semibold text-lg">Free Worldwide Shipping</h3>
            <p className="text-gray-500 text-sm">Free on orders over $50. Tracked delivery to 100+ countries.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={40} className="text-primary-600" />
            <h3 className="font-semibold text-lg">30-Day Easy Returns</h3>
            <p className="text-gray-500 text-sm">Not satisfied? Return within 30 days for a full refund.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Shield size={40} className="text-primary-600" />
            <h3 className="font-semibold text-lg">Secure Payment</h3>
            <p className="text-gray-500 text-sm">Your payment info is always protected with SSL encryption.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
