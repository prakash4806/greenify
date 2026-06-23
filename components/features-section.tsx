import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Brain, Clock, Shield, Users, Award } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms trained on thousands of plant images for accurate diagnosis.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Take photos directly with your phone and get instant results anywhere, anytime.",
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get disease diagnosis and treatment recommendations in seconds, not days.",
    },
    {
      icon: Shield,
      title: "Prevention Tips",
      description: "Learn how to prevent diseases before they affect your plants with expert guidance.",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with other gardeners and share experiences in our growing community.",
    },
    {
      icon: Award,
      title: "Expert Verified",
      description: "All treatments and recommendations are verified by plant pathology experts.",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Greenify for Plant Health?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our cutting-edge technology and expert knowledge combine to give you the most reliable plant disease
            detection and treatment solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-green-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-emerald-400/50 transition-colors bg-white dark:bg-gray-800"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
