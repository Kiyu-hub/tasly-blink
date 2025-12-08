import { Home, Grid3x3, ShoppingCart, Menu, X, UserPlus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store'
import { getCategoriesData, getProducts } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileBottomNav() {
  const location = useLocation()
  const { items } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasVisibleCategories, setHasVisibleCategories] = useState(false)
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const checkCategories = () => {
      const allCategories = getCategoriesData()
      const products = getProducts()
      
      // Count products per category
      const categoryMap = new Map<string, number>()
      products.forEach(product => {
        const count = categoryMap.get(product.category) || 0
        categoryMap.set(product.category, count + 1)
      })
      
      // Check if there are any visible categories with products
      const visibleWithProducts = allCategories.some(cat => 
        cat.visible && (categoryMap.get(cat.name) || 0) > 0
      )
      
      setHasVisibleCategories(visibleWithProducts)
    }
    
    checkCategories()
    
    window.addEventListener('categoriesUpdated', checkCategories)
    window.addEventListener('productsUpdated', checkCategories)
    
    return () => {
      window.removeEventListener('categoriesUpdated', checkCategories)
      window.removeEventListener('productsUpdated', checkCategories)
    }
  }, [])

  // Always show cart in mobile bottom nav
  // Hide distributor when categories exist
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3x3, label: 'Categories', path: '/categories', hidden: !hasVisibleCategories },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartItemCount },
    { icon: UserPlus, label: 'Distributor', path: '/distributor', hidden: hasVisibleCategories },
  ].filter(item => !item.hidden)

  const menuItems = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Become a Distributor', path: '/distributor' },
    { label: 'Products', path: '/products' },
  ]

  return (
    <>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 pb-20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base font-medium text-gray-900 dark:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-around items-center h-14 px-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full relative transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 active:text-primary'
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 active:text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Menu</span>
          </button>
        </div>
      </nav>
    </>
  )
}
