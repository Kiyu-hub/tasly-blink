/**
 * Intelligent Product Description Parser
 * Auto-detects and separates description, ingredients, usage, dosage, benefits, etc.
 * from a combined product description text
 */

interface ParsedProductData {
  description: string
  ingredients: string[]
  usage: string
  benefits: string[]
  dosage?: string
  packageInfo?: string
  targetGroup?: string
  warnings?: string
  functions?: string
}

/**
 * Parse product description and intelligently extract structured data
 */
export function parseProductDescription(rawDescription: string): ParsedProductData {
  const result: ParsedProductData = {
    description: '',
    ingredients: [],
    usage: '',
    benefits: [],
  }

  if (!rawDescription || typeof rawDescription !== 'string') {
    return result
  }

  const lines = rawDescription.split('\n').map(line => line.trim()).filter(Boolean)
  
  let currentSection = 'description'
  let sectionContent: string[] = []

  // Section markers (case-insensitive patterns)
  const sectionPatterns = {
    ingredients: /^(🌿\s*)?(key\s+)?ingredients?:?$/i,
    usage: /^(🧴\s*)?(dosage\s+(&|and)\s+)?usage:?$/i,
    dosage: /^(💊\s*)?(recommended\s+)?dosage:?$/i,
    benefits: /^(💡\s*)?(key\s+)?(health\s+)?benefits?(\s+\/\s+functions?)?:?$/i,
    functions: /^(💡\s*)?functions?(\s+\/\s+key\s+benefits)?:?$/i,
    package: /^(📦\s*)?package\s+(info|information):?$/i,
    targetGroup: /^(🎯\s*)?target\s+group:?$/i,
    warnings: /^(⚠️\s*)?(important\s+)?notes?:?$/i,
  }

  const processSectionContent = (section: string, content: string[]) => {
    const text = content.join('\n').trim()
    if (!text) return

    switch (section) {
      case 'ingredients':
        // Extract ingredient list items
        const ingredientItems = content
          .filter(line => {
            const trimmed = line.trim()
            return trimmed && !sectionPatterns.ingredients.test(trimmed)
          })
          .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean)
        
        result.ingredients = ingredientItems
        break

      case 'usage':
      case 'dosage':
        result.usage = text
        if (section === 'dosage') {
          result.dosage = text
        }
        break

      case 'benefits':
      case 'functions':
        // Extract benefit list items
        const benefitItems = content
          .filter(line => {
            const trimmed = line.trim()
            return trimmed && !sectionPatterns.benefits.test(trimmed) && !sectionPatterns.functions.test(trimmed)
          })
          .map(line => {
            // Remove emoji prefixes and list markers
            let cleaned = line.replace(/^[🎯💡💪🩸🛡️💓❤️🧠✅\-\*•]\s*/, '').trim()
            return cleaned
          })
          .filter(Boolean)
        
        result.benefits = [...result.benefits, ...benefitItems]
        break

      case 'package':
        result.packageInfo = text
        break

      case 'targetGroup':
        result.targetGroup = text
        break

      case 'warnings':
        result.warnings = text
        break

      case 'description':
      default:
        // Only add to description if it's not a section header
        const nonHeaderContent = content.filter(line => {
          const trimmed = line.trim()
          return !Object.values(sectionPatterns).some(pattern => pattern.test(trimmed))
        })
        if (nonHeaderContent.length > 0) {
          result.description += (result.description ? '\n' : '') + nonHeaderContent.join('\n')
        }
        break
    }
  }

  // Parse line by line
  for (const line of lines) {
    let foundSection = false

    // Check if line is a section header
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line)) {
        // Process previous section content
        processSectionContent(currentSection, sectionContent)
        
        // Start new section
        currentSection = section
        sectionContent = []
        foundSection = true
        break
      }
    }

    if (!foundSection) {
      sectionContent.push(line)
    }
  }

  // Process final section
  processSectionContent(currentSection, sectionContent)

  // Clean up description - remove excessive whitespace
  result.description = result.description.trim().replace(/\n{3,}/g, '\n\n')

  // If no explicit description was found, create one from the first few lines
  if (!result.description && rawDescription) {
    const firstLines = rawDescription.split('\n').slice(0, 3).join('\n').trim()
    if (firstLines && !Object.values(sectionPatterns).some(p => p.test(firstLines))) {
      result.description = firstLines
    }
  }

  // Combine benefits and functions into benefits
  result.benefits = [...new Set(result.benefits)] // Remove duplicates

  // If usage and dosage are separate, combine them intelligently
  if (result.dosage && result.usage && result.usage !== result.dosage) {
    result.usage = `${result.dosage}\n\n${result.usage}`
  } else if (result.dosage && !result.usage) {
    result.usage = result.dosage
  }

  return result
}

/**
 * Format parsed data back into structured sections for display
 */
export function formatParsedProduct(parsed: ParsedProductData): {
  description: string
  ingredients?: string
  usage?: string
  benefits?: string
} {
  const formatted: any = {
    description: parsed.description || 'No description available.'
  }

  if (parsed.ingredients.length > 0) {
    formatted.ingredients = parsed.ingredients.join('\n')
  }

  if (parsed.usage) {
    let usageText = parsed.usage
    if (parsed.packageInfo) {
      usageText = `${parsed.packageInfo}\n\n${usageText}`
    }
    formatted.usage = usageText
  }

  if (parsed.benefits.length > 0) {
    let benefitsText = parsed.benefits.map(b => `• ${b}`).join('\n')
    
    if (parsed.targetGroup) {
      benefitsText += `\n\nTarget Group:\n${parsed.targetGroup}`
    }
    
    if (parsed.warnings) {
      benefitsText += `\n\nImportant Notes:\n${parsed.warnings}`
    }
    
    formatted.benefits = benefitsText
  }

  return formatted
}

/**
 * Auto-parse and update product object with intelligent field extraction
 */
export function autoParseProduct(product: any): any {
  if (!product.description) {
    return product
  }

  const parsed = parseProductDescription(product.description)
  
  // Only update fields if they're empty and we found content
  const updated = { ...product }

  if (parsed.ingredients.length > 0 && (!updated.ingredients || updated.ingredients.length === 0)) {
    updated.ingredients = parsed.ingredients
  }

  if (parsed.usage && !updated.usage) {
    updated.usage = parsed.usage
  }

  if (parsed.benefits.length > 0 && (!updated.benefits || updated.benefits.length === 0)) {
    updated.benefits = parsed.benefits
  }

  // Update description to be cleaner (remove extracted sections)
  if (parsed.description) {
    updated.longDescription = product.description // Keep original as longDescription
    updated.description = parsed.description
  }

  return updated
}
