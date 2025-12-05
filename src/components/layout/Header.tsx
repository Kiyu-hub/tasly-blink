import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/theme-provider'
import { useCartStore, useWishlistStore, useUIStore } from '@/store'
import { getCategories, getSiteInfo } from '@/lib/storage'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [, setUpdateTrigger] = useState(0)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  
  const cartItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.items.length)
  const { setCartOpen, setMobileMenuOpen, setSearchOpen } = useUIStore()
  
  const categories = getCategories()
  const siteInfo = getSiteInfo()
  const logoUrl = siteInfo?.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5bpjWLc7v0MJ8EVqLPSOweMBQmvVU94YYw&s'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    const handleDataUpdate = () => {
      setUpdateTrigger(prev => prev + 1)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('siteInfoUpdated', handleDataUpdate)
    window.addEventListener('categoriesUpdated', handleDataUpdate)
    window.addEventListener('productsUpdated', handleDataUpdate)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('siteInfoUpdated', handleDataUpdate)
      window.removeEventListener('categoriesUpdated', handleDataUpdate)
      window.removeEventListener('productsUpdated', handleDataUpdate)
    }
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-md'
          : 'bg-background'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logoUrl} 
              alt={siteInfo?.name || "Tasly Ghana 346"} 
              className="h-12 w-12 object-contain"
            />
            <span className="font-display text-xl font-bold">
              Tasly Ghana <span className="text-primary">346</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            
            <div
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-lg border bg-background p-2 shadow-lg"
                  >
                    <Link
                      to="/products"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/products?category=${encodeURIComponent(category)}`}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
            
            <Link
              to="/become-distributor"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Become a Distributor
            </Link>

          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/wishlist')}
              className="relative"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {wishlistItems}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
