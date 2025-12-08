import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useWishlistStore } from '@/store'
import { formatCurrency, getDiscountedPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import QuantityDialog from './QuantityDialog'

interface ProductCardProps {
  product: Product
  index?: number
  compact?: boolean // New prop for mobile-optimized compact view
}

export default function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)
  
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock <= 0 || isAddingToCart) {
      if (product.stock <= 0) {
        toast.error('This product is out of stock')
      }
      return
    }

    // Prevent rapid clicks
    setIsAddingToCart(true)

    // Clear existing timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
    }

    // Increment click count
    clickCountRef.current += 1

    if (clickCountRef.current === 1) {
      // First click - add 1 item normally
      addItem(product, 1)
      toast.success(`${product.name} added to cart`)
      
      // Reset counter and re-enable after delay
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0
        setIsAddingToCart(false)
      }, 800)
    } else {
      // Multiple clicks - show quantity dialog
      setShowQuantityDialog(true)
      clickCountRef.current = 0
      setIsAddingToCart(false)
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
      }
    }
  }, [product, addItem, isAddingToCart])

  const handleQuantityConfirm = (quantity: number) => {
    addItem(product, quantity)
    toast.success(`${quantity} × ${product.name} added to cart`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast.success(`${product.name} removed from wishlist`)
    } else {
      addToWishlist(product.id)
      toast.success(`${product.name} added to wishlist`)
    }
  }

  const finalPrice = product.discount
    ? getDiscountedPrice(product.price, product.discount)
    : product.price

  // Compact mobile view
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <Link to={`/products/${product.slug}`}>
          <div className="relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
            {/* Compact Image Container */}
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.imageURL}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Compact Badges - Top Left */}
              <div className="absolute top-1.5 left-1.5">
                {(product.discount ?? 0) > 0 && (
                  <Badge variant="sale" className="text-[10px] h-5 px-1.5">-{product.discount}%</Badge>
                )}
              </div>

              {/* Wishlist - Top Right */}
              <button
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                onClick={handleWishlist}
              >
                <Heart
                  className={cn(
                    'h-3.5 w-3.5',
                    inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  )}
                />
              </button>

              {/* Stock Badge - Bottom */}
              {product.stock <= 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[10px] text-center py-0.5 font-medium">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Compact Content */}
            <div className="p-2">
              {/* Product Name - Smaller */}
              <h3 className="text-xs font-semibold line-clamp-2 mb-1 min-h-[32px]">
                {product.name}
              </h3>

              {/* Rating - Smaller */}
              {product.rating && (
                <div className="flex items-center gap-0.5 mb-1">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] text-muted-foreground">
                    {product.rating} ({product.reviewCount || 0})
                  </span>
                </div>
              )}

              {/* Price Row */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(finalPrice)}
                  </span>
                  {(product.discount ?? 0) > 0 && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
                
                {/* Mini Add to Cart Icon */}
                <button
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg",
                    product.stock <= 0 || isAddingToCart
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-green-600 text-white hover:scale-110"
                  )}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Desktop full view (unchanged)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="relative bg-card rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.imageURL}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {(product.discount ?? 0) > 0 && (
                <Badge variant="sale">-{product.discount}%</Badge>
              )}
              {product.new && <Badge variant="new">New</Badge>}
              {product.stock <= 0 && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="warning">Low Stock</Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full shadow-md"
                onClick={handleWishlist}
              >
                <Heart
                  className={cn(
                    'h-4 w-4',
                    inWishlist && 'fill-red-500 text-red-500'
                  )}
                />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Button
                size="lg"
                className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-green-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock <= 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
            <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3.5 w-3.5',
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(finalPrice)}
              </span>
              {(product.discount ?? 0) > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quantity Dialog */}
      <QuantityDialog
        isOpen={showQuantityDialog}
        onClose={() => setShowQuantityDialog(false)}
        onConfirm={handleQuantityConfirm}
        product={product}
      />
    </motion.div>
  )
}
