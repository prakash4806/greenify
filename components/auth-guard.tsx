"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#2C6455] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!session) {
    return null // Will redirect to auth
  }

  return <>{children}</>
}
