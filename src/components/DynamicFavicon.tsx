import { useEffect } from 'react'
import { getSiteInfo } from '@/lib/storage'

export default function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = () => {
      const siteInfo = getSiteInfo()
      const faviconUrl = siteInfo?.favicon || siteInfo?.logo || '/vite.svg'
      
      // Update favicon
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = faviconUrl
      
      // Also update apple-touch-icon if it exists
      let appleTouchIcon = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link')
        appleTouchIcon.rel = 'apple-touch-icon'
        document.head.appendChild(appleTouchIcon)
      }
      appleTouchIcon.href = faviconUrl
    }
    
    updateFavicon()
    
    // Listen for site info updates from admin panel
    const handleSiteInfoUpdate = () => {
      updateFavicon()
    }
    
    window.addEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    
    return () => {
      window.removeEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    }
  }, [])
  
  return null
}
