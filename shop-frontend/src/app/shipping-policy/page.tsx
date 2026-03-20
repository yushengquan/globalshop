export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      <div className="prose text-gray-600 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Processing Time</h2>
          <p>Orders are processed within 1-3 business days after payment confirmation.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Shipping Methods</h2>
          <ul className="space-y-2">
            <li><strong>Standard Shipping:</strong> 7-15 business days — $9.99 (Free on orders over $50)</li>
            <li><strong>Express Shipping:</strong> 3-7 business days — $19.99</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Tracking</h2>
          <p>You will receive a tracking number via email once your order ships. Track your package on the carrier website or in your account.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">International Orders</h2>
          <p>We ship to 100+ countries. Import duties and taxes are the responsibility of the buyer.</p>
        </section>
      </div>
    </div>
  )
}
