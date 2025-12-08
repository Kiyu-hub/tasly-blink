import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/store'
import { formatCurrency, getDiscountedPrice } from '@/lib/utils'
import { getSiteInfo } from '@/lib/storage'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } =
    useCartStore()

  const siteInfo = getSiteInfo()
  const total = getTotalPrice()

  const handleCheckout = () => {
    const whatsappNumber = (siteInfo?.whatsapp || '233599004548').replace(/[^0-9]/g, '')
    const orderDetails = items
      .map((item) => {
        const price = item.product.discount
          ? getDiscountedPrice(item.product.price, item.product.discount)
          : item.product.price
        return `• ${item.quantity}x ${item.product.name} - ${formatCurrency(price * item.quantity)}`
      })
      .join('\n')

    const message = `🛒 NEW ORDER REQUEST
📋 From: ${siteInfo?.name || 'Tasly Ghana 346'} Website

━━━━━━━━━━━━━━━━━━━━━
📦 Order Details:
${orderDetails}

💰 Total: ${formatCurrency(total)}

🌐 Sent from: ${siteInfo?.name || 'Tasly Ghana 346'} Website
📅 Date: ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })}`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (items.length === 0) {
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
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/products">
                Start Shopping
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {getTotalItems()} items in cart
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearCart()
                  toast.success('Cart cleared')
                }}
                className="text-red-500 hover:text-red-600"
              >
                Clear Cart
              </Button>
            </div>

            {items.map((item) => {
              const { product, quantity } = item
              const price = product.discount
                ? getDiscountedPrice(product.price, product.discount)
                : product.price

              return (
                <Card key={product.id}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Image */}
                      <Link
                        to={`/products/${product.slug}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={product.imageURL}
                          alt={product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${product.slug}`}
                          className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {product.category}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-sm sm:text-base text-primary">
                            {formatCurrency(price)}
                          </span>
                          {product.discount && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3 sm:mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border rounded-full">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  Math.max(1, quantity - 1)
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-medium">
                              {quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(product.id, quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                            <span className="font-semibold text-sm sm:text-base">
                              {formatCurrency(price * quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-600"
                              onClick={() => {
                                removeItem(product.id)
                                toast.success('Item removed from cart')
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Continue Shopping */}
            <Button variant="outline" asChild className="w-full">
              <Link to="/products">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    ✓ Free delivery across Ghana and globally
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full mt-6 rounded-full bg-gradient-to-r from-primary to-green-600"
                  onClick={handleCheckout}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="w-5 h-5 mr-2"
                  />
                  Checkout via WhatsApp
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout via WhatsApp. Our team will confirm your order
                  and arrange delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
