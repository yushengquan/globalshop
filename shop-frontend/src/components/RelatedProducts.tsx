'use client'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/types'
import api from '@/lib/api'

export default function RelatedProducts({ categoryId, currentProductId }: { categoryId: string; currentProductId: string }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    api.get('/products', { params: { categoryId, size: 5 } }).then(r => {
      const all: Product[] = r.data.data?.records || []
      setProducts(all.filter(p => p.id !== currentProductId).slice(0, 4))
    })
  }, [categoryId, currentProductId])

  if (products.length === 0) return null

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
