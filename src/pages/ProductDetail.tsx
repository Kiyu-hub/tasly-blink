import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Shield,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import MobileStickyActions from '@/components/mobile/MobileStickyActions'
import { useCartStore, useWishlistStore } from '@/store'
import { getProducts, getProductReviews, addReview, getSiteInfo } from '@/lib/storage'
import { formatCurrency, getDiscountedPrice, cn } from '@/lib/utils'
import type { Product } from '@/types'
import type { Review } from '@/types'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: '',
  })

  const addItem = useCartStore((state) => state.addItem)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const inWishlist = product ? isInWishlist(product.id) : false

  useEffect(() => {
    const loadProduct = () => {
      const products = getProducts()
      const found = products.find((p) => p.slug === slug)
      setProduct(found || null)

      if (found) {
        const related = products
          .filter((p) => p.category === found.category && p.id !== found.id)
          .slice(0, 4)
        setRelatedProducts(related)
        
        // Load reviews
        const productReviews = getProductReviews(found.id)
        setReviews(productReviews)
      }

      setLoading(false)
    }

    loadProduct()
    window.scrollTo(0, 0)
    
    // Listen for product updates from admin panel
    const handleProductsUpdate = () => {
      loadProduct()
    }
    
    window.addEventListener('productsUpdated', handleProductsUpdate)
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate)
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  const finalPrice = product.discount
    ? getDiscountedPrice(product.price, product.discount)
    : product.price

  const images = product.images || [product.imageURL]

  const handleAddToCart = () => {
    if (product.stock <= 0 || isAddingToCart) {
      if (product.stock <= 0) {
        toast.error('This product is out of stock')
      }
      return
    }
    
    setIsAddingToCart(true)
    addItem(product, quantity)
    toast.success(`${quantity} × ${product.name} added to cart`)
    
    // Reset after 800ms to prevent rapid clicks
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 800)
  }

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product.id)
      toast.success('Added to wishlist')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } catch {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const handlePreOrder = () => {
    const siteInfo = getSiteInfo()
    const message = `Hi ${siteInfo?.name || 'Tasly Ghana 346'}, I would like to pre-order the following product:\n\nProduct: ${product.name}\nQuantity: ${quantity}\n\nPlease let me know when it will be available.`
    const whatsappUrl = `https://wa.me/${siteInfo?.whatsapp || '233599004548'}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSubmitReview = () => {
    if (!product || !reviewForm.userName.trim() || !reviewForm.comment.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    const newReview = addReview({
      productId: product.id,
      userId: `user-${Date.now()}`,
      userName: reviewForm.userName,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    })

    setReviews([...reviews, newReview])
    setReviewForm({ userName: '', rating: 5, comment: '' })
    setIsReviewDialogOpen(false)
    toast.success('Thank you for your review!')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-primary">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount && product.discount > 0 && (
                  <Badge variant="sale">-{product.discount}%</Badge>
                )}
                {product.new && <Badge variant="new">New</Badge>}
              </div>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (prev) => (prev - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-primary/50'
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {product.rating} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(finalPrice)}
                </span>
                {product.discount && product.discount > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge variant="sale">Save {product.discount}%</Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  product.stock <= 5 ? (
                    <div className="flex items-center gap-2 text-orange-600">
                      <Badge variant="destructive" className="bg-orange-500">Low Stock</Badge>
                      <span className="text-sm font-medium">
                        Only {product.stock} left in stock!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <Badge className="bg-green-500">In Stock</Badge>
                      <span className="text-sm">
                        {product.stock} available
                      </span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">OUT OF STOCK</Badge>
                    <span className="text-sm text-muted-foreground">
                      Pre-order available via WhatsApp
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8">{product.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Add to Cart */}
            <div className="space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-full shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="w-14 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  <span className="text-sm text-muted-foreground">
                    Total: {formatCurrency(finalPrice * quantity)}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {/* Main Add to Cart / Pre-order Button */}
                {product.stock > 0 ? (
                  <Button
                    size="lg"
                    className="w-full h-12 sm:h-14 rounded-full bg-gradient-to-r from-primary to-green-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base font-semibold"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full h-12 sm:h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base font-semibold"
                    onClick={handlePreOrder}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    PRE-ORDER via WhatsApp
                  </Button>
                )}

                {/* Wishlist and Share buttons in a row */}
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-12 sm:h-14 rounded-full border-2 hover:bg-primary/5 hover:border-primary transition-all text-sm sm:text-base"
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={cn(
                        'mr-1.5 sm:mr-2 h-5 w-5 sm:h-6 sm:w-6',
                        inWishlist && 'fill-red-500 text-red-500'
                      )}
                    />
                    <span className="hidden sm:inline">{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                    <span className="sm:hidden">Wishlist</span>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 sm:h-14 px-4 sm:px-6 rounded-full border-2 hover:bg-primary/5 hover:border-primary transition-all"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="ml-1.5 sm:ml-2 text-sm sm:text-base">Share</span>
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">FDA Approved</p>
                  <p className="text-xs text-muted-foreground">
                    Ghana FDA certified
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Genuine Product</p>
                  <p className="text-xs text-muted-foreground">
                    100% authentic
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">
                    7-day return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="ingredients"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              How to Use
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Benefits
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Reviews ({product.reviewCount || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              {product.description && (
                <div className="whitespace-pre-line">{product.description}</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              {product.ingredients ? (
                <ul>
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p>Ingredient information not available for this product.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              {product.usage ? (
                <p>{product.usage}</p>
              ) : (
                <p>
                  Please follow the usage instructions on the product packaging or
                  consult with a healthcare professional.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              {product.benefits && product.benefits.length > 0 ? (
                <ul>
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p>Benefit information will be displayed here once available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-5 h-5',
                            i < Math.round(product?.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} out of 5 ({reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Write a Review</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write a Review for {product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Your Name *</Label>
                        <Input
                          id="userName"
                          value={reviewForm.userName}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, userName: e.target.value })
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rating *</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={cn(
                                  'w-8 h-8 transition-colors',
                                  rating <= reviewForm.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comment">Your Review *</Label>
                        <Textarea
                          id="comment"
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, comment: e.target.value })
                          }
                          placeholder="Share your experience with this product..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsReviewDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSubmitReview}>Submit Review</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'w-4 h-4',
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      {review.helpful > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {review.helpful} people found this helpful
                        </p>
                      )}
                      <Separator className="mt-4" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <FeaturedProducts
            products={relatedProducts}
            title="Related Products"
            subtitle="You might also like"
            viewAllLink={`/products?category=${product.category
              .toLowerCase()
              .replace(/\s+/g, '-')}`}
          />
        )}
      </div>

      {/* Mobile Sticky Action Bar */}
      <MobileStickyActions
        onAddToCart={handleAddToCart}
        disabled={product.stock <= 0}
        price={formatCurrency(finalPrice * quantity)}
        quantity={quantity}
      />
    </motion.div>
  )
}
