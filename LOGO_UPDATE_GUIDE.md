# Logo Update Guide

## Current Logo Issue
The current logo has a white background which doesn't blend well with dark themes:
- URL: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5bpjWLc7v0MJ8EVqLPSOweMBQmvVU94YYw&s`

## Current Solution (Temporary)
We've applied CSS blend modes to make the logo work better:
```css
mix-blend-multiply (light mode)
mix-blend-screen (dark mode)
background: transparent
```

## Recommended Solutions

### Option 1: Find Official Tasly Logo (BEST)
1. Contact Tasly headquarters for official brand assets
2. Request PNG logo with transparent background
3. Upload to a reliable image hosting service:
   - Cloudinary
   - ImgBB
   - AWS S3
   - Imgur

### Option 2: Remove Background Using Tools
Use these free tools to remove the white background:

**Online Tools:**
1. **Remove.bg** (https://remove.bg)
   - Upload current logo
   - Download PNG with transparent background
   - Free for small images

2. **Canva**
   - Upload logo
   - Use Background Remover tool
   - Download as PNG

3. **Photopea** (https://photopea.com)
   - Free online Photoshop alternative
   - Use Magic Wand tool to select white
   - Delete background
   - Export as PNG

**Desktop Software:**
- GIMP (free)
- Photoshop
- Affinity Photo

### Option 3: Create Custom Logo
Design a new Tasly Ghana 346 logo with:
- Transparent background
- Brand colors (green/gold)
- "Tasly Ghana 346" text
- Health-related iconography

## Updating the Logo

Once you have a transparent logo URL, update these files:

### 1. Header Component
File: `/src/components/layout/Header.tsx`
```tsx
<img 
  src="YOUR_NEW_LOGO_URL_HERE" 
  alt="Tasly Ghana 346" 
  className="h-12 w-12 object-contain"
/>
```

### 2. Footer Component
File: `/src/components/layout/Footer.tsx`
```tsx
<img 
  src="YOUR_NEW_LOGO_URL_HERE" 
  alt="Tasly Ghana 346" 
  className="h-10 w-10 object-contain"
/>
```

### 3. Mobile Menu
File: `/src/components/layout/MobileMenu.tsx`
- Currently uses a circular "T" badge
- Can be updated to use the logo image

### 4. Admin Panel Logo
If there's a logo in the admin panel, update it there as well.

## Logo Specifications

**Recommended Dimensions:**
- Square format: 512x512px or 1024x1024px
- Rectangular: 1200x400px (for header)
- File format: PNG with transparent background
- File size: Under 100KB

**Brand Guidelines:**
- Maintain Tasly brand identity
- Use official colors
- Ensure readability at small sizes
- Test on both light and dark backgrounds

## Testing the New Logo

After updating:
1. Test on light theme
2. Test on dark theme
3. Check responsiveness on mobile
4. Verify all pages (Home, Products, About, Contact, etc.)
5. Check header, footer, and mobile menu

## Temporary Workaround (Current Implementation)

The current CSS approach works but is not ideal:

**Pros:**
- Works without changing the image
- Automatically adapts to theme

**Cons:**
- May affect logo colors
- Not perfect on all backgrounds
- Better to have a proper transparent PNG

## Image Hosting Services

Once you have the transparent logo, upload to:

**Free Options:**
1. **ImgBB**: https://imgbb.com
2. **Cloudinary**: Free tier available
3. **GitHub**: Store in repository
4. **Imgur**: Free image hosting

**Best Option for Production:**
Store the logo in the repository:
```
/public/images/logo.png
```
Then reference it as:
```tsx
<img src="/images/logo.png" alt="Tasly Ghana 346" />
```

## Next Steps

1. ✅ Current CSS workaround is applied
2. ⏳ Obtain official Tasly logo with transparent background
3. ⏳ Upload to image hosting or repository
4. ⏳ Update all logo references in the code
5. ⏳ Test across all pages and themes
6. ⏳ Commit changes to GitHub

## Contact for Logo Assets

To obtain official Tasly branding:
- Contact Tasly headquarters
- Request brand guidelines
- Get high-resolution logo files
- Obtain permission for website use
