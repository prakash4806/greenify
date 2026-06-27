"use client"

import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/components/session-provider"

export default function UnauthorizedPage() {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#fafbfa] dark:bg-[#0b0f19] transition-colors duration-500 overflow-hidden py-8">
      {/* Soft emerald radial background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-red-500/5 dark:bg-red-500/3 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/3 blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full px-6 relative z-10 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-150/30 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-md animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            403 - Access Denied
          </h1>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            You do not have administrative permissions to access this page.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Please log in with an administrator account or contact support if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-9 text-xs font-semibold px-5 border-[#2C6455]/30 text-[#2C6455] dark:text-emerald-400">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Home
            </Button>
          </Link>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="h-9 text-xs font-semibold px-5 border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Switch Account
          </Button>
        </div>
      </div>
    </div>
  )
}
