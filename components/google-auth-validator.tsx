"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Copy, Eye, EyeOff } from "lucide-react"

interface GoogleAuthStatus {
  hasClientId: boolean
  hasClientSecret: boolean
  hasNextAuthSecret: boolean
  hasNextAuthUrl: boolean
  clientIdValid: boolean
  environmentReady: boolean
  lastChecked: string
}

export function GoogleAuthValidator() {
  const [status, setStatus] = useState<GoogleAuthStatus>({
    hasClientId: false,
    hasClientSecret: false,
    hasNextAuthSecret: false,
    hasNextAuthUrl: false,
    clientIdValid: false,
    environmentReady: false,
    lastChecked: "",
  })
  const [showEnvVars, setShowEnvVars] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const expectedClientId = "<YOUR_GOOGLE_CLIENT_ID>"
  const expectedClientSecret = "<YOUR_GOOGLE_CLIENT_SECRET>"

  const checkEnvironment = async () => {
    setIsChecking(true)

    // In development, we can check some environment variables
    const newStatus: GoogleAuthStatus = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      clientIdValid: !!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com"),
      environmentReady: false,
      lastChecked: new Date().toISOString(),
    }

    newStatus.environmentReady =
      newStatus.hasClientId &&
      newStatus.hasClientSecret &&
      newStatus.hasNextAuthSecret &&
      newStatus.hasNextAuthUrl &&
      newStatus.clientIdValid

    setStatus(newStatus)
    setIsChecking(false)
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateNextAuthSecret = () => {
    // Generate a random 32-character string
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const envFileContent = `# Google OAuth Configuration
GOOGLE_CLIENT_ID=${expectedClientId}
GOOGLE_CLIENT_SECRET=${expectedClientSecret}

# NextAuth Configuration  
NEXTAUTH_SECRET=${generateNextAuthSecret()}
NEXTAUTH_URL=http://localhost:3000`

  const getOverallStatus = () => {
    if (status.environmentReady) {
      return { level: "success", message: "✅ Google OAuth is properly configured and ready!" }
    } else if (status.hasClientId && status.hasClientSecret) {
      return { level: "warning", message: "⚠️ Google credentials found, but configuration needs attention" }
    } else {
      return { level: "error", message: "❌ Google OAuth credentials are missing" }
    }
  }

  const overallStatus = getOverallStatus()

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

  const getIcon = (isValid: boolean) => {
    return isValid ? <CheckCircle className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-red-600" />
  }

  // Don't show in production
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Alert className={`mb-6 ${getStatusColor(overallStatus.level)}`}>
      <AlertDescription className={getStatusTextColor(overallStatus.level)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{overallStatus.message}</span>
            <div className="flex gap-2">
              <Button onClick={() => setShowEnvVars(!showEnvVars)} variant="outline" size="sm" className="h-8">
                {showEnvVars ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button onClick={checkEnvironment} disabled={isChecking} variant="outline" size="sm" className="h-8">
                {isChecking ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Environment Status Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              {getIcon(status.hasClientId)}
              <span>Google Client ID</span>
            </div>
            <div className="flex items-center space-x-2">
              {getIcon(status.hasClientSecret)}
              <span>Google Client Secret</span>
            </div>
            <div className="flex items-center space-x-2">
              {getIcon(status.hasNextAuthSecret)}
              <span>NextAuth Secret</span>
            </div>
            <div className="flex items-center space-x-2">
              {getIcon(status.hasNextAuthUrl)}
              <span>NextAuth URL</span>
            </div>
          </div>

          {/* Client ID Validation */}
          {status.hasClientId && !status.clientIdValid && (
            <div className="text-sm">
              <div className="font-medium text-orange-600 mb-1">⚠️ Client ID Mismatch</div>
              <div className="text-xs">
                Expected: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{expectedClientId}</code>
              </div>
            </div>
          )}

          {/* Environment Variables */}
          {showEnvVars && (
            <div className="space-y-3">
              <div className="font-medium text-sm">📋 Required .env.local file:</div>
              <div className="relative">
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">{envFileContent}</pre>
                <Button
                  onClick={() => copyToClipboard(envFileContent)}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                💡 Copy this content to your <code>.env.local</code> file and restart your development server
              </div>
            </div>
          )}

          {/* Instructions */}
          {!status.environmentReady && (
            <div className="text-sm space-y-2">
              <div className="font-medium">🚀 Setup Instructions:</div>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>
                  Create a <code>.env.local</code> file in your project root
                </li>
                <li>Copy the environment variables shown above</li>
                <li>
                  Restart your development server (<code>npm run dev</code>)
                </li>
                <li>Test Google authentication</li>
              </ol>
            </div>
          )}

          <div className="text-xs opacity-75">Last checked: {new Date(status.lastChecked).toLocaleTimeString()}</div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
