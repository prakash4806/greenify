"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Leaf } from "lucide-react"

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Only show preloader on initial page load, not on navigation
    if (!hasLoaded) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        setHasLoaded(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasLoaded])

  // Don't show preloader on subsequent navigations
  useEffect(() => {
    if (hasLoaded) {
      setIsLoading(false)
    }
  }, [pathname, hasLoaded])

  if (!isLoading || hasLoaded) return null

  return (
    <div className="preloader">
      <div className="flex items-center justify-center mb-8">
        <Leaf className="w-16 h-16 text-green-600 animate-pulse" />
      </div>
      <div className="leaf-spinner mb-6"></div>
      <p className="text-green-700 text-lg font-medium text-center max-w-md px-4">
        Loading advanced plant disease detection and diagnosis tools...
      </p>
    </div>
  )
}
