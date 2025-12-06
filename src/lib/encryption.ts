/**
 * Simple XOR encryption for GitHub token storage
 * Note: This is basic obfuscation, not military-grade encryption
 * The secondary password (Smart@399) acts as the encryption key
 */

const SECONDARY_PASSWORD = 'Smart@399'

/**
 * Encrypt a string using XOR cipher with the secondary password
 */
export function encryptToken(token: string): string {
  if (!token) return ''
  
  let encrypted = ''
  for (let i = 0; i < token.length; i++) {
    const tokenChar = token.charCodeAt(i)
    const keyChar = SECONDARY_PASSWORD.charCodeAt(i % SECONDARY_PASSWORD.length)
    encrypted += String.fromCharCode(tokenChar ^ keyChar)
  }
  
  // Convert to base64 for safe storage
  return btoa(encrypted)
}

/**
 * Decrypt a string using XOR cipher with the secondary password
 */
export function decryptToken(encryptedToken: string): string {
  if (!encryptedToken) return ''
  
  try {
    // Decode from base64
    const encrypted = atob(encryptedToken)
    
    let decrypted = ''
    for (let i = 0; i < encrypted.length; i++) {
      const encryptedChar = encrypted.charCodeAt(i)
      const keyChar = SECONDARY_PASSWORD.charCodeAt(i % SECONDARY_PASSWORD.length)
      decrypted += String.fromCharCode(encryptedChar ^ keyChar)
    }
    
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt token:', error)
    return ''
  }
}

/**
 * Verify the secondary password
 */
export function verifySecondaryPassword(password: string): boolean {
  return password === SECONDARY_PASSWORD
}

/**
 * Check if sync is enabled (star clicked)
 */
export function isSyncEnabled(): boolean {
  return localStorage.getItem('tasly_sync_enabled') === 'true'
}

/**
 * Enable sync (after star is clicked and password verified)
 */
export function enableSync(): void {
  localStorage.setItem('tasly_sync_enabled', 'true')
}

/**
 * Disable sync
 */
export function disableSync(): void {
  localStorage.removeItem('tasly_sync_enabled')
}
