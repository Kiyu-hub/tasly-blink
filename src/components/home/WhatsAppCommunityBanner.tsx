import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getSiteInfo } from '@/lib/storage'
import type { SiteInfo } from '@/types'

export default function WhatsAppCommunityBanner() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(getSiteInfo())

  useEffect(() => {
    const handleSiteInfoUpdate = () => {
      setSiteInfo(getSiteInfo())
    }
    
    window.addEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    
    return () => {
      window.removeEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    }
  }, [])

  if (!siteInfo.whatsappCommunityLink && !siteInfo.whatsapp) {
    return null
  }

  const handleJoinCommunity = () => {
    if (siteInfo.whatsappCommunityLink) {
      window.open(siteInfo.whatsappCommunityLink, '_blank')
    } else if (siteInfo.whatsapp) {
      const message = encodeURIComponent(`Hello! I'm visiting from the ${siteInfo.name} website and I would like to join the Tasly Ghana community to learn more about your products and their benefits.`)
      window.open(`https://wa.me/${siteInfo.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank')
    }
  }

  return (
    <section className="py-6 md:py-20 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-green-950/10">
      <div className="container mx-auto px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="border-2 border-green-500/30 shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center">
                {/* Icon Section */}
                <div className="w-full md:w-1/3 bg-gradient-to-br from-green-500 to-emerald-600 p-8 md:p-12 flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 md:p-10">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Join Our WhatsApp Community
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground mb-4">
                    Connect with thousands of health enthusiasts and get:
                  </p>
                  <ul className="space-y-2 mb-6 text-sm md:text-base text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Exclusive product discounts and early access
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Daily health tips and wellness advice
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Direct support from our health experts
                    </li>
                  </ul>
                  <button
                    onClick={handleJoinCommunity}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Join Community Now
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
