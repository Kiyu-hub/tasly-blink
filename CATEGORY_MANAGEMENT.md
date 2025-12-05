# Category Management System Documentation

## Overview

The Tasly Ghana e-commerce platform now features a comprehensive, dynamic category management system. Categories are stored in localStorage and can be fully managed through the Admin panel.

## Features

### 🎯 Dynamic Category System
- **No More Hardcoded Categories**: All categories are now stored in localStorage and loaded dynamically
- **Auto-Generated from Products**: Categories are automatically created from products in your inventory
- **Product Count Tracking**: Each category shows how many products it contains
- **Visibility Control**: Hide/show categories on the frontend
- **Custom Ordering**: Drag categories up/down to control display order
- **Rich Metadata**: Each category includes name, description, image, and gradient color

### 📊 Category Properties

Each category has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Category display name |
| `slug` | string | URL-friendly version of name |
| `description` | string | Category description |
| `image` | string | Category image URL |
| `color` | string | Tailwind gradient class (e.g., "from-rose-500 to-red-600") |
| `order` | number | Display order position |
| `visible` | boolean | Show/hide on frontend |
| `productCount` | number | Number of products in category |

## Admin Panel Usage

### Accessing Category Management

1. Navigate to `/admin-tasly-ghana-346`
2. Login with password: `health2024`
3. Click the **Categories** tab

### Creating a New Category

1. Click **+ Add Category**
2. Fill in the form:
   - **Name** (required): Category name (e.g., "Heart Health")
   - **Description**: Brief description (auto-generated if blank)
   - **Image URL**: Category image (defaults to placeholder)
   - **Gradient Color**: Tailwind gradient class for overlay
   - **Visible**: Check to show on site
3. Click **Save Category**

### Editing a Category

1. Find the category in the list
2. Click the **pencil icon** (Edit)
3. Modify the fields
4. Click **Save Category**

### Deleting a Category

⚠️ **Important**: You can only delete categories that have **no products** assigned to them.

1. Find the category in the list
2. Click the **trash icon** (Delete)
3. If the category has products, you'll see an error message

To delete a category with products:
1. First reassign all products to a different category
2. Then delete the empty category

### Reordering Categories

Use the **↑** and **↓** buttons to move categories up or down in the display order.

### Hiding/Showing Categories

Click the **eye icon** to toggle category visibility on the frontend.

## Frontend Display

### Homepage Category Grid

- Shows **top 6 categories** by product count
- Only displays **visible** categories with **at least 1 product**
- Sorted by product count (descending)
- Each card shows:
  - Category image with gradient overlay
  - Category name
  - Product count
  - Hover animation

### Categories Page

- Located at `/categories`
- Shows **all visible categories** with products
- Sorted alphabetically
- Click any category to view its products

### Products Page Dropdown

- Category filter dropdown shows all visible categories
- Displays product count next to each category
- Filtering is now **exact match** (not slug-based)

## Technical Implementation

### Storage Functions

Located in `/src/lib/storage.ts`:

```typescript
// Get all categories with metadata
getCategoriesData(): CategoryData[]

// Save categories
saveCategoriesData(categories: CategoryData[]): void

// Add new category
addCategoryData(category): CategoryData

// Update category
updateCategoryData(id, updates): CategoryData | null

// Delete category (fails if has products)
deleteCategoryData(id): boolean

// Update product counts for all categories
updateCategoryProductCounts(): void
```

### Auto-Initialization

On first load, the system:
1. Scans all products to find unique categories
2. Creates `CategoryData` objects for each
3. Assigns default images and colors based on category name
4. Saves to localStorage under `tasly_categories` key

### Product Assignment

When creating/editing products in Admin:
- Category dropdown shows all **visible** categories
- Shows product count for each category
- After save, category counts update automatically

### Default Images & Colors

The system includes sensible defaults for common health categories:

**Default Images** (from Unsplash):
- Cardiovascular Health → Heart imagery
- Immune Support → Wellness imagery
- Digestive Health → Food/nutrition imagery
- etc.

**Default Colors** (Tailwind gradients):
- Cardiovascular Health → `from-rose-500 to-red-600`
- Immune Support → `from-emerald-500 to-green-600`
- Digestive Health → `from-amber-500 to-orange-600`
- etc.

## Data Flow

```
Admin Creates/Edits Product
         ↓
Product assigned to Category
         ↓
updateCategoryProductCounts() called
         ↓
Category productCount updated
         ↓
Frontend refreshes (CategorySection, Products, Categories pages)
         ↓
Only visible categories with products shown
```

## LocalStorage Schema

### Categories Key: `tasly_categories`

```json
[
  {
    "id": "cat-abc123",
    "name": "Cardiovascular Health",
    "slug": "cardiovascular-health",
    "description": "Explore our cardiovascular health collection",
    "image": "https://images.unsplash.com/photo-...",
    "color": "from-rose-500 to-red-600",
    "order": 0,
    "visible": true,
    "productCount": 5
  }
]
```

## Best Practices

### 1. Category Naming
- Use clear, descriptive names
- Be consistent (e.g., "Heart Health" vs "Cardiovascular Health")
- Avoid abbreviations

### 2. Category Images
- Use high-quality images (min 400x400px)
- Relevant to category content
- Unsplash is a good free source

### 3. Gradient Colors
- Use Tailwind gradient classes
- Format: `from-{color}-{shade} to-{color}-{shade}`
- Ensure good contrast with white text
- Examples:
  - `from-blue-500 to-indigo-600`
  - `from-rose-500 to-pink-600`
  - `from-emerald-500 to-teal-600`

### 4. Category Management Workflow
1. Create categories first
2. Then add products to categories
3. Reorder categories based on importance
4. Hide seasonal/temporary categories when not needed
5. Regularly review and clean up unused categories

## Troubleshooting

### Categories not showing on homepage
- Check if category is **visible** (not hidden)
- Verify category has **at least 1 product**
- Category grid shows max 6 categories

### Can't delete category
- Category has products assigned to it
- Reassign products to different category first

### Product counts incorrect
- Counts update automatically when products are saved/deleted
- If stuck, refresh the Admin page

### Dropdown shows old categories
- Refresh the Admin page
- Check localStorage in browser DevTools

## Migration Notes

### From Hardcoded to Dynamic

The system has been migrated from hardcoded category arrays to dynamic localStorage-based management:

**Old System:**
- Categories in `/src/data/categories.ts`
- Hardcoded in multiple components
- No admin management
- Static images/colors

**New System:**
- Categories in localStorage
- Fully managed in Admin panel
- Dynamic images/colors
- Auto-counts products
- Visibility controls

**Files Updated:**
- ✅ `/src/lib/storage.ts` - Added category storage functions
- ✅ `/src/types/index.ts` - Added `CategoryData` type
- ✅ `/src/pages/Admin.tsx` - Added Categories tab
- ✅ `/src/components/home/CategorySection.tsx` - Uses dynamic categories
- ✅ `/src/pages/Products.tsx` - Uses dynamic categories
- ✅ `/src/pages/Categories.tsx` - Uses dynamic categories

## Future Enhancements

Potential improvements for the category system:

- [ ] Category image upload (currently URL-based)
- [ ] Bulk category operations
- [ ] Category analytics (views, conversions)
- [ ] Subcategories/nested categories
- [ ] Category-specific SEO metadata
- [ ] Import/export categories
- [ ] Category templates

## Support

For questions or issues with the category management system, check:
1. This documentation
2. Browser console for errors
3. LocalStorage data in DevTools
4. Admin panel category list

---

**Last Updated**: December 2025  
**Version**: 2.0 - Dynamic Category System
