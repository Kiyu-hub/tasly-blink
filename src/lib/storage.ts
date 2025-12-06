import type { Product, SiteInfo, Order, Review, Banner, CategoryData, Ad, Analytics, VisitorStats } from '@/types'
import { generateId, slugify } from './utils'
import { syncProductsToGitHub, syncSiteInfoToGitHub } from './githubSync'
import productsData from '@/data/products.json'
import siteInfoData from '@/data/siteInfo.json'

// GitHub configuration for production deployments
const GITHUB_OWNER = 'Kiyu-hub'
const GITHUB_REPO = 'tasly-blink'
const GITHUB_BRANCH = 'main'
const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/src/data`
const USE_GITHUB = import.meta.env.PROD // Use GitHub in production, local files in development

const PRODUCTS_KEY = 'tasly_products'
const SITE_INFO_KEY = 'tasly_site_info'
const ORDERS_KEY = 'tasly_orders'
const REVIEWS_KEY = 'tasly_reviews'
const BANNERS_KEY = 'tasly_banners'
const CATEGORIES_KEY = 'tasly_categories'
const ADS_KEY = 'tasly_ads'
const VISITOR_STATS_KEY = 'tasly_visitor_stats'

// Cache for GitHub data (5 minutes)
const githubCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000

async function fetchFromGitHub<T>(filename: string): Promise<T | null> {
  try {
    // Check cache
    const cached = githubCache.get(filename)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T
    }

    const url = `${GITHUB_BASE_URL}/${filename}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${filename} from GitHub, using fallback`)
      return null
    }

    const data = await response.json()
    githubCache.set(filename, { data, timestamp: Date.now() })
    
    return data as T
  } catch (error) {
    console.warn(`Error fetching ${filename} from GitHub:`, error)
    return null
  }
}

const defaultProducts: Product[] = productsData as Product[]

const defaultSiteInfo: SiteInfo = {
  name: siteInfoData.name,
  tagline: siteInfoData.tagline,
  description: siteInfoData.description,
  aboutUs: siteInfoData.aboutUs,
  email: siteInfoData.contactEmail,
  phone: siteInfoData.contactPhone,
  whatsapp: siteInfoData.whatsapp,
  whatsappCommunityLink: siteInfoData.whatsappCommunityLink || '',
  address: siteInfoData.address,
  businessHours: siteInfoData.businessHours,
  announcement: siteInfoData.announcement,
  showAnnouncement: siteInfoData.showAnnouncement,
  currency: siteInfoData.currency,
  freeDeliveryThreshold: siteInfoData.freeDeliveryThreshold,
  deliveryFee: siteInfoData.deliveryFee,
  socialMedia: siteInfoData.socialMedia,
  socialMediaDisplay: siteInfoData.socialMediaDisplay,
  deliveryInfo: siteInfoData.deliveryInfo,
  returnPolicy: siteInfoData.returnPolicy,
  missionStatement: siteInfoData.missionStatement,
  visionStatement: siteInfoData.visionStatement,
  ourStory: siteInfoData.ourStory,
  coreValues: siteInfoData.coreValues,
  stats: siteInfoData.stats,
  healthBanners: siteInfoData.healthBanners,
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

// Initialize data from localStorage or GitHub
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
  
  // In production, fetch fresh data from GitHub
  if (USE_GITHUB) {
    loadFromGitHub()
  }
}

// Load data from GitHub (production only)
async function loadFromGitHub(): Promise<void> {
  try {
    // Fetch products
    const products = await fetchFromGitHub<Product[]>('products.json')
    if (products) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }))
    }

    // Fetch site info
    const siteInfoRaw = await fetchFromGitHub<any>('siteInfo.json')
    if (siteInfoRaw) {
      const siteInfo: SiteInfo = {
        name: siteInfoRaw.name,
        tagline: siteInfoRaw.tagline,
        description: siteInfoRaw.description,
        aboutUs: siteInfoRaw.aboutUs,
        email: siteInfoRaw.contactEmail,
        phone: siteInfoRaw.contactPhone,
        whatsapp: siteInfoRaw.whatsapp,
        whatsappCommunityLink: siteInfoRaw.whatsappCommunityLink,
        address: siteInfoRaw.address,
        businessHours: siteInfoRaw.businessHours,
        announcement: siteInfoRaw.announcement,
        showAnnouncement: siteInfoRaw.showAnnouncement,
        currency: siteInfoRaw.currency,
        freeDeliveryThreshold: siteInfoRaw.freeDeliveryThreshold,
        deliveryFee: siteInfoRaw.deliveryFee,
        socialMedia: siteInfoRaw.socialMedia,
        socialMediaDisplay: siteInfoRaw.socialMediaDisplay,
        deliveryInfo: siteInfoRaw.deliveryInfo,
        returnPolicy: siteInfoRaw.returnPolicy,
        missionStatement: siteInfoRaw.missionStatement,
        visionStatement: siteInfoRaw.visionStatement,
        ourStory: siteInfoRaw.ourStory,
        coreValues: siteInfoRaw.coreValues,
        stats: siteInfoRaw.stats,
        healthBanners: siteInfoRaw.healthBanners,
        certifications: siteInfoRaw.certifications,
        paymentMethods: siteInfoRaw.paymentMethods,
        deliveryLocations: siteInfoRaw.deliveryLocations,
        faqs: siteInfoRaw.faqs,
        manager: siteInfoRaw.manager,
      }
      localStorage.setItem(SITE_INFO_KEY, JSON.stringify(siteInfo))
      window.dispatchEvent(new CustomEvent('siteInfoUpdated', { detail: siteInfo }))
    }

    console.log('✅ Data loaded from GitHub repository')
  } catch (error) {
    console.warn('Failed to load from GitHub, using local data:', error)
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
  window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }))
  
  // Sync to GitHub if enabled (async, non-blocking)
  syncProductsToGitHub(products).catch(error => {
    console.error('Failed to sync products to GitHub:', error)
  })
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
  window.dispatchEvent(new CustomEvent('siteInfoUpdated', { detail: info }))
  
  // Sync to GitHub if enabled (async, non-blocking)
  syncSiteInfoToGitHub(info).catch(error => {
    console.error('Failed to sync site info to GitHub:', error)
  })
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
  window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: banners }))
}

// Categories
export function getCategoriesData(): CategoryData[] {
  const data = localStorage.getItem(CATEGORIES_KEY)
  if (data) {
    return JSON.parse(data)
  }
  
  // Generate default categories from products
  const products = getProducts()
  const categoryNames = [...new Set(products.map((p) => p.category))]
  const categoryMap = new Map<string, number>()
  
  products.forEach(product => {
    const count = categoryMap.get(product.category) || 0
    categoryMap.set(product.category, count + 1)
  })
  
  const defaultCategories: CategoryData[] = categoryNames.map((name, index) => ({
    id: generateId(),
    name,
    slug: slugify(name),
    description: `Explore our ${name.toLowerCase()} collection`,
    image: getDefaultCategoryImage(name),
    color: getDefaultCategoryColor(name),
    order: index,
    visible: true,
    productCount: categoryMap.get(name) || 0,
  }))
  
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories))
  return defaultCategories
}

function getDefaultCategoryImage(categoryName: string): string {
  const imageMap: Record<string, string> = {
    'Cardiovascular Health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
    'Immune Support': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    'Digestive Health': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    'Respiratory Health': 'https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=400',
    'Energy & Vitality': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    'Joint & Bone Health': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    'Liver Health': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
    'Anti-Aging': 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
    'Weight Management': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    'Brain Health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    'Sleep Support': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
    'Skin Health': 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
  }
  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400'
}

function getDefaultCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    'Cardiovascular Health': 'from-rose-500 to-red-600',
    'Immune Support': 'from-emerald-500 to-green-600',
    'Digestive Health': 'from-amber-500 to-orange-600',
    'Respiratory Health': 'from-cyan-500 to-blue-600',
    'Energy & Vitality': 'from-yellow-500 to-orange-600',
    'Joint & Bone Health': 'from-slate-500 to-gray-600',
    'Liver Health': 'from-lime-500 to-green-600',
    'Anti-Aging': 'from-purple-500 to-pink-600',
    'Weight Management': 'from-indigo-500 to-purple-600',
    'Brain Health': 'from-violet-500 to-purple-600',
    'Sleep Support': 'from-blue-500 to-indigo-600',
    'Skin Health': 'from-pink-500 to-rose-600',
  }
  return colorMap[categoryName] || 'from-gray-500 to-slate-600'
}

export function saveCategoriesData(categories: CategoryData[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  window.dispatchEvent(new CustomEvent('categoriesUpdated', { detail: categories }))
}

export function addCategoryData(category: Omit<CategoryData, 'id' | 'slug' | 'productCount'>): CategoryData {
  const categories = getCategoriesData()
  const newCategory: CategoryData = {
    ...category,
    id: generateId(),
    slug: slugify(category.name),
    productCount: 0,
  }
  categories.push(newCategory)
  saveCategoriesData(categories)
  return newCategory
}

export function updateCategoryData(id: string, updates: Partial<CategoryData>): CategoryData | null {
  const categories = getCategoriesData()
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return null
  
  categories[index] = {
    ...categories[index],
    ...updates,
    slug: updates.name ? slugify(updates.name) : categories[index].slug,
  }
  saveCategoriesData(categories)
  return categories[index]
}

export function deleteCategoryData(id: string): boolean {
  const categories = getCategoriesData()
  const category = categories.find((c) => c.id === id)
  if (!category) return false
  
  // Check if any products use this category
  const products = getProducts()
  const hasProducts = products.some((p) => p.category === category.name)
  
  if (hasProducts) {
    return false // Cannot delete category with products
  }
  
  const filtered = categories.filter((c) => c.id !== id)
  saveCategoriesData(filtered)
  return true
}

export function updateCategoryProductCounts(): void {
  const categories = getCategoriesData()
  const products = getProducts()
  const categoryMap = new Map<string, number>()
  
  products.forEach(product => {
    const count = categoryMap.get(product.category) || 0
    categoryMap.set(product.category, count + 1)
  })
  
  categories.forEach(category => {
    category.productCount = categoryMap.get(category.name) || 0
  })
  
  saveCategoriesData(categories)
}

// Ads
export function getAds(): Ad[] {
  const data = localStorage.getItem(ADS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveAds(ads: Ad[]): void {
  localStorage.setItem(ADS_KEY, JSON.stringify(ads))
  window.dispatchEvent(new CustomEvent('adsUpdated', { detail: ads }))
}

export function addAd(ad: Omit<Ad, 'id'>): Ad {
  const ads = getAds()
  const newAd: Ad = {
    ...ad,
    id: generateId(),
  }
  ads.push(newAd)
  saveAds(ads)
  return newAd
}

export function updateAd(id: string, updates: Partial<Ad>): Ad | null {
  const ads = getAds()
  const index = ads.findIndex((a) => a.id === id)
  if (index === -1) return null
  
  ads[index] = { ...ads[index], ...updates }
  saveAds(ads)
  return ads[index]
}

export function deleteAd(id: string): boolean {
  const ads = getAds()
  const filtered = ads.filter((a) => a.id !== id)
  if (filtered.length === ads.length) return false
  saveAds(filtered)
  return true
}

export function getActiveAdsByPosition(position: Ad['position']): Ad[] {
  const ads = getAds()
  const now = new Date()
  
  return ads
    .filter((ad) => {
      if (!ad.active || ad.position !== position) return false
      
      // Check date range if specified
      if (ad.startDate && new Date(ad.startDate) > now) return false
      if (ad.endDate && new Date(ad.endDate) < now) return false
      
      return true
    })
    .sort((a, b) => a.order - b.order)
}

// Analytics & Visitor Tracking
export function trackPageView(): void {
  const today = new Date().toISOString().split('T')[0]
  const stats = getVisitorStats()
  
  const todayStats = stats.find((s) => s.date === today)
  if (todayStats) {
    todayStats.pageViews++
  } else {
    stats.push({
      date: today,
      visitors: 1,
      pageViews: 1,
    })
  }
  
  // Keep only last 90 days
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const filtered = stats.filter((s) => new Date(s.date) >= ninetyDaysAgo)
  
  localStorage.setItem(VISITOR_STATS_KEY, JSON.stringify(filtered))
}

export function trackVisitor(): void {
  const today = new Date().toISOString().split('T')[0]
  const lastVisit = localStorage.getItem('tasly_last_visit')
  
  // Only count as new visitor if hasn't visited today
  if (lastVisit !== today) {
    const stats = getVisitorStats()
    const todayStats = stats.find((s) => s.date === today)
    
    if (todayStats) {
      todayStats.visitors++
    } else {
      stats.push({
        date: today,
        visitors: 1,
        pageViews: 1,
      })
    }
    
    localStorage.setItem(VISITOR_STATS_KEY, JSON.stringify(stats))
    localStorage.setItem('tasly_last_visit', today)
  }
}

function getVisitorStats(): VisitorStats[] {
  const data = localStorage.getItem(VISITOR_STATS_KEY)
  return data ? JSON.parse(data) : []
}

export function getAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Analytics {
  const stats = getVisitorStats()
  const orders = getOrders()
  
  // Calculate date range
  const now = new Date()
  const startDate = new Date()
  
  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'weekly':
      startDate.setDate(now.getDate() - 7)
      break
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1)
      break
  }
  
  // Filter stats by period
  const periodStats = stats.filter((s) => new Date(s.date) >= startDate)
  
  // Calculate totals
  const totalVisitors = periodStats.reduce((sum, s) => sum + s.visitors, 0)
  
  // Filter orders by period
  const periodOrders = orders.filter((o) => new Date(o.createdAt) >= startDate)
  const totalOrders = periodOrders.length
  const totalRevenue = periodOrders.reduce((sum, o) => sum + o.total, 0)
  
  // Calculate conversion rate
  const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0
  
  return {
    totalVisitors,
    totalOrders,
    totalRevenue,
    conversionRate,
    visitorStats: periodStats,
  }
}
