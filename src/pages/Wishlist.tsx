import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore, useWishlistStore } from '@/store'
import { getProducts } from '@/lib/storage'
import { formatCurrency, getDiscountedPrice } from '@/lib/utils'
import type { Product } from '@/types'

export default function Wishlist() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const allProducts = getProducts()
    const wishlistProducts = allProducts.filter((p) =>
      wishlistItems.some((item) => item.productId === p.id)
    )
    setProducts(wishlistProducts)
  }, [wishlistItems])

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('This product is out of stock')
      return
    }
    addToCart(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId)
    toast.success(`${productName} removed from wishlist`)
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen py-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/products">
                Discover Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">
              {products.length} items saved
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              clearWishlist()
              toast.success('Wishlist cleared')
            }}
            className="text-red-500 hover:text-red-600"
          >
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const price = product.discount
              ? getDiscountedPrice(product.price, product.discount)
              : product.price

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group">
                  <Link to={`/products/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.discount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </Link>

                  <CardContent className="p-4">
                    <Link
                      to={`/products/${product.slug}`}
                      className="font-semibold hover:text-primary transition-colors line-clamp-2 h-12"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center gap-2 mt-2 mb-4">
                      <span className="font-bold text-primary">
                        {formatCurrency(price)}
                      </span>
                      {product.discount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-full"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => handleRemove(product.id, product.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
