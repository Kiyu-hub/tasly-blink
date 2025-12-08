/**
 * GitHub Sync Integration
 * 
 * This module handles automatic syncing of admin panel changes to the GitHub repository.
 * When admin saves changes, they are committed to the repository so all users see updates.
 * 
 * CROSS-DEVICE TOKEN STORAGE:
 * - Token is encrypted and stored in GitHub repository (adminConfig.json)
 * - Accessible across all devices after secondary password verification
 * - Secondary password required to enable sync (star button)
 */

import type { Product, SiteInfo } from '@/types'
import { encryptToken, decryptToken, isSyncEnabled } from './encryption'

const GITHUB_OWNER = 'Kiyu-hub'
const GITHUB_REPO = 'tasly-blink'
const GITHUB_BRANCH = 'main'
const ADMIN_CONFIG_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/src/data/adminConfig.json`

// GitHub Personal Access Token
let GITHUB_TOKEN: string | null = null

/**
 * Load token from GitHub repository (cross-device)
 */
export async function loadTokenFromGitHub(): Promise<string | null> {
  try {
    const response = await fetch(ADMIN_CONFIG_URL)
    if (!response.ok) return null
    
    const config = await response.json()
    if (config.encryptedToken) {
      const decrypted = decryptToken(config.encryptedToken)
      if (decrypted) {
        GITHUB_TOKEN = decrypted
        localStorage.setItem('github_token', decrypted)
        return decrypted
      }
    }
  } catch (error) {
    console.warn('Failed to load token from GitHub:', error)
  }
  return null
}

/**
 * Save encrypted token to GitHub repository (cross-device)
 */
async function saveTokenToGitHub(token: string): Promise<boolean> {
  if (!token) return false
  
  try {
    const encrypted = encryptToken(token)
    const config = {
      encryptedToken: encrypted,
      syncEnabled: true,
      lastUpdated: new Date().toISOString()
    }
    
    const content = JSON.stringify(config, null, 2)
    return await commitFile('src/data/adminConfig.json', content, 'Update admin configuration')
  } catch (error) {
    console.error('Failed to save token to GitHub:', error)
    return false
  }
}

/**
 * Set the GitHub Personal Access Token
 * This should be called when the admin configures their token
 */
export async function setGitHubToken(token: string): Promise<void> {
  GITHUB_TOKEN = token
  localStorage.setItem('github_token', token)
  
  // If sync is enabled, save to GitHub for cross-device access
  if (isSyncEnabled()) {
    await saveTokenToGitHub(token)
  }
}

/**
 * Get the stored GitHub token
 */
export function getGitHubToken(): string | null {
  if (GITHUB_TOKEN) return GITHUB_TOKEN
  GITHUB_TOKEN = localStorage.getItem('github_token')
  return GITHUB_TOKEN
}

/**
 * Check if GitHub sync is configured
 */
export function isGitHubSyncEnabled(): boolean {
  return getGitHubToken() !== null && isSyncEnabled()
}

/**
 * Interface for GitHub file content API
 */
interface GitHubFileResponse {
  sha: string
  content: string
  encoding: string
}

/**
 * Get the current SHA of a file in the repository
 * Required by GitHub API for updates
 */
async function getFileSha(path: string): Promise<string | null> {
  const token = getGitHubToken()
  if (!token) return null

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      console.error('Failed to get file SHA:', response.statusText)
      return null
    }

    const data: GitHubFileResponse = await response.json()
    return data.sha
  } catch (error) {
    console.error('Error fetching file SHA:', error)
    return null
  }
}

/**
 * Commit a file to the GitHub repository
 */
async function commitFile(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  const token = getGitHubToken()
  if (!token) {
    console.warn('GitHub token not configured. Cannot sync to repository.')
    return false
  }

  try {
    // Get the current file SHA (required for updates)
    const sha = await getFileSha(path)
    if (!sha) {
      console.error('Could not get file SHA. File may not exist or token may be invalid.')
      return false
    }

    // Encode content to base64
    const encodedContent = btoa(unescape(encodeURIComponent(content)))

    // Commit the file
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: encodedContent,
          sha,
          branch: GITHUB_BRANCH,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Failed to commit file:', errorData)
      return false
    }

    console.log(`Successfully committed ${path} to GitHub`)
    return true
  } catch (error) {
    console.error('Error committing to GitHub:', error)
    return false
  }
}

/**
 * Sync products to GitHub repository
 */
export async function syncProductsToGitHub(products: Product[]): Promise<boolean> {
  if (!isGitHubSyncEnabled()) {
    console.warn('GitHub sync not enabled. Changes saved locally only.')
    return false
  }

  const content = JSON.stringify(products, null, 2)
  const message = `Update products via admin panel (${new Date().toISOString()})`
  
  return await commitFile('src/data/products.json', content, message)
}

/**
 * Transform SiteInfo back to the raw format used in GitHub
 */
function transformSiteInfoToRaw(siteInfo: SiteInfo): Record<string, unknown> {
  return {
    name: siteInfo.name,
    tagline: siteInfo.tagline,
    description: siteInfo.description,
    aboutUs: siteInfo.aboutUs,
    logo: siteInfo.logo,
    favicon: siteInfo.favicon,
    contactEmail: siteInfo.email,
    contactPhone: siteInfo.phone,
    whatsapp: siteInfo.whatsapp,
    whatsappCommunityLink: siteInfo.whatsappCommunityLink,
    address: siteInfo.address,
    businessHours: siteInfo.businessHours,
    announcement: siteInfo.announcement,
    showAnnouncement: siteInfo.showAnnouncement,
    currency: siteInfo.currency,
    freeDeliveryThreshold: siteInfo.freeDeliveryThreshold,
    deliveryFee: siteInfo.deliveryFee,
    socialMedia: siteInfo.socialMedia,
    socialMediaDisplay: siteInfo.socialMediaDisplay,
    deliveryInfo: siteInfo.deliveryInfo,
    returnPolicy: siteInfo.returnPolicy,
    missionStatement: siteInfo.missionStatement,
    visionStatement: siteInfo.visionStatement,
    ourStory: siteInfo.ourStory,
    coreValues: siteInfo.coreValues,
    stats: siteInfo.stats,
    healthBanners: siteInfo.healthBanners,
    certifications: siteInfo.certifications,
    paymentMethods: siteInfo.paymentMethods,
    deliveryLocations: siteInfo.deliveryLocations,
    faqs: siteInfo.faqs,
    manager: siteInfo.manager,
  }
}

/**
 * Sync site info to GitHub repository
 */
export async function syncSiteInfoToGitHub(siteInfo: SiteInfo): Promise<boolean> {
  if (!isGitHubSyncEnabled()) {
    console.warn('GitHub sync not enabled. Changes saved locally only.')
    return false
  }

  const rawSiteInfo = transformSiteInfoToRaw(siteInfo)
  const content = JSON.stringify(rawSiteInfo, null, 2)
  const message = `Update site info via admin panel (${new Date().toISOString()})`
  
  return await commitFile('src/data/siteInfo.json', content, message)
}

/**
 * Test GitHub connection
 */
export async function testGitHubConnection(): Promise<{ success: boolean; message: string }> {
  const token = getGitHubToken()
  if (!token) {
    return { success: false, message: 'GitHub token not configured' }
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (response.ok) {
      return { success: true, message: 'Successfully connected to GitHub repository' }
    } else {
      return { success: false, message: `Failed to connect: ${response.statusText}` }
    }
  } catch (error) {
    return { success: false, message: `Connection error: ${error}` }
  }
}
