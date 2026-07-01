import { TestimonialCard, FeedbackItem } from "@/components/feedback/TestimonialCard"
import { Leaf } from "lucide-react"

interface TestimonialsSectionProps {
  reviews: FeedbackItem[]
}

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
            What Our Growers Say
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Real experiences shared by growers using Greenify to monitor crop health.
          </p>
        </div>

        {/* Testimonials Showcase */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 max-w-lg mx-auto bg-[#2C6455]/5 dark:bg-emerald-950/20 border border-dashed border-[#2C6455]/20 dark:border-emerald-800/40 rounded-2xl p-8 space-y-3 shadow-sm fade-in">
            <div className="inline-flex bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-full">
              <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-455" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              🌱 Be the first to share your Greenify experience.
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
              Your feedback helps other growers make informed decisions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
