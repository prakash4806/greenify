import { Card, CardContent } from "@/components/ui/card"
import { Camera, Brain, CheckCircle } from "lucide-react"

export function OverviewSection() {
  return (
    <section className="py-14 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-[#2C6455]/10 to-emerald-100/50 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-full border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-sm mb-4">
            <span className="text-xs font-semibold text-[#2C6455] dark:text-emerald-300">How It Works</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">From Snap to Solution</h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Diagnosing plant diseases has never been this easy. Just three simple steps and your plant's recovery
            begins.
          </p>
        </div>

        {/* Three Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Step 1 */}
          <Card className="relative group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2C6455]/20 to-emerald-200/40 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-[#2C6455] dark:text-emerald-400" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-gradient-to-r from-[#2C6455] to-emerald-500 dark:from-emerald-400 dark:to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  1
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3">Snap a Photo</h3>
              <p className="text-xs md:text-sm text-gray-650 dark:text-gray-305 leading-relaxed">
                Simply take a clear picture of the affected plant leaf using your phone or camera. Our AI works with any
                device.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="relative group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-950/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-300/30 to-[#2C6455]/30 dark:from-emerald-400/30 dark:to-teal-400/30 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-[#2C6455] dark:text-emerald-400" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-gradient-to-r from-emerald-500 to-[#2C6455] dark:from-emerald-400 dark:to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  2
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3">
                Get Instant AI Diagnosis
              </h3>
              <p className="text-xs md:text-sm text-gray-655 dark:text-gray-305 leading-relaxed">
                Our advanced AI analyzes the image using machine learning trained on thousands of plant diseases with
                95% accuracy.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="relative group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-teal-50/30 dark:from-gray-800 dark:to-teal-950/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-300/30 to-[#2C6455]/40 dark:from-teal-400/30 dark:to-emerald-400/30 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-[#2C6455] dark:text-emerald-400" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-gradient-to-r from-teal-500 to-[#2C6455] dark:from-teal-400 dark:to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3">Follow Treatment</h3>
              <p className="text-xs md:text-sm text-gray-655 dark:text-gray-305 leading-relaxed">
                Receive detailed remedies, prevention tips, and actionable treatment plans from plant pathology experts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2C6455]/5 to-emerald-50 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-2xl border border-[#2C6455]/10 dark:border-emerald-400/20 backdrop-blur-sm">
            <span className="text-[#2C6455] dark:text-emerald-300 font-semibold text-xs">
              Ready to try it? It takes less than 30 seconds!
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
