'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const subtotal = total()
  const shipping = subtotal >= 50 ? 0 : 9.99
  const orderTotal = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started</p>
        <Link href="/products" className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-primary-600 font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1">−</button>
                    <span className="px-3 py-1 border-x text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1">+</button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right font-bold">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            {subtotal < 50 && <p className="text-xs text-gray-500">Add {formatPrice(50 - subtotal)} more for free shipping</p>}
            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Total</span><span>{formatPrice(orderTotal)}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block w-full bg-primary-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-primary-700 transition">
            Proceed to Checkout
          </Link>
          <Link href="/products" className="mt-3 block text-center text-sm text-gray-500 hover:text-primary-600">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
