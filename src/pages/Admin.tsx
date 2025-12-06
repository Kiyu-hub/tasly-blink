import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Image,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Save,
  Eye,
  EyeOff,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  getProducts,
  saveProducts,
  getBanners,
  saveBanners,
  getSiteInfo,
  saveSiteInfo,
  getCategoriesData,
  saveCategoriesData,
  updateCategoryProductCounts,
  getAds,
  saveAds,
  getAnalytics,
} from '@/lib/storage'
import { formatCurrency, generateId, slugify } from '@/lib/utils'
import type { Product, Banner, SiteInfo, CategoryData, Ad } from '@/types'

const defaultProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  imageURL: '',
  category: '',
  stock: 0,
  discount: 0,
  new: false,
}

const defaultBanner: Partial<Banner> = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  link: '',
  buttonText: 'Shop Now',
  active: true,
  order: 0,
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly')

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null
  )
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(
    null
  )
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryData> | null>(
    null
  )
  const [editingAd, setEditingAd] = useState<Partial<Ad> | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false)

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('tasly_admin_auth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      setProducts(getProducts())
      setBanners(getBanners())
      setSiteInfo(getSiteInfo())
      setCategories(getCategoriesData())
      setAds(getAds())
      updateCategoryProductCounts()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'health2024') {
      setIsAuthenticated(true)
      sessionStorage.setItem('tasly_admin_auth', 'authenticated')
      toast.success('Welcome to Admin Dashboard')
    } else {
      toast.error('Invalid password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('tasly_admin_auth')
    toast.success('Logged out successfully')
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-muted/30"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Products
  const handleSaveProduct = () => {
    if (!editingProduct?.name || !editingProduct?.price) {
      toast.error('Please fill in required fields')
      return
    }

    const isNew = !editingProduct.id
    const product: Product = {
      id: editingProduct.id || generateId(),
      name: editingProduct.name,
      slug: editingProduct.slug || slugify(editingProduct.name),
      description: editingProduct.description || '',
      price: editingProduct.price,
      imageURL:
        editingProduct.imageURL ||
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
      category: editingProduct.category || 'General',
      stock: editingProduct.stock || 0,
      discount: editingProduct.discount || 0,
      new: editingProduct.new || false,
    }

    let updatedProducts: Product[]
    if (isNew) {
      updatedProducts = [...products, product]
    } else {
      updatedProducts = products.map((p) =>
        p.id === product.id ? product : p
      )
    }

    setProducts(updatedProducts)
    saveProducts(updatedProducts)
    updateCategoryProductCounts()
    setCategories(getCategoriesData())
    setEditingProduct(null)
    setIsProductDialogOpen(false)
    toast.success(isNew ? 'Product created' : 'Product updated')
  }

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    saveProducts(updatedProducts)
    updateCategoryProductCounts()
    setCategories(getCategoriesData())
    toast.success('Product deleted')
  }

  // Banners
  const handleSaveBanner = () => {
    if (!editingBanner?.title || !editingBanner?.image) {
      toast.error('Please fill in required fields')
      return
    }

    const isNew = !editingBanner.id
    const banner: Banner = {
      id: editingBanner.id || generateId(),
      title: editingBanner.title,
      subtitle: editingBanner.subtitle || '',
      description: editingBanner.description || '',
      image: editingBanner.image,
      link: editingBanner.link || '',
      buttonText: editingBanner.buttonText || 'Shop Now',
      active: editingBanner.active ?? true,
      order: editingBanner.order || banners.length,
    }

    let updatedBanners: Banner[]
    if (isNew) {
      updatedBanners = [...banners, banner]
    } else {
      updatedBanners = banners.map((b) => (b.id === banner.id ? banner : b))
    }

    setBanners(updatedBanners)
    saveBanners(updatedBanners)
    setEditingBanner(null)
    setIsBannerDialogOpen(false)
    toast.success(isNew ? 'Banner created' : 'Banner updated')
  }

  const handleDeleteBanner = (id: string) => {
    const updatedBanners = banners.filter((b) => b.id !== id)
    setBanners(updatedBanners)
    saveBanners(updatedBanners)
    toast.success('Banner deleted')
  }

  const toggleBannerActive = (id: string) => {
    const updatedBanners = banners.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    )
    setBanners(updatedBanners)
    saveBanners(updatedBanners)
  }

  // Site Info
  const handleSaveSiteInfo = () => {
    if (siteInfo) {
      saveSiteInfo(siteInfo)
      toast.success('Settings saved')
    }
  }

  // Categories
  const handleSaveCategory = () => {
    if (!editingCategory?.name) {
      toast.error('Please enter a category name')
      return
    }

    const isNew = !editingCategory.id
    const category: CategoryData = {
      id: editingCategory.id || generateId(),
      name: editingCategory.name,
      slug: slugify(editingCategory.name),
      description: editingCategory.description || `Explore our ${editingCategory.name.toLowerCase()} collection`,
      image: editingCategory.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
      color: editingCategory.color || 'from-gray-500 to-slate-600',
      order: editingCategory.order ?? categories.length,
      visible: editingCategory.visible ?? true,
      productCount: editingCategory.productCount || 0,
    }

    let updatedCategories: CategoryData[]
    if (isNew) {
      updatedCategories = [...categories, category]
    } else {
      updatedCategories = categories.map((c) => (c.id === category.id ? category : c))
    }

    setCategories(updatedCategories)
    saveCategoriesData(updatedCategories)
    setEditingCategory(null)
    setIsCategoryDialogOpen(false)
    toast.success(isNew ? 'Category created' : 'Category updated')
  }

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return

    // Check if any products use this category
    const hasProducts = products.some((p) => p.category === category.name)
    if (hasProducts) {
      toast.error(`Cannot delete category "${category.name}" - it has products assigned to it`)
      return
    }

    const updatedCategories = categories.filter((c) => c.id !== id)
    setCategories(updatedCategories)
    saveCategoriesData(updatedCategories)
    toast.success('Category deleted')
  }

  const toggleCategoryVisible = (id: string) => {
    const updatedCategories = categories.map((c) =>
      c.id === id ? { ...c, visible: !c.visible } : c
    )
    setCategories(updatedCategories)
    saveCategoriesData(updatedCategories)
  }

  const moveCategoryOrder = (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === categories.length - 1) return

    const newCategories = [...categories]
    const temp = newCategories[index]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    newCategories[index] = newCategories[swapIndex]
    newCategories[swapIndex] = temp

    // Update order values
    newCategories.forEach((cat, idx) => {
      cat.order = idx
    })

    setCategories(newCategories)
    saveCategoriesData(newCategories)
  }

  // Ads
  const handleSaveAd = () => {
    if (!editingAd?.title || !editingAd?.image || !editingAd?.position) {
      toast.error('Please fill in required fields')
      return
    }

    const isNew = !editingAd.id
    const ad: Ad = {
      id: editingAd.id || generateId(),
      title: editingAd.title,
      description: editingAd.description || '',
      image: editingAd.image,
      link: editingAd.link || '',
      buttonText: editingAd.buttonText || 'Learn More',
      position: editingAd.position,
      active: editingAd.active ?? true,
      order: editingAd.order ?? ads.length,
      startDate: editingAd.startDate,
      endDate: editingAd.endDate,
    }

    let updatedAds: Ad[]
    if (isNew) {
      updatedAds = [...ads, ad]
    } else {
      updatedAds = ads.map((a) => (a.id === ad.id ? ad : a))
    }

    setAds(updatedAds)
    saveAds(updatedAds)
    setEditingAd(null)
    setIsAdDialogOpen(false)
    toast.success(isNew ? 'Ad created' : 'Ad updated')
  }

  const handleDeleteAd = (id: string) => {
    const updatedAds = ads.filter((a) => a.id !== id)
    setAds(updatedAds)
    saveAds(updatedAds)
    toast.success('Ad deleted')
  }

  const toggleAdActive = (id: string) => {
    const updatedAds = ads.map((a) =>
      a.id === id ? { ...a, active: !a.active } : a
    )
    setAds(updatedAds)
    saveAds(updatedAds)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-4 md:py-8 pb-20 md:pb-8"
    >
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Manage your store</p>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm" className="w-full sm:w-auto">
            Logout
          </Button>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={analyticsPeriod === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAnalyticsPeriod('daily')}
            className="whitespace-nowrap"
          >
            Today
          </Button>
          <Button
            variant={analyticsPeriod === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAnalyticsPeriod('weekly')}
          >
            Last 7 Days
          </Button>
          <Button
            variant={analyticsPeriod === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAnalyticsPeriod('monthly')}
          >
            Last 30 Days
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {(() => {
            const analytics = getAnalytics(analyticsPeriod)
            
            const stats = [
              {
                title: 'Total Visitors',
                value: analytics.totalVisitors.toString(),
                icon: Users,
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10',
              },
              {
                title: 'Total Orders',
                value: analytics.totalOrders.toString(),
                icon: ShoppingCart,
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10',
              },
              {
                title: 'Revenue',
                value: formatCurrency(analytics.totalRevenue),
                icon: DollarSign,
                color: 'text-green-500',
                bgColor: 'bg-green-500/10',
              },
              {
                title: 'Conversion Rate',
                value: `${analytics.conversionRate.toFixed(1)}%`,
                icon: TrendingUp,
                color: 'text-orange-500',
                bgColor: 'bg-orange-500/10',
              },
            ]
            
            return stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {stat.title}
                        </p>
                        <p className="text-lg md:text-2xl font-bold truncate">{stat.value}</p>
                      </div>
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          })()}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4 md:space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 bg-muted rounded-lg">
            <TabsTrigger value="products" className="flex-shrink-0 text-xs md:text-sm px-2 md:px-3">
              <Package className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Products</span>
              <span className="sm:hidden">Items</span>
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex-shrink-0 text-xs md:text-sm px-2 md:px-3">
              <Image className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex-shrink-0 text-xs md:text-sm px-2 md:px-3">
              <Package className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Categories</span>
              <span className="sm:hidden">Cats</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex-shrink-0 text-xs md:text-sm px-2 md:px-3">
              <Image className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Ads
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-shrink-0 text-xs md:text-sm px-2 md:px-3">
              <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Products ({products.length})</CardTitle>
                <Dialog
                  open={isProductDialogOpen}
                  onOpenChange={setIsProductDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingProduct({ ...defaultProduct })}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct?.id ? 'Edit Product' : 'Add Product'}
                      </DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                              value={editingProduct.name}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Product name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <select
                              value={editingProduct.category}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  category: e.target.value,
                                })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select Category</option>
                              {categories.filter(c => c.visible).map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                  {cat.name} ({cat.productCount || 0})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={editingProduct.description}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                description: e.target.value,
                              })
                            }
                            placeholder="Product description"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={editingProduct.imageURL}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                imageURL: e.target.value,
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm md:text-base">Price (GH₵) *</Label>
                            <Input
                              type="number"
                              value={editingProduct.price}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  price: Number(e.target.value),
                                })
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm md:text-base">Stock</Label>
                            <Input
                              type="number"
                              value={editingProduct.stock}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  stock: Number(e.target.value),
                                })
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm md:text-base">Discount %</Label>
                            <Input
                              type="number"
                              value={editingProduct.discount}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  discount: Number(e.target.value),
                                })
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingProduct.new}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  new: e.target.checked,
                                })
                              }
                            />
                            <span className="text-sm">New Arrival</span>
                          </label>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsProductDialogOpen(false)}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProduct} className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-2 md:gap-4 p-3 md:p-4 border rounded-lg"
                    >
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base truncate">{product.name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
                          <span className="font-bold text-primary text-sm md:text-base">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-xs md:text-sm text-muted-foreground">
                            • Stock: {product.stock}
                          </span>
                          {product.discount && product.discount > 0 && (
                            <Badge variant="sale" className="text-xs">{product.discount}% OFF</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 md:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => {
                            setEditingProduct(product)
                            setIsProductDialogOpen(true)
                          }}
                        >
                          <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 h-8 w-8 md:h-10 md:w-10"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Banners ({banners.length})</CardTitle>
                <Dialog
                  open={isBannerDialogOpen}
                  onOpenChange={setIsBannerDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingBanner({ ...defaultBanner })}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Banner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader>
                      <DialogTitle>
                        {editingBanner?.id ? 'Edit Banner' : 'Add Banner'}
                      </DialogTitle>
                    </DialogHeader>
                    {editingBanner && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input
                            value={editingBanner.title}
                            onChange={(e) =>
                              setEditingBanner({
                                ...editingBanner,
                                title: e.target.value,
                              })
                            }
                            placeholder="Banner title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input
                            value={editingBanner.subtitle}
                            onChange={(e) =>
                              setEditingBanner({
                                ...editingBanner,
                                subtitle: e.target.value,
                              })
                            }
                            placeholder="Banner subtitle"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={editingBanner.description}
                            onChange={(e) =>
                              setEditingBanner({
                                ...editingBanner,
                                description: e.target.value,
                              })
                            }
                            placeholder="Banner description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Image URL *</Label>
                          <Input
                            value={editingBanner.image}
                            onChange={(e) =>
                              setEditingBanner({
                                ...editingBanner,
                                image: e.target.value,
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Link URL</Label>
                            <Input
                              value={editingBanner.link}
                              onChange={(e) =>
                                setEditingBanner({
                                  ...editingBanner,
                                  link: e.target.value,
                                })
                              }
                              placeholder="/products"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                              value={editingBanner.buttonText}
                              onChange={(e) =>
                                setEditingBanner({
                                  ...editingBanner,
                                  buttonText: e.target.value,
                                })
                              }
                              placeholder="Shop Now"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingBanner.active}
                            onChange={(e) =>
                              setEditingBanner({
                                ...editingBanner,
                                active: e.target.checked,
                              })
                            }
                          />
                          <span className="text-sm">Active</span>
                        </label>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsBannerDialogOpen(false)}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveBanner} className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex items-center gap-2 md:gap-4 p-3 md:p-4 border rounded-lg"
                    >
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-16 h-12 md:w-24 md:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base truncate">{banner.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {banner.description}
                        </p>
                      </div>
                      <Badge variant={banner.active ? 'success' : 'secondary'} className="flex-shrink-0 text-xs">
                        {banner.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex gap-1 md:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => toggleBannerActive(banner.id)}
                        >
                          {banner.active ? (
                            <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
                          ) : (
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => {
                            setEditingBanner(banner)
                            setIsBannerDialogOpen(true)
                          }}
                        >
                          <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 h-8 w-8 md:h-10 md:w-10"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Categories ({categories.length})</CardTitle>
                <Dialog
                  open={isCategoryDialogOpen}
                  onOpenChange={setIsCategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingCategory({ 
                        name: '',
                        description: '',
                        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
                        color: 'from-gray-500 to-slate-600',
                        order: categories.length,
                        visible: true,
                      })}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory?.id ? 'Edit Category' : 'Add Category'}
                      </DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                              value={editingCategory.name}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Category name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gradient Color Class</Label>
                            <Input
                              value={editingCategory.color}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  color: e.target.value,
                                })
                              }
                              placeholder="from-blue-500 to-indigo-600"
                            />
                            <p className="text-xs text-muted-foreground">
                              Tailwind gradient classes (e.g., from-rose-500 to-red-600)
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={editingCategory.description}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                description: e.target.value,
                              })
                            }
                            placeholder="Category description"
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={editingCategory.image}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                image: e.target.value,
                              })
                            }
                            placeholder="https://images.unsplash.com/photo-..."
                          />
                          {editingCategory.image && (
                            <div className="mt-2">
                              <img
                                src={editingCategory.image}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingCategory.visible}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                visible: e.target.checked,
                              })
                            }
                          />
                          <span className="text-sm">Visible on site</span>
                        </label>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(null)
                              setIsCategoryDialogOpen(false)
                            }}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveCategory} className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            Save Category
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <div className="space-y-3">
                  {categories.sort((a, b) => a.order - b.order).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-start gap-2 md:gap-4 p-3 md:p-4 border rounded-lg"
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                          <h3 className="font-medium text-sm md:text-base">{category.name}</h3>
                          <Badge variant={category.visible ? 'default' : 'secondary'} className="text-xs">
                            {category.visible ? 'Visible' : 'Hidden'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {category.productCount || 0} products
                          </Badge>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`h-3 md:h-4 w-16 md:w-20 rounded bg-gradient-to-r ${category.color}`} />
                          <span className="text-xs text-muted-foreground truncate">{category.color}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 md:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => moveCategoryOrder(category.id, 'up')}
                          disabled={category.order === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => moveCategoryOrder(category.id, 'down')}
                          disabled={category.order === categories.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => toggleCategoryVisible(category.id)}
                        >
                          {category.visible ? (
                            <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
                          ) : (
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => {
                            setEditingCategory(category)
                            setIsCategoryDialogOpen(true)
                          }}
                        >
                          <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 h-8 w-8 md:h-10 md:w-10"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Advertisements ({ads.length})</CardTitle>
                <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() =>
                        setEditingAd({
                          title: '',
                          description: '',
                          image: '',
                          link: '',
                          buttonText: 'Learn More',
                          position: 'homepage-top',
                          active: true,
                          order: ads.length,
                        })
                      }
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Ad
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAd?.id ? 'Edit Advertisement' : 'Add Advertisement'}
                      </DialogTitle>
                    </DialogHeader>
                    {editingAd && (
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                              value={editingAd.title}
                              onChange={(e) =>
                                setEditingAd({ ...editingAd, title: e.target.value })
                              }
                              placeholder="Ad title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position *</Label>
                            <select
                              value={editingAd.position}
                              onChange={(e) =>
                                setEditingAd({
                                  ...editingAd,
                                  position: e.target.value as Ad['position'],
                                })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="homepage-top">Homepage Top</option>
                              <option value="homepage-middle">Homepage Middle</option>
                              <option value="products-top">Products Page Top</option>
                              <option value="products-sidebar">Products Sidebar</option>
                              <option value="cart-bottom">Cart Bottom</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={editingAd.description}
                            onChange={(e) =>
                              setEditingAd({ ...editingAd, description: e.target.value })
                            }
                            placeholder="Ad description"
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Image URL *</Label>
                          <Input
                            value={editingAd.image}
                            onChange={(e) =>
                              setEditingAd({ ...editingAd, image: e.target.value })
                            }
                            placeholder="https://..."
                          />
                          {editingAd.image && (
                            <img
                              src={editingAd.image}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded"
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Link URL</Label>
                            <Input
                              value={editingAd.link}
                              onChange={(e) =>
                                setEditingAd({ ...editingAd, link: e.target.value })
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                              value={editingAd.buttonText}
                              onChange={(e) =>
                                setEditingAd({ ...editingAd, buttonText: e.target.value })
                              }
                              placeholder="Learn More"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date (Optional)</Label>
                            <Input
                              type="date"
                              value={editingAd.startDate || ''}
                              onChange={(e) =>
                                setEditingAd({ ...editingAd, startDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date (Optional)</Label>
                            <Input
                              type="date"
                              value={editingAd.endDate || ''}
                              onChange={(e) =>
                                setEditingAd({ ...editingAd, endDate: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingAd.active}
                            onChange={(e) =>
                              setEditingAd({ ...editingAd, active: e.target.checked })
                            }
                          />
                          <span className="text-sm">Active</span>
                        </label>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingAd(null)
                              setIsAdDialogOpen(false)
                            }}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveAd} className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            Save Ad
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <div className="space-y-3">
                  {ads.map((ad) => (
                    <div
                      key={ad.id}
                      className="flex items-start gap-2 md:gap-4 p-3 md:p-4 border rounded-lg"
                    >
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-16 h-12 md:w-24 md:h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                          <h3 className="font-medium text-sm md:text-base">{ad.title}</h3>
                          <Badge variant={ad.active ? 'default' : 'secondary'} className="text-xs">
                            {ad.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="text-xs truncate">{ad.position}</Badge>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                          {ad.description || 'No description'}
                        </p>
                        {(ad.startDate || ad.endDate) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {ad.startDate && `From: ${ad.startDate}`}
                            {ad.startDate && ad.endDate && ' | '}
                            {ad.endDate && `To: ${ad.endDate}`}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 md:gap-2 flex-shrink-0 flex-wrap">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => toggleAdActive(ad.id)}
                        >
                          {ad.active ? (
                            <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
                          ) : (
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => {
                            setEditingAd(ad)
                            setIsAdDialogOpen(true)
                          }}
                        >
                          <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 h-8 w-8 md:h-10 md:w-10"
                          onClick={() => handleDeleteAd(ad.id)}
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-4 md:space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Site Name</Label>
                          <Input
                            value={siteInfo.name}
                            onChange={(e) =>
                              setSiteInfo({ ...siteInfo, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tagline</Label>
                          <Input
                            value={siteInfo.tagline}
                            onChange={(e) =>
                              setSiteInfo({ ...siteInfo, tagline: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Logo URL</Label>
                          <Input
                            value={siteInfo.logo || ''}
                            onChange={(e) =>
                              setSiteInfo({ ...siteInfo, logo: e.target.value })
                            }
                            placeholder="https://example.com/logo.png"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the URL for your site logo (appears in header and footer)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Favicon URL</Label>
                          <Input
                            value={siteInfo.favicon || ''}
                            onChange={(e) =>
                              setSiteInfo({ ...siteInfo, favicon: e.target.value })
                            }
                            placeholder="https://example.com/favicon.ico"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the URL for your favicon (browser tab icon)
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={siteInfo.description}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>About Us</Label>
                        <Textarea
                          value={siteInfo.aboutUs || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              aboutUs: e.target.value,
                            })
                          }
                          rows={6}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Mission Statement</Label>
                          <Textarea
                            value={siteInfo.missionStatement || ''}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                missionStatement: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Vision Statement</Label>
                          <Textarea
                            value={siteInfo.visionStatement || ''}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                visionStatement: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Our Story Section</h3>
                        <div className="space-y-2">
                          <Label>Story Title</Label>
                          <Input
                            value={siteInfo.ourStory?.title || 'Our Story'}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                ourStory: {
                                  ...siteInfo.ourStory,
                                  title: e.target.value,
                                },
                              })
                            }
                            placeholder="Our Story"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Story Content</Label>
                          <Textarea
                            value={siteInfo.ourStory?.content || ''}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                ourStory: {
                                  ...siteInfo.ourStory,
                                  content: e.target.value,
                                },
                              })
                            }
                            rows={8}
                            placeholder="Tell your story... You can use \n\n to separate paragraphs."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Story Image URL</Label>
                          <Input
                            value={siteInfo.ourStory?.image || ''}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                ourStory: {
                                  ...siteInfo.ourStory,
                                  image: e.target.value,
                                },
                              })
                            }
                            placeholder="https://example.com/story-image.jpg"
                          />
                          {siteInfo.ourStory?.image && (
                            <img
                              src={siteInfo.ourStory.image}
                              alt="Story preview"
                              className="w-full max-w-md rounded-lg mt-2"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={siteInfo.email}
                            onChange={(e) =>
                              setSiteInfo({ ...siteInfo, email: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={siteInfo.phone}
                            onChange={(e) =>
                              setSiteInfo({ ...siteInfo, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>WhatsApp Number (with country code)</Label>
                        <Input
                          value={siteInfo.whatsapp}
                          onChange={(e) =>
                            setSiteInfo({ ...siteInfo, whatsapp: e.target.value })
                          }
                          placeholder="233599004548"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>WhatsApp Community Auto-Join Link</Label>
                        <Input
                          value={siteInfo.whatsappCommunityLink || ''}
                          onChange={(e) =>
                            setSiteInfo({ ...siteInfo, whatsappCommunityLink: e.target.value })
                          }
                          placeholder="https://chat.whatsapp.com/..."
                        />
                        <p className="text-xs text-muted-foreground">
                          Add your WhatsApp community invite link. Users will be automatically added when they click "Join Community".
                          Leave empty to use regular WhatsApp chat.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Textarea
                          value={siteInfo.address}
                          onChange={(e) =>
                            setSiteInfo({ ...siteInfo, address: e.target.value })
                          }
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Business Hours</Label>
                        <Input
                          value={siteInfo.businessHours || ''}
                          onChange={(e) =>
                            setSiteInfo({ ...siteInfo, businessHours: e.target.value })
                          }
                          placeholder="Monday - Saturday: 9:00 AM - 6:00 PM"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label>Facebook</Label>
                        <Input
                          value={siteInfo.socialMedia?.facebook || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              socialMedia: {
                                ...siteInfo.socialMedia,
                                facebook: e.target.value,
                              },
                            })
                          }
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instagram</Label>
                        <Input
                          value={siteInfo.socialMedia?.instagram || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              socialMedia: {
                                ...siteInfo.socialMedia,
                                instagram: e.target.value,
                              },
                            })
                          }
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Twitter</Label>
                        <Input
                          value={siteInfo.socialMedia?.twitter || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              socialMedia: {
                                ...siteInfo.socialMedia,
                                twitter: e.target.value,
                              },
                            })
                          }
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>YouTube</Label>
                        <Input
                          value={siteInfo.socialMedia?.youtube || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              socialMedia: {
                                ...siteInfo.socialMedia,
                                youtube: e.target.value,
                              },
                            })
                          }
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>TikTok</Label>
                        <Input
                          value={siteInfo.socialMedia?.tiktok || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              socialMedia: {
                                ...siteInfo.socialMedia,
                                tiktok: e.target.value,
                              },
                            })
                          }
                          placeholder="https://tiktok.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>WhatsApp Chat Link</Label>
                        <Input
                          value={siteInfo.socialMedia?.whatsapp || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              socialMedia: {
                                ...siteInfo.socialMedia,
                                whatsapp: e.target.value,
                              },
                            })
                          }
                          placeholder="233599004548"
                        />
                        <p className="text-xs text-muted-foreground">Enter phone number with country code (no + or spaces)</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-4">Social Media Display Settings</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={siteInfo.socialMediaDisplay?.showFacebook ?? true}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                socialMediaDisplay: {
                                  ...siteInfo.socialMediaDisplay,
                                  showFacebook: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Show Facebook</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={siteInfo.socialMediaDisplay?.showInstagram ?? true}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                socialMediaDisplay: {
                                  ...siteInfo.socialMediaDisplay,
                                  showInstagram: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Show Instagram</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={siteInfo.socialMediaDisplay?.showTwitter ?? true}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                socialMediaDisplay: {
                                  ...siteInfo.socialMediaDisplay,
                                  showTwitter: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Show Twitter</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={siteInfo.socialMediaDisplay?.showYoutube ?? true}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                socialMediaDisplay: {
                                  ...siteInfo.socialMediaDisplay,
                                  showYoutube: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Show YouTube</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={siteInfo.socialMediaDisplay?.showTiktok ?? true}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                socialMediaDisplay: {
                                  ...siteInfo.socialMediaDisplay,
                                  showTiktok: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Show TikTok</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={siteInfo.socialMediaDisplay?.showWhatsApp ?? true}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                socialMediaDisplay: {
                                  ...siteInfo.socialMediaDisplay,
                                  showWhatsApp: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Show WhatsApp</span>
                        </label>
                      </div>
                    </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Policies & Settings */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Policies & Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Announcement Banner Text</Label>
                        <Input
                          value={siteInfo.announcement || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              announcement: e.target.value,
                            })
                          }
                          placeholder="Free delivery on orders over GH₵500!"
                        />
                      </div>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={siteInfo.showAnnouncement ?? true}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              showAnnouncement: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Show Announcement Banner</span>
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Currency Symbol</Label>
                          <Input
                            value={siteInfo.currency}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                currency: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Free Delivery Threshold</Label>
                          <Input
                            type="number"
                            value={siteInfo.freeDeliveryThreshold}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                freeDeliveryThreshold: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Delivery Fee</Label>
                          <Input
                            type="number"
                            value={siteInfo.deliveryFee || 0}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                deliveryFee: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Delivery Information</Label>
                        <Textarea
                          value={siteInfo.deliveryInfo || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              deliveryInfo: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Return Policy</Label>
                        <Textarea
                          value={siteInfo.returnPolicy || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              returnPolicy: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Core Values */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Core Values</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage the core values displayed on the About page
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <div className="space-y-4">
                      {(siteInfo.coreValues || []).map((value, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Value {index + 1}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500"
                              onClick={() => {
                                const newValues = [...(siteInfo.coreValues || [])]
                                newValues.splice(index, 1)
                                setSiteInfo({ ...siteInfo, coreValues: newValues })
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={value.title}
                                onChange={(e) => {
                                  const newValues = [...(siteInfo.coreValues || [])]
                                  newValues[index] = { ...value, title: e.target.value }
                                  setSiteInfo({ ...siteInfo, coreValues: newValues })
                                }}
                                placeholder="Quality Assured"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Icon</Label>
                              <select
                                value={value.icon || 'Heart'}
                                onChange={(e) => {
                                  const newValues = [...(siteInfo.coreValues || [])]
                                  newValues[index] = { ...value, icon: e.target.value }
                                  setSiteInfo({ ...siteInfo, coreValues: newValues })
                                }}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="Leaf">Leaf</option>
                                <option value="Award">Award</option>
                                <option value="Heart">Heart</option>
                                <option value="Globe">Globe</option>
                                <option value="Target">Target</option>
                                <option value="Users">Users</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={value.description}
                              onChange={(e) => {
                                const newValues = [...(siteInfo.coreValues || [])]
                                newValues[index] = { ...value, description: e.target.value }
                                setSiteInfo({ ...siteInfo, coreValues: newValues })
                              }}
                              placeholder="Every product undergoes rigorous testing..."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newValues = [
                            ...(siteInfo.coreValues || []),
                            { title: '', description: '', icon: 'Heart' }
                          ]
                          setSiteInfo({ ...siteInfo, coreValues: newValues })
                        }}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Core Value
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Statistics</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage the statistics displayed on the About page
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(siteInfo.stats || []).map((stat, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Stat {index + 1}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 h-8 w-8 p-0"
                                onClick={() => {
                                  const newStats = [...(siteInfo.stats || [])]
                                  newStats.splice(index, 1)
                                  setSiteInfo({ ...siteInfo, stats: newStats })
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Label>Number</Label>
                              <Input
                                value={stat.number}
                                onChange={(e) => {
                                  const newStats = [...(siteInfo.stats || [])]
                                  newStats[index] = { ...stat, number: e.target.value }
                                  setSiteInfo({ ...siteInfo, stats: newStats })
                                }}
                                placeholder="10+"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Label</Label>
                              <Input
                                value={stat.label}
                                onChange={(e) => {
                                  const newStats = [...(siteInfo.stats || [])]
                                  newStats[index] = { ...stat, label: e.target.value }
                                  setSiteInfo({ ...siteInfo, stats: newStats })
                                }}
                                placeholder="Years Experience"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newStats = [
                            ...(siteInfo.stats || []),
                            { number: '', label: '' }
                          ]
                          setSiteInfo({ ...siteInfo, stats: newStats })
                        }}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Statistic
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health Banners */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Health Banners</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage the health banners carousel on the home page
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <div className="space-y-4">
                      {(siteInfo.healthBanners || []).map((banner, index) => (
                        <div key={banner.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Health Banner {index + 1}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500"
                              onClick={() => {
                                const newBanners = [...(siteInfo.healthBanners || [])]
                                newBanners.splice(index, 1)
                                setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={banner.title}
                                onChange={(e) => {
                                  const newBanners = [...(siteInfo.healthBanners || [])]
                                  newBanners[index] = { ...banner, title: e.target.value }
                                  setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                                }}
                                placeholder="Health & Happiness"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Order</Label>
                              <Input
                                type="number"
                                value={banner.order}
                                onChange={(e) => {
                                  const newBanners = [...(siteInfo.healthBanners || [])]
                                  newBanners[index] = { ...banner, order: Number(e.target.value) }
                                  setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                                }}
                                placeholder="1"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={banner.description}
                              onChange={(e) => {
                                const newBanners = [...(siteInfo.healthBanners || [])]
                                newBanners[index] = { ...banner, description: e.target.value }
                                setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                              }}
                              placeholder="Bringing wellness to every Ghanaian family"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                              value={banner.image}
                              onChange={(e) => {
                                const newBanners = [...(siteInfo.healthBanners || [])]
                                newBanners[index] = { ...banner, image: e.target.value }
                                setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                              }}
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Button Text</Label>
                              <Input
                                value={banner.ctaText}
                                onChange={(e) => {
                                  const newBanners = [...(siteInfo.healthBanners || [])]
                                  newBanners[index] = { ...banner, ctaText: e.target.value }
                                  setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                                }}
                                placeholder="Shop Now"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Button Link</Label>
                              <Input
                                value={banner.ctaLink}
                                onChange={(e) => {
                                  const newBanners = [...(siteInfo.healthBanners || [])]
                                  newBanners[index] = { ...banner, ctaLink: e.target.value }
                                  setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                                }}
                                placeholder="/products"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newBanners = [
                            ...(siteInfo.healthBanners || []),
                            {
                              id: `hb${Date.now()}`,
                              title: '',
                              description: '',
                              image: '',
                              ctaText: 'Shop Now',
                              ctaLink: '/products',
                              order: (siteInfo.healthBanners?.length || 0) + 1
                            }
                          ]
                          setSiteInfo({ ...siteInfo, healthBanners: newBanners })
                        }}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Health Banner
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Manager Information */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Manager Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {siteInfo && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Manager Name</Label>
                          <Input
                            value={siteInfo.manager?.name || ''}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                manager: {
                                  ...siteInfo.manager,
                                  name: e.target.value,
                                  role: siteInfo.manager?.role || '',
                                  image: siteInfo.manager?.image || '',
                                },
                              })
                            }
                            placeholder="Dr. Kofi Mensah"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Manager Role</Label>
                          <Input
                            value={siteInfo.manager?.role || ''}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                manager: {
                                  ...siteInfo.manager,
                                  name: siteInfo.manager?.name || '',
                                  role: e.target.value,
                                  image: siteInfo.manager?.image || '',
                                },
                              })
                            }
                            placeholder="General Manager"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Manager Image URL</Label>
                        <Input
                          value={siteInfo.manager?.image || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              manager: {
                                ...siteInfo.manager,
                                name: siteInfo.manager?.name || '',
                                role: siteInfo.manager?.role || '',
                                image: e.target.value,
                              },
                            })
                          }
                          placeholder="https://example.com/manager.jpg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Manager Bio</Label>
                        <Textarea
                          value={siteInfo.manager?.bio || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              manager: {
                                ...siteInfo.manager,
                                name: siteInfo.manager?.name || '',
                                role: siteInfo.manager?.role || '',
                                image: siteInfo.manager?.image || '',
                                bio: e.target.value,
                              },
                            })
                          }
                          rows={3}
                          placeholder="Leading Tasly Ghana with years of experience..."
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSaveSiteInfo} size="lg" className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
