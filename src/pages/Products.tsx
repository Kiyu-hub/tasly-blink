import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Grid, List, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductGrid from '@/components/product/ProductGrid'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { getProducts } from '@/lib/storage'
import type { Product } from '@/types'

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'brain-nervous-system', label: 'Brain & Nervous System' },
  { value: 'immune-support', label: 'Immune Support' },
  { value: 'heart-cardiovascular', label: 'Heart & Cardiovascular' },
  { value: 'digestive-health', label: 'Digestive Health' },
  { value: 'energy-vitality', label: 'Energy & Vitality' },
  { value: 'beauty-skincare', label: 'Beauty & Skincare' },
]

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-100', label: 'Under GH₵100' },
  { value: '100-200', label: 'GH₵100 - GH₵200' },
  { value: '200-500', label: 'GH₵200 - GH₵500' },
  { value: '500+', label: 'Over GH₵500' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured')
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all')
  const [filter, setFilter] = useState(searchParams.get('filter') || '')

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (category && category !== 'all') {
      result = result.filter((p) =>
        p.category.toLowerCase().replace(/\s+/g, '-').includes(category)
      )
    }

    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      if (priceRange === '500+') {
        result = result.filter((p) => p.price >= 500)
      } else {
        result = result.filter((p) => p.price >= min && p.price <= max)
      }
    }

    // Special filters
    if (filter === 'sale') {
      result = result.filter((p) => p.discount && p.discount > 0)
    } else if (filter === 'new') {
      result = result.filter((p) => p.new)
    } else if (filter === 'bestseller') {
      result = result.filter((p) => p.bestSeller)
    }

    // Sort
    switch (sort) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // Featured - bestsellers first, then by rating
        result.sort((a, b) => {
          if (a.bestSeller && !b.bestSeller) return -1
          if (!a.bestSeller && b.bestSeller) return 1
          return (b.rating || 0) - (a.rating || 0)
        })
    }

    return result
  }, [products, search, category, sort, priceRange, filter])

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setSort('featured')
    setPriceRange('all')
    setFilter('')
    setSearchParams({})
  }

  const hasActiveFilters =
    search || category !== 'all' || priceRange !== 'all' || filter

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-primary"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div>
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Accordion
                type="multiple"
                defaultValue={['category', 'price']}
                className="w-full"
              >
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label
                          key={cat.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={cat.value}
                            checked={category === cat.value}
                            onChange={(e) => setCategory(e.target.value)}
                            className="accent-primary"
                          />
                          <span className="text-sm">{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label
                          key={range.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="price"
                            value={range.value}
                            checked={priceRange === range.value}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="accent-primary"
                          />
                          <span className="text-sm">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="special">
                  <AccordionTrigger>Special</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'All Products' },
                        { value: 'sale', label: 'On Sale' },
                        { value: 'new', label: 'New Arrivals' },
                        { value: 'bestseller', label: 'Best Sellers' },
                      ].map((item) => (
                        <label
                          key={item.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="filter"
                            value={item.value}
                            checked={filter === item.value}
                            onChange={(e) => setFilter(e.target.value)}
                            className="accent-primary"
                          />
                          <span className="text-sm">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {hasActiveFilters && (
                  <div className="hidden md:flex items-center gap-2">
                    {category !== 'all' && (
                      <Badge variant="outline" className="gap-1">
                        {categories.find((c) => c.value === category)?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setCategory('all')}
                        />
                      </Badge>
                    )}
                    {filter && (
                      <Badge variant="outline" className="gap-1 capitalize">
                        {filter}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setFilter('')}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="hidden sm:flex items-center border rounded-md">
                  <Button
                    variant={view === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-none rounded-l-md"
                    onClick={() => setView('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-none rounded-r-md"
                    onClick={() => setView('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={filteredProducts} columns={view === 'list' ? 2 : 3} />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-background p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category-mobile"
                        value={cat.value}
                        checked={category === cat.value}
                        onChange={(e) => setCategory(e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price-mobile"
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
