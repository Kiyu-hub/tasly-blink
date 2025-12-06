import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { getSiteInfo } from '@/lib/storage'

const defaultHealthBanners = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&h=600&fit=crop&q=80',
    title: 'Health & Happiness',
    description: 'Bringing wellness to every Ghanaian family',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    order: 1,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=600&fit=crop&q=80',
    title: 'Expert Care',
    description: 'Professional health consultations and guidance',
    ctaText: 'Learn More',
    ctaLink: '/about',
    order: 2,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=600&fit=crop&q=80',
    title: 'Wellness Journey',
    description: 'Natural health solutions for better living',
    ctaText: 'Explore Products',
    ctaLink: '/products',
    order: 3,
  }
]

export default function HealthBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [healthBanners, setHealthBanners] = useState(defaultHealthBanners)

  useEffect(() => {
    const loadHealthBanners = () => {
      const siteInfo = getSiteInfo()
      if (siteInfo?.healthBanners && siteInfo.healthBanners.length > 0) {
        setHealthBanners(siteInfo.healthBanners.sort((a, b) => a.order - b.order))
      }
    }

    loadHealthBanners()

    // Listen for site info updates
    const handleSiteInfoUpdate = () => {
      loadHealthBanners()
    }

    window.addEventListener('siteInfoUpdated', handleSiteInfoUpdate)

    return () => {
      window.removeEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    }
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % healthBanners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % healthBanners.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + healthBanners.length) % healthBanners.length
    )
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-3 md:py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Your Health is Our Priority
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Committed to bringing authentic, premium health solutions to every Ghanaian home
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative h-[180px] sm:h-[220px] md:h-[280px] lg:h-[350px]"
              >
                <img
                  src={healthBanners[currentIndex].image}
                  alt={healthBanners[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-12 text-white">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-2xl md:text-5xl font-bold mb-2 md:mb-3"
                  >
                    {healthBanners[currentIndex].title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm sm:text-base md:text-xl text-white/90 mb-3 md:mb-4"
                  >
                    {healthBanners[currentIndex].description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      className="bg-white text-black hover:bg-white/90 text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-11 px-3 sm:px-4 md:px-6 rounded-full font-semibold"
                    >
                      <Link to={healthBanners[currentIndex].ctaLink}>
                        {healthBanners[currentIndex].ctaText}
                        <ArrowRight className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {healthBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
