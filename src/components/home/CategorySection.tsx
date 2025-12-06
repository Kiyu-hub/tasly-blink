import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getCategoriesData, getProducts } from '@/lib/storage'
import type { CategoryData } from '@/types'

export default function CategorySection() {
  const [categories, setCategories] = useState<CategoryData[]>([])

  useEffect(() => {
    const loadCategories = () => {
      const allCategories = getCategoriesData()
      const products = getProducts()
      
      // Update product counts
      const categoryMap = new Map<string, number>()
      products.forEach(product => {
        const count = categoryMap.get(product.category) || 0
        categoryMap.set(product.category, count + 1)
      })
      
      // Filter visible categories with products, update counts, and sort by product count
      const visibleCategories = allCategories
        .filter(cat => cat.visible)
        .map(cat => ({
          ...cat,
          productCount: categoryMap.get(cat.name) || 0,
        }))
        .filter(cat => cat.productCount > 0)
        .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
      
      setCategories(visibleCategories)
    }
    
    loadCategories()
    
    // Listen for updates from admin panel
    const handleUpdate = () => {
      loadCategories()
    }
    
    window.addEventListener('categoriesUpdated', handleUpdate)
    window.addEventListener('productsUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleUpdate)
      window.removeEventListener('productsUpdated', handleUpdate)
    }
  }, [])

  if (categories.length === 0) return null

  return (
    <section className="py-4 md:py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 md:mb-6 md:text-center"
        >
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-1.5 md:mb-2">
            Shop by Category
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-2xl md:mx-auto">
            Discover our wide range of premium health supplements
          </p>
        </motion.div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar snap-x snap-mandatory -mx-2 px-2">
            {categories.map((category, index) => {
              const color = category.color || 'from-gray-500 to-slate-600'
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-shrink-0 w-32 snap-start"
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl aspect-square mb-2">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${color} opacity-50`}
                      />
                    </div>
                    <h3 className="font-semibold text-xs text-center line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground text-center">
                      {category.productCount}
                    </p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category, index) => {
            const color = category.color || 'from-gray-500 to-slate-600'
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${color} opacity-60 group-hover:opacity-70 transition-opacity`}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
                      <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                      <p className="text-xs opacity-90">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </p>
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
