# GitHub Auto-Sync Setup Guide

## Overview

The Tasly Ghana admin panel now supports **automatic GitHub synchronization**. When enabled, all changes you make in the admin dashboard (products, site info, banners, etc.) will be **automatically committed to your GitHub repository**. This ensures:

- ✅ Changes persist across all devices
- ✅ Automatic deployment to GitHub Pages
- ✅ Version control for all content changes
- ✅ No manual file editing required

---

## Quick Setup (5 Minutes)

### Step 1: Create a GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Set the following:
   - **Note**: `Tasly Admin Panel Auto-Sync`
   - **Expiration**: `No expiration` (or custom date)
   - **Scopes**: Check `repo` (Full control of private repositories)
3. Click **"Generate token"**
4. **COPY THE TOKEN** - You won't see it again!
   - Example: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

### Step 2: Configure in Admin Panel

1. Login to your admin panel: `/admin`
2. Password: `tasly2024`
3. Click on the **"Settings"** tab
4. Find the **"GitHub Auto-Sync"** section (top card)
5. Paste your token into the input field
6. Click **"Save Token"**
7. Click **"Test Connection"** to verify it works
8. ✅ You'll see a green success message if everything is configured correctly

---

## How It Works

### Automatic Sync Flow

```
Admin makes change → saveSiteInfo/saveProducts called
                   ↓
         localStorage updated (instant)
                   ↓
         Event dispatched (real-time UI update)
                   ↓
         GitHub API called (background)
                   ↓
         Changes committed to repository
                   ↓
         GitHub Pages rebuilds site
                   ↓
         Changes live on all devices!
```

### What Gets Synced

Currently syncing:
- ✅ **Site Information** (logo, name, contact info, etc.)
- ✅ **Products** (all product data)

Files updated in repository:
- `src/data/siteInfo.json`
- `src/data/products.json`

### Sync Timing

- **localStorage**: Instant (0ms)
- **UI Update**: Instant (via events)
- **GitHub Commit**: 2-5 seconds (background, non-blocking)
- **Site Rebuild**: 1-3 minutes (GitHub Pages automatic)

---

## Technical Details

### Files Modified

1. **`src/lib/githubSync.ts`**
   - Handles GitHub API communication
   - Manages token storage
   - Commits files to repository

2. **`src/lib/storage.ts`**
   - Calls `syncProductsToGitHub()` when products saved
   - Calls `syncSiteInfoToGitHub()` when site info saved

3. **`src/pages/Admin.tsx`**
   - GitHub token configuration UI
   - Connection testing
   - Token management

### Security

- ✅ Token stored in localStorage (browser-level encryption)
- ✅ Token never exposed in HTML/console logs
- ✅ All API calls use HTTPS
- ✅ Token only has `repo` scope (limited access)
- ❌ Token NOT stored in repository
- ❌ Token NOT committed to version control

### Error Handling

If GitHub sync fails:
1. **Changes still saved** to localStorage (no data loss)
2. **UI still updates** in real-time
3. **Warning logged** to console
4. **User notified** via toast message

Sync is **non-blocking** - admin panel remains responsive even if GitHub is slow.

---

## Troubleshooting

### "GitHub token not configured" Warning

**Solution**: Set your GitHub token in Settings → GitHub Auto-Sync

### "Failed to sync to GitHub" Error

**Possible causes**:
1. Token expired or invalid
   - **Fix**: Generate new token and save it
2. No internet connection
   - **Fix**: Check your network
3. GitHub API rate limit reached (5000 requests/hour)
   - **Fix**: Wait an hour or use authenticated requests
4. Token doesn't have `repo` permissions
   - **Fix**: Regenerate token with correct scopes

### Changes Not Appearing on Live Site

**Possible causes**:
1. GitHub Pages hasn't rebuilt yet
   - **Fix**: Wait 2-3 minutes, then refresh
2. Browser cache
   - **Fix**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Sync failed silently
   - **Fix**: Check browser console for errors

### Test Connection Fails

**Check**:
1. Token is correct (no extra spaces)
2. Token has `repo` scope
3. Repository name is correct: `Kiyu-hub/tasly-blink`
4. You have write access to the repository

---

## API Reference

### GitHub Sync Functions

```typescript
// Set GitHub token (saves to localStorage)
setGitHubToken(token: string): void

// Get stored token
getGitHubToken(): string | null

// Check if sync is enabled
isGitHubSyncEnabled(): boolean

// Sync products to repository
syncProductsToGitHub(products: Product[]): Promise<boolean>

// Sync site info to repository
syncSiteInfoToGitHub(siteInfo: SiteInfo): Promise<boolean>

// Test connection
testGitHubConnection(): Promise<{ success: boolean; message: string }>
```

### Usage Example

```typescript
import { setGitHubToken, syncSiteInfoToGitHub } from '@/lib/githubSync'

// Configure token (one time)
setGitHubToken('ghp_1234567890abcdefghijklmnopqrstuvwxyz')

// Sync is now automatic on every save!
saveSiteInfo(updatedSiteInfo) // ← Automatically syncs to GitHub
```

---

## Best Practices

### ✅ Do's

- Keep your token secure and private
- Test connection after setting token
- Monitor console for sync errors
- Wait 2-3 minutes after changes for deployment
- Regenerate token every 90 days for security

### ❌ Don'ts

- Share your token with anyone
- Commit token to repository
- Use token in public code/demos
- Make rapid changes (wait for rebuild between edits)
- Revoke token while sync is in progress

---

## FAQ

### Q: Do I need to configure GitHub sync?

**A**: No, it's optional. Without it:
- Changes still save to localStorage
- Changes persist on your current device
- BUT won't sync across devices or deploy automatically

### Q: What happens if I forget my token?

**A**: Generate a new one and save it in the admin panel. The old token will be invalidated.

### Q: Can multiple admins use the same token?

**A**: Yes, but it's better to give each admin their own token for audit trail purposes.

### Q: Will old commits show in repository history?

**A**: Yes! Every admin change creates a commit with timestamp. Great for tracking changes.

### Q: Can I disable sync temporarily?

**A**: Yes, click the trash icon next to the token to disable. Re-enable anytime by saving a new token.

### Q: Does this work with private repositories?

**A**: Yes! The `repo` scope gives access to both public and private repos.

---

## Commit Message Format

Auto-generated commits follow this format:

```
Update products.json via admin panel

Updated {count} products at {timestamp}
```

```
Update siteInfo.json via admin panel

Updated site information at {timestamp}
```

This makes it easy to track when and what changed.

---

## Advanced: Extending Sync

### Adding New Data Types

To sync additional data (e.g., banners, categories):

1. Create sync function in `src/lib/githubSync.ts`:

```typescript
export async function syncBannersToGitHub(banners: Banner[]): Promise<boolean> {
  return commitFile(
    'src/data/banners.json',
    JSON.stringify(banners, null, 2),
    `Update banners.json via admin panel\n\nUpdated ${banners.length} banners at ${new Date().toISOString()}`
  )
}
```

2. Call it in `src/lib/storage.ts`:

```typescript
export function saveBanners(banners: Banner[]): void {
  localStorage.setItem(BANNERS_KEY, JSON.stringify(banners))
  window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: banners }))
  
  syncBannersToGitHub(banners).catch(error => {
    console.error('Failed to sync banners to GitHub:', error)
  })
}
```

3. Done! Banners now auto-sync.

---

## Support

For issues or questions:

1. Check browser console for errors
2. Verify token has correct permissions
3. Test connection in admin panel
4. Check GitHub API status: https://www.githubstatus.com/

---

**Last Updated**: December 6, 2025  
**Version**: 2.0.0
