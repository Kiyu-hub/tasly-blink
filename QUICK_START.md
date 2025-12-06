# 🚀 Quick Start Guide - Tasly Ghana 346 E-Commerce Platform

## Welcome!

This is a **complete frontend-only e-commerce platform** built with React, TypeScript, and localStorage. No backend required!

---

## ⚡ Quick Start (30 seconds)

### 1. Start Development Server
```bash
npm run dev
```

**Server**: http://localhost:5174

### 2. View Public Site
Open browser: `http://localhost:5174`

### 3. Access Admin Panel
- **URL**: `http://localhost:5174/admin-tasly-ghana-346`
- **Password**: `health2024`

---

## 🎯 Key Features Overview

### For Customers
- ✅ Browse 12 authentic Tasly health products
- ✅ Smart stock management (low stock alerts, out-of-stock handling)
- ✅ Shopping cart with WhatsApp checkout
- ✅ Pre-order via WhatsApp for out-of-stock items
- ✅ Wishlist functionality
- ✅ Product search & filtering
- ✅ Auto-scrolling health banner carousel
- ✅ Responsive design (mobile, tablet, desktop)

### For Admin (You!)
- ✅ **Password-protected** admin panel
- ✅ **Add/Edit/Delete** products
- ✅ **Stock management** (real-time inventory)
- ✅ **Complete site editor** (header, footer, all content)
- ✅ **Banner management** (hero carousel)
- ✅ **Social media links** editor
- ✅ **Contact information** editor
- ✅ **Policies editor** (delivery, returns)
- ✅ All changes save to localStorage instantly

---

## 📱 WhatsApp Integration

### Contact Number
**+233 59 900 4548** (233599004548)

### Two WhatsApp Flows

**1. Checkout (In Stock)**
- Customer adds items to cart
- Clicks "Proceed to Checkout"
- WhatsApp opens with order details

**2. Pre-Order (Out of Stock)**
- Product has 0 stock
- "PRE-ORDER via WhatsApp" button appears
- WhatsApp opens with pre-order message

---

## 🔐 Admin Panel Guide

### Step 1: Login
1. Go to: `http://localhost:5174/admin-tasly-ghana-346`
2. Enter password: `health2024`
3. Click "Access Dashboard"

### Step 2: Manage Products
**Add Product:**
1. Click "Products" tab
2. Click "Add Product" button
3. Fill in:
   - Name: Product name
   - Price: In Ghana Cedis (GH₵)
   - Description: Short description
   - Category: Select from dropdown
   - Stock: Number of units
   - Image URL: Product image link
4. Click "Save"
5. ✅ Product added with auto-generated ID and slug

**Edit Product:**
1. Click edit (pencil) icon
2. Modify fields
3. Click "Save"
4. ✅ Product updated

**Manage Stock:**
1. Edit product
2. Change "Stock" field:
   - `> 5`: Green "In Stock" badge
   - `1-5`: Orange "Low Stock" warning
   - `0`: Red "OUT OF STOCK" + pre-order button
3. Save changes

### Step 3: Edit Site Content
**Contact Information:**
1. Click "Settings" tab
2. Scroll to "Contact Information" card
3. Edit:
   - Email
   - Phone
   - WhatsApp number
   - Address
   - Business hours
4. Click "Save All Settings"

**Social Media:**
1. In Settings tab
2. Scroll to "Social Media Links" card
3. Edit Facebook, Instagram, Twitter, YouTube, TikTok
4. Save changes

**About Us Text:**
1. In Settings tab
2. Edit "About Us" textarea
3. Edit "Mission Statement"
4. Edit "Vision Statement"
5. Save changes

**Policies:**
1. In Settings tab
2. Edit "Delivery Information"
3. Edit "Return Policy"
4. Edit "Announcement Banner"
5. Save changes

### Step 4: Manage Banners
1. Click "Banners" tab
2. Click "Add Banner"
3. Fill in:
   - Title
   - Subtitle (optional)
   - Description (optional)
   - Image URL
   - Link (optional)
   - Button Text
   - Active: Yes/No
4. Save banner
5. Toggle active/inactive with eye icon
6. Edit with pencil icon
7. Delete with trash icon

---

## 🧪 Testing Checklist

### Quick Test (5 minutes)

**Admin:**
- [ ] Login to admin
- [ ] Add a test product
- [ ] Edit product stock to 0
- [ ] Edit site name in settings
- [ ] Add a banner
- [ ] Logout

**Public:**
- [ ] View homepage
- [ ] View product with stock > 0
- [ ] Click "Add to Cart"
- [ ] View cart
- [ ] Click "Proceed to Checkout" (WhatsApp should open)
- [ ] View product with stock = 0
- [ ] Click "PRE-ORDER via WhatsApp" (WhatsApp should open)

---

## 💾 Data Architecture

### localStorage = Database
All data stored in browser's localStorage:

**Keys:**
- `tasly_products` - Product catalog
- `tasly_site_info` - Site configuration
- `tasly_banners` - Banner carousel
- `tasly_reviews` - Product reviews
- `cart` - Shopping cart (Zustand)
- `wishlist` - Wishlist (Zustand)

**View Data:**
1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Click "localStorage" → localhost:5174
4. See all data keys

**Clear Data:**
```javascript
localStorage.clear()
// Then reload page - initial data will reload from JSON files
```

---

## 📂 Project Structure (Simplified)

```
tasly-blink/
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   └── HealthBannerCarousel.tsx  ← Auto-scrolling carousel
│   │   ├── layout/
│   │   └── ui/
│   ├── data/
│   │   ├── products.json     ← 12 Tasly products
│   │   └── siteInfo.json     ← Site config + contact info
│   ├── pages/
│   │   ├── Admin.tsx         ← Password-protected admin
│   │   ├── ProductDetail.tsx ← Stock management + pre-order
│   │   ├── Cart.tsx          ← WhatsApp checkout
│   │   └── Home.tsx
│   ├── lib/
│   │   └── storage.ts        ← localStorage functions
│   └── types/
│       └── index.ts          ← TypeScript interfaces
└── README.md
```

---

## 🎨 Stock Management Visual Guide

### Product Stock States

**High Stock (> 5 units)**
```
🟢 In Stock
   15 available
```

**Low Stock (1-5 units)**
```
🟠 Low Stock
   Only 3 left in stock!
```

**Out of Stock (0 units)**
```
🔴 OUT OF STOCK
   Pre-order available via WhatsApp
   
   [PRE-ORDER via WhatsApp] ← Orange/Red gradient button
```

---

## 🔧 Troubleshooting

### Admin won't login
- Check password: `health2024` (case sensitive)
- Clear sessionStorage and try again
- Check browser console for errors

### Products not showing
- Check localStorage: `tasly_products`
- Try: `localStorage.clear()` and reload
- Check browser console for errors

### WhatsApp not opening
- Verify WhatsApp number in siteInfo: `233599004548`
- Check if pop-up blocker is enabled
- Try different browser

### Changes not persisting
- Check if localStorage is enabled
- Check browser storage quota
- Try incognito mode to test

### Dev server won't start
```bash
# Kill existing process
killall node

# Restart
npm run dev
```

---

## 📊 Admin Dashboard Sections

### 1. Dashboard Overview
- **Stats Cards**: Orders, Revenue, Customers, Conversion
- **Quick Actions**: Links to Products, Banners, Settings

### 2. Products Tab
- **View**: All products in a list
- **Add**: Create new product
- **Edit**: Modify existing product
- **Delete**: Remove product
- **Stock**: Update inventory levels

### 3. Banners Tab
- **View**: All carousel banners
- **Add**: Create new banner
- **Edit**: Modify banner
- **Toggle**: Active/Inactive
- **Delete**: Remove banner

### 4. Settings Tab
**4 Card Sections:**
1. **Basic Information**
   - Site name, tagline, description
   - About us, mission, vision

2. **Contact Information**
   - Email, phone, WhatsApp
   - Address, business hours

3. **Social Media Links**
   - Facebook, Instagram, Twitter
   - YouTube, TikTok

4. **Policies & Settings**
   - Announcement banner
   - Currency, delivery fee
   - Delivery info, return policy

---

## 🎯 Common Tasks

### Add a New Product
```
1. Admin → Products → Add Product
2. Name: "Tasly Green Tea"
3. Price: 120
4. Category: "Herbal Tea"
5. Stock: 50
6. Image: [Paste URL]
7. Description: "Premium green tea..."
8. Save
```

### Set Product as Out of Stock
```
1. Admin → Products → Edit [Product]
2. Stock: 0
3. Save
4. Go to public site
5. View product → See "PRE-ORDER" button
```

### Change WhatsApp Number
```
1. Admin → Settings → Contact Information
2. WhatsApp Number: [New number with country code]
3. Save All Settings
4. Test checkout to verify new number
```

### Update Site Name
```
1. Admin → Settings → Basic Information
2. Site Name: "Your New Name"
3. Save All Settings
4. Header updates immediately
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

**Output**: `dist/` folder

### Deploy to Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify (Free)
1. Drag `dist/` folder to netlify.com
2. Done!

### Deploy to GitHub Pages
```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 📞 Support

### Questions?
- Check `README.md` for detailed docs
- Check `IMPLEMENTATION_SUMMARY.md` for technical details
- Check `TESTING_CHECKLIST.md` for testing guide

### Admin Access
- URL: `/admin-tasly-ghana-346`
- Password: `health2024`

### WhatsApp Number
- Display: +233 59 900 4548
- Internal: 233599004548

---

## ✨ You're All Set!

Your frontend-only e-commerce platform is ready to use. No backend, no database, just localStorage and WhatsApp.

**Next Steps:**
1. ✅ Test admin panel
2. ✅ Add your products
3. ✅ Customize site content
4. ✅ Test checkout flow
5. ✅ Deploy to production

**Have fun building your business! 🎉**

---

**Platform**: Tasly Ghana 346 E-Commerce
**Version**: v3.0
**Tech**: React + TypeScript + localStorage
**Status**: ✅ Production Ready
