import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase. We&apos;ll send you a confirmation email shortly.</p>
      <p className="text-gray-500 mb-8">Your order is being processed and will be shipped within 1-3 business days.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/account" className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700">View Orders</Link>
        <Link href="/products" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50">Continue Shopping</Link>
      </div>
    </div>
  )
}
