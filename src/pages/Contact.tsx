import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { getSiteInfo } from '@/lib/storage'
import type { SiteInfo } from '@/types'

export default function Contact() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const info = getSiteInfo()
    setSiteInfo(info)
    
    // Listen for site info updates from admin panel
    const handleSiteInfoUpdate = () => {
      setSiteInfo(getSiteInfo())
    }
    
    window.addEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    
    return () => {
      window.removeEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    }
  }, [])

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: [siteInfo?.address || 'Accra, Legon - Bawuleshi'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [siteInfo?.phone || '+233 59 900 4548', `WhatsApp: +${siteInfo?.whatsapp || '233 59 900 4548'}`],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [siteInfo?.email || 'info@taslyghana346.com'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: [siteInfo?.businessHours || 'Monday - Saturday: 9:00 AM - 6:00 PM'],
    },
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success('Message sent successfully! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setLoading(false)
  }

  const handleWhatsApp = () => {
    const message = `Hello! I'd like to get in touch with ${siteInfo?.name || 'Tasly Ghana 346'}.`
    const whatsappNumber = siteInfo?.whatsapp || '233599004548'
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-2 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our products or need assistance? We're here to
              help! Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-2 md:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold mb-3">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Community CTA */}
      {(siteInfo?.whatsappCommunityLink || siteInfo?.whatsapp) && (
        <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-green-500/20 shadow-xl bg-white dark:bg-gray-900">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Join Our WhatsApp Community
                      </h2>
                      <p className="text-muted-foreground text-lg mb-1">
                        Get instant access to product information, health tips, exclusive offers, and expert guidance.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Learn about Tasly products and their amazing health benefits from our community of wellness enthusiasts.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <a
                        href={siteInfo.whatsappCommunityLink || `https://wa.me/${siteInfo.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello! I'm visiting from the ${siteInfo.name} website and I would like to join the Tasly Ghana community to learn more about your products and their benefits.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
                      >
                        <MessageCircle className="h-6 w-6" />
                        Join Now
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Form & Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+233 20 000 0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 rounded-full"
                    disabled={loading}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 rounded-full"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Find Us</h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7296508347!2d-0.1780694!3d5.5607433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xd1e4c0c0c0c0c0c0!2sOsu%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tasly Ghana Location"
                />
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              Have Questions? Check Our FAQ
            </h2>
            <p className="text-muted-foreground mb-6">
              Find answers to commonly asked questions about our products,
              delivery, returns, and more.
            </p>
            <Button variant="outline" className="rounded-full">
              View FAQ
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
