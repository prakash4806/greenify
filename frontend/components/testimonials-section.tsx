import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Home Gardener",
      content:
        "Greenify saved my tomato plants! The AI detected early blight before I even noticed the symptoms. The treatment worked perfectly.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Commercial Farmer",
      content:
        "As a farmer, early disease detection is crucial. Greenify helps me monitor my crops efficiently and prevent major losses.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Plant Enthusiast",
      content:
        "I love how easy it is to use. Just snap a photo and get instant results. It's like having a plant doctor in my pocket!",
      rating: 5,
    },
  ]

  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">What Our Users Say</h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Join thousands of satisfied gardeners and farmers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-green-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-605 dark:text-gray-300 mb-3 italic">"{testimonial.content}"</p>
                <div>
                  <div className="text-sm md:text-base font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
