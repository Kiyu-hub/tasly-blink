import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, ShoppingBag, Info, Phone, Heart, UserPlus, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUIStore } from '@/store'
import { getCategories, getSiteInfo } from '@/lib/storage'

export default function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const categories = getCategories()
  const siteInfo = getSiteInfo()

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
            className="fixed left-0 top-0 z-50 h-full w-[280px] bg-background shadow-xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-green-600">
                    <span className="text-sm font-bold text-white">
                      {siteInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-display text-lg font-bold text-foreground">
                    {siteInfo.name}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-auto p-4">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent transition-colors ${
                        item.highlight ? 'bg-primary/10 text-primary' : 'text-foreground'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={item.highlight ? 'text-primary font-semibold' : 'text-foreground'}>
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
                      className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium bg-green-500/10 text-green-600 dark:text-green-500 hover:bg-green-500/20 transition-colors border border-green-500/20"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">Join WhatsApp Community</span>
                    </button>
                  </>
                )}

                <Separator className="my-4" />

                <div>
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category: string) => (
                      <Link
                        key={category}
                        to={`/products?category=${encodeURIComponent(category)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
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
