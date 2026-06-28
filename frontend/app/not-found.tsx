import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpCircle, Home, Camera, BookOpen } from "lucide-react"
import { JsonLd } from "@/lib/seo-utils"
import NotFoundSearch from "@/components/not-found-search"

export const metadata: Metadata = {
  title: "404 - Page Not Found | Greenify",
  description: "The page you are looking for does not exist on Greenify.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function NotFound() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "404 Page Not Found",
    "description": "The requested page was not found on Greenify.",
    "publisher": {
      "@type": "Organization",
      "name": "Greenify"
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#fafbfa] dark:bg-[#0b0f19] transition-colors duration-500 overflow-hidden py-12">
      <JsonLd data={schema} />
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/3 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-teal-500/5 dark:bg-teal-500/3 blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full px-6 relative z-10 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-emerald-100/50 dark:bg-emerald-950/20 text-[#2C6455] dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-md">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page you were looking for. Try searching for a plant disease below or return to the main routes.
          </p>
        </div>

        {/* Dynamic Search Box for Diseases */}
        <div className="py-2">
          <NotFoundSearch />
        </div>

        <div className="flex flex-col gap-2.5 pt-2 max-w-[280px] mx-auto">
          <Link href="/">
            <Button size="sm" className="w-full text-xs font-bold bg-[#2C6455] hover:bg-[#2C6455]/95 text-white rounded-lg">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Back to Homepage
            </Button>
          </Link>
          <Link href="/disease-detection">
            <Button size="sm" variant="outline" className="w-full text-xs font-bold border-[#2C6455]/30 text-[#2C6455] dark:text-emerald-400 rounded-lg">
              <Camera className="w-3.5 h-3.5 mr-1.5" />
              Diagnose Plant Leaf
            </Button>
          </Link>
          <Link href="/disease-info">
            <Button size="sm" variant="ghost" className="w-full text-xs font-semibold text-gray-500 hover:text-gray-800 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Browse Disease Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
