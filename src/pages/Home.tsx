import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HeroCarousel from '@/components/home/HeroCarousel'
import HealthBannerCarousel from '@/components/home/HealthBannerCarousel'
import CategorySection from '@/components/home/CategorySection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import { getProducts, getBanners } from '@/lib/storage'
import type { Product, Banner } from '@/types'

const defaultBanners: Banner[] = [
  {
    id: '1',
    title: 'Discover Natural Health Solutions',
    subtitle: 'Premium Supplements',
    description:
      'Experience the power of traditional Chinese medicine combined with modern science for optimal wellness.',
    image:
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1600&h=900&fit=crop',
    link: '/products',
    buttonText: 'Shop Now',
    active: true,
    order: 1,
  },
  {
    id: '2',
    title: 'Boost Your Immunity Naturally',
    subtitle: 'New Arrivals',
    description:
      'Strengthen your body\'s natural defenses with our scientifically formulated immune support supplements.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=900&fit=crop',
    link: '/products?category=immune-support',
    buttonText: 'Explore Products',
    active: true,
    order: 2,
  },
  {
    id: '3',
    title: 'Heart Health Matters',
    subtitle: 'Best Sellers',
    description:
      'Support your cardiovascular system with our premium heart health formulas trusted by thousands.',
    image:
      'https://images.unsplash.com/photo-1559757175-7cb036e0e67a?w=1600&h=900&fit=crop',
    link: '/products?category=heart-cardiovascular',
    buttonText: 'Learn More',
    active: true,
    order: 3,
  },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    const loadData = () => {
      const allProducts = getProducts()
      setProducts(allProducts)

      const storedBanners = getBanners()
      setBanners(storedBanners.length > 0 ? storedBanners : defaultBanners)
    }

    loadData()
  }, [])

  const newArrivals = products.filter((p) => p.new)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Carousel */}
      <HeroCarousel banners={banners} />

      {/* Health Banner Carousel */}
      <HealthBannerCarousel />

      {/* Features Strip */}
      <FeaturesSection />

      {/* Categories */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts
        products={products}
        title="Featured Products"
        subtitle="Handpicked products for your wellness journey"
      />



      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div className="bg-muted/30">
          <FeaturedProducts
            products={newArrivals}
            title="New Arrivals"
            subtitle="Fresh additions to our collection"
            viewAllLink="/products?filter=new"
          />
        </div>
      )}

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />
    </motion.div>
  )
}
