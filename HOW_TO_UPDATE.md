# How to Update Your Website

Your website reads data directly from GitHub. When you edit files here and commit, **all users see the changes** within 5 minutes.

## Quick Start: Update Products or Site Info

### Step 1: Navigate to Data Files
1. Go to: `src/data/` folder in this repository
2. You'll see two main files:
   - `products.json` - All your products
   - `siteInfo.json` - Site information (contact, about, etc.)

### Step 2: Edit the File
1. Click on the file you want to edit
2. Click the **pencil icon** (✏️) in the top right
3. Make your changes
4. Scroll to bottom

### Step 3: Save Changes
1. Add a commit message (e.g., "Updated product prices")
2. Click **"Commit changes"**
3. ✅ **Done!** Changes go live automatically

---

## Common Updates

### Add a New Product
1. Edit `src/data/products.json`
2. Copy an existing product block
3. Change the values:
   ```json
   {
     "id": "prod_new123",
     "name": "New Product Name",
     "slug": "new-product-name",
     "description": "Short description",
     "price": 300,
     "stock": 50,
     "imageURL": "https://your-image-url.com/image.jpg",
     "category": "Health Supplements"
   }
   ```
4. Commit changes

### Update Prices
1. Edit `src/data/products.json`
2. Find the product
3. Change the `"price"` value
4. Commit changes

### Update Stock Levels
1. Edit `src/data/products.json`
2. Find the product
3. Change the `"stock"` value
4. Commit changes

### Update Contact Information
1. Edit `src/data/siteInfo.json`
2. Find the section you want to update:
   - `"contactEmail"`: Your email
   - `"contactPhone"`: Your phone
   - `"whatsapp"`: WhatsApp number
   - `"address"`: Physical address
3. Commit changes

### Update "Our Story"
1. Edit `src/data/siteInfo.json`
2. Find the `"ourStory"` section
3. Update:
   - `"title"`: Section title
   - `"content"`: Your story (use `\n\n` for new paragraphs)
   - `"image"`: Story image URL
4. Commit changes

### Update Mission/Vision
1. Edit `src/data/siteInfo.json`
2. Find `"missionStatement"` and `"visionStatement"`
3. Update the text
4. Commit changes

---

## Important Notes

✅ **Changes are visible to ALL users** within 5 minutes  
✅ **No deployment needed** - just commit to GitHub  
✅ **Site caches data** for 5 minutes for performance  
✅ **Always test locally first** with `npm run dev`  
✅ **Keep backups** - download files before major changes  

## Need Help?

- **Testing locally**: Run `npm run dev` to see changes instantly
- **Syntax errors**: Use a JSON validator if the site breaks
- **Restore backup**: Use GitHub history to revert changes
- **Admin panel**: Visit `/admin-tasly-ghana-346` (password: `health2024`)

---

## How It Works

```
You edit → Commit to GitHub → Site fetches new data → All users see updates
  JSON files              ↓                   ↓
                   GitHub repo          Production site
                                     (5-minute cache)
```

The website automatically checks GitHub for new data. No build or deployment needed!
