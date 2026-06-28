"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error)
  }, [error])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#fafbfa] dark:bg-[#0b0f19] transition-colors duration-500 py-12">
      <div className="max-w-md w-full px-6 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100/50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-md">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Something went wrong!
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
            An unexpected error occurred while loading this page. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[280px] mx-auto">
          <Button
            size="sm"
            onClick={() => reset()}
            className="bg-[#2C6455] hover:bg-[#2C6455]/90 text-white rounded-lg text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
          <Link href="/">
            <Button size="sm" variant="outline" className="w-full text-xs font-bold border-gray-200 text-gray-700 rounded-lg">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
