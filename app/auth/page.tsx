"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Zap, 
  HeartPulse, 
  History, 
  ShieldCheck 
} from "lucide-react"
import { GreenifyLogo } from "@/components/greenify-logo"
import Link from "next/link"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Check for authentication errors
    const errorParam = searchParams.get("error")
    if (errorParam) {
      if (errorParam === "Configuration") {
        setError("Authentication service configuration error. Check your environment variables.")
      } else if (errorParam === "AccessDenied") {
        setError("Access denied. Please check your Google account permissions.")
      } else {
        setError(`Authentication failed: ${errorParam}`)
      }
    }

    // Check for callback status or success redirect
    const callbackUrl = searchParams.get("callbackUrl")
    if (callbackUrl) {
      setSuccess("Please sign in to continue to your dashboard")
    }

    // Check if user is already authenticated
    getSession().then((session) => {
      if (session) {
        const redirectUrl = callbackUrl || "/dashboard"
        router.push(redirectUrl)
      }
    })
  }, [searchParams, router])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

      // Try the sign-in
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "Configuration") {
          setError("Authentication service configuration error. Please verify client credentials.")
        } else if (result.error === "AccessDenied") {
          setError("Access denied. Please try again or use another account.")
        } else {
          setError(`Google sign-in failed: ${result.error}`)
        }
      } else if (result?.ok) {
        setSuccess("Sign-in successful! Redirecting you...")
        setTimeout(() => {
          router.push(callbackUrl)
        }, 800)
      } else if (result?.url) {
        setSuccess("Redirecting to Google...")
        window.location.href = result.url
      } else {
        setSuccess("Redirecting to Google...")
        window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
      }
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError("An unexpected network error occurred. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      title: "AI Disease Detection",
      description: "Advanced computer vision models to diagnose crop foliage instantly.",
      icon: Sparkles,
    },
    {
      title: "Instant Analysis",
      description: "Get detailed health reports and confidence metrics in under 3 seconds.",
      icon: Zap,
    },
    {
      title: "Treatment Recommendations",
      description: "Curated organic and chemical care guides tailored to specific diseases.",
      icon: HeartPulse,
    },
    {
      title: "Diagnosis History",
      description: "Securely archive and track past scans to monitor recovery timelines.",
      icon: History,
    },
    {
      title: "Secure Cloud Access",
      description: "Sync your plant inventory and dashboard metrics across all devices safely.",
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#fafbfa] dark:bg-[#0b0f19] transition-colors duration-500 overflow-hidden pt-20 pb-12">
      {/* Soft emerald/teal background radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[90vw] lg:max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Product Introduction */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left animate-fade-in pr-0 lg:pr-8">
            <div className="flex items-center space-x-3">
              <GreenifyLogo className="w-12 h-12" />
              <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-800 to-teal-700 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                Greenify
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-gray-900 dark:text-white">
                Welcome to Greenify
              </h1>
              <p className="text-lg md:text-xl font-semibold text-[#2C6455] dark:text-emerald-400/90 leading-relaxed">
                AI-powered plant disease detection and plant health monitoring platform.
              </p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                Detect plant diseases in seconds using advanced computer vision and machine learning. 
                Save diagnosis history, receive treatment recommendations, and keep your plants healthy.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              {features.map((feature) => (
                <div 
                  key={feature.title} 
                  className="flex items-start space-x-3 p-4 rounded-2xl border border-white/40 dark:border-gray-800/30 bg-white/40 dark:bg-[#111827]/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-[#111827]/60 hover:scale-[1.02] hover:border-emerald-500/20 dark:hover:border-emerald-400/10 transition-all duration-300 cursor-default group shadow-sm"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-800 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-[#2C6455] dark:group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-slate-900 transition-all duration-300 shadow-sm">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Centered Auth Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <Card className="w-full max-w-md bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-white/60 dark:border-gray-800/50 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col justify-center">
              <CardHeader className="p-0 pb-6 text-center lg:text-left">
                <CardTitle className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Continue Your Journey
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Sign in to access disease detection, save diagnosis history, and manage your plant health insights.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0 space-y-6">
                {/* Custom Success Alert */}
                {success && (
                  <Alert className="border-green-200 bg-green-50/50 dark:border-emerald-850 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 p-3 rounded-xl flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <AlertDescription className="text-xs font-semibold leading-relaxed">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Custom Error Alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50/50 dark:border-red-950/50 dark:bg-red-950/20 text-red-800 dark:text-red-400 p-3 rounded-xl flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-xs font-semibold leading-relaxed">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Google Sign In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-6 text-sm font-bold tracking-wide transition-all duration-300 rounded-xl bg-white dark:bg-[#1f2937] hover:bg-gray-50 dark:hover:bg-[#374151] text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-md hover:shadow-lg focus:ring-4 focus:ring-emerald-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-3 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  <span>
                    {isLoading ? "Connecting to Google..." : "Continue with Google"}
                  </span>
                </Button>

                {/* Footer terms agreement */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-[#2C6455] dark:text-emerald-400 hover:underline transition-colors"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-[#2C6455] dark:text-emerald-400 hover:underline transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
