# Tasly Ghana 346 - E-Commerce Platform v2.0

## Overview
Tasly Ghana 346 is a premium e-commerce platform for authentic Tasly herbal and food supplement products. This React + TypeScript application combines traditional Chinese medicine wisdom with modern web technology to deliver an exceptional shopping experience.

## Phase 1: Data Seeding ✅ COMPLETED

### Products Database
**Source**: Authentic Tasly Ghana product lineup
**Location**: `/src/data/products.json`

#### Product Catalog (15 Premium Products):
1. **Tasly Cordyceps Capsule** - Immunity & Energy support
2. **Tasly Danshen Plus** - Cardiovascular health 
3. **Tasly Propolis Syrup** - Natural immune booster
4. **Tasly Ginseng Royal Jelly** - Energy & vitality
5. **Tasly Gynostemma Tea** - Metabolism & wellness tea
6. **Tasly Micardis** - Microcirculation support
7. **Tasly Ganoderma Capsule** - Reishi mushroom immunity
8. **Tasly Digest Natural** - Digestive health
9. **Tasly Antilipemic Tea** - Cholesterol support
10. **Tasly IceBerry Pearl Powder** - Beauty & anti-aging
11. **Tasly Epimedium Capsule** - Vitality support
12. **Tasly Chitosan Capsule** - Weight management
13. **Tasly Calcium Tablets** - Bone health
14. **Tasly Grape Seed Extract** - Powerful antioxidants
15. **Tasly Deep Sea Fish Oil** - Omega-3 heart & brain health

### Site Information
**Source**: Tasly Ghana 346 business data
**Location**: `/src/data/siteInfo.json`

#### Key Information:
- **Business Name**: Tasly Ghana 346
- **Contact Email**: info@taslyghana346.com
- **Contact Phone**: +233 24 123 4567
- **WhatsApp**: 233241234567
- **Currency**: GH₵ (Ghana Cedis)
- **Delivery Fee**: GH₵30 (flat rate)
- **Delivery Areas**: All regions of Ghana
- **Certifications**: FDA Ghana Approved, ISO 9001, GMP Certified

### Categories
- Heart Health
- Immunity & Energy
- Herbal Tea
- Digestive Health
- Beauty & Wellness
- Men's Health
- Women's Health
- Weight Management
- Bone Health
- Antioxidants

## Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite 7.2.6** - Lightning-fast build tool
- **TailwindCSS 3.4.17** - Utility-first styling
- **React Router DOM** - Client-side routing

### State Management
- **Zustand** - Lightweight state management
- **LocalStorage** - Data persistence
- **TanStack React Query** - Server state management

### UI Components
- **Radix UI** - Accessible primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### Features
- ✅ Product catalog with 15 authentic Tasly products
- ✅ Shopping cart with WhatsApp checkout
- ✅ Wishlist functionality
- ✅ Advanced product search
- ✅ Product filtering by category
- ✅ Admin panel for product management
- ✅ Dark/Light theme support
- ✅ Fully responsive design
- ✅ LocalStorage data persistence
- ✅ SEO-friendly structure

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Server runs at: `http://localhost:5174`

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
src/
├── components/
│   ├── home/          # Home page sections
│   ├── layout/        # Layout components
│   ├── product/       # Product components
│   └── ui/            # Reusable UI components
├── data/
│   ├── products.json  # Product database
│   └── siteInfo.json  # Site configuration
├── lib/
│   ├── storage.ts     # LocalStorage management
│   └── utils.ts       # Utility functions
├── pages/             # Route pages
├── store/             # Zustand stores
└── types/             # TypeScript types
```

## Data Management

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
- Shipping & return policies
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
