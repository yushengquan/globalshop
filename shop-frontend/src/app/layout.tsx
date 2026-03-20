import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'GlobalShop - Quality Products Worldwide', template: '%s | GlobalShop' },
  description: 'Discover amazing products at great prices. Free shipping on orders over $50.',
  keywords: ['online shopping', 'pet supplies', 'home decor', 'outdoor gear'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}

function CookieBanner() {
  return (
    <div id="cookie-banner" className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between z-50" style={{display: 'none'}}>
      <p className="text-sm">We use cookies to improve your experience. By continuing, you agree to our <a href="/privacy-policy" className="underline">Privacy Policy</a>.</p>
      <button onClick={() => { document.getElementById('cookie-banner')!.style.display = 'none'; localStorage.setItem('cookie-accepted', '1') }} className="ml-4 bg-white text-gray-900 px-4 py-1 rounded text-sm font-medium">Accept</button>
    </div>
  )
}
