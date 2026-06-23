"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Leaf } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "login" || tab === "signup") {
      setActiveTab(tab)
    }

    // Check for authentication errors
    const error = searchParams.get("error")
    if (error) {
      setError(`Authentication failed: ${error}`)
    }

    // Check for success messages
    const callbackUrl = searchParams.get("callbackUrl")
    if (callbackUrl) {
      setSuccess("Please sign in to continue")
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

      console.log("🚀 Attempting Google sign-in with configured credentials...")

      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

      // Try the sign-in with better error handling
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      })

      console.log("📋 Sign-in result:", result)

      if (result?.error) {
        // Handle specific error types
        if (result.error === "Configuration") {
          setError("❌ Authentication service configuration error. Check your environment variables.")
        } else if (result.error === "AccessDenied") {
          setError("❌ Access denied. Please try again or contact support.")
        } else if (result.error === "Verification") {
          setError("❌ Email verification required. Please check your email.")
        } else if (result.error === "OAuthCallback") {
          setError("❌ OAuth callback error. Check your Google OAuth configuration.")
        } else {
          setError(`❌ Google sign-in failed: ${result.error}`)
        }
      } else if (result?.ok) {
        setSuccess("✅ Sign-in successful! Redirecting...")
        // Give user feedback before redirect
        setTimeout(() => {
          router.push(callbackUrl)
        }, 1000)
      } else if (result?.url) {
        // Redirect to the provided URL
        setSuccess("🔄 Redirecting to Google...")
        window.location.href = result.url
      } else {
        // Fallback: try direct redirect
        setSuccess("🔄 Redirecting to Google...")
        window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
      }
    } catch (error) {
      console.error("❌ Google sign-in error:", error)
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          setError("🌐 Network error. Please check your connection and try again.")
        } else if (error.message.includes("Configuration")) {
          setError("⚙️ Authentication service is not properly configured. Check your .env.local file.")
        } else {
          setError(`❌ Authentication error: ${error.message}`)
        }
      } else {
        setError("❌ An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("📧 Email/password authentication is not yet implemented. Please use Google Sign-In.")
  }

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("📧 Email/password registration is not yet implemented. Please use Google Sign-In.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 flex items-center justify-center py-12 px-4 pt-24 fade-in transition-colors duration-300">
      <div className="w-full max-w-[90vw] mx-auto">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <Leaf className="w-12 h-12 text-green-600 dark:text-emerald-400" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">Greenify</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">Your AI-powered plant health companion</p>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-[#2C6455] dark:data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-[#2C6455] dark:data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-[#2C6455] dark:text-emerald-400">Welcome Back</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Sign in to your account to continue diagnosing your plants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Sign In Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                    {isLoading ? "Signing in..." : "🚀 Continue with Google"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-gray-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/50 dark:bg-gray-700/50 border-[#2C6455]/20 dark:border-emerald-400/30 focus:border-[#2C6455] dark:focus:border-emerald-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="dark:text-gray-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white/50 dark:bg-gray-700/50 border-[#2C6455]/20 dark:border-emerald-400/30 focus:border-[#2C6455] dark:focus:border-emerald-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="remember" className="rounded" />
                        <Label htmlFor="remember" className="text-sm dark:text-gray-300">
                          Remember me
                        </Label>
                      </div>
                      <Link
                        href="#"
                        className="text-sm text-[#2C6455] dark:text-emerald-400 hover:text-[#1a3d35] dark:hover:text-emerald-300"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500"
                    >
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-[#2C6455] dark:text-emerald-400">Create Account</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Join Greenify to start diagnosing your plants with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Sign Up Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                    {isLoading ? "Signing up..." : "🚀 Continue with Google"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="dark:text-gray-300">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 bg-white/50 dark:bg-gray-700/50 border-[#2C6455]/20 dark:border-emerald-400/30 focus:border-[#2C6455] dark:focus:border-emerald-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="dark:text-gray-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/50 dark:bg-gray-700/50 border-[#2C6455]/20 dark:border-emerald-400/30 focus:border-[#2C6455] dark:focus:border-emerald-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="dark:text-gray-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10 bg-white/50 dark:bg-gray-700/50 border-[#2C6455]/20 dark:border-emerald-400/30 focus:border-[#2C6455] dark:focus:border-emerald-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="dark:text-gray-300">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10 bg-white/50 dark:bg-gray-700/50 border-[#2C6455]/20 dark:border-emerald-400/30 focus:border-[#2C6455] dark:focus:border-emerald-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="terms" className="rounded" required />
                      <Label htmlFor="terms" className="text-sm dark:text-gray-300">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-[#2C6455] dark:text-emerald-400 hover:text-[#1a3d35] dark:hover:text-emerald-300"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-[#2C6455] dark:text-emerald-400 hover:text-[#1a3d35] dark:hover:text-emerald-300"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500"
                    >
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
