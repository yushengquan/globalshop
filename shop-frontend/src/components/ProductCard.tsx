'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.mainImage,
    })
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
        <Image
          src={product.mainImage || 'https://picsum.photos/600/600'}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            SALE
          </span>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-2 right-2 bg-white text-gray-900 p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-600 hover:text-white"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
