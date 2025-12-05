import type { Product, SiteInfo, Order, Review, Banner } from '@/types'
import { generateId, slugify } from './utils'

const PRODUCTS_KEY = 'tasly_products'
const SITE_INFO_KEY = 'tasly_site_info'
const ORDERS_KEY = 'tasly_orders'
const REVIEWS_KEY = 'tasly_reviews'
const BANNERS_KEY = 'tasly_banners'

const defaultProducts: Product[] = [
  {
    id: '1',
    slug: 'danshen-plus',
    name: 'Danshen Plus',
    description: 'Premium cardiovascular support formula with Danshen root extract. Supports healthy blood circulation and heart function.',
    longDescription: 'Danshen Plus is a scientifically formulated supplement that combines the traditional benefits of Danshen (Salvia miltiorrhiza) with modern extraction technology. This premium formula supports cardiovascular health, promotes healthy blood circulation, and helps maintain optimal heart function.',
    price: 450,
    originalPrice: 520,
    discount: 13,
    imageURL: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    ],
    category: 'Heart Health',
    stock: 50,
    rating: 4.8,
    reviewCount: 124,
    tags: ['cardiovascular', 'circulation', 'heart'],
    benefits: ['Supports heart health', 'Promotes blood circulation', 'Natural ingredients'],
    featured: true,
    bestSeller: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    slug: 'vitality-essence',
    name: 'Vitality Essence',
    description: 'Natural energy booster and immune system strengthener. Perfect for daily wellness support.',
    longDescription: 'Vitality Essence is a comprehensive wellness supplement designed to boost your natural energy levels and strengthen your immune system. Made with carefully selected natural ingredients.',
    price: 380,
    imageURL: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    category: 'Immunity',
    stock: 35,
    rating: 4.6,
    reviewCount: 89,
    tags: ['energy', 'immunity', 'wellness'],
    benefits: ['Boosts energy', 'Strengthens immunity', 'Daily wellness'],
    featured: true,
    new: true,
    createdAt: '2024-06-01',
  },
  {
    id: '3',
    slug: 'brain-power-max',
    name: 'Brain Power Max',
    description: 'Advanced cognitive support formula with Ginkgo Biloba and essential nutrients for mental clarity.',
    longDescription: 'Brain Power Max is specially formulated to support cognitive function, enhance mental clarity, and promote brain health. Contains premium Ginkgo Biloba extract and essential nutrients.',
    price: 520,
    originalPrice: 600,
    discount: 13,
    imageURL: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800&q=80',
    category: 'Brain Health',
    stock: 25,
    rating: 4.9,
    reviewCount: 156,
    tags: ['cognitive', 'memory', 'focus'],
    benefits: ['Enhances mental clarity', 'Supports memory', 'Improves focus'],
    bestSeller: true,
    createdAt: '2024-02-20',
  },
  {
    id: '4',
    slug: 'liver-cleanse-pro',
    name: 'Liver Cleanse Pro',
    description: 'Gentle yet effective liver detox formula with milk thistle and natural herbs.',
    price: 350,
    imageURL: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    category: 'Liver Health',
    stock: 40,
    rating: 4.7,
    reviewCount: 78,
    tags: ['liver', 'detox', 'cleanse'],
    createdAt: '2024-03-10',
  },
  {
    id: '5',
    slug: 'joint-flex-gold',
    name: 'Joint Flex Gold',
    description: 'Premium joint support formula with glucosamine and chondroitin for flexible, healthy joints.',
    price: 480,
    imageURL: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&q=80',
    category: 'Joint Health',
    stock: 30,
    rating: 4.5,
    reviewCount: 92,
    featured: true,
    createdAt: '2024-04-05',
  },
  {
    id: '6',
    slug: 'digestive-harmony',
    name: 'Digestive Harmony',
    description: 'Probiotic blend for optimal gut health and digestive comfort.',
    price: 290,
    imageURL: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    category: 'Digestive Health',
    stock: 60,
    rating: 4.6,
    reviewCount: 103,
    new: true,
    createdAt: '2024-07-15',
  },
  {
    id: '7',
    slug: 'womens-vitality',
    name: "Women's Vitality",
    description: 'Comprehensive wellness formula specially designed for women. Supports hormonal balance and overall health.',
    price: 420,
    imageURL: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    category: "Women's Health",
    stock: 45,
    rating: 4.8,
    reviewCount: 67,
    createdAt: '2024-05-20',
  },
  {
    id: '8',
    slug: 'mens-strength-formula',
    name: "Men's Strength Formula",
    description: 'Power-packed supplement for men. Supports energy, vitality, and overall masculine health.',
    price: 450,
    imageURL: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80',
    category: "Men's Health",
    stock: 38,
    rating: 4.7,
    reviewCount: 54,
    createdAt: '2024-05-25',
  },
  {
    id: '9',
    slug: 'sleep-well-plus',
    name: 'Sleep Well Plus',
    description: 'Natural sleep support with melatonin and calming herbs for restful nights.',
    price: 280,
    originalPrice: 320,
    discount: 12,
    imageURL: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
    category: 'Sleep & Relaxation',
    stock: 55,
    rating: 4.4,
    reviewCount: 88,
    createdAt: '2024-06-10',
  },
  {
    id: '10',
    slug: 'immune-shield-ultra',
    name: 'Immune Shield Ultra',
    description: 'Maximum strength immune support with Vitamin C, Zinc, and Elderberry.',
    price: 360,
    imageURL: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
    category: 'Immunity',
    stock: 70,
    rating: 4.9,
    reviewCount: 201,
    bestSeller: true,
    featured: true,
    createdAt: '2024-01-20',
  },
  {
    id: '11',
    slug: 'blood-sugar-balance',
    name: 'Blood Sugar Balance',
    description: 'Natural support for healthy blood sugar levels with Berberine and Chromium.',
    price: 400,
    imageURL: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    category: 'Blood Sugar',
    stock: 42,
    rating: 4.6,
    reviewCount: 76,
    createdAt: '2024-04-15',
  },
  {
    id: '12',
    slug: 'vision-care-complete',
    name: 'Vision Care Complete',
    description: 'Comprehensive eye health formula with Lutein, Zeaxanthin, and Bilberry.',
    price: 380,
    imageURL: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    category: 'Eye Health',
    stock: 28,
    rating: 4.5,
    reviewCount: 45,
    new: true,
    createdAt: '2024-08-01',
  },
]

const defaultSiteInfo: SiteInfo = {
  name: 'Tasly Ghana',
  tagline: 'Your Trusted Health Partner',
  description: 'Premium health supplements for your wellness journey',
  email: 'info@taslyghana.com',
  phone: '+233 20 000 0000',
  whatsapp: '233200000000',
  address: '123 Health Street, Osu, Accra, Ghana',
  announcement: '',
  currency: 'GH₵',
  freeShippingThreshold: 500,
  socialMedia: {
    facebook: 'https://facebook.com/taslyghana',
    instagram: 'https://instagram.com/taslyghana',
    twitter: 'https://twitter.com/taslyghana',
    youtube: 'https://youtube.com/@taslyghana',
  },
  shippingInfo: 'We deliver across Ghana within 2-5 business days. Same-day delivery available in Accra.',
  returnPolicy: 'We accept returns within 14 days for unopened products. Contact us for easy returns.',
}

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    productId: '1',
    userId: 'user-1',
    userName: 'Kwame Mensah',
    rating: 5,
    comment: 'Excellent product! I have been using Danshen Plus for 3 months and my blood pressure has stabilized. Highly recommend!',
    createdAt: '2024-10-15',
    helpful: 24,
  },
  {
    id: 'rev-2',
    productId: '1',
    userId: 'user-2',
    userName: 'Akosua Frimpong',
    rating: 4,
    comment: 'Good quality product. Delivery was fast and packaging was secure.',
    createdAt: '2024-10-10',
    helpful: 12,
  },
  {
    id: 'rev-3',
    productId: '3',
    userId: 'user-3',
    userName: 'Kofi Asante',
    rating: 5,
    comment: 'Brain Power Max is amazing! My focus and concentration have improved significantly since I started taking it.',
    createdAt: '2024-11-01',
    helpful: 18,
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
