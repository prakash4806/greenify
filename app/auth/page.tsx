"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
  const supabase = createClient()

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const redirectUrl = callbackUrl || "/dashboard"
        router.push(redirectUrl)
      }
    })
  }, [searchParams, router, supabase])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

      // Try the sign-in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        },
      })

      if (signInError) {
        setError(`Google sign-in failed: ${signInError.message}`)
      } else {
        setSuccess("Redirecting to Google...")
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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#fafbfa] dark:bg-[#0b0f19] transition-colors duration-500 overflow-hidden py-8 lg:py-12">
      {/* Soft emerald/teal background radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/8 dark:bg-emerald-500/4 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-teal-500/8 dark:bg-teal-500/4 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[90vw] lg:max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column: Product Introduction */}
          <div className="lg:col-span-7 flex flex-col space-y-4 text-left animate-fade-in pr-0 lg:pr-6">
            <div className="flex items-center space-x-2">
              <GreenifyLogo className="w-8 h-8" />
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-800 to-teal-700 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                Greenify
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
                Welcome to Greenify
              </h1>
              <p className="text-xs md:text-sm font-semibold text-[#2C6455] dark:text-emerald-400/90 leading-relaxed">
                AI-powered plant disease detection and plant health monitoring platform.
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                Detect plant diseases in seconds using advanced computer vision and machine learning. 
                Save diagnosis history, receive treatment recommendations, and keep your plants healthy.
              </p>
            </div>

            {/* Feature Highlights - Compact List format to optimize vertical space */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800/40">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="flex items-center space-x-2.5 hover:translate-x-1 transition-transform duration-200">
                    <div className="flex-shrink-0 w-5 h-5 rounded-md bg-emerald-100/60 dark:bg-emerald-950/40 flex items-center justify-center text-[#2C6455] dark:text-emerald-400 shadow-sm">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[11px] md:text-xs text-gray-600 dark:text-gray-405 leading-none">
                      <strong className="text-gray-900 dark:text-white font-bold">{feature.title}</strong>
                      <span className="text-gray-500 dark:text-gray-400"> — {feature.description}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Centered Auth Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <Card className="w-full max-w-[340px] bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-white/60 dark:border-gray-800/50 shadow-lg rounded-xl p-4 md:p-5 flex flex-col justify-center">
              <CardHeader className="p-0 pb-3.5 text-center lg:text-left">
                <CardTitle className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Continue Your Journey
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sign in to access disease detection, save diagnosis history, and manage your plant health insights.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0 space-y-3.5">
                {/* Custom Success Alert */}
                {success && (
                  <Alert className="border-green-250 bg-green-55/50 dark:border-emerald-850 dark:bg-emerald-950/20 text-emerald-805 dark:text-emerald-400 p-2 rounded-lg flex items-start space-x-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <AlertDescription className="text-[10px] font-semibold leading-normal">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Custom Error Alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-250 bg-red-55/50 dark:border-red-950/50 dark:bg-red-950/20 text-red-805 dark:text-red-400 p-2 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-[10px] font-semibold leading-normal">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Google Sign In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-10 text-xs font-bold tracking-wide transition-all duration-300 rounded-lg bg-white dark:bg-[#1f2937] hover:bg-gray-50 dark:hover:bg-[#374151] text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow focus:ring-4 focus:ring-emerald-500/10 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
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
                <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 leading-relaxed max-w-[260px] mx-auto">
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
