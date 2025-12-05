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
  aboutUs: siteInfoData.aboutUs,
  email: siteInfoData.contactEmail,
  phone: siteInfoData.contactPhone,
  whatsapp: siteInfoData.whatsapp,
  address: siteInfoData.address,
  businessHours: siteInfoData.businessHours,
  announcement: siteInfoData.announcement,
  showAnnouncement: siteInfoData.showAnnouncement,
  currency: siteInfoData.currency,
  freeShippingThreshold: siteInfoData.freeShippingThreshold,
  deliveryFee: siteInfoData.deliveryFee,
  socialMedia: siteInfoData.socialMedia,
  socialMediaDisplay: siteInfoData.socialMediaDisplay,
  shippingInfo: siteInfoData.shippingInfo,
  returnPolicy: siteInfoData.returnPolicy,
  missionStatement: siteInfoData.missionStatement,
  visionStatement: siteInfoData.visionStatement,
  coreValues: siteInfoData.coreValues,
  certifications: siteInfoData.certifications,
  paymentMethods: siteInfoData.paymentMethods,
  deliveryLocations: siteInfoData.deliveryLocations,
  faqs: siteInfoData.faqs,
  manager: siteInfoData.manager,
}

// Dynamic review templates for generating realistic reviews
const reviewTemplates = [
  {
    names: ['Kwame Mensah', 'Kofi Asante', 'Yaw Boateng', 'Kwabena Osei', 'Kojo Appiah'],
    comments: [
      'Excellent product! I\'ve been using this for {weeks} weeks and the results are amazing. Highly recommend!',
      'Very effective product. I noticed improvements within {weeks} weeks of use. Great quality!',
      'This has become part of my daily routine. After {weeks} weeks, I can definitely feel the difference.',
      'Authentic Tasly product. Been using it for {weeks} weeks and very satisfied with the results.',
      'Great product! {weeks} weeks in and I\'m seeing positive changes. Will continue using it.'
    ]
  },
  {
    names: ['Akosua Frimpong', 'Ama Owusu', 'Abena Mensah', 'Adwoa Asante', 'Afia Boateng'],
    comments: [
      'Love this product! After {weeks} weeks of consistent use, I feel much better. Highly recommended!',
      'Genuine Tasly product. I\'ve been taking this for {weeks} weeks and it really works!',
      'Very pleased with this purchase. {weeks} weeks later and I can see real improvements.',
      'This product exceeded my expectations. Been using for {weeks} weeks with great results!',
      'Excellent quality! After {weeks} weeks I\'m very happy with the outcome. Worth every cedi!'
    ]
  }
]

function generateProductReviews(productId: string, count: number = 3): Review[] {
  const reviews: Review[] = []
  const usedComments = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    const template = reviewTemplates[i % 2]
    const nameIndex = Math.floor(Math.random() * template.names.length)
    let commentIndex = Math.floor(Math.random() * template.comments.length)
    
    // Ensure unique comments
    while (usedComments.has(`${template.names[nameIndex]}-${commentIndex}`)) {
      commentIndex = (commentIndex + 1) % template.comments.length
    }
    usedComments.add(`${template.names[nameIndex]}-${commentIndex}`)
    
    const weeks = 2 + Math.floor(Math.random() * 10) // 2-11 weeks
    const comment = template.comments[commentIndex].replace('{weeks}', weeks.toString())
    const rating = Math.random() > 0.3 ? 5 : 4 // 70% get 5 stars, 30% get 4 stars
    
    // Generate date within last 90 days
    const daysAgo = Math.floor(Math.random() * 90)
    const reviewDate = new Date()
    reviewDate.setDate(reviewDate.getDate() - daysAgo)
    
    reviews.push({
      id: `rev-${productId}-${i + 1}`,
      productId,
      userId: `user-${productId}-${i + 1}`,
      userName: template.names[nameIndex],
      rating,
      comment,
      createdAt: reviewDate.toISOString().split('T')[0],
      helpful: Math.floor(Math.random() * 30) + 5, // 5-34 helpful votes
    })
  }
  
  return reviews
}

// Generate initial reviews for all products
function initializeProductReviews(): Review[] {
  const allReviews: Review[] = []
  const products = defaultProducts
  
  products.forEach((product) => {
    // Generate 2-4 reviews per product
    const reviewCount = 2 + Math.floor(Math.random() * 3)
    const productReviews = generateProductReviews(product.id, reviewCount)
    allReviews.push(...productReviews)
  })
  
  return allReviews
}

export function initializeData(): void {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts))
  }
  if (!localStorage.getItem(SITE_INFO_KEY)) {
    localStorage.setItem(SITE_INFO_KEY, JSON.stringify(defaultSiteInfo))
  }
  if (!localStorage.getItem(REVIEWS_KEY)) {
    const initialReviews = initializeProductReviews()
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviews))
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
