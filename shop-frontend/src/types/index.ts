export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
}

export interface Product {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  comparePrice?: number
  stock: number
  mainImage: string
  images?: string
  tags?: string
  featured?: boolean
  status: string
  soldCount: number
  createdAt?: string
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  skuInfo?: string
}

export interface Order {
  id: string
  orderNo: string
  status: string
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  currency: string
  shippingName: string
  shippingEmail: string
  shippingAddress: string
  shippingCity: string
  shippingCountry: string
  trackingNumber?: string
  shippingCarrier?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  current: number
  size: number
}

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}
