import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { getCategories, getProducts } from '@/lib/storage'
import { Button } from '@/components/ui/button'

export default function Categories() {
  const navigate = useNavigate()
  const categories = getCategories()
  const products = getProducts()

  // Get product count for each category
  const getCategoryProductCount = (category: string) => {
    return products.filter((p) => p.category === category).length
  }

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
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center p-6 gap-3 hover:bg-primary hover:text-white transition-colors"
                onClick={() => navigate(`/products?category=${category}`)}
              >
                <Package className="w-16 h-16" />
                <div className="text-center">
                  <h3 className="font-semibold text-base">{category}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getCategoryProductCount(category)} products
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
