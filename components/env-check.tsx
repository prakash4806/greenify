"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<{
    googleClientId: boolean
    googleClientSecret: boolean
    nextAuthSecret: boolean
  }>({
    googleClientId: false,
    googleClientSecret: false,
    nextAuthSecret: false,
  })

  useEffect(() => {
    // Check environment variables (this will only work in development)
    if (process.env.NODE_ENV === "development") {
      setEnvStatus({
        googleClientId: !!process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      })
    }
  }, [])

  const allEnvVarsSet = Object.values(envStatus).every(Boolean)

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Alert className={`mb-4 ${allEnvVarsSet ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
      {allEnvVarsSet ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      )}
      <AlertDescription className={allEnvVarsSet ? "text-green-700" : "text-yellow-700"}>
        {allEnvVarsSet ? (
          "All environment variables are configured correctly."
        ) : (
          <div>
            <div className="font-medium mb-2">Missing environment variables:</div>
            <ul className="text-sm space-y-1">
              {!envStatus.googleClientId && <li>• GOOGLE_CLIENT_ID</li>}
              {!envStatus.googleClientSecret && <li>• GOOGLE_CLIENT_SECRET</li>}
              {!envStatus.nextAuthSecret && <li>• NEXTAUTH_SECRET</li>}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
