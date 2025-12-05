import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getSiteInfo } from '@/lib/storage'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [announcement, setAnnouncement] = useState('')
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  useEffect(() => {
    const siteInfo = getSiteInfo()
    if (siteInfo.announcement) {
      setAnnouncement(siteInfo.announcement)
    }
    setShowAnnouncement(siteInfo.showAnnouncement ?? true)
  }, [])

  if (!isVisible || !announcement || !showAnnouncement) return null

  return (
    <div className="bg-gradient-to-r from-primary to-green-600 text-white py-2 px-4 relative">
      <div className="container mx-auto text-center text-sm font-medium">
        {announcement}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
