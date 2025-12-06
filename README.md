# Tasly Ghana 346 - E-Commerce Platform v3.0 🚀

## Overview
Tasly Ghana 346 is a **static e-commerce platform** for authentic Tasly herbal and food supplement products. This React + TypeScript application fetches data directly from GitHub, making it easy to update content visible to all users without a backend database.

## 🎯 Core Architecture: GitHub-Powered Static Site

### Data Source: GitHub Repository
- **No Backend Database**: Data stored in JSON files on GitHub
- **Automatic Updates**: Edit JSON files → Push to GitHub → All users see updates
- **Cached Locally**: localStorage caches data for fast loading & offline access
- **Admin Panel**: Optional UI for editing (exports to JSON files)
- **Production Ready**: Fetches from GitHub in production, local files in development

### Data Flow
1. **Production Mode**: App fetches `products.json` and `siteInfo.json` from GitHub → Cached in localStorage
2. **Development Mode**: Uses local JSON files for instant updates
3. **User Updates**: Edit JSON files in GitHub → Push → Website auto-updates (5min cache)
4. **WhatsApp Integration**: Checkout and pre-orders redirect to WhatsApp

## 🔐 Secure Admin Panel

### Access
- **Route**: `/admin-tasly-ghana-346` (unlisted, secure)
- **Password**: `health2024`
- **Session**: Password stored in sessionStorage during active session
- **No Public Links**: Admin route not linked anywhere on public site

### Admin Capabilities
1. **Product Management**
   - View all products
   - Add new products (auto-generates ID and slug)
   - Edit existing products (name, price, description, stock, images, etc.)
   - Delete products
   - Stock management

2. **Banner Management**
   - Add/edit/delete promotional banners
   - Upload banner images
   - Toggle active/inactive status
   - Reorder banners

3. **Complete Site Editor**
   - Basic Information (name, tagline, description, about us)
   - Contact Details (email, phone, WhatsApp, address, business hours)
   - Social Media Links (Facebook, Instagram, Twitter, YouTube, TikTok)
   - Policies (delivery info, return policy, announcements)
   - Mission & Vision statements
   - All header and footer content editable

### GitHub Auto-Sync (NEW) 🔄

The admin panel now supports **automatic syncing** to GitHub! When configured:

- ✅ **Auto-commit**: Changes made in admin panel automatically push to GitHub
- ✅ **Universal Updates**: All users see updates within 5 minutes
- ✅ **No Manual Export**: No need to export/import JSON files
- ✅ **Optional**: Works with or without GitHub token

**Setup Required**: Configure a GitHub Personal Access Token (takes 2 minutes)
- See [GITHUB_SYNC_SETUP.md](./GITHUB_SYNC_SETUP.md) for detailed setup instructions
- Without token: Changes save locally only, update GitHub manually

**Supported**:
- Product updates → `src/data/products.json`
- Site settings → `src/data/siteInfo.json`

## 📦 Product Catalog (12 Authentic Tasly Products)
1. **Tasly Danshen Plus Capsule** (GH₵250) - Cardiovascular health & heart support
2. **Tasly Cordyceps Mycelium Capsule** (GH₵280) - Immunity & energy boost
3. **Tasly Ginseng RH2 Capsule** (GH₵450) - Premium brain health & vitality
4. **Tasly Propolis Soft Capsule** (GH₵180) - Natural immune system booster
5. **Tasly Ganoderma Capsule** (GH₵290) - Reishi mushroom for overall wellness
6. **Tasly Ginkgo Capsule** (GH₵220) - Memory & cognitive function support
7. **Tasly Hepatone Capsule** (GH₵260) - Liver health & detoxification
8. **Tasly Digest Natural Capsule** (GH₵200) - Digestive health & comfort
9. **Tasly Chitosan Capsule** (GH₵240) - Weight management support
10. **Tasly Deepure Tea** (GH₵150) - Herbal detox & wellness tea
11. **Tasly IceBerry Juice** (GH₵180) - Beauty & antioxidant drink
12. **Tasly Calcium Tablets** (GH₵160) - Bone health & calcium supplement

## 📱 WhatsApp Integration

### Contact Number
**WhatsApp**: +233 59 900 4548 (233599004548)

### Checkout Flow
1. Customer adds items to cart
2. Clicks "Proceed to Checkout"
3. **Redirects to WhatsApp** with order details:
   ```
   Hello! I'd like to place an order:
   
   • 2x Tasly Danshen Plus - GH₵500
   • 1x Tasly Ginseng RH2 - GH₵450
   
   Total: GH₵950
   ```

### Pre-Order Flow (Out of Stock)
1. Product stock = 0
2. "Add to Cart" button becomes **"PRE-ORDER via WhatsApp"**
3. Quantity selector disabled
4. **Redirects to WhatsApp** with pre-order message:
   ```
   Hi Tasly Ghana 346, I would like to pre-order the following product:
   
   Product: Tasly Cordyceps Mycelium Capsule
   Quantity: 2
   
   Please let me know when it will be available.
   ```

## 🎨 Stock Management Features

### Stock Display
- **In Stock (>5 units)**: Green badge "In Stock • X available"
- **Low Stock (1-5 units)**: Orange badge "Only X left in stock!"
- **Out of Stock (0 units)**: Red badge "OUT OF STOCK • Pre-order available"

### Product Detail Page
- Real-time stock counter
- Dynamic button states based on stock
- Quantity selector limited to available stock
- Pre-order button appears when stock = 0

## 🖼️ Health Banner Carousel

### Features
- **Auto-scrolling**: 5-second interval
- **3 High-Quality Images**:
  1. Happy family in park (health & happiness)
  2. Professional doctor consultation
  3. Wellness lifestyle scene
- **Smooth Animations**: Framer Motion transitions
- **Manual Controls**: Previous/Next buttons + dot indicators
- **Responsive**: Adapts to all screen sizes

### Location
Positioned below hero section on homepage for maximum visibility

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite 7.2.6** - Lightning-fast build tool
- **TailwindCSS 3.4.17** - Utility-first styling
- **React Router DOM** - Client-side routing

### State Management
- **Zustand** - Lightweight cart/wishlist state
- **LocalStorage** - Primary database
- **SessionStorage** - Admin authentication

### UI Components
- **Radix UI** - Accessible primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

## ✨ Complete Feature Set

### Customer Features
- ✅ Browse 12 authentic Tasly products
- ✅ Advanced search and filtering
- ✅ Shopping cart with quantity management
- ✅ Wishlist functionality
- ✅ Stock availability indicators
- ✅ WhatsApp checkout integration
- ✅ WhatsApp pre-order for out-of-stock items
- ✅ Product reviews (dynamically generated)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light theme toggle
- ✅ Health banner carousel

### Admin Features (Password Protected)
- ✅ Add/Edit/Delete products
- ✅ Stock management
- ✅ Banner management
- ✅ Complete site content editor
- ✅ Social media link management
- ✅ Contact information editor
- ✅ Policy management
- ✅ Real-time preview
- ✅ Session-based authentication
- ✅ **Export/Import configuration** (sync across browsers)

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Server runs at: `http://localhost:5174`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📂 Project Structure
```
src/
├── components/
│   ├── home/
│   │   ├── HeroCarousel.tsx
│   │   ├── HealthBannerCarousel.tsx   # NEW: Health banner carousel
│   │   ├── FeaturedProducts.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   └── ui/                # Radix UI components
├── data/
│   ├── products.json      # 12 Tasly products
│   └── siteInfo.json      # Complete site configuration
├── lib/
│   ├── storage.ts         # localStorage management
│   └── utils.ts           # Utility functions
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx  # UPDATED: Stock management + pre-order
│   ├── Cart.tsx           # WhatsApp checkout
│   ├── Admin.tsx          # UPDATED: Password + comprehensive editor
│   └── ...
├── store/                 # Zustand stores
│   └── index.ts
└── types/
    └── index.ts           # UPDATED: Expanded SiteInfo interface
```

## 🔧 Data Management

### Initial Setup
On first load, data flows from JSON files → localStorage:
```typescript
// storage.ts
export function initializeData(): void {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts))
  }
  if (!localStorage.getItem(SITE_INFO_KEY)) {
    localStorage.setItem(SITE_INFO_KEY, JSON.stringify(defaultSiteInfo))
  }
}
```

### Admin Updates
All admin changes directly modify localStorage:
```typescript
export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function saveSiteInfo(siteInfo: SiteInfo): void {
  localStorage.setItem(SITE_INFO_KEY, JSON.stringify(siteInfo))
}
```

## 📝 Key Files Modified/Created

### New Files
- `src/components/home/HealthBannerCarousel.tsx` - Auto-scrolling health banner

### Updated Files
- `src/App.tsx` - Admin route changed to `/admin-tasly-ghana-346`
- `src/pages/Admin.tsx` - Password protection + comprehensive site editor
- `src/pages/ProductDetail.tsx` - Stock management + pre-order button
- `src/pages/Home.tsx` - Integrated health banner carousel
- `src/types/index.ts` - Expanded SiteInfo interface
- `src/lib/storage.ts` - Enhanced data mapping

## 🎯 Admin Panel Usage

### Updating Site Content (Simple Method - Recommended)

**All users see your changes by editing JSON files directly on GitHub:**

1. **Go to GitHub Repository**
   - Navigate to: `https://github.com/Kiyu-hub/tasly-blink`
   - Click on `src/data/`

2. **Edit Products**
   - Click `products.json` → Click pencil icon (Edit)
   - Make your changes (add/edit products, update prices, change stock levels)
   - Scroll down → Add commit message → Click "Commit changes"
   - ✅ **Done!** All users will see updates within 5 minutes

3. **Edit Site Information**
   - Click `siteInfo.json` → Click pencil icon
   - Update contact info, mission statement, Our Story, etc.
   - Commit changes
   - ✅ **Done!** Changes live for everyone

### Using the Admin Panel (Alternative Method)

If you prefer a visual interface:

1. **Access**
   - Navigate to: `/admin-tasly-ghana-346`
   - Enter password: `health2024`

2. **Make Changes**
   - Edit products, banners, site content
   - Changes save to localStorage

3. **Export Configuration**
   - Go to "Export/Import" tab
   - Click "Export All Data"
   - Download JSON file

4. **Update GitHub**
   - Replace `src/data/products.json` and `src/data/siteInfo.json` in GitHub
   - Commit changes
   - ✅ **Everyone sees your updates!**

## 📱 Contact Information

- **Email**: info@taslyghana346.com
- **Phone**: +233 59 900 4548
- **WhatsApp**: 233599004548
- **Address**: Accra, Ghana
- **Business Hours**: Monday - Saturday: 9:00 AM - 6:00 PM

## 🌟 Key Highlights

1. **GitHub-Powered**: Data fetched from GitHub repository - edit once, visible to all
2. **No Backend Required**: Runs entirely as static site, can be hosted anywhere
3. **WhatsApp Integration**: No payment gateway needed - orders via WhatsApp
4. **Simple Updates**: Edit JSON files on GitHub → All users see changes
5. **Fast & Cached**: 5-minute cache for performance, localStorage for offline access
6. **Admin Panel**: Optional visual editor for non-technical users
7. **Responsive Design**: Perfect on all devices
8. **Production Ready**: Optimized build with Vite, CDN-friendly

## 📄 License
MIT License - Feel free to use for your projects!

### Products
Products are stored in `/src/data/products.json` and loaded into localStorage on app initialization. Each product includes:
- Name, description, long description
- Pricing (with optional discounts)
- Stock levels
- Images
- Category & tags
- Benefits
- Ratings & reviews
- Featured/bestseller flags

### Site Information
Configured in `/src/data/siteInfo.json` with:
- Business details
- Contact information
- Social media links
- Delivery & return policies
- FAQs
- Core values & certifications

## Next Steps (Phase 2)
- [ ] Backend API integration
- [ ] Real-time inventory management
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] Customer authentication
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Multi-language support

## License
Proprietary - Tasly Ghana 346

## Contact
- **Email**: info@taslyghana346.com
- **Phone**: +233 24 123 4567
- **WhatsApp**: +233 24 123 4567
