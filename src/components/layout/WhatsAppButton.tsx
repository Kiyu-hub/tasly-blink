import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSiteInfo } from '@/lib/storage'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const siteInfo = getSiteInfo()

  const whatsappNumber = siteInfo.whatsapp?.replace(/[^0-9]/g, '') || '233599004548'

  const handleChat = (message: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setIsOpen(false)
  }

  const quickMessages = [
    'Hi! I want to know more about your products.',
    'I need help with my order.',
    'What products do you recommend for heart health?',
    'Do you deliver to my location?',
  ]

  return (
    <>
      {/* Quick Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-50 w-80 bg-background rounded-2xl shadow-xl border overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tasly Ghana 346</h3>
                    <p className="text-xs opacity-90">Usually replies instantly</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Hi there! 👋 How can we help you today?
              </p>
              <div className="space-y-2">
                {quickMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleChat(message)}
                    className="w-full text-left text-sm p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse Animation */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-green-500 animate-ping opacity-25" />
      )}
    </>
  )
}
