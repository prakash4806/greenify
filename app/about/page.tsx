import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  ShieldCheck,
  Target,
  Camera,
  Brain,
  Cpu,
  Check,
  ArrowRight,
  Lightbulb,
  Sprout,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const coreValues = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously advancing AI and computer vision technology for better plant health insights.",
    },
    {
      icon: ShieldCheck,
      title: "Accuracy",
      description: "Delivering reliable and precise disease detection with 95%+ accuracy rates.",
    },
    {
      icon: Sprout,
      title: "Sustainability",
      description: "Promoting sustainable agriculture and reducing crop loss through early detection.",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making advanced plant diagnostics available to farmers and gardeners worldwide.",
    },
  ]

  const highlights = [
    { title: "AI-Powered Detection", description: "Computer vision and deep learning for accurate disease identification" },
    { title: "Instant Analysis", description: "Get results in seconds with real-time plant health assessment" },
    { title: "Disease Insights", description: "Comprehensive information on diseases, symptoms, and causes" },
    { title: "Treatment Recommendations", description: "Expert-verified treatment plans and prevention strategies" },
  ]

  const technologies = [
    { name: "Computer Vision", description: "Advanced image analysis for plant pathology" },
    { name: "Machine Learning", description: "Deep learning models trained on thousands of images" },
    { name: "YOLO Detection", description: "Real-time object detection for accurate identification" },
    { name: "Next.js", description: "Modern React framework for fast web experiences" },
    { name: "React", description: "Interactive and responsive UI components" },
    { name: "Python", description: "Robust backend for AI model inference" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="min-h-[50vh] flex items-center justify-center pt-20 pb-10 lg:py-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/10 dark:to-[#2C6455]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-300/20 to-[#2C6455]/20 dark:from-teal-400/10 dark:to-emerald-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-[90vw] mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                About Greenify
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Empowering gardeners, farmers, and plant enthusiasts with AI-powered disease detection and treatment solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg lg:text-xl font-bold">
                    <Target className="mr-2 h-5 w-5 text-[#2C6455] dark:text-emerald-400" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-gray-600 dark:text-gray-305 text-xs md:text-sm leading-relaxed">
                    To make advanced plant disease diagnosis accessible to everyone through cutting-edge AI technology,
                    empowering gardeners and farmers to maintain healthier plants and improve crop yields worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg lg:text-xl font-bold">
                    <Leaf className="mr-2 h-5 w-5 text-[#2C6455] dark:text-emerald-400" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-gray-600 dark:text-gray-305 text-xs md:text-sm leading-relaxed">
                    A world where plant diseases are detected early and treated effectively through intelligent
                    technology, reducing crop loss and promoting sustainable agriculture for a healthier planet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Why We Built Greenify */}
      <div className="w-full max-w-[90vw] mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
            Why We Built Greenify
          </h2>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl p-6 lg:p-8 border border-white/40 dark:border-gray-700/40 shadow-lg">
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Plant diseases are one of the biggest challenges facing agriculture today. Farmers and gardeners often
              struggle to identify diseases early, leading to significant crop losses and reduced yields. Traditional
              methods require expertise, time, and resources that aren't always accessible.
            </p>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We realized that artificial intelligence could solve this problem. By combining computer vision and deep
              learning with agricultural expertise, we created Greenify—a tool that anyone can use to instantly diagnose
              plant diseases from a simple photo.
            </p>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Our mission is to democratize plant health diagnostics, making expert-level disease detection available to
              everyone, everywhere. With Greenify, early detection leads to better treatment, healthier crops, and
              sustainable agriculture.
            </p>
          </div>
        </div>
      </div>

      {/* How Greenify Works */}
      <div className="w-full max-w-[90vw] mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
            How Greenify Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: "Upload Plant Image",
                description: "Take a photo of your plant's leaf or affected area using any device.",
              },
              {
                icon: Brain,
                title: "AI Disease Analysis",
                description: "Our advanced AI analyzes the image and identifies potential diseases within seconds.",
              },
              {
                icon: Check,
                title: "Receive Diagnosis",
                description: "Get detailed diagnosis, treatment options, and prevention strategies instantly.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <CardHeader className="p-5 pb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-lg flex items-center justify-center mb-3">
                      <step.icon className="h-5 w-5 text-[#2C6455] dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-base md:text-lg text-gray-900 dark:text-white font-bold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/3 -right-3.5 items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-[#2C6455]/40 dark:text-emerald-400/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="w-full max-w-[90vw] mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((value, index) => (
              <Card
                key={index}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                <CardHeader className="p-4 pb-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-lg flex items-center justify-center mb-3">
                    <value.icon className="h-4.5 w-4.5 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-650 dark:text-gray-305 text-[11px] md:text-xs leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Highlights */}
      <div className="w-full max-w-[90vw] mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
            Platform Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {highlights.map((highlight, index) => (
              <Card
                key={index}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Check className="h-5 w-5 text-[#2C6455] dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-gray-900 dark:text-white">{highlight.title}</CardTitle>
                      <p className="text-xs md:text-sm text-gray-550 dark:text-gray-300 mt-1 leading-relaxed">{highlight.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Behind Greenify */}
      <div className="w-full max-w-[90vw] mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
            Technology Behind Greenify
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {technologies.map((tech, index) => (
              <Card
                key={index}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardHeader className="p-5 pb-3.5">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-lg flex items-center justify-center mb-3">
                    <Cpu className="h-5 w-5 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-base font-bold text-gray-900 dark:text-white">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-[90vw] mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#2C6455]/10 to-emerald-400/10 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-2xl p-8 lg:p-10 border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Ready to Diagnose Your Plants?
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto leading-relaxed">
              Experience the power of AI-driven plant disease detection. Get accurate diagnoses and expert
              recommendations in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/disease-detection">
                <Button className="bg-gradient-to-r from-[#2C6455] to-emerald-600 hover:from-emerald-600 hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500 text-white h-10 px-5 rounded-lg font-semibold transition-all duration-300 text-sm shadow-md">
                  Try Disease Detection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button
                  variant="outline"
                  className="border border-[#2C6455] dark:border-emerald-400 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/5 dark:hover:bg-emerald-400/10 h-10 px-5 rounded-lg font-semibold transition-all duration-300 text-sm bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
