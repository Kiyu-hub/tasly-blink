import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    id: 1,
    name: 'Akosua Mensah',
    role: 'Wellness Enthusiast',
    content:
      'Tasly products have transformed my health journey. The Brain Care Capsules have significantly improved my focus and mental clarity. I recommend them to everyone!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Kwame Asante',
    role: 'Business Professional',
    content:
      "As someone with a demanding schedule, the Immune Boost Syrup has been a game-changer. I haven't been sick in months, and I feel more energetic than ever.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Ama Osei',
    role: 'Fitness Trainer',
    content:
      'The Heart Health Formula is excellent. My cholesterol levels have improved, and my doctor is impressed with my progress. Quality products that really work!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Kofi Boateng',
    role: 'Teacher',
    content:
      "I've tried many supplements before, but Tasly's quality is unmatched. The customer service is also exceptional - they really care about their customers.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-4 md:py-12 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their
            health with Tasly products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-primary/20 mb-3 md:mb-4" />

                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 line-clamp-3 md:line-clamp-4">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-1 mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <div>
                    <p className="text-sm md:text-base font-semibold">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
