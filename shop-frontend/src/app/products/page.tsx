'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { Product, Category, PageResult } from '@/types'
import api from '@/lib/api'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const keyword = searchParams.get('q') || ''
  const [data, setData] = useState<PageResult<Product> | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('bestseller')

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data || []))
  }, [])

  useEffect(() => {
    const params: Record<string, string | number> = { page, size: 12, sort }
    if (categoryId) params.categoryId = categoryId
    if (keyword) params.keyword = keyword
    api.get('/products', { params }).then(r => setData(r.data.data))
  }, [page, sort, categoryId, keyword])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
          <ul className="space-y-2">
            <li><a href="/products" className="text-sm text-gray-600 hover:text-primary-600">All Products</a></li>
            {categories.map(c => (
              <li key={c.id}>
                <a href={`/products?categoryId=${c.id}`}
                  className={`text-sm hover:text-primary-600 ${categoryId === c.id ? 'text-primary-600 font-semibold' : 'text-gray-600'}`}>
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">{data?.total || 0} products</p>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
              <option value="bestseller">Best Sellers</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data?.records.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {/* Pagination */}
          {data && data.total > 12 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: Math.ceil(data.total / 12) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
