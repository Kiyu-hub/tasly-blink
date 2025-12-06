import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, ShoppingBag, Info, Phone, Heart, UserPlus, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUIStore } from '@/store'
import { getCategories, getSiteInfo } from '@/lib/storage'

export default function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const [categories, setCategories] = useState(getCategories())
  const [siteInfo, setSiteInfo] = useState(getSiteInfo())

  useEffect(() => {
    const handleSiteInfoUpdate = () => {
      setSiteInfo(getSiteInfo())
    }
    
    const handleCategoriesUpdate = () => {
      setCategories(getCategories())
    }
    
    window.addEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate)
    
    return () => {
      window.removeEventListener('siteInfoUpdated', handleSiteInfoUpdate)
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate)
    }
  }, [])

  const handleJoinCommunity = () => {
    if (siteInfo.whatsappCommunityLink) {
      // Direct auto-join link
      window.open(siteInfo.whatsappCommunityLink, '_blank')
    } else if (siteInfo.whatsapp) {
      // Fallback: Send message to WhatsApp number
      const message = encodeURIComponent(`Hello! I'm visiting from the ${siteInfo.name} website and I would like to join the Tasly Ghana community to learn more about your products and their benefits.`)
      window.open(`https://wa.me/${siteInfo.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank')
    }
    setMobileMenuOpen(false)
  }

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'All Products', href: '/products' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: Info, label: 'About Us', href: '/about' },
    { icon: Phone, label: 'Contact', href: '/contact' },
    { icon: UserPlus, label: 'Become a Distributor', href: '/become-distributor', highlight: true },
  ]

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-[280px] bg-white dark:bg-gray-900 shadow-xl lg:hidden"
          >
            <div className="flex h-full flex-col bg-white dark:bg-gray-900">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2"
                >
                  {siteInfo.logo ? (
                    <img 
                      src={siteInfo.logo} 
                      alt={siteInfo.name} 
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-green-600">
                      <span className="text-sm font-bold text-white">
                        {siteInfo.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    {siteInfo.name}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-auto p-3 bg-white dark:bg-gray-900">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        item.highlight ? 'bg-primary/10' : ''
                      }`}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${item.highlight ? 'text-primary' : 'text-gray-900 dark:text-white'}`} />
                      <span className={`${item.highlight ? 'text-primary' : 'text-gray-900 dark:text-white'} font-medium`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* WhatsApp Community Join Button */}
                {(siteInfo.whatsappCommunityLink || siteInfo.whatsapp) && (
                  <>
                    <Separator className="my-4" />
                    <button
                      onClick={handleJoinCommunity}
                      className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium bg-green-500/10 hover:bg-green-500/20 transition-colors border border-green-500/20"
                    >
                      <MessageCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-700 dark:text-green-300">Join WhatsApp Community</span>
                    </button>
                  </>
                )}

                <Separator className="my-4" />

                <div>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category: string) => (
                      <Link
                        key={category}
                        to={`/products?category=${encodeURIComponent(category)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} {siteInfo.name}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
