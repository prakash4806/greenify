"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface EnvStatus {
  googleClientId: boolean
  googleClientSecret: boolean
  nextAuthSecret: boolean
  nextAuthUrl: boolean
  allValid: boolean
}

export function EnvValidator() {
  const [envStatus, setEnvStatus] = useState<EnvStatus>({
    googleClientId: false,
    googleClientSecret: false,
    nextAuthSecret: false,
    nextAuthUrl: false,
    allValid: false,
  })

  useEffect(() => {
    // In development, we can check some environment variables
    if (process.env.NODE_ENV === "development") {
      const status = {
        googleClientId: !!process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: !!process.env.NEXTAUTH_URL,
        allValid: false,
      }

      status.allValid = Object.values(status).every(Boolean)
      setEnvStatus(status)
    }
  }, [])

  // Don't show in production
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const getIcon = (isValid: boolean) => {
    if (isValid) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getAlertVariant = () => {
    if (envStatus.allValid) return "default"
    return "destructive"
  }

  return (
    <Alert className={`mb-4 ${envStatus.allValid ? "border-green-200 bg-green-50 dark:bg-green-950/30" : ""}`}>
      {envStatus.allValid ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      )}
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium">
            {envStatus.allValid ? "✅ All environment variables configured" : "⚠️ Environment Configuration"}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              {getIcon(envStatus.googleClientId)}
              <span>Google Client ID</span>
            </div>
            <div className="flex items-center space-x-2">
              {getIcon(envStatus.googleClientSecret)}
              <span>Google Client Secret</span>
            </div>
            <div className="flex items-center space-x-2">
              {getIcon(envStatus.nextAuthSecret)}
              <span>NextAuth Secret</span>
            </div>
            <div className="flex items-center space-x-2">
              {getIcon(envStatus.nextAuthUrl)}
              <span>NextAuth URL</span>
            </div>
          </div>
          {!envStatus.allValid && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Make sure all environment variables are set in your .env.local file
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
