import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, useUIStore } from '@/store'
import { formatCurrency, getDiscountedPrice, getSiteInfo } from '@/lib/utils'

export default function CartSidebar() {
  const { isCartOpen, setCartOpen } = useUIStore()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  const handleCheckout = () => {
    const siteInfo = getSiteInfo()
    const whatsappNumber = (siteInfo?.whatsapp || '233599004548').replace(/[^0-9]/g, '')
    const subtotal = getTotalPrice()

    const orderDetails = items
      .map((item) => {
        const price = item.product.discount
          ? getDiscountedPrice(item.product.price, item.product.discount)
          : item.product.price
        return `• ${item.quantity}x ${item.product.name} - ${formatCurrency(price * item.quantity)}`
      })
      .join('\n')

    const message = `Hello! I'd like to place an order:\n\n${orderDetails}\n\nTotal: ${formatCurrency(subtotal)}`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setCartOpen(false)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-bold">
                    Your Cart ({items.length})
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCartOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-auto p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Add some products to get started
                    </p>
                    <Button onClick={() => setCartOpen(false)} asChild>
                      <Link to="/products">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 bg-muted/30 rounded-lg p-3"
                      >
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.product.imageURL}
                            alt={item.product.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={() => setCartOpen(false)}
                          >
                            <h3 className="font-medium text-sm truncate hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-primary font-bold mt-1">
                            {formatCurrency(item.product.price)}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(getTotalPrice())}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Shipping calculated at checkout
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCartOpen(false)
                      }}
                      asChild
                    >
                      <Link to="/cart">View Cart</Link>
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      className="bg-gradient-to-r from-primary to-green-600"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                        className="w-4 h-4 mr-1"
                      />
                      Checkout
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
