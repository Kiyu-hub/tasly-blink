export interface CategoryData {
  id: string
  name: string
  slug: string
  description: string
  image: string
  color: string
  order: number
  visible: boolean
  productCount?: number
}

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
  aboutUs?: string
  logo?: string
  favicon?: string
  email: string
  phone: string
  whatsapp: string
  whatsappCommunityLink?: string
  address: string
  businessHours?: string
  announcement?: string
  showAnnouncement?: boolean
  currency: string
  freeDeliveryThreshold: number
  deliveryFee?: number
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok?: string
    youtube?: string
    whatsapp?: string
  }
  socialMediaDisplay?: {
    showFacebook?: boolean
    showInstagram?: boolean
    showTwitter?: boolean
    showTiktok?: boolean
    showYoutube?: boolean
    showWhatsApp?: boolean
  }
  deliveryInfo?: string
  returnPolicy?: string
  missionStatement?: string
  visionStatement?: string
  ourStory?: {
    title?: string
    content?: string
    image?: string
  }
  coreValues?: Array<{
    title: string
    description: string
    icon?: string
  }>
  stats?: Array<{
    number: string
    label: string
  }>
  healthBanners?: Array<{
    id: string
    title: string
    description: string
    image: string
    ctaText: string
    ctaLink: string
    order: number
  }>
  certifications?: string[]
  paymentMethods?: string[]
  deliveryLocations?: string[]
  faqs?: Array<{
    question: string
    answer: string
  }>
  manager?: {
    name: string
    role: string
    image: string
    bio?: string
  }
}

export interface Ad {
  id: string
  title: string
  description?: string
  image: string
  link?: string
  buttonText?: string
  position: 'homepage-top' | 'homepage-middle' | 'products-top' | 'products-sidebar' | 'cart-bottom'
  active: boolean
  order: number
  startDate?: string
  endDate?: string
}

export interface VisitorStats {
  date: string
  visitors: number
  pageViews: number
}

export interface Analytics {
  totalVisitors: number
  totalOrders: number
  totalRevenue: number
  conversionRate: number
  visitorStats: VisitorStats[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  productCount: number
}
