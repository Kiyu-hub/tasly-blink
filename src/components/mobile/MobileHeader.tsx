import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, UserPlus, Moon, Sun } from 'lucide-react'
import { useCartStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getSiteInfo } from '@/lib/storage'
import { useTheme } from '@/components/theme-provider'

export default function MobileHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [siteInfo, setSiteInfo] = useState(getSiteInfo())
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const cartItems = useCartStore((state) => state.items)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const logoUrl = siteInfo?.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5bpjWLc7v0MJ8EVqLPSOweMBQmvVU94YYw&s'
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  
  useEffect(() => {
    const handleSiteInfoUpdate = () => {
      setSiteInfo(getSiteInfo()) // Update state instead of reloading
    }
    window.addEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    return () => window.removeEventListener('siteInfoUpdated', handleSiteInfoUpdate)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchFocused(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // Real-time search: navigate as user types (debounced effect)
    if (value.trim().length >= 2) {
      navigate(`/products?q=${encodeURIComponent(value.trim())}`)
    }
  }

  return (
    <header className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="flex items-center gap-2 px-2 py-1.5">
        {/* Logo - Compact (Dynamic from Admin) */}
        <Link to="/" className="flex-shrink-0">
          <img 
            src={logoUrl} 
            alt={siteInfo?.name || "Logo"} 
            className="h-10 w-10 object-contain"
          />
        </Link>

        {/* Search Bar - Expandable */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className={cn(
            "relative flex items-center bg-muted/50 rounded-full transition-all",
            isSearchFocused ? "ring-2 ring-primary/50" : ""
          )}>
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-0 outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </form>

        {/* Distributor Icon */}
        <Link to="/distributor" className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </button>

        {/* Cart Icon with Badge */}
        <Link to="/cart" className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="sale" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {totalItems > 9 ? '9+' : totalItems}
              </Badge>
            )}
          </div>
        </Link>
      </div>
    </header>
  )
}
