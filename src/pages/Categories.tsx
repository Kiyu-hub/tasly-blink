import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { getCategoriesData, getProducts } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import type { CategoryData } from '@/types'

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<CategoryData[]>([])

  useEffect(() => {
    const allCategories = getCategoriesData()
    const products = getProducts()
    
    // Count products per category
    const categoryMap = new Map<string, number>()
    products.forEach(product => {
      const count = categoryMap.get(product.category) || 0
      categoryMap.set(product.category, count + 1)
    })
    
    // Filter visible categories with products and update counts
    const visibleCategories = allCategories
      .filter(cat => cat.visible)
      .map(cat => ({
        ...cat,
        productCount: categoryMap.get(cat.name) || 0,
      }))
      .filter(cat => cat.productCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name))
    
    setCategories(visibleCategories)
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Product Categories</h1>
          <p className="text-muted-foreground">Browse our health products by category</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center p-6 gap-3 hover:bg-primary hover:text-white transition-colors"
                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
              >
                <Package className="w-16 h-16" />
                <div className="text-center">
                  <h3 className="font-semibold text-base">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.productCount} products
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
