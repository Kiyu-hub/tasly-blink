export interface Product {
  id: string
  slug: string
  name: string
  description: string
  longDescription?: string
  price: number
  originalPrice?: number
  discount?: number
  imageURL: string
  images?: string[]
  category: string
  stock: number
  rating?: number
  reviewCount?: number
  tags?: string[]
  benefits?: string[]
  ingredients?: string[]
  usage?: string
  featured?: boolean
  bestSeller?: boolean
  new?: boolean
  createdAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface WishlistItem {
  productId: string
  addedAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customerInfo: CustomerInfo
  paymentMethod: string
  createdAt: string
  updatedAt: string
  trackingNumber?: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  notes?: string
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image: string
  link?: string
  buttonText?: string
  active: boolean
  order: number
}

export interface SiteInfo {
  name: string
  tagline: string
  description: string
  email: string
  phone: string
  whatsapp: string
  address: string
  announcement?: string
  currency: string
  freeShippingThreshold: number
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok?: string
    youtube?: string
  }
  shippingInfo?: string
  returnPolicy?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  productCount: number
}

export interface Coupon {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minOrder?: number
  maxDiscount?: number
  expiresAt?: string
  usageLimit?: number
  usageCount: number
}
