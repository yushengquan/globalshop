'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { Product, PageResult } from '@/types'
import api from '@/lib/api'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [data, setData] = useState<PageResult<Product> | null>(null)

  useEffect(() => {
    if (q) api.get('/products', { params: { keyword: q, page: 1, size: 20 } }).then(r => setData(r.data.data))
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Search Results for &quot;{q}&quot;</h1>
      <p className="text-gray-500 mb-8">{data?.total || 0} products found</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.records.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {data?.total === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No products found for &quot;{q}&quot;</p>
          <p className="text-sm mt-2">Try different keywords</p>
        </div>
      )}
    </div>
  )
}
