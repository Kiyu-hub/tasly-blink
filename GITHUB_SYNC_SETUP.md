# GitHub Auto-Sync Setup Guide

## Overview

The Tasly Ghana admin panel now supports **automatic syncing** of your changes to the GitHub repository. When you save products, banners, or site settings in the admin panel, they are automatically committed to GitHub so all users see the updates.

## How It Works

1. **Admin makes changes** in the admin panel (`/admin-tasly-ghana-346`)
2. **Changes save to localStorage** (immediate, local only)
3. **Changes auto-commit to GitHub** (if token configured)
4. **Users see updates** within 5 minutes (due to caching)

## Setup Instructions

### Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens/new)
2. Click **"Generate new token (classic)"**
3. **Token settings**:
   - Name: `Tasly Ghana Admin Panel`
   - Expiration: Choose `No expiration` or set a long duration
   - **Required scope**: Check ☑️ `repo` (Full control of private repositories)
4. Click **"Generate token"** at the bottom
5. **IMPORTANT**: Copy the token immediately (format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - You won't be able to see it again!
   - Store it securely

### Step 2: Configure the Token

Open your browser's developer console:
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: Enable Developer menu in Preferences, then press `Cmd+Option+C`

In the **Console** tab, paste this command (replace with your actual token):

```javascript
localStorage.setItem('github_token', 'ghp_your_actual_token_here');
console.log('GitHub token saved!');
```

Press Enter. You should see "GitHub token saved!" appear.

### Step 3: Verify It's Working

1. Go to the admin panel: `https://tasly-blink.netlify.app/admin-tasly-ghana-346`
2. Make a small change (e.g., update a product price)
3. Click **Save**
4. Check your GitHub repository: [https://github.com/Kiyu-hub/tasly-blink/commits/main](https://github.com/Kiyu-hub/tasly-blink/commits/main)
5. You should see a new commit with the message: `"Update products via admin panel (timestamp)"`

## What Gets Synced

| Admin Action | GitHub File Updated | Commit Message |
|-------------|-------------------|----------------|
| Save Products | `src/data/products.json` | `Update products via admin panel` |
| Save Site Settings | `src/data/siteInfo.json` | `Update site info via admin panel` |

**Note**: Banners, Categories, and Ads currently save to localStorage only. GitHub sync support can be added if needed.

## Troubleshooting

### Changes not appearing in GitHub?

1. **Check token is saved**:
   ```javascript
   console.log(localStorage.getItem('github_token'));
   ```
   Should show your token. If null, re-run Step 2.

2. **Check browser console for errors**:
   - Press F12 → Console tab
   - Look for errors starting with "Failed to sync" or "GitHub"
   - Common issues:
     - **Invalid token**: Generate a new one with `repo` scope
     - **Token expired**: Create a new token with longer expiration
     - **Rate limit**: GitHub API has rate limits; wait a few minutes

3. **Verify token permissions**:
   - Token must have `repo` scope checked
   - Token must have push access to `Kiyu-hub/tasly-blink` repository
   - If you're not the repo owner, you need to be added as a collaborator

### Changes save locally but not to GitHub?

This is **normal behavior** when:
- GitHub token is not configured
- Token is invalid or expired
- You're offline

The site will still work normally, changes are saved to localStorage. Just configure the token to enable GitHub sync.

### How to update/rotate the token?

If your token expires or is compromised:

1. [Revoke the old token](https://github.com/settings/tokens)
2. Generate a new token (follow Step 1)
3. Update it in the console (follow Step 2)

## Security Best Practices

⚠️ **IMPORTANT**: Your GitHub token is stored in **browser localStorage**, which means:

- ✅ It's only accessible on your browser on your computer
- ✅ It's not visible to site visitors
- ⚠️ If someone gains access to your browser/computer, they could access it
- ⚠️ Clearing browser data will delete the token

**Recommendations**:
1. Only configure the token on your **secure, personal computer**
2. Don't configure it on public/shared computers
3. Use a token with **only repo scope** (not admin or other permissions)
4. Set an expiration date and rotate tokens periodically
5. If compromised, immediately [revoke the token on GitHub](https://github.com/settings/tokens)

## Alternative: Manual GitHub Updates

If you prefer not to use automatic syncing:

1. **Don't configure a GitHub token** - changes will save locally only
2. **Manually edit files on GitHub** when you want to update the live site:
   - Go to `src/data/products.json` or `src/data/siteInfo.json`
   - Click the pencil icon to edit
   - Make your changes
   - Commit directly to `main` branch
   - Users see updates within 5 minutes

See [HOW_TO_UPDATE.md](./HOW_TO_UPDATE.md) for detailed manual update instructions.

## Advanced: Programmatic Configuration

If you want to build a UI for token configuration (instead of using console), you can use:

```javascript
// Set token
import { setGitHubToken } from '@/lib/githubSync'
setGitHubToken('ghp_your_token_here')

// Check if sync is enabled
import { isGitHubSyncEnabled } from '@/lib/githubSync'
if (isGitHubSyncEnabled()) {
  console.log('GitHub sync is enabled')
}

// Test connection
import { testGitHubConnection } from '@/lib/githubSync'
const result = await testGitHubConnection()
if (result.success) {
  console.log('Connected to GitHub!')
} else {
  console.error('Connection failed:', result.message)
}
```

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your token has the correct permissions
3. Ensure you're a collaborator on the repository
4. Contact the repository owner if you need help

---

**Last Updated**: 2024
**Repository**: [Kiyu-hub/tasly-blink](https://github.com/Kiyu-hub/tasly-blink)
