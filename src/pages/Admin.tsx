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
} from '@/lib/storage'
import { formatCurrency, generateId, slugify } from '@/lib/utils'
import type { Product, Banner, SiteInfo } from '@/types'

// Mock stats data
const stats = [
  {
    title: 'Total Orders',
    value: '156',
    change: '+12%',
    icon: ShoppingCart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Revenue',
    value: 'GH₵45,678',
    change: '+8%',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Customers',
    value: '1,234',
    change: '+15%',
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Conversion',
    value: '3.2%',
    change: '+2%',
    icon: TrendingUp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

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

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null
  )
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(
    null
  )
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)

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
    setEditingProduct(null)
    setIsProductDialogOpen(false)
    toast.success(isNew ? 'Product created' : 'Product updated')
  }

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    saveProducts(updatedProducts)
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <p className="text-muted-foreground mb-8">
          Manage your products, banners, and settings
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-green-500">{stat.change}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="banners">
              <Image className="w-4 h-4 mr-2" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products ({products.length})</CardTitle>
                <Dialog
                  open={isProductDialogOpen}
                  onOpenChange={setIsProductDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingProduct({ ...defaultProduct })}
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
                            <Input
                              value={editingProduct.category}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  category: e.target.value,
                                })
                              }
                              placeholder="Category"
                            />
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

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Price (GH₵) *</Label>
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
                            <Label>Stock</Label>
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
                            <Label>Discount %</Label>
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

                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsProductDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProduct}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-primary">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • Stock: {product.stock}
                          </span>
                          {product.discount && product.discount > 0 && (
                            <Badge variant="sale">{product.discount}% OFF</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product)
                            setIsProductDialogOpen(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Banners ({banners.length})</CardTitle>
                <Dialog
                  open={isBannerDialogOpen}
                  onOpenChange={setIsBannerDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingBanner({ ...defaultBanner })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Banner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsBannerDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveBanner}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{banner.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {banner.description}
                        </p>
                      </div>
                      <Badge variant={banner.active ? 'success' : 'secondary'}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleBannerActive(banner.id)}
                        >
                          {banner.active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingBanner(banner)
                            setIsBannerDialogOpen(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
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
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
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
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent>
                  {siteInfo && (
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
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Policies & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Policies & Settings</CardTitle>
                </CardHeader>
                <CardContent>
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
                          placeholder="Free shipping on orders over GH₵500!"
                        />
                      </div>

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
                          <Label>Free Shipping Threshold</Label>
                          <Input
                            type="number"
                            value={siteInfo.freeShippingThreshold}
                            onChange={(e) =>
                              setSiteInfo({
                                ...siteInfo,
                                freeShippingThreshold: Number(e.target.value),
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
                        <Label>Shipping Information</Label>
                        <Textarea
                          value={siteInfo.shippingInfo || ''}
                          onChange={(e) =>
                            setSiteInfo({
                              ...siteInfo,
                              shippingInfo: e.target.value,
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

              {/* Manager Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Manager Information</CardTitle>
                </CardHeader>
                <CardContent>
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
                <Button onClick={handleSaveSiteInfo} size="lg">
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
