"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react"

interface AuthStatusData {
  basicApi: boolean
  nextAuthConfig: boolean
  nextAuthProviders: boolean
  googleAuth: boolean
  environment: string
  errors: string[]
  warnings: string[]
  lastChecked: string
}

export function AuthStatus() {
  const [status, setStatus] = useState<AuthStatusData>({
    basicApi: false,
    nextAuthConfig: false,
    nextAuthProviders: false,
    googleAuth: false,
    environment: "unknown",
    errors: [],
    warnings: [],
    lastChecked: "",
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkAuthStatus = async () => {
    setIsChecking(true)
    const newStatus: AuthStatusData = {
      basicApi: false,
      nextAuthConfig: false,
      nextAuthProviders: false,
      googleAuth: false,
      environment: process.env.NODE_ENV || "unknown",
      errors: [],
      warnings: [],
      lastChecked: new Date().toISOString(),
    }

    try {
      // Test basic API
      const apiResponse = await fetch("/api/test")
      newStatus.basicApi = apiResponse.ok

      if (newStatus.basicApi) {
        // Test NextAuth configuration
        try {
          const authTestResponse = await fetch("/api/auth/test")
          if (authTestResponse.ok) {
            const authData = await authTestResponse.json()
            newStatus.nextAuthConfig = authData.success

            if (authData.success) {
              // Test providers endpoint
              const providersResponse = await fetch("/api/auth/providers")
              newStatus.nextAuthProviders = providersResponse.ok

              if (providersResponse.ok) {
                const providers = await providersResponse.json()
                newStatus.googleAuth = !!providers.google
              }
            }
          }
        } catch (authError) {
          newStatus.errors.push(
            `NextAuth test failed: ${authError instanceof Error ? authError.message : "Unknown error"}`,
          )
        }
      } else {
        newStatus.errors.push("Basic API test failed")
      }
    } catch (error) {
      newStatus.errors.push(`API connectivity error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Add warnings based on status
    if (newStatus.basicApi && !newStatus.nextAuthConfig) {
      newStatus.warnings.push("NextAuth configuration issues detected")
    }
    if (newStatus.nextAuthConfig && !newStatus.nextAuthProviders) {
      newStatus.warnings.push("NextAuth providers endpoint unavailable")
    }
    if (newStatus.nextAuthProviders && !newStatus.googleAuth) {
      newStatus.warnings.push("Google authentication not properly configured")
    }

    setStatus(newStatus)
    setIsChecking(false)
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const getOverallStatus = () => {
    if (status.basicApi && status.nextAuthConfig && status.nextAuthProviders && status.googleAuth) {
      return { level: "success", message: "All authentication services are working properly" }
    } else if (status.basicApi && (status.nextAuthConfig || status.googleAuth)) {
      return { level: "warning", message: "Core services working, some authentication features may be limited" }
    } else if (status.basicApi) {
      return { level: "warning", message: "Basic API working, authentication services need attention" }
    } else {
      return { level: "error", message: "Critical services are unavailable" }
    }
  }

  const overallStatus = getOverallStatus()

  const getStatusIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (level: string) => {
    switch (level) {
      case "success":
        return "border-green-200 bg-green-50 dark:bg-green-950/30"
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30"
      case "error":
        return "border-red-200 bg-red-50 dark:bg-red-950/30"
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-950/30"
    }
  }

  const getStatusTextColor = (level: string) => {
    switch (level) {
      case "success":
        return "text-green-700 dark:text-green-300"
      case "warning":
        return "text-yellow-700 dark:text-yellow-300"
      case "error":
        return "text-red-700 dark:text-red-300"
      default:
        return "text-gray-700 dark:text-gray-300"
    }
  }

  return (
    <Alert className={`mb-6 ${getStatusColor(overallStatus.level)}`}>
      {getStatusIcon(overallStatus.level)}
      <AlertDescription className={getStatusTextColor(overallStatus.level)}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{overallStatus.message}</span>
            <Button onClick={checkAuthStatus} disabled={isChecking} variant="outline" size="sm" className="h-8">
              {isChecking ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            </Button>
          </div>

          {/* Detailed status */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              {status.basicApi ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <XCircle className="h-3 w-3 text-red-600" />
              )}
              <span>Basic API</span>
            </div>
            <div className="flex items-center space-x-2">
              {status.nextAuthConfig ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <XCircle className="h-3 w-3 text-red-600" />
              )}
              <span>NextAuth Config</span>
            </div>
            <div className="flex items-center space-x-2">
              {status.nextAuthProviders ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <XCircle className="h-3 w-3 text-red-600" />
              )}
              <span>Auth Providers</span>
            </div>
            <div className="flex items-center space-x-2">
              {status.googleAuth ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <XCircle className="h-3 w-3 text-red-600" />
              )}
              <span>Google Auth</span>
            </div>
          </div>

          {/* Errors */}
          {status.errors.length > 0 && (
            <div className="text-xs">
              <div className="font-medium mb-1">Errors:</div>
              <ul className="space-y-1">
                {status.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {status.warnings.length > 0 && (
            <div className="text-xs">
              <div className="font-medium mb-1">Warnings:</div>
              <ul className="space-y-1">
                {status.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs opacity-75">Last checked: {new Date(status.lastChecked).toLocaleTimeString()}</div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
