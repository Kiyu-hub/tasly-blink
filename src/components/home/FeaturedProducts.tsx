import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductGrid from '@/components/product/ProductGrid'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
  title?: string
  subtitle?: string
  viewAllLink?: string
}

export default function FeaturedProducts({
  products,
  title = 'Featured Products',
  subtitle = 'Handpicked products for your wellness journey',
  viewAllLink = '/products',
}: FeaturedProductsProps) {
  const featuredProducts = products.slice(0, 8)

  return (
    <section className="py-3 md:py-12 lg:py-20">
      <div className="container mx-auto px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 rounded-full"
            asChild
          >
            <Link to={viewAllLink}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <ProductGrid products={featuredProducts} columns={4} />
      </div>
    </section>
  )
}
