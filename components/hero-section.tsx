import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Sparkles, ArrowRight, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[75vh] md:min-h-[80vh] bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 pt-14 pb-8 overflow-hidden transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/10 dark:to-[#2C6455]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-300/20 to-[#2C6455]/20 dark:from-teal-400/10 dark:to-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative container mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center min-h-[60vh]">
          {/* Left side - Content */}
          <div className="space-y-6 z-10">
            {/* Badge */}
            <div className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-[#2C6455]/10 to-emerald-100/50 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-full border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#2C6455] dark:text-emerald-400 mr-2" />
              <span className="text-xs font-semibold text-[#2C6455] dark:text-emerald-300">
                AI-Powered Plant Health Detection
              </span>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-gray-900 dark:text-white">Brown Leaves?</span>
                <br />
                <span className="bg-gradient-to-r from-[#2C6455] to-emerald-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Yellow Patches?
                </span>
                <br />
                <span className="text-gray-700 dark:text-gray-300">Wilting Overnight?</span>
              </h1>

              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                Stop playing the guessing game. Get to the{" "}
                <span className="font-semibold text-[#2C6455] dark:text-emerald-400">root of the problem</span> with
                Greenify's AI-powered plant health diagnosis.
              </p>
            </div>

            {/* Features list */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Camera, text: "Instant Diagnosis" },
                { icon: Zap, text: "95% Accuracy" },
                { icon: CheckCircle, text: "Expert Solutions" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-3.5 py-1.5 border border-white/40 dark:border-gray-700/40 shadow-sm"
                >
                  <feature.icon className="h-3.5 w-3.5 text-[#2C6455] dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/disease-detection">
                <Button
                  className="bg-gradient-to-r from-[#2C6455] to-emerald-600 hover:from-emerald-600 hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500 text-white h-10 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Camera className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Diagnose a Plant
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/disease-info">
                <Button
                  variant="outline"
                  className="border border-[#2C6455]/30 dark:border-emerald-400/50 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/5 dark:hover:bg-emerald-400/10 h-10 px-6 font-semibold backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Visual elements with plant image */}
          <div className="relative z-10">
            <div className="relative">
              {/* Main card with plant image */}
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-2xl overflow-hidden">
                <div className="space-y-4">
                  {/* Beautiful plant image */}
                  <div className="relative">
                    <div className="w-full h-48 rounded-xl overflow-hidden relative">
                      <Image
                        src="/images/plant-hero.png"
                        alt="Healthy green plant with lush leaves"
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Overlay gradient for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* AI scanning effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2C6455]/20 dark:via-emerald-400/20 to-transparent animate-pulse rounded-xl"></div>

                      {/* Scanning indicator */}
                      <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">AI Scanning</span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis result preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">Analysis Result</span>
                      <span className="text-[10px] bg-green-100 dark:bg-emerald-900/50 text-green-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        96% Confidence
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-[96%] bg-gradient-to-r from-[#2C6455] to-emerald-500 dark:from-emerald-400 dark:to-teal-400 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-green-600 dark:text-emerald-400">Healthy Plant</span>{" "}
                        detected
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating elements */}
              <div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6 text-[#2C6455] dark:text-emerald-400" />
              </div>

              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-lg backdrop-blur-sm border border-white/30 dark:border-gray-700/30 flex items-center justify-center animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="absolute top-1/2 -right-6 w-9 h-9 bg-gradient-to-br from-teal-300/30 to-[#2C6455]/30 dark:from-teal-400/30 dark:to-emerald-400/30 rounded-full backdrop-blur-sm border border-white/40 dark:border-gray-700/40 flex items-center justify-center animate-ping">
                <div className="w-2 h-2 bg-[#2C6455] dark:bg-emerald-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "50K+", label: "Plants Analyzed" },
            { number: "95%", label: "Accuracy Rate" },
            { number: "100+", label: "Plant Species" },
            { number: "24/7", label: "AI Available" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#2C6455] to-emerald-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
