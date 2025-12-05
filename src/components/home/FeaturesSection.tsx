import { motion } from 'framer-motion'
import { Shield, Clock, Headphones, BadgeCheck } from 'lucide-react'

const features = [
  {
    icon: BadgeCheck,
    title: 'FDA Approved',
    description: 'All products are FDA Ghana approved',
  },
  {
    icon: Shield,
    title: 'Genuine Products',
    description: '100% authentic health supplements',
  },
  {
    icon: Clock,
    title: 'Fast Shipping',
    description: '2-3 days delivery in Accra',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer service',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
