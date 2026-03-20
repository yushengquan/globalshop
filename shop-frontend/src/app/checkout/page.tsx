'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const { isLoggedIn } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    shippingName: '', shippingEmail: '', shippingPhone: '',
    shippingAddress: '', shippingCity: '', shippingState: '',
    shippingZip: '', shippingCountry: 'US'
  })

  const subtotal = total()
  const shipping = subtotal >= 50 ? 0 : 9.99
  const orderTotal = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn()) { router.push('/auth/login'); return }
    setLoading(true)
    try {
      const orderRes = await api.post('/orders', {
        ...form,
        paymentMethod: 'STRIPE',
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity, skuInfo: i.skuInfo }))
      })
      const orderId = orderRes.data.data?.id
      await api.post('/payments/stripe/confirm', { orderId, paymentIntentId: 'pi_mock_' + Date.now() })
      clearCart()
      router.push('/checkout/success')
    } catch (err) {
      alert('Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) { router.push('/cart'); return null }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg">Shipping Address</h2>
          {[['shippingName','Full Name'],['shippingEmail','Email'],['shippingPhone','Phone'],
            ['shippingAddress','Address'],['shippingCity','City'],['shippingState','State/Province'],
            ['shippingZip','ZIP Code']].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input required value={(form as any)[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select value={form.shippingCountry} onChange={e => setForm(f => ({...f, shippingCountry: e.target.value}))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 transition mt-4">
            {loading ? 'Placing Order...' : `Place Order · ${formatPrice(orderTotal)}`}
          </button>
        </form>
        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map(i => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span className="text-gray-600 line-clamp-1">{i.name} x{i.quantity}</span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span><span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
