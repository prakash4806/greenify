import { Button } from "@/components/ui/button"
import { Camera, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 dark:from-emerald-600 dark:to-teal-600 transition-colors duration-300">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Diagnose Your Plants with AI?</h2>
          <p className="text-xl text-green-100 dark:text-emerald-100 mb-8">
            Join thousands of gardeners who trust Greenify for accurate plant disease detection and treatment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/disease-detection">
              <Button
                size="lg"
                className="bg-white text-green-600 dark:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-200 px-8 py-4"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Diagnosis
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 dark:hover:text-emerald-600 px-8 py-4"
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
