export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="text-gray-600 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
          <p>We collect information you provide directly to us, such as name, email address, shipping address, and payment information when you make a purchase.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To process and fulfill your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To respond to your inquiries</li>
            <li>To improve our services</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">GDPR Rights</h2>
          <p>If you are located in the EU, you have the right to access, correct, or delete your personal data. Contact us at privacy@globalshop.com.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cookies</h2>
          <p>We use essential cookies to provide our services. You can control cookie settings in your browser.</p>
        </section>
      </div>
    </div>
  )
}
