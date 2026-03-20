import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products/index'
import Orders from './pages/Orders/index'
import Inventory from './pages/Inventory/index'
import Coupons from './pages/Coupons/index'
import Settings from './pages/Settings/index'
import Reviews from './pages/Reviews/index'
import Shipping from './pages/Shipping/index'
import Refunds from './pages/Refunds/index'
import Blog from './pages/Blog/index'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="blog" element={<Blog />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
