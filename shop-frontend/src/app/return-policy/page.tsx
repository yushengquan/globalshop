export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Return Policy</h1>
      <div className="text-gray-600 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">30-Day Returns</h2>
          <p>We accept returns within 30 days of delivery. Items must be unused and in original packaging.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">How to Return</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Contact us at support@globalshop.com with your order number</li>
            <li>We will provide a return shipping label</li>
            <li>Ship the item back within 7 days</li>
            <li>Refund will be processed within 3-5 business days of receipt</li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Non-Returnable Items</h2>
          <p>Perishable goods, digital downloads, and items marked as final sale cannot be returned.</p>
        </section>
      </div>
    </div>
  )
}
