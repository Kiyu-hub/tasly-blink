import type { Product, SiteInfo, Order, Review, Banner } from '@/types'
import { generateId, slugify } from './utils'
import productsData from '@/data/products.json'
import siteInfoData from '@/data/siteInfo.json'

const PRODUCTS_KEY = 'tasly_products'
const SITE_INFO_KEY = 'tasly_site_info'
const ORDERS_KEY = 'tasly_orders'
const REVIEWS_KEY = 'tasly_reviews'
const BANNERS_KEY = 'tasly_banners'

const defaultProducts: Product[] = productsData as Product[]

const defaultSiteInfo: SiteInfo = {
  name: siteInfoData.name,
  tagline: siteInfoData.tagline,
  description: siteInfoData.description,
  email: siteInfoData.contactEmail,
  phone: siteInfoData.contactPhone,
  whatsapp: siteInfoData.whatsapp,
  address: siteInfoData.address,
  announcement: siteInfoData.announcement,
  currency: siteInfoData.currency,
  freeShippingThreshold: siteInfoData.freeShippingThreshold,
  socialMedia: siteInfoData.socialMedia,
  shippingInfo: siteInfoData.shippingInfo,
  returnPolicy: siteInfoData.returnPolicy,
}

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    productId: '2',
    userId: 'user-1',
    userName: 'Kwame Mensah',
    rating: 5,
    comment: 'Tasly Danshen Plus has been a lifesaver! My blood circulation has improved and I feel much healthier. Highly recommend for heart health.',
    createdAt: '2024-10-15',
    helpful: 32,
  },
  {
    id: 'rev-2',
    productId: '1',
    userId: 'user-2',
    userName: 'Akosua Frimpong',
    rating: 5,
    comment: 'The Cordyceps Capsule has boosted my energy levels significantly. I no longer feel tired during the day. Great product!',
    createdAt: '2024-10-10',
    helpful: 24,
  },
  {
    id: 'rev-3',
    productId: '3',
    userId: 'user-3',
    userName: 'Kofi Asante',
    rating: 4,
    comment: 'Propolis Syrup helped my family during flu season. Good taste and effective immunity boost.',
    createdAt: '2024-11-01',
    helpful: 18,
  },
  {
    id: 'rev-4',
    productId: '4',
    userId: 'user-4',
    userName: 'Ama Owusu',
    rating: 5,
    comment: 'Ginseng Royal Jelly gives me sustained energy throughout the day without any jitters. Love it!',
    createdAt: '2024-11-05',
    helpful: 15,
  },
  {
    id: 'rev-5',
    productId: '5',
    userId: 'user-5',
    userName: 'Yaw Boateng',
    rating: 5,
    comment: 'Gynostemma Tea has a pleasant taste and I feel healthier since I started drinking it daily. Good for metabolism.',
    createdAt: '2024-11-08',
    helpful: 12,
  },
]

export function initializeData(): void {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts))
  }
  if (!localStorage.getItem(SITE_INFO_KEY)) {
    localStorage.setItem(SITE_INFO_KEY, JSON.stringify(defaultSiteInfo))
  }
  if (!localStorage.getItem(REVIEWS_KEY)) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(defaultReviews))
  }
}

// Products
export function getProducts(): Product[] {
  const data = localStorage.getItem(PRODUCTS_KEY)
  return data ? JSON.parse(data) : defaultProducts
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts()
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts()
  return products.find((p) => p.id === id)
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function addProduct(product: Omit<Product, 'id' | 'slug' | 'createdAt'>): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: generateId(),
    slug: slugify(product.name),
    createdAt: new Date().toISOString(),
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null
  
  products[index] = { 
    ...products[index], 
    ...updates,
    slug: updates.name ? slugify(updates.name) : products[index].slug,
  }
  saveProducts(products)
  return products[index]
}

export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length === products.length) return false
  saveProducts(filtered)
  return true
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured)
}

export function getBestSellers(): Product[] {
  return getProducts().filter((p) => p.bestSeller)
}

export function getNewProducts(): Product[] {
  return getProducts().filter((p) => p.new)
}

export function getCategories(): string[] {
  const products = getProducts()
  return [...new Set(products.map((p) => p.category))]
}

// Site Info
export function getSiteInfo(): SiteInfo {
  const data = localStorage.getItem(SITE_INFO_KEY)
  return data ? JSON.parse(data) : defaultSiteInfo
}

export function saveSiteInfo(info: SiteInfo): void {
  localStorage.setItem(SITE_INFO_KEY, JSON.stringify(info))
}

// Orders
export function getOrders(): Order[] {
  const data = localStorage.getItem(ORDERS_KEY)
  return data ? JSON.parse(data) : []
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id)
}

export function saveOrder(order: Order): void {
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function updateOrderStatus(id: string, status: Order['status']): void {
  const orders = getOrders()
  const index = orders.findIndex((o) => o.id === id)
  if (index !== -1) {
    orders[index].status = status
    orders[index].updatedAt = new Date().toISOString()
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }
}

// Reviews
export function getReviews(): Review[] {
  const data = localStorage.getItem(REVIEWS_KEY)
  return data ? JSON.parse(data) : []
}

export function getProductReviews(productId: string): Review[] {
  return getReviews().filter((r) => r.productId === productId)
}

export function addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Review {
  const reviews = getReviews()
  const newReview: Review = {
    ...review,
    id: generateId(),
    createdAt: new Date().toISOString(),
    helpful: 0,
  }
  reviews.push(newReview)
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
  return newReview
}

// Banners
export function getBanners(): Banner[] {
  const data = localStorage.getItem(BANNERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveBanners(banners: Banner[]): void {
  localStorage.setItem(BANNERS_KEY, JSON.stringify(banners))
}
