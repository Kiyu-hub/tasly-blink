import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Brain & Nervous System',
    slug: 'brain-nervous-system',
    description: 'Support cognitive function and mental clarity',
    image: 'https://images.unsplash.com/photo-1559757175-7cb036e0e67a?w=400&h=400&fit=crop',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    name: 'Immune Support',
    slug: 'immune-support',
    description: 'Boost your natural defenses',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=400&fit=crop',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Heart & Cardiovascular',
    slug: 'heart-cardiovascular',
    description: 'Maintain a healthy heart',
    image: 'https://images.unsplash.com/photo-1628348070889-0c7fab2529d0?w=400&h=400&fit=crop',
    color: 'from-rose-500 to-red-600',
  },
  {
    name: 'Digestive Health',
    slug: 'digestive-health',
    description: 'Support gut health and digestion',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=400&fit=crop',
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Energy & Vitality',
    slug: 'energy-vitality',
    description: 'Natural energy boosters',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    name: 'Beauty & Skincare',
    slug: 'beauty-skincare',
    description: 'Natural beauty from within',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
    color: 'from-pink-500 to-rose-600',
  },
]

export default function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of premium health supplements, carefully
            curated for your wellness journey
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/products?category=${category.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
                    <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                    <p className="text-xs opacity-90 hidden md:block">
                      {category.description}
                    </p>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
