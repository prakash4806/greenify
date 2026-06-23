import { Card, CardContent } from "@/components/ui/card"
import { Camera, Brain, CheckCircle } from "lucide-react"

export function OverviewSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2C6455]/10 to-emerald-100/50 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-full border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-sm mb-6">
            <span className="text-sm font-medium text-[#2C6455] dark:text-emerald-300">How It Works</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">From Snap to Solution</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Diagnosing plant diseases has never been this easy. Just three simple steps and your plant's recovery
            begins.
          </p>
        </div>

        {/* Three Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <Card className="relative group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#2C6455]/20 to-emerald-200/40 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-10 h-10 text-[#2C6455] dark:text-emerald-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#2C6455] to-emerald-500 dark:from-emerald-400 dark:to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Snap a Photo</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Simply take a clear picture of the affected plant leaf using your phone or camera. Our AI works with any
                device.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="relative group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-950/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-300/30 to-[#2C6455]/30 dark:from-emerald-400/30 dark:to-teal-400/30 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-[#2C6455] dark:text-emerald-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-[#2C6455] dark:from-emerald-400 dark:to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Get Instant
                <br />
                AI Diagnosis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our advanced AI analyzes the image using machine learning trained on thousands of plant diseases with
                95% accuracy.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="relative group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-teal-50/30 dark:from-gray-800 dark:to-teal-950/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-300/30 to-[#2C6455]/40 dark:from-teal-400/30 dark:to-emerald-400/30 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-10 h-10 text-[#2C6455] dark:text-emerald-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-teal-500 to-[#2C6455] dark:from-teal-400 dark:to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Follow Treatment</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Receive detailed remedies, prevention tips, and actionable treatment plans from plant pathology experts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2C6455]/5 to-emerald-50 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-2xl border border-[#2C6455]/10 dark:border-emerald-400/20 backdrop-blur-sm">
            <span className="text-[#2C6455] dark:text-emerald-300 font-medium">
              Ready to try it? It takes less than 30 seconds!
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
