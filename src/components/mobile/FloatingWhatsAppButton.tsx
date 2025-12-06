import { useState, useRef, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { motion, useMotionValue, type PanInfo } from 'framer-motion'
import { getSiteInfo } from '@/lib/storage'

export default function FloatingWhatsAppButton() {
  const siteInfo = getSiteInfo()
  const phoneNumber = siteInfo?.whatsapp || '233599004548' // Dynamic from admin panel
  const message = `Hello! I have a question about ${siteInfo?.name || 'your products'}.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  
  const [isMobile, setIsMobile] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  
  // Track position with motion values - resets on page refresh (no persistence)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Snap to nearest edge on mobile
    if (isMobile) {
      const screenWidth = window.innerWidth
      const centerX = info.point.x
      
      // Snap to left or right edge
      if (centerX < screenWidth / 2) {
        x.set(-screenWidth / 2 + 60) // Snap to left
      } else {
        x.set(screenWidth / 2 - 60) // Snap to right
      }
    }
  }

  // Desktop version (fixed position, non-draggable)
  if (!isMobile) {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg items-center justify-center transition-colors"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
      </motion.a>
    )
  }

  // Mobile version (draggable)
  return (
    <div ref={constraintsRef} className="md:hidden fixed inset-0 pointer-events-none z-40">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x, y }}
        className="pointer-events-auto absolute bottom-16 right-4 w-14 h-14 bg-green-500 active:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center touch-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
      </motion.a>
    </div>
  )
}
