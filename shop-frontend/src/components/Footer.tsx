import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">GlobalShop</h3>
          <p className="text-sm">Quality products delivered worldwide. Your trusted online shopping destination.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white">All Products</Link></li>
            <li><Link href="/products?categoryId=1000000000000001" className="hover:text-white">Pet Supplies</Link></li>
            <li><Link href="/products?categoryId=1000000000000002" className="hover:text-white">Home Decor</Link></li>
            <li><Link href="/products?categoryId=1000000000000003" className="hover:text-white">Outdoor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
            <li><Link href="/return-policy" className="hover:text-white">Return Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">About</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-sm">
        <p>&copy; 2026 GlobalShop. All rights reserved.</p>
      </div>
    </footer>
  )
}
