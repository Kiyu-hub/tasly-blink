/**
 * Advanced Search Utility with Fuzzy Matching
 * Provides flexible search that tolerates typos and partial matches
 */

import type { Product } from '@/types'

/**
 * Calculate string similarity (Levenshtein distance based)
 * Returns a score between 0 and 1 (1 = perfect match)
 */
function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()

  // Exact match
  if (s1 === s2) return 1

  // Contains match
  if (s1.includes(s2) || s2.includes(s1)) return 0.8

  // Calculate Levenshtein distance
  const matrix: number[][] = []
  
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length)
  const distance = matrix[s2.length][s1.length]
  return 1 - distance / maxLength
}

/**
 * Check if search query matches product with fuzzy tolerance
 */
function fuzzyMatch(text: string, query: string, threshold: number = 0.6): boolean {
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()

  // Exact substring match
  if (textLower.includes(queryLower)) return true

  // Split query into words
  const queryWords = queryLower.split(/\s+/).filter(Boolean)
  const textWords = textLower.split(/\s+/).filter(Boolean)

  // Check if all query words have a match in text (allows typos)
  return queryWords.every(queryWord => {
    return textWords.some(textWord => {
      return stringSimilarity(textWord, queryWord) >= threshold
    })
  })
}

/**
 * Score a product's relevance to search query
 */
function scoreProduct(product: Product, query: string): number {
  const queryLower = query.toLowerCase()
  let score = 0

  // Exact name match - highest score
  if (product.name.toLowerCase() === queryLower) {
    score += 100
  } else if (product.name.toLowerCase().includes(queryLower)) {
    score += 50
  } else if (fuzzyMatch(product.name, query, 0.7)) {
    score += 30
  }

  // Category match
  if (product.category.toLowerCase() === queryLower) {
    score += 40
  } else if (product.category.toLowerCase().includes(queryLower)) {
    score += 20
  } else if (fuzzyMatch(product.category, query, 0.7)) {
    score += 10
  }

  // Description match
  if (product.description?.toLowerCase().includes(queryLower)) {
    score += 15
  } else if (product.description && fuzzyMatch(product.description, query, 0.6)) {
    score += 8
  }

  // Long description match
  if (product.longDescription?.toLowerCase().includes(queryLower)) {
    score += 10
  } else if (product.longDescription && fuzzyMatch(product.longDescription, query, 0.6)) {
    score += 5
  }

  // Ingredients match (if available)
  if (product.ingredients?.some(ing => 
    ing.toLowerCase().includes(queryLower) || fuzzyMatch(ing, query, 0.7)
  )) {
    score += 12
  }

  // Benefits match (if available)
  if (product.benefits?.some(benefit => 
    benefit.toLowerCase().includes(queryLower) || fuzzyMatch(benefit, query, 0.6)
  )) {
    score += 8
  }

  // Usage match (if available)
  if (product.usage?.toLowerCase().includes(queryLower) || 
      (product.usage && fuzzyMatch(product.usage, query, 0.6))) {
    score += 6
  }

  // Tags match (if available)
  if (product.tags?.some(tag => 
    tag.toLowerCase().includes(queryLower) || fuzzyMatch(tag, query, 0.7)
  )) {
    score += 10
  }

  return score
}

/**
 * Search products with fuzzy matching and intelligent ranking
 */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query || !query.trim()) {
    return products
  }

  const trimmedQuery = query.trim()

  // Score all products
  const scoredProducts = products
    .map(product => ({
      product,
      score: scoreProduct(product, trimmedQuery)
    }))
    .filter(item => item.score > 0) // Only include products with some relevance
    .sort((a, b) => b.score - a.score) // Sort by relevance score

  return scoredProducts.map(item => item.product)
}

/**
 * Highlight matching text in search results
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.trim().split(/\s+/).join('|')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(
  products: Product[],
  query: string,
  limit: number = 5
): string[] {
  if (!query.trim()) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  // Add matching product names
  products.forEach(product => {
    if (product.name.toLowerCase().includes(queryLower) || 
        fuzzyMatch(product.name, query, 0.6)) {
      suggestions.add(product.name)
    }
  })

  // Add matching categories
  products.forEach(product => {
    if (product.category.toLowerCase().includes(queryLower) || 
        fuzzyMatch(product.category, query, 0.6)) {
      suggestions.add(product.category)
    }
  })

  return Array.from(suggestions).slice(0, limit)
}
