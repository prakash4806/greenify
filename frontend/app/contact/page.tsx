import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, HelpCircle, Lightbulb, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { JsonLd, getContactSchema, getBreadcrumbSchema } from "@/lib/seo-utils"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Contact Us | Greenify",
  description:
    "Get in touch with Greenify for support, feedback, general inquiries, or crop model suggestions.",
  alternatives: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  const faqs = [
    {
      question: "How does Greenify detect plant diseases?",
      answer:
        "Greenify uses artificial intelligence and computer vision models to analyze uploaded plant images and identify potential diseases based on visible symptoms.",
    },
    {
      question: "Are the diagnosis results always accurate?",
      answer:
        "Our AI system is designed to provide reliable predictions; however, results should be considered informational and should not replace professional agricultural consultation.",
    },
    {
      question: "What image quality works best?",
      answer:
        "For the most accurate results, upload clear, well-lit images where the affected plant area is visible and in focus.",
    },
    {
      question: "Can I use Greenify on mobile devices?",
      answer: "Yes. Greenify is designed to work across desktops, tablets, and mobile devices.",
    },
    {
      question: "Do you store uploaded images?",
      answer:
        "Image handling practices are described in our Privacy Policy. Please review the policy for detailed information about data usage and storage.",
    },
  ]

  const contactSchema = getContactSchema()
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      <JsonLd data={contactSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="w-full max-w-[90vw] mx-auto px-4 pt-16 -mb-12">
        <Breadcrumb items={[{ name: "Contact", href: "/contact" }]} />
      </div>
      {/* Header Section */}
      <div className="w-full max-w-[90vw] mx-auto px-4 pt-20 pb-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4">
            Whether you have questions about plant disease detection, need technical assistance, want to share feedback,
            or have suggestions for improving Greenify, we&apos;re here to help.
          </p>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Our team is committed to making plant health diagnostics more accessible and effective through artificial
            intelligence.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[90vw] mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Get in Touch Section */}
          <div className="mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-5 text-center">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                      <MessageSquare className="h-5 w-5 text-[#2C6455] dark:text-emerald-400" />
                      Send us a Message
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Fill out the form below and we&apos;ll do our best to respond as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs text-gray-900 dark:text-white">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="h-9 text-sm bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs text-gray-900 dark:text-white">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="h-9 text-sm bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs text-gray-900 dark:text-white">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        placeholder="What is this about?"
                        className="h-9 text-sm bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs text-gray-900 dark:text-white">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your question, issue, or feedback..."
                        rows={5}
                        className="text-sm bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    <Button className="w-full h-9 text-xs bg-gradient-to-r from-[#2C6455] to-emerald-600 hover:from-emerald-600 hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 text-white font-medium rounded-lg transition-all duration-300">
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">General Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                      For questions about Greenify, platform features, partnerships, or feedback.
                    </p>
                    <a
                      href="mailto:your-email@example.com"
                      className="text-xs text-[#2C6455] dark:text-emerald-400 hover:underline font-medium"
                    >
                      your-email@example.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">Technical Support</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                      Experiencing issues with disease detection, image uploads, or platform functionality?
                    </p>
                    <a
                      href="mailto:support@example.com"
                      className="text-xs text-[#2C6455] dark:text-emerald-400 hover:underline font-medium"
                    >
                      support@example.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#2C6455]/10 to-emerald-400/10 dark:from-emerald-400/20 dark:to-[#2C6455]/20 border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-xl">
                  <CardHeader className="p-4 pb-1">
                    <CardTitle className="text-gray-900 dark:text-white text-xs font-bold">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      We aim to respond to all inquiries within <span className="font-semibold">24–48 business hours</span>.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-5 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex items-start gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <HelpCircle className="h-4.5 w-4.5 text-[#2C6455] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-gradient-to-r from-[#2C6455]/10 to-emerald-400/10 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-2xl p-6 md:p-8 border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-xl shadow-lg mb-10">
            <div className="flex gap-4 md:gap-5">
              <Lightbulb className="h-10 w-10 text-[#2C6455] dark:text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">Feedback & Suggestions</h3>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                  We are continuously improving Greenify and welcome feedback from our users. If you have ideas for new
                  features, improvements, supported plant species, or disease coverage, we&apos;d love to hear from you.
                  Your feedback helps us build a better platform for the plant health community.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-slate-100/50 via-emerald-100/30 to-teal-100/40 dark:from-slate-800/40 dark:via-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-8 lg:p-10 border border-emerald-200/50 dark:border-emerald-700/40 backdrop-blur-xl shadow-lg text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Let&apos;s Build Smarter Plant Care Together
            </h2>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-6 max-w-xl mx-auto leading-relaxed">
              Greenify combines artificial intelligence with plant health expertise to help users make informed decisions
              and protect their plants. Thank you for being part of our journey toward smarter, more accessible plant
              disease detection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/disease-detection">
                <Button className="h-9 text-xs bg-gradient-to-r from-[#2C6455] to-emerald-600 hover:from-emerald-600 hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500 text-white px-6 rounded-lg font-medium transition-all duration-300">
                  Try Disease Detection
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="h-9 text-xs bg-white/70 dark:bg-gray-800/70 border border-[#2C6455] dark:border-emerald-400 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/20 px-6 rounded-lg font-medium transition-all duration-300">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
