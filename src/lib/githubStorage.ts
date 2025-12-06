/**
 * GitHub-based storage for static site deployment
 * Fetches data from GitHub repository for real-time updates visible to all users
 */

const GITHUB_OWNER = 'Kiyu-hub'
const GITHUB_REPO = 'tasly-blink'
const GITHUB_BRANCH = 'main'

const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/src/data`

interface GitHubStorageConfig {
  useGitHub: boolean // Toggle between localStorage (dev) and GitHub (production)
  cacheDuration: number // Cache duration in milliseconds
}

const config: GitHubStorageConfig = {
  useGitHub: import.meta.env.PROD, // Use GitHub in production, localStorage in development
  cacheDuration: 5 * 60 * 1000, // 5 minutes cache
}

// Cache to avoid excessive API calls
const cache = new Map<string, { data: any; timestamp: number }>()

/**
 * Fetch data from GitHub with caching
 */
async function fetchFromGitHub<T>(filename: string): Promise<T | null> {
  try {
    // Check cache first
    const cached = cache.get(filename)
    if (cached && Date.now() - cached.timestamp < config.cacheDuration) {
      return cached.data as T
    }

    const url = `${GITHUB_BASE_URL}/${filename}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`Failed to fetch ${filename} from GitHub:`, response.statusText)
      return null
    }

    const data = await response.json()
    
    // Update cache
    cache.set(filename, { data, timestamp: Date.now() })
    
    return data as T
  } catch (error) {
    console.error(`Error fetching ${filename} from GitHub:`, error)
    return null
  }
}

/**
 * Get products from GitHub or localStorage
 */
export async function getProductsFromGitHub() {
  if (!config.useGitHub) {
    // Development mode: use localStorage
    const stored = localStorage.getItem('tasly_products')
    return stored ? JSON.parse(stored) : null
  }

  // Production mode: fetch from GitHub
  return await fetchFromGitHub('products.json')
}

/**
 * Get site info from GitHub or localStorage
 */
export async function getSiteInfoFromGitHub() {
  if (!config.useGitHub) {
    // Development mode: use localStorage
    const stored = localStorage.getItem('tasly_site_info')
    return stored ? JSON.parse(stored) : null
  }

  // Production mode: fetch from GitHub
  return await fetchFromGitHub('siteInfo.json')
}

/**
 * Clear cache (useful for forcing refresh)
 */
export function clearGitHubCache() {
  cache.clear()
}

/**
 * Check if using GitHub storage
 */
export function isUsingGitHub() {
  return config.useGitHub
}
