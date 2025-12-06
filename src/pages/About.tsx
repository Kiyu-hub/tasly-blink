import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Award, Heart, Leaf, Globe, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getSiteInfo } from '@/lib/storage'
import type { SiteInfo } from '@/types'

const iconMap: Record<string, any> = {
  Leaf,
  Award,
  Heart,
  Globe,
  Target,
  Users,
}

const defaultValues = [
  {
    icon: 'Leaf',
    title: 'Natural Ingredients',
    description:
      'We source the finest natural ingredients to create products that work in harmony with your body.',
  },
  {
    icon: 'Award',
    title: 'Quality Assured',
    description:
      'Every product undergoes rigorous testing to ensure the highest standards of quality and safety.',
  },
  {
    icon: 'Heart',
    title: 'Customer First',
    description:
      'Your health and satisfaction are our top priorities. We\'re here to support your wellness journey.',
  },
  {
    icon: 'Globe',
    title: 'Global Standards',
    description:
      'We adhere to international quality standards while bringing the best of traditional medicine to Ghana.',
  },
]

const defaultStats = [
  { number: '10+', label: 'Years Experience' },
  { number: '50K+', label: 'Happy Customers' },
  { number: '100+', label: 'Products' },
  { number: '24/7', label: 'Customer Support' },
]

export default function About() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)

  useEffect(() => {
    setSiteInfo(getSiteInfo())
    
    // Listen for site info updates from admin panel
    const handleSiteInfoUpdate = () => {
      setSiteInfo(getSiteInfo())
    }
    
    window.addEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    
    return () => {
      window.removeEventListener('siteInfoUpdated', handleSiteInfoUpdate)
    }
  }, [])

  const manager = siteInfo?.manager || {
    name: 'Dr. Kofi Mensah',
    role: 'General Manager',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    bio: 'Leading Tasly Ghana with years of experience in healthcare and business management.'
  }

  const values = (siteInfo?.coreValues || defaultValues).map(v => ({
    ...v,
    icon: iconMap[v.icon || 'Heart'] || Heart
  }))

  const stats = siteInfo?.stats || defaultStats

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Tasly Ghana
            </h1>
            <p className="text-lg text-muted-foreground">
              We are dedicated to bringing you premium health supplements that
              combine the wisdom of traditional Chinese medicine with modern
              scientific research, helping you achieve optimal wellness naturally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={siteInfo?.ourStory?.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop"}
                alt="Our Story"
                className="rounded-2xl shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">{siteInfo?.ourStory?.title || 'Our Story'}</h2>
              <div className="space-y-4 text-muted-foreground">
                {siteInfo?.ourStory?.content ? (
                  siteInfo.ourStory.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Tasly Ghana was founded with a simple mission: to make premium
                      health supplements accessible to everyone in Ghana and beyond.
                      We believe that everyone deserves access to products that can
                      truly make a difference in their health and quality of life.
                    </p>
                    <p>
                      Our journey began over a decade ago when our founders
                      discovered the incredible potential of combining traditional
                      Chinese medicine with modern scientific research. This unique
                      approach allows us to create products that are both effective
                      and gentle on the body.
                    </p>
                    <p>
                      Today, we serve thousands of satisfied customers across Ghana,
                      offering a wide range of supplements for brain health, immune
                      support, heart health, and more. Our commitment to quality and
                      customer satisfaction remains at the core of everything we do.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    {siteInfo?.missionStatement || 'To empower individuals to take control of their health through high-quality, natural supplements that promote overall wellness and vitality, while providing exceptional customer service and education about holistic health practices.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    {siteInfo?.visionStatement || 'To be the leading provider of premium health supplements in West Africa, recognized for our commitment to quality, innovation, and customer care. We envision a future where everyone has access to natural health solutions that enhance their quality of life.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Tasly Ghana
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary to-green-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">The Manager</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leading Tasly Ghana with dedication and expertise
            </p>
          </motion.div>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <img
                src={manager.image}
                alt={manager.name}
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover shadow-lg border-4 border-primary/20"
              />
              <h3 className="text-2xl font-bold mb-2">{manager.name}</h3>
              <p className="text-lg text-muted-foreground mb-4">{manager.role}</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {manager.bio || 'Leading Tasly Ghana with years of experience in healthcare and business management, committed to bringing the best health solutions to our customers.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
