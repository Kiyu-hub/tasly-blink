import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store'
import { getProducts } from '@/lib/storage'
import { formatCurrency, debounce } from '@/lib/utils'
import type { Product } from '@/types'

export default function SearchDialog() {
  const navigate = useNavigate()
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery } = useUIStore()
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const popularSearches = ['Heart Health', 'Immunity', 'Brain Health', 'Vitamins']

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    const search = debounce(() => {
      const products = getProducts()
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered.slice(0, 6))
      setIsSearching(false)
    }, 300)

    search()
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleProductClick = (slug: string) => {
    navigate(`/products/${slug}`)
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        <form onSubmit={handleSearch} className="border-b p-4">
          <Input
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5" />}
            className="h-12 text-lg"
            autoFocus
          />
        </form>

        <div className="max-h-[60vh] overflow-auto p-4">
          {searchQuery.trim() ? (
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Products
                  </h3>
                  {results.map((product) => (
                    <motion.button
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {product.category}
                        </p>
                      </div>
                      <span className="font-bold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                    </motion.button>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={handleSearch}
                  >
                    View all results for "{searchQuery}"
                  </Button>
                </motion.div>
              ) : isSearching ? (
                <div className="text-center py-8 text-muted-foreground">
                  Searching...
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No products found for "{searchQuery}"
                </div>
              )}
            </AnimatePresence>
          ) : (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <TrendingUp className="h-4 w-4" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="secondary"
                    size="sm"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
