import { Button } from "@/components/ui/button"
import { Camera, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-12 bg-gradient-to-r from-green-600 to-green-700 dark:from-emerald-600 dark:to-teal-600 transition-colors duration-300">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">Ready to Diagnose Your Plants with AI?</h2>
          <p className="text-sm md:text-base text-green-100 dark:text-emerald-100 mb-6 leading-relaxed">
            Join thousands of gardeners who trust Greenify for accurate plant disease detection and treatment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/disease-detection">
              <Button
                className="bg-white text-green-600 dark:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-200 h-10 px-6 font-semibold shadow-md"
              >
                <Camera className="mr-2 h-4 w-4" />
                Start Diagnosis
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 dark:hover:text-emerald-600 h-10 px-6 font-semibold"
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
